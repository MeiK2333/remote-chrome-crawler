"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
function navigatorLanguage(page, languages) {
    if (languages === void 0) { languages = ['en-US', 'en']; }
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page.evaluateOnNewDocument(function (languages) {
                        // Overwrite the `plugins` property to use a custom getter.
                        Object.defineProperty(navigator, 'languages', {
                            get: function () { return languages; }
                        });
                    }, 
                    //@ts-ignore
                    languages)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.navigatorLanguage = navigatorLanguage;
