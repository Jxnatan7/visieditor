import express from 'express';

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, PORT = '3000', ALLOWED_ORIGINS = '' } = process.env;

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
  console.error('ERROR: GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET must be set');
  process.exit(1);
}

const app = express();
app.use(express.json());

const allowedOrigins = ALLOWED_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin ?? '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

// POST /token  { code, redirect_uri } → { access_token }
app.post('/token', async (req, res) => {
  const { code, redirect_uri } = req.body ?? {};

  if (!code) {
    return res.status(400).json({ error: 'invalid_request', error_description: 'code is required' });
  }

  try {
    const ghRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri,
      }),
    });

    const data = await ghRes.json();

    if (data.error) {
      console.warn('GitHub rejected token exchange:', data.error);
      return res.status(400).json({ error: data.error, error_description: data.error_description });
    }

    if (!data.access_token) {
      return res.status(502).json({ error: 'no_token', error_description: 'GitHub did not return an access_token' });
    }

    res.json({ access_token: data.access_token, token_type: data.token_type, scope: data.scope });
  } catch (err) {
    console.error('Token exchange failed:', err);
    res.status(500).json({ error: 'internal_server_error' });
  }
});

app.listen(Number(PORT), () => {
  console.log(`token-server listening on :${PORT}`);
});
