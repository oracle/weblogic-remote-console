// Copyright (c) 2021, 2025, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import java.util.List;

import weblogic.console.schema.ListValue;
import weblogic.console.schema.StringValue;
import weblogic.console.schema.YamlSource;

/**
 * This POJO mirrors the yaml source file format for configuring information about a slice,
 * e.g. ServerMBean/slices.yaml
 */
public class SliceDefSource extends YamlSource {
  private StringValue name = new StringValue();
  private StringValue label = new StringValue();
  private ListValue<SliceDefSource> slices = new ListValue<>();
  private ListValue<String> requiredCapabilities = new ListValue<>();

  // The name of this slice (i.e. what to put into its PDJ url)
  // Not configured in yaml.  Instead, the CBE sets it.
  public String getName() {
    return name.getValue();
  }

  public void setName(String value) {
    name.setValue(value);
  }

  // The english label of this slice (i.e. what to display to the user)
  public String getLabel() {
    return label.getValue();
  }

  public void setLabel(String value) {
    label.setValue(value);
  }

  // The list of slices this slice immediately parents.
  public List<SliceDefSource> getSlices() {
    return slices.getValue();
  }

  public void setSlices(List<SliceDefSource> value) {
    slices.setValue(value);
  }

  public void addSlice(SliceDefSource value) {
    slices.add(value);
  }

  // The bean repo capabilities that are required for this slice to be present
  public List<String> getRequiredCapabilities() {
    return requiredCapabilities.getValue();
  }
  
  public void setRequiredCapabilities(List<String> val) {
    requiredCapabilities.setValue(val);
  }

  @Override
  protected void validateExtension() {
    super.validateExtension();
    validateExtensionChildren(getSlices(), "slices");
  }
}
