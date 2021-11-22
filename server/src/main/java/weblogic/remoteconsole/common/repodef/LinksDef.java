// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.List;

/**
 * This interface describes a links underneath a type.
 *
 * It contains all of the information about the links that the different
 * parts of the backend needs (e.g. english resource bundle, PDJ, RDJ).
 */
public interface LinksDef {

  // Returns the correponding page repo
  public PageRepoDef getPageRepoDef();

  // Returns the corresponding type
  public BeanTypeDef getTypeDef();

  // Returns the links to use for instances of this type
  // (e.g. the links for a Server)
  public List<LinkDef> getInstanceLinkDefs();

  // Returns the links to use for collections for this type
  // (e.g. the links for the Servers collection)
  public List<LinkDef> getCollectionLinkDefs();

  // Returns the links to use for this type.
  public default List<LinkDef> getLinkDefs(boolean forInstance) {
    return (forInstance) ? getInstanceLinkDefs() : getCollectionLinkDefs();
  }
}
