// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.util.List;

import weblogic.remoteconsole.common.YamlUtils;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.CreateFormPagePath;
import weblogic.remoteconsole.common.repodef.PagePath;
import weblogic.remoteconsole.common.repodef.PagesPath;
import weblogic.remoteconsole.common.repodef.SlicePagePath;
import weblogic.remoteconsole.common.repodef.TablePagePath;
import weblogic.remoteconsole.common.repodef.schema.BeanTypeDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.BeanTypeDefExtensionSource;
import weblogic.remoteconsole.common.repodef.schema.BeanTypeDefSource;
import weblogic.remoteconsole.common.repodef.schema.CreateFormDefSource;
import weblogic.remoteconsole.common.repodef.schema.LinksDefSource;
import weblogic.remoteconsole.common.repodef.schema.NavTreeDefSource;
import weblogic.remoteconsole.common.repodef.schema.PseudoBeanTypeDefSource;
import weblogic.remoteconsole.common.repodef.schema.SliceFormDefSource;
import weblogic.remoteconsole.common.repodef.schema.SliceTableDefSource;
import weblogic.remoteconsole.common.repodef.schema.SlicesDefSource;
import weblogic.remoteconsole.common.repodef.schema.TableDefSource;
import weblogic.remoteconsole.common.utils.StringUtils;

/**
 * Utilities to help read yaml files for yaml-based page and bean repo defs.
 */
public abstract class YamlReader {

  protected abstract List<String> getTypesYamlDirectories();

  public BeanTypeDefSource getBeanTypeDefSource(String type) {
    for (String dir : getTypesYamlDirectories()) {
      String path = type + ".yaml";
      if (StringUtils.notEmpty(dir)) {
        path = dir + "/" + path;
      }
      BeanTypeDefSource source =  YamlUtils.read(path, BeanTypeDefSource.class);
      if (source != null) {
        return source;
      }
    }
    return null;
  }

  public PseudoBeanTypeDefSource getPseudoBeanTypeDefSource(String type) {
    return
      YamlUtils.read(
        getTypeCustomizationsYamlDirectory(type) + "/pseudo-type.yaml",
        PseudoBeanTypeDefSource.class
      );
  }

  public BeanTypeDefCustomizerSource getBeanTypeDefCustomizerSource(BeanTypeDef typeDef) {
    return
      YamlUtils.read(
        getTypeCustomizationsYamlDirectory(typeDef) + "/type.yaml",
        BeanTypeDefCustomizerSource.class
      );
  }

  public BeanTypeDefExtensionSource getBeanTypeDefExtensionSource(BeanTypeDef typeDef) {
    return
      YamlUtils.read(
        getTypeCustomizationsYamlDirectory(typeDef) + "/extension.yaml",
        BeanTypeDefExtensionSource.class
      );
  }

  public SliceFormDefSource getSliceFormDefSource(SlicePagePath pagePath, SlicesDefImpl slicesDefImpl) {
    String typeYamlDir = getTypeCustomizationsYamlDirectory(pagePath);
    String slicesYamlDir = typeYamlDir + "/slices";
    SliceFormDefSource source = getSliceFormDefSource(slicesYamlDir, pagePath);
    if (source != null) {
      // Found the form def source in the normal location.  Return it.
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
    String formFile = slicesYamlDir + "/" + pagePath.getSlicePath().getSlashSeparatedPath() + "/form.yaml";
    return YamlUtils.read(formFile, SliceFormDefSource.class);
  }

  public SliceTableDefSource getSliceTableDefSource(SlicePagePath pagePath, SlicesDefImpl slicesDefImpl) {
    String typeYamlDir = getTypeCustomizationsYamlDirectory(pagePath);
    String slicesYamlDir = typeYamlDir + "/slices";
    SliceTableDefSource source = getSliceTableDefSource(slicesYamlDir, pagePath);
    if (source != null) {
      // Found the form def source in the normal location.  Return it.
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
    String formFile = slicesYamlDir + "/" + pagePath.getSlicePath().getSlashSeparatedPath() + "/table.yaml";
    return YamlUtils.read(formFile, SliceTableDefSource.class);
  }

  public CreateFormDefSource getCreateFormDefSource(CreateFormPagePath pagePath) {
    return
      YamlUtils.read(
        getTypeCustomizationsYamlDirectory(pagePath) + "/create-form.yaml",
        CreateFormDefSource.class
      );
  }

  public TableDefSource getTableDefSource(TablePagePath pagePath) {
    return
      YamlUtils.read(
        getTypeCustomizationsYamlDirectory(pagePath) + "/table.yaml",
        TableDefSource.class
      );
  }

  public SlicesDefSource getSlicesDefSource(BeanTypeDef typeDef) {
    return
      YamlUtils.read(
        getTypeCustomizationsYamlDirectory(typeDef) + "/slices.yaml",
        SlicesDefSource.class
      );
  }

  public NavTreeDefSource getNavTreeDefSource(String type) {
    return
      YamlUtils.read(
        getTypeCustomizationsYamlDirectory(type) + "/nav-tree.yaml",
        NavTreeDefSource.class
      );
  }

  public NavTreeDefSource getRootNavTreeDefSource(String navTreeName) {
    return
      YamlUtils.read(
        "roots/" + navTreeName + "/nav-tree.yaml",
        NavTreeDefSource.class
      );
  }

  public LinksDefSource getLinksDefSource(BeanTypeDef typeDef) {
    return
      YamlUtils.read(
        getTypeCustomizationsYamlDirectory(typeDef) + "/links.yaml",
        LinksDefSource.class
      );
  }

  private String getTypeCustomizationsYamlDirectory(PagePath pagePath) {
    return getTypeCustomizationsYamlDirectory(pagePath.getPagesPath());
  }

  private String getTypeCustomizationsYamlDirectory(PagesPath pagesPath) {
    return getTypeCustomizationsYamlDirectory(pagesPath.getTypeDef());
  }

  private String getTypeCustomizationsYamlDirectory(BeanTypeDef type) {
    return getTypeCustomizationsYamlDirectory(type.getTypeName());
  }

  private String getTypeCustomizationsYamlDirectory(String type) {
    return type;
  }
}
