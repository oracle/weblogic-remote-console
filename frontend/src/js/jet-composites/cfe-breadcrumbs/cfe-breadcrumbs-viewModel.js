/**
 Copyright (c) 2024, 2025, Oracle and/or its affiliates.
 Licensed under The Universal Permissive License (UPL), Version 1.0
 as shown at https://oss.oracle.com/licenses/upl/

 */
'use strict';

define([
  'knockout',
  'ojs/ojarraydataprovider',
  'wrc-frontend/microservices/perspective/perspective-memory-manager',
  'wrc-frontend/microservices/navtree/navtree-manager',
  'wrc-frontend/microservices/page-definition/utils',
  'wrc-frontend/integration/viewModels/utils',
  'wrc-frontend/core/utils',
  'ojs/ojlogger'
],
function (
  ko,
  ArrayDataProvider,
  PerspectiveMemoryManager,
  PageDefinitionUtils,
  ViewModelUtils,
  CoreUtils
) {
    function BreadcrumbsViewModel(context) {
      const self = this;

      this.beanTree = ko.observable(context.properties.beanTree);

      // START: knockout observables referenced in cfe-breadcrumbs-view.html
      this.navigator = {
        visible: ko.observable(context.properties.navigator.visible),
        imageData: ko.observable([
          {
            id: 'beanpath-history-previous',
            iconFile: ko.observable('beanpath-history-previous-gry_24x24'),
            tooltip: 'Back'
          },
          {
            id: 'beanpath-history-next',
            iconFile: ko.observable('beanpath-history-next-blk_24x24'),
            tooltip: 'Next'
          }
        ])
      };

      this.breadcrumbs = ko.observable([]);
      this.linksData = ko.observable();
      // END: knockout observables referenced in cfe-breadcrumbs-view.html

      this.perspectiveMemory = PerspectiveMemoryManager.getPerspectiveMemory(this.beanTree.type);

      this.propertyChanged = function (context) {
        switch (context.property) {
          case 'visible':
            self.perspectiveMemory.setBreadcrumbsVisibility(context.value);
            break;
          case 'beanTree':
            self.beanTree(context.value);
            break;
        }
      };

      this.createBreadcrumbs = function (reply) {
        const self = this;
        return new Promise(function (resolve) {
          let breadcrumbLabels = [];
          if (reply) {
            let rdj = reply.body.data.get('rdjData');
            let breadCrumbs = rdj?.breadCrumbs;
            if (CoreUtils.isNotUndefinedNorNull(breadCrumbs)) {
              breadCrumbs.push(rdj.self);
              breadcrumbLabels = self.getBreadcrumbLabels(breadCrumbs);
              resolve(breadcrumbLabels);
            }
            else {
              resolve(breadcrumbLabels);
            }
          }
          else {
            resolve(breadcrumbLabels);
          }
        });
      };

      this.getBreadcrumbLabels = function (breadcrumbs) {
        const self = this;
        self.breadcrumbs([]);
        let breadcrumbLabels = [];

        breadcrumbs.forEach(breadcrumb => {
          self.breadcrumbs.push(breadcrumb);
          breadcrumbLabels.push(breadcrumb.label);
        });

        return breadcrumbLabels;
      };

      this.renderBreadcrumbs = function (linksData) {
        self.linksData(linksData);
      };

      this.breadcrumbsNavigatorClick = function (event) {
        console.log(`[CFE-BREADCRUMBS] breadcrumbsNavigatorClick, event.currentTarget.id=${event.currentTarget.id}`);
      };

      this.breadcrumbClick = function (event) {
        console.log(`[CFE-BREADCRUMBS] breadcrumbClick, event.currentTarget.id=${event.currentTarget.id}`);
      }
      
    }

    return BreadcrumbsViewModel;
  }
);