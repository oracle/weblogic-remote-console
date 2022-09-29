// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.backend.build;

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

import weblogic.remoteconsole.common.repodef.BeanChildDef;
import weblogic.remoteconsole.common.repodef.BeanChildNavTreeNodeDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.repodef.weblogic.WDTPageRepoDef;
import weblogic.remoteconsole.common.repodef.weblogic.WebLogicPageDefWalker;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.WebLogicMBeansVersion;
import weblogic.remoteconsole.common.utils.WebLogicMBeansVersions;
import weblogic.remoteconsole.common.utils.WebLogicVersions;

/**
 * This tool prints out all of the properties on all of the pages
 * in WDT terms.  It's used to help find properties in the remote
 * console that are not available in WDT.  Currently this is a manual
 * process.
 * 
 * This tool is built as part of the remote console build and included in console.jar.
 * 
 * Here's how to run it:
 * 
 * java -classpath runnable/console.jar weblogic.remoteconsole.backend.build.WDTDumpPageProperties | sort -u
 * 
 * Send the output to the WDT team.  They will compare it with the WDT schema and let
 * the remote console team know if any of the properties is not supported by WDT.
 */
public class WDTDumpPageProperties extends WebLogicPageDefWalker {

  private Stack<BeanChildDef> childDefPath = new Stack<>();
  private Stack<BeanTypeDef> childTypeDefPath = new Stack<>();

  private WDTDumpPageProperties(WebLogicMBeansVersion mbeansVersion) {
    super(mbeansVersion);
  }

  public static void main(String[] args) {
    try {
      new WDTDumpPageProperties(
        WebLogicMBeansVersions.getVersion(
          WebLogicVersions.getCurrentVersion(),
          WebLogicVersions.getCurrentVersion().getCurrentPSU(),
          WebLogicMBeansVersion.ALL_CAPABILITIES
        )
      ).walk();
    } catch (Throwable t) {
      t.printStackTrace();
      // FortifyIssueSuppression J2EE Bad Practices: JVM Termination
      // This is a utility and terminating the JVM is fine.
      System.exit(1);
    }
  }

  @Override
  protected void walk() {
    walk(getMBeansVersion().findOrCreate(WDTPageRepoDef.class));
  }

  @Override
  protected void processPageDef(PageDef pageDef) {
    BeanTypeDef actualTypeDef = pageDef.getPagePath().getPagesPath().getTypeDef();
    BeanTypeDef currentTypeDef = childTypeDefPath.peek();
    childTypeDefPath.pop();
    childTypeDefPath.push(actualTypeDef);
    for (PagePropertyDef propertyDef : pageDef.getAllPropertyDefs()) {
      processPagePropertyDef(propertyDef);
    }
    childTypeDefPath.pop();
    childTypeDefPath.push(currentTypeDef);
  }

  private void processPagePropertyDef(PagePropertyDef propertyDef) {
    if (!propertyDef.isCreateWritable() && !propertyDef.isUpdateWritable()) {
      // It never shows up in WDT.
      return;
    }
    if (propertyDef.isPageLevelProperty()) {
      // skip it - this isn't an mbean property
      return;
    }
    if (propertyDef.isKey()) {
      // skip it (to match the corresponding WDT dumping tool)
      return;
    }
    if ("Type".equals(propertyDef.getPropertyName())) {
      // skip it (to match the corresponding WDT dumping tool)
      return;
    }
    BeanTypeDef typeDef = propertyDef.getPageDef().getPagePath().getPagesPath().getTypeDef();
    pushChildPath(typeDef, propertyDef.getParentPath());
    System.out.println(getContainmentPath() + " " + propertyDef.getOfflinePropertyName());
    popChildPath(typeDef, propertyDef.getParentPath());
  }

  // Only want to process the properties on pages
  protected void walkProperties(BeanTypeDef typeDef) {
    return;
  }

  // Only want to process children referenced from the nav tree
  protected void walkChildren(BeanTypeDef typeDef) {
    return;
  }

  @Override
  protected void walkChildNodeDef(BeanChildNavTreeNodeDef childNodeDef) {
    pushChildPath(childNodeDef.getNavTreeDef().getTypeDef(), childNodeDef.getChildNodePath());
    super.walkChildNodeDef(childNodeDef);
    popChildPath(childNodeDef.getNavTreeDef().getTypeDef(), childNodeDef.getChildNodePath());
  }

  private String getContainmentPath() {
    List<String> rtn = new ArrayList<>();
    boolean collapsed = false;
    for (int i = 0; i < childDefPath.size(); i++) {
      BeanChildDef childDef = childDefPath.get(i);
      if (!collapsed) {
        String childName = childDef.getOfflineChildName();
        BeanTypeDef typeDefFromPath = childTypeDefPath.get(i);
        BeanTypeDef typeDefFromChild = childDef.getChildTypeDef();
        String typeFromPath = typeDefFromPath.getTypeName();
        String typeFromChild = typeDefFromChild.getTypeName();
        // Not worth modifying BeanTypeDef to expose pseudo types for this one use case:
        if (!"JDBCSystemResourceMBean".equals(typeFromChild)) {
          if (!typeFromPath.equals(typeFromChild)) {
            childName = typeDefFromPath.getInstanceName();
          }
        }
        if ("OracleIdentityCloudIntegrator".equals(childName)) {
          // Not worth modifying BeanTypeDef to expose custom security provider names for this one use case:
          childName = "weblogic.security.providers.authentication.OracleIdentityCloudIntegrator";
        }
        rtn.add(childName);
        if (childDef.isCollapsedInWDT()) {
          // the next child is collapsed
          collapsed = true;
        }
      } else {
        collapsed = false; // the next child is not collapsed
      }
    }
    return rtn.toString();
  }

  private void pushChildPath(BeanTypeDef parentTypeDef, Path childPath) {
    BeanTypeDef typeDef = parentTypeDef;
    for (String child : childPath.getComponents()) {
      BeanChildDef childDef = typeDef.getChildDef(new Path(child), true);
      childDefPath.push(childDef);
      typeDef = childDef.getChildTypeDef();
      childTypeDefPath.push(typeDef);
    }
  }

  private void popChildPath(BeanTypeDef parentTypeDef, Path childPath) {
    for (String child : childPath.getComponents()) {
      childDefPath.pop();
      childTypeDefPath.pop();
    }
  }
}
