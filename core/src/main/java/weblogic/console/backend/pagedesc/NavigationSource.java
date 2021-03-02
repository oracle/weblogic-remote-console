// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.pagedesc;

import java.util.ArrayList;
import java.util.List;

import weblogic.console.backend.utils.ListUtils;

/**
 * This POJO mirrors the yaml source file format for configuring information
 * about the nav tree for a type, e.g. DomainMBean/navigation.yaml
 */
public class NavigationSource {
  private List<NavigationNodeSource> contents = new ArrayList<>();

  public List<NavigationNodeSource> getContents() {
    return contents;
  }

  public void setContents(List<NavigationNodeSource> contents) {
    this.contents = ListUtils.nonNull(contents);
  }
}
