// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import java.util.logging.Logger;
import java.util.regex.Pattern;

import org.yaml.snakeyaml.DumperOptions;
import org.yaml.snakeyaml.Yaml;
import org.yaml.snakeyaml.nodes.Node;
import org.yaml.snakeyaml.nodes.ScalarNode;
import org.yaml.snakeyaml.nodes.SequenceNode;
import org.yaml.snakeyaml.nodes.Tag;
import org.yaml.snakeyaml.representer.Representer;

/**
 * The WDTModelRepresenter is used to customize the snakeyaml output
 * based on WDT parser requirements.
 */
public class WDTModelRepresenter {
  private static final Logger LOGGER = Logger.getLogger(WDTModelRepresenter.class.getName());

  // Characters that require the String to be quoted in the WDT model
  private static final String STRINGS_QUOTED_REGEX = "[`&%#,@:\\-\\=\\!\\?\\*\\<\\>\\[\\]\\{\\}]";

  /**
   * Obtain an instance of the YAML emitter for outputing the WDT model using snakeyaml
   */
  public static Yaml getYamlEmitter() {
    // Setup the snakeyaml dump options for the model file...
    DumperOptions options = new DumperOptions();
    options.setIndent(4);
    options.setSplitLines(false);
    options.setPrettyFlow(true);
    options.setDefaultFlowStyle(DumperOptions.FlowStyle.BLOCK);

    // Create the snakeyaml Representer to address YAML syntax for the WDT parser...
    Representer representer = new CustomRepresenter(options);

    // Return the YAML emitter that will output the WDT model...
    return new Yaml(representer, options);
  }

  /**
   * Custom snakeyaml Representer for WDT model output
   */
  private static class CustomRepresenter extends Representer {

    // Compiled regex pattern for specical string characters
    private Pattern stringsPattern;

    /**
     * Create the Representer instance and compile regex patterns
     */
    private CustomRepresenter(DumperOptions options) {
      super(options);
      stringsPattern = Pattern.compile(STRINGS_QUOTED_REGEX);
      LOGGER.fine("WDTModelRepresenter - Default " + options.getDefaultScalarStyle());
    }

    /**
     * Wrapper for the snakeyaml function which converts the scalar representation
     * to a Node. The job of the wrapper is to perform checks on specific scalar
     * types so the resulting YAML output is acceptable for use with the WDT parser.
     */
    protected Node representScalar(Tag tag, String value, DumperOptions.ScalarStyle style) {

      // Call the base class to get the Node...
      Node node = super.representScalar(tag, value, style);

      // IFF the Node is for a String or NULL, then perform additional checks/updates...
      if (node instanceof ScalarNode) {
        ScalarNode n = (ScalarNode) node;
        Tag nodeTag = n.getTag();
        String nodeValue = n.getValue();

        // Represent the NULL as an empty string in the model file...
        if (nodeTag == Tag.NULL) {
          node = new ScalarNode(
                   nodeTag,                         // Copy the Tag
                   "",                              // Use empty String as the value
                   n.getStartMark(),                // Copy the start Mark
                   n.getEndMark(),                  // Copy the end Mark
                   DumperOptions.ScalarStyle.PLAIN  // Use plain styling
                 );

        // Represent a String with special chars as needing quotes in model file...
        } else if ((nodeTag == Tag.STR) && (nodeValue != null) && stringsPattern.matcher(nodeValue).find()) {
          node = new ScalarNode(
                   nodeTag,                                 // Copy the Tag
                   nodeValue,                               // Copy the value
                   n.getStartMark(),                        // Copy the start Mark
                   n.getEndMark(),                          // Copy the end Mark
                   DumperOptions.ScalarStyle.SINGLE_QUOTED  // Use single quotes for the style
                 );
        }
      }
      return node;
    }

    /**
     * Wrapper for the snakeyaml function which converts a sequence into a Node
     * where the FlowStyle is set to prevent using a YAML block type list.
     */
    protected Node representSequence(Tag tag, Iterable<?> sequence, DumperOptions.FlowStyle flowStyle) {

      // Call the base class to get the Node...
      Node node = super.representSequence(tag, sequence, flowStyle);

      // Set the style and return...
      if (node instanceof SequenceNode) {
        SequenceNode n = (SequenceNode) node;
        n.setFlowStyle(DumperOptions.FlowStyle.FLOW);
      }
      return node;
    }
  }
}
