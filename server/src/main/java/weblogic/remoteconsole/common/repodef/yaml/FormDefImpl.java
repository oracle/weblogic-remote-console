// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import weblogic.remoteconsole.common.repodef.FormDef;
import weblogic.remoteconsole.common.repodef.FormSectionDef;
import weblogic.remoteconsole.common.repodef.PagePath;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.repodef.schema.FormDefSource;
import weblogic.remoteconsole.common.repodef.schema.FormSectionDefSource;

/**
 * yaml-based implementation of the FormDef interface.
 */
public abstract class FormDefImpl extends PageDefImpl implements FormDef {
  private List<PagePropertyDefImpl> propertyDefImpls;
  private List<PagePropertyDef> propertyDefs;
  private List<FormSectionDefImpl> allSectionDefImpls = new ArrayList<>();
  private List<FormSectionDef> allSectionDefs;
  private List<FormSectionDefImpl> sectionDefImpls;
  private List<FormSectionDef> sectionDefs;

  protected FormDefImpl(PageRepoDefImpl pageRepoDefImpl, PagePath pagePath, FormDefSource source) {
    super(pageRepoDefImpl, pagePath, source);
    this.propertyDefImpls = createPropertyDefImpls(source.getProperties());
    this.sectionDefImpls = createSectionDefImpls(source.getSections());
    this.propertyDefs = Collections.unmodifiableList(getPropertyDefImpls());
    this.sectionDefs = Collections.unmodifiableList(getSectionDefImpls());
  }

  List<FormSectionDefImpl> getAllSectionDefImpls() {
    return allSectionDefImpls;
  }

  @Override
  public List<FormSectionDef> getAllSectionDefs() {
    return allSectionDefs;
  }

  List<PagePropertyDefImpl> getPropertyDefImpls() {
    return propertyDefImpls;
  }

  @Override
  public List<PagePropertyDef> getPropertyDefs() {
    return propertyDefs;
  }

  List<FormSectionDefImpl> getSectionDefImpls() {
    return sectionDefImpls;
  }

  @Override
  public List<FormSectionDef> getSectionDefs() {
    return sectionDefs;
  }

  @Override
  protected void createUsedIfDefImpls() {
    super.createUsedIfDefImpls();
    for (FormSectionDefImpl sectionDefImpl : allSectionDefImpls) {
      sectionDefImpl.createUsedIfDefImpl();
    }
  }

  protected List<FormSectionDefImpl> createSectionDefImpls(List<FormSectionDefSource> sectionSources) {
    List<FormSectionDefImpl> rtn = new ArrayList<>();
    for (FormSectionDefSource sectionSource : sectionSources) {
      rtn.add(new FormSectionDefImpl(this, sectionSource));
    }
    allSectionDefImpls.addAll(rtn);
    allSectionDefs = Collections.unmodifiableList(allSectionDefImpls);
    return rtn;
  }
}
