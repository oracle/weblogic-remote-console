/**
 Copyright (c) 2015, 2024, Oracle and/or its affiliates.
 Licensed under The Universal Permissive License (UPL), Version 1.0
 as shown at https://oss.oracle.com/licenses/upl/
 
 */

'use strict';

module.exports = function (configObj) {
	return new Promise((resolve) => {
		console.log("Running before_optimize hook.");
		configObj.requireJs.include = [
			'viewModels/gallery', 'text!views/gallery.html',
			'viewModels/home', 'text!views/home.html',
			'viewModels/landing', 'text!views/landing.html',
			'viewModels/startup-tasks', 'text!views/startup-tasks.html',
			'viewModels/branding-area/header', 'text!views/branding-area/header.html',
			'viewModels/branding-area/console-backend-connection', 'text!views/branding-area/console-backend-connection.html',
			'viewModels/branding-area/togglers/navtree-toggler', 'text!views/branding-area/togglers/navtree-toggler.html',
			'viewModels/branding-area/menu/app-menu', 'text!views/branding-area/menu/app-menu.html',
			'viewModels/branding-area/profile/app-profile', 'text!views/branding-area/profile/app-profile.html',
			'viewModels/branding-area/theme/app-theme', 'text!views/branding-area/theme/app-theme.html',
			'viewModels/branding-area/alerts/app-alerts', 'text!views/branding-area/alerts/app-alerts.html',
			'viewModels/branding-area/search/simple-search', 'text!views/branding-area/search/simple-search.html',
			'viewModels/branding-area/message-line/message-line', 'text!views/branding-area/message-line/message-line.html',
			'viewModels/navigation-area/navstrip', 'text!views/navigation-area/navstrip.html',
			'viewModels/content-area/header/beanpath-history-icon', 'text!views/content-area/header/beanpath-history-icon.html',
			'viewModels/content-area/header/header-iconbar', 'text!views/content-area/header/header-iconbar.html',
			'viewModels/content-area/header/header-toolbar', 'text!views/content-area/header/header-toolbar.html',
			'viewModels/content-area/header/shoppingcart-menu', 'text!views/content-area/header/shoppingcart-menu.html',
			'viewModels/content-area/ancillary-content', 'text!views/content-area/ancillary-content.html',
			'viewModels/content-area/header-content', 'text!views/content-area/header-content.html',
			'viewModels/content-area/ancillary/ataglance', 'text!views/content-area/ancillary/ataglance.html',
			'viewModels/content-area/ancillary/providers', 'text!views/content-area/ancillary/providers.html',
			'viewModels/content-area/ancillary/shoppingcart', 'text!views/content-area/ancillary/shoppingcart.html',
			'viewModels/content-area/ancillary/tips', 'text!views/content-area/ancillary/tips.html',
			'viewModels/footer/footer', 'text!views/footer/footer.html',
		];
		resolve(configObj);
	});
};