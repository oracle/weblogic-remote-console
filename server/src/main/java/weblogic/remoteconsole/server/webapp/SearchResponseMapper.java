// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.util.List;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObjectBuilder;

import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.NavTreePath;
import weblogic.remoteconsole.server.repo.NavTreePathSegment;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.SearchBeanPropertyResults;
import weblogic.remoteconsole.server.repo.SearchBeanResults;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.Value;

/**
 * Converts a List<SearchBeanResults> to a JAXRS Response.
 * Used to return the results of a general search to the CFE.
 */
public class SearchResponseMapper extends ResponseMapper<List<SearchBeanResults>> {

  public static javax.ws.rs.core.Response toResponse(
    InvocationContext ic,
    Response<List<SearchBeanResults>> response
  ) {
    return new SearchResponseMapper(ic, response).toResponse();
  }

  private SearchResponseMapper(
    InvocationContext ic,
    Response<List<SearchBeanResults>> response
  ) {
    super(ic, response);
  }

  @Override
  protected void addResults() {
    getEntityBuilder().add(
      "beans",
      beansResultsToJson(getResponse().getResults()).build()
    );
  }

  private JsonArrayBuilder beansResultsToJson(List<SearchBeanResults> beansResults) {
    JsonArrayBuilder builder = Json.createArrayBuilder();
    for (SearchBeanResults beanResults : beansResults) {
      builder.add(beanResultsToJson(beanResults));
    }
    return builder;
  }

  private JsonObjectBuilder beanResultsToJson(SearchBeanResults beanResults) {
    JsonObjectBuilder builder = Json.createObjectBuilder();
    builder.add(
      "identity",
      propertyToJson(beanResults.getBeanTreePath())
    );
    builder.add(
      "path",
      propertyToJson(new StringValue(getBeanPath(getInvocationContext(), beanResults)))
    );
    builder.add(
      "name",
      propertyToJson(new StringValue(getBeanName(getInvocationContext(), beanResults)))
    );
    builder.add(
      "type",
      propertyToJson(new StringValue(getBeanType(getInvocationContext(), beanResults)))
    );
    for (SearchBeanPropertyResults propertyResults : beanResults.getPropertiesResults()) {
      builder.add(
        propertyResults.getPropertyDef().getFormPropertyName(),
        propertyResultsToJson(propertyResults)
      );
    }
    return builder;
  }

  public static String getBeanName(InvocationContext ic, SearchBeanResults beanResults) {
    BeanTreePath btp = beanResults.getBeanTreePath();
    if (btp.isCollectionChild()) {
      // Return the bean's key property
      return btp.getLastSegment().getKey();
    } else {
      // Return the bean's nav tree node's localized label
      NavTreePath ntp = new NavTreePath(ic.getPageRepo(), btp);
      return
        ic.getLocalizer().localizeString(
          ntp.getLastSegment().getNavTreeNodeDef().getLabel()
        );
    }
  }

  public static String getBeanPath(InvocationContext ic, SearchBeanResults beanResults) {
    return getBeanNavTreePath(ic, beanResults).getSeparatedPath(" / ");
  }

  private static Path getBeanNavTreePath(InvocationContext ic, SearchBeanResults beanResults) {
    // Return the localized path that the user would see in the nav tree
    NavTreePath ntp = new NavTreePath(ic.getPageRepo(), beanResults.getBeanTreePath());
    Path path = new Path();
    for (NavTreePathSegment segment : ntp.getSegments()) {
      path.addComponent(ic.getLocalizer().localizeString(segment.getNavTreeNodeDef().getLabel()));
      BeanTreePath btp = segment.getBeanTreePath();
      if (btp != null && btp.isCollectionChild()) {
        path.addComponent(btp.getLastSegment().getKey());
      }
    }
    return path;
  }

  // Sort the beans by their name, then their nav tree path,
  // so that beans with the same name are near each other.
  public static Path getSortingKey(InvocationContext ic, SearchBeanResults beanResults) {
    Path sortingKey = new Path();
    sortingKey.addComponent(getBeanName(ic, beanResults));
    sortingKey.addPath(getBeanNavTreePath(ic, beanResults));
    return sortingKey;
  }

  public static String getBeanType(InvocationContext ic, SearchBeanResults beanResults) {
    return ic.getLocalizer().localizeString(beanResults.getTypeDef().getInstanceNameLabel());
  }

  private JsonObjectBuilder propertyResultsToJson(SearchBeanPropertyResults propertyResults) {
    String label =
      getInvocationContext().getLocalizer().localizeString(propertyResults.getPropertyDef().getLabel());
    return propertyToJson(propertyResults.getValue()).add("label", label);
  }

  private JsonObjectBuilder propertyToJson(Value value) {
    return Json.createObjectBuilder().add("value", valueToJson(value));
  }
}
