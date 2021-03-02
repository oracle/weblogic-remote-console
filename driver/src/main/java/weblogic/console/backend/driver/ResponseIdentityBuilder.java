// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;

import weblogic.console.backend.pagedesc.LocalizationUtils;
import weblogic.console.backend.pagedesc.Localizer;
import weblogic.console.backend.pagedesc.PerspectivePath;
import weblogic.console.backend.typedesc.WeblogicBeanProperty;
import weblogic.console.backend.typedesc.WeblogicBeanType;
import weblogic.console.backend.utils.Path;
import weblogic.console.backend.utils.StringUtils;

/**
 * Builds an identity that can be included in an RDJ response.
 * <p>
 * An identity fully identifies a page in the backend. It includes:
 * <ul>
 *   <li>
 *     the perspective
 *   </li>
 *   <li>
 *     the kind of page
 *     (root, collection, collectionChild, creatableOptionalSingleton, nonCreatableOptionalSingleton)
 *   </li>
 *   <li>
 *     the path in that perspective's folded bean tree to the collection or bean
 *   </li>
 *   <li>
 *     the bean's slice (omitted for collections, optional for beans.
 *     if not present, then use the default slice)
 *   </li>
 * </ul>
 * <p>
 * The path is an array, starting with the root bean of the perspective, of path segments.
 * <p>
 * The first segment, which identities the root bean, has the bean's type and type label, e.g.
 * <pre>[ { type: DomainRuntime, typeLabel: "Domain Runtime "} ]</pre>
 * <p>
 * The rest of the segments list the folded bean properties to get to the bean or collection.
 * Each one specifies the bean property (and property label) and bean type (and type label).
 * Also, it specifies a key when it needs to identify a particular bean in a collection.
 * <p>
 * The identity contains everything the CFE needs to compute a page's RDJ url,
 * and to label a link (e.g. in the nav tree, shopping cart or breadcrumb) to that RDJ.
 * <p>
 * Here are some examples:
 * <p>
 * example 1: monitoring root bean:
 * <pre>
 * {
 *   perspective: monitoring,
 *   kind: root,
 *   path: [
 *     { type: DomainRuntime, typeLabel: "Domain Runtime" }
 *   ]
 * }
 * </pre>
 * <p>
 * The corresponding RDJ URL is api/monitoring/data/DomainRuntime
 * The corresponding label in the nav tree is "Domain Runtime"
 * <p>
 * example 2: configuration servers collection
 * <pre>
 * {
 *   perspective: configuration,
 *   kind: collection,
 *   path: [
 *     { type: Domain, typeLabel: Domain },
 *     { type: Server, typeLabel: Server, property: Servers, propertyLabel: Servers }
 *   ]
 * }
 * </pre>
 * <p>
 * The corresponding RDJ URL is api/configuration/data/Domain/Servers
 * The corresponding label in the nav tree is Servers
 * <p>
 * example 3: configuration specific server
 * <pre>
 * {
 *   perspective: configuration,
 *   kind: collectionChild,
 *   path: [
 *     { type: Domain, typeLabel: Domain },
 *     { type: Server, typeLabel: Server, property: Servers, propertyLabel: Servers, key: AdminServer }
 *   ]
 * }
 * </pre>
 * <p>
 * The corresponding RDJ URL is api/configuration/data/Domain/Servers/AdminServer
 * The corresponding label in the nav tree is AdminServer
 * <p>
 * example 4: configuration myrealm's adjudicator
 * <pre>
 * {
 *   perspective: configuration,
 *   kind: creatableOptionalSingleton,
 *   path: [
 *     { type: Domain, typeLabel: Domain },
 *     { type: Realm, typeLabel: Realm, property: Realms, propertyLabel: Realms, key: myrealm }
 *     { type: Adjudicator, typeLabel: Adjudicator, property: Adjudicator, propertyLabel: Adjudicator }
 *   ]
 * }
 * </pre>
 * <p>
 * The corresponding RDJ URL is api/configuration/data/Domain/Realms/myrealm/Adjudicator
 * The corresponding label in the nav tree is Adjudicator
 * <p>
 * Usage
 * <p>
 * pattern 1: create an identity for a perspective's root bean
 * <pre>
 *   JsonObject identity =
 *     (new ResponseIdentityBuilder(perspective, localizer))
 *       .build()
 * </pre>
 * <p>
 * pattern 2: create an identity for a collection
 * <pre>
 *   WeblogicBeanProperty collectionProp = ...
 *   JsonObject parentIdentity = ...
 *   JsonObject identity =
 *     (new ResponseIdentityBuilder(parentIdentity, localizer))
 *     .addProperty(collectionProp)
 *     .build()
 * </pre>
 * <p>
 * pattern 3: create an identity for a collection child
 * <pre>
 *   WeblogicBeanProperty collectionProp = ...
 *   String childName = ...
 *   JsonObject parentIdentity = ...
 *   JsonObject identity =
 *     (new ResponseIdentityBuilder(parentIdentity, localizer))
 *     .addProperty(collectionProp, childName)
 *     .build()
 * </pre>
 * <p>
 * pattern 4: create an identity for an optional singleton
 * <pre>
 *   WeblogicBeanProperty singletonProp = ...
 *   JsonObject parentIdentity = ...
 *   JsonObject identity =
 *     (new ResponseIdentityBuilder(parentIdentity, localizer))
 *     .addProperty(singletonProp)
 *     .build()
 * </pre>
 */
public class ResponseIdentityBuilder {

  private static final Logger LOGGER = Logger.getLogger(ResponseIdentityBuilder.class.getName());

  private Localizer localizer;

  private Localizer getLocalizer() {
    return this.localizer;
  }

  private JsonObjectBuilder identityBuilder;

  private JsonObjectBuilder getIdentityBuilder() {
    return this.identityBuilder;
  }

  private JsonArrayBuilder pathBuilder;

  private JsonArrayBuilder getPathBuilder() {
    return this.pathBuilder;
  }

  /**
   * Create a ResponseIdentityBuilder for a perspective.
   * It starts building at perspective's root bean.
   */
  public ResponseIdentityBuilder(
    PerspectivePath perspectivePath,
    Localizer localizer
  ) throws Exception {
    this.localizer = localizer;
    this.identityBuilder = Json.createObjectBuilder();
    this.pathBuilder = Json.createArrayBuilder();
    getIdentityBuilder().add("perspective", perspectivePath.getPerspective());
    getIdentityBuilder().add("kind", "root");
    getPathBuilder().add(createSegmentBuilder(perspectivePath.getRootBeanType()));
  }

  /** Create a ResponseIdentityBuilder that starts building beneath an existing identity. */
  public ResponseIdentityBuilder(JsonObject parentIdentity, Localizer localizer) {
    this.localizer = localizer;
    this.identityBuilder = Json.createObjectBuilder(parentIdentity);
    this.pathBuilder = Json.createArrayBuilder(parentIdentity.getJsonArray("path"));
  }

  /**
   * Adds a path segment for a bean property to this identity.
   * Property must be a contained collection or a singleton.
   */
  public ResponseIdentityBuilder addProperty(WeblogicBeanProperty beanProp) throws Exception {
    String kind = null;
    if (beanProp.isContainedCollection()) {
      kind = "collection";
    } else if (beanProp.isCreatableContainedOptionalSingleton()) {
      kind = "creatableOptionalSingleton";
    } else if (beanProp.isNonCreatableContainedOptionalSingleton()) {
      kind = "nonCreatableOptionalSingleton";
    } else {
      throw
        new AssertionError(
          "Property is not a contained collection or contained optional singleton: "
          + beanProp
        );
    }
    getIdentityBuilder().add("kind", kind);
    getPathBuilder().add(createSegmentBuilder(beanProp));
    return this;
  }

  /**
   * Adds a path segment for a collection child to this identity.
   * Property must be a cvontained collection and key must be
   * the value of this bean's key property (typically its Name property)
   */
  public ResponseIdentityBuilder addProperty(
    WeblogicBeanProperty beanProp,
    String key
  ) throws Exception {
    if (!beanProp.isContainedCollection()) {
      throw new AssertionError("beanProp must be a contained collection: " + beanProp);
    }
    getIdentityBuilder().add("kind", "collectionChild");
    JsonObjectBuilder segmentBuilder = createSegmentBuilder(beanProp);
    segmentBuilder.add("key", key);
    getPathBuilder().add(segmentBuilder);
    return this;
  }

  private JsonObjectBuilder createSegmentBuilder(WeblogicBeanProperty prop) throws Exception {
    return
      createSegmentBuilder(prop.getBeanType())
        .add("property", prop.getName())
        .add(
          "propertyLabel",
          getLocalizer().localizeString(
            LocalizationUtils.propertyIdentityLabelKey(prop)
          )
        );
  }

  private JsonObjectBuilder createSegmentBuilder(WeblogicBeanType type) throws Exception {
    return
      Json.createObjectBuilder()
        .add("type", StringUtils.getSimpleTypeName(type.getName()))
        .add(
          "typeLabel",
          getLocalizer().localizeString(
            LocalizationUtils.typeIdentityLabelKey(type)
          )
        );
  }

  public ResponseIdentityBuilder setSlice(Path slice) {
    if (slice == null || slice.isEmpty()) {
      getIdentityBuilder().remove("slice");
    } else {
      getIdentityBuilder().add("slice", slice.getDotSeparatedPath());
    }
    return this;
  }

  public JsonObject build() {
    getIdentityBuilder().add("path", getPathBuilder());
    return getIdentityBuilder().build();
  }
}
