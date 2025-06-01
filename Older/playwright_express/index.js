const express = require("express");
const { chromium, firefox, webkit } = require("playwright");

app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// var { JSDOM } = require('jsdom');
// var article = new Readability(document).parse();

app.post("/", (req, res) => {
  (async () => {
    const browser = await chromium.launch(); // Or 'firefox' or 'webkit'.
    const page = await browser.newPage();
    await page.goto(req.body.page.toString());
    await page.screenshot({ path: "screenshot.png" });
    // other actions...
    await browser.close();
  })();
  res.send('Sent to playwright')
});

app.listen(3000, ()=>{
    console.log('running...')
})