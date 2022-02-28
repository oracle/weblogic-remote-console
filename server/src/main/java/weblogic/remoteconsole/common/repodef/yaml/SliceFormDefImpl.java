// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.util.Collections;
import java.util.List;

import weblogic.remoteconsole.common.repodef.PagePath;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.repodef.SliceDef;
import weblogic.remoteconsole.common.repodef.SliceFormDef;
import weblogic.remoteconsole.common.repodef.SliceFormPresentationDef;
import weblogic.remoteconsole.common.repodef.schema.SliceFormDefSource;

/**
 * yaml-based implementation of the SliceFormDef interface.
 */
public class SliceFormDefImpl extends FormDefImpl implements SliceFormDef {
  private List<PagePropertyDefImpl> advancedPropertyDefImpls;
  private List<PagePropertyDef> advancedPropertyDefs;
  private SliceFormPresentationDefImpl presentationDefImpl;

  public SliceFormDefImpl(PageRepoDefImpl pageRepoDefImpl, PagePath pagePath, SliceFormDefSource source) {
    super(pageRepoDefImpl, pagePath, source);
    this.advancedPropertyDefImpls = createPropertyDefImpls(source.getAdvancedProperties());
    this.advancedPropertyDefs = Collections.unmodifiableList(getAdvancedPropertyDefImpls());
    this.presentationDefImpl = new SliceFormPresentationDefImpl(this, source.getPresentation());
    createUsedIfDefImpls();
    initializeHelpPageTitle();
  }

  List<PagePropertyDefImpl> getAdvancedPropertyDefImpls() {
    return advancedPropertyDefImpls;
  }

  @Override
  public List<PagePropertyDef> getAdvancedPropertyDefs() {
    return advancedPropertyDefs;
  }

  SliceFormPresentationDefImpl getPresentationDefImpl() {
    return presentationDefImpl;
  }

  @Override
  public SliceFormPresentationDef getPresentationDef() {
    return getPresentationDefImpl();
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
  protected String getPageKey() {
    return "slice." + getPagePath().asSlicePagePath().getSlicePath().getDotSeparatedPath();
  }
}
