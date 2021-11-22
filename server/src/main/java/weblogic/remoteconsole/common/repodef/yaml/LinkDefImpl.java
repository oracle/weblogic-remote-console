// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import weblogic.remoteconsole.common.repodef.LinkDef;
import weblogic.remoteconsole.common.repodef.LinksDef;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.schema.LinkDefSource;

/**
 * yaml-based implementation of the LinkDef interface.
 */
class LinkDefImpl implements LinkDef {
  private LinksDefImpl linksDefImpl;
  private LinkDefSource source;
  private boolean isCollectionLink;
  private LocalizableString notFoundMessage;
  private LocalizableString label;

  LinkDefImpl(LinksDefImpl linksDefImpl, LinkDefSource source, boolean isCollectionLink) {
    this.linksDefImpl = linksDefImpl;
    this.source = source;
    this.isCollectionLink = isCollectionLink;
    this.notFoundMessage =
      new LocalizableString(getLocalizationKey("notfound"), source.getNotFoundMessage());
    String englishLabel = source.getLabel();
    this.label = new LocalizableString(getLocalizationKey(englishLabel + ".label"), englishLabel);
  }

  private LinksDefImpl getLinksDefImpl() {
    return this.linksDefImpl;
  }

  @Override
  public LinksDef getLinkDefs() {
    return getLinksDefImpl();
  }

  private LinkDefSource getSource() {
    return this.source;
  }

  private boolean isCollectionLink() {
    return this.isCollectionLink;
  }

  @Override
  public String getResourceData() {
    return getSource().getResourceData();
  }

  @Override
  public LocalizableString getNotFoundMessage() {
    return this.notFoundMessage;
  }

  @Override
  public LocalizableString getLabel() {
    return this.label;
  }

  private String getLocalizationKey(String key) {
    StringBuilder sb = new StringBuilder();
    sb.append("link.").append(key);
    if (isCollectionLink()) {
      sb.append(".collection");
    } else {
      sb.append(".instance");
    }
    return getLinksDefImpl().getTypeDefImpl().getLocalizationKey(sb.toString());
  }
}
