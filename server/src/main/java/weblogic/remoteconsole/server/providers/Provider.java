// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.providers;

import java.util.Map;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonValue;

import weblogic.remoteconsole.server.repo.InvocationContext;

/**
  The Provider interface holding provider information.  This is a
  a base class that will be extended by each type of provider.
*/
public interface Provider {
  public String getName();

  public String getType();

  public Map<String, Root> getRoots();

  public void terminate();

  public void test(InvocationContext ic);

  public boolean start(InvocationContext ic);

  public JsonObject toJSON(InvocationContext ic);

  public boolean isValidPath(String path);

  /** Create the messages used in the JSON response body */
  public default JsonValue createMessages(String message) {
    return Json.createArrayBuilder()
             .add(Json.createObjectBuilder()
                    .add("message", message)
                    .add("severity", "ERROR")
                    .build())
             .build();
  }
}
