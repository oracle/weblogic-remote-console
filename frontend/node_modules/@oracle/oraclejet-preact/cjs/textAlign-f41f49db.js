/* @oracle/oraclejet-preact: undefined */
'use strict';


var vanillaExtractSprinklesCreateRuntimeSprinkles_esm = require('./vanilla-extract-sprinkles-createRuntimeSprinkles.esm-d68f3e0f.js');

var textAlign = vanillaExtractSprinklesCreateRuntimeSprinkles_esm.createSprinkles({conditions:undefined,styles:{textAlign:{values:{start:{defaultClass:'text_textAlign_start__1h8gevb0'},end:{defaultClass:'text_textAlign_end__1h8gevb1'},right:{defaultClass:'text_textAlign_right__1h8gevb2'}}}}});
var textAligns = ['start','end','right'];

const textInterpolations = {
    textAlign: ({ textAlign: textAlign$1 }) => textAlign$1 === undefined ? {} : { class: textAlign({ textAlign: textAlign$1 }) }
};

exports.textAligns = textAligns;
exports.textInterpolations = textInterpolations;
//# sourceMappingURL=textAlign-f41f49db.js.map
