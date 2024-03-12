/**
 * @license
 * Copyright (c) 2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define([
	'ojs/ojhtmlutils',
	'wrc-frontend/microservices/page-definition/types',
	'wrc-frontend/common/page-definition-helper',
	'wrc-frontend/integration/viewModels/utils',
	'wrc-frontend/core/runtime',
	'wrc-frontend/core/utils'
],
	function (
		HtmlUtils,
		PageDataTypes,
		PageDefinitionHelper,
		ViewModelUtils,
		Runtime,
		CoreUtils
	) {
		function updateRowObjValue(cname, rowObjValue, rdjValue, templateListenerCallback) {
			rowObjValue['name'] = cname;
			rowObjValue['id'] = `${cname}:${rdjValue.label}`;
			rowObjValue['template'] = 'hrefCellTemplate';
			rowObjValue['listener'] = templateListenerCallback;

			return rowObjValue;
		}

		function hasDownloadHRef(row, columnName) {
			return (CoreUtils.isNotUndefinedNorNull(row) &&
				CoreUtils.isNotUndefinedNorNull(columnName) &&
				CoreUtils.isNotUndefinedNorNull(row[columnName]) &&
				CoreUtils.isNotUndefinedNorNull(row[columnName].value) &&
				CoreUtils.isNotUndefinedNorNull(row[columnName].value.href)	&&
				CoreUtils.isNotUndefinedNorNull(row[columnName].value.href.endsWith('</a>'))
			)
		}

		function openHRefIfPresent(url) {
			if (ViewModelUtils.isElectronApiAvailable()) {
				window.electron_api.ipc.invoke('external-url-opening', url);
			}
			else {
				window.open(url, '_blank', 'noopener noreferrer');
			}
		}
		
		function downloadHRef(atag, pdjTypes) {
			const attributes = pdjTypes.extractNodeAttributes(HtmlUtils.stringToNodeArray(atag));
			if (attributes.download) {
				const options = {
					href: `${Runtime.getBackendUrl()}${attributes.href}`,
					filepath: attributes.download,
					target: attributes.target,
					mediaType: attributes.type
				};
				ViewModelUtils.downloadFile(options);
			}
		}

		function onHRefTableCellClicked(row, columnName, pdjTypes, parentRouter) {
			let dataDefaultTemplate = 'cellTemplate';
			
			if (CoreUtils.isNotUndefinedNorNull(row[columnName].value.href)) {
				if (row[columnName].value.href.endsWith('</a>')) {
					downloadHRef(row[columnName].value.href, pdjTypes);
					dataDefaultTemplate = 'downloadCellTemplate';
				}
				else if (row[columnName].value.href.startsWith('http')) {
					openHRefIfPresent(row[columnName].value.href);
					dataDefaultTemplate = 'hrefCellTemplate';
				}
			}
			else if (CoreUtils.isNotUndefinedNorNull(row[columnName].value.resourceData)) {
				parentRouter.go(`/monitoring/${encodeURIComponent(row[columnName].value.resourceData)}`);
			}

			return dataDefaultTemplate;
		}
		
		function onHtmlTableCellClicked(row, columnName, id) {
/*
//MLW
			const tr = document.querySelector(`tr:has(#${id})`);
	
			let toggleState = event.target.attributes['data-toggle-state'];
			if (CoreUtils.isUndefinedOrNull(toggleState)) {
				toggleState = {value: 'collapsed'};
			}
			event.target.setAttribute('data-toggle-state', toggleState.value === 'collapse' ? 'expanded' : 'collapse');
*/
			return 'htmlCellTemplate';
		}

		function hasHRefColumns(pdjData) {
			let rtnval = PageDefinitionHelper.hasTable(pdjData);

			if (rtnval) {
				if (CoreUtils.isNotUndefinedNorNull(pdjData.table.displayedColumns)) {
					rtnval = (pdjData.table.displayedColumns.filter(item => item.type === 'href').length > 0);
				}
			}
			
			if (!rtnval) {
				rtnval = PageDefinitionHelper.hasSliceTable(pdjData);
				if (rtnval) {
					if (CoreUtils.isNotUndefinedNorNull(pdjData.sliceTable.displayedColumns)) {
						rtnval = (pdjData.sliceTable.displayedColumns.filter(item => item.type === 'href').length > 0);
					}
				}
			}
			return rtnval;
		}

		function hasHRefProperties(pdjData) {
			let rtnval = PageDefinitionHelper.hasSliceFormProperties(pdjData);
			
			if (rtnval) {
				rtnval = (pdjData.sliceForm.properties.filter(item => item.type === 'href').length > 0);
			}
			return rtnval;
		}

	//public:
		return {
			hasHRefColumns: hasHRefColumns,
			hasHRefProperties: hasHRefProperties,
			hasDownloadHRef: hasDownloadHRef,
			setHrefTypeRowObjValue: function (rowObjValue, columnMetadata, row, cname, pdjTypes, templateListenerCallback) {
				const index = columnMetadata.map(item => item.name).indexOf(cname);
				if (index !== -1) {
					const rdjValue = row[cname].value;
					if (CoreUtils.isNotUndefinedNorNull(rdjValue.href)) {
						rowObjValue = updateRowObjValue(cname, rowObjValue, rdjValue, templateListenerCallback);
						if (rdjValue.href.endsWith('</a>')) {
							columnMetadata[index]['template'] = 'hrefCellTemplate';
							columnMetadata[index]['type'] = 'download';
							columnMetadata[index]['listener'] = templateListenerCallback;
							rowObjValue['name'] = cname;
							rowObjValue['type'] = 'download';
							rowObjValue.template = 'downloadCellTemplate';
							const attributes = pdjTypes.extractNodeAttributes(HtmlUtils.stringToNodeArray(rdjValue.href));
							rowObjValue['tag'] = {
								href: attributes.href,
								download: attributes.download,
								target: attributes.target,
								type: attributes.type
							};
						}
						else if (rdjValue.href.startsWith('http')) {
							columnMetadata[index]['template'] = 'hrefCellTemplate';
							columnMetadata[index]['type'] = 'href';
							columnMetadata[index]['listener'] = templateListenerCallback;
							rowObjValue['type'] = 'href';
							rowObjValue = updateRowObjValue(cname, rowObjValue, rdjValue, templateListenerCallback);
						}
						else {
							columnMetadata[index]['template'] = 'cellTemplate';
						}
					}
					else if (CoreUtils.isNotUndefinedNorNull(rdjValue.resourceData)){
						columnMetadata[index]['template'] = 'hrefCellTemplate';
						rowObjValue = updateRowObjValue(cname, rowObjValue, rdjValue, templateListenerCallback);
						rowObjValue['type'] = 'resourceData';
					}
				}
			},

			setHtmlTypeRowObjValue: function (rowObjValue, columnMetadata, row, cname, templateListenerCallback) {
				const index = columnMetadata.map(item => item.name).indexOf(cname);
				if (index !== -1) {
					columnMetadata[index]['template'] = 'htmlCellTemplate';
					rowObjValue['name'] = cname;
					rowObjValue['id'] = `${cname}:${row.identity.value.label}`;
					rowObjValue['template'] = 'htmlCellTemplate';
					rowObjValue['listener'] = templateListenerCallback;
					rowObjValue['type'] = 'detailsHTML';
				}
			},

			handleTableCellClickEvent: function (event, parentRouter, perspectiveId) {
				let dataDefaultTemplate = 'cellTemplate';

				if (event.target.offsetParent.cellIndex !== -1) {
					const pdjData =  parentRouter.data.pdjData();
					if (PageDefinitionHelper.hasTable(pdjData)) {
						let columns = pdjData.table.displayedColumns;
						
						if (CoreUtils.isNotUndefinedNorNull(pdjData.table.hiddenColumns)) {
							columns = columns.concat(pdjData.table.hiddenColumns);
						}
						
						const pdjTypes = new PageDataTypes(columns, perspectiveId);
						const cellIndex = event.target.offsetParent.cellIndex;
						
						if (CoreUtils.isNotUndefinedNorNull(cellIndex)) {
							const columnName = columns[cellIndex].name;
							const rdjData =  parentRouter.data.rdjData();
							const rowIndex =  event.currentTarget?.currentRow?.rowIndex;
							
							if (CoreUtils.isNotUndefinedNorNull(rowIndex)) {
								if (pdjTypes.isHrefType(columnName)) {
									dataDefaultTemplate = onHRefTableCellClicked(rdjData.data[rowIndex], columnName, pdjTypes, parentRouter);
								}
								else if (pdjTypes.isHtmlType(columnName)) {
									dataDefaultTemplate = onHtmlTableCellClicked(rdjData.data[rowIndex], columnName, event.target.offsetParent.id);
								}
							}
						}
					}
				}
				return dataDefaultTemplate;
			},

			handleSliceTableCellClickEvent: function (event, parentRouter, perspectiveId) {
				let dataDefaultTemplate = 'cellTemplate';

				const pdjData = parentRouter.data.pdjData();

				if (PageDefinitionHelper.hasSliceTable(pdjData)) {
					let columns = pdjData.sliceTable.displayedColumns;
					
					if (CoreUtils.isNotUndefinedNorNull(pdjData.sliceTable.hiddenColumns)) {
						columns = columns.concat(pdjData.sliceTable.hiddenColumns);
					}
					
					const pdjTypes = new PageDataTypes(columns, perspectiveId);
					const cellIndex = event.target.offsetParent.cellIndex;
					
					if (CoreUtils.isNotUndefinedNorNull(cellIndex)) {
						const columnName = columns[cellIndex].name;
						const rdjData = parentRouter.data.rdjData();
						const rowIndex = event.currentTarget?.currentRow?.rowIndex;
						
						if (CoreUtils.isNotUndefinedNorNull(rowIndex)) {
							if (pdjTypes.isHrefType(columnName)) {
								dataDefaultTemplate = onHRefTableCellClicked(rdjData.data[rowIndex], columnName, pdjTypes, parentRouter);
							}
							else if (pdjTypes.isHtmlType(columnName)) {
								dataDefaultTemplate = onHtmlTableCellClicked(rdjData.data[rowIndex], columnName, event.target.offsetParent.id);
							}
						}
					}
				}

				return dataDefaultTemplate;
			},
			
			hrefCellTemplateListener: function (event, parentRouter, perspectiveId) {
				let dataDefaultTemplate = 'cellTemplate';
				// Prevent row from being selected when <a>
				// element is clicked.
				event.preventDefault();
				
				let cellIndex = event.target.offsetParent.cellIndex;
				
				if (cellIndex !== -1) {
					const pdjData =  parentRouter.data.pdjData();
					const pdjTypes = PageDefinitionHelper.createPageDefinitionTypes(pdjData, perspectiveId);
					if (CoreUtils.isNotUndefinedNorNull(pdjTypes)) {
						const columnName = event.target.offsetParent.offsetParent.columns[cellIndex].name;
						const rdjData =  parentRouter.data.rdjData();
						
						if (pdjTypes.isHrefType(columnName)) {
							dataDefaultTemplate = onHRefTableCellClicked(rdjData.data[event.target.offsetParent.offsetParent.currentRow.rowIndex], columnName, pdjTypes, parentRouter);
						}
					}
				}
				return dataDefaultTemplate;
			},
			
			htmlCellTemplateListener: function (event, parentRouter, perspectiveId) {
				let dataDefaultTemplate = 'cellTemplate';
				// Prevent row from being selected when <a>
				// element is clicked.
				event.preventDefault();
				
				const cellIndex = event.target.offsetParent.cellIndex;
				
				if (cellIndex !== -1) {
					const pdjData =  parentRouter.data.pdjData();
					const pdjTypes = PageDefinitionHelper.createPageDefinitionTypes(pdjData, perspectiveId);
					if (CoreUtils.isNotUndefinedNorNull(pdjTypes)) {
						const columnName = event.target.offsetParent.offsetParent.columns[cellIndex].name;
						const rdjData =  parentRouter.data.rdjData();
						
						if (pdjTypes.isHtmlType(columnName)) {
							dataDefaultTemplate = onHtmlTableCellClicked(rdjData.data[event.target.offsetParent.offsetParent.currentRow.rowIndex], columnName, event.target.offsetParent.id);
						}
					}
				}
				return dataDefaultTemplate;
			}

		};
	}
);