// Copyright (c) 2021, 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.weblogic;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.jar.JarFile;
import java.util.logging.Logger;
import java.util.zip.ZipEntry;

import weblogic.remoteconsole.common.YamlUtils;
import weblogic.remoteconsole.common.repodef.BeanRepoDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.CreateFormPagePath;
import weblogic.remoteconsole.common.repodef.PagePath;
import weblogic.remoteconsole.common.repodef.SlicePagePath;
import weblogic.remoteconsole.common.repodef.TablePagePath;
import weblogic.remoteconsole.common.repodef.schema.BeanTypeDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.BeanTypeDefSource;
import weblogic.remoteconsole.common.repodef.schema.CreateFormDefSource;
import weblogic.remoteconsole.common.repodef.schema.LinksDefSource;
import weblogic.remoteconsole.common.repodef.schema.NavTreeDefSource;
import weblogic.remoteconsole.common.repodef.schema.PseudoBeanTypeDefSource;
import weblogic.remoteconsole.common.repodef.schema.SliceFormDefSource;
import weblogic.remoteconsole.common.repodef.schema.SliceTableDefSource;
import weblogic.remoteconsole.common.repodef.schema.SlicesDefSource;
import weblogic.remoteconsole.common.repodef.schema.TableDefSource;
import weblogic.remoteconsole.common.repodef.schema.YamlSource;
import weblogic.remoteconsole.common.repodef.yaml.SlicesDefImpl;
import weblogic.remoteconsole.common.repodef.yaml.YamlDirectoryReader;
import weblogic.remoteconsole.common.repodef.yaml.YamlReader;
import weblogic.remoteconsole.common.utils.RemoteConsoleExtension;
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.common.utils.WebLogicMBeansVersion;

/**
 * Utility class for reading yaml files describing the pages
 * and types for a WebLogic version.
 * 
 * It searches for them in directly in the webapp and
 * in harvestedWeblogicBeanTypes/<weblogic version>.
 * 
 * It's also creates them on-the-fly (in memory) for types
 * that aggregate runtime mbeans across running servers.
 * That is, it makes the aggregated runtime mbeans look like
 * real mbean types even though they aren't in WebLogic.
 */
class WebLogicYamlReader extends YamlReader {
  private List<YamlDirectoryReader> typeCustomizationYamlDirectoryReaders = new ArrayList<>();
  private List<YamlDirectoryReader> typeYamlDirectoryReaders = new ArrayList<>();

  private static final Logger LOGGER = Logger.getLogger(WebLogicYamlReader.class.getName());

  WebLogicYamlReader(WebLogicMBeansVersion mbeansVersion) {
    // Search the builtin harvested yamls first
    String harvestedDir = "harvestedWeblogicBeanTypes" + "/" + mbeansVersion.getWebLogicVersion().getDomainVersion();
    typeYamlDirectoryReaders.add(new YamlClasspathDirectoryReader(harvestedDir, false));
    // Then search the builtin hand coded yamls
    YamlDirectoryReader builtinHandCodedYamlDirectoryReader = new YamlClasspathDirectoryReader("", false);
    typeCustomizationYamlDirectoryReaders.add(builtinHandCodedYamlDirectoryReader);
    typeYamlDirectoryReaders.add(builtinHandCodedYamlDirectoryReader);
    // Then search the hand coded extension yamls that were added to the WRC
    List<YamlDirectoryReader> extensionDirectoryReaders = getExtensionDirectoryReaders();
    typeCustomizationYamlDirectoryReaders.addAll(extensionDirectoryReaders);
    typeYamlDirectoryReaders.addAll(extensionDirectoryReaders);
    // Finally search the hand coded extension names from the domain:
    List<RemoteConsoleExtension> extensions = mbeansVersion.getExtensions();
    if (extensions != null) {
      for (RemoteConsoleExtension extension : extensions) {
        JarFile jarFile = extension.getJarFile();
        if (jarFile != null) {
          YamlDirectoryReader reader = new YamlJarFileDirectoryReader(jarFile, true);
          typeCustomizationYamlDirectoryReaders.add(reader);
          typeYamlDirectoryReaders.add(reader);
        }
      }
    }
  }

  private List<YamlDirectoryReader> getExtensionDirectoryReaders() {
    List<YamlDirectoryReader> readers = new ArrayList<>();
    String extensionDirs = System.getProperty("console.extensionDirectories");
    if (!StringUtils.isEmpty(extensionDirs)) {
      for (String extensionDir : extensionDirs.split(",")) {
        if ("true".equals(System.getenv("debugYaml"))) {
          // FortifyIssueSuppression Log Forging
          // extensionDir is configured by the end user and is not a forging risk.
          LOGGER.info("Extension directory " + extensionDir);
        }
        // FortifyIssueSuppression Log Forging
        // extensionDir is configured by the end user and is not a forging risk.
        LOGGER.fine("Extension directory " + extensionDir);
        readers.add(new YamlFileDirectoryReader(extensionDir, true));
      }
    }
    return readers;
  }

  @Override
  protected List<YamlDirectoryReader> getTypeYamlDirectoryReaders() {
    return typeYamlDirectoryReaders;
  }

  @Override
  protected List<YamlDirectoryReader> getTypeCustomizationYamlDirectoryReaders() {
    return typeCustomizationYamlDirectoryReaders;
  }

  @Override
  public BeanTypeDefSource getBeanTypeDefSource(BeanRepoDef repoDef, String type) {
    return getTypeYamlReader(type).getBeanTypeDefSource(repoDef, type);
  }

  BeanTypeDefSource getDefaultBeanTypeDefSource(BeanRepoDef repoDef, String type) {
    return super.getBeanTypeDefSource(repoDef, type);
  }

  @Override
  public PseudoBeanTypeDefSource getPseudoBeanTypeDefSource(BeanRepoDef repoDef, String type) {
    return getTypeYamlReader(type).getPseudoBeanTypeDefSource(repoDef, type);
  }

  PseudoBeanTypeDefSource getDefaultPseudoBeanTypeDefSource(BeanRepoDef repoDef, String type) {
    return super.getPseudoBeanTypeDefSource(repoDef, type);
  }

  @Override
  public BeanTypeDefCustomizerSource getBeanTypeDefCustomizerSource(BeanTypeDef typeDef) {
    return getTypeYamlReader(typeDef).getBeanTypeDefCustomizerSource(typeDef);
  }

  BeanTypeDefCustomizerSource getDefaultBeanTypeDefCustomizerSource(BeanTypeDef typeDef) {
    return super.getBeanTypeDefCustomizerSource(typeDef);
  }

  @Override
  public SliceFormDefSource getSliceFormDefSource(SlicePagePath pagePath, SlicesDefImpl slicesDefImpl) {
    return getTypeYamlReader(pagePath).getSliceFormDefSource(pagePath, slicesDefImpl);
  }

  SliceFormDefSource getDefaultSliceFormDefSource(SlicePagePath pagePath, SlicesDefImpl slicesDefImpl) {
    return super.getSliceFormDefSource(pagePath, slicesDefImpl);
  }

  @Override
  public SliceTableDefSource getSliceTableDefSource(SlicePagePath pagePath, SlicesDefImpl slicesDefImpl) {
    return getTypeYamlReader(pagePath).getSliceTableDefSource(pagePath, slicesDefImpl);
  }

  SliceTableDefSource getDefaultSliceTableDefSource(SlicePagePath pagePath, SlicesDefImpl slicesDefImpl) {
    return super.getSliceTableDefSource(pagePath, slicesDefImpl);
  }

  @Override
  public CreateFormDefSource getCreateFormDefSource(CreateFormPagePath pagePath) {
    return getTypeYamlReader(pagePath).getCreateFormDefSource(pagePath);
  }

  CreateFormDefSource getDefaultCreateFormDefSource(CreateFormPagePath pagePath) {
    return super.getCreateFormDefSource(pagePath);
  }

  @Override
  public TableDefSource getTableDefSource(TablePagePath pagePath) {
    return getTypeYamlReader(pagePath).getTableDefSource(pagePath);
  }

  TableDefSource getDefaultTableDefSource(TablePagePath pagePath) {
    return super.getTableDefSource(pagePath);
  }

  @Override
  public SlicesDefSource getSlicesDefSource(BeanTypeDef typeDef) {
    return getTypeYamlReader(typeDef).getSlicesDefSource(typeDef);
  }

  SlicesDefSource getDefaultSlicesDefSource(BeanTypeDef typeDef) {
    return super.getSlicesDefSource(typeDef);
  }

  @Override
  public NavTreeDefSource getNavTreeDefSource(String type) {
    return getTypeYamlReader(type).getNavTreeDefSource(type);
  }

  NavTreeDefSource getDefaultNavTreeDefSource(String type) {
    return super.getNavTreeDefSource(type);
  }

  @Override
  public LinksDefSource getLinksDefSource(BeanTypeDef typeDef) {
    return getTypeYamlReader(typeDef).getLinksDefSource(typeDef);
  }

  LinksDefSource getDefaultLinksDefSource(BeanTypeDef typeDef) {
    return super.getLinksDefSource(typeDef);
  }

  private WebLogicBeanTypeYamlReader getTypeYamlReader(PagePath pagePath) {
    return getTypeYamlReader(pagePath.getPagesPath().getTypeDef());
  }

  private WebLogicBeanTypeYamlReader getTypeYamlReader(BeanTypeDef typeDef) {
    return getTypeYamlReader(typeDef.getTypeName());
  }

  private WebLogicBeanTypeYamlReader getTypeYamlReader(String type) {
    return WebLogicBeanTypeYamlReader.getTypeYamlReader(this, type);
  }

  private abstract static class YamlDirectoryReaderImpl implements YamlDirectoryReader {
    private String directory;
    private boolean extension;
  
    protected YamlDirectoryReaderImpl(String directory, boolean extension) {
      this.directory = directory;
      this.extension = extension;
    }

    @Override
    public <T extends YamlSource> T readYaml(String relativeYamlPath, Class<T> type, boolean mustExist) {
      T rtn = readYamlInternal(YamlReader.getYamlPath(directory, relativeYamlPath), type, mustExist);
      if (rtn != null && extension) {
        rtn.validateExtension(relativeYamlPath);
      }
      return rtn;
    }

    protected abstract <T extends YamlSource> T readYamlInternal(String yamlPath, Class<T> type, boolean mustExist);
  }

  private static class YamlClasspathDirectoryReader extends YamlDirectoryReaderImpl {
    private YamlClasspathDirectoryReader(String directory, boolean extension) {
      super(directory, extension);
    }

    @Override
    public <T extends YamlSource> T readYamlInternal(String yamlPath, Class<T> type, boolean mustExist) {
      return YamlUtils.readResource(yamlPath, type, mustExist);
    }
  }

  private static class YamlFileDirectoryReader extends YamlDirectoryReaderImpl {
    private YamlFileDirectoryReader(String directory, boolean extension) {
      super(directory, extension);
    }

    @Override
    protected <T extends YamlSource> T readYamlInternal(String yamlPath, Class<T> type, boolean mustExist) {
      return YamlUtils.readFile(yamlPath, type, mustExist);
    }
  }

  private static class YamlJarFileDirectoryReader implements YamlDirectoryReader {
    private JarFile jarFile;
    boolean extension;
  
    private YamlJarFileDirectoryReader(JarFile jarFile, boolean extension) {
      this.jarFile = jarFile;
      this.extension = true;
    }

    @Override
    public <T extends YamlSource> T readYaml(String relativeYamlPath, Class<T> type, boolean mustExist) {
      ZipEntry entry = jarFile.getEntry(relativeYamlPath);
      if (entry != null) {
        try (InputStream is = jarFile.getInputStream(entry)) {
          T rtn = YamlUtils.read(is, relativeYamlPath, type, mustExist);
          if (rtn != null && extension) {
            rtn.validateExtension(relativeYamlPath);
          }
          return rtn;
        } catch (IOException e) {
          // TBD log the problem?
        }
      }
      return null;
    }
  }
}
