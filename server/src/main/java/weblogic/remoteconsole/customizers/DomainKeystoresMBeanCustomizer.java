// Copyright (c) 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.List;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;

import weblogic.console.utils.Path;
import weblogic.remoteconsole.common.repodef.PageActionDef;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchResults;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.TableRow;
import weblogic.remoteconsole.server.repo.Value;
import weblogic.remoteconsole.server.repo.weblogic.WebLogicRestInvoker;

/** 
 * Custom code for processing the DomainKeystoresDomainRuntimeMBean and DomainKeystoresServerRuntimeMBean
 */
public class DomainKeystoresMBeanCustomizer {

  private DomainKeystoresMBeanCustomizer() {
  }

  public static Value removeProvisionedIdentityCertificate(
    InvocationContext ic,
    PageActionDef pageActionDef,
    List<FormProperty> formProperties
  ) {
    return
      removeCertificate(
        ic,
        ic.getIdentifier(),
        getDomainLevelKeystoresActionPath(ic, "removeProvisionedIdentityCertificate")
      );
  }

  public static Value removeProvisionedTrustCertificate(
    InvocationContext ic,
    PageActionDef pageActionDef,
    List<FormProperty> formProperties
  ) {
    return
      removeCertificate(
        ic,
        ic.getIdentifier(),
        getDomainLevelKeystoresActionPath(ic, "removeProvisionedTrustCertificate")
      );
  }

  private static Value removeCertificate(
    InvocationContext ic,
    String alias,
    Path removeActionPath
  ) {
    JsonObjectBuilder args = Json.createObjectBuilder();
    args.add("alias", alias);
    WebLogicRestInvoker.post(
      ic,
      removeActionPath,
      args.build(),
      false, // expanded values
      false, // save changes
      false // asynchronous
    ).getResults(); // throws if the post failed
    return null;
  }

  public static List<TableRow> getProvisionedIdentityKeystoreSliceTableRows(
    InvocationContext ic,
    BeanReaderRepoSearchResults searchResults
  ) {
    return getDomainLevelKeystore(ic, "listProvisionedIdentityKeystore");
  }

  public static List<TableRow> getProvisionedTrustKeystoreSliceTableRows(
    InvocationContext ic,
    BeanReaderRepoSearchResults searchResults
  ) {
    return getDomainLevelKeystore(ic, "listProvisionedTrustKeystore");
  }

  public static List<TableRow> getDomainTrustKeystoreSliceTableRows(
    InvocationContext ic,
    BeanReaderRepoSearchResults searchResults
  ) {
    return getDomainLevelKeystore(ic, "listDomainTrustKeystore");
  }

  public static List<TableRow> getDomainCaKeystoreSliceTableRows(
    InvocationContext ic,
    BeanReaderRepoSearchResults searchResults
  ) {
    return getDomainLevelKeystore(ic, "listDomainCaKeystore");
  }

  public static List<TableRow> getServerIdentityKeystoreSliceTableRows(
    InvocationContext ic,
    BeanReaderRepoSearchResults searchResults
  ) {
    return getServerLevelKeystore(ic, "listServerIdentityKeystore");
  }

  public static List<TableRow> getServerTrustKeystoreSliceTableRows(
    InvocationContext ic,
    BeanReaderRepoSearchResults searchResults
  ) {
    return getServerLevelKeystore(ic, "listServerTrustKeystore");
  }

  public static List<TableRow> getMachineIdentityKeystoreSliceTableRows(
    InvocationContext ic,
    BeanReaderRepoSearchResults searchResults
  ) {
    return getServerLevelKeystore(ic, "listMachineIdentityKeystore");
  }

  public static List<TableRow> getMachineTrustKeystoreSliceTableRows(
    InvocationContext ic,
    BeanReaderRepoSearchResults searchResults
  ) {
    return getServerLevelKeystore(ic, "listMachineTrustKeystore");
  }

  private static  List<TableRow> getDomainLevelKeystore(InvocationContext ic, String action) {
    return getKeystore(ic, getDomainLevelKeystoresActionPath(ic, action));
  }

  private static  List<TableRow> getServerLevelKeystore(InvocationContext ic, String action) {
    return getKeystore(ic, getServerLevelKeystoresActionPath(ic, action));
  }

  private static List<TableRow> getKeystore(InvocationContext ic, Path wlsPath) {
    JsonObjectBuilder args = Json.createObjectBuilder();
    JsonObject results =
      WebLogicRestInvoker.post(
        ic,
        wlsPath,
        args.build(),
        false, // expanded values
        false, // save changes
        false // asynchronous
       ).getResults(); // throws if the post failed
    if (results.isNull("return")) {
      return null;
    }
    return X509CertificateInfoVBeanUtils.processCertificates(ic, results.getJsonArray("return"));
  }

  private static Path getDomainLevelKeystoresActionPath(InvocationContext ic, String action) {
    return new Path("domainRuntime.domainKeystoresRuntime").childPath(action);
  }

  private static Path getServerLevelKeystoresActionPath(InvocationContext ic, String action) {
    // DomainRuntime.CombinedServerRuntimes.<svr>.ServerRuntime.DomainKeystoresRuntime:
    Path cbePath = ic.getBeanTreePath().getPath();
    Path wlsPath = new Path("domainRuntime.serverRuntimes");
    // domainRuntime.serverRuntimes.<svr>.domainKeystoreRuntimes.<action>:
    wlsPath.addComponent(cbePath.getComponents().get(2));
    wlsPath.addComponent("domainKeystoresRuntime");
    wlsPath.addComponent(action);
    return wlsPath;
  }
}
