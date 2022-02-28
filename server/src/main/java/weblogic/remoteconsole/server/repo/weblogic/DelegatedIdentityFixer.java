// Copyright (c) 2022, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import java.util.Map;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonValue;

import weblogic.remoteconsole.common.repodef.BeanChildDef;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;

/**
 * Base class for converting the identities in the json object for a bean
 * in a WLS REST response to ones relative to the corresponding delegated bean.
 * 
 * The derived classes must implement the method that can convert an
 * undelegated identity to a delegated identity, e.g.
 * from [ domainRuntime, serverRuntimes, server1, jvmRuntime ]
 * to   [ domainRuntime, combinedServerRuntimes, server1 serverRuntime jvmRuntime ]
 */
public abstract class DelegatedIdentityFixer {

  protected static final String PROP_IDENTITY = "identity";
  protected static final String PROP_ITEMS = "items";

  public JsonObject undelegatedResultsToDelegatedResults(BeanTypeDef typeDef, JsonObject undelegatedResults) {
    return (new Fixer(typeDef, undelegatedResults)).fixIdentities();
  }

  protected abstract JsonArray undelegatedIdentityToDelegatedIdentity(JsonArray undelIdentity);

  private class Fixer {

    // The bean type of this bean
    private BeanTypeDef typeDef;

    // The unfixed json for this bean
    JsonObject unfixedBean;

    // The fixed json for this bean
    private JsonObjectBuilder fixedBeanBuilder;

    private Fixer(BeanTypeDef typeDef, JsonObject unfixedBean) {
      this.typeDef = typeDef;
      this.unfixedBean = unfixedBean;
      // By default, copy over all the properties.
      // Ones that need fixing will be replaced later when fixIdentities is called.
      this.fixedBeanBuilder = Json.createObjectBuilder(unfixedBean);
    }

    // Create a new json object for this bean with correct identities and references
    private JsonObject fixIdentities() {
      for (Map.Entry<String, JsonValue> unfixedBeanProperty : unfixedBean.entrySet()) {
        String propertyName = unfixedBeanProperty.getKey();
        if (PROP_IDENTITY.equals(propertyName)) {
          fixIdentityProperty(unfixedBeanProperty.getValue().asJsonArray());
        } else {
          fixNonIdentityProperty(propertyName, unfixedBeanProperty.getValue());
        }
      }
      return fixedBeanBuilder.build();
    }

    // Fixes the identity for this bean.
    private void fixIdentityProperty(JsonArray unfixedIdentity) {
      fixedBeanBuilder.add(PROP_IDENTITY, fixIdentity(unfixedIdentity));
    }

    // Fixes the identities for all of the non-identity properites for this bean.
    private void fixNonIdentityProperty(
      String propertyName,
      JsonValue unfixedPropertyValue
    ) {
      Path beanPath = new Path(StringUtils.getBeanName(propertyName));
      // Looking for collections via child or references via property
      boolean searchSubTypes = true;
      if (typeDef.hasChildDef(beanPath, searchSubTypes)) {
        BeanChildDef beanChildDef = typeDef.getChildDef(beanPath, searchSubTypes);
        if (beanChildDef.isCollection()) {
          fixContainedCollection(
            beanChildDef,
            propertyName,
            unfixedPropertyValue.asJsonObject().getJsonArray(PROP_ITEMS)
          );
        } else {
          fixContainedSingleton(
            beanChildDef,
            propertyName,
            unfixedPropertyValue
          );
        }
      } else if (typeDef.hasPropertyDef(beanPath, searchSubTypes)) {
        BeanPropertyDef beanPropDef = typeDef.getPropertyDef(beanPath, searchSubTypes);
        if (beanPropDef.isReference()) {
          if (!beanPropDef.isArray()) {
            fixReferenceProperty(propertyName, unfixedPropertyValue);
          } else {
            fixReferencesProperty(propertyName, unfixedPropertyValue.asJsonArray());
          }
        } else {
          // return the property value as-is
        }
      }
    }

    // Fixes the identity of a reference property
    private void fixReferenceProperty(
      String propertyName,
      JsonValue unfixedReference
    ) {
      if (unfixedReference == JsonValue.NULL) {
        // return the reference as-is
        return;
      }
      fixedBeanBuilder.add(
        propertyName,
        fixIdentity(unfixedReference.asJsonArray())
      );
    }

    // Fixes the identity of an array of references property
    private void fixReferencesProperty(
      String propertyName,
      JsonArray unfixedReferences
    ) {
      if (unfixedReferences.isEmpty()) {
        // return the references as-is
        return;
      }
      JsonArrayBuilder fixedReferencesBuilder = Json.createArrayBuilder();
      for (int i = 0; i < unfixedReferences.size(); i++) {
        JsonValue unfixedReference = unfixedReferences.getJsonObject(i).get(PROP_IDENTITY);
        JsonValue fixedReference =
          (unfixedReference != JsonValue.NULL)
          ? fixIdentity(unfixedReference.asJsonArray())
          : JsonValue.NULL;
        fixedReferencesBuilder.add(fixedReference);
      }
      fixedBeanBuilder.add(propertyName, fixedReferencesBuilder);
    }

    // Fixes the identities of a nested collection of beans
    private void fixContainedCollection(
      BeanChildDef beanChildDef,
      String propertyName,
      JsonArray unfixedChildBeans
    ) {
      if (unfixedChildBeans.isEmpty()) {
        // return the collection as-is
        return;
      }
      JsonArrayBuilder fixedChildBeansBuilder = Json.createArrayBuilder();
      for (int i = 0; i < unfixedChildBeans.size(); i++) {
        JsonObject unfixedChildBean = unfixedChildBeans.getJsonObject(i);
        Fixer childBeanFixer =
          new Fixer(beanChildDef.getChildTypeDef(), unfixedChildBean);
        fixedChildBeansBuilder.add(childBeanFixer.fixIdentities());
      }
      fixedBeanBuilder.add(
        propertyName,
        Json.createObjectBuilder().add(PROP_ITEMS, fixedChildBeansBuilder)
      );
    }

    // Fixes the identity of a nested singleton bean (doesn't matter if it's folded or optional)
    private void fixContainedSingleton(
      BeanChildDef beanChildDef,
      String propertyName,
      JsonValue unfixedChildBean
    ) {
      if (unfixedChildBean == JsonValue.NULL) {
        // return the singleton as-is
        return;
      }
      Fixer childBeanFixer =
        new Fixer(beanChildDef.getChildTypeDef(), unfixedChildBean.asJsonObject());
      fixedBeanBuilder.add(propertyName, childBeanFixer.fixIdentities());
    }

    private JsonArray fixIdentity(JsonArray unfixedIdentity) {
      return undelegatedIdentityToDelegatedIdentity(unfixedIdentity);
    }
  }
}
