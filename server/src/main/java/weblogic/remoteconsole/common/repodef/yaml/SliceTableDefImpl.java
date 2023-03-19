// Copyright (c) 2021, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import weblogic.remoteconsole.common.repodef.PagePath;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.repodef.SliceDef;
import weblogic.remoteconsole.common.repodef.SliceTableDef;
import weblogic.remoteconsole.common.repodef.TableActionDef;
import weblogic.remoteconsole.common.repodef.schema.SliceTableDefSource;
import weblogic.remoteconsole.common.repodef.schema.TableActionDefCustomizerSource;

/**
 * yaml-based implemetation of the TableDef interface
 */
public class SliceTableDefImpl extends PageDefImpl implements SliceTableDef {
  private List<PagePropertyDefImpl> displayedColumnDefImpls;
  private List<PagePropertyDef> displayedColumnDefs;
  private List<PagePropertyDefImpl> hiddenColumnDefImpls;
  private List<PagePropertyDef> hiddenColumnDefs;
  private List<TableActionDefImpl> actionDefImpls = new ArrayList<>();
  private List<TableActionDef> actionDefs;
  private String getTableRowsMethod;
  private String actionMethod;

  public SliceTableDefImpl(PageRepoDefImpl pageRepoDefImpl, PagePath pagePath, SliceTableDefSource source) {
    super(pageRepoDefImpl, pagePath, source);
    this.displayedColumnDefImpls = createPropertyDefImpls(source.getDisplayedColumns());
    this.hiddenColumnDefImpls = createPropertyDefImpls(source.getHiddenColumns());
    this.displayedColumnDefs = Collections.unmodifiableList(getDisplayedColumnDefImpls());
    this.hiddenColumnDefs = Collections.unmodifiableList(getHiddenColumnDefImpls());
    // Note: make sure to create the actions after creating the columns so
    // that the actions' usedifs' properties exist when we create the actions:
    createActionDefImpls(source.getActions());
    this.actionDefs = Collections.unmodifiableList(getActionDefImpls());
    this.getTableRowsMethod = source.getGetTableRowsMethod();
    this.actionMethod = source.getActionMethod();
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

  @Override
  protected String getEnglishHelpPageTitle(String typeInstanceName) {
    StringBuilder sb = new StringBuilder();
    sb.append(typeInstanceName);
    List<SliceDef> sliceDefs =
      getPagePath().getPagesPath().getPageRepoDef().getSlicesDef(getTypeDefImpl()).getContentDefs();
    if (sliceDefs.size() == 1 && sliceDefs.get(0).getContentDefs().isEmpty()) {
      // Since there is only one slice for this type, the CFE doesn't display any tabs.
      // Therefore, don't add the slice path to the title.
    } else {
      // Since there is more than one slice for this type, the CFE displays the tabs.
      // Therefore, add the slice path to the title.
      for (String sliceName : getPagePath().asSlicePagePath().getSlicePath().getComponents()) {
        SliceDef sliceDef = getSliceDef(sliceDefs, sliceName);
        sb.append(": ");
        sb.append(sliceDef.getLabel().getEnglishText());
        sliceDefs = sliceDef.getContentDefs();
      }
    }
    return sb.toString();
  }

  private SliceDef getSliceDef(List<SliceDef> sliceDefs, String sliceName) {
    for (SliceDef sliceDef : sliceDefs) {
      if (sliceDef.getName().equals(sliceName)) {
        return sliceDef;
      }
    }
    throw new AssertionError("Can't find slice " + sliceName + " " + this);
  }

  List<TableActionDefImpl> getActionDefImpls() {
    return actionDefImpls;
  }

  @Override
  public List<TableActionDef> getActionDefs() {
    return actionDefs;
  }

  @Override
  public String getGetTableRowsMethod() {
    return getTableRowsMethod;
  }

  @Override
  public String getActionMethod() {
    return actionMethod;
  }

  @Override
  protected String getPageKey() {
    return "slice." + getPagePath().asSlicePagePath().getSlicePath().getDotSeparatedPath();
  }
}
