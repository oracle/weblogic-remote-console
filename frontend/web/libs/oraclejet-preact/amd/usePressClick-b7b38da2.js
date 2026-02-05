define(['exports', 'preact/hooks'], (function(s,e){"use strict";const o={isDisabled:!1};s.usePressClick=function(s,i=o){const t=e.useCallback((e=>{e.stopPropagation(),s(e)}),[s]);return{pressProps:i?.isDisabled?{}:{onClick:t}}}}));
//# sourceMappingURL=usePressClick-b7b38da2.js.map
