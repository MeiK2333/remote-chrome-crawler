import { Page } from 'puppeteer'

export async function navigatorPermissions(page: Page) {
    await page.evaluateOnNewDocument(() => {
        const originalQuery = window.navigator.permissions.query
        //@ts-ignore
        window.navigator.permissions.__proto__.query = parameters =>
            parameters.name === 'notifications'
                ? Promise.resolve({ state: Notification.permission })
                : originalQuery(parameters)

        // Inspired by: https://github.com/ikarienator/phantomjs_hide_and_seek/blob/master/5.spoofFunctionBind.js
        const oldCall = Function.prototype.call
        function call() {
            return oldCall.apply(this, arguments)
        }
        Function.prototype.call = call

        const nativeToStringFunctionString = Error.toString().replace(
            /Error/g,
            'toString'
        )
        const oldToString = Function.prototype.toString

        function functionToString() {
            if (this === window.navigator.permissions.query) {
                return 'function query() { [native code] }'
            }
            if (this === functionToString) {
                return nativeToStringFunctionString
            }
            return oldCall.call(oldToString, this)
        }
        Function.prototype.toString = functionToString
    })
}