<template>
  <div>
    <MajuHeader />
    <div class="content">
      <nuxt/>
    </div>
    <wip />
  </div>
</template>

<script>
import wip from '../components/wip'
import MajuHeader from '../components/MajuHeader';
export default {
  components: {
    MajuHeader, wip
  }
}
</script>

<style lang="less">
body {
  margin: 0;
  font-family: 'Open Sans', sans-serif;
  background-color: lightgray;
  color: black;

  .content {
    margin-top: 70px;
  }
}

.drop {
  animation: drop 400ms linear both;
}

/* Generated with Bounce.js. Edit at https://goo.gl/1F9o28 */

@keyframes drop {
  0% { transform: matrix3d(1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  4.7% { transform: matrix3d(1, 0, 0, 0, 0, 0.45, 0, 0, 0, 0, 1, 0, 0, -12.373, 0, 1); }
  9.41% { transform: matrix3d(1, 0, 0, 0, 0, 0.883, 0, 0, 0, 0, 1, 0, 0, -5.148, 0, 1); }
  14.11% { transform: matrix3d(1, 0, 0, 0, 0, 1.141, 0, 0, 0, 0, 1, 0, 0, 8.038, 0, 1); }
  18.72% { transform: matrix3d(1, 0, 0, 0, 0, 1.212, 0, 0, 0, 0, 1, 0, 0, 12.855, 0, 1); }
  24.32% { transform: matrix3d(1, 0, 0, 0, 0, 1.151, 0, 0, 0, 0, 1, 0, 0, 8.661, 0, 1); }
  29.93% { transform: matrix3d(1, 0, 0, 0, 0, 1.048, 0, 0, 0, 0, 1, 0, 0, 2.493, 0, 1); }
  35.54% { transform: matrix3d(1, 0, 0, 0, 0, 0.979, 0, 0, 0, 0, 1, 0, 0, -1.007, 0, 1); }
  41.04% { transform: matrix3d(1, 0, 0, 0, 0, 0.961, 0, 0, 0, 0, 1, 0, 0, -1.882, 0, 1); }
  52.15% { transform: matrix3d(1, 0, 0, 0, 0, 0.991, 0, 0, 0, 0, 1, 0, 0, -0.436, 0, 1); }
  63.26% { transform: matrix3d(1, 0, 0, 0, 0, 1.007, 0, 0, 0, 0, 1, 0, 0, 0.364, 0, 1); }
  85.49% { transform: matrix3d(1, 0, 0, 0, 0, 0.999, 0, 0, 0, 0, 1, 0, 0, -0.067, 0, 1); }
  100% { transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
}



.jelly {
  animation: jelly 1000ms linear both;
}

/* Generated with Bounce.js. Edit at https://goo.gl/D4fzn1 */

@keyframes jelly {
  0% { transform: matrix3d(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  2.7% { transform: matrix3d(0.389, 0, 0, 0, 0, 0.307, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  3.4% { transform: matrix3d(0.525, 0, 0, 0, 0, 0.407, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  5.41% { transform: matrix3d(0.916, 0, 0, 0, 0, 0.701, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  6.81% { transform: matrix3d(1.146, 0, 0, 0, 0, 0.893, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  8.11% { transform: matrix3d(1.302, 0, 0, 0, 0, 1.046, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  10.21% { transform: matrix3d(1.421, 0, 0, 0, 0, 1.226, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  10.71% { transform: matrix3d(1.426, 0, 0, 0, 0, 1.256, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  13.61% { transform: matrix3d(1.313, 0, 0, 0, 0, 1.332, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  13.71% { transform: matrix3d(1.306, 0, 0, 0, 0, 1.332, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  16.62% { transform: matrix3d(1.077, 0, 0, 0, 0, 1.274, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  17.52% { transform: matrix3d(1.009, 0, 0, 0, 0, 1.239, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  19.62% { transform: matrix3d(0.887, 0, 0, 0, 0, 1.146, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  21.32% { transform: matrix3d(0.836, 0, 0, 0, 0, 1.069, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  22.52% { transform: matrix3d(0.826, 0, 0, 0, 0, 1.02, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  25.23% { transform: matrix3d(0.868, 0, 0, 0, 0, 0.938, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  28.43% { transform: matrix3d(0.97, 0, 0, 0, 0, 0.898, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  29.03% { transform: matrix3d(0.989, 0, 0, 0, 0, 0.897, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  34.33% { transform: matrix3d(1.071, 0, 0, 0, 0, 0.945, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  36.74% { transform: matrix3d(1.057, 0, 0, 0, 0, 0.979, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  44.44% { transform: matrix3d(0.974, 0, 0, 0, 0, 1.032, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  46.05% { transform: matrix3d(0.971, 0, 0, 0, 0, 1.03, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  57.86% { transform: matrix3d(1.012, 0, 0, 0, 0, 0.991, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  59.86% { transform: matrix3d(1.01, 0, 0, 0, 0, 0.99, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  69.57% { transform: matrix3d(0.995, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  75.28% { transform: matrix3d(0.999, 0, 0, 0, 0, 1.003, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  81.38% { transform: matrix3d(1.002, 0, 0, 0, 0, 1.001, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  90.69% { transform: matrix3d(0.999, 0, 0, 0, 0, 0.999, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  93.19% { transform: matrix3d(0.999, 0, 0, 0, 0, 0.999, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  100% { transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
}
</style>
