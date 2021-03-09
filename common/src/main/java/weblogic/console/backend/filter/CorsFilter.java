// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.filter;

import java.io.IOException;
import java.util.List;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;
import javax.ws.rs.ext.Provider;

@Provider
public class CorsFilter implements ContainerResponseFilter {

  // From https://www.baeldung.com/cors-in-jax-rs
  @Override
  public void filter(ContainerRequestContext req, ContainerResponseContext res) throws IOException {
    List<String> origin = req.getHeaders().get("Origin");

    // whitelist localhost:8000 - ojet serve
    if (origin != null) {
      String allowOrigin = origin.iterator().next();
      if (allowOrigin.equals("http://localhost:8000")) {
        res
          .getHeaders()
          .add("Access-Control-Allow-Origin", allowOrigin);
        res
          .getHeaders()
          .add("Access-Control-Allow-Credentials", "true");
        res
          .getHeaders()
          .add("Access-Control-Allow-Headers", "origin, content-type, accept, authorization");
        res
          .getHeaders()
          .add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");
      }
    }
  }
}
