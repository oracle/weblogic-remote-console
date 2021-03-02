/**
 * @license
 * Copyright (c) 2020 Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

"use strict";

define(["hammerjs", "knockout", "ojs/ojknockout", "ojs/ojpopup"], 
  function (hammerjs) {
    /**
     * 
     * @param {*} rootElement  DOM element to position popup with
     * @param {*} helpDataAttr Defaults to 'data-title', if not provided
     * 
     * Examples:
     *  var root = document.getElementById('popupWrapper');
     *  var tooltipHelper = new TooltipHelper(root);
     */
    function TooltipHelper(rootElement, helpDataAttr) {
      var self = this;

      this.Init(rootElement, helpDataAttr);
    }

  //private:
    var data = (function () {
      var attributes = new WeakMap();

      return function (el, attr, val) {
        var elAttrs = attributes.get(el);
        var isSetOperation = arguments.length > 2;

        if (isSetOperation) {
          if (!elAttrs) {
            attributes.set(el, elAttrs = {});
          }

          elAttrs[attr] = val;
        } 
        else {
          return datasetOrCachedAttrsValue();
        }

        function datasetOrCachedAttrsValue() {
          var attrVal = el.dataset[attr];

          return (typeof attrVal !== 'undefined' ? attrVal : elAttrs && elAttrs[attr]);
        }
      };
    });

  // public:
    TooltipHelper.prototype.Init = function (rootElement, helpDataAttr) {
      this._AUTO_TIMEOUT = 600;
      this._OPEN_DELAY = 250;
      this._CONTEXT_NODE = 'tooltip-context-node';

      this._helpDataAttr = !helpDataAttr ? 'data-title' : helpDataAttr;
      this._rootElement = rootElement;

      var uniqueId = 'id' + (new Date()).getTime();
      
      var tooltipPopup = document.createElement('oj-popup');
      tooltipPopup.setAttribute('id', uniqueId);
      tooltipPopup.style.maxWidth = '340px';

      rootElement.appendChild(tooltipPopup);
    
      this._tooltipPopupId = tooltipPopup.getAttribute('id');

      var callbackClearTimeout = this._handleClearTimeout.bind(this);
      var callbackSetTimeout = this._handleSetTimeout.bind(this);
      var callbackCleanup = this._handleCleanup.bind(this);

      tooltipPopup.position =
      {
        my: { horizontal: 'start', vertical: 'top' },
        offset: { x: 0, y: 10 },
        at: { horizontal: 'start', vertical: 'end' }
      };

      tooltipPopup.initialFocus = 'none';
      tooltipPopup.autoDismiss = 'focusLoss';
      tooltipPopup.modality = 'modeless';
      tooltipPopup.addEventListener('ojOpen', callbackSetTimeout);
      tooltipPopup.addEventListener('ojClose', callbackCleanup);
      tooltipPopup.addEventListener('ojBeforeClose', callbackClearTimeout);
      tooltipPopup.addEventListener('ojFocus', callbackClearTimeout);
      tooltipPopup.addEventListener('mouseenter', callbackClearTimeout);

      var callbackOpen = this._callbackOpen = this._handleOpen.bind(this);
      this._callbackClose = this._handleClose.bind(this);

      rootElement.addEventListener('mouseenter', callbackOpen, true);
      rootElement.addEventListener('focus', callbackOpen, true);
    };

    TooltipHelper.prototype._handleOpen = function (event) {
      var target = event.target;
      var titleContext = this._getTitleContext(target);

      var tooltipPopupId = this._tooltipPopupId;
      var popup = document.getElementById(tooltipPopupId);

      if (titleContext) {
        var oldNode = data(popup, this._CONTEXT_NODE);

        if (oldNode && oldNode === titleContext.node) { return; }

        setTimeout(function () {
          data(popup, hammerjs.TouchMouseInput._CONTEXT_NODE, titleContext.node);
          var content = this._getContentNode(popup);
          if (typeof content !== "undefined" && content !== null) {
            content.innerHTML = titleContext.title;
            popup.open(target);
          }
        }.bind(this), this._OPEN_DELAY);
      }
    };

    TooltipHelper.prototype._getContentNode = function (popup) {
      return popup.querySelector('.oj-popup-content');
    };

    TooltipHelper.prototype._handleSetTimeout = function () {
      this._timeoutId = window.setTimeout(this._callbackClose, this._AUTO_TIMEOUT);
    };

    TooltipHelper.prototype._handleClearTimeout = function () {
      var timeoutId = this._timeoutId;
      delete this._timeoutId;
      window.clearTimeout(timeoutId);
    };

    TooltipHelper.prototype._handleCleanup = function (event) {
      var popup = event.target;
      data(popup, this._CONTEXT_NODE, null);
    };

    TooltipHelper.prototype._handleClose = function () {
      var tooltipPopupId = this._tooltipPopupId;
      var popup = document.getElementById(tooltipPopupId);

      var isOpen = !popup.isOpen();
      if (!isOpen) {
        popup.close();
      }
    };

    TooltipHelper.prototype._getTitleContext = function (node) {
      var helpDataAttr = this._helpDataAttr;
      var i = 0;
      var MAX_PARENTS = 5;

      while ((node !== null) && (i++ < MAX_PARENTS)) {
        if (node.nodeType === 1) {
          var title = node.getAttribute(helpDataAttr);
          if (title && title.length > 0) { return { title: title, node: node }; }
        }
        node = node.parentNode;
      }
      return null;
    };

    TooltipHelper.prototype.destroy = function () {
      var callbackOpen = this._callbackOpen;
      delete this._callbackOpen;

      var callbackClose = this._callbackClose;
      delete this._callbackClose;

      var rootElement = this._rootElement;
      delete this._rootElement;

      rootElement.removeEventListener('mouseenter', callbackOpen, true);
      rootElement.removeEventListener('focus', callbackOpen, true);
      rootElement.removeEventListener('mouseleave', callbackClose, true);

      var tooltipPopupId = this._tooltipPopupId;
      delete this._tooltipPopupId;

      var popup = document.getElementById(tooltipPopupId);
      popup.remove();
    };

    // Return TooltipHelper constructor function
    return TooltipHelper; 
  }
);
