export async function asyncSleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export async function promiseTimeout(ms: number, promise) {
    return new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error("promise timeout")), ms);
        promise.then(resolve).catch(reject);
    });
}