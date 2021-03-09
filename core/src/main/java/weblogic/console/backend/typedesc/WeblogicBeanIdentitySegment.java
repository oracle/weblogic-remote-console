// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.typedesc;

import java.util.logging.Logger;

/**
 * This class represents a segment of a weblogic bean's identity, i.e. the unfolded
 * WeblogicBeanProperty of the parent bean that contains this bean, and an optional key
 * (i.e. if this bean is a contained collection child)
 */
public class WeblogicBeanIdentitySegment {

  private enum SegmentType {
    AlwaysExistsFoldedSingleton,
    CreatableOptionalFoldedSingleton,
    NonCreatableOptionalFoldedSingleton,
    CreatableOptionalUnfoldedSingleton,
    NonCreatableOptionalUnfoldedSingleton,
    Collection,
    CollectionChild
  }

  private static final Logger LOGGER =
    Logger.getLogger(WeblogicBeanIdentitySegment.class.getName());

  private WeblogicBeanIdentity identity;

  public WeblogicBeanIdentity getIdentity() {
    return this.identity;
  }

  private WeblogicBeanProperty property;

  public WeblogicBeanProperty getProperty() {
    return this.property;
  }

  private String key;

  public String getKey() {
    return this.key;
  }

  private WeblogicBeanType beanType;

  public WeblogicBeanType getBeanType() {
    return this.beanType;
  }

  private SegmentType segmentType;

  public WeblogicBeanIdentitySegment(
    WeblogicBeanIdentity identity,
    WeblogicBeanProperty property
  ) throws Exception {
    this(identity, property, null);
  }

  public WeblogicBeanIdentitySegment(
    WeblogicBeanIdentity identity,
    WeblogicBeanProperty property,
    String key
  ) throws Exception {
    this.identity = identity;
    this.property = property;
    this.key = key;
    this.beanType = property.getBeanType();
    this.segmentType = calculateType();
  }

  private SegmentType calculateType() throws Exception {
    if (this.property.isContainedCollection()) {
      if (getKey() != null) {
        return SegmentType.CollectionChild;
      } else {
        return SegmentType.Collection;
      }
    } else if (this.property.isFoldableContainedSingleton()) {
      if (this.property.isContainedOptionalSingleton()) {
        if (this.property.isCreatableContainedOptionalSingleton()) {
          return SegmentType.CreatableOptionalFoldedSingleton;
        } else if (this.property.isNonCreatableContainedOptionalSingleton()) {
          return SegmentType.NonCreatableOptionalFoldedSingleton;
        } else {
          throw new AssertionError("Unknown folded optional singleton type " + this.property);
        }
      } else {
        return SegmentType.AlwaysExistsFoldedSingleton;
      }
    } else {
      if (this.property.isContainedOptionalSingleton()) {
        if (this.property.isCreatableContainedOptionalSingleton()) {
          return SegmentType.CreatableOptionalUnfoldedSingleton;
        } else if (this.property.isNonCreatableContainedOptionalSingleton()) {
          return SegmentType.NonCreatableOptionalUnfoldedSingleton;
        } else {
          throw new AssertionError("Unknown unfolded optional singleton type " + this.property);
        }
      } else {
        throw new AssertionError("Unknown property type " + this.property);
      }
    }
  }

  public boolean isAlwaysExistsFoldedSingleton() {
    return this.segmentType == SegmentType.AlwaysExistsFoldedSingleton;
  }

  public boolean isCreatableOptionalFoldedSingleton() {
    return this.segmentType == SegmentType.CreatableOptionalFoldedSingleton;
  }

  public boolean isNonCreatableOptionalFoldedSingleton() {
    return this.segmentType == SegmentType.NonCreatableOptionalFoldedSingleton;
  }

  public boolean isCreatableOptionalUnfoldedSingleton() {
    return this.segmentType == SegmentType.CreatableOptionalUnfoldedSingleton;
  }

  public boolean isNonCreatableOptionalUnfoldedSingleton() {
    return this.segmentType == SegmentType.NonCreatableOptionalUnfoldedSingleton;
  }

  public boolean isCollection() {
    return this.segmentType == SegmentType.Collection;
  }

  public boolean isCollectionChild() {
    return this.segmentType == SegmentType.CollectionChild;
  }

  public boolean isOptionalFoldedSingleton() {
    return isCreatableOptionalFoldedSingleton() || isNonCreatableOptionalFoldedSingleton();
  }

  public boolean isOptionalUnfoldedSingleton() {
    return isCreatableOptionalUnfoldedSingleton() || isNonCreatableOptionalUnfoldedSingleton();
  }

  public boolean isOptionalSingleton() {
    return isOptionalUnfoldedSingleton() || isOptionalFoldedSingleton();
  }

  public boolean isFoldedSingleton() {
    return isAlwaysExistsFoldedSingleton() || isOptionalFoldedSingleton();
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb
      .append("type=<" + this.segmentType + ">")
      .append(",property=<" + getProperty() + ">");
    if (isCollectionChild()) {
      sb.append(",key=<" + getKey() + ">");
    }
    return sb.toString();
  }
}
