/**
 * @license UPL-1.0
 * Copyright (c) 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
import { render, waitFor } from "@testing-library/preact";
import { Resource } from "wrc/resource/resource";
import * as transport from "wrc/shared/model/transport";
import Context = require("ojs/ojcontext");

describe("Resource - 4xx handling", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("broadcasts error and navigates to safe path when RDJ load fails with 404", async () => {
    // Arrange: mock transport.getData to reject with a 404-like error
    const err: any = new Error("HTTP 404 Not Found");
    err.status = 404;
    jest.spyOn(transport, "getData").mockRejectedValue(err);

    const navigateToAbsolutePath = jest.fn();
    const broadcastMessage = jest.fn();

    const resourceContext: any = {
      routerController: {
        navigateToAbsolutePath,
        selectRoot: () => {},
      },
      broadcastMessage,
    };

    // Act: render Resource with an rdj url that will trigger the mocked failure
    const content = render(
      <div data-oj-binding-provider="preact">
        <Resource rdj="/api/-current-/missing" context={resourceContext} />
      </div>
    );

    // Wait for JET busy context (recommended in tests guide)
    await Context.getContext(content.container).getBusyContext().whenReady();

    // Assert: navigation to the safe path occurred
    await waitFor(() =>
      expect(navigateToAbsolutePath).toHaveBeenCalledWith(
        "/api/-current-/group"
      )
    );

    // Assert: an info message was broadcast for 404
    expect(broadcastMessage).toHaveBeenCalled();
    const firstCallArg = broadcastMessage.mock.calls[0]?.[0];
    expect(firstCallArg?.severity?.toLowerCase?.()).toBe("info");
  });

  it("broadcasts error and navigates to safe path when RDJ load fails with 401", async () => {
    // Arrange: mock transport.getData to reject with a 401-like error
    const err: any = new Error("HTTP 401 Unauthorized");
    err.status = 401;
    jest.spyOn(transport, "getData").mockRejectedValue(err);

    const navigateToAbsolutePath = jest.fn();
    const broadcastMessage = jest.fn();

    const resourceContext: any = {
      routerController: {
        navigateToAbsolutePath,
        selectRoot: () => {},
      },
      broadcastMessage,
    };

    // Act: render Resource with an rdj url that will trigger the mocked failure
    const content = render(
      <div data-oj-binding-provider="preact">
        <Resource rdj="/api/-current-/unauthorized" context={resourceContext} />
      </div>
    );

    // Wait for JET busy context (recommended in tests guide)
    await Context.getContext(content.container).getBusyContext().whenReady();

    // Assert: navigation to the safe path occurred
    await waitFor(() =>
      expect(navigateToAbsolutePath).toHaveBeenCalledWith(
        "/api/-current-/group"
      )
    );

    // Assert: an error message was broadcast
    expect(broadcastMessage).toHaveBeenCalled();
    const firstCallArg = broadcastMessage.mock.calls[0]?.[0];
    expect(firstCallArg?.severity?.toLowerCase?.()).toBe("error");
  });
});
