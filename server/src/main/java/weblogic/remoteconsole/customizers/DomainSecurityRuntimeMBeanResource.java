// Copyright (c) 2022, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.ws.rs.core.Response;

import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.webapp.ReadOnlyMandatorySingletonBeanResource;

/**
 * Custom JAXRS resource getting the DomainSecurityRuntimeMBean's
 * SecurityWarnings table slice's RDJ.
 */
public class DomainSecurityRuntimeMBeanResource extends ReadOnlyMandatorySingletonBeanResource {
  @Override
  protected Response getSlice() {
    Response baseResponse = super.getSlice();
    if (baseResponse.getStatus() == Response.Status.OK.getStatusCode() && isSecurityWarningsSlice()) {
      // The admin server provider's list of links depends on whether there are any security warnings.
      // The security warnings slice tells the admin server to refresh its list of security warnings.
      // So, whenever we get the security warnings slice, send back a new list of provider links
      // in case they changed (e.g. previously there were warnings and now there aren't any).
      return addProviderLinks(baseResponse);
    }
    return baseResponse;
  }

  private boolean isSecurityWarningsSlice() {
    if (getInvocationContext().getPagePath().isSlicePagePath()) {
      Path slice = getInvocationContext().getPagePath().asSlicePagePath().getSlicePath();
      if (slice.isEmpty() || slice.equals(new Path("SecurityWarnings"))) {
        return true; // the default slice is the SecurityWarnings slice
      }
    }
    return false;
  }

  private Response addProviderLinks(Response baseResponse) {
    JsonObject providerJson = getInvocationContext().getProvider().toJSON(getInvocationContext());
    JsonArray providerLinks = providerJson.getJsonArray("links");
    if (providerLinks == null) {
      // there are no provider links to add so just use the original RDJ
      return baseResponse;
    }
    try {
      // Can't call readEntity(JsonObject.class) since baseResponse is an outbound response
      // and doesn't support the method.  So just call getEntity and cast it.
      JsonObject rdjJson = (JsonObject)baseResponse.getEntity();
      JsonObjectBuilder entityBuilder = Json.createObjectBuilder(rdjJson);
      entityBuilder.add("providerLinks", providerLinks);
      return Response.ok(entityBuilder.build()).build();
    } finally {
      baseResponse.close();
    }
  }
}
