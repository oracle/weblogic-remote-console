/**
 * @license
 * Copyright (c) 2020, 2024 Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

/**
 * Class for calculating the actual ``min-height`` of a form or table container, in the Content Area.
 * @module
 * @class
 * @classdesc Class for calculating the actual ``min-height`` of a form or table container, in the Content Area.
 */
define([
  'wrc-frontend/microservices/perspective/perspective-memory-manager',
  'wrc-frontend/integration/viewModels/utils'
],
  function (
    PerspectiveMemoryManager,
    ViewModelUtils
  ) {

    //public:
    /**
     * Create a new resizer for the Content Area
     * @constructor
     * @param {Perspective} perspective
     * @typedef ContentAreaContainerResizer
     */
    function ContentAreaContainerResizer(perspective){
      this.perspectiveMemory = PerspectiveMemoryManager.getPerspectiveMemory(perspective.id);
    }

    ContentAreaContainerResizer.prototype = {
      /**
       * Returns the actual number of pixels to use, for ``max-height`` of the form or table container.
       * <p>This is a calculation based on the information in the options parameter, as well as height calculations that take into consideration that the container is in a Flexbox layout.</p>
       * @param {string} containerDOMSelector
       * @param {string} offsetHeightCSSVariable
       * @param {{withHistoryVisible?: boolean, withHelpVisible?: boolean}} options
       * @returns {Number}
       */
      getOffsetMaxHeight: function(containerDOMSelector, offsetHeightCSSVariable, options) {
        const getOffsetTop = (element, options) => {
          let offsetTop = 0;
          while(element) {
            offsetTop += element.offsetTop;
            element = element.offsetParent;
          }

          if (options.withHelpVisible) {
            const helpFooter = document.querySelector('tfoot.oj-table-footer');
            offsetTop += (helpFooter !== null ? helpFooter.offsetHeight : 0);
          }
          else if (options.isPolicyForm) {
            offsetTop -= 30;
          }

          return offsetTop;
        };

        options.withHistoryVisible = options.withHistoryVisible || false;
        options.withHelpVisible = options.withHelpVisible || false;

        // Get what perspective memory has for current
        // state of beanPath history visibility.
        const wasHistoryVisible = this.perspectiveMemory.historyVisibility.call(this.perspectiveMemory);
        // Get what perspective memory has for current
        // state of help visibility.
        const wasHelpVisible = this.perspectiveMemory.helpVisibility.call(this.perspectiveMemory);
        // Set initial value of return variable to the
        // height of the fixed footer (70px), plus it's
        // margin-top (5px), plus it's margin-bottom (5px).
        let offsetValue = parseInt(ViewModelUtils.getCustomCssProperty(offsetHeightCSSVariable), 10);

        if (wasHistoryVisible && !options.withHistoryVisible) {
          offsetValue -= (wasHelpVisible && options.withHelpVisible ? 40 : 30);
        }

        if (wasHelpVisible && options.withHelpVisible) {
          offsetValue = (!wasHistoryVisible && options.withHistoryVisible ? offsetValue + 40 : offsetValue + 30);
        }
        else if (options.withHelpVisible) {
          offsetValue = (wasHelpVisible ? offsetValue - 40 : offsetValue + 40);
        }
        else if (options.withHistoryVisible) {
          offsetValue += (!wasHistoryVisible ? 40 : 5);
        }

        this.perspectiveMemory.setHistoryVisibility.call(this.perspectiveMemory, options.withHistoryVisible);
        this.perspectiveMemory.setHelpVisibility.call(this.perspectiveMemory, options.withHelpVisible);

        const container = document.querySelector(containerDOMSelector);
        let offsetTop = (container !== null ? getOffsetTop(container, options) : 0);
        return offsetTop + offsetValue;
      }
    };

    // Return ContentAreaContainerResizer constructor function
    return ContentAreaContainerResizer;
  }
);
