// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.pagedesc;

import java.util.ArrayList;
import java.util.List;

import weblogic.console.backend.utils.ListUtils;

/**
 * This POJO mirrors the yaml source file format for configuring information about the nav tree,
 * Navigation.yaml
 * <p>
 * Allowed:
 * <ul>
 *   <li>group node
 *     <ul>
 *       <li>type: group</li>
 *       <li>label: my group</li>
 *       <li>contents: zero or more group, collection, singleton, root nodes</li>
 *     </ul>
 *   </li>
 *   <li>root node
 *     <ul>
 *       <li>type: root</li>
 *       <li>descripionHTML: landing page description</li>
 *     </ul>
 *   </li>
 *   <li> collection node
 *     <ul>
 *       <li>property: my collection property, e.g. AuthenticationProviders</li>
 *       <li>descripionHTML: landing page description</li>
 *     </ul>
 *   </li>
 *   <li>optional singleton node
 *     <ul>
 *       <li>property: my optional singleton property name, e.g. Adjudicator</li>
 *       <li>descripionHTML: landing page description</li>
 *     </ul>
 *   </li>
 * </ul>
 */
public class NavigationNodeSource {

  public enum Type {
    beanProperty,
    group,
    root
  }

  private Type type = Type.beanProperty;

  public Type getType() {
    return type;
  }

  public void setType(Type type) {
    this.type = type;
  }

  // Only allowed if type is beanProperty
  private String property;

  public String getProperty() {
    return property;
  }

  public void setProperty(String property) {
    this.property = property;
  }

  // Only allowed if type is group
  private String label;

  public String getLabel() {
    return label;
  }

  public void setLabel(String label) {
    this.label = label;
  }

  // Must not be empty if type is group
  // Must be empty if type is beanProperty or root
  private List<NavigationNodeSource> contents = new ArrayList<>();

  public List<NavigationNodeSource> getContents() {
    return contents;
  }

  public void setContents(List<NavigationNodeSource> contents) {
    this.contents = ListUtils.nonNull(contents);
  }

  private String descriptionHTML;

  public String getDescriptionHTML() {
    return descriptionHTML;
  }

  public void setDescriptionHTML(String descriptionHTML) {
    this.descriptionHTML = descriptionHTML;
  }
}
