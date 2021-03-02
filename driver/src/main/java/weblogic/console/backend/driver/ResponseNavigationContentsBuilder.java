// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.List;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;

import weblogic.console.backend.pagedesc.LocalizationUtils;
import weblogic.console.backend.pagedesc.Localizer;
import weblogic.console.backend.pagedesc.NavigationNodeSource;
import weblogic.console.backend.pagedesc.WeblogicPageSource;
import weblogic.console.backend.typedesc.WeblogicBeanProperty;
import weblogic.console.backend.utils.StringUtils;

/**
 * Fills in the navigation contents section of an RDJ based on
 * the path to the RDJ and the corresponding mbean type's
 * navigation.yaml file.
 * <p>
 * If the list isn't empty, then it adds the following to the RDJ:
 * <pre>
 * "navigation": [
 *   {} // a node for each navigation node in navigation.yaml
 * ]
 * </pre>
 * <p>
 * If the node's type is group, then the navigation node will be:
 * <pre>
 * {
 *   groupLabel: localized group name label,
 *   descriptionHTML: localized group description, omitted if not specified in navigation.yaml
 *   contents: [
 *     { ... } // a node for each navigation node in this group
 *   ]
 * }
 * </pre>
 * <p>
 * If the node's type is root, then the navigation node will be:
 * <pre>
 * {
 *   descriptionHTML: <localized root type's description>,
 *     // from navigation.yaml.  if not specified, then
 *     //  the root type's default slice's PDJ's introductionHTML is used instead
 *   identity: { ... } // the root type's default slice's identity,
 *     e.g.
 *     {
 *       perspective: monitoring,
 *       kind: root,
 *       path: [ { type: DomainRuntime, typeLabel: "Domain Runtime" } ]
 *     }
 * }
 * </pre>
 * <p>
 * If the node's type is beanProperty, and the property is a collection,
 * then the navigation node will be:
 * <pre>
 * {
 *   descriptionHTML: <localized root type's description>,
 *     // from navigation.yaml.  if not specified, then
 *     //  the collection's type's default slice's PDJ's introductionHTML is used instead
 *   identity: { ... } // the collection's identity,
 *     e.g.
 *     {
 *       perspective: configuration,
 *       kind: collection,
 *       path: [
 *         { type: Domain, typeLabel: Domain },
 *         { type: Server, typeLabel: Server, property: Servers, propertyLabel: Servers },
 *       ]
 *     }
 * }
 * </pre>
 * <p>
 * If the node's type is beanProperty, and the property is a singleton,
 * then the navigation node will be:
 * <pre>
 * {
 *   descriptionHTML: <localized root type's description>,
 *     // from navigation.yaml.  if not specified, then
 *     //  the singleton's default slice's PDJ's introductionHTML is used instead
 *   identity: { ... } // the singleton's identity,
 *     e.g.
 *     {
 *       perspective: configuration,
 *       kind: creatableOptionalSingleton,
 *       path: [
 *         { type: Domain, typeLabel: Domain },
 *         { type: Realm, typeLabel: Realm, property: Realms, propertyLabel: Realms, key: myrealm }
 *         { type: Adjudicator, typeLabel: Adjudicator, property: Adjudicator, propertyLabel: Adjudicator },
 *       ]
 *     }
 * }
 * </pre>
 * <p>
 * <pre>
 * Usage:
 *   JsonObjectBuilder rdjBuilder = ...
 *   (new ResponseNavigationContentsBuilder(rdjBuilder, ...).addNavigationContentsToResponse()
 * </pre>
 */
public class ResponseNavigationContentsBuilder {

  private static final Logger LOGGER =
    Logger.getLogger(ResponseNavigationContentsBuilder.class.getName());

  private Localizer localizer;

  private Localizer getLocalizer() {
    return this.localizer;
  }

  private JsonObjectBuilder responseBuilder;

  private JsonObjectBuilder getResponseBuilder() {
    return this.responseBuilder;
  }

  private WeblogicPageSource pageSource;

  private WeblogicPageSource getPageSource() {
    return this.pageSource;
  }

  private JsonObject pageBeanIdentity;

  private JsonObject getPageBeanIdentity() {
    return this.pageBeanIdentity;
  }

  /**
   * Constructor
   *
   * @param responseBuilder - the RDJ that the navigation contents will be added to
   *
   * @param pageSource - the RDJ's corresponding page definition
   * 
   * @param pageBeanIdentity - the RDJ's corresponding identity,
   *     i.e. the parent identity of the new navigation nodes' identities.
   * 
   * @param localizer - for localizing strings based on the domain's weblogic version and the
   *     client's preferred language
   */
  public ResponseNavigationContentsBuilder(
    JsonObjectBuilder responseBuilder,
    WeblogicPageSource pageSource,
    JsonObject pageBeanIdentity,
    Localizer localizer
  ) {
    this.localizer = localizer;
    this.responseBuilder = responseBuilder;
    this.pageSource = pageSource;
    this.pageBeanIdentity = pageBeanIdentity;
  }

  /**
   * Adds the nodes that correspond to this bean's navigation.yaml to the RDJ.
   * <p>
   * Each node includes static info (type, label, description) and dynamic info
   * (identity of the bean or collection).
   */
  public void addNavigationContentsToResponse() throws Exception {
    JsonArray navigationContents =
      createNavigationContents(getPageSource().getNavigationContents());
    if (navigationContents != null) {
      getResponseBuilder().add("navigation", navigationContents);
    }
  }

  /** Creates a list of navigation nodes and their children */
  private JsonArray createNavigationContents(
    List<NavigationNodeSource> navigationNodeSources
  ) throws Exception {
    if (navigationNodeSources.isEmpty()) {
      return null;
    }
    JsonArrayBuilder bldr = Json.createArrayBuilder();
    for (NavigationNodeSource navigationNodeSource : navigationNodeSources) {
      JsonObject node = createNavigationNode(navigationNodeSource);
      if (node != null) {
        bldr.add(node);
      } else {
        // this version of WLS doesn't support this node.  skip it.
      }
    }
    JsonArray navigationContents = bldr.build();
    return navigationContents.isEmpty() ? null : navigationContents;
  }

  /**
   * Creates a navigation node and its children's nodes (recursively)
   */
  private JsonObject createNavigationNode(
    NavigationNodeSource navigationNodeSource
  ) throws Exception {
    NavigationNodeSource.Type type = navigationNodeSource.getType();
    JsonObjectBuilder bldr = Json.createObjectBuilder();
    String descriptionHTML =
      getLocalizer().localizeString(
        LocalizationUtils.navigationNodeDescriptionHTMLKey(
          getPageSource().getType(),
          navigationNodeSource
        )
      );
    if (!StringUtils.isEmpty(descriptionHTML)) {
      bldr.add("descriptionHTML", descriptionHTML);
    }
    if (NavigationNodeSource.Type.group == type) {
      createGroupNavigationNode(bldr, navigationNodeSource);
    }
    if (NavigationNodeSource.Type.beanProperty == type) {
      if (!createBeanPropertyNavigationNode(bldr, navigationNodeSource)) {
        // this version of WLS doesn't support this property
        return null;
      }
    }
    if (NavigationNodeSource.Type.root == type) {
      createRootNavigationNode(bldr, navigationNodeSource);
    }
    JsonArray contents = createNavigationContents(navigationNodeSource.getContents());
    if (contents != null) {
      bldr.add("contents", contents);
    }
    return bldr.build();
  }

  // Create a group navigation node (minus its children nodes)
  private void createGroupNavigationNode(
    JsonObjectBuilder nodeBldr,
    NavigationNodeSource navigationNodeSource
  ) throws Exception {
    nodeBldr.add(
      "groupLabel",
      getLocalizer().localizeString(
        LocalizationUtils.navigationGroupLabelKey(navigationNodeSource)
      )
    );
  }

  // Create a root navigation node
  private void createRootNavigationNode(
    JsonObjectBuilder nodeBldr,
    NavigationNodeSource navigationNodeSource
  ) throws Exception {
    // Use this page's bean's identity (which should be the root identity for this perspective)
    nodeBldr.add("identity", getPageBeanIdentity());
  }

  // Create a bean property navigation node
  private boolean createBeanPropertyNavigationNode(
    JsonObjectBuilder nodeBldr,
    NavigationNodeSource navigationNodeSource
  ) throws Exception {
    // Find this node's property's definition
    WeblogicBeanProperty beanProp =
      getPageSource()
        .getType()
        .getProperty("createBeanPropertyNavigationNode", navigationNodeSource.getProperty());
    if (beanProp == null) {
      // This version of WLS doesn't support this property.
      return false;
    }

    // Set this node's identity to this page's bean's identity plus
    // the segment for this property.
    JsonObject beanPropIdentity =
      (new ResponseIdentityBuilder(getPageBeanIdentity(), getLocalizer()))
        .addProperty(beanProp)
        .build();

    // Use child bean property's identity
    nodeBldr.add("identity", beanPropIdentity);

    return true;
  }
}
