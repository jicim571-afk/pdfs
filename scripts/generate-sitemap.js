const fs = require('fs');
const path = require('path');

const toolsFile = path.join(__dirname, '..', 'lib', 'tools.ts');
const outFile = path.join(__dirname, '..', 'public', 'sitemap.xml');
const siteUrl = 'https://pdfmakerai.shop';

function extractRoutes(tsText) {
  const routes = new Set();
  // match route: "/something"
  const routeRegex = /route:\s*"(\/[^"]*)"/g;
  let m;
  while ((m = routeRegex.exec(tsText)) !== null) {
    routes.add(m[1]);
  }
  return Array.from(routes).sort();
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

(async function main() {
  const tsText = fs.readFileSync(toolsFile, 'utf8');
  const routes = extractRoutes(tsText);

  const urls = ["/", ...routes];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];

  for (const u of urls) {
    xml.push('  <url>');
    xml.push(`    <loc>${siteUrl}${u}</loc>`);
    xml.push(`    <lastmod>${today()}</lastmod>`);
    xml.push('  </url>');
  }

  xml.push('</urlset>');

  fs.writeFileSync(outFile, xml.join('\n') + '\n', 'utf8');
  console.log('sitemap.xml generated with', urls.length, 'urls at', outFile);
})();
