// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.Map;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonValue;

import weblogic.console.backend.typedesc.WeblogicBeanProperty;
import weblogic.console.backend.typedesc.WeblogicBeanType;
import weblogic.console.backend.typedesc.WeblogicBeanTypes;

/**
 * Abstract base class for Implementations of the WeblogicRuntimeSPI interface.
 * <p>
 * Maintains the common code for handling WLS runtime tree query responses. See
 * weblogic.console.backend.driver.wlsrest.WeblogicRestRuntime for more information.
 */
public abstract class AbstractWeblogicRuntime {

  private static final Logger LOGGER = Logger.getLogger(AbstractWeblogicRuntime.class.getName());

  protected static final String PROP_IDENTITY = "identity";
  protected static final String PROP_CHILDREN = "children";
  protected static final String PROP_FIELDS = "fields";
  protected static final String PROP_ITEMS = "items";
  protected static final String PROP_NAME = "name";
  protected static final String PROP_TYPE = "type";
  protected static final String PROP_SERVER_RUNTIMES = "serverRuntimes";

  private WeblogicBeanTypes weblogicBeanTypes;

  protected WeblogicBeanTypes getWeblogicBeanTypes() {
    return this.weblogicBeanTypes;
  }

  protected AbstractWeblogicRuntime(WeblogicBeanTypes weblogicBeanTypes) {
    this.weblogicBeanTypes = weblogicBeanTypes;
  }

  /**
   * The identities (of objects and references) returned from WLS REST have problems:
   * <ul>
   *   <li>
   *     If the identity (containment or reference) is for a bean under server runtime, the
   *     identity is relative to that server's runtime bean tree, e.g.:
   *     <p>domainRuntime/serverRuntimes/ManagedServer1/clusterRuntime's identity will be:
   *     <pre>[ clusterRuntime ]</pre>
   *     i.e. relative to ManagedServer1's runtime bean tree
   *     <p>
   *     This code converts adds serverRuntimes and the server's name to all of the identities
   *     under that serverRuntime to make them relative to the domainRuntime, e.g.:
   *     <pre>[ serverRuntimes, ManagedServer1, clusterRuntime ]</pre>
   *   </li>
   *   <li>
   *     Some of the mbean.java files are missing annotations to say that bean properties
   *     are references. This causes the WLS REST api to assume they're contained beans.
   *     So now you can have multiple containment paths to the same bean -
   *     one from its real parent, and one or more from beans that reference it.
   *     <p>
   *     The first time a client uses the WLST REST api to walk to the bean, WLS REST
   *     computes the bean's identity and caches it in the bean tree.  Subsequent calls
   *     to fetch the same bean will eturn the cached identity regardless of the url used
   *     to get to it.
   *     <p>
   *     If the first url used to fetch the bean is from it's real parent, then its identity
   *     will be correct. But, if the first url is from a bean that references it, then the
   *     identity will be incorrect.
   *   </li>
   * </ul>
   * As a work around, this code walks to response and constructs an identity based on the
   * nesting in the returned json. i.e. it makes it look like there's a separate bean for
   * each path to the bean.  e.g.:
   * <p>
   * if the response looks like:
   * <p>
   * <pre>
   * {
   *   a: {
   *     identity: [ a, a1 ],
   *     name: a1,
   *     b: {
   *       name: b1,
   *       identity: [ a, a1, b, b1 ] // i.e. containment
   *     }
   *   },
   *   c: {
   *     name: c1,
   *     d: {
   *       name: b1,
   *       identity: [ a, a1, b, b1 ] // i.e. a reference
   *     }
   *   }
   *  }
   * </pre>
   * <p>
   * it will be converted to:
   * <p>
   * <pre>
   * {
   *   a: {
   *     identity: [ a, a1 ],
   *     name: a1,
   *     b: {
   *       name: b1,
   *       identity: [ a, a1, b, b1 ] // i.e. containment
   *     }
   *   },
   *   c: {
   *     name: c1,
   *     d: {
   *       name: b1,
   *       identity: [ c, c1, d, d1 ] // i.e. mock containment
   *     }
   *   }
   * }
   * </pre>
   * <p>
   * Also, it checks whether the computed identity is the same as the one that WLS REST returned.
   * If not, it logs it (to help us come up with a list of mbean reference properties that
   * need to be fixed in WLS).
   */
  protected JsonObject fixServerRuntimes(JsonObject unfixedSlice) throws Exception {
    return (new Fixer(unfixedSlice)).fixIdentities();
  }

  /**
   * This class fixes the server runtime identities in a WLS runtime mbean REST response.
   * <p>
   * It also discards all server runtimes that the WLS REST api  wasn't able to connect to, e.g.
   * { "httpStatus": 504, "name": "c1_server2", "identity": [] }
   */
  private class Fixer {

    // whether this is a server runtime mbean that should be ignored because
    // the WLS REST api wasn't able to connect to it
    private boolean ignore;

    private boolean isIgnore() {
      return this.ignore;
    }

    // The bean type of this bean
    private WeblogicBeanType beanType;

    private WeblogicBeanType getBeanType() {
      return this.beanType;
    }

    // The unfixed json for this bean
    private JsonObject unfixedBean;

    private JsonObject getUnfixedBean() {
      return this.unfixedBean;
    }

    // The fixed json for this bean
    private JsonObjectBuilder fixedBeanBuilder;

    private JsonObjectBuilder getFixedBeanBuilder() {
      return this.fixedBeanBuilder;
    }

    // The fixed identity for this bean
    private JsonArray fixedIdentity;

    private JsonArray getFixedIdentity() {
      return this.fixedIdentity;
    }

    // The containment path to this bean in the WLS REST response
    // (property name + type pairs).
    // Used for reporting when the computed identity doesn't match
    // the identity from the WLS REST response.
    private String typedPath;

    private String getTypedPath() {
      return this.typedPath;
    }

    // The name of the server runtime mbean that parents this bean
    // in the WLS REST response.  Null if this bean is not
    // a server runtime mbean or a child of one.
    // Used for adding "serverRuntimes" and <serverName> to
    // identities and references in the server runtime tree to make
    // them domain runtime tree relative.
    private String serverName;

    private String getServerName() {
      return this.serverName;
    }

    // Create a Fixer for the root bean in the query response
    // (i.e. the DomainRuntimeMBean)
    private Fixer(JsonObject unfixedRootBean) throws Exception {
      this.unfixedBean = unfixedRootBean;
      this.fixedBeanBuilder = Json.createObjectBuilder(getUnfixedBean());
      this.beanType = getWeblogicBeanTypes().getDomainRuntimeMBeanType();
      this.fixedIdentity = Json.createArrayBuilder().build(); // empty array
      this.typedPath = "[ type=domainRuntime ]";
    }

    // Create an Fixer for a nested bean in the query response.
    private Fixer(

      // This bean's parent bean
      Fixer parent,

      // This bean's WeblogicBeanProperty (which describes the bean)
      WeblogicBeanProperty beanProp,

      // The unfixed json for this bean in the WLS REST response
      JsonObject unfixedBean
    ) throws Exception {
      String propRestName = beanProp.getRestName();
      boolean isServerRuntime = PROP_SERVER_RUNTIMES.equals(propRestName);

      if (isServerRuntime && unfixedBean.containsKey("httpStatus")) {
        // The WLS REST api wasn't able to connect to this server.
        // Omit it from the response.
        this.ignore = true;
        LOGGER.finest("Ignoring " + propRestName + " " + unfixedBean);
        return;
      }

      this.unfixedBean = unfixedBean;
      this.fixedBeanBuilder = Json.createObjectBuilder(getUnfixedBean());

      // Get this bean's name & type from the WLS REST response.
      // They should always be present since the corresponding
      // query should have said to include them.
      String name = unfixedBean.getString(PROP_NAME);
      String type = unfixedBean.getString(PROP_TYPE);

      // Lookup WeblogicBeanType for this bean based on its type
      // in the WLS REST response.
      this.beanType = getWeblogicBeanTypes().getType(type + "MBean");

      // Compute this bean's identity.
      JsonArrayBuilder fixedIdentityBuilder =
        Json.createArrayBuilder(parent.getFixedIdentity()).add(propRestName);
      if (beanProp.isContainedCollection()) {
        fixedIdentityBuilder.add(name);
      }
      this.fixedIdentity = fixedIdentityBuilder.build();

      // Figure out whether this bean is a server runtime mbean or a child of one
      if (isServerRuntime) {
        this.serverName = name;
      } else {
        this.serverName = parent.getServerName();
      }

      // Record the containment path to this property in case we need
      // to report that its computed identity doesn't match the one
      // returned from WLS
      this.typedPath = parent.getTypedPath() + " [ prop=" + propRestName + " type=" + type + " ]";
    }

    // Create a new json object for this bean with correct identities and references
    // - uses the computed containment identities instead of the ones from WLS
    // - adds "serverRuntimes" and the server name if this bean is a server runtime mbean
    //   or a child of one
    private JsonObject fixIdentities() throws Exception {
      for (Map.Entry<String, JsonValue> unfixedBeanProperty : getUnfixedBean().entrySet()) {
        String propertyName = unfixedBeanProperty.getKey();
        if (PROP_IDENTITY.equals(propertyName)) {
          fixIdentityProperty(unfixedBeanProperty.getValue().asJsonArray());
        } else {
          fixNonIdentityProperty(propertyName, unfixedBeanProperty.getValue());
        }
      }
      return getFixedBeanBuilder().build();
    }

    // Fixes the identity for this bean.
    // If it doesn't match the one returned from WLS, it logs the mismatch.
    // This can be used to help find problems in the underlying WLS runtime mbeans,
    // i.e. ones that are not properly tagging properties as references.
    private void fixIdentityProperty(JsonArray unfixedIdentity) throws Exception {
      JsonArray fixedIdentity = getFixedIdentity();
      if (getServerName() != null) {
        unfixedIdentity = serverRuntimeIdentityToDomainRuntimeIdentity(unfixedIdentity);
      }
      if (!fixedIdentity.toString().equals(unfixedIdentity.toString())) {
        LOGGER.fine(
          "Unexpected identity.  path: "
            + getTypedPath()
            + " expected: "
            + fixedIdentity
            + " have:"
            + unfixedIdentity
        );
      }
      getFixedBeanBuilder().add(PROP_IDENTITY, fixedIdentity);
    }

    // Fixes the identities for all of the non-identity properites for this bean.
    private void fixNonIdentityProperty(
      String propertyName,
      JsonValue unfixedPropertyValue
    ) throws Exception {
      WeblogicBeanProperty beanProp = getBeanType().getPropertyFromRestName(propertyName);
      if (beanProp.isReference()) {
        fixReferenceProperty(beanProp, unfixedPropertyValue);
      } else if (beanProp.isReferences()) {
        fixReferencesProperty(beanProp, unfixedPropertyValue.asJsonArray());
      } else if (beanProp.isContainedCollection()) {
        fixContainedCollection(
            beanProp, unfixedPropertyValue.asJsonObject().getJsonArray(PROP_ITEMS));
      } else if (beanProp.isContainedSingleton()) {
        fixContainedSingleton(beanProp, unfixedPropertyValue);
      } else {
        // return the property value as-is
      }
    }

    // Fixes the identity of a reference property
    // Accepts the reference as-is then adds server runtime info to it if needed.
    private void fixReferenceProperty(
      WeblogicBeanProperty beanProp,
      JsonValue unfixedReference
    ) throws Exception {
      if (unfixedReference == JsonValue.NULL || getServerName() == null) {
        // return the reference as-is
        return;
      }
      getFixedBeanBuilder()
        .add(
          beanProp.getRestName(),
          serverRuntimeIdentityToDomainRuntimeIdentity(
            unfixedReference.asJsonArray()
          )
        );
    }

    // Fixes the identity of an array of references property
    // Accepts the references as-is then adds server runtime info to them if needed.
    private void fixReferencesProperty(
      WeblogicBeanProperty beanProp,
      JsonArray unfixedReferences
    ) throws Exception {
      if (unfixedReferences.isEmpty() || getServerName() == null) {
        // return the references as-is
        return;
      }
      JsonArrayBuilder fixedReferencesBuilder = Json.createArrayBuilder();
      for (int i = 0; i < unfixedReferences.size(); i++) {
        JsonValue unfixedReference = unfixedReferences.getJsonObject(i).get(PROP_IDENTITY);
        JsonValue fixedReference =
          (unfixedReference != JsonValue.NULL)
          ? serverRuntimeIdentityToDomainRuntimeIdentity(unfixedReference.asJsonArray())
          : JsonValue.NULL;
        fixedReferencesBuilder.add(fixedReference);
      }
      getFixedBeanBuilder().add(beanProp.getRestName(), fixedReferencesBuilder);
    }

    // Fixes the identities of a nested collection of beans
    private void fixContainedCollection(
      WeblogicBeanProperty collectionBeanProp,
      JsonArray unfixedChildBeans
    ) throws Exception {
      if (unfixedChildBeans.isEmpty()) {
        // return the collection as-is
        return;
      }
      JsonArrayBuilder fixedChildBeansBuilder = Json.createArrayBuilder();
      for (int i = 0; i < unfixedChildBeans.size(); i++) {
        JsonObject unfixedChildBean = unfixedChildBeans.getJsonObject(i);
        Fixer childBeanFixer =
          new Fixer(this, collectionBeanProp, unfixedChildBean);
        if (!childBeanFixer.isIgnore()) {
          fixedChildBeansBuilder.add(childBeanFixer.fixIdentities());
        }
      }
      getFixedBeanBuilder()
        .add(
          collectionBeanProp.getRestName(),
          Json.createObjectBuilder().add(PROP_ITEMS, fixedChildBeansBuilder)
        );
    }

    // Fixes the identity of a nested singleton bean (doesn't matter if it's folded or optional)
    private void fixContainedSingleton(
      WeblogicBeanProperty singletonBeanProp,
      JsonValue unfixedChildBean
    ) throws Exception {
      if (unfixedChildBean == JsonValue.NULL) {
        // return the singleton as-is
        return;
      }
      Fixer childBeanFixer =
        new Fixer(this, singletonBeanProp, unfixedChildBean.asJsonObject());
      if (!childBeanFixer.isIgnore()) {
        getFixedBeanBuilder().add(singletonBeanProp.getRestName(), childBeanFixer.fixIdentities());
      }
    }

    // Converts a server runtime relative identity, e.g.
    //   [ "clusterRuntime" ],
    // to a domain runtime relative identity, e.g.
    //   [ "serverRuntimes", "AdminServer", "clusterRuntime "]
    private JsonArray serverRuntimeIdentityToDomainRuntimeIdentity(
      JsonArray serverRuntimeIdentity
    ) {
      JsonArrayBuilder domainRuntimeIdentityBuilder =
        Json.createArrayBuilder().add("serverRuntimes").add(getServerName());
      for (int i = 0; i < serverRuntimeIdentity.size(); i++) {
        domainRuntimeIdentityBuilder.add(serverRuntimeIdentity.get(i));
      }
      return domainRuntimeIdentityBuilder.build();
    }
  }
}
