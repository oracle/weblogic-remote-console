// Copyright (c) 2020, 2024, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.filter;

import java.io.IOException;
import javax.annotation.Priority;
import javax.ws.rs.Priorities;
import javax.ws.rs.client.ClientRequestContext;
import javax.ws.rs.client.ClientRequestFilter;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MultivaluedMap;

/**
 * WebLogic Console Backend JAX-RS Filter for adding the authentication information (i.e.
 * Authorization header) in requests to the WebLogic Domain.
 */
@Priority(Priorities.AUTHENTICATION)
public class ClientAuthFilter implements ClientRequestFilter {
  private final ClientAuthHeader auth;

  /**
   * Create a new filter initialized with the Authorization header
   *
   * @param authHeader The HTTP Authorization header value
   */
  public ClientAuthFilter(ClientAuthHeader authHeader) {
    auth = authHeader;
  }

  @Override
  public void filter(ClientRequestContext request) throws IOException {
    MultivaluedMap<String, Object> headers = request.getHeaders();
    if (!headers.containsKey(HttpHeaders.AUTHORIZATION)) {
      // Bearer token placed into WebLogic specific HTTP header
      String header = auth.isBearerToken() ? "weblogic-jwt-token" : HttpHeaders.AUTHORIZATION;
      headers.add(header, auth.getAuthHeader());
    }
  }
}
