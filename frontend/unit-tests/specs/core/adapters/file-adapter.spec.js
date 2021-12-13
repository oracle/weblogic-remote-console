define(['wrc-frontend/core/adapters/file-adapter'],
  function (FileAdapter) {

    describe("FileAdapter Tests", function () {

      let data;
      describe("readYaml", function () {
        it('Promise fulfillment should be returned and assigned to data variable', async () => {
          data = await FileAdapter.readYaml("config/perspectives.yaml");
        });

        it('Value of data["perspectives"][0].type property should be "built-in"', function () {
          data["perspectives"][0].should.have.property('type').to.be.equal("built-in");
        });

        it('Value of data["perspectives"][2].id property should be "view"', function () {
          data["perspectives"][2].should.have.property('id').to.be.equal("view");
        });

      });

    });

  }
);
