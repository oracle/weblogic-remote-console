// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.lang.reflect.Method;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import com.fasterxml.jackson.core.type.TypeReference;
import weblogic.console.utils.Path;
import weblogic.console.utils.StringUtils;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.CollectionParamDef;
import weblogic.remoteconsole.common.repodef.CustomizerDef;
import weblogic.remoteconsole.common.repodef.LinkDef;
import weblogic.remoteconsole.common.repodef.LinksDef;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.NavTreeDef;
import weblogic.remoteconsole.common.repodef.NavTreeNodeDef;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.repodef.PagePath;
import weblogic.remoteconsole.common.utils.CustomizerInvocationUtils;
import weblogic.remoteconsole.server.providers.Root;
import weblogic.remoteconsole.server.webapp.UriUtils;

/**
 * This class manages reading a page.
 * It is an internal detail of a PageRepo.
 */
class PageReader extends PageManager {

  private static final Logger LOGGER = Logger.getLogger(PageReader.class.getName());

  private static final Type GET_COLLECTION_CUSTOMIZER_RETURN_TYPE =
    (new TypeReference<List<BeanSearchResults>>() {}).getType();

  private static final Type CUSTOMIZE_PAGE_DEF_RETURN_TYPE =
    (new TypeReference<PageDef>() {}).getType();

  private static final Type PROPERTY_DEF_LIST_TYPE =
    (new TypeReference<List<BeanPropertyDef>>() {}).getType();

  protected PageReader(InvocationContext invocationContext) {
    super(invocationContext);
  }

  protected void addPageInfo(Page page) {
    addSelf(page);
    addBreadCrumbs(page);
  }

  protected void setPageDef(Page page, PageDef pageDef) {
    page.setPageDef(pageDef);
    page.setBackendRelativePDJURI(
      UriUtils.getBackendRelativePDJUri(getInvocationContext(), pageDef.getPagePath())
    );
  }

  protected void addCollectionToSearch(
    BeanReaderRepoSearchBuilder builder,
    BeanTreePath beanTreePath,
    List<BeanPropertyDef> propertyDefs
  ) {
    for (BeanPropertyDef propertyDef : propertyDefs) {
      builder.addProperty(beanTreePath, propertyDef);
      addParamsToSearch(builder, beanTreePath, propertyDef.getGetValueCustomizerDef());
    }
    if (beanTreePath.getTypeDef().isHeterogeneous()) {
      addSubTypeDiscriminatorToSearch(beanTreePath, builder);
    }
  }

  protected Response<List<BeanSearchResults>> getCollectionResults(
    BeanReaderRepoSearchResults searchResults,
    BeanTreePath beanTreePath,
    List<BeanPropertyDef> propertyDefs
  ) {
    Response<List<BeanSearchResults>> response = new Response<>();
    String getCollectionMethod = beanTreePath.getTypeDef().getGetCollectionMethod();
    if (StringUtils.notEmpty(getCollectionMethod)) {
      Method method = CustomizerInvocationUtils.getMethod(getCollectionMethod);
      CustomizerInvocationUtils.checkSignature(
        method,
        GET_COLLECTION_CUSTOMIZER_RETURN_TYPE,
        InvocationContext.class,
        BeanTreePath.class,
        BeanReaderRepoSearchResults.class,
        PROPERTY_DEF_LIST_TYPE
      );
      try {
        List<Object> args = List.of(getInvocationContext(), beanTreePath, searchResults, propertyDefs);
        Object rtn = CustomizerInvocationUtils.invokeMethod(method, args);
        @SuppressWarnings("unchecked")
        List<BeanSearchResults> results = (List<BeanSearchResults>)rtn;
        return response.setSuccess(results);
      } catch (ResponseException e) {
        return response.copyUnsuccessfulResponse(e.getResponse());
      }
    } else {
      return response.setSuccess(searchResults.getCollection(beanTreePath));
    }
  }

  protected void addSubTypeDiscriminatorToSearch(
    BeanTreePath beanTreePath,
    BeanReaderRepoSearchBuilder builder
  ) {
    // Find out which property on the bean indicates its type
    BeanPropertyDef discPropertyDef = beanTreePath.getTypeDef().getSubTypeDiscriminatorPropertyDef();

    // Add it, and anything needed to compute it, to the search
    builder.addProperty(beanTreePath, discPropertyDef);
    builder.addProperty(beanTreePath, discPropertyDef.getTypeDef().getIdentityPropertyDef());
    addParamsToSearch(builder, beanTreePath, discPropertyDef.getGetValueCustomizerDef());
  }

  protected Response<BeanTypeDef> getActualTypeDef(
    BeanTreePath beanTreePath,
    BeanReaderRepoSearchResults searchResults
  ) {
    Response<BeanTypeDef> response = new Response<>();
    BeanTypeDef typeDef = beanTreePath.getTypeDef();
    if (typeDef.isHomogeneous()) {
      return response.setSuccess(typeDef);
    }
    Response<String> discResponse = getSubTypeDiscriminatorValue(beanTreePath, searchResults);
    if (!discResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(discResponse);
    }
    return response.setSuccess(typeDef.getSubTypeDef(discResponse.getResults()));
  }

  protected Response<BeanTypeDef> getActualTypeDef(
    BeanTreePath beanTreePath,
    BeanSearchResults beanResults,
    BeanReaderRepoSearchResults searchResults
  ) {
    Response<BeanTypeDef> response = new Response<>();
    BeanTypeDef typeDef = beanTreePath.getTypeDef();
    if (typeDef.isHomogeneous()) {
      return response.setSuccess(typeDef);
    }
    Response<String> discResponse = getSubTypeDiscriminatorValue(beanTreePath, beanResults, searchResults);
    if (!discResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(discResponse);
    }
    return response.setSuccess(typeDef.getSubTypeDef(discResponse.getResults()));
  }

  protected Response<String> getSubTypeDiscriminatorValue(
    BeanTreePath beanTreePath,
    BeanReaderRepoSearchResults searchResults
  ) {
    return getSubTypeDiscriminatorValue(beanTreePath, searchResults.getBean(beanTreePath), searchResults);
  }

  protected Response<String> getSubTypeDiscriminatorValue(
    BeanTreePath beanTreePath,
    BeanSearchResults beanResults,
    BeanReaderRepoSearchResults searchResults
  ) {
    Response<String> response = new Response<>();

    // Find out which property on the bean indicates its type
    BeanPropertyDef discPropertyDef = beanTreePath.getTypeDef().getSubTypeDiscriminatorPropertyDef();
    // Get the value of the property from the search results and return it
    boolean includeIsSet = false;
    Response<Value> valueResponse =
      getPropertyValue(discPropertyDef, beanTreePath, beanResults, searchResults, includeIsSet);
    if (!valueResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(valueResponse);
    }

    Value value = Value.unsettableValue(valueResponse.getResults());
    return response.setSuccess(value.asString().getValue());
  }

  protected void addParamsToSearch(
    BeanReaderRepoSearchBuilder builder,
    BeanTreePath beanTreePath,
    CustomizerDef customizerDef
  ) {
    (new PageReaderHelper(getInvocationContext())).addParamsToSearch(builder, beanTreePath, customizerDef);
  }

  private BeanTreePath getCollectionBeanTreePath(
    BeanTreePath beanTreePath,
    CollectionParamDef paramDef
  ) {
    Path collectionPath = paramDef.getCollectionPath();
    if (collectionPath.isEmpty()) {
      // The collection is relative to the bean being invoked.
      return beanTreePath.childPath(paramDef.getCollectionDef().getChildPath());
    } else {
      // The parameter specified the absolute path of a top level collection.
      return BeanTreePath.create(getBeanRepo(), collectionPath);
    }
  }

  private void addSelf(Page page) {
    NavTreePath navTreePath = new NavTreePath(getInvocationContext());
    page.setNavTreePath(navTreePath.getPath());
    page.setSelf(getBeanTreePath());
    page.setBeanTreePath(getBeanTreePath().getPath());
  }

  private void addBreadCrumbs(Page page) {
    List<BeanTreePath> breadCrumbs = new ArrayList<>();
    NavTreePath navTreePath = new NavTreePath(getInvocationContext());
    List<NavTreePathSegment> segments = navTreePath.getSegments();
    // Add a breadcrumb for every part of the the nav tree path that isn't a group
    for (int i = 0; i < segments.size(); i++) {
      NavTreePathSegment segment = segments.get(i);
      NavTreeNodeDef node = segment.getNavTreeNodeDef();
      if (node.isChildNodeDef()) {
        BeanTreePath btp = segment.getBeanTreePath();
        if (btp.isCollectionChild()) {
          // add a breadcrumb for the collection too (make sure it's before the child)
          // note: add it even if this is the last segment
          breadCrumbs.add(BeanTreePath.create(btp.getBeanRepo(), btp.getPath().getParent()));
        }
        // add a breadcrumb for the nav tree segment if it isn't the last segment
        if (i  < segments.size() - 1) {
          breadCrumbs.add(btp);
        }
      }
    }
    page.setBreadCrumbs(breadCrumbs);
  }

  protected Response<PageDef> getPageDef() {
    return getPageDef(getInvocationContext().getPagePath());
  }

  protected Response<PageDef> getPageDef(PagePath pagePath) {
    Response<PageDef> pageDefResponse = getUncustomizedPageDef(pagePath);
    if (!pageDefResponse.isSuccess()) {
      return pageDefResponse;
    }
    PageDef uncustomizedPageDef = pageDefResponse.getResults();
    String methodName = uncustomizedPageDef.getCustomizePageDefMethod();
    if (StringUtils.isEmpty(methodName)) {
      // There isn't a customizer for this page def.
      // Return the standard page def.
      return new Response<PageDef>().setSuccess(uncustomizedPageDef);
    }
    // Call the customizer, passing in the invocation context and page def
    Method method = CustomizerInvocationUtils.getMethod(methodName);
    CustomizerInvocationUtils.checkSignature(
      method,
      CUSTOMIZE_PAGE_DEF_RETURN_TYPE,
      InvocationContext.class,
      PageDef.class
    );
    try {
      List<Object> args = List.of(getInvocationContext(), uncustomizedPageDef);
      Object rtn = CustomizerInvocationUtils.invokeMethod(method, args);
      @SuppressWarnings("unchecked")
      PageDef results = (PageDef)rtn;
      return pageDefResponse.setSuccess(results);
    } catch (ResponseException e) {
      return pageDefResponse.copyUnsuccessfulResponse(e.getResponse());
    }
  }

  protected Response<PageDef> getUncustomizedPageDef(PagePath pagePath) {
    Response<PageDef> response = new Response<>();
    PageDef pageDef = getPageRepoDef().getPageDef(pagePath);
    if (pageDef == null) {
      LOGGER.warning("Can't find page " + pagePath);
      Thread.dumpStack();
      return response.setNotFound();
    }
    return response.setSuccess(pageDef);
  }

  protected void addLinks(Page page, boolean forInstance) {
    List<Link> links = new ArrayList<>();
    LinksDef linksDef =
      getPageRepoDef().getLinksDef(page.getPageDef().getPagePath().getPagesPath().getTypeDef());
    if (linksDef != null) {
      for (LinkDef linkDef : linksDef.getLinkDefs(forInstance)) {
        links.addAll(createLinks(linkDef));
      }
    }
    addLinksFromChildren(links, page);
    if (!links.isEmpty()) {
      page.setLinks(links);
    }
  }

  protected void addChangeManagerStatus(Page page, BeanReaderRepoSearchResults searchResults) {
    if (searchResults.isChangeManagerBeanRepoSearchResults()) {
      page.setChangeManagerStatus(
        searchResults.asChangeManagerBeanRepoSearchResults().getChangeManagerStatus()
      );
    }
  }

  private void addLinksFromChildren(
    List<Link> links,
    Page page
  ) {
    if (page.getSelf().isCollection()) {
      return;
    }
    NavTreeDef nav =
      getInvocationContext().getPageRepo().getPageRepoDef()
        .getNavTreeDef(
          page.getPageDef().getPagePath().getPagesPath().getTypeDef()
        );
    if (nav == null) {
      return;
    }
    for (NavTreeNodeDef node : nav.getContentDefs()) {
      if (!node.isChildNodeDef()) {
        continue;
      }
      Link link = new Link();
      link.setLabel(
        getInvocationContext().getLocalizer().localizeString(node.getLabel())
        + " - "
        + page.getNavTreePath().getLastComponent()
      );
      Path path = new Path(
        getInvocationContext().getPageRepo().getPageRepoDef().getName()
      );
      path.addComponent("data");
      path.addPath(page.getSelf().getPath());
      path.addPath(node.asChildNodeDef().getChildNodePath());
      link.setResourceData(path);
      links.add(link);
    }
  }

  private List<Link> createLinks(LinkDef linkDef) {
    List<Link> links = new ArrayList<>();
    Path pageRepoRelativeResourceData = getPageRepoRelativeResourceData(linkDef);
    if (pageRepoRelativeResourceData == null) {
      // We can't find values for one or  more of the link's template (e.g. <Machine>)
      // in ic's bean.  That's OK.  Skip this link.
      return links;
    }
    for (Root root : getRootsThatSupportLink(linkDef)) {
      links.add(createLink(linkDef, pageRepoRelativeResourceData, root));
    }
    return links;
  }

  private Path getPageRepoRelativeResourceData(LinkDef linkDef) {
    return (new BeanTreePathTemplate(linkDef.getResourceData())).expand(getBeanTreePath());
  }

  // e.g. find all the roots that support Domain/Servers (i.e. edit & serverConfig)
  private List<Root> getRootsThatSupportLink(LinkDef linkDef) {
    String rootName = linkDef.getRoot();
    List<Root> roots = new ArrayList<>();
    for (Root root : getInvocationContext().getProvider().getRoots().values()) {
      if (root.getRootName().equals(rootName)) {
        roots.add(root);
      }
    }
    return roots;
  }

  private Link createLink(
    LinkDef linkDef,
    Path pageRepoRelativeResourceData,
    Root root
  ) {
    Link link = new Link();
    link.setResourceData(getLinkResourceData(pageRepoRelativeResourceData, root));
    link.setLabel(getLinkLabel(linkDef, root));
    LocalizableString nfm = linkDef.getNotFoundMessage();
    if (nfm != null) {
      link.setNotFoundMessage(getInvocationContext().getLocalizer().localizeString(nfm));
    }
    return link;
  }

  private Path getLinkResourceData(Path pageRepoRelativeResourceData, Root root) {
    Path resourceData = new Path(root.getName()); // e.g. edit or serverConfig
    resourceData.addComponent("data");
    resourceData.addPath(pageRepoRelativeResourceData); // e.g. Domain/Servers
    return resourceData;
  }
  
  private String getLinkLabel(LinkDef linkDef, Root root) {
    return
      getInvocationContext().getLocalizer().localizeString(linkDef.getLabel())
      + " - "
      + getInvocationContext().getLocalizer().localizeString(root.getLabel());
  }

  protected List<BeanPropertyDef> createPropertyDefList() {
    // Always add the identity so that we can find out whether the bean exists.
    // Otherwise, if there are no other properties on the page (e.g. because
    // the WLS version doesn't support any of them), nothing gets added to the
    // underlying search query and no results are returned, and we can't tell
    // whether the bean exists.
    // Also, we need the identity so we can create links to the bean/s.
    List<BeanPropertyDef> propDefs = new ArrayList<>();
    propDefs.add(getBeanTreePath().getTypeDef().getIdentityPropertyDef());
    return propDefs;
  }

  protected Response<Value> getPropertyValue(
    BeanPropertyDef propertyDef,
    BeanSearchResults beanResults,
    BeanReaderRepoSearchResults searchResults,
    boolean includeIsSet
  ) {
    return getPropertyValue(propertyDef, getBeanTreePath(), beanResults, searchResults, includeIsSet);
  }

  protected Response<Value> getPropertyValue(
    BeanPropertyDef propertyDef,
    BeanTreePath beanTreePath,
    BeanSearchResults beanResults,
    BeanReaderRepoSearchResults searchResults,
    boolean includeIsSet
  ) {
    return
      (new PageReaderHelper(getInvocationContext())).getPropertyValue(
        propertyDef,
        beanTreePath,
        beanResults,
        searchResults,
        includeIsSet
      );
  }

  protected Response<List<Object>> getArguments(
    CustomizerDef customizerDef,
    BeanSearchResults beanResults,
    BeanReaderRepoSearchResults searchResults,
    boolean includeIsSet
  ) {
    return getArguments(customizerDef, getBeanTreePath(), beanResults, searchResults, includeIsSet);
  }

  protected Response<List<Object>> getArguments(
    CustomizerDef customizerDef,
    BeanTreePath beanTreePath,
    BeanSearchResults beanResults,
    BeanReaderRepoSearchResults searchResults,
    boolean includeIsSet
  ) {
    return
     (new PageReaderHelper(getInvocationContext())).getArguments(
        customizerDef,
        beanTreePath,
        beanResults,
        searchResults,
        includeIsSet
      );
  }
}
