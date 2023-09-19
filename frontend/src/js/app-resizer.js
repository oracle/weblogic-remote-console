/**
 * @license
 * Copyright (c) 2023, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', 'wrc-frontend/integration/controller', 'wrc-frontend/integration/viewModels/utils', 'wrc-frontend/core/utils', 'ojs/ojlogger', 'wrc-frontend/integration/panel_resizer'],
  function (ResponsiveUtils, ResponsiveKnockoutUtils, Controller, ViewModelUtils, CoreUtils, Logger) {
    const PANEL_RESIZER_WIDTH = parseInt(ViewModelUtils.getCustomCssProperty('panel-resizer-width'), 10);
    const NAVSTRIP_WIDTH = parseInt(ViewModelUtils.getCustomCssProperty('navstrip-max-width'), 10);
    const NAVTREE_MIN_WIDTH = parseInt(ViewModelUtils.getCustomCssProperty('resizer-left-panel-min-width'), 10);
    const NAVTREE_MAX_WIDTH = parseInt(ViewModelUtils.getCustomCssProperty('navtree-max-width'), 10);
    const LEFT_PANEL_MAX_WIDTH_MARGIN = 17;
    const LEFT_PANEL_MIN_WIDTH_MARGIN = 10;
    const RIGHT_PANEL_MIN_WIDTH_MARGIN = 5;
    const RIGHT_PANEL_FIXED_MIN_WIDTH = parseInt(ViewModelUtils.getCustomCssProperty('form-container-fixed-min-width'), 10);
    const RIGHT_PANEL_RESIZER_MAX_HEIGHT = parseInt(ViewModelUtils.getCustomCssProperty('container-resizer-offset-max-height'), 10);

    function AppResizer(globalBodySelector) {
      registerAppResizerSignalAddListeners();
      registerResizeObserver(globalBodySelector);
    }

    const registerAppResizerSignalAddListeners = () => {
      Controller.getSignal('resizeObserverTriggered').add(resizerData => {
        console.log(`[APP-RESIZER] resizerData=${JSON.stringify(resizerData)}`);
        let maxWidthVariable = resizerData['globalBody'].width - resizerData['right_panel'].width;
        maxWidthVariable = (NAVTREE_MIN_WIDTH + NAVSTRIP_WIDTH + PANEL_RESIZER_WIDTH + LEFT_PANEL_MAX_WIDTH_MARGIN);
        document.documentElement.style.setProperty('--landing-page-panel-subtree-calc-max-width', `${maxWidthVariable}px`);
        document.documentElement.style.setProperty('--landing-page-conveyor-calc-max-width', `${maxWidthVariable}px`);
        maxWidthVariable = (resizerData.globalBody.width - (resizerData.NAVSTRIP_WIDTH + resizerData.left_panel.width + resizerData.PANEL_RESIZER_WIDTH));
        document.documentElement.style.setProperty('--content-area-header-calc-min-width', `${maxWidthVariable}px`);
        maxWidthVariable = (resizerData.NAVSTRIP_WIDTH + resizerData.left_panel.width + resizerData.PANEL_RESIZER_WIDTH + LEFT_PANEL_MIN_WIDTH_MARGIN);
        document.documentElement.style.setProperty('--content-area-body-toolbars-calc-max-width', `${maxWidthVariable}px`);
        maxWidthVariable = (resizerData.NAVSTRIP_WIDTH + resizerData.left_panel.width + resizerData.PANEL_RESIZER_WIDTH + LEFT_PANEL_MIN_WIDTH_MARGIN);
        document.documentElement.style.setProperty('--instructions-calc-max-width', `${maxWidthVariable}px`);
        document.documentElement.style.setProperty('--content-area-body-content-calc-max-width', `${maxWidthVariable}px`);
        maxWidthVariable = (resizerData.NAVSTRIP_WIDTH + resizerData.left_panel.width + resizerData.PANEL_RESIZER_WIDTH + RIGHT_PANEL_MIN_WIDTH_MARGIN);
        document.documentElement.style.setProperty('--table-container-calc-max-width', `${maxWidthVariable}px`);
        maxWidthVariable = (resizerData.NAVSTRIP_WIDTH + resizerData.left_panel.width + resizerData.PANEL_RESIZER_WIDTH);
        document.documentElement.style.setProperty('--beanpath-history-container-calc-min-width', `${maxWidthVariable}px`);
        maxWidthVariable = (resizerData['right_panel'].width);
        document.documentElement.style.setProperty('--textarea-resizable-both-calc-width', `${maxWidthVariable}px`);
/*
//MLW
        setContainerOffsetMaxHeight('#form-container', '--form-container-calc-max-height');
        setContainerOffsetMaxHeight('#table-container', '--table-container-calc-max-height');
*/
      });
      Controller.getSignal('resizeObserveeNudged').add((source) => {
        let maxWidthVariable = parseInt(ViewModelUtils.getCustomCssProperty('content-area-container-calc-min-width'), 10);
        maxWidthVariable += (maxWidthVariable === NAVTREE_MAX_WIDTH ? -1 : 1);
        document.documentElement.style.setProperty('--content-area-container-calc-min-width', `${maxWidthVariable}px`);
      });

    };

    const registerResizeObserver = (globalBodySelector) => {
      function getObservee(selector) {
        return document.querySelector(selector);
      }

      function registerObservee(key, selector, observee) {
        globalBody.observee[key] = selector;
        globalBody.observer.observe(observee);
      }

      let resizerData = {
        'PANEL_RESIZER_WIDTH': PANEL_RESIZER_WIDTH,
        'NAVSTRIP_WIDTH': NAVSTRIP_WIDTH,
        'NAVTREE_MIN_WIDTH': NAVTREE_MIN_WIDTH,
        'NAVTREE_MAX_WIDTH': NAVTREE_MAX_WIDTH,
        'LEFT_PANEL_MAX_WIDTH_MARGIN': LEFT_PANEL_MAX_WIDTH_MARGIN,
        'LEFT_PANEL_MIN_WIDTH_MARGIN': LEFT_PANEL_MIN_WIDTH_MARGIN,
        'RIGHT_PANEL_RESIZER_MAX_HEIGHT': RIGHT_PANEL_RESIZER_MAX_HEIGHT,
        'globalBody': {}
      };

      const ro = new ResizeObserver(entries => {
        resizerData['globalBody'] = entries[0].contentRect;

        let leftPanel = getObservee('.left_panel');
        if (leftPanel !== null) {
          const selector = globalBody.observee['left_panel'];
          if (typeof selector === 'undefined') {
            registerObservee('left_panel', '.left_panel', leftPanel);
          }
        }

        let rightPanel = getObservee('.right_panel');
        if (rightPanel !== null) {
          const selector = globalBody.observee['right_panel'];
          if (typeof selector === 'undefined') {
            registerObservee('right_panel', '.right_panel', rightPanel);
          }
        }

      });

      const globalBody = document.querySelector(globalBodySelector);
      if (globalBody !== null) {
        globalBody['observee'] = {};
        globalBody['observer'] = new ResizeObserver(entries => {
          for (const entry of entries) {
            const key = (entry.target.className.includes('left_panel') ? 'left_panel' : entry.target.className);
            resizerData[key] = entry.contentRect;
          }
          Controller.getSignal('resizeObserverTriggered').dispatch(resizerData);
        });
        ro.observe(globalBody);
      }

    };

    function resizeContentAreaElements(source, newOffsetLeft, newOffsetWidth) {
      const viewPortValues = getBrowserViewPortValues();
      Logger.info(`[APP-RESIZER] window.width=${viewPortValues.width}, window.height=${viewPortValues.height}`);
      if (newOffsetWidth !== viewPortValues.width) resizeDomainsToolbarRight(source, newOffsetLeft, newOffsetWidth);
      resizeContentAreaBodyContainer(source);
    }

    function resizeDomainsToolbarRight(source, newOffsetLeft, newOffsetWidth) {
      let marginRightVariable;
      if (source === 'closer') {
        if (newOffsetWidth === NAVTREE_MIN_WIDTH) {
          marginRightVariable = 0;
        } else {
          marginRightVariable = NAVSTRIP_WIDTH;
        }
      } else if (source === 'opener') {
        marginRightVariable = newOffsetWidth;
      } else if (source === 'navtree') {
        marginRightVariable = 0;
      }
      document.documentElement.style.setProperty('--content-area-header-toolbar-right-margin-right', `${marginRightVariable}px`);
    }

    /**
     *
     * @param {string} source
     * @param {string} containerDOMSelector
     * @private
     * @example
     * containerDOMSelector
     *  '#form-container'
     *  '#table-container'
     *  '#landing-page'
     */
    function resizeContentAreaBodyContainer(source, containerDOMSelector) {
      if (source === 'opener') {
        let maxWidthVariable = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--content-area-header-toolbar-right-margin-right'), 10);
        maxWidthVariable += (NAVSTRIP_WIDTH + PANEL_RESIZER_WIDTH);
        document.documentElement.style.setProperty('--form-container-calc-max-width', `${maxWidthVariable}px`);
      }
    }

    function getContainerOffsetTop(containerDOMSelector) {
      const getOffsetTop = element => {
        let offsetTop = 0;
        while(element) {
          offsetTop += element.offsetTop;
          element = element.offsetParent;
        }
        return offsetTop;
      };

      let offsetTop = 0;
      const container = document.querySelector(containerDOMSelector);
      if (container !== null) {
        offsetTop = getOffsetTop(container);
      }
      return offsetTop;
    }

    function setContainerOffsetMaxHeight(containerDOMSelector, customCSSVariable) {
      const offsetMaxHeight = getContainerOffsetTop(containerDOMSelector);
      if (offsetMaxHeight > 0) {
        document.documentElement.style.setProperty(customCSSVariable, `${offsetMaxHeight}px`);
      }
    }

    function getBrowserViewPortValues() {
      const viewPortValues = {height: 0, width: 0};
      if (CoreUtils.isNotUndefinedNorNull(window)) {
        viewPortValues.height = $(window).height();
        viewPortValues.width = $(window).width();
      }
      return viewPortValues;
    }

  //public:
    AppResizer.prototype = {
      PANEL_RESIZER_WIDTH: PANEL_RESIZER_WIDTH,
      NAVSTRIP_WIDTH: NAVSTRIP_WIDTH,
      NAVTREE_MIN_WIDTH: NAVTREE_MIN_WIDTH,
      NAVTREE_MAX_WIDTH: NAVTREE_MAX_WIDTH,
      resizeTriggered: (source, newOffsetLeft, newOffsetWidth) => {
        if (newOffsetWidth > 0) {
          let minWidthVariable;
          switch (newOffsetWidth) {
            case (NAVSTRIP_WIDTH + PANEL_RESIZER_WIDTH):
              minWidthVariable = newOffsetWidth;
              document.documentElement.style.setProperty('--content-area-container-calc-min-width', `${minWidthVariable}px`);
              break;
            case NAVTREE_MIN_WIDTH:
              minWidthVariable = NAVSTRIP_WIDTH + PANEL_RESIZER_WIDTH;
              document.documentElement.style.setProperty('--content-area-container-calc-min-width', `${minWidthVariable}px`);
              break;
            case NAVTREE_MAX_WIDTH:
            case (NAVSTRIP_WIDTH + NAVTREE_MAX_WIDTH):
              minWidthVariable = newOffsetWidth;
              document.documentElement.style.setProperty('--content-area-container-calc-min-width', `${minWidthVariable}px`);
              break;
            default:
              minWidthVariable = PANEL_RESIZER_WIDTH;
              document.documentElement.style.setProperty('--content-area-container-calc-min-width', `${minWidthVariable}px`);
              break;
          }
        }
        else {
          Logger.info('[APP-RESIZER] newOffsetWidth=0');
        }

        resizeContentAreaElements(source, newOffsetLeft, newOffsetWidth);
      }

    };

    // Return constructor function
    return AppResizer;
  }
);