/* @oracle/oraclejet-preact: undefined */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * This file contains valid types and string literal arrays for aria roles
 * https://www.w3.org/WAI/PF/aria/roles#role_definitions_header
 */
// Roles that act as standalone user interface components or as part of a larger composition
const widget = [
    'alertdialog',
    'button',
    'checkbox',
    'dialog',
    'gridcell',
    'link',
    'menuitem',
    'menuitemcheckbox',
    'menuitemradio',
    'option',
    'progressbar',
    'radio',
    'scrollbar',
    'slider',
    'spinbutton',
    'switch',
    'tab',
    'tabpanel',
    'textbox',
    'tooltip',
    'treeitem'
];
const button = [
    'checkbox',
    'link',
    'menuitem',
    'menuitemcheckbox',
    'menuitemradio',
    'radio',
    'switch',
    'tab'
];
// Roles that act as composite components. These roles typically act as containers that manage other, contained components.
const compositeWidget = [
    'combobox',
    'grid',
    'listbox',
    'menu',
    'menubar',
    'radiogroup',
    'tablist',
    'tree',
    'treegrid'
];
// Roles that describe structures that organize content. Document structures are not usually interactive.
const content = [
    'article',
    'columnheader',
    'definition',
    'directory',
    'document',
    'group',
    'heading',
    'img',
    'list',
    'listitem',
    'math',
    'note',
    'presentation',
    'region',
    'row',
    'rowheader',
    'separator',
    'toolbar'
];
const liveRegion = ['alert', 'log', 'marquee', 'status', 'timer'];
// Roles that act as navigational landmarks - should appear only once per page
const landmark = [
    'application',
    'banner',
    'complementary',
    'contentinfo',
    'form',
    'main',
    'navigation',
    'search'
];
Object.freeze({
    ...button,
    ...compositeWidget,
    ...content,
    ...landmark,
    ...liveRegion,
    ...widget
});

exports.button = button;
exports.compositeWidget = compositeWidget;
exports.content = content;
exports.landmark = landmark;
exports.liveRegion = liveRegion;
exports.widget = widget;
//# sourceMappingURL=UNSAFE_roles.js.map
