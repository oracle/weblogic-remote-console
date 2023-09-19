// Copyright (c) 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
import java.util.List;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonValue;

import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.CustomPagePropertyDef;
import weblogic.remoteconsole.common.repodef.CustomSliceFormDef;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.repodef.PageActionDef;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.repodef.SliceFormDef;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchBuilder;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchResults;
import weblogic.remoteconsole.server.repo.BeanSearchResults;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Page;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.TableCell;
import weblogic.remoteconsole.server.repo.TableRow;
import weblogic.remoteconsole.server.repo.Value;
import weblogic.remoteconsole.server.repo.weblogic.WebLogicRestInvoker;
import weblogic.remoteconsole.server.webapp.BaseResource;

/** 
 * Custom code for processing the DeploymentPlanRuntimeMBean
 */
public class DeploymentPlanRuntimeMBeanCustomizer {
  private static final String PROP_NAME = "Name";
  private static final String PROP_MODULE_NAME = "ModuleName";
  private static final String PROP_URI = "Uri";
  private static final String PROP_XPATH = "Xpath";
  private static final String PROP_ASSIGNMENT_NAME = "AssignmentName";
  private static final String PROP_DESCRIPTION = "Description";
  private static final String PROP_OPERATION = "Operation";
  private static final String PROP_VALUE = "Value";

  private DeploymentPlanRuntimeMBeanCustomizer() {
  }

  public static BaseResource createResource(InvocationContext ic) {
    return new DeploymentPlanRuntimeMBeanResource();
  }

  // Customizes the PDJ for configuring the deployment plan xml
  public static Response<PageDef> customizeDeploymentPlanSliceDef(InvocationContext ic, PageDef uncustomizedPageDef) {
    // Force all the properties to be writable (otherwise, since we're in the monitoring tree,
    // they're considered read-only regardless of what the PDY says)
    Response<PageDef> response = new Response<>();
    SliceFormDef uncustomizedSliceFormDef = uncustomizedPageDef.asSliceFormDef();
    List<PagePropertyDef> customizedPropertyDefs = new ArrayList<>();
    for (PagePropertyDef uncustomizedPropertyDef : uncustomizedSliceFormDef.getPropertyDefs()) {
      // make it writable
      customizedPropertyDefs.add(
        new CustomPagePropertyDef(uncustomizedPropertyDef).writable(true)
      );
    }
    return
      response.setSuccess(
        new CustomSliceFormDef(uncustomizedSliceFormDef)
          .propertyDefs(customizedPropertyDefs)
      );
  }

  // Write out new xml for a deployment plan
  public static Response<Void> updateDeploymentPlanXml(InvocationContext ic,  List<FormProperty> formProperties) {
    Response<Void> response = new Response<>();
    FormProperty planProperty = findOptionalFormProperty("DeploymentPlan", formProperties);
    if (planProperty == null) {
      // The CFE thinks that the user hasn't changed the xml so didn't send it.  Don't write it out.
      return response.setSuccess(null);
    }
    String planXml = planProperty.getValue().asSettable().getValue().asString().getValue();
    // cbePath is DomainRuntime.DeploymentManager.App|LibDeploymentRuntimes.<deployment>.DeploymentPlan
    // wlsPath is domainRuntime.deploymentManager.app|libDeploymentRuntimes.<deployment>.deploymentPlan
    Path cbePath = ic.getBeanTreePath().getPath();
    boolean isApp = cbePath.getComponents().get(2).equals("AppDeploymentRuntimes");
    String deployment = cbePath.getComponents().get(3);
    Path wlsPath = new Path("domainRuntime.deploymentManager");
    wlsPath.addComponent(isApp ? "appDeploymentRuntimes" : "libDeploymentRuntimes");
    wlsPath.addComponent(deployment);
    wlsPath.addComponent("deploymentPlan");
    JsonObjectBuilder args = Json.createObjectBuilder();
    args.add("deploymentPlan", planXml);
    Response<JsonObject> updateResponse =
      WebLogicRestInvoker.post(
        ic,
        wlsPath,
        args.build(),
        false, // expanded values
        false, // save changes
        false // asynchronous
       );
    if (!updateResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(updateResponse);
    }
    return response.setSuccess(null);
  }

  // The 'edit' action changes the value of a variable assignment
  public static Response<Value> edit(
    InvocationContext ic,
    PageActionDef pageActionDef,
    List<FormProperty> formProperties
  ) {
    Response<Value> response = new Response<>();
    // Use the WLS REST api directly to set the value / operation
    // since the domain runtime bean repo is read-only.
    // The bean tree path is
    //   DomainRuntime/DeploymentManager/AppDeploymentRuntimes/<app>/DeploymentPlan
    String appName = ic.getBeanTreePath().getPath().getComponents().get(3);
    String varAssignmentName = ic.getIdentifier();
    Path wlsRestPath = new Path("domainRuntime.deploymentManager.appDeploymentRuntimes");
    wlsRestPath.addComponent(appName);
    wlsRestPath.addComponent("deploymentPlan");
    wlsRestPath.addComponent("variableAssignments");
    wlsRestPath.addComponent(varAssignmentName);
    JsonObjectBuilder bldr = Json.createObjectBuilder();
    // Handle the value
    FormProperty valueProperty = findRequiredFormProperty(PROP_VALUE, formProperties);
    if (valueProperty != null) {
      String value = valueProperty.getValue().asSettable().getValue().asString().getValue();
      // TBD - need a way to let the user indicate whether to
      // disable the variable (i.e. NULL) or to use an empty string ("")
      // For now, either maps to disable:
      if ("".equals(value) || value == null) {
        bldr.add("value", JsonValue.NULL);
      } else {
        bldr.add("value", value);
      }
    }
    // Handle the operation
    FormProperty operationProperty = findRequiredFormProperty(PROP_OPERATION, formProperties);
    if (operationProperty != null) {
      bldr.add(
        "operation",
        StringUtils.nonNull(
          operationProperty.getValue().asSettable().getValue().asString().getValue()
        )
      );
    }
    Response<JsonObject> postResponse =
      WebLogicRestInvoker.post(
        ic,
        wlsRestPath,
        bldr.build(),
        false, // expanded values
        false, // save changes
        false // asynchronous
        );
    if (!postResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(postResponse);
    }
    return response.setSuccess(null);
  }

  // Put the current value of the assignment into the edit action's input form
  public static Response<Void> customizeEditActionInputForm(InvocationContext ic, Page page) {
    /*
    System.out.println(
      "DEBUG DeploymentPlanRuntimeMBeanCustomizer.customizeEditActionInputForm"
      + " btp=" + ic.getBeanTreePath()
      + " id=" + ic.getIdentifier()
      + " pg=" + page
      + " ids=" + ic.getIdentifiers()
    );
    */
    Response<Void> response = new Response<>();
    // Because rows is one, the CFE will always invoke this with exactly one identifier:
    String variableName = ic.getIdentifiers().get(0);
    BeanTreePath beanPath =
      BeanTreePath.create(
        ic.getBeanTreePath().getBeanRepo(),
        ic.getBeanTreePath().getPath().childPath("VariableAssignments").childPath(variableName)
      );
    InvocationContext variableIC = new InvocationContext(ic, beanPath);
    BeanTypeDef typeDef = beanPath.getTypeDef();
    BeanPropertyDef moduleNamePropertyDef = typeDef.getPropertyDef(new Path(PROP_MODULE_NAME));
    BeanPropertyDef uriPropertyDef = typeDef.getPropertyDef(new Path(PROP_URI));
    BeanPropertyDef xpathPropertyDef = typeDef.getPropertyDef(new Path(PROP_XPATH));
    BeanPropertyDef assignmentNamePropertyDef = typeDef.getPropertyDef(new Path(PROP_ASSIGNMENT_NAME));
    BeanPropertyDef valuePropertyDef = typeDef.getPropertyDef(new Path(PROP_VALUE));
    BeanPropertyDef operationPropertyDef = typeDef.getPropertyDef(new Path(PROP_OPERATION));
    // Don't return whether properties are set.
    BeanReaderRepoSearchBuilder builder =
      ic.getPageRepo().getBeanRepo().asBeanReaderRepo().createSearchBuilder(variableIC, false);
    builder.addProperty(beanPath, moduleNamePropertyDef);
    builder.addProperty(beanPath, uriPropertyDef);
    builder.addProperty(beanPath, xpathPropertyDef);
    builder.addProperty(beanPath, assignmentNamePropertyDef);
    builder.addProperty(beanPath, valuePropertyDef);
    builder.addProperty(beanPath, operationPropertyDef);
    Response<BeanReaderRepoSearchResults> searchResponse = builder.search();
    if (!searchResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(searchResponse);
    }
    BeanSearchResults beanResults = searchResponse.getResults().getBean(beanPath);
    if (beanResults == null) {
      return response.setNotFound();
    }
    List<FormProperty> oldProperties = page.asForm().getProperties();
    List<FormProperty> newProperties =
      List.of(
        createFormProperty(valuePropertyDef, oldProperties, beanResults),
        createFormProperty(operationPropertyDef, oldProperties, beanResults)
      );
    oldProperties.clear();
    oldProperties.addAll(newProperties);
    String standardIntro =
      ic.getLocalizer().localizeString(page.getPageDef().getIntroductionHTML());
    String extraIntro =
      ic.getLocalizer().localizeString(
        LocalizedConstants.VARIABLE_ASSIGNMENT_INTRO,
        beanResults.getValue(moduleNamePropertyDef).asString().getValue(),
        beanResults.getValue(uriPropertyDef).asString().getValue(),
        beanResults.getValue(xpathPropertyDef).asString().getValue(),
        beanResults.getValue(assignmentNamePropertyDef).asString().getValue()
      );
    page.setLocalizedIntroductionHTML(standardIntro + extraIntro);
    return response.setSuccess(null);
  }

  private static FormProperty createFormProperty(
    BeanPropertyDef propertyDef,
    List<FormProperty> oldProperties,
    BeanSearchResults beanResults
  ) {
    return
      new FormProperty(
        findRequiredFormProperty(propertyDef.getFormFieldName(), oldProperties).getFieldDef(),
        beanResults.getValue(propertyDef)
      );
  }

  // Get the contents of the 'Variable Assignments' slice table
  public static Response<List<TableRow>> getVariableAssignmentsSliceTableRows(
    InvocationContext ic,
    BeanReaderRepoSearchResults searchResults
  ) {
    Response<List<TableRow>> response = new Response<>();
    BeanTreePath beanPath =
      ic.getBeanTreePath().childPath(new Path("VariableAssignments"));
    BeanTypeDef typeDef = beanPath.getTypeDef();
    BeanPropertyDef namePropertyDef = typeDef.getPropertyDef(new Path(PROP_NAME));
    BeanPropertyDef moduleNamePropertyDef = typeDef.getPropertyDef(new Path(PROP_MODULE_NAME));
    BeanPropertyDef uriPropertyDef = typeDef.getPropertyDef(new Path(PROP_URI));
    BeanPropertyDef xpathPropertyDef = typeDef.getPropertyDef(new Path(PROP_XPATH));
    BeanPropertyDef assignmentNamePropertyDef = typeDef.getPropertyDef(new Path(PROP_ASSIGNMENT_NAME));
    BeanPropertyDef operationPropertyDef = typeDef.getPropertyDef(new Path(PROP_OPERATION));
    BeanPropertyDef descriptionPropertyDef = typeDef.getPropertyDef(new Path(PROP_DESCRIPTION));
    BeanPropertyDef valuePropertyDef = typeDef.getPropertyDef(new Path(PROP_VALUE));

    // Don't return whether properties are set.
    BeanReaderRepoSearchBuilder builder =
      ic.getPageRepo().getBeanRepo().asBeanReaderRepo().createSearchBuilder(ic, false);
    builder.addProperty(beanPath, namePropertyDef);
    builder.addProperty(beanPath, moduleNamePropertyDef);
    builder.addProperty(beanPath, uriPropertyDef);
    builder.addProperty(beanPath, xpathPropertyDef);
    builder.addProperty(beanPath, assignmentNamePropertyDef);
    builder.addProperty(beanPath, operationPropertyDef);
    builder.addProperty(beanPath, descriptionPropertyDef);
    builder.addProperty(beanPath, valuePropertyDef);
    Response<BeanReaderRepoSearchResults> searchResponse = builder.search();
    if (!searchResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(searchResponse);
    }
    List<BeanSearchResults> beansResults = searchResponse.getResults().getCollection(beanPath);
    if (beansResults == null) {
      // this app currently doesn't have a plan
      return response.setNotFound();
    }
    List<TableRow> rows = new ArrayList<>();
    // Add a row for every variable assignment in this deployment plan.
    for (BeanSearchResults beanResults : beansResults) {
      TableRow row = new TableRow();
      row.setIdentifier(beanResults.getValue(namePropertyDef).asString().getValue());
      row.getCells().add(createTableCell(moduleNamePropertyDef, beanResults));
      row.getCells().add(createTableCell(uriPropertyDef, beanResults));
      row.getCells().add(createTableCell(xpathPropertyDef, beanResults));
      row.getCells().add(createTableCell(assignmentNamePropertyDef, beanResults));
      row.getCells().add(createTableCell(operationPropertyDef, beanResults));
      row.getCells().add(createTableCell(descriptionPropertyDef, beanResults));
      if (beanResults.getValue(valuePropertyDef) != null) {
        // Value will be optional if we ever display assignments whose operation is 'remove'
        row.getCells().add(createTableCell(valuePropertyDef, beanResults));
      }
      rows.add(row);
    }
    return response.setSuccess(rows);
  }

  private static TableCell createTableCell(BeanPropertyDef propertyDef, BeanSearchResults beanResults) {
    return
      new TableCell(
        propertyDef.getFormFieldName(),
        beanResults.getValue(propertyDef)
      );
  }

  private static FormProperty findRequiredFormProperty(String propertyName, List<FormProperty> formProperties) {
    FormProperty formProperty = findOptionalFormProperty(propertyName, formProperties);
    if (formProperty == null) {
      throw new AssertionError("Missing required form property: " + propertyName + " " + formProperties);
    } else {
      return formProperty;
    }
  }

  private static FormProperty findOptionalFormProperty(String propertyName, List<FormProperty> formProperties) {
    for (FormProperty formProperty : formProperties) {
      if (propertyName.equals(formProperty.getName())) {
        return formProperty;
      }
    }
    return null;
  }
}