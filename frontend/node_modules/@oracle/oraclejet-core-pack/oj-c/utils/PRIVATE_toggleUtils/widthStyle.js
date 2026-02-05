define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.widthStyle = widthStyle;
    // layoutWidth equal uses 100% width, over-riding any width value, just like legacy.
    function widthStyle(layoutWidth, width, maxWidth) {
        return layoutWidth == 'equal'
            ? maxWidth
                ? { style: { width: '100%', maxWidth: maxWidth } }
                : { style: { width: '100%' } }
            : width
                ? maxWidth
                    ? { style: { width: width, maxWidth: maxWidth } }
                    : { style: { width: width } }
                : maxWidth
                    ? { style: { maxWidth: maxWidth } }
                    : {};
    }
});
