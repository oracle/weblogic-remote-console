// Copyright (c) 2022, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.weblogic;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import weblogic.console.schema.beaninfo.BeanActionDefSource;
import weblogic.console.schema.beaninfo.BeanPropertyDefSource;
import weblogic.console.schema.beaninfo.BeanTypeDefSource;
import weblogic.console.utils.Path;
import weblogic.console.utils.StringUtils;
import weblogic.remoteconsole.common.repodef.BeanActionDef;
import weblogic.remoteconsole.common.repodef.BeanChildDef;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanRepoDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.CreateFormPagePath;
import weblogic.remoteconsole.common.repodef.SlicePagePath;
import weblogic.remoteconsole.common.repodef.TablePagePath;
import weblogic.remoteconsole.common.repodef.schema.BeanActionDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.BeanPropertyDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.BeanTypeDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.CreateFormDefSource;
import weblogic.remoteconsole.common.repodef.schema.LinksDefSource;
import weblogic.remoteconsole.common.repodef.schema.MBeanAttributeDefSource;
import weblogic.remoteconsole.common.repodef.schema.MBeanOperationDefSource;
import weblogic.remoteconsole.common.repodef.schema.NavTreeDefSource;
import weblogic.remoteconsole.common.repodef.schema.PseudoBeanTypeDefSource;
import weblogic.remoteconsole.common.repodef.schema.SliceFormDefSource;
import weblogic.remoteconsole.common.repodef.schema.SliceTableDefSource;
import weblogic.remoteconsole.common.repodef.schema.SlicesDefSource;
import weblogic.remoteconsole.common.repodef.schema.SubTypeDefSource;
import weblogic.remoteconsole.common.repodef.schema.TableDefSource;
import weblogic.remoteconsole.common.repodef.yaml.SlicesDefImpl;

/**
 * Base implementation for dynamically creating the yaml that describes
 * the pages and types for a tree of beans that delegate to a corresponding
 * tree of weblogic runtime mbeans.
 *
 * For example, in the underlying weblogic mbeans, a DomainRuntimeMBean
 * has a collection of ServerLifeCycleRuntimeMBeans (used to start and stop
 * servers) and a collection of ServerRuntimeMBeans (used to see the stats
 * for each running server).
 * 
 * Users usually find this distinction confusing.  So, to have a better
 * user experience, the remote console fabricates a corresponding set of
 * of runtime mbeans that pull together the ServerLifeCycleRuntimeMBeans and
 * their corresponding ServerRuntimeMBeans.
 * 
 * The underlying mbean tree looks like:
 * 
 * DomainRuntime
 *   ServerLifeCycleRuntimes
 *     Server1
 *       Tasks
 *         Task1
 *     Server2 ...
 *   ServerRuntimeMBeans
 *      Server1
 *        ApplicationRuntimes
 *          App1
 *
 * The bean tree that the user sees looks like:
 * 
 * DomainRuntime
 *   CombinedServerRuntimes
 *     Server1 (running right now)
 *     - fabricated RunningServerRuntimeMBean
 *       ServerLifeCycleRuntime
 *       - fabricated DelegatedServerLifeCycleRuntimeServerLifeCycleMBean
 *       - delegates to DomainRuntime.ServerLifeCycleRuntimes.Server1
 *         Tasks
 *           Task1
 *            - fabricated DelegatedServerLifeCycleRuntimeTaskRuntimeMBean
 *            - delegates to DomainRuntime.ServerLifeCycleRuntimes.Server1.Tasks
 *       ServerRuntime
 *       - fabricated DelegatedServerRuntimeServerRuntimeMBean
 *       - delegates to DomainRuntime.ServerRuntimes.Server1
 *         ApplicationRuntimes
 *           App1
 *           - fabricated DelegatedServerRuntimeApplicationRuntimeMBean
 *           - delegates to DomainRuntime.ServerRuntimes.Server1.ApplicationRuntimes.App1
 *    Server2 (not running right now)
 *     - fabricated UnreachableServerRuntimeMBean
 *       ServerLifeCycleRuntime
 *       - fabricated DelegatedServerLifeCycleRuntimeServerLifeCycleMBean
 *       - delegates to DomainRuntime.ServerLifeCycleRuntimes.Server2
 *         Tasks ...
 * 
 * That is, we dynamically create one set of mbeans that delegate to
 * a ServerRuntimeMBean (and its children), and another set of mbeans
 * that delegate to a ServerLifeCycleRuntimeMBean (and its children).
 * 
 * This class (DelegatedRuntimeMBeanYamlReader) is used to help create the
 * page and type descriptions for these trees of delegate mbeans.
 */
abstract class DelegatedRuntimeMBeanYamlReader extends WebLogicBeanTypeYamlReader {

  private FabricatedRuntimeMBeanNameHandler nameHandler;

  DelegatedRuntimeMBeanYamlReader(WebLogicYamlReader yamlReader, FabricatedRuntimeMBeanNameHandler nameHandler) {
    super(yamlReader);
    this.nameHandler = nameHandler;
  }

  @Override
  BeanTypeDefSource getBeanTypeDefSource(BeanRepoDef repoDef, String type) {
    BeanTypeDefSource source = getYamlReader().getBeanTypeDefSource(repoDef, nameHandler.getUnfabricatedType(type));
    if (source == null) {
      // The type doesn't exist in this WLS version.
    }
    // Create the fabricated type that delegates to another type.
    BeanTypeDef undelTypeDef = repoDef.getTypeDef(nameHandler.getUnfabricatedType(type));
    if (undelTypeDef == null) {
      return null;
    }
    source.setName(nameHandler.getFabricatedJavaType(source.getName()));
    source.setBaseTypes(nameHandler.getFabricatedJavaTypes(source.getBaseTypes()));
    source.setDerivedTypes(nameHandler.getFabricatedJavaTypes(source.getDerivedTypes()));
    source.setActions(delegateActionDefs(undelTypeDef, source.getActions()));
    source.setProperties(delegatePropertyDefs(undelTypeDef, source.getProperties()));
    return source;
  }

  @Override
  PseudoBeanTypeDefSource getPseudoBeanTypeDefSource(BeanRepoDef repoDef, String type) {
    PseudoBeanTypeDefSource source =
      getYamlReader().getPseudoBeanTypeDefSource(repoDef, nameHandler.getUnfabricatedType(type));
    if (source == null) {
      // This isn't a pseudo type
      return null;
    }
    String name = source.getName();
    if (nameHandler.isFabricatableType(name)) {
      source.setName(nameHandler.getFabricatedJavaType(name));
    }
    String baseType = source.getBaseType();
    if (nameHandler.isFabricatableType(baseType)) {
      source.setBaseType(nameHandler.getFabricatedJavaType(baseType));
    }
    return source;
  }

  @Override
  public BeanTypeDefCustomizerSource getBeanTypeDefCustomizerSource(BeanTypeDef typeDef) {
    List<BeanPropertyDefCustomizerSource> undelPropertyCustomizers = new ArrayList<>();
    List<BeanActionDefCustomizerSource> undelActionCustomizers = new ArrayList<>();
    BeanTypeDef undelTypeDef = nameHandler.getUnfabricatedTypeDef(typeDef);
    BeanTypeDefCustomizerSource source =
      getYamlReader().getBeanTypeDefCustomizerSource(undelTypeDef);
    if (source == null) {
      source = new BeanTypeDefCustomizerSource();
    } else {
      undelPropertyCustomizers = source.getProperties();
      undelActionCustomizers = source.getActions();
      source.setProperties(new ArrayList<>());
      source.setActions(new ArrayList<>());
    }
    source.setInstanceName(undelTypeDef.getInstanceName());
    delegateProperties(undelTypeDef, undelPropertyCustomizers, source);
    delegateActions(undelTypeDef, undelActionCustomizers, source);
    delegateSubTypes(source);
    return source;
  }

  private void delegateProperties(
    BeanTypeDef undelTypeDef,
    List<BeanPropertyDefCustomizerSource> undelPropertyCustomizers,
    BeanTypeDefCustomizerSource source
  ) {
    for (BeanPropertyDef undelPropertyDef : undelTypeDef.getPropertyDefs()) {
      delegateProperty(undelPropertyDef, undelPropertyCustomizers, source);
    }
  }

  private void delegateProperty(
    BeanPropertyDef undelPropertyDef,
    List<BeanPropertyDefCustomizerSource> undelPropertyCustomizers,
    BeanTypeDefCustomizerSource source
  ) {
    BeanPropertyDefCustomizerSource propertyCustomizer =
      findOrCreatePropertyCustomizer(undelPropertyDef, undelPropertyCustomizers);
    fixMBeanAttributeJavadocLink(undelPropertyDef, propertyCustomizer);
    source.addProperty(propertyCustomizer);
  }

  private void fixMBeanAttributeJavadocLink(
    BeanPropertyDef undelPropertyDef,
    BeanPropertyDefCustomizerSource propertyCustomizer
  ) {
    // Find the leaf property def
    Path parentPath = undelPropertyDef.getParentPath();
    if (!parentPath.isEmpty()) {
      // The property lives in a child bean.
      // Find the corresponding property on the child bean.
      boolean searchSubTypes = true;
      BeanChildDef childDef =
        undelPropertyDef
          .getTypeDef() // e.g. ServerMBean
          .getChildDef(parentPath, searchSubTypes); // e.g. SSL.Enabled
      if (childDef != null) {
        undelPropertyDef =
          childDef
            .getChildTypeDef() // e.g. SSLMBean
            .getPropertyDef(
              new Path(undelPropertyDef.getPropertyName()), // e.g. Enabled
            searchSubTypes
          );
      } else {
        // The child isn't visible (e.g. excluded).  Skip the property.
        return;
      }
    } else {
      // The property lives directly on the bean.
    }
    BeanTypeDef undelTypeDef = undelPropertyDef.getTypeDef();
    if (!nameHandler.isFabricatableTypeDef(undelTypeDef)) {
      // The bean type isn't delegated so we don't need to fix its mbean javadoc link
      return;
    }
    // The bean type is delegated so we need to fix its mbean javadoc link
    MBeanAttributeDefSource mbeanAttr = new MBeanAttributeDefSource();
    mbeanAttr.setType(undelTypeDef.getTypeName());
    mbeanAttr.setAttribute(undelPropertyDef.getPropertyName());
    propertyCustomizer.setMbeanAttribute(mbeanAttr);
  }

  private BeanPropertyDefCustomizerSource findOrCreatePropertyCustomizer(
    BeanPropertyDef undelPropertyDef,
    List<BeanPropertyDefCustomizerSource> undelPropertyCustomizers
  ) {
    String propertyName = undelPropertyDef.getPropertyPath().getDotSeparatedPath();
    // See if the property was customized on the undelegated type.
    for (BeanPropertyDefCustomizerSource pc : undelPropertyCustomizers) {
      if (pc.getName().equals(propertyName)) {
        return pc;
      }
    }
    // It wasn't.  Make one.
    BeanPropertyDefCustomizerSource rtn = new BeanPropertyDefCustomizerSource();
    rtn.setName(propertyName);
    return rtn;
  }

  private void delegateActions(
    BeanTypeDef undelTypeDef,
    List<BeanActionDefCustomizerSource> undelActionCustomizers,
    BeanTypeDefCustomizerSource source
  ) {
    Set<String> localActionNames = getLocalActionNames(undelTypeDef, undelActionCustomizers);
    for (BeanActionDef undelActionDef : undelTypeDef.getActionDefs()) {
      if (localActionNames.contains(undelActionDef.getActionPath().toString())) {
        delegateAction(undelActionDef, undelActionCustomizers, source);
      }
    }
  }

  private Set<String> getLocalActionNames(
    BeanTypeDef undelTypeDef,
    List<BeanActionDefCustomizerSource> undelActionCustomizers
  ) {
    // Make a set of the actions defined or customized on this type (v.s. inherited)
    Set<String> rtn = new HashSet<>();
    {
      BeanTypeDefSource source =
        getYamlReader().getBeanTypeDefSource(undelTypeDef.getBeanRepoDef(), undelTypeDef.getTypeName());
      if (source != null) {
        for (BeanActionDefSource actionSource : source.getActions()) {
          rtn.add(actionSource.getName());
        }
      }
    }
    {
      for (BeanActionDefCustomizerSource actionSource :  undelActionCustomizers) {
        rtn.add(actionSource.getName());
      }
    }
    return rtn;
  }

  private void delegateAction(
    BeanActionDef undelActionDef,
    List<BeanActionDefCustomizerSource> undelActionCustomizers,
    BeanTypeDefCustomizerSource source
  ) {
    BeanActionDefCustomizerSource actionCustomizer =
      findOrCreateActionCustomizer(undelActionDef, undelActionCustomizers);
    fixMBeanOperationJavadocLink(undelActionDef, actionCustomizer);
    source.addAction(actionCustomizer);
  }

  private void fixMBeanOperationJavadocLink(
    BeanActionDef undelActionDef,
    BeanActionDefCustomizerSource actionCustomizer
  ) {
    // Find the leaf action def
    Path parentPath = undelActionDef.getParentPath();
    if (!parentPath.isEmpty()) {
      // The action lives in a child bean.
      // Find the corresponding action on the child bean.
      boolean searchSubTypes = true;
      BeanChildDef childDef =
        undelActionDef
          .getTypeDef()
          .getChildDef(parentPath, searchSubTypes);
      if (childDef != null) {
        undelActionDef =
          childDef
            .getChildTypeDef()
            .getActionDef(
              new Path(undelActionDef.getActionName()),
            searchSubTypes
          );
      } else {
        // The child isn't visible (e.g. excluded).  Skip the action.
        return;
      }
    } else {
      // The action lives directly on the bean.
    }
    BeanTypeDef undelTypeDef = undelActionDef.getTypeDef();
    if (!nameHandler.isFabricatableTypeDef(undelTypeDef)) {
      // The bean type isn't delegated so we don't need to fix its mbean javadoc link
      return;
    }
    MBeanOperationDefSource undelMbeanOp = actionCustomizer.getMbeanOperation();
    if (StringUtils.isEmpty(undelMbeanOp.getType())) {
      // The mbean type wasn't customized, so defaults to the bean type.
      // The bean type is delegated, so switch the mbean type to the
      // undelegated bean type.
      MBeanOperationDefSource delMbeanOp = new MBeanOperationDefSource();
      delMbeanOp.setType(undelTypeDef.getTypeName());
      delMbeanOp.setOperation(undelMbeanOp.getOperation());
      actionCustomizer.setMbeanOperation(delMbeanOp);
    }
  }

  private BeanActionDefCustomizerSource findOrCreateActionCustomizer(
    BeanActionDef undelActionDef,
    List<BeanActionDefCustomizerSource> undelActionCustomizers
  ) {
    String actionName = undelActionDef.getActionPath().getDotSeparatedPath();
    // See if the action was customized on the undelegated type.
    for (BeanActionDefCustomizerSource ac : undelActionCustomizers) {
      if (ac.getName().equals(actionName)) {
        return ac;
      }
    }
    // It wasn't.  Make one.
    BeanActionDefCustomizerSource rtn = new BeanActionDefCustomizerSource();
    rtn.setName(actionName);
    return rtn;
  }

  private void delegateSubTypes(BeanTypeDefCustomizerSource source) {
    // Switch any subTypes to their corresponding delegated types
    for (SubTypeDefSource subType : source.getSubTypes()) {
      String type = subType.getType();
      if (nameHandler.isFabricatableType(type)) {
        subType.setType(nameHandler.getFabricatedJavaType(type));
        // Normally, a runtime mbean's Type property is the same as the type name
        // so we just set the subtype Type and leave Value empty.
        // But, for delegated types, the Type property is still the undelegated
        // type (e.g. FooMBean) but the corresponding type name is the
        // delegated type (e.g. BlahFooMBean).
        // So, we need to set Type to BlahFooMBean and Value to FooMBean.
        String value = subType.getValue();
        if (StringUtils.isEmpty(value)) {
          value = type;
        }
        subType.setValue(value);
      }
    }
    String defaultSubType = source.getDefaultSubType();
    if (!StringUtils.isEmpty(defaultSubType)) {
      source.setDefaultSubType(nameHandler.getFabricatedJavaType(defaultSubType));
    }
  }

  @Override
  SliceFormDefSource getSliceFormDefSource(SlicePagePath pagePath, SlicesDefImpl slicesDefImpl) {
    return getYamlReader().getSliceFormDefSource(nameHandler.getUnfabricatedSlicePagePath(pagePath), slicesDefImpl);
  }

  @Override
  SliceTableDefSource getSliceTableDefSource(SlicePagePath pagePath, SlicesDefImpl slicesDefImpl) {
    return getYamlReader().getSliceTableDefSource(nameHandler.getUnfabricatedSlicePagePath(pagePath), slicesDefImpl);
  }

  @Override
  CreateFormDefSource getCreateFormDefSource(CreateFormPagePath pagePath) {
    return getYamlReader().getCreateFormDefSource(nameHandler.getUnfabricatedCreateFormPagePath(pagePath));
  }

  @Override
  TableDefSource getTableDefSource(TablePagePath pagePath) {
    return getYamlReader().getTableDefSource(nameHandler.getUnfabricatedTablePagePath(pagePath));
  }

  @Override
  SlicesDefSource getSlicesDefSource(BeanTypeDef typeDef) {
    return getYamlReader().getSlicesDefSource(nameHandler.getUnfabricatedTypeDef(typeDef));
  }

  @Override
  NavTreeDefSource getNavTreeDefSource(String type) {
    return getYamlReader().getNavTreeDefSource(nameHandler.getUnfabricatedType(type));
  }

  @Override
  LinksDefSource getLinksDefSource(BeanTypeDef typeDef) {
    return getYamlReader().getLinksDefSource(nameHandler.getUnfabricatedTypeDef(typeDef));
  }

  private List<BeanPropertyDefSource> delegatePropertyDefs(
    BeanTypeDef undelTypeDef,
    List<BeanPropertyDefSource> propertyDefs
  ) {
    List<BeanPropertyDefSource> rtn = new ArrayList<>();
    for (BeanPropertyDefSource propertyDef : propertyDefs) {
      if (propertyDef.isChild()) {
        if (undelTypeDef.hasChildDef(new Path(propertyDef.getName()), true)) {
          if (nameHandler.isFabricatableJavaType(propertyDef.getType())) {
            propertyDef.setType(nameHandler.getFabricatedJavaType(propertyDef.getType()));
          }
          rtn.add(propertyDef);
        } else {
          // the undelegated type trimmed out the child.  we should too.
        }
      } else {
        if (undelTypeDef.hasPropertyDef(new Path(propertyDef.getName()), true)) {
          rtn.add(propertyDef);
        } else {
          // the undelegated type trimmed out the property.  we should too.
        }
      }
    }
    return rtn;
  }

  private List<BeanActionDefSource> delegateActionDefs(
    BeanTypeDef undelTypeDef,
    List<BeanActionDefSource> actionDefs
  ) {
    // copy them as-is
    List<BeanActionDefSource> rtn = new ArrayList<>();
    for (BeanActionDefSource actionDef : actionDefs) {
      if (undelTypeDef.hasActionDef(new Path(actionDef.getName()), true)) {
        rtn.add(actionDef);
      } else {
        // the undelegated type trimmed out the action.  we should too.
      }
    }
    return rtn;
  }
}
