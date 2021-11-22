// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.List;

/**
 * This interface describes the tree of slices for a type.
 *
 * It contains all of the information about the type that the different
 * parts of the backend needs (e.g. english resource bundle, PDJ, RDJ).
 */
public interface SlicesDef {

  // Returns the corresponding repo.
  public PageRepoDef getPageRepoDef();

  // Returns the correponding type
  public BeanTypeDef getTypeDef();

  // Returns the top-level list of slices for this type.
  public List<SliceDef> getContentDefs();
}
