// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.ArrayList;
import java.util.List;

import weblogic.remoteconsole.common.repodef.BeanPropertyCustomizerDef;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.utils.CustomizerInvocationUtils;
import weblogic.remoteconsole.common.utils.Path;

/**
 * This is the base class for reading a form and contains code
 * needed by all form readers, such as populating the options
 * and options sources for the properties on the form.
 */
class FormReader extends PageReader {

  FormReader(InvocationContext invocationContext) {
    super(invocationContext);
  }

  protected void addOptionsSourcesToSearch(BeanReaderRepoSearchBuilder builder, BeanPropertyDef beanPropertyDef) {
    if (!beanPropertyDef.isPagePropertyDef()) {
      return;
    }
    PagePropertyDef pagePropertyDef = beanPropertyDef.asPagePropertyDef();
    if (!pagePropertyDef.isSupportsOptions()) {
      return;
    }
    for (String optionsSource : pagePropertyDef.getOptionsSources()) {
      addOptionsSourceToSearch(builder, optionsSource);
    }
  }

  private void addOptionsSourceToSearch(BeanReaderRepoSearchBuilder builder, String optionsSource) {
    BeanTreePath optionsSourceBeanTreePath = getOptionsSourceBeanTreePath(optionsSource);
    if (optionsSourceBeanTreePath == null) {
      // The use isn't allowed to view this options source.  Skip it.
      return;
    }
    builder.addProperty(
      optionsSourceBeanTreePath,
      optionsSourceBeanTreePath.getTypeDef().getIdentityPropertyDef()
    );
  }

  protected Response<FormProperty> addOptionsAndOptionsSources(
    BeanPropertyDef beanPropertyDef,
    FormProperty formProperty,
    BeanSearchResults beanResults,
    BeanReaderRepoSearchResults searchResults
  ) {
    Response<FormProperty> response = new Response<>();
    if (!beanPropertyDef.isPagePropertyDef()) {
      // Only page properties support options
      return response.setSuccess(formProperty);
    }
    PagePropertyDef pagePropertyDef = beanPropertyDef.asPagePropertyDef();
    if (!pagePropertyDef.isSupportsOptions()) {
      return response.setSuccess(formProperty);
    }
    Response<List<OptionsSource>> optionsSourcesResponse =
      getOptionsSources(pagePropertyDef, searchResults);
    if (!optionsSourcesResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(optionsSourcesResponse);
    }
    formProperty.setOptionsSources(optionsSourcesResponse.getResults());
    Response<List<Option>> optionsResponse =
      getOptions(pagePropertyDef, beanResults, searchResults);
    if (!optionsResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(optionsResponse);
    }
    formProperty.setOptions(optionsResponse.getResults());
    return response.setSuccess(formProperty);
  }

  private Response<List<OptionsSource>> getOptionsSources(
    PagePropertyDef pagePropertyDef,
    BeanReaderRepoSearchResults searchResults
  ) {
    Response<List<OptionsSource>> response = new Response<>();
    if (!pagePropertyDef.isReference()) {
      // Only references support options sources
      return response.setSuccess(null);
    }
    List<OptionsSource> optionsSources = new ArrayList<>();
    for (String optionsSource : pagePropertyDef.getOptionsSources()) {
      addOptionsSources(optionsSources, optionsSource, searchResults);
    }
    return response.setSuccess(optionsSources);
  }

  private void addOptionsSources(
    List<OptionsSource> optionsSources,
    String optionsSource,
    BeanReaderRepoSearchResults searchResults
  ) {
    BeanTreePath optionsSourceBeanTreePath = getOptionsSourceBeanTreePath(optionsSource);
    if (optionsSourceBeanTreePath == null) {
      // The user isn't allowed to view this options source.  Skip it.
      return;
    }
    optionsSources.add(new OptionsSource(optionsSourceBeanTreePath));
  }

  private Response<List<Option>> getOptions(
    PagePropertyDef pagePropertyDef,
    BeanSearchResults beanResults,
    BeanReaderRepoSearchResults searchResults
  ) {
    Response<List<Option>> response = new Response<>();
    List<Option> options = null;
    if (!pagePropertyDef.isReference()) {
      return response.setSuccess(options);
    }
    if (pagePropertyDef.getGetOptionsCustomizerDef() != null) {
      Response<List<Option>> customizerResponse =
        getCustomPropertyOptions(pagePropertyDef, beanResults, searchResults);
      if (!customizerResponse.isSuccess()) {
        return response.copyUnsuccessfulResponse(customizerResponse);
      }
      options = customizerResponse.getResults();
    } else {
      options = new ArrayList<>();
      for (String optionsSource : pagePropertyDef.getOptionsSources()) {
        addOptions(pagePropertyDef, options, optionsSource, searchResults);
      }
    }
    return response.setSuccess(completeOptions(pagePropertyDef, options));
  }

  private List<Option> completeOptions(PagePropertyDef pagePropertyDef, List<Option> options) {
    List<Option> completedOptions = new ArrayList<>(options);
    // Add the 'None' option if needed to the beginning of the list.
    if (pagePropertyDef.isAllowNoneOption()) {
      if (pagePropertyDef.isReference()) { 
        completedOptions.add(0, new Option(getInvocationContext(), NullReference.INSTANCE));
      } else {
        throw new AssertionError("None option not supported for non-references: " + pagePropertyDef);
      }
    }
    return completedOptions;
  }

  private Response<List<Option>> getCustomPropertyOptions(
    BeanPropertyDef propertyDef,
    BeanSearchResults beanResults,
    BeanReaderRepoSearchResults searchResults
  ) {
    BeanPropertyCustomizerDef customizerDef = propertyDef.getGetOptionsCustomizerDef();
    boolean argsIncludeIsSet = false;
    Response<List<Object>> argsResponse = 
      getArguments(customizerDef, beanResults, searchResults, argsIncludeIsSet);
    if (!argsResponse.isSuccess()) {
      Response<List<Option>> errorResponse = new Response<>();
      return errorResponse.copyUnsuccessfulResponse(argsResponse);
    }
    Object rtn = CustomizerInvocationUtils.invokeMethod(customizerDef.getMethod(), argsResponse.getResults());
    @SuppressWarnings("unchecked")
    Response<List<Option>> customizerResponse = (Response<List<Option>>)rtn;
    return customizerResponse;
  }

  private void addOptions(
    PagePropertyDef pagePropertyDef,
    List<Option> options,
    String optionsSource,
    BeanReaderRepoSearchResults searchResults
  ) {
    BeanTreePath optionsSourceBeanTreePath = getOptionsSourceBeanTreePath(optionsSource);
    if (optionsSourceBeanTreePath == null) {
      // The user isn't allowed to view this options source. Skip it.
      return;
    }
    List<BeanSearchResults> optionsResults =
      searchResults.getCollection(optionsSourceBeanTreePath);
    for (BeanSearchResults optionResults : optionsResults) {
      Value option = optionResults.getValue(pagePropertyDef.getTypeDef().getIdentityPropertyDef());
      if (option.isSettable()) {
        option = option.asSettable().getValue();
      }
      options.add(new Option(getInvocationContext(), option));
    }
  }

  private BeanTreePath getOptionsSourceBeanTreePath(String optionsSource) {
    BeanTreePathTemplate template = new BeanTreePathTemplate(optionsSource);
    Path optionsSourcePath = template.expand(getBeanTreePath());
    if (optionsSourcePath == null) {
      throw new AssertionError("Can't resolve optionsSource " + optionsSource + " from " + getBeanTreePath());
    }
    // A valid options source should refer to a specific collection, e.g. Domain/Servers.
    // We currently don't support wildcarding intermediate collections, e.g. Domain/Servers/*/NetworkAccessPoints.
    BeanTreePath beanTreePath = BeanTreePath.createAllowUnresolved(getBeanRepo(), optionsSourcePath);
    if (beanTreePath == null) {
      // The user isn't allowed to access this options source.
      return null;
    }
    // Verify that the last segment refers to a collection.
    if (!isCollection(beanTreePath.getLastSegment())) {
      throw new AssertionError(
        "Last segment is not a collection"
        + " " + optionsSource
        + " from " + getBeanTreePath()
      );      
    }
    // Verify that none of the intermediate segments refers to a collection.
    for (int i = 0; i < beanTreePath.getSegments().size() - 1; i++) {
      BeanTreePathSegment segment = beanTreePath.getSegments().get(i);
      if (isCollection(segment)) {
        throw new AssertionError(
          "Intermediate wildcard collections in optionsSources not supported"
          + " " + optionsSource
          + " from " + getBeanTreePath()
        );
      }
    }
    return beanTreePath;
  }

  private boolean isCollection(BeanTreePathSegment segment) {
    // The segment refers to a collection if its child def is a collection
    // and the segment doesn't specify the key identifying a bean in the collection.
    return segment.getChildDef().isCollection() && !segment.isKeySet();
  }

  protected void addModelTokens(Form form) {
    // Check if the form contains properties and that the BeanRepo supports model tokens
    if (!form.getProperties().isEmpty() && (getBeanRepo() instanceof ModelTokenReader)) {
      form.setModelTokens(((ModelTokenReader)getBeanRepo()).getModelTokens(getInvocationContext()));
    }
  }
}
