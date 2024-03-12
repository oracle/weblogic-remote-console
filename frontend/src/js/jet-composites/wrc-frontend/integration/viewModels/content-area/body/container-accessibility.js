/**
 * @license
 * Copyright (c) 2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define([
 'wrc-frontend/core/utils'
],
	function (
		CoreUtils
	) {
		function setBreadcrumbAccessKey(key) {
			const setBreadcrumbLinkDataFocusSelector = (selector) => {
				const nodeList = document.querySelectorAll(selector);
				if (nodeList !== null && nodeList.length > 0) {
					const arr = Array.from(nodeList);
					arr.forEach((node, index) => {
						if (index === 0) div.setAttribute('data-focus-selector', selector);
					});
				}
			};

			const setBreadcrumbCrossLinkDataFocusSelector = (selector) => {
				const nodeList = document.querySelectorAll(selector);
				if (nodeList !== null && nodeList.length > 0) {
					const arr = Array.from(nodeList);
					arr.forEach((node, index) => {
						if (index === 0) div.setAttribute('data-focus-selector', selector);
					});
				}
				else {
					const ojMenuButton = document.querySelector('ul.breadcrumb-crosslink li > oj-menu-button > button');
					if (ojMenuButton !== null) {
						div.setAttribute('data-focus-selector', 'ul.breadcrumb-crosslink li > oj-menu-button > button');
					}
					else {
						const anchor = document.querySelector('ul.breadcrumb-crosslink li');
						if (anchor !== null) {
							div.setAttribute('data-focus-selector', 'ul.breadcrumb-crosslink li');
						}
					}
				}
			};

			const div = document.getElementById('breadcrumbs-container');
			if (div !== null) {
				div.setAttribute('accesskey', key);

				setBreadcrumbLinkDataFocusSelector('ul.breadcrumb-link li > a');
				setBreadcrumbCrossLinkDataFocusSelector('ul.breadcrumb-crosslink li > a');
			}
		}

		function setSliceTableAccessKey(ojTable, key) {
			if (ojTable !== null) {
				const table = ojTable.querySelector('div.oj-table-scroller > table');
				if (table !== null) table.setAttribute('accesskey', key);
			}
		}

		function setFormAccessKey(formElement, key) {
			if (formElement !== null) {
				formElement.setAttribute('tabindex', '0');
				formElement.setAttribute('accesskey', key);
			}
		}

		function setTableAccessKey(ojTable, key) {
			if (ojTable !== null) {
				const table = ojTable.querySelector('div.oj-table-scroller > table');
				if (table !== null) table.setAttribute('accesskey', key);
			}
		}

	//public:
		return {
			setBreadcrumbAccessKey: setBreadcrumbAccessKey,
			setSliceTableAccessKey: setSliceTableAccessKey,
			setFormAccessKey: setFormAccessKey,
			setTableAccessKey: setTableAccessKey
		};

	}
);