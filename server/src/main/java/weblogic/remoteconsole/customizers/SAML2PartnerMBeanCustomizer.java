// Copyright (c) 2023, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
import java.util.List;
import javax.json.JsonArray;
import javax.json.JsonObject;

import weblogic.console.utils.Path;
import weblogic.console.utils.StringUtils;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchResults;
import weblogic.remoteconsole.server.repo.IntValue;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.TableCell;
import weblogic.remoteconsole.server.repo.TableRow;
import weblogic.remoteconsole.server.repo.weblogic.WebLogicRestInvoker;

/** 
 * Custom code for processing the SAML2PartnerMBean and its subtypes
 */
public class SAML2PartnerMBeanCustomizer {

  private SAML2PartnerMBeanCustomizer() {
  }

  public static List<TableRow> getArtifactResolutionServiceEndpointsSliceTableRows(
    InvocationContext ic,
    BeanReaderRepoSearchResults searchResults
  ) {
    return getEndpointsSliceTableRows(ic, "artifactResolutionService");
  }

  public static List<TableRow> getAssertionConsumerServiceEndpointsSliceTableRows(
    InvocationContext ic,
    BeanReaderRepoSearchResults searchResults
  ) {
    return getEndpointsSliceTableRows(ic, "assertionConsumerService");
  }

  public static List<TableRow> getSingleSignOnServiceEndpointsSliceTableRows(
    InvocationContext ic,
    BeanReaderRepoSearchResults searchResults
  ) {
    return getEndpointsSliceTableRows(ic, "singleSignOnService");
  }

  public static List<TableRow> getSingleLogoutServiceEndpointsSliceTableRows(
    InvocationContext ic,
    BeanReaderRepoSearchResults searchResults
  ) {
    return getEndpointsSliceTableRows(ic, "singleLogoutService");
  }

  public static List<TableRow> getEndpointsSliceTableRows(InvocationContext ic, String endpointsProperty) {
    return formatEndpoints(ic, getEndpoints(ic, endpointsProperty));
  }

  private static JsonArray getEndpoints(InvocationContext ic, String endpointsProperty) {
    // e.g. Domain.RealmsSecurityData.myrealm.AuthenticationProviders.SAML2IdentityAsserter.Partners.p1
    Path cbePath = ic.getBeanTreePath().getPath();

    // e.g. serverConfig.realmsSecurityData.myrealm.authenticationProviders.SAML2IdentityAsserter.partners.p1
    List<String> cbeComponents = cbePath.getComponents();
    String realm = cbeComponents.get(2);
    String providerCollection = StringUtils.getRestName(cbeComponents.get(3));
    String provider = cbeComponents.get(4);
    String partner = cbeComponents.get(6);
    Path wlsPath = new Path("serverConfig.realmsSecurityData");
    wlsPath.addComponent(realm);
    wlsPath.addComponent(providerCollection);
    wlsPath.addComponent(provider);
    wlsPath.addComponent("partners");
    wlsPath.addComponent(partner);

    JsonObject partnerJson = WebLogicRestInvoker.get(ic, wlsPath, false /* expanded values */).getResults();
    JsonArray endpoints = partnerJson.getJsonArray(endpointsProperty);
    return endpoints;
  }

  private static List<TableRow> formatEndpoints(InvocationContext ic, JsonArray endpoints) {
    List<TableRow> rtn = new ArrayList<>();
    for (int i = 0; i < endpoints.size(); i++) {
      rtn.add(formatEndpoint(ic, endpoints.getJsonObject(i)));
    }
    return rtn;
  }

  private static TableRow formatEndpoint(InvocationContext ic, JsonObject endpoint) {
    TableRow row = new TableRow();
    // All endpoints have 'binding' and 'location'
    row.getCells().add(
      new TableCell("Binding", new StringValue(CustomizerUtils.getStringField(endpoint, "binding")))
    );
    row.getCells().add(
      new TableCell("Location", new StringValue(CustomizerUtils.getStringField(endpoint, "location")))
    );
    if (endpoint.containsKey("index")) {
      // This is an indexed endpoint.  It also has 'index' and'default'.
      row.getCells().add(
        new TableCell("Index", new IntValue(endpoint.getInt("index")))
      );
      row.getCells().add(
        new TableCell("Default", new StringValue(CustomizerUtils.getStringField(endpoint, "default")))
      );
    }
    return row;
  }
}
