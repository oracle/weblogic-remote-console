define(["require", "exports", "preact/jsx-runtime", "ojL10n!wrc/shared/resources/nls/frontend", "./help-table"], function (require, exports, jsx_runtime_1, t, help_table_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Help = void 0;
    const HelpColumnLabels = {
        name: t["wrc-help-form"].tables.help.columns.header.name,
        description: t["wrc-help-form"].tables.help.columns.header.description,
    };
    const Help = ({ model }) => {
        return ((0, jsx_runtime_1.jsx)(help_table_1.HelpTable, { tableDefinition: {
                columns: [
                    { header: HelpColumnLabels.name },
                    { header: HelpColumnLabels.description },
                ],
                rows: (model === null || model === void 0 ? void 0 : model.getDetailedHelp()) || [],
                helpTopics: (model === null || model === void 0 ? void 0 : model.getHelpTopics()) || [],
            } }));
    };
    exports.Help = Help;
});
//# sourceMappingURL=help.js.map