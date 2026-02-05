define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseIni = parseIni;
    function parseIni(content) {
        const result = {};
        let currentSection = null;
        const lines = content.split(/\r?\n/);
        for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine || trimmedLine.startsWith(';') || trimmedLine.startsWith('#')) {
                continue;
            }
            const sectionMatch = trimmedLine.match(/^\[(.+)\]$/);
            if (sectionMatch) {
                currentSection = sectionMatch[1];
                result[currentSection] = {};
                continue;
            }
            const keyValueMatch = trimmedLine.match(/^(.+?)\s*=\s*(.*)$/);
            if (keyValueMatch) {
                const key = keyValueMatch[1].trim();
                const value = keyValueMatch[2].trim();
                if (currentSection) {
                    result[currentSection][key] = value;
                }
                else {
                    result[key] = value;
                }
            }
        }
        return result;
    }
});
//# sourceMappingURL=ini-file.js.map