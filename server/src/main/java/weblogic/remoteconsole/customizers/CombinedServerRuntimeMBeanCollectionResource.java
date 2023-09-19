// Copyright (c) 2023, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.List;
import javax.json.JsonObject;

import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchBuilder;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchResults;
import weblogic.remoteconsole.server.repo.BeanRepo;
import weblogic.remoteconsole.server.repo.BeanSearchResults;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.webapp.InvokeActionHelper;
import weblogic.remoteconsole.server.webapp.ReadOnlyBeanCollectionResource;
import weblogic.remoteconsole.server.webapp.VoidResponseMapper;


/**
 * Custom JAXRS resource for CombinedServerRuntimeMBean collections
 */
public class CombinedServerRuntimeMBeanCollectionResource extends ReadOnlyBeanCollectionResource {

  protected javax.ws.rs.core.Response invokeAction(String action, JsonObject requestBody) {
    return
      VoidResponseMapper.toResponse(
        getInvocationContext(),
        new CustomInvokeActionHelper(getInvocationContext(), action, requestBody).invokeAction()
      );
  }

  private static class CustomInvokeActionHelper extends InvokeActionHelper {
    private CustomInvokeActionHelper(
      InvocationContext ic,
      String action,
      JsonObject requestBody
    ) {
      super(ic, action, requestBody);
    }

    @Override
    protected Response<Void> invokeTableRowsAction(List<BeanTreePath> rowBTPs) {
      if (rowBTPs.size() > 1 && "gracefulShutdown".equals(getAction()) || "forceShutdown".equals(getAction())) {
        // Don't let the user shutdown the admin server and any managed servers at the same time
        // since the admin server is needed to shutdown the managed servers.
        Response<Void> response = new Response<>();
        Response<String> asnResponse = getAdminServerName();
        if (!asnResponse.isSuccess()) {
          return response.copyUnsuccessfulResponse(asnResponse);
        }
        String adminServerName = asnResponse.getResults();
        boolean haveAdminServer = false;
        boolean haveManagedServer = false;
        boolean managedServer = false;
        for (BeanTreePath rowBTP : rowBTPs) {
          String serverName = rowBTP.getLastSegment().getKey();
          if (adminServerName.equals(serverName)) {
            haveAdminServer = true;
          } else {
            haveManagedServer = true;
          }
          if (haveAdminServer && haveManagedServer) {
            response.addFailureMessage(
              getInvocationContext()
                .getLocalizer()
                .localizeString(LocalizedConstants.CANT_SHUTDOWN_ADMIN_SERVER_AND_MANAGED_SERVERS)
            );
            return response.setUserBadRequest();
          }
        }
      }
      return super.invokeTableRowsAction(rowBTPs);
    }

    private Response<String> getAdminServerName() {
      Response<String> response = new Response<>();
      BeanRepo beanRepo = getInvocationContext().getBeanTreePath().getBeanRepo();
      BeanReaderRepoSearchBuilder builder =
        beanRepo.asBeanReaderRepo().createSearchBuilder(getInvocationContext(), false);
      BeanPropertyDef adminServerNamePropertyDef =
        beanRepo.getBeanRepoDef().getTypeDef("DomainMBean").getPropertyDef(new Path("AdminServerName"));
      BeanTreePath domainBTP =
        BeanTreePath.create(beanRepo, new Path("Domain"));
      builder.addProperty(domainBTP, adminServerNamePropertyDef);
      Response<BeanReaderRepoSearchResults> searchResponse = builder.search();
      if (!searchResponse.isSuccess()) {
        return response.copyUnsuccessfulResponse(searchResponse);
      }
      BeanSearchResults searchResults = searchResponse.getResults().getBean(domainBTP);
      String adminServerName =
        searchResults.getValue(adminServerNamePropertyDef).asString().getValue();
      return response.setSuccess(adminServerName);
    }
  }
}
