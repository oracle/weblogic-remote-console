define(['wrc-frontend/core/cfe-errors'],
  function (CfeErrors) {

    describe("CfeErrors Tests", function () {

      describe("CfeError", function () {
        it('Return value should be true', function() {
          const reason = new CfeErrors.InvalidItemKeyError("CfeError");
        });
      });

    });

  }
);
