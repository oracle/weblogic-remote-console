// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import java.util.List;

/**
 * This POJO mirrors the yaml source file format for configuring information about any page.
 */
public class PageDefSource {
  private StringValue introductionHTML = new StringValue();
  private ListValue<HelpTopicDefSource> helpTopics = new ListValue<>();
  private StringValue customizePageDefSourceMethod = new StringValue();
  private StringValue customizePageDefMethod = new StringValue();
  private StringValue customizePageMethod = new StringValue();

  // The page's english introduction text.
  public String getIntroductionHTML() {
    return introductionHTML.getValue();
  }

  public void setIntroductionHTML(String value) {
    introductionHTML.setValue(value);
  }

  // The page's help topics.
  public List<HelpTopicDefSource> getHelpTopics() {
    return helpTopics.getValue();
  }

  public void setHelpTopics(List<HelpTopicDefSource> value) {
    helpTopics.setValue(value);
  }

  public void addHelpTopics(HelpTopicDefSource value) {
    helpTopics.add(value);
  }

  // Specifies a custom static method to call to customize this page's definition's source
  // The format is <package>.<class>.<method>
  //
  // required signature:
  //   public static void <method>(PagePath pagePath, PageDefSource pageDefSource)
  //
  // It's passed in the page's path and the page definition that was
  // read in from the yaml files.  The method can then modify the page def source.
  public String getCustomizePageDefSourceMethod() {
    return customizePageDefSourceMethod.getValue();
  }

  public void setCustomizePageDefSourceMethod(String value) {
    customizePageDefSourceMethod.setValue(value);
  }

  // Specifies a custom static method to call to customize this page's definition.
  // The format is <package>.<class>.<method>
  //
  // required signature:
  //   public static Response<PageDef> <method>(InvocationContext ic, PageDef pageDef)
  //
  // It's passed in the invocation context and a read-only page def containing
  // the initial page definition.  The method can then create and return the
  // customized one.
  public String getCustomizePageDefMethod() {
    return customizePageDefMethod.getValue();
  }

  public void setCustomizePageDefMethod(String value) {
    customizePageDefMethod.setValue(value);
  }

  // Specifies a custom static method to call to customize the data for this page.
  // It's called after the data for the page has been computed.
  //
  // The format is <package>.<class>.<method>
  //
  // required signature:
  //   public static Response<Void> <method>(InvocationContext ic, Page page);
  //
  // It's passed in the invocation context and the populated page.
  // The method can then modify the page.
  public String getCustomizePageMethod() {
    return customizePageMethod.getValue();
  }

  public void setCustomizePageMethod(String value) {
    customizePageMethod.setValue(value);
  }

  // Whether this is a form.
  public boolean isFormDefSource() {
    return this instanceof FormDefSource;
  }

  // Converts this page to a form.
  // Throws a ClassCastException if this page isn't a FormDefSource.
  public FormDefSource asFormDefSource() {
    return (FormDefSource)this;
  }
 
  // Whether this is a create form.
  public boolean isCreateFormDefSource() {
    return this instanceof CreateFormDefSource;
  }

  // Converts this page to a create form.
  // Throws a ClassCastException if this page isn't a CreateFormDefSource.
  public CreateFormDefSource asCreateFormDefSource() {
    return (CreateFormDefSource)this;
  }

  // Whether this is a slice form.
  public boolean isSliceFormDefSource() {
    return this instanceof SliceFormDefSource;
  }

  // Converts this page to a slice form.
  // Throws a ClassCastException if this page isn't a SliceFormDefSource.
  public SliceFormDefSource asSliceFormDefSource() {
    return (SliceFormDefSource)this;
  }

  // Whether this is a slice table.
  public boolean isSliceTableDefSource() {
    return this instanceof SliceTableDefSource;
  }

  // Converts this page to a slice table.
  // Throws a ClassCastException if this page isn't a SliceTableDefSource.
  public SliceTableDefSource asSliceTableDefSource() {
    return (SliceTableDefSource)this;
  }

  // Whether this is a table.
  public boolean isTableDefSource() {
    return this instanceof TableDefSource;
  }

  // Converts this page to a table.
  // Throws a ClassCastException if this page isn't a TableDefSource.
  public TableDefSource asTableDefSource() {
    return (TableDefSource)this;
  }
}
