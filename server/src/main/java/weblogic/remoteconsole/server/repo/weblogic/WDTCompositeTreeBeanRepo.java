// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import java.io.Writer;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.yaml.snakeyaml.Yaml;
import weblogic.remoteconsole.common.repodef.BeanChildDef;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.WebLogicMBeansVersion;
import weblogic.remoteconsole.server.repo.BeanReaderRepo;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchBuilder;
import weblogic.remoteconsole.server.repo.DownloadBeanRepo;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.webapp.FailedRequestException;

/**
 * WDT model based implementation of a BeanRepo that implements BeanReaderRepo
 * and combines an order list of models into a single composite view.
 */
public class WDTCompositeTreeBeanRepo extends WDTCompositeBeanRepo implements BeanReaderRepo, DownloadBeanRepo {
  private static final Logger LOGGER = Logger.getLogger(WDTCompositeTreeBeanRepo.class.getName());
  private static final String DOMAIN = "Domain";

  // The resulting bean tree from the parsed models
  private BeanTree beanTree = null;

  public WDTCompositeTreeBeanRepo(
    WebLogicMBeansVersion mbeansVersion,
    List<Map<String, Object>> models,
    InvocationContext ic
  ) {
    super(mbeansVersion);

    // Setup the bean tree from the ordered list of supplied models...
    if ((models != null) && !models.isEmpty()) {
      LOGGER.fine("WDT: WDTCompositeTreeBeanRepo create from " + models.size() + " model(s)");
      BeanChildDef rootChildDef = getBeanRepoDef().getRootTypeDef().getChildDef(new Path(DOMAIN));

      // Go through each model, after the initial bean tree is created the additional
      // models are merged into that single tree to create a composite view...
      for (Map<String,Object> model : models) {
        BeanTreeBuilder builder;
        if (beanTree == null) {
          builder = new BeanTreeBuilder(model, this, rootChildDef, ic.getLocalizer());
        } else {
          builder = new BeanTreeBuilder(beanTree, model, ic.getLocalizer());
        }
        builder.addModelSections();

        // Build the bean tree and apply the WDT delete operator if used from within the
        // model fragment, any exception during the build results in a failed request!
        try {
          builder.setWDTDeleteApplied();
          beanTree = builder.build();
          LOGGER.fine("WDT: WDTCompositeTreeBeanRepo created from model: " + beanTree.getWDTModels().size());
        } catch (Exception exc) {
          throw new FailedRequestException(exc.getMessage());
        }
      }

      // Only fall through to dump the tree when log level is correct to avoid Map dump overhead!
      if (LOGGER.isLoggable(Level.FINEST)) {
        BeanTreeEntry beanTreeEntry = beanTree.getDomain();
        LOGGER.finest("WDT: WDTCompositeTreeBeanRepo Tree - " + beanTreeEntry.getBeanTreePath() + ":" + beanTree);
      }

      // The bean tree forming the composite view is ready...
      LOGGER.fine("WDT: WDTCompositeTreeBeanRepo merged bean tree built");

      // Attempt to resolve the unresolved references inside the bean tree...
      LOGGER.fine("WDT: WDTCompositeTreeBeanRepo attempt reference resolution");
      beanTree.resolveReferences();

      // Complete the bean tree by filling in the required singletons and collections...
      LOGGER.fine("WDT: WDTCompositeTreeBeanRepo complete bean tree with required entries not in the model");
      beanTree.completeRequiredBeanTreeEntries();

      // Done.
      LOGGER.fine("WDT: WDTCompositeTreeBeanRepo completed");
    }
  }

  /**
   * Create the model on-demand from the current model content.
   */
  @Override
  public Map<String, Object> getContent(InvocationContext ic) {
    Map<String, Object> result = null;
    if (beanTree != null) {
      try {
        WDTModelBuilder builder = new WDTModelBuilder(beanTree, ic.getLocalizer());
        result = builder.build();
      } catch (Exception exc) {
        String msg = exc.toString();
        LOGGER.log(Level.SEVERE, "WDT: WDTCompositeTreeBeanRepo getting model from BeanTree: " + msg, exc);
        throw new FailedRequestException(msg);
      }
    }
    return result;
  }

  /**
   * Handle download for the DownloadBeanRepo by outputting the current model content in YAML format
   */
  @Override
  public void download(Writer writer, InvocationContext ic) {
    if (beanTree != null) {
      try {
        Yaml emitter = WDTModelRepresenter.getYamlEmitter();
        emitter.dump(getContent(ic), writer);
      } catch (Exception exc) {
        String msg = exc.toString();
        LOGGER.log(Level.SEVERE, "WDT: WDTCompositeTreeBeanRepo downloading BeanTree: " + msg, exc);
        throw new FailedRequestException(msg);
      }
    }
  }

  /**
   * Handle read for the BeanReaderRepo by returning a BeanReaderRepoSearchBuilder backed by the composite bean tree
   */
  @Override  
  public BeanReaderRepoSearchBuilder createSearchBuilder(InvocationContext ic, boolean includeIsSet) {
    LOGGER.fine("WDT: WDTCompositeTreeBeanRepo createSearchBuilder() "
                 + ic.getBeanTreePath()
                 + " - includeSet: " + includeIsSet);
    return new WDTBeanRepoSearchBuilder(beanTree, includeIsSet, ic.getLocalizer());
  }
}
