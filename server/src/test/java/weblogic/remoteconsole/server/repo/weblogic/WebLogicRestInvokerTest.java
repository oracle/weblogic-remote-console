// Copyright (c) 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import javax.json.Json;
import javax.json.JsonObject;

import org.junit.jupiter.api.Test;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class WebLogicRestInvokerTest {

  @Test
  void preservesForbiddenStatusAndMessages() {
    Response<JsonObject> response = convert(javax.ws.rs.core.Response.Status.FORBIDDEN, failureEntity("Forbidden"));

    assertTrue(response.isForbidden());
    assertFalse(response.isServiceNotAvailable());
    assertEquals(1, response.getMessages().size());
    assertEquals("Forbidden", response.getMessages().get(0).getText());
  }

  @Test
  void preservesExistingExpectedErrorMappings() {
    assertTrue(convert(javax.ws.rs.core.Response.Status.BAD_REQUEST).isUserBadRequest());
    assertTrue(convert(javax.ws.rs.core.Response.Status.NOT_FOUND).isNotFound());
    assertTrue(convert(javax.ws.rs.core.Response.Status.GATEWAY_TIMEOUT).isTimeout());
  }

  @Test
  void continuesToTreatUnexpectedStatusesAsServiceUnavailable() {
    assertTrue(convert(javax.ws.rs.core.Response.Status.NOT_IMPLEMENTED).isServiceNotAvailable());
  }

  private Response<JsonObject> convert(javax.ws.rs.core.Response.Status status) {
    return convert(status, Json.createObjectBuilder().build());
  }

  private Response<JsonObject> convert(javax.ws.rs.core.Response.Status status, JsonObject entity) {
    try (javax.ws.rs.core.Response restResponse =
      javax.ws.rs.core.Response.status(status).entity(entity).build()) {
      return WebLogicRestInvoker.restResponseToResponse(
        new InvocationContext(),
        restResponse,
        false,
        false
      );
    }
  }

  private JsonObject failureEntity(String message) {
    return
      Json.createObjectBuilder()
        .add(
          "messages",
          Json.createArrayBuilder()
            .add(
              Json.createObjectBuilder()
                .add("severity", "FAILURE")
                .add("message", message)
            )
        )
        .build();
  }
}
