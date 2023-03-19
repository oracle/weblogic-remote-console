/**
 * @license
 * Copyright (c) 2022,2023, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(
  function(){
    /**
     * Dictionary of function names used in a `policyCondition.expression` property
     * @type {{isNotIn: string, equals: string, notEqual: string, isIn: string}}
     */
    const funcNames = Object.freeze({
      'and': 'and',
      'or': 'or',
      'not': 'NOT',
      'combination': 'Combination'
    });

    /**
     * Returns string that gets assigned to `policyCondition.expression`, or an empty string
     * @param {{checked?: [string], uid: string, operator: 'none'|'and'|'or', expression: string, options: {negated: boolean, location?: {at: {uid: string}|above: {uid: string}|below: {uid: string}}}, predicate: {name: string, arguments: [{value: string, array: boolean, displayName: string, descriptionHTML?: HTMLElement}]},descriptionHTML?: HTMLElement, displayName?: string}} policyCondition
     * @returns {string} - String that gets assigned to `policyCondition.expression`, or an empty string
     * @private
     */
    return {
      /**
       *
       * @param {{uid: string, parentUid: string, operator: 'none'|'and'|'or', expression: string, options: {negated: boolean, combined: boolean, insertion?: Insertion},children?:[PolicyCondition],predicate: {name: string,arguments:[Argument],descriptionHTML: string,displayName: string}}} policyCondition
       * @returns {string}
       */
      getPredicateClause: (policyCondition) =>  {
        let predicateClause = '';
        if (typeof policyCondition.predicate === 'undefined') {
          // "Combination" policy conditions are the only
          // ones allowed to not have a predicate property.
          if (policyCondition.options.combined) {
            if (policyCondition.options.negated) {
              predicateClause = `${funcNames.not} ${funcNames.combination}`;
            }
            else {
              predicateClause = `${funcNames.combination}`;
            }
          }
        }
        else if (typeof policyCondition.predicate['arguments'] === 'undefined') {
          // Some policy conditions, like the one for the name
          // "weblogic.entitlement.rules.InDevelopmentMode",
          // have predicate property, but no predicate['arguments']
          // property.
          if (policyCondition.options.negated) {
            predicateClause = `${funcNames.not} ${policyCondition.predicate.displayName}`;
          }
          else {
            predicateClause = `${policyCondition.predicate.displayName}`;
          }
        }
        else if (typeof policyCondition.predicate['arguments'] !== 'undefined') {
          const values = policyCondition.predicate['arguments'].map(({value}) => value).filter(value => value !== null);
          if (values.length > 1) {
            const joinCharacters = (policyCondition.predicate['arguments'][0].array ? ` ${funcNames.or} ` : ', ');
            if (policyCondition.options.negated) {
              predicateClause = `${funcNames.not} ${policyCondition.predicate.displayName}: ${values.map(value => `${value}`).join(joinCharacters)}`;
            }
            else {
              predicateClause = `${policyCondition.predicate.displayName}: ${values.map(value => `${value}`).join(joinCharacters)}`;
            }
          }
          else if (values && values.length > 0) {
            if (policyCondition.options.negated) {
              predicateClause = `${funcNames.not} ${policyCondition.predicate.displayName}: ${policyCondition.predicate['arguments'][0].value}`;
            }
            else {
              predicateClause = `${policyCondition.predicate.displayName}: ${policyCondition.predicate['arguments'][0].value}`;
            }
          }
          else {
            if (policyCondition.options.negated) {
              predicateClause = `${funcNames.not} ${policyCondition.predicate.displayName}`;
            }
            else {
              predicateClause = `${policyCondition.predicate.displayName}`;
            }
          }
        }

        return predicateClause;
      }

    };
  }
);