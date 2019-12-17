import { asyncSleep } from '../src/helper'

test('sleep', async () => {
    const date = new Date()
    await asyncSleep(500)
    expect(new Date().getTime() - date.getTime() >= 500).toBe(true)
})
