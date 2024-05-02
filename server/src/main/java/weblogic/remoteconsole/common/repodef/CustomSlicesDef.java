// Copyright (c) 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.ArrayList;
import java.util.List;

import weblogic.remoteconsole.common.utils.ListUtils;

/**
 * POJO that implements SlicesDef.
 * 
 * Used for building custom pages.
 */
public class CustomSlicesDef implements SlicesDef {
  private PageRepoDef pageRepoDef;
  private BeanTypeDef typeDef;
  private List<SliceDef> contentDefs = new ArrayList<>();

  private FormDef formDef;
  private LocalizableString title;
  private LocalizableString introductionHTML;
  private FormSectionUsedIfDef usedIfDef;
  List<PagePropertyDef> propertyDefs = new ArrayList<>();
  List<FormSectionDef> sectionDefs = new ArrayList<>();

  public CustomSlicesDef() {
  }

  public CustomSlicesDef(SlicesDef toClone) {
    setPageRepoDef(toClone.getPageRepoDef());
    setTypeDef(toClone.getTypeDef());
    getContentDefs().addAll(ListUtils.nonNull(toClone.getContentDefs()));
  }

  @Override
  public PageRepoDef getPageRepoDef() {
    return pageRepoDef;
  }

  public void setPageRepoDef(PageRepoDef val) {
    pageRepoDef = val;
  }

  public CustomSlicesDef pageRepoDef(PageRepoDef val) {
    setPageRepoDef(val);
    return this;
  }

  @Override
  public BeanTypeDef getTypeDef() {
    return typeDef;
  }

  public void setTypeDef(BeanTypeDef val) {
    typeDef = val;
  }

  public CustomSlicesDef typeDef(BeanTypeDef val) {
    setTypeDef(val);
    return this;
  }

  @Override
  public List<SliceDef> getContentDefs() {
    return contentDefs;
  }

  public void setContentDefs(List<SliceDef> val) {
    contentDefs = val;
  }

  public CustomSlicesDef contentDefs(List<SliceDef> val) {
    setContentDefs(val);
    return this;
  }
}
