// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

/**
 * When a page makes edits to the bean repo (e.g. adds, modifies, deletes beans),
 * the bean repo may require some extra work be done before starting to make
 * the edits and after completing the edits.
 * 
 * For example, the ChangeManagerBeanRepo requires that an edit session
 * be started before making the changes and requires that the changes be
 * saved to the pending directory afterward.  The WDT bean repo, which
 * just edits an in-memory tree of beans, doesn't require this.
 * 
 * This class hides these details from the page repos.
 * They pass in an instance of a ConfigurationEditor (which is
 * responsible for making the bean edits for the page) and this
 * class takes care of any work that the bean repo requires
 * before and after making the edits.
 */
public class ConfigurationTransactionHelper {

  private ConfigurationTransactionHelper() {
  }

  public static Response<Void> editConfiguration(InvocationContext ic, ConfigurationEditor editor) {
    BeanRepo beanRepo = ic.getPageRepo().getBeanRepo();
    if (!beanRepo.isChangeManagerBeanRepo()) {
      // The bean repo doesn't support transactions. Just do the work.
      return editor.editConfiguration();
    }
    // The bean repo supports transactions.  Wrap the work in one.
    ChangeManagerBeanRepo changeManagerBeanRepo = beanRepo.asChangeManagerBeanRepo();
    boolean retainEarlierMessages = true;
    Response<Void> response = new Response<>();
    Response<Void> startResponse = changeManagerBeanRepo.startEdit(ic);
    if (!startResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(startResponse, retainEarlierMessages);
    }
    response.copyMessages(startResponse);
    Response<Void> editResponse = editor.editConfiguration();
    if (!editResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(editResponse, retainEarlierMessages);
    }
    response.copyMessages(editResponse);
    Response<Void> saveResponse = changeManagerBeanRepo.saveChanges(ic);
    if (!saveResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(saveResponse, retainEarlierMessages);
    }
    response.copyMessages(saveResponse);
    return response;
  }

  public interface ConfigurationEditor {
    Response<Void> editConfiguration();
  }
}
