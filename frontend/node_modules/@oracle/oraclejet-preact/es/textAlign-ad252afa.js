/* @oracle/oraclejet-preact: undefined */
import './text.styles.css';
import { c as createSprinkles } from './vanilla-extract-sprinkles-createRuntimeSprinkles.esm-2d655d37.js';

var textAlign = createSprinkles({conditions:undefined,styles:{textAlign:{values:{start:{defaultClass:'text_textAlign_start__1h8gevb0'},end:{defaultClass:'text_textAlign_end__1h8gevb1'},right:{defaultClass:'text_textAlign_right__1h8gevb2'}}}}});
var textAligns = ['start','end','right'];

const textInterpolations = {
    textAlign: ({ textAlign: textAlign$1 }) => textAlign$1 === undefined ? {} : { class: textAlign({ textAlign: textAlign$1 }) }
};

export { textAligns as a, textInterpolations as t };
//# sourceMappingURL=textAlign-ad252afa.js.map
