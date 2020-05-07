import KMeans from './kmeans';
import exampleData from './data';

const initialRandomCentroids = () => {
  console.log('K-means clustering');
  console.log('====================================\n');

  console.log('Centroids generate testing');
  console.log('====================================\n');

  const exRandomCentroidsSolver = new KMeans(
    2,
    exampleData.exampleRandomCentroids,
  );

  console.log('Random generated centroids:');
  console.log(exRandomCentroidsSolver.centroids);
  console.log('\n====================================\n\n');
};

const resolve = () => {
  console.log('Example resolving: 2-dimensional data, 3 clusters:');
  console.log('====================================\n');

  console.log('Results for example: 2-dimensional data, 3 clusters');
  console.log('\n====================================\n');
  const resolver = new KMeans(3, exampleData.example2d3k);
  const centroids = resolver.solve();
  console.log(centroids);
  console.log('');
};

initialRandomCentroids();
resolve();
