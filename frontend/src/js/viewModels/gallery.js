/**
 * @license
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['ojs/ojcore', 'knockout', 'ojs/ojhtmlutils', 'wrc-frontend/microservices/perspective/perspective-manager', 'wrc-frontend/microservices/provider-management/data-provider-manager', 'wrc-frontend/core/runtime', 'wrc-frontend/core/types', 'wrc-frontend/core/utils', 'ojs/ojknockout', 'ojs/ojbinddom'],
  function (oj, ko, HtmlUtils, PerspectiveManager, DataProviderManager, Runtime, CoreTypes, CoreUtils) {
    function GalleryTabTemplate(viewParams) {
      const self = this;

      this.galleryItems = ko.observableArray();

      function loadGalleryItems(dataProvider) {
        let dataArray = [];
        if (CoreUtils.isNotUndefinedNorNull(dataProvider)) {
          dataArray = dataProvider.beanTrees;
        }
        else {
          dataProvider = DataProviderManager.getLastActivatedDataProvider();
          if (CoreUtils.isNotUndefinedNorNull(dataProvider)) {
            dataArray = dataProvider.beanTrees;
          }
        }

        // dataArray will be empty if:
        //
        //  1. There is no default project, or
        //  2. No dataProvider parameter was passed into this function, or
        //  3. The default project did not have any data providers

        if (dataArray.length > 0) {
          dataArray.forEach((beanTree) => {
            const perspective = PerspectiveManager.getByBeanTreeType(beanTree.type);
            beanTree['iconFile'] = perspective.iconFiles['light'];
            beanTree['content'] = { view: HtmlUtils.stringToNodeArray(oj.Translations.getTranslatedString(`wrc-gallery.cards.${beanTree.type}.description`))};
          });
        }

        return dataArray;
      }

      this.signalBindings = [];

      this.connected = function () {
        // Be sure to create a binding for any signaling add in
        // this module. In fact, the code for the add needs to
        // be moved here physically.

        let binding = viewParams.signaling.dataProviderSelected.add(dataProvider => {
          self.galleryItems(loadGalleryItems(dataProvider));
          signalDataProviderChanged(dataProvider);
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.dataProviderRemoved.add(removedDataProvider => {
          const beanTree = self.galleryItems().find(item => item.provider.id === removedDataProvider.id);
          if (CoreUtils.isNotUndefinedNorNull(beanTree)) {
            // This means removedDataProvider is for the
            // gallery items being displayed on the "Home"
            // page, so they need to be removed.
            self.galleryItems.valueWillMutate();
            self.galleryItems.removeAll();
            self.galleryItems.valueHasMutated();
          }
          else {
            self.galleryItems(loadGalleryItems());
          }
        });

        self.signalBindings.push(binding);

        self.galleryItems(loadGalleryItems());
      }.bind(this);

      this.disconnected = function () {
        // Detach all signal "add" bindings
        self.signalBindings.forEach(binding => { binding.detach(); });

        // Reinitialize module-scoped array for storing
        // signal "add" bindings, so it can be GC'd by
        // the JS engine.
        self.signalBindings = [];
      }.bind(this);

      /**
       * Returns the NLS translated string for the tooltip of a navstrip item.
       * <p>It allows us to do two main things:
       * <ol>
       *   <li>Avoid putting oj.Translations.getTranlatedString() functions in the .html</li>
       *   <li>To restrict the use of the oj.Translations.getTranlatedString() function to the i18n object</li>
       * </ol>
       * @param {string} id
       * @returns {string}
       */
      this.getTooltip = function(id) {
        return oj.Translations.getTranslatedString(`wrc-gallery.cards.${id}.label`);
      };

      /**
       * Called when user clicks icon or label of sideways tabstrip item
       * @param event
       */
      this.galleryPanelClickHandler = function(event) {
        // The id attribute with the perspectiveId assigned
        // to it, is on the first child element of the
        // click event's current target. The click event's
        // current target is the <a> tag, and the first
        // child element (e.g. children[0]) of that is a
        // <div> tag.
        let value = event.currentTarget.children[0].id;

        if (CoreUtils.isUndefinedOrNull(value)) {
          return;
        }

        const beanTree = getSelectedBeanTree(value);
        if (CoreUtils.isUndefinedOrNull(beanTree)) {
          return;
        }

        const dataProvider = DataProviderManager.getDataProviderById(beanTree.provider.id);
        if (dataProvider.state === CoreTypes.Domain.ConnectState.CONNECTED.name) {
          viewParams.signaling.beanTreeChanged.dispatch(beanTree);

          Runtime.setProperty(Runtime.PropertyName.CFE_IS_READONLY, CoreUtils.isUndefinedOrNull(beanTree.readOnly) ? false : beanTree.readOnly);
          viewParams.signaling.readonlyChanged.dispatch(Runtime.isReadOnly());

          // Tell root router to navigate to the landing
          // page associated with the selected beanTree.
          viewParams.parentRouter.go('/landing/' + value);

          // The Kiosk will more than likely just be in the
          // way going forward, so go ahead and collapse it.
          viewParams.signaling.ancillaryContentAreaToggled.dispatch('gallery', false);
        }
      };

      function getSelectedBeanTree(beanTreeType) {
        let beanTree;
        const index = CoreUtils.getLastIndex(self.galleryItems(), 'type', beanTreeType);
        if (index !== -1) beanTree = self.galleryItems()[index];
        return beanTree;
      }

      function signalDataProviderChanged(dataProvider) {
        viewParams.signaling.beanTreeChanged.dispatch({type: 'home', label: oj.Translations.getTranslatedString('wrc-content-area-header.toolbar.buttons.home.label'), provider: {id: dataProvider.id, name: dataProvider.name}});
      }

    }

    return GalleryTabTemplate;
  }
);
