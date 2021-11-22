// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

/**
 * This POJO mirrors the yaml source file format for configuring information about
 * a create form page, e.g. ClusterMBean/createForm.yaml
 */
public class CreateFormDefSource extends FormDefSource {
  private Value<CreateFormPresentationDefSource> presentation = new Value<>(new CreateFormPresentationDefSource());

  // Returns presentation info about this create form
  // (e.g. whether the properties should be displayed
  // in a single column).
  //
  // Returns null if the default presentation should be used.
  public CreateFormPresentationDefSource getPresentation() {
    return presentation.getValue();
  }

  public void setPresentation(CreateFormPresentationDefSource value) {
    presentation.setValue(value);
  }
}
