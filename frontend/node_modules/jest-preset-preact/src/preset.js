const preact = require('preact');
const path = require('path');

const isVersion10 = preact.Fragment !== undefined;
const compat = isVersion10 ? 'preact/compat' : 'preact-compat';

const mappedModules = {
	'^react/jsx-runtime$': 'preact/jsx-runtime',
	'^react-dom$': compat,
	'^react$': compat,
	// Noop style files
	'^.+\\.(css|sass|scss|less)$': 'identity-obj-proxy',
};

if (isVersion10) {
	mappedModules['^react-dom/test-utils$'] = 'preact/test-utils';
}

module.exports = {
	setupFiles: [path.resolve(__dirname, 'polyfills.js')],

	collectCoverageFrom: ['src/**/*.{mjs,js,jsx,ts,tsx}', '!src/**/*.d.ts'],

	// Aliasing
	moduleNameMapper: mappedModules,

	// Transpiling
	transform: {
		'^.+\\.(mjs|js|jsx|ts|tsx)$': path.resolve(__dirname, 'babel.js'),
	},
	transformIgnorePatterns: [
		'[/\\\\]node_modules[/\\\\].+\\.(mjs|js|jsx|ts|tsx)$',
		'^.+\\.(css|sass|scss|less)$',
	],

	// Serialize Preact VNodes to strings for `toMatchSnapshot()`
	snapshotSerializers: [path.resolve(__dirname, 'serializer')],

	// Display dynamice preview of matched files during watch mode
	watchPlugins: [
		'jest-watch-typeahead/filename',
		'jest-watch-typeahead/testname',
	],

	// Default is "node", but we need browser APIs
	testEnvironment: 'jsdom',

	// Load node build, not the browser build
	// https://github.com/preactjs/preact/pull/3634#discussion_r930171882
	testEnvironmentOptions: {
		customExportConditions: [
			"node",
			"node-addons"
		]
	},
};
