const puppeteer = require('puppeteer');
let started = false;
let browser;

const startup = async () => {
    console.log(`Loading browser`);
    browser = await puppeteer.launch({
      headless: true,
      args: [
        // Required for Docker version of Puppeteer
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    });
    console.log(`Browser loaded`);
  };

module.exports = async function (context, req) {
  if (!started) {
    await startup();
    started = true;
  }

  const body = req.body;
  const page = await browser.newPage();
  await page.setContent(body, {
    waitUntil: 'networkidle0',
  });

  const header = `<div style="display: none;"></div>`;
  const footer = `<div
    style="
      width: 100%;
      font-size: 6px;
      padding: 5px 5px 0;
      color: #bbb;
      position: relative;
    "
  >
    <div style="position: absolute; right: 5px; top: 5px">
      <span class="pageNumber"></span>/<span class="totalPages"></span>
    </div>
  </div>
  `;
  try {
    const pdf = await page.pdf({
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: true,
      headerTemplate: header,
      footerTemplate: footer,
      margin: {
        top: '45px',
        right: '60px',
        bottom: '70px',
        left: '60px',
      },
    });
    await page.close();

    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': pdf.length,
      },
      body: pdf,
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: error.message,
    };
  }
};