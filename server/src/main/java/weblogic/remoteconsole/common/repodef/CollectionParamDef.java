// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.List;

import weblogic.remoteconsole.common.utils.Path;

/**
 * This interface describes a customizer parameter that passes in a set
 * of properties of a collection of beans.
 *
 * It contains all of the information that the different parts of the backend needs
 * (e.g. english resource bundle, PDJ, RDJ).
 */
public interface CollectionParamDef extends ParamDef {

  // The collection to fetch properties from to pass into the customizer.
  public BeanChildDef getCollectionDef();

  // The path to the collection.
  //
  // If empty, then CollectionDef is a child of the bean that's being invoked.
  //
  // Otherwise, CollectionDef is a child of the type you find by walking
  // CollectionPath from the root type, e.g. Domain/Clusters
  public Path getCollectionPath();

  // The set of properties on the collection children that should be
  // passed to the customizer.
  public List<BeanPropertyDef> getPropertyDefs();
}
