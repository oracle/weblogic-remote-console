"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fireEvent = void 0;
var _dom = require("@testing-library/dom");
// Similar to RTL we make are own fireEvent helper that just calls DTL's fireEvent with that
// we can that any specific behaviors to the helpers we need
const fireEvent = (...args) => (0, _dom.fireEvent)(...args);
exports.fireEvent = fireEvent;
Object.keys(_dom.fireEvent).forEach(key => {
  fireEvent[key] = (elem, init) => {
    // Preact registers event-listeners in lower-case, so onPointerStart becomes pointerStart
    // here we will copy this behavior, when we fire an element we will fire it in lowercase so
    // we hit the Preact listeners.
    const eventName = `on${key.toLowerCase()}`;
    const isInElem = (eventName in elem);
    return isInElem ? _dom.fireEvent[key](elem, init) : (0, _dom.fireEvent)(elem, (0, _dom.createEvent)(key[0].toUpperCase() + key.slice(1), elem, init));
  };
});