import { Queue } from "../src/queue"
import { Task } from "../src/task"

const puppeteer = require('puppeteer');
const ProxyChain = require('proxy-chain');

const server = new ProxyChain.Server({
    port: 8003,
    verbose: false,
    prepareRequestFunction: ({
        request,
        username,
        password,
        hostname,
        port,
        isHttp,
    }) => {
        return {
            requestAuthentication: username === null,
            upstreamProxyUrl: Buffer.from(username || '', 'base64').toString('ascii')
        }
    },
});
server.listen(() => { });

const proxies = ['http://127.0.0.1:7890', 'http://username:password@127.0.0.1:7890'];

(async () => {
    Queue.createBrowser = async function createBrowser(queue) {
        const browser = puppeteer.launch({
            headless: false,
            args: [`--proxy-server=http://127.0.0.1:8003`],
        })
        return browser
    }
    Queue.createPage = async function (task: Task) {
        const content = await task.queue.browser.createIncognitoBrowserContext()
        task.page = await content.newPage()
        return task.page
    }
    Queue.closePage = async function (task: Task) {
        if (task.page) {
            await task.page.close()
        }
        const content = task.page.browserContext()
        if (content) {
            await content.close()
        }
    }
    await Queue.add(new Task('https://httpbin.org/get', { callback: print }))
    await Queue.run()
    server.close()
})()

async function print(task: Task) {
    const page = task.page
    await page.authenticate({ username: Buffer.from(proxies[0]).toString('base64'), password: '' })
    await page.goto(task.url)
    await page.waitFor(1000)
    let data = await page.evaluate(() => {
        return document.body.innerText
    })
    data = JSON.parse(data)
    console.log(data)
}