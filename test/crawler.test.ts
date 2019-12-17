import Crawler from '../src/crawler'

import puppeteer from 'puppeteer'

test('default', async () => {
    const browser = await puppeteer.launch({ headless: false })
    await Crawler.addBrowser(browser.wsEndpoint())
    browser.disconnect()

    const browser2 = Crawler.browsers[0]
    const page = await browser2.newPage()
    await page.goto('https://httpbin.org/get')
    const data = JSON.parse(await page.evaluate(() => {
        return document.body.innerText
    }))
    expect(data['url']).toEqual('https://httpbin.org/get')
    await browser2.close()
})
