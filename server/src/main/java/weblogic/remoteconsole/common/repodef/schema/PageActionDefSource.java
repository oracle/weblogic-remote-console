// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import java.util.List;

import weblogic.console.schema.ListValue;
import weblogic.console.schema.StringValue;
import weblogic.console.schema.YamlSource;

/**
 * This POJO mirrors the yaml source file format for configuring information about
 * an action from a weblogic bean's page, e.g. ServerLifeCycleRuntimeMBean/table.yaml
 */
public class PageActionDefSource extends YamlSource {

  public enum Rows {
    none,
    one,
    multiple
  }

  private StringValue name = StringValue.create();
  private StringValue label = StringValue.create();
  private Rows rows = Rows.multiple;
  private ListValue<PageActionDefSource> actions = ListValue.create();
  private ListValue<String> requiredCapabilities = ListValue.create();

  // The name of the action (i.e. in the urls, PDJs and RDJs)
  public String getName() {
    return name.getValue();
  }

  public void setName(String value) {
    name = name.setValue(value);
  }

  // The english label to display for this action.
  public String getLabel() {
    return label.getValue();
  }

  public void setLabel(String value) {
    label = label.setValue(value);
  }

  // How many rows this action needs:
  // none     - the action takes no rows (i.e. applies to the entire table)
  // one      - the action takes exactly one row
  // multiple - the action takes one or more rows
  // Only used for table and slice table pages.
  public void setRows(Rows value) {
    rows = value;
  }

  public Rows getRows() {
    return rows;
  }

  // The list of actions that can be invoked on this page.
  public List<PageActionDefSource> getActions() {
    return actions.getValue();
  }

  public void setActions(List<PageActionDefSource> value) {
    actions = actions.setValue(value);
  }

  public void addAction(PageActionDefSource value) {
    actions = actions.add(value);
  }

  // The bean repo capabilities that are required for this action to be present
  public List<String> getRequiredCapabilities() {
    return requiredCapabilities.getValue();
  }
  
  public void setRequiredCapabilities(List<String> val) {
    requiredCapabilities = requiredCapabilities.setValue(val);
  }

  @Override
  protected void validateExtension() {
    super.validateExtension();
    validateExtensionChildren(getActions(), "actions");
  }
}
