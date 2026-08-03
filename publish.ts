import { writeFileSync } from "fs";

const urls = ["it", "en", "it/rielaborato", "en/reworked", "it/originale", "en/original"];

export const closeBundle = () => {
  const lastmod = new Date().toISOString().split("T")[0];

  writeFileSync(
    "dist/.htaccess",
    `\
RewriteEngine On

RewriteRule ^favicon\\.ico$ /sheep.png [L]

RewriteRule ^index\\.html$ - [L]

RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

RewriteRule ^en(/.*)?$ /index-en.html [L]

RewriteRule ^ /index.html [L]
`
  );

  writeFileSync(
    "dist/sitemap.xml",
    `\
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
    .map(
      _ => `\
  <url>
    <loc>https://sardoloop.it/${_}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>1.0</priority>
  </url>`
    )
    .join("\n")}
</urlset>
`
  );

  writeFileSync(
    "dist/robots.txt",
    `\
User-agent: *
Allow: /
Sitemap: http://sardoloop.it/sitemap.xml
`
  );
};
