// Copyright (c) 2021, 2025, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import java.util.List;

import weblogic.console.schema.ListValue;
import weblogic.console.schema.YamlSource;

/**
 * This POJO mirrors the yaml source file format for configuring information about
 * slices that a type supports, e.g. ServerMBean/slices.yaml
 */
public class SlicesDefSource extends YamlSource {
  private ListValue<SliceDefSource> slices = ListValue.create();
  private ListValue<String> alternateSliceSources = ListValue.create();

  // The list of top level slices this type supports.
  public List<SliceDefSource> getSlices() {
    return slices.getValue();
  }

  public void setSlices(List<SliceDefSource> value) {
    slices = slices.setValue(value);
  }

  public void addSlice(SliceDefSource value) {
    slices = slices.add(value);
  }

  // List of other directories to search for slice definitions.
  // Used by heterogeneous types to share slice.yaml files.
  // e.g. UnixMachine/slices.yaml sets it to Machine/slices
  // When the CBE needs to find a slice, first it searches
  // this type, then it searches the alternate slice sources
  // (in order).
  public List<String> getAlternateSliceSources() {
    return alternateSliceSources.getValue();
  }

  public void setAlternateSliceSources(List<String> value) {
    alternateSliceSources = alternateSliceSources.setValue(value);
  }

  public void addAlternateSliceSource(String value) {
    alternateSliceSources = alternateSliceSources.add(value);
  }

  @Override
  protected void validateExtension() {
    super.validateExtension();
    validateExtensionChildren(getSlices(), "slices");
  }
}
