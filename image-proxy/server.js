const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

app.get('/proxy', async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).send('Missing "url" query parameter');
  }

  try {
    const response = await fetch(url); // 👈 native fetch in Node 18+
    if (!response.ok) {
      return res.status(response.status).send(`Failed to fetch: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    const buffer = await response.arrayBuffer(); // use arrayBuffer with native fetch

    res.set('Content-Type', contentType);
    res.set('Content-Disposition', `attachment; filename="${url.split('/').pop()}"`);
    res.send(Buffer.from(buffer)); // convert ArrayBuffer to Buffer
  } catch (err) {
    console.error('Error fetching:', err);
    res.status(500).send('Proxy fetch error');
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}/proxy`);
});
