// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.pagedesc;

import java.util.ArrayList;
import java.util.List;

import weblogic.console.backend.utils.ListUtils;

/**
 * This POJO mirrors the yaml source file format for configuring information about the order of
 * slices in a set of slices, e.g. ServerMBean/slices.yaml
 */
public class SlicesSource {
  private List<SliceSource> slices = new ArrayList<>();

  public List<SliceSource> getSlices() {
    return slices;
  }

  public void setSlices(List<SliceSource> slices) {
    this.slices = ListUtils.nonNull(slices);
  }

  private List<String> alternateSliceSources = new ArrayList<>();

  public List<String> getAlternateSliceSources() {
    return alternateSliceSources;
  }

  public void setAlternateSliceSources(List<String> alternateSliceSources) {
    this.alternateSliceSources = ListUtils.nonNull(alternateSliceSources);
  }
}
