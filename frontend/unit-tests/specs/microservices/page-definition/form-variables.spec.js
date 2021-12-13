define(['wrc-frontend/microservices/page-definition/form-variables', 'wrc-frontend/core/cfe-errors'],
  function (FormVariables, CfeErrors) {

    describe("FormVariables Tests", function () {

      describe("FormVariables", function () {
        it('CfeErrors.InvalidParameterError should be thrown when name === undefined', function() {
          let name;
          expect(function() { FormVariables(name) })
            .to.throw(CfeErrors.InvalidParameterError(), "Parameter cannot be undefined or null: name");
        });

        it('CfeErrors.InvalidParameterError should thrown when name === null', function() {
          let name = null;
          expect(function() { FormVariables(name) })
            .to.throw(CfeErrors.InvalidParameterError(), "Parameter cannot be undefined or null: name");
        });

        it('CfeErrors.InvalidParameterError should be thrown when name === ""', function() {
          let name = "";
          expect(function() { FormVariables(name) })
            .to.throw(CfeErrors.InvalidParameterError(), "Parameter cannot be an empty string: name");
        });
      });

      const formVariables = new FormVariables("Domain");

      describe("name", function () {
        it('Return value should be "Domain"', function() {
          expect(formVariables.name).to.equal("Domain");
        });
      });

      describe("add", function () {
        it('Return value should be "domain1" when key="Name" and value="domain1"', function() {
          const value = formVariables.add("Name", "domain1");
          expect(value).to.equal("domain1");
        });

        it('Return value should be undefined when key=undefined and value=false', function() {
          const value = formVariables.add(undefined, false);
          expect(value).to.be.undefined;
        });

        it('formVariables.length should be 7 after adding variables defined in "microservices/page-definition/form-variables.json" fixture file. ', function() {
          const entries = fixture.load('microservices/page-definition/form-variables.json');

          formVariables.remove("Name");

          entries.forEach((entry) => {
            formVariables.add(entry.key, entry.value);
          });

          // The 'name' property will always be there, so
          // subtract 1 to get the expected count.
          expect(Object.keys(formVariables).length - 1).to.equal(7);
          fixture.cleanup();
        });

      });

      describe("get", function () {
        it('Return value should be "domain1" with key="Name"', function() {
          const value = formVariables.get("Name");
          expect(value).to.equal("domain1");
        });

        it('Return value should be true with key="EnableExalogicOptimizations"', function() {
          const value = formVariables.get("Name");
          expect(value).to.equal("domain1");
        });

        it('Return value should be undefined when key=null', function() {
          const value = formVariables.get(null);
          expect(value).to.be.undefined;
        });
      });

      describe("put", function () {
        it('Put variable with key="ProductionMode" and value=false', function() {
          formVariables.put("ProductionMode", false);
        });

        it('Return value should be false with key="ProductionMode"', function() {
          const value = formVariables.get("ProductionMode");
          expect(value).to.be.false;
        });

        it('Putting variable with key=undefined and value=false should be ignored', function() {
          formVariables.put(undefined, false);
        });

        it('Putting variable with key=null and value="foo" should be ignored', function() {
          formVariables.put(null, "foo");
        });

        it('Putting variable with key="" and value="bar" should be ignored', function() {
          formVariables.put("", "bar");
        });
      });

      describe("remove", function () {
        it('Delete variable with key="ProductionMode"', function() {
          formVariables.remove("ProductionMode", false);
        });

        it('Return value should be undefined with key="ProductionMode"', function() {
          const value = formVariables.get("ProductionMode");
          expect(value).to.be.undefined;
        });
      });

    });

  }
);
