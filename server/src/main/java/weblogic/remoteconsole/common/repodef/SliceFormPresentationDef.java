// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

/**
 * This interface describes how to customize the presentation of a slice form page.
 * 
 * It contains all of the information about the tree that the different
 * parts of the backend needs (e.g. english resource bundle, PDJ, RDJ).
 */
public interface SliceFormPresentationDef {

  // Returns the correponding form.
  public SliceFormDef getSliceFormDef();

  // Returns whether booleans should be displayed as checkboxes.
  // The default is to display booleans as sliders.
  public boolean isUseCheckBoxesForBooleans();

  // Returns whether the properties on this page should be
  // displayed in a single column.  The default is two columns.
  public boolean isSingleColumn();
}
