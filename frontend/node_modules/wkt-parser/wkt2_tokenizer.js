/**
 * Tokenizer for WKT2 strings.
 */
class Tokenizer {
  /**
   * @param {string} input
   */
  constructor(input) {
    this.input = input;
    this.length = input.length;
    this.pos = 0;
  }

  /** @returns {Token|null} */
  nextToken() {
    this._skipWhitespace();

    if (this.pos >= this.length) return null;

    const char = this.input[this.pos];

    // Punctuation
    if (char === '[' || char === ']' || char === ',') {
      this.pos++;
      return {
        type: 'punctuation',
        value: char,
        position: this.pos - 1,
      };
    }

    // Quoted string
    if (char === '"') {
      const start = this.pos++;
      let str = '';
      while (this.pos < this.length && this.input[this.pos] !== '"') {
        str += this.input[this.pos++];
      }
      if (this.input[this.pos] !== '"') {
        throw new WKTParsingError('Unterminated string', start);
      }
      this.pos++; // skip closing quote
      return {
        type: 'string',
        value: str,
        position: start,
      };
    }

    // Number (int or float)
    if (char.match(/[0-9\.\-]/)) {
      const start = this.pos;
      let num = '';
      while (this.pos < this.length && this.input[this.pos].match(/[0-9eE\.\+\-]/)) {
        num += this.input[this.pos++];
      }
      return {
        type: 'number',
        value: num,
        position: start,
      };
    }

    // Keyword (identifiers)
    if (char.match(/[A-Z_]/i)) {
      const start = this.pos;
      let ident = '';
      while (this.pos < this.length && this.input[this.pos].match(/[A-Z0-9_]/i)) {
        ident += this.input[this.pos++];
      }
      return {
        type: 'keyword',
        value: ident,
        position: start,
      };
    }

    throw new WKTParsingError(`Unexpected character '${char}'`, this.pos);
  }

  /** @returns {Token|null} */
  peekToken() {
    const savedPos = this.pos;
    try {
      return this.nextToken();
    } finally {
      this.pos = savedPos;
    }
  }

  _skipWhitespace() {
    while (this.pos < this.length && this.input[this.pos].match(/\s/)) {
      this.pos++;
    }
  }
}

export default Tokenizer;

// example usage
// const tokenizer = new Tokenizer(`GEODCRS["WGS 84", DATUM["World Geodetic System 1984"]]`);
// let token;
// while ((token = tokenizer.nextToken())) {
//   console.log(token);
// }