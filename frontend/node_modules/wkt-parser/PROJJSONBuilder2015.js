import PROJJSONBuilderBase from './PROJJSONBuilderBase.js';

class PROJJSONBuilder2015 extends PROJJSONBuilderBase {
  static convert(node, result = {}) {
    super.convert(node, result);

    // Skip `CS` and `USAGE` nodes for WKT2-2015
    if (result.coordinate_system && result.coordinate_system.subtype === 'Cartesian') {
      delete result.coordinate_system;
    }
    if (result.usage) {
      delete result.usage;
    }

    return result;
  }
}

export default PROJJSONBuilder2015;