/**
 Copyright (c) 2024, Oracle and/or its affiliates.
 Licensed under The Universal Permissive License (UPL), Version 1.0
 as shown at https://oss.oracle.com/licenses/upl/
 */

'use strict';

define([
	'ojs/ojcore',
	'knockout',
	'wrc-frontend/apis/data-operations',
	'wrc-frontend/apis/message-displaying',
	'wrc-frontend/microservices/provider-management/data-provider-manager',
	'wrc-frontend/microservices/perspective/perspective-manager',
	'wrc-frontend/microservices/beanpath/beanpath-manager',
	'wrc-frontend/microservices/page-definition/utils',
	'wrc-frontend/integration/viewModels/utils',
	'wrc-frontend/core/types',
	'wrc-frontend/core/utils',
	'ojs/ojknockout',
	'ojs/ojselectcombobox',
	'ojs/ojmenu'
],
	function (
		oj,
		ko,
		DataOperations,
		MessageDisplaying,
		DataProviderManager,
		PerspectiveManager,
		BeanPathManager,
		PageDefinitionUtils,
		ViewModelUtils,
		CoreTypes,
		CoreUtils
	) {
		function RecentPages(viewParams) {
			const self = this;

			this.i18n = {
				icons: {
					'history': {
						iconFile: 'beanpath-history-icon-blk_24x24',
						tooltip: oj.Translations.getTranslatedString('wrc-perspective.icons.history.tooltip')
					},
					'recentpages': {
						id: 'recent-pages', iconFile: ko.observable('toggle-beanpath-history-on-blk_24x24'), disabled: ko.observable(false), visible: ko.observable(false),
						label: oj.Translations.getTranslatedString('wrc-common.tooltips.recentPages.value')
					},
					'separator': {
						iconFile: 'more-vertical-blk-24x24',
						tooltip: oj.Translations.getTranslatedString('wrc-perspective.icons.separator.tooltip')
					}
				},
				menus: {
					history: {
						'clear': {
							id: 'clear-history',
							iconFile: 'erase-icon-blk_24x24',
							disabled: false,
							value: oj.Translations.getTranslatedString('wrc-perspective.menus.history.clear.value'),
							label: oj.Translations.getTranslatedString('wrc-perspective.menus.history.clear.label')
						}
					}
				}
			};

			// START: knockout observables referenced in view file
			this.selectedBeanPath = ko.observable();
			this.beanPathHistoryCount = ko.observable(0);
			this.beanPathManager = undefined;
			this.beanPathHistoryOptions = ko.observable([]);
			// END:   knockout observables referenced in view file

			this.signalBindings = [];

			this.connected = function() {
				this.selectedBeanPathSubscription = this.selectedBeanPath.subscribe(function (newValue) {
					if (newValue !== null) {
						viewParams.signaling.selectedBeanPathChanged.dispatch(newValue);
						this.selectedBeanPath(null);
					}
				}.bind(this));

				let binding = viewParams.signaling.beanPathAdded.add((pathParam, breadcrumbLabels, beanTree) => {
					if (CoreUtils.isNotUndefinedNorNull(beanTree)) {
						this.setBeanTree(beanTree);
						this.beanPathManager.addBeanPath(pathParam, breadcrumbLabels);
						this.beanPathHistoryOptions(this.beanPathManager.getHistoryEntries());
					}
				});

				self.signalBindings.push(binding);
				
				binding = viewParams.signaling.dataProviderRemoved.add(dataProvider => {
					self.beanPathManager.resetHistoryEntries(dataProvider)
						.then(result => {
							if (result.succeeded) {
								this.beanPathHistoryOptions([]);
								this.beanPathHistoryCount(0);
							}
						});
				});
				
				self.signalBindings.push(binding);
				
				binding = viewParams.signaling.shoppingCartModified.add((source, eventType, changeManager, pathParam) => {
					if (eventType === 'delete') self.beanPathManager.removeBeanPath(pathParam);
				});
				
				self.signalBindings.push(binding);
				
				binding = viewParams.signaling.unsavedChangesDetected.add((exitFormCallback) => {
					self.canExitCallback = exitFormCallback;
				});
				
				self.signalBindings.push(binding);

			}.bind(this);
			
			this.disconnected = function () {
				let dispose = function (obj) {
					if (obj && typeof obj.dispose === 'function') {
						obj.dispose();
					}
				};
				
				dispose(this.selectedBeanPathSubscription);
				
				// Detach all signal "add" bindings.
				self.signalBindings.forEach(binding => { binding.detach(); });

				self.signalBindings = [];
			}.bind(this);

			this.launchMoreMenu = function (event) {
				event.preventDefault();
				document.getElementById('moreMenu').open(event);
			}.bind(this);

			this.moreMenuClickListener = function (event) {
				if (event.target.value === 'clear') {
					this.beanPathManager.resetHistoryEntries()
						.then(result => {
							if (result.succeeded) {
								this.beanPathHistoryOptions([]);
								this.beanPathHistoryCount(0);
							}
						});
				}
			}.bind(this);
			// END:   knockout observables referenced in view file

			this.setBeanTree = function(beanTree) {
				function setBeanPathHistoryObservables(beanPathManager) {
					const historyEntries = beanPathManager.getHistoryEntries();
					self.beanPathHistoryOptions(historyEntries);
					self.beanPathHistoryCount(historyEntries.length);
				}

				if (CoreUtils.isNotUndefinedNorNull(beanTree)) {
					if (CoreUtils.isUndefinedOrNull(this.beanPathManager)) {
						this.beanPathManager = new BeanPathManager(beanTree, this.beanPathHistoryCount);
						setBeanPathHistoryObservables(this.beanPathManager);
					}

					if (this.beanPathManager.beanTree.type !== beanTree.type) {
						this.beanPathManager = new BeanPathManager(beanTree, this.beanPathHistoryCount);
						setBeanPathHistoryObservables(this.beanPathManager);
					}
				}
			}.bind(this);

			this.getHistoryOption = function(value) {
				return this.beanPathManager.findHistoryEntry(value);
			}.bind(this);

			this.onIconbarIconClicked = function (visible) {
				setIconbarIconToggleState('--beanpath-history-container-calc-display', visible);
			}.bind(this);

			function setIconbarIconToggleState(cssVariableName, visible) {
				// Declare return variable using default values
				const toggleState = {previousValue: undefined, value: undefined};
				// Get current value of cssVariableName, which will
				// be treated as the "previous" value.
				toggleState.previousValue = ViewModelUtils.getCustomCssProperty(cssVariableName);
				// Just use the value assigned to visible parameter
				// to compute "current" value, don't negate it.
				toggleState.value = (visible ? 'inline-flex' : 'none');
				// cssVariableName is tied to a "display" attribute
				// in the CSS stylesheet, so updating it will cause
				// an element to become visible or hidden.
				ViewModelUtils.setCustomCssProperty(cssVariableName, toggleState.value);
				// Change knockout observable for the iconFile, based
				// on toggleState.value;
				self.i18n.icons.recentpages.iconFile(toggleState.value === 'inline-flex' ? 'toggle-beanpath-history-off-blk_24x24' : 'toggle-beanpath-history-on-blk_24x24');
				// Set focus to dropdown, if it is visible
				if (visible) $('#beanpath-history-entries').focus();
				viewParams.signaling.beanPathHistoryToggled.dispatch('recent-pages', visible);
			}

		}

		return RecentPages;
	}
);