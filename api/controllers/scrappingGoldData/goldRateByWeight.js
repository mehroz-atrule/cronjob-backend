import puppeteer from 'puppeteer';

const url = 'https://gold.pk/gold-rates-pakistan.php';
export const fetchDataGOLDbyWeight = async () => {
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
        const headers = row.querySelector('.column25 b');
        const values = row.querySelectorAll('.column15');

        if (headers && values.length == 5) {
          const numberRegex = /\d+/;
          const rowData = {
            GoldWeight: headers.textContent.trim(),
            Karat_24: values[0].textContent.trim().match(numberRegex),
            Karat_22: values[1].textContent.trim().match(numberRegex),
            Karat_21: values[2].textContent.trim().match(numberRegex),
            Karat_18: values[3].textContent.trim().match(numberRegex),
            Karat_12: values[4].textContent.trim().match(numberRegex),
          };
          data.push(rowData);
        }
      });

      return data;
    });
    await page.close();

    const goldPerWieghtData = {
      date: date,
      rates: tableData,
    };
    return goldPerWieghtData;
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
