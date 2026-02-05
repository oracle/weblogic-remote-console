/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/

'use strict';

module.exports = function (configObj) {
	return new Promise((resolve, reject) => {
		console.log("Running before_release_build hook.");
		const dependentFiles = [
			{src: 'src/js/jet-composites/wrc-frontend/core/utils.js', dest: 'js/jet-composites/cfe-policy-editor/wizard'},
			{src: 'src/js/jet-composites/wrc-frontend/microservices/policy-management/condition-parser.js', dest: 'js/jet-composites/cfe-policy-editor/wizard'}
		];
		const fs = require('fs');
		
		for (const dependentFile of dependentFiles) {
			console.log(`Copying ${dependentFile.src} to ${dependentFile.dest}`);
			fs.copyFile(dependentFile.src, dependentFile.dest, (err) => {
				if (err) {
					reject(err);
				}
				else {
					console.log('Copy operation succeeded.');
				}
			});
		}
		
		resolve(configObj);
	});
};
