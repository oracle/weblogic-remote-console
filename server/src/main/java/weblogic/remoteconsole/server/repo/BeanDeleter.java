// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.List;

import weblogic.remoteconsole.common.repodef.DeleteBeanCustomizerDef;
import weblogic.remoteconsole.common.utils.CustomizerInvocationUtils;

/**
 * This class manages deleting a bean.
 */
class BeanDeleter extends PageManager {

  BeanDeleter(InvocationContext invocationContext) {
    super(invocationContext);
  }

  // Delete the bean.  Ensure it is done in a configuration
  // transaction if needed.
  public Response<Void> delete() {
    return ConfigurationTransactionHelper.editConfiguration(
      getInvocationContext(),
      new ConfigurationTransactionHelper.ConfigurationEditor() {
        @Override
        public Response<Void> editConfiguration() {
          return doDelete();
        }
      }
    );
  }

  Response<Void> doDelete() {
    DeleteBeanCustomizerDef customizerDef =
      getInvocationContext().getBeanTreePath().getTypeDef().getDeleteCustomizerDef();
    if (customizerDef != null) {
      return customDelete(customizerDef);
    } else {
      return
        getBeanRepo().asBeanEditorRepo().deleteBean(
          getInvocationContext(),
          getInvocationContext().getBeanTreePath()
        );
    }
  }

  private Response<Void> customDelete(DeleteBeanCustomizerDef customizerDef) {
    BeanTreePath beanPath = getBeanTreePath(); // of the bean to be deleted
    boolean includeIsSet = false;
    PageReader reader = new PageReader(getInvocationContext());
    BeanReaderRepoSearchBuilder builder =
      getBeanRepo().asBeanReaderRepo().createSearchBuilder(getInvocationContext(), includeIsSet);
    reader.addParamsToSearch(builder, beanPath, customizerDef);
    // Get the identity of the bean to be deleted too so that we can
    // get its bean results (since the customizer's argument can have Source
    // annotations that are relative to it)
    builder.addProperty(beanPath, beanPath.getTypeDef().getIdentityPropertyDef());
    Response<BeanReaderRepoSearchResults> searchResponse = builder.search();
    if (!searchResponse.isSuccess()) {
      return (new Response<Void>()).copyUnsuccessfulResponse(searchResponse);
    }
    BeanReaderRepoSearchResults searchResults = searchResponse.getResults();
    BeanSearchResults beanResults = searchResults.getBean(beanPath);
    Response<List<Object>> argsResponse = reader.getArguments(customizerDef, beanResults, searchResults, includeIsSet);
    if (!argsResponse.isSuccess()) {
      Response<Void> errorResponse = new Response<>();
      return errorResponse.copyUnsuccessfulResponse(argsResponse);
    }
    Object rtn = CustomizerInvocationUtils.invokeMethod(customizerDef.getMethod(), argsResponse.getResults());
    @SuppressWarnings("unchecked")
    Response<Void> customizerResponse = (Response<Void>)rtn;
    return customizerResponse;
  }
}
