// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.ArrayList;
import java.util.List;

/**
 * This class holds the information about WDT model tokens on a page.
 */
public class ModelTokens {
  private List<Option> options = new ArrayList<>();
  private List<OptionsSource> optionsSources = new ArrayList<>();

  public List<Option> getOptions() {
    return options;
  }

  public List<OptionsSource> getOptionsSources() {
    return optionsSources;
  }
}
