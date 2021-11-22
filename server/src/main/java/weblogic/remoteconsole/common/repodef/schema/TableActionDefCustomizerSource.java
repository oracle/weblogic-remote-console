// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import java.util.List;

/**
 * This POJO mirrors the yaml source file format for configuring information about an action on
 * a weblogic bean's table page, e.g. ServerLifeCycleRuntimeMBean/table.yaml
 */
public class TableActionDefCustomizerSource extends BeanActionDefCustomizerSource {

  private ListValue<TableActionDefCustomizerSource> actions = new ListValue<>();

  // The list of actions that can be invoked on the rows of this table.
  public List<TableActionDefCustomizerSource> getActions() {
    return actions.getValue();
  }

  public void setActions(List<TableActionDefCustomizerSource> value) {
    actions.setValue(value);
  }

  public void addAction(TableActionDefCustomizerSource value) {
    actions.add(value);
  }
}
