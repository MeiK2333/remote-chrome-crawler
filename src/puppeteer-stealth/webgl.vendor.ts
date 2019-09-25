import { Page } from 'puppeteer'

export async function webglVendor(page: Page) {
    // Chrome returns undefined, Firefox false
    await page.evaluateOnNewDocument(() => {
        try {
            /* global WebGLRenderingContext */
            //@ts-ignore
            const getParameter = WebGLRenderingContext.getParameter
            WebGLRenderingContext.prototype.getParameter = function (parameter) {
                // UNMASKED_VENDOR_WEBGL
                if (parameter === 37445) {
                    return 'Intel Inc.'
                }
                // UNMASKED_RENDERER_WEBGL
                if (parameter === 37446) {
                    return 'Intel Iris OpenGL Engine'
                }
                return getParameter(parameter)
            }
        } catch (err) { }
    })
}