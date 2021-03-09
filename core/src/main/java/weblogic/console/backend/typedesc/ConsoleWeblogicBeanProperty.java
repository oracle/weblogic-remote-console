// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.typedesc;

import java.util.ArrayList;
import java.util.List;

import weblogic.console.backend.utils.ListUtils;

/**
 * This POJO mirrors the yaml file format for configuring console-specific information about a
 * weblogic bean property, e.g. ClusterMBean/type.yaml
 */
public class ConsoleWeblogicBeanProperty {

  private String name;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  private String source = "";

  public String getSource() {
    return source;
  }

  public void setSource(String source) {
    this.source = source;
  }

  private boolean useUnlocalizedNameAsLabel = false;

  public boolean isUseUnlocalizedNameAsLabel() {
    return this.useUnlocalizedNameAsLabel;
  }

  public void setUseUnlocalizedNameAsLabel(boolean useUnlocalizedNameAsLabel) {
    this.useUnlocalizedNameAsLabel = useUnlocalizedNameAsLabel;
  }

  private String label = "";

  public String getLabel() {
    return label;
  }

  public void setLabel(String label) {
    this.label = label;
  }

  // The help summary for this property.
  // If not specified and HelpHTML isn't specified, then
  // the first sentence of the harvested javadoc is used.
  // If not specified and HelpHTML is specified, then
  // HelpHTML is used.
  // It is illegal to specify both HelpSummaryHTML and HelpHTML.
  private String helpSummaryHTML = "";

  public String getHelpSummaryHTML() {
    return helpSummaryHTML;
  }

  public void setHelpSummaryHTML(String helpSummaryHTML) {
    this.helpSummaryHTML = helpSummaryHTML;
  }

  // The help details for this property (minus the help summary).
  // The summary and details are concatenated in the PDJ so that
  // the CFE doesn't have have to combine them.
  // If not specified and HelpHTML isn't specified, then
  // the everything except for the first sentence of the harvested javadoc is used.
  // If not specified and HelpHTML is specified, then
  // HelpHTML is used.
  // It is illegal to specify both HelpDetailsHTML and HelpHTML.
  private String helpDetailsHTML = "";

  public String getHelpDetailsHTML() {
    return helpDetailsHTML;
  }

  public void setHelpDetailsHTML(String helpDetailsHTML) {
    this.helpDetailsHTML = helpDetailsHTML;
  }

  // This is used when the help summary and the help details
  // should have exactly the same text in the PDJ.
  // If not specified, then see HelpSummaryHTML and HelpDetailsHTML.
  // It is illegal to specify HelpHTML if either HelpSummaryHTML
  // or HelpDetailsHTML are specified.
  private String helpHTML = "";

  public String getHelpHTML() {
    return helpHTML;
  }

  public void setHelpHTML(String helpHTML) {
    this.helpHTML = helpHTML;
  }

  private ConsoleWeblogicBeanUsedIf usedIf;

  public ConsoleWeblogicBeanUsedIf getUsedIf() {
    return usedIf;
  }

  public void setUsedIf(ConsoleWeblogicBeanUsedIf usedIf) {
    this.usedIf = usedIf;
  }

  private boolean required = false;

  public boolean isRequired() {
    return required;
  }

  public void setRequired(boolean required) {
    this.required = required;
  }

  // Usually the bean info give us enough information to determine the property's type, i.e.:
  //   - collection of contained beans
  //   - optional contained bean that the user can create and delete
  //   - automatically created contained bean that always exists and that the
  //     user cannot create or delete
  // However, there is one other property type that we can't figure out from the bean infos:
  //   optional contained bean that the user cannot create or delete
  //   (used for a server's default JTA migratable target - it exists only if the
  //   server has a corresponding migratable target)
  // Since the CBE and CFE need to know about this pattern, it must be configured in
  // type.yaml using this property:
  private boolean nonCreatableOptionalSingleton = false;

  public boolean isNonCreatableOptionalSingleton() {
    return nonCreatableOptionalSingleton;
  }

  public void setNonCreatableOptionalSingleton(boolean nonCreatableOptionalSingleton) {
    this.nonCreatableOptionalSingleton = nonCreatableOptionalSingleton;
  }

  private List<ConsoleWeblogicBeanLegalValue> legalValues = new ArrayList<>();

  public List<ConsoleWeblogicBeanLegalValue> getLegalValues() {
    return legalValues;
  }

  public void setLegalValues(List<ConsoleWeblogicBeanLegalValue> legalValues) {
    this.legalValues = ListUtils.nonNull(legalValues);
  }

  // The names of the properties that contains the lists of options
  // for this property.
  // They can either be one of the following:
  // 1) a local property, e.g. fooOptions,
  // 2) a property on the domain mbean, e.g. /Machines
  // 3) a property on a parent mbean, e.g. ../Machines
  private List<String> optionsSources = new ArrayList<>();

  public List<String> getOptionsSources() {
    return optionsSources;
  }

  public void setOptionsSources(List<String> optionsSources) {
    this.optionsSources = ListUtils.nonNull(optionsSources);
  }

  private boolean allowNullReference = true;

  public boolean isAllowNullReference() {
    return allowNullReference;
  }

  public void setAllowNullReference(boolean allowNullReference) {
    this.allowNullReference = allowNullReference;
  }

  public enum Writable {
    defer,
    never,
    always,
    createOnly
  }

  private Writable writable = Writable.defer;

  public Writable getWritable() {
    return writable;
  }

  public void setWritable(Writable writable) {
    this.writable = writable;
  }

  // <package>.<class>.<method>
  private String getMethod;

  public String getGetMethod() {
    return this.getMethod;
  }

  public void setGetMethod(String getMethod) {
    this.getMethod = getMethod;
  }

  // <package>.<class>.<method>
  private String optionsMethod;

  public String getOptionsMethod() {
    return this.optionsMethod;
  }

  public void setOptionsMethod(String optionsMethod) {
    this.optionsMethod = optionsMethod;
  }

  private boolean ordered;

  public boolean isOrdered() {
    return this.ordered;
  }

  public void setOrdered(boolean ordered) {
    this.ordered = ordered;
  }

  // Used to flag:
  //   1) a string property that's really a reference
  //   2) a reference array that's really a reference
  //
  // true means the property really is an mbean reference.
  //
  // false means the property does whatever's normal for its type.
  //
  // Setting it to true if the property type isn't capable
  // of holding a refererence results in a built time error.
  //
  // When it's true, then optionsSources and optionsMethod
  // are allowed too.  Otherwise they're only allowed if the
  // actual property type is a reference or array of references.
  private boolean reference;

  public boolean isReference() {
    return this.reference;
  }

  public void setReference(boolean reference) {
    this.reference = reference;
  }

  // Used to flag a long property that really holds a date
  private boolean dateAsLong;

  public boolean isDateAsLong() {
    return this.dateAsLong;
  }

  public void setDateAsLong(boolean dateAsLong) {
    this.dateAsLong = dateAsLong;
  }
}
