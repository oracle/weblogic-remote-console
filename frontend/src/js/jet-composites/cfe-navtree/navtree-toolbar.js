/**
 * @license
 * Copyright (c) 2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(['knockout'],
	function (ko) {
		function renderTreeMenusAsRootNodes() {
//MLW			console.log('[NAVTREE-TOOLBAR] renderTreeMenusAsRootNodes() was called.');
		}

		function renderRootNodesAsTreeMenus() {
//MLW			console.log('[NAVTREE-TOOLBAR] renderRootNodesAsTreeMenus() was called.');
		}

		function setMenuSelectOneSelectedItem(selectedValue, navtreeViewModel) {
			// We're making an "oj-menu-select-many" behave
			// like the non-existent "oj-menu-select-one", so
			// we need to set self.themeSelectedItem observable
			// driving the menu item that is checked.
			navtreeViewModel.menuSelectOneSelectedItem([selectedValue]);
		}

		return {
			launchMoreMenu: (event) => {
				event.preventDefault();
				document.getElementById('navtreeToolbarMoreMenu').open(event);
			},
			moreMenuClickListener: (event, navtreeViewModel) => {
				if (event.target.value === 'collapseAll') {
					navtreeViewModel.expanded.clear();
					navtreeViewModel.perspectiveMemory.navtree.keySet = navtreeViewModel.expanded;
					navtreeViewModel.selectedItem(null);
				}
			},
			menuSelectOneMenuAction: (event, navtreeViewModel) => {
				// Toggle selected state 'on' and 'off'
				const selectedValue = (navtreeViewModel.menuSelectOneSelectedItem().at(0) === 'off' ? 'on' : 'off');
				if (selectedValue === 'on') {
					renderTreeMenusAsRootNodes();
				}
				else if (selectedValue === 'off') {
					renderRootNodesAsTreeMenus();
				}
				setMenuSelectOneSelectedItem(selectedValue, navtreeViewModel);
			}
		};
	}
);
