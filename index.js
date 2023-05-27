const express = require("express");
const puppeteer = require("puppeteer");
const app = express();
const bodyParser = require("body-parser");
let browser;

app.use(bodyParser.text({ type: "*/*", limit: "500mb" }));

app.post("/api/make-pdf", async (req, res) => {
  const body = req.body;
  const page = await browser.newPage();
  await page.setContent(body, {
    waitUntil: "networkidle0",
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
        top: "45px",
        right: "60px",
        bottom: "70px",
        left: "60px",
      },
    });
    await page.close();
  
    res.set({
      "Content-Type": "application/pdf",
      "Content-Length": pdf.length,
    });
    res.send(pdf);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

const startup = async () => {
  console.log(`Loading browser`);
  browser = await puppeteer.launch({
    headless: true,
    args: [
      // Required for Docker version of Puppeteer
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });
  console.log(`Browser loaded`);

  const PORT = 7071;
  const HOST = "0.0.0.0";

  app.listen(PORT, HOST);
  console.log(`Running on http://${HOST}:${PORT}`);
};
startup();
