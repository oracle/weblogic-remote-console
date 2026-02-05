import PROJJSONBuilder2015 from './PROJJSONBuilder2015.js';
import PROJJSONBuilder2019 from './PROJJSONBuilder2019.js';

/**
 * Detects the WKT2 version based on the structure of the WKT.
 * @param {Array} root The root WKT array node.
 * @returns {string} The detected version ("2015" or "2019").
 */
function detectWKT2Version(root) {
  // Check for WKT2-2019-specific nodes
  if (root.find((child) => Array.isArray(child) && child[0] === 'USAGE')) {
    return '2019'; // `USAGE` is specific to WKT2-2019
  }

  // Check for WKT2-2015-specific nodes
  if (root.find((child) => Array.isArray(child) && child[0] === 'CS')) {
    return '2015'; // `CS` is valid in both, but default to 2015 unless `USAGE` is present
  }

  if (root[0] === 'BOUNDCRS' || root[0] === 'PROJCRS' || root[0] === 'GEOGCRS') {
    return '2015'; // These are valid in both, but default to 2015
  }

  // Default to WKT2-2015 if no specific indicators are found
  return '2015';
}

/**
 * Builds a PROJJSON object from a WKT array structure.
 * @param {Array} root The root WKT array node.
 * @returns {Object} The PROJJSON object.
 */
export function buildPROJJSON(root) {
  const version = detectWKT2Version(root);
  const builder = version === '2019' ? PROJJSONBuilder2019 : PROJJSONBuilder2015;
  return builder.convert(root);
}
