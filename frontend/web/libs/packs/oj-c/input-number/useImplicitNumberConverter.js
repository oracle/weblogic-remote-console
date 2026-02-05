define(["require", "exports", "ojs/ojconverter-nativenumber", "preact/hooks"], function (require, exports, ojconverter_nativenumber_1, hooks_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useImplicitNumberConverter = useImplicitNumberConverter;
    /**
     * A custom hook the creates an implicit number converter if the converter was not passed in to the component.
     *
     * @param param0 The props for the useImplicitNumberConverter hook
     * @returns the converter
     */
    function useImplicitNumberConverter({ converter }) {
        const implicitConverter = (0, hooks_1.useMemo)(() => {
            return converter ?? new ojconverter_nativenumber_1.NumberConverter();
        }, [converter]);
        return implicitConverter;
    }
});
