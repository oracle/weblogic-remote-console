// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.typedesc;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import weblogic.console.backend.utils.Path;

/**
 * This class identitifies a Weblogic bean.
 * <p>
 * It translates between the folded bean paths that the CFE uses and the unfolded bean paths that
 * the weblogic configuration uses, and also breaks the identity down into a list of segments, where
 * each segment is is connected to a corresponding WeblogicBeanProperty.
 */
public class WeblogicBeanIdentity {

  private static final Logger LOGGER = Logger.getLogger(WeblogicBeanIdentity.class.getName());

  private WeblogicBeanType rootType;

  public WeblogicBeanType getRootType() {
    return this.rootType;
  }

  private Path foldedBeanPathWithIdentities = new Path();

  public Path getFoldedBeanPathWithIdentities() {
    return this.foldedBeanPathWithIdentities;
  }

  private Path foldedBeanPathWithoutIdentities = new Path();

  public Path getFoldedBeanPathWithoutIdentities() {
    return this.foldedBeanPathWithoutIdentities;
  }

  private Path unfoldedBeanPathWithIdentities = new Path();

  public Path getUnfoldedBeanPathWithIdentities() {
    return this.unfoldedBeanPathWithIdentities;
  }

  private Path unfoldedBeanPathWithoutIdentities = new Path();

  public Path getUnfoldedBeanPathWithoutIdentities() {
    return this.unfoldedBeanPathWithoutIdentities;
  }

  private List<String> identities = new ArrayList<>();

  public List<String> getIdentities() {
    return this.identities;
  }

  private List<WeblogicBeanIdentitySegment> segments = new ArrayList<>();

  public List<WeblogicBeanIdentitySegment> getSegments() {
    return this.segments;
  }

  public WeblogicBeanIdentity(WeblogicBeanType rootType) {
    this.rootType = rootType;
  }

  public void addFoldedBeanPathWithIdentities(Path foldedBeanPathWithIdentities) throws Exception {
    addBeanPathWithIdentities(foldedBeanPathWithIdentities, true);
  }

  public void addUnfoldedBeanPathWithIdentities(Path unfoldedBeanPathWithIdentities)
      throws Exception {
    addBeanPathWithIdentities(unfoldedBeanPathWithIdentities, false);
  }

  private void addBeanPathWithIdentities(
    Path beanPathWithIdentities,
    boolean folded
  ) throws Exception {
    WeblogicBeanProperty collectionProperty = null;
    for (String component : beanPathWithIdentities.getComponents()) {
      if (collectionProperty != null) {
        // the current component identifies an instance in a collection. record it.
        addSegment(collectionProperty, component);
        collectionProperty = null;
      } else {
        // the current component identifies a folded bean property
        String propName = component;

        // find the property
        WeblogicBeanProperty prop =
          folded
          ? getBeanType().getProperty("getIdentity", propName)
          : getBeanType().getLocalPropertyByPropertyRestName("getIdentity", propName);

        // add this property's unfolded bean path's properties to the segments
        if (folded) {
          if (prop == null) {
            throw new AssertionError(
              "Unknown folded property"
              + " beanPathWithIdentities:" + beanPathWithIdentities
              + " folded=" + folded
              + " propName: " + propName
            );
          }
          for (String unfoldedPropName : prop.getUnfoldedBeanPath().getComponents()) {
            WeblogicBeanProperty unfoldedProp =
              getBeanType()
              .getLocalPropertyByBeanPropertyName(
                "getWeblogicConfigBeanIdentity",
                unfoldedPropName
              );
            addSegment(unfoldedProp);
          }
        }

        if (prop.isContainedCollection()) {
          // remember that we're processing a collection,
          // i.e. the next component should be a bean instance name
          collectionProperty = prop;
        } else {
          // add this singleton to the segments
          addSegment(prop);
        }
      }
    }
    if (collectionProperty != null) {
      // the last segment is a collection. add it.
      addSegment(collectionProperty);
    }
  }

  private WeblogicBeanIdentitySegment addSegment(WeblogicBeanProperty property, String key)
      throws Exception {
    return addSegment(new WeblogicBeanIdentitySegment(this, property, key));
  }

  private WeblogicBeanIdentitySegment addSegment(WeblogicBeanProperty property) throws Exception {
    return addSegment(new WeblogicBeanIdentitySegment(this, property));
  }

  private WeblogicBeanIdentitySegment addSegment(WeblogicBeanIdentitySegment segment)
      throws Exception {
    WeblogicBeanProperty property = segment.getProperty();

    // add the property's rest name (e.g. listenAddress) to the unfolded paths
    String restName = property.getRestName();
    getUnfoldedBeanPathWithIdentities().addComponent(restName);
    getUnfoldedBeanPathWithoutIdentities().addComponent(restName);

    // add the property's CFE name (e.g. ListenAddress) to the folded paths
    String propName = property.getName();
    if (!property.isFoldableContainedSingleton()) {
      getFoldedBeanPathWithIdentities().addComponent(propName);
      getFoldedBeanPathWithoutIdentities().addComponent(propName);
    }

    // add the collection child's key to the paths with identities
    // and to the list of identities
    if (property.isContainedCollection()) {
      String key = segment.getKey();
      if (key != null) {
        getUnfoldedBeanPathWithIdentities().addComponent(key);
        getFoldedBeanPathWithIdentities().addComponent(key);
        this.identities.add(key);
      }
    }

    // record the segment and return it
    this.segments.add(segment);
    return segment;
  }

  public boolean isRoot() {
    return getLastSegment() == null;
  }

  public boolean isAlwaysExistsFoldedSingleton() {
    return isRoot() ? false : getLastSegment().isAlwaysExistsFoldedSingleton();
  }

  public boolean isCreatableOptionalFoldedSingleton() {
    return isRoot() ? false : getLastSegment().isCreatableOptionalFoldedSingleton();
  }

  public boolean isNonCreatableOptionalFoldedSingleton() {
    return isRoot() ? false : getLastSegment().isNonCreatableOptionalFoldedSingleton();
  }

  public boolean isCreatableOptionalUnfoldedSingleton() {
    return isRoot() ? false : getLastSegment().isCreatableOptionalUnfoldedSingleton();
  }

  public boolean isNonCreatableOptionalUnfoldedSingleton() {
    return isRoot() ? false : getLastSegment().isNonCreatableOptionalUnfoldedSingleton();
  }

  public boolean isCollection() {
    return isRoot() ? false : getLastSegment().isCollection();
  }

  public boolean isCollectionChild() {
    return isRoot() ? false : getLastSegment().isCollectionChild();
  }

  public boolean isOptionalFoldedSingleton() {
    return isRoot() ? false : getLastSegment().isOptionalFoldedSingleton();
  }

  public boolean isOptionalUnfoldedSingleton() {
    return isRoot() ? false : getLastSegment().isOptionalUnfoldedSingleton();
  }

  public boolean isOptionalSingleton() {
    return isRoot() ? false : getLastSegment().isOptionalSingleton();
  }

  public boolean isFoldedSingleton() {
    return isRoot() ? false : getLastSegment().isFoldedSingleton();
  }

  public WeblogicBeanType getBeanType() {
    return isRoot() ? getRootType() : getLastSegment().getBeanType();
  }

  public WeblogicBeanIdentitySegment getLastSegment() {
    return this.segments.isEmpty() ? null : this.segments.get(this.segments.size() - 1);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("rootType=<" + getRootType() + ">");
    if (!isRoot()) {
      sb.append(",segments=<" + getSegments() + ">");
    }
    return sb.toString();
  }
}
