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
  animation: new-option 400ms linear both;
}

/* Generated with Bounce.js. Edit at https://goo.gl/1F9o28 */

@keyframes new-option {
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
</style>
