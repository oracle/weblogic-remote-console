// Copyright (c) 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import weblogic.console.utils.Path;
import weblogic.console.utils.StringUtils;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.CustomCreateFormDef;
import weblogic.remoteconsole.common.repodef.CustomFormSectionDef;
import weblogic.remoteconsole.common.repodef.CustomFormSectionUsedIfDef;
import weblogic.remoteconsole.common.repodef.CustomLegalValueDef;
import weblogic.remoteconsole.common.repodef.CustomPagePropertyDef;
import weblogic.remoteconsole.common.repodef.LegalValueDef;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchBuilder;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchResults;
import weblogic.remoteconsole.server.repo.BeanSearchResults;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.Value;

/** 
 * Custom code for processing security providers
 */
public class SecurityProviderMBeanCustomizer {

  public static PageDef customizeCreateAdjudicatorPageDef(
    InvocationContext ic,
    PageDef uncustomizedPageDef
  ) {
    return customizeStandardCreateSecurityProviderPageDef(ic, uncustomizedPageDef, "AdjudicatorTypes");
  }

  public static PageDef customizeCreateAuditorPageDef(
    InvocationContext ic,
    PageDef uncustomizedPageDef
  ) {
    return customizeStandardCreateSecurityProviderPageDef(ic, uncustomizedPageDef, "AuditorTypes");
  }

  public static PageDef customizeCreateAuthorizerPageDef(
    InvocationContext ic,
    PageDef uncustomizedPageDef
  ) {
    return customizeStandardCreateSecurityProviderPageDef(ic, uncustomizedPageDef, "AuthorizerTypes");
  }

  public static PageDef customizeCreateCertPathProviderPageDef(
    InvocationContext ic,
    PageDef uncustomizedPageDef
  ) {
    return customizeStandardCreateSecurityProviderPageDef(ic, uncustomizedPageDef, "CertPathProviderTypes");
  }

  public static PageDef customizeCreateCredentialMapperPageDef(
    InvocationContext ic,
    PageDef uncustomizedPageDef
  ) {
    return customizeStandardCreateSecurityProviderPageDef(ic, uncustomizedPageDef, "CredentialMapperTypes");
  }

  public static PageDef customizeCreatePasswordValidatorPageDef(
     InvocationContext ic,
    PageDef uncustomizedPageDef
  ) {
    return customizeStandardCreateSecurityProviderPageDef(ic, uncustomizedPageDef, "PasswordValidatorTypes");
  }

  public static PageDef customizeCreateRoleMapperPageDef(
    InvocationContext ic,
    PageDef uncustomizedPageDef
  ) {
    return customizeStandardCreateSecurityProviderPageDef(ic, uncustomizedPageDef, "RoleMapperTypes");
  }

  private static PageDef customizeStandardCreateSecurityProviderPageDef(
    InvocationContext ic,
    PageDef uncustomizedPageDef,
    String supportedTypesPropertyName
  ) {
    if (!isAdminServerConnection(ic)) {
      return uncustomizedPageDef;
    }
    CustomCreateFormDef customizedCreateFormDef =
      new CustomCreateFormDef(uncustomizedPageDef.asCreateFormDef());
    customizedCreateFormDef.setPropertyDefs(
      customizeTypeInProperties(
        customizedCreateFormDef.getPropertyDefs(),
        getSupportedTypes(ic, supportedTypesPropertyName)
      )
    );
    return customizedCreateFormDef;
  }

  public static PageDef customizeCreateAuthenticationProviderPageDef(
    InvocationContext ic,
    PageDef uncustomizedPageDef
  ) {
    if (!isAdminServerConnection(ic)) {
      return uncustomizedPageDef;
    }
    CustomCreateFormDef customizedCreateFormDef =
      new CustomCreateFormDef(uncustomizedPageDef.asCreateFormDef());
    List<String> supportedTypes = getSupportedTypes(ic, "AuthenticationProviderTypes");
    CustomFormSectionDef customizedMainSectionDef =
      new CustomFormSectionDef(customizedCreateFormDef.getSectionDefs().get(0));
    customizedMainSectionDef.setPropertyDefs(
      customizeTypeInProperties(
        customizedMainSectionDef.getPropertyDefs(),
        supportedTypes
      )
    );
    CustomFormSectionDef customizedAuthenticatorSectionDef =
      new CustomFormSectionDef(customizedCreateFormDef.getSectionDefs().get(1));
    addAuthenticatorTypesToAuthenticatorSection(
      ic, customizedAuthenticatorSectionDef, supportedTypes
    );
    customizedCreateFormDef.setSectionDefs(
      List.of(customizedMainSectionDef, customizedAuthenticatorSectionDef)
    );
    return customizedCreateFormDef;
  }

  private static void addAuthenticatorTypesToAuthenticatorSection(
    InvocationContext ic,
    CustomFormSectionDef customizedAuthenticatorSectionDef,
    List<String> supportedTypes
  ) {
    // This section has authenticator specific properties (i.e. ControlFlag)
    // It should only be displayed when the user selects a type that is an authenticator.
    // To do this, the section's usedIf's values must include the types that are authenticators.
    if (!ic.getPageRepo().getBeanRepo().getBeanRepoDef().supportsCapabilities(List.of("BeansSupport"))) {
      // We can't introspect to find out if a type is an Authenticator.
      // The built-in authenticators are already in customizedAuthenticatorSectionDef.
      //  Assume 3rd party authentication providers are not.
      return;
    }
    // If a type has a controlFlag property, then it's an authenticator.
    BeansCapabilitiesFinder authenticatorsFinder = new BeansCapabilitiesFinder();
    for (String supportedType : supportedTypes) {
      authenticatorsFinder.addPropertyCapability(
        supportedType,
        supportedType + "MBean", // the name of the type's MBean interface is alway the type name plus MBean
        "controlFlag"
      );
    }
    authenticatorsFinder.find(ic);
    List<Value> authenticatorTypes = new ArrayList<>();
    for (String supportedType : supportedTypes) {
      if (authenticatorsFinder.supports(supportedType)) {
        authenticatorTypes.add(new StringValue(supportedType));
      }
    }
    customizedAuthenticatorSectionDef.setUsedIfDef(
      new CustomFormSectionUsedIfDef(customizedAuthenticatorSectionDef.getUsedIfDef())
        .values(authenticatorTypes)
    );
  }

  private static List<PagePropertyDef> customizeTypeInProperties(
    List<PagePropertyDef> uncustomizedPropertyDefs,
    List<String> supportedTypes
  ) {
    List<PagePropertyDef> customizedPropertyDefs = new ArrayList<>();
    for (PagePropertyDef uncustomizedPropertyDef : uncustomizedPropertyDefs) {
      if ("Type".equals(uncustomizedPropertyDef.getPropertyName())) {
        customizedPropertyDefs.add(
          customizeType(uncustomizedPropertyDef, supportedTypes)
        );
      } else {
        customizedPropertyDefs.add(uncustomizedPropertyDef);
      }
    }
    return customizedPropertyDefs;
  }

  private static PagePropertyDef customizeType(
    PagePropertyDef uncustomizedTypePropertyDef,
    List<String> supportedTypes
  ) {
    List<LegalValueDef> customizedLegalValueDefs = new ArrayList<>();
    List<LegalValueDef> uncustomizedLegalValueDefs = uncustomizedTypePropertyDef.getLegalValueDefs();
    CustomPagePropertyDef customizedTypePropertyDef = new CustomPagePropertyDef(uncustomizedTypePropertyDef);
    // TBD - does the order of the legal values matter? See if PDJ generation code sorts them.
    for (String supportedType : supportedTypes) {
      customizedLegalValueDefs.add(
        getTypeLegalValueDef(
          customizedTypePropertyDef,
          supportedType
        )
      );
    }
    return customizedTypePropertyDef.legalValueDefs(customizedLegalValueDefs);
  }

  private static LegalValueDef getTypeLegalValueDef(
    PagePropertyDef customizedTypePropertyDef,
    String type
  ) {
    for (LegalValueDef uncustomizedLegalValueDef : customizedTypePropertyDef.getLegalValueDefs()) {
      if (type.equals(uncustomizedLegalValueDef.getValue())) {
        return new CustomLegalValueDef(uncustomizedLegalValueDef).fieldDef(customizedTypePropertyDef);
      }
    }
    return
      new CustomLegalValueDef()
        .fieldDef(customizedTypePropertyDef)
        .value(new StringValue(type))
        .label(
          new LocalizableString(
            StringUtils.camelCaseToUpperCaseWords(StringUtils.getLeafClassName(type))
          )
        );
  }

  private static List<String> getSupportedTypes(InvocationContext ic, String supportedTypesPropertyName) {
    // e.g. Domain / SecurityConfiguration / Realms / myrealm / AuthenticationProviders...
    BeanTreePath btp = ic.getBeanTreePath();
    Path path = btp.getPath();
    Path realmPath = path.subPath(0, 4);
    BeanTreePath realmBTP = BeanTreePath.create(btp.getBeanRepo(), realmPath);
    InvocationContext realmIC = new InvocationContext(ic, realmBTP);
    BeanReaderRepoSearchBuilder builder =
      realmIC.getPageRepo().getBeanRepo().asBeanReaderRepo().createSearchBuilder(realmIC, false);
    BeanPropertyDef supportedTypesPropertyDef =
       realmIC.getBeanTreePath().getTypeDef().getPropertyDef(new Path(supportedTypesPropertyName));
    builder.addProperty(realmBTP, supportedTypesPropertyDef);
    BeanReaderRepoSearchResults searchResults = builder.search().getResults();
    BeanSearchResults beanResults = searchResults.getBean(realmBTP);
    if (beanResults == null) {
      throw Response.notFoundException();
    }
    Value typesValue = beanResults.getValue(supportedTypesPropertyDef);
    Map<String,String> sortedSupportedTypes = new TreeMap<>();
    for (Value typeValue : typesValue.asArray().getValues()) {
      String type = typeValue.asString().getValue();
      sortedSupportedTypes.put(StringUtils.getLeafClassName(type), type);
    }
    return new ArrayList<>(sortedSupportedTypes.values());
  }

  private static boolean isAdminServerConnection(InvocationContext ic) {
    return ic.getPageRepo().getBeanRepo().getBeanRepoDef().supportsCapabilities(List.of("AdminServerConnection"));
  }
}
