// Copyright (c) 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import javax.json.JsonObject;

import org.junit.jupiter.api.Test;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.ResponseException;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class GroupResourceTest {

  @Test
  void usesLocalizedGroupNameForForbiddenMessage() {
    try (javax.ws.rs.core.Response restResponse =
      GroupResource.mapResponseException(
        new InvocationContext(),
        new Response<Void>().setForbidden().addFailureMessage("Forbidden").asResponseException(),
        "Services"
      )) {
      JsonObject entity = (JsonObject)restResponse.getEntity();

      assertEquals(javax.ws.rs.core.Response.Status.FORBIDDEN.getStatusCode(), restResponse.getStatus());
      assertEquals(1, entity.getJsonArray("messages").size());
      assertEquals(
        "Access to 'Services' is forbidden.",
        entity.getJsonArray("messages").getJsonObject(0).getString("message")
      );
    }
  }

  @Test
  void preservesForbiddenMessageWithoutGroupName() {
    try (javax.ws.rs.core.Response restResponse =
      GroupResource.mapResponseException(
        new InvocationContext(),
        new Response<Void>().setForbidden().addFailureMessage("Forbidden").asResponseException(),
        null
      )) {
      JsonObject entity = (JsonObject)restResponse.getEntity();

      assertEquals(javax.ws.rs.core.Response.Status.FORBIDDEN.getStatusCode(), restResponse.getStatus());
      assertEquals("Forbidden", entity.getJsonArray("messages").getJsonObject(0).getString("message"));
    }
  }

  @Test
  void preservesOtherFailureStatuses() {
    assertMappedStatus(new Response<Void>().setNotFound().asResponseException(), 404);
    assertMappedStatus(new Response<Void>().setServiceNotAvailable().asResponseException(), 503);
    assertMappedStatus(new Response<Void>().setTimeout().asResponseException(), 504);
    assertMappedStatus(
      new Response<Void>().setUserBadRequest().addFailureMessage("Bad request").asResponseException(),
      400
    );
  }

  private void assertMappedStatus(ResponseException exception, int expectedStatus) {
    try (javax.ws.rs.core.Response restResponse =
      GroupResource.mapResponseException(new InvocationContext(), exception, "Services")) {
      assertEquals(expectedStatus, restResponse.getStatus());
    }
  }
}