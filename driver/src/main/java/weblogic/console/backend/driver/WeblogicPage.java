// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.ArrayList;
import java.util.List;

/**
 * This POJO contains all the information that the UI needs about a the page
 * that manages weblogic mbeans.
 */
public class WeblogicPage {

  private String weblogicVersion;

  public String getWeblogicVersion() {
    return weblogicVersion;
  }

  public void setWeblogicVersion(String weblogicVersion) {
    this.weblogicVersion = weblogicVersion;
  }

  private String introductionHTML;

  public String getIntroductionHTML() {
    return introductionHTML;
  }

  public void setIntroductionHTML(String introductionHTML) {
    this.introductionHTML = introductionHTML;
  }

  private String helpPageTitle = "";

  public String getHelpPageTitle() {
    return helpPageTitle;
  }

  public void setHelpPageTitle(String helpPageTitle) {
    this.helpPageTitle = helpPageTitle;
  }

  private List<String> helpTaskLabels = new ArrayList<>();

  public List<String> getHelpTaskLabels() {
    return helpTaskLabels;
  }

  public void setHelpTaskLabels(List<String> helpTaskLabels) {
    this.helpTaskLabels = helpTaskLabels;
  }

  private List<HelpTopic> helpTopics = new ArrayList<>();

  public List<HelpTopic> getHelpTopics() {
    return helpTopics;
  }

  public void setHelpTopics(List<HelpTopic> helpTopics) {
    this.helpTopics = helpTopics;
  }

  private WeblogicSliceForm sliceForm;

  public WeblogicSliceForm getSliceForm() {
    return sliceForm;
  }

  public void setSliceForm(WeblogicSliceForm sliceForm) {
    this.sliceForm = sliceForm;
  }

  private WeblogicTable table;

  public WeblogicTable getTable() {
    return table;
  }

  public void setTable(WeblogicTable table) {
    this.table = table;
  }

  private WeblogicCreateForm createForm;

  public WeblogicCreateForm getCreateForm() {
    return createForm;
  }

  public void setCreateForm(WeblogicCreateForm createForm) {
    this.createForm = createForm;
  }
}
