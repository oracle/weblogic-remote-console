// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.util.ArrayList;
import java.util.List;

import weblogic.remoteconsole.common.repodef.BeanChildDef;
import weblogic.remoteconsole.common.repodef.BeanChildNavTreeNodeDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.schema.NavTreeNodeDefSource;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;

/**
 * yaml-based implemetation of the BeaChildNavTreeNodeDef interface
 */
class BeanChildNavTreeNodeDefImpl extends NavTreeNodeDefImpl implements BeanChildNavTreeNodeDef {
  private List<BeanChildDef> childDefs = new ArrayList<>();
  private String nodeName;
  private LocalizableString label;
  private boolean exists = true;

  // Write a method to create the node so that we can return null
  // if the node refers to a type that doesn't exist in the current
  // page repo def (so that we can just omit it from the nav tree)
  static BeanChildNavTreeNodeDefImpl newNode(
    NavTreeDefImpl navTreeDefImpl,
    NavTreeNodeDefSource source,
    GroupNavTreeNodeDefImpl groupNodeDefImpl
  ) {
    BeanChildNavTreeNodeDefImpl node =
      new BeanChildNavTreeNodeDefImpl(navTreeDefImpl, source, groupNodeDefImpl);
    if (!node.exists) {
      return null;
    } else {
      return node;
    }
  }

  BeanChildNavTreeNodeDefImpl(
    NavTreeDefImpl navTreeDefImpl,
    NavTreeNodeDefSource source,
    GroupNavTreeNodeDefImpl groupNodeDefImpl
  ) {
    super(navTreeDefImpl, source, groupNodeDefImpl);
    BeanTypeDef typeDef = getNavTreeDef().getTypeDef();
    Path childPath = new Path(source.getChild());
    for (String childName : childPath.getComponents()) {
      BeanChildDef childDef = typeDef.getChildDef(new Path(childName));
      if (childDef == null) {
        this.exists = false;
        return;
      }
      typeDef = childDef.getChildTypeDef();
      getChildDefs().add(childDef);
    }
    if (getChildDefs().isEmpty()) {
      throw new AssertionError("Empty childPath " + childPath + " for " + navTreeDefImpl.getTypeDef());
    }
    if (!source.getContents().isEmpty()) {
      throw new AssertionError("Source has contents: " + childPath + " for " + navTreeDefImpl.getTypeDef());
    }
    if (StringUtils.isEmpty(getSource().getLabel())) {
      // The node doesn't customize the label.  Use the one from the bean child def.
      BeanChildDef childDef = getLastChildDef();
      this.nodeName = childDef.getChildName();
      this.label = childDef.getLabel();
    } else {
      // The node customizes the label.  Use it.
      this.nodeName = getSource().getLabel(); // English version of the label
      this.label = new LocalizableString(getLocalizationKey("label"), getNodeName());
    }
  }

  @Override
  public List<BeanChildDef> getChildDefs() {
    return this.childDefs;
  }

  @Override
  public LocalizableString getLabel() {
    return this.label;
  }

  @Override
  public String getNodeName() {
    return this.nodeName;
  }
}
