// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

/**
 * This interface describes a customizer parameter that passes in the
 * invocation context.
 * 
 * This interface describes an InvocationContext argument that needs to be
 * passed to a customizer when invoking it.
 *
 * It contains all of the information that the different parts of the backend needs
 * (e.g. english resource bundle, PDJ, RDJ).
 */
public interface InvocationContextParamDef extends ParamDef {
}
