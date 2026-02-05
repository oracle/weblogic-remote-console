# babel-plugin-transform-amd-to-commonjs

[![npm version](https://img.shields.io/npm/v/babel-plugin-transform-amd-to-commonjs.svg)](https://www.npmjs.com/package/babel-plugin-transform-amd-to-commonjs)
[![npm downloads](https://img.shields.io/npm/dm/babel-plugin-transform-amd-to-commonjs.svg)](https://npm-stat.com/charts.html?package=babel-plugin-transform-amd-to-commonjs)
[![build](https://github.com/msrose/babel-plugin-transform-amd-to-commonjs/actions/workflows/nodejs.yml/badge.svg)](https://github.com/msrose/babel-plugin-transform-amd-to-commonjs/actions/workflows/nodejs.yml)
[![codecov](https://codecov.io/gh/msrose/babel-plugin-transform-amd-to-commonjs/branch/master/graph/badge.svg)](https://codecov.io/gh/msrose/babel-plugin-transform-amd-to-commonjs)

Babel plugin that transforms AMD to CommonJS.
[Check out the example project](https://github.com/msrose/babel-plugin-transform-amd-to-commonjs/tree/master/examples/transform-amd-to-commonjs-example#transform-amd-to-commonjs-example), which uses this plugin to allow [jest](https://facebook.github.io/jest/) to synchronously `require` AMD modules.

## Usage

```
npm install --save-dev babel-plugin-transform-amd-to-commonjs
```

Add the transform to your .babelrc:

```
{
  "plugins": ["transform-amd-to-commonjs"]
}
```

## Examples

### Define

Input:

```javascript
define(['jquery', 'underscore', 'myModule'], function($, _) {
  // ...
  return {
    // ...
  };
});
```

Output:

```javascript
module.exports = function() {
  var $ = require('jquery');
  var _ = require('underscore');
  require('myModule');
  // ...
  return {
    // ...
  };
}();
```

### Require

Input:

```javascript
// Nested requires
require(['jquery', 'underscore', 'myModule'], function($, _) {
  // ...
  require(['anotherModule'], function(anotherModule) {
    // ...
  });
});
```

Output:

```javascript
(function() {
  var $ = require('jquery');
  var _ = require('underscore');
  require('myModule');
  // ...
  (function() {
    var anotherModule = require('anotherModule');
    // ...
  })();
})();
```

## Options 

Specify options in your .babelrc:

```
{
  "plugins": [
    ["transform-amd-to-commonjs", { "restrictToTopLevelDefine": true }]
  ]
}
```

- `restrictToTopLevelDefine`: (default: `true`) When `true`, only transform `define` calls that appear at the top-level of a program. Set to `false` to transform _all_ calls to `define`.

## Escape Hatch

If you need to ignore specific modules that are picked up by the plugin (for example, those that are erroneously detected as AMD modules), you can add an ignore comment at the top of the file:

```
/* transform-amd-to-commonjs-ignore */
define(['stuff', 'here'], function(donkeys, aruba) {
  return {
      llamas: donkeys.version,
      cows: aruba.hi
  };
});
```

The above module won't be transformed to CommonJS. The ignore comment must be at the beginning of the file and must be the only text in the comment block.

## Details

### Supported Versions

Only LTS versions of Node.js still in maintenance will be supported going forward. Older versions of the plugin may support older versions of Node.js. See the [Node.js site](https://nodejs.org/en/about/releases/) for LTS details.

While this plugin lists @babel/core@^7.0.0 as a peer dependency, it should still work fine with babel-core@^6.0.0.
Listing this peer dependency aligns with [what is done by the core babel plugins](https://babeljs.io/docs/en/v7-migration#versioning-dependencies-blog-2017-12-27-nearing-the-70-releasehtml-peer-dependencies-integrations).

### AMD

AMD is interpreted as described by the [AMD specification](https://github.com/amdjs/amdjs-api/blob/master/AMD.md).

- By default, only _top-level_ calls to a `define` function will be transformed. Use the `restrictToTopLevelDefine` option to transform calls that are not at the top-level.
- _All_ calls to `require` where it is given an array of dependencies as its first argument will be transformed.
- Explicitly requiring `require`, `module`, and `exports` in an AMD module will not generate a call to require, but instead defer to the global require, module, and exports assumed to be in the CommonJS environment you are transforming to.
  - The same is true for the [simplified CommonJS wrapper](http://requirejs.org/docs/api.html#cjsmodule).
- The module name (optional first argument to `define`) is ignored, since the module ID in CommonJS is determined by the resolved filename.

### Upgrading Versions

#### 1.5.0

Version 1.5.0 stops building against Node.js versions less than 12.x (and the built files target Node.js 12.x), so make sure you're using at least Node.js 12.x. There are no known breaking changes caused by this, but if you for some reason cannot upgrade Node.js and are running into errors, please open an issue.

#### 1.0.0

- Versions >= 0.2.1 and &lt; 1.0.0 support Node.js 4.
  1.0.0 and above only support Node.js 6 and above.
  To upgrade to >= 1.0.0, first upgrade to Node.js >= 6.
- If everything works fine with &lt; 1.0.0, you should just be able to drop in >= 1.0.0 after upgrading Node.js.
  If you have any issues, there is one more edge-case breaking change that _might_ be affecting you (but probably is not):
  - &gt;= 1.0.0 accounts for the case where you're using a combination of return statements and module/exports to define the exports of your AMD modules.
    Earlier versions don't account for this case, so if you're upgrading, make sure that each AMD module only uses either return statements _or_ module/exports to define its exports.
    See [#26](https://github.com/msrose/babel-plugin-transform-amd-to-commonjs/pull/26) and the [caveats](#injecting-require-module-or-exports-as-dependencies) section of the README for more details.

## Caveats

### One module per file

Make sure that you have only one AMD module defined per file, otherwise you'll experience strange results once transformed to the CommonJS format.

### Listing module dependencies inline (v1.6 and above)

In v1.6, require dependencies and factories with unknown types (at build time) are now supported.  The dependency list may be a function call or variable name that resolves to an array-like type at runtime.  The factory may be a function call or variable name that resolves to a function at runtime.

```javascript
require(getDeps(), myFactoryFunction);
```

will be transformed to:

```javascript
(function () {
  var maybeFunction = myFactoryFunction;
  var amdDeps = getDeps();
  if (!Array.isArray(amdDeps)) {
    return require(amdDeps);
  }
  if (typeof maybeFunction !== "function") {
    maybeFunction = function () {};
  }
  maybeFunction.apply(void 0, amdDeps.map(function (dep) {
    return {
      require: require,
      module: module,
      exports: module.exports
    }[dep] || require(dep);
  }));
}).apply(this);
```

If either the dependency list is known to be an array, or the factory is known to be a function, at build time then the associated runtime type checking for the argument is omitted from the generated code.

Calls to `define` are transformed in a similar manner, but include code for assigning the value returned by the factory function to module.exports:

```javascript
(function () {
  var maybeFunction = factory;
  var amdDeps = deps;
  if (typeof amdDeps === 'string') {
    amdDeps = ['require', 'exports', 'module'];
  }
  if (typeof maybeFunction !== "function") {
    var amdFactoryResult = maybeFunction;
    maybeFunction = function () {
      return amdFactoryResult;
    };
  }
  var amdDefineResult = maybeFunction.apply(void 0, amdDeps.map(function (dep) {
    return {
      require: require,
      module: module,
      exports: module.exports
    }[dep] || require(dep);
  }));
  typeof amdDefineResult !== "undefined" && (module.exports = amdDefineResult);
}).apply(this);
```

### Listing module dependencies inline (v1.5)

The following will _not_ be transformed, since the plugin only accounts for dependencies that are specified using an inline array literal:

```javascript
// DON'T DO THIS! It won't be transformed correctly.
var dependencies = ['one', 'two'];
define(dependencies, function(one, two) {
  one.doStuff();
  return two.doStuff();
});
```

If you want to be able to define your dependencies as above, please submit an issue. Otherwise, please define your modules as:

```javascript
define(['one', 'two'], function(one, two) {
  one.doStuff();
  return two.doStuff();
});
```

However, specifying the factory as a variable _is_ supported (but only for calls to `define`):

```javascript
// All's good! Transforming this code is supported
var factory = function(one, two) {
  one.doStuff();
  return two.doStuff();
};
define(['one', 'two'], factory);
```

A runtime check has to be done to determine what to export, so the transformed code looks like this:

```javascript
var factory = function(one, two) {
  one.doStuff();
  return two.doStuff();
};
var maybeFactory = factory;
if (typeof maybeFactory === 'function') {
  module.exports = factory(require('one'), require('two'));
} else {
  require('one');
  require('two');
  module.exports = maybeFactory;
};
```

It looks a bit weird, but it's all necessary.
Keep in mind that everything is done with static analysis, so if the factory isn't specified as an inline function literal, it's impossible to tell exactly what value it will take until runtime.

### Injecting `require`, `module`, or `exports` as dependencies

It is strongly advised to simply use return statements to define your AMD module's exports.
That being said, the plugin takes into account the cases where you may have injected them as dependencies.
Beware of the following gotchas when using this pattern:

- If you're injecting `module`, `exports`, and/or `require` as dependencies, they must be injected as string literals,
otherwise you'll end up with things like `require('module')`.
- Returning any value other than `undefined` from a factory function will override anything you assign to `module` or `exports`.
  This behaviour is in accordance with the AMD specification.
  Unless you're doing something really weird in your modules, you don't have to worry about this case, but the plugin handles it by performing a check as needed on the return value of the factory function.
  For example:

  Input (AMD):
  ```javascript
  define(['module'], function(module) {
    module.exports = { hey: 'boi' };
    return { value: 22 };
  });
  ```

  Output (CommonJS):
  ```javascript
  var amdDefineResult = function() {
    module.exports = { hey: 'boi' };
    return { value: 22 };
  }();
  typeof amdDefineResult !== 'undefined' && (module.exports = amdDefineResult);
  ```

  Note that `{ value: 22 }` is correctly exported in both cases.
  Without the `typeof amdDefineResult !== 'undefined'` check in place, `{ hey: 'boi' }` would have been erroneously exported once transformed to CommonJS, since the plugin would otherwise transform this module to just:

  ```javascript
  (function() {
    module.exports = { hey: 'boi' };
    return { value: 22 };
  })()
  ```

  This pattern is only used if necessary. The variable `amdDefineResult` is generated to be unique in its scope.

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://msrose.github.io"><img src="https://avatars3.githubusercontent.com/u/3495264?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Michael Rose</b></sub></a><br /><a href="https://github.com/msrose/babel-plugin-transform-amd-to-commonjs/commits?author=msrose" title="Code">💻</a> <a href="#example-msrose" title="Examples">💡</a> <a href="https://github.com/msrose/babel-plugin-transform-amd-to-commonjs/commits?author=msrose" title="Documentation">📖</a> <a href="https://github.com/msrose/babel-plugin-transform-amd-to-commonjs/commits?author=msrose" title="Tests">⚠️</a> <a href="#infra-msrose" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="https://jordaneldredge.com"><img src="https://avatars2.githubusercontent.com/u/162735?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jordan Eldredge</b></sub></a><br /><a href="https://github.com/msrose/babel-plugin-transform-amd-to-commonjs/commits?author=captbaritone" title="Code">💻</a> <a href="https://github.com/msrose/babel-plugin-transform-amd-to-commonjs/pulls?q=is%3Apr+reviewed-by%3Acaptbaritone" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/FransBosuil"><img src="https://avatars2.githubusercontent.com/u/10304018?v=4?s=100" width="100px;" alt=""/><br /><sub><b>FransBosuil</b></sub></a><br /><a href="https://github.com/msrose/babel-plugin-transform-amd-to-commonjs/commits?author=FransBosuil" title="Code">💻</a> <a href="https://github.com/msrose/babel-plugin-transform-amd-to-commonjs/commits?author=FransBosuil" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/bschlenk"><img src="https://avatars2.githubusercontent.com/u/1390303?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Brian Schlenker</b></sub></a><br /><a href="https://github.com/msrose/babel-plugin-transform-amd-to-commonjs/commits?author=bschlenk" title="Code">💻</a> <a href="https://github.com/msrose/babel-plugin-transform-amd-to-commonjs/issues?q=author%3Abschlenk" title="Bug reports">🐛</a> <a href="https://github.com/msrose/babel-plugin-transform-amd-to-commonjs/commits?author=bschlenk" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/apps/greenkeeper"><img src="https://avatars3.githubusercontent.com/in/505?v=4?s=100" width="100px;" alt=""/><br /><sub><b>greenkeeper[bot]</b></sub></a><br /><a href="#infra-greenkeeper[bot]" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="http://paquitosoftware.com"><img src="https://avatars3.githubusercontent.com/u/166022?v=4?s=100" width="100px;" alt=""/><br /><sub><b>PaquitoSoft</b></sub></a><br /><a href="https://github.com/msrose/babel-plugin-transform-amd-to-commonjs/issues?q=author%3APaquitoSoft" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://philostler.com"><img src="https://avatars1.githubusercontent.com/u/244198?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Phil Ostler</b></sub></a><br /><a href="https://github.com/msrose/babel-plugin-transform-amd-to-commonjs/issues?q=author%3Aphilostler" title="Bug reports">🐛</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://vaaralav.com"><img src="https://avatars0.githubusercontent.com/u/8571541?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ville Vaarala</b></sub></a><br /><a href="https://github.com/msrose/babel-plugin-transform-amd-to-commonjs/issues?q=author%3Avaaralav" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/gillyspy"><img src="https://avatars.githubusercontent.com/u/1345313?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Gerald Gillespie</b></sub></a><br /><a href="https://github.com/msrose/babel-plugin-transform-amd-to-commonjs/issues?q=author%3Agillyspy" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/chuckdumont"><img src="https://avatars.githubusercontent.com/u/273476?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Chuck Dumont</b></sub></a><br /><a href="https://github.com/msrose/babel-plugin-transform-amd-to-commonjs/commits?author=chuckdumont" title="Code">💻</a> <a href="https://github.com/msrose/babel-plugin-transform-amd-to-commonjs/commits?author=chuckdumont" title="Tests">⚠️</a> <a href="https://github.com/msrose/babel-plugin-transform-amd-to-commonjs/commits?author=chuckdumont" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
