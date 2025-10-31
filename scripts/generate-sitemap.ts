import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load site metadata
const metadataPath = join(__dirname, "../public/site-metadata.json");
const metadata = JSON.parse(readFileSync(metadataPath, "utf-8"));
const baseUrl = metadata.website.url;

// Public routes that should be included in sitemap
const publicRoutes = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/beranda", priority: "1.0", changefreq: "daily" },
  { path: "/berita", priority: "0.8", changefreq: "daily" },
  { path: "/dokumen", priority: "0.8", changefreq: "weekly" },
  { path: "/media", priority: "0.7", changefreq: "weekly" },
  { path: "/pemerintahan", priority: "0.8", changefreq: "monthly" },
  { path: "/pelayanan-publik", priority: "0.9", changefreq: "weekly" },
  { path: "/pengaduan-masyarakat", priority: "0.9", changefreq: "daily" },
  { path: "/ppid", priority: "0.8", changefreq: "weekly" },
  { path: "/portal", priority: "0.7", changefreq: "weekly" },
  { path: "/selayang-pandang", priority: "0.7", changefreq: "monthly" },
  { path: "/unit-kerja", priority: "0.7", changefreq: "monthly" },
  { path: "/kontak-kami", priority: "0.6", changefreq: "monthly" },
  { path: "/buku-tamu", priority: "0.7", changefreq: "weekly" },
  { path: "/aplikasi-terkait", priority: "0.6", changefreq: "monthly" },
];

// Generate current date in ISO format
const lastmod = new Date().toISOString().split("T")[0];

// Generate sitemap XML
function generateSitemap(): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const route of publicRoutes) {
    xml += "  <url>\n";
    xml += `    <loc>${baseUrl}${route.path === "/" ? "" : route.path}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += "  </url>\n";
  }

  xml += "</urlset>\n";
  return xml;
}

// Write sitemap to public folder
const sitemapPath = join(__dirname, "../public/sitemap.xml");
const sitemapContent = generateSitemap();
writeFileSync(sitemapPath, sitemapContent, "utf-8");

console.log("✅ Sitemap generated successfully at:", sitemapPath);
console.log(`   Generated ${publicRoutes.length} URLs`);
