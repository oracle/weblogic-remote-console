// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.List;

import weblogic.remoteconsole.common.utils.Path;

/**
 * This interface describes the nav tree info underneath a type.
 *
 * It contains all of the information about the type that the different
 * parts of the backend needs (e.g. english resource bundle, PDJ, RDJ).
 */
public interface NavTreeDef {

  // Get the parent PageRepoDef
  public PageRepoDef getPageRepoDef();

  // Gets the corresponding TypeDef
  public BeanTypeDef getTypeDef();

  // Get the top level nav tree node defs
  public List<NavTreeNodeDef> getContentDefs();

  // Find a nav tree node def by its relative nav tree path from this type.
  // Works for any kind of node (group or child).
  // e.g. DomainMBean & 'Services' returns the top level Services group node
  // e.g. DomainMBean & 'Services/Servers' returns the Services group node's Servers child node.
  // Returns null if not found.
  public NavTreeNodeDef findNodeByNavTreePath(Path relativeNavTreePath);

  // Find a nav tree node def for a child node def by its relative bean tree path
  // (v.s. nav tree path) from this type.
  // (e.g. a DomainMBean & Servers returns the Services group node's Servers child node.
  // Returns null if not found (since this is a normal condition when mapping
  // from a BeanTreePath to a navigation path)
  public BeanChildNavTreeNodeDef findNodeByChildPath(Path relativeChildPath);
}
