var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "./common", "./model-utils", "./transport"], function (require, exports, common_1, model_utils_1, transport_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FormContentModel = void 0;
    var ENTRY_TYPE;
    (function (ENTRY_TYPE) {
        ENTRY_TYPE[ENTRY_TYPE["REGULAR"] = 0] = "REGULAR";
        ENTRY_TYPE[ENTRY_TYPE["UNRESOLVED_REF"] = 1] = "UNRESOLVED_REF";
        ENTRY_TYPE[ENTRY_TYPE["MODEL_TOKEN"] = 2] = "MODEL_TOKEN";
    })(ENTRY_TYPE || (ENTRY_TYPE = {}));
    ;
    class FormContentModel extends common_1.Model {
        getTypedPropertyValue(propertyName, value) {
            const fieldDescription = this.getPropertyDescription(propertyName);
            if (typeof value === "string") {
                switch (fieldDescription === null || fieldDescription === void 0 ? void 0 : fieldDescription.type) {
                    case "int":
                    case "long":
                        value = parseInt(value);
                        break;
                    case "boolean":
                        value = Boolean(value);
                        break;
                    case "double":
                        value = parseFloat(value);
                        break;
                }
            }
            return value;
        }
        update() {
            var _a, _b, _c;
            const changes = Object.assign({}, this.getChanges());
            this._getAllProperties().forEach((property) => {
                if ((this.isActionInput() || (this.isCreate() && property.required)) &&
                    typeof changes[property.name] === "undefined") {
                    const propertyValue = this.getProperty(property.name) || '';
                    changes[property.name] = {
                        value: this.getTypedPropertyValue(property.name, propertyValue),
                    };
                }
                if (property.readOnly) {
                    delete changes[property.name];
                }
            });
            Object.keys(changes).forEach((changeKey) => {
                if (!this._getAllProperties().find((p) => p.name === changeKey)) {
                    delete changes[changeKey];
                }
            });
            const files = {};
            for (const key in changes) {
                const data = changes[key];
                if ((data === null || data === void 0 ? void 0 : data.value) instanceof File) {
                    files[key] = data.value;
                    delete changes[key];
                }
            }
            Object.keys(changes).forEach((propertyName) => {
                const propertyDescription = this.getPropertyDescription(propertyName);
                if (propertyDescription && this.isFieldNumber(propertyDescription)) {
                    if (typeof changes[propertyName].value === "string") {
                        changes[propertyName].value =
                            this.getTypedPropertyValue(propertyName, changes[propertyName].value) || changes[propertyName].value;
                    }
                }
            });
            Object.keys(changes).forEach((propertyName) => {
                if (changes[propertyName].modelToken && changes[propertyName].value)
                    delete changes[propertyName].value;
            });
            if ((_b = (_a = this.rdj) === null || _a === void 0 ? void 0 : _a.invoker) === null || _b === void 0 ? void 0 : _b.resourceData) {
                const rows = {
                    value: (_c = this.rowsSelectedForActionInput) === null || _c === void 0 ? void 0 : _c.map((r) => {
                        return { value: (0, model_utils_1.parseIfJson)(r) };
                    }),
                };
                return this.invokeActionInputAction(changes, rows, files);
            }
            else {
                return (0, transport_1.doUpdate)(this.rdjUrl, changes, files);
            }
        }
        refresh() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.rdjUrl) {
                    let reloadRdjUrl = new URL(this.rdjUrl, window.location.href);
                    reloadRdjUrl.searchParams.set('reload', 'true');
                    return (0, transport_1.getData)(reloadRdjUrl.pathname + reloadRdjUrl.search + reloadRdjUrl.hash, undefined).then(([rdj, pdj]) => {
                        this.rdj = rdj;
                        if (pdj) {
                            this.pdj = pdj;
                        }
                        this.pdj.form = this.pdj.createForm || this.pdj.sliceForm;
                    });
                }
            });
        }
        changeSlice(sliceName) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.rdjUrl) {
                    const u = new URL(this.rdjUrl);
                    u.searchParams.set("slice", sliceName);
                    this.rdjUrl = u.toString();
                    return this.refresh();
                }
            });
        }
        isActionInput() {
            return this.pdj.actionInputForm !== undefined;
        }
        isCreate() {
            return this.pdj.createForm !== undefined;
        }
        isEdit() {
            return !this.isCreate();
        }
        isDataMissing() {
            var _a;
            const d = (_a = this.rdj) === null || _a === void 0 ? void 0 : _a.data;
            if (d === undefined || d === null)
                return true;
            if (Array.isArray(d))
                return d.length === 0;
            return Object.keys(d).length === 0;
        }
        isCreatableOptionalSingleton() {
            var _a, _b;
            const kind = (_b = (_a = this.rdj) === null || _a === void 0 ? void 0 : _a.self) === null || _b === void 0 ? void 0 : _b.kind;
            return kind === 'creatableOptionalSingleton';
        }
        isNonCreatableOptionalSingleton() {
            var _a, _b;
            const kind = (_b = (_a = this.rdj) === null || _a === void 0 ? void 0 : _a.self) === null || _b === void 0 ? void 0 : _b.kind;
            return kind === 'nonCreatableOptionalSingleton';
        }
        canCreateDashboard() {
            return this.getDashboardCreateForm() !== undefined;
        }
        getDashboardCreateForm() {
            return this.rdj.dashboardCreateForm;
        }
        getCreateForm() {
            return this.rdj.createForm;
        }
        getSelfResourceData() {
            var _a, _b;
            return (_b = (_a = this.rdj) === null || _a === void 0 ? void 0 : _a.self) === null || _b === void 0 ? void 0 : _b.resourceData;
        }
        getSlices() {
            var _a, _b;
            return ((_a = this.pdj.sliceForm) === null || _a === void 0 ? void 0 : _a.slices) || ((_b = this.pdj.sliceTable) === null || _b === void 0 ? void 0 : _b.slices);
        }
        getNumberOfColumns() {
            var _a, _b;
            return ((_b = (_a = this.pdj.form) === null || _a === void 0 ? void 0 : _a.presentation) === null || _b === void 0 ? void 0 : _b.singleColumn)
                ? 1
                : 2;
        }
        isDisabled(fieldDescription) {
            let disabled = false;
            let usedIf;
            if ((usedIf = fieldDescription.usedIf)) {
                const valueUsedIfDependsOn = this.getProperty(usedIf.property);
                if (typeof valueUsedIfDependsOn !== "object" &&
                    typeof valueUsedIfDependsOn !== "undefined") {
                    disabled = usedIf.values.indexOf(valueUsedIfDependsOn) === -1;
                }
            }
            return disabled;
        }
        isRestartNeeded(fieldDescription) {
            return fieldDescription.restartNeeded || false;
        }
        isRequired(fieldDescription) {
            return fieldDescription.required || false;
        }
        isReadOnly(fieldDescription) {
            return fieldDescription.readOnly || false;
        }
        getWidth(fieldDescription) {
            var _a;
            const width = ((_a = fieldDescription.presentation) === null || _a === void 0 ? void 0 : _a.width) || fieldDescription.width;
            if (!width) {
                const isIndirectField = (() => {
                    var _a;
                    if (((_a = this.rdj) === null || _a === void 0 ? void 0 : _a.data) && !Array.isArray(this.rdj.data)) {
                        const propertyData = this.rdj.data[fieldDescription.name];
                        return (propertyData === null || propertyData === void 0 ? void 0 : propertyData.indirect) === true;
                    }
                    return false;
                })();
                if (isIndirectField) {
                    return 'xxl';
                }
            }
            return width;
        }
        isFormReadOnly() {
            var _a;
            return ((_a = this.pdj.sliceForm) === null || _a === void 0 ? void 0 : _a.readOnly) || false;
        }
        isFieldBoolean(fieldDescription) {
            return fieldDescription.type === "boolean";
        }
        isFieldProperties(fieldDescription) {
            return fieldDescription.type === "properties";
        }
        isPolicyExpression(fieldDescription) {
            return fieldDescription.type === "entitleNetExpression";
        }
        isFieldFileContents(fieldDescription) {
            return fieldDescription.type === "fileContents";
        }
        isFieldFilename(fieldDescription) {
            return fieldDescription.type === "filename";
        }
        isFieldNewFilename(fieldDescription) {
            return fieldDescription.type === "newFilename";
        }
        isSecretField(fieldDescription) {
            return fieldDescription.type === "secret";
        }
        isFieldNumber(fieldDescription) {
            let result = false;
            switch (fieldDescription.type) {
                case "int":
                case "long":
                case "double":
                    result = true;
                    break;
                default:
                    result = false;
                    break;
            }
            return result;
        }
        isFieldArray(fieldDescription) {
            return fieldDescription.array;
        }
        isFieldSelect(fieldDescription) {
            var _a;
            return (fieldDescription.array !== true &&
                (((_a = fieldDescription.type) === null || _a === void 0 ? void 0 : _a.startsWith("reference")) ||
                    fieldDescription.legalValues !== undefined));
        }
        isFieldMultiSelect(fieldDescription) {
            var _a;
            return (fieldDescription.array === true &&
                (((_a = fieldDescription.type) === null || _a === void 0 ? void 0 : _a.startsWith("reference")) === true));
        }
        getSelectionsForProperty(fieldDescription) {
            var _a, _b;
            if (fieldDescription.legalValues) {
                return fieldDescription.legalValues;
            }
            else if (fieldDescription.type === "reference-dynamic-enum") {
                return (_a = this.getOptionsForReferenceDynamicEnum(fieldDescription.name)) === null || _a === void 0 ? void 0 : _a.options;
            }
            else if (fieldDescription.type === "reference") {
                return (_b = this.getOptionForReference(fieldDescription.name)) === null || _b === void 0 ? void 0 : _b.options;
            }
            else {
                return [];
            }
        }
        getOptionsSources(fieldDescription) {
            var _a;
            if (fieldDescription.type === "reference-dynamic-enum") {
                return (_a = this.getOptionsForReferenceDynamicEnum(fieldDescription.name)) === null || _a === void 0 ? void 0 : _a.optionSources;
            }
        }
        constructor(rdj, pdj) {
            super(rdj, pdj);
            this.showAdvanced = false;
            this.showInstructions = true;
            this.titlesBeforeProperties = new Map();
            this.changes = new Map();
            this.messages = new Map();
            this.pdj.form = pdj.createForm || pdj.sliceForm || pdj.actionInputForm;
        }
        getPropertyDescription(propertyName) {
            var _a, _b, _c;
            const allProperties = [
                ...(((_a = this.pdj.form) === null || _a === void 0 ? void 0 : _a.properties) || []),
                ...((this.showAdvanced ? (_b = this.pdj.form) === null || _b === void 0 ? void 0 : _b.advancedProperties : []) || []),
            ];
            const getPropertiesFromSections = (sections) => {
                const properties = [];
                sections.forEach((section) => {
                    if (section.properties) {
                        properties.push(...section.properties);
                    }
                    if (section.sections) {
                        properties.push(...getPropertiesFromSections(section.sections));
                    }
                });
                return properties;
            };
            if ((_c = this.pdj.form) === null || _c === void 0 ? void 0 : _c.sections) {
                allProperties.push(...getPropertiesFromSections(this.pdj.form.sections));
            }
            const property = allProperties.find((p) => p.name === propertyName);
            return property;
        }
        getPropertyDescriptions() {
            return this._getAllProperties();
        }
        getPlaceHolder(fieldDescription) {
            var _a;
            return (_a = fieldDescription.presentation) === null || _a === void 0 ? void 0 : _a.inlineFieldHelp;
        }
        getTitle(fieldDescription) {
            return fieldDescription.label || fieldDescription.name;
        }
        getHint(fieldDescription) {
            return (this.getProperty(fieldDescription.name) || this.getTitle(fieldDescription));
        }
        getIntroductionHTML() {
            return this.rdj.introductionHTML || this.pdj.introductionHTML;
        }
        getHelpTopics() {
            return this.pdj.helpTopics;
        }
        getDetailedHelp() {
            return (0, model_utils_1.extractHelpData)(this._getAllProperties());
        }
        getOptionForReference(propertyName) {
            var _a;
            if (this.rdj.data) {
                let data;
                if (!Array.isArray(this.rdj.data)) {
                    data = this.rdj.data[propertyName];
                    return {
                        options: [{ label: (_a = data.value) === null || _a === void 0 ? void 0 : _a.label, value: data.value }],
                        optionSources: [],
                    };
                }
            }
        }
        getOptionsForReferenceDynamicEnum(propertyName) {
            if (this.rdj.data) {
                let data;
                if (!Array.isArray(this.rdj.data)) {
                    data = this.rdj.data[propertyName];
                    return {
                        options: data === null || data === void 0 ? void 0 : data.options,
                        optionSources: data === null || data === void 0 ? void 0 : data.optionsSources,
                    };
                }
                else {
                    data = this.rdj.data.map((d) => {
                        var _a;
                        return {
                            label: (_a = d.identity.value) === null || _a === void 0 ? void 0 : _a.label,
                            value: d.identity.value,
                        };
                    });
                    return { options: data };
                }
            }
        }
        getMessages(propertyName) {
            var _a;
            return (_a = this.messages.get(propertyName)) !== null && _a !== void 0 ? _a : [];
        }
        getPropertyList() {
            const allProperties = this._getAllProperties();
            return allProperties.map((p) => p.name);
        }
        hasAdvancedProperties() {
            var _a, _b;
            return ((((_a = this.pdj.form) === null || _a === void 0 ? void 0 : _a.advancedProperties) &&
                ((_b = this.pdj.form) === null || _b === void 0 ? void 0 : _b.advancedProperties.length) > 0) ||
                false);
        }
        getTitleToInsertBeforePropertie(propertyName) {
            return this.titlesBeforeProperties.get(propertyName);
        }
        hasSections() {
            var _a, _b, _c;
            return Array.isArray((_a = this.pdj.form) === null || _a === void 0 ? void 0 : _a.sections) && (((_c = (_b = this.pdj.form) === null || _b === void 0 ? void 0 : _b.sections) === null || _c === void 0 ? void 0 : _c.length) || 0) > 0;
        }
        getTopLevelPropertyNames() {
            var _a;
            return (((_a = this.pdj.form) === null || _a === void 0 ? void 0 : _a.properties) || []).map((p) => p.name);
        }
        getVisibleSections() {
            var _a;
            const sections = ((_a = this.pdj.form) === null || _a === void 0 ? void 0 : _a.sections) || [];
            const evaluateUsedIf = (usedIf) => {
                if (!usedIf)
                    return true;
                const valueUsedIfDependsOn = this.getProperty(usedIf.property);
                if (typeof valueUsedIfDependsOn === "object" || typeof valueUsedIfDependsOn === "undefined") {
                    return false;
                }
                return usedIf.values.indexOf(valueUsedIfDependsOn) !== -1;
            };
            const filterSection = (section) => {
                if (!evaluateUsedIf(section.usedIf))
                    return undefined;
                const childSections = (section.sections || [])
                    .map((s) => filterSection(s))
                    .filter((s) => !!s) || [];
                const props = section.properties ? [...section.properties] : undefined;
                const filtered = Object.assign(Object.assign({}, section), { sections: childSections.length ? childSections : undefined, properties: props });
                return filtered;
            };
            return sections
                .map((s) => filterSection(s))
                .filter((s) => !!s);
        }
        _getAllProperties() {
            var _a, _b, _c, _d;
            const allProperties = [
                ...(((_a = this.pdj.form) === null || _a === void 0 ? void 0 : _a.properties) || []),
                ...((this.showAdvanced ? (_b = this.pdj.form) === null || _b === void 0 ? void 0 : _b.advancedProperties : []) || []),
            ];
            let usedProperties = [];
            const addSectionsProperties = (sections) => sections === null || sections === void 0 ? void 0 : sections.forEach((section) => {
                var _a;
                let ignore = false;
                if (section.usedIf) {
                    const valueUsedIfDependsOn = this.getProperty(section.usedIf.property);
                    if (typeof valueUsedIfDependsOn !== "object" &&
                        typeof valueUsedIfDependsOn !== "undefined") {
                        ignore = section.usedIf.values.indexOf(valueUsedIfDependsOn) === -1;
                    }
                }
                if (!ignore) {
                    if (section.title && ((_a = section.properties) === null || _a === void 0 ? void 0 : _a.length)) {
                        const firstPropertyOfSection = section.properties[0].name;
                        this.titlesBeforeProperties.set(firstPropertyOfSection, section.title);
                    }
                    usedProperties.push(...(section.properties || []));
                    if (section.sections) {
                        addSectionsProperties(section.sections);
                    }
                }
            });
            if ((_c = this.pdj.form) === null || _c === void 0 ? void 0 : _c.sections) {
                addSectionsProperties((_d = this.pdj.form) === null || _d === void 0 ? void 0 : _d.sections);
            }
            else {
                usedProperties = allProperties;
            }
            return usedProperties;
        }
        getDefaultValueForProperty(propertyName) {
            var _a, _b;
            if ((_a = this.pdj.createForm) === null || _a === void 0 ? void 0 : _a.sections) {
                const checkSectionsForDefault = (sections) => {
                    sections.forEach((section) => {
                        var _a;
                        const property = (_a = section.properties) === null || _a === void 0 ? void 0 : _a.find((property) => propertyName === property.name);
                        if (property === null || property === void 0 ? void 0 : property.defaultValue) {
                            return property.defaultValue;
                        }
                        else if (!property && section.sections) {
                            checkSectionsForDefault(section.sections);
                        }
                    });
                };
                checkSectionsForDefault((_b = this.pdj.createForm) === null || _b === void 0 ? void 0 : _b.sections);
            }
            return undefined;
        }
        isPropertyDefaulted(propertyName) {
            return !this.isCreate() && !this.isActionInput() && typeof this.getProperty(propertyName) === 'undefined';
        }
        getProperty(propertyName) {
            var _a, _b, _c, _d;
            let data = undefined;
            if (this.rdj.data && !Array.isArray(this.rdj.data))
                data = this.rdj.data[propertyName];
            let rdjValue = data === null || data === void 0 ? void 0 : data.value;
            if (typeof rdjValue === "undefined")
                rdjValue = data === null || data === void 0 ? void 0 : data.modelToken;
            if (Array.isArray(rdjValue)) {
                const unmarshall = (propertyValues) => propertyValues.map((v) => v === null || v === void 0 ? void 0 : v.value);
                if ((_a = this.changes.get(propertyName)) === null || _a === void 0 ? void 0 : _a.modelToken) {
                    return (_b = this.changes.get(propertyName)) === null || _b === void 0 ? void 0 : _b.modelToken;
                }
                if (this.changes.get(propertyName) && typeof ((_c = this.changes.get(propertyName)) === null || _c === void 0 ? void 0 : _c.value) === 'undefined') {
                    return undefined;
                }
                return this.changes.get(propertyName)
                    ? unmarshall((_d = this.changes.get(propertyName)) === null || _d === void 0 ? void 0 : _d.value)
                    : unmarshall(rdjValue);
            }
            else {
                let retVal;
                const change = this.changes.get(propertyName);
                if (change) {
                    if (typeof (change === null || change === void 0 ? void 0 : change.value) !== 'undefined') {
                        retVal = change.value;
                    }
                    else {
                        retVal = change.modelToken;
                    }
                }
                else {
                    retVal = rdjValue;
                }
                if (typeof retVal === 'undefined') {
                    return retVal;
                }
                const property = this.getPropertyDescription(propertyName);
                if ((property === null || property === void 0 ? void 0 : property.array) && Array.isArray(retVal)) {
                    retVal = retVal.map((m) => m.value);
                }
                if (property && this.isFieldBoolean(property) && !retVal)
                    return false;
                return retVal;
            }
        }
        setPropertyAsTokenValue(propertyName, tokenValue) {
            return this._setProperty(ENTRY_TYPE.MODEL_TOKEN, propertyName, tokenValue);
        }
        setPropertyAsUnresolvedReference(propertyName, unresolvedReference) {
            return this._setProperty(ENTRY_TYPE.UNRESOLVED_REF, propertyName, unresolvedReference);
        }
        setProperty(propertyName, propertyValue) {
            return this._setProperty(ENTRY_TYPE.REGULAR, propertyName, propertyValue);
        }
        _setProperty(entryType, propertyName, propertyValue) {
            var _a, _b, _c, _d;
            if (typeof propertyValue === 'undefined') {
                this.changes.delete(propertyName);
                this.changes.set(propertyName, {
                    set: false
                });
                return propertyValue;
            }
            if (propertyValue === null &&
                ((_a = this.getPropertyDescription(propertyName)) === null || _a === void 0 ? void 0 : _a.type) !==
                    "reference-dynamic-enum") {
                propertyValue = "";
            }
            let compareValue;
            if (entryType === ENTRY_TYPE.MODEL_TOKEN) {
                compareValue = propertyValue;
            }
            else {
                compareValue = this.getTypedPropertyValue(propertyName, propertyValue);
            }
            const data = (_b = this.rdj.data) === null || _b === void 0 ? void 0 : _b[propertyName];
            let rdjValue = data === null || data === void 0 ? void 0 : data.value;
            if (typeof rdjValue === "undefined")
                rdjValue = data === null || data === void 0 ? void 0 : data.modelToken;
            if (typeof rdjValue !== "number" && typeof rdjValue === "undefined") {
                rdjValue = this.getDefaultValueForProperty(propertyName);
                if (rdjValue === undefined) {
                    const fieldDescription = this.getPropertyDescription(propertyName);
                    if (fieldDescription && this.isFieldArray(fieldDescription)) {
                        rdjValue = [{ value: "" }];
                    }
                    else {
                        rdjValue = "";
                    }
                }
            }
            if (rdjValue === null) {
                rdjValue = "";
            }
            if (!Array.isArray(propertyValue)) {
                if (typeof compareValue === "object" &&
                    JSON.stringify(compareValue) === JSON.stringify(rdjValue)) {
                    this.changes.delete(propertyName);
                }
                else if (typeof compareValue !== "object" &&
                    compareValue === rdjValue) {
                    this.changes.delete(propertyName);
                }
                else {
                    const propertyValueHolder = (_c = this.changes.get(propertyName)) !== null && _c !== void 0 ? _c : {};
                    if (entryType === ENTRY_TYPE.REGULAR) {
                        propertyValueHolder.value = propertyValue;
                        delete propertyValueHolder.modelToken;
                    }
                    else if (entryType === ENTRY_TYPE.MODEL_TOKEN) {
                        if (typeof propertyValue !== "string") {
                            throw new Error("modelToken is not a string");
                        }
                        propertyValueHolder.modelToken = propertyValue;
                        delete propertyValueHolder.value;
                    }
                    else if (entryType === ENTRY_TYPE.UNRESOLVED_REF) {
                        if (typeof propertyValue !== "string") {
                            throw new Error("unresolvedReference is not a string");
                        }
                        propertyValueHolder.value = {
                            label: propertyValue,
                            unresolvedReference: propertyValue,
                        };
                        delete propertyValueHolder.modelToken;
                    }
                    this.changes.set(propertyName, propertyValueHolder);
                }
            }
            else {
                const newPropertyValue = propertyValue.map((pv) => {
                    return { value: pv };
                });
                if (JSON.stringify(newPropertyValue) === JSON.stringify(rdjValue)) {
                    this.changes.delete(propertyName);
                }
                else {
                    const propertyValueHolder = (_d = this.changes.get(propertyName)) !== null && _d !== void 0 ? _d : {};
                    propertyValueHolder.value = newPropertyValue;
                    delete propertyValueHolder.modelToken;
                    this.changes.set(propertyName, propertyValueHolder);
                }
            }
            return propertyValue;
        }
        resetProperty(propertyName) {
        }
        clear() {
            this.clearChanges();
            this.clearMessages();
        }
        clearChanges() {
            this.changes.clear();
        }
        clearMessages() {
            this.messages.clear();
        }
        getChanges() {
            return Object.fromEntries(this.changes.entries());
        }
        hasChanges() {
            return Object.entries(this.getChanges()).length > 0;
        }
        hasPropertyChanged(propertyName) {
            var _a;
            if (this.getChanges()[propertyName] !== undefined && this.getChanges()[propertyName].set !== false) {
                return true;
            }
            if (this.rdj.data) {
                let data = [];
                if (!Array.isArray(this.rdj.data)) {
                    data = [this.rdj.data];
                }
                else {
                    data = this.rdj.data;
                }
                for (const datum of data) {
                    if ((_a = datum[propertyName]) === null || _a === void 0 ? void 0 : _a.set) {
                        return true;
                    }
                }
            }
            return false;
        }
        getCompensatingPayload() { }
        clone() {
            const clonedModel = Object.create(Object.getPrototypeOf(this));
            Object.assign(clonedModel, this);
            return clonedModel;
        }
    }
    exports.FormContentModel = FormContentModel;
});
//# sourceMappingURL=formcontentmodel.js.map