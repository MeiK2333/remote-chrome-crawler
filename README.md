# puppeteer-crawler

## Install

```bash
$ npm install git+ssh://git@github.com:MeiK2333/puppeteer-crawler.git
```

## Usage

```typescript
import { Queue, Task } from 'puppeteer-crawler'

(async () => {
    await Queue.push(new Task('https://baidu.com', print))
    await Queue.run()
})()

async function print(task: Task) {
    await task.page.goto(task.url)
    let url = task.page.url()
    console.log(url)
}
```

save on `crawler.ts`

```bash
$ ts-node crawler.ts
https://www.baidu.com/
```

### Update

```bash
$ tsc
$ git commit -a -m 'Update' && git push
```
