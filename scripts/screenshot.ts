import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const SCREENSHOTS_DIR = path.join(__dirname, '../screenshots');
const BASE_URL = 'http://localhost:5177';

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const viewports = [
  { name: 'macbook-air', width: 1366, height: 768 },
  { name: 'ipad', width: 768, height: 1024 },
];

const pages = [
  { path: '/', name: 'dashboard' },
  { path: '/projects', name: 'project-list' },
];

async function takeScreenshots() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    colorScheme: 'light',
  });

  for (const viewport of viewports) {
    const page = await context.newPage();
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    for (const p of pages) {
      await page.goto(`${BASE_URL}${p.path}`);
      await page.waitForLoadState('networkidle');
      
      // Add a small delay to ensure all content is rendered
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const filename = `01-${p.name}-light-${viewport.name}.png`;
      await page.screenshot({ 
        path: path.join(SCREENSHOTS_DIR, filename),
        fullPage: true
      });
      console.log(`Saved: ${filename}`);
    }

    // Dark mode screenshots
    const darkContext = await browser.newContext({
      colorScheme: 'dark',
    });
    const darkPage = await darkContext.newPage();
    await darkPage.setViewportSize({ width: viewport.width, height: viewport.height });

    for (const p of pages) {
      await darkPage.goto(`${BASE_URL}${p.path}`);
      await darkPage.waitForLoadState('networkidle');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const filename = `01-${p.name}-dark-${viewport.name}.png`;
      await darkPage.screenshot({ 
        path: path.join(SCREENSHOTS_DIR, filename),
        fullPage: true
      });
      console.log(`Saved: ${filename}`);
    }
  }

  await browser.close();
  console.log('\nAll screenshots saved to /screenshots folder');
}

takeScreenshots().catch(console.error);
