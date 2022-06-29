// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.util.Collections;
import java.util.List;

import weblogic.remoteconsole.common.repodef.PagePath;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.repodef.SliceDef;
import weblogic.remoteconsole.common.repodef.SliceTableDef;
import weblogic.remoteconsole.common.repodef.schema.SliceTableDefSource;

/**
 * yaml-based implemetation of the TableDef interface
 */
public class SliceTableDefImpl extends PageDefImpl implements SliceTableDef {
  private List<PagePropertyDefImpl> displayedColumnDefImpls;
  private List<PagePropertyDef> displayedColumnDefs;
  private List<PagePropertyDefImpl> hiddenColumnDefImpls;
  private List<PagePropertyDef> hiddenColumnDefs;
  private String getTableRowsMethod;

  public SliceTableDefImpl(PageRepoDefImpl pageRepoDefImpl, PagePath pagePath, SliceTableDefSource source) {
    super(pageRepoDefImpl, pagePath, source);
    this.displayedColumnDefImpls = createPropertyDefImpls(source.getDisplayedColumns());
    this.hiddenColumnDefImpls = createPropertyDefImpls(source.getHiddenColumns());
    this.displayedColumnDefs = Collections.unmodifiableList(getDisplayedColumnDefImpls());
    this.hiddenColumnDefs = Collections.unmodifiableList(getHiddenColumnDefImpls());
    this.getTableRowsMethod = source.getGetTableRowsMethod();
    initializeHelpPageTitle();
    createUsedIfDefImpls();
  }

  @Override
  protected void createUsedIfDefImpls() {
    // Don't create usedIfs for the columns since they're never used
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

  @Override
  public String getGetTableRowsMethod() {
    return getTableRowsMethod;
  }

  @Override
  protected String getPageKey() {
    return "slice." + getPagePath().asSlicePagePath().getSlicePath().getDotSeparatedPath();
  }
}
