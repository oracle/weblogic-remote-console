/**
 Copyright (c) 2024, 2025, Oracle and/or its affiliates.
 Licensed under The Universal Permissive License (UPL), Version 1.0
 as shown at https://oss.oracle.com/licenses/upl/
 */

'use strict';

define([
			'ojs/ojcore',
			'knockout',
			'ojs/ojarraydataprovider',
			'ojs/ojknockout-keyset',
			'./pages-history-dialog',
			'./pages-bookmark-dialog',
			'wrc-frontend/apis/data-operations',
			'wrc-frontend/apis/message-displaying',
			'wrc-frontend/microservices/provider-management/data-provider-manager',
			'wrc-frontend/microservices/perspective/perspective-manager',
			'wrc-frontend/microservices/beanpath/beanpath-manager',
			'wrc-frontend/microservices/pages-history/pages-history-manager',
			'wrc-frontend/microservices/pages-history/pages-bookmark-manager',
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
				ArrayDataProvider,
				ojkeyset_1,
				PagesHistoryDialog,
				PagesBookmarkDialog,
				DataOperations,
				MessageDisplaying,
				DataProviderManager,
				PerspectiveManager,
				BeanPathManager,
				PagesHistoryManager,
				PagesBookmarkManager,
				PageDefinitionUtils,
				ViewModelUtils,
				CoreTypes,
				CoreUtils
		) {
			function PagesHistory(viewParams) {
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
					},
					'buttons': {
						'clear': { disabled: ko.observable(false),
							'label': ko.observable(oj.Translations.getTranslatedString('wrc-common.buttons.clear.label'))
						},
						'reset': { disabled: ko.observable(false),
							'label': ko.observable(oj.Translations.getTranslatedString('wrc-common.buttons.reset.label'))
						},
						'apply': { disabled: ko.observable(false),
							'label': ko.observable(oj.Translations.getTranslatedString('wrc-common.buttons.apply.label'))
						},
						'close': { disabled: false,
							'label': oj.Translations.getTranslatedString('wrc-common.buttons.close.label')
						}
					},
					'tooltips': {
						'delete': {
							value: oj.Translations.getTranslatedString('wrc-common.tooltips.delete.value')
						}
					},
					'dialog': {
						'title': ko.observable(''),
						'instructions': ko.observable(''),
						'nameLabel': ko.observable(''),
						'fileLabel': ko.observable(''),
						'iconFile': ko.observable(''),
						'tooltip': ko.observable('')
					}
				};

				// START: knockout observables referenced in view file
				this.selectedBeanPath = ko.observable();
				this.beanPathHistoryCount = ko.observable(0);
				this.beanPathManager = undefined;
				this.beanPathHistoryOptions = ko.observable([]);
				this.getColumnData = function(key) {
					const columnData= [
						{
							'headerText': oj.Translations.getTranslatedString('wrc-recently-visited.labels.tree.value'),
							'headerStyle': 'font-weight:bold;text-align:left;min-width: 10em; width: 10em;',
							'style': 'white-space:normal;padding:5px;min-width: 10em; width: 10em;',
							'name': 'tree',
							'field': 'tree',
							'sortable': 'disabled',
							'resizable': 'enabled'
						},
						{
							'headerText': oj.Translations.getTranslatedString('wrc-recently-visited.labels.page.value'),
							'headerStyle': 'font-weight:bold;text-align:left;min-width: 18.75em; width: 18.75em;',
							'style': 'white-space:normal;padding:5px;min-width: 18.75em; width: 18.75em;',
							'name': 'page',
							'field': 'page',
							'sortable': 'disabled',
							'resizable': 'enabled'
						},
						{
							'headerText': oj.Translations.getTranslatedString('wrc-recently-visited.labels.tab.value'),
							'headerStyle': 'font-weight:bold;text-align:left;min-width: 8em; width: 8em;',
							'style': 'white-space:normal;padding:5px;min-width: 8em; width: 8em;',
							'name': 'tab',
							'field': 'tab',
							'sortable': 'disabled',
							'resizable': 'enabled'
						}
					];
					if (key === 'pagesBookmark') {
						columnData.unshift(	{
							'headerText': '',
							'headerStyle': 'font-weight:bold;text-align:left;min-width: 2em; width: 2em;',
							'style': 'white-space:normal;padding:5px;min-width: 2em; width: 2em;',
							'name': '_position',
							'field': '_position',
							'sortable': 'disabled',
							'resizable': 'enabled'
						});
					}
					return columnData;
				};

				this.selectedRows = new ojkeyset_1.ObservableKeySet();
				this.recently_visited = ko.observableArray([]);
				this.pagesHistoryDataProvider = new ArrayDataProvider(
						self.recently_visited,
						{keyAttributes: '_position'}
				);

				this.pages_bookmarked = ko.observableArray([]);
				this.pagesBookmarkDataProvider = new ArrayDataProvider(
						self.pages_bookmarked,
						{keyAttributes: '_value'}
				);

				// END:   knockout observables referenced in the view file

				this.deleted_bookmark_values = [];
				this.signalBindings = [];

				this.connected = function() {
					this.selectedBeanPathSubscription = this.selectedBeanPath.subscribe(function (newValue) {
						if (newValue !== null) {
							const items = PagesHistoryManager.findPagesHistoryItems(newValue);
							if (items.length > 0) {
								const item = items.at(-1);
								performNavigateToAction(item.position);
							}
							this.selectedBeanPath(null);
						}
					}.bind(this));

					let binding = viewParams.signaling.beanPathAdded.add((pathParam, breadcrumbLabels, beanTree) => {
						setUndefinedBeanTree(beanTree);

						if (PagesHistoryManager.getPagesHistoryCurrentAction() === 'route') {
							addPagesHistoryItem(pathParam, breadcrumbLabels, {id: beanTree.type});
							const newItem = PagesHistoryManager.getPagesHistoryCurrentItem();
							this.beanPathManager.addBeanPath(pathParam, breadcrumbLabels, newItem.position);
							this.beanPathHistoryOptions(this.beanPathManager.getHistoryEntries());
						}
					});

					self.signalBindings.push(binding);

					binding = viewParams.signaling.beanPathDeleted.add((pathParam) => {
						deleteBeanPath(pathParam);
					});

					self.signalBindings.push(binding);

					binding = viewParams.signaling.dataProviderRemoved.add(dataProvider => {
						setUndefinedBeanTree();

						if (CoreUtils.isNotUndefinedNorNull(self.beanPathManager)) {
							self.beanPathManager.resetHistoryEntries(dataProvider)
									.then(result => {
										if (result.succeeded) {
											this.beanPathHistoryOptions([]);
											this.beanPathHistoryCount(0);
											PagesHistoryManager.resetPagesHistoryData();
											viewParams.signaling.pagesHistoryChanged.dispatch('reset');
										}
									});
						}
					});

					self.signalBindings.push(binding);

					binding = viewParams.signaling.shoppingCartModified.add((source, eventType, changeManager, pathParam) => {
						setUndefinedBeanTree();

						if (CoreUtils.isNotUndefinedNorNull(self.beanPathManager)) {
							if (eventType === 'delete') {
								const removedPagesHistoryItems = PagesHistoryManager.deletePagesHistoryItem(pathParam);
								if (removedPagesHistoryItems.length > 0) {
									self.beanPathManager.removeHistoryEntries(removedPagesHistoryItems);
									setBeanPathHistoryObservables(self.beanPathManager);
								}
								viewParams.signaling.pagesHistoryChanged.dispatch('delete');
							}
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

				this.onOjFocus = function (event) {
					function highlightPagesHistoryEntry(nodeList) {
						const historyEntry = PagesHistoryManager.getPagesHistoryCurrentItem();
						const entryIndex = self.recently_visited().findIndex(item => item._position === historyEntry.position);
						if (entryIndex !== -1) {
							const node = nodeList[entryIndex];
							$(node)
									.css({ 'background-color': '#e4f1f7', 'border-top': '2px solid #217e9e', 'border-bottom': '2px solid #217e9e' })		// '#d9d9d9', '#b3d7ff', '#d9d9d9', '#ffd7de'
									.focus()
							;
						}
					}

					const nodeList = document.querySelectorAll('#pages-history-table > div.oj-table-scroller > table > tbody > tr');
					if (nodeList !== null) highlightPagesHistoryEntry(nodeList);
				};

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
										PagesHistoryManager.resetPagesHistoryData();
										viewParams.signaling.pagesHistoryChanged.dispatch('reset');
									}
								});
					}
				}.bind(this);

				this.launchPagesBookmarkMenu = function (event) {
					event.preventDefault();
					document.getElementById('pagesBookmarkMenu').open(event);
				}.bind(this);

				this.pagesBookmarkMenuClickListener = function (event) {
					if (event.target.value === 'addBookmark') {
						if (PagesHistoryManager.isBookmarkAllowed()) {
							const historyEntry = PagesHistoryManager.getPagesHistoryCurrentItem();
							if (CoreUtils.isNotUndefinedNorNull(historyEntry)) {
								const isBookmarked = PagesBookmarkManager.hasPagesBookmark(historyEntry);
								if (isBookmarked) {
									MessageDisplaying.displayMessage({
										severity: 'info',
										summary: oj.Translations.getTranslatedString('wrc-pages-bookmark.messages.pageAlreadyBookmarked.summary')
									}, 2500);
								}
								else {
									DataOperations.bookmarks.create(historyEntry)
											.then((reply) => {
												const provider = DataProviderManager.getLastActivatedDataProvider();
												// The reply JSON object contains all the bookmarks, so
												// use that to update the in-memory array of "bookmark"
												// JS objects.
												PagesBookmarkManager.setPagesBookmarkData(reply.body.data, provider);
											})
											.then(() => {
												// Display confirmation popup message
												MessageDisplaying.displayMessage({
													severity: 'confirmation',
													summary: oj.Translations.getTranslatedString('wrc-pages-bookmark.messages.pagesBookmarkAdded.summary')
												}, 2500);
											})
											.then(() => {
												viewParams.signaling.pagesBookmarkChanged.dispatch('bookmark-added');
											})
											.catch(response => {
												if (response.failureType === CoreTypes.FailureType.CBE_REST_API) {
													MessageDisplaying.displayResponseMessages(response.body.messages);
												}
												else {
													ViewModelUtils.failureResponseDefaultHandling(response);
												}
											});
								}
							}
						}
					}
					else if (event.target.value === 'showBookmarks') {
						showPagesBookmarkDialog();
					}

				}.bind(this);

				this.setBeanTree = function(beanTree) {
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

				function selectPagesHistoryItem(newValue) {
					let item;
					if (newValue !== null) {
						const items = PagesHistoryManager.findPagesHistoryItems(newValue);
						if (items.length > 0) {
							item = items.at(-1);
						}
					}
					return item;
				}

				this.getHistoryOption = function(value) {
					return this.beanPathManager.findHistoryEntry(value);
				}.bind(this);

				function landingPageCardsPresent() {
					return (document.getElementById('landing-page-cards') !== null);
				}

				function deleteBeanPath(pathParam) {
					setUndefinedBeanTree();

					if (CoreUtils.isNotUndefinedNorNull(self.beanPathManager)) {
						const removedPagesHistoryItems = PagesHistoryManager.deletePagesHistoryItem(pathParam);
						if (removedPagesHistoryItems.length > 0) {
							self.beanPathManager.removeHistoryEntries(removedPagesHistoryItems);
							setBeanPathHistoryObservables(self.beanPathManager);
							const historyEntry = PagesHistoryManager.getPagesHistoryCurrentItem();
							if (CoreUtils.isNotUndefinedNorNull(historyEntry)) {
								let detail =  oj.Translations.getTranslatedString('wrc-recently-visited.messages.pageNoLongerExists.detail2', PageDefinitionUtils.getPathParamsMBeanName(pathParam));
								if (!landingPageCardsPresent()) {
									detail = `${oj.Translations.getTranslatedString('wrc-recently-visited.messages.pageNoLongerExists.detail1', PageDefinitionUtils.getBreadcrumbsLabel(historyEntry.value, historyEntry.breadcrumbLabels))} ${detail}`;
									ViewModelUtils.goToRouterPath(viewParams.parentRouter, `/${historyEntry.perspective.id}/${encodeURIComponent(historyEntry.value)}`, self.canExitCallback);
								}

								MessageDisplaying.displayMessage({
									severity: 'info',
									summary: oj.Translations.getTranslatedString('wrc-recently-visited.messages.pageNoLongerExists.summary'),
									detail: detail
								}, 15000);
							}
							viewParams.signaling.pagesHistoryChanged.dispatch('delete');
						}
					}

				}

				function setUndefinedBeanTree(beanTree = viewParams.beanTree) {
					if (CoreUtils.isUndefinedOrNull(self.beanPathManager)) {
						self.setBeanTree(beanTree);
					}
				}

				function setBeanPathHistoryObservables(beanPathManager) {
					const historyEntries = beanPathManager.getHistoryEntries();
					self.beanPathHistoryOptions(historyEntries);
				}

				function addPagesHistoryItem(pathParam, breadcrumbLabels, perspective) {
					const provider = DataProviderManager.getLastActivatedDataProvider();
					PagesHistoryManager.addPagesHistoryItem(pathParam, breadcrumbLabels, provider, perspective);
				}

				function performNavigateToAction(newPosition) {
					PagesHistoryManager.setPagesHistoryCurrentAction('navigate.to');
					const historyEntry = PagesHistoryManager.performNavigateToAction(newPosition);
					if (CoreUtils.isNotUndefinedNorNull(historyEntry)) {
						visitBeanPathHistoryEntry(historyEntry);
					}
				}

				this.onIconbarIconClicked = function (visible) {
					setIconbarIconToggleState('--beanpath-history-container-calc-display', visible);
				}.bind(this);

				this.pagesHistoryIconClicked = function (event) {
					const firstElementChild = event.target.firstElementChild;
					const iconId = (firstElementChild === null ? event.target.id : firstElementChild.getAttribute('id'));

					if (iconId === 'pages-history-back-icon' && PagesHistoryManager.isBackAllowed()) {
						PagesHistoryManager.setPagesHistoryCurrentAction('navigate.back');
						const historyEntry = PagesHistoryManager.performNavigateBackAction();
						if (CoreUtils.isNotUndefinedNorNull(historyEntry)) {
							setUndefinedBeanTree();
							visitBeanPathHistoryEntry(historyEntry);
						}
					}
					else if (iconId === 'pages-history-next-icon' && PagesHistoryManager.isNextAllowed()) {
						PagesHistoryManager.setPagesHistoryCurrentAction('navigate.next');
						const historyEntry = PagesHistoryManager.performNavigateNextAction();
						if (CoreUtils.isNotUndefinedNorNull(historyEntry)) {
							setUndefinedBeanTree();
							visitBeanPathHistoryEntry(historyEntry);
						}
					}
					else if (iconId === 'pages-history-launch-icon') {
						if (PagesHistoryManager.isLaunchAllowed()) {
							showPagesHistoryDialog();
						}
					}
				}.bind(this);

				this.onSelectedChangedPagesHistory = function (event) {
					function getSelectedRowKeyValue() {
						let keyValue = null;
						if (self.selectedRows() !== null && self.selectedRows().values().size > 0) {
							self.selectedRows().values().forEach((key) => { keyValue = key; });
						}
						return keyValue;
					}

					if (event.type === 'selectedChanged') {
						const rowKeyValue = getSelectedRowKeyValue();

						if (rowKeyValue !== null) {
							const pagesHistoryDialog = document.getElementById('recentlyVisitedPagesDialog');
							if (pagesHistoryDialog !== null) {
								if (pagesHistoryDialog.isOpen()) pagesHistoryDialog.close();
							}

							PagesHistoryManager.setPagesHistoryCurrentAction('navigate.to');
							const historyEntry = PagesHistoryManager.performNavigateToAction(rowKeyValue);
							if (CoreUtils.isNotUndefinedNorNull(historyEntry)) {
								setUndefinedBeanTree();
								visitBeanPathHistoryEntry(historyEntry);
							}

							this.selectedRows(null);
						}

					}
				}.bind(this);

				this.onSelectedChangedPagesBookmark = function (event) {
					function getSelectedRowKeyValue() {
						let keyValue = null;
						if (self.selectedRows() !== null && self.selectedRows().values().size > 0) {
							self.selectedRows().values().forEach((key) => { keyValue = key; });
						}
						return keyValue;
					}

					if (event.type === 'selectedChanged') {
						const rowKeyValue = getSelectedRowKeyValue();

						if (rowKeyValue !== null) {
							const pagesBookmarkDialog = document.getElementById('pagesBookmarkDialog');
							if (pagesBookmarkDialog !== null) {
								if (pagesBookmarkDialog.isOpen()) pagesBookmarkDialog.close();
							}

							const bookmark = PagesBookmarkManager.getPagesBookmarkByValue(rowKeyValue);
							if (CoreUtils.isNotUndefinedNorNull(bookmark)) {
								const item = selectPagesHistoryItem(bookmark.value);
								if (CoreUtils.isNotUndefinedNorNull(item)) {
									// Means there is already a pages history entry
									// for the selected bookmark, so we can just
									// navigate to page associated with that entry.
									performNavigateToAction(item.position);
								}
								else {
									PagesHistoryManager.setPagesHistoryCurrentAction('integrate');
									const historyEntry = PagesHistoryManager.performIntegrateAction(bookmark);
									if (CoreUtils.isNotUndefinedNorNull(historyEntry)) {
										setUndefinedBeanTree();
										visitBeanPathHistoryEntry(historyEntry);
									}
								}
								viewParams.signaling.pagesBookmarkChanged.dispatch('bookmark-selected');
							}
						}

						this.selectedRows(null);
					}
				}.bind(this);

				this.hiddenAccessKeyClickHandler = (event) => {
					const state = getComputedStyle(document.documentElement).getPropertyValue('--beanpath-history-container-calc-display');
					if (state === 'inline-flex') {
						const selector = '#beanpath-history-entries input.oj-combobox-input';
						const input = document.querySelector(selector);
						if (input !== null) input.focus();
					}
				};

				this.handleDeletePagesBookmark = function(event) {
					function deletePagesBookmarkTableRow(bookmarkValue) {
						this.deleted_bookmark_values.push(bookmarkValue);

						this.pages_bookmarked.valueWillMutate();
						this.pages_bookmarked(this.pages_bookmarked().filter(row => row._value !== bookmarkValue));
						this.pages_bookmarked.valueHasMutated();

						setPagesBookmarkDialogButtonsDisabled(false);
					}

					const dataBookmarkValue = event.target.attributes['data-bookmark-value'].value;
					deletePagesBookmarkTableRow.call(this, dataBookmarkValue);
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
					viewParams.signaling.beanPathHistoryToggled.dispatch('pages-history', visible);
				}

				function visitBeanPathHistoryEntry(historyEntry) {
					const perspective = PerspectiveManager.getById(historyEntry.perspective.id);

					if (self.beanPathManager.beanTree.type === perspective.id) {
						// There is a special case where we need to ensure that
						// setting the router's parameter.path, will trigger a
						// knockout change event.
						const routerPath = decodeURIComponent(viewParams.parentRouter.currentState().parameters.path);
						if (routerPath === historyEntry.value) {
							viewParams.parentRouter.go(null)
									.then(()=> {
										viewParams.parentRouter.go(`/${perspective.id}/${encodeURIComponent(historyEntry.value)}`);
									});
						}
						else {
							ViewModelUtils.goToRouterPath(viewParams.parentRouter, `/${perspective.id}/${encodeURIComponent(historyEntry.value)}`, self.canExitCallback);
						}
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
															if (response.failureReason === 'Not Found') {
																deleteBeanPath(historyEntry.value);
															}
															else {
																MessageDisplaying.displayMessage(
																		{
																			severity: 'info',
																			summary: event.target.attributes['data-notFoundMessage'].value
																		},
																		2500
																);
															}
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

				function showPagesHistoryDialog() {
					function clearPagesHistory() {
						self.beanPathManager.resetHistoryEntries()
								.then(reply => {
									if (reply) {
										self.recently_visited.valueWillMutate();
										self.recently_visited([]);
										self.recently_visited.valueHasMutated();
										PagesHistoryManager.resetPagesHistoryData();
										viewParams.signaling.pagesHistoryChanged.dispatch('reset');
									}
								});
					}

					if (PagesHistoryManager.isLaunchAllowed()) {
						setPagesHistoryDataProvider();

						self.i18n.dialog.title(oj.Translations.getTranslatedString('wrc-recently-visited.labels.ariaLabel.value'));
						self.i18n.dialog.instructions(oj.Translations.getTranslatedString('wrc-common.labels.pagesHistory.value'));

						PagesHistoryDialog.showPagesHistoryDialog(self.i18n)
								.then(reply => {
									switch (reply.exitButton) {
										case 'clear':
											clearPagesHistory();
											break;
										case 'close':
											break;
									}
								});

					}
				}

				function setPagesHistoryDataProvider() {
					const data = PagesHistoryManager.getPagesHistoryData();
					if (data.items.length > 0) {
						const entries = data.items.map(item => (
								{
									tree: oj.Translations.getTranslatedString(`wrc-content-area-header.title.${item.perspective.id}`),
									page: PageDefinitionUtils.getBreadcrumbsLabel(item.value, item.breadcrumbLabels),
									tab: item.slice.name,
									_position: item.position
								}
						));

						self.recently_visited.valueWillMutate();
						self.recently_visited([...entries].reverse());
						self.recently_visited.valueHasMutated();
					}
				}

				function showPagesBookmarkDialog() {
					function getCurrentProviderTypeLabel() {
						const provider = DataProviderManager.getLastActivatedDataProvider();
						return oj.Translations.getTranslatedString(`wrc-data-providers.labels.provider.${provider.type}.value`);
					}

					function applyPagesBookmark() {
						const appliedBookmarks = PagesBookmarkManager.getAppliedPageBookmarks(self.deleted_bookmark_values);
						DataOperations.bookmarks.save(appliedBookmarks)
							.then(reply => {
								const provider = DataProviderManager.getLastActivatedDataProvider();
								PagesBookmarkManager.setPagesBookmarkData(reply.body.data, provider);
							})
							.then(() => {
								viewParams.signaling.pagesBookmarkChanged.dispatch('bookmarks-removed');
							})
							.catch(response => {
								if (response.failureType === CoreTypes.FailureType.CBE_REST_API) {
									MessageDisplaying.displayResponseMessages(response.body.messages);
								}
								else {
									ViewModelUtils.failureResponseDefaultHandling(response);
								}
							});
					}

					function resetPagesBookmark() {
						setPagesBookmarkDataProvider();
						clearDeletedBookmarkValues();
						setPagesBookmarkDialogButtonsDisabled(self.deleted_bookmark_values.length === 0);
					}

					resetPagesBookmark();

					self.i18n.dialog.title(oj.Translations.getTranslatedString('wrc-pages-bookmark.labels.ariaLabel.value'));
					self.i18n.dialog.instructions(oj.Translations.getTranslatedString('wrc-common.labels.pagesBookmark.value', getCurrentProviderTypeLabel()));

					PagesBookmarkDialog.showPagesBookmarkDialog(self.i18n, resetPagesBookmark)
						.then(reply => {
							switch (reply.exitButton) {
								case 'apply':
									applyPagesBookmark();
									break;
								case 'close':
									break;
							}
						});

				}

				function setPagesBookmarkDialogButtonsDisabled(value) {
					self.i18n.buttons.reset.disabled(value);
					self.i18n.buttons.apply.disabled(value);
				}

				function clearDeletedBookmarkValues() {
					self.deleted_bookmark_values = [];
				}

				function setPagesBookmarkDataProvider() {
					const provider = DataProviderManager.getLastActivatedDataProvider();
					const data = PagesBookmarkManager.getPagesBookmarkData(provider);
					const entries = data.bookmarks.map((bookmark) => (
							{
								tree: oj.Translations.getTranslatedString(`wrc-content-area-header.title.${bookmark.perspective.id}`),
								page: PageDefinitionUtils.getBreadcrumbsLabel(bookmark.value, bookmark.breadcrumbLabels),
								tab: bookmark.slice.name,
								_value: bookmark.value
							}
					));

					self.pages_bookmarked.valueWillMutate();
					self.pages_bookmarked([...entries]);
					self.pages_bookmarked.valueHasMutated();
				}

			}

			return PagesHistory;
		}
);