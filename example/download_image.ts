import { Queue } from "../src/queue"
import { Task } from "../src/task"
import { promises as fs } from 'fs'

(async () => {
    await Queue.add(new Task('https://avatars1.githubusercontent.com/u/20951666?s=460&v=4', { callback: download1 }))
    await Queue.add(new Task('https://github.com/MeiK2333', { callback: download2 }))
    await Queue.run()
})()

/**
 * 进入图片页面并下载单张图片
 * @param task 
 */
async function download1(task: Task) {
    const page = task.page
    const buf = await page.goto(task.url)
    await fs.writeFile('image1.png', await buf.buffer())
}

/**
 * 下载指定页面加载的所有图片
 * @param task 
 */
async function download2(task: Task) {
    const page = task.page
    let cnt = 1
    page.on('response', async response => {
        if (response.request().resourceType() === 'image') {
            cnt++
            await fs.writeFile(`image${cnt}.png`, await response.buffer())
        }
    })
    await page.goto(task.url)
}
