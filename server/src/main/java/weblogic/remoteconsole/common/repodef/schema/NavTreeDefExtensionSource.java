// Copyright (c) 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import java.util.List;

/**
 * This POJO mirrors the yaml source file format for extending nav-tree.yaml
 */
public class NavTreeDefExtensionSource {
  private ListValue<NavTreeNodeDefSource> contents = new ListValue<>();

  // The top level nav tree nodes for this type.
  public List<NavTreeNodeDefSource> getContents() {
    return contents.getValue();
  }

  public void setContents(List<NavTreeNodeDefSource> value) {
    contents.setValue(value);
  }
}