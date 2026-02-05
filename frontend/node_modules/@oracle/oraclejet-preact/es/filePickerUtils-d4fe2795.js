/* @oracle/oraclejet-preact: undefined */
// Contains utility functions intended to be used to pick files
function pickFiles(callback, { accept = [], capture = 'none', selectionMode = 'single' }) {
    const input = createInput({ accept, capture, selectionMode });
    input.addEventListener('change', () => {
        // If this is a webdriver test, _pickerTestData will be populated and should use it
        const files = input._pickerTestData ? input._pickerTestData : input.files;
        callback(files);
    }, { once: true });
    input.click();
}
const createInput = (fileOptions) => {
    const input = document.createElement('input');
    input.type = 'file';
    if (fileOptions?.capture && fileOptions.capture != 'none') {
        input.capture = fileOptions.capture;
    }
    input.accept = fileOptions.accept.join(',');
    input.multiple = fileOptions.selectionMode === 'multiple';
    input.style.display = 'none';
    return input;
};

export { pickFiles as p };
//# sourceMappingURL=filePickerUtils-d4fe2795.js.map
