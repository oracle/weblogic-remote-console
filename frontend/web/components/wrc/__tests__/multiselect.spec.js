var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "preact/jsx-runtime", "@testing-library/preact", "wrc/multiselect", "ojs/ojcontext"], function (require, exports, jsx_runtime_1, preact_1, multiselect_1, Context) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe("Multiselect component", () => {
        let available;
        let chosen;
        const changeHandler = (event) => {
            available = event.available;
            chosen = event.chosen;
        };
        beforeEach(() => {
            available = [
                {
                    label: "apple",
                    key: "A",
                },
                {
                    label: "orange",
                    key: "O",
                },
                {
                    label: "banana",
                    key: "B",
                },
            ];
            chosen = [
                {
                    label: "grape",
                    key: "G",
                },
            ];
        });
        const renderContent = () => (0, preact_1.render)((0, jsx_runtime_1.jsx)("div", { "data-oj-binding-provider": "preact", children: (0, jsx_runtime_1.jsx)(multiselect_1.default, { available: available, chosen: chosen, changeHandler: changeHandler }) }));
        test("Multiselect Renders with options", () => __awaiter(void 0, void 0, void 0, function* () {
            const content = renderContent();
            yield Context.getContext(content.container).getBusyContext().whenReady();
            let r = preact_1.screen.getByTestId("available");
            const getTextContextFromUnderlyingList = (htmlElement) => {
                const textArray = [];
                htmlElement.querySelectorAll("ul > li").forEach((i) => {
                    textArray.push(i.textContent);
                });
                return textArray;
            };
            const renderedAvailable = getTextContextFromUnderlyingList(r);
            r = preact_1.screen.getByTestId("chosen");
            const renderedChosen = getTextContextFromUnderlyingList(r);
            expect(renderedAvailable).toEqual(["apple", "orange", "banana"]);
            expect(renderedChosen).toEqual(["grape"]);
        }));
        const selectAnItem = (element, keys) => {
            (0, preact_1.fireEvent)(element, (0, preact_1.createEvent)("valueChanged", element, {
                detail: {
                    updatedFrom: "internal",
                    value: keys,
                },
            }, { EventType: "CustomEvent" }));
        };
        const clickAButton = (element) => {
            expect(element.disabled).toBe(false);
            (0, preact_1.fireEvent)(element, (0, preact_1.createEvent)("ojAction", element, {
                target: element,
            }, { EventType: "CustomEvent" }));
        };
        describe("when an available item is selected", () => {
            test("and Add Button is clicked, should move to chosen list", () => __awaiter(void 0, void 0, void 0, function* () {
                const content = renderContent();
                yield Context.getContext(content.container).getBusyContext().whenReady();
                const buttons = preact_1.screen.getAllByTestId("add button");
                const availableCheckboxSet = preact_1.screen.getByTestId("available");
                expect(buttons[0].disabled).toEqual(true);
                selectAnItem(availableCheckboxSet, ["A"]);
                clickAButton(buttons[0]);
                expect(available).toEqual([
                    {
                        label: "orange",
                        key: "O",
                    },
                    {
                        label: "banana",
                        key: "B",
                    },
                ]);
                expect(chosen).toEqual([
                    {
                        label: "grape",
                        key: "G",
                    },
                    {
                        label: "apple",
                        key: "A",
                    },
                ]);
            }));
        });
        describe("when no available item is selected", () => {
            test("and Add All Button is clicked, all should be moved to chosen list", () => __awaiter(void 0, void 0, void 0, function* () {
                const content = renderContent();
                yield Context.getContext(content.container).getBusyContext().whenReady();
                const buttons = preact_1.screen.getAllByTestId("add all button");
                clickAButton(buttons[0]);
                expect(available).toEqual([]);
                expect(chosen).toEqual([
                    {
                        label: "grape",
                        key: "G",
                    },
                    {
                        label: "apple",
                        key: "A",
                    },
                    {
                        label: "orange",
                        key: "O",
                    },
                    {
                        label: "banana",
                        key: "B",
                    },
                ]);
            }));
        });
        describe("when a chosen item is selected", () => {
            test("and Remove Button is clicked, should move to available list", () => __awaiter(void 0, void 0, void 0, function* () {
                const content = renderContent();
                yield Context.getContext(content.container).getBusyContext().whenReady();
                const buttons = preact_1.screen.getAllByTestId("remove button");
                const chosenCheckboxSet = preact_1.screen.getByTestId("chosen");
                expect(buttons[0].disabled).toEqual(true);
                selectAnItem(chosenCheckboxSet, ["G"]);
                clickAButton(buttons[0]);
                expect(available).toEqual([
                    {
                        label: "apple",
                        key: "A",
                    },
                    {
                        label: "orange",
                        key: "O",
                    },
                    {
                        label: "banana",
                        key: "B",
                    },
                    {
                        label: "grape",
                        key: "G",
                    },
                ]);
                expect(chosen).toEqual([]);
            }));
        });
        describe("when no chosen item is selected", () => {
            test("Remove All Button, all should be moved to available list", () => __awaiter(void 0, void 0, void 0, function* () {
                const content = renderContent();
                yield Context.getContext(content.container).getBusyContext().whenReady();
                const buttons = preact_1.screen.getAllByTestId("remove all button");
                clickAButton(buttons[0]);
                expect(available).toEqual([
                    {
                        label: "apple",
                        key: "A",
                    },
                    {
                        label: "orange",
                        key: "O",
                    },
                    {
                        label: "banana",
                        key: "B",
                    },
                    {
                        label: "grape",
                        key: "G",
                    },
                ]);
                expect(chosen).toEqual([]);
            }));
        });
    });
});
//# sourceMappingURL=multiselect.spec.js.map