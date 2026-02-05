define(['exports', 'preact/hooks'], (function(e,o){"use strict";e.useDownToggle=function({isDisabled:e,isOpen:n,onToggle:r}){const a=o.useCallback((o=>{"ArrowDown"==o.key&&(!e&&r?.({value:!n}),o.preventDefault())}),[e,n,r]);return{triggerProps:e?{}:{onKeyDown:a,"aria-haspopup":"true","aria-expanded":n}}}}));
//# sourceMappingURL=useDownToggle-80b61b43.js.map
