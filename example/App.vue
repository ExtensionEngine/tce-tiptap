<template>
  <div id="app">
    <h1>Tiptap development</h1>
    <tce-tiptap-html :element="element" :is-focused="true" />
  </div>
</template>

<script>
export default {
  name: 'app',
  data: () => ({
    element: {
      type: 'JODIT_HTML',
      position: 1,
      data: {
        content: 'A sample content'
      }
    }
  })
};
</script>

<style lang="scss">
#app {
  padding: 30px;
  color: #2c3e50;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.toolbar {
  padding: 12px;
  background: #fff;
  box-shadow: -1px 1px 4px 0 #ddd;
}
</style>
