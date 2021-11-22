/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(['ojs/ojcore', 'knockout', 'ojs/ojmodule-element-utils', 'ojs/ojcontext', '../core/utils', 'ojs/ojmodule-element', 'ojs/ojknockout',  'ojs/ojnavigationlist'],
  function(oj, ko, ModuleElementUtils, Context, CoreUtils) {
    function HomeViewModel(viewParams) {
      const self = this;

      this.i18n = {
        tabstrip: {
          tabs: [
            {id: "gallery", iconFile: "gallery-tabstrip-icon_24x24", disabled: false, visible: true, isDefault: true,
              label: oj.Translations.getTranslatedString("wrc-home.tabstrip.tabs.gallery.label")
            }
          ]
        }
      };

      this.router = viewParams.parentRouter.getChildRouter("home");

      if (CoreUtils.isNotUndefinedNorNull(this.router)) this.router.dispose();

      this.router = viewParams.parentRouter.createChildRouter("home").configure({
        "gallery": {label: "Gallery", value: "gallery", isDefault: true}
      });

      this.router.currentValue.subscribe(function (value) {
        if (value) {
          ModuleElementUtils.createConfig({
            name: value,
            viewPath: 'views/' + value + '.html',
            modelPath: 'viewModels/' + value,
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
      };

      function setTabNode(tabNode) {
        if (!tabNode.disabled) self.router.go(tabNode.id);
      }

      Context.getPageContext().getBusyContext().whenReady()
        .then(function () {
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
