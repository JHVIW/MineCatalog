/**
 * MineCatalog - Minecraft Items Scraper
 * 
 * This script scrapes Minecraft item data from MCUtils.com and saves it as a JSON file.
 * It is designed to be run via GitHub Actions on a daily schedule.
 */

const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');

async function scrapeMinecraftItems() {
  console.log('MineCatalog scraper starting...');
  
  // Launch browser with GitHub Actions compatible settings
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Set a reasonable timeout
  page.setDefaultNavigationTimeout(60000);
  
  try {
    console.log('Navigating to MCUtils.com/item-ids...');
    await page.goto('https://mcutils.com/item-ids', { 
      waitUntil: 'networkidle2' 
    });
    console.log('Page loaded successfully');

    // Extract all items from the page
    const items = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('tr.text-\\[\\#cecece\\]'));
      return rows.map(row => {
        const cells = row.querySelectorAll('td');
        
        const imgElement = row.querySelector('img');
        const imgSrc = imgElement ? imgElement.getAttribute('src') : null;
        const imgAlt = imgElement ? imgElement.getAttribute('alt') : null;
        
        // Collect all data from the row
        const displayName = cells[1] ? cells[1].textContent.trim() : null;
        const itemId = cells[2] ? cells[2].textContent.trim() : null;
        const damageValue = cells[3] ? cells[3].textContent.trim() : null;
        const stackSize = cells[4] ? cells[4].textContent.trim() : null;
        
        return {
          displayName,
          itemId,
          damageValue,
          stackSize,
          imgAlt,
          imgSrc
        };
      }).filter(item => item.itemId && item.imgSrc);
    });

    console.log(`Found ${items.length} Minecraft items with images`);

    // Add metadata to the output
    const outputData = {
      metadata: {
        lastUpdated: new Date().toISOString(),
        totalItems: items.length,
        source: "https://mcutils.com/item-ids"
      },
      items: items
    };

    // Save the JSON data
    const jsonPath = path.join(process.cwd(), 'minecraft-items.json');
    await fs.writeFile(jsonPath, JSON.stringify(outputData, null, 2));
    console.log(`JSON data saved to: ${jsonPath}`);

  } catch (error) {
    console.error('Error during scraping:', error);
    process.exit(1);
  } finally {
    await browser.close();
    console.log('Browser closed, scraping completed');
  }
}

// Execute the scraper
scrapeMinecraftItems()
  .then(() => console.log('MineCatalog scraper completed successfully'))
  .catch(error => {
    console.error('Scraper failed with error:', error);
    process.exit(1);
  });
