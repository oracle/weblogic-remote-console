// https://www.chaijs.com/
define(['wrc-frontend/microservices/page-definition/types', 'sinon'],
  function (PageDataTypes, sinon) {

    describe("PDJ Types Tests", function () {

      describe("Display function", function () {

        it('Get properties display', function () {

          let type = {
            label: "JavaMail Properties",
            name: "Properties",
            restartNeeded: true,
            type: "properties"
          };

          pdjTypes = new PageDataTypes([type], "configuration");

          expect(pdjTypes.getLabel("Properties")).to.equal("JavaMail Properties");
        });

      });

    });

  }
);
