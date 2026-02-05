# jest-preset-preact

Jest preset containing all required configuration for writing tests for [preact](https://github.com/preactjs/preact).

Features:

- Transpiles JSX to `h()`
- Aliases for `react` imports to point to `preact/compat`
- Automatically serialize Preact `VNodes` in snapshots
- Stub style imports (`.css`, `.less`, `.sass/scss`, etc)
- Add typeahead preview for filtering in jest's watch mode

## Usage

Install it via npm or yarn:

```bash
npm install --save-dev jest-preset-preact
# or via yarn
yarn add -D jest-preset-preact
```

...and add the preset to your `jest.config.js` file.

```js
// jest.config.js
module.exports = {
	preset: 'jest-preset-preact',
};
```

You can override the default Babel config by providing your own Babel config file:

```js
// babel.config.js
module.exports = {
  env: {
    test: {
      plugins: [
        [
          "@babel/plugin-transform-react-jsx",
          {
            runtime: "automatic",
            importSource: "preact"
          }
        ]
      ]
    }
  }
}
```

This, for example, would enable the runtime JSX transform instead of the classic.

## License

MIT, see [the LICENSE file](./LICENSE).
