<template>
  <v-app id="app">
    <h1>Tiptap development</h1>
    <tce-tiptap-toolbar />
    <div class="editor-wrapper">
      <tce-tiptap-html :element="element" :is-focused="isFocused" show-placeholder />
    </div>
  </v-app>
</template>

<script>
export default {
  name: 'app',
  data: () => ({
    isFocused: false,
    element: {
      type: 'JODIT_HTML',
      position: 1,
      data: {
        content: `
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <img src="https://source.unsplash.com/8xznAGy4HcY/800x400" contenteditable="false" draggable="true" class="ProseMirror-selectednode" style="float: right;" width="400">

        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

        <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      `
      }
    }
  }),
  computed: {
    elementBus: vm => vm.$radio.channel(`element:${vm.id}`)
  },
  mounted() {
    this.isFocused = true;
  },
  provide() {
    return {
      $elementBus: this.elementBus
    };
  }
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
  margin-top: 30px;
  padding: 12px !important;
  background: #fff;
  box-shadow: -1px 1px 4px 0 #ddd;

  .menu-button.v-btn {
    min-width: 24px;
    padding: 0 10px;
  }
}

.editor-wrapper {
  margin-top: 30px;
  border: 1px solid #ddd;
}
</style>
