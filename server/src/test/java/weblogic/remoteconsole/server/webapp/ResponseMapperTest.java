// Copyright (c) 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import javax.json.JsonObject;

import org.junit.jupiter.api.Test;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class ResponseMapperTest {

  @Test
  void mapsForbiddenResponseAndMessagesToHttp403() {
    Response<Void> response = new Response<Void>().setForbidden().addFailureMessage("Forbidden");

    try (javax.ws.rs.core.Response restResponse =
      VoidResponseMapper.toResponse(new InvocationContext(), response)) {
      JsonObject entity = (JsonObject)restResponse.getEntity();

      assertEquals(javax.ws.rs.core.Response.Status.FORBIDDEN.getStatusCode(), restResponse.getStatus());
      assertEquals("error", entity.getJsonArray("messages").getJsonObject(0).getString("severity"));
      assertEquals("Forbidden", entity.getJsonArray("messages").getJsonObject(0).getString("message"));
    }
  }

  @Test
  void forbiddenIsDistinctFromServiceUnavailable() {
    Response<Void> response = new Response<Void>().setForbidden();

    assertTrue(response.isForbidden());
    assertFalse(response.isServiceNotAvailable());
  }
}
