define(['wrc-frontend/microservices/policy-management/parsed-expression-tree', 'wrc-frontend/microservices/policy-management/policy-manager', 'wrc-frontend/microservices/policy-management/policy-data', 'wrc-frontend/core/utils', 'wrc-frontend/core/cfe-errors'],
  function (ParsedExpressionTree, PolicyManager, PolicyData, CoreUtils, CfeErrors) {

    function logs (msg) {
      //console.log(msg);
    }

    describe("removeCondition Use Cases Tests", function () {
      const fixturesMap = {
        "single-parsedExpression": "microservices/policy-management/UseCaseTests/single-parsedExpression-rdjData.json",
        "single-combined-parsedExpression": "microservices/policy-management/UseCaseTests/single-combined-parsedExpression-rdjData.json",
        "single-negated-combined-parsedExpression": "microservices/policy-management/UseCaseTests/single-negated-combined-parsedExpression-rdjData.json",
        "nested-combined-parsedExpression": "microservices/policy-management/UseCaseTests/nested-combined-parsedExpression-rdjData.json"
      };

      let rdjData, fixturesMapKey = "single-parsedExpression";

      describe("Use fixturesMap and fixturesMapKey to load rdjData fixture file.", function () {
        rdjData = fixture.load(fixturesMap[fixturesMapKey]);
        fixture.cleanup();
      });
      let policyData;
      describe("removePolicyData", function () {
        it('Should return a PolicyData object when invoked with rdjData variable, passed as the rdjData parameter.', function() {
          policyData = PolicyManager.createPolicyData(rdjData);
          expect(policyData instanceof PolicyData).to.equal(true);
        });
      });

      describe("UC-REMOVE-001: Remove the last condition which is a predicate item from a policy.", function () {
        let predicateItem, results;

        describe("Set predicateItem variable from fixtures/microservices/policy-management/UseCaseTests/removeConditions/UCR-001-predicateItem.json fixture file.", function () {
          predicateItem = fixture.load('microservices/policy-management/UseCaseTests/removeConditions/UCR-001-predicateItem.json');
          fixture.cleanup();
        });

        it('Returned results should contain succeeded=true property', function() {
          results = policyData.removeConditions(policyData, 'Policy', predicateItem);
          logs(`SUCCEEDED = ${results.succeeded}`);
          expect(results.succeeded).to.equal(true);
        });
        it('Returned results should contain a null parsedExpression."', function() {
          //logs(`PARSED_EXPRESSION = ${JSON.stringify(results.parsedExpression)}`);
          expect(results.parsedExpression === null).to.equal(true);
        });
        it('Returned result.policyConditions array should have length of zero.', function() {
          //logs(`POLICY_CONDITIONS = ${JSON.stringify(results)}`);
          expect(results.policyConditions.length).to.equal(0);
        });

      });

      let rdjData2;
      // Test cases for policy with 1 combined policy condition.
      describe("Use fixturesMap and 'single-combined-parsedExpression' fixturesMapKey to load rdjData fixture file.", function () {
        rdjData2 = fixture.load(fixturesMap["single-combined-parsedExpression"]);
        fixture.cleanup();
      });
      describe("removePolicyData", function () {
        it('Should return a PolicyData object when invoked with rdjData variable, passed as the rdjData parameter.', function() {
          policyData = PolicyManager.createPolicyData(rdjData2);
          expect(policyData instanceof PolicyData).to.equal(true);
        });
      });
      describe("UC-REMOVE-002: Remove the last condition which is a combination with 2 conditions, from a policy.", function () {
        let predicateItem, results;

        describe("Set predicateItem variable from fixtures/microservices/policy-management/UseCaseTests/removeConditions/UCR-002-predicateItem.json fixture file.", function () {
          predicateItem = fixture.load('microservices/policy-management/UseCaseTests/removeConditions/UCR-002-predicateItem.json');
          fixture.cleanup();
        });

        it('Returned results should contain succeeded=true property', function() {
          results = policyData.removeConditions(policyData, 'Policy', predicateItem);
          logs(`SUCCEEDED = ${results.succeeded}`);
          expect(results.succeeded).to.equal(true);
        });
        it('Returned results should contain a parsedExpression that is null or children is an array of zero length."', function() {
          //logs(`PARSED_EXPRESSION = ${JSON.stringify(results.parsedExpression)}`);
          expect(results.parsedExpression === null || results.parsedExpression.children.length === 0 ).to.equal(true);
        });
        it('Returned result.policyConditions array should have length of zero.', function() {
          //logs(`POLICY_CONDITIONS = ${JSON.stringify(results)}`);
          expect(results.policyConditions.length).to.equal(0);
        });

      });

      let rdjData3;
      // Test cases for policy with 1 negated combined policy condition.
      describe("Use fixturesMap and 'single-negated-combined-parsedExpression' fixturesMapKey to load rdjData fixture file.", function () {
        rdjData3 = fixture.load(fixturesMap["single-negated-combined-parsedExpression"]);
        fixture.cleanup();
      });
      describe("removePolicyData", function () {
        it('Should return a PolicyData object when invoked with rdjData variable, passed as the rdjData parameter.', function() {
          policyData = PolicyManager.createPolicyData(rdjData3);
          expect(policyData instanceof PolicyData).to.equal(true);
        });
      });
      describe("UC-REMOVE-003: Remove the last condition which is a negated combination with 2 conditions, from a policy.", function () {
        let predicateItem, results;

        describe("Set predicateItem variable from fixtures/microservices/policy-management/UseCaseTests/removeConditions/UCR-003-predicateItem.json fixture file.", function () {
          predicateItem = fixture.load('microservices/policy-management/UseCaseTests/removeConditions/UCR-003-predicateItem.json');
          fixture.cleanup();
        });

        it('Returned results should contain succeeded=true property', function() {
          results = policyData.removeConditions(policyData, 'Policy', predicateItem);
          logs(`SUCCEEDED = ${results.succeeded}`);
          expect(results.succeeded).to.equal(true);
        });
        it('Returned results should contain a parsedExpression that is null or children is an array of zero length."', function() {
          //logs(`PARSED_EXPRESSION = ${JSON.stringify(results.parsedExpression)}`);
          expect(results.parsedExpression === null || results.parsedExpression.children.length === 0 ).to.equal(true);
        });
        it('Returned result.policyConditions array should have length of zero.', function() {
          //logs(`POLICY_CONDITIONS = ${JSON.stringify(results)}`);
          expect(results.policyConditions.length).to.equal(0);
        });

      });
    });
  }
);