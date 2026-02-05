import PROJJSONBuilderBase from './PROJJSONBuilderBase.js';

class PROJJSONBuilder2019 extends PROJJSONBuilderBase {
  static convert(node, result = {}) {
    super.convert(node, result);

    // Handle `CS` node for WKT2-2019
    const csNode = node.find((child) => Array.isArray(child) && child[0] === 'CS');
    if (csNode) {
      result.coordinate_system = {
        subtype: csNode[1],
        axis: this.extractAxes(node),
      };
    }

    // Handle `USAGE` node for WKT2-2019
    const usageNode = node.find((child) => Array.isArray(child) && child[0] === 'USAGE');
    if (usageNode) {
      const scope = usageNode.find((child) => Array.isArray(child) && child[0] === 'SCOPE');
      const area = usageNode.find((child) => Array.isArray(child) && child[0] === 'AREA');
      const bbox = usageNode.find((child) => Array.isArray(child) && child[0] === 'BBOX');
      result.usage = {};
      if (scope) {
        result.usage.scope = scope[1];
      }
      if (area) {
        result.usage.area = area[1];
      }
      if (bbox) {
        result.usage.bbox = bbox.slice(1);
      }
    }

    return result;
  }
}

export default PROJJSONBuilder2019;