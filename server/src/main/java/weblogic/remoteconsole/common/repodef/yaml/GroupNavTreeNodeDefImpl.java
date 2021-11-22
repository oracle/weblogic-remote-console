// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.util.Collections;
import java.util.List;

import weblogic.remoteconsole.common.repodef.GroupNavTreeNodeDef;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.NavTreeNodeDef;
import weblogic.remoteconsole.common.repodef.schema.NavTreeNodeDefSource;
import weblogic.remoteconsole.common.utils.StringUtils;

/**
 * yaml-based implementation of the GroupNavTreeNodeDef interface.
 */
class GroupNavTreeNodeDefImpl extends NavTreeNodeDefImpl implements GroupNavTreeNodeDef {
  private List<NavTreeNodeDefImpl> contentDefImpls;
  private List<NavTreeNodeDef> contentDefs;
  private LocalizableString label;

  GroupNavTreeNodeDefImpl(
    NavTreeDefImpl navTreeDefImpl,
    NavTreeNodeDefSource source,
    GroupNavTreeNodeDefImpl groupNodeDefImpl
  ) {
    super(navTreeDefImpl, source, groupNodeDefImpl);
    if (StringUtils.isEmpty(source.getLabel())) {
      throw new AssertionError(
        "Group nav tree node does not specify label:"
        + " " + navTreeDefImpl.getTypeDef()
      );
    }
    if (StringUtils.notEmpty(source.getChild())) {
      throw new AssertionError(
        "Group nav tree node specifies child:"
        + " " + source.getChild()
        + " " + navTreeDefImpl.getTypeDef()
      );
    }
    // need to initialize label before contents since it's used to create the contents
    this.label =
      new LocalizableString(getLocalizationKey("label"), getNodeName());
    this.contentDefImpls =
      getNavTreeDefImpl().createNavTreeNodeDefImpls(source.getContents(), this);
    this.contentDefs = Collections.unmodifiableList(getContentDefImpls());
  }

  List<NavTreeNodeDefImpl> getContentDefImpls() {
    return this.contentDefImpls;
  }

  @Override
  public List<NavTreeNodeDef> getContentDefs() {
    return this.contentDefs;
  }

  @Override
  public LocalizableString getLabel() {
    return this.label;
  }

  @Override
  public String getNodeName() {
    return getSource().getLabel();
  }
}
