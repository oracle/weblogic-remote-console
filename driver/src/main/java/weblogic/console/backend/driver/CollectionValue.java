// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;

/** Manages the Json representation of an mbean collection */
public class CollectionValue {

  private static final Logger LOGGER = Logger.getLogger(CollectionValue.class.getName());

  public static final String PROP_ITEMS = "items";

  public static JsonArray getItems(JsonObject collection) {
    return collection.getJsonArray(PROP_ITEMS);
  }

  public static JsonObject fromItems(JsonArray items) {
    return Json.createObjectBuilder().add(PROP_ITEMS, items).build();
  }
}
