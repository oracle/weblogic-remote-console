define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Builder = void 0;
    class Builder {
        constructor() {
            this.type = "base";
            this.identifier = -1;
            this.id = (id) => `${id}:${this.identifier}`;
            this.propertyFromId = (elementId) => elementId.split(':')[0];
        }
        getPageTitle() { return undefined; }
    }
    exports.Builder = Builder;
});
//# sourceMappingURL=builder.js.map