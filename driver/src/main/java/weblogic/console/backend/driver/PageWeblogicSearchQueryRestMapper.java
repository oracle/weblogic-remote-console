// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.logging.Logger;
import javax.json.JsonObject;

import weblogic.console.backend.typedesc.WeblogicBeanProperty;
import weblogic.console.backend.utils.Path;

/**
 * Creates WebLogic REST search queries for pages, including the properties needed by the page,
 * and the properties needed to compute the options for the properties on the page,
 * and any properties for input arguments to plugins.
 *
 * <p>For example, for the Server General page for Server1, it returns:
 * <pre>
 * {
 *   "fields": [],
 *   "children": [
 *     "consolehangeManager": {},
 *     "servers": {
 *       "fields": [ "identity", "name", "listenPort", "machine"],
 *       "name": [ "Server1"],
 *       "children": {
 *         "SSL" : {
 *           "fields": [ "listenPort" ]
 *         }
 *       }
 *     },
 *     "machines": {
 *       "fields": [ "identity"] // used to compute the list of available machines
 *     }
 *   }
 * }
 * </pre>
 */
public class PageWeblogicSearchQueryRestMapper extends BaseRestMapper {

  public static JsonObject createPageQuery(
    PageRestMapping pageRestMapping,
    InvocationContext invocationContext
  ) throws Exception {
    LOGGER.finest("createPageQuery pageRestMapping=" + pageRestMapping);
    LOGGER.finest("createPageQuery invocationContext=" + invocationContext);
    JsonObject query =
      (new PageWeblogicSearchQueryRestMapper(pageRestMapping, invocationContext))
        .doCreatePageWeblogicSearchQuery();
    LOGGER.finest("createPageQuery query=" + query);
    return query;
  }

  public static JsonObject createSubTypeDiscriminatorQuery(
    PageRestMapping pageRestMapping,
    InvocationContext invocationContext
  ) throws Exception {
    LOGGER.finest("createSubTypeDiscriminatorQuery pageRestMapping=" + pageRestMapping);
    LOGGER.finest("createSubTypeDiscriminatorQuery invocationContext=" + invocationContext);
    JsonObject query =
      (new PageWeblogicSearchQueryRestMapper(pageRestMapping, invocationContext))
        .doCreateSubTypeDiscriminatorWeblogicSearchQuery();
    LOGGER.finest("createSubTypeDiscriminatorQuery query=" + query);
    return query;
  }

  public static JsonObject createDeleteQuery(
    PageRestMapping pageRestMapping,
    InvocationContext invocationContext
  ) throws Exception {
    LOGGER.finest("createDeleteQuery pageRestMapping=" + pageRestMapping);
    LOGGER.finest("createDeleteQuery invocationContext=" + invocationContext);
    JsonObject query =
      (new PageWeblogicSearchQueryRestMapper(pageRestMapping, invocationContext))
        .doCreateDeleteWeblogicSearchQuery();
    LOGGER.finest("deletePageQuery query=" + query);
    return query;
  }

  private static final Logger LOGGER =
    Logger.getLogger(PageWeblogicSearchQueryRestMapper.class.getName());

  private PageRestMapping pageRestMapping;

  private PageRestMapping getPageRestMapping() {
    return this.pageRestMapping;
  }

  private PageWeblogicSearchQueryRestMapper(
    PageRestMapping pageRestMapping,
    InvocationContext invocationContext
  ) throws Exception {
    super(invocationContext);
    this.pageRestMapping = pageRestMapping;
  }

  private JsonObject doCreatePageWeblogicSearchQuery() throws Exception {
    return (new GetPageQueryBuilder()).createQuery();
  }

  private JsonObject doCreateSubTypeDiscriminatorWeblogicSearchQuery() throws Exception {
    return (new GetSubTypeDiscriminatorQueryBuilder()).createQuery();
  }

  private JsonObject doCreateDeleteWeblogicSearchQuery() throws Exception {
    return (new DeleteQueryBuilder()).createQuery();
  }

  // Constructs the overall query for getting a page's RDJ.
  // It includes the bean's identity, all of the page's properties,
  // the page's properties' options, and any mbean properties that these
  // properties' plugins need to do their work.
  // It also includes info about the config transaction if we're in the
  // configuration perspective.
  private class GetPageQueryBuilder extends QueryBuilder {
    @Override
    protected void customizeQuery(
      WeblogicObjectQueryBuilder bldr,
      PathSegmentRestMapping segmentMapping
    ) throws Exception {
      // Add the page's properties to the query:
      for (PropertyRestMapping propMapping : segmentMapping.getProperties()) {
        if (includeProperty(propMapping)) {
          bldr.addField(propMapping.getBeanProperty().getRestName());
        }
      }
      // Add those properties' options to the query:
      addOptionsToQuery(bldr, segmentMapping);
      // Get information about the config transaction if we're in the configuration perspective
      String perspective =
        getPageRestMapping()
          .getPageSource()
          .getPagePath()
          .getPagesPath()
          .getPerspectivePath()
          .getPerspective();
      if ("configuration".equals(perspective)) {
        if (segmentMapping.isRoot()) {
          bldr.addConfigInfoToQuery();
          if (getPageRestMapping().getPageSource().isCreateForm()) {
            // find out whether the domain is in production mode and whether
            // it's in secure mode so we can compute the default property values
            // in the create form's RDJ
            bldr
              .addField("productionModeEnabled");
            bldr
              .getOrCreateChild("securityConfiguration")
              .getOrCreateChild("secureMode")
              .addField("secureModeEnabled");
          }
        }
      }
    }

    @Override
    protected boolean usesPlugin(
      PluginBeanPropertyRestMapping pluginBeanProperty
    ) throws Exception {
      PluginRestMapping referringPlugin = pluginBeanProperty.getReferringPlugin();
      // Use all GetProperty plugins
      if (!referringPlugin.isGetPropertyPlugin()) {
        return false;
      }
      // If this property is used to compute a property that the client said to return
      // (or if the client didn't list which properties to return), then we need this property.
      if (includeProperty(referringPlugin.asGetPropertyPlugin().getReferringProperty())) {
        return true;
      }
      // The user listed which properties to return, and this property isn't needed
      // to compute any of them.  SKip it.
      return false;
    }

    private void addOptionsToQuery(
      WeblogicObjectQueryBuilder bldr,
      PathSegmentRestMapping segmentMapping
    ) throws Exception {
      for (OptionsRestMapping optionsMapping : segmentMapping.getOptions()) {
        if (includeProperty(optionsMapping.getReferringProperty())) {
          String optionsRestName = optionsMapping.getBeanProperty().getRestName();
          if (optionsMapping.getBeanProperty().isContainedCollection()) {
            // For contained collections, we need to add a child for the collection
            // and fetch its identity property.
            bldr.getOrCreateChild(optionsRestName).addField("identity");
          } else {
            // For other options (e.g. reference collections), just fetch the property
            bldr.addField(optionsRestName);
          }
        }
      }
    }

    // Whether to include this property in the query.
    // Basically, return it if the page uses it unless
    // the client said to not return it.
    private boolean includeProperty(PropertyRestMapping propMapping) {
      WeblogicBeanProperty beanProp = propMapping.getBeanProperty();
      PropertyRestMapping discriminator = getPageRestMapping().getSubTypeDiscriminatorProperty();
      if (discriminator != null && beanProp == discriminator.getBeanProperty()) {
        // We always include the sub type discriminator for heterogeneous types
        return true;
      }
      // Let the client decide
      return getInvocationContext().includeProperty(beanProp.getName());
    }
  }

  // Constructs the overall query for getting a bean's sub type discriminator.
  // It includes the bean's identity, the bean's sub type discriminator property,
  // and any mbean properties that the sub type discriminator's plugin needs
  // to do its work.
  private class GetSubTypeDiscriminatorQueryBuilder extends QueryBuilder {
    @Override
    protected void customizeQuery(
      WeblogicObjectQueryBuilder bldr,
      PathSegmentRestMapping segmentMapping
    ) throws Exception {
      // Add the subtype discriminator to the query:
      for (PropertyRestMapping propMapping : segmentMapping.getProperties()) {
        if (propMapping.getBeanProperty() == getSubTypeDiscriminatorProperty()) {
          bldr.addField(propMapping.getBeanProperty().getRestName());
        }
      }
    }

    @Override
    protected boolean usesPlugin(
      PluginBeanPropertyRestMapping pluginBeanProperty
    ) throws Exception {
      PluginRestMapping plugin = pluginBeanProperty.getReferringPlugin();
      if (!plugin.isGetPropertyPlugin()) {
        // Ignore other kinds of plugins, like delete plugins
        return false;
      }
      // Find the property that uses this plugin (v.s. the properties this plugin fetches)
      WeblogicBeanProperty beanProp =
        plugin.asGetPropertyPlugin().getReferringProperty().getBeanProperty();
      // Only use the sub type discriminator's plugins
      return getSubTypeDiscriminatorProperty() == beanProp;
    }

    private WeblogicBeanProperty getSubTypeDiscriminatorProperty() {
      return getPageRestMapping().getSubTypeDiscriminatorProperty().getBeanProperty();
    }
  }

  // Constructs the overall query for deleting a bean.
  // It includes the bean's identity (so we can figure out whether
  // it exists and return a not found exception) and any mbean properties
  // that this page's delete plugin needs to do its work.
  // It also returns the state of the current config transaction.
  private class DeleteQueryBuilder extends QueryBuilder {
    @Override
    protected void customizeQuery(
      WeblogicObjectQueryBuilder bldr,
      PathSegmentRestMapping segmentMapping
    ) throws Exception {
      // The base class already added the identity and the appropriate plugin's property
      // Get information about the config transaction
      bldr.addConfigInfoToQuery();
    }

    @Override
    protected boolean usesPlugin(
      PluginBeanPropertyRestMapping pluginBeanProperty
    ) throws Exception {
      // Only use the page's delete plugin
      return pluginBeanProperty.getReferringPlugin() == getPageRestMapping().getDeletePlugin();
    }
  }

  // Base class for constructing the overall query for this page.
  private abstract class QueryBuilder {

    // Create the overal query for this page.
    /*package*/ JsonObject createQuery() throws Exception {
      return
        createPathSegmentQuery(null, getPageRestMapping().getRootPathSegment())
          .getBuilder()
          .build();
    }

    // Give the derived class a chance to add stuff to the query
    protected void customizeQuery(
      WeblogicObjectQueryBuilder bldr,
      PathSegmentRestMapping segmentMapping
    ) throws Exception {
    }

    // The derived needs to tell us what plugins it uses
    protected abstract boolean usesPlugin(
      PluginBeanPropertyRestMapping pluginBeanProperty
    ) throws Exception;

    // Create the part of the query for a path segment
    private WeblogicObjectQueryBuilder createPathSegmentQuery(
      WeblogicObjectQueryBuilder parentBldr,
      PathSegmentRestMapping segmentMapping
    ) throws Exception {

      // Create the query for this path segment
      WeblogicObjectQueryBuilder bldr =
          segmentMapping.isRoot()
          ? new WeblogicObjectQueryBuilder()
          : parentBldr.getOrCreateChild(segmentMapping.getBeanProperty().getRestName());

      // Fetch this segment's identity
      addIdentityToQuery(bldr, segmentMapping);

      // Add the segment's plugins' args to the query:
      for (PluginBeanPropertyRestMapping pluginBeanProp : segmentMapping.getPluginBeanProperties()) {
        if (usesPlugin(pluginBeanProp)) {
          bldr.addField(pluginBeanProp.getBeanProperty().getRestName());
        }
      }

      // Give the derived class a chance to add stuff to the query
      customizeQuery(bldr, segmentMapping);

      // Add the child segments to the query:
      for (PathSegmentRestMapping childMapping : segmentMapping.getChildren()) {
        createPathSegmentQuery(bldr, childMapping);
      }
      return bldr;
    }

    // Adds this segment's identity to the query.
    // Also filters the instances if needed.
    private void addIdentityToQuery(
      WeblogicObjectQueryBuilder bldr,
      PathSegmentRestMapping segmentMapping
    ) throws Exception {
      // Determine whether this segment is a contained collection
      boolean isContainedCollection = 
        (segmentMapping.isRoot())
        ? false
        : segmentMapping.getBeanProperty().isContainedCollection();

      // Fetch the identity if this is the top level bean for the page
      // or if this is a contained collection.
      if (segmentMapping == getPageRestMapping().getPagePathSegment() || isContainedCollection) {
        bldr.addField("identity");
      }

      if (isContainedCollection) {

        // Always fetch the key property for collections and collection children
        String keyPropRestName =
            segmentMapping.getBeanProperty().getBeanType().getKeyProperty().getRestName();
        bldr.addField(keyPropRestName);

        if (hasCollectionPluginParameter(segmentMapping)) {
          // The collection needs to be passed to a plugin.
          // Don't specify which item in the collection to return
          // so that we get all of them (since that's what the
          // plugin expects to receive).
        } else if (isOptionsSource(segmentMapping)) {
          // The collection needs to used to compute options for
          // a reference property.
          // Don't specify which item in the collection to return
          // so that we get all of them so taht we can add them all
          // to the property's options.
        } else {
          int identityIndex = segmentMapping.getIdentityIndex();
          if (identityIndex < getIdentity().getFoldedBeanPathWithIdentities().length()) {
            // The child in this collection is specified in the url.
            // e.g. Domain/Servers/AdminServer, and we're processing Servers
            // e.g. Domain/Servers/AdminServer/Channels, and we're processing Servers
            // Only fetch it (v.s. all items in the collection)
            bldr.setKey(
              keyPropRestName,
              getIdentity().getFoldedBeanPathWithIdentities().getComponents().get(identityIndex)
            );
          } else {
            // The child in this collection is not specifed in the url.
            // e.g. Domain/Servers/AdminServer/Channels, and we're processing CHannels
            // Don't specify the which item in the collection to return
            // so that we get all of them.
          }
        }
      }
    }

    // Determines whether this collection segment is used as an options source.
    // If so, then we need return all of the items in the collection
    // (v.s. filtering them)
    private boolean isOptionsSource(PathSegmentRestMapping segmentMapping) throws Exception {
      // See if my parent segment has an options rest mapping for me.
      Path pathWant = segmentMapping.getUnfoldedBeanPath();
      Path parentPath = segmentMapping.getParent().getUnfoldedBeanPath();
      for (OptionsRestMapping options : segmentMapping.getParent().getOptions()) {
        // Create the option's property's full unfolded path by appending its
        // rest name to its segement's unfolded path
        Path pathHave = new Path(parentPath); // clone so we can modify it
        WeblogicBeanProperty optionsProp = options.getBeanProperty();
        pathHave.addComponent(optionsProp.getRestName());
        // See if the paths match
        if (pathWant.toString().equals(pathHave.toString())) {
          return true;
        }
      }
      return false;
    }

    // Determines whether this collection path segment is used by any plugins.
    // If so, then we need return all of the items in in the collection
    // (v.s. filtering them)
    private boolean hasCollectionPluginParameter(
      PathSegmentRestMapping segmentMapping
    ) throws Exception {
      for (PluginBeanPropertyRestMapping pluginBeanProperty : segmentMapping.getPluginBeanProperties()) {
        if (usesPlugin(pluginBeanProperty)) {
          if (pluginBeanProperty.getReferringPluginParameter().isCollectionParameter()) {
            return true;
          }
        }
      }
      return false;
    }
  }
}
