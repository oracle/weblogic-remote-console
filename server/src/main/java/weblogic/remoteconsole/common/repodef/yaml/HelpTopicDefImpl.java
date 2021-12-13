// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import weblogic.remoteconsole.common.repodef.HelpTopicDef;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.repodef.schema.HelpTopicDefSource;
import weblogic.remoteconsole.common.utils.WebLogicVersion;

/**
 * yaml-based implemetation of the HelpTopicDef interface
 */
class HelpTopicDefImpl implements HelpTopicDef {

  private PageDefImpl pageDefImpl;
  HelpTopicDefSource source;
  private LocalizableString label;
  int index; // used to generate localization keys
  private String href;

  HelpTopicDefImpl(
    PageDefImpl pageDefImpl,
    HelpTopicDefSource source,
    int index
  ) {
    this.pageDefImpl = pageDefImpl;
    this.source = source;
    this.index = index;
    this.label = new LocalizableString(getLocalizationKey("label"), getSource().getLabel());
    this.href = calculateHelpTopicHref();
  }

  PageDefImpl getPageDefImpl() {
    return pageDefImpl;
  }

  @Override
  public PageDef getPageDef() {
    return getPageDefImpl();
  }

  private HelpTopicDefSource getSource() {
    return source;
  }

  @Override
  public LocalizableString getLabel() {
    return label;
  }

  @Override
  public String getHref() {
    return href;
  }

  // Compute the absolute url of the public oracle documentation for a help topic.
  // Use WebLogicVersion to do it since the urls depend on the weblogic version.
  private String calculateHelpTopicHref() {
    HelpTopicDefSource.Type type = getSource().getType();
    String relativeHref = getSource().getHref();
    WebLogicVersion version =
      getPageDefImpl().getPageRepoDefImpl().getBeanRepoDefImpl().getMBeansVersion().getWebLogicVersion();
    if (HelpTopicDefSource.Type.edocs.equals(type)) {
      return version.getEdocsHelpTopicUrl(relativeHref);
    }
    if (HelpTopicDefSource.Type.generic.equals(type)) {
      return version.getGenericHelpTopicUrl(relativeHref);
    }
    throw new AssertionError("Unsupported help topic: type=" + type + " href=" + relativeHref);
  }

  private String getLocalizationKey(String key) {
    return getPageDefImpl().getLocalizationKey("helpTopic") + "." + index + "." + key;
  }
}
