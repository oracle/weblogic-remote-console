var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "../../resource/table/tablebuilder", "../../resource/form/formbuilder", "../model/contentmodelfactory", "../model/tablecontentmodel", "../model/listcontentmodel"], function (require, exports, tablebuilder_1, formbuilder_1, contentmodelfactory_1, tablecontentmodel_1, listcontentmodel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BuilderFactory = exports.seed = void 0;
    exports.seed = Date.now();
    class BuilderFactory {
        constructor(rdj, pdj, resourceContext, context) {
            this.rdj = rdj;
            this.pdj = pdj;
            this.resourceContext = resourceContext;
            this.context = context;
        }
        build() {
            return __awaiter(this, void 0, void 0, function* () {
                const content = yield new contentmodelfactory_1.ContentModelFactory(this.rdj, this.pdj).build(undefined, this.context);
                let builder;
                if (content) {
                    if (content instanceof tablecontentmodel_1.TableContentModel) {
                        if (content.getSlices() && content.getSlices().length > 0) {
                            builder = new formbuilder_1.FormBuilder(content, this.resourceContext, this.context);
                        }
                        else {
                            builder = new tablebuilder_1.TableBuilder(content, this.context);
                        }
                    }
                    else if (content instanceof listcontentmodel_1.ListContentModel) {
                        const { ListBuilder } = yield new Promise((resolve_1, reject_1) => { require(["../../resource/list/listbuilder"], resolve_1, reject_1); });
                        builder = new ListBuilder(content, this.context);
                    }
                    else {
                        builder = new formbuilder_1.FormBuilder(content, this.resourceContext, this.context);
                    }
                    builder.identifier = ++exports.seed;
                    return builder;
                }
                return undefined;
            });
        }
    }
    exports.BuilderFactory = BuilderFactory;
});
//# sourceMappingURL=builderfactory.js.map