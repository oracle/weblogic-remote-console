// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.List;

/**
 * This interface describes a page.
 * 
 * It contains all of the information about the tree that the different
 * parts of the backend needs (e.g. english resource bundle, PDJ, RDJ).
 */
public interface PageDef {

  // Returns the path to this page (e.g. this it the ServerMBean's table page
  // or the Domain MBean's General slice form)
  public PagePath getPagePath();

  // Returns this page's introduction
  public LocalizableString getIntroductionHTML();

  // Returns this page's help page title
  public LocalizableString getHelpPageTitle();

  // Returns this page's help topics
  public List<HelpTopicDef> getHelpTopicDefs();

  // Returns all the properties on this page.
  // For example, a slice form will return all the normal
  // and advanced properties.  Or a complex create form
  // will return all of the properties from all of the sections.
  public List<PagePropertyDef> getAllPropertyDefs();

  // Get the name of the method to call customize the
  // contents of the page after the standard contents
  // have been computed.
  public String getCustomizePageMethod();


  // Get the name of the method to call customize the
  // the page def after the standard page def
  // have been computed.
  public String getCustomizePageDefMethod();


  // Returns whether this is a form.
  public default boolean isFormDef() {
    return this instanceof FormDef;
  }

  // Converts this form to a form.
  // Throws a ClassCastException if the form is not a FormDef.
  public default FormDef asFormDef() {
    return (FormDef)this;
  }

  // Returns whether this form is a slice form
  public default boolean isSliceFormDef() {
    return this instanceof SliceFormDef;
  }

  // Converts this form to a slice form.
  // Throws a ClassCastException if the form is not a SliceFormDef.
  public default SliceFormDef asSliceFormDef() {
    return (SliceFormDef)this;
  }

  // Returns whether this form is a slice table
  public default boolean isSliceTableDef() {
    return this instanceof SliceTableDef;
  }

  // Converts this form to a slice table.
  // Throws a ClassCastException if the form is not a SliceTableDef.
  public default SliceTableDef asSliceTableDef() {
    return (SliceTableDef)this;
  }

  // Returns whether this is a create form.
  public default boolean isCreateFormDef() {
    return this instanceof CreateFormDef;
  }

  // Converts this form to a create form.
  // Throws a ClassCastException if the form is not a CreateFormDef.
  public default CreateFormDef asCreateFormDef() {
    return (CreateFormDef)this;
  }

  // Returns whether this form is a table.
  public default boolean isTableDef() {
    return this instanceof TableDef;
  }

  // Converts this form to a table.
  // Throws a ClassCastException if the form is not a CreateFormDef.
  public default TableDef asTableDef() {
    return (TableDef)this;
  }
}
