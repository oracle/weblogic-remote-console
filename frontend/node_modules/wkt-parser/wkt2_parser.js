import PROJJSONBuilder from './PROJJSONBuilderBase.js';
import Tokenizer from './wkt2_tokenizer.js'
import WKTNode from './wkt_node.js';

/**
 * @typedef {Object} Token
 * @property {string} type
 * @property {string} value
 * @property {number} position
 */

/**
 * Custom error type for WKT parsing errors.
 */
class WKTParsingError extends Error {
  /**
   * @param {string} message
   * @param {number} position
   */
  constructor(message, position) {
    super(`WKT Parsing Error at position ${position}: ${message}`);
    this.name = 'WKTParsingError';
    this.position = position;
  }
}

/**
 * Main parser for WKT2 strings.
 */
class WKTParser {
  /**
   * @param {string} input
   */
  constructor(input) {
    this.tokenizer = new Tokenizer(input);
    this.currentToken = null;
    this.advance();
  }

  advance() {
    this.currentToken = this.tokenizer.nextToken();
  }

  /**
   * @param {string} type
   * @param {string} [value]
   */
  expect(type, value) {
    if (
      !this.currentToken ||
      this.currentToken.type !== type ||
      (value && this.currentToken.value !== value)
    ) {
      throw new WKTParsingError(
        `Expected token type '${type}'` + (value ? ` with value '${value}'` : ''),
        this.tokenizer.pos
      );
    }
    this.advance();
  }

  /** @returns {WKTNode} */
  parse() {
    const token = this.currentToken;

    if (!token) {
      throw new WKTParsingError('Unexpected end of input', this.tokenizer.pos);
    }

    switch (token.value) {
      case 'GEODCRS':
      case 'PROJCRS':
        return this.parseNode(); // Parse CRS definitions as nodes
      case 'CS': // CoordinateSystem (example)
        return this.parseNode();
      // Add more cases as needed for other WKT2 root types
      default:
        throw new WKTParsingError(`Unexpected root keyword: ${token.value}`, this.tokenizer.pos);
    }
  }

  peek() {
    return this.tokenizer.peekToken();
  }

  /** @returns {WKTNode} */
  parseNode() {
    const token = this.currentToken;
  
    if (!token || token.type !== 'keyword') {
      throw new WKTParsingError('Expected keyword at start of node', this.tokenizer.pos);
    }
  
    const keyword = token.value;
    this.advance();
  
    this.expect('punctuation', '[');
  
    const node = new WKTNode(keyword);
  
    let expectingValue = true;
  
    while (this.currentToken && !(this.currentToken.type === 'punctuation' && this.currentToken.value === ']')) {
      const t = this.currentToken;
  
      if (t.type === 'string' || t.type === 'number') {
        if (expectingValue && node.value === null) {
          node.value = t.value;
        } else {
          node.addChild(new WKTNode(t.value));
        }
        this.advance();
      } else if (t.type === 'keyword') {
        const next = this.peek();
  
        if (expectingValue && !node.value && (!next || next.type !== 'punctuation' || next.value !== '[')) {
          node.value = t.value;
          this.advance();
        } else if (next && next.type === 'punctuation' && next.value === '[') {
          const childNode = this.parseNode();
          console.log(`Parsed child node: ${JSON.stringify(childNode, null, 2)}`); // Debug log
          node.addChild(childNode);
        } else {
          node.addChild(new WKTNode(t.value));
          this.advance();
        }
      } else if (t.type === 'punctuation' && t.value === ',') {
        this.advance();
      } else {
        throw new WKTParsingError(`Unexpected token ${t.type}`, t.position);
      }
  
      expectingValue = false;
    }
  
    this.expect('punctuation', ']');
  
    return node;
  }

}

// Example usage
const parser = new WKTParser('PROJCRS["MGI / Austria GK M28",BASEGEOGCRS["MGI",DATUM["Militar-Geographische Institut",ELLIPSOID["Bessel 1841",6377397.155,299.1528128,LENGTHUNIT["metre",1,ID["EPSG",9001]],ID["EPSG",7004]],ID["EPSG",6312]],ID["EPSG",4312]],CONVERSION["Austria Gauss-Kruger M28",METHOD["Transverse Mercator",ID["EPSG",9807]],PARAMETER["Latitude of natural origin",0,ANGLEUNIT["degree",0.0174532925199433,ID["EPSG",9102]],ID["EPSG",8801]],PARAMETER["Longitude of natural origin",10.3333333333336,ANGLEUNIT["degree",0.0174532925199433,ID["EPSG",9102]],ID["EPSG",8802]],PARAMETER["Scale factor at natural origin",1,SCALEUNIT["unity",1,ID["EPSG",9201]],ID["EPSG",8805]],PARAMETER["False easting",150000,LENGTHUNIT["metre",1,ID["EPSG",9001]],ID["EPSG",8806]],PARAMETER["False northing",-5000000,LENGTHUNIT["metre",1,ID["EPSG",9001]],ID["EPSG",8807]],ID["EPSG",18007]],CS[Cartesian,2,ID["EPSG",4530]],AXIS["Northing (X)",north],AXIS["Easting (Y)",east],LENGTHUNIT["metre",1,ID["EPSG",9001]],ID["EPSG",31257]]');
const root = parser.parse();
const projjson = PROJJSONBuilder.build(root);
console.log(JSON.stringify(projjson, null, 2));