/* @oracle/oraclejet-preact: undefined */
'use strict';


var vanillaExtractSprinklesCreateRuntimeSprinkles_esm = require('./vanilla-extract-sprinkles-createRuntimeSprinkles.esm-d68f3e0f.js');

var flexitemAlignSelf = vanillaExtractSprinklesCreateRuntimeSprinkles_esm.createSprinkles({conditions:undefined,styles:{alignSelf:{values:{baseline:{defaultClass:'flexitem_alignSelf_baseline__1b6a9hn0'},center:{defaultClass:'flexitem_alignSelf_center__1b6a9hn1'},end:{defaultClass:'flexitem_alignSelf_end__1b6a9hn2'},start:{defaultClass:'flexitem_alignSelf_start__1b6a9hn3'},inherit:{defaultClass:'flexitem_alignSelf_inherit__1b6a9hn4'},initial:{defaultClass:'flexitem_alignSelf_initial__1b6a9hn5'},stretch:{defaultClass:'flexitem_alignSelf_stretch__1b6a9hn6'}}}}});
var flexitemAlignSelfs = ['baseline','center','end','start','inherit','initial','stretch'];

const flexitemInterpolations = {
    alignSelf: ({ alignSelf }) => alignSelf === undefined
        ? {}
        : {
            class: flexitemAlignSelf({ alignSelf })
        },
    flex: ({ flex }) => (flex === undefined ? {} : { flex }),
    order: ({ order }) => (order === undefined ? {} : { order })
};

exports.flexitemAlignSelfs = flexitemAlignSelfs;
exports.flexitemInterpolations = flexitemInterpolations;
//# sourceMappingURL=flexitem-fee13e26.js.map
