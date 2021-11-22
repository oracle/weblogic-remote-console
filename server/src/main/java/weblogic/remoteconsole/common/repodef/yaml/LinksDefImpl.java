// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.LinkDef;
import weblogic.remoteconsole.common.repodef.LinksDef;
import weblogic.remoteconsole.common.repodef.PageRepoDef;
import weblogic.remoteconsole.common.repodef.schema.LinkDefSource;
import weblogic.remoteconsole.common.repodef.schema.LinksDefSource;

/**
 * yaml-based implemetation of the LinksDef interface
 */
class LinksDefImpl implements LinksDef {
  private PageRepoDefImpl pageRepoDefImpl;
  private BaseBeanTypeDefImpl typeDefImpl;
  private LinksDefSource source;
  private List<LinkDefImpl> instanceLinkDefImpls = new ArrayList<>();
  private List<LinkDef> instanceLinkDefs;
  private List<LinkDefImpl> collectionLinkDefImpls = new ArrayList<>();
  private List<LinkDef> collectionLinkDefs;

  LinksDefImpl(
    PageRepoDefImpl pageRepoDefImpl,
    LinksDefSource source,
    BaseBeanTypeDefImpl typeDefImpl
  ) {
    this.pageRepoDefImpl = pageRepoDefImpl;
    this.source = source;
    this.typeDefImpl = typeDefImpl;
    createLinkDefImpls();
  }

  PageRepoDefImpl getPageRepoDefImpl() {
    return this.pageRepoDefImpl;
  }

  @Override
  public PageRepoDef getPageRepoDef() {
    return getPageRepoDefImpl();
  }

  BaseBeanTypeDefImpl getTypeDefImpl() {
    return this.typeDefImpl;
  }

  @Override
  public BeanTypeDef getTypeDef() {
    return getTypeDefImpl();
  }

  private LinksDefSource getSource() {
    return this.source;
  }

  List<LinkDefImpl> getInstanceLinkDefImpls() {
    return this.instanceLinkDefImpls;
  }

  @Override
  public List<LinkDef> getInstanceLinkDefs() {
    return this.instanceLinkDefs;
  }

  List<LinkDefImpl> getCollectionLinkDefImpls() {
    return this.collectionLinkDefImpls;
  }

  @Override
  public List<LinkDef> getCollectionLinkDefs() {
    return this.collectionLinkDefs;
  }

  private void createLinkDefImpls() {
    for (LinkDefSource linkDefSource : getSource().getInstanceLinks()) {
      getInstanceLinkDefImpls().add(new LinkDefImpl(this, linkDefSource, false));
    }
    for (LinkDefSource linkDefSource : getSource().getCollectionLinks()) {
      getCollectionLinkDefImpls().add(new LinkDefImpl(this, linkDefSource, true));
    }
    this.instanceLinkDefs = Collections.unmodifiableList(getInstanceLinkDefImpls());
    this.collectionLinkDefs = Collections.unmodifiableList(getCollectionLinkDefImpls());
  }
}
