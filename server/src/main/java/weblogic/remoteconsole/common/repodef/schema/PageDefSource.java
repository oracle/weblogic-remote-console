// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import java.util.List;

import weblogic.console.schema.BooleanValue;
import weblogic.console.schema.ListValue;
import weblogic.console.schema.StringValue;
import weblogic.console.schema.YamlSource;
import weblogic.console.utils.StringUtils;
import weblogic.remoteconsole.common.utils.CustomizerInvocationUtils;

/**
 * This POJO mirrors the yaml source file format for configuring information about any page.
 */
public class PageDefSource extends YamlSource {
  private StringValue introductionHTML = StringValue.create();
  private ListValue<HelpTopicDefSource> helpTopics = ListValue.create();
  private StringValue customizePageDefSourceMethod = StringValue.create();
  private StringValue customizePageDefMethod = StringValue.create();
  private StringValue customizePageMethod = StringValue.create();
  private ListValue<PageActionDefSource> actions = ListValue.create();
  private BooleanValue instanceBasedPDJ = BooleanValue.create();

  // The page's english introduction text.
  public String getIntroductionHTML() {
    return introductionHTML.getValue();
  }

  public void setIntroductionHTML(String value) {
    introductionHTML = introductionHTML.setValue(value);
  }

  // The page's help topics.
  public List<HelpTopicDefSource> getHelpTopics() {
    return helpTopics.getValue();
  }

  public void setHelpTopics(List<HelpTopicDefSource> value) {
    helpTopics = helpTopics.setValue(value);
  }

  public void addHelpTopic(HelpTopicDefSource value) {
    helpTopics.add(value);
  }

  // The actions that can be invoked on this page.
  public List<PageActionDefSource> getActions() {
    return actions.getValue();
  }

  public void setActions(List<PageActionDefSource> value) {
    actions = actions.setValue(value);
  }

  public void addAction(PageActionDefSource value) {
    actions = actions.add(value);
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
    if (StringUtils.isEmpty(value) || CustomizerInvocationUtils.methodExists(value)) {
      customizePageDefSourceMethod = customizePageDefSourceMethod.setValue(value);
    }
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
    if (StringUtils.isEmpty(value) || CustomizerInvocationUtils.methodExists(value)) {
      customizePageDefMethod = customizePageDefMethod.setValue(value);
    }
  }

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
  public boolean isInstanceBasedPDJ() {
    return instanceBasedPDJ.getValue();
  }

  public void setInstanceBasedPDJ(boolean value) {
    instanceBasedPDJ = instanceBasedPDJ.setValue(value);
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
    if (StringUtils.isEmpty(value) || CustomizerInvocationUtils.methodExists(value)) {
      customizePageMethod = customizePageMethod.setValue(value);
    }
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

  @Override
  protected void validateExtension() {
    super.validateExtension();
    validateExtensionChildren(getHelpTopics(), "helpTopics");
    validateExtensionChildren(getActions(), "actions");
    validateExtensionStringPropertyNotSpecified(getCustomizePageDefSourceMethod(), "customizePageDefSourceMethod");
    validateExtensionStringPropertyNotSpecified(getCustomizePageDefMethod(), "customizePageDefMethod");
    validateExtensionStringPropertyNotSpecified(getCustomizePageMethod(), "customizePageMethod");
  }
}
