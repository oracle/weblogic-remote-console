// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import java.util.List;

import weblogic.console.schema.ListValue;
import weblogic.console.schema.YamlSource;

/**
 * This POJO mirrors the yaml source file format for configuring information
 * about the nav tree nodes directly beneath a type, e.g. DomainMBean/nav-tree.yaml
 */
public class NavTreeDefSource extends YamlSource {
  private ListValue<NavTreeNodeDefSource> contents = new ListValue<>();

  // The top level nav tree nodes for this type.
  public List<NavTreeNodeDefSource> getContents() {
    return contents.getValue();
  }

  public void setContents(List<NavTreeNodeDefSource> value) {
    contents.setValue(value);
  }

  @Override
  protected void validateExtension() {
    super.validateExtension();
    validateExtensionChildren(getContents(), "contents");
  }
}
