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
					'more': {
						iconFile: 'more-vertical-blk-24x24',
						tooltip: oj.Translations.getTranslatedString('wrc-common.tooltips.more.value')
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
			// END:   knockout observables referenced in the view file

			this.signalBindings = [];

			this.connected = function() {
				this.selectedBeanPathSubscription = this.selectedBeanPath.subscribe(function (newValue) {
					if (newValue !== null) {
						const historyEntry = this.beanPathManager.beanPathHistory().find(historyEntry => historyEntry.value === newValue);
						if (CoreUtils.isNotUndefinedNorNull(historyEntry)) {
							visitBeanPathHistoryEntry(historyEntry);
						}
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
					if (CoreUtils.isNotUndefinedNorNull(self.beanPathManager)) {
						self.beanPathManager.resetHistoryEntries(dataProvider)
							.then(result => {
								if (result.succeeded) {
									this.beanPathHistoryOptions([]);
									this.beanPathHistoryCount(0);
								}
							});
					}
				});

				self.signalBindings.push(binding);

				binding = viewParams.signaling.shoppingCartModified.add((source, eventType, changeManager, pathParam) => {
					if (CoreUtils.isNotUndefinedNorNull(self.beanPathManager)) {
						if (eventType === 'delete') self.beanPathManager.removeBeanPath(pathParam);
					}
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
				}

				if (CoreUtils.isNotUndefinedNorNull(beanTree)) {
					if (CoreUtils.isUndefinedOrNull(this.beanPathManager)) {
						// This means we need to create a BeanPathManager using
						// the beanTree function argument. The second constructor
						// argument is the knockout observable that will hold the
						// count of history entries. The beanPathManager is a
						// module-scoped variable, but it's methods have access
						// to data that is provider-scoped. This means that the
						// second constructor argument will be getting updated
						// with a provider-scoped value.
						this.beanPathManager = new BeanPathManager(beanTree, this.beanPathHistoryCount);
						// Next, we need to use the new BeanPathHistory instance
						// to call function that sets the knockout observables
						// referenced in the view file.
						setBeanPathHistoryObservables(this.beanPathManager);
					}

					// The beanPathManager module-scoped variable will not be
					// undefined, but it may have a beanTree that's different
					// from the beanTree passed as a function parameter.
					if (this.beanPathManager.beanTree.type !== beanTree.type) {
						// Here, we also need to create a BeanPathManager using
						// the beanTree function argument.
						this.beanPathManager = new BeanPathManager(beanTree, this.beanPathHistoryCount);
						// We also need to call function that sets the knockout
						// observables referenced in the view file.
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

			this.hiddenAccessKeyClickHandler = (event) => {
				const state = getComputedStyle(document.documentElement).getPropertyValue('--beanpath-history-container-calc-display');
				if (state === 'inline-flex') {
					const selector = '#beanpath-history-entries input.oj-combobox-input';
					const input = document.querySelector(selector);
					if (input !== null) input.focus();
				}
			};

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

			function visitBeanPathHistoryEntry(historyEntry) {
				const perspective = PerspectiveManager.getById(historyEntry.perspective.id);

				if (self.beanPathManager.beanTree.type === perspective.id) {
					ViewModelUtils.goToRouterPath(viewParams.parentRouter, `/${perspective.id}/${encodeURIComponent(historyEntry.value)}`, self.canExitCallback);
				}
				else {
					if (CoreUtils.isNotUndefinedNorNull(perspective)) {
						ViewModelUtils.abandonUnsavedChanges('exit', self.canExitCallback)
							.then(reply => {
								if (reply) {
									ViewModelUtils.setPreloaderVisibility(true);
									DataOperations.mbean.test(historyEntry.value)
										.then(reply => {
											viewParams.signaling.perspectiveSelected.dispatch(perspective);
											viewParams.parentRouter.go(`/${perspective.id}/${encodeURIComponent(historyEntry.value)}`);
											viewParams.signaling.galleryItemSelected.dispatch(perspective.id);
										})
										.catch(response => {
											if (response.failureType === CoreTypes.FailureType.CBE_REST_API) {
												MessageDisplaying.displayMessage(
													{
														severity: 'info',
														summary: event.target.attributes['data-notFoundMessage'].value
													},
													2500
												);
											}
											else {
												ViewModelUtils.failureResponseDefaultHandling(response);
											}
										})
										.finally(() => {
											ViewModelUtils.setPreloaderVisibility(false);
										});
								}
							})
							.catch(failure => {
								ViewModelUtils.failureResponseDefaultHandling(failure);
							});
					}
				}
			}

		}

		return RecentPages;
	}
);