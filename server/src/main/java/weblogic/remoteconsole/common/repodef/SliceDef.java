// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.List;

import weblogic.remoteconsole.common.utils.Path;

/**
 * This interface describes a node in the tree of slices for a type.
 *
 * It contains all of the information about the type that the different
 * parts of the backend needs (e.g. english resource bundle, PDJ, RDJ).
 */
public interface SliceDef {

  // Returns the tree of slices for this type.
  public SlicesDef getSlicesDef();

  // Returns the slice that contains this slice.
  // returns null if this node is directly parented by the type.
  public SliceDef getSliceDef();

  // Returns the child slices of this slice.
  // Returns an empty list if this is a leaf node.
  // Leaf nodes have corresponding slice forms/tables.
  // Intermediate nodes don't.
  public List<SliceDef> getContentDefs();

  // Returns this slice's label.
  public LocalizableString getLabel();

  // Returns this slice's name (i.e. that slice name to put into RDJ and PDJ urls)
  public String getName();

  // Get this slice's path from the type, e.g. DomainMBean's Security.General slice.
  public default Path getPath() {
    Path path = new Path();
    for (SliceDef sliceDef = this; sliceDef != null; sliceDef = sliceDef.getSliceDef()) {
      path = new Path(sliceDef.getName()).childPath(path);
    }
    return path;
  }
}
