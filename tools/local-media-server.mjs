// 狐妖小红娘·王权篇本地媒体服务器 v1.0.0
import http from 'node:http';
import path from 'node:path';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.HYXHN_MEDIA_PORT || 8123);
const mimeTypes = new Map([
  ['.mp3', 'audio/mpeg'],
  ['.ogg', 'audio/ogg'],
  ['.wav', 'audio/wav'],
  ['.webp', 'image/webp'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.json', 'application/json; charset=utf-8'],
]);

function send(response, status, body, headers = {}) {
  response.writeHead(status, {
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-cache',
    ...headers,
  });
  response.end(body);
}

const server = http.createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url || '/', `http://${request.headers.host || '127.0.0.1'}`);
    const decodedPath = decodeURIComponent(requestUrl.pathname).replace(/^\/+/, '');
    const filePath = path.resolve(projectRoot, decodedPath || '.');
    const insideProject = filePath === projectRoot || filePath.startsWith(`${projectRoot}${path.sep}`);
    if (!insideProject) {
      send(response, 403, 'Forbidden');
      return;
    }

    const info = await stat(filePath);
    if (!info.isFile()) {
      send(response, 404, 'Not Found');
      return;
    }

    const contentType = mimeTypes.get(path.extname(filePath).toLowerCase()) || 'application/octet-stream';
    const range = request.headers.range?.match(/^bytes=(\d*)-(\d*)$/);
    if (range) {
      const start = range[1] ? Number(range[1]) : 0;
      const end = range[2] ? Math.min(Number(range[2]), info.size - 1) : info.size - 1;
      if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || start > end || start >= info.size) {
        send(response, 416, 'Range Not Satisfiable', { 'Content-Range': `bytes */${info.size}` });
        return;
      }
      response.writeHead(206, {
        'Access-Control-Allow-Origin': '*',
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'no-cache',
        'Content-Length': end - start + 1,
        'Content-Range': `bytes ${start}-${end}/${info.size}`,
        'Content-Type': contentType,
      });
      if (request.method === 'HEAD') response.end();
      else createReadStream(filePath, { start, end }).pipe(response);
      return;
    }

    response.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'no-cache',
      'Content-Length': info.size,
      'Content-Type': contentType,
    });
    if (request.method === 'HEAD') response.end();
    else createReadStream(filePath).pipe(response);
  } catch (error) {
    const status = error?.code === 'ENOENT' ? 404 : 500;
    send(response, status, status === 404 ? 'Not Found' : 'Internal Server Error');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`[王权篇媒体] 正在提供 ${projectRoot}`);
  console.log(`[王权篇媒体] 地址：http://127.0.0.1:${port}/`);
  console.log('按 Ctrl+C 停止。');
});
