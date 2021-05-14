import { BubbleMenu, Editor, EditorContent } from '@tiptap/vue-2';
import { Extension, getNodeAttributes } from '@tiptap/core';
import Image$1 from '@tiptap/extension-image';
import TextStyle from '@tiptap/extension-text-style';
import Blockquote from '@tiptap/extension-blockquote';
import Bold from '@tiptap/extension-bold';
import { deleteSelection } from 'prosemirror-commands';
import { TextSelection } from 'prosemirror-state';
import BubbleMenuExtension from '@tiptap/extension-bubble-menu';
import BulletList from '@tiptap/extension-bullet-list';
import Code from '@tiptap/extension-code';
import CodeBlock from '@tiptap/extension-code-block';
import debounce from 'lodash/debounce';
import Document from '@tiptap/extension-document';
import Dropcursor from '@tiptap/extension-dropcursor';
import FontFamily from '@tiptap/extension-font-family';
import Gapcursor from '@tiptap/extension-gapcursor';
import HardBreak from '@tiptap/extension-hard-break';
import Heading from '@tiptap/extension-heading';
import History from '@tiptap/extension-history';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Italic from '@tiptap/extension-italic';
import Link from '@tiptap/extension-link';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Paragraph from '@tiptap/extension-paragraph';
import Strike from '@tiptap/extension-strike';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import Text from '@tiptap/extension-text';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { mergeCells, splitCell } from 'prosemirror-tables';

var name = "@extensionengine/tce-tiptap";
var version = "0.1.0";
var tailor = {
	label: "Html",
	type: "TIPTAP_HTML",
	ui: {
		icon: "mdi-text",
		forceFullWidth: false
	}
};

const FONT_SIZES = ['8', '10', '12', '14', '16', '18', '20', '24', '30', '36', '48', '60', '72'];
var FontSize = Extension.create({
  name: 'fontSize',
  defaultOptions: {
    types: ['textStyle']
  },

  addGlobalAttributes() {
    return [{
      types: this.options.types,
      attributes: {
        fontSize: {
          default: null,
          renderHTML: attributes => {
            if (!attributes.fontSize) {
              return {};
            }

            return {
              style: `font-size: ${attributes.fontSize}px`
            };
          },
          parseHTML: element => ({
            fontSize: element.style.fontSize.replace(/['"px]+/g, '')
          })
        }
      }
    }];
  },

  addCommands() {
    return {
      setFontSize: fontSize => ({
        chain
      }) => {
        return chain().setMark('textStyle', {
          fontSize
        }).run();
      },
      unsetFontSize: () => ({
        chain
      }) => {
        return chain().setMark('textStyle', {
          fontSize: null
        }).removeEmptyTextStyle().run();
      }
    };
  }

});

var Image = Image$1.extend({
  addAttributes() {
    return {
      src: {
        default: null
      },
      alt: {
        default: null
      },
      width: {
        default: 200
      },
      height: {
        default: 'auto'
      },
      display: {
        default: 'block',
        renderHTML: ({
          display
        }) => {
          if (!display) {
            return {};
          }

          const options = {
            inline: 'display: inline',
            block: 'display: block',
            left: 'float: left',
            right: 'float: right'
          };
          return {
            style: options[display]
          };
        },
        parseHTML: element => {
          const display = element.style.float ? element.style.float.replace(/['"]+/g, '') : element.style.display.replace(/['"]+/g, '');
          return {
            display
          };
        }
      }
    };
  }

});

var Indent = Extension.create({
  name: 'indent',
  defaultOptions: {
    types: ['heading', 'paragraph']
  },

  addGlobalAttributes() {
    return [{
      types: this.options.types,
      attributes: {
        marginLeft: {
          default: null,
          renderHTML: attributes => {
            if (!attributes.marginLeft) {
              return {};
            }

            return {
              style: `margin-left: ${attributes.marginLeft}px`
            };
          },
          parseHTML: element => {
            return {
              marginLeft: Number(element.style.marginLeft.replace(/['"px]+/g, ''))
            };
          }
        }
      }
    }];
  },

  addCommands() {
    return {
      indent: value => ({
        commands,
        state
      }) => {
        return this.options.types.every(type => {
          let {
            marginLeft = 0
          } = getNodeAttributes(state, type);
          marginLeft = marginLeft + value;
          if (marginLeft > 200) marginLeft = 200;
          return commands.updateAttributes(type, {
            marginLeft
          });
        });
      },
      outdent: value => ({
        commands,
        state
      }) => {
        return this.options.types.every(type => {
          let {
            marginLeft = 0
          } = getNodeAttributes(state, type);
          marginLeft = marginLeft - value;
          if (marginLeft < 0) return this.options.types.every(type => commands.resetAttributes(type, 'marginLeft'));
          return commands.updateAttributes(type, {
            marginLeft
          });
        });
      }
    };
  }

});

var TextColor = Extension.create({
  name: 'textColor',
  defaultOptions: {
    types: ['textStyle']
  },

  addGlobalAttributes() {
    return [{
      types: this.options.types,
      attributes: {
        color: {
          default: null,
          renderHTML: attributes => {
            if (!attributes.color) {
              return {};
            }

            return {
              style: `color: ${attributes.color}`
            };
          },
          parseHTML: element => ({
            color: element.style.color.replace(/['"]+/g, '')
          })
        }
      }
    }];
  },

  addCommands() {
    return {
      setTextColor: color => ({
        chain
      }) => {
        return chain().setMark('textStyle', {
          color
        }).run();
      },
      unsetTextColor: () => ({
        chain
      }) => {
        return chain().setMark('textStyle', {
          color: null
        }).removeEmptyTextStyle().run();
      }
    };
  }

});

var TextHighlight = Extension.create({
  name: 'textHighlight',
  defaultOptions: {
    types: ['textStyle']
  },

  addGlobalAttributes() {
    return [{
      types: this.options.types,
      attributes: {
        backgroundColor: {
          default: null,
          renderHTML: attributes => {
            if (!attributes.backgroundColor) {
              return {};
            }

            return {
              style: `background-color: ${attributes.backgroundColor}`
            };
          },
          parseHTML: element => ({
            backgroundColor: element.style.backgroundColor.replace(/['"]+/g, '')
          })
        }
      }
    }];
  },

  addCommands() {
    return {
      setTextHighlight: backgroundColor => ({
        chain
      }) => {
        return chain().setMark('textStyle', {
          backgroundColor
        }).run();
      },
      unsetTextHighlight: () => ({
        chain
      }) => {
        return chain().setMark('textStyle', {
          backgroundColor: null
        }).removeEmptyTextStyle().run();
      }
    };
  }

});

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var script$i = {
  name: 'tce-tiptap-menu-button',
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      required: true
    },
    tooltip: {
      type: String,
      default: null
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

/* script */
const __vue_script__$i = script$i;
/* template */

var __vue_render__$i = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticStyle: {
      "position": "relative"
    }
  }, [_c('v-tooltip', {
    attrs: {
      "disabled": !_vm.tooltip,
      "bottom": ""
    },
    scopedSlots: _vm._u([{
      key: "activator",
      fn: function (ref) {
        var on = ref.on;
        var attrs = ref.attrs;
        return [_c('v-btn', _vm._g(_vm._b({
          staticClass: "menu-button mx-1",
          class: {
            'active': _vm.isActive
          },
          attrs: {
            "text": "",
            "rounded": ""
          }
        }, 'v-btn', Object.assign({}, _vm.$attrs, attrs), false), Object.assign({}, _vm.$listeners, on)), [_c('v-icon', [_vm._v(_vm._s("mdi-" + _vm.icon))]), _vm._v(" "), _c('span', {
          staticClass: "slot"
        }, [_vm._t("default")], 2)], 1)];
      }
    }], null, true)
  }, [_vm._v(" "), _c('span', [_vm._v(_vm._s(_vm.tooltip))])])], 1);
};

var __vue_staticRenderFns__$i = [];
/* style */

const __vue_inject_styles__$i = undefined;
/* scoped */

const __vue_scope_id__$i = "data-v-32c11d74";
/* module identifier */

const __vue_module_identifier__$i = undefined;
/* functional template */

const __vue_is_functional_template__$i = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$i = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$i,
  staticRenderFns: __vue_staticRenderFns__$i
}, __vue_inject_styles__$i, __vue_script__$i, __vue_scope_id__$i, __vue_is_functional_template__$i, __vue_module_identifier__$i, false, undefined, undefined, undefined);

//
var script$h = {
  name: 'tce-tiptap-image-display',
  props: {
    editor: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    display: ''
  }),
  computed: {
    alignments: () => ['inline', 'block', 'left', 'right']
  },
  methods: {
    updateAligment(display) {
      this.editor.commands.updateAttributes('image', {
        display
      });
    }

  },
  watch: {
    display: 'updateAligment'
  },
  components: {
    MenuButton: __vue_component__$i
  }
};

/* script */
const __vue_script__$h = script$h;
/* template */

var __vue_render__$h = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('v-menu', {
    attrs: {
      "transition": "slide-y-transition",
      "bottom": ""
    },
    scopedSlots: _vm._u([{
      key: "activator",
      fn: function (ref) {
        var on = ref.on;
        var attrs = ref.attrs;
        return [_c('menu-button', _vm._g(_vm._b({
          attrs: {
            "icon": "image-text",
            "tooltip": "Align image"
          }
        }, 'menu-button', attrs, false), on))];
      }
    }])
  }, [_vm._v(" "), _c('v-list', {
    staticClass: "font-sizes",
    attrs: {
      "dense": ""
    }
  }, [_c('v-list-item-group', {
    model: {
      value: _vm.display,
      callback: function ($$v) {
        _vm.display = $$v;
      },
      expression: "display"
    }
  }, _vm._l(_vm.alignments, function (alignment) {
    return _c('v-list-item', {
      key: alignment,
      attrs: {
        "value": alignment
      }
    }, [_c('v-list-item-title', [_vm._v("\n          " + _vm._s(alignment) + "\n        ")])], 1);
  }), 1)], 1)], 1);
};

var __vue_staticRenderFns__$h = [];
/* style */

const __vue_inject_styles__$h = undefined;
/* scoped */

const __vue_scope_id__$h = undefined;
/* module identifier */

const __vue_module_identifier__$h = undefined;
/* functional template */

const __vue_is_functional_template__$h = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$h = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$h,
  staticRenderFns: __vue_staticRenderFns__$h
}, __vue_inject_styles__$h, __vue_script__$h, __vue_scope_id__$h, __vue_is_functional_template__$h, __vue_module_identifier__$h, false, undefined, undefined, undefined);

//
var script$g = {
  name: 'tce-tiptap-image-edit',
  props: {
    editor: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    imageAttrs: {},
    menu: false
  }),
  methods: {
    save() {
      this.editor.commands.updateAttributes('image', this.imageAttrs);
      this.close();
    },

    close() {
      this.menu = false;
    }

  },

  created() {
    this.imageAttrs = this.editor.getAttributes('image');
  },

  components: {
    MenuButton: __vue_component__$i
  }
};

/* script */
const __vue_script__$g = script$g;
/* template */

var __vue_render__$g = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('v-menu', {
    attrs: {
      "transition": "slide-y-transition",
      "close-on-content-click": false,
      "bottom": ""
    },
    scopedSlots: _vm._u([{
      key: "activator",
      fn: function (ref) {
        var on = ref.on;
        var attrs = ref.attrs;
        return [_c('menu-button', _vm._g(_vm._b({
          attrs: {
            "icon": "image-edit",
            "tooltip": "Edit image"
          }
        }, 'menu-button', attrs, false), on))];
      }
    }]),
    model: {
      value: _vm.menu,
      callback: function ($$v) {
        _vm.menu = $$v;
      },
      expression: "menu"
    }
  }, [_vm._v(" "), _c('v-card', {
    attrs: {
      "min-width": "300"
    }
  }, [_c('v-card-text', {
    staticClass: "pb-0"
  }, [_c('v-text-field', {
    attrs: {
      "disabled": "",
      "label": "Image url",
      "placeholder": "https://example.com",
      "type": "url"
    },
    model: {
      value: _vm.imageAttrs.src,
      callback: function ($$v) {
        _vm.$set(_vm.imageAttrs, "src", $$v);
      },
      expression: "imageAttrs.src"
    }
  }), _vm._v(" "), _c('v-text-field', {
    attrs: {
      "label": "Alt text",
      "type": "text"
    },
    model: {
      value: _vm.imageAttrs.alt,
      callback: function ($$v) {
        _vm.$set(_vm.imageAttrs, "alt", $$v);
      },
      expression: "imageAttrs.alt"
    }
  }), _vm._v(" "), _c('v-text-field', {
    attrs: {
      "label": "Width",
      "placeholder": "https://example.com",
      "type": "number"
    },
    model: {
      value: _vm.imageAttrs.width,
      callback: function ($$v) {
        _vm.$set(_vm.imageAttrs, "width", $$v);
      },
      expression: "imageAttrs.width"
    }
  }), _vm._v(" "), _c('v-text-field', {
    attrs: {
      "label": "Height",
      "placeholder": "https://example.com",
      "type": "number"
    },
    model: {
      value: _vm.imageAttrs.height,
      callback: function ($$v) {
        _vm.$set(_vm.imageAttrs, "height", $$v);
      },
      expression: "imageAttrs.height"
    }
  })], 1), _vm._v(" "), _c('v-card-actions', {
    staticClass: "pt-0"
  }, [_c('v-spacer'), _vm._v(" "), _c('v-btn', {
    attrs: {
      "text": ""
    },
    on: {
      "click": _vm.save
    }
  }, [_vm._v("\n        Save\n      ")]), _vm._v(" "), _c('v-btn', {
    attrs: {
      "text": ""
    },
    on: {
      "click": _vm.close
    }
  }, [_vm._v("\n        Cancel\n      ")])], 1)], 1)], 1);
};

var __vue_staticRenderFns__$g = [];
/* style */

const __vue_inject_styles__$g = undefined;
/* scoped */

const __vue_scope_id__$g = undefined;
/* module identifier */

const __vue_module_identifier__$g = undefined;
/* functional template */

const __vue_is_functional_template__$g = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$g = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$g,
  staticRenderFns: __vue_staticRenderFns__$g
}, __vue_inject_styles__$g, __vue_script__$g, __vue_scope_id__$g, __vue_is_functional_template__$g, __vue_module_identifier__$g, false, undefined, undefined, undefined);

//
var script$f = {
  name: 'tce-tiptap-remove-image',
  props: {
    editor: {
      type: Object,
      required: true
    }
  },
  methods: {
    removeImage() {
      const {
        state,
        dispatch
      } = this.editor.view;
      deleteSelection(state, dispatch);
    }

  },
  components: {
    MenuButton: __vue_component__$i
  }
};

/* script */
const __vue_script__$f = script$f;
/* template */

var __vue_render__$f = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', [_c('menu-button', {
    attrs: {
      "command": function () {
        return _vm.removeImage();
      },
      "icon": "delete",
      "tooltip": "Remove image"
    }
  })], 1);
};

var __vue_staticRenderFns__$f = [];
/* style */

const __vue_inject_styles__$f = undefined;
/* scoped */

const __vue_scope_id__$f = undefined;
/* module identifier */

const __vue_module_identifier__$f = undefined;
/* functional template */

const __vue_is_functional_template__$f = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$f = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$f,
  staticRenderFns: __vue_staticRenderFns__$f
}, __vue_inject_styles__$f, __vue_script__$f, __vue_scope_id__$f, __vue_is_functional_template__$f, __vue_module_identifier__$f, false, undefined, undefined, undefined);

//
var script$e = {
  name: 'tce-tiptap-image-menu',
  props: {
    editor: {
      type: Object,
      required: true
    }
  },
  components: {
    ImageDisplay: __vue_component__$h,
    ImageEdit: __vue_component__$g,
    ImageRemove: __vue_component__$f
  }
};

/* script */
const __vue_script__$e = script$e;
/* template */

var __vue_render__$e = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "d-flex"
  }, [_c('image-display', {
    attrs: {
      "editor": _vm.editor
    }
  }), _vm._v(" "), _c('image-edit', {
    attrs: {
      "editor": _vm.editor
    }
  }), _vm._v(" "), _c('image-remove', {
    attrs: {
      "editor": _vm.editor
    }
  })], 1);
};

var __vue_staticRenderFns__$e = [];
/* style */

const __vue_inject_styles__$e = undefined;
/* scoped */

const __vue_scope_id__$e = undefined;
/* module identifier */

const __vue_module_identifier__$e = undefined;
/* functional template */

const __vue_is_functional_template__$e = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$e = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$e,
  staticRenderFns: __vue_staticRenderFns__$e
}, __vue_inject_styles__$e, __vue_script__$e, __vue_scope_id__$e, __vue_is_functional_template__$e, __vue_module_identifier__$e, false, undefined, undefined, undefined);

//
var script$d = {
  name: 'tce-tiptap-link-button',
  props: {
    editor: {
      type: Object,
      required: true
    },
    icon: {
      type: String,
      required: true
    }
  },
  data: () => ({
    url: null,
    newTab: true,
    menu: false
  }),
  methods: {
    close() {
      this.url = null;
      this.menu = false;
    },

    save() {
      this.editor.chain().focus().setLink({
        href: this.url,
        target: this.newTab ? '_blank' : '_self'
      }).run();
      this.close();
    },

    remove() {
      this.editor.commands.unsetLink();
      this.close();
    }

  },
  watch: {
    menu() {
      const attributes = this.editor.getAttributes('link');
      this.url = attributes.href || null;
      this.newTab = attributes && attributes.target === '_blank';
    }

  },
  components: {
    MenuButton: __vue_component__$i
  }
};

/* script */
const __vue_script__$d = script$d;
/* template */

var __vue_render__$d = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('v-menu', {
    attrs: {
      "transition": "slide-y-transition",
      "close-on-content-click": false,
      "bottom": ""
    },
    scopedSlots: _vm._u([{
      key: "activator",
      fn: function (ref) {
        var on = ref.on;
        var attrs = ref.attrs;
        return [_c('menu-button', _vm._g(_vm._b({
          attrs: {
            "is-active": _vm.editor.isActive('link'),
            "icon": _vm.icon,
            "tooltip": _vm.editor.isActive('link') ? 'Edit link' : 'Insert link'
          }
        }, 'menu-button', attrs, false), on))];
      }
    }]),
    model: {
      value: _vm.menu,
      callback: function ($$v) {
        _vm.menu = $$v;
      },
      expression: "menu"
    }
  }, [_vm._v(" "), _c('v-card', {
    attrs: {
      "min-width": "300"
    }
  }, [_c('v-card-text', {
    staticClass: "pb-0"
  }, [_c('v-text-field', {
    ref: "url",
    attrs: {
      "label": "Url",
      "placeholder": "https://example.com",
      "type": "url"
    },
    model: {
      value: _vm.url,
      callback: function ($$v) {
        _vm.url = $$v;
      },
      expression: "url"
    }
  }), _vm._v(" "), _c('v-checkbox', {
    attrs: {
      "label": "Open in new tab",
      "type": "checkbox"
    },
    model: {
      value: _vm.newTab,
      callback: function ($$v) {
        _vm.newTab = $$v;
      },
      expression: "newTab"
    }
  })], 1), _vm._v(" "), _c('v-card-actions', {
    staticClass: "pt-0"
  }, [_c('v-spacer'), _vm._v(" "), _c('v-btn', {
    attrs: {
      "text": ""
    },
    on: {
      "click": function ($event) {
        return _vm.save();
      }
    }
  }, [_vm._v("Save")]), _vm._v(" "), _vm.url ? _c('v-btn', {
    attrs: {
      "text": ""
    },
    on: {
      "click": _vm.remove
    }
  }, [_vm._v("\n        Remove\n      ")]) : _vm._e(), _vm._v(" "), _c('v-btn', {
    attrs: {
      "text": ""
    },
    on: {
      "click": function ($event) {
        return _vm.close();
      }
    }
  }, [_vm._v("Cancel")])], 1)], 1)], 1);
};

var __vue_staticRenderFns__$d = [];
/* style */

const __vue_inject_styles__$d = undefined;
/* scoped */

const __vue_scope_id__$d = "data-v-1d510dee";
/* module identifier */

const __vue_module_identifier__$d = undefined;
/* functional template */

const __vue_is_functional_template__$d = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$d = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$d,
  staticRenderFns: __vue_staticRenderFns__$d
}, __vue_inject_styles__$d, __vue_script__$d, __vue_scope_id__$d, __vue_is_functional_template__$d, __vue_module_identifier__$d, false, undefined, undefined, undefined);

//
var script$c = {
  name: 'tce-tiptap-link-menu',
  props: {
    editor: {
      type: Object,
      required: true
    },
    isLinkSelection: {
      type: Boolean,
      default: false
    },
    linkAttributes: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    openLink() {
      window.open(this.linkAttributes.href, '_blank');
    }

  },
  components: {
    LinkButton: __vue_component__$d,
    MenuButton: __vue_component__$i
  }
};

/* script */
const __vue_script__$c = script$c;
/* template */

var __vue_render__$c = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "d-flex"
  }, [_c('link-button', {
    attrs: {
      "editor": _vm.editor,
      "icon": _vm.isLinkSelection ? 'pencil' : 'link'
    }
  }), _vm._v(" "), _vm.isLinkSelection ? [_c('menu-button', {
    staticClass: "menu-button",
    attrs: {
      "icon": "eye"
    },
    on: {
      "click": _vm.openLink
    }
  }), _vm._v(" "), _c('menu-button', {
    staticClass: "menu-button",
    attrs: {
      "icon": "link-off"
    },
    on: {
      "click": function ($event) {
        return _vm.editor.commands.unsetLink();
      }
    }
  }), _vm._v(" "), _c('v-divider', {
    staticClass: "mx-1",
    attrs: {
      "vertical": ""
    }
  })] : _vm._e()], 2);
};

var __vue_staticRenderFns__$c = [];
/* style */

const __vue_inject_styles__$c = undefined;
/* scoped */

const __vue_scope_id__$c = undefined;
/* module identifier */

const __vue_module_identifier__$c = undefined;
/* functional template */

const __vue_is_functional_template__$c = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$c = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$c,
  staticRenderFns: __vue_staticRenderFns__$c
}, __vue_inject_styles__$c, __vue_script__$c, __vue_scope_id__$c, __vue_is_functional_template__$c, __vue_module_identifier__$c, false, undefined, undefined, undefined);

//
var script$b = {
  name: 'tce-tiptap-bubble-menu',
  props: {
    editor: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    isLink: false,
    isImage: false,
    isText: false,
    linkAttributes: {}
  }),
  methods: {
    isLinkSelection() {
      this.linkAttributes = this.editor.getAttributes('link');
      this.isLink = !!this.linkAttributes.href;
    },

    isImageSelection(selection) {
      if (!selection.node) {
        this.isImage = false;
        return;
      }

      this.isImage = selection.node.type.name === 'image';
    },

    isTextSelection(selection) {
      this.isText = selection instanceof TextSelection;
    },

    getSelectionType(selection) {
      this.isTextSelection(selection);
      this.isLinkSelection(selection);
      this.isImageSelection(selection);
    }

  },
  watch: {
    'editor.state.selection': 'getSelectionType'
  },
  components: {
    BubbleMenu,
    ImageMenu: __vue_component__$e,
    LinkMenu: __vue_component__$c,
    MenuButton: __vue_component__$i
  }
};

/* script */
const __vue_script__$b = script$b;
/* template */

var __vue_render__$b = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _vm.editor ? _c('bubble-menu', {
    attrs: {
      "editor": _vm.editor
    }
  }, [_c('v-card', [_c('v-card-text', {
    staticClass: "d-flex pa-1"
  }, [_vm.isImage ? _c('image-menu', {
    attrs: {
      "editor": _vm.editor
    }
  }) : [_c('link-menu', {
    attrs: {
      "editor": _vm.editor,
      "is-link-selection": _vm.isLink,
      "link-attributes": _vm.linkAttributes
    }
  }), _vm._v(" "), _c('menu-button', {
    attrs: {
      "is-active": _vm.editor.isActive('bold'),
      "icon": "format-bold",
      "tooltip": "Bold"
    },
    on: {
      "click": function ($event) {
        _vm.editor.chain().focus().toggleBold().run();
      }
    }
  }), _vm._v(" "), _c('menu-button', {
    attrs: {
      "is-active": _vm.editor.isActive('italic'),
      "icon": "format-italic",
      "tooltip": "italic"
    },
    on: {
      "click": function ($event) {
        _vm.editor.chain().focus().toggleItalic().run();
      }
    }
  }), _vm._v(" "), _c('menu-button', {
    attrs: {
      "is-active": _vm.editor.isActive('underline'),
      "icon": "format-underline",
      "tooltip": "Underline"
    },
    on: {
      "click": function ($event) {
        _vm.editor.chain().focus().toggleUnderline().run();
      }
    }
  }), _vm._v(" "), _c('menu-button', {
    attrs: {
      "is-active": _vm.editor.isActive('strike'),
      "icon": "format-strikethrough",
      "tooltip": "Strikethrough"
    },
    on: {
      "click": function ($event) {
        _vm.editor.chain().focus().toggleStrike().run();
      }
    }
  })]], 2)], 1)], 1) : _vm._e();
};

var __vue_staticRenderFns__$b = [];
/* style */

const __vue_inject_styles__$b = undefined;
/* scoped */

const __vue_scope_id__$b = "data-v-128262c1";
/* module identifier */

const __vue_module_identifier__$b = undefined;
/* functional template */

const __vue_is_functional_template__$b = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$b = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$b,
  staticRenderFns: __vue_staticRenderFns__$b
}, __vue_inject_styles__$b, __vue_script__$b, __vue_scope_id__$b, __vue_is_functional_template__$b, __vue_module_identifier__$b, false, undefined, undefined, undefined);

//
var script$a = {
  name: 'tce-tiptap-html',
  inject: ['$elementBus'],
  props: {
    element: {
      type: Object,
      required: true
    },
    isFocused: {
      type: Boolean,
      default: false
    },
    isDragged: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    dense: {
      type: Boolean,
      default: false
    },
    showPlaceholder: {
      type: Boolean,
      default: true
    }
  },
  data: vm => {
    var _vm$element$data$cont, _vm$element, _vm$element$data;

    return {
      content: (_vm$element$data$cont = (_vm$element = vm.element) === null || _vm$element === void 0 ? void 0 : (_vm$element$data = _vm$element.data) === null || _vm$element$data === void 0 ? void 0 : _vm$element$data.content) !== null && _vm$element$data$cont !== void 0 ? _vm$element$data$cont : '',
      editor: null
    };
  },
  computed: {
    hasChanges() {
      var _this$element$data$co, _this$element, _this$element$data;

      const previousValue = (_this$element$data$co = (_this$element = this.element) === null || _this$element === void 0 ? void 0 : (_this$element$data = _this$element.data) === null || _this$element$data === void 0 ? void 0 : _this$element$data.content) !== null && _this$element$data$co !== void 0 ? _this$element$data$co : '';
      return previousValue !== this.content;
    }

  },
  methods: {
    save() {
      if (!this.hasChanges) return;
      this.$emit('save', {
        content: this.content
      });
    }

  },
  watch: {
    element(val) {
      // Make sure that component state is kept
      // until events (i.e. focusout => save) are triggered
      setTimeout(() => {
        var _val$data$content, _val$data;

        if (this.isFocused) return;
        this.content = (_val$data$content = val === null || val === void 0 ? void 0 : (_val$data = val.data) === null || _val$data === void 0 ? void 0 : _val$data.content) !== null && _val$data$content !== void 0 ? _val$data$content : '';
      }, 0);
    },

    isFocused(val, oldVal) {
      if (oldVal && !val) this.save();
      this.$elementBus.emit('tiptap-editor', this.editor);
    },

    isDragged(state, oldState) {
      if (state) {
        this.readonly = true;
      } else if (!state && oldState) {
        this.readonly = false;
      }
    },

    content: debounce(function () {
      this.save();
    }, 4000)
  },

  mounted() {
    this.editor = new Editor({
      content: this.content,
      extensions: [BubbleMenuExtension, Blockquote, Bold, BulletList, Code, CodeBlock, Document, Dropcursor, Gapcursor, HardBreak, Heading, History, HorizontalRule, Indent, Image, Italic, ListItem, Link.configure({
        openOnClick: false
      }), OrderedList, Paragraph, Strike, Text, TextStyle, FontFamily, FontSize, Underline, Table.configure({
        resizable: true
      }), TableRow, TableHeader, TableCell, TextAlign, TextColor, TextHighlight],
      onUpdate: () => {
        this.content = this.editor.getHTML();
      }
    });
  },

  beforeDestroy() {
    this.editor.destroy();
  },

  components: {
    EditorContent,
    BubbleMenu: __vue_component__$b
  }
};

/* script */
const __vue_script__$a = script$a;
/* template */

var __vue_render__$a = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "tce-tiptap-html",
    class: {
      sm: _vm.dense,
      disabled: _vm.isDisabled
    }
  }, [!_vm.isFocused && !_vm.content && _vm.showPlaceholder ? _c('div', {
    staticClass: "tiptap-html-placeholder"
  }, [_vm._m(0), _vm._v(" "), _c('div', {
    staticClass: "message"
  }, [_c('span', {
    staticClass: "heading"
  }, [_vm._v("HTML component")]), _vm._v(" "), !_vm.dense ? _c('span', [_vm._v("Select to edit")]) : _vm._e()])]) : [_c('editor-content', {
    staticClass: "editor",
    attrs: {
      "editor": _vm.editor
    }
  }), _vm._v(" "), _vm.editor ? _c('bubble-menu', {
    attrs: {
      "editor": _vm.editor
    }
  }) : _vm._e()]], 2);
};

var __vue_staticRenderFns__$a = [function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "placeholder-avatar"
  }, [_c('span', [_vm._v("<")]), _vm._v(" "), _c('span', {
    staticClass: "divider"
  }, [_vm._v("/")]), _vm._v(" "), _c('span', [_vm._v(">")])]);
}];
/* style */

const __vue_inject_styles__$a = undefined;
/* scoped */

const __vue_scope_id__$a = "data-v-650a9097";
/* module identifier */

const __vue_module_identifier__$a = undefined;
/* functional template */

const __vue_is_functional_template__$a = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$a = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$a,
  staticRenderFns: __vue_staticRenderFns__$a
}, __vue_inject_styles__$a, __vue_script__$a, __vue_scope_id__$a, __vue_is_functional_template__$a, __vue_module_identifier__$a, false, undefined, undefined, undefined);

//

const fontFamilies = () => ['Arial', 'Arial Black', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana', 'Courier New', 'Lucida Console', 'Monaco', 'monospace'];

var script$9 = {
  name: 'tce-tiptap-font-family',
  props: {
    editor: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    font: ''
  }),
  computed: {
    fontFamilies
  },
  methods: {
    toggleFontFamily(font) {
      this.editor.chain().focus().setFontFamily(font).run();
    }

  },
  watch: {
    font: 'toggleFontFamily'
  },
  components: {
    MenuButton: __vue_component__$i
  }
};

/* script */
const __vue_script__$9 = script$9;
/* template */

var __vue_render__$9 = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('v-menu', {
    attrs: {
      "transition": "slide-y-transition",
      "bottom": ""
    },
    scopedSlots: _vm._u([{
      key: "activator",
      fn: function (ref) {
        var on = ref.on;
        var attrs = ref.attrs;
        return [_c('menu-button', _vm._g(_vm._b({
          attrs: {
            "is-active": !!_vm.editor.getAttributes('textStyle').fontFamily,
            "icon": "format-font",
            "tooltip": "Font family"
          }
        }, 'menu-button', attrs, false), on), [_c('v-icon', {
          staticClass: "ml-1",
          attrs: {
            "size": "14"
          }
        }, [_vm._v("mdi-chevron-down")])], 1)];
      }
    }])
  }, [_vm._v(" "), _c('v-list', {
    staticClass: "font-types",
    attrs: {
      "dense": ""
    }
  }, [_c('v-list-item-group', {
    model: {
      value: _vm.font,
      callback: function ($$v) {
        _vm.font = $$v;
      },
      expression: "font"
    }
  }, _vm._l(_vm.fontFamilies, function (fontFamily) {
    return _c('v-list-item', {
      key: fontFamily,
      class: {
        'active': _vm.editor.isActive('textStyle', {
          fontFamily: fontFamily
        })
      },
      attrs: {
        "value": fontFamily
      }
    }, [_c('v-list-item-title', [_c('span', {
      style: "font-family: " + fontFamily
    }, [_vm._v(_vm._s(fontFamily))])])], 1);
  }), 1)], 1)], 1);
};

var __vue_staticRenderFns__$9 = [];
/* style */

const __vue_inject_styles__$9 = undefined;
/* scoped */

const __vue_scope_id__$9 = "data-v-0f427584";
/* module identifier */

const __vue_module_identifier__$9 = undefined;
/* functional template */

const __vue_is_functional_template__$9 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$9 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$9,
  staticRenderFns: __vue_staticRenderFns__$9
}, __vue_inject_styles__$9, __vue_script__$9, __vue_scope_id__$9, __vue_is_functional_template__$9, __vue_module_identifier__$9, false, undefined, undefined, undefined);

//
var script$8 = {
  name: 'tce-tiptap-font-size',
  props: {
    editor: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    size: 14
  }),
  computed: {
    fontSizes: () => FONT_SIZES
  },
  methods: {
    toggleFontSize(size) {
      this.editor.chain().focus().setFontSize(size).run();
    }

  },
  watch: {
    size: 'toggleFontSize'
  },
  components: {
    MenuButton: __vue_component__$i
  }
};

/* script */
const __vue_script__$8 = script$8;
/* template */

var __vue_render__$8 = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('v-menu', {
    attrs: {
      "transition": "slide-y-transition",
      "bottom": ""
    },
    scopedSlots: _vm._u([{
      key: "activator",
      fn: function (ref) {
        var on = ref.on;
        var attrs = ref.attrs;
        return [_c('menu-button', _vm._g(_vm._b({
          attrs: {
            "is-active": !!_vm.editor.getAttributes('textStyle').fontSize,
            "icon": "format-size",
            "tooltip": "Font size"
          }
        }, 'menu-button', attrs, false), on), [_c('v-icon', {
          staticClass: "ml-1",
          attrs: {
            "size": "14"
          }
        }, [_vm._v("mdi-chevron-down")])], 1)];
      }
    }])
  }, [_vm._v(" "), _c('v-list', {
    staticClass: "font-sizes",
    attrs: {
      "dense": ""
    }
  }, [_c('v-list-item-group', {
    model: {
      value: _vm.size,
      callback: function ($$v) {
        _vm.size = $$v;
      },
      expression: "size"
    }
  }, _vm._l(_vm.fontSizes, function (fontSize) {
    return _c('v-list-item', {
      key: fontSize,
      class: {
        'active': _vm.editor.isActive('textStyle', {
          fontSize: fontSize
        })
      },
      attrs: {
        "value": fontSize
      }
    }, [_c('v-list-item-title', [_vm._v(_vm._s(fontSize))])], 1);
  }), 1)], 1)], 1);
};

var __vue_staticRenderFns__$8 = [];
/* style */

const __vue_inject_styles__$8 = undefined;
/* scoped */

const __vue_scope_id__$8 = "data-v-609d512c";
/* module identifier */

const __vue_module_identifier__$8 = undefined;
/* functional template */

const __vue_is_functional_template__$8 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$8 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$8,
  staticRenderFns: __vue_staticRenderFns__$8
}, __vue_inject_styles__$8, __vue_script__$8, __vue_scope_id__$8, __vue_is_functional_template__$8, __vue_module_identifier__$8, false, undefined, undefined, undefined);

//
var script$7 = {
  name: 'tce-tiptap-heading',
  props: {
    editor: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    level: 0
  }),
  methods: {
    toggleHeading(level) {
      if (level) return this.editor.chain().focus().toggleHeading({
        level
      }).run();
      this.editor.commands.setNode('paragraph');
    }

  },
  watch: {
    level: 'toggleHeading'
  },
  components: {
    MenuButton: __vue_component__$i
  }
};

/* script */
const __vue_script__$7 = script$7;
/* template */

var __vue_render__$7 = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('v-menu', {
    attrs: {
      "transition": "slide-y-transition",
      "bottom": ""
    },
    scopedSlots: _vm._u([{
      key: "activator",
      fn: function (ref) {
        var on = ref.on;
        var attrs = ref.attrs;
        return [_c('menu-button', _vm._g(_vm._b({
          attrs: {
            "is-active": _vm.editor.isActive('heading'),
            "icon": "format-pilcrow",
            "tooltip": "Heading"
          }
        }, 'menu-button', attrs, false), on), [_c('v-icon', {
          staticClass: "ml-1",
          attrs: {
            "size": "14"
          }
        }, [_vm._v("mdi-chevron-down")])], 1)];
      }
    }])
  }, [_vm._v(" "), _c('v-list', {
    staticClass: "headings",
    attrs: {
      "dense": ""
    }
  }, [_c('v-list-item-group', {
    model: {
      value: _vm.level,
      callback: function ($$v) {
        _vm.level = $$v;
      },
      expression: "level"
    }
  }, [_c('v-list-item', {
    attrs: {
      "value": 0
    }
  }, [_vm._v("Normal")]), _vm._v(" "), _vm._l([1, 2, 3, 4, 5, 6], function (l) {
    return _c('v-list-item', {
      key: l,
      class: {
        'active': _vm.editor.isActive('heading', {
          level: l
        })
      },
      attrs: {
        "value": l
      }
    }, [_c('v-list-item-title', [_c("h" + l, {
      tag: "component"
    }, [_vm._v("Heading " + _vm._s(l))])], 1)], 1);
  })], 2)], 1)], 1);
};

var __vue_staticRenderFns__$7 = [];
/* style */

const __vue_inject_styles__$7 = undefined;
/* scoped */

const __vue_scope_id__$7 = "data-v-a6a1cb78";
/* module identifier */

const __vue_module_identifier__$7 = undefined;
/* functional template */

const __vue_is_functional_template__$7 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$7 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$7,
  staticRenderFns: __vue_staticRenderFns__$7
}, __vue_inject_styles__$7, __vue_script__$7, __vue_scope_id__$7, __vue_is_functional_template__$7, __vue_module_identifier__$7, false, undefined, undefined, undefined);

//
var script$6 = {
  name: 'tce-tiptap-image',
  props: {
    editor: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    menu: false,
    imageAttrs: {
      src: null,
      alt: null
    }
  }),
  methods: {
    save() {
      this.menu = false;
      this.editor.chain().focus().setImage(this.imageAttrs).run();
    }

  },
  watch: {
    menu() {
      this.imageAttrs = this.editor.getAttributes('image');
    }

  },
  components: {
    MenuButton: __vue_component__$i
  }
};

/* script */
const __vue_script__$6 = script$6;
/* template */

var __vue_render__$6 = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('v-menu', {
    attrs: {
      "transition": "slide-y-transition",
      "close-on-content-click": false,
      "bottom": ""
    },
    scopedSlots: _vm._u([{
      key: "activator",
      fn: function (ref) {
        var on = ref.on;
        var attrs = ref.attrs;
        return [_c('menu-button', _vm._g(_vm._b({
          attrs: {
            "is-active": _vm.editor.isActive('image'),
            "icon": "image-plus",
            "tooltip": "Insert image"
          }
        }, 'menu-button', attrs, false), on))];
      }
    }]),
    model: {
      value: _vm.menu,
      callback: function ($$v) {
        _vm.menu = $$v;
      },
      expression: "menu"
    }
  }, [_vm._v(" "), _c('v-card', {
    attrs: {
      "min-width": "300"
    }
  }, [_c('v-card-text', {
    staticClass: "pb-0"
  }, [_c('v-text-field', {
    ref: "imageUrl",
    attrs: {
      "label": "Url",
      "placeholder": "https://example.com",
      "type": "url"
    },
    model: {
      value: _vm.imageAttrs.src,
      callback: function ($$v) {
        _vm.$set(_vm.imageAttrs, "src", $$v);
      },
      expression: "imageAttrs.src"
    }
  }), _vm._v(" "), _c('v-text-field', {
    attrs: {
      "label": "Alt text"
    },
    model: {
      value: _vm.imageAttrs.alt,
      callback: function ($$v) {
        _vm.$set(_vm.imageAttrs, "alt", $$v);
      },
      expression: "imageAttrs.alt"
    }
  })], 1), _vm._v(" "), _c('v-card-actions', {
    staticClass: "pt-0"
  }, [_c('v-spacer'), _vm._v(" "), _c('v-btn', {
    attrs: {
      "text": ""
    },
    on: {
      "click": _vm.save
    }
  }, [_vm._v("\n        Save\n      ")]), _vm._v(" "), _c('v-btn', {
    attrs: {
      "text": ""
    },
    on: {
      "click": function ($event) {
        _vm.menu = false;
      }
    }
  }, [_vm._v("\n        Close\n      ")])], 1)], 1)], 1);
};

var __vue_staticRenderFns__$6 = [];
/* style */

const __vue_inject_styles__$6 = undefined;
/* scoped */

const __vue_scope_id__$6 = undefined;
/* module identifier */

const __vue_module_identifier__$6 = undefined;
/* functional template */

const __vue_is_functional_template__$6 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$6 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$6,
  staticRenderFns: __vue_staticRenderFns__$6
}, __vue_inject_styles__$6, __vue_script__$6, __vue_scope_id__$6, __vue_is_functional_template__$6, __vue_module_identifier__$6, false, undefined, undefined, undefined);

//
var script$5 = {
  name: 'tce-tiptap-text-align',
  props: {
    editor: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    alignment: 'left'
  }),
  computed: {
    alignments: () => ['left', 'center', 'right', 'justify']
  },
  components: {
    MenuButton: __vue_component__$i
  }
};

/* script */
const __vue_script__$5 = script$5;
/* template */

var __vue_render__$5 = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('v-menu', {
    attrs: {
      "transition": "slide-y-transition",
      "bottom": ""
    },
    scopedSlots: _vm._u([{
      key: "activator",
      fn: function (ref) {
        var on = ref.on;
        var attrs = ref.attrs;
        return [_c('menu-button', _vm._g(_vm._b({
          attrs: {
            "icon": "format-align-left",
            "tooltip": "Align text"
          }
        }, 'menu-button', attrs, false), on), [_c('v-icon', {
          staticClass: "ml-1",
          attrs: {
            "size": "14"
          }
        }, [_vm._v("mdi-chevron-down")])], 1)];
      }
    }])
  }, [_vm._v(" "), _c('v-list', {
    staticClass: "text-alignment",
    attrs: {
      "dense": ""
    }
  }, [_c('v-list-item-group', {
    model: {
      value: _vm.alignment,
      callback: function ($$v) {
        _vm.alignment = $$v;
      },
      expression: "alignment"
    }
  }, _vm._l(_vm.alignments, function (it) {
    return _c('v-list-item', {
      key: it,
      class: {
        'active': _vm.editor.isActive({
          textAlign: it
        })
      },
      attrs: {
        "value": it
      }
    }, [_c('v-list-item-title', [_c('menu-button', {
      attrs: {
        "is-active": _vm.editor.isActive({
          textAlign: it
        }),
        "icon": "format-align-" + it
      },
      on: {
        "click": function ($event) {
          _vm.editor.chain().focus().setTextAlign(it).run();
        }
      }
    })], 1)], 1);
  }), 1)], 1)], 1);
};

var __vue_staticRenderFns__$5 = [];
/* style */

const __vue_inject_styles__$5 = undefined;
/* scoped */

const __vue_scope_id__$5 = "data-v-206fbff0";
/* module identifier */

const __vue_module_identifier__$5 = undefined;
/* functional template */

const __vue_is_functional_template__$5 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$5 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$5,
  staticRenderFns: __vue_staticRenderFns__$5
}, __vue_inject_styles__$5, __vue_script__$5, __vue_scope_id__$5, __vue_is_functional_template__$5, __vue_module_identifier__$5, false, undefined, undefined, undefined);

//
var script$4 = {
  name: 'tce-tiptap-text-color',
  props: {
    editor: {
      type: Object,
      required: true
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onColorChange(color) {
      this.editor.chain().focus().setTextColor(color.hex).run();
    }

  },
  components: {
    MenuButton: __vue_component__$i
  }
};

/* script */
const __vue_script__$4 = script$4;
/* template */

var __vue_render__$4 = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('v-menu', {
    attrs: {
      "transition": "slide-y-transition",
      "bottom": ""
    },
    scopedSlots: _vm._u([{
      key: "activator",
      fn: function (ref) {
        var on = ref.on;
        var attrs = ref.attrs;
        return [_c('menu-button', _vm._g(_vm._b({
          attrs: {
            "is-active": !!_vm.editor.getAttributes('textStyle').color,
            "icon": "palette",
            "tooltip": "Add text color"
          }
        }, 'menu-button', attrs, false), on))];
      }
    }])
  }, [_vm._v(" "), _c('v-color-picker', {
    attrs: {
      "dot-size": "25",
      "mode": "hexa",
      "show-swatches": "",
      "swatches-max-height": "200"
    },
    on: {
      "input": _vm.onColorChange
    }
  })], 1);
};

var __vue_staticRenderFns__$4 = [];
/* style */

const __vue_inject_styles__$4 = undefined;
/* scoped */

const __vue_scope_id__$4 = "data-v-1059d05a";
/* module identifier */

const __vue_module_identifier__$4 = undefined;
/* functional template */

const __vue_is_functional_template__$4 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$4 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$4,
  staticRenderFns: __vue_staticRenderFns__$4
}, __vue_inject_styles__$4, __vue_script__$4, __vue_scope_id__$4, __vue_is_functional_template__$4, __vue_module_identifier__$4, false, undefined, undefined, undefined);

//
var script$3 = {
  name: 'tce-tiptap-text-hightlight',
  props: {
    editor: {
      type: Object,
      required: true
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onColorChange(color) {
      this.editor.chain().focus().setTextHighlight(color.hex).run();
    }

  },
  components: {
    MenuButton: __vue_component__$i
  }
};

/* script */
const __vue_script__$3 = script$3;
/* template */

var __vue_render__$3 = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('v-menu', {
    attrs: {
      "transition": "slide-y-transition",
      "bottom": ""
    },
    scopedSlots: _vm._u([{
      key: "activator",
      fn: function (ref) {
        var on = ref.on;
        var attrs = ref.attrs;
        return [_c('menu-button', _vm._g(_vm._b({
          attrs: {
            "is-active": !!_vm.editor.getAttributes('textStyle').backgroundColor,
            "icon": "format-color-highlight",
            "tooltip": "Highlight text"
          }
        }, 'menu-button', attrs, false), on))];
      }
    }])
  }, [_vm._v(" "), _c('v-color-picker', {
    attrs: {
      "dot-size": "25",
      "mode": "hexa",
      "show-swatches": "",
      "swatches-max-height": "200"
    },
    on: {
      "input": _vm.onColorChange
    }
  })], 1);
};

var __vue_staticRenderFns__$3 = [];
/* style */

const __vue_inject_styles__$3 = undefined;
/* scoped */

const __vue_scope_id__$3 = "data-v-422b3b39";
/* module identifier */

const __vue_module_identifier__$3 = undefined;
/* functional template */

const __vue_is_functional_template__$3 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$3 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$3,
  staticRenderFns: __vue_staticRenderFns__$3
}, __vue_inject_styles__$3, __vue_script__$3, __vue_scope_id__$3, __vue_is_functional_template__$3, __vue_module_identifier__$3, false, undefined, undefined, undefined);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
const INIT_GRID_SIZE = 5;
const MAX_GRID_SIZE = 10;
const DEFAULT_SELECTED_GRID_SIZE = 2;
var script$2 = {
  name: 'tce-tiptap-table-grid',
  data: () => ({
    gridSize: {
      row: INIT_GRID_SIZE,
      col: INIT_GRID_SIZE
    },
    selectedGridSize: {
      row: DEFAULT_SELECTED_GRID_SIZE,
      col: DEFAULT_SELECTED_GRID_SIZE
    }
  }),
  methods: {
    isSelected(row, col) {
      return col <= this.selectedGridSize.col && row <= this.selectedGridSize.row;
    },

    selectGridSize(row, col) {
      if (row === this.gridSize.row) {
        this.gridSize.row = Math.min(row + 1, MAX_GRID_SIZE);
      }

      if (col === this.gridSize.col) {
        this.gridSize.col = Math.min(col + 1, MAX_GRID_SIZE);
      }

      this.selectedGridSize.row = row;
      this.selectedGridSize.col = col;
    },

    onMouseDown(row, col) {
      this.$emit('insert:table', {
        row,
        col
      });
    },

    resetgridSize() {
      this.gridSize = {
        row: INIT_GRID_SIZE,
        col: INIT_GRID_SIZE
      };
      this.selectedGridSize = {
        row: DEFAULT_SELECTED_GRID_SIZE,
        col: DEFAULT_SELECTED_GRID_SIZE
      };
    }

  }
};

/* script */
const __vue_script__$2 = script$2;
/* template */

var __vue_render__$2 = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('v-card', {
    staticClass: "pa-3"
  }, [_c('div', {
    staticClass: "table-grid"
  }, [_c('div', {
    staticClass: "table-grid-wrapper"
  }, _vm._l(_vm.gridSize.row, function (row) {
    return _c('div', {
      key: 'r' + row,
      staticClass: "table-grid-row"
    }, _vm._l(_vm.gridSize.col, function (col) {
      return _c('div', {
        key: 'c' + col,
        staticClass: "table-grid-cell",
        class: {
          'selected': _vm.isSelected(row, col)
        },
        on: {
          "mouseover": function ($event) {
            return _vm.selectGridSize(row, col);
          },
          "mousedown": function ($event) {
            return _vm.onMouseDown(row, col);
          }
        }
      }, [_c('div', {
        staticClass: "table-grid-cell-inner"
      })]);
    }), 0);
  }), 0), _vm._v(" "), _c('div', {
    staticClass: "table-grid-footer"
  }, [_vm._v("\n      " + _vm._s(_vm.selectedGridSize.row) + " x " + _vm._s(_vm.selectedGridSize.col) + "\n    ")])])]);
};

var __vue_staticRenderFns__$2 = [];
/* style */

const __vue_inject_styles__$2 = undefined;
/* scoped */

const __vue_scope_id__$2 = "data-v-6cdcb1b0";
/* module identifier */

const __vue_module_identifier__$2 = undefined;
/* functional template */

const __vue_is_functional_template__$2 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$2 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$2,
  staticRenderFns: __vue_staticRenderFns__$2
}, __vue_inject_styles__$2, __vue_script__$2, __vue_scope_id__$2, __vue_is_functional_template__$2, __vue_module_identifier__$2, false, undefined, undefined, undefined);

//

function isTableActive(state) {
  if (!state) return false;
  const {
    selection,
    doc
  } = state;
  const {
    from,
    to
  } = selection;
  let keepLooking = true;
  let active = false;
  doc.nodesBetween(from, to, node => {
    const name = node.type.name;

    if (keepLooking && (name === 'table' || name === 'table_row' || name === 'table_column' || name === 'table_cell')) {
      keepLooking = false;
      active = true;
    }

    return keepLooking;
  });
  return active;
}

function enableMergeCells(state) {
  return isTableActive(state) && mergeCells(state);
}

function enableSplitCell(state) {
  return isTableActive(state) && splitCell(state);
}

var script$1 = {
  name: 'tce-tiptap-table',
  props: {
    editor: {
      type: Object,
      required: true
    }
  },
  computed: {
    isActive: ({
      editor
    }) => editor.isActive('table'),
    isTableActive: ({
      editor
    }) => isTableActive(editor.state),
    isMergeCellsEnabled: ({
      editor
    }) => enableMergeCells(editor.state),
    isSplitCellEnabled: ({
      editor
    }) => enableSplitCell(editor.state)
  },
  methods: {
    insertTable({
      row,
      col
    }) {
      this.editor.chain().focus().insertTable({
        rowsCount: row,
        colsCount: col,
        withHeaderRow: true
      }).run();
    }

  },
  components: {
    MenuButton: __vue_component__$i,
    TableGrid: __vue_component__$2
  }
};

/* script */
const __vue_script__$1 = script$1;
/* template */

var __vue_render__$1 = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('v-menu', {
    attrs: {
      "transition": "slide-y-transition",
      "bottom": ""
    },
    scopedSlots: _vm._u([{
      key: "activator",
      fn: function (ref) {
        var on = ref.on;
        var attrs = ref.attrs;
        return [_c('menu-button', _vm._g(_vm._b({
          attrs: {
            "is-active": _vm.isActive,
            "icon": "table",
            "tooltip": "Insert table"
          }
        }, 'menu-button', attrs, false), on), [_c('v-icon', {
          staticClass: "ml-1",
          attrs: {
            "size": "14"
          }
        }, [_vm._v("mdi-chevron-down")])], 1)];
      }
    }])
  }, [_vm._v(" "), _c('v-list', {
    attrs: {
      "dense": ""
    }
  }, [_c('v-menu', {
    scopedSlots: _vm._u([{
      key: "activator",
      fn: function (ref) {
        var on = ref.on;
        var attrs = ref.attrs;
        return [_c('v-list-item', _vm._g(_vm._b({
          attrs: {
            "is-active": _vm.isActive
          }
        }, 'v-list-item', attrs, false), on), [_c('v-icon', {
          staticClass: "mr-3",
          attrs: {
            "color": "#333"
          }
        }, [_vm._v("mdi-table-plus")]), _vm._v("\n          Insert table\n        ")], 1)];
      }
    }])
  }, [_vm._v(" "), _c('table-grid', {
    on: {
      "insert:table": _vm.insertTable
    }
  })], 1), _vm._v(" "), _c('v-divider'), _vm._v(" "), _c('v-list-item', {
    attrs: {
      "disabled": !_vm.isTableActive
    },
    on: {
      "click": function ($event) {
        _vm.editor.chain().focus().addColumnBefore().run();
      }
    }
  }, [_c('v-icon', {
    staticClass: "mr-3",
    attrs: {
      "color": "#333",
      "disabled": !_vm.isTableActive
    }
  }, [_vm._v("\n        mdi-table-column-plus-before\n      ")]), _vm._v("\n      Add column before\n    ")], 1), _vm._v(" "), _c('v-list-item', {
    attrs: {
      "disabled": !_vm.isTableActive
    },
    on: {
      "click": function ($event) {
        _vm.editor.chain().focus().addColumnAfter().run();
      }
    }
  }, [_c('v-icon', {
    staticClass: "mr-3",
    attrs: {
      "color": "#333",
      "disabled": !_vm.isTableActive
    }
  }, [_vm._v("\n        mdi-table-column-plus-after\n      ")]), _vm._v("\n      Add column after\n    ")], 1), _vm._v(" "), _c('v-list-item', {
    attrs: {
      "disabled": !_vm.isTableActive
    },
    on: {
      "click": function ($event) {
        _vm.editor.chain().focus().deleteColumn().run();
      }
    }
  }, [_c('v-icon', {
    staticClass: "mr-3",
    attrs: {
      "color": "#333",
      "disabled": !_vm.isTableActive
    }
  }, [_vm._v("\n        mdi-table-column-remove\n      ")]), _vm._v("\n      Delete column\n    ")], 1), _vm._v(" "), _c('v-divider'), _vm._v(" "), _c('v-list-item', {
    attrs: {
      "disabled": !_vm.isTableActive
    },
    on: {
      "click": function ($event) {
        _vm.editor.chain().focus().addRowBefore().run();
      }
    }
  }, [_c('v-icon', {
    staticClass: "mr-3",
    attrs: {
      "color": "#333",
      "disabled": !_vm.isTableActive
    }
  }, [_vm._v("\n        mdi-table-row-plus-before\n      ")]), _vm._v(" Add row before\n    ")], 1), _vm._v(" "), _c('v-list-item', {
    attrs: {
      "disabled": !_vm.isTableActive
    },
    on: {
      "click": function ($event) {
        _vm.editor.chain().focus().addRowAfter().run();
      }
    }
  }, [_c('v-icon', {
    staticClass: "mr-3",
    attrs: {
      "color": "#333",
      "disabled": !_vm.isTableActive
    }
  }, [_vm._v("\n        mdi-table-row-plus-after\n      ")]), _vm._v(" Add row after\n    ")], 1), _vm._v(" "), _c('v-list-item', {
    attrs: {
      "disabled": !_vm.isTableActive
    },
    on: {
      "click": function ($event) {
        _vm.editor.chain().focus().deleteRow().run();
      }
    }
  }, [_c('v-icon', {
    staticClass: "mr-3",
    attrs: {
      "color": "#333",
      "disabled": !_vm.isTableActive
    }
  }, [_vm._v("\n        mdi-table-row-remove\n      ")]), _vm._v(" Delete row\n    ")], 1), _vm._v(" "), _c('v-divider'), _vm._v(" "), _c('v-list-item', {
    attrs: {
      "disabled": !_vm.isMergeCellsEnabled
    },
    on: {
      "click": function ($event) {
        _vm.editor.chain().focus().mergeCells().run();
      }
    }
  }, [_c('v-icon', {
    staticClass: "mr-3",
    attrs: {
      "color": "#333",
      "disabled": !_vm.isMergeCellsEnabled
    }
  }, [_vm._v("\n        mdi-table-merge-cells\n      ")]), _vm._v(" Merge cells\n    ")], 1), _vm._v(" "), _c('v-list-item', {
    attrs: {
      "disabled": !_vm.isSplitCellEnabled
    },
    on: {
      "click": function ($event) {
        _vm.editor.chain().focus().splitCell().run();
      }
    }
  }, [_c('v-icon', {
    staticClass: "mr-3",
    attrs: {
      "color": "#333",
      "disabled": !_vm.isSplitCellEnabled
    }
  }, [_vm._v("\n        mdi-table-split-cell\n      ")]), _vm._v(" Split cell\n    ")], 1), _vm._v(" "), _c('v-divider'), _vm._v(" "), _c('v-list-item', {
    attrs: {
      "disabled": !_vm.isTableActive
    },
    on: {
      "click": function ($event) {
        _vm.editor.chain().focus().deleteTable().run();
      }
    }
  }, [_c('v-icon', {
    staticClass: "mr-3",
    attrs: {
      "color": "#333",
      "disabled": !_vm.isTableActive
    }
  }, [_vm._v("\n        mdi-table-cancel\n      ")]), _vm._v(" Delete table\n    ")], 1)], 1)], 1);
};

var __vue_staticRenderFns__$1 = [];
/* style */

const __vue_inject_styles__$1 = undefined;
/* scoped */

const __vue_scope_id__$1 = undefined;
/* module identifier */

const __vue_module_identifier__$1 = undefined;
/* functional template */

const __vue_is_functional_template__$1 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$1 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$1,
  staticRenderFns: __vue_staticRenderFns__$1
}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, undefined, undefined, undefined);

//
var script = {
  inject: ['$elementBus'],
  name: 'tce-tiptap-toolbar',
  data: () => ({
    editor: null
  }),

  created() {
    this.$elementBus.on('tiptap-editor', editor => {
      this.editor = editor;
    });
  },

  components: {
    TextColor: __vue_component__$4,
    TextHighlight: __vue_component__$3,
    FontSize: __vue_component__$8,
    FontFamily: __vue_component__$9,
    Heading: __vue_component__$7,
    TceImage: __vue_component__$6,
    MenuButton: __vue_component__$i,
    LinkButton: __vue_component__$d,
    TiptapTable: __vue_component__$1,
    TextAlign: __vue_component__$5
  }
};

/* script */
const __vue_script__ = script;
/* template */

var __vue_render__ = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _vm.editor ? _c('div', {
    staticClass: "toolbar"
  }, [_c('menu-button', {
    attrs: {
      "is-active": _vm.editor.isActive('code'),
      "icon": "code-tags",
      "tooltip": "Code"
    },
    on: {
      "click": function ($event) {
        _vm.editor.chain().focus().toggleCode().run();
      }
    }
  }), _vm._v(" "), _c('v-divider', {
    attrs: {
      "vertical": ""
    }
  }), _vm._v(" "), _c('menu-button', {
    attrs: {
      "icon": "undo",
      "tooltip": "Undo"
    },
    on: {
      "click": function ($event) {
        _vm.editor.chain().focus().undo().run();
      }
    }
  }), _vm._v(" "), _c('menu-button', {
    attrs: {
      "icon": "redo",
      "tooltip": "Redo"
    },
    on: {
      "click": function ($event) {
        _vm.editor.chain().focus().redo().run();
      }
    }
  }), _vm._v(" "), _c('v-divider', {
    attrs: {
      "vertical": ""
    }
  }), _vm._v(" "), _c('heading', {
    attrs: {
      "editor": _vm.editor
    }
  }), _vm._v(" "), _c('font-family', {
    attrs: {
      "editor": _vm.editor
    }
  }), _vm._v(" "), _c('font-size', {
    attrs: {
      "editor": _vm.editor
    }
  }), _vm._v(" "), _c('v-divider', {
    attrs: {
      "vertical": ""
    }
  }), _vm._v(" "), _c('menu-button', {
    attrs: {
      "is-active": _vm.editor.isActive('bold'),
      "icon": "format-bold",
      "tooltip": "Bold"
    },
    on: {
      "click": function ($event) {
        _vm.editor.chain().focus().toggleBold().run();
      }
    }
  }), _vm._v(" "), _c('menu-button', {
    attrs: {
      "is-active": _vm.editor.isActive('italic'),
      "icon": "format-italic",
      "tooltip": "Italic"
    },
    on: {
      "click": function ($event) {
        _vm.editor.chain().focus().toggleItalic().run();
      }
    }
  }), _vm._v(" "), _c('menu-button', {
    attrs: {
      "is-active": _vm.editor.isActive('underline'),
      "icon": "format-underline",
      "tooltip": "Underline"
    },
    on: {
      "click": function ($event) {
        _vm.editor.chain().focus().toggleUnderline().run();
      }
    }
  }), _vm._v(" "), _c('menu-button', {
    attrs: {
      "is-active": _vm.editor.isActive('strike'),
      "icon": "format-strikethrough",
      "tooltip": "Strikethrough"
    },
    on: {
      "click": function ($event) {
        _vm.editor.chain().focus().toggleStrike().run();
      }
    }
  }), _vm._v(" "), _c('v-divider', {
    attrs: {
      "vertical": ""
    }
  }), _vm._v(" "), _c('tiptap-table', {
    attrs: {
      "editor": _vm.editor
    }
  }), _vm._v(" "), _c('text-color', {
    attrs: {
      "editor": _vm.editor
    }
  }), _vm._v(" "), _c('text-highlight', {
    attrs: {
      "editor": _vm.editor
    }
  }), _vm._v(" "), _c('v-divider', {
    attrs: {
      "vertical": ""
    }
  }), _vm._v(" "), _c('menu-button', {
    attrs: {
      "is-active": _vm.editor.isActive('bulletList'),
      "icon": "format-list-bulleted",
      "tooltip": "Bullet list"
    },
    on: {
      "click": function ($event) {
        _vm.editor.chain().focus().toggleBulletList().run();
      }
    }
  }), _vm._v(" "), _c('menu-button', {
    attrs: {
      "is-active": _vm.editor.isActive('orderedList'),
      "icon": "format-list-numbered",
      "tooltip": "Numbered list"
    },
    on: {
      "click": function ($event) {
        _vm.editor.chain().focus().toggleOrderedList().run();
      }
    }
  }), _vm._v(" "), _c('text-align', {
    attrs: {
      "editor": _vm.editor
    }
  }), _vm._v(" "), _c('menu-button', {
    attrs: {
      "icon": "format-indent-decrease",
      "tooltip": "Outdent"
    },
    on: {
      "click": function ($event) {
        _vm.editor.chain().focus().outdent(5).run();
      }
    }
  }), _vm._v(" "), _c('menu-button', {
    attrs: {
      "icon": "format-indent-increase",
      "tooltip": "Indent"
    },
    on: {
      "click": function ($event) {
        _vm.editor.chain().focus().indent(5).run();
      }
    }
  }), _vm._v(" "), _c('v-divider', {
    attrs: {
      "vertical": ""
    }
  }), _vm._v(" "), _c('menu-button', {
    attrs: {
      "is-active": _vm.editor.isActive('horizontalRule'),
      "icon": "minus",
      "tooltip": "Horizontal rule"
    },
    on: {
      "click": function ($event) {
        _vm.editor.chain().focus().setHorizontalRule().run();
      }
    }
  }), _vm._v(" "), _c('menu-button', {
    attrs: {
      "is-active": _vm.editor.isActive('blockquote'),
      "icon": "format-quote-close",
      "tooltip": "Blockquote"
    },
    on: {
      "click": function ($event) {
        _vm.editor.chain().focus().toggleBlockquote().run();
      }
    }
  }), _vm._v(" "), _c('v-divider', {
    attrs: {
      "vertical": ""
    }
  }), _vm._v(" "), _c('link-button', {
    attrs: {
      "editor": _vm.editor,
      "icon": "link"
    }
  }), _vm._v(" "), _c('tce-image', {
    attrs: {
      "editor": _vm.editor
    }
  }), _vm._v(" "), _c('v-divider', {
    attrs: {
      "vertical": ""
    }
  }), _vm._v(" "), _c('menu-button', {
    attrs: {
      "icon": "format-clear",
      "tooltip": "Clear formating"
    },
    on: {
      "click": function ($event) {
        _vm.editor.chain().focus().unsetAllMarks().run();
      }
    }
  })], 1) : _vm._e();
};

var __vue_staticRenderFns__ = [];
/* style */

const __vue_inject_styles__ = undefined;
/* scoped */

const __vue_scope_id__ = "data-v-d8b596e2";
/* module identifier */

const __vue_module_identifier__ = undefined;
/* functional template */

const __vue_is_functional_template__ = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);

var plugin__default = {
  initState: () => ({}),
  components: {
    Edit: __vue_component__$a,
    Toolbar: __vue_component__
  }
};

var plugin = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Edit: __vue_component__$a,
  Toolbar: __vue_component__,
  'default': plugin__default
});

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
    return;
  }

  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

/**
 * Special language-specific overrides.
 *
 * Source: ftp://ftp.unicode.org/Public/UCD/latest/ucd/SpecialCasing.txt
 *
 * @type {Object}
 */
var LANGUAGES = {
  tr: {
    regexp: /\u0130|\u0049|\u0049\u0307/g,
    map: {
      '\u0130': '\u0069',
      '\u0049': '\u0131',
      '\u0049\u0307': '\u0069'
    }
  },
  az: {
    regexp: /[\u0130]/g,
    map: {
      '\u0130': '\u0069',
      '\u0049': '\u0131',
      '\u0049\u0307': '\u0069'
    }
  },
  lt: {
    regexp: /[\u0049\u004A\u012E\u00CC\u00CD\u0128]/g,
    map: {
      '\u0049': '\u0069\u0307',
      '\u004A': '\u006A\u0307',
      '\u012E': '\u012F\u0307',
      '\u00CC': '\u0069\u0307\u0300',
      '\u00CD': '\u0069\u0307\u0301',
      '\u0128': '\u0069\u0307\u0303'
    }
  }
};

/**
 * Lowercase a string.
 *
 * @param  {String} str
 * @return {String}
 */
var lowerCase = function (str, locale) {
  var lang = LANGUAGES[locale];

  str = str == null ? '' : String(str);

  if (lang) {
    str = str.replace(lang.regexp, function (m) { return lang.map[m] });
  }

  return str.toLowerCase()
};

var nonWordRegexp = /[^A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC0-9\xB2\xB3\xB9\xBC-\xBE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19]+/g;

var camelCaseRegexp = /([a-z\xB5\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0529\u052B\u052D\u052F\u0561-\u0587\u13F8-\u13FD\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA699\uA69B\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793-\uA795\uA797\uA799\uA79B\uA79D\uA79F\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7B5\uA7B7\uA7FA\uAB30-\uAB5A\uAB60-\uAB65\uAB70-\uABBF\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A0-9\xB2\xB3\xB9\xBC-\xBE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19])([A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AD\uA7B0-\uA7B4\uA7B6\uFF21-\uFF3A])/g;

var camelCaseUpperRegexp = /([A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AD\uA7B0-\uA7B4\uA7B6\uFF21-\uFF3A])([A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AD\uA7B0-\uA7B4\uA7B6\uFF21-\uFF3A][a-z\xB5\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0529\u052B\u052D\u052F\u0561-\u0587\u13F8-\u13FD\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA699\uA69B\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793-\uA795\uA797\uA799\uA79B\uA79D\uA79F\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7B5\uA7B7\uA7FA\uAB30-\uAB5A\uAB60-\uAB65\uAB70-\uABBF\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A])/g;

/**
 * Sentence case a string.
 *
 * @param  {string} str
 * @param  {string} locale
 * @param  {string} replacement
 * @return {string}
 */
var noCase = function (str, locale, replacement) {
  if (str == null) {
    return ''
  }

  replacement = typeof replacement !== 'string' ? ' ' : replacement;

  function replace (match, index, value) {
    if (index === 0 || index === (value.length - match.length)) {
      return ''
    }

    return replacement
  }

  str = String(str)
    // Support camel case ("camelCase" -> "camel Case").
    .replace(camelCaseRegexp, '$1 $2')
    // Support odd camel case ("CAMELCase" -> "CAMEL Case").
    .replace(camelCaseUpperRegexp, '$1 $2')
    // Remove all non-word characters and replace with a single space.
    .replace(nonWordRegexp, replace);

  // Lower case the entire string.
  return lowerCase(str, locale)
};

/**
 * Param case a string.
 *
 * @param  {string} value
 * @param  {string} [locale]
 * @return {string}
 */
var paramCase = function (value, locale) {
  return noCase(value, locale, '-')
};

var hasProp = function hasProp(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
};

var isFunction = function isFunction(arg) {
  return typeof arg === 'function';
};
var _pluginOptions$initSt = plugin__default.initState,
    initState = _pluginOptions$initSt === void 0 ? function () {
  return {};
} : _pluginOptions$initSt,
    _pluginOptions$compon = plugin__default.components,
    components = _pluginOptions$compon === void 0 ? {} : _pluginOptions$compon;
var options = Object.assign({
  version: version,
  initState: initState,
  components: components
}, tailor);
var install = function install(Vue) {
  if (hasProp(plugin, 'install')) {
    isFunction(_missingExportShim) && _missingExportShim(Vue);
  }

  Object.entries(components).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        name$1 = _ref2[0],
        component = _ref2[1];

    name$1 = paramCase(name$1);
    if (name$1 === 'edit') Vue.component(name, component);
    Vue.component("".concat(name, "--").concat(name$1), component);
  });
};

export default install;
export { __vue_component__$a as Edit, __vue_component__ as Toolbar, install, options };
