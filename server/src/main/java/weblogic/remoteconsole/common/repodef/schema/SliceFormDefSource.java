// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import java.util.List;

/**
 * This POJO mirrors the yaml source file format for configuring information about
 * a slice form page, e.g. ClusterMBean/slices/General/form.yaml
 */
public class SliceFormDefSource extends FormDefSource {
  private ListValue<BeanPropertyDefCustomizerSource> advancedProperties = new ListValue<>();
  private Value<SliceFormPresentationDefSource> presentation = new Value<>(new SliceFormPresentationDefSource());

  // The list of advanced properties to display on this form.
  // (This is separate from the inherited 'properties' which lists
  // the normal properties to display on this form.
  public List<BeanPropertyDefCustomizerSource> getAdvancedProperties() {
    return advancedProperties.getValue();
  }

  public void setAdvancedProperties(List<BeanPropertyDefCustomizerSource> value) {
    advancedProperties.setValue(value);
  }

  // Returns presentation info about this slice form
  // (e.g. whether the properties should be displayed
  // in a single column, whether booleans should be
  // displayed at checkboxes).
  //
  // Returns null if the default presentation should be used.
  public SliceFormPresentationDefSource getPresentation() {
    return presentation.getValue();
  }

  public void setPresentation(SliceFormPresentationDefSource value) {
    presentation.setValue(value);
  }
}
