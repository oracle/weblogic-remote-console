// Copyright (c) 2022, 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.weblogic;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import weblogic.remoteconsole.common.repodef.BeanActionDef;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanRepoDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.CreateFormPagePath;
import weblogic.remoteconsole.common.repodef.PagePath;
import weblogic.remoteconsole.common.repodef.SlicePagePath;
import weblogic.remoteconsole.common.repodef.TablePagePath;
import weblogic.remoteconsole.common.repodef.schema.BeanActionDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.BeanActionDefSource;
import weblogic.remoteconsole.common.repodef.schema.BeanPropertyDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.BeanPropertyDefSource;
import weblogic.remoteconsole.common.repodef.schema.BeanTypeDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.BeanTypeDefExtensionSource;
import weblogic.remoteconsole.common.repodef.schema.BeanTypeDefSource;
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
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;

/**
 * Fabricates the yaml for an aggregated runtime mbean type.
 */
class AggregatedRuntimeMBeanYamlReader extends WebLogicBeanTypeYamlReader {

  private static final AggregatedRuntimeMBeanNameHandler NAME_HANDLER = AggregatedRuntimeMBeanNameHandler.INSTANCE;

  AggregatedRuntimeMBeanYamlReader(WebLogicYamlReader yamlReader) {
    super(yamlReader);
  }

  @Override
  BeanTypeDefSource getBeanTypeDefSource(BeanRepoDef repoDef, String type) {
    BeanTypeDefSource source = getYamlReader().getBeanTypeDefSource(repoDef, NAME_HANDLER.getUnfabricatedType(type));
    if (source == null) {
      // The type doesn't exist in this WLS version.
      return null;
    }
    BeanTypeDef unaggTypeDef = repoDef.getTypeDef(NAME_HANDLER.getUnfabricatedType(type));
    if (unaggTypeDef == null) {
      return null;
    }
    // Add a server property that contains a reference to the corresponding ServerRuntimeMBean
    // that parents the corresponding unaggregated bean (used by the corresponding slice tables pages)
    BeanPropertyDefSource server = new BeanPropertyDefSource();
    server.setName("Server");
    server.setType("weblogic.management.runtime.ServerRuntimeMBean");
    server.setRelationship("reference");
    // Create the aggregated type
    source.setName(NAME_HANDLER.getFabricatedJavaType(source.getName()));
    source.setBaseTypes(NAME_HANDLER.getFabricatedJavaTypes(source.getBaseTypes()));
    source.setDerivedTypes(NAME_HANDLER.getFabricatedJavaTypes(source.getDerivedTypes()));
    // allow the actions to flow through as-is
    source.setProperties(aggregatePropertyDefs(unaggTypeDef, source.getProperties()));
    source.getProperties().add(server);
    return source;
  }

  @Override
  PseudoBeanTypeDefSource getPseudoBeanTypeDefSource(BeanRepoDef repoDef, String type) {
    PseudoBeanTypeDefSource source =
      getYamlReader().getPseudoBeanTypeDefSource(repoDef, NAME_HANDLER.getUnfabricatedType(type));
    if (source == null) {
      // This isn't a pseudo type
      return null;
    }
    String name = source.getName();
    if (NAME_HANDLER.isFabricatableType(name)) {
      source.setName(NAME_HANDLER.getFabricatedJavaType(name));
    }
    String baseType = source.getBaseType();
    if (NAME_HANDLER.isFabricatableType(baseType)) {
      source.setBaseType(NAME_HANDLER.getFabricatedJavaType(baseType));
    }
    return source;
  }

  @Override
  public BeanTypeDefCustomizerSource getBeanTypeDefCustomizerSource(BeanTypeDef typeDef) {
    List<BeanPropertyDefCustomizerSource> unaggPropertyCustomizers = new ArrayList<>();
    List<BeanActionDefCustomizerSource> unaggActionCustomizers = new ArrayList<>();
    BeanTypeDef unaggTypeDef = NAME_HANDLER.getUnfabricatedTypeDef(typeDef);
    BeanTypeDefCustomizerSource source =
      getYamlReader().getBeanTypeDefCustomizerSource(unaggTypeDef);
    if (source == null) {
      source = new BeanTypeDefCustomizerSource();
    } else {
      unaggPropertyCustomizers = source.getProperties();
      unaggActionCustomizers = source.getActions();
      source.setProperties(new ArrayList<>());
      source.setActions(new ArrayList<>());
    }
    source.setInstanceName(unaggTypeDef.getInstanceName());
    aggregateProperties(unaggTypeDef, unaggPropertyCustomizers, source);
    aggregateActions(unaggTypeDef, unaggActionCustomizers, source);
    aggregateSubTypes(unaggTypeDef, source);
    return source;
  }

  private void aggregateProperties(
    BeanTypeDef unaggTypeDef,
    List<BeanPropertyDefCustomizerSource> unaggPropertyCustomizers,
    BeanTypeDefCustomizerSource source
  ) {
    for (BeanPropertyDef unaggPropertyDef : unaggTypeDef.getPropertyDefs()) {
      aggregateProperty(unaggPropertyDef, unaggPropertyCustomizers, source);
    }
    // The aggregated type creates a 'Server' property.
    // Customize its javadoc link.
    BeanPropertyDefCustomizerSource server = new BeanPropertyDefCustomizerSource();
    server.setName("Server");
    MBeanAttributeDefSource mbeanAttr = new MBeanAttributeDefSource();
    mbeanAttr.setType("ServerRuntimeMBean");
    mbeanAttr.setAttribute("Name");
    server.setMbeanAttribute(mbeanAttr);
    source.addProperty(server);
  }

  private void aggregateProperty(
    BeanPropertyDef unaggPropertyDef,
    List<BeanPropertyDefCustomizerSource> unaggPropertyCustomizers,
    BeanTypeDefCustomizerSource source
  ) {
    BeanPropertyDefCustomizerSource propertyCustomizer =
      findOrCreatePropertyCustomizer(unaggPropertyDef, unaggPropertyCustomizers);
    fixMBeanAttributeJavadocLink(unaggPropertyDef, propertyCustomizer);
    source.addProperty(propertyCustomizer);
  }

  private void fixMBeanAttributeJavadocLink(
    BeanPropertyDef unaggPropertyDef,
    BeanPropertyDefCustomizerSource propertyCustomizer
  ) {
    // Find the leaf property def
    Path parentPath = unaggPropertyDef.getParentPath();
    if (!parentPath.isEmpty()) {
      // The property lives in a child bean.  Find the corresponding property on the child bean.
      boolean searchSubTypes = true;
      unaggPropertyDef =
        unaggPropertyDef
          .getTypeDef() // e.g. ServerMBean
          .getChildDef(parentPath, searchSubTypes) // e.g. SSL
          .getChildTypeDef() // e.g. SSLMBean
          .getPropertyDef(
            new Path(unaggPropertyDef.getPropertyName()), // e.g. Enabled
            searchSubTypes
          );
    } else {
      // The property lives directly on the bean.
    }
    BeanTypeDef unaggTypeDef = unaggPropertyDef.getTypeDef();
    if (!NAME_HANDLER.isFabricatableTypeDef(unaggTypeDef)) {
      // The bean type isn't aggregated so we don't need to fix its mbean javadoc link
      return;
    }
    // The bean type is aggregated so we need to fix its mbean javadoc link
    MBeanAttributeDefSource mbeanAttr = new MBeanAttributeDefSource();
    mbeanAttr.setType(unaggTypeDef.getTypeName());
    mbeanAttr.setAttribute(unaggPropertyDef.getPropertyName());
    propertyCustomizer.setMbeanAttribute(mbeanAttr);
  }

  private BeanPropertyDefCustomizerSource findOrCreatePropertyCustomizer(
    BeanPropertyDef unaggPropertyDef,
    List<BeanPropertyDefCustomizerSource> unaggPropertyCustomizers
  ) {
    String propertyName = unaggPropertyDef.getPropertyPath().getDotSeparatedPath();
    // See if the property was customized on the unaggregated type.
    for (BeanPropertyDefCustomizerSource pc : unaggPropertyCustomizers) {
      if (pc.getName().equals(propertyName)) {
        return pc;
      }
    }
    // It wasn't.  Make one.
    BeanPropertyDefCustomizerSource rtn = new BeanPropertyDefCustomizerSource();
    rtn.setName(propertyName);
    return rtn;
  }

  private void aggregateActions(
    BeanTypeDef unaggTypeDef,
    List<BeanActionDefCustomizerSource> unaggActionCustomizers,
    BeanTypeDefCustomizerSource source
  ) {
    Set<String> localActionNames = getLocalActionNames(unaggTypeDef, unaggActionCustomizers);
    for (BeanActionDef unaggActionDef : unaggTypeDef.getActionDefs()) {
      if (localActionNames.contains(unaggActionDef.getActionPath().toString())) {
        aggregateAction(unaggActionDef, unaggActionCustomizers, source);
      }
    }
  }

  private Set<String> getLocalActionNames(
    BeanTypeDef unaggTypeDef,
    List<BeanActionDefCustomizerSource> unaggActionCustomizers
  ) {
    // Make a set of the actions defined or customized on this type (v.s. inherited)
    Set<String> rtn = new HashSet<>();
    {
      BeanTypeDefSource source =
        getYamlReader().getBeanTypeDefSource(unaggTypeDef.getBeanRepoDef(), unaggTypeDef.getTypeName());
      if (source != null) {
        for (BeanActionDefSource actionSource : source.getActions()) {
          rtn.add(actionSource.getName());
        }
      }
    }
    {
      BeanTypeDefExtensionSource source = getYamlReader().getBeanTypeDefExtensionSource(unaggTypeDef);
      if (source != null) {
        for (BeanActionDefSource actionSource : source.getActions()) {
          rtn.add(actionSource.getName());
        }
      }
    }
    {
      for (BeanActionDefCustomizerSource actionSource :  unaggActionCustomizers) {
        rtn.add(actionSource.getName());
      }
    }
    return rtn;
  }

  private void aggregateAction(
    BeanActionDef unaggActionDef,
    List<BeanActionDefCustomizerSource> unaggActionCustomizers,
    BeanTypeDefCustomizerSource source
  ) {
    BeanActionDefCustomizerSource actionCustomizer =
      findActionCustomizer(unaggActionDef, unaggActionCustomizers);
    if (actionCustomizer != null) {
      fixMBeanOperationJavadocLink(unaggActionDef, actionCustomizer);
    } else {
      actionCustomizer = new BeanActionDefCustomizerSource();
      actionCustomizer.setName(unaggActionDef.getActionName());
    }
    actionCustomizer.setActionMethod(
       "weblogic.remoteconsole.customizers.AggregatedMBeanCustomizer.invokeAction"
    );
    source.addAction(actionCustomizer);
  }

  private void fixMBeanOperationJavadocLink(
    BeanActionDef unaggActionDef,
    BeanActionDefCustomizerSource actionCustomizer
  ) {
    // Find the leaf action def
    Path parentPath = unaggActionDef.getParentPath();
    if (!parentPath.isEmpty()) {
      // The action lives in a child bean.  Find the corresponding action on the child bean.
      boolean searchSubTypes = true;
      unaggActionDef =
        unaggActionDef
          .getTypeDef()
          .getChildDef(parentPath, searchSubTypes)
          .getChildTypeDef()
          .getActionDef(
            new Path(unaggActionDef.getActionName()),
            searchSubTypes
          );
    } else {
      // The action lives directly on the bean.
    }
    BeanTypeDef unaggTypeDef = unaggActionDef.getTypeDef();
    if (!NAME_HANDLER.isFabricatableTypeDef(unaggTypeDef)) {
      // The bean type isn't aggregated so we don't need to fix its mbean javadoc link
      return;
    }
    MBeanOperationDefSource unaggMbeanOp = actionCustomizer.getMbeanOperation();
    if (StringUtils.isEmpty(unaggMbeanOp.getType())) {
      // The mbean type wasn't customized, so defaults to the bean type.
      // The bean type is aggregated, so switch the mbean type to the
      // unaggregated bean type.
      MBeanOperationDefSource aggMbeanOp = new MBeanOperationDefSource();
      aggMbeanOp.setType(unaggTypeDef.getTypeName());
      aggMbeanOp.setOperation(unaggMbeanOp.getOperation());
      actionCustomizer.setMbeanOperation(aggMbeanOp);
    }
  }

  private BeanActionDefCustomizerSource findActionCustomizer(
    BeanActionDef unaggActionDef,
    List<BeanActionDefCustomizerSource> unaggActionCustomizers
  ) {
    String actionName = unaggActionDef.getActionPath().getDotSeparatedPath();
    // See if the action was customized on the unaggregated type.
    for (BeanActionDefCustomizerSource ac : unaggActionCustomizers) {
      if (ac.getName().equals(actionName)) {
        return ac;
      }
    }
    // It wasn't.
    return null;
  }

  private void aggregateSubTypes(BeanTypeDef unaggTypeDef, BeanTypeDefCustomizerSource source) {
    if (source.getSubTypes().isEmpty()) {
      return;
    }
    // Switch any subTypes to their corresponding aggregated types.
    // Also keep track of whether the base type is one of the instantiable types.
    String baseTypeValue = unaggTypeDef.getInstanceName();
    boolean foundBaseType = false;
    for (SubTypeDefSource subType : source.getSubTypes()) {
      if (baseTypeValue.equals(subType.getValue())) {
        foundBaseType = true;
      }
      String type = subType.getType();
      if (NAME_HANDLER.isFabricatableType(type)) {
        subType.setType(NAME_HANDLER.getFabricatedJavaType(type));
      }
    }
    String defaultSubType = source.getDefaultSubType();
    if (!StringUtils.isEmpty(defaultSubType)) {
      if (NAME_HANDLER.isFabricatableType(defaultSubType)) {
        source.setDefaultSubType(NAME_HANDLER.getFabricatedJavaType(defaultSubType));
      }
    }
    if (!foundBaseType) {
      // The base type isn't instantiable.  However, when there are currently
      // no instances of this type on any running server, we need to create an
      // aggregated bean anyway that will get us to an empty table.
      // And we need to set that bean's type to a valid sub type.
      //
      // We could just randomly pick one of the valid sub types, but
      // then we'd also add nav tree nodes for that type's children,
      // which isn't appropriate.
      //
      // Instead, add the base type as one of the valid sub types so we can use that.
      // Then we know that the child nav tree nodes make sense since they're
      // from the base type, i.e. are always supported.
      SubTypeDefSource baseSubType = new SubTypeDefSource();
      baseSubType.setType(NAME_HANDLER.getFabricatedJavaType(unaggTypeDef.getTypeName()));
      baseSubType.setValue(baseTypeValue);
      source.getSubTypes().add(baseSubType);
    }
  }

  @Override
  BeanTypeDefExtensionSource getBeanTypeDefExtensionSource(BeanTypeDef typeDef) {
    // Return the aggregated versions of any aggregatable extended properties the unaggregated type supports
    BeanTypeDef unaggTypeDef = NAME_HANDLER.getUnfabricatedTypeDef(typeDef);
    BeanTypeDefExtensionSource source =
      getYamlReader().getBeanTypeDefExtensionSource(unaggTypeDef);
    if (source == null) {
      return null;
    }
    source.setProperties(aggregatePropertyDefs(unaggTypeDef, source.getProperties()));
    // allow the actions to flow through as-is
    if (source.getProperties().isEmpty() && source.getActions().isEmpty()) {
      return null;
    }
    return source;
  }

  @Override
  SliceFormDefSource getSliceFormDefSource(SlicePagePath pagePath, SlicesDefImpl slicesDefImpl) {
    // Aggregated types do not support slice forms.
    // Instead, they create corresponding slice tables (see getSliceTableDefSource)
    return null;
  }

  @Override
  SliceTableDefSource getSliceTableDefSource(SlicePagePath pagePath, SlicesDefImpl slicesDefImpl) {
    SlicePagePath unaggPagePath = NAME_HANDLER.getUnfabricatedSlicePagePath(pagePath);
    SliceFormDefSource unaggSource = getYamlReader().getSliceFormDefSource(unaggPagePath, slicesDefImpl);
    if (unaggSource == null) {
      // This type doesn't support this slice.
      return null;
    }
    // Don't bother checking for slice tables on the unaggregated type since
    // there aren't any yet.  If we ever add them, then we'll
    // need to make an equivalent aggregated slice table that has
    // the same columns plus a Server column.
  
    // First see if we have a custom table.yaml for the aggegated type

    // There isn't a custom table for the aggregated type.
    // Create a default one that has a Server column plus a column for every property
    // on the unaggregated type's form for this slice plus a copy of the
    // unaggregated type's table's actions
    SliceTableDefSource source = new SliceTableDefSource();
    source.setIntroductionHTML(unaggSource.getIntroductionHTML());
    source.setHelpTopics(unaggSource.getHelpTopics());
    BeanPropertyDefCustomizerSource serverColumn = new BeanPropertyDefCustomizerSource();
    serverColumn.setName("Server");
    source.getDisplayedColumns().add(serverColumn);
    source.getDisplayedColumns().addAll(unaggSource.getProperties());
    source.getHiddenColumns().addAll(unaggSource.getAdvancedProperties());
    source.setGetTableRowsMethod("weblogic.remoteconsole.customizers.AggregatedMBeanCustomizer.getSliceTableRows");
    source.setSupportsNavigation(true);
    TablePagePath unaggTablePath = PagePath.newTablePagePath(unaggPagePath.getPagesPath());
    TableDefSource unaggTableSource = getYamlReader().getTableDefSource(unaggTablePath);
    if (unaggTableSource != null) {
      // The unaggregated type has a table.  Copy over its actions to aggregated instance's slice table.
      source.setActions(unaggTableSource.getActions());
    }

    return source;
  }

  @Override
  CreateFormDefSource getCreateFormDefSource(CreateFormPagePath pagePath) {
    if (getYamlReader().getCreateFormDefSource(NAME_HANDLER.getUnfabricatedCreateFormPagePath(pagePath)) != null) {
      throw new AssertionError("Aggregated types do not support create forms: " + pagePath);
    }
    return null;
  }

  @Override
  TableDefSource getTableDefSource(TablePagePath pagePath) {
    TableDefSource unaggSource = getYamlReader().getTableDefSource(NAME_HANDLER.getUnfabricatedTablePagePath(pagePath));
    if (unaggSource == null) {
      // This type doesn't support tables.
      return null;
    }

    // First see if we have a custom table for this aggregated type.
    // (there must be used if the table wants extra columns)

    // There isn't a custom table for the aggregated type. Create a default one.
    TableDefSource source = new TableDefSource();
    source.setIntroductionHTML(unaggSource.getIntroductionHTML());
    source.setHelpTopics(unaggSource.getHelpTopics());
    {
      BeanPropertyDefCustomizerSource column = new BeanPropertyDefCustomizerSource();
      column.setName("Name");
      source.addDisplayedColumn(column);
    }
    if (pagePath.getPagesPath().getTypeDef().isHeterogeneous()) {
      BeanPropertyDefCustomizerSource column = new BeanPropertyDefCustomizerSource();
      column.setName("Type");
      source.addDisplayedColumn(column);
    }
    return source;
  }

  @Override
  SlicesDefSource getSlicesDefSource(BeanTypeDef typeDef) {
    // Just use the unaggregated type's slices.
    return getYamlReader().getSlicesDefSource(NAME_HANDLER.getUnfabricatedTypeDef(typeDef));
  }

  @Override
  NavTreeDefSource getNavTreeDefSource(String type) {
    // Just use the unaggregated type's nav tree nodes.
    return getYamlReader().getNavTreeDefSource(NAME_HANDLER.getUnfabricatedType(type));
  }

  @Override
  LinksDefSource getLinksDefSource(BeanTypeDef typeDef) {
    return getYamlReader().getLinksDefSource(NAME_HANDLER.getUnfabricatedTypeDef(typeDef));
  }

  private List<BeanPropertyDefSource> aggregatePropertyDefs(
    BeanTypeDef unaggTypeDef,
    List<BeanPropertyDefSource> propertyDefs
  ) {
    List<BeanPropertyDefSource> rtn = new ArrayList<>();
    for (BeanPropertyDefSource propertyDef : propertyDefs) {
      if (propertyDef.isChild()) {
        if (unaggTypeDef.hasChildDef(new Path(propertyDef.getName()), true)) {
          if (NAME_HANDLER.isFabricatableJavaType(propertyDef.getType())) {
            propertyDef.setType(NAME_HANDLER.getFabricatedJavaType(propertyDef.getType()));
          }
          rtn.add(propertyDef);
        } else {
          // the unaggregated type trimmed out the child.  we should too.
        }
      } else {
        if (unaggTypeDef.hasPropertyDef(new Path(propertyDef.getName()), true)) {
          rtn.add(propertyDef);
        } else {
          // the unaggregated type trimmed out the property.  we should too.
        }
      }
    }
    return rtn;
  }
}
