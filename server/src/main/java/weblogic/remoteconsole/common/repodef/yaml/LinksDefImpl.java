// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
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
    return pageRepoDefImpl;
  }

  @Override
  public PageRepoDef getPageRepoDef() {
    return getPageRepoDefImpl();
  }

  BaseBeanTypeDefImpl getTypeDefImpl() {
    return typeDefImpl;
  }

  @Override
  public BeanTypeDef getTypeDef() {
    return getTypeDefImpl();
  }

  List<LinkDefImpl> getInstanceLinkDefImpls() {
    return instanceLinkDefImpls;
  }

  @Override
  public List<LinkDef> getInstanceLinkDefs() {
    return instanceLinkDefs;
  }

  List<LinkDefImpl> getCollectionLinkDefImpls() {
    return collectionLinkDefImpls;
  }

  @Override
  public List<LinkDef> getCollectionLinkDefs() {
    return collectionLinkDefs;
  }

  private void createLinkDefImpls() {
    if (source != null) {
      for (LinkDefSource linkDefSource : source.getInstanceLinks()) {
        if (pageRepoDefImpl.getBeanRepoDefImpl().supportsCapabilities(linkDefSource.getRequiredCapabilities())) {
          getInstanceLinkDefImpls().add(new LinkDefImpl(this, linkDefSource, false));
        }
      }
      for (LinkDefSource linkDefSource : source.getCollectionLinks()) {
        if (pageRepoDefImpl.getBeanRepoDefImpl().supportsCapabilities(linkDefSource.getRequiredCapabilities())) {
          getCollectionLinkDefImpls().add(new LinkDefImpl(this, linkDefSource, true));
        }
      }
    } else {
      copyInheritedLinks(getTypeDefImpl());
    }
    instanceLinkDefs = Collections.unmodifiableList(getInstanceLinkDefImpls());
    collectionLinkDefs = Collections.unmodifiableList(getCollectionLinkDefImpls());
  }

  private void copyInheritedLinks(BaseBeanTypeDefImpl typeDefImpl) {
    for (BaseBeanTypeDefImpl inheritedTypeDefImpl : typeDefImpl.getInheritedTypeDefImpls()) {
      LinksDefImpl inheritedLinksDefImpl = pageRepoDefImpl.getLinksDefImpl(inheritedTypeDefImpl);
      if (inheritedLinksDefImpl != null) {
        for (LinkDefImpl inheritedLinkDefImpl : inheritedLinksDefImpl.getInstanceLinkDefImpls()) {
          getInstanceLinkDefImpls().add(new LinkDefImpl(this, inheritedLinkDefImpl));
        }
        for (LinkDefImpl inheritedLinkDefImpl : inheritedLinksDefImpl.getCollectionLinkDefImpls()) {
          getCollectionLinkDefImpls().add(new LinkDefImpl(this, inheritedLinkDefImpl));
        }
      } else {
        copyInheritedLinks(inheritedTypeDefImpl);
      }
    }
  }
}
