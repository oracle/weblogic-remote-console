"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  render: true,
  cleanup: true,
  renderHook: true,
  act: true,
  fireEvent: true
};
Object.defineProperty(exports, "act", {
  enumerable: true,
  get: function () {
    return _testUtils.act;
  }
});
exports.cleanup = cleanup;
Object.defineProperty(exports, "fireEvent", {
  enumerable: true,
  get: function () {
    return _fireEvent.fireEvent;
  }
});
exports.render = render;
exports.renderHook = renderHook;
var _dom = require("@testing-library/dom");
Object.keys(_dom).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _dom[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _dom[key];
    }
  });
});
var _preact = require("preact");
var _hooks = require("preact/hooks");
var _testUtils = require("preact/test-utils");
var _fireEvent = require("./fire-event");
(0, _dom.configure)({
  asyncWrapper: async cb => {
    let result;
    await (0, _testUtils.act)(() => {
      result = cb();
    });
    return result;
  },
  eventWrapper: cb => {
    let result;
    (0, _testUtils.act)(() => {
      result = cb();
    });
    return result;
  }
});
const mountedContainers = new Set();
function render(ui, {
  container,
  baseElement = container,
  queries,
  hydrate = false,
  wrapper: WrapperComponent
} = {}) {
  if (!baseElement) {
    // Default to document.body instead of documentElement to avoid output of potentially-large
    // head elements (such as JSS style blocks) in debug output.
    baseElement = document.body;
  }
  if (!container) {
    container = baseElement.appendChild(document.createElement('div'));
  }

  // We'll add it to the mounted containers regardless of whether it's actually
  // added to document.body so the cleanup method works regardless of whether
  // they're passing us a custom container or not.
  mountedContainers.add(container);
  const wrapUiIfNeeded = innerElement => WrapperComponent ? (0, _preact.h)(WrapperComponent, null, innerElement) : innerElement;
  (0, _testUtils.act)(() => {
    if (hydrate) {
      (0, _preact.hydrate)(wrapUiIfNeeded(ui), container);
    } else {
      (0, _preact.render)(wrapUiIfNeeded(ui), container);
    }
  });
  return {
    container,
    baseElement,
    debug: (el = baseElement, maxLength, options) => Array.isArray(el)
    // eslint-disable-next-line no-console
    ? el.forEach(e => console.log((0, _dom.prettyDOM)(e, maxLength, options)))
    // eslint-disable-next-line no-console,
    : console.log((0, _dom.prettyDOM)(el, maxLength, options)),
    unmount: () => (0, _preact.render)(null, container),
    rerender: rerenderUi => {
      (0, _testUtils.act)(() => {});
      render(wrapUiIfNeeded(rerenderUi), {
        container,
        baseElement
      });
      // Intentionally do not return anything to avoid unnecessarily complicating the API.
      // folks can use all the same utilities we return in the first place that are bound to
      // the container
    },

    asFragment: () => {
      if (typeof document.createRange === 'function') {
        return document.createRange().createContextualFragment(container.innerHTML);
      } else {
        const template = document.createElement('template');
        template.innerHTML = container.innerHTML;
        return template.content;
      }
    },
    ...(0, _dom.getQueriesForElement)(baseElement, queries)
  };
}

// Maybe one day we'll expose this (perhaps even as a utility returned by render).
// but let's wait until someone asks for it.
function cleanupAtContainer(container) {
  (0, _preact.render)(null, container);
  if (container.parentNode === document.body) {
    document.body.removeChild(container);
  }
  mountedContainers.delete(container);
}
function cleanup() {
  mountedContainers.forEach(cleanupAtContainer);
}
function renderHook(renderCallback, options) {
  const {
    initialProps,
    wrapper
  } = options || {};
  const result = (0, _preact.createRef)();
  function TestComponent({
    renderCallbackProps
  }) {
    const pendingResult = renderCallback(renderCallbackProps);
    (0, _hooks.useEffect)(() => {
      result.current = pendingResult;
    });
    return null;
  }
  const {
    rerender: baseRerender,
    unmount
  } = render((0, _preact.h)(TestComponent, {
    renderCallbackProps: initialProps
  }), {
    wrapper
  });
  function rerender(rerenderCallbackProps) {
    return baseRerender((0, _preact.h)(TestComponent, {
      renderCallbackProps: rerenderCallbackProps
    }));
  }
  return {
    result,
    rerender,
    unmount
  };
}

// eslint-disable-next-line import/export