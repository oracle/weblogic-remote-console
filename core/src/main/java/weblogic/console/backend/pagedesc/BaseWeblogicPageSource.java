// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.pagedesc;

import java.util.ArrayList;
import java.util.List;

import weblogic.console.backend.utils.ListUtils;

/** This POJO mirrors the yaml source file format for configuring information about any page. */
public class BaseWeblogicPageSource {
  private String introductionHTML;

  public String getIntroductionHTML() {
    return introductionHTML;
  }

  public void setIntroductionHTML(String introductionHTML) {
    this.introductionHTML = introductionHTML;
  }

  private List<String> helpTasks = new ArrayList<>();

  public List<String> getHelpTasks() {
    return helpTasks;
  }

  public void setHelpTasks(List<String> helpTasks) {
    this.helpTasks = ListUtils.nonNull(helpTasks);
  }

  private List<HelpTopicSource> helpTopics = new ArrayList<>();

  public List<HelpTopicSource> getHelpTopics() {
    return helpTopics;
  }

  public void setHelpTopics(List<HelpTopicSource> helpTopics) {
    this.helpTopics = ListUtils.nonNull(helpTopics);
  }

  // Custom code to customize the unlocalized PDJ created from the PDY
  // <package>.<class>.<method>
  // signature:
  //  public static void <method>(WeblogicPage page, WeblogicPageSource pageSource) throws Exception
  private String customizePageDefinitionMethod;

  public String getCustomizePageDefinitionMethod() {
    return this.customizePageDefinitionMethod;
  }

  public void setCustomizePageDefinitionMethod(String customizePageDefinitionMethod) {
    this.customizePageDefinitionMethod = customizePageDefinitionMethod;
  }

  // Custom code to customize the english resource definitions after the ones from the PDY are created
  // <package>.<class>.<method>
  // signature:
  //  public static void <method>(Properties englishResourceDefinitions, WeblogicPageSource pageSource) throws Exception
  private String customizeEnglishResourceDefinitionsMethod;

  public String getCustomizeEnglishResourceDefinitionsMethod() {
    return this.customizeEnglishResourceDefinitionsMethod;
  }

  public void setCustomizeEnglishResourceDefinitionsMethod(String customizeEnglishResourceDefinitionsMethod) {
    this.customizeEnglishResourceDefinitionsMethod = customizeEnglishResourceDefinitionsMethod;
  }
}
