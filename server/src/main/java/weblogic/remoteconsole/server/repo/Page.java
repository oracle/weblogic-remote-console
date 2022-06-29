// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.ArrayList;
import java.util.List;

import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.utils.Path;

/**
 * This class holds results of getting the data for a page.
 *
 * It's the base class the data for the various kinds of pages.
 */
public class Page {
  private PageDef pageDef;
  private Path navTreePath = new Path();
  private Path beanTreePath = new Path();
  private BeanTreePath self = null;
  private List<BeanTreePath> breadCrumbs = new ArrayList<>();
  private List<Link> links = new ArrayList<>();
  private ChangeManagerStatus changeManagerStatus = null;
  private String localizedIntroductionHTML;
  private String backendRelativePDJURI;

  // Get the corresponding page definition
  public PageDef getPageDef() {
    return pageDef;
  }

  public void setPageDef(PageDef val) {
    pageDef = val;
  }

  // The nav tree path of the top-level bean displayed on this page
  // e.g. "Environment", "Servers", "AdminServer"
  public Path getNavTreePath() {
    return navTreePath;
  }

  public void setNavTreePath(Path val) {
    navTreePath = val;
  }

  // The bean tree path of the top-level bean displayed on this page.
  // e.g. "Domain", "Servers", "AdminServer"
  public Path getBeanTreePath() {
    return beanTreePath;
  }

  public void setBeanTreePath(Path val) {
    beanTreePath = val;
  }

  // The bean tree path to display in the 'self' link on this page
  // as a BeanTreePath (it must match get/setBeanTreePath)
  public BeanTreePath getSelf() {
    return self;
  }

  public void setSelf(BeanTreePath val) {
    self = val;
  }

  // The bean tree paths of this bean and all of its parent beans that have pages.
  // e.g. Domain/SecurityConfiguration/Realms/myrealm identifies a realm.
  // Domain has pages but SecurityConfiguration (a mandatory singleton)
  // because its properties are rolled into the Domain pages.
  // So, its breadcrumbs would be:
  //   1) Domain
  //   2) Domain/SecurityConfiguration/Realms/myrealm
  public List<BeanTreePath> getBreadCrumbs() {
    return breadCrumbs;
  }

  public void setBreadCrumbs(List<BeanTreePath> val) {
    breadCrumbs = val;
  }

  // The links to display on the page.
  public List<Link> getLinks() {
    return links;
  }

  public void setLinks(List<Link> val) {
    links = val;
  }

  // The status of the change manager.
  // Null if the repo is not a change manager repo.
  public ChangeManagerStatus getChangeManagerStatus() {
    return changeManagerStatus;
  }

  public void setChangeManagerStatus(ChangeManagerStatus val) {
    changeManagerStatus = val;
  }

  // Normally the page's introduction is fixed for the type and is specified in the PDJ
  // Some pages need to change the introduction based on which bean the page is displaying.
  // For these cases, set introductionHTML to the localized text required.
  // It will be put into the RDJ and the CFE will displayu it instead of the intro in the PDJ.

  public String getLocalizedIntroductionHTML() {
    return localizedIntroductionHTML;
  }
  
  public void setLocalizedIntroductionHTML(String val) {
    localizedIntroductionHTML = val;
  }

  public String getBackendRelativePDJURI() {
    return backendRelativePDJURI;
  }

  public void setBackendRelativePDJURI(String val) {
    backendRelativePDJURI = val;
  }

  // Returns whether this page is a form.
  public boolean isForm() {
    return (this instanceof Form);
  }

  // Converts this page to a form.
  // Throws a ClassCastException if this page is not a Form.
  public Form asForm() {
    return (Form)this;
  }

  // Returns whether this page is a table.
  public boolean isTable() {
    return (this instanceof Table);
  }

  // Converts this page to a table.
  // Throws a ClassCastException if this page is not a Table.
  public Table asTable() {
    return (Table)this;
  }
}
