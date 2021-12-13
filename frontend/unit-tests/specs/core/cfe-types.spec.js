define(['wrc-frontend/core/types'],
  function (CfeTypes) {

    describe("CfeTypes Tests", function () {

      describe("Console.RuntimeMode", function () {
        it('Console.RuntimeMode.ONLINE.name should be ONLINE', function() {
          expect(CfeTypes.Console.RuntimeMode.ONLINE.name).to.equal("ONLINE");
        });

        it('Console.RuntimeMode.OFFLINE.name should be OFFLINE', function() {
          expect(CfeTypes.Console.RuntimeMode.OFFLINE.name).to.equal("OFFLINE");
        });

        it('Console.RuntimeMode.DETACHED.name should be DETACHED', function() {
          expect(CfeTypes.Console.RuntimeMode.DETACHED.name).to.equal("DETACHED");
        });

      });

      describe("runtimeModeFromName", function (name) {
        it('Return value should be CfeTypes.Console.RuntimeMode.DETACHED', function() {
          expect(CfeTypes.Console.runtimeModeFromName("DETACHED")).to.equal(CfeTypes.Console.RuntimeMode.DETACHED);
        });
      });

      describe("Domain.ConnectState", function () {
        it('Domain.ConnectState.CONNECTED.name should be connected', function() {
          expect(CfeTypes.Domain.ConnectState.CONNECTED.name).to.equal("connected");
        });

        it('Domain.ConnectState.DISCONNECTED.name should be disconnected', function() {
          expect(CfeTypes.Domain.ConnectState.DISCONNECTED.name).to.equal("disconnected");
        });
      });

      describe("connectStateFromName", function (name) {
        it('Return value should be CfeTypes.Domain.ConnectState.CONNECTED', function() {
          expect(CfeTypes.Domain.connectStateFromName("connected")).to.equal(CfeTypes.Domain.ConnectState.CONNECTED);
        });
      });

      describe("FailureType", function () {
        it('FailureType.TRANSPORT.name should be TRANSPORT', function() {
          expect(CfeTypes.FailureType.TRANSPORT.name).to.equal("TRANSPORT");
        });

        it('FailureType.NOT_FOUND.name should be NOT_FOUND', function() {
          expect(CfeTypes.FailureType.NOT_FOUND.name).to.equal("NOT_FOUND");
        });

        it('FailureType.CBE_REST_API.name should be CBE_REST_API', function() {
          expect(CfeTypes.FailureType.CBE_REST_API.name).to.equal("CBE_REST_API");
        });

        it('FailureType.UNEXPECTED.name should be UNEXPECTED', function() {
          expect(CfeTypes.FailureType.UNEXPECTED.name).to.equal("UNEXPECTED");
        });
      });

      describe("failureTypeFromName", function (name) {
        it('Return value should be CfeTypes.FailureType.NOT_FOUND', function() {
          expect(CfeTypes.failureTypeFromName("NOT_FOUND")).to.equal(CfeTypes.FailureType.NOT_FOUND);
        });
      });

    });

  }
);
