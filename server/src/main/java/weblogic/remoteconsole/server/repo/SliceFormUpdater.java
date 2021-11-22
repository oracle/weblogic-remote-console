// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.List;

/**
 * This class manages modifying the underling mbeans of a slice form.
 * It's an internal detail of a PageRepo.
 */
class SliceFormUpdater extends FormManager {

  SliceFormUpdater(InvocationContext invocationContext, List<FormProperty> properties) {
    super(invocationContext, properties);
  }

  Response<Void> update() {
    return ConfigurationTransactionHelper.editConfiguration(
      getInvocationContext(),
      new ConfigurationTransactionHelper.ConfigurationEditor() {
        @Override
        public Response<Void> editConfiguration() {
          return doUpdate();
        }
      }
    );
  }

  Response<Void> doUpdate() {
    Response<Void> response = new Response<>();
    for (BeanPropertyValues beanPropertyValues : getBeansPropertyValues().getSortedBeansPropertyValues()) {
      Response<Void> updateResponse =
        getBeanRepo().asBeanEditorRepo().updateBean(getInvocationContext(), beanPropertyValues);
      convertBeanMessagesToFormMessages(beanPropertyValues.getBeanTreePath(), updateResponse, response);
      if (!updateResponse.isSuccess()) {
        return response.copyStatus(updateResponse);
      }
    }
    return response;
  }
}
