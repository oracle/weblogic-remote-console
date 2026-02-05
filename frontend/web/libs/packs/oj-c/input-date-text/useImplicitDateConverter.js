define(["require", "exports", "preact/hooks", "ojs/ojconverter-localdate"], function (require, exports, hooks_1, ojconverter_localdate_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useImplicitDateConverter = useImplicitDateConverter;
    /**
     * A custom hook the creates an implicit date converter if the converter was not passed in to the component.
     *
     * @param param0 The props for the useImplicitDateConverter hook
     * @returns the converter
     */
    function useImplicitDateConverter({ converter }) {
        // Since user preferences are merged in by the LocalDateConverter's constructor, we need
        // a new converter for each component instance if one hasn't been supplied.
        const implicitConverter = (0, hooks_1.useMemo)(() => {
            return converter ?? new ojconverter_localdate_1.LocalDateConverter({ dateStyle: 'short' });
        }, [converter]);
        return implicitConverter;
    }
});
