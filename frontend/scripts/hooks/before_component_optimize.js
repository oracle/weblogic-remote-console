/**
 Copyright (c) 2015, 2024, Oracle and/or its affiliates.
 Licensed under The Universal Permissive License (UPL), Version 1.0
 as shown at https://oss.oracle.com/licenses/upl/
 
 */

'use strict';

module.exports = function (configObj) {
	return new Promise((resolve, reject) => {
		console.log("Running before_component_optimize hook.");
		configObj.requireJs.include = [
			'jet-composites/cfe-policy-editor/1.0.0/wizard/viewModels/policy-editor-wizard-page',
			'text!jet-composites/cfe-policy-editor/1.0.0/wizard/views/policy-editor-wizard-page.html',
			'jet-composites/wrc-frontend/1.0.0/integration/viewModels/composite',
			'text!jet-composites/wrc-frontend/1.0.0/integration/views/composite.html',
			'jet-composites/wrc-frontend/1.0.0/integration/viewModels/configuration',
			'text!jet-composites/wrc-frontend/1.0.0/integration/views/configuration.html',
			'jet-composites/wrc-frontend/1.0.0/integration/viewModels/modeling',
			'text!jet-composites/wrc-frontend/1.0.0/integration/views/modeling.html',
			'jet-composites/wrc-frontend/1.0.0/integration/viewModels/monitoring',
			'text!jet-composites/wrc-frontend/1.0.0/integration/views/monitoring.html',
			'jet-composites/wrc-frontend/1.0.0/integration/viewModels/perspective',
			'jet-composites/wrc-frontend/1.0.0/integration/viewModels/properties',
			'text!jet-composites/wrc-frontend/1.0.0/integration/views/properties.html',
			'jet-composites/wrc-frontend/1.0.0/integration/viewModels/security',
			'text!jet-composites/wrc-frontend/1.0.0/integration/views/security.html',
			'jet-composites/wrc-frontend/1.0.0/integration/viewModels/view',
			'text!jet-composites/wrc-frontend/1.0.0/integration/views/view.html',
			'jet-composites/wrc-frontend/1.0.0/integration/viewModels/content-area/recent-pages',
			'text!jet-composites/wrc-frontend/1.0.0/integration/views/content-area/recent-pages.html',
			'jet-composites/wrc-frontend/1.0.0/integration/viewModels/content-area/body/overlay-form-dialog',
			'text!jet-composites/wrc-frontend/1.0.0/integration/views/content-area/body/overlay-form-dialog.html',
			'jet-composites/wrc-frontend/1.0.0/integration/viewModels/content-area/body/table-customizer',
			'text!jet-composites/wrc-frontend/1.0.0/integration/views/content-area/body/table-customizer.html',
			'jet-composites/wrc-frontend/1.0.0/integration/viewModels/content-area/body/table',
			'text!jet-composites/wrc-frontend/1.0.0/integration/views/content-area/body/table.html',
			'jet-composites/wrc-frontend/1.0.0/integration/viewModels/content-area/body/table-toolbar',
			'text!jet-composites/wrc-frontend/1.0.0/integration/views/content-area/body/table-toolbar.html',
			'jet-composites/wrc-frontend/1.0.0/integration/viewModels/content-area/body/table-actions-strip',
			'text!jet-composites/wrc-frontend/1.0.0/integration/views/content-area/body/table-actions-strip.html',
			'jet-composites/wrc-frontend/1.0.0/integration/viewModels/content-area/body/form',
			'text!jet-composites/wrc-frontend/1.0.0/integration/views/content-area/body/form.html',
			'jet-composites/wrc-frontend/1.0.0/integration/viewModels/content-area/body/form-toolbar',
			'text!jet-composites/wrc-frontend/1.0.0/integration/views/content-area/body/form-toolbar.html',
			'jet-composites/wrc-frontend/1.0.0/integration/viewModels/content-area/body/form-actions-strip',
			'text!jet-composites/wrc-frontend/1.0.0/integration/views/content-area/body/form-actions-strip.html',
			'jet-composites/wrc-frontend/1.0.0/integration/viewModels/content-area/body/form-tabstrip',
			'text!jet-composites/wrc-frontend/1.0.0/integration/views/content-area/body/form-tabstrip.html'
		];
		resolve(configObj);
	});
};