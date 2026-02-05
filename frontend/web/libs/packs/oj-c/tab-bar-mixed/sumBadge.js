define(["require", "exports", "ojs/ojlogger"], function (require, exports, Logger) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sumBadge = sumBadge;
    /**
     * Returns a numerical total of numerical badge values extracted from
     * a collection of objects.
     *
     * @param tabs
     * @returns
     */
    function sumBadge(items) {
        return items.reduce((total, item) => {
            if (!item.badge) {
                return total;
            }
            const num = Number(item.badge);
            if (!Number.isInteger(num)) {
                Logger.warn(`Tab item with itemKey '${item.itemKey}' provided a badge of '${item.badge}', expected integer`);
                return total;
            }
            if (num < 0) {
                Logger.warn(`Tab item with itemKey '${item.itemKey}' provided a negative numerical badge value of '${item.badge}', expected positive integer. This will be discarded from total.`);
                return total;
            }
            return total + item.badge;
        }, 0);
    }
});
