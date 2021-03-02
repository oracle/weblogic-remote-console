// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.filter;

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
  private final String authHeader;

  /**
   * Create a new filter initialized with the Authorization header
   *
   * @param authHeader The HTTP Authorization header value
   */
  public ClientAuthFilter(String authHeader) {
    this.authHeader = authHeader;
  }

  @Override
  public void filter(ClientRequestContext request) throws IOException {
    MultivaluedMap<String, Object> headers = request.getHeaders();
    if (!headers.containsKey(HttpHeaders.AUTHORIZATION)) {
      headers.add(HttpHeaders.AUTHORIZATION, authHeader);
    }
  }
}
