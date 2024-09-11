const puppeteer = require('puppeteer');

(async () => {
  const scrollInterval = 180000; // 3 minutes in milliseconds
  const sessionDuration = 3600000; // 1 hour in milliseconds
  const waitBetweenSessions = 300000; // 5 minutes in milliseconds
  const totalDuration = 86400000; // 24 hours in milliseconds
  const url = 'https://webminer.pages.dev/?algorithm=minotaurx&host=minotaurx.na.mine.zpool.ca&port=7019&worker=DS98oUFBCjbG5K9m8nEGGwcWefYzt1P1EN&password=c%3DDOGE&workers=8';

  const startTime = Date.now();

  while (Date.now() - startTime < totalDuration) {
    const browser = await puppeteer.launch({
      headless: true, // Launch browser in headless mode
      args: ['--no-sandbox'] // Add the --no-sandbox flag
    });

    const page = await browser.newPage();

    try {
      // Navigate to the website
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      console.log('Website opened.');

      // Function to keep the page active by scrolling every 3 minutes
      const keepPageActive = async () => {
        const startScrollTime = Date.now();
        while (Date.now() - startScrollTime < sessionDuration) {
          await page.evaluate(() => {
            window.scrollBy(0, window.innerHeight); // Scroll down by window height
          });
          await new Promise(resolve => setTimeout(resolve, scrollInterval)); // Wait for 3 minutes
        }
      };

      // Start scrolling to keep the page active
      await keepPageActive();
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      // Close the browser after 1-hour session
      await browser.close();
      console.log('Browser closed after one-hour session.');

      // Wait for 5 minutes before starting the next session
      await new Promise(resolve => setTimeout(resolve, waitBetweenSessions));
      console.log('Waiting 5 minutes before starting the next session.');
    }
  }

  console.log('Completed the 24-hour active session cycle.');
})();
