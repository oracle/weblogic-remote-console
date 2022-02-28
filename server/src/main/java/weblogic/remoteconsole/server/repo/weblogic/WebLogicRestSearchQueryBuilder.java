// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObjectBuilder;

import weblogic.remoteconsole.common.repodef.BeanChildDef;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;

/** 
 * Builder for creating WebLogic REST search queries.
 */
public class WebLogicRestSearchQueryBuilder {

  private static final Logger LOGGER = Logger.getLogger(WebLogicRestSearchQueryBuilder.class.getName());

  private static final Set<String> FIX_IDENTITIES_FIELDS = Set.of("type", "name", "identity");

  private WebLogicRestBeanRepoSearchBuilder builder;

  private WebLogicRestSearchQueryBuilder parent;

  private BeanTypeDef typeDef;

  // defaults to whether the root type of this search is settable.
  // will get set to false if any of the childs types isn't settable.
  private boolean settable;

  // Indicates that the query builder will include additional fields
  // so that an mbeans' identity can be determined properly.
  // The name, type and identity fields will be added if not already present.
  private boolean fixIdentities = false;

  // whether any children, keys or fields were specified on this builder.
  // if not, then this builder can be ignored.
  private boolean customized = false;

  // if 'allKeys' is true, then all children in a collection are returned.
  // otherwise, 'keys' lists the children to return. also, if 'keys' is empty,
  // then all the chilren are returned.
  // by default, allKeys is false and will only be set to true if setAllKeys is called.
  private boolean allKeys = false;

  private Set<String> keys = new HashSet<>();

  private Map<String, WebLogicRestSearchQueryBuilder> children = new HashMap<>();

  private Set<String> fields = new HashSet<>();

  private boolean includeChangeManagerStatus = false;

  private boolean includeChanges = false;

  public WebLogicRestSearchQueryBuilder(
    WebLogicRestBeanRepoSearchBuilder builder,
    BeanTypeDef typeDef,
    boolean fixIdentities
  ) {
    this(builder, typeDef, null);
    this.fixIdentities = fixIdentities;
    LOGGER.finest("WebLogicRestSearchQueryBuilder fix identities: " + fixIdentities);
  }

  private WebLogicRestSearchQueryBuilder(
    WebLogicRestBeanRepoSearchBuilder builder,
    BeanTypeDef typeDef,
    WebLogicRestSearchQueryBuilder parent
  ) {
    this.builder = builder;
    this.typeDef = typeDef;
    this.parent = parent;
    this.settable = typeDef.isSettable();
    this.fixIdentities = (parent != null) ? parent.isFixIdentities() : false;
  }

  BeanTypeDef getBeanTypeDef() {
    return typeDef;
  }

  WebLogicRestSearchQueryBuilder addChangeManagerStatus() {
    includeChangeManagerStatus = true;
    setCustomized();
    return this;
  }

  WebLogicRestSearchQueryBuilder addChanges() {
    addChangeManagerStatus(); // we always return the change manager status too
    includeChanges = true;
    setCustomized();
    return this;
  }

  WebLogicRestSearchQueryBuilder addProperty(BeanPropertyDef propertyDef) {
    String field = propertyDef.getOnlinePropertyName();
    if (fields == null) {
      fields = new HashSet<>();
    }
    fields.add(field);
    return setCustomized();
  }

  WebLogicRestSearchQueryBuilder getOrCreateChild(BeanChildDef childDef) {
    String childRestName = childDef.getOnlineChildName();
    WebLogicRestSearchQueryBuilder child = children.get(childRestName);
    if (child == null) {
      boolean settable = childDef.getChildTypeDef().isSettable();
      if (!settable) {
        setSettable(false);
      }
      child = new WebLogicRestSearchQueryBuilder(builder, childDef.getChildTypeDef(), this);
      children.put(childRestName, child);
    }
    setCustomized();
    return child;
  }

  WebLogicRestSearchQueryBuilder setAllKeys() {
    allKeys = true;
    return setCustomized();
  }

  WebLogicRestSearchQueryBuilder addKey(String key) {
    if (!allKeys) {
      keys.add(key);
    }
    return setCustomized();
  }

  private WebLogicRestSearchQueryBuilder setCustomized() {
    customized = true;
    return this;
  }

  private void setSettable(boolean val) {
    if (parent != null) {
      parent.setSettable(val);
    } else {
      settable = val;
    }
  }

  protected boolean isSettable() {
    if (parent != null) {
      return parent.isSettable();
    } else {
      return settable;
    }
  }

  boolean isFixIdentities() {
    return fixIdentities;
  }

  boolean isReturnExpandedValues() {
    return builder.isIncludeIsSet() && isSettable();
  }

  JsonObjectBuilder getJsonObjectBuilder() {
    if (!customized) {
      return null; // don't need anything about this object or its children
    }
    JsonObjectBuilder bldr = Json.createObjectBuilder();
    addFieldsToRestQuery(bldr);
    addKeysToRestQuery(bldr);
    addChildrenToRestQuery(bldr);
    return bldr;
  }

  private void addFieldsToRestQuery(JsonObjectBuilder bldr) {
    // Always fetch the key property if it's available
    BeanPropertyDef keyPropertyDef = typeDef.getKeyPropertyDef();
    if (keyPropertyDef != null) {
      addProperty(keyPropertyDef);
    }
    JsonArrayBuilder fieldsBldr = Json.createArrayBuilder();
    for (String field : fields) {
      fieldsBldr.add(field);
    }
    // If identities need fixing then add those fields when not already present
    if (fixIdentities) {
      for (String fixIdentitiesField : FIX_IDENTITIES_FIELDS) {
        if (!fields.contains(fixIdentitiesField)) {
          fieldsBldr.add(fixIdentitiesField);
        }
      }
    }
    bldr.add("fields", fieldsBldr);
  }

  private void addKeysToRestQuery(JsonObjectBuilder bldr) {
    if (!allKeys && !keys.isEmpty()) {
      // we're supposed to return a specific set of collection children:
      JsonArrayBuilder keysBldr = Json.createArrayBuilder();
      for (String key : keys) {
        keysBldr.add(key);
      }
      bldr.add(typeDef.getKeyPropertyDef().getOnlinePropertyName(), keysBldr);
    } else {
      // we're supposed to return all of the collection's children
      // do nothing (since, by default, the WLS REST api returns all collection children)
    }
  }

  private void addChildrenToRestQuery(JsonObjectBuilder bldr) {
    JsonObjectBuilder childrenBldr = null;
    if (children != null) {
      for (Map.Entry<String, WebLogicRestSearchQueryBuilder> entry : children.entrySet()) {
        JsonObjectBuilder childBldr = entry.getValue().getJsonObjectBuilder();
        if (childBldr != null) {
          if (childrenBldr == null) {
            childrenBldr = Json.createObjectBuilder();
          }
          childrenBldr.add(entry.getKey(), childBldr);
        }
      }
    }
    if (includeChangeManagerStatus) {
      if (childrenBldr == null) {
        childrenBldr = Json.createObjectBuilder();
      }
      addChangeManagerStatusToQuery(childrenBldr);
    }
    if (childrenBldr != null) {
      bldr.add("children", childrenBldr);
    }
  }

  private void addChangeManagerStatusToQuery(JsonObjectBuilder childrenBldr) {
    addChangeManagerToQuery(childrenBldr);
    addConsoleChangeManagerToQuery(childrenBldr);
  }

  private void addChangeManagerToQuery(JsonObjectBuilder childrenBldr) {
    JsonArrayBuilder fieldsBldr = Json.createArrayBuilder();
    fieldsBldr.add("locked");
    fieldsBldr.add("lockOwner");
    fieldsBldr.add("hasChanges");
    fieldsBldr.add("mergeNeeded");
    JsonObjectBuilder changeManagerBldr = Json.createObjectBuilder();
    changeManagerBldr.add("fields", fieldsBldr);
    childrenBldr.add("changeManager", changeManagerBldr);
  }

  private void addConsoleChangeManagerToQuery(JsonObjectBuilder childrenBldr) {
    // The console change manager doesn't have any specific properties (yet)
    // but we need to see if it exists.
    JsonObjectBuilder consoleChangeManagerBldr = Json.createObjectBuilder();
    if (includeChanges) {
      addChangesToQuery(consoleChangeManagerBldr);
    }
    childrenBldr.add("consoleChangeManager", consoleChangeManagerBldr);
  }

  private void addChangesToQuery(JsonObjectBuilder consoleChangeManagerBldr) {
    JsonObjectBuilder changesBldr = Json.createObjectBuilder();
    JsonArrayBuilder fieldsBldr = Json.createArrayBuilder();
    fieldsBldr.add("additions");
    fieldsBldr.add("modifications");
    fieldsBldr.add("removals");
    changesBldr.add("fields", fieldsBldr);
    JsonObjectBuilder childrenBldr = Json.createObjectBuilder();
    childrenBldr.add("changes", changesBldr);
    consoleChangeManagerBldr.add("children", childrenBldr);;
  }
}
