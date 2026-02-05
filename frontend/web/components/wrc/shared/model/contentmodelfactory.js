var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "./formcontentmodel", "./tablecontentmodel", "./listcontentmodel", "./transport"], function (require, exports, formcontentmodel_1, tablecontentmodel_1, listcontentmodel_1, transport_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ContentModelFactory = void 0;
    class ContentModelFactory {
        constructor(rdj, pdj) {
            this.rdj = rdj;
            this.pdj = pdj;
        }
        build(slice, context) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.rdj) {
                    if (slice) {
                        const u = new URL(this.rdj, window.location.href);
                        u.searchParams.set("slice", slice);
                        this.rdj = u.pathname + u.search + u.hash;
                    }
                    const [rdjData, pdjData] = yield (0, transport_1.getData)(this.rdj, this.pdj, context);
                    let content;
                    if (pdjData) {
                        if (pdjData.presentationHint === 'cards') {
                            content = new listcontentmodel_1.ListContentModel(rdjData, pdjData);
                        }
                        else if (pdjData.table || pdjData.sliceTable) {
                            content = new tablecontentmodel_1.TableContentModel(rdjData, pdjData);
                        }
                        else {
                            content = new formcontentmodel_1.FormContentModel(rdjData, pdjData);
                        }
                        content.rdjUrl = this.rdj;
                        content.pdjUrl = this.pdj;
                    }
                    return content;
                }
                else {
                    if (this.rdjData) {
                        let pdjData = this.rdjData.inlinePageDescription;
                        if (!pdjData) {
                            let pdjUrl = this.rdjData.pageDescription;
                            if (this.baseUrl) {
                                const u = new URL(this.baseUrl);
                                pdjUrl = `${u.protocol}//${u.host}${pdjUrl}`;
                            }
                            pdjData = yield (0, transport_1.getDataComponent)(pdjUrl);
                        }
                        let content;
                        if (pdjData) {
                            if (pdjData.presentationHint === 'cards') {
                                content = new listcontentmodel_1.ListContentModel(this.rdjData, pdjData);
                            }
                            else if (pdjData.table || pdjData.sliceTable) {
                                content = new tablecontentmodel_1.TableContentModel(this.rdjData, pdjData);
                            }
                            else {
                                content = new formcontentmodel_1.FormContentModel(this.rdjData, pdjData);
                            }
                        }
                        if (content) {
                            content.baseUrl = this.baseUrl;
                        }
                        return content;
                    }
                }
            });
        }
    }
    exports.ContentModelFactory = ContentModelFactory;
});
//# sourceMappingURL=contentmodelfactory.js.map