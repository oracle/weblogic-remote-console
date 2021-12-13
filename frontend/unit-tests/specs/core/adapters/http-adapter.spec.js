define(['wrc-frontend/core/adapters/http-adapter', 'sinon'],
  function (HttpAdapter, sinon) {

    describe("HttpAdapter Tests", function () {
      beforeEach(function () {
        this.server = sinon.fakeServer.create();
      });

      afterEach(function () {
        this.server.restore();
      });

      describe("perform", function () {
      });

      describe("get", function () {
      });

      describe("post", function () {
      });

      describe("delete", function () {
      });

    });

  }
);
