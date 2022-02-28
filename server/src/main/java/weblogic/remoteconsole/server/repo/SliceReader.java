// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.lang.reflect.Method;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import com.fasterxml.jackson.core.type.TypeReference;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.repodef.SliceFormDef;
import weblogic.remoteconsole.common.repodef.SlicePagePath;
import weblogic.remoteconsole.common.repodef.SliceTableDef;
import weblogic.remoteconsole.common.utils.CustomizerInvocationUtils;

/**
 * This class manages reading a slice form or slice table
 */
class SliceReader extends FormReader {

  private static final Logger LOGGER = Logger.getLogger(SliceReader.class.getName());

  private static final Type GET_TABLE_ROWS_CUSTOMIZER_RETURN_TYPE =
    (new TypeReference<Response<List<TableRow>>>() {}).getType();

  SliceReader(InvocationContext invocationContext) {
    super(invocationContext);
  }

  Response<Page> getSlice() {
    Response<PageDef> pageDefResponse = getPageDef();
    if (!pageDefResponse.isSuccess()) {
      return (new Response<Page>()).copyUnsuccessfulResponse(pageDefResponse);
    }
    PageDef pageDef = pageDefResponse.getResults();
    if (pageDef.isSliceFormDef()) {
      return getSliceForm(pageDef.asSliceFormDef());
    } else if (pageDef.isSliceTableDef()) {
      return getSliceTable(pageDef.asSliceTableDef());
    }
    throw new AssertionError("Slice is not a form or table: " + pageDef);
  }

  private Response<PageDef> getPageDef() {
    Response<PageDef> response = new Response<>();
    Response<SlicePagePath> pagePathResponse = getActualSlicePagePath();
    if (!pagePathResponse.isSuccess()) {
      // Something went wrong, e.g the bean doesn't exist.
      return response.copyUnsuccessfulResponse(pagePathResponse);
    }
    SlicePagePath pagePath = pagePathResponse.getResults();
    PageDef pageDef = getPageRepoDef().getPageDef(pagePathResponse.getResults());
    if (pageDef == null) {
      // The slice doesn't exist
      LOGGER.warning("Can't find slice " + pagePath);
      response.setNotFound();
      return response;
    }
    return response.setSuccess(pageDef);
  }

  private Response<Page> getSliceTable(SliceTableDef sliceTableDef) {
    return processSliceTableSearchResults(sliceTableDef, performSliceTableSearch());
  }

  private Response<BeanReaderRepoSearchResults> performSliceTableSearch() {
    // Since this page only displays read-only tables, don't ask whether properties have been set.
    boolean includeIsSet = false;
    BeanReaderRepoSearchBuilder builder =
      getBeanRepo().asBeanReaderRepo().createSearchBuilder(getInvocationContext(), includeIsSet);
    // Fetch the identity so we can check whether the bean exists:
    builder.addProperty(getBeanTreePath(), getBeanTreePath().getTypeDef().getIdentityPropertyDef());
    if (builder.isChangeManagerBeanRepoSearchBuilder()) {
      builder.asChangeManagerBeanRepoSearchBuilder().addChangeManagerStatus();
    }
    return builder.search();
  }

  private Response<Page> processSliceTableSearchResults(
    SliceTableDef sliceTableDef,
    Response<BeanReaderRepoSearchResults> searchResponse
  ) {
    Response<Page> response = new Response<>();
    if (!searchResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(searchResponse);
    }
    BeanReaderRepoSearchResults searchResults = searchResponse.getResults();
    BeanSearchResults beanResults = searchResults.getBean(getBeanTreePath());
    if (beanResults == null) {
      return response.setNotFound();
    }
    Response<List<TableRow>> getRowsResponse = getTableRows(sliceTableDef);
    if (!getRowsResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(getRowsResponse);
    }
    Table table = new Table();
    table.setPageDef(sliceTableDef);
    addChangeManagerStatus(table, searchResults);
    addPageInfo(table);
    addLinks(table, true); // false since it's a bean
    table.getRows().addAll(getRowsResponse.getResults());
    return response.setSuccess(table);
  }

  private Response<List<TableRow>> getTableRows(SliceTableDef sliceTableDef) {
    Method method = CustomizerInvocationUtils.getMethod(sliceTableDef.getGetTableRowsMethod());
    CustomizerInvocationUtils.checkSignature(method, GET_TABLE_ROWS_CUSTOMIZER_RETURN_TYPE, InvocationContext.class);
    List<Object> args = new ArrayList<>();
    args.add(getInvocationContext());
    Object responseAsObject = CustomizerInvocationUtils.invokeMethod(method, args);
    @SuppressWarnings("unchecked")
    Response<List<TableRow>> customizerResponse = (Response<List<TableRow>>)responseAsObject;
    return customizerResponse;
  }

  private Response<Page> getSliceForm(SliceFormDef sliceFormDef) {
    List<BeanPropertyDef> propDefs = createPropertyDefList();
    propDefs.addAll(sliceFormDef.getAllPropertyDefs());
    return processSliceFormSearchResults(sliceFormDef, propDefs, performSliceFormSearch(propDefs));
  }

  private Response<BeanReaderRepoSearchResults> performSliceFormSearch(
    List<BeanPropertyDef> propDefs
  ) {
    // Since this page can be used edit the bean (if the page and bean support it), ask the search
    // to return whether properties have been set (it will only be returned if the bean supports it)
    boolean includeIsSet = true;
    BeanReaderRepoSearchBuilder builder =
      getBeanRepo().asBeanReaderRepo().createSearchBuilder(getInvocationContext(), includeIsSet);
    for (BeanPropertyDef propDef : propDefs) {
      builder.addProperty(getBeanTreePath(), propDef);
      addParamsToSearch(builder, getBeanTreePath(), propDef.getGetValueCustomizerDef());
      if (propDef.isUpdateWritable()) {
        addParamsToSearch(builder, getBeanTreePath(), propDef.getGetOptionsCustomizerDef());
        addOptionsSourcesToSearch(builder, propDef);
      }
    }
    if (builder.isChangeManagerBeanRepoSearchBuilder()) {
      builder.asChangeManagerBeanRepoSearchBuilder().addChangeManagerStatus();
    }
    return builder.search();
  }

  private Response<Page> processSliceFormSearchResults(
    PageDef pageDef,
    List<BeanPropertyDef> propDefs,
    Response<BeanReaderRepoSearchResults> searchResponse
  ) {
    Response<Page> response = new Response<>();
    if (!searchResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(searchResponse);
    }
    BeanReaderRepoSearchResults searchResults = searchResponse.getResults();
    BeanSearchResults beanResults = searchResults.getBean(getBeanTreePath());
    if (beanResults == null) {
      if (!getBeanTreePath().isOptionalSingleton()) {
        return response.setNotFound();
      } else {
        // still need to return the PDJ, minus "data"
      }
    }
    Form form = new Form();
    form.setExists(beanResults != null);
    Response<Void> propsResponse = addFormProperties(form, propDefs, beanResults, searchResults);
    if (!propsResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(propsResponse);
    }
    form.setPageDef(pageDef);
    addPageInfo(form);
    addChangeManagerStatus(form, searchResults);
    addLinks(form, true); // true since it's an instance
    return response.setSuccess(form);
  }

  private Response<Void> addFormProperties(
    Form form,
    List<BeanPropertyDef> propDefs,
    BeanSearchResults beanResults,
    BeanReaderRepoSearchResults searchResults
  ) {
    Response<Void> response = new Response<>();
    if (beanResults == null) {
      // the top level bean doesn't exist. don't add any properties
      return response.setSuccess(null);
    }
    for (BeanPropertyDef propDef : propDefs) {
      if (propDef.isPagePropertyDef()) {
        Response<FormProperty> propResponse =
          getFormProperty(propDef.asPagePropertyDef(), beanResults, searchResults);
        if (!propResponse.isSuccess()) {
          return response.copyUnsuccessfulResponse(propResponse);
        }
        FormProperty formProperty = propResponse.getResults();
        if (formProperty != null) {
          form.getProperties().add(formProperty);
        }
      } else {
        // This property isn't used directly by the page so don't return it.
      }
    }
    return response.setSuccess(null);
  }

  private Response<FormProperty> getFormProperty(
    PagePropertyDef propertyDef,
    BeanSearchResults beanResults,
    BeanReaderRepoSearchResults searchResults
  ) {
    Response<FormProperty> response = new Response<>();
    // Since this page can be used to edit the bean (if the page and bean support it), ask the search
    // to return whether properties have been set (it will only be returned if the bean supports it)
    boolean includeIsSet = true;
    Response<Value> valueResponse =
      getPropertyValue(propertyDef, beanResults, searchResults, includeIsSet);
    if (!valueResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(valueResponse);
    }
    Value value = valueResponse.getResults();
    if (value == null) {
      // the property doesn't exist on the current bean. that's OK
      return response.setSuccess(null);
    }
    FormProperty formProperty = new FormProperty(propertyDef, value);
    if (propertyDef.isUpdateWritable()) {
      Response<FormProperty> optionsResponse =
        addOptionsAndOptionsSources(propertyDef, formProperty, beanResults, searchResults);
      if (!optionsResponse.isSuccess()) {
        return response.copyUnsuccessfulResponse(optionsResponse);
      }
    }
    return response.setSuccess(formProperty);
  }

  public Response<SlicePagePath> getActualSlicePagePath() {
    Response<SlicePagePath> response = new Response<>();
    SlicePagePath slicePagePath = getPagePath().asSlicePagePath();
    BeanTypeDef typeDef = slicePagePath.getPagesPath().getTypeDef();

    // If the type is homogeneous, return ic's page path
    if (typeDef.isHomogeneous()) {
      return response.setSuccess(slicePagePath);
    }

    // The type is heterogeneous.

    // Find the value of the property on the bean that indicates its type.
    Response<String> valueResponse = getSubTypeDiscriminatorValue();

    if (getBeanTreePath().isOptionalSingleton() && getBeanTreePath().isCreatable() && valueResponse.isNotFound()) {
      // heterogeneous creatable optional singleton doesn't currently exist.  
      // just return the base type's page path (since we need to return a 200 w/o "data" to the CFE, v.s. a 404)
      return response.setSuccess(slicePagePath);
    }

    if (!valueResponse.isSuccess()) {
      // Couldn't fetch the property, e.g. the bean doesn't exist.
      return response.copyUnsuccessfulResponse(valueResponse);
    }

    // Find the matching type def
    BeanTypeDef subTypeDef = typeDef.getSubTypeDef(valueResponse.getResults());

    // Make a new page path for actual type and the original slice name
    SlicePagePath subTypeSlicePagePath =
      getPageRepoDef().newSlicePagePath(subTypeDef, slicePagePath.getSlicePath());

    // Return it
    return response.setSuccess(subTypeSlicePagePath);
  }

  private Response<String> getSubTypeDiscriminatorValue() {
    Response<String> response = new Response<>();

    // Create a search request to get the property that indicates the bean's type from the bean repo
    boolean includeIsSet = false;
    BeanReaderRepoSearchBuilder builder =
      getBeanRepo().asBeanReaderRepo().createSearchBuilder(getInvocationContext(), includeIsSet);
    addSubTypeDiscriminatorToSearch(getBeanTreePath(), builder);

    // Do the search
    Response<BeanReaderRepoSearchResults> searchResponse = builder.search();
    if (!searchResponse.isSuccess()) {
      // Something went wrong (e.g. we can't connect to WLS right now)
      return response.copyUnsuccessfulResponse(searchResponse);
    }

    Response<String> discResponse =
      getSubTypeDiscriminatorValue(getBeanTreePath(), searchResponse.getResults());
    if (!discResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(discResponse);
    }

    return response.setSuccess(discResponse.getResults());
  }
}
