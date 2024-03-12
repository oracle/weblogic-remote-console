/**
 * @license
 * Copyright (c) 2023, 2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

/**
 * @module
 * @typedef {{
 *    target: element,
 *    key: string,
 *    shiftKey: boolean.
 *    altKey: boolean
 *    ctrlKey: boolean,
 *    metaKey: boolean,
 *  }} keyboardEventParams
 * @event document#keyup
 * @type {keyboardEventParams}
 */
define(['wrc-frontend/core/utils'],
  function (CoreUtils) {
    var _consumers = {};

    /**
     *
     * @param {document#event:keyup} event
     * @listens document#keyup
     */
    function onKeyUp (event) {
      const id = event.target.attributes['data-key-focuser-id'];
      if (CoreUtils.isNotUndefinedNorNull(id) && CoreUtils.isNotUndefinedNorNull(id.value)) {
        handleKeyUpEvent(event, _consumers[id.value]);
      }
    }
  
    function moveForward(index, consumer) {
      if (consumer.lastExecutedRule.shiftKey && consumer.lastExecutedRule.focusIndexValue === 0) {
        index += (consumer.lastExecutedRule.key === 'Tab' ? 1 : 0);
      }
      else {
        index = (index === consumer.options.focusItems.length - 1 ? 0 : index + 1);
      }
      return index;
    }
  
    function moveBack(index, consumer) {
      if (consumer.lastExecutedRule.shiftKey && consumer.lastExecutedRule.focusIndexValue === 0) {
        index += (consumer.lastExecutedRule.key === 'Tab' ? consumer.options.focusItems.length - 1 : 0);
      }
      else{
        index = (index > 0 ? index -1 : consumer.options.focusItems.length - 1);
      }
      return index;
    }
  
    function computeFocusIndexValue(event, focusRule, consumer) {
      let index = consumer.lastExecutedRule.focusIndexValue;
    
      if (event.key === 'Tab') {
        // Need to examine consumer.lastExecutedRule.key before we
        // can arrive at the correct value for index
        if (consumer.lastExecutedRule.key === 'Escape') {
          index = 0;
        }
        else if (event.shiftKey) {
          // Pressed 'Tab" and the shift key is down
//MLW          if (consumer.lastExecutedRule.key === 'Tab' && consumer.lastExecutedRule.shiftKey) {
          // Decrement by 1, unless index is 0. If index is
          // 0, then set it to consumer.options.focusItems.length - 1
          // TODO: index = (index > 0 ? index -1 : consumer.options.focusItems.length - 1);
          index = moveBack(index, consumer);
        }
        else {
          // Pressed "Tab", but the shift key isn't down
          // Move forward
//MLW          if (consumer.lastExecutedRule.key === 'Escape' || consumer.lastExecutedRule.focusIndexValue === -1) {
          // Increment by 1, unless index is consumer.options.focusItems.length - 1.
          // If index is consumer.options.focusItems.length - 1, then set it to 0
          // TODO: index = (index === consumer.options.focusItems.length - 1 ? 0 : index + 1);
          index = moveForward(index, consumer);
        }
      }
      else if (event.key === 'ArrowRight') {
        index = moveForward(index, consumer);
      }
      else if (event.key === 'ArrowLeft') {
        index = moveBack(index, consumer);
      }
      else if (event.key === 'ArrowDown') {
        index = moveForward(index, consumer);
      }
      else if (event.key === 'ArrowUp') {
        index = moveBack(index, consumer);
      }
    
      return index;
    }

    function handleKeyUpEvent(event, consumer) {
      function computeLastExecutedRuleData(event, consumer, index) {
        consumer.lastExecutedRule.key = event.key;

        if (event.key === 'Tab') {
          consumer.lastExecutedRule.shiftKey = event.shiftKey;
        }

        if (index === -1) {
          index = 0;
        }
        consumer.lastExecutedRule.focusIndexValue = index;
      }

      function navigateAction(event, focusRule, consumer) {
        const index = computeFocusIndexValue(event, focusRule, consumer);
        if (index !== -1) {
          $(consumer.id)[index].focus();
        }
        computeLastExecutedRuleData(event, consumer, index);
        setLastExecutedRule(consumer.id, {focusIndexValue: index, key: event.key, shiftKey: event.shiftKey});
      }

      function clickAction(event, focusRule, consumer) {
        const index = computeFocusIndexValue(event, focusRule, consumer);
        if (index !== -1) {
          $(consumer.id)[index].click();
        }
        computeLastExecutedRuleData(event, consumer, index);
        setLastExecutedRule(consumer.id, {focusIndexValue: index, key: focusRule.key});
      }

      function handleMultipleActionsFocusRule(event, focusRule, consumer) {
        const singleFocusRule = focusRule.find(item => item.key === (event.shiftKey ? `Shift+${event.key}` : event.key));
        if (CoreUtils.isNotUndefinedNorNull(singleFocusRule)) {
          if (event.shiftKey) consumer.lastExecutedRule.key = 'Escape';
          handleSingleActionFocusRule(event, singleFocusRule, consumer)
        }
      }

      function handleSingleActionFocusRule(event, focusRule, consumer) {
        if (focusRule.parent) {
          if (focusRule.isArray) {
            let index = _consumers[focusRule.parent].lastExecutedRule.focusIndexValue;
            $(focusRule.parent)[index].focus();
          }
        }
        else if (focusRule.selector)
        {
          const node = document.querySelector(focusRule.selector);

          if (node !== null) {
            consumer.lastExecutedRule.key = focusRule.key;

            if (focusRule.isArray) {
              const index = consumer.lastExecutedRule.focusIndexValue;
              $(focusRule.selector)[0].focus();
            }
            else {
              $(focusRule.selector).focus();
            }
          }
        }
        else if (focusRule.action) {
          switch (focusRule.action) {
            case 'click':
              focusRule.callback(event, focusRule);
              break;
            case 'navigate':
              if (focusRule.callback) {
                focusRule.callback(event, focusRule);
              }
              else {
                navigateAction(event, focusRule, consumer);
              }
              break;
            case 'select':
              focusRule.callback(event);
              break;
          }
        }
      }
      
      if (!event.altKey && !event.ctrlKey && !event.metaKey) {
        if (consumer.focusRules && consumer.focusRules[event.key]) {
          event.preventDefault();
          const focusRule = consumer.focusRules[event.key];
          
          if (focusRule) {
            if (Array.isArray(focusRule)) {
              handleMultipleActionsFocusRule(event, focusRule, consumer);
            }
            else {
              handleSingleActionFocusRule(event, focusRule, consumer);
            }
          }
        }
      }
    }

    function registerConsumer(id = '', focusRules = {}, options = {}) {
      let result = {succeeded: false, keyUpCallback: null};
      if (id !== null && typeof id === 'string' && id.trim() !== '') {
        // FortifyIssueSuppression Key Management: Null Encryption Key
        // This is a key on the keyboard, not a security key
        _consumers[id] = {id: id, lastExecutedRule: {key: null, focusIndexValue: 0}};
        if (Object.keys(focusRules).length > 0) {
          for (const value of Object.values(focusRules)) {
            if (typeof value.suspended === 'undefined') {
              value['suspended'] = false;
            }
          }
          _consumers[id]['focusRules'] = focusRules;
          result.succeeded = true;
          result.keyUpCallback = onKeyUp;
        }
        if (Object.keys(options).length > 0) {
          _consumers[id]['options'] = options;
        }
      }
      return result;
    }

    function unregisterConsumer(id = '') {
      let result = {succeeded: false};
      if (id !== null && typeof id === 'string' && id.trim() !== '') {
        if (_consumers[id]) {
          delete _consumers[id];
          result.succeeded = true;
        }
      }
      return result;
    }

    function suspendFocusRule(id = '', key) {
      if (id !== null && typeof id === 'string' && id.trim() !== '') {
        if (_consumers[id].focusRules[key]) {
          _consumers[id].focusRules[key]['suspended'] = true;
        }
      }
    }

    function resumeFocusRule(id = '', key) {
      if (id !== null && typeof id === 'string' && id.trim() !== '') {
        if (_consumers[id].focusRules[key]) {
          _consumers[id].focusRules[key]['suspended'] = false;
        }
      }
    }

    function getKeyUpCallback(id = '') {
      let result = {alreadyRegistered: true, keyUpCallback: onKeyUp};
      if (id !== null && typeof id === 'string' && id.trim() !== '') {
        result.alreadyRegistered = CoreUtils.isNotUndefinedNorNull(_consumers[id]);
      }
      return result;
    }
  
    function computeNextFocusIndexValue(id = '', focusRule, event) {
      let nextFocusIndexValue = -1;
      if (id !== null && typeof id === 'string' && id.trim() !== '') {
        nextFocusIndexValue = computeFocusIndexValue(event, focusRule, _consumers[id]);
      }
      return nextFocusIndexValue;
    }

    function getLastExecutedRule(id = '') {
      // FortifyIssueSuppression Key Management: Null Encryption Key
      // This is a key on the keyboard, not a security key
      const rule = {focusIndexValue: -1, key: null, shiftKey: false};
      if (id !== null && typeof id === 'string' && id.trim() !== '') {
        if (typeof _consumers[id] !== 'undefined') {
          rule.focusIndexValue = _consumers[id].lastExecutedRule.focusIndexValue;
          rule.key = _consumers[id].lastExecutedRule.key;
          rule.shiftKey = _consumers[id].lastExecutedRule.shiftKey || false;
        }
      }
      return rule;
    }

    function setLastExecutedRule(id = '', options = {}) {
      if (id !== null && typeof id === 'string' && id.trim() !== '') {
        if (CoreUtils.isNotUndefinedNorNull(options.focusIndexValue)) {
          _consumers[id].lastExecutedRule.focusIndexValue = options.focusIndexValue;
        }
        if (typeof options.key !== 'undefined') {
          _consumers[id].lastExecutedRule.key = options.key;
        }
        if (CoreUtils.isNotUndefinedNorNull(options.shiftKey)) {
          _consumers[id].lastExecutedRule.shiftKey = options.shiftKey;
        }
      }
    }

    function setFocusItems(id = '', options = {}) {
      if (id !== null && typeof id === 'string' && id.trim() !== '') {
        if (Object.keys(options).length > 0) {
          _consumers[id]['options'] = options;
          // FortifyIssueSuppression Key Management: Null Encryption Key
          // This is a key on the keyboard, not a security key
          _consumers[id]['lastExecutedRule'] = {key: null, focusIndexValue: 0, shiftKey: false};
        }
        return _consumers[id]['lastExecutedRule'];
      }
    }

    function getFocusRule(id = '', key) {
      let focusRule;
      if (id !== null && typeof id === 'string' && id.trim() !== '') {
        focusRule =  _consumers[id].focusRules[key];
      }
      return focusRule;
    }

  //public:
    return {
      /**
       *
       * @param {string} id
       * @param {{Escape?: {key: string, selector?: string}, Enter?: {key: string, action?: string, callback?: function}, Tab?: {key: string, action?: string}, ArrowUp?: {selector?: string, action?: string}, ArrowRight?: {selector?: string, action?: string}, ArrowLeft?: {selector?: string, action?: string}}} focusRules
       * @param {{focusItems?: [string]}} options
       * @returns {{succeeded: boolean, keyUpCallback?: function|null}}
       * @example
       *  const id = '.gallery-panel-card';
       *  const focusRules = {
       *    ArrowUp: {key: 'ArrowUp', selector: '#home'},
       *    Escape: {key: 'Escape', selector: '#home'},
       *    Tab: {key: 'Tab', action: 'navigate'},
       *    ArrowRight: {key: 'ArrowRight', action: 'navigate'},
       *    ArrowLeft: {key: 'ArrowLeft', action: 'navigate'}
       *  };
       *  const options = {
       *    focusItems: ['configuration','view','monitoring','security']
       *  };
       *  const result = KeyUpFocuser.register(id, focusRules, options);
       *  if (result.succeeded) {
       *    ele.onkeyup = result.keyUpCallback;
       *  }
       */
      register: (id, focusRules, options = {}) => {
        return registerConsumer(id, focusRules, options);
      },
      /**
       *
       * @param {string} id - The value passed as the `id` parameter, to the the `register` function.
       * @returns {{succeeded: boolean}}
       */
      unregister: (id) => {
        return unregisterConsumer(id);
      },
      suspendFocusRule: (id, key) => {
        suspendFocusRule(id, key);
      },
      resumeFocusRule: (id, key) => {
        resumeFocusRule(id, key);
      },
      getKeyUpCallback: (id) => {
        return getKeyUpCallback(id);
      },
      computeNextFocusIndexValue: (id, focusRule, event) => {
        return computeNextFocusIndexValue(id, focusRule, event);
      },
      getLastExecutedRule: (id) => {
        return getLastExecutedRule(id);
      },
      setLastExecutedRule: (id, options) => {
        setLastExecutedRule(id, options);
      },
      setFocusItems: (id, options) => {
        return setFocusItems(id, options);
      },
      getFocusRule: (id, key) => {
        return getFocusRule(id, key);
      }

    };
  }
);