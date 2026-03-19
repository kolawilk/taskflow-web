import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3012';

test.describe('Sidebar to content spacing', () => {
  test('desktop: verify computed styles and spacing', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto(BASE_URL);
    
    // Get sidebar styles
    const sidebarStyles = await page.locator('aside').evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        width: styles.width,
        paddingLeft: styles.paddingLeft,
        paddingRight: styles.paddingRight,
        borderRightWidth: styles.borderRightWidth,
        position: styles.position,
      };
    });
    
    // Get main styles
    const mainStyles = await page.locator('main').evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        marginLeft: styles.marginLeft,
        position: styles.position,
      };
    });
    
    console.log('Sidebar styles:', JSON.stringify(sidebarStyles));
    console.log('Main styles:', JSON.stringify(mainStyles));
    
    // Get bounding boxes
    const sidebarBox = await page.locator('aside').boundingBox();
    const mainBox = await page.locator('main').boundingBox();
    
    console.log('Sidebar box:', JSON.stringify(sidebarBox));
    console.log('Main box:', JSON.stringify(mainBox));
    
    if (sidebarBox && mainBox) {
      const sidebarTotalWidth = parseFloat(sidebarStyles.width) + 
        parseFloat(sidebarStyles.paddingRight) + 
        parseFloat(sidebarStyles.borderRightWidth);
      const spacing = mainBox.x - (sidebarBox.x + sidebarBox.width);
      
      console.log('Sidebar total width (computed):', sidebarTotalWidth);
      console.log('Sidebar box width:', sidebarBox.width);
      console.log('Spacing:', spacing);
      
      // The spacing should be minimal (around 0-16px for one tailwind unit)
      expect(spacing).toBeGreaterThanOrEqual(-5);
      expect(spacing).toBeLessThanOrEqual(32);
    }
  });

  test('mobile: verify layout', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    
    const mainBox = await page.locator('main').boundingBox();
    
    console.log('Mobile main box:', JSON.stringify(mainBox));
    
    if (mainBox) {
      // On mobile, sidebar is hidden and main should start near left edge
      expect(mainBox.x).toBeLessThan(100);
    }
  });
});
