import { BrowserHelper } from '../src/browser_helper'

import puppeteer from 'puppeteer'

test('get_idle_browser', async () => {
    const browser = await puppeteer.launch({ headless: true })
    await BrowserHelper.addBrowser(browser.wsEndpoint())
    browser.disconnect()

    const browser2 = await BrowserHelper.getIdleBrowser()
    const page = await browser2.newPage()
    await page.goto('https://httpbin.org/get')
    const data = JSON.parse(await page.evaluate(() => {
        return document.body.innerText
    }))
    expect(data['url']).toEqual('https://httpbin.org/get')
    await browser2.close()
})

test('auto_remove', async () => {
    const browser = await puppeteer.launch({ headless: true })
    await BrowserHelper.addBrowser(browser.wsEndpoint())

    const browser2 = await BrowserHelper.getIdleBrowser()
    const page = await browser2.newPage()
    await page.goto('https://httpbin.org/get')
    const data = JSON.parse(await page.evaluate(() => {
        return document.body.innerText
    }))
    expect(data['url']).toEqual('https://httpbin.org/get')
    await browser2.close()
    const browser3 = await BrowserHelper.getIdleBrowser()
    expect(browser3).toEqual(null)
})
