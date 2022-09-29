// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.util.List;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObjectBuilder;

import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.repodef.PagePath;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.CustomFilteringDashboardDefManager;
import weblogic.remoteconsole.server.repo.Form;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Link;
import weblogic.remoteconsole.server.repo.ModelTokens;
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
    if (getPage().isForm()) {
      addForm();
    }
    if (getPage().isTable()) {
      addTable();
    }
    addPageDescription();
  }

  private void addPageDescription() {
    getEntityBuilder().add("pageDescription", getPage().getBackendRelativePDJURI());
  }

  private void addForm() {
    JsonObjectBuilder builder = Json.createObjectBuilder();
    Form form = getPage().asForm();
    addPageInfo(form);
    if (form.isExists()) {
      // Add the model tokens info if available
      addModelTokens(form);

      // Add the data using the form property values
      for (FormProperty propertyValue : form.getProperties()) {
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
    Table table = getPage().asTable();
    addPageInfo(table);
    addDisplayedColumns(table);
    addCustomizeTableLink(table);
    for (TableRow tableRowValues : table.getRows()) {
      builder.add(tableRowToJson(tableRowValues));
    }
    getEntityBuilder().add("data", builder);
  }

  private void addCustomizeTableLink(Table table) {
    String queryParams = "?action=customizeTable";
    PagePath pagePath = getInvocationContext().getPagePath();
    Path slicePath = (pagePath.isSlicePagePath()) ? pagePath.asSlicePagePath().getSlicePath() : new Path();
    if (!slicePath.isEmpty()) {
      queryParams = queryParams + "&slice=" + slicePath.getDotSeparatedPath();
    }
    getEntityBuilder().add(
      "tableCustomizer",
      getBackendRelativeUri(table.getSelf().getPath(), queryParams)
    );
  }

  private void addDisplayedColumns(Table table) {
    List<String> columns = table.getDisplayedColumns();
    if (!columns.isEmpty()) {
      JsonArrayBuilder builder = Json.createArrayBuilder();
      for (String column : columns) {
        builder.add(column);
      }
      getEntityBuilder().add("displayedColumns", builder);
    }
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
    addIntroductionHTML(page);
  }

  private void addSelf(Page page) {
    Path navigation = page.getNavTreePath();
    if (!navigation.isEmpty()) {
      getEntityBuilder().add("navigation", navigation.getRelativeUri());
    }
    BeanTreePath btp = page.getSelf();
    JsonObjectBuilder builder =
      Json.createObjectBuilder(
        beanTreePathToJson(
          btp,
          getPage().getPageDef().getPagePath().getRDJQueryParams()
        ).asJsonObject()
      );
    String kind = getBeanTreePathKind(btp);
    if (kind != null) {
      // This is a kind the CFE needs to know about
      builder.add("kind", kind);
    }
    getEntityBuilder().add("self", builder.build());
    if (btp.isCreatable()) {
      getEntityBuilder().add("createForm", beanTreePathToJson(btp, "?view=createForm"));
    }
    addCustomFilteringDashboardCreateFormLink(btp);
  }

  // Add a link for getting the create form for creating custom filtering dashboards
  // for beans like this bean to this bean's RDJ.
  private void addCustomFilteringDashboardCreateFormLink(BeanTreePath btp) {
    if (!CustomFilteringDashboardDefManager.isSupportsCustomFilteringDashboards(getInvocationContext(), btp)) {
      return;
    }
    // Create a query parameter that identifies this bean
    // (e.g. Servers/Server1).  It will be used as the
    // template for creating a custom filtering dashboard
    // for beans liks this one.
    String queryParams = computeCustomFilteringDashboardCreateFormQueryParams(btp);
    String tree = btp.getSegments().get(0).getChildDef().getChildName();
    Path dashboardsPath = new Path(tree).childPath("Dashboards");
    BeanTreePath dashboardsBtp =
      BeanTreePath.create(btp.getBeanRepo(), dashboardsPath);
    getEntityBuilder().add(
      "dashboardCreateForm",
      beanTreePathToJson(
        dashboardsBtp, 
        getInvocationContext().getLocalizer().localizeString(
          LocalizedConstants.NEW_CUSTOM_FILTERING_DASHBOARD_LABEL
        ),
        queryParams
      )
    );
  }

  private String computeCustomFilteringDashboardCreateFormQueryParams(BeanTreePath btp) {
    return "?view=createForm&" + CustomFilteringDashboardDefManager.computePathQueryParam(btp);
  }

  private String getBeanTreePathKind(BeanTreePath btp) {
    if (btp.isOptionalSingleton()) {
      if (btp.isCreatable()) {
        return "creatableOptionalSingleton";
      }
      if (btp.isDeletable()) {
        return "deletableOptionalSingleton";
      }
      return "nonCreatableOptionalSingleton";
    } else if (btp.isCollection()) {
      if (btp.isCreatable()) {
        return "creatableCollection";
      }
      if (btp.isDeletable()) {
        return "deletableCollection";
      }
      return "nonCreatableCollection";
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
    JsonArrayBuilder linksBuilder = Json.createArrayBuilder();
    for (Link link : page.getLinks()) {
      JsonObjectBuilder linkBuilder =
        Json.createObjectBuilder()
        .add("label", link.getLabel())
        .add(
          "resourceData",
          UriUtils.getBackendRelativeUri(getInvocationContext(), link.getResourceData())
        );
      String nfm = link.getNotFoundMessage();
      if (StringUtils.notEmpty(nfm)) {
        linkBuilder.add("notFoundMessage", nfm);
      }
      linksBuilder.add(linkBuilder);
    }
    getEntityBuilder().add("links", linksBuilder);
  }

  private void addChangeManagerStatus(Page page) {
    ChangeManagerStatusResponseMapper.addChangeManagerStatus(
      getEntityBuilder(),
      page.getChangeManagerStatus()
    );
  }

  private void addIntroductionHTML(Page page) {
    String localizedIntroductionHTML = page.getLocalizedIntroductionHTML();
    if (StringUtils.notEmpty(localizedIntroductionHTML)) {
      getEntityBuilder().add("introductionHTML", localizedIntroductionHTML);
    }
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
      BeanTreePath btp = optionsSource.getBeanTreePath();
      if ((btp != null) && btp.isCollection() && btp.getLastSegment().getChildDef().isCreatable()) {
        builder.add(valueToJson(btp));
      }
    }
    return builder;
  }

  private void addModelTokens(Form form) {
    // Add model tokens information only when available
    ModelTokens modelTokens = form.getModelTokens();
    if (modelTokens == null) {
      return;
    }
    JsonObjectBuilder modelTokensBuilder = Json.createObjectBuilder();

    // Add the model tokens options if these are supplied
    List<Option> options = modelTokens.getOptions();
    if ((options != null) && !options.isEmpty()) {
      modelTokensBuilder.add("options", optionsToJson(options));
    }

    // Add the sources of the model tokens when available
    List<OptionsSource> optionsSources = modelTokens.getOptionsSources();
    if ((optionsSources != null) && !optionsSources.isEmpty()) {
      JsonArrayBuilder sourcesBuilder = Json.createArrayBuilder();
      for (OptionsSource source : optionsSources) {
        sourcesBuilder.add(
          Json.createObjectBuilder()
            .add("label", source.getLabel())
            .add("resourceData", source.getResourceData())
        );
      }
      modelTokensBuilder.add("optionsSources", sourcesBuilder);
    }

    // Add model tokens to the response JSON
    getEntityBuilder().add("modelTokens", modelTokensBuilder);
  }

  private Page getPage() {
    return getResponse().getResults();
  }
}
