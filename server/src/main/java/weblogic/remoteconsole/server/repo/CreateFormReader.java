// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.List;
import java.util.logging.Logger;

import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.CreateFormDef;
import weblogic.remoteconsole.common.repodef.CreateFormPagePath;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.utils.Path;

/**
 * This class manages reading a create form.
 * 
 * It queries the bean repo to find out if it's running in
 * secure mode or production mode (so that it can determine the
 * default values for the properties in the create form).
 * 
 * Then it populates the create form with initial values of
 * the properties needed to create the bean and returns it.
 */
class CreateFormReader extends FormReader {

  private static final Logger LOGGER = Logger.getLogger(CreateFormReader.class.getName());

  CreateFormReader(InvocationContext invocationContext) {
    super(invocationContext);
  }

  Response<Page> getCreateForm() {
    Response<CreateFormDef> createFormResponse = getCreateFormDef();
    if (!createFormResponse.isSuccess()) {
      return (new Response<Page>()).copyUnsuccessfulResponse(createFormResponse);
    }
    List<PagePropertyDef> propDefs = createFormResponse.getResults().getAllPropertyDefs();
    return
      processCreateFormSearchResults(
        createFormResponse.getResults(),
        propDefs,
        performCreateFormSearch(propDefs)
      );
  }

  private Response<CreateFormDef> getCreateFormDef() {
    Response<CreateFormDef> response = new Response<>();
    CreateFormPagePath pagePath = getInvocationContext().getPagePath().asCreateFormPagePath();
    PageDef pageDef = getPageRepoDef().getPageDef(pagePath);
    if (pageDef == null) {
      // The slice doesn't exist
      LOGGER.warning("Can't find create form " + pagePath);
      response.setNotFound();
      return response;
    }
    return response.setSuccess(pageDef.asCreateFormDef());
  }

  private Response<BeanReaderRepoSearchResults> performCreateFormSearch(
    List<PagePropertyDef> propDefs
  ) {
    boolean includeIsSet = true;
    BeanReaderRepoSearchBuilder builder =
      getBeanRepo().asBeanReaderRepo().createSearchBuilder(getInvocationContext(), includeIsSet);
    for (PagePropertyDef propDef : propDefs) {
      if (propDef.isCreateWritable()) {
        addOptionsSourcesToSearch(builder, propDef);
        addParamsToSearch(builder, getBeanTreePath(), propDef.getGetOptionsCustomizerDef());
      }
    }
    // Find out whether the domain is in production or secure mode
    builder.addProperty(getProductionModeEnabledBeanPath(), getProductionModeEnabledDef());
    builder.addProperty(getSecureModeEnabledBeanPath(), getSecureModeEnabledDef());
    if (builder.isChangeManagerBeanRepoSearchBuilder()) {
      builder.asChangeManagerBeanRepoSearchBuilder().addChangeManagerStatus();
    }
    return builder.search();
  }

  private Response<Page> processCreateFormSearchResults(
    PageDef pageDef,
    List<PagePropertyDef> propDefs,
    Response<BeanReaderRepoSearchResults> searchResponse
  ) {
    Response<Page> response = new Response<>();
    if (!searchResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(searchResponse);
    }
    BeanReaderRepoSearchResults searchResults = searchResponse.getResults();
    // Find out whether the domain is in production or secure mode
    Boolean secureMode = getSecureMode(searchResults);
    Boolean productionMode = getProductionMode(searchResults);
    Form form = new Form();
    form.setPageDef(pageDef);
    addPageInfo(form);
    addChangeManagerStatus(form, searchResults);
    for (PagePropertyDef propDef : propDefs) {
      Response<FormProperty> propResponse =
        getFormProperty(
          propDef.asPagePropertyDef(),
          searchResults,
          secureMode,
          productionMode
        );
      if (!propResponse.isSuccess()) {
        return response.copyUnsuccessfulResponse(propResponse);
      }
      form.getProperties().add(propResponse.getResults());
    }
    return response.setSuccess(form);
  }

  private Response<FormProperty> getFormProperty(
    PagePropertyDef propertyDef,
    BeanReaderRepoSearchResults searchResults,
    Boolean secureMode,
    Boolean productionMode
  ) {
    Response<FormProperty> response = new Response<>();
    FormProperty formProperty =
      new FormProperty(
        propertyDef,
        new SettableValue(
          getDefaultValue(propertyDef, secureMode, productionMode),
          false // this is the default value therefore it definitely hasn't been set
        )
      );
    if (propertyDef.isCreateWritable()) {
      // The bean doesn't exist yet. Therefore options customizers
      // can't use @Source annotations that are relative to the current bean.
      BeanSearchResults beanResults = null;
      Response<FormProperty> optionsResponse =
        addOptionsAndOptionsSources(propertyDef, formProperty, beanResults, searchResults);
      if (!optionsResponse.isSuccess()) {
        return response.copyUnsuccessfulResponse(optionsResponse);
      }
    }
    return response.setSuccess(formProperty);
  }

  private Value getDefaultValue(
    PagePropertyDef propertyDef,
    Boolean secureModeEnabled,
    Boolean productionModeEnabled
  ) {
    if (productionModeEnabled != null && secureModeEnabled != null) {
      // we know whether the domain is in production mode or secure mode
      // so can return default values that depend on the mode
      return propertyDef.getDefaultValue(secureModeEnabled, productionModeEnabled);
    } else {
      // we don't know whether the domain is in production or secure mode
      // so can only return default values that don't depend on the mode
      return propertyDef.getDefaultValue();
    }
  }

  private Boolean getSecureMode(BeanReaderRepoSearchResults searchResults) {
    Value enabled =
      Value.unsettableValue(
        searchResults
          .getBean(getSecureModeEnabledBeanPath())
          .getValue(getSecureModeEnabledDef())
      );
    return enabled.isUnknown() ? null : Boolean.valueOf(enabled.asBoolean().getValue());
  }

  private Boolean getProductionMode(BeanReaderRepoSearchResults searchResults) {
    Value enabled =
      Value.unsettableValue(
        searchResults
          .getBean(getProductionModeEnabledBeanPath())
          .getValue(getProductionModeEnabledDef())
      );
    return enabled.isUnknown() ? null : Boolean.valueOf(enabled.asBoolean().getValue());
  }

  private BeanPropertyDef getSecureModeEnabledDef() {
    return getSecureModeEnabledBeanPath().getTypeDef().getPropertyDef(new Path("SecureModeEnabled"));
  }

  private BeanPropertyDef getProductionModeEnabledDef() {
    return getProductionModeEnabledBeanPath().getTypeDef().getPropertyDef(new Path("ProductionModeEnabled"));
  }

  private BeanTreePath getSecureModeEnabledBeanPath() {
    return BeanTreePath.create(getBeanRepo(), new Path("Domain.SecurityConfiguration.SecureMode"));
  }

  private BeanTreePath getProductionModeEnabledBeanPath() {
    return BeanTreePath.create(getBeanRepo(), new Path("Domain"));
  }
}
