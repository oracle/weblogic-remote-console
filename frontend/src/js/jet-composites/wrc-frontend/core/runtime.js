/**
 * @license
 * Copyright (c) 2020, 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

/**
 * Module containing methods for setting or obtaining __runtime__ properties, for the CFE
 * <p>These properties get there initial values from the ``config/console-frontend-jet.yaml`` configuration file. They can then be read (or manipulated) at "runtime", by any module that imports it.</p>
 * <p>IMPORTANT: All the properties defined in this module need to have a `PropertyName` constant to go with it. This constant is used with the ``getProperty`` and ``setProperty(name)`` method read and write property values, at runtime. You can optionally provide a convenience method for accessing the property, with a developer-friendly method name.</p>
 * @module module:core/runtime
 * @see module:core/adapters/file-adapter
 * @see module:core/cbe-types
 * @see module:core/types
 */
define(['./parsers/yaml', 'text!wrc-frontend/config/console-frontend-jet.yaml', 'text!./baseUrl', './types', './utils', 'ojs/ojlogger'],
	function (YamlParser, ConfigFileContents, BaseUrl, CoreTypes, CoreUtils, Logger) {
		let properties = {}, config = {};
		
                properties['unique-id'] = new Date().getTime()
		properties['console-frontend.mode'] = CoreTypes.Console.RuntimeMode.DETACHED.name;
		properties['console-frontend.isReadOnly'] = false;
		properties['console-backend.providerId'] = '';
		properties['console-backend.domain'] = '';
		properties['console-backend.domainConnectState'] = CoreTypes.Domain.ConnectState.DISCONNECTED.name;
		properties['console-backend.weblogic.username'] = '';
		properties['preferences.general.theme'] = 'light';
		properties['preferences.navtree.useTreeMenusAsRootNodes'] = false;
		properties['preferences.startup.task.chooser'] = 'use-dialog';
		properties['preferences.pagesHistory.maxQueueSize'] = 64;
		properties['features.appMenu.disabled'] = true;
		properties['features.appProfiles.disabled'] = true;
		properties['features.appAlerts.disabled'] = true;
		properties['features.theme.disabled'] = true;
		properties['features.whatsNew.disabled'] = true;
		properties['features.howDoI.disabled'] = true;
		properties['features.pageInfo.disabled'] = true;
		properties['features.iconbarIcons.relocated'] = false;
		
		YamlParser.parse(ConfigFileContents)
			.then(data => {
				config = data;
				properties['console-frontend.name'] = config['name'];
				properties['console-frontend.version'] = config['version'];
				properties['console-frontend.accelerators'] = config['accelerators'];
				properties['console-backend.name'] = config['console-backend']['name'];
				properties['console-backend.version'] = config['console-backend']['version'];
				properties['console-frontend.logging.defaultLevel'] = config['settings']['logging']['defaultLevel'];
				properties['console-backend.pollingMillis'] = config['console-backend']['pollingMillis'];
				properties['console-backend.retryAttempts'] = config['console-backend']['retryAttempts'];
				properties['console-backend.docs'] = config['console-backend']['docs'];
				properties['console-backend.basePath'] = config['console-backend']['basePath'];
				properties['settings.autoSync.minimumSecs'] = config['settings']['autoSync']['minimumSecs'];
				properties['settings.autoDownloadTimer.minimumSecs'] = config['settings']['autoDownloadTimer']['minimumSecs'];
				properties['settings.sso.tokenClockSkew'] = config['settings']['sso']['tokenClockSkew'];
				properties['settings.sso.maxPollCount'] = config['settings']['sso']['maxPollCount'];
				properties['settings.sso.domainLoginUri'] = config['settings']['sso']['domainLoginUri'];
				properties['settings.actions'] = config['settings']['actions'];
				properties['settings.polling'] = config['settings']['polling'];
				properties['settings.notifications'] = config['settings']['notifications'];
				properties['settings.logging'] = config['settings']['logging'];
				properties['features.appMenu.disabled'] = config['features']['appMenu']['disabled'];
				properties['features.appProfiles.disabled'] = config['features']['appProfiles']['disabled'];
				properties['features.appAlerts.disabled'] = config['features']['appAlerts']['disabled'];
				properties['features.theme.disabled'] = config['features']['theme']['disabled'];
				properties['features.whatsNew.disabled'] = config['features']['whatsNew']['disabled'];
				properties['features.pageInfo.disabled'] = config['features']['pageInfo']['disabled'];
				properties['features.howDoI.disabled'] = config['features']['howDoI']['disabled'];
				properties['features.pagesHistory.disabled'] = config['features']['pagesHistory']['disabled'];
				properties['features.iconbarIcons.relocated'] = config['features']['iconbarIcons']['relocated'];
				properties['preferences.providerManagement.location'] = config['preferences']['providerManagement']['location'];
				properties['preferences.providerManagement.newModel.domain.fileContents'] = config['preferences']['providerManagement']['newModel']['domain']['fileContents'];
				properties['preferences.providerManagement.newModel.sparse.fileContents'] = config['preferences']['providerManagement']['newModel']['sparse']['fileContents'];
				properties['preferences.startup'] = config['preferences']['startup'];
				properties['preferences.startup.task.default'] = config['preferences']['startup']['task']['default'];
				properties['preferences.startup.task.chooser'] = config['preferences']['startup']['task']['chooser'];
				properties['preferences.startup.project'] = config['preferences']['startup']['project'];
				properties['preferences.navtree.useTreeMenusAsRootNodes'] = config['preferences']['navtree']['useTreeMenusAsRootNodes'];
				properties['preferences.general.theme'] = config['preferences']['general']['theme'];
				properties['preferences.pagesHistory.maxQueueSize'] = config['preferences']['pagesHistory']['maxQueueSize'];
			})
			.catch(err => {
				Logger.error(err);
			});
		
		function getBaseUrl() {
			return getBackendUrl() + '/api';
		}
		
		function getUniqueId() {
			return properties['unique-id']
		}

		/**
		 * return backend URL
		 * @returns URL to backend (i.e. no /api)
		 */
		function getBackendUrl() {
			return (properties['console-backend.url'] ? properties['console-backend.url'] : getRunningBackendUrl());
		}
		
		function getRunningBackendUrl() {
			let computedBase;
			
			// use a dynamic BaseUrl if BaseUrl is not specified
			// which is the case when the frontend and backend
			// are running on the same host/port
			if (!BaseUrl || BaseUrl === '') {
				const host = window.location.host;
				const protocol = window.location.protocol;
				
				computedBase = protocol + '//' + host;
			} else {
				computedBase = BaseUrl;
			}
			return computedBase + (properties['console-backend.basePath'] ? properties['console-backend.basePath'] : '');
		}
		
		return {
			PropertyName: Object.freeze({
				CFE_MODE: {name: 'console-frontend.mode'},
				CFE_NAME: {name: 'console-frontend.name'},
				CFE_VERSION: {name: 'console-frontend.version'},
				CFE_ACCELERATORS: {name: 'console-frontend.accelerators'},
				CFE_ROLE: {name: 'console-frontend.role'},
				CFE_LOGGING_DEFAULT_LEVEL: {name: 'console-frontend.logging.defaultLevel'},
				CFE_AUTO_SYNC_SECS: {name: 'settings.autoSync.minimumSecs'},
				CFE_AUTO_DOWNLOAD_TIMER_SECS: {name: 'settings.autoDownloadTimer.minimumSecs'},
				CFE_SSO_TOKEN_CLOCK_SKEW: {name: 'settings.sso.tokenClockSkew'},
				CFE_SSO_MAX_POLL_COUNT: {name: 'settings.sso.maxPollCount'},
				CFE_SSO_DOMAIN_LOGIN_URI: {name: 'settings.sso.domainLoginUri'},
				CFE_PROJECT_MANAGEMENT_LOCATION: {name: 'preferences.providerManagement.location'},
				CFE_IS_READONLY: {name: 'console-frontend.isReadOnly'},
				CFE_CURRENT_THEME: {name: 'preferences.general.theme'},
				CFE_STARTUP_PROJECT: {name: 'preferences.startup.project'},
				CFE_STARTUP_TASK: {name: 'preferences.startup.task.default'},
				CFE_STARTUP_TASK_CHOOSER: {name: 'preferences.startup.task.chooser'},
				CFE_PAGES_HISTORY_MAX_QUEUE_SIZE: {name: 'preferences.pagesHistory.maxQueueSize'},
				CFE_ACTIONS: {name: 'settings.actions'},
				CFE_POLLING: {name: 'settings.polling'},
				CBE_PROVIDER_ID: {name: 'console-backend.providerId'},
				CBE_NAME: {name: 'console-backend.name'},
				CBE_VERSION: {name: 'console-backend.version'},
				CBE_WLS_VERSION_ONLINE: {name: 'weblogic.version.online'},
				CBE_WLS_USERNAME: {name: 'console-backend.weblogic.username'},
				CBE_INTERNAL_DOCS_URL: {name: 'console-backend.docs'},
				CBE_BASE_PATH: {name: 'console-backend.basePath'},
				CBE_DOMAIN_URL: {name: 'console-backend.domain.url'},
				CBE_DOMAIN: {name: 'console-backend.domain'},
				CBE_DOMAIN_CONNECT_STATE: {name: 'console-backend.domainConnectState'},
				CBE_POLLING_MILLIS: {name: 'console-backend.pollingMillis'},
				CBE_RETRY_ATTEMPTS: {name: 'console-backend.retryAttempts'},
				CBE_MODE: {name: 'console-backend.mode'}
			}),
			
			getBaseUrl: function () {
				return getBaseUrl();
			},
			
			getBackendUrl: getBackendUrl,

			getUniqueId: function () {
				return getUniqueId();
			},
			
			setBackendUrl: (value) => {
				properties['console-backend.url'] = value;
			},
			
			getDataProviderId: () => {
				return properties['console-backend.providerId'];
			},
			
			setDataProviderId: (value) => {
				properties['console-backend.providerId'] = value;
			},
			
			getStartupProject: () => {
				return properties['preferences.startup.project'];
			},
			
			getStartupTask: () => {
				return properties['preferences.startup.task.default'];
			},
			
			getStartupTaskChooser: () => {
				return properties['preferences.startup.task.chooser'];
			},
			
			setStartupTaskChooser: (value) => {
				if (value && ['use-dialog', 'use-cards'].includes(value)) {
					properties['preferences.startup.task.chooser'] = value;
				}
			},
			
			getUseNavstripAsRootNodes: () => {
				return properties['preferences.navtree.useTreeMenusAsRootNodes'];
			},
			
			getAccelerators: () => {
				return properties['console-frontend.accelerators'];
			},
			
			getSettingsActions: () => {
				return properties['settings.actions'];
			},

			getPagesHistoryMaxQueueSize: () => {
				return ~~properties['preferences.pagesHistory.maxQueueSize'];
			},
			
			getPollingMillis: function () {
				return parseInt(this.getProperty(this.PropertyName.CBE_POLLING_MILLIS));
			},

			getActionPollings: () => {
				return properties['settings.polling'];
			},

			getRetryAttempts: function () {
				return parseInt(this.getProperty(this.PropertyName.CBE_RETRY_ATTEMPTS));
			},
			
			getAutoSyncMinimumSecs: function () {
				return parseInt(this.getProperty(this.PropertyName.CFE_AUTO_SYNC_SECS));
			},
			
			getAutoDownloadMinimumSecs: function () {
				return parseInt(this.getProperty(this.PropertyName.CFE_AUTO_DOWNLOAD_TIMER_SECS));
			},
			
			getProjectManagementLocation: function () {
				return this.getProperty(this.PropertyName.CFE_PROJECT_MANAGEMENT_LOCATION);
			},
			
			getWDTModelDomainTemplate: function () {
				return properties['preferences.providerManagement.newModel.domain.fileContents'];
			},
			
			getWDTModelSparseTemplate: function () {
				return properties['preferences.providerManagement.newModel.sparse.fileContents'];
			},
			
			getDomainConnectState: function () {
				return this.getProperty(this.PropertyName.CBE_DOMAIN_CONNECT_STATE);
			},
			
			getDocsURL: function () {
				return properties['console-backend.docs'];
			},
			
			getWhatsNewURL: function () {
				return properties['console-backend.whatsnew'];
			},
			
			getLoggingLevel: function () {
				const level = this.getProperty(
					this.PropertyName.CFE_LOGGING_DEFAULT_LEVEL
				);
				const levelSwitch = (level) => ({
					NONE: 0,
					ERROR: 1,
					WARN: 2,
					INFO: 3,
					DEBUG: 4,
				}[level]);
				return levelSwitch(level);
			},
			
			isConfiguredSso: function () {
				const domainLoginUri = this.getSsoDomainLoginUri();
				return CoreUtils.isNotUndefinedNorNull(domainLoginUri) && (domainLoginUri.length > 0);
			},
			
			getSsoTokenClockSkew: function () {
				return this.getProperty(this.PropertyName.CFE_SSO_TOKEN_CLOCK_SKEW);
			},
			
			getSsoMaxPollCount: function () {
				return this.getProperty(this.PropertyName.CFE_SSO_MAX_POLL_COUNT);
			},
			
			getSsoDomainLoginUri: function () {
				return this.getProperty(this.PropertyName.CFE_SSO_DOMAIN_LOGIN_URI);
			},
			
			getProperty: function (name) {
				let property;
				if (CoreUtils.isNotUndefinedNorNull(name)) {
					if (CoreUtils.isNotUndefinedNorNull(name.name)) {
						property = properties[name.name];
					} else if (typeof name === 'string' && name.length > 0) {
						property = properties[name];
					}
				}
				return property;
			},
			
			setProperty: function (name, value) {
				if (CoreUtils.isNotUndefinedNorNull(name) && CoreUtils.isNotUndefinedNorNull(value)) {
					if (CoreUtils.isNotUndefinedNorNull(name.name)) {
						properties[name.name] = value;
					} else if (typeof name === 'string' && name.length > 0) {
						properties[name] = value;
					}
				}
			},
			
			isReadOnly: function () {
				return this.getProperty(this.PropertyName.CFE_IS_READONLY);
			},
			
			// TODO: Have this return a 'deep frozen' copy of this.config
			getConfig: function () {
				return config;
			},
			
			getMode: function () {
				return this.getProperty(this.PropertyName.CFE_MODE);
			},
			
			getName: function () {
				return this.getProperty(this.PropertyName.CFE_NAME);
			},
			
			getVersion: function () {
				return this.getProperty(this.PropertyName.CBE_VERSION);
			},
			
			getRole: function () {
				return this.getProperty(this.PropertyName.CFE_ROLE);
			},
			
			getDomainName: function () {
				return this.getProperty(this.PropertyName.CBE_DOMAIN);
			},
			
			getDomainVersion: function () {
				return this.getProperty(this.PropertyName.CBE_WLS_VERSION_ONLINE);
			},
			
			setWebLogicUsername: function (value) {
				// When the usernamne is not defined then overwrite property as null
				const name = (CoreUtils.isNotUndefinedNorNull(value) ? value : null);
				properties[this.PropertyName.CBE_WLS_USERNAME.name] = name;
			},

			getWebLogicUsername: function () {
				return this.getProperty(this.PropertyName.CBE_WLS_USERNAME);
			},
			
			getDomainUrl: function () {
				return this.getProperty(this.PropertyName.CBE_DOMAIN_URL);
			},
			
			getBackendMode: function () {
				return this.getProperty(this.PropertyName.CBE_MODE);
			},
			
			/**
			 * Get Javascript object associated with the configuration for ``serviceType``.
			 * @param {ServiceType} serviceType
			 * @returns {string} object associated with the configuration for ``serviceType``. Returns ``undefined``, if no association exists.
			 * @throws {Error} When value assigned to ``serviceType`` parameter is undefined.
			 * @example
			 * const serviceConfig = Runtime.getServiceConfig(CbeTypes.ServiceType.CONFIGURATION);
			 */
			getServiceConfig: function (serviceType) {
				if (CoreUtils.isUndefinedOrNull(serviceType)) {
					throw new Error('Value assigned to serviceType parameter cannot be undefined.');
				}
				let services = config['console-backend']['services'];
				return services.find((service) => {
					return service['id'] === serviceType.name;
				});
			},
			
			/**
			 * Get CBE uri for a given ``serviceType`` and ``serviceComponentType``
			 * @param {ServiceType} serviceType
			 * @param {ServiceComponentType} serviceComponentType
			 * @returns {string} The path uri associated with ``serviceType`` and ``serviceComponentType``. Returns ``undefined``, if no association exists.
			 * @throws {Error} When values assigned to ``serviceType`` or ``serviceComponentId`` parameters are undefined.
			 * @example
			 * const pathUri = Runtime.getPathUri(CbeTypes.ServiceType.CONFIGURATION, CbeTypes.ServiceComponentType.CHANGE_MANAGER);
			 */
			getPathUri: function (serviceType, serviceComponentType) {
				if (CoreUtils.isUndefinedOrNull(serviceType) || CoreUtils.isUndefinedOrNull(serviceComponentType)) {
					throw new Error('Values assigned to serviceType and serviceComponentId arguments cannot be undefined.');
				}
				let service = this.getServiceConfig(serviceType);
				return (CoreUtils.isNotUndefinedNorNull(service) ? service['path'] + '/' + serviceComponentType.name : undefined);
			}
		};
	}
);
