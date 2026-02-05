define(["require", "exports", "wrc/shared/ini-file", "text!./tips.ini", "ojs/ojlogger"], function (require, exports, ini_file_1, tipsIniText, Logger) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TipsManager = void 0;
    class TipsStore {
        constructor() {
            this.initialized = false;
            this.schema = { categories: [] };
            this.tips = [];
        }
        init() {
            if (this.initialized)
                return;
            try {
                const data = (0, ini_file_1.parseIni)(String(tipsIniText));
                try {
                    const categoriesSection = (data && typeof data === "object" ? data["categories"] : undefined) || {};
                    const categoryIds = Object.keys(categoriesSection);
                    if (categoryIds.length > 0) {
                        this.schema = { categories: categoryIds.map((id) => ({ id: id })) };
                    }
                }
                catch (_e) {
                    this.schema = { categories: [] };
                }
                const isKnownCategory = (cat) => this.schema.categories.some((c) => c.id === cat);
                const tips = [];
                for (const [sectionName, sectionValue] of Object.entries(data || {})) {
                    if (sectionName === "categories")
                        continue;
                    if (!/^tip/i.test(sectionName))
                        continue;
                    const sectionObj = sectionValue;
                    const category = String((sectionObj === null || sectionObj === void 0 ? void 0 : sectionObj.category) || "").trim();
                    const visibleRaw = String((sectionObj === null || sectionObj === void 0 ? void 0 : sectionObj.visible) || "").trim().toLowerCase();
                    const visible = visibleRaw === "true" || visibleRaw === "1" || visibleRaw === "yes";
                    if (!category || !isKnownCategory(category))
                        continue;
                    tips.push({ id: sectionName, category, visible });
                }
                this.tips = tips;
            }
            catch (e) {
                try {
                    Logger.error(`Failed to load tips.ini: ${JSON.stringify(e)}`);
                }
                catch (_a) {
                    Logger.error("Failed to load tips.ini:" + String(e));
                }
                this.schema = { categories: [] };
                this.tips = [];
            }
            finally {
                this.initialized = true;
            }
        }
        getById(id) {
            this.init();
            return this.tips.find((t) => t.id === id);
        }
        getAll() {
            this.init();
            return this.tips;
        }
        getAllVisible() {
            this.init();
            return this.tips.filter((t) => t.visible);
        }
        getCategories() {
            this.init();
            const set = new Set(this.tips.filter((t) => t.visible).map((t) => t.category));
            return Array.from(set);
        }
        getAllCategories() {
            this.init();
            return this.schema.categories;
        }
    }
    const TipsManager = new TipsStore();
    exports.TipsManager = TipsManager;
    exports.default = TipsManager;
});
//# sourceMappingURL=tips-manager.js.map