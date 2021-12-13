// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.util.List;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObjectBuilder;

import weblogic.remoteconsole.common.repodef.PagePath;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.Form;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Link;
import weblogic.remoteconsole.server.repo.Option;
import weblogic.remoteconsole.server.repo.OptionsSource;
import weblogic.remoteconsole.server.repo.Page;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.Table;
import weblogic.remoteconsole.server.repo.TableCell;
import weblogic.remoteconsole.server.repo.TableRow;

/**
 * Converts a Response<Page> to a JAXRS Response.
 */
public class GetPageResponseMapper extends ResponseMapper<Page> {

  public static javax.ws.rs.core.Response toResponse(InvocationContext invocationContext, Response<Page> response) {
    return new GetPageResponseMapper(invocationContext, response).toResponse();
  }

  private GetPageResponseMapper(InvocationContext invocationContext, Response<Page> response) {
    super(invocationContext, response);
  }

  @Override
  protected void addResults() {
    if (getResponse().getResults().isForm()) {
      addForm();
    }
    if (getResponse().getResults().isTable()) {
      addTable();
    }
    addPageDescription();
  }

  private void addPageDescription() {
    getEntityBuilder()
      .add(
        "pageDescription",
        getBackendRelativeUri(
          getResponse().getResults().getPageDef().getPagePath()
        )
      );
  }

  private void addForm() {
    JsonObjectBuilder builder = Json.createObjectBuilder();
    Form formData = getResponse().getResults().asForm();
    addPageInfo(formData);
    if (formData.isExists()) {
      for (FormProperty propertyValue : formData.getProperties()) {
        builder.add(propertyValue.getName(), formPropertyValueToJson(propertyValue));
      }
      getEntityBuilder().add("data", builder);
    }
  }

  private JsonObjectBuilder formPropertyValueToJson(FormProperty propertyValue) {
    JsonObjectBuilder builder = Json.createObjectBuilder();
    addValueToJsonObject(builder, propertyValue.getValue());
    List<Option> options = propertyValue.getOptions();
    if (options != null) {
      builder.add("options", optionsToJson(options));
    }
    List<OptionsSource> optionsSources = propertyValue.getOptionsSources();
    if (optionsSources != null) {
      JsonArray jsonOptionsSources = optionsSourcesToJson(optionsSources).build();
      if (!jsonOptionsSources.isEmpty()) {
        builder.add("optionsSources", jsonOptionsSources);
      }
    }
    return builder;
  }

  private void addTable() {
    JsonArrayBuilder builder = Json.createArrayBuilder();
    Table tableData = getResponse().getResults().asTable();
    addPageInfo(tableData);
    for (TableRow tableRowValues : tableData.getRows()) {
      builder.add(tableRowToJson(tableRowValues));
    }
    getEntityBuilder().add("data", builder);
  }

  private JsonObjectBuilder tableRowToJson(TableRow tableRowValues) {
    JsonObjectBuilder builder = Json.createObjectBuilder();
    for (TableCell cellValue : tableRowValues.getCells()) {
      builder.add(cellValue.getName(), tableCellToJson(cellValue));
    }
    return builder;
  }

  private JsonObjectBuilder tableCellToJson(TableCell cellValue) {
    JsonObjectBuilder builder = Json.createObjectBuilder();
    addValueToJsonObject(builder, cellValue.getValue());
    return builder;
  }

  private void addPageInfo(Page page) {
    addSelf(page);
    addBreadCrumbs(page);
    addLinks(page);
    addChangeManagerStatus(page);
  }

  private void addSelf(Page page) {
    Path navigation = page.getNavTreePath();
    if (!navigation.isEmpty()) {
      getEntityBuilder().add("navigation", navigation.getRelativeUri());
    }
    BeanTreePath btp = page.getSelf();
    JsonObjectBuilder builder = Json.createObjectBuilder(beanTreePathToJson(btp).asJsonObject());
    String kind = getBeanTreePathKind(btp);
    if (kind != null) {
      // This is a kind the CFE needs to know about
      builder.add("kind", kind);
    }
    getEntityBuilder().add("self", builder.build());
    if (btp.isCreatable()) {
      getEntityBuilder().add("createForm", beanTreePathToJson(btp, "?view=createForm"));
    }
  }

  private String getBeanTreePathKind(BeanTreePath btp) {
    if (btp.isOptionalSingleton()) {
      return (btp.isCreatable()) ? "creatableOptionalSingleton" : "nonCreatableOptionalSingleton";
    } else if (btp.isCollection()) {
      return (btp.isCreatable()) ? "creatableCollection" : "nonCreatableCollection";
    }
    return null; // This isn't a kind the CFE needs to know about today
  }

  private void addBreadCrumbs(Page page) {
    JsonArrayBuilder builder = Json.createArrayBuilder();
    for (BeanTreePath breadCrumb : page.getBreadCrumbs()) {
      builder.add(valueToJson(breadCrumb));
    }
    getEntityBuilder().add("breadCrumbs", builder);
  }

  private void addLinks(Page page) {
    JsonArrayBuilder builder = Json.createArrayBuilder();
    for (Link link : page.getLinks()) {
      builder.add(
        Json.createObjectBuilder()
          .add(
            "label",
            link.getLabel()
          )
          .add(
            "resourceData",
            UriUtils.getBackendRelativeUri(getInvocationContext(), link.getResourceData())
          )
      );
    }
    getEntityBuilder().add("links", builder);
  }

  private void addChangeManagerStatus(Page page) {
    ChangeManagerStatusResponseMapper.addChangeManagerStatus(
      getEntityBuilder(),
      page.getChangeManagerStatus()
    );
  }

  private JsonArrayBuilder optionsToJson(List<Option> options) {
    JsonArrayBuilder builder = Json.createArrayBuilder();
    for (Option option : options) {
      builder.add(
        Json.createObjectBuilder()
          .add("label", option.getLabel())
          .add("value", valueToJson(option.getValue()))
      );
    }
    return builder;
  }

  private JsonArrayBuilder optionsSourcesToJson(List<OptionsSource> optionsSources) {
    JsonArrayBuilder builder = Json.createArrayBuilder();
    for (OptionsSource optionsSource : optionsSources) {
      // TBD - only return the options source if it's creatable
      BeanTreePath btp = optionsSource.getOptionsSource();
      if (btp.isCollection() && btp.getLastSegment().getChildDef().isCreatable()) {
        builder.add(valueToJson(btp));
      }
    }
    return builder;
  }

  private String getBackendRelativeUri(PagePath pagePath) {
    Path connectionRelativePath = new Path();
    String pageRepoName =
      getInvocationContext().getPageRepo().getPageRepoDef().getName();
    connectionRelativePath.addComponent(pageRepoName);
    connectionRelativePath.addComponent("pages");
    return
      UriUtils.getBackendRelativeUri(getInvocationContext(), connectionRelativePath)
      + "/"
      + pagePath.getURI();
  }
}
