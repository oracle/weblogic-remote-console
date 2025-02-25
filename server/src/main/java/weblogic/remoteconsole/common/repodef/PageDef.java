// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
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

  // Returns the actions this page supports.
  public List<PageActionDef> getActionDefs();

  // Get the name of the method to call customize the
  // contents of the page after the standard contents
  // have been computed.
  public String getCustomizePageMethod();


  // Get the name of the method to call customize the
  // the page def after the standard page def
  // have been computed.
  public String getCustomizePageDefMethod();

  // Whether this page's PDJ varies depending on the
  // identity and/or identifier in the invocation context
  // (v.s. is always the same)
  //
  // Normally PDJs are constant.  For example, the
  // ServerMBean General PDJ is always the same, regardless of the server.
  // But sometimes a PDJ changes depending on the instance.
  // For example, the legal values security provider types
  // when creating a security provider depends on the types
  // that the realm instance supports.
  public boolean isInstanceBasedPDJ();

  // Returns whether this is a form.
  public default boolean isFormDef() {
    return this instanceof FormDef;
  }

  // Converts this page to a form.
  // Throws a ClassCastException if the page is not a FormDef.
  public default FormDef asFormDef() {
    return (FormDef)this;
  }

  // Returns whether this page is a slice form
  public default boolean isSliceFormDef() {
    return this instanceof SliceFormDef;
  }

  // Converts this page to a slice form.
  // Throws a ClassCastException if the page is not a SliceFormDef.
  public default SliceFormDef asSliceFormDef() {
    return (SliceFormDef)this;
  }

  // Returns whether this page is a slice table
  public default boolean isSliceTableDef() {
    return this instanceof SliceTableDef;
  }

  // Converts this page to a slice table.
  // Throws a ClassCastException if the page is not a SliceTableDef.
  public default SliceTableDef asSliceTableDef() {
    return (SliceTableDef)this;
  }

  // Returns whether this page is a create form.
  public default boolean isCreateFormDef() {
    return this instanceof CreateFormDef;
  }

  // Converts this page to a create form.
  // Throws a ClassCastException if the page is not a CreateFormDef.
  public default CreateFormDef asCreateFormDef() {
    return (CreateFormDef)this;
  }

  // Returns whether this page is a table.
  public default boolean isTableDef() {
    return this instanceof TableDef;
  }

  // Converts this page to a table.
  // Throws a ClassCastException if the page is not a TableDef.
  public default TableDef asTableDef() {
    return (TableDef)this;
  }

  // Returns whether this page is an action input form.
  public default boolean isActionInputFormDef() {
    return this instanceof ActionInputFormDef;
  }

  // Converts this page to an action input form.
  // Throws a ClassCastException if the page is not an ActionInputFormDef.
  public default ActionInputFormDef asActionInputFormDef() {
    return (ActionInputFormDef)this;
  }
}
