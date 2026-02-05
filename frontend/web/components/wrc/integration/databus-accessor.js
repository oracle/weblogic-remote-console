define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setDatabus = setDatabus;
    exports.getDatabus = getDatabus;
    exports.tryGetDatabus = tryGetDatabus;
    let _current = null;
    function setDatabus(bus) {
        _current = bus;
    }
    function getDatabus() {
        if (!_current) {
            throw new Error("Databus not set. Call setDatabus() during app bootstrap.");
        }
        return _current;
    }
    function tryGetDatabus() {
        return _current;
    }
});
//# sourceMappingURL=databus-accessor.js.map