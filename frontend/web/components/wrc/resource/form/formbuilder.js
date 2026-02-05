define(["require", "exports", "preact/jsx-runtime", "../../shared/controller/builder", "./formcontainer", "ojs/ojcheckboxset", "ojs/ojdatetimepicker", "ojs/ojdialog", "ojs/ojformlayout", "ojs/ojinputtext", "ojs/ojlabel", "ojs/ojselectsingle", "ojs/ojswitch", "oj-c/button", "oj-c/input-text"], function (require, exports, jsx_runtime_1, builder_1, formcontainer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FormBuilder = void 0;
    class FormBuilder extends builder_1.Builder {
        constructor(contentModel, context, pageContext) {
            super();
            this.type = "form";
            this.perspectiveId = "";
            this.contentModel = contentModel;
            this.context = context;
            this.pageContext = pageContext;
        }
        getPageTitle() {
            var _a, _b;
            return (_b = (_a = this.contentModel) === null || _a === void 0 ? void 0 : _a.getPageTitle) === null || _b === void 0 ? void 0 : _b.call(_a);
        }
        getHTML() {
            return (0, jsx_runtime_1.jsx)(formcontainer_1.FormContainer, { model: this.contentModel, pageContext: this.pageContext });
        }
    }
    exports.FormBuilder = FormBuilder;
});
//# sourceMappingURL=formbuilder.js.map