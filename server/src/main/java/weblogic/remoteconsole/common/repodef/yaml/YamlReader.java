// Copyright (c) 2021, 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import weblogic.remoteconsole.common.repodef.BeanRepoDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.CreateFormPagePath;
import weblogic.remoteconsole.common.repodef.PagePath;
import weblogic.remoteconsole.common.repodef.PagesPath;
import weblogic.remoteconsole.common.repodef.SlicePagePath;
import weblogic.remoteconsole.common.repodef.TablePagePath;
import weblogic.remoteconsole.common.repodef.schema.BeanActionDefSource;
import weblogic.remoteconsole.common.repodef.schema.BeanChildDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.BeanPropertyDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.BeanPropertyDefSource;
import weblogic.remoteconsole.common.repodef.schema.BeanTypeDefCustomizerExtensionSource;
import weblogic.remoteconsole.common.repodef.schema.BeanTypeDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.BeanTypeDefExtensionSource;
import weblogic.remoteconsole.common.repodef.schema.BeanTypeDefSource;
import weblogic.remoteconsole.common.repodef.schema.CreateFormDefSource;
import weblogic.remoteconsole.common.repodef.schema.LinksDefSource;
import weblogic.remoteconsole.common.repodef.schema.NavTreeDefExtensionSource;
import weblogic.remoteconsole.common.repodef.schema.NavTreeDefSource;
import weblogic.remoteconsole.common.repodef.schema.NavTreeNodeDefSource;
import weblogic.remoteconsole.common.repodef.schema.PseudoBeanTypeDefSource;
import weblogic.remoteconsole.common.repodef.schema.SliceFormDefSource;
import weblogic.remoteconsole.common.repodef.schema.SliceTableDefSource;
import weblogic.remoteconsole.common.repodef.schema.SlicesDefSource;
import weblogic.remoteconsole.common.repodef.schema.SubTypeDefSource;
import weblogic.remoteconsole.common.repodef.schema.TableDefSource;
import weblogic.remoteconsole.common.utils.StringUtils;

/**
 * Utilities to help read yaml files for yaml-based page and bean repo defs.
 */
public abstract class YamlReader {

  protected abstract List<YamlDirectoryReader> getTypeYamlDirectoryReaders();

  protected abstract List<YamlDirectoryReader> getTypeCustomizationYamlDirectoryReaders();

  public BeanTypeDefSource getBeanTypeDefSource(BeanRepoDef repoDef, String type) {
    BeanTypeDefSource source =
      getFirstSource(
        getTypeYamlDirectoryReaders(),
        type + ".yaml",
        BeanTypeDefSource.class
    );
    if (source != null) {
      applyBeanTypeDefExtensions(type, source);
    }
    return source;
  }

  private void applyBeanTypeDefExtensions(String type, BeanTypeDefSource source) {
    for (
      BeanTypeDefExtensionSource extensionSource :
      getTypeCustomizationSources(
        getTypeRelativeYamlPath(type, "extension.yaml"),
        BeanTypeDefExtensionSource.class
      )
    ) {
      applyBeanTypeDefExtension(type, source, extensionSource);
    }
  }

  private void applyBeanTypeDefExtension(
    String type,
    BeanTypeDefSource source,
    BeanTypeDefExtensionSource extensionSource
  ) {
    {
      Map<String,BeanPropertyDefSource> properties = new HashMap<>();
      // Copy over the properties we already have
      for (BeanPropertyDefSource property : source.getProperties()) {
        properties.put(property.getName(), property);
      }
      // Overlay the ones from the extension
      for (BeanPropertyDefSource property : extensionSource.getProperties()) {
        properties.put(property.getName(), property);
      }
      source.getProperties().clear();
      source.getProperties().addAll(properties.values());
    }
    {
      Map<String,BeanActionDefSource> actions = new HashMap<>();
      // Copy over the actions we already have
      for (BeanActionDefSource action : source.getActions()) {
        actions.put(action.getName(), action);
      }
      // Overlay the ones from the extension
      for (BeanActionDefSource action : extensionSource.getActions()) {
        actions.put(action.getName(), action);
      }
      source.getActions().clear();
      source.getActions().addAll(actions.values());
    }
  }

  public PseudoBeanTypeDefSource getPseudoBeanTypeDefSource(BeanRepoDef repoDef, String type) {
    return
      getFirstTypeCustomizationSource(
        getTypeRelativeYamlPath(type, "pseudo-type.yaml"),
        PseudoBeanTypeDefSource.class
    );
  }

  public BeanTypeDefCustomizerSource getBeanTypeDefCustomizerSource(BeanTypeDef typeDef) {
    BeanTypeDefCustomizerSource source =
      getFirstTypeCustomizationSource(
        getTypeRelativeYamlPath(typeDef, "type.yaml"),
        BeanTypeDefCustomizerSource.class
    );
    if (source != null) {
      applyBeanTypeDefCustomizerExtensions(typeDef, source);
    }
    return source;
  }

  private void applyBeanTypeDefCustomizerExtensions(BeanTypeDef typeDef, BeanTypeDefCustomizerSource source) {
    for (
      BeanTypeDefCustomizerExtensionSource extensionSource :
      getTypeCustomizationSources(
        getTypeRelativeYamlPath(typeDef, "type-extension.yaml"),
        BeanTypeDefCustomizerExtensionSource.class
      )
    ) {
      applyBeanTypeDefCustomizerExtension(typeDef, source, extensionSource);
    }
  }

  private void applyBeanTypeDefCustomizerExtension(
    BeanTypeDef typeDef,
    BeanTypeDefCustomizerSource source,
    BeanTypeDefCustomizerExtensionSource extensionSource
  ) {
    // TBD - weed out duplicates?
    for (BeanPropertyDefCustomizerSource property : extensionSource.getProperties()) {
      source.getProperties().add(property);
    }
    for (BeanChildDefCustomizerSource child : extensionSource.getChildren()) {
      source.getChildren().add(child);
    }
    for (SubTypeDefSource subType : extensionSource.getSubTypes()) {
      source.getSubTypes().add(subType);
    }
  }

  public SlicesDefSource getSlicesDefSource(BeanTypeDef typeDef) {
    return
      getFirstTypeCustomizationSource(
        getTypeRelativeYamlPath(typeDef, "slices.yaml"),
        SlicesDefSource.class
    );
  }

  public SliceFormDefSource getSliceFormDefSource(SlicePagePath pagePath, SlicesDefImpl slicesDefImpl) {
    // Look in the normal location.
    SliceFormDefSource source = getSliceFormDefSource(getTypeRelativeYamlPath(pagePath, "slices"), pagePath);
    if (source != null) {
      return source;
    }
    // Didn't find it in the normal location.  Look in the alternate locations.
    for (String alternateSliceSource : slicesDefImpl.getAlternateSliceSources()) {
      source = getSliceFormDefSource(alternateSliceSource, pagePath);
      if (source != null) {
        return source;
      }
    }
    // Didn't find it
    return null;
  }

  private SliceFormDefSource getSliceFormDefSource(String slicesYamlDir, SlicePagePath pagePath) {
    return
      getFirstTypeCustomizationSource(
        slicesYamlDir + "/" + pagePath.getSlicePath().getSlashSeparatedPath() + "/form.yaml",
        SliceFormDefSource.class
    );
  }

  public SliceTableDefSource getSliceTableDefSource(SlicePagePath pagePath, SlicesDefImpl slicesDefImpl) {
    // Look in the normal location.
    SliceTableDefSource source = getSliceTableDefSource(getTypeRelativeYamlPath(pagePath, "slices"), pagePath);
    if (source != null) {
      return source;
    }
    // Didn't find it in the normal location.  Look in the alternate locations.
    for (String alternateSliceSource : slicesDefImpl.getAlternateSliceSources()) {
      source = getSliceTableDefSource(alternateSliceSource, pagePath);
      if (source != null) {
        return source;
      }
    }
    // Didn't find it
    return null;
  }

  private SliceTableDefSource getSliceTableDefSource(String slicesYamlDir, SlicePagePath pagePath) {
    return
      getFirstTypeCustomizationSource(
        slicesYamlDir + "/" + pagePath.getSlicePath().getSlashSeparatedPath() + "/table.yaml",
        SliceTableDefSource.class
    );
  }

  public CreateFormDefSource getCreateFormDefSource(CreateFormPagePath pagePath) {
    return
      getFirstTypeCustomizationSource(
        getTypeRelativeYamlPath(pagePath, "create-form.yaml"),
        CreateFormDefSource.class
    );
  }

  public TableDefSource getTableDefSource(TablePagePath pagePath) {
    return
      getFirstTypeCustomizationSource(
        getTypeRelativeYamlPath(pagePath, "table.yaml"),
        TableDefSource.class
    );
  }

  public NavTreeDefSource getNavTreeDefSource(String type) {
    NavTreeDefSource source =
      getFirstTypeCustomizationSource(
        getTypeRelativeYamlPath(type, "nav-tree.yaml"),
        NavTreeDefSource.class
      );
    if (source != null) {
      applyNavTreeDefExtensions(type, source);
    }
    return source;
  }

  private void applyNavTreeDefExtensions(String type, NavTreeDefSource source) {
    for (
      NavTreeDefExtensionSource extensionSource :
      getTypeCustomizationSources(
        getTypeRelativeYamlPath(type, "nav-tree-extension.yaml"),
        NavTreeDefExtensionSource.class
      )
    ) {
      applyNavTreeDefExtension(type, source, extensionSource);
    }
  }

  public NavTreeDefSource getRootNavTreeDefSource(String navTreeName) {
    NavTreeDefSource source =
      getFirstTypeCustomizationSource(
        "roots/" + navTreeName + "/nav-tree.yaml",
        NavTreeDefSource.class
      );
    if (source != null) {
      applyRootNavTreeDefExtensions(navTreeName, source);
    }
    return source;
  }

  private void applyRootNavTreeDefExtensions(String navTreeName, NavTreeDefSource source) {
    for (
      NavTreeDefExtensionSource extensionSource :
      getTypeCustomizationSources(
        "roots/" + navTreeName + "/nav-tree-extension.yaml",
        NavTreeDefExtensionSource.class
      )
    ) {
      applyNavTreeDefExtension(navTreeName, source, extensionSource);
    }
  }

  private void applyNavTreeDefExtension(
    String scope,
    NavTreeDefSource source,
    NavTreeDefExtensionSource extensionSource
  ) {
    // TBD - weed out duplicates?
    for (NavTreeNodeDefSource content : extensionSource.getContents()) {
      source.getContents().add(content);
    }
  }

  public LinksDefSource getLinksDefSource(BeanTypeDef typeDef) {
    return
      getFirstTypeCustomizationSource(
        getTypeRelativeYamlPath(typeDef, "links.yaml"),
        LinksDefSource.class
    );
  }

  private <T> T getFirstTypeCustomizationSource(String yamlPath, Class<T> type) {
    return getFirstSource(getTypeCustomizationYamlDirectoryReaders(), yamlPath, type);
  }

  private <T> List<T> getTypeCustomizationSources(String yamlPath, Class<T> type) {
    return getSources(getTypeCustomizationYamlDirectoryReaders(), yamlPath, type);
  }

  private <T> T getFirstSource(List<YamlDirectoryReader> readers, String yamlPath, Class<T> type) {
    for (YamlDirectoryReader reader : readers) {
      T source = reader.readYaml(yamlPath, type);
      if (source != null) {
        return source;
      }
    }
    return null;
  }

  private <T> List<T> getSources(List<YamlDirectoryReader> readers, String yamlPath, Class<T> type) {
    List<T> sources = new ArrayList<>();
    for (YamlDirectoryReader reader : readers) {
      T source = reader.readYaml(yamlPath, type);
      if (source != null) {
        sources.add(source);
      }
    }
    return sources;
  }

  private String getTypeRelativeYamlPath(PagePath pagePath, String relativePath) {
    return getTypeRelativeYamlPath(pagePath.getPagesPath(), relativePath);
  }

  private String getTypeRelativeYamlPath(PagesPath pagesPath, String relativePath) {
    return getTypeRelativeYamlPath(pagesPath.getTypeDef(), relativePath);
  }

  private String getTypeRelativeYamlPath(BeanTypeDef typeDef, String relativePath) {
    return getTypeRelativeYamlPath(typeDef.getTypeName(), relativePath);
  }

  private String getTypeRelativeYamlPath(String type, String relativePath) {
    return getYamlPath(type, relativePath);
  }

  public static String getYamlPath(String directory, String relativeYamlPath) {
    return StringUtils.notEmpty(directory) ? directory + "/" + relativeYamlPath : relativeYamlPath;
  }
}
