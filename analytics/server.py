"""KIPRUN live analytics: serves the site, collects tracker events, feeds the dashboard.

    python analytics/server.py                 site       http://localhost:5180/
                                                dashboard  http://localhost:5180/dashboard
    python analytics/server.py --host 0.0.0.0  let other devices on the network in

Standard library only. Events land in analytics/events.db (SQLite); delete it to start over.
"""
import argparse
import json
import re
import sqlite3
import threading
import time
import urllib.parse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

HERE = Path(__file__).resolve().parent
SITE = HERE.parent
DB_PATH = HERE / 'events.db'
TYPES = {'view', 'click', 'rage', 'dead', 'open', 'preview', 'beat', 'leave'}
DEVICES = {'desktop', 'tablet', 'mobile'}
ID = re.compile(r'^[a-z0-9]{4,16}$')
LIVE_SECONDS = 20           # a session that beat within this window is "on the site now"
MAX_BODY = 64 * 1024

# ponytail: one connection behind a global lock; fine for a concept site, move to a real store if traffic grows
db = sqlite3.connect(DB_PATH, check_same_thread=False)
lock = threading.Lock()
db.executescript('''
CREATE TABLE IF NOT EXISTS ev(
  ts REAL, sid TEXT, vid TEXT, type TEXT, label TEXT, sec TEXT, ms INTEGER, depth INTEGER, device TEXT, ref TEXT);
CREATE INDEX IF NOT EXISTS ev_sid ON ev(sid);
CREATE INDEX IF NOT EXISTS ev_type ON ev(type);
''')


def text(v, n):
    return v[:n] if isinstance(v, str) else ''


def clamp(v, lo, hi):
    return max(lo, min(hi, int(v))) if isinstance(v, (int, float)) else 0


def ingest(payload):
    """Validate a tracker batch (untrusted input) and store it."""
    sid, vid = payload.get('sid'), payload.get('vid')
    events = payload.get('ev')
    if not (isinstance(sid, str) and ID.match(sid) and isinstance(vid, str) and ID.match(vid)):
        raise ValueError('bad ids')
    if not isinstance(events, list):
        raise ValueError('bad events')
    now = time.time()
    rows = []
    for e in events[:50]:
        if not isinstance(e, dict) or e.get('t') not in TYPES:
            continue
        device = e.get('device') if e.get('device') in DEVICES else ''
        rows.append((now, sid, vid, e['t'], text(e.get('label'), 120), text(e.get('sec'), 40),
                     clamp(e.get('ms'), 0, 10000), clamp(e.get('depth'), 0, 100), device, text(e.get('ref'), 120)))
    with lock:
        db.executemany('INSERT INTO ev VALUES (?,?,?,?,?,?,?,?,?,?)', rows)
        db.commit()


def stats():
    now = time.time()

    def q(sql, *args):
        with lock:
            return db.execute(sql, args).fetchall()

    sessions = q('''
      SELECT sid, vid, MIN(ts), MAX(ts), COALESCE(SUM(ms), 0),
             SUM(type = 'click'), SUM(type = 'open'), SUM(type = 'rage'), SUM(type = 'dead'),
             COALESCE(MAX(depth), 0), MAX(CASE WHEN type = 'view' THEN device END),
             (SELECT type FROM ev e2 WHERE e2.sid = ev.sid ORDER BY rowid DESC LIMIT 1)
      FROM ev GROUP BY sid ORDER BY MAX(ts) DESC''')
    session_list = [{
        'sid': s[0], 'vid': s[1], 'start': s[2], 'last': s[3], 'ms': s[4], 'clicks': s[5], 'opens': s[6],
        'rage': s[7], 'dead': s[8], 'depth': s[9], 'device': s[10] or '',
        'live': s[3] > now - LIVE_SECONDS and s[11] != 'leave',
    } for s in sessions]
    timed = [s['ms'] for s in session_list if s['ms'] > 0]

    def top(kind, n=10):
        return q('SELECT label, COUNT(*) c FROM ev WHERE type = ? GROUP BY label ORDER BY c DESC LIMIT ?', kind, n)

    def frustration(kind):
        return q('''SELECT label, sec, COUNT(*) c, MAX(ts) FROM ev WHERE type = ?
                    GROUP BY label, sec ORDER BY c DESC, MAX(ts) DESC LIMIT 12''', kind)

    counts = dict(q('SELECT type, COUNT(*) FROM ev GROUP BY type'))
    return {
        'now': now,
        'live': sum(s['live'] for s in session_list),
        'sessions': len(session_list),
        'visitors': q('SELECT COUNT(DISTINCT vid) FROM ev')[0][0],
        'avg_ms': sum(timed) / len(timed) if timed else 0,
        'clicks': counts.get('click', 0), 'opens': counts.get('open', 0),
        'rage': counts.get('rage', 0), 'dead': counts.get('dead', 0),
        'top_clicks': top('click'), 'top_opens': top('open'), 'top_previews': top('preview'),
        'sections': q('''SELECT sec, SUM(ms), COUNT(DISTINCT sid) FROM ev
                         WHERE type = 'beat' GROUP BY sec'''),
        'rage_list': frustration('rage'), 'dead_list': frustration('dead'),
        'session_list': session_list[:30],
        'feed': q('''SELECT ts, vid, type, label, sec FROM ev WHERE type != 'beat'
                     ORDER BY rowid DESC LIMIT 40'''),
    }


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(SITE), **kwargs)

    def log_message(self, *args):
        pass

    def send_json(self, obj):
        body = json.dumps(obj).encode()
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        if self.path.split('?')[0] != '/api/collect':
            return self.send_error(404)
        n = int(self.headers.get('Content-Length') or 0)
        if not 0 < n <= MAX_BODY:
            return self.send_error(413)
        try:
            ingest(json.loads(self.rfile.read(n)))
        except (ValueError, TypeError, AttributeError):
            return self.send_error(400)
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

    def do_GET(self):
        if self.path.split('?')[0] == '/api/stats':
            return self.send_json(stats())
        super().do_GET()

    def send_head(self):
        # GET and HEAD both come through here: keep the database, this script and dotfiles private
        path = urllib.parse.unquote(self.path.split('?')[0]).lower()
        if path in ('/dashboard', '/dashboard/'):
            self.path = '/analytics/dashboard.html'
        elif path.startswith('/analytics/') or any(p.startswith('.') for p in path.split('/')):
            self.send_error(404)
            return None
        return super().send_head()


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--host', default='127.0.0.1')
    ap.add_argument('--port', type=int, default=5180)
    a = ap.parse_args()
    print(f'KIPRUN site       http://localhost:{a.port}/')
    print(f'Live dashboard    http://localhost:{a.port}/dashboard')
    ThreadingHTTPServer((a.host, a.port), Handler).serve_forever()
