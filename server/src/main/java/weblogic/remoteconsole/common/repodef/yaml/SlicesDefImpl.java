// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.PageRepoDef;
import weblogic.remoteconsole.common.repodef.SliceDef;
import weblogic.remoteconsole.common.repodef.SlicesDef;
import weblogic.remoteconsole.common.repodef.schema.SliceDefSource;
import weblogic.remoteconsole.common.repodef.schema.SlicesDefSource;

/**
 * yaml-based implementation of the SlicesDef interface.
 */
public class SlicesDefImpl implements SlicesDef {
  private PageRepoDefImpl pageRepoDefImpl;
  private BaseBeanTypeDefImpl typeDefImpl;
  private SlicesDefSource source;
  private List<SliceDefImpl> contentDefImpls = new ArrayList<>();
  private List<SliceDef> contentDefs;

  SlicesDefImpl(
    PageRepoDefImpl pageRepoDefImpl,
    SlicesDefSource source,
    BaseBeanTypeDefImpl typeDefImpl
  ) {
    this.pageRepoDefImpl = pageRepoDefImpl;
    this.source = source;
    this.typeDefImpl = typeDefImpl;
    for (SliceDefSource sliceDefSource : getSource().getSlices()) {
      getContentDefImpls().add(new SliceDefImpl(this, sliceDefSource, null));
    }
    this.contentDefs = Collections.unmodifiableList(getContentDefImpls());
  }

  PageRepoDefImpl getPageRepoDefImpl() {
    return this.pageRepoDefImpl;
  }

  @Override
  public PageRepoDef getPageRepoDef() {
    return getPageRepoDefImpl();
  }

  private SlicesDefSource getSource() {
    return this.source;
  }

  BaseBeanTypeDefImpl getTypeDefImpl() {
    return this.typeDefImpl;
  }

  @Override
  public BeanTypeDef getTypeDef() {
    return getTypeDefImpl();
  }

  List<SliceDefImpl> getContentDefImpls() {
    return this.contentDefImpls;
  }

  @Override
  public List<SliceDef> getContentDefs() {
    return this.contentDefs;
  }

  List<String> getAlternateSliceSources() {
    return getSource().getAlternateSliceSources();
  }
}
