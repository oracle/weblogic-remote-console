// Copyright (c) 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import weblogic.console.utils.Path;
import weblogic.remoteconsole.common.repodef.BeanActionDef;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.CustomActionInputFormDef;
import weblogic.remoteconsole.common.repodef.CustomLegalValueDef;
import weblogic.remoteconsole.common.repodef.CustomPageActionParamDef;
import weblogic.remoteconsole.common.repodef.LegalValueDef;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.repodef.PageActionDef;
import weblogic.remoteconsole.common.repodef.PageActionParamDef;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.server.repo.ArrayValue;
import weblogic.remoteconsole.server.repo.BeanActionArg;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchBuilder;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchResults;
import weblogic.remoteconsole.server.repo.BeanSearchResults;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.BooleanValue;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.TableCell;
import weblogic.remoteconsole.server.repo.TableRow;
import weblogic.remoteconsole.server.repo.Value;

/**
 * Custom code for supporting service migration with MigrationCoordinatorMBean
 */
public class MigrationCoordinatorMBeanCustomizer {
  private static final String PROP_NAME = "Name";
  private static final String PROP_USER_PREFERRED_SERVER = "UserPreferredServer";
  private static final String PROP_HOSTING_SERVER = "HostingServer";
  private static final String PROP_CLUSTER = "Cluster";
  private static final String PROP_MACHINE = "Machine";
  private static final String PROP_STATE = "State";
  private static final String PROP_AUTO_MIGRATION_ENABLED = "AutoMigrationEnabled";
  private static final String PROP_ALL_CANDIDATE_SERVERS = "AllCandidateServers";
  private static final String RUNNING_STATE = "RUNNING";
  private static final String PROP_CANDIDATE_MACHINES = "CandidateMachines";
  private static final String PROP_CANDIDATE_MACHINES_FOR_MIGRATABLE_SERVERS = "CandidateMachinesForMigratableServers";

  private MigrationCoordinatorMBeanCustomizer() {
  }

  public static Value migrate(
      InvocationContext ic,
      PageActionDef pageActionDef,
      List<FormProperty> formProperties
  ) {
    return commonSetupMigrateParams(ic, formProperties, "migrate");
  }

  public static Value migrateJTA(
    InvocationContext ic,
    PageActionDef pageActionDef,
    List<FormProperty> formProperties
  ) {
    return commonSetupMigrateParams(ic, formProperties, "migrateJTA");
  }

  private static Value commonSetupMigrateParams(
    InvocationContext ic,
    List<FormProperty> formProperties,
    String migrateMethodName
  ) {
    String migratableTarget = ic.getIdentifier();
    // Only one argument "destination"
    String destination = formProperties.get(0).getValue().asSettable().getValue().asString().getValue();

    // Get hosting server for this migratable target.  Cannot do migration if the MT doesn't have hosting server.
    List<Map<String, Value>> migratableTargetList =
      getMigratableTargetList(ic, "Domain.MigratableTargets", migratableTarget);
    String hostingServer = getHostingServerNameFromListMap(ic, migratableTargetList);
    if (hostingServer.equals("")) {
      throw Response.userBadRequestException()
        .addFailureMessage(ic.getLocalizer().localizeString(LocalizedConstants.NO_HOSTING_SERVER_FOR_MT));
    }
    Boolean sourceUp = isServerRunning(ic, hostingServer);
    Boolean destinationUp = isServerRunning(ic, destination);
    // call migratableServiceCoordinatorRuntimeMBean:
    // void migrate(MigratableTargetMBean migratableTarget,
    //               ServerMBean destination,
    //               boolean sourceUp,
    //               boolean destinationUp)

    BeanTreePath destinationBTPath = BeanTreePath.create(
      ic.getBeanTreePath().getBeanRepo(), (new Path("Domain.Servers")).childPath(destination));
    BeanTreePath targetBTPath = BeanTreePath.create(
        ic.getBeanTreePath().getBeanRepo(), (new Path("Domain.MigratableTargets")).childPath(migratableTarget));
    BeanActionDef actionDef = ic.getBeanTreePath().getTypeDef().getActionDef(new Path(migrateMethodName));
    List<BeanActionArg> args = new ArrayList<>();
    args.add(new BeanActionArg(actionDef.getParamDef("migratableTarget"), targetBTPath));
    args.add(new BeanActionArg(actionDef.getParamDef("destination"), destinationBTPath));
    args.add(new BeanActionArg(actionDef.getParamDef("sourceUp"), new BooleanValue(sourceUp)));
    args.add(new BeanActionArg(actionDef.getParamDef("destinationUp"), new BooleanValue(destinationUp)));
    Response<Value> response = ic.getPageRepo().getBeanRepo().asBeanReaderRepo().invokeAction(ic, actionDef, args);
    if (response.isUserBadRequest() && response.getMessages().isEmpty()) {
      response.addFailureMessage(
        ic.getLocalizer().localizeString(LocalizedConstants.REFER_TO_MIGRATION_TASKS)
      );
    }
    return response.getResults();
  }

  public static Value migrateSingleton(
    InvocationContext ic,
    PageActionDef pageActionDef,
    List<FormProperty> formProperties
  ) {
    String singleton = ic.getIdentifier();
    // Only one argument "destination"
    String destination = formProperties.get(0).getValue().asSettable().getValue().asString().getValue();


    // call migratableServiceCoordinatorRuntimeMBean:
    // void migrateSingleton(SingletonServiceMBean singletonService, ServerMBean destination)
    BeanTreePath destinationBTPath = BeanTreePath.create(
        ic.getBeanTreePath().getBeanRepo(), (new Path("Domain.Servers")).childPath(destination));
    BeanTreePath singletonBTPath = BeanTreePath.create(
        ic.getBeanTreePath().getBeanRepo(), (new Path("Domain.SingletonServices")).childPath(singleton));

    BeanActionDef actionDef = ic.getBeanTreePath().getTypeDef().getActionDef(new Path("migrateSingleton"));
    List<BeanActionArg> args = new ArrayList<>();
    args.add(new BeanActionArg(actionDef.getParamDef("singletonService"), singletonBTPath));
    args.add(new BeanActionArg(actionDef.getParamDef("destination"), destinationBTPath));
    Response<Value> response = ic.getPageRepo().getBeanRepo().asBeanReaderRepo().invokeAction(ic, actionDef, args);
    if (response.isUserBadRequest() && response.getMessages().isEmpty()) {
      response.addFailureMessage(
        ic.getLocalizer().localizeString(LocalizedConstants.REFER_TO_MIGRATION_TASKS)
      );
    }
    return response.getResults();
  }

  public static Value migrateServer(
    InvocationContext ic,
    PageActionDef pageActionDef,
    List<FormProperty> formProperties
  ) {
    String serverName = ic.getIdentifier();
    // Only one argument "destinationMachine"
    String destinationMachine = formProperties.get(0).getValue().asSettable().getValue().asString().getValue();
    // sourceMachine
    BeanTreePath serverBeanPath = BeanTreePath.create(
      ic.getBeanTreePath().getBeanRepo(), (new Path("Domain.Servers")).childPath(serverName));
    BeanTypeDef serverTypeDef = serverBeanPath.getTypeDef();
    BeanPropertyDef machinePropertyDef = serverTypeDef.getPropertyDef(new Path(PROP_MACHINE));
    BeanReaderRepoSearchBuilder builder =
      ic.getPageRepo().getBeanRepo().asBeanReaderRepo().createSearchBuilder(ic, false);
    builder.addProperty(serverBeanPath, machinePropertyDef);
    BeanReaderRepoSearchResults searchResults = builder.search().getResults();
    BeanSearchResults beanResults = searchResults.getBean(serverBeanPath);
    String sourceMachine = beanResults.getValue(machinePropertyDef).asBeanTreePath().getLastSegment().getKey();
    boolean sourceDown = false;
    boolean destinationDown = false;
    BeanActionDef actionDef = ic.getBeanTreePath().getTypeDef().getActionDef(new Path("migrateServer"));
    List<BeanActionArg> args = new ArrayList<>();
    args.add(new BeanActionArg(actionDef.getParamDef("serverName"), new StringValue(serverName)));
    args.add(new BeanActionArg(actionDef.getParamDef("sourceMachine"), new StringValue(sourceMachine)));
    args.add(new BeanActionArg(actionDef.getParamDef("destinationMachine"), new StringValue(destinationMachine)));
    args.add(new BeanActionArg(actionDef.getParamDef("sourceDown"), new BooleanValue(sourceDown)));
    args.add(new BeanActionArg(actionDef.getParamDef("destinationDown"), new BooleanValue(destinationDown)));
    Response<Value> response = ic.getPageRepo().getBeanRepo().asBeanReaderRepo().invokeAction(ic, actionDef, args);
    if (response.isUserBadRequest() && response.getMessages().isEmpty()) {
      response.addFailureMessage(
        ic.getLocalizer().localizeString(LocalizedConstants.REFER_TO_MIGRATION_TASKS)
      );
    }
    return response.getResults();
  }

  // Get the contents for the 'Migrate JMS' slice table
  public static List<TableRow> getMigrateJMSSliceTableRows(
      InvocationContext ic,
      BeanReaderRepoSearchResults overallSearchResults
  ) {
    return getCommonSliceTableRows(ic, overallSearchResults, "Domain.MigratableTargets");
  }

  // Get the contents for the 'Singleton Service' slice table
  public static List<TableRow> getSingletonServiceSliceTableRows(
      InvocationContext ic,
      BeanReaderRepoSearchResults overallSearchResults
  ) {
    return getCommonSliceTableRows(ic, overallSearchResults, "Domain.SingletonServices");
  }

  // Get the contents for the 'migrate Server' slice table
  // Whole server migration is allowed for running server,
  // autoMigrationEnabled set to true
  // and is part of a cluster.
  // So, the table only lists out servers meeting both criteria.
  public static List<TableRow> getMigrateServerSliceTableRows(
      InvocationContext ic,
      BeanReaderRepoSearchResults overallSearchResults
  ) {
    List<TableRow> rows = new ArrayList<>();
    List<Map<String, Value>> serverList = getMigratableServersList(ic, "Domain.Servers");
    if (serverList.isEmpty()) {
      return rows;
    }
    for (Map<String, Value> oneServer : serverList) {
      TableRow row = new TableRow();
      String serverName = oneServer.get(PROP_NAME).asString().getValue();
      if (isServerRunning(ic, serverName)
          && (! oneServer.get(PROP_CLUSTER).isNullReference())
          && oneServer.get(PROP_AUTO_MIGRATION_ENABLED).asBoolean().getValue()) {
        row.setIdentifier(oneServer.get(PROP_NAME).asString().getValue());
        row.getCells()
            .add(createTableCell(PROP_NAME, oneServer.get(PROP_NAME)));
        row.getCells()
            .add(createTableCell(PROP_CLUSTER, oneServer.get(PROP_CLUSTER)));
        row.getCells()
            .add(createTableCell(PROP_MACHINE, oneServer.get(PROP_MACHINE)));
        row.getCells()
            .add(createTableCell(PROP_AUTO_MIGRATION_ENABLED, oneServer.get(PROP_AUTO_MIGRATION_ENABLED)));
        rows.add(row);
      }
    }
    return rows;
  }

  private static TableCell createTableCell(String name, Value value) {
    return
        new TableCell(
            name,
            value
        );
  }

  private static boolean isServerRunning(InvocationContext ic,String serverName) {
    BeanTreePath serverBeanPath =
        BeanTreePath.create(ic.getBeanTreePath().getBeanRepo(),
            new Path("DomainRuntime.ServerLifeCycleRuntimes.").childPath(serverName));
    BeanTypeDef serverRuntimeTypeDef = serverBeanPath.getTypeDef();
    BeanPropertyDef statePropertyDef =
        serverRuntimeTypeDef.getPropertyDef(new Path(PROP_STATE));
    BeanReaderRepoSearchBuilder builder =
        ic.getPageRepo().getBeanRepo().asBeanReaderRepo().createSearchBuilder(ic, false);
    builder.addProperty(serverBeanPath, statePropertyDef);
    BeanReaderRepoSearchResults searchResults = builder.search().getResults();
    BeanSearchResults beanResults = searchResults.getBean(serverBeanPath);
    Value stateValue =  beanResults.getValue(statePropertyDef);
    if (RUNNING_STATE.equals(stateValue.asString().getValue())) {
      return true;
    } else {
      return false;
    }
  }

  private static List<TableRow> getCommonSliceTableRows(
      InvocationContext ic,
      BeanReaderRepoSearchResults overallSearchResults,
      String path
  ) {
    List<TableRow> rows = new ArrayList<>();
    List<Map<String, Value>> migratableTargetList = getMigratableTargetList(ic, path, null);
    if (migratableTargetList.isEmpty()) {
      return rows;
    }
    for (Map<String, Value> oneMigratableTarget : migratableTargetList) {
      TableRow row = new TableRow();
      row.setIdentifier(oneMigratableTarget.get(PROP_NAME).asString().getValue());
      row.getCells()
          .add(createTableCell(PROP_NAME, oneMigratableTarget.get(PROP_NAME)));
      row.getCells()
          .add(createTableCell(PROP_USER_PREFERRED_SERVER, oneMigratableTarget.get(PROP_USER_PREFERRED_SERVER)));
      row.getCells()
          .add(createTableCell(PROP_HOSTING_SERVER, oneMigratableTarget.get(PROP_HOSTING_SERVER)));
      row.getCells()
          .add(createTableCell(PROP_CLUSTER, oneMigratableTarget.get(PROP_CLUSTER)));
      rows.add(row);
    }
    return rows;
  }

  /*
   * returns a list of map of migratable targets or singleton service, with each map containing the
   * info of the resource.
   * if the filteredName is specified, list returned will contain only one map, with the info of
   * this specified name.
   */
  private static List<Map<String, Value>> getMigratableTargetList(
      InvocationContext ic,
      String pathString,
      String filteredName
  ) {
    BeanTreePath migratableTargetsBeanPath =
        BeanTreePath.create(ic.getBeanTreePath().getBeanRepo(), new Path(pathString));
    BeanTypeDef migratableTargetTypeDef = migratableTargetsBeanPath.getTypeDef();
    BeanPropertyDef identityPropertyDef = migratableTargetTypeDef.getIdentityPropertyDef();
    BeanPropertyDef userPreferredServerPropertyDef =
        migratableTargetTypeDef.getPropertyDef(new Path(PROP_USER_PREFERRED_SERVER));
    BeanPropertyDef hostingServerPropertyDef =
        migratableTargetTypeDef.getPropertyDef(new Path(PROP_HOSTING_SERVER));
    BeanPropertyDef clusterPropertyDef =
        migratableTargetTypeDef.getPropertyDef(new Path(PROP_CLUSTER));
    BeanPropertyDef allCandidateServersPropertyDef =
        migratableTargetTypeDef.getPropertyDef(new Path(PROP_ALL_CANDIDATE_SERVERS));
    BeanReaderRepoSearchBuilder builder =
        ic.getPageRepo().getBeanRepo().asBeanReaderRepo().createSearchBuilder(ic, false);
    builder.addProperty(migratableTargetsBeanPath, identityPropertyDef);
    builder.addProperty(migratableTargetsBeanPath, userPreferredServerPropertyDef);
    builder.addProperty(migratableTargetsBeanPath, hostingServerPropertyDef);
    builder.addProperty(migratableTargetsBeanPath, clusterPropertyDef);
    builder.addProperty(migratableTargetsBeanPath, allCandidateServersPropertyDef);
    BeanReaderRepoSearchResults searchResults = builder.search().getResults();
    List<Map<String, Value>> migratableTargetList = new ArrayList<Map<String, Value>>();
    for (BeanSearchResults migratableTargetResults : searchResults.getCollection(migratableTargetsBeanPath)) {
      Map<String, Value> infoMap = new HashMap<>();
      if (filteredName != null) {
        String id = migratableTargetResults.getValue(identityPropertyDef).asBeanTreePath().getLastSegment().getKey();
        if (!filteredName.equals(id)) {
          continue;
        }
      }
      // filter out Migratable Target or Singleton Services that is not part of a cluster.
      if (migratableTargetResults.getValue(clusterPropertyDef).isNullReference()) {
        continue;
      }
      infoMap.put(PROP_CLUSTER, getStringValue(migratableTargetResults.getValue(clusterPropertyDef)));
      infoMap.put(PROP_NAME, getStringValue(migratableTargetResults.getValue(identityPropertyDef)));
      infoMap.put(PROP_USER_PREFERRED_SERVER,
          getStringValue(migratableTargetResults.getValue(userPreferredServerPropertyDef)));
      infoMap.put(PROP_HOSTING_SERVER, getStringValue(migratableTargetResults.getValue(hostingServerPropertyDef)));
      infoMap.put(PROP_ALL_CANDIDATE_SERVERS, migratableTargetResults.getValue(allCandidateServersPropertyDef));
      migratableTargetList.add(infoMap);
    }
    return migratableTargetList;
  }

  /*
   * returns a list of map of servers, with each map containing the info of each server.
   */
  private static List<Map<String, Value>> getMigratableServersList(
      InvocationContext ic,
      String pathString
  ) {
    BeanTreePath serversBeanPath =
        BeanTreePath.create(ic.getBeanTreePath().getBeanRepo(), new Path(pathString));
    BeanTypeDef serversTypeDef = serversBeanPath.getTypeDef();
    BeanPropertyDef identityPropertyDef = serversTypeDef.getIdentityPropertyDef();
    BeanPropertyDef clusterPropertyDef =
      serversTypeDef.getPropertyDef(new Path(PROP_CLUSTER));
    BeanPropertyDef machinePropertyDef =
      serversTypeDef.getPropertyDef(new Path(PROP_MACHINE));
    BeanPropertyDef autoMigrationEnabledPropertyDef =
      serversTypeDef.getPropertyDef(new Path(PROP_AUTO_MIGRATION_ENABLED));
    BeanReaderRepoSearchBuilder builder =
        ic.getPageRepo().getBeanRepo().asBeanReaderRepo().createSearchBuilder(ic, false);
    builder.addProperty(serversBeanPath, identityPropertyDef);
    builder.addProperty(serversBeanPath, clusterPropertyDef);
    builder.addProperty(serversBeanPath, machinePropertyDef);
    builder.addProperty(serversBeanPath, autoMigrationEnabledPropertyDef);
    BeanReaderRepoSearchResults searchResults = builder.search().getResults();
    List<Map<String, Value>> serversList = new ArrayList<Map<String, Value>>();
    for (BeanSearchResults serverResults : searchResults.getCollection(serversBeanPath)) {
      Map<String, Value> infoMap = new HashMap<>();
      infoMap.put(PROP_NAME, getStringValue(serverResults.getValue(identityPropertyDef)));
      infoMap.put(PROP_CLUSTER, getStringValue(serverResults.getValue(clusterPropertyDef)));
      infoMap.put(PROP_MACHINE, getStringValue(serverResults.getValue(machinePropertyDef)));
      infoMap.put(PROP_AUTO_MIGRATION_ENABLED,
          getBooleanValue(serverResults.getValue(autoMigrationEnabledPropertyDef),false));
      serversList.add(infoMap);
    }
    return serversList;
  }

  private static StringValue getStringValue(Value value) {
    if (value == null || value.isNullReference()) {
      return new StringValue("");
    }
    return new StringValue(value.asBeanTreePath().getLastSegment().getKey());
  }

  private static BooleanValue getBooleanValue(Value value, boolean defaultValue) {
    if (value == null) {
      return new BooleanValue(defaultValue);
    }
    return new BooleanValue(value.asBoolean().getValue());
  }

  public static PageDef customizeMigrationActionInputFormDef(
      InvocationContext ic,
      PageDef uncustomizedPageDef
  ) {
    CustomActionInputFormDef customActionInputFormDef =
        new CustomActionInputFormDef(uncustomizedPageDef.asActionInputFormDef());
    // Because rows is one, the CFE will always invoke this with exactly one identifier:
    if (ic.getIdentifiers() == null || ic.getIdentifiers().isEmpty()) {
      //How will this happen ? just return
      return uncustomizedPageDef;
    }
    String migratableTargetName = ic.getIdentifiers().get(0);
    List<String> candidateServersList =
      getCandidateServerList(ic, "Domain.MigratableTargets",  migratableTargetName);
    customActionInputFormDef.setParamDefs(
      customizeCandidatesInParams(
            customActionInputFormDef.getParamDefs(),
            candidateServersList,
            "destination"
        )
    );
    return customActionInputFormDef;
  }

  public static PageDef customizeMigrateSingletonActionInputFormDef(
    InvocationContext ic,
    PageDef uncustomizedPageDef
  ) {
    CustomActionInputFormDef customActionInputFormDef =
      new CustomActionInputFormDef(uncustomizedPageDef.asActionInputFormDef());
    // Because rows is one, the CFE will always invoke this with exactly one identifier:
    if (ic.getIdentifiers() == null || ic.getIdentifiers().isEmpty()) {
      //ignore, it really shouldn't happen.
      return uncustomizedPageDef;
    }
    String singletonName = ic.getIdentifiers().get(0);
    List<String> candidateServersList = getCandidateServerList(ic, "Domain.SingletonServices", singletonName);
    customActionInputFormDef.setParamDefs(
      customizeCandidatesInParams(
        customActionInputFormDef.getParamDefs(),
        candidateServersList,
        "destination"
      )
    );
    return customActionInputFormDef;
  }



  private static List<PageActionParamDef> customizeCandidatesInParams(
      List<PageActionParamDef> uncustomizedPageActionParamDefs,
      List<String> serverList,
      String parmName
  ) {
    List<PageActionParamDef> customizedPageActionParamDefs = new ArrayList<>();
    for (PageActionParamDef uncustomizedPageActionParamDef : uncustomizedPageActionParamDefs) {
      if (parmName.equals(uncustomizedPageActionParamDef.getParamName())) {
        PageActionParamDef paramDef = customizeServerList(uncustomizedPageActionParamDef, serverList);
        customizedPageActionParamDefs.add(
            paramDef
        );
      } else {
        customizedPageActionParamDefs.add(uncustomizedPageActionParamDef);
      }
    }
    return customizedPageActionParamDefs;
  }

  private static PageActionParamDef customizeServerList(
      PageActionParamDef uncustomizedPageActionParamDef,
      List<String> serverList
  ) {
    List<LegalValueDef> customizedLegalValueDefs = new ArrayList<>();
    CustomPageActionParamDef customPageActionParamDef = new CustomPageActionParamDef(uncustomizedPageActionParamDef);
    for (String server : serverList) {
      customizedLegalValueDefs.add(
          new CustomLegalValueDef()
              .fieldDef(uncustomizedPageActionParamDef)
              .value(new StringValue(server))
              .label(new LocalizableString(server))
      );
    }
    return customPageActionParamDef.legalValueDefs(customizedLegalValueDefs);
  }

  private static String getHostingServerNameFromListMap(
    InvocationContext ic,
    List<Map<String, Value>> migratableTargetList
  ) {
    if (migratableTargetList.isEmpty()) {
      //this should not happen.
      throw Response.userBadRequestException()
        .addFailureMessage(ic.getLocalizer().localizeString(LocalizedConstants.MIGRATION_TARGET_NOT_FOUND));
    }
    Map<String, Value> migratableTargetInfo = migratableTargetList.get(0);
    Value hostingServerValue = migratableTargetInfo.get(PROP_HOSTING_SERVER);
    String hostingServer = (hostingServerValue == null)
      ? "" : hostingServerValue.asString().getValue();
    return hostingServer;
  }

  //This method returns the list of candidateServers for either migratable target or singleton services.
  //It just depends on the pathString that's passed.
  private static List<String> getCandidateServerList(
    InvocationContext ic,
    String pathString,
    String migratableTargetName
  ) {
    List<Map<String, Value>> migratableTargetList = getMigratableTargetList(ic, pathString, migratableTargetName);
    Map<String, Value> migratableTargetInfo = migratableTargetList.get(0);
    String hostingServer = getHostingServerNameFromListMap(ic, migratableTargetList);
    ArrayValue allCandidatesValue = migratableTargetInfo.get(PROP_ALL_CANDIDATE_SERVERS).asArray();
    List<String> serverList = new ArrayList<>();
    // exclude the hostingServer from the selection list.
    for (Value oneCandidateV : allCandidatesValue.getValues()) {
      String oneServer = oneCandidateV.asBeanTreePath().getLastSegment().getKey();
      if (!oneServer.equals(hostingServer)) {
        serverList.add(oneServer);
      }
    }
    return serverList;
  }

  public static PageDef customizeMigrateServerInputFormDef(
    InvocationContext ic,
    PageDef uncustomizedPageDef
  ) {
    CustomActionInputFormDef customActionInputFormDef =
      new CustomActionInputFormDef(uncustomizedPageDef.asActionInputFormDef());
    // Because rows is one, the CFE will always invoke this with exactly one identifier:
    if (ic.getIdentifiers() == null || ic.getIdentifiers().isEmpty()) {
      //ignore, it really shouldn't happen.
      return uncustomizedPageDef;
    }
    String serverName = ic.getIdentifiers().get(0);

    List<String> candidateMachineList = getCandidateMachineList(ic, serverName);
    customActionInputFormDef.setParamDefs(
      customizeCandidatesInParams(
        customActionInputFormDef.getParamDefs(),
        candidateMachineList,
        "destinationMachine"
      )
    );
    return customActionInputFormDef;
  }

  // returns the list of candidate machines for the specified server.
  // If the list is empty for the server, then try to get the candidate machine list from the cluster.
  @SuppressWarnings("unchecked")
  private static List<String> getCandidateMachineList(
    InvocationContext ic,
    String serverName
  ) {
    BeanTreePath serverBeanPath = BeanTreePath.create(
      ic.getBeanTreePath().getBeanRepo(), (new Path("Domain.Servers")).childPath(serverName));
    Map<String, Object> infoMap = getMachines(ic, serverBeanPath, PROP_CANDIDATE_MACHINES, true);
    List<BeanTreePath> candidateMachinesList = (List<BeanTreePath>) infoMap.get(PROP_CANDIDATE_MACHINES);
    String currentMachine = (String) infoMap.get(PROP_MACHINE);
    if (candidateMachinesList == null || candidateMachinesList.isEmpty()) {
      BeanTreePath clusterBeanPath = (BeanTreePath) infoMap.get(PROP_CLUSTER);
      infoMap = getMachines(ic, clusterBeanPath, PROP_CANDIDATE_MACHINES_FOR_MIGRATABLE_SERVERS, false);
      candidateMachinesList = (List<BeanTreePath>) infoMap.get(PROP_CANDIDATE_MACHINES_FOR_MIGRATABLE_SERVERS);
    }

    //Filter out the current machine
    List<String> machineList = new ArrayList<>();
    if (!(candidateMachinesList == null || candidateMachinesList.isEmpty())) {
      for (BeanTreePath oneMachine: candidateMachinesList) {
        String machineName = oneMachine.asBeanTreePath().getLastSegment().getKey();
        if (!machineName.equals(currentMachine)) {
          machineList.add(machineName);
        }
      }
    }
    if (machineList.isEmpty()) {
      machineList.add(
        ic.getLocalizer().localizeString(LocalizedConstants.NONE_CONFIGURED));
    }
    return machineList;
  }

  private static Map<String, Object> getMachines(
    InvocationContext ic,
    BeanTreePath beanTreePath,
    String propertyName,
    boolean includeCluster
  ) {

    BeanTypeDef serverTypeDef = beanTreePath.getTypeDef();
    BeanPropertyDef identityPropertyDef = serverTypeDef.getIdentityPropertyDef();
    BeanPropertyDef candidateMachinesPropertyDef =
      serverTypeDef.getPropertyDef(new Path(propertyName));
    BeanPropertyDef clusterPropertyDef = null;
    BeanPropertyDef machinePropertyDef = null;
    if (includeCluster) {
      clusterPropertyDef = serverTypeDef.getPropertyDef(new Path(PROP_CLUSTER));
      machinePropertyDef = serverTypeDef.getPropertyDef(new Path(PROP_MACHINE));
    }
    BeanReaderRepoSearchBuilder builder =
      ic.getPageRepo().getBeanRepo().asBeanReaderRepo().createSearchBuilder(ic, false);
    builder.addProperty(beanTreePath, identityPropertyDef);
    builder.addProperty(beanTreePath, candidateMachinesPropertyDef);
    if (includeCluster) {
      builder.addProperty(beanTreePath, clusterPropertyDef);
      builder.addProperty(beanTreePath, machinePropertyDef);
    }
    BeanReaderRepoSearchResults searchResults = builder.search().getResults();
    BeanSearchResults beanResults = searchResults.getBean(beanTreePath);

    Map<String, Object> infoMap = new HashMap<>();
    infoMap.put(propertyName,
      beanResults.getValue(candidateMachinesPropertyDef).asArray().getValues());
    if (includeCluster) {
      infoMap.put(PROP_CLUSTER,
        beanResults.getValue(clusterPropertyDef).asBeanTreePath());
      infoMap.put(PROP_MACHINE,
        beanResults.getValue(machinePropertyDef).asBeanTreePath().getLastSegment().getKey());
    }
    return infoMap;
  }
}

