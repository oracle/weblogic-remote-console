// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import weblogic.remoteconsole.common.YamlUtils;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.CreateFormPagePath;
import weblogic.remoteconsole.common.repodef.PagePath;
import weblogic.remoteconsole.common.repodef.PagesPath;
import weblogic.remoteconsole.common.repodef.SliceFormPagePath;
import weblogic.remoteconsole.common.repodef.TablePagePath;
import weblogic.remoteconsole.common.repodef.schema.BeanTypeDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.BeanTypeDefExtensionSource;
import weblogic.remoteconsole.common.repodef.schema.BeanTypeDefSource;
import weblogic.remoteconsole.common.repodef.schema.CreateFormDefSource;
import weblogic.remoteconsole.common.repodef.schema.LinksDefSource;
import weblogic.remoteconsole.common.repodef.schema.NavTreeDefSource;
import weblogic.remoteconsole.common.repodef.schema.PseudoBeanTypeDefSource;
import weblogic.remoteconsole.common.repodef.schema.SliceFormDefSource;
import weblogic.remoteconsole.common.repodef.schema.SlicesDefSource;
import weblogic.remoteconsole.common.repodef.schema.TableDefSource;

/**
 * Utilities to help read yaml files for yaml-based page and bean repo defs.
 */
public class YamlReader {
  private String typesYamlDirectory;

  protected YamlReader(String typesYamlDirectory) {
    this.typesYamlDirectory = typesYamlDirectory;
  }

  BeanTypeDefSource getBeanTypeDefSource(String type) {
    return
      YamlUtils.read(
        this.typesYamlDirectory + "/" + type + ".yaml",
        BeanTypeDefSource.class
      );
  }

  PseudoBeanTypeDefSource getPseudoBeanTypeDefSource(String type) {
    return
      YamlUtils.read(
        getTypeCustomizationsYamlDirectory(type) + "/pseudo-type.yaml",
        PseudoBeanTypeDefSource.class
      );
  }

  BeanTypeDefCustomizerSource getBeanTypeDefCustomizerSource(BeanTypeDef type) {
    return
      YamlUtils.read(
        getTypeCustomizationsYamlDirectory(type) + "/type.yaml",
        BeanTypeDefCustomizerSource.class
      );
  }

  BeanTypeDefExtensionSource getBeanTypeDefExtensionSource(BeanTypeDef type) {
    return
      YamlUtils.read(
        getTypeCustomizationsYamlDirectory(type) + "/extension.yaml",
        BeanTypeDefExtensionSource.class
      );
  }

  SliceFormDefSource getSliceFormDefSource(SliceFormPagePath pagePath, SlicesDefImpl slicesDefImpl) {
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

  private SliceFormDefSource getSliceFormDefSource(String slicesYamlDir, SliceFormPagePath pagePath) {
    String formFile = slicesYamlDir + "/" + pagePath.getSlicePath().getSlashSeparatedPath() + "/form.yaml";
    return YamlUtils.read(formFile, SliceFormDefSource.class);
  }

  CreateFormDefSource getCreateFormDefSource(CreateFormPagePath pagePath) {
    return
      YamlUtils.read(
        getTypeCustomizationsYamlDirectory(pagePath) + "/create-form.yaml",
        CreateFormDefSource.class
      );
  }

  TableDefSource getTableDefSource(TablePagePath pagePath) {
    return
      YamlUtils.read(
        getTypeCustomizationsYamlDirectory(pagePath) + "/table.yaml",
        TableDefSource.class
      );
  }

  SlicesDefSource getSlicesDefSource(BeanTypeDef type) {
    return
      YamlUtils.read(
        getTypeCustomizationsYamlDirectory(type) + "/slices.yaml",
        SlicesDefSource.class
      );
  }

  NavTreeDefSource getNavTreeDefSource(BeanTypeDef type) {
    return
      YamlUtils.read(
        getTypeCustomizationsYamlDirectory(type) + "/nav-tree.yaml",
        NavTreeDefSource.class
      );
  }

  NavTreeDefSource getRootNavTreeDefSource(String rootNavigationType) {
    return
      YamlUtils.read(
        getTypeCustomizationsYamlDirectory(rootNavigationType) + "/root-nav-tree.yaml",
        NavTreeDefSource.class
      );
  }

  LinksDefSource getLinksDefSource(BeanTypeDef type) {
    return
      YamlUtils.read(
        getTypeCustomizationsYamlDirectory(type) + "/links.yaml",
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
