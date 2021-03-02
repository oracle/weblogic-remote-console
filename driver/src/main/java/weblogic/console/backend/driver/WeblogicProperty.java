// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.ArrayList;
import java.util.List;

/**
 * This POJO contains information that the UI needs about a form property
 * on a weblogic bean page.
 */
public class WeblogicProperty {
  private String name;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  private String label;

  public String getLabel() {
    return label;
  }

  public void setLabel(String label) {
    this.label = label;
  }

  // string, secret, int, long, double, boolean, reference,
  // ipAddress, date, unsupported, properties
  private String type;

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  private boolean array;

  public boolean isArray() {
    return array;
  }

  public void setArray(boolean array) {
    this.array = array;
  }

  private boolean readOnly;

  public boolean isReadOnly() {
    return readOnly;
  }

  public void setReadOnly(boolean readOnly) {
    this.readOnly = readOnly;
  }

  private boolean required;

  public boolean isRequired() {
    return required;
  }

  public void setRequired(boolean required) {
    this.required = required;
  }

  private String helpSummaryHTML;

  public String getHelpSummaryHTML() {
    return helpSummaryHTML;
  }

  public void setHelpSummaryHTML(String helpSummaryHTML) {
    this.helpSummaryHTML = helpSummaryHTML;
  }

  private String detailedHelpHTML;

  public String getDetailedHelpHTML() {
    return detailedHelpHTML;
  }

  public void setDetailedHelpHTML(String detailedHelpHTML) {
    this.detailedHelpHTML = detailedHelpHTML;
  }

  private boolean restartNeeded;

  public boolean isRestartNeeded() {
    return restartNeeded;
  }

  public void setRestartNeeded(boolean restartNeeded) {
    this.restartNeeded = restartNeeded;
  }

  private boolean redeployNeeded;

  public boolean isRedeployNeeded() {
    return redeployNeeded;
  }

  public void setRedeployNeeded(boolean redeployNeeded) {
    this.redeployNeeded = redeployNeeded;
  }

  private UsedIf usedIf;

  public UsedIf getUsedIf() {
    return usedIf;
  }

  public void setUsedIf(UsedIf usedIf) {
    this.usedIf = usedIf;
  }

  private List<LegalValue> legalValues = new ArrayList<>();

  public List<LegalValue> getLegalValues() {
    return legalValues;
  }

  public void setLegalValues(List<LegalValue> legalValues) {
    this.legalValues = legalValues;
  }

  // Provides information about the weblogic mbean property that
  // this property manages.  Null if this property does not
  // manage a weblogic bean property (i.e. defined in extension.yaml)
  private MBeanInfo mbeanInfo;

  public MBeanInfo getMBeanInfo() {
    return mbeanInfo;
  }

  public void setMBeanInfo(MBeanInfo mbeanInfo) {
    this.mbeanInfo = mbeanInfo;
  }

  private WeblogicPropertyPresentation presentation;

  public WeblogicPropertyPresentation getPresentation() {
    return this.presentation;
  }

  public void setPresentation(WeblogicPropertyPresentation presentation) {
    this.presentation = presentation;
  }
}
