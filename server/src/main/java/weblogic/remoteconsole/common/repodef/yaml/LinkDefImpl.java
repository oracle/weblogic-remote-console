// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import weblogic.remoteconsole.common.repodef.LinkDef;
import weblogic.remoteconsole.common.repodef.LinksDef;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.schema.LinkDefSource;
import weblogic.remoteconsole.common.utils.StringUtils;

/**
 * yaml-based implementation of the LinkDef interface.
 */
class LinkDefImpl implements LinkDef {
  private LinksDefImpl linksDefImpl;
  private LinkDefSource source;
  private boolean isCollectionLink;
  private LocalizableString notFoundMessage;
  private LocalizableString label;

  LinkDefImpl(LinksDefImpl linksDefImpl, LinkDefImpl toClone) {
    this(linksDefImpl, toClone.getSource(), toClone.isCollectionLink);
  }

  LinkDefImpl(LinksDefImpl linksDefImpl, LinkDefSource source, boolean isCollectionLink) {
    this.linksDefImpl = linksDefImpl;
    this.source = source;
    this.isCollectionLink = isCollectionLink;
    String englishNotFoundMessage = source.getNotFoundMessage();
    if (StringUtils.notEmpty(englishNotFoundMessage)) {
      notFoundMessage =
        new LocalizableString(getLocalizationKey("notfound." + englishNotFoundMessage), englishNotFoundMessage);
    }
    String englishLabel = source.getLabel();
    label = new LocalizableString(getLocalizationKey("label." + englishLabel), englishLabel);
  }

  private LinksDefImpl getLinksDefImpl() {
    return linksDefImpl;
  }

  @Override
  public LinksDef getLinkDefs() {
    return getLinksDefImpl();
  }

  LinkDefSource getSource() {
    return source;
  }

  private boolean isCollectionLink() {
    return isCollectionLink;
  }

  @Override
  public String getRoot() {
    return getSource().getRoot();
  }

  @Override
  public String getResourceData() {
    return getSource().getResourceData();
  }

  @Override
  public LocalizableString getNotFoundMessage() {
    return notFoundMessage;
  }

  @Override
  public LocalizableString getLabel() {
    return label;
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
