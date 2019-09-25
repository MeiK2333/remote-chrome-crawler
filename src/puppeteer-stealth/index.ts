import { Page } from 'puppeteer';
import { chromeRuntime } from './chrome.runtime';
import { consoleDebug } from './console.debug';
import { navigatorLanguage } from './navigator.languages';
import { navigatorPermissions } from './navigator.permissions';
import { navigatorPlugins } from './navigator.plugins';
import { navigatorWebdriver } from './navigator.webdriver';
import { userAgent } from './user-agent';
import { webglVendor } from './webgl.vendor';
import { windowOuterdimensions } from './window.outerdimensions';

export async function puppeteerStealth(page: Page) {
    await chromeRuntime(page)
    await consoleDebug(page)
    await navigatorLanguage(page)
    await navigatorPermissions(page)
    await navigatorPlugins(page)
    await navigatorWebdriver(page)
    await userAgent(page)
    await webglVendor(page)
    await windowOuterdimensions(page)
}