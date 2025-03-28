// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.ArrayList;
import java.util.List;

import weblogic.console.utils.Path;
import weblogic.remoteconsole.common.repodef.BeanChildDef;
import weblogic.remoteconsole.common.repodef.BeanChildNavTreeNodeDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.GroupNavTreeNodeDef;
import weblogic.remoteconsole.common.repodef.NavTreeDef;
import weblogic.remoteconsole.common.repodef.NavTreeNodeDef;

/**
 * This class manages expanding nav tree nodes.
 */
class NavTreeReader extends PageReader {

  SearchManager searchManager = new SearchManager();

  NavTreeReader(InvocationContext invocationContext) {
    super(invocationContext);
  }

  // Expand a list of nav tree nodes.
  //
  // For example, the CFE keeps a list of the currently expanded nav tree nodes.
  // When the user clicks on one of them to expand it, the CFE adds it to its
  // list of expanded nav tree nodes, then sends them all into the CBE to ask
  // it to expand them all.
  Response<List<NavTreeNode>> expandNavTreeNodes(List<NavTreeNode> nodesToExpand) {
    Response<List<NavTreeNode>> response = new Response<>();
    try {
      Response<Void> searchResponse = performSearch(nodesToExpand);
      if (!searchResponse.isSuccess()) {
        return response.copyUnsuccessfulResponse(searchResponse);
      }
      return response.setSuccess(expandNodes(nodesToExpand));
    } catch (UnsuccessfulResponseException e) {
      return response.copyUnsuccessfulResponse(e.getUnsuccessfulResponse());
    }
  }

  private Response<Void> performSearch(List<NavTreeNode> nodesToExpand) {
    SearchBuilder searchBuilder = new SearchBuilder();
    searchBuilder.addNodesToExpand(new Path(), getRootNodeDefs(), nodesToExpand);
    return searchManager.performSearch();
  }

  private List<NavTreeNode> expandNodes(List<NavTreeNode> nodesToExpand) {
    NodeExpander nodeExpander = new NodeExpander();
    return nodeExpander.expandNodes(new Path(), getRootNodeDefs(), nodesToExpand);
  }

  private class NodeExpander {

    private List<NavTreeNode> expandNodes(
      Path parentNavTreePath,
      List<NavTreeNodeDef> nodeDefs,
      List<NavTreeNode> nodesToExpand
    ) {
      List<NavTreeNode> expandedNodes = new ArrayList<>();
      for (NavTreeNodeDef nodeDef : nodeDefs) {
        NavTreeNode expandedNode =
          expandNode(parentNavTreePath, nodeDef, findNodeToExpand(nodeDef, nodesToExpand));
        if (expandedNode != null) {
          expandedNodes.add(expandedNode);
        }
      }
      return expandedNodes;
    }
  
    private NavTreeNode expandNode(Path parentNavTreePath, NavTreeNodeDef nodeDef, NavTreeNode nodeToExpand) {
      String name = nodeDef.getNodeName();
      NavTreePath navTreePath = new NavTreePath(getPageRepo(), parentNavTreePath.childPath(name));
      NavTreeNode expandedNode = new NavTreeNode();
      expandedNode.setName(name);
      expandedNode.setExpanded(nodeToExpand != null);
      if (nodeDef.isGroupNodeDef()) {
        return completeGroupNode(expandedNode, navTreePath, nodeDef.asGroupNodeDef(), nodeToExpand);
      } else if (nodeDef.isChildNodeDef()) {
        return completeChildNode(expandedNode, navTreePath, nodeDef.asChildNodeDef(), nodeToExpand);
      } else {
        throw new AssertionError("NavTreeNodeDef is not a group or child");
      }
    }
  
    private NavTreeNode completeGroupNode(
      NavTreeNode nodeToComplete,
      NavTreePath navTreePath,
      GroupNavTreeNodeDef groupNodeDef,
      NavTreeNode nodeToExpand
    ) {
      nodeToComplete.setLabel(getLocalizer().localizeString(groupNodeDef.getLabel()));
      nodeToComplete.setSelectable(false);
      List<NavTreeNodeDef> contentsNodeDefs = groupNodeDef.getContentDefs();
      nodeToComplete.setType(NavTreeNode.Type.GROUP);
      if (contentsNodeDefs.isEmpty()) {
        nodeToComplete.setExpandable(false);
      } else {
        nodeToComplete.setExpandable(true);
        if (nodeToExpand != null) {
          nodeToComplete.setContents(
            expandNodes(navTreePath.getPath(), contentsNodeDefs, nodeToExpand.getContents())
          );
        }
      }
      return nodeToComplete;
    }
  
    private NavTreeNode completeChildNode(
      NavTreeNode nodeToComplete,
      NavTreePath navTreePath,
      BeanChildNavTreeNodeDef childNodeDef,
      NavTreeNode nodeToExpand
    ) {
      BeanChildDef childDef = childNodeDef.getLastChildDef();
      BeanTreePath beanPath = navTreePath.getLastSegment().getBeanTreePath();
      nodeToComplete.setResourceData(beanPath);
      nodeToComplete.setLabel(getLocalizer().localizeString(childNodeDef.getLabel()));
      if (childDef.isCollection()) {
        return completeCollectionNode(nodeToComplete, navTreePath, childNodeDef, nodeToExpand);
      } else if (childDef.isMandatorySingleton() || childDef.isOptionalSingleton()) {
        return completeSingletonNode(nodeToComplete, navTreePath, childNodeDef, nodeToExpand);
      } else {
        throw new AssertionError(childDef + " is not a collection, mandatory singleton or optional singleton");
      }
    }
  
    private NavTreeNode completeCollectionNode(
      NavTreeNode nodeToComplete,
      NavTreePath navTreePath,
      BeanChildNavTreeNodeDef childNodeDef,
      NavTreeNode nodeToExpand
    ) {
      if (childNodeDef.isForceNotExpandable()) {
        nodeToComplete.setSelectable(true);
        nodeToComplete.setType(NavTreeNode.Type.COLLECTION);
        nodeToComplete.setExpandable(false);
        nodeToComplete.setExpanded(false);
        return nodeToComplete;
      }
      Response<List<BeanSearchResults>> getCollectionResponse =
        getCollectionResults(
          getSearchResults(navTreePath.getLastSegment().getBeanTreePath()),
          nodeToComplete.getResourceData(),
          List.of(nodeToComplete.getResourceData().getTypeDef().getIdentityPropertyDef())
        );
      List<BeanSearchResults> collectionResults = null;
      if (getCollectionResponse.isSuccess()) {
        collectionResults = getCollectionResponse.getResults();
      } else {
        // TBD - log the problem and omit the nav tree node from the results
        collectionResults = null;
      }
      if (collectionResults == null) {
        // It seems like this can't be null, due to the mandatory nature
        // of the last part of the path, however, with the use of dotted paths
        // the path to a mandatory property could be reached via optional
        // properties.  The example we hit is JobSchedulerRuntime.ExecutedJobs
        // in nav-tree.yaml.  The code recognizes that ExecutedJobs is mandatory
        // and gets here because it must be there, but JobSchedulerRuntime is
        // optional and, therefore, we still might be null.  So just return it.
        // This should never happen - we got here because the parent bean exists
        // and the parent bean's type says it should have this collection.
        return null;
      }
      nodeToComplete.setSelectable(true);
      nodeToComplete.setType(NavTreeNode.Type.COLLECTION);
      if (collectionResults.isEmpty()) {
        nodeToComplete.setExpandable(false);
        nodeToComplete.setExpanded(false);
      }  else {
        nodeToComplete.setExpandable(true);
        if (nodeToExpand != null) {
          nodeToComplete.setExpanded(true);
          nodeToComplete.setContents(
            expandCollectionChildNodes(childNodeDef, collectionResults, nodeToExpand)
          );
        } else {
          nodeToComplete.setExpanded(false);
        }
      }
      return nodeToComplete;
    }

    private List<NavTreeNode> expandCollectionChildNodes(
      BeanChildNavTreeNodeDef collectionNodeDef,
      List<BeanSearchResults> collectionResults,
      NavTreeNode collectionNodeToExpand
    ) {
      List<NavTreeNode> collectionChildNodesToExpand = collectionNodeToExpand.getContents();
      List<NavTreeNode> nodes = new ArrayList<>();
      for (BeanSearchResults collectionChildResults : collectionResults) {
        NavTreeNode node =
          expandCollectionChildNode(
            collectionNodeDef,
            collectionChildResults,
            collectionChildNodesToExpand
          );
        if (node != null) {
          nodes.add(node);
        }
      }
      return nodes;
    }

    private NavTreeNode expandCollectionChildNode(
      BeanChildNavTreeNodeDef collectionNodeDef,
      BeanSearchResults childResults,
      List<NavTreeNode> childNodesToExpand
    ) {
      BeanChildDef childDef = collectionNodeDef.getLastChildDef();
      String key =
        getStringValue(childResults.getValue(childDef.getChildTypeDef().getKeyPropertyDef()));
      NavTreeNode node = new NavTreeNode();
      node.setType(NavTreeNode.Type.COLLECTION_CHILD);
      node.setSelectable(true);
      node.setName(key);
      node.setLabel(key);
      node.setResourceData(childResults.getBeanTreePath());
      expandChildChildrenNodes(node, findNodeToExpand(key, childNodesToExpand));
      return node;
    }

    private String getStringValue(Value value) {
      if (value.isString()) {
        return value.asString().getValue();
      }
      throw new AssertionError("Non-string value: " + value);
    }

    private NavTreeNode completeSingletonNode(
      NavTreeNode nodeToComplete,
      NavTreePath navTreePath,
      BeanChildNavTreeNodeDef childNodeDef,
      NavTreeNode nodeToExpand
    ) {
      nodeToComplete.setSelectable(true);
      BeanTreePath beanPath = navTreePath.getLastSegment().getBeanTreePath();
      if (beanPath.getLastSegment().getChildDef().isRoot()) {
        nodeToComplete.setType(NavTreeNode.Type.ROOT);
      } else {
        nodeToComplete.setType(NavTreeNode.Type.SINGLETON);
      }
      BeanSearchResults singletonResults =
        getSearchResults(beanPath).getBean(nodeToComplete.getResourceData());
      if (singletonResults != null) {
        // singleton currently exists.
        // we want a node for it, and its child nodes
        expandChildChildrenNodes(nodeToComplete, nodeToExpand);
      } else {
        if (beanPath.isCreatable()) {
          // creatable optional singleton that doesn't currently exist.
          // we need a node for it, but no child nodes
          nodeToComplete.setExpandable(false);
        } else {
          if (beanPath.getLastSegment().getChildDef().isOptional()) {
            // non-creatable optional singleton that doesn't currently exist.
            // we want a node for it (but no child nodes) so that we can display
            // a message that says what conditions create the singleton.
            nodeToComplete.setExpandable(false);
          } else {
            // non-existing 'mandatory' singleton (typically a runtime mbean)
            // It returns a 404 for its RDJ, so there is no message saying how it gets created.
            // Just omit it from the nav tree.
            return null;
          }
        }
      }
      return nodeToComplete;
    }

    // Adds the nav tree nodes under a singleton or collection child.
    // nodeToComplete must already have its ResourceData property set.
    private void expandChildChildrenNodes(NavTreeNode nodeToComplete, NavTreeNode nodeToExpand) {
      List<NavTreeNodeDef> nodeDefs = getNodeDefs(getChildTypeDef(nodeToComplete));
      if (nodeDefs != null) {
        nodeToComplete.setExpandable(true);
        if (nodeToExpand != null) {
          nodeToComplete.setExpanded(true);
          NavTreePath navTreePath = new NavTreePath(getPageRepo(), nodeToComplete.getResourceData());
          nodeToComplete.setContents(expandNodes(navTreePath.getPath(), nodeDefs, nodeToExpand.getContents()));
        } else {
          nodeToComplete.setExpanded(false);
        }
      } else {
        nodeToComplete.setExpandable(false);
      }
    }
  
    private BeanTypeDef getChildTypeDef(NavTreeNode nodeToComplete) {
      Response<BeanTypeDef> response =
        getActualTypeDef(
          nodeToComplete.getResourceData(),
          getSearchResults(nodeToComplete.getResourceData())
        );
      if (!response.isSuccess()) {
        throw new UnsuccessfulResponseException(response);
      }
      return response.getResults();
    }

    private BeanReaderRepoSearchResults getSearchResults(BeanTreePath btp) {
      return searchManager.getSearchWrapper(btp).getSearchResults();
    }
  }

  private class SearchBuilder {

    private void addNodesToExpand(
      Path parentNavTreePath,
      List<NavTreeNodeDef> nodeDefs,
      List<NavTreeNode> nodesToExpand
    ) {
      if (nodeDefs == null) {
        return;
      }
      for (NavTreeNodeDef nodeDef : nodeDefs) {
        addNodeToExpand(parentNavTreePath, nodeDef, findNodeToExpand(nodeDef, nodesToExpand));
      }
    }

    private void addNodeToExpand(
      Path parentNavTreePath,
      NavTreeNodeDef nodeDef, 
      NavTreeNode nodeToExpand
    ) {
      String nodeName = (nodeToExpand != null) ? nodeToExpand.getName() : nodeDef.getNodeName();
      NavTreePath navTreePath =
        new NavTreePath(getPageRepo(), parentNavTreePath.childPath(nodeName));
      if (nodeDef.isChildNodeDef()) {
        BeanChildNavTreeNodeDef childNodeDef = nodeDef.asChildNodeDef();
        if (!childNodeDef.isForceNotExpandable()) {
          BeanTreePath beanPath = navTreePath.getLastSegment().getBeanTreePath();
          BeanTypeDef typeDef = beanPath.getTypeDef();
          addCollectionToSearch(getSearchBuilder(beanPath), beanPath, List.of(typeDef.getIdentityPropertyDef()));
          if (beanPath.isCollection()) {
            addCollectionNodeChildrenToExpand(navTreePath, childNodeDef, nodeToExpand);
          } else {
            addChildNodeChildrenToExpand(navTreePath, childNodeDef, nodeToExpand);
          }
        }
      } else if (nodeDef.isGroupNodeDef()) {
        addGroupNodeChildrenToExpand(navTreePath, nodeDef.asGroupNodeDef(), nodeToExpand);
      } else {
        throw new AssertionError("NavTreeNodeDef is not a group or child");
      }
    }

    private void addGroupNodeChildrenToExpand(
      NavTreePath groupNavTreePath,
      GroupNavTreeNodeDef groupNodeDef,
      NavTreeNode groupNodeToExpand
    ) {
      if (groupNodeToExpand != null) {
        addNodesToExpand(
          groupNavTreePath.getPath(),
          groupNodeDef.getContentDefs(),
          groupNodeToExpand.getContents()
        );
      }
    }
  
    private void addCollectionNodeChildrenToExpand(
      NavTreePath collectionNavTreePath,
      BeanChildNavTreeNodeDef collectionNodeDef,
      NavTreeNode collectionNodeToExpand
    ) {
      if (collectionNodeToExpand != null) {
        List<NavTreeNode> collectionChildNodesToExpand = collectionNodeToExpand.getContents();
        if (collectionChildNodesToExpand != null) {
          for (NavTreeNode collectionChildNodeToExpand : collectionChildNodesToExpand) {
            addNodeToExpand(collectionNavTreePath.getPath(), collectionNodeDef, collectionChildNodeToExpand);
          }
        }
      }
    }
  
    private void addChildNodeChildrenToExpand(
      NavTreePath childNavTreePath,
      BeanChildNavTreeNodeDef childNodeDef,
      NavTreeNode childNodeToExpand
    ) {
      if (childNodeToExpand != null) {
        // Find all of the type's instantiatable type's node defs and add them all to the search.
        // Later on, after the search, we'll know the instance's type and just return the
        // nav tree nodes for its type.
        addNodesToExpand(
          childNavTreePath.getPath(),
          getNodeDefs(childNodeDef.getLastChildDef().getChildTypeDef(), true),
          childNodeToExpand.getContents()
        );
      }
    }

    private BeanReaderRepoSearchBuilder getSearchBuilder(BeanTreePath btp) {
      return searchManager.getSearchWrapper(btp).getSearchBuilder();
    }
  }

  private NavTreeNode findNodeToExpand(NavTreeNodeDef nodeDef, List<NavTreeNode> nodesToExpand) {
    return findNodeToExpand(nodeDef.getNodeName(), nodesToExpand);
  }

  private NavTreeNode findNodeToExpand(String name, List<NavTreeNode> nodesToExpand) {
    for (NavTreeNode nodeToExpand : nodesToExpand) {
      if (nodeToExpand.isExpanded() && name.equals(nodeToExpand.getName())) {
        return nodeToExpand;
      }
    }
    return null;
  }

  private List<NavTreeNodeDef> getRootNodeDefs() {
    return getNodeDefs(getPageRepoDef().getRootNavTreeDef());
  }

  private List<NavTreeNodeDef> getNodeDefs(BeanTypeDef typeDef, boolean includeSubTypes) {
    if (includeSubTypes && typeDef.isHeterogeneous()) {
      List<NavTreeNodeDef> allNodeDefs = null;
      for (String discriminator : typeDef.getSubTypeDiscriminatorLegalValues()) {
        List<NavTreeNodeDef> nodeDefs = getNodeDefs(typeDef.getSubTypeDef(discriminator));
        if (nodeDefs != null && !nodeDefs.isEmpty()) {
          if (allNodeDefs == null) {
            allNodeDefs = new ArrayList<>(nodeDefs); // Make a copy so we can add to it later
          } else {
            allNodeDefs.addAll(nodeDefs);
          }
        }
      }
      return allNodeDefs;
    } else {
      return getNodeDefs(typeDef);
    }
  }

  // This works around a huge nav tree performance issue for nodes that
  // represent beans inside a deployment.
  //
  // The nav tree request body looks like:
  //   app deployments
  //     app1
  //       configuration
  //         deployments
  //           ...
  //     app2
  //       configuration
  //       deployments
  //         ...
  //   other stuff
  //
  // If we turned this into a single normal WLS REST search request, we'd get:
  //
  //  app deployments (not filtered - returns all of them)
  //    configuration
  //      deployments
  //        ...
  //  other stuff
  //
  // This forces us to read all of the deployments' archives.
  // This is a huge performance problem and uses a ton of cached memory.
  // It takes so long that the nav tree requests for SOA domains time out,
  // making the nav tree unusable.
  //
  // This class turns this into two separate WLS REST search requests:
  //
  // primary search:
  //
  //   app deployments (not filtered - returns all of them)
  //   other stuff
  //
  // secondary search for the nodes that require parsing a deployment's archive:
  //
  //   app deployments (name = app1, app2)
  //     configuration
  //     deployments
  //       ...
  //
  // This prevents us from reading all the deployments in when we need
  // to look inside one of them.  The downside is that it uses two
  // search RPCs.  This ends up being a win for this use case.
  //
  // Note: normally we would not special case particular types inside
  // the CBE infra.  However, this is the only kind of mbean that
  // needs this special handling today, and it would be hard to make
  // this code generic and yaml driven.  Also, long term, we want to
  // completely rework the nav tree so that the CBE keeps an in-memory cache
  // of the opened nodes.  When we do that, this work around will go away.
  // Given all that, we decided to hack the CBE infra for this use case for now.
  private class SearchManager {
    private SearchWrapper primarySearch = new SearchWrapper();
    private SearchWrapper parsedDeploymentsSearch = new SearchWrapper();

    private SearchWrapper getSearchWrapper(BeanTreePath btp) {
      if (needsParsedDeployment(btp)) {
        return parsedDeploymentsSearch;
      } else {
        return primarySearch;
      }
    }

    private Response<Void> performSearch() {
      Response<Void> response = new Response<>();
      {
        Response<Void> searchResponse = primarySearch.performSearch();
        if (!searchResponse.isSuccess()) {
          return response.copyUnsuccessfulResponse(searchResponse);
        }
      }
      {
        Response<Void> searchResponse = parsedDeploymentsSearch.performSearch();
        if (!searchResponse.isSuccess()) {
          return response.copyUnsuccessfulResponse(searchResponse);
        }
      }
      return response.setSuccess(null);
    }

    private boolean needsParsedDeployment(BeanTreePath btp) {
      // Requires a parsed deployment if it's a child resource of a DeploymentDBean, i.e. matches:
      //   DomainRuntime/DeploymentManager/AppDeploymentRuntimes/<app>/Configuration/Deployment/...
      List<String> c = btp.getPath().getComponents();
      if (
        c.size() > 6
          && "Deployment".equals(c.get(5))
          && "Configuration".equals(c.get(4))
          && "AppDeploymentRuntimes".equals(c.get(2))
      ) {
        return true;
      }
      return false;
    }
  }

  private class SearchWrapper {
    private BeanReaderRepoSearchBuilder searchBuilder;
    private BeanReaderRepoSearchResults searchResults;

    private BeanReaderRepoSearchBuilder getSearchBuilder() {
      if (searchBuilder == null) {
        // Since nav tree nodes never display whether a property is set, we don't need to fetch it:
        searchBuilder =
          getBeanRepo().asBeanReaderRepo().createSearchBuilder(getInvocationContext(), false);
      }
      return searchBuilder;
    }

    private Response<Void> performSearch() {
      Response<Void> response = new Response<>();
      if (searchBuilder != null) {
        Response<BeanReaderRepoSearchResults> searchResponse = searchBuilder.search();
        if (!searchResponse.isSuccess()) {
          return response.copyUnsuccessfulResponse(searchResponse);
        }
        searchResults = searchResponse.getResults();
      }
      return response.setSuccess(null);
    }

    private BeanReaderRepoSearchResults getSearchResults() {
      return searchResults;
    }
  }

  private List<NavTreeNodeDef> getNodeDefs(BeanTypeDef typeDef) {
    return getNodeDefs(getPageRepoDef().getNavTreeDef(typeDef));
  }

  private List<NavTreeNodeDef> getNodeDefs(NavTreeDef navTreeDef) {
    return (navTreeDef != null) ? navTreeDef.getContentDefs() : null;
  }
}
