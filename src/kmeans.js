/**
 * Calculate mean for array of numbers
 * @param {Array.<number>} numbersArray
 * @return {number}
 */
const mean = (numbersArray) => numbersArray
  .reduce((sum, val) => sum + val, 0) / numbersArray.length;

/**
 * Calculate distance between two points
 * @param {Array.<number>} arrayA
 * @param {Array.<number>} arrayB
 * @return {number}
 */
const distance = (arrayA, arrayB) => Math.sqrt(
  arrayA
    .map((aPoint, index) => arrayB[index] - aPoint)
    .reduce((sumOfSquares, diff) => sumOfSquares + (diff * diff), 0),
);

class KMeans {
  /**
   * @param k
   * @param data
   */
  constructor(k, data) {
    this.k = k;
    this.data = data;
    this.reset();
  }

  /**
   * Reset initial state of instance.
   * Use only when you want use the same instance to analyze
   * the same set of data but with new start conditionals.
   */
  reset() {
    this.error = null;
    this.iterations = 0;
    this.iterationLogs = [];
    this.centroids = this.initRadomCentroids();
    this.centroidAssigments = [];
  }

  /**
   * get number of dimensions in dataset
   * @return {number}
   */
  getDimensionality() {
    const point = this.data[0];
    return point.length;
  }

  /**
   * For given dimension rerurns min and max value.
   * Used during random initialization of centroids to ensure
   * that centroids are in range of data.
   * @param n
   * @returns {{min: *, max: *}}
   */
  getRangeForDimension(n) {
    const values = this.data.map((point) => point[n]);

    return {
      min: Math.min.apply(null, values),
      max: Math.max.apply(null, values),
    };
  }

  /**
   * Returns ranges for all dimensions
   * @see getRangeForDimension
   * @returns {dimensionRanges}
   */
  getAllDimensionRanges() {
    const dimensionRanges = [];
    const dimensionality = this.getDimensionality();

    for (let i = 0; i < dimensionality; i += 1) {
      dimensionRanges[i] = this.getRangeForDimension(i);
    }

    return dimensionRanges;
  }

  /**
   * Method initialze random centroids
   * @see getAllDimensionRanges
   * @see getAllDimensionRanges
   * @returns {centroidsArray}
   */
  initRadomCentroids() {
    const dimensionality = this.getDimensionality();
    const dimensionRanges = this.getAllDimensionRanges();
    const centroids = [];

    for (let i = 0; i < this.k; i += 1) {
      const point = [];

      for (let dimension = 0; dimension < dimensionality; dimension += 1) {
        const { min, max } = dimensionRanges[dimension];
        point[dimension] = min + (Math.random() * (max - min));
      }

      centroids.push(point);
    }
    return centroids;
  }
}
export default KMeans;