/* Local LLM proxy for the meeting-supervision demo. Key stays in .env, never in the page. */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const ROOT = __dirname;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
};

function loadEnv() {
  const file = path.join(ROOT, '.env');
  if (!fs.existsSync(file)) return;
  fs.readFileSync(file, 'utf8').split(/\r?\n/).forEach((line) => {
    const t = line.trim();
    if (!t || t.startsWith('#')) return;
    const i = t.indexOf('=');
    if (i < 1) return;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (!process.env[k]) process.env[k] = v;
  });
}

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); } catch (e) { reject(new Error('请求体不是合法 JSON')); }
    });
    req.on('error', reject);
  });
}

function chatCompletionsUrl(base) {
  const b = String(base || 'https://api.deepseek.com/v1').replace(/\/+$/, '');
  if (/\/chat\/completions$/i.test(b)) return b;
  if (/\/v1$/i.test(b)) return b + '/chat/completions';
  return b + '/v1/chat/completions';
}

function systemPrompt() {
  return [
    '你是郑州航空港科创投资集团会议督查督办系统的智能问答助手，服务对象是总经理文钊。',
    '只根据随后提供的「系统资料」回答，不要用资料以外的信息编造本集团督办事项、进度、责任人或日期。',
    '资料基准日见系统资料；「本月」「超期」均相对该基准日。超期指办结时限早于基准日，或牌态为红牌。',
    '回答要求：先给结论，再列依据（事项编号、会议文号、责任单位、负责人、时限、牌态、进展）。',
    '数字、日期、人名必须与资料一致。资料没有的内容明确说「当前台账与纪要中未找到」，不要编造。',
    '用简洁中文，便于领导扫读，可用序号。',
  ].join('');
}

async function handleQa(req, res) {
  cors(res);
  const key = process.env.AI_API_KEY || process.env.DEEPSEEK_API_KEY || '';
  if (!key) {
    res.writeHead(503, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: '未配置 AI_API_KEY。请在项目目录创建 .env（可参考 .env.example）。' }));
    return;
  }
  let body;
  try { body = await readBody(req); } catch (e) {
    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: e.message }));
    return;
  }
  const question = String(body.question || '').trim();
  if (!question) {
    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: '缺少问题' }));
    return;
  }
  const history = Array.isArray(body.history) ? body.history.slice(-8) : [];
  const messages = [
    { role: 'system', content: systemPrompt() },
    { role: 'system', content: '系统资料：\n' + String(body.knowledge || '').slice(0, 80000) },
  ];
  history.forEach((m) => {
    if (!m || (m.role !== 'user' && m.role !== 'assistant')) return;
    const content = String(m.content || '').trim();
    if (content) messages.push({ role: m.role, content: content.slice(0, 4000) });
  });
  messages.push({ role: 'user', content: question.slice(0, 2000) });

  const url = chatCompletionsUrl(process.env.AI_BASE_URL);
  const model = process.env.AI_MODEL || 'deepseek-chat';
  let upstream;
  try {
    upstream = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        stream: true,
        temperature: 0.2,
        messages: messages,
      }),
    });
  } catch (e) {
    res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: '无法连接大模型接口：' + e.message }));
    return;
  }
  if (!upstream.ok) {
    const errText = await upstream.text();
    res.writeHead(upstream.status, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: '大模型接口返回 ' + upstream.status, detail: errText.slice(0, 800) }));
    return;
  }

  res.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
  });

  const reader = upstream.body.getReader();
  const dec = new TextDecoder();
  let buf = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split(/\r?\n/);
    buf = lines.pop() || '';
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line.startsWith('data:')) continue;
      const data = line.slice(5).trim();
      if (!data || data === '[DONE]') continue;
      try {
        const json = JSON.parse(data);
        const piece = json.choices && json.choices[0] && json.choices[0].delta && json.choices[0].delta.content;
        if (piece) res.write(piece);
      } catch (e) { /* ignore partial JSON */ }
    }
  }
  res.end();
}

function serveStatic(req, res, url) {
  let rel = decodeURIComponent(url.pathname);
  if (rel === '/') rel = '/index.html';
  rel = rel.replace(/^\/+/, '').replace(/\//g, path.sep);
  const file = path.normalize(path.join(ROOT, rel));
  if (!file.startsWith(ROOT)) {
    res.writeHead(403);
    res.end();
    return;
  }
  if (path.basename(file).startsWith('.')) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
    res.end(data);
  });
}

loadEnv();
if (typeof fetch !== 'function') {
  console.error('需要 Node.js 18 及以上（当前无内置 fetch）');
  process.exit(1);
}
const port = Number(process.env.PORT || 8787);
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  if (req.method === 'OPTIONS') {
    cors(res);
    res.writeHead(204);
    res.end();
    return;
  }
  if (req.method === 'GET' && url.pathname === '/api/health') {
    cors(res);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      ok: true,
      model: process.env.AI_MODEL || 'deepseek-chat',
      configured: !!(process.env.AI_API_KEY || process.env.DEEPSEEK_API_KEY),
    }));
    return;
  }
  if (req.method === 'POST' && url.pathname === '/api/qa') {
    try {
      await handleQa(req, res);
    } catch (e) {
      if (!res.headersSent) {
        cors(res);
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      }
      res.end(JSON.stringify({ error: e.message || String(e) }));
    }
    return;
  }
  if (req.method === 'GET') {
    serveStatic(req, res, url);
    return;
  }
  res.writeHead(405);
  res.end();
});

server.listen(port, '0.0.0.0', () => {
  console.log('问答服务 http://0.0.0.0:' + port);
  console.log('模型 ' + (process.env.AI_MODEL || 'deepseek-chat') + (process.env.AI_API_KEY ? ' · 已配置密钥' : ' · 未配置 AI_API_KEY'));
});
