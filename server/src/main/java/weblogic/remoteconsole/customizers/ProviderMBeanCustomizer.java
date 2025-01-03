// Copyright (c) 2020, 2024, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import weblogic.remoteconsole.common.repodef.CustomTableDef;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.repodef.TableDef;
import weblogic.remoteconsole.common.repodef.weblogic.WebLogicRestEditPageRepoDef;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.SettableValue;
import weblogic.remoteconsole.server.repo.StringValue;

/**
 * Custom code for processing the ProviderMBean.
 * <p>
 * Determines a security provider's type:
 * <p>
 * If WLS is running a patch that provides the provider's type, use it.
 * If not, then try to determine the type by looking at the provider's provider class name.
 * If it's still ambiguous, return the closest base type that we can figure out.
 */
public class ProviderMBeanCustomizer {
  // Maps a provider's providerClassName property to the provider's type.
  // This is always one to one except for the LDAP authenticators.
  private static final Map<String, String> providerClassNameToType = new HashMap<>();

  static {
    // authentication providers:
    providerClassNameToType.put(
      "weblogic.security.providers.authentication.DBMSPluggableRuntimeAuthenticationProviderImpl",
      "weblogic.security.providers.authentication.CustomDBMSAuthenticator"
    );
    providerClassNameToType.put(
      "weblogic.security.providers.authentication.DBMSAuthenticationProviderImpl",
      "weblogic.security.providers.authentication.DBMSAuthenticator"
    );
    providerClassNameToType.put(
      "weblogic.security.providers.authentication.DefaultAuthenticationProviderImpl",
      "weblogic.security.providers.authentication.DefaultAuthenticator"
    );
    providerClassNameToType.put(
      "weblogic.security.providers.authentication.DefaultIdentityAsserterProviderImpl",
      "weblogic.security.providers.authentication.DefaultIdentityAsserter"
    );
    providerClassNameToType.put(
      "weblogic.security.providers.authentication.LDAPAuthenticationProviderImpl",
      "weblogic.security.providers.authentication.LDAPAuthenticator"
    );
    providerClassNameToType.put(
      "weblogic.security.providers.authentication.LDAPX509IdentityAsserterProviderImpl",
      "weblogic.security.providers.authentication.LDAPX509IdentityAsserter"
    );
    providerClassNameToType.put(
      "weblogic.security.providers.authentication.NegotiateIdentityAsserterProviderImpl",
      "weblogic.security.providers.authentication.NegotiateIdentityAsserter"
    );
    providerClassNameToType.put(
      "weblogic.security.providers.authentication.OIDCIdentityAsserterProviderImpl",
      "weblogic.security.providers.authentication.OIDCIdentityAsserter"
    );
    providerClassNameToType.put(
      "weblogic.security.providers.authentication.IDCSIntegratorProviderImpl",
      "weblogic.security.providers.authentication.OracleIdentityCloudIntegrator"
    );
    providerClassNameToType.put(
      "weblogic.security.providers.authentication.DBMSSQLReadOnlyAuthenticationProviderImpl",
      "weblogic.security.providers.authentication.ReadOnlySQLAuthenticator"
    );
    providerClassNameToType.put(
      "weblogic.security.providers.saml.SAMLAuthenticationProviderImpl",
      "weblogic.security.providers.saml.SAMLAuthenticator"
    );
    providerClassNameToType.put(
      "weblogic.security.providers.saml.SAMLIdentityAsserterV2ProviderImpl",
      "weblogic.security.providers.saml.SAMLIdentityAsserterV2"
    );
    providerClassNameToType.put(
      "com.bea.security.saml2.providers.SAML2IdentityAsserterProviderImpl",
      "com.bea.security.saml2.providers.SAML2IdentityAsserter"
    );
    providerClassNameToType.put(
      "weblogic.security.providers.authentication.DBMSSQLAuthenticationProviderImpl",
      "weblogic.security.providers.authentication.SQLAuthenticator"
    );
    providerClassNameToType.put(
      "weblogic.security.providers.authentication.VirtualUserAuthenticationProviderImpl",
      "weblogic.security.providers.authentication.VirtualUserAuthenticator"
    );
    // JRF authentication providers:
    providerClassNameToType.put(
      "oracle.security.agent.access.wls.asserter.CSAAsserterProvider",
      "oracle.security.agent.access.filter.CloudSecurityAgentAsserter"
    );
    providerClassNameToType.put(
      "oracle.security.jps.wls.providers.authentication.idm.CrossTenantAuthenticationProviderImpl",
      "oracle.security.jps.wls.providers.authentication.idm.CrossTenantAuthenticator"
    );
    providerClassNameToType.put(
      "oracle.security.wls.oam.providers.authenticator.OAMAuthenticationProviderImpl",
      "oracle.security.wls.oam.providers.authenticator.OAMAuthenticator"
    );
    providerClassNameToType.put(
      "oracle.security.wls.oam.providers.asserter.OAMIdentityAssertionProviderImpl",
      "oracle.security.wls.oam.providers.asserter.OAMIdentityAsserter"
    );
    providerClassNameToType.put(
      "oracle.security.jps.wls.providers.trust.TrustServiceAsserterProviderImpl",
      "oracle.security.jps.wls.providers.trust.TrustServiceIdentityAsserter"
    );
  
    // role mappers
    providerClassNameToType.put(
      "weblogic.security.providers.authorization.DefaultRoleMapperProviderImpl",
      "weblogic.security.providers.authorization.DefaultRoleMapper"
    );
    providerClassNameToType.put(
      "weblogic.security.providers.xacml.authorization.XACMLRoleMapperProviderImpl",
      "weblogic.security.providers.xacml.authorization.XACMLRoleMapper"
    );

    // authorizers
    providerClassNameToType.put(
      "weblogic.security.providers.authorization.DefaultAuthorizationProviderImpl",
      "weblogic.security.providers.authorization.DefaultAuthorizer"
    );
    providerClassNameToType.put(
      "weblogic.security.providers.xacml.authorization.XACMLAuthorizationProviderImpl",
      "weblogic.security.providers.xacml.authorization.XACMLAuthorizer"
    );

    // credential mappers
    providerClassNameToType.put(
      "weblogic.security.providers.credentials.DefaultCredentialMapperProviderImpl",
      "weblogic.security.providers.credentials.DefaultCredentialMapper"
    );
    providerClassNameToType.put(
      "weblogic.security.providers.credentials.PKICredentialMapperProviderImpl",
      "weblogic.security.providers.credentials.PKICredentialMapper"
    );
    providerClassNameToType.put(
      "weblogic.security.providers.saml.SAMLCredentialMapperV2ProviderImpl",
      "weblogic.security.providers.saml.SAMLCredentialMapperV2"
    );
    providerClassNameToType.put(
      "com.bea.security.saml2.providers.SAML2CredentialMapperProviderImpl",
      "com.bea.security.saml2.providers.SAML2CredentialMapper"
    );
    // JRF credential mappers:
    providerClassNameToType.put(
      "oracle.security.wls.oam.providers.credentials.OAMCredentialMappingProviderImpl",
      "oracle.security.wls.oam.providers.credentials.OAMCredentialMapper"
    );

    // cert path providers
    providerClassNameToType.put(
      "weblogic.security.providers.pk.CertificateRegistryRuntimeImpl",
      "weblogic.security.providers.pk.CertificateRegistry"
    );
    providerClassNameToType.put(
      "weblogic.security.providers.pk.WebLogicCertPathProviderRuntimeImpl",
      "weblogic.security.providers.pk.WebLogicCertPathProvider"
    );

    // adjudicators
    providerClassNameToType.put(
      "weblogic.security.providers.authorization.DefaultAdjudicationProviderImpl",
      "weblogic.security.providers.authorization.DefaultAdjudicator"
    );

    // auditors
    providerClassNameToType.put(
      "weblogic.security.providers.audit.DefaultAuditProviderImpl",
      "weblogic.security.providers.audit.DefaultAuditor"
    );

    // FortifyIssueSuppression Password Management: Password in Comment
    // Comment below does not reveal a secret
    // password validators
    providerClassNameToType.put(
      "com.bea.security.providers.authentication.passwordvalidator.SystemPasswordValidatorProviderImpl",
      "com.bea.security.providers.authentication.passwordvalidator.SystemPasswordValidator"
    );
  }

  public static SettableValue getType(
    @Source(property = "Type") SettableValue type,
    @Source(property = "ProviderClassName") SettableValue providerClassName
  ) {
    if (type != null) {
      // WLS provided the provider type.  Use it.
      return type;
    }

    if (providerClassName == null) {
      // This is an optional singleton that currently doesn't exist, e.g. the adjudicator.
      // Return null to indicate that the 'type' property isn't available.
      return null;
    }

    // Try to map the provider's providerClassName to its type.
    String pcn = providerClassName.getValue().asString().getValue();
    String value = providerClassNameToType.get(pcn);
    if (value == null) {
      value = pcn; // Just use the provider class name.  It should get mapped to a default sub type later.
    }
    return new SettableValue(new StringValue(value), false);
  }

  // Remove the moveDown and moveUp actions from the providers table if
  // we're not in the edit tree
  public static PageDef customizeTableDef(InvocationContext ic, PageDef uncustomizedPageDef) {
    if (ic.getPagePath().getPagesPath().getPageRepoDef() instanceof WebLogicRestEditPageRepoDef) {
      return uncustomizedPageDef;
    } else {
      // remove the actions (e.g. moveDown and moveUp) since only the edit tree supports them
      TableDef uncustomizedTableDef = uncustomizedPageDef.asTableDef();
      return new CustomTableDef(uncustomizedTableDef).actionDefs(List.of());
    }
  }

  private ProviderMBeanCustomizer() {
  }
}
