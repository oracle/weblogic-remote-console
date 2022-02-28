// Copyright (c) 2020, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import weblogic.remoteconsole.common.repodef.PagePath;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.repodef.TableActionDef;
import weblogic.remoteconsole.common.repodef.TableDef;
import weblogic.remoteconsole.common.repodef.schema.TableActionDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.TableDefSource;
import weblogic.remoteconsole.common.utils.StringUtils;

/**
 * yaml-based implemetation of the TableDef interface
 */
public class TableDefImpl extends PageDefImpl implements TableDef {
  private List<PagePropertyDefImpl> displayedColumnDefImpls;
  private List<PagePropertyDef> displayedColumnDefs;
  private List<PagePropertyDefImpl> hiddenColumnDefImpls;
  private List<PagePropertyDef> hiddenColumnDefs;
  private List<TableActionDefImpl> actionDefImpls = new ArrayList<>();
  private List<TableActionDef> actionDefs;

  public TableDefImpl(PageRepoDefImpl pageRepoDefImpl, PagePath pagePath, TableDefSource source) {
    super(pageRepoDefImpl, pagePath, source);
    // tables can include columns that only some of the derived types support
    // rows whose type doesn't support the column will omit its cell.
    boolean searchSubTypes = true;
    this.displayedColumnDefImpls = createPropertyDefImpls(source.getDisplayedColumns(), searchSubTypes);
    this.hiddenColumnDefImpls = createPropertyDefImpls(source.getHiddenColumns(), searchSubTypes);
    this.displayedColumnDefs = Collections.unmodifiableList(getDisplayedColumnDefImpls());
    this.hiddenColumnDefs = Collections.unmodifiableList(getHiddenColumnDefImpls());
    // Note: make sure to create the actions after creating the columns so
    // that the actions' usedifs' properties exist when we create the actions:
    createActionDefImpls(source.getActions());
    this.actionDefs = Collections.unmodifiableList(getActionDefImpls());
    initializeHelpPageTitle();
    createUsedIfDefImpls();
  }

  @Override
  protected void createUsedIfDefImpls() {
    // Don't create usedIfs for the columns since they're never used
    // And don't create usedIfs for actions since they were created along with the actions
  }

  private void createActionDefImpls(List<TableActionDefCustomizerSource> actionCustomizerSources) {
    for (TableActionDefCustomizerSource actionCustomizerSource : actionCustomizerSources) {
      TableActionDefImpl actionDefImpl = TableActionDefImpl.create(this, actionCustomizerSource);
      if (actionDefImpl != null) {
        actionDefImpls.add(actionDefImpl);
      }
    }
  }

  List<PagePropertyDefImpl> getDisplayedColumnDefImpls() {
    return displayedColumnDefImpls;
  }

  @Override
  public List<PagePropertyDef> getDisplayedColumnDefs() {
    return displayedColumnDefs;
  }

  List<PagePropertyDefImpl> getHiddenColumnDefImpls() {
    return hiddenColumnDefImpls;
  }

  @Override
  public List<PagePropertyDef> getHiddenColumnDefs() {
    return hiddenColumnDefs;
  }


  List<TableActionDefImpl> getActionDefImpls() {
    return actionDefImpls;
  }

  @Override
  public List<TableActionDef> getActionDefs() {
    return actionDefs;
  }

  @Override
  protected String getPageKey() {
    return "table";
  }

  @Override
  protected String getEnglishHelpPageTitle(String typeInstanceName) {
    return StringUtils.getPlural(typeInstanceName);
  }
}
