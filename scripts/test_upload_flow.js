const axios = require('axios').default;
const qs = require('querystring');

async function run() {
  const base = 'http://localhost:3000';
  try {
    // Login
    const loginResp = await axios.post(base + '/auth/login', qs.stringify({ email: 'test@example.com', password: 'Password123!' }), {
      maxRedirects: 0,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      validateStatus: s => s === 302 || s === 200
    });

    const cookies = loginResp.headers['set-cookie'];
    if (!cookies) {
      console.error('No cookies set — login may have failed');
      return;
    }
    const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');
    console.log('Logged in, cookies:', cookieHeader);

    // Post upload
    const uploadResp = await axios.post(base + '/upload', qs.stringify({ name: 'Test Item', description: 'Desc', price: '9.99' }), {
      headers: {
        Cookie: cookieHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      maxRedirects: 0,
      validateStatus: s => [200,302,303,401,403,500].includes(s)
    });

    console.log('Upload status:', uploadResp.status);
    console.log('Upload headers:', uploadResp.headers);
    console.log('Upload data:', uploadResp.data && uploadResp.data.length ? uploadResp.data.slice(0,200) : uploadResp.data);
  } catch (err) {
    console.error('Test flow error:', err && err.message ? err.message : err);
    if (err.response) {
      console.error('Response status:', err.response.status);
      console.error('Response headers:', err.response.headers);
      console.error('Response data:', err.response.data && err.response.data.slice ? err.response.data.slice(0,500) : err.response.data);
    }
  }
}

run();
