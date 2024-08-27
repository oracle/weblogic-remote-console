// Copyright (c) 2023, 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
import java.util.List;

import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.CustomPagePropertyDef;
import weblogic.remoteconsole.common.repodef.CustomSliceFormDef;
import weblogic.remoteconsole.common.repodef.CustomSlicesDef;
import weblogic.remoteconsole.common.repodef.CustomTableDef;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.repodef.PageActionDef;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.repodef.SliceDef;
import weblogic.remoteconsole.common.repodef.SliceFormDef;
import weblogic.remoteconsole.common.repodef.SlicesDef;
import weblogic.remoteconsole.common.repodef.TableDef;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchBuilder;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchResults;
import weblogic.remoteconsole.server.repo.BeanSearchResults;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Page;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.SettableValue;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.Value;
import weblogic.remoteconsole.server.webapp.BaseResource;
import weblogic.remoteconsole.server.webapp.EditableCollectionChildBeanResource;
import weblogic.remoteconsole.server.webapp.EditableMandatorySingletonBeanResource;
import weblogic.remoteconsole.server.webapp.EditableOptionalSingletonBeanResource;

/** 
 * TBD
 */
public class DescriptorBeanCustomizer {

  private static final String TOP_LEVEL_DEPLOYMENT = "topLevelDeployment";
  private static final String DEPLOYMENT_TYPE = "deploymentType";
  private static final String AUTO_DEPLOYED = "autoDeployed";
  private static final String DEPLOYED_WITH_PLAN = "deployedWithPlan";
  private static final String DEPLOYED_WITHOUT_PLAN = "deployedWithoutPlan";

  private DescriptorBeanCustomizer() {
  }

  public static BaseResource createResource(InvocationContext ic) {
    BeanTreePath btp = ic.getBeanTreePath();
    if (btp.isCollectionChild()) {
      return new EditableCollectionChildBeanResource();
    } else if (btp.isMandatorySingleton()) {
      return new EditableMandatorySingletonBeanResource();
    } else if (btp.isOptionalSingleton()) {
      return new EditableOptionalSingletonBeanResource();
    }
    return null;
  }

  public static Response<Void> customizePage(InvocationContext ic, Page page) {
    Response<Void> response = new Response<>();
    Response<String> typeResponse = getDeploymentType(ic);
    if (!typeResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(typeResponse);
    }
    String deploymentType = typeResponse.getResults();
    boolean topLevelDeployment = isTopLevelDeployment(ic);
    String queryParams =
      "&" + DEPLOYMENT_TYPE + "=" + deploymentType
      + "&" + TOP_LEVEL_DEPLOYMENT + "=" + topLevelDeployment;
    page.setBackendRelativePDJURI(page.getBackendRelativePDJURI() + queryParams);
    if (isReadOnlyDeployment(deploymentType)) {
      page.forceReadOnly();
    }
    LocalizableString append = null;
    if (AUTO_DEPLOYED.equals(deploymentType)) {
      append = LocalizedConstants.AUTODEPLOYED_DEPLOYMENT_CONFIGURATION_PAGE_INTRO;
    } else if (DEPLOYED_WITHOUT_PLAN.equals(deploymentType)) {
      append = LocalizedConstants.READONLY_DEPLOYMENT_CONFIGURATION_PAGE_INTRO;
    }
    if (append != null) {
      page.setLocalizedIntroductionHTML(
        ic.getLocalizer().localizeString(page.getPageDef().getIntroductionHTML())
        + ic.getLocalizer().localizeString(append)
      );
    }
    return response.setSuccess(null);
  }

  private static boolean isTopLevelDeployment(InvocationContext ic) {
    // look for DomainRuntime.DeploymentManager.AppDeploymentRuntimes.<app>.Configuration.Deployment
    Path path = ic.getBeanTreePath().getPath();
    return path.length() == 6 && "Deployment".equals(path.getComponents().get(5));
  }

  public static Response<PageDef> customizePageDef(InvocationContext ic, PageDef uncustomizedPageDef) {
    Response<PageDef> response = new Response<>();
    String deploymentType = ic.getUriInfo().getQueryParameters().getFirst(DEPLOYMENT_TYPE);
    boolean topLevelDeployment = Boolean.valueOf(ic.getUriInfo().getQueryParameters().getFirst(TOP_LEVEL_DEPLOYMENT));
    if (isReadOnlyDeployment(deploymentType)) {
      if (uncustomizedPageDef.isTableDef()) {
        TableDef uncustomizedTableDef = uncustomizedPageDef.asTableDef();
        CustomTableDef customizedTableDef = createReadOnlyTableDef(uncustomizedTableDef);
        return response.setSuccess(customizedTableDef);
      } else if (uncustomizedPageDef.isSliceFormDef()) {
        SliceFormDef uncustomizedSliceFormDef = uncustomizedPageDef.asSliceFormDef();
        CustomSliceFormDef customizedSliceFormDef = createReadOnlySliceFormDef(uncustomizedSliceFormDef);
        if (AUTO_DEPLOYED.equals(deploymentType) && topLevelDeployment) {
          customizeAutoDeployedTopLevelDeploymentAutoSlices(customizedSliceFormDef, uncustomizedSliceFormDef);
        }
        return response.setSuccess(customizedSliceFormDef);
      }
      // Don't need to handle slice tables since deployments don't have any
    }
    return response.setSuccess(uncustomizedPageDef);
  }

  private static CustomTableDef createReadOnlyTableDef(TableDef uncustomizedTableDef) {
    CustomTableDef customizedTableDef = new CustomTableDef(uncustomizedTableDef);
    // Remove the create action.  It's always top level and named "createCollectionChild"
    List<PageActionDef> customizedActionDefs = new ArrayList<>();
    for (PageActionDef actionDef :  uncustomizedTableDef.getActionDefs()) {
      if (!"createCollectionChild".equals(actionDef.getActionName())) {
        customizedActionDefs.add(actionDef);
      }
    }
    customizedTableDef.setActionDefs(customizedActionDefs);
    // TBD Force the collection to be read-only? Doesn't seem to be needed.
    return customizedTableDef;
  }

  private static CustomSliceFormDef createReadOnlySliceFormDef(SliceFormDef uncustomizedSliceFormDef) {
    CustomSliceFormDef customizedSliceFormDef = new CustomSliceFormDef(uncustomizedSliceFormDef);
    customizedSliceFormDef.setReadOnly(true);
    customizedSliceFormDef.setPropertyDefs(
      createReadOnlyPropertyDefs(customizedSliceFormDef, uncustomizedSliceFormDef.getPropertyDefs())
    );
    customizedSliceFormDef.setAdvancedPropertyDefs(
      createReadOnlyPropertyDefs(customizedSliceFormDef, uncustomizedSliceFormDef.getAdvancedPropertyDefs())
    );
    return customizedSliceFormDef;
  }

  private static List<PagePropertyDef> createReadOnlyPropertyDefs(
    CustomSliceFormDef customizedSliceFormDef,
    List<PagePropertyDef> uncustomizedPropertyDefs
  ) {
    List<PagePropertyDef> customizedPropertyDefs = new ArrayList<>();
    for (PagePropertyDef uncustomizedPropertyDef : uncustomizedPropertyDefs) {
      CustomPagePropertyDef customizedPropertyDef = new CustomPagePropertyDef(uncustomizedPropertyDef);
      customizedPropertyDef.setPageDef(customizedSliceFormDef);
      customizedPropertyDef.setUpdateWritable(false);
      customizedPropertyDefs.add(customizedPropertyDef);
    }
    return customizedPropertyDefs;
  }

  private static void customizeAutoDeployedTopLevelDeploymentAutoSlices(
    CustomSliceFormDef customizedSliceFormDef,
    SliceFormDef uncustomizedSliceFormDef
  ) {
    // Top level auto deployed deployments only have an Overview slice (nested ones retain all their slices)
    SlicesDef uncustomizedSlicesDef = uncustomizedSliceFormDef.getSlicesDef();
    List<SliceDef> contentDefs = new ArrayList<>();
    for (SliceDef sliceDef : uncustomizedSlicesDef.getContentDefs()) {
      if ("Overview".equals(sliceDef.getName())) {
        contentDefs.add(sliceDef);
      }
    }
    CustomSlicesDef customizedSlicesDef = new CustomSlicesDef(uncustomizedSlicesDef);
    customizedSlicesDef.setContentDefs(contentDefs);
    customizedSliceFormDef.setSlicesDef(customizedSlicesDef);
  }

  private static boolean isReadOnlyDeployment(String deploymentType) {
    return AUTO_DEPLOYED.equals(deploymentType) || DEPLOYED_WITHOUT_PLAN.equals(deploymentType);
  }

  private static Response<String> getDeploymentType(InvocationContext ic) {
    Response<String> response = new Response<>();
    BeanTreePath thisBTP = ic.getBeanTreePath();
    // DomainRuntime/DeploymentManager/AppDeploymentRuntimes/<app>/Configuration/Deployment/... :
    Path thisPath = thisBTP.getPath();
    // DomainRuntime/DeploymentManager/AppDeploymentRuntimes/<app>/Configuration/Deployment :
    Path deploymentPath = thisPath.subPath(0, 6);
    BeanTreePath deploymentBTP = BeanTreePath.create(thisBTP.getBeanRepo(), deploymentPath);
    BeanPropertyDef propertyDef = deploymentBTP.getTypeDef().getPropertyDef(new Path("DeploymentType"));
    InvocationContext deploymentIC = new InvocationContext(ic, deploymentBTP);
    // Don't return whether properties are set.
    BeanReaderRepoSearchBuilder builder =
      ic.getPageRepo().getBeanRepo().asBeanReaderRepo().createSearchBuilder(deploymentIC, false);
    builder.addProperty(deploymentBTP, propertyDef);
    Response<BeanReaderRepoSearchResults> searchResponse = builder.search();
    if (!searchResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(searchResponse);
    }
    BeanSearchResults beanResults = searchResponse.getResults().getBean(deploymentBTP);
    if (beanResults == null) {
      return response.setNotFound();
    }
    Value value = beanResults.getValue(propertyDef);
    if (value == null) {
      throw new AssertionError("Could not find " + propertyDef + " in " + deploymentBTP);
    }
    return response.setSuccess(value.asString().getValue());
  }

  public static Response<SettableValue> getDescriptorBeanClass(InvocationContext ic) {
    Response<SettableValue> response = new Response<>();
    String dbc = null;
    BeanTreePath crBTP = getCustomResourceBTP(ic);
    if (crBTP != null) {
      Response<String> getResponse = findDescriptorBeanClass(ic, crBTP);
      if (!getResponse.isSuccess()) {
        return response.copyUnsuccessfulResponse(getResponse);
      }
      dbc = getResponse.getResults();
    }
    if (StringUtils.isEmpty(dbc)) {
      dbc = "UnknownDescriptorBeanClass";
    }
    SettableValue rtn = new SettableValue(new StringValue(dbc));
    return response.setSuccess(rtn);
  }

  private static BeanTreePath getCustomResourceBTP(InvocationContext ic) {
    // Domain/CustomResources/<resource> or Domain/CustomResources/<resource>/CustomResource
    Path path = ic.getBeanTreePath().getPath();
    List<String> components = path.getComponents();
    if (components.size() >= 3 && "Domain".equals(components.get(0)) && "CustomResources".equals(components.get(1))) {
      if (components.size() == 3 || (components.size() == 4 && "CustomResource".equals(components.get(3)))) {
        return BeanTreePath.create(ic.getBeanTreePath().getBeanRepo(), path.subPath(0, 3));
      }
    }
    return null;
  }

  private static Response<String> findDescriptorBeanClass(InvocationContext ic, BeanTreePath customResourceBTP) {
    Response<String> response = new Response<>();
    // Don't return whether properties are set.
    BeanReaderRepoSearchBuilder builder =
      ic.getPageRepo().getBeanRepo().asBeanReaderRepo().createSearchBuilder(ic, false);
    BeanPropertyDef dbcPropertyDef = customResourceBTP.getTypeDef().getPropertyDef(new Path("DescriptorBeanClass"));
    builder.addProperty(customResourceBTP, dbcPropertyDef);
    Response<BeanReaderRepoSearchResults> searchResponse = builder.search();
    if (!searchResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(searchResponse);
    }
    BeanSearchResults customResourceResults = searchResponse.getResults().getBean(customResourceBTP);
    if (customResourceResults == null) {
      // the custom resource doesn't exist
      return response.setNotFound();
    }
    String dbc = null;
    Value dbcValue = customResourceResults.getValue(dbcPropertyDef);
    if (dbcValue != null && dbcValue.isString()) {
      dbc = dbcValue.asString().getValue();
    }
    return response.setSuccess(dbc);
  }
}
