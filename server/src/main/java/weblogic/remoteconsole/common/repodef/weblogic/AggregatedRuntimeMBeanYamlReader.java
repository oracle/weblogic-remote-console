// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.weblogic;

import java.util.ArrayList;
import java.util.List;

import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.CreateFormPagePath;
import weblogic.remoteconsole.common.repodef.SlicePagePath;
import weblogic.remoteconsole.common.repodef.TablePagePath;
import weblogic.remoteconsole.common.repodef.schema.BeanPropertyDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.BeanPropertyDefSource;
import weblogic.remoteconsole.common.repodef.schema.BeanTypeDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.BeanTypeDefExtensionSource;
import weblogic.remoteconsole.common.repodef.schema.BeanTypeDefSource;
import weblogic.remoteconsole.common.repodef.schema.CreateFormDefSource;
import weblogic.remoteconsole.common.repodef.schema.LinksDefSource;
import weblogic.remoteconsole.common.repodef.schema.MBeanAttributeDefSource;
import weblogic.remoteconsole.common.repodef.schema.NavTreeDefSource;
import weblogic.remoteconsole.common.repodef.schema.PseudoBeanTypeDefSource;
import weblogic.remoteconsole.common.repodef.schema.SliceFormDefSource;
import weblogic.remoteconsole.common.repodef.schema.SliceTableDefSource;
import weblogic.remoteconsole.common.repodef.schema.SlicesDefSource;
import weblogic.remoteconsole.common.repodef.schema.SubTypeDefSource;
import weblogic.remoteconsole.common.repodef.schema.TableDefSource;
import weblogic.remoteconsole.common.repodef.yaml.SlicesDefImpl;
import weblogic.remoteconsole.common.utils.Path;

/**
 * Fabricates the yaml for an aggregated runtime mbean type.
 */
class AggregatedRuntimeMBeanYamlReader extends WebLogicBeanTypeYamlReader {

  private static final AggregatedRuntimeMBeanNameHandler NAME_HANDLER = AggregatedRuntimeMBeanNameHandler.INSTANCE;

  AggregatedRuntimeMBeanYamlReader(WebLogicYamlReader yamlReader) {
    super(yamlReader);
  }

  @Override
  BeanTypeDefSource getBeanTypeDefSource(String type) {
    BeanTypeDefSource source = getYamlReader().getBeanTypeDefSource(NAME_HANDLER.getUnfabricatedType(type));
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
    source.getActions().clear(); // ignore actions since we can't aggregate them
    source.setProperties(aggregatePropertyDefs(source.getProperties()));
    source.getProperties().add(server);
    return source;
  }

  @Override
  PseudoBeanTypeDefSource getPseudoBeanTypeDefSource(String type) {
    if (getYamlReader().getPseudoBeanTypeDefSource(NAME_HANDLER.getUnfabricatedType(type)) != null) {
      throw new AssertionError("Aggregated types are not supported for pseudo types: " + type);
    }
    return null;
  }

  @Override
  public BeanTypeDefCustomizerSource getBeanTypeDefCustomizerSource(BeanTypeDef typeDef) {
    List<BeanPropertyDefCustomizerSource> unaggPropertyCustomizers = new ArrayList<>();
    BeanTypeDef unaggTypeDef = NAME_HANDLER.getUnfabricatedTypeDef(typeDef);
    BeanTypeDefCustomizerSource source =
      getYamlReader().getBeanTypeDefCustomizerSource(unaggTypeDef);
    if (source == null) {
      source = new BeanTypeDefCustomizerSource();
    } else {
      unaggPropertyCustomizers = source.getProperties();
      source.setProperties(new ArrayList<>());
    }
    source.setInstanceName(unaggTypeDef.getInstanceName());
    aggregateProperties(unaggTypeDef, unaggPropertyCustomizers, source);
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
    fixMBeanJavadocLink(unaggPropertyDef, propertyCustomizer);
    source.addProperty(propertyCustomizer);
  }

  private void fixMBeanJavadocLink(
    BeanPropertyDef unaggPropertyDef,
    BeanPropertyDefCustomizerSource propertyCustomizer
  ) {
    // Find the leaf property def
    Path parentPath = unaggPropertyDef.getParentPath();
    if (!parentPath.isEmpty()) {
      // The property lives in a child bean.  Find the corresponding property on the child bean.
      boolean searchSubTypes = true;
      unaggPropertyDef =
        unaggPropertyDef.getTypeDef() // e.g. ServerMBean
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
    BeanTypeDefExtensionSource source =
      getYamlReader().getBeanTypeDefExtensionSource(NAME_HANDLER.getUnfabricatedTypeDef(typeDef));
    if (source == null) {
      return null;
    }
    source.setProperties(aggregatePropertyDefs(source.getProperties()));
    if (source.getProperties().isEmpty()) {
      return null;
    }
    source.getActions().clear(); // ignore actions since we can't aggregate them
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
    SliceFormDefSource unaggSource =
      getYamlReader().getSliceFormDefSource(NAME_HANDLER.getUnfabricatedSlicePagePath(pagePath), slicesDefImpl);
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
    // on the unaggregated type's form for this slice.
    SliceTableDefSource source = new SliceTableDefSource();
    source.setIntroductionHTML(unaggSource.getIntroductionHTML());
    source.setHelpTopics(unaggSource.getHelpTopics());
    BeanPropertyDefCustomizerSource serverColumn = new BeanPropertyDefCustomizerSource();
    serverColumn.setName("Server");
    source.getDisplayedColumns().add(serverColumn);
    source.getDisplayedColumns().addAll(unaggSource.getProperties());
    source.getHiddenColumns().addAll(unaggSource.getAdvancedProperties());
    source.setGetTableRowsMethod("weblogic.remoteconsole.customizers.AggregatedMBeanCustomizer.getSliceTableRows");
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
    // (they must be used if the table wants extra columns)

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

  private List<BeanPropertyDefSource> aggregatePropertyDefs(List<BeanPropertyDefSource> propertyDefs) {
    List<BeanPropertyDefSource> rtn = new ArrayList<>();
    for (BeanPropertyDefSource propertyDef : propertyDefs) {
      if (propertyDef.isChild() && NAME_HANDLER.isFabricatableJavaType(propertyDef.getType())) {
        propertyDef.setType(NAME_HANDLER.getFabricatedJavaType(propertyDef.getType()));
        rtn.add(propertyDef);
      } else {
        rtn.add(propertyDef);
      }
    }
    return rtn;
  }
}
