# @oracle/oraclejet-preact

Oracle JET components built using [Preact](https://preactjs.com).

Note that by default, `oraclejet-preact` is distributed in production mode
(minified, with source maps), and is available in three module formats:

- `es` The preferred format for consumption/bundling
- `amd` For RequireJS use
- `cjs` For NodeJS-based testing

## Usage

```javascript
import { Avatar } from '@oracle/oraclejet-preact/UNSAFE_Avatar';

export default () => &lt;Avatar initials="OJP" />;
```

## Bundling

If you're using a bundler that supports [subpath exports](https://nodejs.org/api/packages.html#subpath-exports)
(such as [Webpack 5](https://webpack.js.org/guides/package-exports/)), then it should automatically find the correct distribution
to use. If not, then you will need to configure this manually:

**Webpack 4**

```javascript
module.exports = {
  resolve: {
    alias: {
      '@oracle/oraclejet-preact': '@oracle/oraclejet-preact/es'
    }
  }
};
```

**AMD**

```javascript
requirejs.config({
  paths: {
    '@oracle/oraclejet-preact': './node_modules/@oracle/oraclejet-preact/amd'
  }
});
```

### CSS

`oraclejet-preact` components are modular, and each may have associated CSS
that's needed to make the UI functional. Depending on the module used, some
components may contain imports such as

```javascript
// ES module
import './Component.css';
```

or

```javascript
// AMD module
define(['exports', 'css!./Component.css']);
```

When bundling the component, you must configure your bundler to correctly import
the CSS.

#### Webpack

See Webpack's documentation on using [css-loader](https://webpack.js.org/loaders/css-loader/)
to load and serve CSS.
If your application is TS/ES-based, it's recommended to use `oraclejet-preact`'s
ES distribution found under `@oracle/oraclejet-preact/es`.

> _**Warning**_
>
> _Webpack may not complain when importing different formats into
> a single bundle, but this will cause silent failures with CSS imports. Whenever
> possible, use a single module format._

#### RequireJS

If bundling or running with RequireJS, use
[require-css](https://github.com/guybedford/require-css) plugin. Components which import
CSS will precede the file name with `css!`, which triggers the plugin. You must
use `oraclejet-preact`'s AMD distribution found under `@oracle/oraclejet-preact/amd`.

## Testing

`oraclejet-preact` supports NodeJS-based testing by distributing a CommonJS version
of the code that has been stripped of CSS imports. For libraries that support
subpath exports, this should be automatically mapped. Otherwise, configure it to
use the `cjs` directory.

**Jest**

```json
{
  "moduleNameMapper": {
    "@oracle/oraclejet-preact/(.*)": "@oracle/oraclejet-preact/cjs/$1"
  }
}
```
