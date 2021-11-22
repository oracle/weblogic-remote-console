// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;

import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.repodef.TableActionDef;
import weblogic.remoteconsole.common.repodef.TableActionUsedIfDef;
import weblogic.remoteconsole.common.repodef.schema.BeanActionDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.BeanActionDefSource;
import weblogic.remoteconsole.common.repodef.schema.TableActionDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.UsedIfDefSource;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.common.utils.WebLogicRoles;

/**
 * yaml-based implementation of the TableActionDef interface.
 */
class TableActionDefImpl extends BeanActionDefImpl implements TableActionDef {
  private PageDefImpl pageDefImpl;
  private TableActionDefCustomizerSource pageLevelCustomizerSource;
  private LocalizableString label;
  private TableActionUsedIfDefImpl usedIfDefImpl;
  private List<TableActionDefImpl> actionDefImpls = new ArrayList<>();
  private List<TableActionDef> actionDefs;

  static TableActionDefImpl create(PageDefImpl pageDefImpl, TableActionDefCustomizerSource actionCustomizerSource) {
    if (!actionCustomizerSource.getActions().isEmpty()) {
      // This is just a group of actions.  We have a label, but no underlying bean action.
      // Make sure the type doesn't have an action that matches the group name
      // (otherwise the developer could think that the group level node could be used
      // to invoke the action too).
      if (pageDefImpl.getTypeDefImpl().hasActionDef(new Path(actionCustomizerSource.getName()))) {
        throw new AssertionError(
          "Action group name matches a bean action name:" 
          + " " + actionCustomizerSource.getName()
          + " " + pageDefImpl.getTypeDefImpl()
        );
      }
      // Create a dummy action def source so that we can just reuse BeanActionDefImpl.
      BeanActionDefSource actionSource = new BeanActionDefSource();
      actionSource.setName(actionCustomizerSource.getName());
      actionSource.setType("void");
      actionCustomizerSource.setDefinition(actionSource);
      TableActionDefImpl actionDefImpl = new TableActionDefImpl(pageDefImpl, actionCustomizerSource);
      if (actionDefImpl.getActionDefs().isEmpty()) {
        // The user isn't allowed to access any of the actions in this group so nix the group.
        return null;
      }
      return actionDefImpl;
    } else if (actionCustomizerSource.getDefinition() == null) {
      // Find the action on the type
      BeanActionDefImpl beanActionDefImpl =
        pageDefImpl.getTypeDefImpl().getActionDefImpl(new Path(actionCustomizerSource.getName()));
      if (beanActionDefImpl == null) {
        return null;
      }
      // Make a copy of the action and overlay any page-specific customizations
      return new TableActionDefImpl(pageDefImpl, beanActionDefImpl, actionCustomizerSource);
    } else {
      // The action isn't on the type.  Instead the 'definition' in the PDY
      // gives the rest of the info about the action.
      // Copy over the name so that we don't need to specify it twice in the PDY:
      actionCustomizerSource.getDefinition().setName(actionCustomizerSource.getName());
      return new TableActionDefImpl(pageDefImpl, actionCustomizerSource);
    }
  }

  // The table action is backed by a bean property
  private TableActionDefImpl(
    PageDefImpl pageDefImpl,
    BeanActionDefImpl beanActionDefImpl,
    TableActionDefCustomizerSource pageLevelCustomizerSource
  ) {
    super(
      beanActionDefImpl.getTypeDefImpl(),
      beanActionDefImpl.getParentPath(),
      beanActionDefImpl.getSource(),
      mergeCustomizerSources(beanActionDefImpl.getCustomizerSource(), pageLevelCustomizerSource)
    );
    initialize(pageDefImpl, pageLevelCustomizerSource);
  }

  // The page property is not backed by a bean action (i.e. is a computed action that's only on the page)
  // Instead, its 'definition' contains the rest of the action's description.
  private TableActionDefImpl(
    PageDefImpl pageDefImpl,
    TableActionDefCustomizerSource pageLevelCustomizerSource
  ) {
    super(
      null, // no BeanTypeDefImpl
      new Path(), // the action lives at the page level
      pageLevelCustomizerSource.getDefinition(), // the PDY defines the action (v.s. FooBean.yaml)
      pageLevelCustomizerSource // and the PDY customizes the definition (just like for a bean based action)
    );
    initialize(pageDefImpl, pageLevelCustomizerSource);
  }

  private void initialize(
    PageDefImpl pageDefImpl,
    TableActionDefCustomizerSource pageLevelCustomizerSource
  ) {
    this.pageLevelCustomizerSource = pageLevelCustomizerSource;
    this.pageDefImpl = pageDefImpl;
    // since we always create the actions after the columns,
    // we can rely on the property referenced by the usedIf already having been created
    createUsedIfDefImpl();
    createActionDefImpls();
    this.actionDefs = Collections.unmodifiableList(getActionDefImpls());
    // Initialize the label after the actions since the i18n key depends
    // on whether this action contains actions or not.
    initializeLabel();
  }

  // The PageDefImpl will call this after all the properties on the page have been created,
  // making it possible for the used if to find the property that it references.
  private void createUsedIfDefImpl() {
    UsedIfDefSource usedIfSource = getCustomizerSource().getUsedIf();
    if (usedIfSource != null) {
      usedIfDefImpl = new TableActionUsedIfDefImpl(this, usedIfSource);
    }
  }

  private void createActionDefImpls() {
    for (TableActionDefCustomizerSource actionCustomizerSource : pageLevelCustomizerSource.getActions()) {
      TableActionDefImpl actionDefImpl = create(pageDefImpl, actionCustomizerSource);
      if (actionDefImpl != null) {
        actionDefImpls.add(actionDefImpl);
      }
    }
  }

  TableActionUsedIfDefImpl getUsedIfDefImpl() {
    return usedIfDefImpl;
  }

  @Override
  public TableActionUsedIfDef getUsedIfDef() {
    return getUsedIfDefImpl();
  }

  PageDefImpl getPageDefImpl() {
    return pageDefImpl;
  }

  @Override
  public PageDef getPageDef() {
    return getPageDefImpl();
  }

  @Override
  public LocalizableString getLabel() {
    return this.label;
  }

  @Override
  public String getActionMethod() {
    return getCustomizerSource().getActionMethod();
  }

  List<TableActionDefImpl> getActionDefImpls() {
    return actionDefImpls;
  }

  @Override
  public List<TableActionDef> getActionDefs() {
    return actionDefs;
  }

  @Override
  public Set<String> getInvokeRoles() {
    if (getActionDefs().isEmpty()) {
      // This is an invokable action
      return WebLogicRoles.ALL;
    } else {
      // This is just a group of actions.  Anyone is allowed to access it.
      return WebLogicRoles.ALL;
    }
  }

  private static BeanActionDefCustomizerSource mergeCustomizerSources(
    BeanActionDefCustomizerSource typeLevelCustomizerSource,
    BeanActionDefCustomizerSource pageLevelCustomizerSource
  ) {
    BeanActionDefCustomizerSource rtn = new BeanActionDefCustomizerSource();
    rtn.merge(typeLevelCustomizerSource, new Path());
    rtn.merge(pageLevelCustomizerSource, new Path());
    return rtn;
  }

  private void initializeLabel() {
    this.label = new LocalizableString(getLabelLocalizationKey(), getCustomizerSource().getLabel());
  }

  private String getLabelLocalizationKey() {
    boolean pageLevel = StringUtils.notEmpty(pageLevelCustomizerSource.getLabel());
    return getLocalizationKey("label", pageLevel);
  }
  
  private String getLocalizationKey(String key, boolean pageLevel) {
    if (!getActionDefs().isEmpty()) {
      // This is a group of actions.
      // FortifyIssueSuppression(DDA8FBF401445D050E2C6AB5ACC9B50D) Key Management: Hardcoded Encryption Key
      // Just a variable name
      key = "groups." + key;
    }
    if (pageLevel || pageLevelCustomizerSource.getDefinition() != null) {
      return
        getPageDefImpl().getLocalizationKey(
          "actions." + getActionPath().getDotSeparatedPath() + "." + key
        );
    } else {
      return getLocalizationKey(key); // the type-relative key
    }
  }

  @Override
  public String toString() {
    return getPageDef() + " action=" + getActionPath();
  }
}
