define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ModalDialogResourceContext = void 0;
    class ModalDialogResourceContext {
        constructor(dialogRef) {
            this.dialogRef = dialogRef;
        }
        get routerController() {
            return {
                selectRoot: () => { },
                navigateToAbsolutePath: (_path, _options) => {
                    var _a;
                    (_a = this.dialogRef) === null || _a === void 0 ? void 0 : _a.current.close();
                },
            };
        }
    }
    exports.ModalDialogResourceContext = ModalDialogResourceContext;
});
//# sourceMappingURL=resource-context.js.map