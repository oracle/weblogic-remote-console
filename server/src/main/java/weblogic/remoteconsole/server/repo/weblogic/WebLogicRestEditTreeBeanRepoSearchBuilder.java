// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import java.util.Map;
import javax.json.JsonObject;

import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchResults;
import weblogic.remoteconsole.server.repo.ChangeManagerBeanRepoSearchBuilder;
import weblogic.remoteconsole.server.repo.InvocationContext;

/**
 * Builds a search request for an admin server's edit tree.
 */
public class WebLogicRestEditTreeBeanRepoSearchBuilder
  extends WebLogicRestBeanRepoSearchBuilder
  implements ChangeManagerBeanRepoSearchBuilder {

  protected WebLogicRestEditTreeBeanRepoSearchBuilder(
    WebLogicRestBeanRepo beanRepo,
    InvocationContext invocationContext,
    boolean includeIsSet
  ) {
    super(beanRepo, invocationContext, includeIsSet);
  }

  @Override
  public void addChangeManagerStatus() {
    getRootBeanNameToQueryBuilderMap().get("Domain").addChangeManagerStatus();
  }

  @Override
  public void addChanges() {
    getRootBeanNameToQueryBuilderMap().get("Domain").addChanges();
  }

  @Override
  protected BeanReaderRepoSearchResults createSearchResults(Map<String,JsonObject> searchResults) {
    return new WebLogicRestEditTreeBeanRepoSearchResults(this, searchResults);
  }
}