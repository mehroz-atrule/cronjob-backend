import puppeteer from 'puppeteer';

const url = 'https://gold.pk/gold-rates-pakistan.php';
export const fetchDataGoldCities = async () => {
  let browser = null;
  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);

    // Wait for the progress table to be present.
    await page.waitForSelector('.progress-table', {timeout: 10000});

    const date = await page.$eval('span.bluetext', dateElement => {
      const datePattern = /(\w{3}, [A-Z][a-z]{2} \d{1,2} \d{4})/;
      const finalDate = dateElement.textContent.trim().match(datePattern);
      if (finalDate && finalDate.length > 0) {
        return finalDate[0];
      }
    });

    const tableData = await page.$$eval('.table-row', rows => {
      const data = [];

      rows.forEach(row => {
        const topCityElement = row.querySelector('.column35 a');
        const symElement = row.querySelectorAll('.column10');
        const biddingElements = row.querySelectorAll('.column20');

        if (topCityElement && symElement && biddingElements.length === 2) {
          const numberRegex = /\d+/;
          const CityName = topCityElement.textContent.trim();
          const Symbol = symElement[1].textContent.trim();
          const Bidding = (biddingElements[0].textContent || '')
            .trim()
            .match(numberRegex);
          const Asking = (biddingElements[1].textContent || '')
            .trim()
            .match(numberRegex);

          data.push({CityName, Symbol, Bidding, Asking});
        }
      });

      return data;
    });
    await page.close();

    const goldApiObject = {
      date: date,
      rates: tableData,
    };
    return goldApiObject;
  } catch (error) {
    console.error(error);
    return undefined;
  } finally {
    // Always attempt to close browser
    if (browser) {
      await browser.close();
    }
  }
};
