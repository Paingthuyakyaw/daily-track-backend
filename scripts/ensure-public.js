const fs = require('fs');
const path = require('path');

const publicDir = path.join(process.cwd(), 'public');
const indexPath = path.join(publicDir, 'index.html');

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Note Track API</title>
  </head>
  <body>
    <h1>Note Track API</h1>
    <p>Backend deployed on Vercel.</p>
    <ul>
      <li><a href="/api">Swagger UI</a></li>
      <li><a href="/">Health check</a></li>
    </ul>
  </body>
</html>
`;

fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(indexPath, html, 'utf8');

console.log('✔ public/index.html ready for Vercel outputDirectory');
