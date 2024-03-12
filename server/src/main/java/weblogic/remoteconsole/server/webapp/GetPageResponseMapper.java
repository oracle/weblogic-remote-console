// Copyright (c) 2021, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.util.List;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;

import weblogic.remoteconsole.common.repodef.ActionInputFormDef;
import weblogic.remoteconsole.common.repodef.ActionInputFormPagePath;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.repodef.PageActionDef;
import weblogic.remoteconsole.common.repodef.PagePath;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.FilteringDashboardDefManager;
import weblogic.remoteconsole.server.repo.Form;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Link;
import weblogic.remoteconsole.server.repo.ModelTokens;
import weblogic.remoteconsole.server.repo.Option;
import weblogic.remoteconsole.server.repo.OptionsSource;
import weblogic.remoteconsole.server.repo.Page;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.Table;
import weblogic.remoteconsole.server.repo.TableCell;
import weblogic.remoteconsole.server.repo.TableRow;
import weblogic.remoteconsole.server.webapp.UriUtils;

/**
 * Converts a Response<Page> to a JAXRS Response.
 */
public class GetPageResponseMapper extends ResponseMapper<Page> {

  public static javax.ws.rs.core.Response toResponse(InvocationContext ic, Response<Page> response) {
    return new GetPageResponseMapper(ic, response).toResponse();
  }

  private GetPageResponseMapper(InvocationContext ic, Response<Page> response) {
    super(ic, response);
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
    addPageInfo();
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
    addPageInfo();
    addDisplayedColumns(table);
    addCustomizeTableLink(table);
    for (TableRow tableRowValues : table.getRows()) {
      builder.add(tableRowToJson(tableRowValues));
    }
    BeanTreePath btp = getPage().getSelf();
    if (btp.isCollection()) {
      getEntityBuilder().add("deletable", btp.isDeletable());
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
    String identifier = tableRowValues.getIdentifier();
    if (!StringUtils.isEmpty(identifier)) {
      TableCell cellValue = new TableCell("identifier", new StringValue(identifier));
      builder.add(cellValue.getName(), tableCellToJson(cellValue));
    }
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

  private void addPageInfo() {
    addSelf();
    addBreadCrumbs();
    addLinks();
    addChangeManagerStatus();
    addIntroductionHTML();
    addActions();
  }

  private void addSelf() {
    Path navigation = getPage().getNavTreePath();
    if (!navigation.isEmpty()) {
      getEntityBuilder().add("navigation", navigation.getRelativeUri());
    }
    BeanTreePath btp = getPage().getSelf();
    PagePath pagePath = getPage().getPageDef().getPagePath();
    JsonObjectBuilder builder =
      Json.createObjectBuilder(
        beanTreePathToJson(
          btp,
          pagePath.getRDJQueryParams()
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
    if (pagePath.isActionInputFormPagePath()) {
      ActionInputFormPagePath aifpp = pagePath.asActionInputFormPagePath();
      addRDJLink(getEntityBuilder(), btp, aifpp.getParentPagePath(), "invoker", "action=" + aifpp.getAction());
    }
    addCustomFilteringDashboardCreateFormLink(btp);
  }

  // Add a link for getting the create form for creating custom filtering dashboards
  // for beans like this bean to this bean's RDJ.
  private void addCustomFilteringDashboardCreateFormLink(BeanTreePath btp) {
    if (!FilteringDashboardDefManager.isSupportsFilteringDashboards(getInvocationContext(), btp)) {
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
    return "?view=createForm&" + FilteringDashboardDefManager.computePathQueryParam(btp);
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

  private void addBreadCrumbs() {
    JsonArrayBuilder builder = Json.createArrayBuilder();
    for (BeanTreePath breadCrumb : getPage().getBreadCrumbs()) {
      builder.add(valueToJson(breadCrumb));
    }
    getEntityBuilder().add("breadCrumbs", builder);
  }

  private void addLinks() {
    JsonArrayBuilder linksBuilder = Json.createArrayBuilder();
    for (Link link : getPage().getLinks()) {
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

  private void addChangeManagerStatus() {
    ChangeManagerStatusResponseMapper.addChangeManagerStatus(
      getEntityBuilder(),
      getPage().getChangeManagerStatus()
    );
  }

  private void addIntroductionHTML() {
    String localizedIntroductionHTML = getPage().getLocalizedIntroductionHTML();
    if (StringUtils.notEmpty(localizedIntroductionHTML)) {
      getEntityBuilder().add("introductionHTML", localizedIntroductionHTML);
    }
  }

  private void addActions() {
    JsonObjectBuilder builder = Json.createObjectBuilder();
    addActions(builder, getPage().getSelf(), getPage().getPageDef().getActionDefs());
    JsonObject actions = builder.build();
    if (!actions.isEmpty()) {
      getEntityBuilder().add("actions", actions);
    }
  }

  private void addActions(
    JsonObjectBuilder builder,
    BeanTreePath btp,
    List<PageActionDef> actionDefs
  ) {
    for (PageActionDef actionDef : actionDefs) {
      if (actionDef.isInvokable()) {
        String action = actionDef.getActionName();
        ActionInputFormDef inputForm = actionDef.getInputFormDef();
        PagePath pagePath = getPage().getPageDef().getPagePath();
        JsonObjectBuilder actionBuilder = Json.createObjectBuilder();
        if (inputForm != null) {
          addRDJLink(actionBuilder, btp, pagePath, "inputForm", "actionForm=inputForm&action=" + action);
        } else {
          addRDJLink(actionBuilder, btp, pagePath, "invoker", "action=" + action);
        }
        builder.add(action, actionBuilder);
      }
      addActions(builder, btp, actionDef.getActionDefs());
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

  private void addRDJLink(
    JsonObjectBuilder builder,
    BeanTreePath btp,
    PagePath pagePath,
    String link,
    String extraQps
  ) {
    String baseQps = pagePath.getRDJQueryParams();
    String separator = StringUtils.isEmpty(baseQps) ? "?" : "&";
    String qps = baseQps + separator + extraQps;
    builder.add(link, Json.createObjectBuilder().add("resourceData", getBackendRelativeUri(btp, qps)));
  }

  private Page getPage() {
    return getResponse().getResults();
  }
}
