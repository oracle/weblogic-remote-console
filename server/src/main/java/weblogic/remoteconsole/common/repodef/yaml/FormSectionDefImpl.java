// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.util.Collections;
import java.util.List;

import weblogic.remoteconsole.common.repodef.FormDef;
import weblogic.remoteconsole.common.repodef.FormSectionDef;
import weblogic.remoteconsole.common.repodef.FormSectionUsedIfDef;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.repodef.schema.FormSectionDefSource;
import weblogic.remoteconsole.common.repodef.schema.UsedIfDefSource;
import weblogic.remoteconsole.common.utils.StringUtils;

public class FormSectionDefImpl implements FormSectionDef {

  private FormDefImpl formDefImpl;
  private FormSectionDefSource source;
  private LocalizableString title;
  private LocalizableString introductionHTML;
  private List<PagePropertyDefImpl> propertyDefImpls;
  private List<PagePropertyDef> propertyDefs;
  private List<FormSectionDefImpl> sectionDefImpls;
  private List<FormSectionDef> sectionDefs;
  private FormSectionUsedIfDefImpl usedIfDefImpl;

  FormSectionDefImpl(FormDefImpl formDefImpl, FormSectionDefSource source) {
    this.formDefImpl = formDefImpl;
    this.source = source;
    String englishTitle = source.getTitle();
    String name = source.getName();
    if (StringUtils.isEmpty(name)) {
      name = englishTitle; // close enough - we don't really have any other unique identifier
    }
    this.title =
      new LocalizableString(
        getLocalizationKey(name, "title"),
        englishTitle
      );
    this.introductionHTML =
      new LocalizableString(
        getLocalizationKey(name, "introductionHTML"),
        source.getIntroductionHTML()
      );
    this.propertyDefImpls = getFormDefImpl().createPropertyDefImpls(source.getProperties());
    this.sectionDefImpls = getFormDefImpl().createSectionDefImpls(source.getSections());
    this.propertyDefs = Collections.unmodifiableList(getPropertyDefImpls());
    this.sectionDefs = Collections.unmodifiableList(getSectionDefImpls());
    // Note - can't create the used if yet since it needs to find the property that it references,
    // but that property might not have been created yet
  }

  // The PageDefImpl will call this after all the properties on the page have been created,
  // making it possible for the used if to find the property that it references.
  void createUsedIfDefImpl() {
    UsedIfDefSource usedIfSource = source.getUsedIf();
    if (usedIfSource != null) {
      usedIfDefImpl = new FormSectionUsedIfDefImpl(this, usedIfSource);
    }
  }

  FormDefImpl getFormDefImpl() {
    return formDefImpl;
  }

  @Override
  public FormDef getFormDef() {
    return getFormDefImpl();
  }

  @Override
  public LocalizableString getTitle() {
    return title;
  }

  @Override
  public LocalizableString getIntroductionHTML() {
    return introductionHTML;
  }

  FormSectionUsedIfDefImpl getUsedIfDefImpl() {
    return usedIfDefImpl;
  }

  @Override
  public FormSectionUsedIfDef getUsedIfDef() {
    return getUsedIfDefImpl();
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

  private String getLocalizationKey(String name, String category) {
    return "sections." + name + "." + category;
  }

  @Override
  public String toString() {
    return getFormDefImpl() + " FormSectionDefImpl<" + getTitle() + ">";
  }
}
