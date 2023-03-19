/**
 * @license
 * Copyright (c) 2023, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

/**
 * @typedef {{uid?: string, parentUid?: string, arguments? [string], children? : [ParsedExpressionNode], type: 'and'|'or'|'group'|'negate'|'predicate'}} ParsedExpressionNode
 * @type {ParsedExpressionNode}
 * @typedef {{uid: string, parentUid: string, isLastSibling: boolean, isLastCondition: boolean, operator: 'none'|'and'|'or'|undefined, joiner: 'none'|'and'|'or'|undefined, expression: string, options: {negated: boolean, combined: boolean, insertion?: Insertion},children?:[PolicyCondition],predicate: {name: string,arguments:[Argument],descriptionHTML: string,displayName: string}}} PolicyCondition
 * @type {PolicyCondition}
 * @typedef {[{before: {uid: string, parentUid: string}, after: {uid: string, parentUid: string}}]} RecomputedUids
 * @type {RecomputedUids}
 * @typedef {[{uid: string, parentUid: string, previousValue: boolean, value: boolean}]} NegatedItems
 * @type {NegatedItems}
 * @typedef {[{uid: string, parentUid: string}]} RemovedUids
 * @type {CombinedItems}
 * @typedef {[{uid: string, parentUid: string}]} CombinedItems
 * @type {UncombinedUids}
 * @typedef {[{uid: string, parentUid: string}]} UncombinedUids
 * @type {RemovedUids}
 * @typedef {{direction: 'moveup'|'movedown'|'moveout', before: {uid: string, parentUid: string}, after: {uid: string, parentUid: string}}} Movement
 * @type {Movement}
 * @typedef {{type: 'above'|'below'|'at', checkedItem: {uid: string, parentUid: string}, addedItem?: {uid: string, parentUid: string}, parentExpression?: {type: 'or'|'and'}}} Insertion
 * @type {Insertion}
 * @typedef {{selected: ParsedExpressionNode, parentExpression: ParsedExpressionNode, index: number}|{}} FindTargetedExpressionResult
 * @type {FindTargetedExpressionResult}
 */
define(['wrc-frontend/core/utils'],
  function(CoreUtils){

    function ParsedExpressionTree(data){
      this.data = data;
      this.rdjParsedExpression = null;
      this.rdjStringExpression = null;
      this.rdjSupportedPredicates = null;
    }

  //public:
    ParsedExpressionTree.prototype = {
      Section: Object.freeze({
        DEFAULT_POLICY: 'DefaultPolicy',
        POLICY: 'Policy'
      }),
      /**
       * Returns whether value of `name` parameter is a valid policy data section in the RDJ, or not.
       * @param {string} name
       * @returns {boolean}
       * @private
       * @example:
       *  isValidSection('DefaultPolicy');  // returns true
       *  isValidSection('Foobar');         // returns false
       *  isValidSection();                 // returns false
       *  isValidSection('Policy');         // returns true
       *  isValidSection('Name');           // returns true
       */
      isValidSection: (name) => {
        let rtnval = false;
        if (CoreUtils.isNotUndefinedNorNull(name)) {
          rtnval = Object.values(ParsedExpressionTree.prototype.Section).includes(name);
        }
        return rtnval;
      },

      getValueProperty: (section) => {
        let value;
        if (CoreUtils.isNotUndefinedNorNull(this) &&
          CoreUtils.isNotUndefinedNorNull(this.data) &&
          CoreUtils.isNotUndefinedNorNull(this.data[section])
        ){
          value = this.data[section].value;
        }

        if (CoreUtils.isUndefinedOrNull(value)) {
          const obj = {data: {}};
          obj.data[section] = {value: null};
          value = obj.data[section].value;
        }

        return value;
      },

      getParsedExpressionProperty: (section) => {
        if (CoreUtils.isNotUndefinedNorNull(this) &&
          CoreUtils.isNotUndefinedNorNull(this.data) &&
          CoreUtils.isNotUndefinedNorNull(this.data[section]) &&
          CoreUtils.isNotUndefinedNorNull(this.data[section].value) &&
          CoreUtils.isNotUndefinedNorNull(this.data[section].value.parsedExpression)
        ){
          this.rdjParsedExpression = this.data[section].value.parsedExpression;
        }

        if (CoreUtils.isUndefinedOrNull(this.rdjParsedExpression)) {
          const obj = {data: {}};
          obj.data[section] = {value: {parsedExpression: null}};
          this.rdjParsedExpression = obj.data[section].value.parsedExpression;
        }

        return this.rdjParsedExpression;
      },

      getStringExpressionProperty: (section) => {
        let stringExpression;
        if (CoreUtils.isNotUndefinedNorNull(this) &&
          CoreUtils.isNotUndefinedNorNull(this.data) &&
          CoreUtils.isNotUndefinedNorNull(this.data[section]) &&
          CoreUtils.isNotUndefinedNorNull(this.data[section].value) &&
          CoreUtils.isNotUndefinedNorNull(this.data[section].value.stringExpression)
        ){
          stringExpression = this.data[section].value.stringExpression;
        }

        if (CoreUtils.isUndefinedOrNull(stringExpression)) {
          const obj = {data: {}};
          obj.data[section] = {value: {stringExpression: null}};
          stringExpression = obj.data[section].value.stringExpression;
        }

        return stringExpression;
      },

      getRdjSupportedPredicatesProperty: (section) => {
        let supportedPredicates;

        if (CoreUtils.isNotUndefinedNorNull(this) &&
          CoreUtils.isNotUndefinedNorNull(this.data) &&
          CoreUtils.isNotUndefinedNorNull(this.data[section]) &&
          CoreUtils.isNotUndefinedNorNull(this.data[section].value) &&
          CoreUtils.isNotUndefinedNorNull(this.data[section].value.supportedPredicates)
        ){
          supportedPredicates = this.data[section].value.supportedPredicates;
        }
        if (CoreUtils.isUndefinedOrNull(supportedPredicates)) {
          const obj = {data: {}};
          obj.data[section] = {value: {supportedPredicates: null}};
          supportedPredicates = obj.data[section].value.supportedPredicates;
        }

        return supportedPredicates;
      },

      createParsedExpressionNode: (name, values = [], predicateType = 'predicate') => {
        const parsedExpressionNode = {};

        // Some predicates don't have "arguments". For example,
        // "weblogic.entitlement.rules.InDevelopmentMode". When
        // that's the case, we don't put an "arguments" property
        // in the emptyParsedExpression variable that's returned.

        if (values.length > 0) {
          parsedExpressionNode['arguments'] = values;
        }

        parsedExpressionNode['name'] = name;
        parsedExpressionNode['type'] = predicateType;

        return parsedExpressionNode;
      },

      /**
       * Handles scenario where RDJ parsedExpression tree doesn't exists (i.e. `rdjParsedExpression === null`)
       * @param {ParsedExpressionNode} newExpressionNode
       */
      insertInitialExpressionNode: (newExpressionNode) => {
        // newExpressionNode is already "good to go". Here
        // "good to go" means:
        //
        // 1. It contains an "arguments" array property, if
        //    it's for a predicate that has them.
        // 2. It contains uid and parent Uid properties.
        //
        // This beong the case, we can just go ahead and assign
        // it to the rdjParsedExpression variable.
        this.rdjParsedExpression = newExpressionNode;

      }
    };

    // Return the class constructor
    return ParsedExpressionTree;
  }
);