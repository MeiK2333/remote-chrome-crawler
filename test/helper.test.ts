import { asyncSleep, promiseTimeout } from '../src/helper'

test('sleep', async () => {
    const date = new Date()
    await asyncSleep(500)
    expect(new Date().getTime() - date.getTime() >= 500).toBe(true)
})

test('timeout', async () => {
    const date = new Date()
    try {
        await promiseTimeout(500, (async () => { await asyncSleep(10000) })())
    } catch (e) {
    }

    expect(new Date().getTime() - date.getTime() >= 500).toBe(true)
    expect(new Date().getTime() - date.getTime() < 1000).toBe(true)
})
