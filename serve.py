import functools
import http.server
import os
import re
import socketserver

DIR = os.path.dirname(os.path.abspath(__file__))
PORT = 8765


class RangeRequestHandler(http.server.SimpleHTTPRequestHandler):
    """SimpleHTTPRequestHandler with HTTP Range support so video seeking works."""

    def send_head(self):
        range_header = self.headers.get("Range")
        if range_header is None:
            return super().send_head()

        path = self.translate_path(self.path)
        if os.path.isdir(path):
            return super().send_head()
        try:
            f = open(path, "rb")
        except OSError:
            self.send_error(404, "File not found")
            return None

        fs = os.fstat(f.fileno())
        size = fs.st_size

        m = re.match(r"bytes=(\d*)-(\d*)", range_header.strip())
        if not m:
            f.close()
            self.send_error(400, "Invalid Range header")
            return None

        start_s, end_s = m.group(1), m.group(2)
        if start_s == "":
            # suffix range: last N bytes
            length = int(end_s)
            start = max(0, size - length)
            end = size - 1
        else:
            start = int(start_s)
            end = int(end_s) if end_s else size - 1
        end = min(end, size - 1)

        if start > end or start >= size:
            f.close()
            self.send_response(416)
            self.send_header("Content-Range", f"bytes */{size}")
            self.end_headers()
            return None

        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(path))
        self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        self.send_header("Content-Length", str(end - start + 1))
        self.end_headers()
        f.seek(start)
        self._range_remaining = end - start + 1
        return f

    def copyfile(self, source, outputfile):
        remaining = getattr(self, "_range_remaining", None)
        if remaining is None:
            return super().copyfile(source, outputfile)
        while remaining > 0:
            chunk = source.read(min(64 * 1024, remaining))
            if not chunk:
                break
            outputfile.write(chunk)
            remaining -= len(chunk)

    def end_headers(self):
        # advertise range support on all responses
        if not getattr(self, "_sent_accept_ranges", False):
            self.send_header("Accept-Ranges", "bytes")
            self._sent_accept_ranges = True
        super().end_headers()


Handler = functools.partial(RangeRequestHandler, directory=DIR)
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"serving {DIR} at http://localhost:{PORT}")
    httpd.serve_forever()
