/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(['knockout', 'ojs/ojmodule-element-utils', '../cfe/common/runtime', 'ojs/ojcontext', 'ojs/ojlogger', 'ojs/ojmodule-element', 'ojs/ojknockout',  'ojs/ojnavigationlist'],
  function(ko, ModuleElementUtils, Runtime, Context, Logger) {
    function HomeViewModel(viewParams) {
      const self = this;

      this.i18n = {
        tabstrip: {
          tabs: [
            {id: "gallery", label: "Gallery", iconFile: "gallery-tabstrip-icon_24x24", disabled: false, visible: true, isDefault: true},
            {id: "desktop", label: "Desktop", iconFile: "desktop-tabstrip-icon_24x24", disabled: true, visible: false}
          ]
        }
      };

      this.router = viewParams.parentRouter.getChildRouter("home");

      if (typeof this.router !== "undefined") this.router.dispose();

      this.router = viewParams.parentRouter.createChildRouter("home").configure({
        "gallery": {label: "Gallery", value: "gallery", isDefault: true},
        "desktop": {label: "Desktop", value: "desktop"}
      });

      this.router.currentValue.subscribe(function (value) {
        if (value) {
          ModuleElementUtils.createConfig({
            name: 'template/' + value,
            viewPath: 'views/template/' + value + '.html',
            modelPath: 'viewModels/template/' + value,
            params: {
              parentRouter: this.router,
              signaling: viewParams.signaling
            }
          })
          .then(this.tabModuleConfig);
        }
        else {
          this.tabModuleConfig({ view: [], viewModel: null });
        }
      }.bind(this));

      this.tabModuleConfig = ko.observable({ view: [], viewModel: null });

      /**
       * Called when user clicks icon or label of sideways tabstrip item
       * @param event
       */
      this.tabstripButtonClickHandler = function(event) {
        let id;
        if (event.target.localName === "img") {
          id = event.target.nextElementSibling.id;
        }
        else if (event.target.id && event.target.id.length !== 0) {
          id = event.target.id;
        }
        else {
          return;
        }

        const tabNode = self.i18n.tabstrip.tabs.find(item => item.id === id);
        setTabNode(tabNode);
      }

      function setTabNode(tabNode) {
        if (!tabNode.disabled) self.router.go(tabNode.id);
      }

      Context.getPageContext().getBusyContext().whenReady()
      .then(function () {
        const newPerspective = {id: "home", label: "Home"};
        viewParams.signaling.perspectiveChanged.dispatch(newPerspective);
        document.title = Runtime.getName() + " - " + newPerspective.label;
        setTabNode(self.i18n.tabstrip.tabs[0]);    // "gallery"
      });

    }
  
    /*
    * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
    * return a constructor for the ViewModel so that the ViewModel is constructed
    * each time the view is displayed.
    */
     return HomeViewModel;
   }
 );
