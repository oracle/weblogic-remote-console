// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import weblogic.remoteconsole.common.repodef.BeanPropertyCustomizerDef;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.CollectionParamDef;
import weblogic.remoteconsole.common.repodef.CustomizerDef;
import weblogic.remoteconsole.common.repodef.LinkDef;
import weblogic.remoteconsole.common.repodef.LinksDef;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.NavTreeDef;
import weblogic.remoteconsole.common.repodef.NavTreeNodeDef;
import weblogic.remoteconsole.common.repodef.ParamDef;
import weblogic.remoteconsole.common.utils.CustomizerInvocationUtils;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.providers.Root;

/**
 * This class manages reading a page.
 * It is an internal detail of a PageRepo.
 */
class PageReader extends PageManager {

  protected PageReader(InvocationContext invocationContext) {
    super(invocationContext);
  }

  protected void addPageInfo(Page page) {
    addSelf(page);
    addBreadCrumbs(page);
  }

  protected void addSubTypeDiscriminatorToSearch(
    BeanTreePath beanTreePath,
    BeanReaderRepoSearchBuilder builder
  ) {
    // Find out which property on the bean indicates its type
    BeanPropertyDef discPropertyDef = beanTreePath.getTypeDef().getSubTypeDiscriminatorPropertyDef();

    // Add it, and anything needed to compute it to the search
    builder.addProperty(beanTreePath, discPropertyDef);
    builder.addProperty(beanTreePath, discPropertyDef.getTypeDef().getIdentityPropertyDef());
    addParamsToSearch(builder, beanTreePath, discPropertyDef.getGetValueCustomizerDef());
  }

  protected Response<String> getSubTypeDiscriminatorValue(
    BeanTreePath beanTreePath,
    BeanReaderRepoSearchResults searchResults
  ) {
    Response<String> response = new Response<>();

    BeanSearchResults beanResults = searchResults.getBean(beanTreePath);
    if (beanResults == null) {
      return response.setNotFound();
    }

    // Find out which property on the bean indicates its type
    BeanPropertyDef discPropertyDef = beanTreePath.getTypeDef().getSubTypeDiscriminatorPropertyDef();

    // Get the value of the property from the search results and return it
    boolean includeIsSet = false;
    Response<Value> valueResponse =
      getPropertyValue(discPropertyDef, beanResults, searchResults, includeIsSet);
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
    if (customizerDef == null) {
      return;
    }
    for (ParamDef paramDef : customizerDef.getParamDefs()) {
      addParamToSearch(builder, beanTreePath, paramDef);
    }
  }

  private void addParamToSearch(
    BeanReaderRepoSearchBuilder builder,
    BeanTreePath beanTreePath,
    ParamDef paramDef
  ) {
    if (paramDef.isInvocationContext()) {
      // We don't need to fetch anything from the bean repo since
      // this parameter passes the invocation context to the customizer method.
    } else if (paramDef.isProperty()) {
      builder.addProperty(beanTreePath, paramDef.asProperty().getPropertyDef());
    } else if (paramDef.isCollection()) {
      CollectionParamDef collParamDef = paramDef.asCollection();
      BeanTreePath collBeanTreePath = getCollectionBeanTreePath(beanTreePath, collParamDef);
      for (BeanPropertyDef propertyDef : collParamDef.getPropertyDefs()) {
        builder.addProperty(collBeanTreePath, propertyDef);
      }
    } else {
      throw new AssertionError("Unsupported customizer parameter: " + paramDef);
    }
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

  protected void addLinks(Page page, boolean forInstance) {
    List<Link> links = new ArrayList<>();
    LinksDef linkDefs = getPageRepoDef().getLinksDef(getBeanTreePath().getTypeDef());
    if (linkDefs != null) {
      for (LinkDef linkDef : linkDefs.getLinkDefs(forInstance)) {
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
        .getNavTreeDef(page.getSelf().getTypeDef());
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
    for (Root root : getRootsThatSupportLink(pageRepoRelativeResourceData)) {
      links.add(createLink(linkDef, pageRepoRelativeResourceData, root));
    }
    return links;
  }

  private Path getPageRepoRelativeResourceData(LinkDef linkDef) {
    return (new BeanTreePathTemplate(linkDef.getResourceData())).expand(getBeanTreePath());
  }

  // e.g. find all the roots that support Domain/Servers (i.e. edit & serverConfig)
  private List<Root> getRootsThatSupportLink(Path pageRepoRelativeResourceData) {
    String rootName = pageRepoRelativeResourceData.getFirstComponent(); // e.g. Domain or DomainRuntime
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
    Response<Value> response = new Response<>();
    if (propertyDef.getGetValueCustomizerDef() == null) {
      return response.setSuccess(beanResults.getValue(propertyDef));
    } else {
      return getCustomPropertyValue(propertyDef, beanResults, searchResults, includeIsSet);
    }
  }

  private Response<Value> getCustomPropertyValue(
    BeanPropertyDef propertyDef,
    BeanSearchResults beanResults,
    BeanReaderRepoSearchResults searchResults,
    boolean includeIsSet
  ) {
    Response<Value> response = new Response<>();
    BeanPropertyCustomizerDef customizerDef = propertyDef.getGetValueCustomizerDef();
    boolean argsIncludeIsSet = true;
    List<Object> args = getArguments(customizerDef, beanResults, searchResults, argsIncludeIsSet);
    Object rtn = CustomizerInvocationUtils.invokeMethod(customizerDef.getMethod(), args);
    @SuppressWarnings("unchecked")
    Response<SettableValue> customizerResponse = (Response<SettableValue>)rtn;
    if (!customizerResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(customizerResponse);
    }
    SettableValue settableValue = customizerResponse.getResults();
    return response.setSuccess(getValue(settableValue, includeIsSet));
  }

  protected List<Object> getArguments(
    CustomizerDef customizerDef,
    BeanSearchResults beanResults,
    BeanReaderRepoSearchResults searchResults,
    boolean includeIsSet
  ) {
    List<Object> args = new ArrayList<>();
    for (ParamDef paramDef : customizerDef.getParamDefs()) {
      args.add(getArgument(paramDef, beanResults, searchResults, includeIsSet));
    }
    return args;
  }

  private Object getArgument(
    ParamDef paramDef,
    BeanSearchResults beanResults,
    BeanReaderRepoSearchResults searchResults,
    boolean includeIsSet
  ) {
    if (paramDef.isInvocationContext()) {
      return getInvocationContext();
    } else if (paramDef.isProperty()) {
      if (beanResults == null) {
        // This is probably because an options customizer on a property on a create form
        // has used a bean relative @Source annotation.  This is not supported.
        throw new AssertionError("Null beanResults");
      }
      return argumentValue(beanResults.getValue(paramDef.asProperty().getPropertyDef()), includeIsSet);
    } else if (paramDef.isCollection()) {
      return getCollectionArgument(paramDef.asCollection(), beanResults, searchResults, includeIsSet);
    } else {
      throw new AssertionError("Unsupported parameter " + paramDef);
    }
  }

  private Object getCollectionArgument(
    CollectionParamDef paramDef,
    BeanSearchResults beanResults,
    BeanReaderRepoSearchResults searchResults,
    boolean includeIsSet
  ) {
    Path collectionPath = getCollectionPath(paramDef, beanResults);
    List<BeanSearchResults> collectionResults =
      searchResults.getCollection(BeanTreePath.create(getBeanRepo(), collectionPath));
    if (collectionResults == null) {
      return null; // the collection is not present in the search results
    }
    List<Map<String,Object>> collection = new ArrayList<>();
    for (BeanSearchResults collectionChildResults : collectionResults) {
      Map<String,Object> collectionChild = new HashMap<>();
      for (BeanPropertyDef propertyDef : paramDef.getPropertyDefs()) {
        collectionChild.put(
          propertyDef.getPropertyPath().getDotSeparatedPath(),
          argumentValue(collectionChildResults.getValue(propertyDef), includeIsSet)
        );
      }
      collection.add(collectionChild);
    }
    return collection;
  }

  private Path getCollectionPath(CollectionParamDef paramDef, BeanSearchResults beanResults) {
    Path collectionPath = paramDef.getCollectionPath();
    if (!collectionPath.isEmpty()) {
      return collectionPath;
    }
    // The collection path on the customizer is relative to the bean being invoked.
    // Get the bean's identity from the bean's search results
    // and use it to construct the collection's full path.
    if (beanResults == null) {
      // This is probably because an options customizer on a property on a create form
      // has used a bean relative @Source annotation.  This is not supported.
      throw new AssertionError("Null beanResults");
    }
    BeanPropertyDef propertyDef = paramDef.getCustomizerDef().asProperty().getPropertyDef();
    BeanPropertyDef identityDef = propertyDef.getTypeDef().getIdentityPropertyDef();
    BeanTreePath parentBeanPath =
      Value.unsettableValue(beanResults.getValue(identityDef)).asBeanTreePath();
    return parentBeanPath.getPath().childPath(paramDef.getCollectionDef().getChildPath());
  }

  private Value getValue(SettableValue settableValue, boolean includeIsSet) {
    if (includeIsSet || settableValue == null) {
      return settableValue;
    }
    return settableValue.getValue();
  }

  private Value argumentValue(Value value, boolean includeIsSet) {
    return (includeIsSet) ? Value.settableValue(value) : Value.unsettableValue(value);
  }
}
