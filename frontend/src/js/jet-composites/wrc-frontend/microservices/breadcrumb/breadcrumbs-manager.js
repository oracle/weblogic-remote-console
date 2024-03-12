/**
 * @license
 * Copyright (c) 2020, 2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define([
  'knockout',
  'ojs/ojarraydataprovider',
  'wrc-frontend/microservices/perspective/perspective-memory-manager',
  'wrc-frontend/microservices/navtree/navtree-manager',
  'wrc-frontend/microservices/page-definition/utils',
  'wrc-frontend/core/utils',
  'ojs/ojlogger'
],
  function (
    ko,
    ArrayDataProvider,
    PerspectiveMemoryManager,
    NavtreeManager,
    PageDefinitionUtils,
    CoreUtils,
    Logger
  ) {
    function BreadcrumbsManager(beanTree, breadcrumbsObservableArray, options = {}){
      this.perspectiveMemory = PerspectiveMemoryManager.getPerspectiveMemory(beanTree.type);
      this.navtreeManager = new NavtreeManager(beanTree);
      this.breadcrumbs = breadcrumbsObservableArray;
      this.navigatorVisible = (options?.navigator?.visibility ? options.navigator.visibility: false);
    }

    function createBreadcrumbNavigator() {
      const imageData = [
        {
          id: 'beanpath-history-previous',
          iconFile: 'beanpath-history-previous-gry_24x24',
          tooltip: 'Back',
          className: 'beanpath-history-navigator-icon',
          onClick: 'historyNavigatorClick'
        },
        {
          id: 'beanpath-history-next',
          iconFile: 'beanpath-history-next-blk_24x24',
          tooltip: 'Next',
          className: 'beanpath-history-navigator-icon',
          onClick: 'historyNavigatorClick'
        }
      ];
      const li = document.createElement('li');
      for (const data of imageData) {
        const image = document.createElement('img');
        image.setAttribute('src', 'js/jet-composites/wrc-frontend/1.0.0/images/' + data.iconFile + '.png');
        image.setAttribute('title', data.tooltip);

        const anchor = document.createElement('a');
        anchor.setAttribute('id', data.id);
        anchor.setAttribute('href', '#');
        anchor.setAttribute('tabindex', '-1');
        anchor.setAttribute('on-click', `[[${data.onClick}]]`);

        const span = document.createElement('span');
        span.className = data.className;

        span.append(image);
        anchor.append(span);
        li.append(anchor);
      }
      return li;
    }

    function createBreadcrumbMenu(button, linksData) {
      let option;
      const menu = document.createElement('oj-menu');
      menu.setAttribute('id', button.name + 'Menu');
      menu.setAttribute('on-oj-action', '[[breadcrumbMenuClickListener]]');
      menu.setAttribute('slot', 'menu');
      linksData.forEach((link) => {
        if (link.name === '---') {
          option = document.createElement('oj-option');
          option.innerText = '---';
          menu.append(option);
        }
        else if (link.name !== '') {
          option = document.createElement('oj-option');
          option.setAttribute('id', link.name);
          option.setAttribute('value', link.label);
          option.setAttribute('data-perspective', link.beanTreeType);
          option.setAttribute('data-path', link.identity);
          option.setAttribute('data-breadcrumbs', link.identity);
          option.setAttribute('data-notFoundMessage', link.message);
          const span = document.createElement('span');
          span.innerText = link.label;
          option.append(span);
          menu.append(option);
        }
      });
      return menu;
    }

  //public:
    BreadcrumbsManager.prototype = {
      createBreadcrumbs: function (reply) {
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
            } else {
              resolve(breadcrumbLabels);
            }
          } else {
            resolve(breadcrumbLabels);
          }
        });
      },

      getBreadcrumbLabels: function(breadcrumbs) {
        const self = this;
        self.breadcrumbs([]);
        let breadcrumbLabels = [];

        breadcrumbs.forEach(breadcrumb => {
          self.breadcrumbs.push(breadcrumb);
          breadcrumbLabels.push(breadcrumb.label);
        });

        return breadcrumbLabels;
      },

      renderBreadcrumbs: function(linksData) {
        let crumb, menu;

        const div = document.createElement('div');
        div.setAttribute('id', 'breadcrumbs-container');
        div.setAttribute('on-click', '[[accessKeyClick]]');
        const ul = document.createElement('ul');
        if (this.navigatorVisible) {
          // Create bean path history navigator
          const navigator = createBreadcrumbNavigator();
          ul.append(navigator);
        }
        this.breadcrumbs().forEach((item, index) => {
          item.name = 'breadcrumb';
          crumb = document.createElement('li');
          if (index === this.breadcrumbs().length-1) {
            if (CoreUtils.isNotUndefinedNorNull(linksData) && linksData.length > 0) {
              const button = document.createElement('oj-menu-button');
              button.setAttribute('chroming', 'borderless');
              button.innerText = item.label;
              menu = createBreadcrumbMenu.call(this, item, linksData);
              button.append(menu);
              crumb.append(button);
            }
            else {
              crumb.innerText = item.label;
            }
          }
          else {
            const anchor = document.createElement('a');
            anchor.setAttribute('id', item.resourceData);
            anchor.setAttribute('href', '#');
            anchor.setAttribute('on-click', '[[breadcrumbClick]]');
            anchor.innerText = item.label;
            crumb.append(anchor);
          }
          ul.append(crumb);
        });
        if (CoreUtils.isNotUndefinedNorNull(menu)) {
          ul.className = 'breadcrumb-crosslink';
        }
        else {
          ul.className = 'breadcrumb-link';
        }

        div.append(ul);
  
        const conveyor = document.createElement('oj-conveyor-belt');
        conveyor.setAttribute('arrow-visibility', 'auto');
        conveyor.setAttribute('content-parent', '#breadcrumbs-container');
  
        conveyor.append(div);

        return conveyor;
      },

      getBreadcrumbsVisibility: function () {
        return this.perspectiveMemory.breadcrumbsVisibility();
      },

      setBreadcrumbsVisibility: function (visible) {
        this.perspectiveMemory.setBreadcrumbsVisibility(visible);
      }
  
    };

    // Return BreadcrumbsManager constructor function
    return BreadcrumbsManager;
  }
);
