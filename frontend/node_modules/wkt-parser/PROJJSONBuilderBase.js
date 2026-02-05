class PROJJSONBuilderBase {
  static getId(node) {
    const idNode = node.find((child) => Array.isArray(child) && child[0] === 'ID');
    if (idNode && idNode.length >= 3) {
      return {
        authority: idNode[1],
        code: parseInt(idNode[2], 10),
      };
    }
    return null;
  }

  static convertUnit(node, type = 'unit') {
    if (!node || node.length < 3) {
      return { type, name: 'unknown', conversion_factor: null };
    }

    const name = node[1];
    const conversionFactor = parseFloat(node[2]) || null;

    const idNode = node.find((child) => Array.isArray(child) && child[0] === 'ID');
    const id = idNode
      ? {
        authority: idNode[1],
        code: parseInt(idNode[2], 10),
      }
      : null;

    return {
      type,
      name,
      conversion_factor: conversionFactor,
      id,
    };
  }

  static convertAxis(node) {
    const name = node[1] || 'Unknown';

    // Determine the direction
    let direction;
    const abbreviationMatch = name.match(/^\((.)\)$/); // Match abbreviations like "(E)" or "(N)"
    if (abbreviationMatch) {
      // Use the abbreviation to determine the direction
      const abbreviation = abbreviationMatch[1].toUpperCase();
      if (abbreviation === 'E') direction = 'east';
      else if (abbreviation === 'N') direction = 'north';
      else if (abbreviation === 'U') direction = 'up';
      else throw new Error(`Unknown axis abbreviation: ${abbreviation}`);
    } else {
      // Use the explicit direction provided in the AXIS node
      direction = node[2] ? node[2].toLowerCase() : 'unknown';
    }

    const orderNode = node.find((child) => Array.isArray(child) && child[0] === 'ORDER');
    const order = orderNode ? parseInt(orderNode[1], 10) : null;

    const unitNode = node.find(
      (child) =>
        Array.isArray(child) &&
        (child[0] === 'LENGTHUNIT' || child[0] === 'ANGLEUNIT' || child[0] === 'SCALEUNIT')
    );
    const unit = this.convertUnit(unitNode);

    return {
      name,
      direction, // Use the valid PROJJSON direction value
      unit,
      order,
    };
  }

  static extractAxes(node) {
    return node
      .filter((child) => Array.isArray(child) && child[0] === 'AXIS')
      .map((axis) => this.convertAxis(axis))
      .sort((a, b) => (a.order || 0) - (b.order || 0)); // Sort by the "order" property
  }

  static convert(node, result = {}) {

    switch (node[0]) {
      case 'PROJCRS':
        result.type = 'ProjectedCRS';
        result.name = node[1];
        result.base_crs = node.find((child) => Array.isArray(child) && child[0] === 'BASEGEOGCRS')
          ? this.convert(node.find((child) => Array.isArray(child) && child[0] === 'BASEGEOGCRS'))
          : null;
        result.conversion = node.find((child) => Array.isArray(child) && child[0] === 'CONVERSION')
          ? this.convert(node.find((child) => Array.isArray(child) && child[0] === 'CONVERSION'))
          : null;

        const csNode = node.find((child) => Array.isArray(child) && child[0] === 'CS');
        if (csNode) {
          result.coordinate_system = {
            type: csNode[1],
            axis: this.extractAxes(node),
          };
        }

        const lengthUnitNode = node.find((child) => Array.isArray(child) && child[0] === 'LENGTHUNIT');
        if (lengthUnitNode) {
          const unit = this.convertUnit(lengthUnitNode);
          result.coordinate_system.unit = unit; // Add unit to coordinate_system
        }

        result.id = this.getId(node);
        break;

      case 'BASEGEOGCRS':
      case 'GEOGCRS':
        result.type = 'GeographicCRS';
        result.name = node[1];
      
        // Handle DATUM or ENSEMBLE
        const datumOrEnsembleNode = node.find(
          (child) => Array.isArray(child) && (child[0] === 'DATUM' || child[0] === 'ENSEMBLE')
        );
        if (datumOrEnsembleNode) {
          const datumOrEnsemble = this.convert(datumOrEnsembleNode);
          if (datumOrEnsembleNode[0] === 'ENSEMBLE') {
            result.datum_ensemble = datumOrEnsemble;
          } else {
            result.datum = datumOrEnsemble;
          }
          const primem = node.find((child) => Array.isArray(child) && child[0] === 'PRIMEM');
          if (primem && primem[1] !== 'Greenwich') {
            datumOrEnsemble.prime_meridian = {
              name: primem[1],
              longitude: parseFloat(primem[2]),
            }
          }
        }
      
        result.coordinate_system = {
          type: 'ellipsoidal',
          axis: this.extractAxes(node),
        };
      
        result.id = this.getId(node);
        break;

      case 'DATUM':
        result.type = 'GeodeticReferenceFrame';
        result.name = node[1];
        result.ellipsoid = node.find((child) => Array.isArray(child) && child[0] === 'ELLIPSOID')
          ? this.convert(node.find((child) => Array.isArray(child) && child[0] === 'ELLIPSOID'))
          : null;
        break;
      
      case 'ENSEMBLE':
        result.type = 'DatumEnsemble';
        result.name = node[1];
      
        // Extract ensemble members
        result.members = node
          .filter((child) => Array.isArray(child) && child[0] === 'MEMBER')
          .map((member) => ({
            type: 'DatumEnsembleMember',
            name: member[1],
            id: this.getId(member), // Extract ID as { authority, code }
          }));
      
        // Extract accuracy
        const accuracyNode = node.find((child) => Array.isArray(child) && child[0] === 'ENSEMBLEACCURACY');
        if (accuracyNode) {
          result.accuracy = parseFloat(accuracyNode[1]);
        }
      
        // Extract ellipsoid
        const ellipsoidNode = node.find((child) => Array.isArray(child) && child[0] === 'ELLIPSOID');
        if (ellipsoidNode) {
          result.ellipsoid = this.convert(ellipsoidNode); // Convert the ellipsoid node
        }
      
        // Extract identifier for the ensemble
        result.id = this.getId(node);
        break;

      case 'ELLIPSOID':
        result.type = 'Ellipsoid';
        result.name = node[1];
        result.semi_major_axis = parseFloat(node[2]);
        result.inverse_flattening = parseFloat(node[3]);
        const units = node.find((child) => Array.isArray(child) && child[0] === 'LENGTHUNIT')
          ? this.convert(node.find((child) => Array.isArray(child) && child[0] === 'LENGTHUNIT'), result)
          : null;
        break;

      case 'CONVERSION':
        result.type = 'Conversion';
        result.name = node[1];
        result.method = node.find((child) => Array.isArray(child) && child[0] === 'METHOD')
          ? this.convert(node.find((child) => Array.isArray(child) && child[0] === 'METHOD'))
          : null;
        result.parameters = node
          .filter((child) => Array.isArray(child) && child[0] === 'PARAMETER')
          .map((param) => this.convert(param));
        break;

      case 'METHOD':
        result.type = 'Method';
        result.name = node[1];
        result.id = this.getId(node);
        break;

      case 'PARAMETER':
        result.type = 'Parameter';
        result.name = node[1];
        result.value = parseFloat(node[2]);
        result.unit = this.convertUnit(
          node.find(
            (child) =>
              Array.isArray(child) &&
              (child[0] === 'LENGTHUNIT' || child[0] === 'ANGLEUNIT' || child[0] === 'SCALEUNIT')
          )
        );
        result.id = this.getId(node);
        break;

      case 'BOUNDCRS':
        result.type = 'BoundCRS';

        // Process SOURCECRS
        const sourceCrsNode = node.find((child) => Array.isArray(child) && child[0] === 'SOURCECRS');
        if (sourceCrsNode) {
          const sourceCrsContent = sourceCrsNode.find((child) => Array.isArray(child));
          result.source_crs = sourceCrsContent ? this.convert(sourceCrsContent) : null;
        }

        // Process TARGETCRS
        const targetCrsNode = node.find((child) => Array.isArray(child) && child[0] === 'TARGETCRS');
        if (targetCrsNode) {
          const targetCrsContent = targetCrsNode.find((child) => Array.isArray(child));
          result.target_crs = targetCrsContent ? this.convert(targetCrsContent) : null;
        }

        // Process ABRIDGEDTRANSFORMATION
        const transformationNode = node.find((child) => Array.isArray(child) && child[0] === 'ABRIDGEDTRANSFORMATION');
        if (transformationNode) {
          result.transformation = this.convert(transformationNode);
        } else {
          result.transformation = null;
        }
        break;

      case 'ABRIDGEDTRANSFORMATION':
        result.type = 'Transformation';
        result.name = node[1];
        result.method = node.find((child) => Array.isArray(child) && child[0] === 'METHOD')
          ? this.convert(node.find((child) => Array.isArray(child) && child[0] === 'METHOD'))
          : null;

        result.parameters = node
          .filter((child) => Array.isArray(child) && (child[0] === 'PARAMETER' || child[0] === 'PARAMETERFILE'))
          .map((param) => {
            if (param[0] === 'PARAMETER') {
              return this.convert(param);
            } else if (param[0] === 'PARAMETERFILE') {
              return {
                name: param[1],
                value: param[2],
                id: {
                  'authority': 'EPSG',
                  'code': 8656
                }
              };
            }
          });

        // Adjust the Scale difference parameter if present
        if (result.parameters.length === 7) {
          const scaleDifference = result.parameters[6];
          if (scaleDifference.name === 'Scale difference') {
            scaleDifference.value = Math.round((scaleDifference.value - 1) * 1e12) / 1e6;
          }
        }

        result.id = this.getId(node);
        break;
      
      case 'AXIS':
        if (!result.coordinate_system) {
          result.coordinate_system = { type: 'unspecified', axis: [] };
        }
        result.coordinate_system.axis.push(this.convertAxis(node));
        break;
      
      case 'LENGTHUNIT':
        const unit = this.convertUnit(node, 'LinearUnit');
        if (result.coordinate_system && result.coordinate_system.axis) {
          result.coordinate_system.axis.forEach((axis) => {
            if (!axis.unit) {
              axis.unit = unit;
            }
          });
        }
        if (unit.conversion_factor && unit.conversion_factor !== 1) {
          if (result.semi_major_axis) {
            result.semi_major_axis = {
              value: result.semi_major_axis,
              unit,
            }
          }
        }
        break;

      default:
        result.keyword = node[0];
        break;
    }

    return result;
  }
}

export default PROJJSONBuilderBase;