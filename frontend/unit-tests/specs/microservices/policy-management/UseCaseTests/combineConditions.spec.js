/*
describe("Use fixturesMap and 'single-parsedExpression' fixturesMapKey to load rdjData fixture file.", function () {
  rdjData = fixture.load(fixturesMap[single-parsedExpression]);
  fixture.cleanup();
});

describe("createPolicyData", function () {
  it('Should return a PolicyData object when invoked with rdjData variable, passed as the rdjData parameter.', function() {
    policyData = PolicyManager.createPolicyData(rdjData);
    expect(policyData instanceof PolicyData).to.equal(true);
  });
});

describe("UC-002: Add a Condition to the top of all policies", function () {
  let predicateItem, results;

  describe("Set predicateItem variable from fixtures/microservices/policy-management/UseCaseTests/addCondition/UC-002-predicateItem.json fixture file.", function () {
    predicateItem = fixture.load('microservices/policy-management/UseCaseTests/addCondition/UC-002-predicateItem.json');
    fixture.cleanup();
  });

  it('Returned results should contain succeeded=true property', function() {
    results = policyData.addPolicyCondition(policyData, 'Policy', predicateItem);
    console.log(`SUCCEEDED = ${results.succeeded}`);
    expect(results.succeeded).to.equal(true);
  });

  it('Returned results should contain a non-empty parsedExpression."', function() {
    console.log(`PARSED_EXPRESSION = ${JSON.stringify(results.parsedExpression)}`);
    expect(CoreUtils.isNotUndefinedNorNull(results.parsedExpression)).to.equal(true);
  });

  it('Returned results should contain a parsedExpression with 2 children"', function() {
    console.log(`CHILDREN of PARSED_EXPRESSION = ${JSON.stringify(results.parsedExpression.children)}`);
    expect(results.parsedExpression.children.length).to.equal(2);
  });

  it('Returned result.policyConditions array should have 2 elements."', function() {
    console.log(`POLICY_CONDITIONS = ${JSON.stringify(results.policyConditions)}`);
    expect(results.policyConditions.length).to.equal(1);
  });

});

describe("UC-003: Add a Condition above the selected condition", function () {
  let predicateItem, results;

  describe("Set predicateItem variable from fixtures/microservices/policy-management/UseCaseTests/addCondition/UC-003-predicateItem.json fixture file.", function () {
    predicateItem = fixture.load('microservices/policy-management/UseCaseTests/addCondition/UC-003-predicateItem.json');
    fixture.cleanup();
  });

  it('Returned results should contain succeeded=true property', function() {
    results = policyData.addPolicyCondition(policyData, 'Policy', predicateItem);
    console.log(`SUCCEEDED = ${results.succeeded}`);
    expect(results.succeeded).to.equal(true);
  });

  it('Returned results should contain a non-empty parsedExpression."', function() {
    console.log(`PARSED_EXPRESSION = ${JSON.stringify(results.parsedExpression)}`);
    expect(CoreUtils.isNotUndefinedNorNull(results.parsedExpression)).to.equal(true);
  });

  it('Returned results should contain a parsedExpression with 2 children"', function() {
    console.log(`CHILDREN of PARSED_EXPRESSION = ${JSON.stringify(results.parsedExpression.children)}`);
    expect(results.parsedExpression.children.length).to.equal(2);
  });

  it('Returned result.policyConditions array should have 2 elements."', function() {
    console.log(`POLICY_CONDITIONS = ${JSON.stringify(results.policyConditions)}`);
    expect(results.policyConditions.length).to.equal(1);
  });

});

describe("UC-004: Add a Condition below the selected condition", function () {
  let predicateItem, results;

  describe("Set predicateItem variable from fixtures/microservices/policy-management/UseCaseTests/addCondition/UC-004-predicateItem.json fixture file.", function () {
    predicateItem = fixture.load('microservices/policy-management/UseCaseTests/addCondition/UC-004-predicateItem.json');
    fixture.cleanup();
  });

  it('Returned results should contain succeeded=true property', function() {
    results = policyData.addPolicyCondition(policyData, 'Policy', predicateItem);
    console.log(`SUCCEEDED = ${results.succeeded}`);
    expect(results.succeeded).to.equal(true);
  });

  it('Returned results should contain a non-empty parsedExpression."', function() {
    console.log(`PARSED_EXPRESSION = ${JSON.stringify(results.parsedExpression)}`);
    expect(CoreUtils.isNotUndefinedNorNull(results.parsedExpression)).to.equal(true);
  });

  it('Returned results should contain a parsedExpression with 2 children"', function() {
    console.log(`CHILDREN of PARSED_EXPRESSION = ${JSON.stringify(results.parsedExpression.children)}`);
    expect(results.parsedExpression.children.length).to.equal(2);
  });

  it('Returned result.policyConditions array should have 2 elements."', function() {
    console.log(`POLICY_CONDITIONS = ${JSON.stringify(results.policyConditions)}`);
    expect(results.policyConditions.length).to.equal(1);
  });

});
*/