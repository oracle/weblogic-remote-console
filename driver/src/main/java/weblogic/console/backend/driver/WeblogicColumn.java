// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.ArrayList;
import java.util.List;

/**
 * This POJO contains information that the UI needs about a table column
 * on a weblogic bean table page.
 */
public class WeblogicColumn {
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

  private List<LegalValue> legalValues = new ArrayList<>();

  public List<LegalValue> getLegalValues() {
    return legalValues;
  }

  public void setLegalValues(List<LegalValue> legalValues) {
    this.legalValues = legalValues;
  }

  // Whether this column holds the value that needs to be appended to the URL
  // of this table page to get to the URL for the items in this table.
  private boolean key;

  public boolean isKey() {
    return key;
  }

  public void setKey(boolean key) {
    this.key = key;
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

  private UsedIf usedIf;

  public UsedIf getUsedIf() {
    return usedIf;
  }

  public void setUsedIf(UsedIf usedIf) {
    this.usedIf = usedIf;
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
}
