// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.util.Map;
import java.util.TreeMap;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObjectBuilder;

import weblogic.remoteconsole.common.repodef.BeanChildDef;
import weblogic.remoteconsole.common.repodef.SlicesDef;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.AddedBean;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.BeanTreePathSegment;
import weblogic.remoteconsole.server.repo.Changes;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.ModifiedBeanProperty;
import weblogic.remoteconsole.server.repo.RemovedBean;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.Value;

/**
 * Converts a Response<ChangeManagerStatus> to a JAXRS Response.
 */
public class ChangesResponseMapper extends ResponseMapper<Changes> {

  public static javax.ws.rs.core.Response toResponse(
    InvocationContext invocationContext,
    Response<Changes> response
  ) {
    return new ChangesResponseMapper(invocationContext, response).toResponse();
  }

  private ChangesResponseMapper(
    InvocationContext invocationContext,
    Response<Changes> response
  ) {
    super(invocationContext, response);
  }

  @Override
  protected void addResults() {
    Changes changes = getResponse().getResults();
    ChangeManagerStatusResponseMapper.addChangeManagerStatus(getEntityBuilder(), changes.getChangeManagerStatus());
    JsonObjectBuilder dataBldr = Json.createObjectBuilder();
    addModifications(dataBldr, changes);
    addAdditions(dataBldr, changes);
    addRemovals(dataBldr, changes);
    getEntityBuilder().add("data", dataBldr);
  }

  private void addModifications(JsonObjectBuilder dataBldr, Changes changes) {
    dataBldr.add("modifications", formatModifications(sortModifications(changes)));
  }

  private JsonArrayBuilder formatModifications(Map<String,Map<String,ModifiedBeanProperty>> sortedModifications) {
    JsonArrayBuilder modsBldr = Json.createArrayBuilder();
    for (Map.Entry<String,Map<String,ModifiedBeanProperty>> beanEntry : sortedModifications.entrySet()) {
      String breadCrumbs = beanEntry.getKey();
      BeanTreePath beanPath = null;
      JsonArrayBuilder propsBldr = Json.createArrayBuilder();
      for (Map.Entry<String,ModifiedBeanProperty> propEntry : beanEntry.getValue().entrySet()) {
        String propLabel = propEntry.getKey();
        ModifiedBeanProperty propMod = propEntry.getValue();
        // Use the page relative beanPath from the last mod
        // (it doesn't matter which one we pick
        // since they're all supposed to be the same page)
        beanPath = getPagePath(propMod.getBeanTreePath());
        JsonObjectBuilder propBldr = Json.createObjectBuilder();
        propBldr.add("label", propLabel);
        Value oldValue = propMod.getOldValue();
        if (oldValue != null) {
          JsonObjectBuilder valBldr = Json.createObjectBuilder();
          addValueToJsonObject(valBldr, Value.unsettableValue(oldValue)); // don't include 'set'
          propBldr.add("oldValue", valBldr);
        }
        Value newValue = propMod.getNewValue();
        if (newValue != null) {
          JsonObjectBuilder valBldr = Json.createObjectBuilder();
          addValueToJsonObject(valBldr, Value.unsettableValue(newValue)); // don't include 'set'
          propBldr.add("newValue", valBldr);
        }
        propsBldr.add(propBldr);
      }
      JsonObjectBuilder beanBldr = Json.createObjectBuilder();
      beanBldr.add("bean", beanTreePathToJson(beanPath, breadCrumbs, ""));
      beanBldr.add("properties", propsBldr);
      modsBldr.add(beanBldr);
    }
    return modsBldr;
  }


  private Map<String,Map<String,ModifiedBeanProperty>> sortModifications(Changes changes) {
    Map<String,Map<String,ModifiedBeanProperty>> sortedModifications = new TreeMap<>();
    for (ModifiedBeanProperty modification : changes.getModifications()) {
      BeanTreePath beanPath = modification.getBeanTreePath();
      // Find the nearest bean in the path that has pages:
      BeanTreePath pagePath = getPagePath(beanPath);
      // Find the path from that page to this bean:
      Path pagePropertyPrefix = getPropertyPrefix(beanPath, pagePath);
      // Get the bread crumbs to the page:
      String breadCrumbs = getBreadCrumbs(pagePath);
      // Find the modified properties for the page:
      Map<String,ModifiedBeanProperty> sortedProperties =
        sortedModifications.get(breadCrumbs);
      if (sortedProperties == null) {
        sortedProperties = new TreeMap<>();
        sortedModifications.put(breadCrumbs, sortedProperties);
      }
      // Add this property to it.
      Path pageRelativePropertyPath =
        pagePropertyPrefix.childPath(modification.getPropertyDef().getPropertyPath());
      // Figure out what label to display for this property
      String propertyLabel = getPropertyLabel(pagePath, pageRelativePropertyPath);
      // Record the property
      sortedProperties.put(propertyLabel, modification);
    }
    return sortedModifications;
  }

  private String getPropertyLabel(BeanTreePath pagePath, Path pageRelativePropertyPath) {
    return pageRelativePropertyPath.getDotSeparatedPath();
  }

  private BeanTreePath getPagePath(BeanTreePath beanPath) {
    BeanChildDef lastChildDef = beanPath.getLastSegment().getChildDef();
    if (hasSlices(lastChildDef)) {
      return beanPath;
    }
    // The last segment doesn't have pages.
    // Try one level up.
    Path path = beanPath.getPath();
    Path parentPath = path.subPath(0, path.length() - 1);
    return
      getPagePath(
        BeanTreePath.create(
          getInvocationContext().getPageRepo().getBeanRepo(),
          parentPath
        )
      );
  }

  private Path getPropertyPrefix(BeanTreePath beanPath, BeanTreePath pagePath) {
    return beanPath.getPath().subPath(pagePath.getPath().length(), beanPath.getPath().length());
  }

  private void addAdditions(JsonObjectBuilder dataBldr, Changes changes) {
    Map<String,AddedBean> sortedAdditions = new TreeMap<>();
    for (AddedBean addition : changes.getAdditions()) {
      sortedAdditions.put(getBreadCrumbs(addition.getBeanTreePath()), addition);
    }
    JsonArrayBuilder bldr = Json.createArrayBuilder();
    for (Map.Entry<String,AddedBean> entry : sortedAdditions.entrySet()) {
      bldr.add(
        beanTreePathToJson(
          entry.getValue().getBeanTreePath(),
          entry.getKey(), // use the bread crumbs as the label
          "" // no query params
        )
      );
    }
    dataBldr.add("additions", bldr);
  }

  private void addRemovals(JsonObjectBuilder dataBldr, Changes changes) {
    Map<String,RemovedBean> sortedRemovals = new TreeMap<>();
    for (RemovedBean removal : changes.getRemovals()) {
      sortedRemovals.put(getBreadCrumbs(removal.getBeanTreePath()), removal);
    }
    JsonArrayBuilder bldr = Json.createArrayBuilder();
    for (Map.Entry<String,RemovedBean> entry : sortedRemovals.entrySet()) {
      // Only include the label of the removed bean since its RDJ link 
      // can't work because the bean has been removed
      bldr.add(
        Json.createObjectBuilder().add("label", entry.getKey()) // use the bread crumbs as the label
      );
    }
    dataBldr.add("removals", bldr);
  }

  private String getBreadCrumbs(BeanTreePath beanPath) {
    Path breadCrumbs = new Path();
    for (BeanTreePathSegment segment : beanPath.getSegments()) {
      BeanChildDef childDef = segment.getChildDef();
      if (hasSlices(childDef)) {
        breadCrumbs.addComponent(
          getInvocationContext().getLocalizer().localizeString(childDef.getLabel())
        );
        if (childDef.isCollection() && segment.isKeySet()) {
          breadCrumbs.addComponent(segment.getKey());
        }
      }
    }
    return breadCrumbs.getSlashSeparatedPath();
  }

  private boolean hasSlices(BeanChildDef childDef) {
    SlicesDef slicesDef =
      getInvocationContext().getPageRepo().getPageRepoDef().getSlicesDef(
        childDef.getChildTypeDef()
      );
    return slicesDef != null;
  }
}
