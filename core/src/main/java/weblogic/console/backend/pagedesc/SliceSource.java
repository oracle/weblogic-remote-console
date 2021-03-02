// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.pagedesc;

import java.util.ArrayList;
import java.util.List;

import weblogic.console.backend.utils.ListUtils;

/**
 * This POJO mirrors the yaml source file format for configuring information about a slice, e.g.
 * ServerMBean/slices.yaml
 */
public class SliceSource {
  private String name;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  private String label;

  public String getLabel() {
    return label;
  }

  public void setLabel(String label) {
    this.label = label;
  }

  private List<SliceSource> slices = new ArrayList<>();

  public List<SliceSource> getSlices() {
    return slices;
  }

  public void setSlices(List<SliceSource> slices) {
    this.slices = ListUtils.nonNull(slices);
  }
}
