<template>
  <div id="app">
    <editor />
  </div>
</template>

<script>

import { Editor } from '../src';

export default {
  name: 'app',
  components: {
    Editor
  }
};
</script>

<style>
#app {
  margin-top: 60px;
  color: #2c3e50;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
