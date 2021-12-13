define(['wrc-frontend/core/utils'],
  function (CfeUtils) {

    describe("CfeUtils Tests", function () {

      describe("isEquivalent", function () {
        let a = {
          isLockOwner: false,
          hasChanges: false,
          supportsChanges: false
        }, b = {
          isLockOwner: false,
          hasChanges: false,
          supportsChanges: false
        };
        it('Return value should be true', function() {
          expect(CfeUtils.isEquivalent(a, b)).to.equal(true);
        });

        it('Return value should be false', function() {
          b = {
            isLockOwner: true,
            hasChanges: true,
            supportsChanges: false
          };
          expect(CfeUtils.isEquivalent(a, b)).to.equal(false);
        });
      });

      describe("isSame", function () {
        let a = {a: 1}, b = {a: 1};
        it('Return value should be true', function() {
          expect(CfeUtils.isSame(a, b)).to.equal(true);
        });
      });

      describe("isNotUndefinedNorNull", function () {
        let value;
        it('When argument is undefined, then the return value should be false', function() {
          expect(CfeUtils.isNotUndefinedNorNull(value)).to.equal(false);
        });

        it('When argument is "foobar", then the return value should be true', function() {
          value = "foobar";
          expect(CfeUtils.isNotUndefinedNorNull(value)).to.equal(true);
        });
      });

      describe("isUndefinedOrNull", function () {
        let value;
        it('When argument is undefined, then the return value should be true', function() {
          expect(CfeUtils.isUndefinedOrNull(value)).to.equal(true);
        });

        it('When argument is "foobar", then the return value should be false', function() {
          value = "foobar";
          expect(CfeUtils.isUndefinedOrNull(value)).to.equal(false);
        });
      });

      describe("isEmpty", function () {
        let value;
        it('When argument is undefined, then the return value should be false', function() {
          expect(CfeUtils.isEmpty(value)).to.equal(false);
        });

        it('When argument is "foobar", then the return value should be false', function() {
          value = "foobar";
          expect(CfeUtils.isEmpty(value)).to.equal(false);
        });

        it('When argument is "", then the return value should be true', function() {
          value = "";
          expect(CfeUtils.isEmpty(value)).to.equal(true);
        });

        it('When argument is [], then the return value should be true', function() {
          value = [];
          expect(CfeUtils.isEmpty(value)).to.equal(true);
        });
      });

      describe("getSubstring", function () {
        it('Return value should be true', function() {
          expect(CfeUtils.getSubstring("The little red fox walked across the road", "red")).to.equal("The little ");
        });
      });

      describe("isError", function () {
        it('Return value should be true', function() {
          const reason = new Error("A CFE error occurred");
          expect(CfeUtils.isError(reason)).to.equal(true);
        });
      });

      describe("getLastIndex", function () {
        const d = [
          {'a': "something", 'b':12},
          {'a': "something", 'b':12},
          {'a': "somethingElse", 'b':12},
          {'a': "something", 'b':12},
          {'a': "somethingElse", 'b':12}
        ];

        it('Last index of {"a": "something"} should be 3', function() {
          expect(CfeUtils.getLastIndex(d, 'a', 'something')).to.equal(3);
        });

        it('Last index of {"a": "nothing"} should be -1', function() {
          expect(CfeUtils.getLastIndex(d, 'a', 'nothing')).to.equal(-1);
        });

      });

      describe("getValues", function () {
        const beanTrees = [
          {"name":  "edit", "type": "configuration", "navtreeUri": "/api/domain1/edit/navtree", "changeManagerUri": "/api/domain1/edit/changeManager"},
          {"name":  "domainRuntime", "type": "monitoring",  "navtreeUri": "/api/domain1/domainRuntime/navtree", "readOnly":  true},
          {"name":  "serverConfig", "type": "view", "navtreeUri": "/api/domain1/serverConfig/navtree", "readOnly":  true}
        ];

        it('Return value should be ["configuration", "monitoring", "view"]', function() {
          const a = CfeUtils.getValues(beanTrees, "type");
          expect(CfeUtils.isSame(a, ["configuration", "monitoring", "view"])).to.equal(true);
        });

        it('Return value should be ["edit", "domainRuntime", "serverConfig"]', function() {
          const a = CfeUtils.getValues(beanTrees, "name");
          expect(CfeUtils.isSame(a, ["edit", "domainRuntime", "serverConfig"])).to.equal(true);
        });

      });

    });

  }
);
