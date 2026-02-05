define(["require", "exports", "./common"], function (require, exports, common_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ListContentModel = void 0;
    class ListContentModel extends common_1.Model {
        constructor(rdj, pdj) {
            super(rdj, pdj);
            this.canSaveToCart = false;
            this.canSaveNow = false;
            this.canDownload = false;
            this.canSupportTokens = false;
        }
        getItems() {
            var _a;
            const data = (_a = this.rdj) === null || _a === void 0 ? void 0 : _a.data;
            if (Array.isArray(data)) {
                return data;
            }
            return [];
        }
        getHelpTopics() {
            return this.pdj.helpTopics;
        }
        getPageTitle() {
            var _a, _b;
            return (_b = (_a = this.rdj) === null || _a === void 0 ? void 0 : _a.self) === null || _b === void 0 ? void 0 : _b.label;
        }
        clone() {
            const clonedModel = Object.create(Object.getPrototypeOf(this));
            Object.assign(clonedModel, this);
            return clonedModel;
        }
    }
    exports.ListContentModel = ListContentModel;
});
//# sourceMappingURL=listcontentmodel.js.map