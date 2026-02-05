// Copyright (c) 2025, 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.providers;

import java.io.File;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonValue;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.fasterxml.jackson.databind.ObjectMapper;
import weblogic.remoteconsole.server.EncryptDecrypt;
import weblogic.remoteconsole.server.PersistenceManager;
import weblogic.remoteconsole.server.repo.Frontend;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.webapp.RemoteConsoleResource;
import weblogic.remoteconsole.server.webapp.WebAppUtils;

public class ProjectManager {
  private static final Logger LOGGER = Logger.getLogger(ProjectManager.class.getName());
  private static ProviderInfoGenerator defaultProviderGenerator;
  private static JsonObject defaultProviderJSON;
  private Map<String, Project> projects = new LinkedHashMap<>();
  private Project currentProject;
  private static final ProjectManagementProvider
    projectTableProvider = new ProjectManagementProvider();
  private ConfiguredProvider currentConfiguredProvider;
  private static boolean dontSortByLastUsed =
    (System.getenv("CONSOLE_TESTING_PREDICTABLE_ORDERING") != null);

  public ProjectManager(InvocationContext ic) {
    if ((defaultProviderJSON == null) && (defaultProviderGenerator != null)) {
      defaultProviderJSON = defaultProviderGenerator.generate(ic);
    }
    load(ic);
  }

  public static Provider getProjectManagementProvider() {
    return projectTableProvider;
  }

  public Project createProject(String name) {
    Project ret = new Project(name);
    if (projects.containsKey(name)) {
      throw new WebApplicationException(Response.status(
        Status.BAD_REQUEST.getStatusCode(),
          "A project name must be unique"
      ).build());
    }
    projects.put(name, ret);
    if (name.contains("/")) {
      throw new WebApplicationException(Response.status(
        Status.BAD_REQUEST.getStatusCode(),
          "A project name may not contain a \"/\""
      ).build());
    }
    return ret;
  }

  public void deleteProject(String name) {
    Project removed = projects.remove(name);
    if (removed != null) {
      removed.terminate();
      if (currentProject == removed) {
        unsetCurrentLiveProvider();
        if (!projects.isEmpty()) {
          setCurrentProject(projects.values().iterator().next());
        } else {
          makeDefaultProject();
        }
      }
    }
  }

  // This is used by the hosted code
  public static void setDefaultProviderGenerator(ProviderInfoGenerator generator) {
    defaultProviderGenerator = generator;
  }


  public void moveDown(String name) {
    Map<String, Project> holdProjects = projects;
    if (!holdProjects.containsKey(name)) {
      return;
    }
    projects = new LinkedHashMap<>();
    boolean putNext = false;
    for (String walkName : holdProjects.keySet()) {
      if (name.equals(walkName)) {
        putNext = true;
      } else {
        projects.put(walkName, holdProjects.get(walkName));
        if (putNext) {
          projects.put(name, holdProjects.get(name));
          putNext = false;
        }
      }
    }
    // This will happen if we get a move down on the last entry
    if (putNext) {
      projects.put(name, holdProjects.get(name));
    }
  }

  public void moveUp(String name) {
    Map<String, Project> holdProjects = projects;
    if (!holdProjects.containsKey(name)) {
      return;
    }
    projects = new LinkedHashMap<>();
    String prevName = null;
    for (String walkName : holdProjects.keySet()) {
      if (walkName.equals(name)) {
        // If the move up is first, just put everything back
        if (prevName == null) {
          projects = holdProjects;
          return;
        }
        break;
      }
      prevName = walkName;
    }
    for (String walkName : holdProjects.keySet()) {
      if (prevName.equals(walkName)) {
        projects.put(name, holdProjects.get(name));
      }
      if (!walkName.equals(name)) {
        projects.put(walkName, holdProjects.get(walkName));
      }
    }
  }

  public void terminate() {
    for (Project proj : projects.values()) {
      proj.terminate();
    }
  }

  public Collection<String> getNames() {
    return projects.keySet();
  }

  public void unsetCurrentLiveProvider() {
    currentConfiguredProvider = null;
  }

  public void setCurrentProvider(
    InvocationContext ic,
    Project proj,
    ConfiguredProvider prov) {
    setCurrentProject(proj);
    proj.setCurrent(prov.getName());
    currentConfiguredProvider = prov;
    currentConfiguredProvider.updateLastUsed();
    save(ic);
  }

  public ConfiguredProvider getCurrentConfiguredProvider() {
    return currentConfiguredProvider;
  }

  private void setCurrentProject(Project proj) {
    currentProject = proj;
  }

  // Notice the distinction:  if the user sets the current project,
  // we need to persist.  If we set it as we're reading it in, we
  // don't want to persist it over again.
  public void setCurrentProjectByUser(InvocationContext ic, Project proj) {
    if (currentProject != proj) {
      currentProject = proj;
      save(ic);
    }
  }

  public Project getCurrentProject() {
    return currentProject;
  }

  public Provider getCurrentLiveProvider() {
    if (getCurrentConfiguredProvider() != null) {
      return getCurrentConfiguredProvider().getLiveProvider();
    }
    return getProjectManagementProvider();
  }

  public Project getProject(String name) {
    return projects.get(name);
  }

  public boolean isCurrent(Project proj) {
    return proj == currentProject;
  }

  public Collection<Project> getProjects() {
    return projects.values();
  }

  public static ProjectManager getFromContext(ResourceContext context) {
    Frontend frontend = Frontend.getFromContext(
      context.getResource(ContainerRequestContext.class));
    if (frontend == null) {
      return null;
    }
    return frontend.getProjectManager();
  }

  public Project get(String name) {
    return projects.get(name);
  }

  public void save(ResourceContext resContext) {
    save(WebAppUtils.getInvocationContextFromResourceContext(resContext));
  }

  public void save(InvocationContext ic) {
    if (!PersistenceManager.shouldIPersistProjects(ic)) {
      return;
    }
    String path = PersistenceManager.getPersistenceFilePath(ic);

    if (path == null) {
      return;
    }

    // This shouldn't be necessary in a real environment, but is nice in a
    // test environment
    if (!(new File(path)).exists()) {
      new File(path).mkdirs();
    }

    String fullPath = path + "/user-projects-new.json";

    JsonObjectBuilder builder = Json.createObjectBuilder();
    JsonArrayBuilder projectsBuilder = Json.createArrayBuilder();
    for (Project proj : projects.values()) {
      JsonObjectBuilder projBuilder = Json.createObjectBuilder();
      if (isCurrent(proj)) {
        projBuilder.add("current", true);
      }
      proj.getJSONForPersistence(
        this,
        ic,
        projBuilder,
        !"false".equals(
          System.getProperty("weblogic.remoteconsole.credentials.storage"))
      );
      projectsBuilder.add(projBuilder);
    }
    builder.add("projects", projectsBuilder);
    try {
      ObjectMapper mapper = new ObjectMapper();
      mapper.writerWithDefaultPrettyPrinter().writeValue(
        new File(fullPath),
        mapper.readValue(builder.build().toString(), Object.class)
      );
    } catch (Throwable t) {
      LOGGER.severe(
        "Problem writing" + " " + fullPath + ": " + t.getMessage()
      );
    }
  }

  public Collection<Provider> getAllLiveProviders() {
    List<Provider> ret = new LinkedList<>();
    for (Project proj : projects.values()) {
      for (ConfiguredProvider prov : proj.getProviders()) {
        if (prov.getLiveProvider() != null) {
          ret.add(prov.getLiveProvider());
        }
      }
    }
    return ret;
  }

  private void makeDefaultProject() {
    Project proj = createProject("Default Project");
    setCurrentProject(proj);
  }

  private void load(InvocationContext ic) {
    String path = PersistenceManager.getPersistenceFilePath(ic);
    if (path == null) {
      makeDefaultProject();
      return;
    }
    String fullPath = path + "/user-projects-new.json";
    if (!new File(fullPath).exists()) {
      makeDefaultProject();
      save(ic);
      return;
    }
    try (FileInputStream is = new FileInputStream(fullPath)) {
      JsonObject in = Json.createReader(is).readObject();
      JsonArray projectsJSON = in.getJsonArray("projects");
      for (JsonObject projJSON : projectsJSON.getValuesAs(JsonObject.class)) {
        Project proj = createProject(projJSON.getString("name"));
        if (projJSON.containsKey("current")) {
          if (projJSON.getBoolean("current")) {
            setCurrentProject(proj);
          }
        }
        if (!projJSON.containsKey("dataProviders")) {
          continue;
        }
        if (projJSON.containsKey("currentProvider")) {
          proj.setCurrent(projJSON.getString("currentProvider"));
        }
        for (JsonObject provJSON : projJSON.getJsonArray("dataProviders").getValuesAs(JsonObject.class)) {
          proj.addProvider(provJSON.getString("name"), provJSON);
        }
      }
    } catch (Exception e) {
      // FortifyIssueSuppression Log Forging
      // This path name comes from our own code only
      LOGGER.severe(
        "Problem reading" + " " + fullPath + ": " + e.getMessage()
      );
    }
    if (currentProject == null) {
      setCurrentProjectByUser(ic, projects.values().iterator().next());
    }
    return;
  }

  public JsonObject getShoppingCartStatus(InvocationContext ic) {
    String state;
    if (!getCurrentLiveProvider().supportsShoppingCart()) {
      state = "off";
    } else if (getCurrentLiveProvider().isShoppingCartEmpty()) {
      state = "empty";
    } else {
      state = "full";
    }
    return Json.createObjectBuilder()
      .add("state", state)
      .add("resourceData", "/api/shoppingcart")
      .build();
  }

  public JsonObject getProviderStatus(InvocationContext ic) {
    JsonObjectBuilder builder = Json.createObjectBuilder();
    Project proj = getCurrentProject();
    Provider liveProvider = getCurrentLiveProvider();
    String[] neededKeys = new String[] {
      "name", "lastRootUsed", "label", "insecure", "messages", "state", "roots"
    };
    JsonObject liveProviderJSON = liveProvider.toJSON(ic);

    JsonObjectBuilder currentBuilder = Json.createObjectBuilder();
    for (String key : neededKeys) {
      if (liveProviderJSON.containsKey(key)) {
        currentBuilder.add(key, liveProviderJSON.get(key));
      }
    }
    builder.add("current", currentBuilder);

    JsonArrayBuilder providersBuilder = Json.createArrayBuilder();
    ArrayList<ConfiguredProvider> showList = new ArrayList<>();
    if (!dontSortByLastUsed) {
      for (ConfiguredProvider walk : proj.getProviders()) {
        if (walk.getName().equals(liveProvider.getName())) {
          continue;
        }
        if (walk.getLastUsed() != 0) {
          boolean found = false;
          for (int i = 0; i < showList.size(); i++) {
            if (walk.getLastUsed() > showList.get(i).getLastUsed()) {
              found = true;
              showList.add(i, walk);
              break;
            }
          }
          if (!found) {
            showList.add(walk);
          }
        }
        if (showList.size() == 10) {
          break;
        }
      }
    }
    // If we run out of recents, just take the rest up to 10
    if (showList.size() < 10) {
      for (ConfiguredProvider walk : proj.getProviders()) {
        if (walk.getName().equals(liveProvider.getName())) {
          continue;
        }
        if (showList.contains(walk)) {
          continue;
        }
        showList.add(walk);
        if (showList.size() == 10) {
          break;
        }
      }
    }
    for (ConfiguredProvider walk : showList) {
      providersBuilder.add(Json.createObjectBuilder()
        .add("resourceData", "/api/project/data"
          + "/" + proj.getName()
          + "/" + walk.getName() + "?param=switch")
        .add("label", walk.getName()));
    }
    builder.add("providers", providersBuilder);
    return builder.build();
  }

  public static class Project {
    private String name;
    private String current;
    private Map<String, ConfiguredProvider> providers = new LinkedHashMap<>();

    private Project(String name) {
      this.name = name;
      if (defaultProviderJSON != null) {
        addProvider(defaultProviderJSON);
      }
    }

    private void terminate() {
      for (ConfiguredProvider prov : providers.values()) {
        prov.terminate();
      }
    }

    public void getJSONForPersistence(
      ProjectManager projectManager,
      InvocationContext ic,
      JsonObjectBuilder builder,
      boolean storePasswords) {
      JsonArrayBuilder providersBuilder = Json.createArrayBuilder();
      for (ConfiguredProvider prov : providers.values()) {
        JsonObjectBuilder provBuilder = Json.createObjectBuilder();
        JsonObject json = prov.getJSON();
        // Transient is set for the hosted default provider.  We don't
        // persist it.
        if (json.containsKey("transient") && !json.getBoolean("transient")) {
          continue;
        }
        for (String key : json.keySet()) {
          if (key.equals("password")) {
            if (json.containsKey("passwordEncrypted")
              && (json.getString("passwordEncrypted").length() > 0)) {
              continue;
            }
            if (EncryptDecrypt.isEnabled()) {
              String passwordEncrypted =
                EncryptDecrypt.encrypt(json.getString(key),
                  new EncryptionListener(projectManager, ic));
              if ((passwordEncrypted != null)
                && !"false".equals(System.getProperty(
                  "weblogic.remoteconsole.credentials.storage"))) {
                prov.setJSON(Json.createObjectBuilder(json)
                  .add("passwordEncrypted", passwordEncrypted).build());
                if (storePasswords) {
                  provBuilder.add("passwordEncrypted", passwordEncrypted);
                }
              }
            }
            continue;
          }
          JsonValue value = json.get(key);
          if (value.getValueType() == JsonValue.ValueType.STRING
            && json.getString(key).equals("")) {
            continue;
          }
          if (storePasswords || !key.equals("passwordEncrypted")) {
            provBuilder.add(key, json.get(key));
          }
        }
        providersBuilder.add(provBuilder);
      }
      builder.add("dataProviders", providersBuilder);
      builder.add("name", name);
      if (current != null) {
        builder.add("currentProvider", current);
      }
    }

    private void setCurrent(String name) {
      current = name;
    }

    public String getCurrent() {
      return current;
    }

    public String getName() {
      return name;
    }

    public void moveUpProvider(String name) {
      Map<String, ConfiguredProvider> holdProviders = providers;
      if (!holdProviders.containsKey(name)) {
        return;
      }
      providers = new LinkedHashMap<>();
      String prevName = null;
      for (String walkName : holdProviders.keySet()) {
        if (walkName.equals(name)) {
          // If the move up is first, just put everything back
          if (prevName == null) {
            providers = holdProviders;
            return;
          }
          break;
        }
        prevName = walkName;
      }
      for (String walkName : holdProviders.keySet()) {
        if (prevName.equals(walkName)) {
          providers.put(name, holdProviders.get(name));
        }
        if (!walkName.equals(name)) {
          providers.put(walkName, holdProviders.get(walkName));
        }
      }
    }

    public void moveDownProvider(String name) {
      Map<String, ConfiguredProvider> holdProviders = providers;
      if (!holdProviders.containsKey(name)) {
        return;
      }
      providers = new LinkedHashMap<>();
      boolean putNext = false;
      for (String walkName : holdProviders.keySet()) {
        if (name.equals(walkName)) {
          putNext = true;
        } else {
          providers.put(walkName, holdProviders.get(walkName));
          if (putNext) {
            providers.put(name, holdProviders.get(name));
            putNext = false;
          }
        }
      }
      // This will happen if we get a move down on the last entry
      if (putNext) {
        providers.put(name, holdProviders.get(name));
      }
    }

    public void deleteProvider(String name) {

      ConfiguredProvider prov = providers.remove(name);
      if (prov != null) {
        prov.terminate();
      }
    }

    public void addProvider(String name, JsonObject json) {
      if (providers.containsKey(name)) {
        throw new WebApplicationException(Response.status(
          Status.BAD_REQUEST.getStatusCode(),
            "A provider name must be unique and " + name + " is duplicated"
        ).build());
      }
      if (RemoteConsoleResource.isReserved(name)
        || name.equals("-current-") || name.equals("-project-")) {
        throw new WebApplicationException(Response.status(
          Status.BAD_REQUEST.getStatusCode(),
            "This name is reserved and cannot be used: " + name
        ).build());
      }
      providers.put(name, new ConfiguredProvider(name, json));
    }

    public void addProvider(JsonObject json) {
      if (json.containsKey("name")) {
        addProvider(json.getString("name"), json);
        return;
      }
    }

    public ConfiguredProvider getProvider(String name) {
      return providers.get(name);
    }

    public Collection<String> getNames() {
      return providers.keySet();
    }

    public Collection<ConfiguredProvider> getProviders() {
      return providers.values();
    }
  }

  private static class EncryptionListener implements EncryptDecrypt.Listener {
    private ProjectManager projectManager;
    private InvocationContext ic;

    EncryptionListener(ProjectManager projectManager, InvocationContext ic) {
      this.projectManager = projectManager;
      this.ic = ic;
    }

    public void encrypted(String unencrypted, String encrypted) {
      projectManager.save(ic);
    }
  }

  public static interface ProviderInfoGenerator {
    JsonObject generate(InvocationContext ic);
  }
}
