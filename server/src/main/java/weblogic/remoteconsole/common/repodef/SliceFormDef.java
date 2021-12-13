// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.List;

/**
 * This interface describes a slice form page.
 * 
 * It contains all of the information about the tree that the different
 * parts of the backend needs (e.g. english resource bundle, PDJ, RDJ).
 */
public interface SliceFormDef extends FormDef {

  // Returns the advanced properties on this form.
  // (v.s. the inherited getPropertyDefs() returns the
  // standard properties on this form)
  public List<PagePropertyDef> getAdvancedPropertyDefs();

  // Returns presentation info about this slice form
  // (e.g. whether the properties should be displayed
  // in a single column, whether booleans should be
  // displayed at checkboxes).
  //
  // Returns null if the default presentation should be used.
  public SliceFormPresentationDef getPresentationDef();

  // Returns whether all the fields on this slice are read-only.
  public default boolean isReadOnly() {
    for (PagePropertyDef propertyDef : getAllPropertyDefs()) {
      if (propertyDef.isUpdateWritable()) {
        return false;
      }
    }
    return true;
  }
}
