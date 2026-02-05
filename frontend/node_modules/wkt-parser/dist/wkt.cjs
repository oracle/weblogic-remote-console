'use strict';

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
            };
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
        node.find((child) => Array.isArray(child) && child[0] === 'LENGTHUNIT')
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
            };
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
function buildPROJJSON(root) {
  const version = detectWKT2Version(root);
  const builder = version === '2019' ? PROJJSONBuilder2019 : PROJJSONBuilder2015;
  return builder.convert(root);
}

/**
 * Detects whether the WKT string is WKT1 or WKT2.
 * @param {string} wkt The WKT string.
 * @returns {string} The detected version ("WKT1" or "WKT2").
 */
function detectWKTVersion(wkt) {
  // Normalize the WKT string for easier keyword matching
  const normalizedWKT = wkt.toUpperCase();

  // Check for WKT2-specific keywords
  if (
    normalizedWKT.includes('PROJCRS') ||
    normalizedWKT.includes('GEOGCRS') ||
    normalizedWKT.includes('BOUNDCRS') ||
    normalizedWKT.includes('VERTCRS') ||
    normalizedWKT.includes('LENGTHUNIT') ||
    normalizedWKT.includes('ANGLEUNIT') ||
    normalizedWKT.includes('SCALEUNIT')
  ) {
    return 'WKT2';
  }

  // Check for WKT1-specific keywords
  if (
    normalizedWKT.includes('PROJCS') ||
    normalizedWKT.includes('GEOGCS') ||
    normalizedWKT.includes('LOCAL_CS') ||
    normalizedWKT.includes('VERT_CS') ||
    normalizedWKT.includes('UNIT')
  ) {
    return 'WKT1';
  }

  // Default to WKT1 if no specific indicators are found
  return 'WKT1';
}

var NEUTRAL = 1;
var KEYWORD = 2;
var NUMBER = 3;
var QUOTED = 4;
var AFTERQUOTE = 5;
var ENDED = -1;
var whitespace = /\s/;
var latin = /[A-Za-z]/;
var keyword = /[A-Za-z84_]/;
var endThings = /[,\]]/;
var digets = /[\d\.E\-\+]/;
// const ignoredChar = /[\s_\-\/\(\)]/g;
function Parser(text) {
  if (typeof text !== 'string') {
    throw new Error('not a string');
  }
  this.text = text.trim();
  this.level = 0;
  this.place = 0;
  this.root = null;
  this.stack = [];
  this.currentObject = null;
  this.state = NEUTRAL;
}
Parser.prototype.readCharicter = function() {
  var char = this.text[this.place++];
  if (this.state !== QUOTED) {
    while (whitespace.test(char)) {
      if (this.place >= this.text.length) {
        return;
      }
      char = this.text[this.place++];
    }
  }
  switch (this.state) {
    case NEUTRAL:
      return this.neutral(char);
    case KEYWORD:
      return this.keyword(char)
    case QUOTED:
      return this.quoted(char);
    case AFTERQUOTE:
      return this.afterquote(char);
    case NUMBER:
      return this.number(char);
    case ENDED:
      return;
  }
};
Parser.prototype.afterquote = function(char) {
  if (char === '"') {
    this.word += '"';
    this.state = QUOTED;
    return;
  }
  if (endThings.test(char)) {
    this.word = this.word.trim();
    this.afterItem(char);
    return;
  }
  throw new Error('havn\'t handled "' +char + '" in afterquote yet, index ' + this.place);
};
Parser.prototype.afterItem = function(char) {
  if (char === ',') {
    if (this.word !== null) {
      this.currentObject.push(this.word);
    }
    this.word = null;
    this.state = NEUTRAL;
    return;
  }
  if (char === ']') {
    this.level--;
    if (this.word !== null) {
      this.currentObject.push(this.word);
      this.word = null;
    }
    this.state = NEUTRAL;
    this.currentObject = this.stack.pop();
    if (!this.currentObject) {
      this.state = ENDED;
    }

    return;
  }
};
Parser.prototype.number = function(char) {
  if (digets.test(char)) {
    this.word += char;
    return;
  }
  if (endThings.test(char)) {
    this.word = parseFloat(this.word);
    this.afterItem(char);
    return;
  }
  throw new Error('havn\'t handled "' +char + '" in number yet, index ' + this.place);
};
Parser.prototype.quoted = function(char) {
  if (char === '"') {
    this.state = AFTERQUOTE;
    return;
  }
  this.word += char;
  return;
};
Parser.prototype.keyword = function(char) {
  if (keyword.test(char)) {
    this.word += char;
    return;
  }
  if (char === '[') {
    var newObjects = [];
    newObjects.push(this.word);
    this.level++;
    if (this.root === null) {
      this.root = newObjects;
    } else {
      this.currentObject.push(newObjects);
    }
    this.stack.push(this.currentObject);
    this.currentObject = newObjects;
    this.state = NEUTRAL;
    return;
  }
  if (endThings.test(char)) {
    this.afterItem(char);
    return;
  }
  throw new Error('havn\'t handled "' +char + '" in keyword yet, index ' + this.place);
};
Parser.prototype.neutral = function(char) {
  if (latin.test(char)) {
    this.word = char;
    this.state = KEYWORD;
    return;
  }
  if (char === '"') {
    this.word = '';
    this.state = QUOTED;
    return;
  }
  if (digets.test(char)) {
    this.word = char;
    this.state = NUMBER;
    return;
  }
  if (endThings.test(char)) {
    this.afterItem(char);
    return;
  }
  throw new Error('havn\'t handled "' +char + '" in neutral yet, index ' + this.place);
};
Parser.prototype.output = function() {
  while (this.place < this.text.length) {
    this.readCharicter();
  }
  if (this.state === ENDED) {
    return this.root;
  }
  throw new Error('unable to parse string "' +this.text + '". State is ' + this.state);
};

function parseString(txt) {
  var parser = new Parser(txt);
  return parser.output();
}

function mapit(obj, key, value) {
  if (Array.isArray(key)) {
    value.unshift(key);
    key = null;
  }
  var thing = key ? {} : obj;

  var out = value.reduce(function(newObj, item) {
    sExpr(item, newObj);
    return newObj
  }, thing);
  if (key) {
    obj[key] = out;
  }
}

function sExpr(v, obj) {
  if (!Array.isArray(v)) {
    obj[v] = true;
    return;
  }
  var key = v.shift();
  if (key === 'PARAMETER') {
    key = v.shift();
  }
  if (v.length === 1) {
    if (Array.isArray(v[0])) {
      obj[key] = {};
      sExpr(v[0], obj[key]);
      return;
    }
    obj[key] = v[0];
    return;
  }
  if (!v.length) {
    obj[key] = true;
    return;
  }
  if (key === 'TOWGS84') {
    obj[key] = v;
    return;
  }
  if (key === 'AXIS') {
    if (!(key in obj)) {
      obj[key] = [];
    }
    obj[key].push(v);
    return;
  }
  if (!Array.isArray(key)) {
    obj[key] = {};
  }

  var i;
  switch (key) {
    case 'UNIT':
    case 'PRIMEM':
    case 'VERT_DATUM':
      obj[key] = {
        name: v[0].toLowerCase(),
        convert: v[1]
      };
      if (v.length === 3) {
        sExpr(v[2], obj[key]);
      }
      return;
    case 'SPHEROID':
    case 'ELLIPSOID':
      obj[key] = {
        name: v[0],
        a: v[1],
        rf: v[2]
      };
      if (v.length === 4) {
        sExpr(v[3], obj[key]);
      }
      return;
    case 'EDATUM':
    case 'ENGINEERINGDATUM':
    case 'LOCAL_DATUM':
    case 'DATUM':
    case 'VERT_CS':
    case 'VERTCRS':
    case 'VERTICALCRS':
      v[0] = ['name', v[0]];
      mapit(obj, key, v);
      return;
    case 'COMPD_CS':
    case 'COMPOUNDCRS':
    case 'FITTED_CS':
    // the followings are the crs defined in
    // https://github.com/proj4js/proj4js/blob/1da4ed0b865d0fcb51c136090569210cdcc9019e/lib/parseCode.js#L11
    case 'PROJECTEDCRS':
    case 'PROJCRS':
    case 'GEOGCS':
    case 'GEOCCS':
    case 'PROJCS':
    case 'LOCAL_CS':
    case 'GEODCRS':
    case 'GEODETICCRS':
    case 'GEODETICDATUM':
    case 'ENGCRS':
    case 'ENGINEERINGCRS':
      v[0] = ['name', v[0]];
      mapit(obj, key, v);
      obj[key].type = key;
      return;
    default:
      i = -1;
      while (++i < v.length) {
        if (!Array.isArray(v[i])) {
          return sExpr(v, obj[key]);
        }
      }
      return mapit(obj, key, v);
  }
}

var D2R = 0.01745329251994329577;

function d2r(input) {
  return input * D2R;
}

function applyProjectionDefaults(wkt) {
  // Normalize projName for WKT2 compatibility
  const normalizedProjName = (wkt.projName || '').toLowerCase().replace(/_/g, ' ');

  if (!wkt.long0 && wkt.longc && (normalizedProjName === 'albers conic equal area' || normalizedProjName === 'lambert azimuthal equal area')) {
    wkt.long0 = wkt.longc;
  }
  if (!wkt.lat_ts && wkt.lat1 && (normalizedProjName === 'stereographic south pole' || normalizedProjName === 'polar stereographic (variant b)')) {
    wkt.lat0 = d2r(wkt.lat1 > 0 ? 90 : -90);
    wkt.lat_ts = wkt.lat1;
    delete wkt.lat1;
  } else if (!wkt.lat_ts && wkt.lat0 && (normalizedProjName === 'polar stereographic' || normalizedProjName === 'polar stereographic (variant a)')) {
    wkt.lat_ts = wkt.lat0;
    wkt.lat0 = d2r(wkt.lat0 > 0 ? 90 : -90);
    delete wkt.lat1;
  }
}

// Helper function to process units and to_meter
function processUnit(unit) {
  let result = { units: null, to_meter: undefined };

  if (typeof unit === 'string') {
    result.units = unit.toLowerCase();
    if (result.units === 'metre') {
      result.units = 'meter'; // Normalize 'metre' to 'meter'
    }
    if (result.units === 'meter') {
      result.to_meter = 1; // Only set to_meter if units are 'meter'
    }
  } else if (unit && unit.name) {
    result.units = unit.name.toLowerCase();
    if (result.units === 'metre') {
      result.units = 'meter'; // Normalize 'metre' to 'meter'
    }
    result.to_meter = unit.conversion_factor;
  }

  return result;
}

function toValue(valueOrObject) {
  if (typeof valueOrObject === 'object') {
    return valueOrObject.value * valueOrObject.unit.conversion_factor;
  }
  return valueOrObject;
}

function calculateEllipsoid(value, result) {
  if (value.ellipsoid.radius) {
    result.a = value.ellipsoid.radius;
    result.rf = 0;
  } else {
    result.a = toValue(value.ellipsoid.semi_major_axis);
    if (value.ellipsoid.inverse_flattening !== undefined) {
      result.rf = value.ellipsoid.inverse_flattening;
    } else if (value.ellipsoid.semi_major_axis !== undefined && value.ellipsoid.semi_minor_axis !== undefined) {
      result.rf = result.a / (result.a - toValue(value.ellipsoid.semi_minor_axis));
    }
  }
}

function transformPROJJSON(projjson, result = {}) {
  if (!projjson || typeof projjson !== 'object') {
    return projjson; // Return primitive values as-is
  }

  if (projjson.type === 'BoundCRS') {
    transformPROJJSON(projjson.source_crs, result);

    if (projjson.transformation) {
      if (projjson.transformation.method && projjson.transformation.method.name === 'NTv2') {
        // Set nadgrids to the filename from the parameterfile
        result.nadgrids = projjson.transformation.parameters[0].value;
      } else {
        // Populate datum_params if no parameterfile is found
        result.datum_params = projjson.transformation.parameters.map((param) => param.value);
      }
    }
    return result; // Return early for BoundCRS
  }

  // Handle specific keys in PROJJSON
  Object.keys(projjson).forEach((key) => {
    const value = projjson[key];
    if (value === null) {
      return;
    }

    switch (key) {
      case 'name':
        if (result.srsCode) {
          break;
        }
        result.name = value;
        result.srsCode = value; // Map `name` to `srsCode`
        break;

      case 'type':
        if (value === 'GeographicCRS') {
          result.projName = 'longlat';
        } else if (value === 'ProjectedCRS' && projjson.conversion && projjson.conversion.method) {
          result.projName = projjson.conversion.method.name; // Retain original capitalization
        }
        break;

      case 'datum':
      case 'datum_ensemble': // Handle both datum and ensemble
        if (value.ellipsoid) {
          // Extract ellipsoid properties
          result.ellps = value.ellipsoid.name;
          calculateEllipsoid(value, result);
        }
        if (value.prime_meridian) {
          result.from_greenwich = value.prime_meridian.longitude * Math.PI / 180; // Convert to radians
        }
        break;

      case 'ellipsoid':
        result.ellps = value.name;
        calculateEllipsoid(value, result);
        break;

      case 'prime_meridian':
        result.long0 = (value.longitude || 0) * Math.PI / 180; // Convert to radians
        break;

      case 'coordinate_system':
        if (value.axis) {
          result.axis = value.axis
            .map((axis) => {
              const direction = axis.direction;
              if (direction === 'east') return 'e';
              if (direction === 'north') return 'n';
              if (direction === 'west') return 'w';
              if (direction === 'south') return 's';
              throw new Error(`Unknown axis direction: ${direction}`);
            })
            .join('') + 'u'; // Combine into a single string (e.g., "enu")

          if (value.unit) {
            const { units, to_meter } = processUnit(value.unit);
            result.units = units;
            result.to_meter = to_meter;
          } else if (value.axis[0] && value.axis[0].unit) {
            const { units, to_meter } = processUnit(value.axis[0].unit);
            result.units = units;
            result.to_meter = to_meter;
          }
        }
        break;
        
      case 'id':
        if (value.authority && value.code) {
          result.title = value.authority + ':' + value.code;
        }
        break;

      case 'conversion':
        if (value.method && value.method.name) {
          result.projName = value.method.name; // Retain original capitalization
        }
        if (value.parameters) {
          value.parameters.forEach((param) => {
            const paramName = param.name.toLowerCase().replace(/\s+/g, '_');
            const paramValue = param.value;
            if (param.unit && param.unit.conversion_factor) {
              result[paramName] = paramValue * param.unit.conversion_factor; // Convert to radians or meters
            } else if (param.unit === 'degree') {
              result[paramName] = paramValue * Math.PI / 180; // Convert to radians
            } else {
              result[paramName] = paramValue;
            }
          });
        }
        break;

      case 'unit':
        if (value.name) {
          result.units = value.name.toLowerCase();
          if (result.units === 'metre') {
            result.units = 'meter';
          }
        }
        if (value.conversion_factor) {
          result.to_meter = value.conversion_factor;
        }
        break;

      case 'base_crs':
        transformPROJJSON(value, result); // Pass `result` directly
        result.datumCode = value.id ? value.id.authority + '_' + value.id.code : value.name; // Set datumCode
        break;
    }
  });

  // Additional calculated properties
  if (result.latitude_of_false_origin !== undefined) {
    result.lat0 = result.latitude_of_false_origin; // Already in radians
  }
  if (result.longitude_of_false_origin !== undefined) {
    result.long0 = result.longitude_of_false_origin;
  }
  if (result.latitude_of_standard_parallel !== undefined) {
    result.lat0 = result.latitude_of_standard_parallel;
    result.lat1 = result.latitude_of_standard_parallel;
  }
  if (result.latitude_of_1st_standard_parallel !== undefined) {
    result.lat1 = result.latitude_of_1st_standard_parallel;
  }
  if (result.latitude_of_2nd_standard_parallel !== undefined) {
    result.lat2 = result.latitude_of_2nd_standard_parallel; 
  }
  if (result.latitude_of_projection_centre !== undefined) {
    result.lat0 = result.latitude_of_projection_centre;
  }
  if (result.longitude_of_projection_centre !== undefined) {
    result.longc = result.longitude_of_projection_centre;
  }
  if (result.easting_at_false_origin !== undefined) {
    result.x0 = result.easting_at_false_origin;
  }
  if (result.northing_at_false_origin !== undefined) {
    result.y0 = result.northing_at_false_origin;
  }
  if (result.latitude_of_natural_origin !== undefined) {
    result.lat0 = result.latitude_of_natural_origin;
  }
  if (result.longitude_of_natural_origin !== undefined) {
    result.long0 = result.longitude_of_natural_origin;
  }
  if (result.longitude_of_origin !== undefined) {
    result.long0 = result.longitude_of_origin;
  }
  if (result.false_easting !== undefined) {
    result.x0 = result.false_easting;
  }
  if (result.easting_at_projection_centre) {
    result.x0 = result.easting_at_projection_centre;
  }
  if (result.false_northing !== undefined) {
    result.y0 = result.false_northing;
  }
  if (result.northing_at_projection_centre) {
    result.y0 = result.northing_at_projection_centre;
  }
  if (result.standard_parallel_1 !== undefined) {
    result.lat1 = result.standard_parallel_1;
  }
  if (result.standard_parallel_2 !== undefined) {
    result.lat2 = result.standard_parallel_2;
  }
  if (result.scale_factor_at_natural_origin !== undefined) {
    result.k0 = result.scale_factor_at_natural_origin;
  }
  if (result.scale_factor_at_projection_centre !== undefined) {
    result.k0 = result.scale_factor_at_projection_centre;
  }
  if (result.scale_factor_on_pseudo_standard_parallel !== undefined) {  
    result.k0 = result.scale_factor_on_pseudo_standard_parallel;
  }
  if (result.azimuth !== undefined) {
    result.alpha = result.azimuth;
  }
  if (result.azimuth_at_projection_centre !== undefined) {
    result.alpha = result.azimuth_at_projection_centre;
  }
  if (result.angle_from_rectified_to_skew_grid) {
    result.rectified_grid_angle = result.angle_from_rectified_to_skew_grid;
  }

  // Apply projection defaults
  applyProjectionDefaults(result);

  return result;
}

var knownTypes = ['PROJECTEDCRS', 'PROJCRS', 'GEOGCS', 'GEOCCS', 'PROJCS', 'LOCAL_CS', 'GEODCRS',
  'GEODETICCRS', 'GEODETICDATUM', 'ENGCRS', 'ENGINEERINGCRS'];

function rename(obj, params) {
  var outName = params[0];
  var inName = params[1];
  if (!(outName in obj) && (inName in obj)) {
    obj[outName] = obj[inName];
    if (params.length === 3) {
      obj[outName] = params[2](obj[outName]);
    }
  }
}

function cleanWKT(wkt) {
  var keys = Object.keys(wkt);
  for (var i = 0, ii = keys.length; i <ii; ++i) {
    var key = keys[i];
    // the followings are the crs defined in
    // https://github.com/proj4js/proj4js/blob/1da4ed0b865d0fcb51c136090569210cdcc9019e/lib/parseCode.js#L11
    if (knownTypes.indexOf(key) !== -1) {
      setPropertiesFromWkt(wkt[key]);
    }
    if (typeof wkt[key] === 'object') {
      cleanWKT(wkt[key]);
    }
  }
}

function setPropertiesFromWkt(wkt) {
  if (wkt.AUTHORITY) {
    var authority = Object.keys(wkt.AUTHORITY)[0];
    if (authority && authority in wkt.AUTHORITY) {
      wkt.title = authority + ':' + wkt.AUTHORITY[authority];
    }
  }
  if (wkt.type === 'GEOGCS') {
    wkt.projName = 'longlat';
  } else if (wkt.type === 'LOCAL_CS') {
    wkt.projName = 'identity';
    wkt.local = true;
  } else {
    if (typeof wkt.PROJECTION === 'object') {
      wkt.projName = Object.keys(wkt.PROJECTION)[0];
    } else {
      wkt.projName = wkt.PROJECTION;
    }
  }
  if (wkt.AXIS) {
    var axisOrder = '';
    for (var i = 0, ii = wkt.AXIS.length; i < ii; ++i) {
      var axis = [wkt.AXIS[i][0].toLowerCase(), wkt.AXIS[i][1].toLowerCase()];
      if (axis[0].indexOf('north') !== -1 || ((axis[0] === 'y' || axis[0] === 'lat') && axis[1] === 'north')) {
        axisOrder += 'n';
      } else if (axis[0].indexOf('south') !== -1 || ((axis[0] === 'y' || axis[0] === 'lat') && axis[1] === 'south')) {
        axisOrder += 's';
      } else if (axis[0].indexOf('east') !== -1 || ((axis[0] === 'x' || axis[0] === 'lon') && axis[1] === 'east')) {
        axisOrder += 'e';
      } else if (axis[0].indexOf('west') !== -1 || ((axis[0] === 'x' || axis[0] === 'lon') && axis[1] === 'west')) {
        axisOrder += 'w';
      }
    }
    if (axisOrder.length === 2) {
      axisOrder += 'u';
    }
    if (axisOrder.length === 3) {
      wkt.axis = axisOrder;
    }
  }
  if (wkt.UNIT) {
    wkt.units = wkt.UNIT.name.toLowerCase();
    if (wkt.units === 'metre') {
      wkt.units = 'meter';
    }
    if (wkt.UNIT.convert) {
      if (wkt.type === 'GEOGCS') {
        if (wkt.DATUM && wkt.DATUM.SPHEROID) {
          wkt.to_meter = wkt.UNIT.convert*wkt.DATUM.SPHEROID.a;
        }
      } else {
        wkt.to_meter = wkt.UNIT.convert;
      }
    }
  }
  var geogcs = wkt.GEOGCS;
  if (wkt.type === 'GEOGCS') {
    geogcs = wkt;
  }
  if (geogcs) {
    //if(wkt.GEOGCS.PRIMEM&&wkt.GEOGCS.PRIMEM.convert){
    //  wkt.from_greenwich=wkt.GEOGCS.PRIMEM.convert*D2R;
    //}
    if (geogcs.DATUM) {
      wkt.datumCode = geogcs.DATUM.name.toLowerCase();
    } else {
      wkt.datumCode = geogcs.name.toLowerCase();
    }
    if (wkt.datumCode.slice(0, 2) === 'd_') {
      wkt.datumCode = wkt.datumCode.slice(2);
    }
    if (wkt.datumCode === 'new_zealand_1949') {
      wkt.datumCode = 'nzgd49';
    }
    if (wkt.datumCode === 'wgs_1984' || wkt.datumCode === 'world_geodetic_system_1984') {
      if (wkt.PROJECTION === 'Mercator_Auxiliary_Sphere') {
        wkt.sphere = true;
      }
      wkt.datumCode = 'wgs84';
    }
    if (wkt.datumCode === 'belge_1972') {
      wkt.datumCode = 'rnb72';
    }
    if (geogcs.DATUM && geogcs.DATUM.SPHEROID) {
      wkt.ellps = geogcs.DATUM.SPHEROID.name.replace('_19', '').replace(/[Cc]larke\_18/, 'clrk');
      if (wkt.ellps.toLowerCase().slice(0, 13) === 'international') {
        wkt.ellps = 'intl';
      }

      wkt.a = geogcs.DATUM.SPHEROID.a;
      wkt.rf = parseFloat(geogcs.DATUM.SPHEROID.rf, 10);
    }

    if (geogcs.DATUM && geogcs.DATUM.TOWGS84) {
      wkt.datum_params = geogcs.DATUM.TOWGS84;
    }
    if (~wkt.datumCode.indexOf('osgb_1936')) {
      wkt.datumCode = 'osgb36';
    }
    if (~wkt.datumCode.indexOf('osni_1952')) {
      wkt.datumCode = 'osni52';
    }
    if (~wkt.datumCode.indexOf('tm65')
      || ~wkt.datumCode.indexOf('geodetic_datum_of_1965')) {
      wkt.datumCode = 'ire65';
    }
    if (wkt.datumCode === 'ch1903+') {
      wkt.datumCode = 'ch1903';
    }
    if (~wkt.datumCode.indexOf('israel')) {
      wkt.datumCode = 'isr93';
    }
  }
  if (wkt.b && !isFinite(wkt.b)) {
    wkt.b = wkt.a;
  }
  if (wkt.rectified_grid_angle) {
    wkt.rectified_grid_angle = d2r(wkt.rectified_grid_angle);
  }

  function toMeter(input) {
    var ratio = wkt.to_meter || 1;
    return input * ratio;
  }
  var renamer = function(a) {
    return rename(wkt, a);
  };
  var list = [
    ['standard_parallel_1', 'Standard_Parallel_1'],
    ['standard_parallel_1', 'Latitude of 1st standard parallel'],
    ['standard_parallel_2', 'Standard_Parallel_2'],
    ['standard_parallel_2', 'Latitude of 2nd standard parallel'],
    ['false_easting', 'False_Easting'],
    ['false_easting', 'False easting'],
    ['false-easting', 'Easting at false origin'],
    ['false_northing', 'False_Northing'],
    ['false_northing', 'False northing'],
    ['false_northing', 'Northing at false origin'],
    ['central_meridian', 'Central_Meridian'],
    ['central_meridian', 'Longitude of natural origin'],
    ['central_meridian', 'Longitude of false origin'],
    ['latitude_of_origin', 'Latitude_Of_Origin'],
    ['latitude_of_origin', 'Central_Parallel'],
    ['latitude_of_origin', 'Latitude of natural origin'],
    ['latitude_of_origin', 'Latitude of false origin'],
    ['scale_factor', 'Scale_Factor'],
    ['k0', 'scale_factor'],
    ['latitude_of_center', 'Latitude_Of_Center'],
    ['latitude_of_center', 'Latitude_of_center'],
    ['lat0', 'latitude_of_center', d2r],
    ['longitude_of_center', 'Longitude_Of_Center'],
    ['longitude_of_center', 'Longitude_of_center'],
    ['longc', 'longitude_of_center', d2r],
    ['x0', 'false_easting', toMeter],
    ['y0', 'false_northing', toMeter],
    ['long0', 'central_meridian', d2r],
    ['lat0', 'latitude_of_origin', d2r],
    ['lat0', 'standard_parallel_1', d2r],
    ['lat1', 'standard_parallel_1', d2r],
    ['lat2', 'standard_parallel_2', d2r],
    ['azimuth', 'Azimuth'],
    ['alpha', 'azimuth', d2r],
    ['srsCode', 'name']
  ];
  list.forEach(renamer);
  applyProjectionDefaults(wkt);
}
function index(wkt) {
  if (typeof wkt === 'object') {
    return transformPROJJSON(wkt);
  }
  const version = detectWKTVersion(wkt);
  var lisp = parseString(wkt);
  if (version === 'WKT2') {
    const projjson = buildPROJJSON(lisp);
    return transformPROJJSON(projjson);
  }
  var type = lisp[0];
  var obj = {};
  sExpr(lisp, obj);
  cleanWKT(obj);
  return obj[type];
}

module.exports = index;
