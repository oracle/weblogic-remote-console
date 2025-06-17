// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import java.util.List;

import weblogic.console.schema.ListValue;

/**
 * This POJO mirrors the yaml source file format for configuring information about
 * a form page, e.g. ClusterMBean/createForm.yaml or ClusterMBean/slices/General/form.yaml.
 * 
 * All forms support the properties on this bean.
 * The derived SliceFormDefSource and CreateFormDefSource POJOs
 * add properties for slice and create form specific settings.
 */
public class FormDefSource extends PageDefSource {
  private ListValue<BeanPropertyDefCustomizerSource> properties = ListValue.create();
  private ListValue<FormSectionDefSource> sections = ListValue.create();

  // The list of 'normal' properties to display on this form.
  // Note: SliceFormDefSource adds 'advancedProperties'.
  //
  // It should not be specified if 'sections' is specified.
  // That is, a form can only specifiy 'properties' or 'sections', not both.
  public List<BeanPropertyDefCustomizerSource> getProperties() {
    return properties.getValue();
  }

  public void setProperties(List<BeanPropertyDefCustomizerSource> value) {
    properties = properties.setValue(value);
  }

  public void addProperty(BeanPropertyDefCustomizerSource value) {
    properties = properties.add(value);
  }

  // The sections to display on this form.
  //
  // It should not be specified if 'properties' is specified.
  // That is, a form can only specifiy 'properties' or 'sections', not both.
  public List<FormSectionDefSource> getSections() {
    return sections.getValue();
  }

  public void setSections(List<FormSectionDefSource> value) {
    sections = sections.setValue(value);
  }

  public void addSection(FormSectionDefSource value) {
    sections = sections.add(value);
  }

  @Override
  protected void validateExtension() {
    super.validateExtension();
    validateExtensionChildren(getProperties(), "properties");
    validateExtensionChildren(getSections(), "sections");
  }
}
