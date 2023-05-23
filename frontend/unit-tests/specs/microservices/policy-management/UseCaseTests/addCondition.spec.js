define(['wrc-frontend/microservices/policy-management/parsed-expression-tree', 'wrc-frontend/microservices/policy-management/policy-manager', 'wrc-frontend/microservices/policy-management/policy-data', 'wrc-frontend/core/utils', 'wrc-frontend/core/cfe-errors'],
  function (ParsedExpressionTree, PolicyManager, PolicyData, CoreUtils, CfeErrors) {

    function logs (msg) {
      //console.log(msg);
    }

    describe("addCondition Use Cases Tests", function () {
      const fixturesMap = {
        "no-value": "microservices/policy-management/UseCaseTests/no-value-rdjData.json",
        "null-parsedExpression": "microservices/policy-management/UseCaseTests/null-parsedExpression-rdjData.json",
        "undefined-parsedExpression": "microservices/policy-management/UseCaseTests/undefined-parsedExpression-rdjData.json",
        "single-parsedExpression": "microservices/policy-management/UseCaseTests/single-parsedExpression-rdjData.json",
        "single-combined-parsedExpression": "microservices/policy-management/UseCaseTests/single-combined-parsedExpression-rdjData.json",
        "nested-combined-parsedExpression": "microservices/policy-management/UseCaseTests/nested-combined-parsedExpression-rdjData.json"
      };

      let rdjData, fixturesMapKey = "null-parsedExpression";

      describe("Use fixturesMap and fixturesMapKey to load rdjData fixture file.", function () {
        rdjData = fixture.load(fixturesMap[fixturesMapKey]);
        fixture.cleanup();
      });
      let policyData;
      describe("createPolicyData", function () {
        it('Should return a PolicyData object when invoked with rdjData variable, passed as the rdjData parameter.', function() {
          policyData = PolicyManager.createPolicyData(rdjData);
          expect(policyData instanceof PolicyData).to.equal(true);
        });
      });

      describe("UC-001: Create initial expression under Policy.value.parsedExpression.", function () {
        let predicateItem, results;

        describe("Set predicateItem variable from fixtures/microservices/policy-management/UseCaseTests/addCondition/UC-001-predicateItem.json fixture file.", function () {
          predicateItem = fixture.load('microservices/policy-management/UseCaseTests/addCondition/UC-001-predicateItem.json');
          fixture.cleanup();
        });

        it('Returned results should contain succeeded=true property', function() {
          results = policyData.addPolicyCondition(policyData, 'Policy', predicateItem);
          logs(`SUCCEEDED = ${results.succeeded}`);
          expect(results.succeeded).to.equal(true);
        });

        it('Returned results should contain a non-empty parsedExpression.', function() {
        //logs(`PARSED_EXPRESSION = ${JSON.stringify(results.parsedExpression)}`);
          expect(CoreUtils.isNotUndefinedNorNull(results.parsedExpression)).to.equal(true);
        });

        it('Returned result.policyConditions array should have 1 element, regardless of value assigned to fixturesMapKey variable.', function() {
          //logs(`POLICY_CONDITIONS = ${JSON.stringify(results)}`);
          expect(results.policyConditions.length).to.equal(1);
        });

      });

      let rdjData2;
      // Test cases for policy with 1 single policy condition.
      describe("Use fixturesMap and 'single-parsedExpression' fixturesMapKey to load rdjData fixture file.", function () {
        rdjData2 = fixture.load(fixturesMap["single-parsedExpression"]);
        fixture.cleanup();
      });
      describe("createPolicyData", function () {
        it('Should return a PolicyData object when invoked with rdjData variable, passed as the rdjData parameter.', function() {
          policyData = PolicyManager.createPolicyData(rdjData2);
          expect(policyData instanceof PolicyData).to.equal(true);
        });
      });
      describe("UC-002: Add a Condition to the top of policy that contains only 1 policy condition.", function () {
        let predicateItem, results;

        describe("Set predicateItem variable from fixtures/microservices/policy-management/UseCaseTests/addCondition/UC-002-predicateItem.json fixture file.", function () {
          predicateItem = fixture.load('microservices/policy-management/UseCaseTests/addCondition/UC-002-predicateItem.json');
          fixture.cleanup();
        });

        it('Returned results should contain succeeded=true property', function() {
          results = policyData.addPolicyCondition(policyData, 'Policy', predicateItem);
          logs(`SUCCEEDED = ${results.succeeded}`);
          expect(results.succeeded).to.equal(true);
        });

        it('Returned results should contain a non-empty parsedExpression.', function() {
          //logs(`PARSED_EXPRESSION = ${JSON.stringify(results.parsedExpression)}`);
          expect(CoreUtils.isNotUndefinedNorNull(results.parsedExpression)).to.equal(true);
        });

        it('Returned results should contain a parsedExpression with 2 children', function() {
          //logs(`CHILDREN of PARSED_EXPRESSION = ${JSON.stringify(results.parsedExpression.children)}`);
          expect(results.parsedExpression.children.length).to.equal(2);
        });

        it('Returned result.policyConditions array should have 2 elements.', function() {
          //logs(`POLICY_CONDITIONS = ${JSON.stringify(results.policyConditions)}`);
          expect(results.policyConditions.length).to.equal(2);
        });

      });

      //Test cases for policy with 1 single policy condition.
      let rdjData3;
      describe("Use fixturesMap and 'single-parsedExpression' fixturesMapKey to load rdjData fixture file.", function () {
        rdjData3 = fixture.load(fixturesMap["single-parsedExpression"]);
        fixture.cleanup();
      });
      describe("createPolicyData", function () {
        it('Should return a PolicyData object when invoked with rdjData variable, passed as the rdjData parameter.', function() {
          policyData = PolicyManager.createPolicyData(rdjData3);
          expect(policyData instanceof PolicyData).to.equal(true);
        });
      });
      describe("UC-003: Add a Condition above the selected condition to the policy that contains only 1 policy condition.", function () {
        let predicateItem, results;

        describe("Set predicateItem variable from fixtures/microservices/policy-management/UseCaseTests/addCondition/UC-003-predicateItem.json fixture file.", function () {
          predicateItem = fixture.load('microservices/policy-management/UseCaseTests/addCondition/UC-003-predicateItem.json');
          fixture.cleanup();
        });

        it('Returned results should contain succeeded=true property', function() {
          results = policyData.addPolicyCondition(policyData, 'Policy', predicateItem);
          logs(`SUCCEEDED = ${results.succeeded}`);
          expect(results.succeeded).to.equal(true);
        });

        it('Returned results should contain a non-empty parsedExpression.', function() {
          //logs(`PARSED_EXPRESSION = ${JSON.stringify(results.parsedExpression)}`);
          expect(CoreUtils.isNotUndefinedNorNull(results.parsedExpression)).to.equal(true);
        });

        it('Returned results should contain a parsedExpression with 2 children', function() {
          //logs(`CHILDREN of PARSED_EXPRESSION = ${JSON.stringify(results.parsedExpression.children)}`);
          expect(results.parsedExpression.children.length).to.equal(2);
        });

        it('Returned result.policyConditions array should have 2 elements.', function() {
          //logs(`POLICY_CONDITIONS = ${JSON.stringify(results.policyConditions)}`);
          expect(results.policyConditions.length).to.equal(2);
        });

      });

      let rdjData4;
      describe("Use fixturesMap and 'single-parsedExpression' fixturesMapKey to load rdjData fixture file.", function () {
        rdjData4 = fixture.load(fixturesMap["single-parsedExpression"]);
        fixture.cleanup();
      });
      describe("createPolicyData", function () {
        it('Should return a PolicyData object when invoked with rdjData variable, passed as the rdjData parameter.', function() {
          policyData = PolicyManager.createPolicyData(rdjData4);
          expect(policyData instanceof PolicyData).to.equal(true);
        });
      });
      describe("UC-004: Add a Condition below the selected condition to the policy that contains only 1 policy condition.", function () {
        let predicateItem, results;

        describe("Set predicateItem variable from fixtures/microservices/policy-management/UseCaseTests/addCondition/UC-004-predicateItem.json fixture file.", function () {
          predicateItem = fixture.load('microservices/policy-management/UseCaseTests/addCondition/UC-004-predicateItem.json');
          fixture.cleanup();
        });

        it('Returned results should contain succeeded=true property', function() {
          results = policyData.addPolicyCondition(policyData, 'Policy', predicateItem);
          logs(`SUCCEEDED = ${results.succeeded}`);
          expect(results.succeeded).to.equal(true);
        });

        it('Returned results should contain a non-empty parsedExpression.', function() {
          //logs(`PARSED_EXPRESSION = ${JSON.stringify(results.parsedExpression)}`);
          expect(CoreUtils.isNotUndefinedNorNull(results.parsedExpression)).to.equal(true);
        });

        it('Returned results should contain a parsedExpression with 2 children', function() {
          //logs(`CHILDREN of PARSED_EXPRESSION = ${JSON.stringify(results.parsedExpression.children)}`);
          expect(results.parsedExpression.children.length).to.equal(2);
        });

        it('Returned result.policyConditions array should have 2 elements.', function() {
          //logs(`POLICY_CONDITIONS = ${JSON.stringify(results.policyConditions)}`);
          expect(results.policyConditions.length).to.equal(2);
        });

      });

      let rdjData5;
      // Test cases for policy with 1 combine policy condition.
      describe("Use fixturesMap and 'single-combined-parsedExpression' fixturesMapKey to load rdjData fixture file.", function () {
        rdjData5 = fixture.load(fixturesMap["single-combined-parsedExpression"]);
        fixture.cleanup();
      });
      describe("createPolicyData", function () {
        it('Should return a PolicyData object when invoked with rdjData variable, passed as the rdjData parameter.', function() {
          policyData = PolicyManager.createPolicyData(rdjData5);
          expect(policyData instanceof PolicyData).to.equal(true);
        });
      });
      describe("UC-005: Add a Condition to the top of policy that contains only 1 combined policy condition.", function () {
        let predicateItem, results;

        describe("Set predicateItem variable from fixtures/microservices/policy-management/UseCaseTests/addCondition/UC-005-predicateItem.json fixture file.", function () {
          predicateItem = fixture.load('microservices/policy-management/UseCaseTests/addCondition/UC-002-predicateItem.json');
          fixture.cleanup();
        });

        it('Returned results should contain succeeded=true property', function() {
          results = policyData.addPolicyCondition(policyData, 'Policy', predicateItem);
          logs(`SUCCEEDED = ${results.succeeded}`);
          //logs(`results = ${JSON.stringify(results)}`);
          //logs(`PARSED_EXPRESSION = ${JSON.stringify(results.parsedExpression)}`);
          //logs(`CHILDREN of PARSED_EXPRESSION = ${JSON.stringify(results.parsedExpression.children)}`);
          expect(results.succeeded).to.equal(true);
        });
        it('Returned results should contain a non-empty parsedExpression.', function() {
          expect(CoreUtils.isNotUndefinedNorNull(results.parsedExpression)).to.equal(true);
        });
        it('Returned results should contain a parsedExpression with 1 child', function() {
          //logs(`CHILDREN of PARSED_EXPRESSION = ${JSON.stringify(results.parsedExpression.children)}`);
          expect(results.parsedExpression.children.length).to.equal(1);
        });
        it('Returned result.policyConditions array should have 1 elements.', function() {
          //logs(`POLICY_CONDITIONS = ${JSON.stringify(results.policyConditions)}`);
          expect(results.policyConditions.length).to.equal(1);
        });
      });


      let rdjData6;
      describe("Use fixturesMap and 'single-combined-parsedExpression' fixturesMapKey to load rdjData fixture file.", function () {
        fixturesMapKey = "single-combined-parsedExpression"
        rdjData6 = fixture.load(fixturesMap[fixturesMapKey]);
        fixture.cleanup();
      });
      describe("createPolicyData", function () {
        it('Should return a PolicyData object when invoked with rdjData variable, passed as the rdjData parameter.', function() {
          policyData = PolicyManager.createPolicyData(rdjData6);
          expect(policyData instanceof PolicyData).to.equal(true);
        });
      });
      describe("UC-006: Add a Condition above the selected condition to the policy that contains only 1 combined policy condition.", function () {
        let predicateItem, results;

        describe("Set predicateItem variable from fixtures/microservices/policy-management/UseCaseTests/addCondition/UC-006-predicateItem.json fixture file.", function () {
          predicateItem = fixture.load('microservices/policy-management/UseCaseTests/addCondition/UC-003-predicateItem.json');
          fixture.cleanup();
        });

        it('Returned results should contain succeeded=true property', function() {
          results = policyData.addPolicyCondition(policyData, 'Policy', predicateItem);
          logs(`SUCCEEDED = ${results.succeeded}`);
          expect(results.succeeded).to.equal(true);
        });
        it('Returned results should contain a non-empty parsedExpression.', function() {
          // logs(`PARSED_EXPRESSION = ${JSON.stringify(results.parsedExpression)}`);
          expect(CoreUtils.isNotUndefinedNorNull(results.parsedExpression)).to.equal(true);
        });
        it('Returned results should contain a parsedExpression with 1 child', function() {
          //logs(`CHILDREN of PARSED_EXPRESSION = ${JSON.stringify(results.parsedExpression.children)}`);
          expect(results.parsedExpression.children.length).to.equal(1);
        });
        it('Returned result.policyConditions array should have 1 elements.', function() {
          //logs(`POLICY_CONDITIONS = ${JSON.stringify(results.policyConditions)}`);
          expect(results.policyConditions.length).to.equal(1);
        });
      });

      let rdjData7;
      describe("Use fixturesMap and 'single-combined-parsedExpression' fixturesMapKey to load rdjData fixture file.", function () {
        fixturesMapKey = "single-combined-parsedExpression"
        rdjData7 = fixture.load(fixturesMap[fixturesMapKey]);
        fixture.cleanup();
      });
      describe("createPolicyData", function () {
        it('Should return a PolicyData object when invoked with rdjData variable, passed as the rdjData parameter.', function() {
          policyData = PolicyManager.createPolicyData(rdjData7);
          expect(policyData instanceof PolicyData).to.equal(true);
        });
      });
      describe("UC-007: Add a Condition below the selected condition to the policy that contains only 1 combined policy condition.", function () {
        let predicateItem, results;

        describe("Set predicateItem variable from fixtures/microservices/policy-management/UseCaseTests/addCondition/UC-007-predicateItem.json fixture file.", function () {
          predicateItem = fixture.load('microservices/policy-management/UseCaseTests/addCondition/UC-004-predicateItem.json');
          fixture.cleanup();
        });

        it('Returned results should contain succeeded=true property', function() {
          results = policyData.addPolicyCondition(policyData, 'Policy', predicateItem);
          logs(`SUCCEEDED = ${results.succeeded}`);
          expect(results.succeeded).to.equal(true);
        });
        it('Returned results should contain a non-empty parsedExpression.', function() {
          // logs(`PARSED_EXPRESSION = ${JSON.stringify(results.parsedExpression)}`);
          expect(CoreUtils.isNotUndefinedNorNull(results.parsedExpression)).to.equal(true);
        });
        it('Returned results should contain a parsedExpression with 1 child', function() {
          //logs(`CHILDREN of PARSED_EXPRESSION = ${JSON.stringify(results.parsedExpression.children)}`);
          expect(results.parsedExpression.children.length).to.equal(1);
        });
        it('Returned result.policyConditions array should have 1 elements.', function() {
          //logs(`POLICY_CONDITIONS = ${JSON.stringify(results.policyConditions)}`);
          expect(results.policyConditions.length).to.equal(1);
        });

      });

      let rdjData8;
      describe("Use fixturesMap and 'nested-combined-parsedExpression' fixturesMapKey to load rdjData fixture file.", function () {
        fixturesMapKey = "nested-combined-parsedExpression"
        rdjData8 = fixture.load(fixturesMap[fixturesMapKey]);
        fixture.cleanup();
      });
      describe("createPolicyData", function () {
        it('Should return a PolicyData object when invoked with rdjData variable, passed as the rdjData parameter.', function() {
          policyData = PolicyManager.createPolicyData(rdjData8);
          expect(policyData instanceof PolicyData).to.equal(true);
        });
      });
      describe("UC-008: Add a Condition of 'A predicate with no arguments' above the first condition within a nested combination ", function () {
        let predicateItem, results;

        describe("Set predicateItem variable from fixtures/microservices/policy-management/UseCaseTests/addCondition/UC-008-predicateItem.json fixture file.", function () {
          predicateItem = fixture.load('microservices/policy-management/UseCaseTests/addCondition/UC-008-predicateItem.json');
          fixture.cleanup();
        });

        it('Returned results should contain succeeded=true property', function() {
          results = policyData.addPolicyCondition(policyData, 'Policy', predicateItem);
          logs(`SUCCEEDED = ${results.succeeded}`);
          expect(results.succeeded).to.equal(true);
        });
        it('Returned results should contain a non-empty parsedExpression.', function() {
          // logs(`PARSED_EXPRESSION = ${JSON.stringify(results.parsedExpression)}`);
          expect(CoreUtils.isNotUndefinedNorNull(results.parsedExpression)).to.equal(true);
        });
        it('Returned results should contain a parsedExpression with 1 child.', function() {
          //logs(`CHILDREN of PARSED_EXPRESSION = ${JSON.stringify(results.parsedExpression.children)}`);
          expect(results.parsedExpression.children.length).to.equal(1);
        });
        it('Returned result.policyConditions array should have 1 elements.', function() {
          //logs(`POLICY_CONDITIONS = ${JSON.stringify(results.policyConditions)}`);
          expect(results.policyConditions.length).to.equal(1);
        });

      });


      let rdjData9;
      describe("Use fixturesMap and 'nested-combined-parsedExpression' fixturesMapKey to load rdjData fixture file.", function () {
        fixturesMapKey = "nested-combined-parsedExpression"
        rdjData9 = fixture.load(fixturesMap[fixturesMapKey]);
        fixture.cleanup();
      });
      describe("createPolicyData", function () {
        it('Should return a PolicyData object when invoked with rdjData variable, passed as the rdjData parameter.', function() {
          policyData = PolicyManager.createPolicyData(rdjData9);
          expect(policyData instanceof PolicyData).to.equal(true);
        });
      });
      describe("UC-009: Add a Condition of 'A predicate with 2 arguments' under the last condition of a combination.", function () {
        let predicateItem, results;

        describe("Set predicateItem variable from fixtures/microservices/policy-management/UseCaseTests/addCondition/UC-008-predicateItem.json fixture file.", function () {
          predicateItem = fixture.load('microservices/policy-management/UseCaseTests/addCondition/UC-008-predicateItem.json');
          fixture.cleanup();
        });

        it('Returned results should contain succeeded=true property', function() {
          results = policyData.addPolicyCondition(policyData, 'Policy', predicateItem);
          logs(`SUCCEEDED = ${results.succeeded}`);
          expect(results.succeeded).to.equal(true);
        });
        it('Returned results should contain a non-empty parsedExpression.', function() {
          // logs(`PARSED_EXPRESSION = ${JSON.stringify(results.parsedExpression)}`);
          expect(CoreUtils.isNotUndefinedNorNull(results.parsedExpression)).to.equal(true);
        });
        it('Returned results should contain a parsedExpression with 1 child.', function() {
          //logs(`CHILDREN of PARSED_EXPRESSION = ${JSON.stringify(results.parsedExpression.children)}`);
          expect(results.parsedExpression.children.length).to.equal(1);
        });
        it('Returned result.policyConditions array should have 1 elements.', function() {
          //logs(`POLICY_CONDITIONS = ${JSON.stringify(results.policyConditions)}`);
          expect(results.policyConditions.length).to.equal(1);
        });

      });


    });
  }
);