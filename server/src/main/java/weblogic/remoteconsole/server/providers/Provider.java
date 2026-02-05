// Copyright (c) 2020, 2025, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.providers;

import java.util.LinkedHashMap;
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

  // Some of the providers have nothing interesting to do when terminated
  public default void terminate() {
  }

  // Doesn't apply to any but AS
  public default boolean isConnectionOriented() {
    return false;
  }

  public boolean start(InvocationContext ic);

  public JsonObject toJSON(InvocationContext ic);

  public boolean isValidPath(String path);

  // Only AS has one
  public default boolean supportsShoppingCart() {
    return false;
  }

  // Only AS has one
  public default boolean isShoppingCartEmpty() {
    return true;
  }

  // Only AS has one
  public default void setIsShoppingCartEmpty(boolean isEmpty) {
  }

  // Only the AS has more than one
  public default void updateLastRootUsed(String rootName) {
  }

  /* Order matters, hence the LinkedHashMap */
  public LinkedHashMap<String, String> getStatusMap(InvocationContext ic);

  /* Update status */
  public void updateStatus(InvocationContext ic);

  // AS has multiple roots and PropertyList calls its tree "propertyList,
  // otherwise they all call it "edit"
  public default String getLastRootUsed() {
    return Root.EDIT_NAME;
  }

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
