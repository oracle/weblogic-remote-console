/**
 * Represents a WKT node in the parsed tree.
 */
class WKTNode {
  /**
   * @param {string} keyword
   * @param {string} [value]
   */
  constructor(keyword, value) {
    this.keyword = keyword;
    this.value = value;
    this.children = [];
  }

  /**
   * @param {WKTNode} node
   */
  addChild(node) {
    this.children.push(node);
  }

  /**
   * Finds the first child with the specified keyword.
   * @param {string} keyword
   * @returns {WKTNode | undefined}
   */
  findChild(keyword) {
    return this.children.find(
      (c) => c.keyword && c.keyword.toUpperCase() === keyword.toUpperCase()
    );
  }

  /**
   * Finds all children with the specified keyword.
   * @param {string} keyword
   * @returns {WKTNode[]}
   */
  findChildren(keyword) {
    return this.children.filter(
      (c) => c.keyword && c.keyword.toUpperCase() === keyword.toUpperCase()
    );
  }

  /**
   * Gets the value or literal content of a child node matching the keyword.
   * @param {string} keyword
   * @returns {string | undefined}
   */
  getValue(keyword) {
    const child = this.findChild(keyword);
    return child ? (child.value !== undefined ? child.value : child.literal) : undefined;
  }
}

export default WKTNode;