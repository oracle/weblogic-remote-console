// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.filter;

import javax.ws.rs.core.Feature;
import javax.ws.rs.core.FeatureContext;

/**
 * WebLogic Console Backend JAX-RS Feature for adding the authentication information (i.e.
 * Authorization header) in requests to the WebLogic Domain.
 */
public class ClientAuthFeature implements Feature {
  private final ClientAuthFilter filter;

  /**
   * Create the WebLogic Console Backend JAX-RS Feature for client authorization
   *
   * @return JAX-RS Feature
   */
  public static Feature authorization(String authHeader) {
    return new ClientAuthFeature(authHeader);
  }

  /**
   * Create a new feature initialized with the Authorization header
   *
   * @param authHeader The HTTP Authorization header value
   */
  ClientAuthFeature(String authHeader) {
    this.filter = new ClientAuthFilter(authHeader);
  }

  @Override
  public boolean configure(FeatureContext context) {
    context.register(filter);
    return true;
  }
}
