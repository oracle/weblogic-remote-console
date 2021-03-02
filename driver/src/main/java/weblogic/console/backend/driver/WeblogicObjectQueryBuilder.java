// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObjectBuilder;

/** Builder for creating WebLogic REST search queries. */
public class WeblogicObjectQueryBuilder {

  private static final Logger LOGGER = Logger.getLogger(WeblogicObjectQueryBuilder.class.getName());

  private String keyPropertyName = null;
  private String key = null;
  private Map<String, WeblogicObjectQueryBuilder> children = null;
  private Set<String> fields = null;
  private boolean allFields = false;

  public void addConfigInfoToQuery() throws Exception {
    // need to see if consoleChangeManager is present to know whether
    // the WLS domain supports listing the configuration changes
    getOrCreateChild("consoleChangeManager").allFields()
    // Uncomment when we enforce that the client sent in the current weblogic version
    /*
    .getOrCreateChild("configurationVersion")
      .addFields("weblogicConfigurationVersion")
    */
    ;

    // Get the standard WLS REST change manager - should always be available.
    getOrCreateChild("changeManager").addFields("locked", "lockOwner", "hasChanges", "mergeNeeded");
  }

  public WeblogicObjectQueryBuilder allFields() {
    this.allFields = true;
    return this;
  }

  public WeblogicObjectQueryBuilder addFields(String... fields) {
    for (String field : fields) {
      addField(field);
    }
    return this;
  }

  public WeblogicObjectQueryBuilder addField(String field) {
    if (this.fields == null) {
      this.fields = new HashSet<>();
    }
    this.fields.add(field);
    return this;
  }

  public WeblogicObjectQueryBuilder getOrCreateChild(String childName) {
    if (this.children == null) {
      this.children = new HashMap<>();
    }
    WeblogicObjectQueryBuilder child = this.children.get(childName);
    if (child == null) {
      child = new WeblogicObjectQueryBuilder();
      this.children.put(childName, child);
    }
    return child;
  }

  public WeblogicObjectQueryBuilder setKey(String keyPropertyName, String key) {
    this.keyPropertyName = keyPropertyName;
    this.key = key;
    return this;
  }

  public JsonObjectBuilder getBuilder() {
    if (
      this.allFields == false
        && this.fields == null
        && this.keyPropertyName == null
        && this.children == null
    ) {
      return null; // don't need anything about this object or its children
    }

    JsonObjectBuilder bldr = Json.createObjectBuilder();
    if (!this.allFields) {
      if (this.fields == null) {
        this.fields = new HashSet<>(); // i.e. empty list of fields so that we don't get all of them
      }
      JsonArrayBuilder fieldsBldr = Json.createArrayBuilder();
      for (String field : fields) {
        fieldsBldr.add(field);
      }
      bldr.add("fields", fieldsBldr);
    }
    if (this.keyPropertyName != null) {
      JsonArrayBuilder keysBldr = Json.createArrayBuilder();
      keysBldr.add(this.key);
      bldr.add(this.keyPropertyName, keysBldr);
    }
    if (this.children != null) {
      JsonObjectBuilder childrenBldr = Json.createObjectBuilder();
      boolean addedChild = false;
      for (Map.Entry<String, WeblogicObjectQueryBuilder> entry : this.children.entrySet()) {
        JsonObjectBuilder childBldr = entry.getValue().getBuilder();
        if (childBldr != null) {
          childrenBldr.add(entry.getKey(), childBldr);
          addedChild = true;
        }
      }
      if (addedChild) {
        bldr.add("children", childrenBldr);
      }
    }
    return bldr;
  }
}
