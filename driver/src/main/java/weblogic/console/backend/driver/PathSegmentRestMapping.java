// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import weblogic.console.backend.typedesc.WeblogicBeanProperty;
import weblogic.console.backend.typedesc.WeblogicBeanType;
import weblogic.console.backend.typedesc.WeblogicBeanTypes;
import weblogic.console.backend.utils.Path;

/**
 * Repackages static information about a bean path segment its type so that the RDS can
 * efficiently convert between RDJ REST requests and WLS REST requests.
 * <p>
 * Think of it as pre-computing some of the mapping between the page's CBE REST interface
 * and the underlying WLS REST interface and caching it.
 * <p>
 * There is a path segment for each mbean needed to populate the page.
 * The path segments are arranged in a tree, with nodes having pointers to their parents
 * so that you can walk either direction.
 * <p>
 * Each path segment also records the properties of its corresponding mbean type that
 * are needed to populate the page.
 * <p>
 * It holds the following static information about a path segment:
 * <ul>
 *   <li>
 *     pageRestMapping -
 *     a back pointer to the the page's PageRestMapping
 *   </li>
 *   <li>
 *     pathSegments -
 *     the list of path segments, starting at the root (domain mbean) to this path segment.
 *   </li>
 *   <li>
 *     unfoldedBeanPath -
 *     the list of WLS REST property names, starting at the domain mbean,
 *     to this path segment, e.g. <pre>[ servers, SSL]</pre>
 *   </li>
 *    <li>
 *      parent -
 *      this path segment's parent path segment
 *      (null for the domain's path segment)
 *   </li>
 *   <li>
 *     beanProperty -
 *     the WeblogicBeanProperty corresponding to this path segment
 *     (null for the domain's path segment)
 *   </li>
 *   <li>
 *     properties -
 *     the list of properties from this path segment that are displayed on the page
 *   </li>
 *   <li>
 *     subTypeProperties - used for heterogeneous collections.
 *     <p>
 *     maps a sub type discriminator value to the list of properties that sub type supports.
 *     <p>
 *     used for trimming out table cells that don't apply to the row, based on the row's type.
 *   </li>
 *   <li>
 *     options -
 *     the list of properties from this path segment that are used to compute options
 *     for reference properties that are displayed on this page.
 *   </li>
 *   <li>
 *     readParameterPlugins -
 *     the list of properties from this path segment that are used to compute arguments
 *     passed into read plugins for properties that are displayed on this page.
 *   </li>
 *   <li>
 *     children -
 *     the list of direct child path segments needed by this page the tree of
 *      bean path segments (i.e. mbeans) that are needed to populate the RDJ for this page
 *      starting at the domain mbean.
 *   </li>
 * </ul>
 */
public class PathSegmentRestMapping {

  private static final Logger LOGGER = Logger.getLogger(PathSegmentRestMapping.class.getName());

  private PageRestMapping pageRestMapping;

  public PageRestMapping getPageRestMapping() {
    return this.pageRestMapping;
  }

  private List<PathSegmentRestMapping> pathSegments;

  public List<PathSegmentRestMapping> getPathSegments() {
    return this.pathSegments;
  }

  private Path unfoldedBeanPath;

  public Path getUnfoldedBeanPath() {
    return this.unfoldedBeanPath;
  }

  private PathSegmentRestMapping parent;

  public PathSegmentRestMapping getParent() {
    return this.parent;
  }

  private WeblogicBeanProperty beanProperty;

  public WeblogicBeanProperty getBeanProperty() {
    return this.beanProperty;
  }

  private Map<String, PropertyRestMapping> restNameToPropertyMapping = new HashMap<>();
  private List<PropertyRestMapping> properties = new ArrayList<>();

  public List<PropertyRestMapping> getProperties() {
    return this.properties;
  }

  public void addProperty(PropertyRestMapping val) {
    getProperties().add(val);
    this.restNameToPropertyMapping.put(val.getBeanProperty().getRestName(), val);
  }

  public PropertyRestMapping findPropertyByRestName(String restName) {
    return this.restNameToPropertyMapping.get(restName);
  }

  private List<OptionsRestMapping> options = new ArrayList<>();

  public List<OptionsRestMapping> getOptions() {
    return this.options;
  }

  public void addOptions(OptionsRestMapping val) {
    getOptions().add(val);
  }

  private List<PluginBeanPropertyRestMapping> pluginBeanProperties = new ArrayList<>();

  public List<PluginBeanPropertyRestMapping> getPluginBeanProperties() {
    return this.pluginBeanProperties;
  }

  public void addPluginBeanProperty(PluginBeanPropertyRestMapping val) {
    getPluginBeanProperties().add(val);
  }

  private List<PathSegmentRestMapping> children = new ArrayList<>();

  public List<PathSegmentRestMapping> getChildren() {
    return this.children;
  }

  public void addChild(PathSegmentRestMapping val) {
    getChildren().add(val);
  }

  private Map<String, List<PropertyRestMapping>> subTypeDiscriminatorToProperties = new HashMap<>();

  public List<PropertyRestMapping> getSubTypeProperties(String subTypeDiscriminator) {
    LOGGER.finest("PathSegmentRestMapping getSubTypeProperties this=" + this);
    LOGGER.finest("PathSegmentRestMapping getSubTypeProperties disc=" + subTypeDiscriminator);
    LOGGER.finest(
        "PathSegmentRestMapping getSubTypeProperties props="
        + this.subTypeDiscriminatorToProperties.get(subTypeDiscriminator));
    return this.subTypeDiscriminatorToProperties.get(subTypeDiscriminator);
  }

  public void addSubType(String subTypeDiscriminator, List<PropertyRestMapping> properties) {
    this.subTypeDiscriminatorToProperties.put(subTypeDiscriminator, properties);
  }

  // i.e. the index of the component in foldedBeanPathWithIdentities
  // that holds the identiy for this path segment's bean
  // e.g.
  //   if folded bean path is
  //     [ Realms, AuthenticationProviders ]
  //   then the folded bean path with identities is
  //     [ Realms, myrealm, AuthenticationProviders, DefaultAuthenticator ]
  //   and the path segment rest mappings are:
  //     (root)                  : index = -1
  //     securityConfiguration   : index = -1
  //     realms                  : index =  1
  //     authenticationProviders : index =  3
  //   and [ Realms, myrealm, AuthenticationProviders, default]
  private int identityIndex = -1;

  public int getIdentityIndex() {
    return this.identityIndex;
  }

  // for the root path (i.e. domain level)
  public PathSegmentRestMapping(PageRestMapping pageRestMapping) throws Exception {
    this(pageRestMapping, null, null);
  }

  // for child paths (e.g. domain -> Servers)
  public PathSegmentRestMapping(
    PathSegmentRestMapping parent,
    WeblogicBeanProperty beanProperty
  ) throws Exception {
    this(parent.getPageRestMapping(), parent, beanProperty);
  }

  private PathSegmentRestMapping(
    PageRestMapping pageRestMapping,
    PathSegmentRestMapping parent,
    WeblogicBeanProperty beanProperty
  ) throws Exception {
    this.pageRestMapping = pageRestMapping;
    this.parent = parent;
    this.beanProperty = beanProperty;
    if (isRoot()) {
      this.unfoldedBeanPath = new Path();
      this.pathSegments = new ArrayList<>();
    } else {
      getParent().addChild(this);
      this.pathSegments = new ArrayList<>(getParent().getPathSegments());
      this.pathSegments.add(this);
      this.unfoldedBeanPath =
        getParent().getUnfoldedBeanPath().childPath(getBeanProperty().getRestName());
      this.identityIndex = getParent().getIdentityIndex();
      if (!getBeanProperty().isFoldableContainedSingleton()) {
        // this property appears in the folded bean path - skip over it to get to the next property
        // or identity
        this.identityIndex++;
        if (getBeanProperty().isContainedCollection()) {
          // this property is a collection - the next element is the identity
          this.identityIndex++;
        }
      }
    }
    LOGGER.finest("new " + this);
  }

  public boolean isRoot() {
    return getParent() == null;
  }

  public PathSegmentRestMapping getRoot() {
    return (isRoot()) ? this : getParent().getRoot();
  }

  public WeblogicBeanTypes getBeanTypes() throws Exception {
    return getPageRestMapping().getPageSource().getType().getTypes();
  }

  public WeblogicBeanType getBeanType() throws Exception {
    if (isRoot()) {
      return
        getPageRestMapping()
          .getPageSource()
          .getPagePath()
          .getPagesPath()
          .getPerspectivePath()
          .getRootBeanType();
    } else {
      return getBeanProperty().getBeanType();
    }
  }

  public PathSegmentRestMapping getFoldedSegment() throws Exception {
    if (isRoot() || !getBeanProperty().isFoldableContainedSingleton()) {
      return this;
    }
    return getParent().getFoldedSegment();
  }

  public PathSegmentRestMapping getParentFoldedSegment() throws Exception {
    PathSegmentRestMapping foldedSegment = getFoldedSegment();
    return (foldedSegment.isRoot()) ? null : foldedSegment.getParent().getFoldedSegment();
  }

  @Override
  public String toString() {
    try {
      StringBuilder sb = new StringBuilder();
      sb
        .append("PathSegmentRestMapping(")
        .append("mapping=")
        .append(getPageRestMapping())
        .append(", path=")
        .append(getUnfoldedBeanPath().getDotSeparatedPath())
        .append(", type=")
        .append(getBeanType().getName())
        .append(", identityIndex=")
        .append(getIdentityIndex())
        .append(")");
      return sb.toString();
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }
}
