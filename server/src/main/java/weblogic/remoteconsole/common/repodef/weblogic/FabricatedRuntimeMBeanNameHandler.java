// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.weblogic;

import java.util.ArrayList;
import java.util.List;

import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.CreateFormPagePath;
import weblogic.remoteconsole.common.repodef.PagePath;
import weblogic.remoteconsole.common.repodef.PagesPath;
import weblogic.remoteconsole.common.repodef.SlicePagePath;
import weblogic.remoteconsole.common.repodef.TablePagePath;
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.server.repo.BeanTreePath;

/**
 * Class for converting between fabricated runtime mbean names
 * and their corresponding non-fabricated runtime mbean names.
 *
 * Used to help dynamically create trees of mbeans that parallel
 * the underlying runtime mbeans.
 *
 * For example, we create a parallel set of runtime mbeans that aggregate
 * the trees of per-server runtime mbeans so that the user can get a domain-wide
 * view of them (e.g. see an application across all the servers it's
 * currently running on).
 */
public abstract class FabricatedRuntimeMBeanNameHandler {

  private String prefix;

  protected FabricatedRuntimeMBeanNameHandler(String prefix) {
    this.prefix = prefix;
  }

  private static final String RUNTIME_MBEAN = "RuntimeMBean";

  public abstract BeanTreePath getUnfabricatedBeanTreePath(BeanTreePath aggBeanTreePath);

  public boolean isFabricatedBeanTreePath(BeanTreePath beanTreePath) {
    return isFabricatedTypeDef(beanTreePath.getTypeDef());
  }

  public List<String> getFabricatedJavaTypes(List<String> types) {
    List<String> rtn = new ArrayList<>();
    for (String type : types) {
      rtn.add(getFabricatedJavaType(type));
    }
    return rtn;
  }

  public String getFabricatedJavaType(String javaType) {
    if (isFabricatableJavaType(javaType)) {
      String leafClassName = StringUtils.getLeafClassName(javaType);
      return javaType.replaceAll(leafClassName, getFabricatedType(leafClassName));
    }
    return javaType;
  }

  public static boolean isFabricatableJavaType(String javaType) {
    return isFabricatableType(StringUtils.getLeafClassName(javaType));
  }

  public SlicePagePath getUnfabricatedSlicePagePath(SlicePagePath pagePath) {
    return
      PagePath.newSlicePagePath(
        getUnfabricatedPagesPath(pagePath),
        pagePath.getSlicePath()
      );
  }

  public CreateFormPagePath getUnfabricatedCreateFormPagePath(CreateFormPagePath pagePath) {
    return PagePath.newCreateFormPagePath(getUnfabricatedPagesPath(pagePath));
  }

  public TablePagePath getUnfabricatedTablePagePath(TablePagePath pagePath) {
    return PagePath.newTablePagePath(getUnfabricatedPagesPath(pagePath));
  }

  public PagesPath getUnfabricatedPagesPath(PagePath pagePath) {
    return
      pagePath.getPagesPath().getPageRepoDef().newPagesPath(
        getUnfabricatedTypeDef(pagePath.getPagesPath().getTypeDef())
      );
  }

  public boolean isFabricatedPagePath(PagePath pagePath) {
    return isFabricatedTypeDef(pagePath.getPagesPath().getTypeDef());
  }

  public BeanTypeDef getUnfabricatedTypeDef(BeanTypeDef typeDef) {
    return typeDef.getBeanRepoDef().getTypeDef(getUnfabricatedType(typeDef.getTypeName()));
  }

  public boolean isFabricatedTypeDef(BeanTypeDef typeDef) {
    return isFabricatedType(typeDef.getTypeName());
  }

  public static boolean isFabricatableTypeDef(BeanTypeDef typeDef) {
    return isFabricatableType(typeDef.getTypeName());
  }

  public String getUnfabricatedType(String type) {
    return getUnfabricatedName(type);
  }

  public String getFabricatedType(String type) {
    if (!isFabricatableType(type)) {
      throw new AssertionError("Not an fabricatable type: " + type);
    }
    return getFabricatedName(type);
  }

  public boolean isFabricatedType(String type) {
    if (!isFabricatedName(type)) {
      return false;
    }
    if (!isFabricatableType(getUnfabricatedName(type))) {
      throw new AssertionError("Unfabricated type: " + type);
    }
    return true;
  }

  public static boolean isFabricatableType(String type) {
    String leafType = StringUtils.getLeafClassName(type);
    return 
      leafType.endsWith("RuntimeMBean")
        // There are a few runtime mbeans that don't follow the FooRuntimeMBean
        // naming convention.  Look for them explicitly.  We need to make sure
        // that as new runtime mbean types that don't follow that convention
        // are added to weblogic, we add them to this list:
        || "AggregateProgressMBean".equals(leafType)
        || "ProgressMBean".equals(leafType)
        || "SAFStatisticsCommonMBean".equals(leafType);
  }

  public boolean isFabricatedName(String name) {
    return name.startsWith(prefix);
  }

  public String getUnfabricatedName(String name) {
    if (!isFabricatedName(name)) {
      throw new AssertionError("Not a fabricated name: " + name);
    }
    return name.substring(prefix.length());
  }

  public String getFabricatedName(String name) {
    if (isFabricatedName(name)) {
      throw new AssertionError("Already a fabricated name: " + name);
    }
    return prefix + name;
  }
}
