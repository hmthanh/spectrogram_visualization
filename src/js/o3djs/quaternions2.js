class Quaternions {
  /**
   * Determines if the argument is a scalar or a quaternion.
   * @param {number | number[]} a - A number (scalar) or an array of numbers (quaternion).
   * @return {string} 'Scalar' or 'Quaternion'.
   */
  static mathType(a) {
    return typeof a === 'number' ? 'Scalar' : 'Quaternion';
  }

  /**
   * Copies a quaternion.
   * @param {number[]} q - The quaternion.
   * @return {number[]} A new quaternion identical to q.
   */
  static copy(q) {
    return [...q];
  }

  /**
   * Negates a quaternion.
   * @param {number[]} q - The quaternion.
   * @return {number[]} -q.
   */
  static negative(q) {
    return q.map(component => -component);
  }

  /**
   * Adds two quaternions.
   * @param {number[]} a - Operand quaternion.
   * @param {number[]} b - Operand quaternion.
   * @return {number[]} The sum of a and b.
   */
  static addQuaternionQuaternion(a, b) {
    return a.map((value, index) => value + b[index]);
  }

  /**
   * Adds a quaternion to a scalar.
   * @param {number[]} a - Operand quaternion.
   * @param {number} b - Operand scalar.
   * @return {number[]} The sum of a and b.
   */
  static addQuaternionScalar(a, b) {
    return [...a.slice(0, 3), a[3] + b];
  }

  /**
   * Adds a scalar to a quaternion.
   * @param {number} a - Operand scalar.
   * @param {number[]} b - Operand quaternion.
   * @return {number[]} The sum of a and b.
   */
  static addScalarQuaternion(a, b) {
    return [...b.slice(0, 3), a + b[3]];
  }

  /**
   * Subtracts two quaternions.
   * @param {number[]} a - Operand quaternion.
   * @param {number[]} b - Operand quaternion.
   * @return {number[]} The difference a - b.
   */
  static subQuaternionQuaternion(a, b) {
    return a.map((value, index) => value - b[index]);
  }

  /**
   * Subtracts a scalar from a quaternion.
   * @param {number[]} a - Operand quaternion.
   * @param {number} b - Operand scalar.
   * @return {number[]} The difference a - b.
   */
  static subQuaternionScalar(a, b) {
    return [...a.slice(0, 3), a[3] - b];
  }

  /**
   * Subtracts a quaternion from a scalar.
   * @param {number} a - Operand scalar.
   * @param {number[]} b - Operand quaternion.
   * @return {number[]} The difference a - b.
   */
  static subScalarQuaternion(a, b) {
    return b.map((value, index) => index < 3 ? -value : a - value);
  }

  /**
   * Multiplies a scalar by a quaternion.
   * @param {number} k - The scalar.
   * @param {number[]} q - The quaternion.
   * @return {number[]} The product of k and q.
   */
  static mulScalarQuaternion(k, q) {
    return q.map(component => k * component);
  }

  /**
   * Multiplies a quaternion by a scalar.
   * @param {number[]} q - The quaternion.
   * @param {number} k - The scalar.
   * @return {number[]} The product of k and q.
   */
  static mulQuaternionScalar(q, k) {
    return q.map(component => k * component);
  }

  /**
   * Multiplies two quaternions.
   * @param {number[]} a - Operand quaternion.
   * @param {number[]} b - Operand quaternion.
   * @return {number[]} The quaternion product a * b.
   */
  static mulQuaternionQuaternion(a, b) {
    const [aX, aY, aZ, aW] = a;
    const [bX, bY, bZ, bW] = b;

    return [
      aW * bX + aX * bW + aY * bZ - aZ * bY,
      aW * bY + aY * bW + aZ * bX - aX * bZ,
      aW * bZ + aZ * bW + aX * bY - aY * bX,
      aW * bW - aX * bX - aY * bY - aZ * bZ
    ];
  }

  /**
   * Divides two quaternions; assumes the convention that a/b = a*(1/b).
   * @param {number[]} a - Operand quaternion.
   * @param {number[]} b - Operand quaternion.
   * @return {number[]} The quaternion quotient a / b.
   */
  static divQuaternionQuaternion(a, b) {
    const [aX, aY, aZ, aW] = a;
    const [bX, bY, bZ, bW] = b;

    const d = 1 / (bW * bW + bX * bX + bY * bY + bZ * bZ);
    return [
      (aX * bW - aW * bX - aY * bZ + aZ * bY) * d,
      (aX * bZ - aW * bY + aY * bW - aZ * bX) * d,
      (aY * bX + aZ * bW - aW * bZ - aX * bY) * d,
      (aW * bW + aX * bX + aY * bY + aZ * bZ) * d
    ];
  }

  /**
   * Divides a quaternion by a scalar.
   * @param {number[]} q - The quaternion.
   * @param {number} k - The scalar.
   * @return {number[]} The quaternion q divided by k.
   */
  static divQuaternionScalar(q, k) {
    return q.map(component => component / k);
  }

  /**
   * Divides a scalar by a quaternion.
   * @param {number} a - Operand scalar.
   * @param {number[]} b - Operand quaternion.
   * @return {number[]} The quaternion product.
   */
  static divScalarQuaternion(a, b) {
    const [b0, b1, b2, b3] = b;

    const d = 1 / (b0 * b0 + b1 * b1 + b2 * b2 + b3 * b3);
    return [-a * b0 * d, -a * b1 * d, -a * b2 * d, a * b3 * d];
  }

  /**
   * Computes the multiplicative inverse of a quaternion.
   * @param {number[]} q - The quaternion.
   * @return {number[]} The multiplicative inverse of q.
   */
  static inverse(q) {
    const [q0, q1, q2, q3] = q;
    const d = 1 / (q0 * q0 + q1 * q1 + q2 * q2 + q3 * q3);
    return [-q0 * d, -q1 * d, -q2 * d, q3 * d];
  }

  /**
   * Multiplies two objects which are either scalars or quaternions.
   * @param {number | number[]} a - Operand.
   * @param {number | number[]} b - Operand.
   * @return {number | number[]} The product of a and b.
   */
  static mul(a, b) {
    return this[`mul${this.mathType(a)}${this.mathType(b)}`](a, b);
  }

  /**
   * Divides two objects which are either scalars or quaternions.
   * @param {number | number[]} a - Operand.
   * @param {number | number[]} b - Operand.
   * @return {number | number[]} The quotient of a and b.
   */
  static div(a, b) {
    return this[`div${this.mathType(a)}${this.mathType(b)}`](a, b);
  }

  /**
   * Adds two objects which are either scalars or quaternions.
   * @param {number | number[]} a - Operand.
   * @param {number | number[]} b - Operand.
   * @return {number | number[]} The sum of a and b.
   */
  static add(a, b) {
    return this[`add${this.mathType(a)}${this.mathType(b)}`](a, b);
  }

  /**
   * Subtracts two objects which are either scalars or quaternions.
   * @param {number | number[]} a - Operand.
   * @param {number | number[]} b - Operand.
   * @return {number | number[]} The difference of a and b.
   */
  static sub(a, b) {
    return this[`sub${this.mathType(a)}${this.mathType(b)}`](a, b);
  }
}
