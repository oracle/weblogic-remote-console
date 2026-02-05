/* @oracle/oraclejet-preact: undefined */
import './flexbox.styles.css';
import { c as createSprinkles } from './vanilla-extract-sprinkles-createRuntimeSprinkles.esm-2d655d37.js';

var directions = ['row','column'];
var flexbox = createSprinkles({conditions:undefined,styles:{direction:{mappings:['flexDirection']},wrap:{mappings:['flexWrap']},flexDirection:{values:{row:{defaultClass:'flexbox_flexDirection_row__13x6ak30'},column:{defaultClass:'flexbox_flexDirection_column__13x6ak31'}}},flexWrap:{values:{nowrap:{defaultClass:'flexbox_flexWrap_nowrap__13x6ak32'},wrap:{defaultClass:'flexbox_flexWrap_wrap__13x6ak33'},reverse:{defaultClass:'flexbox_flexWrap_reverse__13x6ak34'},inherit:{defaultClass:'flexbox_flexWrap_inherit__13x6ak35'},initial:{defaultClass:'flexbox_flexWrap_initial__13x6ak36'}}}}});
var wraps = ['nowrap','wrap','reverse','inherit','initial'];

const flexboxInterpolations = {
    direction: ({ direction }) => direction === undefined
        ? {}
        : {
            class: flexbox({ direction })
        },
    wrap: ({ wrap }) => wrap === undefined
        ? {}
        : {
            class: flexbox({ wrap })
        }
};

export { directions as d, flexboxInterpolations as f, wraps as w };
//# sourceMappingURL=flexbox-529f25da.js.map
