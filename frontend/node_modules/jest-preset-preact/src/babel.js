const babelJest = require('babel-jest');
const babel = require('@babel/core');

// Use config file if present.
const config = babel.loadPartialConfig();

module.exports = babelJest.default.createTransformer({
	presets: [
		[
			'@babel/preset-typescript',
			{
				jsxPragma: 'h',
				jsxPragmaFrag: 'Fragment',
			},
		],
		'@babel/preset-env',
	],
	plugins: [
		[
			'@babel/plugin-transform-react-jsx',
			{
				pragma: 'h',
				pragmaFrag: 'Fragment',
			},
		],
		'@babel/plugin-proposal-class-properties',
	],
	babelrc: false,
	configFile: false,
	overrides: config.files.size ? [config.options] : [],
});
