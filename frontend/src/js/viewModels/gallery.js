/**
 * @license
 * Copyright (c) 2020, 2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define([
    'ojs/ojcore',
    'knockout',
    'ojs/ojhtmlutils',
    'wrc-frontend/common/keyup-focuser',
    'ojs/ojcontext',
    'wrc-frontend/microservices/perspective/perspective-manager',
    'wrc-frontend/microservices/provider-management/data-provider-manager',
    'wrc-frontend/integration/viewModels/utils',
    'wrc-frontend/core/runtime',
    'wrc-frontend/core/types',
    'wrc-frontend/core/utils',
    'ojs/ojknockout',
    'ojs/ojbinddom'
  ],
  function (
    oj,
    ko,
    HtmlUtils,
    KeyUpFocuser,
    Context,
    PerspectiveManager,
    DataProviderManager,
    ViewModelUtils,
    Runtime,
    CoreTypes,
    CoreUtils
  ) {
    function GalleryTabTemplate(viewParams) {
      const self = this;

      this.i18n = {
        'ariaLabel': {
          'cards': {
            'panel': {
              'value': oj.Translations.getTranslatedString('wrc-gallery.ariaLabel.cards.panel.value')
            }
          }
        }
      };

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
          else {
            dataArray = self.galleryItems();
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
            beanTree['title'] = oj.Translations.getTranslatedString(`wrc-gallery.cards.${beanTree.type}.label`);
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
          Context.getPageContext().getBusyContext().whenReady()
            .then(() => {
              let rule = KeyUpFocuser.getLastExecutedRule('.gallery-panel-card');
              const focusItem = $('.gallery-panel-card')[rule.focusIndexValue];
              if (rule.focusIndexValue !== -1 &&
                CoreUtils.isNotUndefinedNorNull(focusItem)
              ) {
                rule = KeyUpFocuser.setFocusItems('.gallery-panel-card', {focusItems: self.galleryItems().map(({type}) => type)});
                focusItem.focus();
              }
            });
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

            viewParams.signaling.appMenuChangeRequested.dispatch('gallery', 'disableMenu', true, {menuId: 'goMenu', menuItemId: 'shoppingCartDrawer'});
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
       * Called when user clicks a card
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

        // Strip '-gallery-panel-card' suffix from value
        value = value.replace('-gallery-panel-card', '');

        const beanTree = getSelectedBeanTree(value);
        if (CoreUtils.isUndefinedOrNull(beanTree)) {
          return;
        }

        const dataProvider = DataProviderManager.getDataProviderById(beanTree.provider.id);

        if (CoreUtils.isUndefinedOrNull(dataProvider.state)) {
          DataProviderManager.activateAdminServerConnection(dataProvider)
            .then(reply => {
              dataProvider.populateFromResponse(reply.body.data);
              if (dataProvider.state === CoreTypes.Domain.ConnectState.CONNECTED.name) {
                handleGalleryItemSelected(beanTree, value);
              }
            })
            .catch(response => {
              ViewModelUtils.failureResponseDefaultHandling(response);
            });
        }
        else if (dataProvider.state === CoreTypes.Domain.ConnectState.CONNECTED.name) {
          handleGalleryItemSelected(beanTree, value);
        }
      };

      this.registerKeyUpFocuser = (id) => {
        let result = KeyUpFocuser.getKeyUpCallback(id);

        if (!result.alreadyRegistered) {
          const options = {
            focusItems: self.galleryItems().map(({type}) => type)
          };

          result = KeyUpFocuser.register(
            id,
            {
              Tab: {key: 'Tab', action: 'navigate', callback: onKeyUpFocuserNavigateKeyEvent},
              ArrowUp: {key: 'ArrowUp', selector: '#home', isArray: false},
              Escape: {key: 'Escape', selector: '#home', isArray: false},
              ArrowRight: {key: 'ArrowRight', action: 'navigate'},
              ArrowLeft: {key: 'ArrowLeft', action: 'navigate'}
            },
            options
          );
        }

        return result.keyUpCallback;
      };

      function onKeyUpFocuserNavigateKeyEvent(event, focusRule) {
        const parseableId = document.activeElement.firstElementChild.id;
        if (CoreUtils.isNotUndefinedNorNull(parseableId)) {
          const parts = parseableId.split('-').filter((e) => {return e});
          if (parts.length > 1) {
            const focusItems = self.galleryItems().map(({type}) => type);
            if (focusItems.length > 0) {
              const index = focusItems.indexOf(parts[0]);
              if (index !== -1) {
                const keyUpFocuserId = `.${parts.slice(1).join('-')}`;
                KeyUpFocuser.setLastExecutedRule(keyUpFocuserId, {key: event.key, focusIndexValue: index});
              }
            }
          }
        }
      }

      function getSelectedBeanTree(beanTreeType) {
        let beanTree;
        const index = CoreUtils.getLastIndex(self.galleryItems(), 'type', beanTreeType);
        if (index !== -1) beanTree = self.galleryItems()[index];
        return beanTree;
      }

      function handleGalleryItemSelected(beanTree, beanTreeType) {
        viewParams.signaling.beanTreeChanged.dispatch(beanTree);
        Runtime.setProperty(Runtime.PropertyName.CFE_IS_READONLY, CoreUtils.isUndefinedOrNull(beanTree.readOnly) ? false : beanTree.readOnly);
        viewParams.signaling.readonlyChanged.dispatch(Runtime.isReadOnly());

        viewParams.signaling.ancillaryContentItemCleared.dispatch('gallery');
        viewParams.signaling.galleryItemSelected.dispatch(beanTreeType);
        viewParams.signaling.appMenuChangeRequested.dispatch('gallery', 'disableMenu', beanTree.type !== 'configuration', {menuId: 'goMenu', menuItemId: 'shoppingCartDrawer'});

        const focusIndexValue = self.galleryItems().findIndex(item => item.type === beanTree.type);
        KeyUpFocuser.setLastExecutedRule('.gallery-panel-card', {focusIndexValue: focusIndexValue});
      }

      function signalDataProviderChanged(dataProvider) {
        viewParams.signaling.beanTreeChanged.dispatch({type: 'home', label: oj.Translations.getTranslatedString('wrc-content-area-header.toolbar.buttons.home.label'), provider: {id: dataProvider.id, name: dataProvider.name, type: dataProvider.type}});
      }

    }

    return GalleryTabTemplate;
  }
);