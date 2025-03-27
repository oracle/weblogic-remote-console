// Copyright (c) 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.List;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;

import weblogic.console.utils.Path;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.weblogic.WebLogicRestInvoker;

/** 
 * Used to discover the capabilities of mbean interfaces.
 */
public class BeansCapabilitiesFinder {
  private JsonObjectBuilder queryBldr = Json.createObjectBuilder();
  private JsonObject results;

  public BeansCapabilitiesFinder addTypeCapability(
    String capability,
    String type
  ) {
    JsonObjectBuilder bldr = Json.createObjectBuilder();
    bldr.add("type", type);
    queryBldr.add(capability, bldr);
    return this;
  }

  public BeansCapabilitiesFinder addPropertyCapability(
    String capability,
    String type,
    String property
  ) {
    JsonObjectBuilder bldr = Json.createObjectBuilder();
    bldr.add("type", type);
    bldr.add("property", property);
    queryBldr.add(capability, bldr);
    return this;    
  } 
   
  public BeansCapabilitiesFinder addActionCapability(
    String capability,
    String type,
    String action,
    String... params
  ) {
    JsonObjectBuilder bldr = Json.createObjectBuilder();
    bldr.add("type", type);
    bldr.add("action", action);
    if (params.length > 0) {
      JsonArrayBuilder paramsBldr = Json.createArrayBuilder();
      for (String param : params) {
        paramsBldr.add(param);
      }
      bldr.add("params", paramsBldr);
    }
    queryBldr.add(capability, bldr);
    return this;
  }

  public BeansCapabilitiesFinder find(InvocationContext ic) {
    if (ic.getPageRepo().getBeanRepo().getBeanRepoDef().supportsCapabilities(List.of("BeansSupport"))) {
      JsonObject query = queryBldr.build();
      results =
        WebLogicRestInvoker.post(
          ic,
          new Path("domainConfig.consoleBackend.beansSupport"),
          query,
          false, // expanded values
          false, // save changes
          false // asynchronous
           ).getResults();
    }
    return this;
  }

  boolean supports(String capability) {
    return (results != null) ? results.getBoolean(capability, false) : false;
  }
}
