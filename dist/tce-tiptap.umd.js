(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tiptap/vue-2'), require('@tiptap/extension-image'), require('@tiptap/extension-text-style'), require('@tiptap/extension-font-family'), require('@tiptap/extension-link'), require('@tiptap/extension-table'), require('@tiptap/extension-table-cell'), require('@tiptap/extension-table-header'), require('@tiptap/extension-table-row'), require('@tiptap/extension-text-align'), require('@tiptap/extension-underline')) :
  typeof define === 'function' && define.amd ? define(['exports', '@tiptap/vue-2', '@tiptap/extension-image', '@tiptap/extension-text-style', '@tiptap/extension-font-family', '@tiptap/extension-link', '@tiptap/extension-table', '@tiptap/extension-table-cell', '@tiptap/extension-table-header', '@tiptap/extension-table-row', '@tiptap/extension-text-align', '@tiptap/extension-underline'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.__TAILOR_CONTENT_ELEMENTS__ = global.__TAILOR_CONTENT_ELEMENTS__ || {}, global.__TAILOR_CONTENT_ELEMENTS__['@extensionengine/tce-tiptap'] = {}), global.vue2, global.Image$1, global.TextStyle, global.FontFamily, global.Link, global.Table, global.TableCell, global.TableHeader, global.TableRow, global.TextAlign, global.Underline));
}(this, (function (exports, vue2, Image$1, TextStyle, FontFamily, Link, Table, TableCell, TableHeader, TableRow, TextAlign, Underline) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var Image__default = /*#__PURE__*/_interopDefaultLegacy(Image$1);
  var TextStyle__default = /*#__PURE__*/_interopDefaultLegacy(TextStyle);
  var FontFamily__default = /*#__PURE__*/_interopDefaultLegacy(FontFamily);
  var Link__default = /*#__PURE__*/_interopDefaultLegacy(Link);
  var Table__default = /*#__PURE__*/_interopDefaultLegacy(Table);
  var TableCell__default = /*#__PURE__*/_interopDefaultLegacy(TableCell);
  var TableHeader__default = /*#__PURE__*/_interopDefaultLegacy(TableHeader);
  var TableRow__default = /*#__PURE__*/_interopDefaultLegacy(TableRow);
  var TextAlign__default = /*#__PURE__*/_interopDefaultLegacy(TextAlign);
  var Underline__default = /*#__PURE__*/_interopDefaultLegacy(Underline);

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

  function findDiffStart(a, b, pos) {
    for (var i = 0;; i++) {
      if (i == a.childCount || i == b.childCount)
        { return a.childCount == b.childCount ? null : pos }

      var childA = a.child(i), childB = b.child(i);
      if (childA == childB) { pos += childA.nodeSize; continue }

      if (!childA.sameMarkup(childB)) { return pos }

      if (childA.isText && childA.text != childB.text) {
        for (var j = 0; childA.text[j] == childB.text[j]; j++)
          { pos++; }
        return pos
      }
      if (childA.content.size || childB.content.size) {
        var inner = findDiffStart(childA.content, childB.content, pos + 1);
        if (inner != null) { return inner }
      }
      pos += childA.nodeSize;
    }
  }

  function findDiffEnd(a, b, posA, posB) {
    for (var iA = a.childCount, iB = b.childCount;;) {
      if (iA == 0 || iB == 0)
        { return iA == iB ? null : {a: posA, b: posB} }

      var childA = a.child(--iA), childB = b.child(--iB), size = childA.nodeSize;
      if (childA == childB) {
        posA -= size; posB -= size;
        continue
      }

      if (!childA.sameMarkup(childB)) { return {a: posA, b: posB} }

      if (childA.isText && childA.text != childB.text) {
        var same = 0, minSize = Math.min(childA.text.length, childB.text.length);
        while (same < minSize && childA.text[childA.text.length - same - 1] == childB.text[childB.text.length - same - 1]) {
          same++; posA--; posB--;
        }
        return {a: posA, b: posB}
      }
      if (childA.content.size || childB.content.size) {
        var inner = findDiffEnd(childA.content, childB.content, posA - 1, posB - 1);
        if (inner) { return inner }
      }
      posA -= size; posB -= size;
    }
  }

  // ::- A fragment represents a node's collection of child nodes.
  //
  // Like nodes, fragments are persistent data structures, and you
  // should not mutate them or their content. Rather, you create new
  // instances whenever needed. The API tries to make this easy.
  var Fragment = function Fragment(content, size) {
    this.content = content;
    // :: number
    // The size of the fragment, which is the total of the size of its
    // content nodes.
    this.size = size || 0;
    if (size == null) { for (var i = 0; i < content.length; i++)
      { this.size += content[i].nodeSize; } }
  };

  var prototypeAccessors$5 = { firstChild: { configurable: true },lastChild: { configurable: true },childCount: { configurable: true } };

  // :: (number, number, (node: Node, start: number, parent: Node, index: number) → ?bool, ?number)
  // Invoke a callback for all descendant nodes between the given two
  // positions (relative to start of this fragment). Doesn't descend
  // into a node when the callback returns `false`.
  Fragment.prototype.nodesBetween = function nodesBetween (from, to, f, nodeStart, parent) {
      if ( nodeStart === void 0 ) nodeStart = 0;

    for (var i = 0, pos = 0; pos < to; i++) {
      var child = this.content[i], end = pos + child.nodeSize;
      if (end > from && f(child, nodeStart + pos, parent, i) !== false && child.content.size) {
        var start = pos + 1;
        child.nodesBetween(Math.max(0, from - start),
                           Math.min(child.content.size, to - start),
                           f, nodeStart + start);
      }
      pos = end;
    }
  };

  // :: ((node: Node, pos: number, parent: Node) → ?bool)
  // Call the given callback for every descendant node. The callback
  // may return `false` to prevent traversal of a given node's children.
  Fragment.prototype.descendants = function descendants (f) {
    this.nodesBetween(0, this.size, f);
  };

  // :: (number, number, ?string, ?string) → string
  // Extract the text between `from` and `to`. See the same method on
  // [`Node`](#model.Node.textBetween).
  Fragment.prototype.textBetween = function textBetween (from, to, blockSeparator, leafText) {
    var text = "", separated = true;
    this.nodesBetween(from, to, function (node, pos) {
      if (node.isText) {
        text += node.text.slice(Math.max(from, pos) - pos, to - pos);
        separated = !blockSeparator;
      } else if (node.isLeaf && leafText) {
        text += leafText;
        separated = !blockSeparator;
      } else if (!separated && node.isBlock) {
        text += blockSeparator;
        separated = true;
      }
    }, 0);
    return text
  };

  // :: (Fragment) → Fragment
  // Create a new fragment containing the combined content of this
  // fragment and the other.
  Fragment.prototype.append = function append (other) {
    if (!other.size) { return this }
    if (!this.size) { return other }
    var last = this.lastChild, first = other.firstChild, content = this.content.slice(), i = 0;
    if (last.isText && last.sameMarkup(first)) {
      content[content.length - 1] = last.withText(last.text + first.text);
      i = 1;
    }
    for (; i < other.content.length; i++) { content.push(other.content[i]); }
    return new Fragment(content, this.size + other.size)
  };

  // :: (number, ?number) → Fragment
  // Cut out the sub-fragment between the two given positions.
  Fragment.prototype.cut = function cut (from, to) {
    if (to == null) { to = this.size; }
    if (from == 0 && to == this.size) { return this }
    var result = [], size = 0;
    if (to > from) { for (var i = 0, pos = 0; pos < to; i++) {
      var child = this.content[i], end = pos + child.nodeSize;
      if (end > from) {
        if (pos < from || end > to) {
          if (child.isText)
            { child = child.cut(Math.max(0, from - pos), Math.min(child.text.length, to - pos)); }
          else
            { child = child.cut(Math.max(0, from - pos - 1), Math.min(child.content.size, to - pos - 1)); }
        }
        result.push(child);
        size += child.nodeSize;
      }
      pos = end;
    } }
    return new Fragment(result, size)
  };

  Fragment.prototype.cutByIndex = function cutByIndex (from, to) {
    if (from == to) { return Fragment.empty }
    if (from == 0 && to == this.content.length) { return this }
    return new Fragment(this.content.slice(from, to))
  };

  // :: (number, Node) → Fragment
  // Create a new fragment in which the node at the given index is
  // replaced by the given node.
  Fragment.prototype.replaceChild = function replaceChild (index, node) {
    var current = this.content[index];
    if (current == node) { return this }
    var copy = this.content.slice();
    var size = this.size + node.nodeSize - current.nodeSize;
    copy[index] = node;
    return new Fragment(copy, size)
  };

  // : (Node) → Fragment
  // Create a new fragment by prepending the given node to this
  // fragment.
  Fragment.prototype.addToStart = function addToStart (node) {
    return new Fragment([node].concat(this.content), this.size + node.nodeSize)
  };

  // : (Node) → Fragment
  // Create a new fragment by appending the given node to this
  // fragment.
  Fragment.prototype.addToEnd = function addToEnd (node) {
    return new Fragment(this.content.concat(node), this.size + node.nodeSize)
  };

  // :: (Fragment) → bool
  // Compare this fragment to another one.
  Fragment.prototype.eq = function eq (other) {
    if (this.content.length != other.content.length) { return false }
    for (var i = 0; i < this.content.length; i++)
      { if (!this.content[i].eq(other.content[i])) { return false } }
    return true
  };

  // :: ?Node
  // The first child of the fragment, or `null` if it is empty.
  prototypeAccessors$5.firstChild.get = function () { return this.content.length ? this.content[0] : null };

  // :: ?Node
  // The last child of the fragment, or `null` if it is empty.
  prototypeAccessors$5.lastChild.get = function () { return this.content.length ? this.content[this.content.length - 1] : null };

  // :: number
  // The number of child nodes in this fragment.
  prototypeAccessors$5.childCount.get = function () { return this.content.length };

  // :: (number) → Node
  // Get the child node at the given index. Raise an error when the
  // index is out of range.
  Fragment.prototype.child = function child (index) {
    var found = this.content[index];
    if (!found) { throw new RangeError("Index " + index + " out of range for " + this) }
    return found
  };

  // :: (number) → ?Node
  // Get the child node at the given index, if it exists.
  Fragment.prototype.maybeChild = function maybeChild (index) {
    return this.content[index]
  };

  // :: ((node: Node, offset: number, index: number))
  // Call `f` for every child node, passing the node, its offset
  // into this parent node, and its index.
  Fragment.prototype.forEach = function forEach (f) {
    for (var i = 0, p = 0; i < this.content.length; i++) {
      var child = this.content[i];
      f(child, p, i);
      p += child.nodeSize;
    }
  };

  // :: (Fragment) → ?number
  // Find the first position at which this fragment and another
  // fragment differ, or `null` if they are the same.
  Fragment.prototype.findDiffStart = function findDiffStart$1 (other, pos) {
      if ( pos === void 0 ) pos = 0;

    return findDiffStart(this, other, pos)
  };

  // :: (Fragment) → ?{a: number, b: number}
  // Find the first position, searching from the end, at which this
  // fragment and the given fragment differ, or `null` if they are the
  // same. Since this position will not be the same in both nodes, an
  // object with two separate positions is returned.
  Fragment.prototype.findDiffEnd = function findDiffEnd$1 (other, pos, otherPos) {
      if ( pos === void 0 ) pos = this.size;
      if ( otherPos === void 0 ) otherPos = other.size;

    return findDiffEnd(this, other, pos, otherPos)
  };

  // : (number, ?number) → {index: number, offset: number}
  // Find the index and inner offset corresponding to a given relative
  // position in this fragment. The result object will be reused
  // (overwritten) the next time the function is called. (Not public.)
  Fragment.prototype.findIndex = function findIndex (pos, round) {
      if ( round === void 0 ) round = -1;

    if (pos == 0) { return retIndex(0, pos) }
    if (pos == this.size) { return retIndex(this.content.length, pos) }
    if (pos > this.size || pos < 0) { throw new RangeError(("Position " + pos + " outside of fragment (" + (this) + ")")) }
    for (var i = 0, curPos = 0;; i++) {
      var cur = this.child(i), end = curPos + cur.nodeSize;
      if (end >= pos) {
        if (end == pos || round > 0) { return retIndex(i + 1, end) }
        return retIndex(i, curPos)
      }
      curPos = end;
    }
  };

  // :: () → string
  // Return a debugging string that describes this fragment.
  Fragment.prototype.toString = function toString () { return "<" + this.toStringInner() + ">" };

  Fragment.prototype.toStringInner = function toStringInner () { return this.content.join(", ") };

  // :: () → ?Object
  // Create a JSON-serializeable representation of this fragment.
  Fragment.prototype.toJSON = function toJSON () {
    return this.content.length ? this.content.map(function (n) { return n.toJSON(); }) : null
  };

  // :: (Schema, ?Object) → Fragment
  // Deserialize a fragment from its JSON representation.
  Fragment.fromJSON = function fromJSON (schema, value) {
    if (!value) { return Fragment.empty }
    if (!Array.isArray(value)) { throw new RangeError("Invalid input for Fragment.fromJSON") }
    return new Fragment(value.map(schema.nodeFromJSON))
  };

  // :: ([Node]) → Fragment
  // Build a fragment from an array of nodes. Ensures that adjacent
  // text nodes with the same marks are joined together.
  Fragment.fromArray = function fromArray (array) {
    if (!array.length) { return Fragment.empty }
    var joined, size = 0;
    for (var i = 0; i < array.length; i++) {
      var node = array[i];
      size += node.nodeSize;
      if (i && node.isText && array[i - 1].sameMarkup(node)) {
        if (!joined) { joined = array.slice(0, i); }
        joined[joined.length - 1] = node.withText(joined[joined.length - 1].text + node.text);
      } else if (joined) {
        joined.push(node);
      }
    }
    return new Fragment(joined || array, size)
  };

  // :: (?union<Fragment, Node, [Node]>) → Fragment
  // Create a fragment from something that can be interpreted as a set
  // of nodes. For `null`, it returns the empty fragment. For a
  // fragment, the fragment itself. For a node or array of nodes, a
  // fragment containing those nodes.
  Fragment.from = function from (nodes) {
    if (!nodes) { return Fragment.empty }
    if (nodes instanceof Fragment) { return nodes }
    if (Array.isArray(nodes)) { return this.fromArray(nodes) }
    if (nodes.attrs) { return new Fragment([nodes], nodes.nodeSize) }
    throw new RangeError("Can not convert " + nodes + " to a Fragment" +
                         (nodes.nodesBetween ? " (looks like multiple versions of prosemirror-model were loaded)" : ""))
  };

  Object.defineProperties( Fragment.prototype, prototypeAccessors$5 );

  var found = {index: 0, offset: 0};
  function retIndex(index, offset) {
    found.index = index;
    found.offset = offset;
    return found
  }

  // :: Fragment
  // An empty fragment. Intended to be reused whenever a node doesn't
  // contain anything (rather than allocating a new empty fragment for
  // each leaf node).
  Fragment.empty = new Fragment([], 0);

  function compareDeep(a, b) {
    if (a === b) { return true }
    if (!(a && typeof a == "object") ||
        !(b && typeof b == "object")) { return false }
    var array = Array.isArray(a);
    if (Array.isArray(b) != array) { return false }
    if (array) {
      if (a.length != b.length) { return false }
      for (var i = 0; i < a.length; i++) { if (!compareDeep(a[i], b[i])) { return false } }
    } else {
      for (var p in a) { if (!(p in b) || !compareDeep(a[p], b[p])) { return false } }
      for (var p$1 in b) { if (!(p$1 in a)) { return false } }
    }
    return true
  }

  // ::- A mark is a piece of information that can be attached to a node,
  // such as it being emphasized, in code font, or a link. It has a type
  // and optionally a set of attributes that provide further information
  // (such as the target of the link). Marks are created through a
  // `Schema`, which controls which types exist and which
  // attributes they have.
  var Mark$1 = function Mark(type, attrs) {
    // :: MarkType
    // The type of this mark.
    this.type = type;
    // :: Object
    // The attributes associated with this mark.
    this.attrs = attrs;
  };

  // :: ([Mark]) → [Mark]
  // Given a set of marks, create a new set which contains this one as
  // well, in the right position. If this mark is already in the set,
  // the set itself is returned. If any marks that are set to be
  // [exclusive](#model.MarkSpec.excludes) with this mark are present,
  // those are replaced by this one.
  Mark$1.prototype.addToSet = function addToSet (set) {
    var copy, placed = false;
    for (var i = 0; i < set.length; i++) {
      var other = set[i];
      if (this.eq(other)) { return set }
      if (this.type.excludes(other.type)) {
        if (!copy) { copy = set.slice(0, i); }
      } else if (other.type.excludes(this.type)) {
        return set
      } else {
        if (!placed && other.type.rank > this.type.rank) {
          if (!copy) { copy = set.slice(0, i); }
          copy.push(this);
          placed = true;
        }
        if (copy) { copy.push(other); }
      }
    }
    if (!copy) { copy = set.slice(); }
    if (!placed) { copy.push(this); }
    return copy
  };

  // :: ([Mark]) → [Mark]
  // Remove this mark from the given set, returning a new set. If this
  // mark is not in the set, the set itself is returned.
  Mark$1.prototype.removeFromSet = function removeFromSet (set) {
    for (var i = 0; i < set.length; i++)
      { if (this.eq(set[i]))
        { return set.slice(0, i).concat(set.slice(i + 1)) } }
    return set
  };

  // :: ([Mark]) → bool
  // Test whether this mark is in the given set of marks.
  Mark$1.prototype.isInSet = function isInSet (set) {
    for (var i = 0; i < set.length; i++)
      { if (this.eq(set[i])) { return true } }
    return false
  };

  // :: (Mark) → bool
  // Test whether this mark has the same type and attributes as
  // another mark.
  Mark$1.prototype.eq = function eq (other) {
    return this == other ||
      (this.type == other.type && compareDeep(this.attrs, other.attrs))
  };

  // :: () → Object
  // Convert this mark to a JSON-serializeable representation.
  Mark$1.prototype.toJSON = function toJSON () {
    var obj = {type: this.type.name};
    for (var _ in this.attrs) {
      obj.attrs = this.attrs;
      break
    }
    return obj
  };

  // :: (Schema, Object) → Mark
  Mark$1.fromJSON = function fromJSON (schema, json) {
    if (!json) { throw new RangeError("Invalid input for Mark.fromJSON") }
    var type = schema.marks[json.type];
    if (!type) { throw new RangeError(("There is no mark type " + (json.type) + " in this schema")) }
    return type.create(json.attrs)
  };

  // :: ([Mark], [Mark]) → bool
  // Test whether two sets of marks are identical.
  Mark$1.sameSet = function sameSet (a, b) {
    if (a == b) { return true }
    if (a.length != b.length) { return false }
    for (var i = 0; i < a.length; i++)
      { if (!a[i].eq(b[i])) { return false } }
    return true
  };

  // :: (?union<Mark, [Mark]>) → [Mark]
  // Create a properly sorted mark set from null, a single mark, or an
  // unsorted array of marks.
  Mark$1.setFrom = function setFrom (marks) {
    if (!marks || marks.length == 0) { return Mark$1.none }
    if (marks instanceof Mark$1) { return [marks] }
    var copy = marks.slice();
    copy.sort(function (a, b) { return a.type.rank - b.type.rank; });
    return copy
  };

  // :: [Mark] The empty set of marks.
  Mark$1.none = [];

  // ReplaceError:: class extends Error
  // Error type raised by [`Node.replace`](#model.Node.replace) when
  // given an invalid replacement.

  function ReplaceError(message) {
    var err = Error.call(this, message);
    err.__proto__ = ReplaceError.prototype;
    return err
  }

  ReplaceError.prototype = Object.create(Error.prototype);
  ReplaceError.prototype.constructor = ReplaceError;
  ReplaceError.prototype.name = "ReplaceError";

  // ::- A slice represents a piece cut out of a larger document. It
  // stores not only a fragment, but also the depth up to which nodes on
  // both side are ‘open’ (cut through).
  var Slice = function Slice(content, openStart, openEnd) {
    // :: Fragment The slice's content.
    this.content = content;
    // :: number The open depth at the start.
    this.openStart = openStart;
    // :: number The open depth at the end.
    this.openEnd = openEnd;
  };

  var prototypeAccessors$1$3 = { size: { configurable: true } };

  // :: number
  // The size this slice would add when inserted into a document.
  prototypeAccessors$1$3.size.get = function () {
    return this.content.size - this.openStart - this.openEnd
  };

  Slice.prototype.insertAt = function insertAt (pos, fragment) {
    var content = insertInto(this.content, pos + this.openStart, fragment, null);
    return content && new Slice(content, this.openStart, this.openEnd)
  };

  Slice.prototype.removeBetween = function removeBetween (from, to) {
    return new Slice(removeRange(this.content, from + this.openStart, to + this.openStart), this.openStart, this.openEnd)
  };

  // :: (Slice) → bool
  // Tests whether this slice is equal to another slice.
  Slice.prototype.eq = function eq (other) {
    return this.content.eq(other.content) && this.openStart == other.openStart && this.openEnd == other.openEnd
  };

  Slice.prototype.toString = function toString () {
    return this.content + "(" + this.openStart + "," + this.openEnd + ")"
  };

  // :: () → ?Object
  // Convert a slice to a JSON-serializable representation.
  Slice.prototype.toJSON = function toJSON () {
    if (!this.content.size) { return null }
    var json = {content: this.content.toJSON()};
    if (this.openStart > 0) { json.openStart = this.openStart; }
    if (this.openEnd > 0) { json.openEnd = this.openEnd; }
    return json
  };

  // :: (Schema, ?Object) → Slice
  // Deserialize a slice from its JSON representation.
  Slice.fromJSON = function fromJSON (schema, json) {
    if (!json) { return Slice.empty }
    var openStart = json.openStart || 0, openEnd = json.openEnd || 0;
    if (typeof openStart != "number" || typeof openEnd != "number")
      { throw new RangeError("Invalid input for Slice.fromJSON") }
    return new Slice(Fragment.fromJSON(schema, json.content), openStart, openEnd)
  };

  // :: (Fragment, ?bool) → Slice
  // Create a slice from a fragment by taking the maximum possible
  // open value on both side of the fragment.
  Slice.maxOpen = function maxOpen (fragment, openIsolating) {
      if ( openIsolating === void 0 ) openIsolating=true;

    var openStart = 0, openEnd = 0;
    for (var n = fragment.firstChild; n && !n.isLeaf && (openIsolating || !n.type.spec.isolating); n = n.firstChild) { openStart++; }
    for (var n$1 = fragment.lastChild; n$1 && !n$1.isLeaf && (openIsolating || !n$1.type.spec.isolating); n$1 = n$1.lastChild) { openEnd++; }
    return new Slice(fragment, openStart, openEnd)
  };

  Object.defineProperties( Slice.prototype, prototypeAccessors$1$3 );

  function removeRange(content, from, to) {
    var ref = content.findIndex(from);
    var index = ref.index;
    var offset = ref.offset;
    var child = content.maybeChild(index);
    var ref$1 = content.findIndex(to);
    var indexTo = ref$1.index;
    var offsetTo = ref$1.offset;
    if (offset == from || child.isText) {
      if (offsetTo != to && !content.child(indexTo).isText) { throw new RangeError("Removing non-flat range") }
      return content.cut(0, from).append(content.cut(to))
    }
    if (index != indexTo) { throw new RangeError("Removing non-flat range") }
    return content.replaceChild(index, child.copy(removeRange(child.content, from - offset - 1, to - offset - 1)))
  }

  function insertInto(content, dist, insert, parent) {
    var ref = content.findIndex(dist);
    var index = ref.index;
    var offset = ref.offset;
    var child = content.maybeChild(index);
    if (offset == dist || child.isText) {
      if (parent && !parent.canReplace(index, index, insert)) { return null }
      return content.cut(0, dist).append(insert).append(content.cut(dist))
    }
    var inner = insertInto(child.content, dist - offset - 1, insert);
    return inner && content.replaceChild(index, child.copy(inner))
  }

  // :: Slice
  // The empty slice.
  Slice.empty = new Slice(Fragment.empty, 0, 0);

  function replace$2($from, $to, slice) {
    if (slice.openStart > $from.depth)
      { throw new ReplaceError("Inserted content deeper than insertion position") }
    if ($from.depth - slice.openStart != $to.depth - slice.openEnd)
      { throw new ReplaceError("Inconsistent open depths") }
    return replaceOuter($from, $to, slice, 0)
  }

  function replaceOuter($from, $to, slice, depth) {
    var index = $from.index(depth), node = $from.node(depth);
    if (index == $to.index(depth) && depth < $from.depth - slice.openStart) {
      var inner = replaceOuter($from, $to, slice, depth + 1);
      return node.copy(node.content.replaceChild(index, inner))
    } else if (!slice.content.size) {
      return close(node, replaceTwoWay($from, $to, depth))
    } else if (!slice.openStart && !slice.openEnd && $from.depth == depth && $to.depth == depth) { // Simple, flat case
      var parent = $from.parent, content = parent.content;
      return close(parent, content.cut(0, $from.parentOffset).append(slice.content).append(content.cut($to.parentOffset)))
    } else {
      var ref = prepareSliceForReplace(slice, $from);
      var start = ref.start;
      var end = ref.end;
      return close(node, replaceThreeWay($from, start, end, $to, depth))
    }
  }

  function checkJoin(main, sub) {
    if (!sub.type.compatibleContent(main.type))
      { throw new ReplaceError("Cannot join " + sub.type.name + " onto " + main.type.name) }
  }

  function joinable$1($before, $after, depth) {
    var node = $before.node(depth);
    checkJoin(node, $after.node(depth));
    return node
  }

  function addNode(child, target) {
    var last = target.length - 1;
    if (last >= 0 && child.isText && child.sameMarkup(target[last]))
      { target[last] = child.withText(target[last].text + child.text); }
    else
      { target.push(child); }
  }

  function addRange($start, $end, depth, target) {
    var node = ($end || $start).node(depth);
    var startIndex = 0, endIndex = $end ? $end.index(depth) : node.childCount;
    if ($start) {
      startIndex = $start.index(depth);
      if ($start.depth > depth) {
        startIndex++;
      } else if ($start.textOffset) {
        addNode($start.nodeAfter, target);
        startIndex++;
      }
    }
    for (var i = startIndex; i < endIndex; i++) { addNode(node.child(i), target); }
    if ($end && $end.depth == depth && $end.textOffset)
      { addNode($end.nodeBefore, target); }
  }

  function close(node, content) {
    if (!node.type.validContent(content))
      { throw new ReplaceError("Invalid content for node " + node.type.name) }
    return node.copy(content)
  }

  function replaceThreeWay($from, $start, $end, $to, depth) {
    var openStart = $from.depth > depth && joinable$1($from, $start, depth + 1);
    var openEnd = $to.depth > depth && joinable$1($end, $to, depth + 1);

    var content = [];
    addRange(null, $from, depth, content);
    if (openStart && openEnd && $start.index(depth) == $end.index(depth)) {
      checkJoin(openStart, openEnd);
      addNode(close(openStart, replaceThreeWay($from, $start, $end, $to, depth + 1)), content);
    } else {
      if (openStart)
        { addNode(close(openStart, replaceTwoWay($from, $start, depth + 1)), content); }
      addRange($start, $end, depth, content);
      if (openEnd)
        { addNode(close(openEnd, replaceTwoWay($end, $to, depth + 1)), content); }
    }
    addRange($to, null, depth, content);
    return new Fragment(content)
  }

  function replaceTwoWay($from, $to, depth) {
    var content = [];
    addRange(null, $from, depth, content);
    if ($from.depth > depth) {
      var type = joinable$1($from, $to, depth + 1);
      addNode(close(type, replaceTwoWay($from, $to, depth + 1)), content);
    }
    addRange($to, null, depth, content);
    return new Fragment(content)
  }

  function prepareSliceForReplace(slice, $along) {
    var extra = $along.depth - slice.openStart, parent = $along.node(extra);
    var node = parent.copy(slice.content);
    for (var i = extra - 1; i >= 0; i--)
      { node = $along.node(i).copy(Fragment.from(node)); }
    return {start: node.resolveNoCache(slice.openStart + extra),
            end: node.resolveNoCache(node.content.size - slice.openEnd - extra)}
  }

  // ::- You can [_resolve_](#model.Node.resolve) a position to get more
  // information about it. Objects of this class represent such a
  // resolved position, providing various pieces of context information,
  // and some helper methods.
  //
  // Throughout this interface, methods that take an optional `depth`
  // parameter will interpret undefined as `this.depth` and negative
  // numbers as `this.depth + value`.
  var ResolvedPos = function ResolvedPos(pos, path, parentOffset) {
    // :: number The position that was resolved.
    this.pos = pos;
    this.path = path;
    // :: number
    // The number of levels the parent node is from the root. If this
    // position points directly into the root node, it is 0. If it
    // points into a top-level paragraph, 1, and so on.
    this.depth = path.length / 3 - 1;
    // :: number The offset this position has into its parent node.
    this.parentOffset = parentOffset;
  };

  var prototypeAccessors$2$1 = { parent: { configurable: true },doc: { configurable: true },textOffset: { configurable: true },nodeAfter: { configurable: true },nodeBefore: { configurable: true } };

  ResolvedPos.prototype.resolveDepth = function resolveDepth (val) {
    if (val == null) { return this.depth }
    if (val < 0) { return this.depth + val }
    return val
  };

  // :: Node
  // The parent node that the position points into. Note that even if
  // a position points into a text node, that node is not considered
  // the parent—text nodes are ‘flat’ in this model, and have no content.
  prototypeAccessors$2$1.parent.get = function () { return this.node(this.depth) };

  // :: Node
  // The root node in which the position was resolved.
  prototypeAccessors$2$1.doc.get = function () { return this.node(0) };

  // :: (?number) → Node
  // The ancestor node at the given level. `p.node(p.depth)` is the
  // same as `p.parent`.
  ResolvedPos.prototype.node = function node (depth) { return this.path[this.resolveDepth(depth) * 3] };

  // :: (?number) → number
  // The index into the ancestor at the given level. If this points at
  // the 3rd node in the 2nd paragraph on the top level, for example,
  // `p.index(0)` is 1 and `p.index(1)` is 2.
  ResolvedPos.prototype.index = function index (depth) { return this.path[this.resolveDepth(depth) * 3 + 1] };

  // :: (?number) → number
  // The index pointing after this position into the ancestor at the
  // given level.
  ResolvedPos.prototype.indexAfter = function indexAfter (depth) {
    depth = this.resolveDepth(depth);
    return this.index(depth) + (depth == this.depth && !this.textOffset ? 0 : 1)
  };

  // :: (?number) → number
  // The (absolute) position at the start of the node at the given
  // level.
  ResolvedPos.prototype.start = function start (depth) {
    depth = this.resolveDepth(depth);
    return depth == 0 ? 0 : this.path[depth * 3 - 1] + 1
  };

  // :: (?number) → number
  // The (absolute) position at the end of the node at the given
  // level.
  ResolvedPos.prototype.end = function end (depth) {
    depth = this.resolveDepth(depth);
    return this.start(depth) + this.node(depth).content.size
  };

  // :: (?number) → number
  // The (absolute) position directly before the wrapping node at the
  // given level, or, when `depth` is `this.depth + 1`, the original
  // position.
  ResolvedPos.prototype.before = function before (depth) {
    depth = this.resolveDepth(depth);
    if (!depth) { throw new RangeError("There is no position before the top-level node") }
    return depth == this.depth + 1 ? this.pos : this.path[depth * 3 - 1]
  };

  // :: (?number) → number
  // The (absolute) position directly after the wrapping node at the
  // given level, or the original position when `depth` is `this.depth + 1`.
  ResolvedPos.prototype.after = function after (depth) {
    depth = this.resolveDepth(depth);
    if (!depth) { throw new RangeError("There is no position after the top-level node") }
    return depth == this.depth + 1 ? this.pos : this.path[depth * 3 - 1] + this.path[depth * 3].nodeSize
  };

  // :: number
  // When this position points into a text node, this returns the
  // distance between the position and the start of the text node.
  // Will be zero for positions that point between nodes.
  prototypeAccessors$2$1.textOffset.get = function () { return this.pos - this.path[this.path.length - 1] };

  // :: ?Node
  // Get the node directly after the position, if any. If the position
  // points into a text node, only the part of that node after the
  // position is returned.
  prototypeAccessors$2$1.nodeAfter.get = function () {
    var parent = this.parent, index = this.index(this.depth);
    if (index == parent.childCount) { return null }
    var dOff = this.pos - this.path[this.path.length - 1], child = parent.child(index);
    return dOff ? parent.child(index).cut(dOff) : child
  };

  // :: ?Node
  // Get the node directly before the position, if any. If the
  // position points into a text node, only the part of that node
  // before the position is returned.
  prototypeAccessors$2$1.nodeBefore.get = function () {
    var index = this.index(this.depth);
    var dOff = this.pos - this.path[this.path.length - 1];
    if (dOff) { return this.parent.child(index).cut(0, dOff) }
    return index == 0 ? null : this.parent.child(index - 1)
  };

  // :: (number, ?number) → number
  // Get the position at the given index in the parent node at the
  // given depth (which defaults to `this.depth`).
  ResolvedPos.prototype.posAtIndex = function posAtIndex (index, depth) {
    depth = this.resolveDepth(depth);
    var node = this.path[depth * 3], pos = depth == 0 ? 0 : this.path[depth * 3 - 1] + 1;
    for (var i = 0; i < index; i++) { pos += node.child(i).nodeSize; }
    return pos
  };

  // :: () → [Mark]
  // Get the marks at this position, factoring in the surrounding
  // marks' [`inclusive`](#model.MarkSpec.inclusive) property. If the
  // position is at the start of a non-empty node, the marks of the
  // node after it (if any) are returned.
  ResolvedPos.prototype.marks = function marks () {
    var parent = this.parent, index = this.index();

    // In an empty parent, return the empty array
    if (parent.content.size == 0) { return Mark$1.none }

    // When inside a text node, just return the text node's marks
    if (this.textOffset) { return parent.child(index).marks }

    var main = parent.maybeChild(index - 1), other = parent.maybeChild(index);
    // If the `after` flag is true of there is no node before, make
    // the node after this position the main reference.
    if (!main) { var tmp = main; main = other; other = tmp; }

    // Use all marks in the main node, except those that have
    // `inclusive` set to false and are not present in the other node.
    var marks = main.marks;
    for (var i = 0; i < marks.length; i++)
      { if (marks[i].type.spec.inclusive === false && (!other || !marks[i].isInSet(other.marks)))
        { marks = marks[i--].removeFromSet(marks); } }

    return marks
  };

  // :: (ResolvedPos) → ?[Mark]
  // Get the marks after the current position, if any, except those
  // that are non-inclusive and not present at position `$end`. This
  // is mostly useful for getting the set of marks to preserve after a
  // deletion. Will return `null` if this position is at the end of
  // its parent node or its parent node isn't a textblock (in which
  // case no marks should be preserved).
  ResolvedPos.prototype.marksAcross = function marksAcross ($end) {
    var after = this.parent.maybeChild(this.index());
    if (!after || !after.isInline) { return null }

    var marks = after.marks, next = $end.parent.maybeChild($end.index());
    for (var i = 0; i < marks.length; i++)
      { if (marks[i].type.spec.inclusive === false && (!next || !marks[i].isInSet(next.marks)))
        { marks = marks[i--].removeFromSet(marks); } }
    return marks
  };

  // :: (number) → number
  // The depth up to which this position and the given (non-resolved)
  // position share the same parent nodes.
  ResolvedPos.prototype.sharedDepth = function sharedDepth (pos) {
    for (var depth = this.depth; depth > 0; depth--)
      { if (this.start(depth) <= pos && this.end(depth) >= pos) { return depth } }
    return 0
  };

  // :: (?ResolvedPos, ?(Node) → bool) → ?NodeRange
  // Returns a range based on the place where this position and the
  // given position diverge around block content. If both point into
  // the same textblock, for example, a range around that textblock
  // will be returned. If they point into different blocks, the range
  // around those blocks in their shared ancestor is returned. You can
  // pass in an optional predicate that will be called with a parent
  // node to see if a range into that parent is acceptable.
  ResolvedPos.prototype.blockRange = function blockRange (other, pred) {
      if ( other === void 0 ) other = this;

    if (other.pos < this.pos) { return other.blockRange(this) }
    for (var d = this.depth - (this.parent.inlineContent || this.pos == other.pos ? 1 : 0); d >= 0; d--)
      { if (other.pos <= this.end(d) && (!pred || pred(this.node(d))))
        { return new NodeRange(this, other, d) } }
  };

  // :: (ResolvedPos) → bool
  // Query whether the given position shares the same parent node.
  ResolvedPos.prototype.sameParent = function sameParent (other) {
    return this.pos - this.parentOffset == other.pos - other.parentOffset
  };

  // :: (ResolvedPos) → ResolvedPos
  // Return the greater of this and the given position.
  ResolvedPos.prototype.max = function max (other) {
    return other.pos > this.pos ? other : this
  };

  // :: (ResolvedPos) → ResolvedPos
  // Return the smaller of this and the given position.
  ResolvedPos.prototype.min = function min (other) {
    return other.pos < this.pos ? other : this
  };

  ResolvedPos.prototype.toString = function toString () {
    var str = "";
    for (var i = 1; i <= this.depth; i++)
      { str += (str ? "/" : "") + this.node(i).type.name + "_" + this.index(i - 1); }
    return str + ":" + this.parentOffset
  };

  ResolvedPos.resolve = function resolve (doc, pos) {
    if (!(pos >= 0 && pos <= doc.content.size)) { throw new RangeError("Position " + pos + " out of range") }
    var path = [];
    var start = 0, parentOffset = pos;
    for (var node = doc;;) {
      var ref = node.content.findIndex(parentOffset);
        var index = ref.index;
        var offset = ref.offset;
      var rem = parentOffset - offset;
      path.push(node, index, start + offset);
      if (!rem) { break }
      node = node.child(index);
      if (node.isText) { break }
      parentOffset = rem - 1;
      start += offset + 1;
    }
    return new ResolvedPos(pos, path, parentOffset)
  };

  ResolvedPos.resolveCached = function resolveCached (doc, pos) {
    for (var i = 0; i < resolveCache.length; i++) {
      var cached = resolveCache[i];
      if (cached.pos == pos && cached.doc == doc) { return cached }
    }
    var result = resolveCache[resolveCachePos] = ResolvedPos.resolve(doc, pos);
    resolveCachePos = (resolveCachePos + 1) % resolveCacheSize;
    return result
  };

  Object.defineProperties( ResolvedPos.prototype, prototypeAccessors$2$1 );

  var resolveCache = [], resolveCachePos = 0, resolveCacheSize = 12;

  // ::- Represents a flat range of content, i.e. one that starts and
  // ends in the same node.
  var NodeRange = function NodeRange($from, $to, depth) {
    // :: ResolvedPos A resolved position along the start of the
    // content. May have a `depth` greater than this object's `depth`
    // property, since these are the positions that were used to
    // compute the range, not re-resolved positions directly at its
    // boundaries.
    this.$from = $from;
    // :: ResolvedPos A position along the end of the content. See
    // caveat for [`$from`](#model.NodeRange.$from).
    this.$to = $to;
    // :: number The depth of the node that this range points into.
    this.depth = depth;
  };

  var prototypeAccessors$1$1$1 = { start: { configurable: true },end: { configurable: true },parent: { configurable: true },startIndex: { configurable: true },endIndex: { configurable: true } };

  // :: number The position at the start of the range.
  prototypeAccessors$1$1$1.start.get = function () { return this.$from.before(this.depth + 1) };
  // :: number The position at the end of the range.
  prototypeAccessors$1$1$1.end.get = function () { return this.$to.after(this.depth + 1) };

  // :: Node The parent node that the range points into.
  prototypeAccessors$1$1$1.parent.get = function () { return this.$from.node(this.depth) };
  // :: number The start index of the range in the parent node.
  prototypeAccessors$1$1$1.startIndex.get = function () { return this.$from.index(this.depth) };
  // :: number The end index of the range in the parent node.
  prototypeAccessors$1$1$1.endIndex.get = function () { return this.$to.indexAfter(this.depth) };

  Object.defineProperties( NodeRange.prototype, prototypeAccessors$1$1$1 );

  var emptyAttrs = Object.create(null);

  // ::- This class represents a node in the tree that makes up a
  // ProseMirror document. So a document is an instance of `Node`, with
  // children that are also instances of `Node`.
  //
  // Nodes are persistent data structures. Instead of changing them, you
  // create new ones with the content you want. Old ones keep pointing
  // at the old document shape. This is made cheaper by sharing
  // structure between the old and new data as much as possible, which a
  // tree shape like this (without back pointers) makes easy.
  //
  // **Do not** directly mutate the properties of a `Node` object. See
  // [the guide](/docs/guide/#doc) for more information.
  var Node$1 = function Node(type, attrs, content, marks) {
    // :: NodeType
    // The type of node that this is.
    this.type = type;

    // :: Object
    // An object mapping attribute names to values. The kind of
    // attributes allowed and required are
    // [determined](#model.NodeSpec.attrs) by the node type.
    this.attrs = attrs;

    // :: Fragment
    // A container holding the node's children.
    this.content = content || Fragment.empty;

    // :: [Mark]
    // The marks (things like whether it is emphasized or part of a
    // link) applied to this node.
    this.marks = marks || Mark$1.none;
  };

  var prototypeAccessors$3$1 = { nodeSize: { configurable: true },childCount: { configurable: true },textContent: { configurable: true },firstChild: { configurable: true },lastChild: { configurable: true },isBlock: { configurable: true },isTextblock: { configurable: true },inlineContent: { configurable: true },isInline: { configurable: true },isText: { configurable: true },isLeaf: { configurable: true },isAtom: { configurable: true } };

  // text:: ?string
  // For text nodes, this contains the node's text content.

  // :: number
  // The size of this node, as defined by the integer-based [indexing
  // scheme](/docs/guide/#doc.indexing). For text nodes, this is the
  // amount of characters. For other leaf nodes, it is one. For
  // non-leaf nodes, it is the size of the content plus two (the start
  // and end token).
  prototypeAccessors$3$1.nodeSize.get = function () { return this.isLeaf ? 1 : 2 + this.content.size };

  // :: number
  // The number of children that the node has.
  prototypeAccessors$3$1.childCount.get = function () { return this.content.childCount };

  // :: (number) → Node
  // Get the child node at the given index. Raises an error when the
  // index is out of range.
  Node$1.prototype.child = function child (index) { return this.content.child(index) };

  // :: (number) → ?Node
  // Get the child node at the given index, if it exists.
  Node$1.prototype.maybeChild = function maybeChild (index) { return this.content.maybeChild(index) };

  // :: ((node: Node, offset: number, index: number))
  // Call `f` for every child node, passing the node, its offset
  // into this parent node, and its index.
  Node$1.prototype.forEach = function forEach (f) { this.content.forEach(f); };

  // :: (number, number, (node: Node, pos: number, parent: Node, index: number) → ?bool, ?number)
  // Invoke a callback for all descendant nodes recursively between
  // the given two positions that are relative to start of this node's
  // content. The callback is invoked with the node, its
  // parent-relative position, its parent node, and its child index.
  // When the callback returns false for a given node, that node's
  // children will not be recursed over. The last parameter can be
  // used to specify a starting position to count from.
  Node$1.prototype.nodesBetween = function nodesBetween (from, to, f, startPos) {
      if ( startPos === void 0 ) startPos = 0;

    this.content.nodesBetween(from, to, f, startPos, this);
  };

  // :: ((node: Node, pos: number, parent: Node) → ?bool)
  // Call the given callback for every descendant node. Doesn't
  // descend into a node when the callback returns `false`.
  Node$1.prototype.descendants = function descendants (f) {
    this.nodesBetween(0, this.content.size, f);
  };

  // :: string
  // Concatenates all the text nodes found in this fragment and its
  // children.
  prototypeAccessors$3$1.textContent.get = function () { return this.textBetween(0, this.content.size, "") };

  // :: (number, number, ?string, ?string) → string
  // Get all text between positions `from` and `to`. When
  // `blockSeparator` is given, it will be inserted whenever a new
  // block node is started. When `leafText` is given, it'll be
  // inserted for every non-text leaf node encountered.
  Node$1.prototype.textBetween = function textBetween (from, to, blockSeparator, leafText) {
    return this.content.textBetween(from, to, blockSeparator, leafText)
  };

  // :: ?Node
  // Returns this node's first child, or `null` if there are no
  // children.
  prototypeAccessors$3$1.firstChild.get = function () { return this.content.firstChild };

  // :: ?Node
  // Returns this node's last child, or `null` if there are no
  // children.
  prototypeAccessors$3$1.lastChild.get = function () { return this.content.lastChild };

  // :: (Node) → bool
  // Test whether two nodes represent the same piece of document.
  Node$1.prototype.eq = function eq (other) {
    return this == other || (this.sameMarkup(other) && this.content.eq(other.content))
  };

  // :: (Node) → bool
  // Compare the markup (type, attributes, and marks) of this node to
  // those of another. Returns `true` if both have the same markup.
  Node$1.prototype.sameMarkup = function sameMarkup (other) {
    return this.hasMarkup(other.type, other.attrs, other.marks)
  };

  // :: (NodeType, ?Object, ?[Mark]) → bool
  // Check whether this node's markup correspond to the given type,
  // attributes, and marks.
  Node$1.prototype.hasMarkup = function hasMarkup (type, attrs, marks) {
    return this.type == type &&
      compareDeep(this.attrs, attrs || type.defaultAttrs || emptyAttrs) &&
      Mark$1.sameSet(this.marks, marks || Mark$1.none)
  };

  // :: (?Fragment) → Node
  // Create a new node with the same markup as this node, containing
  // the given content (or empty, if no content is given).
  Node$1.prototype.copy = function copy (content) {
      if ( content === void 0 ) content = null;

    if (content == this.content) { return this }
    return new this.constructor(this.type, this.attrs, content, this.marks)
  };

  // :: ([Mark]) → Node
  // Create a copy of this node, with the given set of marks instead
  // of the node's own marks.
  Node$1.prototype.mark = function mark (marks) {
    return marks == this.marks ? this : new this.constructor(this.type, this.attrs, this.content, marks)
  };

  // :: (number, ?number) → Node
  // Create a copy of this node with only the content between the
  // given positions. If `to` is not given, it defaults to the end of
  // the node.
  Node$1.prototype.cut = function cut (from, to) {
    if (from == 0 && to == this.content.size) { return this }
    return this.copy(this.content.cut(from, to))
  };

  // :: (number, ?number) → Slice
  // Cut out the part of the document between the given positions, and
  // return it as a `Slice` object.
  Node$1.prototype.slice = function slice (from, to, includeParents) {
      if ( to === void 0 ) to = this.content.size;
      if ( includeParents === void 0 ) includeParents = false;

    if (from == to) { return Slice.empty }

    var $from = this.resolve(from), $to = this.resolve(to);
    var depth = includeParents ? 0 : $from.sharedDepth(to);
    var start = $from.start(depth), node = $from.node(depth);
    var content = node.content.cut($from.pos - start, $to.pos - start);
    return new Slice(content, $from.depth - depth, $to.depth - depth)
  };

  // :: (number, number, Slice) → Node
  // Replace the part of the document between the given positions with
  // the given slice. The slice must 'fit', meaning its open sides
  // must be able to connect to the surrounding content, and its
  // content nodes must be valid children for the node they are placed
  // into. If any of this is violated, an error of type
  // [`ReplaceError`](#model.ReplaceError) is thrown.
  Node$1.prototype.replace = function replace$1 (from, to, slice) {
    return replace$2(this.resolve(from), this.resolve(to), slice)
  };

  // :: (number) → ?Node
  // Find the node directly after the given position.
  Node$1.prototype.nodeAt = function nodeAt (pos) {
    for (var node = this;;) {
      var ref = node.content.findIndex(pos);
        var index = ref.index;
        var offset = ref.offset;
      node = node.maybeChild(index);
      if (!node) { return null }
      if (offset == pos || node.isText) { return node }
      pos -= offset + 1;
    }
  };

  // :: (number) → {node: ?Node, index: number, offset: number}
  // Find the (direct) child node after the given offset, if any,
  // and return it along with its index and offset relative to this
  // node.
  Node$1.prototype.childAfter = function childAfter (pos) {
    var ref = this.content.findIndex(pos);
      var index = ref.index;
      var offset = ref.offset;
    return {node: this.content.maybeChild(index), index: index, offset: offset}
  };

  // :: (number) → {node: ?Node, index: number, offset: number}
  // Find the (direct) child node before the given offset, if any,
  // and return it along with its index and offset relative to this
  // node.
  Node$1.prototype.childBefore = function childBefore (pos) {
    if (pos == 0) { return {node: null, index: 0, offset: 0} }
    var ref = this.content.findIndex(pos);
      var index = ref.index;
      var offset = ref.offset;
    if (offset < pos) { return {node: this.content.child(index), index: index, offset: offset} }
    var node = this.content.child(index - 1);
    return {node: node, index: index - 1, offset: offset - node.nodeSize}
  };

  // :: (number) → ResolvedPos
  // Resolve the given position in the document, returning an
  // [object](#model.ResolvedPos) with information about its context.
  Node$1.prototype.resolve = function resolve (pos) { return ResolvedPos.resolveCached(this, pos) };

  Node$1.prototype.resolveNoCache = function resolveNoCache (pos) { return ResolvedPos.resolve(this, pos) };

  // :: (number, number, union<Mark, MarkType>) → bool
  // Test whether a given mark or mark type occurs in this document
  // between the two given positions.
  Node$1.prototype.rangeHasMark = function rangeHasMark (from, to, type) {
    var found = false;
    if (to > from) { this.nodesBetween(from, to, function (node) {
      if (type.isInSet(node.marks)) { found = true; }
      return !found
    }); }
    return found
  };

  // :: bool
  // True when this is a block (non-inline node)
  prototypeAccessors$3$1.isBlock.get = function () { return this.type.isBlock };

  // :: bool
  // True when this is a textblock node, a block node with inline
  // content.
  prototypeAccessors$3$1.isTextblock.get = function () { return this.type.isTextblock };

  // :: bool
  // True when this node allows inline content.
  prototypeAccessors$3$1.inlineContent.get = function () { return this.type.inlineContent };

  // :: bool
  // True when this is an inline node (a text node or a node that can
  // appear among text).
  prototypeAccessors$3$1.isInline.get = function () { return this.type.isInline };

  // :: bool
  // True when this is a text node.
  prototypeAccessors$3$1.isText.get = function () { return this.type.isText };

  // :: bool
  // True when this is a leaf node.
  prototypeAccessors$3$1.isLeaf.get = function () { return this.type.isLeaf };

  // :: bool
  // True when this is an atom, i.e. when it does not have directly
  // editable content. This is usually the same as `isLeaf`, but can
  // be configured with the [`atom` property](#model.NodeSpec.atom) on
  // a node's spec (typically used when the node is displayed as an
  // uneditable [node view](#view.NodeView)).
  prototypeAccessors$3$1.isAtom.get = function () { return this.type.isAtom };

  // :: () → string
  // Return a string representation of this node for debugging
  // purposes.
  Node$1.prototype.toString = function toString () {
    if (this.type.spec.toDebugString) { return this.type.spec.toDebugString(this) }
    var name = this.type.name;
    if (this.content.size)
      { name += "(" + this.content.toStringInner() + ")"; }
    return wrapMarks(this.marks, name)
  };

  // :: (number) → ContentMatch
  // Get the content match in this node at the given index.
  Node$1.prototype.contentMatchAt = function contentMatchAt (index) {
    var match = this.type.contentMatch.matchFragment(this.content, 0, index);
    if (!match) { throw new Error("Called contentMatchAt on a node with invalid content") }
    return match
  };

  // :: (number, number, ?Fragment, ?number, ?number) → bool
  // Test whether replacing the range between `from` and `to` (by
  // child index) with the given replacement fragment (which defaults
  // to the empty fragment) would leave the node's content valid. You
  // can optionally pass `start` and `end` indices into the
  // replacement fragment.
  Node$1.prototype.canReplace = function canReplace (from, to, replacement, start, end) {
      if ( replacement === void 0 ) replacement = Fragment.empty;
      if ( start === void 0 ) start = 0;
      if ( end === void 0 ) end = replacement.childCount;

    var one = this.contentMatchAt(from).matchFragment(replacement, start, end);
    var two = one && one.matchFragment(this.content, to);
    if (!two || !two.validEnd) { return false }
    for (var i = start; i < end; i++) { if (!this.type.allowsMarks(replacement.child(i).marks)) { return false } }
    return true
  };

  // :: (number, number, NodeType, ?[Mark]) → bool
  // Test whether replacing the range `from` to `to` (by index) with a
  // node of the given type would leave the node's content valid.
  Node$1.prototype.canReplaceWith = function canReplaceWith (from, to, type, marks) {
    if (marks && !this.type.allowsMarks(marks)) { return false }
    var start = this.contentMatchAt(from).matchType(type);
    var end = start && start.matchFragment(this.content, to);
    return end ? end.validEnd : false
  };

  // :: (Node) → bool
  // Test whether the given node's content could be appended to this
  // node. If that node is empty, this will only return true if there
  // is at least one node type that can appear in both nodes (to avoid
  // merging completely incompatible nodes).
  Node$1.prototype.canAppend = function canAppend (other) {
    if (other.content.size) { return this.canReplace(this.childCount, this.childCount, other.content) }
    else { return this.type.compatibleContent(other.type) }
  };

  // :: ()
  // Check whether this node and its descendants conform to the
  // schema, and raise error when they do not.
  Node$1.prototype.check = function check () {
    if (!this.type.validContent(this.content))
      { throw new RangeError(("Invalid content for node " + (this.type.name) + ": " + (this.content.toString().slice(0, 50)))) }
    var copy = Mark$1.none;
    for (var i = 0; i < this.marks.length; i++) { copy = this.marks[i].addToSet(copy); }
    if (!Mark$1.sameSet(copy, this.marks))
      { throw new RangeError(("Invalid collection of marks for node " + (this.type.name) + ": " + (this.marks.map(function (m) { return m.type.name; })))) }
    this.content.forEach(function (node) { return node.check(); });
  };

  // :: () → Object
  // Return a JSON-serializeable representation of this node.
  Node$1.prototype.toJSON = function toJSON () {
    var obj = {type: this.type.name};
    for (var _ in this.attrs) {
      obj.attrs = this.attrs;
      break
    }
    if (this.content.size)
      { obj.content = this.content.toJSON(); }
    if (this.marks.length)
      { obj.marks = this.marks.map(function (n) { return n.toJSON(); }); }
    return obj
  };

  // :: (Schema, Object) → Node
  // Deserialize a node from its JSON representation.
  Node$1.fromJSON = function fromJSON (schema, json) {
    if (!json) { throw new RangeError("Invalid input for Node.fromJSON") }
    var marks = null;
    if (json.marks) {
      if (!Array.isArray(json.marks)) { throw new RangeError("Invalid mark data for Node.fromJSON") }
      marks = json.marks.map(schema.markFromJSON);
    }
    if (json.type == "text") {
      if (typeof json.text != "string") { throw new RangeError("Invalid text node in JSON") }
      return schema.text(json.text, marks)
    }
    var content = Fragment.fromJSON(schema, json.content);
    return schema.nodeType(json.type).create(json.attrs, content, marks)
  };

  Object.defineProperties( Node$1.prototype, prototypeAccessors$3$1 );

  function wrapMarks(marks, str) {
    for (var i = marks.length - 1; i >= 0; i--)
      { str = marks[i].type.name + "(" + str + ")"; }
    return str
  }

  // ::- Instances of this class represent a match state of a node
  // type's [content expression](#model.NodeSpec.content), and can be
  // used to find out whether further content matches here, and whether
  // a given position is a valid end of the node.
  var ContentMatch = function ContentMatch(validEnd) {
    // :: bool
    // True when this match state represents a valid end of the node.
    this.validEnd = validEnd;
    this.next = [];
    this.wrapCache = [];
  };

  var prototypeAccessors$4$1 = { inlineContent: { configurable: true },defaultType: { configurable: true },edgeCount: { configurable: true } };

  ContentMatch.parse = function parse (string, nodeTypes) {
    var stream = new TokenStream(string, nodeTypes);
    if (stream.next == null) { return ContentMatch.empty }
    var expr = parseExpr(stream);
    if (stream.next) { stream.err("Unexpected trailing text"); }
    var match = dfa(nfa(expr));
    checkForDeadEnds(match, stream);
    return match
  };

  // :: (NodeType) → ?ContentMatch
  // Match a node type, returning a match after that node if
  // successful.
  ContentMatch.prototype.matchType = function matchType (type) {
    for (var i = 0; i < this.next.length; i += 2)
      { if (this.next[i] == type) { return this.next[i + 1] } }
    return null
  };

  // :: (Fragment, ?number, ?number) → ?ContentMatch
  // Try to match a fragment. Returns the resulting match when
  // successful.
  ContentMatch.prototype.matchFragment = function matchFragment (frag, start, end) {
      if ( start === void 0 ) start = 0;
      if ( end === void 0 ) end = frag.childCount;

    var cur = this;
    for (var i = start; cur && i < end; i++)
      { cur = cur.matchType(frag.child(i).type); }
    return cur
  };

  prototypeAccessors$4$1.inlineContent.get = function () {
    var first = this.next[0];
    return first ? first.isInline : false
  };

  // :: ?NodeType
  // Get the first matching node type at this match position that can
  // be generated.
  prototypeAccessors$4$1.defaultType.get = function () {
    for (var i = 0; i < this.next.length; i += 2) {
      var type = this.next[i];
      if (!(type.isText || type.hasRequiredAttrs())) { return type }
    }
  };

  ContentMatch.prototype.compatible = function compatible (other) {
    for (var i = 0; i < this.next.length; i += 2)
      { for (var j = 0; j < other.next.length; j += 2)
        { if (this.next[i] == other.next[j]) { return true } } }
    return false
  };

  // :: (Fragment, bool, ?number) → ?Fragment
  // Try to match the given fragment, and if that fails, see if it can
  // be made to match by inserting nodes in front of it. When
  // successful, return a fragment of inserted nodes (which may be
  // empty if nothing had to be inserted). When `toEnd` is true, only
  // return a fragment if the resulting match goes to the end of the
  // content expression.
  ContentMatch.prototype.fillBefore = function fillBefore (after, toEnd, startIndex) {
      if ( toEnd === void 0 ) toEnd = false;
      if ( startIndex === void 0 ) startIndex = 0;

    var seen = [this];
    function search(match, types) {
      var finished = match.matchFragment(after, startIndex);
      if (finished && (!toEnd || finished.validEnd))
        { return Fragment.from(types.map(function (tp) { return tp.createAndFill(); })) }

      for (var i = 0; i < match.next.length; i += 2) {
        var type = match.next[i], next = match.next[i + 1];
        if (!(type.isText || type.hasRequiredAttrs()) && seen.indexOf(next) == -1) {
          seen.push(next);
          var found = search(next, types.concat(type));
          if (found) { return found }
        }
      }
    }

    return search(this, [])
  };

  // :: (NodeType) → ?[NodeType]
  // Find a set of wrapping node types that would allow a node of the
  // given type to appear at this position. The result may be empty
  // (when it fits directly) and will be null when no such wrapping
  // exists.
  ContentMatch.prototype.findWrapping = function findWrapping (target) {
    for (var i = 0; i < this.wrapCache.length; i += 2)
      { if (this.wrapCache[i] == target) { return this.wrapCache[i + 1] } }
    var computed = this.computeWrapping(target);
    this.wrapCache.push(target, computed);
    return computed
  };

  ContentMatch.prototype.computeWrapping = function computeWrapping (target) {
    var seen = Object.create(null), active = [{match: this, type: null, via: null}];
    while (active.length) {
      var current = active.shift(), match = current.match;
      if (match.matchType(target)) {
        var result = [];
        for (var obj = current; obj.type; obj = obj.via)
          { result.push(obj.type); }
        return result.reverse()
      }
      for (var i = 0; i < match.next.length; i += 2) {
        var type = match.next[i];
        if (!type.isLeaf && !type.hasRequiredAttrs() && !(type.name in seen) && (!current.type || match.next[i + 1].validEnd)) {
          active.push({match: type.contentMatch, type: type, via: current});
          seen[type.name] = true;
        }
      }
    }
  };

  // :: number
  // The number of outgoing edges this node has in the finite
  // automaton that describes the content expression.
  prototypeAccessors$4$1.edgeCount.get = function () {
    return this.next.length >> 1
  };

  // :: (number) → {type: NodeType, next: ContentMatch}
  // Get the _n_​th outgoing edge from this node in the finite
  // automaton that describes the content expression.
  ContentMatch.prototype.edge = function edge (n) {
    var i = n << 1;
    if (i >= this.next.length) { throw new RangeError(("There's no " + n + "th edge in this content match")) }
    return {type: this.next[i], next: this.next[i + 1]}
  };

  ContentMatch.prototype.toString = function toString () {
    var seen = [];
    function scan(m) {
      seen.push(m);
      for (var i = 1; i < m.next.length; i += 2)
        { if (seen.indexOf(m.next[i]) == -1) { scan(m.next[i]); } }
    }
    scan(this);
    return seen.map(function (m, i) {
      var out = i + (m.validEnd ? "*" : " ") + " ";
      for (var i$1 = 0; i$1 < m.next.length; i$1 += 2)
        { out += (i$1 ? ", " : "") + m.next[i$1].name + "->" + seen.indexOf(m.next[i$1 + 1]); }
      return out
    }).join("\n")
  };

  Object.defineProperties( ContentMatch.prototype, prototypeAccessors$4$1 );

  ContentMatch.empty = new ContentMatch(true);

  var TokenStream = function TokenStream(string, nodeTypes) {
    this.string = string;
    this.nodeTypes = nodeTypes;
    this.inline = null;
    this.pos = 0;
    this.tokens = string.split(/\s*(?=\b|\W|$)/);
    if (this.tokens[this.tokens.length - 1] == "") { this.tokens.pop(); }
    if (this.tokens[0] == "") { this.tokens.shift(); }
  };

  var prototypeAccessors$1$2$1 = { next: { configurable: true } };

  prototypeAccessors$1$2$1.next.get = function () { return this.tokens[this.pos] };

  TokenStream.prototype.eat = function eat (tok) { return this.next == tok && (this.pos++ || true) };

  TokenStream.prototype.err = function err (str) { throw new SyntaxError(str + " (in content expression '" + this.string + "')") };

  Object.defineProperties( TokenStream.prototype, prototypeAccessors$1$2$1 );

  function parseExpr(stream) {
    var exprs = [];
    do { exprs.push(parseExprSeq(stream)); }
    while (stream.eat("|"))
    return exprs.length == 1 ? exprs[0] : {type: "choice", exprs: exprs}
  }

  function parseExprSeq(stream) {
    var exprs = [];
    do { exprs.push(parseExprSubscript(stream)); }
    while (stream.next && stream.next != ")" && stream.next != "|")
    return exprs.length == 1 ? exprs[0] : {type: "seq", exprs: exprs}
  }

  function parseExprSubscript(stream) {
    var expr = parseExprAtom(stream);
    for (;;) {
      if (stream.eat("+"))
        { expr = {type: "plus", expr: expr}; }
      else if (stream.eat("*"))
        { expr = {type: "star", expr: expr}; }
      else if (stream.eat("?"))
        { expr = {type: "opt", expr: expr}; }
      else if (stream.eat("{"))
        { expr = parseExprRange(stream, expr); }
      else { break }
    }
    return expr
  }

  function parseNum(stream) {
    if (/\D/.test(stream.next)) { stream.err("Expected number, got '" + stream.next + "'"); }
    var result = Number(stream.next);
    stream.pos++;
    return result
  }

  function parseExprRange(stream, expr) {
    var min = parseNum(stream), max = min;
    if (stream.eat(",")) {
      if (stream.next != "}") { max = parseNum(stream); }
      else { max = -1; }
    }
    if (!stream.eat("}")) { stream.err("Unclosed braced range"); }
    return {type: "range", min: min, max: max, expr: expr}
  }

  function resolveName(stream, name) {
    var types = stream.nodeTypes, type = types[name];
    if (type) { return [type] }
    var result = [];
    for (var typeName in types) {
      var type$1 = types[typeName];
      if (type$1.groups.indexOf(name) > -1) { result.push(type$1); }
    }
    if (result.length == 0) { stream.err("No node type or group '" + name + "' found"); }
    return result
  }

  function parseExprAtom(stream) {
    if (stream.eat("(")) {
      var expr = parseExpr(stream);
      if (!stream.eat(")")) { stream.err("Missing closing paren"); }
      return expr
    } else if (!/\W/.test(stream.next)) {
      var exprs = resolveName(stream, stream.next).map(function (type) {
        if (stream.inline == null) { stream.inline = type.isInline; }
        else if (stream.inline != type.isInline) { stream.err("Mixing inline and block content"); }
        return {type: "name", value: type}
      });
      stream.pos++;
      return exprs.length == 1 ? exprs[0] : {type: "choice", exprs: exprs}
    } else {
      stream.err("Unexpected token '" + stream.next + "'");
    }
  }

  // The code below helps compile a regular-expression-like language
  // into a deterministic finite automaton. For a good introduction to
  // these concepts, see https://swtch.com/~rsc/regexp/regexp1.html

  // : (Object) → [[{term: ?any, to: number}]]
  // Construct an NFA from an expression as returned by the parser. The
  // NFA is represented as an array of states, which are themselves
  // arrays of edges, which are `{term, to}` objects. The first state is
  // the entry state and the last node is the success state.
  //
  // Note that unlike typical NFAs, the edge ordering in this one is
  // significant, in that it is used to contruct filler content when
  // necessary.
  function nfa(expr) {
    var nfa = [[]];
    connect(compile(expr, 0), node());
    return nfa

    function node() { return nfa.push([]) - 1 }
    function edge(from, to, term) {
      var edge = {term: term, to: to};
      nfa[from].push(edge);
      return edge
    }
    function connect(edges, to) { edges.forEach(function (edge) { return edge.to = to; }); }

    function compile(expr, from) {
      if (expr.type == "choice") {
        return expr.exprs.reduce(function (out, expr) { return out.concat(compile(expr, from)); }, [])
      } else if (expr.type == "seq") {
        for (var i = 0;; i++) {
          var next = compile(expr.exprs[i], from);
          if (i == expr.exprs.length - 1) { return next }
          connect(next, from = node());
        }
      } else if (expr.type == "star") {
        var loop = node();
        edge(from, loop);
        connect(compile(expr.expr, loop), loop);
        return [edge(loop)]
      } else if (expr.type == "plus") {
        var loop$1 = node();
        connect(compile(expr.expr, from), loop$1);
        connect(compile(expr.expr, loop$1), loop$1);
        return [edge(loop$1)]
      } else if (expr.type == "opt") {
        return [edge(from)].concat(compile(expr.expr, from))
      } else if (expr.type == "range") {
        var cur = from;
        for (var i$1 = 0; i$1 < expr.min; i$1++) {
          var next$1 = node();
          connect(compile(expr.expr, cur), next$1);
          cur = next$1;
        }
        if (expr.max == -1) {
          connect(compile(expr.expr, cur), cur);
        } else {
          for (var i$2 = expr.min; i$2 < expr.max; i$2++) {
            var next$2 = node();
            edge(cur, next$2);
            connect(compile(expr.expr, cur), next$2);
            cur = next$2;
          }
        }
        return [edge(cur)]
      } else if (expr.type == "name") {
        return [edge(from, null, expr.value)]
      }
    }
  }

  function cmp(a, b) { return b - a }

  // Get the set of nodes reachable by null edges from `node`. Omit
  // nodes with only a single null-out-edge, since they may lead to
  // needless duplicated nodes.
  function nullFrom(nfa, node) {
    var result = [];
    scan(node);
    return result.sort(cmp)

    function scan(node) {
      var edges = nfa[node];
      if (edges.length == 1 && !edges[0].term) { return scan(edges[0].to) }
      result.push(node);
      for (var i = 0; i < edges.length; i++) {
        var ref = edges[i];
        var term = ref.term;
        var to = ref.to;
        if (!term && result.indexOf(to) == -1) { scan(to); }
      }
    }
  }

  // : ([[{term: ?any, to: number}]]) → ContentMatch
  // Compiles an NFA as produced by `nfa` into a DFA, modeled as a set
  // of state objects (`ContentMatch` instances) with transitions
  // between them.
  function dfa(nfa) {
    var labeled = Object.create(null);
    return explore(nullFrom(nfa, 0))

    function explore(states) {
      var out = [];
      states.forEach(function (node) {
        nfa[node].forEach(function (ref) {
          var term = ref.term;
          var to = ref.to;

          if (!term) { return }
          var known = out.indexOf(term), set = known > -1 && out[known + 1];
          nullFrom(nfa, to).forEach(function (node) {
            if (!set) { out.push(term, set = []); }
            if (set.indexOf(node) == -1) { set.push(node); }
          });
        });
      });
      var state = labeled[states.join(",")] = new ContentMatch(states.indexOf(nfa.length - 1) > -1);
      for (var i = 0; i < out.length; i += 2) {
        var states$1 = out[i + 1].sort(cmp);
        state.next.push(out[i], labeled[states$1.join(",")] || explore(states$1));
      }
      return state
    }
  }

  function checkForDeadEnds(match, stream) {
    for (var i = 0, work = [match]; i < work.length; i++) {
      var state = work[i], dead = !state.validEnd, nodes = [];
      for (var j = 0; j < state.next.length; j += 2) {
        var node = state.next[j], next = state.next[j + 1];
        nodes.push(node.name);
        if (dead && !(node.isText || node.hasRequiredAttrs())) { dead = false; }
        if (work.indexOf(next) == -1) { work.push(next); }
      }
      if (dead) { stream.err("Only non-generatable nodes (" + nodes.join(", ") + ") in a required position (see https://prosemirror.net/docs/guide/#generatable)"); }
    }
  }

  // For node types where all attrs have a default value (or which don't
  // have any attributes), build up a single reusable default attribute
  // object, and use it for all nodes that don't specify specific
  // attributes.
  function defaultAttrs(attrs) {
    var defaults = Object.create(null);
    for (var attrName in attrs) {
      var attr = attrs[attrName];
      if (!attr.hasDefault) { return null }
      defaults[attrName] = attr.default;
    }
    return defaults
  }

  function computeAttrs(attrs, value) {
    var built = Object.create(null);
    for (var name in attrs) {
      var given = value && value[name];
      if (given === undefined) {
        var attr = attrs[name];
        if (attr.hasDefault) { given = attr.default; }
        else { throw new RangeError("No value supplied for attribute " + name) }
      }
      built[name] = given;
    }
    return built
  }

  function initAttrs(attrs) {
    var result = Object.create(null);
    if (attrs) { for (var name in attrs) { result[name] = new Attribute(attrs[name]); } }
    return result
  }

  // ::- Node types are objects allocated once per `Schema` and used to
  // [tag](#model.Node.type) `Node` instances. They contain information
  // about the node type, such as its name and what kind of node it
  // represents.
  var NodeType$1 = function NodeType(name, schema, spec) {
    // :: string
    // The name the node type has in this schema.
    this.name = name;

    // :: Schema
    // A link back to the `Schema` the node type belongs to.
    this.schema = schema;

    // :: NodeSpec
    // The spec that this type is based on
    this.spec = spec;

    this.groups = spec.group ? spec.group.split(" ") : [];
    this.attrs = initAttrs(spec.attrs);

    this.defaultAttrs = defaultAttrs(this.attrs);

    // :: ContentMatch
    // The starting match of the node type's content expression.
    this.contentMatch = null;

    // : ?[MarkType]
    // The set of marks allowed in this node. `null` means all marks
    // are allowed.
    this.markSet = null;

    // :: bool
    // True if this node type has inline content.
    this.inlineContent = null;

    // :: bool
    // True if this is a block type
    this.isBlock = !(spec.inline || name == "text");

    // :: bool
    // True if this is the text node type.
    this.isText = name == "text";
  };

  var prototypeAccessors$5$1 = { isInline: { configurable: true },isTextblock: { configurable: true },isLeaf: { configurable: true },isAtom: { configurable: true } };

  // :: bool
  // True if this is an inline type.
  prototypeAccessors$5$1.isInline.get = function () { return !this.isBlock };

  // :: bool
  // True if this is a textblock type, a block that contains inline
  // content.
  prototypeAccessors$5$1.isTextblock.get = function () { return this.isBlock && this.inlineContent };

  // :: bool
  // True for node types that allow no content.
  prototypeAccessors$5$1.isLeaf.get = function () { return this.contentMatch == ContentMatch.empty };

  // :: bool
  // True when this node is an atom, i.e. when it does not have
  // directly editable content.
  prototypeAccessors$5$1.isAtom.get = function () { return this.isLeaf || this.spec.atom };

  // :: () → bool
  // Tells you whether this node type has any required attributes.
  NodeType$1.prototype.hasRequiredAttrs = function hasRequiredAttrs () {
    for (var n in this.attrs) { if (this.attrs[n].isRequired) { return true } }
    return false
  };

  NodeType$1.prototype.compatibleContent = function compatibleContent (other) {
    return this == other || this.contentMatch.compatible(other.contentMatch)
  };

  NodeType$1.prototype.computeAttrs = function computeAttrs$1 (attrs) {
    if (!attrs && this.defaultAttrs) { return this.defaultAttrs }
    else { return computeAttrs(this.attrs, attrs) }
  };

  // :: (?Object, ?union<Fragment, Node, [Node]>, ?[Mark]) → Node
  // Create a `Node` of this type. The given attributes are
  // checked and defaulted (you can pass `null` to use the type's
  // defaults entirely, if no required attributes exist). `content`
  // may be a `Fragment`, a node, an array of nodes, or
  // `null`. Similarly `marks` may be `null` to default to the empty
  // set of marks.
  NodeType$1.prototype.create = function create (attrs, content, marks) {
    if (this.isText) { throw new Error("NodeType.create can't construct text nodes") }
    return new Node$1(this, this.computeAttrs(attrs), Fragment.from(content), Mark$1.setFrom(marks))
  };

  // :: (?Object, ?union<Fragment, Node, [Node]>, ?[Mark]) → Node
  // Like [`create`](#model.NodeType.create), but check the given content
  // against the node type's content restrictions, and throw an error
  // if it doesn't match.
  NodeType$1.prototype.createChecked = function createChecked (attrs, content, marks) {
    content = Fragment.from(content);
    if (!this.validContent(content))
      { throw new RangeError("Invalid content for node " + this.name) }
    return new Node$1(this, this.computeAttrs(attrs), content, Mark$1.setFrom(marks))
  };

  // :: (?Object, ?union<Fragment, Node, [Node]>, ?[Mark]) → ?Node
  // Like [`create`](#model.NodeType.create), but see if it is necessary to
  // add nodes to the start or end of the given fragment to make it
  // fit the node. If no fitting wrapping can be found, return null.
  // Note that, due to the fact that required nodes can always be
  // created, this will always succeed if you pass null or
  // `Fragment.empty` as content.
  NodeType$1.prototype.createAndFill = function createAndFill (attrs, content, marks) {
    attrs = this.computeAttrs(attrs);
    content = Fragment.from(content);
    if (content.size) {
      var before = this.contentMatch.fillBefore(content);
      if (!before) { return null }
      content = before.append(content);
    }
    var after = this.contentMatch.matchFragment(content).fillBefore(Fragment.empty, true);
    if (!after) { return null }
    return new Node$1(this, attrs, content.append(after), Mark$1.setFrom(marks))
  };

  // :: (Fragment) → bool
  // Returns true if the given fragment is valid content for this node
  // type with the given attributes.
  NodeType$1.prototype.validContent = function validContent (content) {
    var result = this.contentMatch.matchFragment(content);
    if (!result || !result.validEnd) { return false }
    for (var i = 0; i < content.childCount; i++)
      { if (!this.allowsMarks(content.child(i).marks)) { return false } }
    return true
  };

  // :: (MarkType) → bool
  // Check whether the given mark type is allowed in this node.
  NodeType$1.prototype.allowsMarkType = function allowsMarkType (markType) {
    return this.markSet == null || this.markSet.indexOf(markType) > -1
  };

  // :: ([Mark]) → bool
  // Test whether the given set of marks are allowed in this node.
  NodeType$1.prototype.allowsMarks = function allowsMarks (marks) {
    if (this.markSet == null) { return true }
    for (var i = 0; i < marks.length; i++) { if (!this.allowsMarkType(marks[i].type)) { return false } }
    return true
  };

  // :: ([Mark]) → [Mark]
  // Removes the marks that are not allowed in this node from the given set.
  NodeType$1.prototype.allowedMarks = function allowedMarks (marks) {
    if (this.markSet == null) { return marks }
    var copy;
    for (var i = 0; i < marks.length; i++) {
      if (!this.allowsMarkType(marks[i].type)) {
        if (!copy) { copy = marks.slice(0, i); }
      } else if (copy) {
        copy.push(marks[i]);
      }
    }
    return !copy ? marks : copy.length ? copy : Mark$1.empty
  };

  NodeType$1.compile = function compile (nodes, schema) {
    var result = Object.create(null);
    nodes.forEach(function (name, spec) { return result[name] = new NodeType$1(name, schema, spec); });

    var topType = schema.spec.topNode || "doc";
    if (!result[topType]) { throw new RangeError("Schema is missing its top node type ('" + topType + "')") }
    if (!result.text) { throw new RangeError("Every schema needs a 'text' type") }
    for (var _ in result.text.attrs) { throw new RangeError("The text node type should not have attributes") }

    return result
  };

  Object.defineProperties( NodeType$1.prototype, prototypeAccessors$5$1 );

  // Attribute descriptors

  var Attribute = function Attribute(options) {
    this.hasDefault = Object.prototype.hasOwnProperty.call(options, "default");
    this.default = options.default;
  };

  var prototypeAccessors$1$3$1 = { isRequired: { configurable: true } };

  prototypeAccessors$1$3$1.isRequired.get = function () {
    return !this.hasDefault
  };

  Object.defineProperties( Attribute.prototype, prototypeAccessors$1$3$1 );

  // Marks

  // ::- Like nodes, marks (which are associated with nodes to signify
  // things like emphasis or being part of a link) are
  // [tagged](#model.Mark.type) with type objects, which are
  // instantiated once per `Schema`.
  var MarkType = function MarkType(name, rank, schema, spec) {
    // :: string
    // The name of the mark type.
    this.name = name;

    // :: Schema
    // The schema that this mark type instance is part of.
    this.schema = schema;

    // :: MarkSpec
    // The spec on which the type is based.
    this.spec = spec;

    this.attrs = initAttrs(spec.attrs);

    this.rank = rank;
    this.excluded = null;
    var defaults = defaultAttrs(this.attrs);
    this.instance = defaults && new Mark$1(this, defaults);
  };

  // :: (?Object) → Mark
  // Create a mark of this type. `attrs` may be `null` or an object
  // containing only some of the mark's attributes. The others, if
  // they have defaults, will be added.
  MarkType.prototype.create = function create (attrs) {
    if (!attrs && this.instance) { return this.instance }
    return new Mark$1(this, computeAttrs(this.attrs, attrs))
  };

  MarkType.compile = function compile (marks, schema) {
    var result = Object.create(null), rank = 0;
    marks.forEach(function (name, spec) { return result[name] = new MarkType(name, rank++, schema, spec); });
    return result
  };

  // :: ([Mark]) → [Mark]
  // When there is a mark of this type in the given set, a new set
  // without it is returned. Otherwise, the input set is returned.
  MarkType.prototype.removeFromSet = function removeFromSet (set) {
    for (var i = 0; i < set.length; i++) { if (set[i].type == this) {
      set = set.slice(0, i).concat(set.slice(i + 1));
      i--;
    } }
    return set
  };

  // :: ([Mark]) → ?Mark
  // Tests whether there is a mark of this type in the given set.
  MarkType.prototype.isInSet = function isInSet (set) {
    for (var i = 0; i < set.length; i++)
      { if (set[i].type == this) { return set[i] } }
  };

  // :: (MarkType) → bool
  // Queries whether a given mark type is
  // [excluded](#model.MarkSpec.excludes) by this one.
  MarkType.prototype.excludes = function excludes (other) {
    return this.excluded.indexOf(other) > -1
  };

  // ParseOptions:: interface
  // These are the options recognized by the
  // [`parse`](#model.DOMParser.parse) and
  // [`parseSlice`](#model.DOMParser.parseSlice) methods.
  //
  //   preserveWhitespace:: ?union<bool, "full">
  //   By default, whitespace is collapsed as per HTML's rules. Pass
  //   `true` to preserve whitespace, but normalize newlines to
  //   spaces, and `"full"` to preserve whitespace entirely.
  //
  //   findPositions:: ?[{node: dom.Node, offset: number}]
  //   When given, the parser will, beside parsing the content,
  //   record the document positions of the given DOM positions. It
  //   will do so by writing to the objects, adding a `pos` property
  //   that holds the document position. DOM positions that are not
  //   in the parsed content will not be written to.
  //
  //   from:: ?number
  //   The child node index to start parsing from.
  //
  //   to:: ?number
  //   The child node index to stop parsing at.
  //
  //   topNode:: ?Node
  //   By default, the content is parsed into the schema's default
  //   [top node type](#model.Schema.topNodeType). You can pass this
  //   option to use the type and attributes from a different node
  //   as the top container.
  //
  //   topMatch:: ?ContentMatch
  //   Provide the starting content match that content parsed into the
  //   top node is matched against.
  //
  //   context:: ?ResolvedPos
  //   A set of additional nodes to count as
  //   [context](#model.ParseRule.context) when parsing, above the
  //   given [top node](#model.ParseOptions.topNode).

  // ParseRule:: interface
  // A value that describes how to parse a given DOM node or inline
  // style as a ProseMirror node or mark.
  //
  //   tag:: ?string
  //   A CSS selector describing the kind of DOM elements to match. A
  //   single rule should have _either_ a `tag` or a `style` property.
  //
  //   namespace:: ?string
  //   The namespace to match. This should be used with `tag`.
  //   Nodes are only matched when the namespace matches or this property
  //   is null.
  //
  //   style:: ?string
  //   A CSS property name to match. When given, this rule matches
  //   inline styles that list that property. May also have the form
  //   `"property=value"`, in which case the rule only matches if the
  //   property's value exactly matches the given value. (For more
  //   complicated filters, use [`getAttrs`](#model.ParseRule.getAttrs)
  //   and return false to indicate that the match failed.) Rules
  //   matching styles may only produce [marks](#model.ParseRule.mark),
  //   not nodes.
  //
  //   priority:: ?number
  //   Can be used to change the order in which the parse rules in a
  //   schema are tried. Those with higher priority come first. Rules
  //   without a priority are counted as having priority 50. This
  //   property is only meaningful in a schema—when directly
  //   constructing a parser, the order of the rule array is used.
  //
  //   consuming:: ?boolean
  //   By default, when a rule matches an element or style, no further
  //   rules get a chance to match it. By setting this to `false`, you
  //   indicate that even when this rule matches, other rules that come
  //   after it should also run.
  //
  //   context:: ?string
  //   When given, restricts this rule to only match when the current
  //   context—the parent nodes into which the content is being
  //   parsed—matches this expression. Should contain one or more node
  //   names or node group names followed by single or double slashes.
  //   For example `"paragraph/"` means the rule only matches when the
  //   parent node is a paragraph, `"blockquote/paragraph/"` restricts
  //   it to be in a paragraph that is inside a blockquote, and
  //   `"section//"` matches any position inside a section—a double
  //   slash matches any sequence of ancestor nodes. To allow multiple
  //   different contexts, they can be separated by a pipe (`|`)
  //   character, as in `"blockquote/|list_item/"`.
  //
  //   node:: ?string
  //   The name of the node type to create when this rule matches. Only
  //   valid for rules with a `tag` property, not for style rules. Each
  //   rule should have one of a `node`, `mark`, or `ignore` property
  //   (except when it appears in a [node](#model.NodeSpec.parseDOM) or
  //   [mark spec](#model.MarkSpec.parseDOM), in which case the `node`
  //   or `mark` property will be derived from its position).
  //
  //   mark:: ?string
  //   The name of the mark type to wrap the matched content in.
  //
  //   ignore:: ?bool
  //   When true, ignore content that matches this rule.
  //
  //   closeParent:: ?bool
  //   When true, finding an element that matches this rule will close
  //   the current node.
  //
  //   skip:: ?bool
  //   When true, ignore the node that matches this rule, but do parse
  //   its content.
  //
  //   attrs:: ?Object
  //   Attributes for the node or mark created by this rule. When
  //   `getAttrs` is provided, it takes precedence.
  //
  //   getAttrs:: ?(union<dom.Node, string>) → ?union<Object, false>
  //   A function used to compute the attributes for the node or mark
  //   created by this rule. Can also be used to describe further
  //   conditions the DOM element or style must match. When it returns
  //   `false`, the rule won't match. When it returns null or undefined,
  //   that is interpreted as an empty/default set of attributes.
  //
  //   Called with a DOM Element for `tag` rules, and with a string (the
  //   style's value) for `style` rules.
  //
  //   contentElement:: ?union<string, (dom.Node) → dom.Node>
  //   For `tag` rules that produce non-leaf nodes or marks, by default
  //   the content of the DOM element is parsed as content of the mark
  //   or node. If the child nodes are in a descendent node, this may be
  //   a CSS selector string that the parser must use to find the actual
  //   content element, or a function that returns the actual content
  //   element to the parser.
  //
  //   getContent:: ?(dom.Node, schema: Schema) → Fragment
  //   Can be used to override the content of a matched node. When
  //   present, instead of parsing the node's child nodes, the result of
  //   this function is used.
  //
  //   preserveWhitespace:: ?union<bool, "full">
  //   Controls whether whitespace should be preserved when parsing the
  //   content inside the matched element. `false` means whitespace may
  //   be collapsed, `true` means that whitespace should be preserved
  //   but newlines normalized to spaces, and `"full"` means that
  //   newlines should also be preserved.

  // ::- A DOM parser represents a strategy for parsing DOM content into
  // a ProseMirror document conforming to a given schema. Its behavior
  // is defined by an array of [rules](#model.ParseRule).
  var DOMParser = function DOMParser(schema, rules) {
    var this$1 = this;

    // :: Schema
    // The schema into which the parser parses.
    this.schema = schema;
    // :: [ParseRule]
    // The set of [parse rules](#model.ParseRule) that the parser
    // uses, in order of precedence.
    this.rules = rules;
    this.tags = [];
    this.styles = [];

    rules.forEach(function (rule) {
      if (rule.tag) { this$1.tags.push(rule); }
      else if (rule.style) { this$1.styles.push(rule); }
    });

    // Only normalize list elements when lists in the schema can't directly contain themselves
    this.normalizeLists = !this.tags.some(function (r) {
      if (!/^(ul|ol)\b/.test(r.tag) || !r.node) { return false }
      var node = schema.nodes[r.node];
      return node.contentMatch.matchType(node)
    });
  };

  // :: (dom.Node, ?ParseOptions) → Node
  // Parse a document from the content of a DOM node.
  DOMParser.prototype.parse = function parse (dom, options) {
      if ( options === void 0 ) options = {};

    var context = new ParseContext(this, options, false);
    context.addAll(dom, null, options.from, options.to);
    return context.finish()
  };

  // :: (dom.Node, ?ParseOptions) → Slice
  // Parses the content of the given DOM node, like
  // [`parse`](#model.DOMParser.parse), and takes the same set of
  // options. But unlike that method, which produces a whole node,
  // this one returns a slice that is open at the sides, meaning that
  // the schema constraints aren't applied to the start of nodes to
  // the left of the input and the end of nodes at the end.
  DOMParser.prototype.parseSlice = function parseSlice (dom, options) {
      if ( options === void 0 ) options = {};

    var context = new ParseContext(this, options, true);
    context.addAll(dom, null, options.from, options.to);
    return Slice.maxOpen(context.finish())
  };

  DOMParser.prototype.matchTag = function matchTag (dom, context, after) {
    for (var i = after ? this.tags.indexOf(after) + 1 : 0; i < this.tags.length; i++) {
      var rule = this.tags[i];
      if (matches(dom, rule.tag) &&
          (rule.namespace === undefined || dom.namespaceURI == rule.namespace) &&
          (!rule.context || context.matchesContext(rule.context))) {
        if (rule.getAttrs) {
          var result = rule.getAttrs(dom);
          if (result === false) { continue }
          rule.attrs = result;
        }
        return rule
      }
    }
  };

  DOMParser.prototype.matchStyle = function matchStyle (prop, value, context, after) {
    for (var i = after ? this.styles.indexOf(after) + 1 : 0; i < this.styles.length; i++) {
      var rule = this.styles[i];
      if (rule.style.indexOf(prop) != 0 ||
          rule.context && !context.matchesContext(rule.context) ||
          // Test that the style string either precisely matches the prop,
          // or has an '=' sign after the prop, followed by the given
          // value.
          rule.style.length > prop.length &&
          (rule.style.charCodeAt(prop.length) != 61 || rule.style.slice(prop.length + 1) != value))
        { continue }
      if (rule.getAttrs) {
        var result = rule.getAttrs(value);
        if (result === false) { continue }
        rule.attrs = result;
      }
      return rule
    }
  };

  // : (Schema) → [ParseRule]
  DOMParser.schemaRules = function schemaRules (schema) {
    var result = [];
    function insert(rule) {
      var priority = rule.priority == null ? 50 : rule.priority, i = 0;
      for (; i < result.length; i++) {
        var next = result[i], nextPriority = next.priority == null ? 50 : next.priority;
        if (nextPriority < priority) { break }
      }
      result.splice(i, 0, rule);
    }

    var loop = function ( name ) {
      var rules = schema.marks[name].spec.parseDOM;
      if (rules) { rules.forEach(function (rule) {
        insert(rule = copy(rule));
        rule.mark = name;
      }); }
    };

      for (var name in schema.marks) loop( name );
    var loop$1 = function ( name ) {
      var rules$1 = schema.nodes[name$1].spec.parseDOM;
      if (rules$1) { rules$1.forEach(function (rule) {
        insert(rule = copy(rule));
        rule.node = name$1;
      }); }
    };

      for (var name$1 in schema.nodes) loop$1();
    return result
  };

  // :: (Schema) → DOMParser
  // Construct a DOM parser using the parsing rules listed in a
  // schema's [node specs](#model.NodeSpec.parseDOM), reordered by
  // [priority](#model.ParseRule.priority).
  DOMParser.fromSchema = function fromSchema (schema) {
    return schema.cached.domParser ||
      (schema.cached.domParser = new DOMParser(schema, DOMParser.schemaRules(schema)))
  };

  // : Object<bool> The block-level tags in HTML5
  var blockTags = {
    address: true, article: true, aside: true, blockquote: true, canvas: true,
    dd: true, div: true, dl: true, fieldset: true, figcaption: true, figure: true,
    footer: true, form: true, h1: true, h2: true, h3: true, h4: true, h5: true,
    h6: true, header: true, hgroup: true, hr: true, li: true, noscript: true, ol: true,
    output: true, p: true, pre: true, section: true, table: true, tfoot: true, ul: true
  };

  // : Object<bool> The tags that we normally ignore.
  var ignoreTags = {
    head: true, noscript: true, object: true, script: true, style: true, title: true
  };

  // : Object<bool> List tags.
  var listTags = {ol: true, ul: true};

  // Using a bitfield for node context options
  var OPT_PRESERVE_WS = 1, OPT_PRESERVE_WS_FULL = 2, OPT_OPEN_LEFT = 4;

  function wsOptionsFor(preserveWhitespace) {
    return (preserveWhitespace ? OPT_PRESERVE_WS : 0) | (preserveWhitespace === "full" ? OPT_PRESERVE_WS_FULL : 0)
  }

  var NodeContext = function NodeContext(type, attrs, marks, pendingMarks, solid, match, options) {
    this.type = type;
    this.attrs = attrs;
    this.solid = solid;
    this.match = match || (options & OPT_OPEN_LEFT ? null : type.contentMatch);
    this.options = options;
    this.content = [];
    // Marks applied to this node itself
    this.marks = marks;
    // Marks applied to its children
    this.activeMarks = Mark$1.none;
    // Marks that can't apply here, but will be used in children if possible
    this.pendingMarks = pendingMarks;
    // Nested Marks with same type
    this.stashMarks = [];
  };

  NodeContext.prototype.findWrapping = function findWrapping (node) {
    if (!this.match) {
      if (!this.type) { return [] }
      var fill = this.type.contentMatch.fillBefore(Fragment.from(node));
      if (fill) {
        this.match = this.type.contentMatch.matchFragment(fill);
      } else {
        var start = this.type.contentMatch, wrap;
        if (wrap = start.findWrapping(node.type)) {
          this.match = start;
          return wrap
        } else {
          return null
        }
      }
    }
    return this.match.findWrapping(node.type)
  };

  NodeContext.prototype.finish = function finish (openEnd) {
    if (!(this.options & OPT_PRESERVE_WS)) { // Strip trailing whitespace
      var last = this.content[this.content.length - 1], m;
      if (last && last.isText && (m = /[ \t\r\n\u000c]+$/.exec(last.text))) {
        if (last.text.length == m[0].length) { this.content.pop(); }
        else { this.content[this.content.length - 1] = last.withText(last.text.slice(0, last.text.length - m[0].length)); }
      }
    }
    var content = Fragment.from(this.content);
    if (!openEnd && this.match)
      { content = content.append(this.match.fillBefore(Fragment.empty, true)); }
    return this.type ? this.type.create(this.attrs, content, this.marks) : content
  };

  NodeContext.prototype.popFromStashMark = function popFromStashMark (mark) {
    for (var i = this.stashMarks.length - 1; i >= 0; i--)
      { if (mark.eq(this.stashMarks[i])) { return this.stashMarks.splice(i, 1)[0] } }
  };

  NodeContext.prototype.applyPending = function applyPending (nextType) {
    for (var i = 0, pending = this.pendingMarks; i < pending.length; i++) {
      var mark = pending[i];
      if ((this.type ? this.type.allowsMarkType(mark.type) : markMayApply(mark.type, nextType)) &&
          !mark.isInSet(this.activeMarks)) {
        this.activeMarks = mark.addToSet(this.activeMarks);
        this.pendingMarks = mark.removeFromSet(this.pendingMarks);
      }
    }
  };

  var ParseContext = function ParseContext(parser, options, open) {
    // : DOMParser The parser we are using.
    this.parser = parser;
    // : Object The options passed to this parse.
    this.options = options;
    this.isOpen = open;
    var topNode = options.topNode, topContext;
    var topOptions = wsOptionsFor(options.preserveWhitespace) | (open ? OPT_OPEN_LEFT : 0);
    if (topNode)
      { topContext = new NodeContext(topNode.type, topNode.attrs, Mark$1.none, Mark$1.none, true,
                                   options.topMatch || topNode.type.contentMatch, topOptions); }
    else if (open)
      { topContext = new NodeContext(null, null, Mark$1.none, Mark$1.none, true, null, topOptions); }
    else
      { topContext = new NodeContext(parser.schema.topNodeType, null, Mark$1.none, Mark$1.none, true, null, topOptions); }
    this.nodes = [topContext];
    // : [Mark] The current set of marks
    this.open = 0;
    this.find = options.findPositions;
    this.needsBlock = false;
  };

  var prototypeAccessors$6 = { top: { configurable: true },currentPos: { configurable: true } };

  prototypeAccessors$6.top.get = function () {
    return this.nodes[this.open]
  };

  // : (dom.Node)
  // Add a DOM node to the content. Text is inserted as text node,
  // otherwise, the node is passed to `addElement` or, if it has a
  // `style` attribute, `addElementWithStyles`.
  ParseContext.prototype.addDOM = function addDOM (dom) {
    if (dom.nodeType == 3) {
      this.addTextNode(dom);
    } else if (dom.nodeType == 1) {
      var style = dom.getAttribute("style");
      var marks = style ? this.readStyles(parseStyles(style)) : null, top = this.top;
      if (marks != null) { for (var i = 0; i < marks.length; i++) { this.addPendingMark(marks[i]); } }
      this.addElement(dom);
      if (marks != null) { for (var i$1 = 0; i$1 < marks.length; i$1++) { this.removePendingMark(marks[i$1], top); } }
    }
  };

  ParseContext.prototype.addTextNode = function addTextNode (dom) {
    var value = dom.nodeValue;
    var top = this.top;
    if (top.options & OPT_PRESERVE_WS_FULL ||
        (top.type ? top.type.inlineContent : top.content.length && top.content[0].isInline) ||
        /[^ \t\r\n\u000c]/.test(value)) {
      if (!(top.options & OPT_PRESERVE_WS)) {
        value = value.replace(/[ \t\r\n\u000c]+/g, " ");
        // If this starts with whitespace, and there is no node before it, or
        // a hard break, or a text node that ends with whitespace, strip the
        // leading space.
        if (/^[ \t\r\n\u000c]/.test(value) && this.open == this.nodes.length - 1) {
          var nodeBefore = top.content[top.content.length - 1];
          var domNodeBefore = dom.previousSibling;
          if (!nodeBefore ||
              (domNodeBefore && domNodeBefore.nodeName == 'BR') ||
              (nodeBefore.isText && /[ \t\r\n\u000c]$/.test(nodeBefore.text)))
            { value = value.slice(1); }
        }
      } else if (!(top.options & OPT_PRESERVE_WS_FULL)) {
        value = value.replace(/\r?\n|\r/g, " ");
      } else {
        value = value.replace(/\r\n?/g, "\n");
      }
      if (value) { this.insertNode(this.parser.schema.text(value)); }
      this.findInText(dom);
    } else {
      this.findInside(dom);
    }
  };

  // : (dom.Element, ?ParseRule)
  // Try to find a handler for the given tag and use that to parse. If
  // none is found, the element's content nodes are added directly.
  ParseContext.prototype.addElement = function addElement (dom, matchAfter) {
    var name = dom.nodeName.toLowerCase(), ruleID;
    if (listTags.hasOwnProperty(name) && this.parser.normalizeLists) { normalizeList(dom); }
    var rule = (this.options.ruleFromNode && this.options.ruleFromNode(dom)) ||
        (ruleID = this.parser.matchTag(dom, this, matchAfter));
    if (rule ? rule.ignore : ignoreTags.hasOwnProperty(name)) {
      this.findInside(dom);
      this.ignoreFallback(dom);
    } else if (!rule || rule.skip || rule.closeParent) {
      if (rule && rule.closeParent) { this.open = Math.max(0, this.open - 1); }
      else if (rule && rule.skip.nodeType) { dom = rule.skip; }
      var sync, top = this.top, oldNeedsBlock = this.needsBlock;
      if (blockTags.hasOwnProperty(name)) {
        sync = true;
        if (!top.type) { this.needsBlock = true; }
      } else if (!dom.firstChild) {
        this.leafFallback(dom);
        return
      }
      this.addAll(dom);
      if (sync) { this.sync(top); }
      this.needsBlock = oldNeedsBlock;
    } else {
      this.addElementByRule(dom, rule, rule.consuming === false ? ruleID : null);
    }
  };

  // Called for leaf DOM nodes that would otherwise be ignored
  ParseContext.prototype.leafFallback = function leafFallback (dom) {
    if (dom.nodeName == "BR" && this.top.type && this.top.type.inlineContent)
      { this.addTextNode(dom.ownerDocument.createTextNode("\n")); }
  };

  // Called for ignored nodes
  ParseContext.prototype.ignoreFallback = function ignoreFallback (dom) {
    // Ignored BR nodes should at least create an inline context
    if (dom.nodeName == "BR" && (!this.top.type || !this.top.type.inlineContent))
      { this.findPlace(this.parser.schema.text("-")); }
  };

  // Run any style parser associated with the node's styles. Either
  // return an array of marks, or null to indicate some of the styles
  // had a rule with `ignore` set.
  ParseContext.prototype.readStyles = function readStyles (styles) {
    var marks = Mark$1.none;
    style: for (var i = 0; i < styles.length; i += 2) {
      for (var after = null;;) {
        var rule = this.parser.matchStyle(styles[i], styles[i + 1], this, after);
        if (!rule) { continue style }
        if (rule.ignore) { return null }
        marks = this.parser.schema.marks[rule.mark].create(rule.attrs).addToSet(marks);
        if (rule.consuming === false) { after = rule; }
        else { break }
      }
    }
    return marks
  };

  // : (dom.Element, ParseRule) → bool
  // Look up a handler for the given node. If none are found, return
  // false. Otherwise, apply it, use its return value to drive the way
  // the node's content is wrapped, and return true.
  ParseContext.prototype.addElementByRule = function addElementByRule (dom, rule, continueAfter) {
      var this$1 = this;

    var sync, nodeType, markType, mark;
    if (rule.node) {
      nodeType = this.parser.schema.nodes[rule.node];
      if (!nodeType.isLeaf) {
        sync = this.enter(nodeType, rule.attrs, rule.preserveWhitespace);
      } else if (!this.insertNode(nodeType.create(rule.attrs))) {
        this.leafFallback(dom);
      }
    } else {
      markType = this.parser.schema.marks[rule.mark];
      mark = markType.create(rule.attrs);
      this.addPendingMark(mark);
    }
    var startIn = this.top;

    if (nodeType && nodeType.isLeaf) {
      this.findInside(dom);
    } else if (continueAfter) {
      this.addElement(dom, continueAfter);
    } else if (rule.getContent) {
      this.findInside(dom);
      rule.getContent(dom, this.parser.schema).forEach(function (node) { return this$1.insertNode(node); });
    } else {
      var contentDOM = rule.contentElement;
      if (typeof contentDOM == "string") { contentDOM = dom.querySelector(contentDOM); }
      else if (typeof contentDOM == "function") { contentDOM = contentDOM(dom); }
      if (!contentDOM) { contentDOM = dom; }
      this.findAround(dom, contentDOM, true);
      this.addAll(contentDOM, sync);
    }
    if (sync) { this.sync(startIn); this.open--; }
    if (mark) { this.removePendingMark(mark, startIn); }
  };

  // : (dom.Node, ?NodeBuilder, ?number, ?number)
  // Add all child nodes between `startIndex` and `endIndex` (or the
  // whole node, if not given). If `sync` is passed, use it to
  // synchronize after every block element.
  ParseContext.prototype.addAll = function addAll (parent, sync, startIndex, endIndex) {
    var index = startIndex || 0;
    for (var dom = startIndex ? parent.childNodes[startIndex] : parent.firstChild,
             end = endIndex == null ? null : parent.childNodes[endIndex];
         dom != end; dom = dom.nextSibling, ++index) {
      this.findAtPoint(parent, index);
      this.addDOM(dom);
      if (sync && blockTags.hasOwnProperty(dom.nodeName.toLowerCase()))
        { this.sync(sync); }
    }
    this.findAtPoint(parent, index);
  };

  // Try to find a way to fit the given node type into the current
  // context. May add intermediate wrappers and/or leave non-solid
  // nodes that we're in.
  ParseContext.prototype.findPlace = function findPlace (node) {
    var route, sync;
    for (var depth = this.open; depth >= 0; depth--) {
      var cx = this.nodes[depth];
      var found = cx.findWrapping(node);
      if (found && (!route || route.length > found.length)) {
        route = found;
        sync = cx;
        if (!found.length) { break }
      }
      if (cx.solid) { break }
    }
    if (!route) { return false }
    this.sync(sync);
    for (var i = 0; i < route.length; i++)
      { this.enterInner(route[i], null, false); }
    return true
  };

  // : (Node) → ?Node
  // Try to insert the given node, adjusting the context when needed.
  ParseContext.prototype.insertNode = function insertNode (node) {
    if (node.isInline && this.needsBlock && !this.top.type) {
      var block = this.textblockFromContext();
      if (block) { this.enterInner(block); }
    }
    if (this.findPlace(node)) {
      this.closeExtra();
      var top = this.top;
      top.applyPending(node.type);
      if (top.match) { top.match = top.match.matchType(node.type); }
      var marks = top.activeMarks;
      for (var i = 0; i < node.marks.length; i++)
        { if (!top.type || top.type.allowsMarkType(node.marks[i].type))
          { marks = node.marks[i].addToSet(marks); } }
      top.content.push(node.mark(marks));
      return true
    }
    return false
  };

  // : (NodeType, ?Object) → bool
  // Try to start a node of the given type, adjusting the context when
  // necessary.
  ParseContext.prototype.enter = function enter (type, attrs, preserveWS) {
    var ok = this.findPlace(type.create(attrs));
    if (ok) { this.enterInner(type, attrs, true, preserveWS); }
    return ok
  };

  // Open a node of the given type
  ParseContext.prototype.enterInner = function enterInner (type, attrs, solid, preserveWS) {
    this.closeExtra();
    var top = this.top;
    top.applyPending(type);
    top.match = top.match && top.match.matchType(type, attrs);
    var options = preserveWS == null ? top.options & ~OPT_OPEN_LEFT : wsOptionsFor(preserveWS);
    if ((top.options & OPT_OPEN_LEFT) && top.content.length == 0) { options |= OPT_OPEN_LEFT; }
    this.nodes.push(new NodeContext(type, attrs, top.activeMarks, top.pendingMarks, solid, null, options));
    this.open++;
  };

  // Make sure all nodes above this.open are finished and added to
  // their parents
  ParseContext.prototype.closeExtra = function closeExtra (openEnd) {
    var i = this.nodes.length - 1;
    if (i > this.open) {
      for (; i > this.open; i--) { this.nodes[i - 1].content.push(this.nodes[i].finish(openEnd)); }
      this.nodes.length = this.open + 1;
    }
  };

  ParseContext.prototype.finish = function finish () {
    this.open = 0;
    this.closeExtra(this.isOpen);
    return this.nodes[0].finish(this.isOpen || this.options.topOpen)
  };

  ParseContext.prototype.sync = function sync (to) {
    for (var i = this.open; i >= 0; i--) { if (this.nodes[i] == to) {
      this.open = i;
      return
    } }
  };

  prototypeAccessors$6.currentPos.get = function () {
    this.closeExtra();
    var pos = 0;
    for (var i = this.open; i >= 0; i--) {
      var content = this.nodes[i].content;
      for (var j = content.length - 1; j >= 0; j--)
        { pos += content[j].nodeSize; }
      if (i) { pos++; }
    }
    return pos
  };

  ParseContext.prototype.findAtPoint = function findAtPoint (parent, offset) {
    if (this.find) { for (var i = 0; i < this.find.length; i++) {
      if (this.find[i].node == parent && this.find[i].offset == offset)
        { this.find[i].pos = this.currentPos; }
    } }
  };

  ParseContext.prototype.findInside = function findInside (parent) {
    if (this.find) { for (var i = 0; i < this.find.length; i++) {
      if (this.find[i].pos == null && parent.nodeType == 1 && parent.contains(this.find[i].node))
        { this.find[i].pos = this.currentPos; }
    } }
  };

  ParseContext.prototype.findAround = function findAround (parent, content, before) {
    if (parent != content && this.find) { for (var i = 0; i < this.find.length; i++) {
      if (this.find[i].pos == null && parent.nodeType == 1 && parent.contains(this.find[i].node)) {
        var pos = content.compareDocumentPosition(this.find[i].node);
        if (pos & (before ? 2 : 4))
          { this.find[i].pos = this.currentPos; }
      }
    } }
  };

  ParseContext.prototype.findInText = function findInText (textNode) {
    if (this.find) { for (var i = 0; i < this.find.length; i++) {
      if (this.find[i].node == textNode)
        { this.find[i].pos = this.currentPos - (textNode.nodeValue.length - this.find[i].offset); }
    } }
  };

  // : (string) → bool
  // Determines whether the given [context
  // string](#ParseRule.context) matches this context.
  ParseContext.prototype.matchesContext = function matchesContext (context) {
      var this$1 = this;

    if (context.indexOf("|") > -1)
      { return context.split(/\s*\|\s*/).some(this.matchesContext, this) }

    var parts = context.split("/");
    var option = this.options.context;
    var useRoot = !this.isOpen && (!option || option.parent.type == this.nodes[0].type);
    var minDepth = -(option ? option.depth + 1 : 0) + (useRoot ? 0 : 1);
    var match = function (i, depth) {
      for (; i >= 0; i--) {
        var part = parts[i];
        if (part == "") {
          if (i == parts.length - 1 || i == 0) { continue }
          for (; depth >= minDepth; depth--)
            { if (match(i - 1, depth)) { return true } }
          return false
        } else {
          var next = depth > 0 || (depth == 0 && useRoot) ? this$1.nodes[depth].type
              : option && depth >= minDepth ? option.node(depth - minDepth).type
              : null;
          if (!next || (next.name != part && next.groups.indexOf(part) == -1))
            { return false }
          depth--;
        }
      }
      return true
    };
    return match(parts.length - 1, this.open)
  };

  ParseContext.prototype.textblockFromContext = function textblockFromContext () {
    var $context = this.options.context;
    if ($context) { for (var d = $context.depth; d >= 0; d--) {
      var deflt = $context.node(d).contentMatchAt($context.indexAfter(d)).defaultType;
      if (deflt && deflt.isTextblock && deflt.defaultAttrs) { return deflt }
    } }
    for (var name in this.parser.schema.nodes) {
      var type = this.parser.schema.nodes[name];
      if (type.isTextblock && type.defaultAttrs) { return type }
    }
  };

  ParseContext.prototype.addPendingMark = function addPendingMark (mark) {
    var found = findSameMarkInSet(mark, this.top.pendingMarks);
    if (found) { this.top.stashMarks.push(found); }
    this.top.pendingMarks = mark.addToSet(this.top.pendingMarks);
  };

  ParseContext.prototype.removePendingMark = function removePendingMark (mark, upto) {
    for (var depth = this.open; depth >= 0; depth--) {
      var level = this.nodes[depth];
      var found = level.pendingMarks.lastIndexOf(mark);
      if (found > -1) {
        level.pendingMarks = mark.removeFromSet(level.pendingMarks);
      } else {
        level.activeMarks = mark.removeFromSet(level.activeMarks);
        var stashMark = level.popFromStashMark(mark);
        if (stashMark && level.type && level.type.allowsMarkType(stashMark.type))
          { level.activeMarks = stashMark.addToSet(level.activeMarks); }
      }
      if (level == upto) { break }
    }
  };

  Object.defineProperties( ParseContext.prototype, prototypeAccessors$6 );

  // Kludge to work around directly nested list nodes produced by some
  // tools and allowed by browsers to mean that the nested list is
  // actually part of the list item above it.
  function normalizeList(dom) {
    for (var child = dom.firstChild, prevItem = null; child; child = child.nextSibling) {
      var name = child.nodeType == 1 ? child.nodeName.toLowerCase() : null;
      if (name && listTags.hasOwnProperty(name) && prevItem) {
        prevItem.appendChild(child);
        child = prevItem;
      } else if (name == "li") {
        prevItem = child;
      } else if (name) {
        prevItem = null;
      }
    }
  }

  // Apply a CSS selector.
  function matches(dom, selector) {
    return (dom.matches || dom.msMatchesSelector || dom.webkitMatchesSelector || dom.mozMatchesSelector).call(dom, selector)
  }

  // : (string) → [string]
  // Tokenize a style attribute into property/value pairs.
  function parseStyles(style) {
    var re = /\s*([\w-]+)\s*:\s*([^;]+)/g, m, result = [];
    while (m = re.exec(style)) { result.push(m[1], m[2].trim()); }
    return result
  }

  function copy(obj) {
    var copy = {};
    for (var prop in obj) { copy[prop] = obj[prop]; }
    return copy
  }

  // Used when finding a mark at the top level of a fragment parse.
  // Checks whether it would be reasonable to apply a given mark type to
  // a given node, by looking at the way the mark occurs in the schema.
  function markMayApply(markType, nodeType) {
    var nodes = nodeType.schema.nodes;
    var loop = function ( name ) {
      var parent = nodes[name];
      if (!parent.allowsMarkType(markType)) { return }
      var seen = [], scan = function (match) {
        seen.push(match);
        for (var i = 0; i < match.edgeCount; i++) {
          var ref = match.edge(i);
          var type = ref.type;
          var next = ref.next;
          if (type == nodeType) { return true }
          if (seen.indexOf(next) < 0 && scan(next)) { return true }
        }
      };
      if (scan(parent.contentMatch)) { return { v: true } }
    };

    for (var name in nodes) {
      var returned = loop( name );

      if ( returned ) return returned.v;
    }
  }

  function findSameMarkInSet(mark, set) {
    for (var i = 0; i < set.length; i++) {
      if (mark.eq(set[i])) { return set[i] }
    }
  }

  // DOMOutputSpec:: interface
  // A description of a DOM structure. Can be either a string, which is
  // interpreted as a text node, a DOM node, which is interpreted as
  // itself, a `{dom: Node, contentDOM: ?Node}` object, or an array.
  //
  // An array describes a DOM element. The first value in the array
  // should be a string—the name of the DOM element, optionally prefixed
  // by a namespace URL and a space. If the second element is plain
  // object, it is interpreted as a set of attributes for the element.
  // Any elements after that (including the 2nd if it's not an attribute
  // object) are interpreted as children of the DOM elements, and must
  // either be valid `DOMOutputSpec` values, or the number zero.
  //
  // The number zero (pronounced “hole”) is used to indicate the place
  // where a node's child nodes should be inserted. If it occurs in an
  // output spec, it should be the only child element in its parent
  // node.

  // ::- A DOM serializer knows how to convert ProseMirror nodes and
  // marks of various types to DOM nodes.
  var DOMSerializer = function DOMSerializer(nodes, marks) {
    // :: Object<(node: Node) → DOMOutputSpec>
    // The node serialization functions.
    this.nodes = nodes || {};
    // :: Object<?(mark: Mark, inline: bool) → DOMOutputSpec>
    // The mark serialization functions.
    this.marks = marks || {};
  };

  // :: (Fragment, ?Object) → dom.DocumentFragment
  // Serialize the content of this fragment to a DOM fragment. When
  // not in the browser, the `document` option, containing a DOM
  // document, should be passed so that the serializer can create
  // nodes.
  DOMSerializer.prototype.serializeFragment = function serializeFragment (fragment, options, target) {
      var this$1 = this;
      if ( options === void 0 ) options = {};

    if (!target) { target = doc(options).createDocumentFragment(); }

    var top = target, active = null;
    fragment.forEach(function (node) {
      if (active || node.marks.length) {
        if (!active) { active = []; }
        var keep = 0, rendered = 0;
        while (keep < active.length && rendered < node.marks.length) {
          var next = node.marks[rendered];
          if (!this$1.marks[next.type.name]) { rendered++; continue }
          if (!next.eq(active[keep]) || next.type.spec.spanning === false) { break }
          keep += 2; rendered++;
        }
        while (keep < active.length) {
          top = active.pop();
          active.pop();
        }
        while (rendered < node.marks.length) {
          var add = node.marks[rendered++];
          var markDOM = this$1.serializeMark(add, node.isInline, options);
          if (markDOM) {
            active.push(add, top);
            top.appendChild(markDOM.dom);
            top = markDOM.contentDOM || markDOM.dom;
          }
        }
      }
      top.appendChild(this$1.serializeNode(node, options));
    });

    return target
  };

  // :: (Node, ?Object) → dom.Node
  // Serialize this node to a DOM node. This can be useful when you
  // need to serialize a part of a document, as opposed to the whole
  // document. To serialize a whole document, use
  // [`serializeFragment`](#model.DOMSerializer.serializeFragment) on
  // its [content](#model.Node.content).
  DOMSerializer.prototype.serializeNode = function serializeNode (node, options) {
      if ( options === void 0 ) options = {};

    var ref =
        DOMSerializer.renderSpec(doc(options), this.nodes[node.type.name](node));
      var dom = ref.dom;
      var contentDOM = ref.contentDOM;
    if (contentDOM) {
      if (node.isLeaf)
        { throw new RangeError("Content hole not allowed in a leaf node spec") }
      if (options.onContent)
        { options.onContent(node, contentDOM, options); }
      else
        { this.serializeFragment(node.content, options, contentDOM); }
    }
    return dom
  };

  DOMSerializer.prototype.serializeNodeAndMarks = function serializeNodeAndMarks (node, options) {
      if ( options === void 0 ) options = {};

    var dom = this.serializeNode(node, options);
    for (var i = node.marks.length - 1; i >= 0; i--) {
      var wrap = this.serializeMark(node.marks[i], node.isInline, options);
      if (wrap) {
  (wrap.contentDOM || wrap.dom).appendChild(dom);
        dom = wrap.dom;
      }
    }
    return dom
  };

  DOMSerializer.prototype.serializeMark = function serializeMark (mark, inline, options) {
      if ( options === void 0 ) options = {};

    var toDOM = this.marks[mark.type.name];
    return toDOM && DOMSerializer.renderSpec(doc(options), toDOM(mark, inline))
  };

  // :: (dom.Document, DOMOutputSpec) → {dom: dom.Node, contentDOM: ?dom.Node}
  // Render an [output spec](#model.DOMOutputSpec) to a DOM node. If
  // the spec has a hole (zero) in it, `contentDOM` will point at the
  // node with the hole.
  DOMSerializer.renderSpec = function renderSpec (doc, structure, xmlNS) {
      if ( xmlNS === void 0 ) xmlNS = null;

    if (typeof structure == "string")
      { return {dom: doc.createTextNode(structure)} }
    if (structure.nodeType != null)
      { return {dom: structure} }
    if (structure.dom && structure.dom.nodeType != null)
      { return structure }
    var tagName = structure[0], space = tagName.indexOf(" ");
    if (space > 0) {
      xmlNS = tagName.slice(0, space);
      tagName = tagName.slice(space + 1);
    }
    var contentDOM = null, dom = xmlNS ? doc.createElementNS(xmlNS, tagName) : doc.createElement(tagName);
    var attrs = structure[1], start = 1;
    if (attrs && typeof attrs == "object" && attrs.nodeType == null && !Array.isArray(attrs)) {
      start = 2;
      for (var name in attrs) { if (attrs[name] != null) {
        var space$1 = name.indexOf(" ");
        if (space$1 > 0) { dom.setAttributeNS(name.slice(0, space$1), name.slice(space$1 + 1), attrs[name]); }
        else { dom.setAttribute(name, attrs[name]); }
      } }
    }
    for (var i = start; i < structure.length; i++) {
      var child = structure[i];
      if (child === 0) {
        if (i < structure.length - 1 || i > start)
          { throw new RangeError("Content hole must be the only child of its parent node") }
        return {dom: dom, contentDOM: dom}
      } else {
        var ref = DOMSerializer.renderSpec(doc, child, xmlNS);
          var inner = ref.dom;
          var innerContent = ref.contentDOM;
        dom.appendChild(inner);
        if (innerContent) {
          if (contentDOM) { throw new RangeError("Multiple content holes") }
          contentDOM = innerContent;
        }
      }
    }
    return {dom: dom, contentDOM: contentDOM}
  };

  // :: (Schema) → DOMSerializer
  // Build a serializer using the [`toDOM`](#model.NodeSpec.toDOM)
  // properties in a schema's node and mark specs.
  DOMSerializer.fromSchema = function fromSchema (schema) {
    return schema.cached.domSerializer ||
      (schema.cached.domSerializer = new DOMSerializer(this.nodesFromSchema(schema), this.marksFromSchema(schema)))
  };

  // : (Schema) → Object<(node: Node) → DOMOutputSpec>
  // Gather the serializers in a schema's node specs into an object.
  // This can be useful as a base to build a custom serializer from.
  DOMSerializer.nodesFromSchema = function nodesFromSchema (schema) {
    var result = gatherToDOM(schema.nodes);
    if (!result.text) { result.text = function (node) { return node.text; }; }
    return result
  };

  // : (Schema) → Object<(mark: Mark) → DOMOutputSpec>
  // Gather the serializers in a schema's mark specs into an object.
  DOMSerializer.marksFromSchema = function marksFromSchema (schema) {
    return gatherToDOM(schema.marks)
  };

  function gatherToDOM(obj) {
    var result = {};
    for (var name in obj) {
      var toDOM = obj[name].spec.toDOM;
      if (toDOM) { result[name] = toDOM; }
    }
    return result
  }

  function doc(options) {
    // declare global: window
    return options.document || window.document
  }

  // Mappable:: interface
  // There are several things that positions can be mapped through.
  // Such objects conform to this interface.
  //
  //   map:: (pos: number, assoc: ?number) → number
  //   Map a position through this object. When given, `assoc` (should
  //   be -1 or 1, defaults to 1) determines with which side the
  //   position is associated, which determines in which direction to
  //   move when a chunk of content is inserted at the mapped position.
  //
  //   mapResult:: (pos: number, assoc: ?number) → MapResult
  //   Map a position, and return an object containing additional
  //   information about the mapping. The result's `deleted` field tells
  //   you whether the position was deleted (completely enclosed in a
  //   replaced range) during the mapping. When content on only one side
  //   is deleted, the position itself is only considered deleted when
  //   `assoc` points in the direction of the deleted content.

  // Recovery values encode a range index and an offset. They are
  // represented as numbers, because tons of them will be created when
  // mapping, for example, a large number of decorations. The number's
  // lower 16 bits provide the index, the remaining bits the offset.
  //
  // Note: We intentionally don't use bit shift operators to en- and
  // decode these, since those clip to 32 bits, which we might in rare
  // cases want to overflow. A 64-bit float can represent 48-bit
  // integers precisely.

  var lower16 = 0xffff;
  var factor16 = Math.pow(2, 16);

  function makeRecover(index, offset) { return index + offset * factor16 }
  function recoverIndex(value) { return value & lower16 }
  function recoverOffset(value) { return (value - (value & lower16)) / factor16 }

  // ::- An object representing a mapped position with extra
  // information.
  var MapResult = function MapResult(pos, deleted, recover) {
    if ( deleted === void 0 ) deleted = false;
    if ( recover === void 0 ) recover = null;

    // :: number The mapped version of the position.
    this.pos = pos;
    // :: bool Tells you whether the position was deleted, that is,
    // whether the step removed its surroundings from the document.
    this.deleted = deleted;
    this.recover = recover;
  };

  // :: class extends Mappable
  // A map describing the deletions and insertions made by a step, which
  // can be used to find the correspondence between positions in the
  // pre-step version of a document and the same position in the
  // post-step version.
  var StepMap = function StepMap(ranges, inverted) {
    if ( inverted === void 0 ) inverted = false;

    this.ranges = ranges;
    this.inverted = inverted;
  };

  StepMap.prototype.recover = function recover (value) {
    var diff = 0, index = recoverIndex(value);
    if (!this.inverted) { for (var i = 0; i < index; i++)
      { diff += this.ranges[i * 3 + 2] - this.ranges[i * 3 + 1]; } }
    return this.ranges[index * 3] + diff + recoverOffset(value)
  };

  // : (number, ?number) → MapResult
  StepMap.prototype.mapResult = function mapResult (pos, assoc) {
    if ( assoc === void 0 ) assoc = 1;
   return this._map(pos, assoc, false) };

  // : (number, ?number) → number
  StepMap.prototype.map = function map (pos, assoc) {
    if ( assoc === void 0 ) assoc = 1;
   return this._map(pos, assoc, true) };

  StepMap.prototype._map = function _map (pos, assoc, simple) {
    var diff = 0, oldIndex = this.inverted ? 2 : 1, newIndex = this.inverted ? 1 : 2;
    for (var i = 0; i < this.ranges.length; i += 3) {
      var start = this.ranges[i] - (this.inverted ? diff : 0);
      if (start > pos) { break }
      var oldSize = this.ranges[i + oldIndex], newSize = this.ranges[i + newIndex], end = start + oldSize;
      if (pos <= end) {
        var side = !oldSize ? assoc : pos == start ? -1 : pos == end ? 1 : assoc;
        var result = start + diff + (side < 0 ? 0 : newSize);
        if (simple) { return result }
        var recover = pos == (assoc < 0 ? start : end) ? null : makeRecover(i / 3, pos - start);
        return new MapResult(result, assoc < 0 ? pos != start : pos != end, recover)
      }
      diff += newSize - oldSize;
    }
    return simple ? pos + diff : new MapResult(pos + diff)
  };

  StepMap.prototype.touches = function touches (pos, recover) {
    var diff = 0, index = recoverIndex(recover);
    var oldIndex = this.inverted ? 2 : 1, newIndex = this.inverted ? 1 : 2;
    for (var i = 0; i < this.ranges.length; i += 3) {
      var start = this.ranges[i] - (this.inverted ? diff : 0);
      if (start > pos) { break }
      var oldSize = this.ranges[i + oldIndex], end = start + oldSize;
      if (pos <= end && i == index * 3) { return true }
      diff += this.ranges[i + newIndex] - oldSize;
    }
    return false
  };

  // :: ((oldStart: number, oldEnd: number, newStart: number, newEnd: number))
  // Calls the given function on each of the changed ranges included in
  // this map.
  StepMap.prototype.forEach = function forEach (f) {
    var oldIndex = this.inverted ? 2 : 1, newIndex = this.inverted ? 1 : 2;
    for (var i = 0, diff = 0; i < this.ranges.length; i += 3) {
      var start = this.ranges[i], oldStart = start - (this.inverted ? diff : 0), newStart = start + (this.inverted ? 0 : diff);
      var oldSize = this.ranges[i + oldIndex], newSize = this.ranges[i + newIndex];
      f(oldStart, oldStart + oldSize, newStart, newStart + newSize);
      diff += newSize - oldSize;
    }
  };

  // :: () → StepMap
  // Create an inverted version of this map. The result can be used to
  // map positions in the post-step document to the pre-step document.
  StepMap.prototype.invert = function invert () {
    return new StepMap(this.ranges, !this.inverted)
  };

  StepMap.prototype.toString = function toString () {
    return (this.inverted ? "-" : "") + JSON.stringify(this.ranges)
  };

  // :: (n: number) → StepMap
  // Create a map that moves all positions by offset `n` (which may be
  // negative). This can be useful when applying steps meant for a
  // sub-document to a larger document, or vice-versa.
  StepMap.offset = function offset (n) {
    return n == 0 ? StepMap.empty : new StepMap(n < 0 ? [0, -n, 0] : [0, 0, n])
  };

  StepMap.empty = new StepMap([]);

  // :: class extends Mappable
  // A mapping represents a pipeline of zero or more [step
  // maps](#transform.StepMap). It has special provisions for losslessly
  // handling mapping positions through a series of steps in which some
  // steps are inverted versions of earlier steps. (This comes up when
  // ‘[rebasing](/docs/guide/#transform.rebasing)’ steps for
  // collaboration or history management.)
  var Mapping = function Mapping(maps, mirror, from, to) {
    // :: [StepMap]
    // The step maps in this mapping.
    this.maps = maps || [];
    // :: number
    // The starting position in the `maps` array, used when `map` or
    // `mapResult` is called.
    this.from = from || 0;
    // :: number
    // The end position in the `maps` array.
    this.to = to == null ? this.maps.length : to;
    this.mirror = mirror;
  };

  // :: (?number, ?number) → Mapping
  // Create a mapping that maps only through a part of this one.
  Mapping.prototype.slice = function slice (from, to) {
      if ( from === void 0 ) from = 0;
      if ( to === void 0 ) to = this.maps.length;

    return new Mapping(this.maps, this.mirror, from, to)
  };

  Mapping.prototype.copy = function copy () {
    return new Mapping(this.maps.slice(), this.mirror && this.mirror.slice(), this.from, this.to)
  };

  // :: (StepMap, ?number)
  // Add a step map to the end of this mapping. If `mirrors` is
  // given, it should be the index of the step map that is the mirror
  // image of this one.
  Mapping.prototype.appendMap = function appendMap (map, mirrors) {
    this.to = this.maps.push(map);
    if (mirrors != null) { this.setMirror(this.maps.length - 1, mirrors); }
  };

  // :: (Mapping)
  // Add all the step maps in a given mapping to this one (preserving
  // mirroring information).
  Mapping.prototype.appendMapping = function appendMapping (mapping) {
    for (var i = 0, startSize = this.maps.length; i < mapping.maps.length; i++) {
      var mirr = mapping.getMirror(i);
      this.appendMap(mapping.maps[i], mirr != null && mirr < i ? startSize + mirr : null);
    }
  };

  // :: (number) → ?number
  // Finds the offset of the step map that mirrors the map at the
  // given offset, in this mapping (as per the second argument to
  // `appendMap`).
  Mapping.prototype.getMirror = function getMirror (n) {
    if (this.mirror) { for (var i = 0; i < this.mirror.length; i++)
      { if (this.mirror[i] == n) { return this.mirror[i + (i % 2 ? -1 : 1)] } } }
  };

  Mapping.prototype.setMirror = function setMirror (n, m) {
    if (!this.mirror) { this.mirror = []; }
    this.mirror.push(n, m);
  };

  // :: (Mapping)
  // Append the inverse of the given mapping to this one.
  Mapping.prototype.appendMappingInverted = function appendMappingInverted (mapping) {
    for (var i = mapping.maps.length - 1, totalSize = this.maps.length + mapping.maps.length; i >= 0; i--) {
      var mirr = mapping.getMirror(i);
      this.appendMap(mapping.maps[i].invert(), mirr != null && mirr > i ? totalSize - mirr - 1 : null);
    }
  };

  // :: () → Mapping
  // Create an inverted version of this mapping.
  Mapping.prototype.invert = function invert () {
    var inverse = new Mapping;
    inverse.appendMappingInverted(this);
    return inverse
  };

  // : (number, ?number) → number
  // Map a position through this mapping.
  Mapping.prototype.map = function map (pos, assoc) {
      if ( assoc === void 0 ) assoc = 1;

    if (this.mirror) { return this._map(pos, assoc, true) }
    for (var i = this.from; i < this.to; i++)
      { pos = this.maps[i].map(pos, assoc); }
    return pos
  };

  // : (number, ?number) → MapResult
  // Map a position through this mapping, returning a mapping
  // result.
  Mapping.prototype.mapResult = function mapResult (pos, assoc) {
    if ( assoc === void 0 ) assoc = 1;
   return this._map(pos, assoc, false) };

  Mapping.prototype._map = function _map (pos, assoc, simple) {
    var deleted = false;

    for (var i = this.from; i < this.to; i++) {
      var map = this.maps[i], result = map.mapResult(pos, assoc);
      if (result.recover != null) {
        var corr = this.getMirror(i);
        if (corr != null && corr > i && corr < this.to) {
          i = corr;
          pos = this.maps[corr].recover(result.recover);
          continue
        }
      }

      if (result.deleted) { deleted = true; }
      pos = result.pos;
    }

    return simple ? pos : new MapResult(pos, deleted)
  };

  function TransformError(message) {
    var err = Error.call(this, message);
    err.__proto__ = TransformError.prototype;
    return err
  }

  TransformError.prototype = Object.create(Error.prototype);
  TransformError.prototype.constructor = TransformError;
  TransformError.prototype.name = "TransformError";

  // ::- Abstraction to build up and track an array of
  // [steps](#transform.Step) representing a document transformation.
  //
  // Most transforming methods return the `Transform` object itself, so
  // that they can be chained.
  var Transform = function Transform(doc) {
    // :: Node
    // The current document (the result of applying the steps in the
    // transform).
    this.doc = doc;
    // :: [Step]
    // The steps in this transform.
    this.steps = [];
    // :: [Node]
    // The documents before each of the steps.
    this.docs = [];
    // :: Mapping
    // A mapping with the maps for each of the steps in this transform.
    this.mapping = new Mapping;
  };

  var prototypeAccessors$4 = { before: { configurable: true },docChanged: { configurable: true } };

  // :: Node The starting document.
  prototypeAccessors$4.before.get = function () { return this.docs.length ? this.docs[0] : this.doc };

  // :: (step: Step) → this
  // Apply a new step in this transform, saving the result. Throws an
  // error when the step fails.
  Transform.prototype.step = function step (object) {
    var result = this.maybeStep(object);
    if (result.failed) { throw new TransformError(result.failed) }
    return this
  };

  // :: (Step) → StepResult
  // Try to apply a step in this transformation, ignoring it if it
  // fails. Returns the step result.
  Transform.prototype.maybeStep = function maybeStep (step) {
    var result = step.apply(this.doc);
    if (!result.failed) { this.addStep(step, result.doc); }
    return result
  };

  // :: bool
  // True when the document has been changed (when there are any
  // steps).
  prototypeAccessors$4.docChanged.get = function () {
    return this.steps.length > 0
  };

  Transform.prototype.addStep = function addStep (step, doc) {
    this.docs.push(this.doc);
    this.steps.push(step);
    this.mapping.appendMap(step.getMap());
    this.doc = doc;
  };

  Object.defineProperties( Transform.prototype, prototypeAccessors$4 );

  function mustOverride() { throw new Error("Override me") }

  var stepsByID = Object.create(null);

  // ::- A step object represents an atomic change. It generally applies
  // only to the document it was created for, since the positions
  // stored in it will only make sense for that document.
  //
  // New steps are defined by creating classes that extend `Step`,
  // overriding the `apply`, `invert`, `map`, `getMap` and `fromJSON`
  // methods, and registering your class with a unique
  // JSON-serialization identifier using
  // [`Step.jsonID`](#transform.Step^jsonID).
  var Step = function Step () {};

  Step.prototype.apply = function apply (_doc) { return mustOverride() };

  // :: () → StepMap
  // Get the step map that represents the changes made by this step,
  // and which can be used to transform between positions in the old
  // and the new document.
  Step.prototype.getMap = function getMap () { return StepMap.empty };

  // :: (doc: Node) → Step
  // Create an inverted version of this step. Needs the document as it
  // was before the step as argument.
  Step.prototype.invert = function invert (_doc) { return mustOverride() };

  // :: (mapping: Mappable) → ?Step
  // Map this step through a mappable thing, returning either a
  // version of that step with its positions adjusted, or `null` if
  // the step was entirely deleted by the mapping.
  Step.prototype.map = function map (_mapping) { return mustOverride() };

  // :: (other: Step) → ?Step
  // Try to merge this step with another one, to be applied directly
  // after it. Returns the merged step when possible, null if the
  // steps can't be merged.
  Step.prototype.merge = function merge (_other) { return null };

  // :: () → Object
  // Create a JSON-serializeable representation of this step. When
  // defining this for a custom subclass, make sure the result object
  // includes the step type's [JSON id](#transform.Step^jsonID) under
  // the `stepType` property.
  Step.prototype.toJSON = function toJSON () { return mustOverride() };

  // :: (Schema, Object) → Step
  // Deserialize a step from its JSON representation. Will call
  // through to the step class' own implementation of this method.
  Step.fromJSON = function fromJSON (schema, json) {
    if (!json || !json.stepType) { throw new RangeError("Invalid input for Step.fromJSON") }
    var type = stepsByID[json.stepType];
    if (!type) { throw new RangeError(("No step type " + (json.stepType) + " defined")) }
    return type.fromJSON(schema, json)
  };

  // :: (string, constructor<Step>)
  // To be able to serialize steps to JSON, each step needs a string
  // ID to attach to its JSON representation. Use this method to
  // register an ID for your step classes. Try to pick something
  // that's unlikely to clash with steps from other modules.
  Step.jsonID = function jsonID (id, stepClass) {
    if (id in stepsByID) { throw new RangeError("Duplicate use of step JSON ID " + id) }
    stepsByID[id] = stepClass;
    stepClass.prototype.jsonID = id;
    return stepClass
  };

  // ::- The result of [applying](#transform.Step.apply) a step. Contains either a
  // new document or a failure value.
  var StepResult = function StepResult(doc, failed) {
    // :: ?Node The transformed document.
    this.doc = doc;
    // :: ?string Text providing information about a failed step.
    this.failed = failed;
  };

  // :: (Node) → StepResult
  // Create a successful step result.
  StepResult.ok = function ok (doc) { return new StepResult(doc, null) };

  // :: (string) → StepResult
  // Create a failed step result.
  StepResult.fail = function fail (message) { return new StepResult(null, message) };

  // :: (Node, number, number, Slice) → StepResult
  // Call [`Node.replace`](#model.Node.replace) with the given
  // arguments. Create a successful result if it succeeds, and a
  // failed one if it throws a `ReplaceError`.
  StepResult.fromReplace = function fromReplace (doc, from, to, slice) {
    try {
      return StepResult.ok(doc.replace(from, to, slice))
    } catch (e) {
      if (e instanceof ReplaceError) { return StepResult.fail(e.message) }
      throw e
    }
  };

  // ::- Replace a part of the document with a slice of new content.
  var ReplaceStep = /*@__PURE__*/(function (Step) {
    function ReplaceStep(from, to, slice, structure) {
      Step.call(this);
      // :: number
      // The start position of the replaced range.
      this.from = from;
      // :: number
      // The end position of the replaced range.
      this.to = to;
      // :: Slice
      // The slice to insert.
      this.slice = slice;
      this.structure = !!structure;
    }

    if ( Step ) ReplaceStep.__proto__ = Step;
    ReplaceStep.prototype = Object.create( Step && Step.prototype );
    ReplaceStep.prototype.constructor = ReplaceStep;

    ReplaceStep.prototype.apply = function apply (doc) {
      if (this.structure && contentBetween(doc, this.from, this.to))
        { return StepResult.fail("Structure replace would overwrite content") }
      return StepResult.fromReplace(doc, this.from, this.to, this.slice)
    };

    ReplaceStep.prototype.getMap = function getMap () {
      return new StepMap([this.from, this.to - this.from, this.slice.size])
    };

    ReplaceStep.prototype.invert = function invert (doc) {
      return new ReplaceStep(this.from, this.from + this.slice.size, doc.slice(this.from, this.to))
    };

    ReplaceStep.prototype.map = function map (mapping) {
      var from = mapping.mapResult(this.from, 1), to = mapping.mapResult(this.to, -1);
      if (from.deleted && to.deleted) { return null }
      return new ReplaceStep(from.pos, Math.max(from.pos, to.pos), this.slice)
    };

    ReplaceStep.prototype.merge = function merge (other) {
      if (!(other instanceof ReplaceStep) || other.structure || this.structure) { return null }

      if (this.from + this.slice.size == other.from && !this.slice.openEnd && !other.slice.openStart) {
        var slice = this.slice.size + other.slice.size == 0 ? Slice.empty
            : new Slice(this.slice.content.append(other.slice.content), this.slice.openStart, other.slice.openEnd);
        return new ReplaceStep(this.from, this.to + (other.to - other.from), slice, this.structure)
      } else if (other.to == this.from && !this.slice.openStart && !other.slice.openEnd) {
        var slice$1 = this.slice.size + other.slice.size == 0 ? Slice.empty
            : new Slice(other.slice.content.append(this.slice.content), other.slice.openStart, this.slice.openEnd);
        return new ReplaceStep(other.from, this.to, slice$1, this.structure)
      } else {
        return null
      }
    };

    ReplaceStep.prototype.toJSON = function toJSON () {
      var json = {stepType: "replace", from: this.from, to: this.to};
      if (this.slice.size) { json.slice = this.slice.toJSON(); }
      if (this.structure) { json.structure = true; }
      return json
    };

    ReplaceStep.fromJSON = function fromJSON (schema, json) {
      if (typeof json.from != "number" || typeof json.to != "number")
        { throw new RangeError("Invalid input for ReplaceStep.fromJSON") }
      return new ReplaceStep(json.from, json.to, Slice.fromJSON(schema, json.slice), !!json.structure)
    };

    return ReplaceStep;
  }(Step));

  Step.jsonID("replace", ReplaceStep);

  // ::- Replace a part of the document with a slice of content, but
  // preserve a range of the replaced content by moving it into the
  // slice.
  var ReplaceAroundStep = /*@__PURE__*/(function (Step) {
    function ReplaceAroundStep(from, to, gapFrom, gapTo, slice, insert, structure) {
      Step.call(this);
      // :: number
      // The start position of the replaced range.
      this.from = from;
      // :: number
      // The end position of the replaced range.
      this.to = to;
      // :: number
      // The start of preserved range.
      this.gapFrom = gapFrom;
      // :: number
      // The end of preserved range.
      this.gapTo = gapTo;
      // :: Slice
      // The slice to insert.
      this.slice = slice;
      // :: number
      // The position in the slice where the preserved range should be
      // inserted.
      this.insert = insert;
      this.structure = !!structure;
    }

    if ( Step ) ReplaceAroundStep.__proto__ = Step;
    ReplaceAroundStep.prototype = Object.create( Step && Step.prototype );
    ReplaceAroundStep.prototype.constructor = ReplaceAroundStep;

    ReplaceAroundStep.prototype.apply = function apply (doc) {
      if (this.structure && (contentBetween(doc, this.from, this.gapFrom) ||
                             contentBetween(doc, this.gapTo, this.to)))
        { return StepResult.fail("Structure gap-replace would overwrite content") }

      var gap = doc.slice(this.gapFrom, this.gapTo);
      if (gap.openStart || gap.openEnd)
        { return StepResult.fail("Gap is not a flat range") }
      var inserted = this.slice.insertAt(this.insert, gap.content);
      if (!inserted) { return StepResult.fail("Content does not fit in gap") }
      return StepResult.fromReplace(doc, this.from, this.to, inserted)
    };

    ReplaceAroundStep.prototype.getMap = function getMap () {
      return new StepMap([this.from, this.gapFrom - this.from, this.insert,
                          this.gapTo, this.to - this.gapTo, this.slice.size - this.insert])
    };

    ReplaceAroundStep.prototype.invert = function invert (doc) {
      var gap = this.gapTo - this.gapFrom;
      return new ReplaceAroundStep(this.from, this.from + this.slice.size + gap,
                                   this.from + this.insert, this.from + this.insert + gap,
                                   doc.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from),
                                   this.gapFrom - this.from, this.structure)
    };

    ReplaceAroundStep.prototype.map = function map (mapping) {
      var from = mapping.mapResult(this.from, 1), to = mapping.mapResult(this.to, -1);
      var gapFrom = mapping.map(this.gapFrom, -1), gapTo = mapping.map(this.gapTo, 1);
      if ((from.deleted && to.deleted) || gapFrom < from.pos || gapTo > to.pos) { return null }
      return new ReplaceAroundStep(from.pos, to.pos, gapFrom, gapTo, this.slice, this.insert, this.structure)
    };

    ReplaceAroundStep.prototype.toJSON = function toJSON () {
      var json = {stepType: "replaceAround", from: this.from, to: this.to,
                  gapFrom: this.gapFrom, gapTo: this.gapTo, insert: this.insert};
      if (this.slice.size) { json.slice = this.slice.toJSON(); }
      if (this.structure) { json.structure = true; }
      return json
    };

    ReplaceAroundStep.fromJSON = function fromJSON (schema, json) {
      if (typeof json.from != "number" || typeof json.to != "number" ||
          typeof json.gapFrom != "number" || typeof json.gapTo != "number" || typeof json.insert != "number")
        { throw new RangeError("Invalid input for ReplaceAroundStep.fromJSON") }
      return new ReplaceAroundStep(json.from, json.to, json.gapFrom, json.gapTo,
                                   Slice.fromJSON(schema, json.slice), json.insert, !!json.structure)
    };

    return ReplaceAroundStep;
  }(Step));

  Step.jsonID("replaceAround", ReplaceAroundStep);

  function contentBetween(doc, from, to) {
    var $from = doc.resolve(from), dist = to - from, depth = $from.depth;
    while (dist > 0 && depth > 0 && $from.indexAfter(depth) == $from.node(depth).childCount) {
      depth--;
      dist--;
    }
    if (dist > 0) {
      var next = $from.node(depth).maybeChild($from.indexAfter(depth));
      while (dist > 0) {
        if (!next || next.isLeaf) { return true }
        next = next.firstChild;
        dist--;
      }
    }
    return false
  }

  function canCut(node, start, end) {
    return (start == 0 || node.canReplace(start, node.childCount)) &&
      (end == node.childCount || node.canReplace(0, end))
  }

  // :: (NodeRange) → ?number
  // Try to find a target depth to which the content in the given range
  // can be lifted. Will not go across
  // [isolating](#model.NodeSpec.isolating) parent nodes.
  function liftTarget(range) {
    var parent = range.parent;
    var content = parent.content.cutByIndex(range.startIndex, range.endIndex);
    for (var depth = range.depth;; --depth) {
      var node = range.$from.node(depth);
      var index = range.$from.index(depth), endIndex = range.$to.indexAfter(depth);
      if (depth < range.depth && node.canReplace(index, endIndex, content))
        { return depth }
      if (depth == 0 || node.type.spec.isolating || !canCut(node, index, endIndex)) { break }
    }
  }

  // :: (NodeRange, number) → this
  // Split the content in the given range off from its parent, if there
  // is sibling content before or after it, and move it up the tree to
  // the depth specified by `target`. You'll probably want to use
  // [`liftTarget`](#transform.liftTarget) to compute `target`, to make
  // sure the lift is valid.
  Transform.prototype.lift = function(range, target) {
    var $from = range.$from;
    var $to = range.$to;
    var depth = range.depth;

    var gapStart = $from.before(depth + 1), gapEnd = $to.after(depth + 1);
    var start = gapStart, end = gapEnd;

    var before = Fragment.empty, openStart = 0;
    for (var d = depth, splitting = false; d > target; d--)
      { if (splitting || $from.index(d) > 0) {
        splitting = true;
        before = Fragment.from($from.node(d).copy(before));
        openStart++;
      } else {
        start--;
      } }
    var after = Fragment.empty, openEnd = 0;
    for (var d$1 = depth, splitting$1 = false; d$1 > target; d$1--)
      { if (splitting$1 || $to.after(d$1 + 1) < $to.end(d$1)) {
        splitting$1 = true;
        after = Fragment.from($to.node(d$1).copy(after));
        openEnd++;
      } else {
        end++;
      } }

    return this.step(new ReplaceAroundStep(start, end, gapStart, gapEnd,
                                           new Slice(before.append(after), openStart, openEnd),
                                           before.size - openStart, true))
  };

  // :: (NodeRange, NodeType, ?Object, ?NodeRange) → ?[{type: NodeType, attrs: ?Object}]
  // Try to find a valid way to wrap the content in the given range in a
  // node of the given type. May introduce extra nodes around and inside
  // the wrapper node, if necessary. Returns null if no valid wrapping
  // could be found. When `innerRange` is given, that range's content is
  // used as the content to fit into the wrapping, instead of the
  // content of `range`.
  function findWrapping(range, nodeType, attrs, innerRange) {
    if ( innerRange === void 0 ) innerRange = range;

    var around = findWrappingOutside(range, nodeType);
    var inner = around && findWrappingInside(innerRange, nodeType);
    if (!inner) { return null }
    return around.map(withAttrs).concat({type: nodeType, attrs: attrs}).concat(inner.map(withAttrs))
  }

  function withAttrs(type) { return {type: type, attrs: null} }

  function findWrappingOutside(range, type) {
    var parent = range.parent;
    var startIndex = range.startIndex;
    var endIndex = range.endIndex;
    var around = parent.contentMatchAt(startIndex).findWrapping(type);
    if (!around) { return null }
    var outer = around.length ? around[0] : type;
    return parent.canReplaceWith(startIndex, endIndex, outer) ? around : null
  }

  function findWrappingInside(range, type) {
    var parent = range.parent;
    var startIndex = range.startIndex;
    var endIndex = range.endIndex;
    var inner = parent.child(startIndex);
    var inside = type.contentMatch.findWrapping(inner.type);
    if (!inside) { return null }
    var lastType = inside.length ? inside[inside.length - 1] : type;
    var innerMatch = lastType.contentMatch;
    for (var i = startIndex; innerMatch && i < endIndex; i++)
      { innerMatch = innerMatch.matchType(parent.child(i).type); }
    if (!innerMatch || !innerMatch.validEnd) { return null }
    return inside
  }

  // :: (NodeRange, [{type: NodeType, attrs: ?Object}]) → this
  // Wrap the given [range](#model.NodeRange) in the given set of wrappers.
  // The wrappers are assumed to be valid in this position, and should
  // probably be computed with [`findWrapping`](#transform.findWrapping).
  Transform.prototype.wrap = function(range, wrappers) {
    var content = Fragment.empty;
    for (var i = wrappers.length - 1; i >= 0; i--)
      { content = Fragment.from(wrappers[i].type.create(wrappers[i].attrs, content)); }

    var start = range.start, end = range.end;
    return this.step(new ReplaceAroundStep(start, end, start, end, new Slice(content, 0, 0), wrappers.length, true))
  };

  // :: (number, ?number, NodeType, ?Object) → this
  // Set the type of all textblocks (partly) between `from` and `to` to
  // the given node type with the given attributes.
  Transform.prototype.setBlockType = function(from, to, type, attrs) {
    var this$1 = this;
    if ( to === void 0 ) to = from;

    if (!type.isTextblock) { throw new RangeError("Type given to setBlockType should be a textblock") }
    var mapFrom = this.steps.length;
    this.doc.nodesBetween(from, to, function (node, pos) {
      if (node.isTextblock && !node.hasMarkup(type, attrs) && canChangeType(this$1.doc, this$1.mapping.slice(mapFrom).map(pos), type)) {
        // Ensure all markup that isn't allowed in the new node type is cleared
        this$1.clearIncompatible(this$1.mapping.slice(mapFrom).map(pos, 1), type);
        var mapping = this$1.mapping.slice(mapFrom);
        var startM = mapping.map(pos, 1), endM = mapping.map(pos + node.nodeSize, 1);
        this$1.step(new ReplaceAroundStep(startM, endM, startM + 1, endM - 1,
                                        new Slice(Fragment.from(type.create(attrs, null, node.marks)), 0, 0), 1, true));
        return false
      }
    });
    return this
  };

  function canChangeType(doc, pos, type) {
    var $pos = doc.resolve(pos), index = $pos.index();
    return $pos.parent.canReplaceWith(index, index + 1, type)
  }

  // :: (number, ?NodeType, ?Object, ?[Mark]) → this
  // Change the type, attributes, and/or marks of the node at `pos`.
  // When `type` isn't given, the existing node type is preserved,
  Transform.prototype.setNodeMarkup = function(pos, type, attrs, marks) {
    var node = this.doc.nodeAt(pos);
    if (!node) { throw new RangeError("No node at given position") }
    if (!type) { type = node.type; }
    var newNode = type.create(attrs, null, marks || node.marks);
    if (node.isLeaf)
      { return this.replaceWith(pos, pos + node.nodeSize, newNode) }

    if (!type.validContent(node.content))
      { throw new RangeError("Invalid content for node type " + type.name) }

    return this.step(new ReplaceAroundStep(pos, pos + node.nodeSize, pos + 1, pos + node.nodeSize - 1,
                                           new Slice(Fragment.from(newNode), 0, 0), 1, true))
  };

  // :: (Node, number, number, ?[?{type: NodeType, attrs: ?Object}]) → bool
  // Check whether splitting at the given position is allowed.
  function canSplit(doc, pos, depth, typesAfter) {
    if ( depth === void 0 ) depth = 1;

    var $pos = doc.resolve(pos), base = $pos.depth - depth;
    var innerType = (typesAfter && typesAfter[typesAfter.length - 1]) || $pos.parent;
    if (base < 0 || $pos.parent.type.spec.isolating ||
        !$pos.parent.canReplace($pos.index(), $pos.parent.childCount) ||
        !innerType.type.validContent($pos.parent.content.cutByIndex($pos.index(), $pos.parent.childCount)))
      { return false }
    for (var d = $pos.depth - 1, i = depth - 2; d > base; d--, i--) {
      var node = $pos.node(d), index$1 = $pos.index(d);
      if (node.type.spec.isolating) { return false }
      var rest = node.content.cutByIndex(index$1, node.childCount);
      var after = (typesAfter && typesAfter[i]) || node;
      if (after != node) { rest = rest.replaceChild(0, after.type.create(after.attrs)); }
      if (!node.canReplace(index$1 + 1, node.childCount) || !after.type.validContent(rest))
        { return false }
    }
    var index = $pos.indexAfter(base);
    var baseType = typesAfter && typesAfter[0];
    return $pos.node(base).canReplaceWith(index, index, baseType ? baseType.type : $pos.node(base + 1).type)
  }

  // :: (number, ?number, ?[?{type: NodeType, attrs: ?Object}]) → this
  // Split the node at the given position, and optionally, if `depth` is
  // greater than one, any number of nodes above that. By default, the
  // parts split off will inherit the node type of the original node.
  // This can be changed by passing an array of types and attributes to
  // use after the split.
  Transform.prototype.split = function(pos, depth, typesAfter) {
    if ( depth === void 0 ) depth = 1;

    var $pos = this.doc.resolve(pos), before = Fragment.empty, after = Fragment.empty;
    for (var d = $pos.depth, e = $pos.depth - depth, i = depth - 1; d > e; d--, i--) {
      before = Fragment.from($pos.node(d).copy(before));
      var typeAfter = typesAfter && typesAfter[i];
      after = Fragment.from(typeAfter ? typeAfter.type.create(typeAfter.attrs, after) : $pos.node(d).copy(after));
    }
    return this.step(new ReplaceStep(pos, pos, new Slice(before.append(after), depth, depth), true))
  };

  // :: (Node, number) → bool
  // Test whether the blocks before and after a given position can be
  // joined.
  function canJoin(doc, pos) {
    var $pos = doc.resolve(pos), index = $pos.index();
    return joinable($pos.nodeBefore, $pos.nodeAfter) &&
      $pos.parent.canReplace(index, index + 1)
  }

  function joinable(a, b) {
    return a && b && !a.isLeaf && a.canAppend(b)
  }

  // :: (number, ?number) → this
  // Join the blocks around the given position. If depth is 2, their
  // last and first siblings are also joined, and so on.
  Transform.prototype.join = function(pos, depth) {
    if ( depth === void 0 ) depth = 1;

    var step = new ReplaceStep(pos - depth, pos + depth, Slice.empty, true);
    return this.step(step)
  };

  // :: (Node, number, NodeType) → ?number
  // Try to find a point where a node of the given type can be inserted
  // near `pos`, by searching up the node hierarchy when `pos` itself
  // isn't a valid place but is at the start or end of a node. Return
  // null if no position was found.
  function insertPoint(doc, pos, nodeType) {
    var $pos = doc.resolve(pos);
    if ($pos.parent.canReplaceWith($pos.index(), $pos.index(), nodeType)) { return pos }

    if ($pos.parentOffset == 0)
      { for (var d = $pos.depth - 1; d >= 0; d--) {
        var index = $pos.index(d);
        if ($pos.node(d).canReplaceWith(index, index, nodeType)) { return $pos.before(d + 1) }
        if (index > 0) { return null }
      } }
    if ($pos.parentOffset == $pos.parent.content.size)
      { for (var d$1 = $pos.depth - 1; d$1 >= 0; d$1--) {
        var index$1 = $pos.indexAfter(d$1);
        if ($pos.node(d$1).canReplaceWith(index$1, index$1, nodeType)) { return $pos.after(d$1 + 1) }
        if (index$1 < $pos.node(d$1).childCount) { return null }
      } }
  }

  // :: (Node, number, Slice) → ?number
  // Finds a position at or around the given position where the given
  // slice can be inserted. Will look at parent nodes' nearest boundary
  // and try there, even if the original position wasn't directly at the
  // start or end of that node. Returns null when no position was found.
  function dropPoint(doc, pos, slice) {
    var $pos = doc.resolve(pos);
    if (!slice.content.size) { return pos }
    var content = slice.content;
    for (var i = 0; i < slice.openStart; i++) { content = content.firstChild.content; }
    for (var pass = 1; pass <= (slice.openStart == 0 && slice.size ? 2 : 1); pass++) {
      for (var d = $pos.depth; d >= 0; d--) {
        var bias = d == $pos.depth ? 0 : $pos.pos <= ($pos.start(d + 1) + $pos.end(d + 1)) / 2 ? -1 : 1;
        var insertPos = $pos.index(d) + (bias > 0 ? 1 : 0);
        var parent = $pos.node(d), fits = false;
        if (pass == 1) {
          fits = parent.canReplace(insertPos, insertPos, content);
        } else {
          var wrapping = parent.contentMatchAt(insertPos).findWrapping(content.firstChild.type);
          fits = wrapping && parent.canReplaceWith(insertPos, insertPos, wrapping[0]);
        }
        if (fits)
          { return bias == 0 ? $pos.pos : bias < 0 ? $pos.before(d + 1) : $pos.after(d + 1) }
      }
    }
    return null
  }

  function mapFragment(fragment, f, parent) {
    var mapped = [];
    for (var i = 0; i < fragment.childCount; i++) {
      var child = fragment.child(i);
      if (child.content.size) { child = child.copy(mapFragment(child.content, f, child)); }
      if (child.isInline) { child = f(child, parent, i); }
      mapped.push(child);
    }
    return Fragment.fromArray(mapped)
  }

  // ::- Add a mark to all inline content between two positions.
  var AddMarkStep = /*@__PURE__*/(function (Step) {
    function AddMarkStep(from, to, mark) {
      Step.call(this);
      // :: number
      // The start of the marked range.
      this.from = from;
      // :: number
      // The end of the marked range.
      this.to = to;
      // :: Mark
      // The mark to add.
      this.mark = mark;
    }

    if ( Step ) AddMarkStep.__proto__ = Step;
    AddMarkStep.prototype = Object.create( Step && Step.prototype );
    AddMarkStep.prototype.constructor = AddMarkStep;

    AddMarkStep.prototype.apply = function apply (doc) {
      var this$1 = this;

      var oldSlice = doc.slice(this.from, this.to), $from = doc.resolve(this.from);
      var parent = $from.node($from.sharedDepth(this.to));
      var slice = new Slice(mapFragment(oldSlice.content, function (node, parent) {
        if (!node.isAtom || !parent.type.allowsMarkType(this$1.mark.type)) { return node }
        return node.mark(this$1.mark.addToSet(node.marks))
      }, parent), oldSlice.openStart, oldSlice.openEnd);
      return StepResult.fromReplace(doc, this.from, this.to, slice)
    };

    AddMarkStep.prototype.invert = function invert () {
      return new RemoveMarkStep(this.from, this.to, this.mark)
    };

    AddMarkStep.prototype.map = function map (mapping) {
      var from = mapping.mapResult(this.from, 1), to = mapping.mapResult(this.to, -1);
      if (from.deleted && to.deleted || from.pos >= to.pos) { return null }
      return new AddMarkStep(from.pos, to.pos, this.mark)
    };

    AddMarkStep.prototype.merge = function merge (other) {
      if (other instanceof AddMarkStep &&
          other.mark.eq(this.mark) &&
          this.from <= other.to && this.to >= other.from)
        { return new AddMarkStep(Math.min(this.from, other.from),
                               Math.max(this.to, other.to), this.mark) }
    };

    AddMarkStep.prototype.toJSON = function toJSON () {
      return {stepType: "addMark", mark: this.mark.toJSON(),
              from: this.from, to: this.to}
    };

    AddMarkStep.fromJSON = function fromJSON (schema, json) {
      if (typeof json.from != "number" || typeof json.to != "number")
        { throw new RangeError("Invalid input for AddMarkStep.fromJSON") }
      return new AddMarkStep(json.from, json.to, schema.markFromJSON(json.mark))
    };

    return AddMarkStep;
  }(Step));

  Step.jsonID("addMark", AddMarkStep);

  // ::- Remove a mark from all inline content between two positions.
  var RemoveMarkStep = /*@__PURE__*/(function (Step) {
    function RemoveMarkStep(from, to, mark) {
      Step.call(this);
      // :: number
      // The start of the unmarked range.
      this.from = from;
      // :: number
      // The end of the unmarked range.
      this.to = to;
      // :: Mark
      // The mark to remove.
      this.mark = mark;
    }

    if ( Step ) RemoveMarkStep.__proto__ = Step;
    RemoveMarkStep.prototype = Object.create( Step && Step.prototype );
    RemoveMarkStep.prototype.constructor = RemoveMarkStep;

    RemoveMarkStep.prototype.apply = function apply (doc) {
      var this$1 = this;

      var oldSlice = doc.slice(this.from, this.to);
      var slice = new Slice(mapFragment(oldSlice.content, function (node) {
        return node.mark(this$1.mark.removeFromSet(node.marks))
      }), oldSlice.openStart, oldSlice.openEnd);
      return StepResult.fromReplace(doc, this.from, this.to, slice)
    };

    RemoveMarkStep.prototype.invert = function invert () {
      return new AddMarkStep(this.from, this.to, this.mark)
    };

    RemoveMarkStep.prototype.map = function map (mapping) {
      var from = mapping.mapResult(this.from, 1), to = mapping.mapResult(this.to, -1);
      if (from.deleted && to.deleted || from.pos >= to.pos) { return null }
      return new RemoveMarkStep(from.pos, to.pos, this.mark)
    };

    RemoveMarkStep.prototype.merge = function merge (other) {
      if (other instanceof RemoveMarkStep &&
          other.mark.eq(this.mark) &&
          this.from <= other.to && this.to >= other.from)
        { return new RemoveMarkStep(Math.min(this.from, other.from),
                                  Math.max(this.to, other.to), this.mark) }
    };

    RemoveMarkStep.prototype.toJSON = function toJSON () {
      return {stepType: "removeMark", mark: this.mark.toJSON(),
              from: this.from, to: this.to}
    };

    RemoveMarkStep.fromJSON = function fromJSON (schema, json) {
      if (typeof json.from != "number" || typeof json.to != "number")
        { throw new RangeError("Invalid input for RemoveMarkStep.fromJSON") }
      return new RemoveMarkStep(json.from, json.to, schema.markFromJSON(json.mark))
    };

    return RemoveMarkStep;
  }(Step));

  Step.jsonID("removeMark", RemoveMarkStep);

  // :: (number, number, Mark) → this
  // Add the given mark to the inline content between `from` and `to`.
  Transform.prototype.addMark = function(from, to, mark) {
    var this$1 = this;

    var removed = [], added = [], removing = null, adding = null;
    this.doc.nodesBetween(from, to, function (node, pos, parent) {
      if (!node.isInline) { return }
      var marks = node.marks;
      if (!mark.isInSet(marks) && parent.type.allowsMarkType(mark.type)) {
        var start = Math.max(pos, from), end = Math.min(pos + node.nodeSize, to);
        var newSet = mark.addToSet(marks);

        for (var i = 0; i < marks.length; i++) {
          if (!marks[i].isInSet(newSet)) {
            if (removing && removing.to == start && removing.mark.eq(marks[i]))
              { removing.to = end; }
            else
              { removed.push(removing = new RemoveMarkStep(start, end, marks[i])); }
          }
        }

        if (adding && adding.to == start)
          { adding.to = end; }
        else
          { added.push(adding = new AddMarkStep(start, end, mark)); }
      }
    });

    removed.forEach(function (s) { return this$1.step(s); });
    added.forEach(function (s) { return this$1.step(s); });
    return this
  };

  // :: (number, number, ?union<Mark, MarkType>) → this
  // Remove marks from inline nodes between `from` and `to`. When `mark`
  // is a single mark, remove precisely that mark. When it is a mark type,
  // remove all marks of that type. When it is null, remove all marks of
  // any type.
  Transform.prototype.removeMark = function(from, to, mark) {
    var this$1 = this;
    if ( mark === void 0 ) mark = null;

    var matched = [], step = 0;
    this.doc.nodesBetween(from, to, function (node, pos) {
      if (!node.isInline) { return }
      step++;
      var toRemove = null;
      if (mark instanceof MarkType) {
        var set = node.marks, found;
        while (found = mark.isInSet(set)) {
  (toRemove || (toRemove = [])).push(found);
          set = found.removeFromSet(set);
        }
      } else if (mark) {
        if (mark.isInSet(node.marks)) { toRemove = [mark]; }
      } else {
        toRemove = node.marks;
      }
      if (toRemove && toRemove.length) {
        var end = Math.min(pos + node.nodeSize, to);
        for (var i = 0; i < toRemove.length; i++) {
          var style = toRemove[i], found$1 = (void 0);
          for (var j = 0; j < matched.length; j++) {
            var m = matched[j];
            if (m.step == step - 1 && style.eq(matched[j].style)) { found$1 = m; }
          }
          if (found$1) {
            found$1.to = end;
            found$1.step = step;
          } else {
            matched.push({style: style, from: Math.max(pos, from), to: end, step: step});
          }
        }
      }
    });
    matched.forEach(function (m) { return this$1.step(new RemoveMarkStep(m.from, m.to, m.style)); });
    return this
  };

  // :: (number, NodeType, ?ContentMatch) → this
  // Removes all marks and nodes from the content of the node at `pos`
  // that don't match the given new parent node type. Accepts an
  // optional starting [content match](#model.ContentMatch) as third
  // argument.
  Transform.prototype.clearIncompatible = function(pos, parentType, match) {
    if ( match === void 0 ) match = parentType.contentMatch;

    var node = this.doc.nodeAt(pos);
    var delSteps = [], cur = pos + 1;
    for (var i = 0; i < node.childCount; i++) {
      var child = node.child(i), end = cur + child.nodeSize;
      var allowed = match.matchType(child.type, child.attrs);
      if (!allowed) {
        delSteps.push(new ReplaceStep(cur, end, Slice.empty));
      } else {
        match = allowed;
        for (var j = 0; j < child.marks.length; j++) { if (!parentType.allowsMarkType(child.marks[j].type))
          { this.step(new RemoveMarkStep(cur, end, child.marks[j])); } }
      }
      cur = end;
    }
    if (!match.validEnd) {
      var fill = match.fillBefore(Fragment.empty, true);
      this.replace(cur, cur, new Slice(fill, 0, 0));
    }
    for (var i$1 = delSteps.length - 1; i$1 >= 0; i$1--) { this.step(delSteps[i$1]); }
    return this
  };

  // :: (Node, number, ?number, ?Slice) → ?Step
  // ‘Fit’ a slice into a given position in the document, producing a
  // [step](#transform.Step) that inserts it. Will return null if
  // there's no meaningful way to insert the slice here, or inserting it
  // would be a no-op (an empty slice over an empty range).
  function replaceStep(doc, from, to, slice) {
    if ( to === void 0 ) to = from;
    if ( slice === void 0 ) slice = Slice.empty;

    if (from == to && !slice.size) { return null }

    var $from = doc.resolve(from), $to = doc.resolve(to);
    // Optimization -- avoid work if it's obvious that it's not needed.
    if (fitsTrivially($from, $to, slice)) { return new ReplaceStep(from, to, slice) }
    return new Fitter($from, $to, slice).fit()
  }

  // :: (number, ?number, ?Slice) → this
  // Replace the part of the document between `from` and `to` with the
  // given `slice`.
  Transform.prototype.replace = function(from, to, slice) {
    if ( to === void 0 ) to = from;
    if ( slice === void 0 ) slice = Slice.empty;

    var step = replaceStep(this.doc, from, to, slice);
    if (step) { this.step(step); }
    return this
  };

  // :: (number, number, union<Fragment, Node, [Node]>) → this
  // Replace the given range with the given content, which may be a
  // fragment, node, or array of nodes.
  Transform.prototype.replaceWith = function(from, to, content) {
    return this.replace(from, to, new Slice(Fragment.from(content), 0, 0))
  };

  // :: (number, number) → this
  // Delete the content between the given positions.
  Transform.prototype.delete = function(from, to) {
    return this.replace(from, to, Slice.empty)
  };

  // :: (number, union<Fragment, Node, [Node]>) → this
  // Insert the given content at the given position.
  Transform.prototype.insert = function(pos, content) {
    return this.replaceWith(pos, pos, content)
  };

  function fitsTrivially($from, $to, slice) {
    return !slice.openStart && !slice.openEnd && $from.start() == $to.start() &&
      $from.parent.canReplace($from.index(), $to.index(), slice.content)
  }

  // Algorithm for 'placing' the elements of a slice into a gap:
  //
  // We consider the content of each node that is open to the left to be
  // independently placeable. I.e. in <p("foo"), p("bar")>, when the
  // paragraph on the left is open, "foo" can be placed (somewhere on
  // the left side of the replacement gap) independently from p("bar").
  //
  // This class tracks the state of the placement progress in the
  // following properties:
  //
  //  - `frontier` holds a stack of `{type, match}` objects that
  //    represent the open side of the replacement. It starts at
  //    `$from`, then moves forward as content is placed, and is finally
  //    reconciled with `$to`.
  //
  //  - `unplaced` is a slice that represents the content that hasn't
  //    been placed yet.
  //
  //  - `placed` is a fragment of placed content. Its open-start value
  //    is implicit in `$from`, and its open-end value in `frontier`.
  var Fitter = function Fitter($from, $to, slice) {
    this.$to = $to;
    this.$from = $from;
    this.unplaced = slice;

    this.frontier = [];
    for (var i = 0; i <= $from.depth; i++) {
      var node = $from.node(i);
      this.frontier.push({
        type: node.type,
        match: node.contentMatchAt($from.indexAfter(i))
      });
    }

    this.placed = Fragment.empty;
    for (var i$1 = $from.depth; i$1 > 0; i$1--)
      { this.placed = Fragment.from($from.node(i$1).copy(this.placed)); }
  };

  var prototypeAccessors$1$2 = { depth: { configurable: true } };

  prototypeAccessors$1$2.depth.get = function () { return this.frontier.length - 1 };

  Fitter.prototype.fit = function fit () {
    // As long as there's unplaced content, try to place some of it.
    // If that fails, either increase the open score of the unplaced
    // slice, or drop nodes from it, and then try again.
    while (this.unplaced.size) {
      var fit = this.findFittable();
      if (fit) { this.placeNodes(fit); }
      else { this.openMore() || this.dropNode(); }
    }
    // When there's inline content directly after the frontier _and_
    // directly after `this.$to`, we must generate a `ReplaceAround`
    // step that pulls that content into the node after the frontier.
    // That means the fitting must be done to the end of the textblock
    // node after `this.$to`, not `this.$to` itself.
    var moveInline = this.mustMoveInline(), placedSize = this.placed.size - this.depth - this.$from.depth;
    var $from = this.$from, $to = this.close(moveInline < 0 ? this.$to : $from.doc.resolve(moveInline));
    if (!$to) { return null }

    // If closing to `$to` succeeded, create a step
    var content = this.placed, openStart = $from.depth, openEnd = $to.depth;
    while (openStart && openEnd && content.childCount == 1) { // Normalize by dropping open parent nodes
      content = content.firstChild.content;
      openStart--; openEnd--;
    }
    var slice = new Slice(content, openStart, openEnd);
    if (moveInline > -1)
      { return new ReplaceAroundStep($from.pos, moveInline, this.$to.pos, this.$to.end(), slice, placedSize) }
    if (slice.size || $from.pos != this.$to.pos) // Don't generate no-op steps
      { return new ReplaceStep($from.pos, $to.pos, slice) }
  };

  // Find a position on the start spine of `this.unplaced` that has
  // content that can be moved somewhere on the frontier. Returns two
  // depths, one for the slice and one for the frontier.
  Fitter.prototype.findFittable = function findFittable () {
    // Only try wrapping nodes (pass 2) after finding a place without
    // wrapping failed.
    for (var pass = 1; pass <= 2; pass++) {
      for (var sliceDepth = this.unplaced.openStart; sliceDepth >= 0; sliceDepth--) {
        var fragment = (void 0), parent = (void 0);
        if (sliceDepth) {
          parent = contentAt(this.unplaced.content, sliceDepth - 1).firstChild;
          fragment = parent.content;
        } else {
          fragment = this.unplaced.content;
        }
        var first = fragment.firstChild;
        for (var frontierDepth = this.depth; frontierDepth >= 0; frontierDepth--) {
          var ref = this.frontier[frontierDepth];
            var type = ref.type;
            var match = ref.match;
            var wrap = (void 0), inject = (void 0);
          // In pass 1, if the next node matches, or there is no next
          // node but the parents look compatible, we've found a
          // place.
          if (pass == 1 && (first ? match.matchType(first.type) || (inject = match.fillBefore(Fragment.from(first), false))
                            : type.compatibleContent(parent.type)))
            { return {sliceDepth: sliceDepth, frontierDepth: frontierDepth, parent: parent, inject: inject} }
          // In pass 2, look for a set of wrapping nodes that make
          // `first` fit here.
          else if (pass == 2 && first && (wrap = match.findWrapping(first.type)))
            { return {sliceDepth: sliceDepth, frontierDepth: frontierDepth, parent: parent, wrap: wrap} }
          // Don't continue looking further up if the parent node
          // would fit here.
          if (parent && match.matchType(parent.type)) { break }
        }
      }
    }
  };

  Fitter.prototype.openMore = function openMore () {
    var ref = this.unplaced;
      var content = ref.content;
      var openStart = ref.openStart;
      var openEnd = ref.openEnd;
    var inner = contentAt(content, openStart);
    if (!inner.childCount || inner.firstChild.isLeaf) { return false }
    this.unplaced = new Slice(content, openStart + 1,
                              Math.max(openEnd, inner.size + openStart >= content.size - openEnd ? openStart + 1 : 0));
    return true
  };

  Fitter.prototype.dropNode = function dropNode () {
    var ref = this.unplaced;
      var content = ref.content;
      var openStart = ref.openStart;
      var openEnd = ref.openEnd;
    var inner = contentAt(content, openStart);
    if (inner.childCount <= 1 && openStart > 0) {
      var openAtEnd = content.size - openStart <= openStart + inner.size;
      this.unplaced = new Slice(dropFromFragment(content, openStart - 1, 1), openStart - 1,
                                openAtEnd ? openStart - 1 : openEnd);
    } else {
      this.unplaced = new Slice(dropFromFragment(content, openStart, 1), openStart, openEnd);
    }
  };

  // : ({sliceDepth: number, frontierDepth: number, parent: ?Node, wrap: ?[NodeType], inject: ?Fragment})
  // Move content from the unplaced slice at `sliceDepth` to the
  // frontier node at `frontierDepth`. Close that frontier node when
  // applicable.
  Fitter.prototype.placeNodes = function placeNodes (ref) {
      var sliceDepth = ref.sliceDepth;
      var frontierDepth = ref.frontierDepth;
      var parent = ref.parent;
      var inject = ref.inject;
      var wrap = ref.wrap;

    while (this.depth > frontierDepth) { this.closeFrontierNode(); }
    if (wrap) { for (var i = 0; i < wrap.length; i++) { this.openFrontierNode(wrap[i]); } }

    var slice = this.unplaced, fragment = parent ? parent.content : slice.content;
    var openStart = slice.openStart - sliceDepth;
    var taken = 0, add = [];
    var ref$1 = this.frontier[frontierDepth];
      var match = ref$1.match;
      var type = ref$1.type;
    if (inject) {
      for (var i$1 = 0; i$1 < inject.childCount; i$1++) { add.push(inject.child(i$1)); }
      match = match.matchFragment(inject);
    }
    // Computes the amount of (end) open nodes at the end of the
    // fragment. When 0, the parent is open, but no more. When
    // negative, nothing is open.
    var openEndCount = (fragment.size + sliceDepth) - (slice.content.size - slice.openEnd);
    // Scan over the fragment, fitting as many child nodes as
    // possible.
    while (taken < fragment.childCount) {
      var next = fragment.child(taken), matches = match.matchType(next.type);
      if (!matches) { break }
      taken++;
      if (taken > 1 || openStart == 0 || next.content.size) { // Drop empty open nodes
        match = matches;
        add.push(closeNodeStart(next.mark(type.allowedMarks(next.marks)), taken == 1 ? openStart : 0,
                                taken == fragment.childCount ? openEndCount : -1));
      }
    }
    var toEnd = taken == fragment.childCount;
    if (!toEnd) { openEndCount = -1; }

    this.placed = addToFragment(this.placed, frontierDepth, Fragment.from(add));
    this.frontier[frontierDepth].match = match;

    // If the parent types match, and the entire node was moved, and
    // it's not open, close this frontier node right away.
    if (toEnd && openEndCount < 0 && parent && parent.type == this.frontier[this.depth].type && this.frontier.length > 1)
      { this.closeFrontierNode(); }

    // Add new frontier nodes for any open nodes at the end.
    for (var i$2 = 0, cur = fragment; i$2 < openEndCount; i$2++) {
      var node = cur.lastChild;
      this.frontier.push({type: node.type, match: node.contentMatchAt(node.childCount)});
      cur = node.content;
    }

    // Update `this.unplaced`. Drop the entire node from which we
    // placed it we got to its end, otherwise just drop the placed
    // nodes.
    this.unplaced = !toEnd ? new Slice(dropFromFragment(slice.content, sliceDepth, taken), slice.openStart, slice.openEnd)
      : sliceDepth == 0 ? Slice.empty
      : new Slice(dropFromFragment(slice.content, sliceDepth - 1, 1),
                  sliceDepth - 1, openEndCount < 0 ? slice.openEnd : sliceDepth - 1);
  };

  Fitter.prototype.mustMoveInline = function mustMoveInline () {
    if (!this.$to.parent.isTextblock || this.$to.end() == this.$to.pos) { return -1 }
    var top = this.frontier[this.depth], level;
    if (!top.type.isTextblock || !contentAfterFits(this.$to, this.$to.depth, top.type, top.match, false) ||
        (this.$to.depth == this.depth && (level = this.findCloseLevel(this.$to)) && level.depth == this.depth)) { return -1 }

    var ref = this.$to;
      var depth = ref.depth;
      var after = this.$to.after(depth);
    while (depth > 1 && after == this.$to.end(--depth)) { ++after; }
    return after
  };

  Fitter.prototype.findCloseLevel = function findCloseLevel ($to) {
    scan: for (var i = Math.min(this.depth, $to.depth); i >= 0; i--) {
      var ref = this.frontier[i];
        var match = ref.match;
        var type = ref.type;
      var dropInner = i < $to.depth && $to.end(i + 1) == $to.pos + ($to.depth - (i + 1));
      var fit = contentAfterFits($to, i, type, match, dropInner);
      if (!fit) { continue }
      for (var d = i - 1; d >= 0; d--) {
        var ref$1 = this.frontier[d];
          var match$1 = ref$1.match;
          var type$1 = ref$1.type;
        var matches = contentAfterFits($to, d, type$1, match$1, true);
        if (!matches || matches.childCount) { continue scan }
      }
      return {depth: i, fit: fit, move: dropInner ? $to.doc.resolve($to.after(i + 1)) : $to}
    }
  };

  Fitter.prototype.close = function close ($to) {
    var close = this.findCloseLevel($to);
    if (!close) { return null }

    while (this.depth > close.depth) { this.closeFrontierNode(); }
    if (close.fit.childCount) { this.placed = addToFragment(this.placed, close.depth, close.fit); }
    $to = close.move;
    for (var d = close.depth + 1; d <= $to.depth; d++) {
      var node = $to.node(d), add = node.type.contentMatch.fillBefore(node.content, true, $to.index(d));
      this.openFrontierNode(node.type, node.attrs, add);
    }
    return $to
  };

  Fitter.prototype.openFrontierNode = function openFrontierNode (type, attrs, content) {
    var top = this.frontier[this.depth];
    top.match = top.match.matchType(type);
    this.placed = addToFragment(this.placed, this.depth, Fragment.from(type.create(attrs, content)));
    this.frontier.push({type: type, match: type.contentMatch});
  };

  Fitter.prototype.closeFrontierNode = function closeFrontierNode () {
    var open = this.frontier.pop();
    var add = open.match.fillBefore(Fragment.empty, true);
    if (add.childCount) { this.placed = addToFragment(this.placed, this.frontier.length, add); }
  };

  Object.defineProperties( Fitter.prototype, prototypeAccessors$1$2 );

  function dropFromFragment(fragment, depth, count) {
    if (depth == 0) { return fragment.cutByIndex(count) }
    return fragment.replaceChild(0, fragment.firstChild.copy(dropFromFragment(fragment.firstChild.content, depth - 1, count)))
  }

  function addToFragment(fragment, depth, content) {
    if (depth == 0) { return fragment.append(content) }
    return fragment.replaceChild(fragment.childCount - 1,
                                 fragment.lastChild.copy(addToFragment(fragment.lastChild.content, depth - 1, content)))
  }

  function contentAt(fragment, depth) {
    for (var i = 0; i < depth; i++) { fragment = fragment.firstChild.content; }
    return fragment
  }

  function closeNodeStart(node, openStart, openEnd) {
    if (openStart <= 0) { return node }
    var frag = node.content;
    if (openStart > 1)
      { frag = frag.replaceChild(0, closeNodeStart(frag.firstChild, openStart - 1, frag.childCount == 1 ? openEnd - 1 : 0)); }
    if (openStart > 0) {
      frag = node.type.contentMatch.fillBefore(frag).append(frag);
      if (openEnd <= 0) { frag = frag.append(node.type.contentMatch.matchFragment(frag).fillBefore(Fragment.empty, true)); }
    }
    return node.copy(frag)
  }

  function contentAfterFits($to, depth, type, match, open) {
    var node = $to.node(depth), index = open ? $to.indexAfter(depth) : $to.index(depth);
    if (index == node.childCount && !type.compatibleContent(node.type)) { return null }
    var fit = match.fillBefore(node.content, true, index);
    return fit && !invalidMarks(type, node.content, index) ? fit : null
  }

  function invalidMarks(type, fragment, start) {
    for (var i = start; i < fragment.childCount; i++)
      { if (!type.allowsMarks(fragment.child(i).marks)) { return true } }
    return false
  }

  // :: (number, number, Slice) → this
  // Replace a range of the document with a given slice, using `from`,
  // `to`, and the slice's [`openStart`](#model.Slice.openStart) property
  // as hints, rather than fixed start and end points. This method may
  // grow the replaced area or close open nodes in the slice in order to
  // get a fit that is more in line with WYSIWYG expectations, by
  // dropping fully covered parent nodes of the replaced region when
  // they are marked [non-defining](#model.NodeSpec.defining), or
  // including an open parent node from the slice that _is_ marked as
  // [defining](#model.NodeSpec.defining).
  //
  // This is the method, for example, to handle paste. The similar
  // [`replace`](#transform.Transform.replace) method is a more
  // primitive tool which will _not_ move the start and end of its given
  // range, and is useful in situations where you need more precise
  // control over what happens.
  Transform.prototype.replaceRange = function(from, to, slice) {
    if (!slice.size) { return this.deleteRange(from, to) }

    var $from = this.doc.resolve(from), $to = this.doc.resolve(to);
    if (fitsTrivially($from, $to, slice))
      { return this.step(new ReplaceStep(from, to, slice)) }

    var targetDepths = coveredDepths($from, this.doc.resolve(to));
    // Can't replace the whole document, so remove 0 if it's present
    if (targetDepths[targetDepths.length - 1] == 0) { targetDepths.pop(); }
    // Negative numbers represent not expansion over the whole node at
    // that depth, but replacing from $from.before(-D) to $to.pos.
    var preferredTarget = -($from.depth + 1);
    targetDepths.unshift(preferredTarget);
    // This loop picks a preferred target depth, if one of the covering
    // depths is not outside of a defining node, and adds negative
    // depths for any depth that has $from at its start and does not
    // cross a defining node.
    for (var d = $from.depth, pos = $from.pos - 1; d > 0; d--, pos--) {
      var spec = $from.node(d).type.spec;
      if (spec.defining || spec.isolating) { break }
      if (targetDepths.indexOf(d) > -1) { preferredTarget = d; }
      else if ($from.before(d) == pos) { targetDepths.splice(1, 0, -d); }
    }
    // Try to fit each possible depth of the slice into each possible
    // target depth, starting with the preferred depths.
    var preferredTargetIndex = targetDepths.indexOf(preferredTarget);

    var leftNodes = [], preferredDepth = slice.openStart;
    for (var content = slice.content, i = 0;; i++) {
      var node = content.firstChild;
      leftNodes.push(node);
      if (i == slice.openStart) { break }
      content = node.content;
    }
    // Back up if the node directly above openStart, or the node above
    // that separated only by a non-defining textblock node, is defining.
    if (preferredDepth > 0 && leftNodes[preferredDepth - 1].type.spec.defining &&
        $from.node(preferredTargetIndex).type != leftNodes[preferredDepth - 1].type)
      { preferredDepth -= 1; }
    else if (preferredDepth >= 2 && leftNodes[preferredDepth - 1].isTextblock && leftNodes[preferredDepth - 2].type.spec.defining &&
             $from.node(preferredTargetIndex).type != leftNodes[preferredDepth - 2].type)
      { preferredDepth -= 2; }

    for (var j = slice.openStart; j >= 0; j--) {
      var openDepth = (j + preferredDepth + 1) % (slice.openStart + 1);
      var insert = leftNodes[openDepth];
      if (!insert) { continue }
      for (var i$1 = 0; i$1 < targetDepths.length; i$1++) {
        // Loop over possible expansion levels, starting with the
        // preferred one
        var targetDepth = targetDepths[(i$1 + preferredTargetIndex) % targetDepths.length], expand = true;
        if (targetDepth < 0) { expand = false; targetDepth = -targetDepth; }
        var parent = $from.node(targetDepth - 1), index = $from.index(targetDepth - 1);
        if (parent.canReplaceWith(index, index, insert.type, insert.marks))
          { return this.replace($from.before(targetDepth), expand ? $to.after(targetDepth) : to,
                              new Slice(closeFragment(slice.content, 0, slice.openStart, openDepth),
                                        openDepth, slice.openEnd)) }
      }
    }

    var startSteps = this.steps.length;
    for (var i$2 = targetDepths.length - 1; i$2 >= 0; i$2--) {
      this.replace(from, to, slice);
      if (this.steps.length > startSteps) { break }
      var depth = targetDepths[i$2];
      if (depth < 0) { continue }
      from = $from.before(depth); to = $to.after(depth);
    }
    return this
  };

  function closeFragment(fragment, depth, oldOpen, newOpen, parent) {
    if (depth < oldOpen) {
      var first = fragment.firstChild;
      fragment = fragment.replaceChild(0, first.copy(closeFragment(first.content, depth + 1, oldOpen, newOpen, first)));
    }
    if (depth > newOpen) {
      var match = parent.contentMatchAt(0);
      var start = match.fillBefore(fragment).append(fragment);
      fragment = start.append(match.matchFragment(start).fillBefore(Fragment.empty, true));
    }
    return fragment
  }

  // :: (number, number, Node) → this
  // Replace the given range with a node, but use `from` and `to` as
  // hints, rather than precise positions. When from and to are the same
  // and are at the start or end of a parent node in which the given
  // node doesn't fit, this method may _move_ them out towards a parent
  // that does allow the given node to be placed. When the given range
  // completely covers a parent node, this method may completely replace
  // that parent node.
  Transform.prototype.replaceRangeWith = function(from, to, node) {
    if (!node.isInline && from == to && this.doc.resolve(from).parent.content.size) {
      var point = insertPoint(this.doc, from, node.type);
      if (point != null) { from = to = point; }
    }
    return this.replaceRange(from, to, new Slice(Fragment.from(node), 0, 0))
  };

  // :: (number, number) → this
  // Delete the given range, expanding it to cover fully covered
  // parent nodes until a valid replace is found.
  Transform.prototype.deleteRange = function(from, to) {
    var $from = this.doc.resolve(from), $to = this.doc.resolve(to);
    var covered = coveredDepths($from, $to);
    for (var i = 0; i < covered.length; i++) {
      var depth = covered[i], last = i == covered.length - 1;
      if ((last && depth == 0) || $from.node(depth).type.contentMatch.validEnd)
        { return this.delete($from.start(depth), $to.end(depth)) }
      if (depth > 0 && (last || $from.node(depth - 1).canReplace($from.index(depth - 1), $to.indexAfter(depth - 1))))
        { return this.delete($from.before(depth), $to.after(depth)) }
    }
    for (var d = 1; d <= $from.depth && d <= $to.depth; d++) {
      if (from - $from.start(d) == $from.depth - d && to > $from.end(d) && $to.end(d) - to != $to.depth - d)
        { return this.delete($from.before(d), to) }
    }
    return this.delete(from, to)
  };

  // : (ResolvedPos, ResolvedPos) → [number]
  // Returns an array of all depths for which $from - $to spans the
  // whole content of the nodes at that depth.
  function coveredDepths($from, $to) {
    var result = [], minDepth = Math.min($from.depth, $to.depth);
    for (var d = minDepth; d >= 0; d--) {
      var start = $from.start(d);
      if (start < $from.pos - ($from.depth - d) ||
          $to.end(d) > $to.pos + ($to.depth - d) ||
          $from.node(d).type.spec.isolating ||
          $to.node(d).type.spec.isolating) { break }
      if (start == $to.start(d)) { result.push(d); }
    }
    return result
  }

  var classesById = Object.create(null);

  // ::- Superclass for editor selections. Every selection type should
  // extend this. Should not be instantiated directly.
  var Selection = function Selection($anchor, $head, ranges) {
    // :: [SelectionRange]
    // The ranges covered by the selection.
    this.ranges = ranges || [new SelectionRange($anchor.min($head), $anchor.max($head))];
    // :: ResolvedPos
    // The resolved anchor of the selection (the side that stays in
    // place when the selection is modified).
    this.$anchor = $anchor;
    // :: ResolvedPos
    // The resolved head of the selection (the side that moves when
    // the selection is modified).
    this.$head = $head;
  };

  var prototypeAccessors$3 = { anchor: { configurable: true },head: { configurable: true },from: { configurable: true },to: { configurable: true },$from: { configurable: true },$to: { configurable: true },empty: { configurable: true } };

  // :: number
  // The selection's anchor, as an unresolved position.
  prototypeAccessors$3.anchor.get = function () { return this.$anchor.pos };

  // :: number
  // The selection's head.
  prototypeAccessors$3.head.get = function () { return this.$head.pos };

  // :: number
  // The lower bound of the selection's main range.
  prototypeAccessors$3.from.get = function () { return this.$from.pos };

  // :: number
  // The upper bound of the selection's main range.
  prototypeAccessors$3.to.get = function () { return this.$to.pos };

  // :: ResolvedPos
  // The resolved lowerbound of the selection's main range.
  prototypeAccessors$3.$from.get = function () {
    return this.ranges[0].$from
  };

  // :: ResolvedPos
  // The resolved upper bound of the selection's main range.
  prototypeAccessors$3.$to.get = function () {
    return this.ranges[0].$to
  };

  // :: bool
  // Indicates whether the selection contains any content.
  prototypeAccessors$3.empty.get = function () {
    var ranges = this.ranges;
    for (var i = 0; i < ranges.length; i++)
      { if (ranges[i].$from.pos != ranges[i].$to.pos) { return false } }
    return true
  };

  // eq:: (Selection) → bool
  // Test whether the selection is the same as another selection.

  // map:: (doc: Node, mapping: Mappable) → Selection
  // Map this selection through a [mappable](#transform.Mappable) thing. `doc`
  // should be the new document to which we are mapping.

  // :: () → Slice
  // Get the content of this selection as a slice.
  Selection.prototype.content = function content () {
    return this.$from.node(0).slice(this.from, this.to, true)
  };

  // :: (Transaction, ?Slice)
  // Replace the selection with a slice or, if no slice is given,
  // delete the selection. Will append to the given transaction.
  Selection.prototype.replace = function replace (tr, content) {
      if ( content === void 0 ) content = Slice.empty;

    // Put the new selection at the position after the inserted
    // content. When that ended in an inline node, search backwards,
    // to get the position after that node. If not, search forward.
    var lastNode = content.content.lastChild, lastParent = null;
    for (var i = 0; i < content.openEnd; i++) {
      lastParent = lastNode;
      lastNode = lastNode.lastChild;
    }

    var mapFrom = tr.steps.length, ranges = this.ranges;
    for (var i$1 = 0; i$1 < ranges.length; i$1++) {
      var ref = ranges[i$1];
        var $from = ref.$from;
        var $to = ref.$to;
        var mapping = tr.mapping.slice(mapFrom);
      tr.replaceRange(mapping.map($from.pos), mapping.map($to.pos), i$1 ? Slice.empty : content);
      if (i$1 == 0)
        { selectionToInsertionEnd$1(tr, mapFrom, (lastNode ? lastNode.isInline : lastParent && lastParent.isTextblock) ? -1 : 1); }
    }
  };

  // :: (Transaction, Node)
  // Replace the selection with the given node, appending the changes
  // to the given transaction.
  Selection.prototype.replaceWith = function replaceWith (tr, node) {
    var mapFrom = tr.steps.length, ranges = this.ranges;
    for (var i = 0; i < ranges.length; i++) {
      var ref = ranges[i];
        var $from = ref.$from;
        var $to = ref.$to;
        var mapping = tr.mapping.slice(mapFrom);
      var from = mapping.map($from.pos), to = mapping.map($to.pos);
      if (i) {
        tr.deleteRange(from, to);
      } else {
        tr.replaceRangeWith(from, to, node);
        selectionToInsertionEnd$1(tr, mapFrom, node.isInline ? -1 : 1);
      }
    }
  };

  // toJSON:: () → Object
  // Convert the selection to a JSON representation. When implementing
  // this for a custom selection class, make sure to give the object a
  // `type` property whose value matches the ID under which you
  // [registered](#state.Selection^jsonID) your class.

  // :: (ResolvedPos, number, ?bool) → ?Selection
  // Find a valid cursor or leaf node selection starting at the given
  // position and searching back if `dir` is negative, and forward if
  // positive. When `textOnly` is true, only consider cursor
  // selections. Will return null when no valid selection position is
  // found.
  Selection.findFrom = function findFrom ($pos, dir, textOnly) {
    var inner = $pos.parent.inlineContent ? new TextSelection($pos)
        : findSelectionIn($pos.node(0), $pos.parent, $pos.pos, $pos.index(), dir, textOnly);
    if (inner) { return inner }

    for (var depth = $pos.depth - 1; depth >= 0; depth--) {
      var found = dir < 0
          ? findSelectionIn($pos.node(0), $pos.node(depth), $pos.before(depth + 1), $pos.index(depth), dir, textOnly)
          : findSelectionIn($pos.node(0), $pos.node(depth), $pos.after(depth + 1), $pos.index(depth) + 1, dir, textOnly);
      if (found) { return found }
    }
  };

  // :: (ResolvedPos, ?number) → Selection
  // Find a valid cursor or leaf node selection near the given
  // position. Searches forward first by default, but if `bias` is
  // negative, it will search backwards first.
  Selection.near = function near ($pos, bias) {
      if ( bias === void 0 ) bias = 1;

    return this.findFrom($pos, bias) || this.findFrom($pos, -bias) || new AllSelection($pos.node(0))
  };

  // :: (Node) → Selection
  // Find the cursor or leaf node selection closest to the start of
  // the given document. Will return an
  // [`AllSelection`](#state.AllSelection) if no valid position
  // exists.
  Selection.atStart = function atStart (doc) {
    return findSelectionIn(doc, doc, 0, 0, 1) || new AllSelection(doc)
  };

  // :: (Node) → Selection
  // Find the cursor or leaf node selection closest to the end of the
  // given document.
  Selection.atEnd = function atEnd (doc) {
    return findSelectionIn(doc, doc, doc.content.size, doc.childCount, -1) || new AllSelection(doc)
  };

  // :: (Node, Object) → Selection
  // Deserialize the JSON representation of a selection. Must be
  // implemented for custom classes (as a static class method).
  Selection.fromJSON = function fromJSON (doc, json) {
    if (!json || !json.type) { throw new RangeError("Invalid input for Selection.fromJSON") }
    var cls = classesById[json.type];
    if (!cls) { throw new RangeError(("No selection type " + (json.type) + " defined")) }
    return cls.fromJSON(doc, json)
  };

  // :: (string, constructor<Selection>)
  // To be able to deserialize selections from JSON, custom selection
  // classes must register themselves with an ID string, so that they
  // can be disambiguated. Try to pick something that's unlikely to
  // clash with classes from other modules.
  Selection.jsonID = function jsonID (id, selectionClass) {
    if (id in classesById) { throw new RangeError("Duplicate use of selection JSON ID " + id) }
    classesById[id] = selectionClass;
    selectionClass.prototype.jsonID = id;
    return selectionClass
  };

  // :: () → SelectionBookmark
  // Get a [bookmark](#state.SelectionBookmark) for this selection,
  // which is a value that can be mapped without having access to a
  // current document, and later resolved to a real selection for a
  // given document again. (This is used mostly by the history to
  // track and restore old selections.) The default implementation of
  // this method just converts the selection to a text selection and
  // returns the bookmark for that.
  Selection.prototype.getBookmark = function getBookmark () {
    return TextSelection.between(this.$anchor, this.$head).getBookmark()
  };

  Object.defineProperties( Selection.prototype, prototypeAccessors$3 );

  // :: bool
  // Controls whether, when a selection of this type is active in the
  // browser, the selected range should be visible to the user. Defaults
  // to `true`.
  Selection.prototype.visible = true;

  // SelectionBookmark:: interface
  // A lightweight, document-independent representation of a selection.
  // You can define a custom bookmark type for a custom selection class
  // to make the history handle it well.
  //
  //   map:: (mapping: Mapping) → SelectionBookmark
  //   Map the bookmark through a set of changes.
  //
  //   resolve:: (doc: Node) → Selection
  //   Resolve the bookmark to a real selection again. This may need to
  //   do some error checking and may fall back to a default (usually
  //   [`TextSelection.between`](#state.TextSelection^between)) if
  //   mapping made the bookmark invalid.

  // ::- Represents a selected range in a document.
  var SelectionRange = function SelectionRange($from, $to) {
    // :: ResolvedPos
    // The lower bound of the range.
    this.$from = $from;
    // :: ResolvedPos
    // The upper bound of the range.
    this.$to = $to;
  };

  // ::- A text selection represents a classical editor selection, with
  // a head (the moving side) and anchor (immobile side), both of which
  // point into textblock nodes. It can be empty (a regular cursor
  // position).
  var TextSelection = /*@__PURE__*/(function (Selection) {
    function TextSelection($anchor, $head) {
      if ( $head === void 0 ) $head = $anchor;

      Selection.call(this, $anchor, $head);
    }

    if ( Selection ) TextSelection.__proto__ = Selection;
    TextSelection.prototype = Object.create( Selection && Selection.prototype );
    TextSelection.prototype.constructor = TextSelection;

    var prototypeAccessors$1 = { $cursor: { configurable: true } };

    // :: ?ResolvedPos
    // Returns a resolved position if this is a cursor selection (an
    // empty text selection), and null otherwise.
    prototypeAccessors$1.$cursor.get = function () { return this.$anchor.pos == this.$head.pos ? this.$head : null };

    TextSelection.prototype.map = function map (doc, mapping) {
      var $head = doc.resolve(mapping.map(this.head));
      if (!$head.parent.inlineContent) { return Selection.near($head) }
      var $anchor = doc.resolve(mapping.map(this.anchor));
      return new TextSelection($anchor.parent.inlineContent ? $anchor : $head, $head)
    };

    TextSelection.prototype.replace = function replace (tr, content) {
      if ( content === void 0 ) content = Slice.empty;

      Selection.prototype.replace.call(this, tr, content);
      if (content == Slice.empty) {
        var marks = this.$from.marksAcross(this.$to);
        if (marks) { tr.ensureMarks(marks); }
      }
    };

    TextSelection.prototype.eq = function eq (other) {
      return other instanceof TextSelection && other.anchor == this.anchor && other.head == this.head
    };

    TextSelection.prototype.getBookmark = function getBookmark () {
      return new TextBookmark(this.anchor, this.head)
    };

    TextSelection.prototype.toJSON = function toJSON () {
      return {type: "text", anchor: this.anchor, head: this.head}
    };

    TextSelection.fromJSON = function fromJSON (doc, json) {
      if (typeof json.anchor != "number" || typeof json.head != "number")
        { throw new RangeError("Invalid input for TextSelection.fromJSON") }
      return new TextSelection(doc.resolve(json.anchor), doc.resolve(json.head))
    };

    // :: (Node, number, ?number) → TextSelection
    // Create a text selection from non-resolved positions.
    TextSelection.create = function create (doc, anchor, head) {
      if ( head === void 0 ) head = anchor;

      var $anchor = doc.resolve(anchor);
      return new this($anchor, head == anchor ? $anchor : doc.resolve(head))
    };

    // :: (ResolvedPos, ResolvedPos, ?number) → Selection
    // Return a text selection that spans the given positions or, if
    // they aren't text positions, find a text selection near them.
    // `bias` determines whether the method searches forward (default)
    // or backwards (negative number) first. Will fall back to calling
    // [`Selection.near`](#state.Selection^near) when the document
    // doesn't contain a valid text position.
    TextSelection.between = function between ($anchor, $head, bias) {
      var dPos = $anchor.pos - $head.pos;
      if (!bias || dPos) { bias = dPos >= 0 ? 1 : -1; }
      if (!$head.parent.inlineContent) {
        var found = Selection.findFrom($head, bias, true) || Selection.findFrom($head, -bias, true);
        if (found) { $head = found.$head; }
        else { return Selection.near($head, bias) }
      }
      if (!$anchor.parent.inlineContent) {
        if (dPos == 0) {
          $anchor = $head;
        } else {
          $anchor = (Selection.findFrom($anchor, -bias, true) || Selection.findFrom($anchor, bias, true)).$anchor;
          if (($anchor.pos < $head.pos) != (dPos < 0)) { $anchor = $head; }
        }
      }
      return new TextSelection($anchor, $head)
    };

    Object.defineProperties( TextSelection.prototype, prototypeAccessors$1 );

    return TextSelection;
  }(Selection));

  Selection.jsonID("text", TextSelection);

  var TextBookmark = function TextBookmark(anchor, head) {
    this.anchor = anchor;
    this.head = head;
  };
  TextBookmark.prototype.map = function map (mapping) {
    return new TextBookmark(mapping.map(this.anchor), mapping.map(this.head))
  };
  TextBookmark.prototype.resolve = function resolve (doc) {
    return TextSelection.between(doc.resolve(this.anchor), doc.resolve(this.head))
  };

  // ::- A node selection is a selection that points at a single node.
  // All nodes marked [selectable](#model.NodeSpec.selectable) can be
  // the target of a node selection. In such a selection, `from` and
  // `to` point directly before and after the selected node, `anchor`
  // equals `from`, and `head` equals `to`..
  var NodeSelection = /*@__PURE__*/(function (Selection) {
    function NodeSelection($pos) {
      var node = $pos.nodeAfter;
      var $end = $pos.node(0).resolve($pos.pos + node.nodeSize);
      Selection.call(this, $pos, $end);
      // :: Node The selected node.
      this.node = node;
    }

    if ( Selection ) NodeSelection.__proto__ = Selection;
    NodeSelection.prototype = Object.create( Selection && Selection.prototype );
    NodeSelection.prototype.constructor = NodeSelection;

    NodeSelection.prototype.map = function map (doc, mapping) {
      var ref = mapping.mapResult(this.anchor);
      var deleted = ref.deleted;
      var pos = ref.pos;
      var $pos = doc.resolve(pos);
      if (deleted) { return Selection.near($pos) }
      return new NodeSelection($pos)
    };

    NodeSelection.prototype.content = function content () {
      return new Slice(Fragment.from(this.node), 0, 0)
    };

    NodeSelection.prototype.eq = function eq (other) {
      return other instanceof NodeSelection && other.anchor == this.anchor
    };

    NodeSelection.prototype.toJSON = function toJSON () {
      return {type: "node", anchor: this.anchor}
    };

    NodeSelection.prototype.getBookmark = function getBookmark () { return new NodeBookmark(this.anchor) };

    NodeSelection.fromJSON = function fromJSON (doc, json) {
      if (typeof json.anchor != "number")
        { throw new RangeError("Invalid input for NodeSelection.fromJSON") }
      return new NodeSelection(doc.resolve(json.anchor))
    };

    // :: (Node, number) → NodeSelection
    // Create a node selection from non-resolved positions.
    NodeSelection.create = function create (doc, from) {
      return new this(doc.resolve(from))
    };

    // :: (Node) → bool
    // Determines whether the given node may be selected as a node
    // selection.
    NodeSelection.isSelectable = function isSelectable (node) {
      return !node.isText && node.type.spec.selectable !== false
    };

    return NodeSelection;
  }(Selection));

  NodeSelection.prototype.visible = false;

  Selection.jsonID("node", NodeSelection);

  var NodeBookmark = function NodeBookmark(anchor) {
    this.anchor = anchor;
  };
  NodeBookmark.prototype.map = function map (mapping) {
    var ref = mapping.mapResult(this.anchor);
      var deleted = ref.deleted;
      var pos = ref.pos;
    return deleted ? new TextBookmark(pos, pos) : new NodeBookmark(pos)
  };
  NodeBookmark.prototype.resolve = function resolve (doc) {
    var $pos = doc.resolve(this.anchor), node = $pos.nodeAfter;
    if (node && NodeSelection.isSelectable(node)) { return new NodeSelection($pos) }
    return Selection.near($pos)
  };

  // ::- A selection type that represents selecting the whole document
  // (which can not necessarily be expressed with a text selection, when
  // there are for example leaf block nodes at the start or end of the
  // document).
  var AllSelection = /*@__PURE__*/(function (Selection) {
    function AllSelection(doc) {
      Selection.call(this, doc.resolve(0), doc.resolve(doc.content.size));
    }

    if ( Selection ) AllSelection.__proto__ = Selection;
    AllSelection.prototype = Object.create( Selection && Selection.prototype );
    AllSelection.prototype.constructor = AllSelection;

    AllSelection.prototype.replace = function replace (tr, content) {
      if ( content === void 0 ) content = Slice.empty;

      if (content == Slice.empty) {
        tr.delete(0, tr.doc.content.size);
        var sel = Selection.atStart(tr.doc);
        if (!sel.eq(tr.selection)) { tr.setSelection(sel); }
      } else {
        Selection.prototype.replace.call(this, tr, content);
      }
    };

    AllSelection.prototype.toJSON = function toJSON () { return {type: "all"} };

    AllSelection.fromJSON = function fromJSON (doc) { return new AllSelection(doc) };

    AllSelection.prototype.map = function map (doc) { return new AllSelection(doc) };

    AllSelection.prototype.eq = function eq (other) { return other instanceof AllSelection };

    AllSelection.prototype.getBookmark = function getBookmark () { return AllBookmark };

    return AllSelection;
  }(Selection));

  Selection.jsonID("all", AllSelection);

  var AllBookmark = {
    map: function map() { return this },
    resolve: function resolve(doc) { return new AllSelection(doc) }
  };

  // FIXME we'll need some awareness of text direction when scanning for selections

  // Try to find a selection inside the given node. `pos` points at the
  // position where the search starts. When `text` is true, only return
  // text selections.
  function findSelectionIn(doc, node, pos, index, dir, text) {
    if (node.inlineContent) { return TextSelection.create(doc, pos) }
    for (var i = index - (dir > 0 ? 0 : 1); dir > 0 ? i < node.childCount : i >= 0; i += dir) {
      var child = node.child(i);
      if (!child.isAtom) {
        var inner = findSelectionIn(doc, child, pos + dir, dir < 0 ? child.childCount : 0, dir, text);
        if (inner) { return inner }
      } else if (!text && NodeSelection.isSelectable(child)) {
        return NodeSelection.create(doc, pos - (dir < 0 ? child.nodeSize : 0))
      }
      pos += child.nodeSize * dir;
    }
  }

  function selectionToInsertionEnd$1(tr, startLen, bias) {
    var last = tr.steps.length - 1;
    if (last < startLen) { return }
    var step = tr.steps[last];
    if (!(step instanceof ReplaceStep || step instanceof ReplaceAroundStep)) { return }
    var map = tr.mapping.maps[last], end;
    map.forEach(function (_from, _to, _newFrom, newTo) { if (end == null) { end = newTo; } });
    tr.setSelection(Selection.near(tr.doc.resolve(end), bias));
  }

  var UPDATED_SEL = 1, UPDATED_MARKS = 2, UPDATED_SCROLL = 4;

  // ::- An editor state transaction, which can be applied to a state to
  // create an updated state. Use
  // [`EditorState.tr`](#state.EditorState.tr) to create an instance.
  //
  // Transactions track changes to the document (they are a subclass of
  // [`Transform`](#transform.Transform)), but also other state changes,
  // like selection updates and adjustments of the set of [stored
  // marks](#state.EditorState.storedMarks). In addition, you can store
  // metadata properties in a transaction, which are extra pieces of
  // information that client code or plugins can use to describe what a
  // transacion represents, so that they can update their [own
  // state](#state.StateField) accordingly.
  //
  // The [editor view](#view.EditorView) uses a few metadata properties:
  // it will attach a property `"pointer"` with the value `true` to
  // selection transactions directly caused by mouse or touch input, and
  // a `"uiEvent"` property of that may be `"paste"`, `"cut"`, or `"drop"`.
  var Transaction = /*@__PURE__*/(function (Transform) {
    function Transaction(state) {
      Transform.call(this, state.doc);
      // :: number
      // The timestamp associated with this transaction, in the same
      // format as `Date.now()`.
      this.time = Date.now();
      this.curSelection = state.selection;
      // The step count for which the current selection is valid.
      this.curSelectionFor = 0;
      // :: ?[Mark]
      // The stored marks set by this transaction, if any.
      this.storedMarks = state.storedMarks;
      // Bitfield to track which aspects of the state were updated by
      // this transaction.
      this.updated = 0;
      // Object used to store metadata properties for the transaction.
      this.meta = Object.create(null);
    }

    if ( Transform ) Transaction.__proto__ = Transform;
    Transaction.prototype = Object.create( Transform && Transform.prototype );
    Transaction.prototype.constructor = Transaction;

    var prototypeAccessors = { selection: { configurable: true },selectionSet: { configurable: true },storedMarksSet: { configurable: true },isGeneric: { configurable: true },scrolledIntoView: { configurable: true } };

    // :: Selection
    // The transaction's current selection. This defaults to the editor
    // selection [mapped](#state.Selection.map) through the steps in the
    // transaction, but can be overwritten with
    // [`setSelection`](#state.Transaction.setSelection).
    prototypeAccessors.selection.get = function () {
      if (this.curSelectionFor < this.steps.length) {
        this.curSelection = this.curSelection.map(this.doc, this.mapping.slice(this.curSelectionFor));
        this.curSelectionFor = this.steps.length;
      }
      return this.curSelection
    };

    // :: (Selection) → Transaction
    // Update the transaction's current selection. Will determine the
    // selection that the editor gets when the transaction is applied.
    Transaction.prototype.setSelection = function setSelection (selection) {
      if (selection.$from.doc != this.doc)
        { throw new RangeError("Selection passed to setSelection must point at the current document") }
      this.curSelection = selection;
      this.curSelectionFor = this.steps.length;
      this.updated = (this.updated | UPDATED_SEL) & ~UPDATED_MARKS;
      this.storedMarks = null;
      return this
    };

    // :: bool
    // Whether the selection was explicitly updated by this transaction.
    prototypeAccessors.selectionSet.get = function () {
      return (this.updated & UPDATED_SEL) > 0
    };

    // :: (?[Mark]) → Transaction
    // Set the current stored marks.
    Transaction.prototype.setStoredMarks = function setStoredMarks (marks) {
      this.storedMarks = marks;
      this.updated |= UPDATED_MARKS;
      return this
    };

    // :: ([Mark]) → Transaction
    // Make sure the current stored marks or, if that is null, the marks
    // at the selection, match the given set of marks. Does nothing if
    // this is already the case.
    Transaction.prototype.ensureMarks = function ensureMarks (marks) {
      if (!Mark$1.sameSet(this.storedMarks || this.selection.$from.marks(), marks))
        { this.setStoredMarks(marks); }
      return this
    };

    // :: (Mark) → Transaction
    // Add a mark to the set of stored marks.
    Transaction.prototype.addStoredMark = function addStoredMark (mark) {
      return this.ensureMarks(mark.addToSet(this.storedMarks || this.selection.$head.marks()))
    };

    // :: (union<Mark, MarkType>) → Transaction
    // Remove a mark or mark type from the set of stored marks.
    Transaction.prototype.removeStoredMark = function removeStoredMark (mark) {
      return this.ensureMarks(mark.removeFromSet(this.storedMarks || this.selection.$head.marks()))
    };

    // :: bool
    // Whether the stored marks were explicitly set for this transaction.
    prototypeAccessors.storedMarksSet.get = function () {
      return (this.updated & UPDATED_MARKS) > 0
    };

    Transaction.prototype.addStep = function addStep (step, doc) {
      Transform.prototype.addStep.call(this, step, doc);
      this.updated = this.updated & ~UPDATED_MARKS;
      this.storedMarks = null;
    };

    // :: (number) → Transaction
    // Update the timestamp for the transaction.
    Transaction.prototype.setTime = function setTime (time) {
      this.time = time;
      return this
    };

    // :: (Slice) → Transaction
    // Replace the current selection with the given slice.
    Transaction.prototype.replaceSelection = function replaceSelection (slice) {
      this.selection.replace(this, slice);
      return this
    };

    // :: (Node, ?bool) → Transaction
    // Replace the selection with the given node. When `inheritMarks` is
    // true and the content is inline, it inherits the marks from the
    // place where it is inserted.
    Transaction.prototype.replaceSelectionWith = function replaceSelectionWith (node, inheritMarks) {
      var selection = this.selection;
      if (inheritMarks !== false)
        { node = node.mark(this.storedMarks || (selection.empty ? selection.$from.marks() : (selection.$from.marksAcross(selection.$to) || Mark$1.none))); }
      selection.replaceWith(this, node);
      return this
    };

    // :: () → Transaction
    // Delete the selection.
    Transaction.prototype.deleteSelection = function deleteSelection () {
      this.selection.replace(this);
      return this
    };

    // :: (string, from: ?number, to: ?number) → Transaction
    // Replace the given range, or the selection if no range is given,
    // with a text node containing the given string.
    Transaction.prototype.insertText = function insertText (text, from, to) {
      if ( to === void 0 ) to = from;

      var schema = this.doc.type.schema;
      if (from == null) {
        if (!text) { return this.deleteSelection() }
        return this.replaceSelectionWith(schema.text(text), true)
      } else {
        if (!text) { return this.deleteRange(from, to) }
        var marks = this.storedMarks;
        if (!marks) {
          var $from = this.doc.resolve(from);
          marks = to == from ? $from.marks() : $from.marksAcross(this.doc.resolve(to));
        }
        this.replaceRangeWith(from, to, schema.text(text, marks));
        if (!this.selection.empty) { this.setSelection(Selection.near(this.selection.$to)); }
        return this
      }
    };

    // :: (union<string, Plugin, PluginKey>, any) → Transaction
    // Store a metadata property in this transaction, keyed either by
    // name or by plugin.
    Transaction.prototype.setMeta = function setMeta (key, value) {
      this.meta[typeof key == "string" ? key : key.key] = value;
      return this
    };

    // :: (union<string, Plugin, PluginKey>) → any
    // Retrieve a metadata property for a given name or plugin.
    Transaction.prototype.getMeta = function getMeta (key) {
      return this.meta[typeof key == "string" ? key : key.key]
    };

    // :: bool
    // Returns true if this transaction doesn't contain any metadata,
    // and can thus safely be extended.
    prototypeAccessors.isGeneric.get = function () {
      for (var _ in this.meta) { return false }
      return true
    };

    // :: () → Transaction
    // Indicate that the editor should scroll the selection into view
    // when updated to the state produced by this transaction.
    Transaction.prototype.scrollIntoView = function scrollIntoView () {
      this.updated |= UPDATED_SCROLL;
      return this
    };

    prototypeAccessors.scrolledIntoView.get = function () {
      return (this.updated & UPDATED_SCROLL) > 0
    };

    Object.defineProperties( Transaction.prototype, prototypeAccessors );

    return Transaction;
  }(Transform));

  function bind(f, self) {
    return !self || !f ? f : f.bind(self)
  }

  var FieldDesc = function FieldDesc(name, desc, self) {
    this.name = name;
    this.init = bind(desc.init, self);
    this.apply = bind(desc.apply, self);
  };

  var baseFields = [
    new FieldDesc("doc", {
      init: function init(config) { return config.doc || config.schema.topNodeType.createAndFill() },
      apply: function apply(tr) { return tr.doc }
    }),

    new FieldDesc("selection", {
      init: function init(config, instance) { return config.selection || Selection.atStart(instance.doc) },
      apply: function apply(tr) { return tr.selection }
    }),

    new FieldDesc("storedMarks", {
      init: function init(config) { return config.storedMarks || null },
      apply: function apply(tr, _marks, _old, state) { return state.selection.$cursor ? tr.storedMarks : null }
    }),

    new FieldDesc("scrollToSelection", {
      init: function init() { return 0 },
      apply: function apply(tr, prev) { return tr.scrolledIntoView ? prev + 1 : prev }
    })
  ];

  // Object wrapping the part of a state object that stays the same
  // across transactions. Stored in the state's `config` property.
  var Configuration = function Configuration(schema, plugins) {
    var this$1 = this;

    this.schema = schema;
    this.fields = baseFields.concat();
    this.plugins = [];
    this.pluginsByKey = Object.create(null);
    if (plugins) { plugins.forEach(function (plugin) {
      if (this$1.pluginsByKey[plugin.key])
        { throw new RangeError("Adding different instances of a keyed plugin (" + plugin.key + ")") }
      this$1.plugins.push(plugin);
      this$1.pluginsByKey[plugin.key] = plugin;
      if (plugin.spec.state)
        { this$1.fields.push(new FieldDesc(plugin.key, plugin.spec.state, plugin)); }
    }); }
  };

  // ::- The state of a ProseMirror editor is represented by an object
  // of this type. A state is a persistent data structure—it isn't
  // updated, but rather a new state value is computed from an old one
  // using the [`apply`](#state.EditorState.apply) method.
  //
  // A state holds a number of built-in fields, and plugins can
  // [define](#state.PluginSpec.state) additional fields.
  var EditorState = function EditorState(config) {
    this.config = config;
  };

  var prototypeAccessors$1$1 = { schema: { configurable: true },plugins: { configurable: true },tr: { configurable: true } };

  // doc:: Node
  // The current document.

  // selection:: Selection
  // The selection.

  // storedMarks:: ?[Mark]
  // A set of marks to apply to the next input. Will be null when
  // no explicit marks have been set.

  // :: Schema
  // The schema of the state's document.
  prototypeAccessors$1$1.schema.get = function () {
    return this.config.schema
  };

  // :: [Plugin]
  // The plugins that are active in this state.
  prototypeAccessors$1$1.plugins.get = function () {
    return this.config.plugins
  };

  // :: (Transaction) → EditorState
  // Apply the given transaction to produce a new state.
  EditorState.prototype.apply = function apply (tr) {
    return this.applyTransaction(tr).state
  };

  // : (Transaction) → bool
  EditorState.prototype.filterTransaction = function filterTransaction (tr, ignore) {
      if ( ignore === void 0 ) ignore = -1;

    for (var i = 0; i < this.config.plugins.length; i++) { if (i != ignore) {
      var plugin = this.config.plugins[i];
      if (plugin.spec.filterTransaction && !plugin.spec.filterTransaction.call(plugin, tr, this))
        { return false }
    } }
    return true
  };

  // :: (Transaction) → {state: EditorState, transactions: [Transaction]}
  // Verbose variant of [`apply`](#state.EditorState.apply) that
  // returns the precise transactions that were applied (which might
  // be influenced by the [transaction
  // hooks](#state.PluginSpec.filterTransaction) of
  // plugins) along with the new state.
  EditorState.prototype.applyTransaction = function applyTransaction (rootTr) {
    if (!this.filterTransaction(rootTr)) { return {state: this, transactions: []} }

    var trs = [rootTr], newState = this.applyInner(rootTr), seen = null;
    // This loop repeatedly gives plugins a chance to respond to
    // transactions as new transactions are added, making sure to only
    // pass the transactions the plugin did not see before.
     for (;;) {
      var haveNew = false;
      for (var i = 0; i < this.config.plugins.length; i++) {
        var plugin = this.config.plugins[i];
        if (plugin.spec.appendTransaction) {
          var n = seen ? seen[i].n : 0, oldState = seen ? seen[i].state : this;
          var tr = n < trs.length &&
              plugin.spec.appendTransaction.call(plugin, n ? trs.slice(n) : trs, oldState, newState);
          if (tr && newState.filterTransaction(tr, i)) {
            tr.setMeta("appendedTransaction", rootTr);
            if (!seen) {
              seen = [];
              for (var j = 0; j < this.config.plugins.length; j++)
                { seen.push(j < i ? {state: newState, n: trs.length} : {state: this, n: 0}); }
            }
            trs.push(tr);
            newState = newState.applyInner(tr);
            haveNew = true;
          }
          if (seen) { seen[i] = {state: newState, n: trs.length}; }
        }
      }
      if (!haveNew) { return {state: newState, transactions: trs} }
    }
  };

  // : (Transaction) → EditorState
  EditorState.prototype.applyInner = function applyInner (tr) {
    if (!tr.before.eq(this.doc)) { throw new RangeError("Applying a mismatched transaction") }
    var newInstance = new EditorState(this.config), fields = this.config.fields;
    for (var i = 0; i < fields.length; i++) {
      var field = fields[i];
      newInstance[field.name] = field.apply(tr, this[field.name], this, newInstance);
    }
    for (var i$1 = 0; i$1 < applyListeners.length; i$1++) { applyListeners[i$1](this, tr, newInstance); }
    return newInstance
  };

  // :: Transaction
  // Start a [transaction](#state.Transaction) from this state.
  prototypeAccessors$1$1.tr.get = function () { return new Transaction(this) };

  // :: (Object) → EditorState
  // Create a new state.
  //
  // config::- Configuration options. Must contain `schema` or `doc` (or both).
  //
  //    schema:: ?Schema
  //    The schema to use (only relevant if no `doc` is specified).
  //
  //    doc:: ?Node
  //    The starting document.
  //
  //    selection:: ?Selection
  //    A valid selection in the document.
  //
  //    storedMarks:: ?[Mark]
  //    The initial set of [stored marks](#state.EditorState.storedMarks).
  //
  //    plugins:: ?[Plugin]
  //    The plugins that should be active in this state.
  EditorState.create = function create (config) {
    var $config = new Configuration(config.doc ? config.doc.type.schema : config.schema, config.plugins);
    var instance = new EditorState($config);
    for (var i = 0; i < $config.fields.length; i++)
      { instance[$config.fields[i].name] = $config.fields[i].init(config, instance); }
    return instance
  };

  // :: (Object) → EditorState
  // Create a new state based on this one, but with an adjusted set of
  // active plugins. State fields that exist in both sets of plugins
  // are kept unchanged. Those that no longer exist are dropped, and
  // those that are new are initialized using their
  // [`init`](#state.StateField.init) method, passing in the new
  // configuration object..
  //
  // config::- configuration options
  //
  //   plugins:: [Plugin]
  //   New set of active plugins.
  EditorState.prototype.reconfigure = function reconfigure (config) {
    var $config = new Configuration(this.schema, config.plugins);
    var fields = $config.fields, instance = new EditorState($config);
    for (var i = 0; i < fields.length; i++) {
      var name = fields[i].name;
      instance[name] = this.hasOwnProperty(name) ? this[name] : fields[i].init(config, instance);
    }
    return instance
  };

  // :: (?union<Object<Plugin>, string, number>) → Object
  // Serialize this state to JSON. If you want to serialize the state
  // of plugins, pass an object mapping property names to use in the
  // resulting JSON object to plugin objects. The argument may also be
  // a string or number, in which case it is ignored, to support the
  // way `JSON.stringify` calls `toString` methods.
  EditorState.prototype.toJSON = function toJSON (pluginFields) {
    var result = {doc: this.doc.toJSON(), selection: this.selection.toJSON()};
    if (this.storedMarks) { result.storedMarks = this.storedMarks.map(function (m) { return m.toJSON(); }); }
    if (pluginFields && typeof pluginFields == 'object') { for (var prop in pluginFields) {
      if (prop == "doc" || prop == "selection")
        { throw new RangeError("The JSON fields `doc` and `selection` are reserved") }
      var plugin = pluginFields[prop], state = plugin.spec.state;
      if (state && state.toJSON) { result[prop] = state.toJSON.call(plugin, this[plugin.key]); }
    } }
    return result
  };

  // :: (Object, Object, ?Object<Plugin>) → EditorState
  // Deserialize a JSON representation of a state. `config` should
  // have at least a `schema` field, and should contain array of
  // plugins to initialize the state with. `pluginFields` can be used
  // to deserialize the state of plugins, by associating plugin
  // instances with the property names they use in the JSON object.
  //
  // config::- configuration options
  //
  //   schema:: Schema
  //   The schema to use.
  //
  //   plugins:: ?[Plugin]
  //   The set of active plugins.
  EditorState.fromJSON = function fromJSON (config, json, pluginFields) {
    if (!json) { throw new RangeError("Invalid input for EditorState.fromJSON") }
    if (!config.schema) { throw new RangeError("Required config field 'schema' missing") }
    var $config = new Configuration(config.schema, config.plugins);
    var instance = new EditorState($config);
    $config.fields.forEach(function (field) {
      if (field.name == "doc") {
        instance.doc = Node$1.fromJSON(config.schema, json.doc);
      } else if (field.name == "selection") {
        instance.selection = Selection.fromJSON(instance.doc, json.selection);
      } else if (field.name == "storedMarks") {
        if (json.storedMarks) { instance.storedMarks = json.storedMarks.map(config.schema.markFromJSON); }
      } else {
        if (pluginFields) { for (var prop in pluginFields) {
          var plugin = pluginFields[prop], state = plugin.spec.state;
          if (plugin.key == field.name && state && state.fromJSON &&
              Object.prototype.hasOwnProperty.call(json, prop)) {
            // This field belongs to a plugin mapped to a JSON field, read it from there.
            instance[field.name] = state.fromJSON.call(plugin, config, json[prop], instance);
            return
          }
        } }
        instance[field.name] = field.init(config, instance);
      }
    });
    return instance
  };

  // Kludge to allow the view to track mappings between different
  // instances of a state.
  //
  // FIXME this is no longer needed as of prosemirror-view 1.9.0,
  // though due to backwards-compat we should probably keep it around
  // for a while (if only as a no-op)
  EditorState.addApplyListener = function addApplyListener (f) {
    applyListeners.push(f);
  };
  EditorState.removeApplyListener = function removeApplyListener (f) {
    var found = applyListeners.indexOf(f);
    if (found > -1) { applyListeners.splice(found, 1); }
  };

  Object.defineProperties( EditorState.prototype, prototypeAccessors$1$1 );

  var applyListeners = [];

  // PluginSpec:: interface
  //
  // This is the type passed to the [`Plugin`](#state.Plugin)
  // constructor. It provides a definition for a plugin.
  //
  //   props:: ?EditorProps
  //   The [view props](#view.EditorProps) added by this plugin. Props
  //   that are functions will be bound to have the plugin instance as
  //   their `this` binding.
  //
  //   state:: ?StateField<any>
  //   Allows a plugin to define a [state field](#state.StateField), an
  //   extra slot in the state object in which it can keep its own data.
  //
  //   key:: ?PluginKey
  //   Can be used to make this a keyed plugin. You can have only one
  //   plugin with a given key in a given state, but it is possible to
  //   access the plugin's configuration and state through the key,
  //   without having access to the plugin instance object.
  //
  //   view:: ?(EditorView) → Object
  //   When the plugin needs to interact with the editor view, or
  //   set something up in the DOM, use this field. The function
  //   will be called when the plugin's state is associated with an
  //   editor view.
  //
  //     return::-
  //     Should return an object with the following optional
  //     properties:
  //
  //       update:: ?(view: EditorView, prevState: EditorState)
  //       Called whenever the view's state is updated.
  //
  //       destroy:: ?()
  //       Called when the view is destroyed or receives a state
  //       with different plugins.
  //
  //   filterTransaction:: ?(Transaction, EditorState) → bool
  //   When present, this will be called before a transaction is
  //   applied by the state, allowing the plugin to cancel it (by
  //   returning false).
  //
  //   appendTransaction:: ?(transactions: [Transaction], oldState: EditorState, newState: EditorState) → ?Transaction
  //   Allows the plugin to append another transaction to be applied
  //   after the given array of transactions. When another plugin
  //   appends a transaction after this was called, it is called again
  //   with the new state and new transactions—but only the new
  //   transactions, i.e. it won't be passed transactions that it
  //   already saw.

  function bindProps(obj, self, target) {
    for (var prop in obj) {
      var val = obj[prop];
      if (val instanceof Function) { val = val.bind(self); }
      else if (prop == "handleDOMEvents") { val = bindProps(val, self, {}); }
      target[prop] = val;
    }
    return target
  }

  // ::- Plugins bundle functionality that can be added to an editor.
  // They are part of the [editor state](#state.EditorState) and
  // may influence that state and the view that contains it.
  var Plugin = function Plugin(spec) {
    // :: EditorProps
    // The [props](#view.EditorProps) exported by this plugin.
    this.props = {};
    if (spec.props) { bindProps(spec.props, this, this.props); }
    // :: Object
    // The plugin's [spec object](#state.PluginSpec).
    this.spec = spec;
    this.key = spec.key ? spec.key.key : createKey("plugin");
  };

  // :: (EditorState) → any
  // Extract the plugin's state field from an editor state.
  Plugin.prototype.getState = function getState (state) { return state[this.key] };

  // StateField:: interface<T>
  // A plugin spec may provide a state field (under its
  // [`state`](#state.PluginSpec.state) property) of this type, which
  // describes the state it wants to keep. Functions provided here are
  // always called with the plugin instance as their `this` binding.
  //
  //   init:: (config: Object, instance: EditorState) → T
  //   Initialize the value of the field. `config` will be the object
  //   passed to [`EditorState.create`](#state.EditorState^create). Note
  //   that `instance` is a half-initialized state instance, and will
  //   not have values for plugin fields initialized after this one.
  //
  //   apply:: (tr: Transaction, value: T, oldState: EditorState, newState: EditorState) → T
  //   Apply the given transaction to this state field, producing a new
  //   field value. Note that the `newState` argument is again a partially
  //   constructed state does not yet contain the state from plugins
  //   coming after this one.
  //
  //   toJSON:: ?(value: T) → *
  //   Convert this field to JSON. Optional, can be left off to disable
  //   JSON serialization for the field.
  //
  //   fromJSON:: ?(config: Object, value: *, state: EditorState) → T
  //   Deserialize the JSON representation of this field. Note that the
  //   `state` argument is again a half-initialized state.

  var keys = Object.create(null);

  function createKey(name) {
    if (name in keys) { return name + "$" + ++keys[name] }
    keys[name] = 0;
    return name + "$"
  }

  // ::- A key is used to [tag](#state.PluginSpec.key)
  // plugins in a way that makes it possible to find them, given an
  // editor state. Assigning a key does mean only one plugin of that
  // type can be active in a state.
  var PluginKey = function PluginKey(name) {
  if ( name === void 0 ) name = "key";
   this.key = createKey(name); };

  // :: (EditorState) → ?Plugin
  // Get the active plugin with this key, if any, from an editor
  // state.
  PluginKey.prototype.get = function get (state) { return state.config.pluginsByKey[this.key] };

  // :: (EditorState) → ?any
  // Get the plugin's state from an editor state.
  PluginKey.prototype.getState = function getState (state) { return state[this.key] };

  var result = {};

  if (typeof navigator != "undefined" && typeof document != "undefined") {
    var ie_edge = /Edge\/(\d+)/.exec(navigator.userAgent);
    var ie_upto10 = /MSIE \d/.test(navigator.userAgent);
    var ie_11up = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);

    result.mac = /Mac/.test(navigator.platform);
    var ie$1 = result.ie = !!(ie_upto10 || ie_11up || ie_edge);
    result.ie_version = ie_upto10 ? document.documentMode || 6 : ie_11up ? +ie_11up[1] : ie_edge ? +ie_edge[1] : null;
    result.gecko = !ie$1 && /gecko\/(\d+)/i.test(navigator.userAgent);
    result.gecko_version = result.gecko && +(/Firefox\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1];
    var chrome$1 = !ie$1 && /Chrome\/(\d+)/.exec(navigator.userAgent);
    result.chrome = !!chrome$1;
    result.chrome_version = chrome$1 && +chrome$1[1];
    // Is true for both iOS and iPadOS for convenience
    result.safari = !ie$1 && /Apple Computer/.test(navigator.vendor);
    result.ios = result.safari && (/Mobile\/\w+/.test(navigator.userAgent) || navigator.maxTouchPoints > 2);
    result.android = /Android \d/.test(navigator.userAgent);
    result.webkit = "webkitFontSmoothing" in document.documentElement.style;
    result.webkit_version = result.webkit && +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1];
  }

  var domIndex = function(node) {
    for (var index = 0;; index++) {
      node = node.previousSibling;
      if (!node) { return index }
    }
  };

  var parentNode = function(node) {
    var parent = node.assignedSlot || node.parentNode;
    return parent && parent.nodeType == 11 ? parent.host : parent
  };

  var reusedRange = null;

  // Note that this will always return the same range, because DOM range
  // objects are every expensive, and keep slowing down subsequent DOM
  // updates, for some reason.
  var textRange$1 = function(node, from, to) {
    var range = reusedRange || (reusedRange = document.createRange());
    range.setEnd(node, to == null ? node.nodeValue.length : to);
    range.setStart(node, from || 0);
    return range
  };

  // Scans forward and backward through DOM positions equivalent to the
  // given one to see if the two are in the same place (i.e. after a
  // text node vs at the end of that text node)
  var isEquivalentPosition = function(node, off, targetNode, targetOff) {
    return targetNode && (scanFor(node, off, targetNode, targetOff, -1) ||
                          scanFor(node, off, targetNode, targetOff, 1))
  };

  var atomElements = /^(img|br|input|textarea|hr)$/i;

  function scanFor(node, off, targetNode, targetOff, dir) {
    for (;;) {
      if (node == targetNode && off == targetOff) { return true }
      if (off == (dir < 0 ? 0 : nodeSize(node))) {
        var parent = node.parentNode;
        if (parent.nodeType != 1 || hasBlockDesc(node) || atomElements.test(node.nodeName) || node.contentEditable == "false")
          { return false }
        off = domIndex(node) + (dir < 0 ? 0 : 1);
        node = parent;
      } else if (node.nodeType == 1) {
        node = node.childNodes[off + (dir < 0 ? -1 : 0)];
        if (node.contentEditable == "false") { return false }
        off = dir < 0 ? nodeSize(node) : 0;
      } else {
        return false
      }
    }
  }

  function nodeSize(node) {
    return node.nodeType == 3 ? node.nodeValue.length : node.childNodes.length
  }

  function isOnEdge(node, offset, parent) {
    for (var atStart = offset == 0, atEnd = offset == nodeSize(node); atStart || atEnd;) {
      if (node == parent) { return true }
      var index = domIndex(node);
      node = node.parentNode;
      if (!node) { return false }
      atStart = atStart && index == 0;
      atEnd = atEnd && index == nodeSize(node);
    }
  }

  function hasBlockDesc(dom) {
    var desc;
    for (var cur = dom; cur; cur = cur.parentNode) { if (desc = cur.pmViewDesc) { break } }
    return desc && desc.node && desc.node.isBlock && (desc.dom == dom || desc.contentDOM == dom)
  }

  // Work around Chrome issue https://bugs.chromium.org/p/chromium/issues/detail?id=447523
  // (isCollapsed inappropriately returns true in shadow dom)
  var selectionCollapsed = function(domSel) {
    var collapsed = domSel.isCollapsed;
    if (collapsed && result.chrome && domSel.rangeCount && !domSel.getRangeAt(0).collapsed)
      { collapsed = false; }
    return collapsed
  };

  function keyEvent(keyCode, key) {
    var event = document.createEvent("Event");
    event.initEvent("keydown", true, true);
    event.keyCode = keyCode;
    event.key = event.code = key;
    return event
  }

  function windowRect(doc) {
    return {left: 0, right: doc.documentElement.clientWidth,
            top: 0, bottom: doc.documentElement.clientHeight}
  }

  function getSide(value, side) {
    return typeof value == "number" ? value : value[side]
  }

  function clientRect(node) {
    var rect = node.getBoundingClientRect();
    // Adjust for elements with style "transform: scale()"
    var scaleX = (rect.width / node.offsetWidth) || 1;
    var scaleY = (rect.height / node.offsetHeight) || 1;
    // Make sure scrollbar width isn't included in the rectangle
    return {left: rect.left, right: rect.left + node.clientWidth * scaleX,
            top: rect.top, bottom: rect.top + node.clientHeight * scaleY}
  }

  function scrollRectIntoView(view, rect, startDOM) {
    var scrollThreshold = view.someProp("scrollThreshold") || 0, scrollMargin = view.someProp("scrollMargin") || 5;
    var doc = view.dom.ownerDocument;
    for (var parent = startDOM || view.dom;; parent = parentNode(parent)) {
      if (!parent) { break }
      if (parent.nodeType != 1) { continue }
      var atTop = parent == doc.body || parent.nodeType != 1;
      var bounding = atTop ? windowRect(doc) : clientRect(parent);
      var moveX = 0, moveY = 0;
      if (rect.top < bounding.top + getSide(scrollThreshold, "top"))
        { moveY = -(bounding.top - rect.top + getSide(scrollMargin, "top")); }
      else if (rect.bottom > bounding.bottom - getSide(scrollThreshold, "bottom"))
        { moveY = rect.bottom - bounding.bottom + getSide(scrollMargin, "bottom"); }
      if (rect.left < bounding.left + getSide(scrollThreshold, "left"))
        { moveX = -(bounding.left - rect.left + getSide(scrollMargin, "left")); }
      else if (rect.right > bounding.right - getSide(scrollThreshold, "right"))
        { moveX = rect.right - bounding.right + getSide(scrollMargin, "right"); }
      if (moveX || moveY) {
        if (atTop) {
          doc.defaultView.scrollBy(moveX, moveY);
        } else {
          var startX = parent.scrollLeft, startY = parent.scrollTop;
          if (moveY) { parent.scrollTop += moveY; }
          if (moveX) { parent.scrollLeft += moveX; }
          var dX = parent.scrollLeft - startX, dY = parent.scrollTop - startY;
          rect = {left: rect.left - dX, top: rect.top - dY, right: rect.right - dX, bottom: rect.bottom - dY};
        }
      }
      if (atTop) { break }
    }
  }

  // Store the scroll position of the editor's parent nodes, along with
  // the top position of an element near the top of the editor, which
  // will be used to make sure the visible viewport remains stable even
  // when the size of the content above changes.
  function storeScrollPos(view) {
    var rect = view.dom.getBoundingClientRect(), startY = Math.max(0, rect.top);
    var refDOM, refTop;
    for (var x = (rect.left + rect.right) / 2, y = startY + 1;
         y < Math.min(innerHeight, rect.bottom); y += 5) {
      var dom = view.root.elementFromPoint(x, y);
      if (dom == view.dom || !view.dom.contains(dom)) { continue }
      var localRect = dom.getBoundingClientRect();
      if (localRect.top >= startY - 20) {
        refDOM = dom;
        refTop = localRect.top;
        break
      }
    }
    return {refDOM: refDOM, refTop: refTop, stack: scrollStack(view.dom)}
  }

  function scrollStack(dom) {
    var stack = [], doc = dom.ownerDocument;
    for (; dom; dom = parentNode(dom)) {
      stack.push({dom: dom, top: dom.scrollTop, left: dom.scrollLeft});
      if (dom == doc) { break }
    }
    return stack
  }

  // Reset the scroll position of the editor's parent nodes to that what
  // it was before, when storeScrollPos was called.
  function resetScrollPos(ref) {
    var refDOM = ref.refDOM;
    var refTop = ref.refTop;
    var stack = ref.stack;

    var newRefTop = refDOM ? refDOM.getBoundingClientRect().top : 0;
    restoreScrollStack(stack, newRefTop == 0 ? 0 : newRefTop - refTop);
  }

  function restoreScrollStack(stack, dTop) {
    for (var i = 0; i < stack.length; i++) {
      var ref = stack[i];
      var dom = ref.dom;
      var top = ref.top;
      var left = ref.left;
      if (dom.scrollTop != top + dTop) { dom.scrollTop = top + dTop; }
      if (dom.scrollLeft != left) { dom.scrollLeft = left; }
    }
  }

  var preventScrollSupported = null;
  // Feature-detects support for .focus({preventScroll: true}), and uses
  // a fallback kludge when not supported.
  function focusPreventScroll(dom) {
    if (dom.setActive) { return dom.setActive() } // in IE
    if (preventScrollSupported) { return dom.focus(preventScrollSupported) }

    var stored = scrollStack(dom);
    dom.focus(preventScrollSupported == null ? {
      get preventScroll() {
        preventScrollSupported = {preventScroll: true};
        return true
      }
    } : undefined);
    if (!preventScrollSupported) {
      preventScrollSupported = false;
      restoreScrollStack(stored, 0);
    }
  }

  function findOffsetInNode(node, coords) {
    var closest, dxClosest = 2e8, coordsClosest, offset = 0;
    var rowBot = coords.top, rowTop = coords.top;
    for (var child = node.firstChild, childIndex = 0; child; child = child.nextSibling, childIndex++) {
      var rects = (void 0);
      if (child.nodeType == 1) { rects = child.getClientRects(); }
      else if (child.nodeType == 3) { rects = textRange$1(child).getClientRects(); }
      else { continue }

      for (var i = 0; i < rects.length; i++) {
        var rect = rects[i];
        if (rect.top <= rowBot && rect.bottom >= rowTop) {
          rowBot = Math.max(rect.bottom, rowBot);
          rowTop = Math.min(rect.top, rowTop);
          var dx = rect.left > coords.left ? rect.left - coords.left
              : rect.right < coords.left ? coords.left - rect.right : 0;
          if (dx < dxClosest) {
            closest = child;
            dxClosest = dx;
            coordsClosest = dx && closest.nodeType == 3 ? {left: rect.right < coords.left ? rect.right : rect.left, top: coords.top} : coords;
            if (child.nodeType == 1 && dx)
              { offset = childIndex + (coords.left >= (rect.left + rect.right) / 2 ? 1 : 0); }
            continue
          }
        }
        if (!closest && (coords.left >= rect.right && coords.top >= rect.top ||
                         coords.left >= rect.left && coords.top >= rect.bottom))
          { offset = childIndex + 1; }
      }
    }
    if (closest && closest.nodeType == 3) { return findOffsetInText(closest, coordsClosest) }
    if (!closest || (dxClosest && closest.nodeType == 1)) { return {node: node, offset: offset} }
    return findOffsetInNode(closest, coordsClosest)
  }

  function findOffsetInText(node, coords) {
    var len = node.nodeValue.length;
    var range = document.createRange();
    for (var i = 0; i < len; i++) {
      range.setEnd(node, i + 1);
      range.setStart(node, i);
      var rect = singleRect$1(range, 1);
      if (rect.top == rect.bottom) { continue }
      if (inRect(coords, rect))
        { return {node: node, offset: i + (coords.left >= (rect.left + rect.right) / 2 ? 1 : 0)} }
    }
    return {node: node, offset: 0}
  }

  function inRect(coords, rect) {
    return coords.left >= rect.left - 1 && coords.left <= rect.right + 1&&
      coords.top >= rect.top - 1 && coords.top <= rect.bottom + 1
  }

  function targetKludge(dom, coords) {
    var parent = dom.parentNode;
    if (parent && /^li$/i.test(parent.nodeName) && coords.left < dom.getBoundingClientRect().left)
      { return parent }
    return dom
  }

  function posFromElement(view, elt, coords) {
    var ref = findOffsetInNode(elt, coords);
    var node = ref.node;
    var offset = ref.offset;
    var bias = -1;
    if (node.nodeType == 1 && !node.firstChild) {
      var rect = node.getBoundingClientRect();
      bias = rect.left != rect.right && coords.left > (rect.left + rect.right) / 2 ? 1 : -1;
    }
    return view.docView.posFromDOM(node, offset, bias)
  }

  function posFromCaret(view, node, offset, coords) {
    // Browser (in caretPosition/RangeFromPoint) will agressively
    // normalize towards nearby inline nodes. Since we are interested in
    // positions between block nodes too, we first walk up the hierarchy
    // of nodes to see if there are block nodes that the coordinates
    // fall outside of. If so, we take the position before/after that
    // block. If not, we call `posFromDOM` on the raw node/offset.
    var outside = -1;
    for (var cur = node;;) {
      if (cur == view.dom) { break }
      var desc = view.docView.nearestDesc(cur, true);
      if (!desc) { return null }
      if (desc.node.isBlock && desc.parent) {
        var rect = desc.dom.getBoundingClientRect();
        if (rect.left > coords.left || rect.top > coords.top) { outside = desc.posBefore; }
        else if (rect.right < coords.left || rect.bottom < coords.top) { outside = desc.posAfter; }
        else { break }
      }
      cur = desc.dom.parentNode;
    }
    return outside > -1 ? outside : view.docView.posFromDOM(node, offset)
  }

  function elementFromPoint(element, coords, box) {
    var len = element.childNodes.length;
    if (len && box.top < box.bottom) {
      for (var startI = Math.max(0, Math.min(len - 1, Math.floor(len * (coords.top - box.top) / (box.bottom - box.top)) - 2)), i = startI;;) {
        var child = element.childNodes[i];
        if (child.nodeType == 1) {
          var rects = child.getClientRects();
          for (var j = 0; j < rects.length; j++) {
            var rect = rects[j];
            if (inRect(coords, rect)) { return elementFromPoint(child, coords, rect) }
          }
        }
        if ((i = (i + 1) % len) == startI) { break }
      }
    }
    return element
  }

  // Given an x,y position on the editor, get the position in the document.
  function posAtCoords(view, coords) {
    var assign, assign$1;

    var root = view.root, node, offset;
    if (root.caretPositionFromPoint) {
      try { // Firefox throws for this call in hard-to-predict circumstances (#994)
        var pos$1 = root.caretPositionFromPoint(coords.left, coords.top);
        if (pos$1) { ((assign = pos$1, node = assign.offsetNode, offset = assign.offset)); }
      } catch (_) {}
    }
    if (!node && root.caretRangeFromPoint) {
      var range = root.caretRangeFromPoint(coords.left, coords.top);
      if (range) { ((assign$1 = range, node = assign$1.startContainer, offset = assign$1.startOffset)); }
    }

    var elt = root.elementFromPoint(coords.left, coords.top + 1), pos;
    if (!elt || !view.dom.contains(elt.nodeType != 1 ? elt.parentNode : elt)) {
      var box = view.dom.getBoundingClientRect();
      if (!inRect(coords, box)) { return null }
      elt = elementFromPoint(view.dom, coords, box);
      if (!elt) { return null }
    }
    // Safari's caretRangeFromPoint returns nonsense when on a draggable element
    if (result.safari && elt.draggable) { node = offset = null; }
    elt = targetKludge(elt, coords);
    if (node) {
      if (result.gecko && node.nodeType == 1) {
        // Firefox will sometimes return offsets into <input> nodes, which
        // have no actual children, from caretPositionFromPoint (#953)
        offset = Math.min(offset, node.childNodes.length);
        // It'll also move the returned position before image nodes,
        // even if those are behind it.
        if (offset < node.childNodes.length) {
          var next = node.childNodes[offset], box$1;
          if (next.nodeName == "IMG" && (box$1 = next.getBoundingClientRect()).right <= coords.left &&
              box$1.bottom > coords.top)
            { offset++; }
        }
      }
      // Suspiciously specific kludge to work around caret*FromPoint
      // never returning a position at the end of the document
      if (node == view.dom && offset == node.childNodes.length - 1 && node.lastChild.nodeType == 1 &&
          coords.top > node.lastChild.getBoundingClientRect().bottom)
        { pos = view.state.doc.content.size; }
      // Ignore positions directly after a BR, since caret*FromPoint
      // 'round up' positions that would be more accurately placed
      // before the BR node.
      else if (offset == 0 || node.nodeType != 1 || node.childNodes[offset - 1].nodeName != "BR")
        { pos = posFromCaret(view, node, offset, coords); }
    }
    if (pos == null) { pos = posFromElement(view, elt, coords); }

    var desc = view.docView.nearestDesc(elt, true);
    return {pos: pos, inside: desc ? desc.posAtStart - desc.border : -1}
  }

  function singleRect$1(object, bias) {
    var rects = object.getClientRects();
    return !rects.length ? object.getBoundingClientRect() : rects[bias < 0 ? 0 : rects.length - 1]
  }

  var BIDI = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;

  // : (EditorView, number, number) → {left: number, top: number, right: number, bottom: number}
  // Given a position in the document model, get a bounding box of the
  // character at that position, relative to the window.
  function coordsAtPos$1(view, pos, side) {
    var ref = view.docView.domFromPos(pos, side < 0 ? -1 : 1);
    var node = ref.node;
    var offset = ref.offset;

    var supportEmptyRange = result.webkit || result.gecko;
    if (node.nodeType == 3) {
      // These browsers support querying empty text ranges. Prefer that in
      // bidi context or when at the end of a node.
      if (supportEmptyRange && (BIDI.test(node.nodeValue) || (side < 0 ? !offset : offset == node.nodeValue.length))) {
        var rect = singleRect$1(textRange$1(node, offset, offset), side);
        // Firefox returns bad results (the position before the space)
        // when querying a position directly after line-broken
        // whitespace. Detect this situation and and kludge around it
        if (result.gecko && offset && /\s/.test(node.nodeValue[offset - 1]) && offset < node.nodeValue.length) {
          var rectBefore = singleRect$1(textRange$1(node, offset - 1, offset - 1), -1);
          if (rectBefore.top == rect.top) {
            var rectAfter = singleRect$1(textRange$1(node, offset, offset + 1), -1);
            if (rectAfter.top != rect.top)
              { return flattenV(rectAfter, rectAfter.left < rectBefore.left) }
          }
        }
        return rect
      } else {
        var from = offset, to = offset, takeSide = side < 0 ? 1 : -1;
        if (side < 0 && !offset) { to++; takeSide = -1; }
        else if (side >= 0 && offset == node.nodeValue.length) { from--; takeSide = 1; }
        else if (side < 0) { from--; }
        else { to ++; }
        return flattenV(singleRect$1(textRange$1(node, from, to), takeSide), takeSide < 0)
      }
    }

    // Return a horizontal line in block context
    if (!view.state.doc.resolve(pos).parent.inlineContent) {
      if (offset && (side < 0 || offset == nodeSize(node))) {
        var before = node.childNodes[offset - 1];
        if (before.nodeType == 1) { return flattenH(before.getBoundingClientRect(), false) }
      }
      if (offset < nodeSize(node)) {
        var after = node.childNodes[offset];
        if (after.nodeType == 1) { return flattenH(after.getBoundingClientRect(), true) }
      }
      return flattenH(node.getBoundingClientRect(), side >= 0)
    }

    // Inline, not in text node (this is not Bidi-safe)
    if (offset && (side < 0 || offset == nodeSize(node))) {
      var before$1 = node.childNodes[offset - 1];
      var target = before$1.nodeType == 3 ? textRange$1(before$1, nodeSize(before$1) - (supportEmptyRange ? 0 : 1))
          // BR nodes tend to only return the rectangle before them.
          // Only use them if they are the last element in their parent
          : before$1.nodeType == 1 && (before$1.nodeName != "BR" || !before$1.nextSibling) ? before$1 : null;
      if (target) { return flattenV(singleRect$1(target, 1), false) }
    }
    if (offset < nodeSize(node)) {
      var after$1 = node.childNodes[offset];
      var target$1 = after$1.nodeType == 3 ? textRange$1(after$1, 0, (supportEmptyRange ? 0 : 1))
          : after$1.nodeType == 1 ? after$1 : null;
      if (target$1) { return flattenV(singleRect$1(target$1, -1), true) }
    }
    // All else failed, just try to get a rectangle for the target node
    return flattenV(singleRect$1(node.nodeType == 3 ? textRange$1(node) : node, -side), side >= 0)
  }

  function flattenV(rect, left) {
    if (rect.width == 0) { return rect }
    var x = left ? rect.left : rect.right;
    return {top: rect.top, bottom: rect.bottom, left: x, right: x}
  }

  function flattenH(rect, top) {
    if (rect.height == 0) { return rect }
    var y = top ? rect.top : rect.bottom;
    return {top: y, bottom: y, left: rect.left, right: rect.right}
  }

  function withFlushedState(view, state, f) {
    var viewState = view.state, active = view.root.activeElement;
    if (viewState != state) { view.updateState(state); }
    if (active != view.dom) { view.focus(); }
    try {
      return f()
    } finally {
      if (viewState != state) { view.updateState(viewState); }
      if (active != view.dom && active) { active.focus(); }
    }
  }

  // : (EditorView, number, number)
  // Whether vertical position motion in a given direction
  // from a position would leave a text block.
  function endOfTextblockVertical(view, state, dir) {
    var sel = state.selection;
    var $pos = dir == "up" ? sel.$from : sel.$to;
    return withFlushedState(view, state, function () {
      var ref = view.docView.domFromPos($pos.pos, dir == "up" ? -1 : 1);
      var dom = ref.node;
      for (;;) {
        var nearest = view.docView.nearestDesc(dom, true);
        if (!nearest) { break }
        if (nearest.node.isBlock) { dom = nearest.dom; break }
        dom = nearest.dom.parentNode;
      }
      var coords = coordsAtPos$1(view, $pos.pos, 1);
      for (var child = dom.firstChild; child; child = child.nextSibling) {
        var boxes = (void 0);
        if (child.nodeType == 1) { boxes = child.getClientRects(); }
        else if (child.nodeType == 3) { boxes = textRange$1(child, 0, child.nodeValue.length).getClientRects(); }
        else { continue }
        for (var i = 0; i < boxes.length; i++) {
          var box = boxes[i];
          if (box.bottom > box.top && (dir == "up" ? box.bottom < coords.top + 1 : box.top > coords.bottom - 1))
            { return false }
        }
      }
      return true
    })
  }

  var maybeRTL = /[\u0590-\u08ac]/;

  function endOfTextblockHorizontal(view, state, dir) {
    var ref = state.selection;
    var $head = ref.$head;
    if (!$head.parent.isTextblock) { return false }
    var offset = $head.parentOffset, atStart = !offset, atEnd = offset == $head.parent.content.size;
    var sel = getSelection();
    // If the textblock is all LTR, or the browser doesn't support
    // Selection.modify (Edge), fall back to a primitive approach
    if (!maybeRTL.test($head.parent.textContent) || !sel.modify)
      { return dir == "left" || dir == "backward" ? atStart : atEnd }

    return withFlushedState(view, state, function () {
      // This is a huge hack, but appears to be the best we can
      // currently do: use `Selection.modify` to move the selection by
      // one character, and see if that moves the cursor out of the
      // textblock (or doesn't move it at all, when at the start/end of
      // the document).
      var oldRange = sel.getRangeAt(0), oldNode = sel.focusNode, oldOff = sel.focusOffset;
      var oldBidiLevel = sel.caretBidiLevel; // Only for Firefox
      sel.modify("move", dir, "character");
      var parentDOM = $head.depth ? view.docView.domAfterPos($head.before()) : view.dom;
      var result = !parentDOM.contains(sel.focusNode.nodeType == 1 ? sel.focusNode : sel.focusNode.parentNode) ||
          (oldNode == sel.focusNode && oldOff == sel.focusOffset);
      // Restore the previous selection
      sel.removeAllRanges();
      sel.addRange(oldRange);
      if (oldBidiLevel != null) { sel.caretBidiLevel = oldBidiLevel; }
      return result
    })
  }

  var cachedState = null, cachedDir = null, cachedResult = false;
  function endOfTextblock(view, state, dir) {
    if (cachedState == state && cachedDir == dir) { return cachedResult }
    cachedState = state; cachedDir = dir;
    return cachedResult = dir == "up" || dir == "down"
      ? endOfTextblockVertical(view, state, dir)
      : endOfTextblockHorizontal(view, state, dir)
  }

  // NodeView:: interface
  //
  // By default, document nodes are rendered using the result of the
  // [`toDOM`](#model.NodeSpec.toDOM) method of their spec, and managed
  // entirely by the editor. For some use cases, such as embedded
  // node-specific editing interfaces, you want more control over
  // the behavior of a node's in-editor representation, and need to
  // [define](#view.EditorProps.nodeViews) a custom node view.
  //
  // Mark views only support `dom` and `contentDOM`, and don't support
  // any of the node view methods.
  //
  // Objects returned as node views must conform to this interface.
  //
  //   dom:: ?dom.Node
  //   The outer DOM node that represents the document node. When not
  //   given, the default strategy is used to create a DOM node.
  //
  //   contentDOM:: ?dom.Node
  //   The DOM node that should hold the node's content. Only meaningful
  //   if the node view also defines a `dom` property and if its node
  //   type is not a leaf node type. When this is present, ProseMirror
  //   will take care of rendering the node's children into it. When it
  //   is not present, the node view itself is responsible for rendering
  //   (or deciding not to render) its child nodes.
  //
  //   update:: ?(node: Node, decorations: [Decoration], innerDecorations: DecorationSource) → bool
  //   When given, this will be called when the view is updating itself.
  //   It will be given a node (possibly of a different type), an array
  //   of active decorations around the node (which are automatically
  //   drawn, and the node view may ignore if it isn't interested in
  //   them), and a [decoration source](#view.DecorationSource) that
  //   represents any decorations that apply to the content of the node
  //   (which again may be ignored). It should return true if it was
  //   able to update to that node, and false otherwise. If the node
  //   view has a `contentDOM` property (or no `dom` property), updating
  //   its child nodes will be handled by ProseMirror.
  //
  //   selectNode:: ?()
  //   Can be used to override the way the node's selected status (as a
  //   node selection) is displayed.
  //
  //   deselectNode:: ?()
  //   When defining a `selectNode` method, you should also provide a
  //   `deselectNode` method to remove the effect again.
  //
  //   setSelection:: ?(anchor: number, head: number, root: dom.Document)
  //   This will be called to handle setting the selection inside the
  //   node. The `anchor` and `head` positions are relative to the start
  //   of the node. By default, a DOM selection will be created between
  //   the DOM positions corresponding to those positions, but if you
  //   override it you can do something else.
  //
  //   stopEvent:: ?(event: dom.Event) → bool
  //   Can be used to prevent the editor view from trying to handle some
  //   or all DOM events that bubble up from the node view. Events for
  //   which this returns true are not handled by the editor.
  //
  //   ignoreMutation:: ?(dom.MutationRecord) → bool
  //   Called when a DOM
  //   [mutation](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
  //   or a selection change happens within the view. When the change is
  //   a selection change, the record will have a `type` property of
  //   `"selection"` (which doesn't occur for native mutation records).
  //   Return false if the editor should re-read the selection or
  //   re-parse the range around the mutation, true if it can safely be
  //   ignored.
  //
  //   destroy:: ?()
  //   Called when the node view is removed from the editor or the whole
  //   editor is destroyed. (Not available for marks.)

  // View descriptions are data structures that describe the DOM that is
  // used to represent the editor's content. They are used for:
  //
  // - Incremental redrawing when the document changes
  //
  // - Figuring out what part of the document a given DOM position
  //   corresponds to
  //
  // - Wiring in custom implementations of the editing interface for a
  //   given node
  //
  // They form a doubly-linked mutable tree, starting at `view.docView`.

  var NOT_DIRTY = 0, CHILD_DIRTY = 1, CONTENT_DIRTY = 2, NODE_DIRTY = 3;

  // Superclass for the various kinds of descriptions. Defines their
  // basic structure and shared methods.
  var ViewDesc = function ViewDesc(parent, children, dom, contentDOM) {
    this.parent = parent;
    this.children = children;
    this.dom = dom;
    // An expando property on the DOM node provides a link back to its
    // description.
    dom.pmViewDesc = this;
    // This is the node that holds the child views. It may be null for
    // descs that don't have children.
    this.contentDOM = contentDOM;
    this.dirty = NOT_DIRTY;
  };

  var prototypeAccessors = { beforePosition: { configurable: true },size: { configurable: true },border: { configurable: true },posBefore: { configurable: true },posAtStart: { configurable: true },posAfter: { configurable: true },posAtEnd: { configurable: true },contentLost: { configurable: true },domAtom: { configurable: true } };

  // Used to check whether a given description corresponds to a
  // widget/mark/node.
  ViewDesc.prototype.matchesWidget = function matchesWidget () { return false };
  ViewDesc.prototype.matchesMark = function matchesMark () { return false };
  ViewDesc.prototype.matchesNode = function matchesNode () { return false };
  ViewDesc.prototype.matchesHack = function matchesHack () { return false };

  prototypeAccessors.beforePosition.get = function () { return false };

  // : () → ?ParseRule
  // When parsing in-editor content (in domchange.js), we allow
  // descriptions to determine the parse rules that should be used to
  // parse them.
  ViewDesc.prototype.parseRule = function parseRule () { return null };

  // : (dom.Event) → bool
  // Used by the editor's event handler to ignore events that come
  // from certain descs.
  ViewDesc.prototype.stopEvent = function stopEvent () { return false };

  // The size of the content represented by this desc.
  prototypeAccessors.size.get = function () {
    var size = 0;
    for (var i = 0; i < this.children.length; i++) { size += this.children[i].size; }
    return size
  };

  // For block nodes, this represents the space taken up by their
  // start/end tokens.
  prototypeAccessors.border.get = function () { return 0 };

  ViewDesc.prototype.destroy = function destroy () {
    this.parent = null;
    if (this.dom.pmViewDesc == this) { this.dom.pmViewDesc = null; }
    for (var i = 0; i < this.children.length; i++)
      { this.children[i].destroy(); }
  };

  ViewDesc.prototype.posBeforeChild = function posBeforeChild (child) {
    for (var i = 0, pos = this.posAtStart; i < this.children.length; i++) {
      var cur = this.children[i];
      if (cur == child) { return pos }
      pos += cur.size;
    }
  };

  prototypeAccessors.posBefore.get = function () {
    return this.parent.posBeforeChild(this)
  };

  prototypeAccessors.posAtStart.get = function () {
    return this.parent ? this.parent.posBeforeChild(this) + this.border : 0
  };

  prototypeAccessors.posAfter.get = function () {
    return this.posBefore + this.size
  };

  prototypeAccessors.posAtEnd.get = function () {
    return this.posAtStart + this.size - 2 * this.border
  };

  // : (dom.Node, number, ?number) → number
  ViewDesc.prototype.localPosFromDOM = function localPosFromDOM (dom, offset, bias) {
    // If the DOM position is in the content, use the child desc after
    // it to figure out a position.
    if (this.contentDOM && this.contentDOM.contains(dom.nodeType == 1 ? dom : dom.parentNode)) {
      if (bias < 0) {
        var domBefore, desc;
        if (dom == this.contentDOM) {
          domBefore = dom.childNodes[offset - 1];
        } else {
          while (dom.parentNode != this.contentDOM) { dom = dom.parentNode; }
          domBefore = dom.previousSibling;
        }
        while (domBefore && !((desc = domBefore.pmViewDesc) && desc.parent == this)) { domBefore = domBefore.previousSibling; }
        return domBefore ? this.posBeforeChild(desc) + desc.size : this.posAtStart
      } else {
        var domAfter, desc$1;
        if (dom == this.contentDOM) {
          domAfter = dom.childNodes[offset];
        } else {
          while (dom.parentNode != this.contentDOM) { dom = dom.parentNode; }
          domAfter = dom.nextSibling;
        }
        while (domAfter && !((desc$1 = domAfter.pmViewDesc) && desc$1.parent == this)) { domAfter = domAfter.nextSibling; }
        return domAfter ? this.posBeforeChild(desc$1) : this.posAtEnd
      }
    }
    // Otherwise, use various heuristics, falling back on the bias
    // parameter, to determine whether to return the position at the
    // start or at the end of this view desc.
    var atEnd;
    if (dom == this.dom && this.contentDOM) {
      atEnd = offset > domIndex(this.contentDOM);
    } else if (this.contentDOM && this.contentDOM != this.dom && this.dom.contains(this.contentDOM)) {
      atEnd = dom.compareDocumentPosition(this.contentDOM) & 2;
    } else if (this.dom.firstChild) {
      if (offset == 0) { for (var search = dom;; search = search.parentNode) {
        if (search == this.dom) { atEnd = false; break }
        if (search.parentNode.firstChild != search) { break }
      } }
      if (atEnd == null && offset == dom.childNodes.length) { for (var search$1 = dom;; search$1 = search$1.parentNode) {
        if (search$1 == this.dom) { atEnd = true; break }
        if (search$1.parentNode.lastChild != search$1) { break }
      } }
    }
    return (atEnd == null ? bias > 0 : atEnd) ? this.posAtEnd : this.posAtStart
  };

  // Scan up the dom finding the first desc that is a descendant of
  // this one.
  ViewDesc.prototype.nearestDesc = function nearestDesc (dom, onlyNodes) {
    for (var first = true, cur = dom; cur; cur = cur.parentNode) {
      var desc = this.getDesc(cur);
      if (desc && (!onlyNodes || desc.node)) {
        // If dom is outside of this desc's nodeDOM, don't count it.
        if (first && desc.nodeDOM &&
            !(desc.nodeDOM.nodeType == 1 ? desc.nodeDOM.contains(dom.nodeType == 1 ? dom : dom.parentNode) : desc.nodeDOM == dom))
          { first = false; }
        else
          { return desc }
      }
    }
  };

  ViewDesc.prototype.getDesc = function getDesc (dom) {
    var desc = dom.pmViewDesc;
    for (var cur = desc; cur; cur = cur.parent) { if (cur == this) { return desc } }
  };

  ViewDesc.prototype.posFromDOM = function posFromDOM (dom, offset, bias) {
    for (var scan = dom; scan; scan = scan.parentNode) {
      var desc = this.getDesc(scan);
      if (desc) { return desc.localPosFromDOM(dom, offset, bias) }
    }
    return -1
  };

  // : (number) → ?NodeViewDesc
  // Find the desc for the node after the given pos, if any. (When a
  // parent node overrode rendering, there might not be one.)
  ViewDesc.prototype.descAt = function descAt (pos) {
    for (var i = 0, offset = 0; i < this.children.length; i++) {
      var child = this.children[i], end = offset + child.size;
      if (offset == pos && end != offset) {
        while (!child.border && child.children.length) { child = child.children[0]; }
        return child
      }
      if (pos < end) { return child.descAt(pos - offset - child.border) }
      offset = end;
    }
  };

  // : (number, number) → {node: dom.Node, offset: number}
  ViewDesc.prototype.domFromPos = function domFromPos (pos, side) {
    if (!this.contentDOM) { return {node: this.dom, offset: 0} }
    for (var offset = 0, i = 0, first = true;; i++, first = false) {
      // Skip removed or always-before children
      while (i < this.children.length && (this.children[i].beforePosition ||
                                          this.children[i].dom.parentNode != this.contentDOM))
        { offset += this.children[i++].size; }
      var child = i == this.children.length ? null : this.children[i];
      if (offset == pos && (side == 0 || !child || !child.size || child.border || (side < 0 && first)) ||
          child && child.domAtom && pos < offset + child.size) { return {
        node: this.contentDOM,
        offset: child ? domIndex(child.dom) : this.contentDOM.childNodes.length
      } }
      if (!child) { throw new Error("Invalid position " + pos) }
      var end = offset + child.size;
      if (!child.domAtom && (side < 0 && !child.border ? end >= pos : end > pos) &&
          (end > pos || i + 1 >= this.children.length || !this.children[i + 1].beforePosition))
        { return child.domFromPos(pos - offset - child.border, side) }
      offset = end;
    }
  };

  // Used to find a DOM range in a single parent for a given changed
  // range.
  ViewDesc.prototype.parseRange = function parseRange (from, to, base) {
      if ( base === void 0 ) base = 0;

    if (this.children.length == 0)
      { return {node: this.contentDOM, from: from, to: to, fromOffset: 0, toOffset: this.contentDOM.childNodes.length} }

    var fromOffset = -1, toOffset = -1;
    for (var offset = base, i = 0;; i++) {
      var child = this.children[i], end = offset + child.size;
      if (fromOffset == -1 && from <= end) {
        var childBase = offset + child.border;
        // FIXME maybe descend mark views to parse a narrower range?
        if (from >= childBase && to <= end - child.border && child.node &&
            child.contentDOM && this.contentDOM.contains(child.contentDOM))
          { return child.parseRange(from, to, childBase) }

        from = offset;
        for (var j = i; j > 0; j--) {
          var prev = this.children[j - 1];
          if (prev.size && prev.dom.parentNode == this.contentDOM && !prev.emptyChildAt(1)) {
            fromOffset = domIndex(prev.dom) + 1;
            break
          }
          from -= prev.size;
        }
        if (fromOffset == -1) { fromOffset = 0; }
      }
      if (fromOffset > -1 && (end > to || i == this.children.length - 1)) {
        to = end;
        for (var j$1 = i + 1; j$1 < this.children.length; j$1++) {
          var next = this.children[j$1];
          if (next.size && next.dom.parentNode == this.contentDOM && !next.emptyChildAt(-1)) {
            toOffset = domIndex(next.dom);
            break
          }
          to += next.size;
        }
        if (toOffset == -1) { toOffset = this.contentDOM.childNodes.length; }
        break
      }
      offset = end;
    }
    return {node: this.contentDOM, from: from, to: to, fromOffset: fromOffset, toOffset: toOffset}
  };

  ViewDesc.prototype.emptyChildAt = function emptyChildAt (side) {
    if (this.border || !this.contentDOM || !this.children.length) { return false }
    var child = this.children[side < 0 ? 0 : this.children.length - 1];
    return child.size == 0 || child.emptyChildAt(side)
  };

  // : (number) → dom.Node
  ViewDesc.prototype.domAfterPos = function domAfterPos (pos) {
    var ref = this.domFromPos(pos, 0);
      var node = ref.node;
      var offset = ref.offset;
    if (node.nodeType != 1 || offset == node.childNodes.length)
      { throw new RangeError("No node after pos " + pos) }
    return node.childNodes[offset]
  };

  // : (number, number, dom.Document)
  // View descs are responsible for setting any selection that falls
  // entirely inside of them, so that custom implementations can do
  // custom things with the selection. Note that this falls apart when
  // a selection starts in such a node and ends in another, in which
  // case we just use whatever domFromPos produces as a best effort.
  ViewDesc.prototype.setSelection = function setSelection (anchor, head, root, force) {
    // If the selection falls entirely in a child, give it to that child
    var from = Math.min(anchor, head), to = Math.max(anchor, head);
    for (var i = 0, offset = 0; i < this.children.length; i++) {
      var child = this.children[i], end = offset + child.size;
      if (from > offset && to < end)
        { return child.setSelection(anchor - offset - child.border, head - offset - child.border, root, force) }
      offset = end;
    }

    var anchorDOM = this.domFromPos(anchor, anchor ? -1 : 1);
    var headDOM = head == anchor ? anchorDOM : this.domFromPos(head, head ? -1 : 1);
    var domSel = root.getSelection();

    var brKludge = false;
    // On Firefox, using Selection.collapse to put the cursor after a
    // BR node for some reason doesn't always work (#1073). On Safari,
    // the cursor sometimes inexplicable visually lags behind its
    // reported position in such situations (#1092).
    if ((result.gecko || result.safari) && anchor == head) {
      var node = anchorDOM.node;
        var offset$1 = anchorDOM.offset;
      if (node.nodeType == 3) {
        brKludge = offset$1 && node.nodeValue[offset$1 - 1] == "\n";
        // Issue #1128
        if (brKludge && offset$1 == node.nodeValue.length &&
            node.nextSibling && node.nextSibling.nodeName == "BR")
          { anchorDOM = headDOM = {node: node.parentNode, offset: domIndex(node) + 1}; }
      } else {
        var prev = node.childNodes[offset$1 - 1];
        brKludge = prev && (prev.nodeName == "BR" || prev.contentEditable == "false");
      }
    }

    if (!(force || brKludge && result.safari) &&
        isEquivalentPosition(anchorDOM.node, anchorDOM.offset, domSel.anchorNode, domSel.anchorOffset) &&
        isEquivalentPosition(headDOM.node, headDOM.offset, domSel.focusNode, domSel.focusOffset))
      { return }

    // Selection.extend can be used to create an 'inverted' selection
    // (one where the focus is before the anchor), but not all
    // browsers support it yet.
    var domSelExtended = false;
    if ((domSel.extend || anchor == head) && !brKludge) {
      domSel.collapse(anchorDOM.node, anchorDOM.offset);
      try {
        if (anchor != head) { domSel.extend(headDOM.node, headDOM.offset); }
        domSelExtended = true;
      } catch (err) {
        // In some cases with Chrome the selection is empty after calling
        // collapse, even when it should be valid. This appears to be a bug, but
        // it is difficult to isolate. If this happens fallback to the old path
        // without using extend.
        if (!(err instanceof DOMException)) { throw err }
        // declare global: DOMException
      }
    }
    if (!domSelExtended) {
      if (anchor > head) { var tmp = anchorDOM; anchorDOM = headDOM; headDOM = tmp; }
      var range = document.createRange();
      range.setEnd(headDOM.node, headDOM.offset);
      range.setStart(anchorDOM.node, anchorDOM.offset);
      domSel.removeAllRanges();
      domSel.addRange(range);
    }
  };

  // : (dom.MutationRecord) → bool
  ViewDesc.prototype.ignoreMutation = function ignoreMutation (mutation) {
    return !this.contentDOM && mutation.type != "selection"
  };

  prototypeAccessors.contentLost.get = function () {
    return this.contentDOM && this.contentDOM != this.dom && !this.dom.contains(this.contentDOM)
  };

  // Remove a subtree of the element tree that has been touched
  // by a DOM change, so that the next update will redraw it.
  ViewDesc.prototype.markDirty = function markDirty (from, to) {
    for (var offset = 0, i = 0; i < this.children.length; i++) {
      var child = this.children[i], end = offset + child.size;
      if (offset == end ? from <= end && to >= offset : from < end && to > offset) {
        var startInside = offset + child.border, endInside = end - child.border;
        if (from >= startInside && to <= endInside) {
          this.dirty = from == offset || to == end ? CONTENT_DIRTY : CHILD_DIRTY;
          if (from == startInside && to == endInside &&
              (child.contentLost || child.dom.parentNode != this.contentDOM)) { child.dirty = NODE_DIRTY; }
          else { child.markDirty(from - startInside, to - startInside); }
          return
        } else {
          child.dirty = NODE_DIRTY;
        }
      }
      offset = end;
    }
    this.dirty = CONTENT_DIRTY;
  };

  ViewDesc.prototype.markParentsDirty = function markParentsDirty () {
    var level = 1;
    for (var node = this.parent; node; node = node.parent, level++) {
      var dirty = level == 1 ? CONTENT_DIRTY : CHILD_DIRTY;
      if (node.dirty < dirty) { node.dirty = dirty; }
    }
  };

  prototypeAccessors.domAtom.get = function () { return false };

  Object.defineProperties( ViewDesc.prototype, prototypeAccessors );

  // Reused array to avoid allocating fresh arrays for things that will
  // stay empty anyway.
  var nothing = [];

  // A widget desc represents a widget decoration, which is a DOM node
  // drawn between the document nodes.
  var WidgetViewDesc = /*@__PURE__*/(function (ViewDesc) {
    function WidgetViewDesc(parent, widget, view, pos) {
      var self, dom = widget.type.toDOM;
      if (typeof dom == "function") { dom = dom(view, function () {
        if (!self) { return pos }
        if (self.parent) { return self.parent.posBeforeChild(self) }
      }); }
      if (!widget.type.spec.raw) {
        if (dom.nodeType != 1) {
          var wrap = document.createElement("span");
          wrap.appendChild(dom);
          dom = wrap;
        }
        dom.contentEditable = false;
        dom.classList.add("ProseMirror-widget");
      }
      ViewDesc.call(this, parent, nothing, dom, null);
      this.widget = widget;
      self = this;
    }

    if ( ViewDesc ) WidgetViewDesc.__proto__ = ViewDesc;
    WidgetViewDesc.prototype = Object.create( ViewDesc && ViewDesc.prototype );
    WidgetViewDesc.prototype.constructor = WidgetViewDesc;

    var prototypeAccessors$1 = { beforePosition: { configurable: true },domAtom: { configurable: true } };

    prototypeAccessors$1.beforePosition.get = function () {
      return this.widget.type.side < 0
    };

    WidgetViewDesc.prototype.matchesWidget = function matchesWidget (widget) {
      return this.dirty == NOT_DIRTY && widget.type.eq(this.widget.type)
    };

    WidgetViewDesc.prototype.parseRule = function parseRule () { return {ignore: true} };

    WidgetViewDesc.prototype.stopEvent = function stopEvent (event) {
      var stop = this.widget.spec.stopEvent;
      return stop ? stop(event) : false
    };

    WidgetViewDesc.prototype.ignoreMutation = function ignoreMutation (mutation) {
      return mutation.type != "selection" || this.widget.spec.ignoreSelection
    };

    prototypeAccessors$1.domAtom.get = function () { return true };

    Object.defineProperties( WidgetViewDesc.prototype, prototypeAccessors$1 );

    return WidgetViewDesc;
  }(ViewDesc));

  var CompositionViewDesc = /*@__PURE__*/(function (ViewDesc) {
    function CompositionViewDesc(parent, dom, textDOM, text) {
      ViewDesc.call(this, parent, nothing, dom, null);
      this.textDOM = textDOM;
      this.text = text;
    }

    if ( ViewDesc ) CompositionViewDesc.__proto__ = ViewDesc;
    CompositionViewDesc.prototype = Object.create( ViewDesc && ViewDesc.prototype );
    CompositionViewDesc.prototype.constructor = CompositionViewDesc;

    var prototypeAccessors$2 = { size: { configurable: true } };

    prototypeAccessors$2.size.get = function () { return this.text.length };

    CompositionViewDesc.prototype.localPosFromDOM = function localPosFromDOM (dom, offset) {
      if (dom != this.textDOM) { return this.posAtStart + (offset ? this.size : 0) }
      return this.posAtStart + offset
    };

    CompositionViewDesc.prototype.domFromPos = function domFromPos (pos) {
      return {node: this.textDOM, offset: pos}
    };

    CompositionViewDesc.prototype.ignoreMutation = function ignoreMutation (mut) {
      return mut.type === 'characterData' && mut.target.nodeValue == mut.oldValue
     };

    Object.defineProperties( CompositionViewDesc.prototype, prototypeAccessors$2 );

    return CompositionViewDesc;
  }(ViewDesc));

  // A mark desc represents a mark. May have multiple children,
  // depending on how the mark is split. Note that marks are drawn using
  // a fixed nesting order, for simplicity and predictability, so in
  // some cases they will be split more often than would appear
  // necessary.
  var MarkViewDesc = /*@__PURE__*/(function (ViewDesc) {
    function MarkViewDesc(parent, mark, dom, contentDOM) {
      ViewDesc.call(this, parent, [], dom, contentDOM);
      this.mark = mark;
    }

    if ( ViewDesc ) MarkViewDesc.__proto__ = ViewDesc;
    MarkViewDesc.prototype = Object.create( ViewDesc && ViewDesc.prototype );
    MarkViewDesc.prototype.constructor = MarkViewDesc;

    MarkViewDesc.create = function create (parent, mark, inline, view) {
      var custom = view.nodeViews[mark.type.name];
      var spec = custom && custom(mark, view, inline);
      if (!spec || !spec.dom)
        { spec = DOMSerializer.renderSpec(document, mark.type.spec.toDOM(mark, inline)); }
      return new MarkViewDesc(parent, mark, spec.dom, spec.contentDOM || spec.dom)
    };

    MarkViewDesc.prototype.parseRule = function parseRule () { return {mark: this.mark.type.name, attrs: this.mark.attrs, contentElement: this.contentDOM} };

    MarkViewDesc.prototype.matchesMark = function matchesMark (mark) { return this.dirty != NODE_DIRTY && this.mark.eq(mark) };

    MarkViewDesc.prototype.markDirty = function markDirty (from, to) {
      ViewDesc.prototype.markDirty.call(this, from, to);
      // Move dirty info to nearest node view
      if (this.dirty != NOT_DIRTY) {
        var parent = this.parent;
        while (!parent.node) { parent = parent.parent; }
        if (parent.dirty < this.dirty) { parent.dirty = this.dirty; }
        this.dirty = NOT_DIRTY;
      }
    };

    MarkViewDesc.prototype.slice = function slice (from, to, view) {
      var copy = MarkViewDesc.create(this.parent, this.mark, true, view);
      var nodes = this.children, size = this.size;
      if (to < size) { nodes = replaceNodes(nodes, to, size, view); }
      if (from > 0) { nodes = replaceNodes(nodes, 0, from, view); }
      for (var i = 0; i < nodes.length; i++) { nodes[i].parent = copy; }
      copy.children = nodes;
      return copy
    };

    return MarkViewDesc;
  }(ViewDesc));

  // Node view descs are the main, most common type of view desc, and
  // correspond to an actual node in the document. Unlike mark descs,
  // they populate their child array themselves.
  var NodeViewDesc = /*@__PURE__*/(function (ViewDesc) {
    function NodeViewDesc(parent, node, outerDeco, innerDeco, dom, contentDOM, nodeDOM, view, pos) {
      ViewDesc.call(this, parent, node.isLeaf ? nothing : [], dom, contentDOM);
      this.nodeDOM = nodeDOM;
      this.node = node;
      this.outerDeco = outerDeco;
      this.innerDeco = innerDeco;
      if (contentDOM) { this.updateChildren(view, pos); }
    }

    if ( ViewDesc ) NodeViewDesc.__proto__ = ViewDesc;
    NodeViewDesc.prototype = Object.create( ViewDesc && ViewDesc.prototype );
    NodeViewDesc.prototype.constructor = NodeViewDesc;

    var prototypeAccessors$3 = { size: { configurable: true },border: { configurable: true },domAtom: { configurable: true } };

    // By default, a node is rendered using the `toDOM` method from the
    // node type spec. But client code can use the `nodeViews` spec to
    // supply a custom node view, which can influence various aspects of
    // the way the node works.
    //
    // (Using subclassing for this was intentionally decided against,
    // since it'd require exposing a whole slew of finnicky
    // implementation details to the user code that they probably will
    // never need.)
    NodeViewDesc.create = function create (parent, node, outerDeco, innerDeco, view, pos) {
      var assign;

      var custom = view.nodeViews[node.type.name], descObj;
      var spec = custom && custom(node, view, function () {
        // (This is a function that allows the custom view to find its
        // own position)
        if (!descObj) { return pos }
        if (descObj.parent) { return descObj.parent.posBeforeChild(descObj) }
      }, outerDeco, innerDeco);

      var dom = spec && spec.dom, contentDOM = spec && spec.contentDOM;
      if (node.isText) {
        if (!dom) { dom = document.createTextNode(node.text); }
        else if (dom.nodeType != 3) { throw new RangeError("Text must be rendered as a DOM text node") }
      } else if (!dom) {
  ((assign = DOMSerializer.renderSpec(document, node.type.spec.toDOM(node)), dom = assign.dom, contentDOM = assign.contentDOM));
      }
      if (!contentDOM && !node.isText && dom.nodeName != "BR") { // Chrome gets confused by <br contenteditable=false>
        if (!dom.hasAttribute("contenteditable")) { dom.contentEditable = false; }
        if (node.type.spec.draggable) { dom.draggable = true; }
      }

      var nodeDOM = dom;
      dom = applyOuterDeco(dom, outerDeco, node);

      if (spec)
        { return descObj = new CustomNodeViewDesc(parent, node, outerDeco, innerDeco, dom, contentDOM, nodeDOM,
                                                spec, view, pos + 1) }
      else if (node.isText)
        { return new TextViewDesc(parent, node, outerDeco, innerDeco, dom, nodeDOM, view) }
      else
        { return new NodeViewDesc(parent, node, outerDeco, innerDeco, dom, contentDOM, nodeDOM, view, pos + 1) }
    };

    NodeViewDesc.prototype.parseRule = function parseRule () {
      var this$1 = this;

      // Experimental kludge to allow opt-in re-parsing of nodes
      if (this.node.type.spec.reparseInView) { return null }
      // FIXME the assumption that this can always return the current
      // attrs means that if the user somehow manages to change the
      // attrs in the dom, that won't be picked up. Not entirely sure
      // whether this is a problem
      var rule = {node: this.node.type.name, attrs: this.node.attrs};
      if (this.node.type.spec.code) { rule.preserveWhitespace = "full"; }
      if (this.contentDOM && !this.contentLost) { rule.contentElement = this.contentDOM; }
      else { rule.getContent = function () { return this$1.contentDOM ? Fragment.empty : this$1.node.content; }; }
      return rule
    };

    NodeViewDesc.prototype.matchesNode = function matchesNode (node, outerDeco, innerDeco) {
      return this.dirty == NOT_DIRTY && node.eq(this.node) &&
        sameOuterDeco(outerDeco, this.outerDeco) && innerDeco.eq(this.innerDeco)
    };

    prototypeAccessors$3.size.get = function () { return this.node.nodeSize };

    prototypeAccessors$3.border.get = function () { return this.node.isLeaf ? 0 : 1 };

    // Syncs `this.children` to match `this.node.content` and the local
    // decorations, possibly introducing nesting for marks. Then, in a
    // separate step, syncs the DOM inside `this.contentDOM` to
    // `this.children`.
    NodeViewDesc.prototype.updateChildren = function updateChildren (view, pos) {
      var this$1 = this;

      var inline = this.node.inlineContent, off = pos;
      var composition = inline && view.composing && this.localCompositionNode(view, pos);
      var updater = new ViewTreeUpdater(this, composition && composition.node);
      iterDeco(this.node, this.innerDeco, function (widget, i, insideNode) {
        if (widget.spec.marks)
          { updater.syncToMarks(widget.spec.marks, inline, view); }
        else if (widget.type.side >= 0 && !insideNode)
          { updater.syncToMarks(i == this$1.node.childCount ? Mark$1.none : this$1.node.child(i).marks, inline, view); }
        // If the next node is a desc matching this widget, reuse it,
        // otherwise insert the widget as a new view desc.
        updater.placeWidget(widget, view, off);
      }, function (child, outerDeco, innerDeco, i) {
        // Make sure the wrapping mark descs match the node's marks.
        updater.syncToMarks(child.marks, inline, view);
        // Either find an existing desc that exactly matches this node,
        // and drop the descs before it.
        updater.findNodeMatch(child, outerDeco, innerDeco, i) ||
          // Or try updating the next desc to reflect this node.
          updater.updateNextNode(child, outerDeco, innerDeco, view, i) ||
          // Or just add it as a new desc.
          updater.addNode(child, outerDeco, innerDeco, view, off);
        off += child.nodeSize;
      });
      // Drop all remaining descs after the current position.
      updater.syncToMarks(nothing, inline, view);
      if (this.node.isTextblock) { updater.addTextblockHacks(); }
      updater.destroyRest();

      // Sync the DOM if anything changed
      if (updater.changed || this.dirty == CONTENT_DIRTY) {
        // May have to protect focused DOM from being changed if a composition is active
        if (composition) { this.protectLocalComposition(view, composition); }
        renderDescs(this.contentDOM, this.children, view);
        if (result.ios) { iosHacks(this.dom); }
      }
    };

    NodeViewDesc.prototype.localCompositionNode = function localCompositionNode (view, pos) {
      // Only do something if both the selection and a focused text node
      // are inside of this node, and the node isn't already part of a
      // view that's a child of this view
      var ref = view.state.selection;
      var from = ref.from;
      var to = ref.to;
      if (!(view.state.selection instanceof TextSelection) || from < pos || to > pos + this.node.content.size) { return }
      var sel = view.root.getSelection();
      var textNode = nearbyTextNode(sel.focusNode, sel.focusOffset);
      if (!textNode || !this.dom.contains(textNode.parentNode)) { return }

      // Find the text in the focused node in the node, stop if it's not
      // there (may have been modified through other means, in which
      // case it should overwritten)
      var text = textNode.nodeValue;
      var textPos = findTextInFragment(this.node.content, text, from - pos, to - pos);

      return textPos < 0 ? null : {node: textNode, pos: textPos, text: text}
    };

    NodeViewDesc.prototype.protectLocalComposition = function protectLocalComposition (view, ref) {
      var node = ref.node;
      var pos = ref.pos;
      var text = ref.text;

      // The node is already part of a local view desc, leave it there
      if (this.getDesc(node)) { return }

      // Create a composition view for the orphaned nodes
      var topNode = node;
      for (;; topNode = topNode.parentNode) {
        if (topNode.parentNode == this.contentDOM) { break }
        while (topNode.previousSibling) { topNode.parentNode.removeChild(topNode.previousSibling); }
        while (topNode.nextSibling) { topNode.parentNode.removeChild(topNode.nextSibling); }
        if (topNode.pmViewDesc) { topNode.pmViewDesc = null; }
      }
      var desc = new CompositionViewDesc(this, topNode, node, text);
      view.compositionNodes.push(desc);

      // Patch up this.children to contain the composition view
      this.children = replaceNodes(this.children, pos, pos + text.length, view, desc);
    };

    // : (Node, [Decoration], DecorationSource, EditorView) → bool
    // If this desc be updated to match the given node decoration,
    // do so and return true.
    NodeViewDesc.prototype.update = function update (node, outerDeco, innerDeco, view) {
      if (this.dirty == NODE_DIRTY ||
          !node.sameMarkup(this.node)) { return false }
      this.updateInner(node, outerDeco, innerDeco, view);
      return true
    };

    NodeViewDesc.prototype.updateInner = function updateInner (node, outerDeco, innerDeco, view) {
      this.updateOuterDeco(outerDeco);
      this.node = node;
      this.innerDeco = innerDeco;
      if (this.contentDOM) { this.updateChildren(view, this.posAtStart); }
      this.dirty = NOT_DIRTY;
    };

    NodeViewDesc.prototype.updateOuterDeco = function updateOuterDeco (outerDeco) {
      if (sameOuterDeco(outerDeco, this.outerDeco)) { return }
      var needsWrap = this.nodeDOM.nodeType != 1;
      var oldDOM = this.dom;
      this.dom = patchOuterDeco(this.dom, this.nodeDOM,
                                computeOuterDeco(this.outerDeco, this.node, needsWrap),
                                computeOuterDeco(outerDeco, this.node, needsWrap));
      if (this.dom != oldDOM) {
        oldDOM.pmViewDesc = null;
        this.dom.pmViewDesc = this;
      }
      this.outerDeco = outerDeco;
    };

    // Mark this node as being the selected node.
    NodeViewDesc.prototype.selectNode = function selectNode () {
      this.nodeDOM.classList.add("ProseMirror-selectednode");
      if (this.contentDOM || !this.node.type.spec.draggable) { this.dom.draggable = true; }
    };

    // Remove selected node marking from this node.
    NodeViewDesc.prototype.deselectNode = function deselectNode () {
      this.nodeDOM.classList.remove("ProseMirror-selectednode");
      if (this.contentDOM || !this.node.type.spec.draggable) { this.dom.removeAttribute("draggable"); }
    };

    prototypeAccessors$3.domAtom.get = function () { return this.node.isAtom };

    Object.defineProperties( NodeViewDesc.prototype, prototypeAccessors$3 );

    return NodeViewDesc;
  }(ViewDesc));

  // Create a view desc for the top-level document node, to be exported
  // and used by the view class.
  function docViewDesc(doc, outerDeco, innerDeco, dom, view) {
    applyOuterDeco(dom, outerDeco, doc);
    return new NodeViewDesc(null, doc, outerDeco, innerDeco, dom, dom, dom, view, 0)
  }

  var TextViewDesc = /*@__PURE__*/(function (NodeViewDesc) {
    function TextViewDesc(parent, node, outerDeco, innerDeco, dom, nodeDOM, view) {
      NodeViewDesc.call(this, parent, node, outerDeco, innerDeco, dom, null, nodeDOM, view);
    }

    if ( NodeViewDesc ) TextViewDesc.__proto__ = NodeViewDesc;
    TextViewDesc.prototype = Object.create( NodeViewDesc && NodeViewDesc.prototype );
    TextViewDesc.prototype.constructor = TextViewDesc;

    var prototypeAccessors$4 = { domAtom: { configurable: true } };

    TextViewDesc.prototype.parseRule = function parseRule () {
      var skip = this.nodeDOM.parentNode;
      while (skip && skip != this.dom && !skip.pmIsDeco) { skip = skip.parentNode; }
      return {skip: skip || true}
    };

    TextViewDesc.prototype.update = function update (node, outerDeco, _, view) {
      if (this.dirty == NODE_DIRTY || (this.dirty != NOT_DIRTY && !this.inParent()) ||
          !node.sameMarkup(this.node)) { return false }
      this.updateOuterDeco(outerDeco);
      if ((this.dirty != NOT_DIRTY || node.text != this.node.text) && node.text != this.nodeDOM.nodeValue) {
        this.nodeDOM.nodeValue = node.text;
        if (view.trackWrites == this.nodeDOM) { view.trackWrites = null; }
      }
      this.node = node;
      this.dirty = NOT_DIRTY;
      return true
    };

    TextViewDesc.prototype.inParent = function inParent () {
      var parentDOM = this.parent.contentDOM;
      for (var n = this.nodeDOM; n; n = n.parentNode) { if (n == parentDOM) { return true } }
      return false
    };

    TextViewDesc.prototype.domFromPos = function domFromPos (pos) {
      return {node: this.nodeDOM, offset: pos}
    };

    TextViewDesc.prototype.localPosFromDOM = function localPosFromDOM (dom, offset, bias) {
      if (dom == this.nodeDOM) { return this.posAtStart + Math.min(offset, this.node.text.length) }
      return NodeViewDesc.prototype.localPosFromDOM.call(this, dom, offset, bias)
    };

    TextViewDesc.prototype.ignoreMutation = function ignoreMutation (mutation) {
      return mutation.type != "characterData" && mutation.type != "selection"
    };

    TextViewDesc.prototype.slice = function slice (from, to, view) {
      var node = this.node.cut(from, to), dom = document.createTextNode(node.text);
      return new TextViewDesc(this.parent, node, this.outerDeco, this.innerDeco, dom, dom, view)
    };

    prototypeAccessors$4.domAtom.get = function () { return false };

    Object.defineProperties( TextViewDesc.prototype, prototypeAccessors$4 );

    return TextViewDesc;
  }(NodeViewDesc));

  // A dummy desc used to tag trailing BR or span nodes created to work
  // around contentEditable terribleness.
  var BRHackViewDesc = /*@__PURE__*/(function (ViewDesc) {
    function BRHackViewDesc () {
      ViewDesc.apply(this, arguments);
    }

    if ( ViewDesc ) BRHackViewDesc.__proto__ = ViewDesc;
    BRHackViewDesc.prototype = Object.create( ViewDesc && ViewDesc.prototype );
    BRHackViewDesc.prototype.constructor = BRHackViewDesc;

    var prototypeAccessors$5 = { domAtom: { configurable: true } };

    BRHackViewDesc.prototype.parseRule = function parseRule () { return {ignore: true} };
    BRHackViewDesc.prototype.matchesHack = function matchesHack () { return this.dirty == NOT_DIRTY };
    prototypeAccessors$5.domAtom.get = function () { return true };

    Object.defineProperties( BRHackViewDesc.prototype, prototypeAccessors$5 );

    return BRHackViewDesc;
  }(ViewDesc));

  // A separate subclass is used for customized node views, so that the
  // extra checks only have to be made for nodes that are actually
  // customized.
  var CustomNodeViewDesc = /*@__PURE__*/(function (NodeViewDesc) {
    function CustomNodeViewDesc(parent, node, outerDeco, innerDeco, dom, contentDOM, nodeDOM, spec, view, pos) {
      NodeViewDesc.call(this, parent, node, outerDeco, innerDeco, dom, contentDOM, nodeDOM, view, pos);
      this.spec = spec;
    }

    if ( NodeViewDesc ) CustomNodeViewDesc.__proto__ = NodeViewDesc;
    CustomNodeViewDesc.prototype = Object.create( NodeViewDesc && NodeViewDesc.prototype );
    CustomNodeViewDesc.prototype.constructor = CustomNodeViewDesc;

    // A custom `update` method gets to decide whether the update goes
    // through. If it does, and there's a `contentDOM` node, our logic
    // updates the children.
    CustomNodeViewDesc.prototype.update = function update (node, outerDeco, innerDeco, view) {
      if (this.dirty == NODE_DIRTY) { return false }
      if (this.spec.update) {
        var result = this.spec.update(node, outerDeco, innerDeco);
        if (result) { this.updateInner(node, outerDeco, innerDeco, view); }
        return result
      } else if (!this.contentDOM && !node.isLeaf) {
        return false
      } else {
        return NodeViewDesc.prototype.update.call(this, node, outerDeco, innerDeco, view)
      }
    };

    CustomNodeViewDesc.prototype.selectNode = function selectNode () {
      this.spec.selectNode ? this.spec.selectNode() : NodeViewDesc.prototype.selectNode.call(this);
    };

    CustomNodeViewDesc.prototype.deselectNode = function deselectNode () {
      this.spec.deselectNode ? this.spec.deselectNode() : NodeViewDesc.prototype.deselectNode.call(this);
    };

    CustomNodeViewDesc.prototype.setSelection = function setSelection (anchor, head, root, force) {
      this.spec.setSelection ? this.spec.setSelection(anchor, head, root)
        : NodeViewDesc.prototype.setSelection.call(this, anchor, head, root, force);
    };

    CustomNodeViewDesc.prototype.destroy = function destroy () {
      if (this.spec.destroy) { this.spec.destroy(); }
      NodeViewDesc.prototype.destroy.call(this);
    };

    CustomNodeViewDesc.prototype.stopEvent = function stopEvent (event) {
      return this.spec.stopEvent ? this.spec.stopEvent(event) : false
    };

    CustomNodeViewDesc.prototype.ignoreMutation = function ignoreMutation (mutation) {
      return this.spec.ignoreMutation ? this.spec.ignoreMutation(mutation) : NodeViewDesc.prototype.ignoreMutation.call(this, mutation)
    };

    return CustomNodeViewDesc;
  }(NodeViewDesc));

  // : (dom.Node, [ViewDesc])
  // Sync the content of the given DOM node with the nodes associated
  // with the given array of view descs, recursing into mark descs
  // because this should sync the subtree for a whole node at a time.
  function renderDescs(parentDOM, descs, view) {
    var dom = parentDOM.firstChild, written = false;
    for (var i = 0; i < descs.length; i++) {
      var desc = descs[i], childDOM = desc.dom;
      if (childDOM.parentNode == parentDOM) {
        while (childDOM != dom) { dom = rm(dom); written = true; }
        dom = dom.nextSibling;
      } else {
        written = true;
        parentDOM.insertBefore(childDOM, dom);
      }
      if (desc instanceof MarkViewDesc) {
        var pos = dom ? dom.previousSibling : parentDOM.lastChild;
        renderDescs(desc.contentDOM, desc.children, view);
        dom = pos ? pos.nextSibling : parentDOM.firstChild;
      }
    }
    while (dom) { dom = rm(dom); written = true; }
    if (written && view.trackWrites == parentDOM) { view.trackWrites = null; }
  }

  function OuterDecoLevel(nodeName) {
    if (nodeName) { this.nodeName = nodeName; }
  }
  OuterDecoLevel.prototype = Object.create(null);

  var noDeco = [new OuterDecoLevel];

  function computeOuterDeco(outerDeco, node, needsWrap) {
    if (outerDeco.length == 0) { return noDeco }

    var top = needsWrap ? noDeco[0] : new OuterDecoLevel, result = [top];

    for (var i = 0; i < outerDeco.length; i++) {
      var attrs = outerDeco[i].type.attrs;
      if (!attrs) { continue }
      if (attrs.nodeName)
        { result.push(top = new OuterDecoLevel(attrs.nodeName)); }

      for (var name in attrs) {
        var val = attrs[name];
        if (val == null) { continue }
        if (needsWrap && result.length == 1)
          { result.push(top = new OuterDecoLevel(node.isInline ? "span" : "div")); }
        if (name == "class") { top.class = (top.class ? top.class + " " : "") + val; }
        else if (name == "style") { top.style = (top.style ? top.style + ";" : "") + val; }
        else if (name != "nodeName") { top[name] = val; }
      }
    }

    return result
  }

  function patchOuterDeco(outerDOM, nodeDOM, prevComputed, curComputed) {
    // Shortcut for trivial case
    if (prevComputed == noDeco && curComputed == noDeco) { return nodeDOM }

    var curDOM = nodeDOM;
    for (var i = 0; i < curComputed.length; i++) {
      var deco = curComputed[i], prev = prevComputed[i];
      if (i) {
        var parent = (void 0);
        if (prev && prev.nodeName == deco.nodeName && curDOM != outerDOM &&
            (parent = curDOM.parentNode) && parent.tagName.toLowerCase() == deco.nodeName) {
          curDOM = parent;
        } else {
          parent = document.createElement(deco.nodeName);
          parent.pmIsDeco = true;
          parent.appendChild(curDOM);
          prev = noDeco[0];
          curDOM = parent;
        }
      }
      patchAttributes(curDOM, prev || noDeco[0], deco);
    }
    return curDOM
  }

  function patchAttributes(dom, prev, cur) {
    for (var name in prev)
      { if (name != "class" && name != "style" && name != "nodeName" && !(name in cur))
        { dom.removeAttribute(name); } }
    for (var name$1 in cur)
      { if (name$1 != "class" && name$1 != "style" && name$1 != "nodeName" && cur[name$1] != prev[name$1])
        { dom.setAttribute(name$1, cur[name$1]); } }
    if (prev.class != cur.class) {
      var prevList = prev.class ? prev.class.split(" ").filter(Boolean) : nothing;
      var curList = cur.class ? cur.class.split(" ").filter(Boolean) : nothing;
      for (var i = 0; i < prevList.length; i++) { if (curList.indexOf(prevList[i]) == -1)
        { dom.classList.remove(prevList[i]); } }
      for (var i$1 = 0; i$1 < curList.length; i$1++) { if (prevList.indexOf(curList[i$1]) == -1)
        { dom.classList.add(curList[i$1]); } }
    }
    if (prev.style != cur.style) {
      if (prev.style) {
        var prop = /\s*([\w\-\xa1-\uffff]+)\s*:(?:"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\(.*?\)|[^;])*/g, m;
        while (m = prop.exec(prev.style))
          { dom.style.removeProperty(m[1]); }
      }
      if (cur.style)
        { dom.style.cssText += cur.style; }
    }
  }

  function applyOuterDeco(dom, deco, node) {
    return patchOuterDeco(dom, dom, noDeco, computeOuterDeco(deco, node, dom.nodeType != 1))
  }

  // : ([Decoration], [Decoration]) → bool
  function sameOuterDeco(a, b) {
    if (a.length != b.length) { return false }
    for (var i = 0; i < a.length; i++) { if (!a[i].type.eq(b[i].type)) { return false } }
    return true
  }

  // Remove a DOM node and return its next sibling.
  function rm(dom) {
    var next = dom.nextSibling;
    dom.parentNode.removeChild(dom);
    return next
  }

  // Helper class for incrementally updating a tree of mark descs and
  // the widget and node descs inside of them.
  var ViewTreeUpdater = function ViewTreeUpdater(top, lockedNode) {
    this.top = top;
    this.lock = lockedNode;
    // Index into `this.top`'s child array, represents the current
    // update position.
    this.index = 0;
    // When entering a mark, the current top and index are pushed
    // onto this.
    this.stack = [];
    // Tracks whether anything was changed
    this.changed = false;

    this.preMatch = preMatch(top.node.content, top.children);
  };

  // Destroy and remove the children between the given indices in
  // `this.top`.
  ViewTreeUpdater.prototype.destroyBetween = function destroyBetween (start, end) {
    if (start == end) { return }
    for (var i = start; i < end; i++) { this.top.children[i].destroy(); }
    this.top.children.splice(start, end - start);
    this.changed = true;
  };

  // Destroy all remaining children in `this.top`.
  ViewTreeUpdater.prototype.destroyRest = function destroyRest () {
    this.destroyBetween(this.index, this.top.children.length);
  };

  // : ([Mark], EditorView)
  // Sync the current stack of mark descs with the given array of
  // marks, reusing existing mark descs when possible.
  ViewTreeUpdater.prototype.syncToMarks = function syncToMarks (marks, inline, view) {
    var keep = 0, depth = this.stack.length >> 1;
    var maxKeep = Math.min(depth, marks.length);
    while (keep < maxKeep &&
           (keep == depth - 1 ? this.top : this.stack[(keep + 1) << 1]).matchesMark(marks[keep]) && marks[keep].type.spec.spanning !== false)
      { keep++; }

    while (keep < depth) {
      this.destroyRest();
      this.top.dirty = NOT_DIRTY;
      this.index = this.stack.pop();
      this.top = this.stack.pop();
      depth--;
    }
    while (depth < marks.length) {
      this.stack.push(this.top, this.index + 1);
      var found = -1;
      for (var i = this.index; i < Math.min(this.index + 3, this.top.children.length); i++) {
        if (this.top.children[i].matchesMark(marks[depth])) { found = i; break }
      }
      if (found > -1) {
        if (found > this.index) {
          this.changed = true;
          this.destroyBetween(this.index, found);
        }
        this.top = this.top.children[this.index];
      } else {
        var markDesc = MarkViewDesc.create(this.top, marks[depth], inline, view);
        this.top.children.splice(this.index, 0, markDesc);
        this.top = markDesc;
        this.changed = true;
      }
      this.index = 0;
      depth++;
    }
  };

  // : (Node, [Decoration], DecorationSource) → bool
  // Try to find a node desc matching the given data. Skip over it and
  // return true when successful.
  ViewTreeUpdater.prototype.findNodeMatch = function findNodeMatch (node, outerDeco, innerDeco, index) {
    var children = this.top.children, found = -1;
    if (index >= this.preMatch.index) {
      for (var i = this.index; i < children.length; i++) { if (children[i].matchesNode(node, outerDeco, innerDeco)) {
        found = i;
        break
      } }
    } else {
      for (var i$1 = this.index, e = Math.min(children.length, i$1 + 1); i$1 < e; i$1++) {
        var child = children[i$1];
        if (child.matchesNode(node, outerDeco, innerDeco) && !this.preMatch.matched.has(child)) {
          found = i$1;
          break
        }
      }
    }
    if (found < 0) { return false }
    this.destroyBetween(this.index, found);
    this.index++;
    return true
  };

  // : (Node, [Decoration], DecorationSource, EditorView, Fragment, number) → bool
  // Try to update the next node, if any, to the given data. Checks
  // pre-matches to avoid overwriting nodes that could still be used.
  ViewTreeUpdater.prototype.updateNextNode = function updateNextNode (node, outerDeco, innerDeco, view, index) {
    for (var i = this.index; i < this.top.children.length; i++) {
      var next = this.top.children[i];
      if (next instanceof NodeViewDesc) {
        var preMatch = this.preMatch.matched.get(next);
        if (preMatch != null && preMatch != index) { return false }
        var nextDOM = next.dom;

        // Can't update if nextDOM is or contains this.lock, except if
        // it's a text node whose content already matches the new text
        // and whose decorations match the new ones.
        var locked = this.lock && (nextDOM == this.lock || nextDOM.nodeType == 1 && nextDOM.contains(this.lock.parentNode)) &&
            !(node.isText && next.node && next.node.isText && next.nodeDOM.nodeValue == node.text &&
              next.dirty != NODE_DIRTY && sameOuterDeco(outerDeco, next.outerDeco));
        if (!locked && next.update(node, outerDeco, innerDeco, view)) {
          this.destroyBetween(this.index, i);
          if (next.dom != nextDOM) { this.changed = true; }
          this.index++;
          return true
        }
        break
      }
    }
    return false
  };

  // : (Node, [Decoration], DecorationSource, EditorView)
  // Insert the node as a newly created node desc.
  ViewTreeUpdater.prototype.addNode = function addNode (node, outerDeco, innerDeco, view, pos) {
    this.top.children.splice(this.index++, 0, NodeViewDesc.create(this.top, node, outerDeco, innerDeco, view, pos));
    this.changed = true;
  };

  ViewTreeUpdater.prototype.placeWidget = function placeWidget (widget, view, pos) {
    var next = this.index < this.top.children.length ? this.top.children[this.index] : null;
    if (next && next.matchesWidget(widget) && (widget == next.widget || !next.widget.type.toDOM.parentNode)) {
      this.index++;
    } else {
      var desc = new WidgetViewDesc(this.top, widget, view, pos);
      this.top.children.splice(this.index++, 0, desc);
      this.changed = true;
    }
  };

  // Make sure a textblock looks and behaves correctly in
  // contentEditable.
  ViewTreeUpdater.prototype.addTextblockHacks = function addTextblockHacks () {
    var lastChild = this.top.children[this.index - 1];
    while (lastChild instanceof MarkViewDesc) { lastChild = lastChild.children[lastChild.children.length - 1]; }

    if (!lastChild || // Empty textblock
        !(lastChild instanceof TextViewDesc) ||
        /\n$/.test(lastChild.node.text)) {
      if (this.index < this.top.children.length && this.top.children[this.index].matchesHack()) {
        this.index++;
      } else {
        var dom = document.createElement("br");
        this.top.children.splice(this.index++, 0, new BRHackViewDesc(this.top, nothing, dom, null));
        this.changed = true;
      }
    }
  };

  // : (Fragment, [ViewDesc]) → {index: number, matched: Map<ViewDesc, number>}
  // Iterate from the end of the fragment and array of descs to find
  // directly matching ones, in order to avoid overeagerly reusing those
  // for other nodes. Returns the fragment index of the first node that
  // is part of the sequence of matched nodes at the end of the
  // fragment.
  function preMatch(frag, descs) {
    var fI = frag.childCount, dI = descs.length, matched = new Map;
    for (; fI > 0 && dI > 0; dI--) {
      var desc = descs[dI - 1], node = desc.node;
      if (!node) { continue }
      if (node != frag.child(fI - 1)) { break }
      --fI;
      matched.set(desc, fI);
    }
    return {index: fI, matched: matched}
  }

  function compareSide(a, b) { return a.type.side - b.type.side }

  // : (ViewDesc, DecorationSource, (Decoration, number), (Node, [Decoration], DecorationSource, number))
  // This function abstracts iterating over the nodes and decorations in
  // a fragment. Calls `onNode` for each node, with its local and child
  // decorations. Splits text nodes when there is a decoration starting
  // or ending inside of them. Calls `onWidget` for each widget.
  function iterDeco(parent, deco, onWidget, onNode) {
    var locals = deco.locals(parent), offset = 0;
    // Simple, cheap variant for when there are no local decorations
    if (locals.length == 0) {
      for (var i = 0; i < parent.childCount; i++) {
        var child = parent.child(i);
        onNode(child, locals, deco.forChild(offset, child), i);
        offset += child.nodeSize;
      }
      return
    }

    var decoIndex = 0, active = [], restNode = null;
    for (var parentIndex = 0;;) {
      if (decoIndex < locals.length && locals[decoIndex].to == offset) {
        var widget = locals[decoIndex++], widgets = (void 0);
        while (decoIndex < locals.length && locals[decoIndex].to == offset)
          { (widgets || (widgets = [widget])).push(locals[decoIndex++]); }
        if (widgets) {
          widgets.sort(compareSide);
          for (var i$1 = 0; i$1 < widgets.length; i$1++) { onWidget(widgets[i$1], parentIndex, !!restNode); }
        } else {
          onWidget(widget, parentIndex, !!restNode);
        }
      }

      var child$1 = (void 0), index = (void 0);
      if (restNode) {
        index = -1;
        child$1 = restNode;
        restNode = null;
      } else if (parentIndex < parent.childCount) {
        index = parentIndex;
        child$1 = parent.child(parentIndex++);
      } else {
        break
      }

      for (var i$2 = 0; i$2 < active.length; i$2++) { if (active[i$2].to <= offset) { active.splice(i$2--, 1); } }
      while (decoIndex < locals.length && locals[decoIndex].from <= offset && locals[decoIndex].to > offset)
        { active.push(locals[decoIndex++]); }

      var end = offset + child$1.nodeSize;
      if (child$1.isText) {
        var cutAt = end;
        if (decoIndex < locals.length && locals[decoIndex].from < cutAt) { cutAt = locals[decoIndex].from; }
        for (var i$3 = 0; i$3 < active.length; i$3++) { if (active[i$3].to < cutAt) { cutAt = active[i$3].to; } }
        if (cutAt < end) {
          restNode = child$1.cut(cutAt - offset);
          child$1 = child$1.cut(0, cutAt - offset);
          end = cutAt;
          index = -1;
        }
      }

      var outerDeco = !active.length ? nothing
          : child$1.isInline && !child$1.isLeaf ? active.filter(function (d) { return !d.inline; })
          : active.slice();
      onNode(child$1, outerDeco, deco.forChild(offset, child$1), index);
      offset = end;
    }
  }

  // List markers in Mobile Safari will mysteriously disappear
  // sometimes. This works around that.
  function iosHacks(dom) {
    if (dom.nodeName == "UL" || dom.nodeName == "OL") {
      var oldCSS = dom.style.cssText;
      dom.style.cssText = oldCSS + "; list-style: square !important";
      window.getComputedStyle(dom).listStyle;
      dom.style.cssText = oldCSS;
    }
  }

  function nearbyTextNode(node, offset) {
    for (;;) {
      if (node.nodeType == 3) { return node }
      if (node.nodeType == 1 && offset > 0) {
        if (node.childNodes.length > offset && node.childNodes[offset].nodeType == 3)
          { return node.childNodes[offset] }
        node = node.childNodes[offset - 1];
        offset = nodeSize(node);
      } else if (node.nodeType == 1 && offset < node.childNodes.length) {
        node = node.childNodes[offset];
        offset = 0;
      } else {
        return null
      }
    }
  }

  // Find a piece of text in an inline fragment, overlapping from-to
  function findTextInFragment(frag, text, from, to) {
    for (var i = 0, pos = 0; i < frag.childCount && pos <= to;) {
      var child = frag.child(i++), childStart = pos;
      pos += child.nodeSize;
      if (!child.isText) { continue }
      var str = child.text;
      while (i < frag.childCount) {
        var next = frag.child(i++);
        pos += next.nodeSize;
        if (!next.isText) { break }
        str += next.text;
      }
      if (pos >= from) {
        var found = str.lastIndexOf(text, to - childStart);
        if (found >= 0 && found + text.length + childStart >= from)
          { return childStart + found }
      }
    }
    return -1
  }

  // Replace range from-to in an array of view descs with replacement
  // (may be null to just delete). This goes very much against the grain
  // of the rest of this code, which tends to create nodes with the
  // right shape in one go, rather than messing with them after
  // creation, but is necessary in the composition hack.
  function replaceNodes(nodes, from, to, view, replacement) {
    var result = [];
    for (var i = 0, off = 0; i < nodes.length; i++) {
      var child = nodes[i], start = off, end = off += child.size;
      if (start >= to || end <= from) {
        result.push(child);
      } else {
        if (start < from) { result.push(child.slice(0, from - start, view)); }
        if (replacement) {
          result.push(replacement);
          replacement = null;
        }
        if (end > to) { result.push(child.slice(to - start, child.size, view)); }
      }
    }
    return result
  }

  function selectionFromDOM(view, origin) {
    var domSel = view.root.getSelection(), doc = view.state.doc;
    if (!domSel.focusNode) { return null }
    var nearestDesc = view.docView.nearestDesc(domSel.focusNode), inWidget = nearestDesc && nearestDesc.size == 0;
    var head = view.docView.posFromDOM(domSel.focusNode, domSel.focusOffset);
    if (head < 0) { return null }
    var $head = doc.resolve(head), $anchor, selection;
    if (selectionCollapsed(domSel)) {
      $anchor = $head;
      while (nearestDesc && !nearestDesc.node) { nearestDesc = nearestDesc.parent; }
      if (nearestDesc && nearestDesc.node.isAtom && NodeSelection.isSelectable(nearestDesc.node) && nearestDesc.parent
          && !(nearestDesc.node.isInline && isOnEdge(domSel.focusNode, domSel.focusOffset, nearestDesc.dom))) {
        var pos = nearestDesc.posBefore;
        selection = new NodeSelection(head == pos ? $head : doc.resolve(pos));
      }
    } else {
      var anchor = view.docView.posFromDOM(domSel.anchorNode, domSel.anchorOffset);
      if (anchor < 0) { return null }
      $anchor = doc.resolve(anchor);
    }

    if (!selection) {
      var bias = origin == "pointer" || (view.state.selection.head < $head.pos && !inWidget) ? 1 : -1;
      selection = selectionBetween(view, $anchor, $head, bias);
    }
    return selection
  }

  function editorOwnsSelection(view) {
    return view.editable ? view.hasFocus() :
      hasSelection(view) && document.activeElement && document.activeElement.contains(view.dom)
  }

  function selectionToDOM(view, force) {
    var sel = view.state.selection;
    syncNodeSelection(view, sel);

    if (!editorOwnsSelection(view)) { return }

    view.domObserver.disconnectSelection();

    if (view.cursorWrapper) {
      selectCursorWrapper(view);
    } else {
      var anchor = sel.anchor;
      var head = sel.head;
      var resetEditableFrom, resetEditableTo;
      if (brokenSelectBetweenUneditable && !(sel instanceof TextSelection)) {
        if (!sel.$from.parent.inlineContent)
          { resetEditableFrom = temporarilyEditableNear(view, sel.from); }
        if (!sel.empty && !sel.$from.parent.inlineContent)
          { resetEditableTo = temporarilyEditableNear(view, sel.to); }
      }
      view.docView.setSelection(anchor, head, view.root, force);
      if (brokenSelectBetweenUneditable) {
        if (resetEditableFrom) { resetEditable(resetEditableFrom); }
        if (resetEditableTo) { resetEditable(resetEditableTo); }
      }
      if (sel.visible) {
        view.dom.classList.remove("ProseMirror-hideselection");
      } else {
        view.dom.classList.add("ProseMirror-hideselection");
        if ("onselectionchange" in document) { removeClassOnSelectionChange(view); }
      }
    }

    view.domObserver.setCurSelection();
    view.domObserver.connectSelection();
  }

  // Kludge to work around Webkit not allowing a selection to start/end
  // between non-editable block nodes. We briefly make something
  // editable, set the selection, then set it uneditable again.

  var brokenSelectBetweenUneditable = result.safari || result.chrome && result.chrome_version < 63;

  function temporarilyEditableNear(view, pos) {
    var ref = view.docView.domFromPos(pos, 0);
    var node = ref.node;
    var offset = ref.offset;
    var after = offset < node.childNodes.length ? node.childNodes[offset] : null;
    var before = offset ? node.childNodes[offset - 1] : null;
    if (result.safari && after && after.contentEditable == "false") { return setEditable(after) }
    if ((!after || after.contentEditable == "false") && (!before || before.contentEditable == "false")) {
      if (after) { return setEditable(after) }
      else if (before) { return setEditable(before) }
    }
  }

  function setEditable(element) {
    element.contentEditable = "true";
    if (result.safari && element.draggable) { element.draggable = false; element.wasDraggable = true; }
    return element
  }

  function resetEditable(element) {
    element.contentEditable = "false";
    if (element.wasDraggable) { element.draggable = true; element.wasDraggable = null; }
  }

  function removeClassOnSelectionChange(view) {
    var doc = view.dom.ownerDocument;
    doc.removeEventListener("selectionchange", view.hideSelectionGuard);
    var domSel = view.root.getSelection();
    var node = domSel.anchorNode, offset = domSel.anchorOffset;
    doc.addEventListener("selectionchange", view.hideSelectionGuard = function () {
      if (domSel.anchorNode != node || domSel.anchorOffset != offset) {
        doc.removeEventListener("selectionchange", view.hideSelectionGuard);
        setTimeout(function () {
          if (!editorOwnsSelection(view) || view.state.selection.visible)
            { view.dom.classList.remove("ProseMirror-hideselection"); }
        }, 20);
      }
    });
  }

  function selectCursorWrapper(view) {
    var domSel = view.root.getSelection(), range = document.createRange();
    var node = view.cursorWrapper.dom, img = node.nodeName == "IMG";
    if (img) { range.setEnd(node.parentNode, domIndex(node) + 1); }
    else { range.setEnd(node, 0); }
    range.collapse(false);
    domSel.removeAllRanges();
    domSel.addRange(range);
    // Kludge to kill 'control selection' in IE11 when selecting an
    // invisible cursor wrapper, since that would result in those weird
    // resize handles and a selection that considers the absolutely
    // positioned wrapper, rather than the root editable node, the
    // focused element.
    if (!img && !view.state.selection.visible && result.ie && result.ie_version <= 11) {
      node.disabled = true;
      node.disabled = false;
    }
  }

  function syncNodeSelection(view, sel) {
    if (sel instanceof NodeSelection) {
      var desc = view.docView.descAt(sel.from);
      if (desc != view.lastSelectedViewDesc) {
        clearNodeSelection(view);
        if (desc) { desc.selectNode(); }
        view.lastSelectedViewDesc = desc;
      }
    } else {
      clearNodeSelection(view);
    }
  }

  // Clear all DOM statefulness of the last node selection.
  function clearNodeSelection(view) {
    if (view.lastSelectedViewDesc) {
      if (view.lastSelectedViewDesc.parent)
        { view.lastSelectedViewDesc.deselectNode(); }
      view.lastSelectedViewDesc = null;
    }
  }

  function selectionBetween(view, $anchor, $head, bias) {
    return view.someProp("createSelectionBetween", function (f) { return f(view, $anchor, $head); })
      || TextSelection.between($anchor, $head, bias)
  }

  function hasFocusAndSelection(view) {
    if (view.editable && view.root.activeElement != view.dom) { return false }
    return hasSelection(view)
  }

  function hasSelection(view) {
    var sel = view.root.getSelection();
    if (!sel.anchorNode) { return false }
    try {
      // Firefox will raise 'permission denied' errors when accessing
      // properties of `sel.anchorNode` when it's in a generated CSS
      // element.
      return view.dom.contains(sel.anchorNode.nodeType == 3 ? sel.anchorNode.parentNode : sel.anchorNode) &&
        (view.editable || view.dom.contains(sel.focusNode.nodeType == 3 ? sel.focusNode.parentNode : sel.focusNode))
    } catch(_) {
      return false
    }
  }

  function anchorInRightPlace(view) {
    var anchorDOM = view.docView.domFromPos(view.state.selection.anchor, 0);
    var domSel = view.root.getSelection();
    return isEquivalentPosition(anchorDOM.node, anchorDOM.offset, domSel.anchorNode, domSel.anchorOffset)
  }

  function moveSelectionBlock(state, dir) {
    var ref = state.selection;
    var $anchor = ref.$anchor;
    var $head = ref.$head;
    var $side = dir > 0 ? $anchor.max($head) : $anchor.min($head);
    var $start = !$side.parent.inlineContent ? $side : $side.depth ? state.doc.resolve(dir > 0 ? $side.after() : $side.before()) : null;
    return $start && Selection.findFrom($start, dir)
  }

  function apply(view, sel) {
    view.dispatch(view.state.tr.setSelection(sel).scrollIntoView());
    return true
  }

  function selectHorizontally(view, dir, mods) {
    var sel = view.state.selection;
    if (sel instanceof TextSelection) {
      if (!sel.empty || mods.indexOf("s") > -1) {
        return false
      } else if (view.endOfTextblock(dir > 0 ? "right" : "left")) {
        var next = moveSelectionBlock(view.state, dir);
        if (next && (next instanceof NodeSelection)) { return apply(view, next) }
        return false
      } else if (!(result.mac && mods.indexOf("m") > -1)) {
        var $head = sel.$head, node = $head.textOffset ? null : dir < 0 ? $head.nodeBefore : $head.nodeAfter, desc;
        if (!node || node.isText) { return false }
        var nodePos = dir < 0 ? $head.pos - node.nodeSize : $head.pos;
        if (!(node.isAtom || (desc = view.docView.descAt(nodePos)) && !desc.contentDOM)) { return false }
        if (NodeSelection.isSelectable(node)) {
          return apply(view, new NodeSelection(dir < 0 ? view.state.doc.resolve($head.pos - node.nodeSize) : $head))
        } else if (result.webkit) {
          // Chrome and Safari will introduce extra pointless cursor
          // positions around inline uneditable nodes, so we have to
          // take over and move the cursor past them (#937)
          return apply(view, new TextSelection(view.state.doc.resolve(dir < 0 ? nodePos : nodePos + node.nodeSize)))
        } else {
          return false
        }
      }
    } else if (sel instanceof NodeSelection && sel.node.isInline) {
      return apply(view, new TextSelection(dir > 0 ? sel.$to : sel.$from))
    } else {
      var next$1 = moveSelectionBlock(view.state, dir);
      if (next$1) { return apply(view, next$1) }
      return false
    }
  }

  function nodeLen(node) {
    return node.nodeType == 3 ? node.nodeValue.length : node.childNodes.length
  }

  function isIgnorable(dom) {
    var desc = dom.pmViewDesc;
    return desc && desc.size == 0 && (dom.nextSibling || dom.nodeName != "BR")
  }

  // Make sure the cursor isn't directly after one or more ignored
  // nodes, which will confuse the browser's cursor motion logic.
  function skipIgnoredNodesLeft(view) {
    var sel = view.root.getSelection();
    var node = sel.focusNode, offset = sel.focusOffset;
    if (!node) { return }
    var moveNode, moveOffset, force = false;
    // Gecko will do odd things when the selection is directly in front
    // of a non-editable node, so in that case, move it into the next
    // node if possible. Issue prosemirror/prosemirror#832.
    if (result.gecko && node.nodeType == 1 && offset < nodeLen(node) && isIgnorable(node.childNodes[offset])) { force = true; }
    for (;;) {
      if (offset > 0) {
        if (node.nodeType != 1) {
          break
        } else {
          var before = node.childNodes[offset - 1];
          if (isIgnorable(before)) {
            moveNode = node;
            moveOffset = --offset;
          } else if (before.nodeType == 3) {
            node = before;
            offset = node.nodeValue.length;
          } else { break }
        }
      } else if (isBlockNode(node)) {
        break
      } else {
        var prev = node.previousSibling;
        while (prev && isIgnorable(prev)) {
          moveNode = node.parentNode;
          moveOffset = domIndex(prev);
          prev = prev.previousSibling;
        }
        if (!prev) {
          node = node.parentNode;
          if (node == view.dom) { break }
          offset = 0;
        } else {
          node = prev;
          offset = nodeLen(node);
        }
      }
    }
    if (force) { setSelFocus(view, sel, node, offset); }
    else if (moveNode) { setSelFocus(view, sel, moveNode, moveOffset); }
  }

  // Make sure the cursor isn't directly before one or more ignored
  // nodes.
  function skipIgnoredNodesRight(view) {
    var sel = view.root.getSelection();
    var node = sel.focusNode, offset = sel.focusOffset;
    if (!node) { return }
    var len = nodeLen(node);
    var moveNode, moveOffset;
    for (;;) {
      if (offset < len) {
        if (node.nodeType != 1) { break }
        var after = node.childNodes[offset];
        if (isIgnorable(after)) {
          moveNode = node;
          moveOffset = ++offset;
        }
        else { break }
      } else if (isBlockNode(node)) {
        break
      } else {
        var next = node.nextSibling;
        while (next && isIgnorable(next)) {
          moveNode = next.parentNode;
          moveOffset = domIndex(next) + 1;
          next = next.nextSibling;
        }
        if (!next) {
          node = node.parentNode;
          if (node == view.dom) { break }
          offset = len = 0;
        } else {
          node = next;
          offset = 0;
          len = nodeLen(node);
        }
      }
    }
    if (moveNode) { setSelFocus(view, sel, moveNode, moveOffset); }
  }

  function isBlockNode(dom) {
    var desc = dom.pmViewDesc;
    return desc && desc.node && desc.node.isBlock
  }

  function setSelFocus(view, sel, node, offset) {
    if (selectionCollapsed(sel)) {
      var range = document.createRange();
      range.setEnd(node, offset);
      range.setStart(node, offset);
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (sel.extend) {
      sel.extend(node, offset);
    }
    view.domObserver.setCurSelection();
    var state = view.state;
    // If no state update ends up happening, reset the selection.
    setTimeout(function () {
      if (view.state == state) { selectionToDOM(view); }
    }, 50);
  }

  // : (EditorState, number)
  // Check whether vertical selection motion would involve node
  // selections. If so, apply it (if not, the result is left to the
  // browser)
  function selectVertically(view, dir, mods) {
    var sel = view.state.selection;
    if (sel instanceof TextSelection && !sel.empty || mods.indexOf("s") > -1) { return false }
    if (result.mac && mods.indexOf("m") > -1) { return false }
    var $from = sel.$from;
    var $to = sel.$to;

    if (!$from.parent.inlineContent || view.endOfTextblock(dir < 0 ? "up" : "down")) {
      var next = moveSelectionBlock(view.state, dir);
      if (next && (next instanceof NodeSelection))
        { return apply(view, next) }
    }
    if (!$from.parent.inlineContent) {
      var side = dir < 0 ? $from : $to;
      var beyond = sel instanceof AllSelection ? Selection.near(side, dir) : Selection.findFrom(side, dir);
      return beyond ? apply(view, beyond) : false
    }
    return false
  }

  function stopNativeHorizontalDelete(view, dir) {
    if (!(view.state.selection instanceof TextSelection)) { return true }
    var ref = view.state.selection;
    var $head = ref.$head;
    var $anchor = ref.$anchor;
    var empty = ref.empty;
    if (!$head.sameParent($anchor)) { return true }
    if (!empty) { return false }
    if (view.endOfTextblock(dir > 0 ? "forward" : "backward")) { return true }
    var nextNode = !$head.textOffset && (dir < 0 ? $head.nodeBefore : $head.nodeAfter);
    if (nextNode && !nextNode.isText) {
      var tr = view.state.tr;
      if (dir < 0) { tr.delete($head.pos - nextNode.nodeSize, $head.pos); }
      else { tr.delete($head.pos, $head.pos + nextNode.nodeSize); }
      view.dispatch(tr);
      return true
    }
    return false
  }

  function switchEditable(view, node, state) {
    view.domObserver.stop();
    node.contentEditable = state;
    view.domObserver.start();
  }

  // Issue #867 / #1090 / https://bugs.chromium.org/p/chromium/issues/detail?id=903821
  // In which Safari (and at some point in the past, Chrome) does really
  // wrong things when the down arrow is pressed when the cursor is
  // directly at the start of a textblock and has an uneditable node
  // after it
  function safariDownArrowBug(view) {
    if (!result.safari || view.state.selection.$head.parentOffset > 0) { return }
    var ref = view.root.getSelection();
    var focusNode = ref.focusNode;
    var focusOffset = ref.focusOffset;
    if (focusNode && focusNode.nodeType == 1 && focusOffset == 0 &&
        focusNode.firstChild && focusNode.firstChild.contentEditable == "false") {
      var child = focusNode.firstChild;
      switchEditable(view, child, true);
      setTimeout(function () { return switchEditable(view, child, false); }, 20);
    }
  }

  // A backdrop key mapping used to make sure we always suppress keys
  // that have a dangerous default effect, even if the commands they are
  // bound to return false, and to make sure that cursor-motion keys
  // find a cursor (as opposed to a node selection) when pressed. For
  // cursor-motion keys, the code in the handlers also takes care of
  // block selections.

  function getMods(event) {
    var result = "";
    if (event.ctrlKey) { result += "c"; }
    if (event.metaKey) { result += "m"; }
    if (event.altKey) { result += "a"; }
    if (event.shiftKey) { result += "s"; }
    return result
  }

  function captureKeyDown(view, event) {
    var code = event.keyCode, mods = getMods(event);
    if (code == 8 || (result.mac && code == 72 && mods == "c")) { // Backspace, Ctrl-h on Mac
      return stopNativeHorizontalDelete(view, -1) || skipIgnoredNodesLeft(view)
    } else if (code == 46 || (result.mac && code == 68 && mods == "c")) { // Delete, Ctrl-d on Mac
      return stopNativeHorizontalDelete(view, 1) || skipIgnoredNodesRight(view)
    } else if (code == 13 || code == 27) { // Enter, Esc
      return true
    } else if (code == 37) { // Left arrow
      return selectHorizontally(view, -1, mods) || skipIgnoredNodesLeft(view)
    } else if (code == 39) { // Right arrow
      return selectHorizontally(view, 1, mods) || skipIgnoredNodesRight(view)
    } else if (code == 38) { // Up arrow
      return selectVertically(view, -1, mods) || skipIgnoredNodesLeft(view)
    } else if (code == 40) { // Down arrow
      return safariDownArrowBug(view) || selectVertically(view, 1, mods) || skipIgnoredNodesRight(view)
    } else if (mods == (result.mac ? "m" : "c") &&
               (code == 66 || code == 73 || code == 89 || code == 90)) { // Mod-[biyz]
      return true
    }
    return false
  }

  // Note that all referencing and parsing is done with the
  // start-of-operation selection and document, since that's the one
  // that the DOM represents. If any changes came in in the meantime,
  // the modification is mapped over those before it is applied, in
  // readDOMChange.

  function parseBetween(view, from_, to_) {
    var ref = view.docView.parseRange(from_, to_);
    var parent = ref.node;
    var fromOffset = ref.fromOffset;
    var toOffset = ref.toOffset;
    var from = ref.from;
    var to = ref.to;

    var domSel = view.root.getSelection(), find = null, anchor = domSel.anchorNode;
    if (anchor && view.dom.contains(anchor.nodeType == 1 ? anchor : anchor.parentNode)) {
      find = [{node: anchor, offset: domSel.anchorOffset}];
      if (!selectionCollapsed(domSel))
        { find.push({node: domSel.focusNode, offset: domSel.focusOffset}); }
    }
    // Work around issue in Chrome where backspacing sometimes replaces
    // the deleted content with a random BR node (issues #799, #831)
    if (result.chrome && view.lastKeyCode === 8) {
      for (var off = toOffset; off > fromOffset; off--) {
        var node = parent.childNodes[off - 1], desc = node.pmViewDesc;
        if (node.nodeName == "BR" && !desc) { toOffset = off; break }
        if (!desc || desc.size) { break }
      }
    }
    var startDoc = view.state.doc;
    var parser = view.someProp("domParser") || DOMParser.fromSchema(view.state.schema);
    var $from = startDoc.resolve(from);

    var sel = null, doc = parser.parse(parent, {
      topNode: $from.parent,
      topMatch: $from.parent.contentMatchAt($from.index()),
      topOpen: true,
      from: fromOffset,
      to: toOffset,
      preserveWhitespace: $from.parent.type.spec.code ? "full" : true,
      editableContent: true,
      findPositions: find,
      ruleFromNode: ruleFromNode,
      context: $from
    });
    if (find && find[0].pos != null) {
      var anchor$1 = find[0].pos, head = find[1] && find[1].pos;
      if (head == null) { head = anchor$1; }
      sel = {anchor: anchor$1 + from, head: head + from};
    }
    return {doc: doc, sel: sel, from: from, to: to}
  }

  function ruleFromNode(dom) {
    var desc = dom.pmViewDesc;
    if (desc) {
      return desc.parseRule()
    } else if (dom.nodeName == "BR" && dom.parentNode) {
      // Safari replaces the list item or table cell with a BR
      // directly in the list node (?!) if you delete the last
      // character in a list item or table cell (#708, #862)
      if (result.safari && /^(ul|ol)$/i.test(dom.parentNode.nodeName)) {
        var skip = document.createElement("div");
        skip.appendChild(document.createElement("li"));
        return {skip: skip}
      } else if (dom.parentNode.lastChild == dom || result.safari && /^(tr|table)$/i.test(dom.parentNode.nodeName)) {
        return {ignore: true}
      }
    } else if (dom.nodeName == "IMG" && dom.getAttribute("mark-placeholder")) {
      return {ignore: true}
    }
  }

  function readDOMChange(view, from, to, typeOver, addedNodes) {
    if (from < 0) {
      var origin = view.lastSelectionTime > Date.now() - 50 ? view.lastSelectionOrigin : null;
      var newSel = selectionFromDOM(view, origin);
      if (newSel && !view.state.selection.eq(newSel)) {
        var tr$1 = view.state.tr.setSelection(newSel);
        if (origin == "pointer") { tr$1.setMeta("pointer", true); }
        else if (origin == "key") { tr$1.scrollIntoView(); }
        view.dispatch(tr$1);
      }
      return
    }

    var $before = view.state.doc.resolve(from);
    var shared = $before.sharedDepth(to);
    from = $before.before(shared + 1);
    to = view.state.doc.resolve(to).after(shared + 1);

    var sel = view.state.selection;
    var parse = parseBetween(view, from, to);
    // Chrome sometimes leaves the cursor before the inserted text when
    // composing after a cursor wrapper. This moves it forward.
    if (result.chrome && view.cursorWrapper && parse.sel && parse.sel.anchor == view.cursorWrapper.deco.from) {
      var text = view.cursorWrapper.deco.type.toDOM.nextSibling;
      var size = text && text.nodeValue ? text.nodeValue.length : 1;
      parse.sel = {anchor: parse.sel.anchor + size, head: parse.sel.anchor + size};
    }

    var doc = view.state.doc, compare = doc.slice(parse.from, parse.to);
    var preferredPos, preferredSide;
    // Prefer anchoring to end when Backspace is pressed
    if (view.lastKeyCode === 8 && Date.now() - 100 < view.lastKeyCodeTime) {
      preferredPos = view.state.selection.to;
      preferredSide = "end";
    } else {
      preferredPos = view.state.selection.from;
      preferredSide = "start";
    }
    view.lastKeyCode = null;

    var change = findDiff(compare.content, parse.doc.content, parse.from, preferredPos, preferredSide);
    if (!change) {
      if (typeOver && sel instanceof TextSelection && !sel.empty && sel.$head.sameParent(sel.$anchor) &&
          !view.composing && !(parse.sel && parse.sel.anchor != parse.sel.head)) {
        change = {start: sel.from, endA: sel.to, endB: sel.to};
      } else if ((result.ios && view.lastIOSEnter > Date.now() - 225 || result.android) &&
                 addedNodes.some(function (n) { return n.nodeName == "DIV" || n.nodeName == "P"; }) &&
                 view.someProp("handleKeyDown", function (f) { return f(view, keyEvent(13, "Enter")); })) {
        view.lastIOSEnter = 0;
        return
      } else {
        if (parse.sel) {
          var sel$1 = resolveSelection$1(view, view.state.doc, parse.sel);
          if (sel$1 && !sel$1.eq(view.state.selection)) { view.dispatch(view.state.tr.setSelection(sel$1)); }
        }
        return
      }
    }
    view.domChangeCount++;
    // Handle the case where overwriting a selection by typing matches
    // the start or end of the selected content, creating a change
    // that's smaller than what was actually overwritten.
    if (view.state.selection.from < view.state.selection.to &&
        change.start == change.endB &&
        view.state.selection instanceof TextSelection) {
      if (change.start > view.state.selection.from && change.start <= view.state.selection.from + 2) {
        change.start = view.state.selection.from;
      } else if (change.endA < view.state.selection.to && change.endA >= view.state.selection.to - 2) {
        change.endB += (view.state.selection.to - change.endA);
        change.endA = view.state.selection.to;
      }
    }

    // IE11 will insert a non-breaking space _ahead_ of the space after
    // the cursor space when adding a space before another space. When
    // that happened, adjust the change to cover the space instead.
    if (result.ie && result.ie_version <= 11 && change.endB == change.start + 1 &&
        change.endA == change.start && change.start > parse.from &&
        parse.doc.textBetween(change.start - parse.from - 1, change.start - parse.from + 1) == " \u00a0") {
      change.start--;
      change.endA--;
      change.endB--;
    }

    var $from = parse.doc.resolveNoCache(change.start - parse.from);
    var $to = parse.doc.resolveNoCache(change.endB - parse.from);
    var inlineChange = $from.sameParent($to) && $from.parent.inlineContent;
    var nextSel;
    // If this looks like the effect of pressing Enter (or was recorded
    // as being an iOS enter press), just dispatch an Enter key instead.
    if (((result.ios && view.lastIOSEnter > Date.now() - 225 &&
          (!inlineChange || addedNodes.some(function (n) { return n.nodeName == "DIV" || n.nodeName == "P"; }))) ||
         (!inlineChange && $from.pos < parse.doc.content.size &&
          (nextSel = Selection.findFrom(parse.doc.resolve($from.pos + 1), 1, true)) &&
          nextSel.head == $to.pos)) &&
        view.someProp("handleKeyDown", function (f) { return f(view, keyEvent(13, "Enter")); })) {
      view.lastIOSEnter = 0;
      return
    }
    // Same for backspace
    if (view.state.selection.anchor > change.start &&
        looksLikeJoin(doc, change.start, change.endA, $from, $to) &&
        view.someProp("handleKeyDown", function (f) { return f(view, keyEvent(8, "Backspace")); })) {
      if (result.android && result.chrome) { view.domObserver.suppressSelectionUpdates(); } // #820
      return
    }

    // Chrome Android will occasionally, during composition, delete the
    // entire composition and then immediately insert it again. This is
    // used to detect that situation.
    if (result.chrome && result.android && change.toB == change.from)
      { view.lastAndroidDelete = Date.now(); }

    // This tries to detect Android virtual keyboard
    // enter-and-pick-suggestion action. That sometimes (see issue
    // #1059) first fires a DOM mutation, before moving the selection to
    // the newly created block. And then, because ProseMirror cleans up
    // the DOM selection, it gives up moving the selection entirely,
    // leaving the cursor in the wrong place. When that happens, we drop
    // the new paragraph from the initial change, and fire a simulated
    // enter key afterwards.
    if (result.android && !inlineChange && $from.start() != $to.start() && $to.parentOffset == 0 && $from.depth == $to.depth &&
        parse.sel && parse.sel.anchor == parse.sel.head && parse.sel.head == change.endA) {
      change.endB -= 2;
      $to = parse.doc.resolveNoCache(change.endB - parse.from);
      setTimeout(function () {
        view.someProp("handleKeyDown", function (f) { return f(view, keyEvent(13, "Enter")); });
      }, 20);
    }

    var chFrom = change.start, chTo = change.endA;

    var tr, storedMarks, markChange, $from1;
    if (inlineChange) {
      if ($from.pos == $to.pos) { // Deletion
        // IE11 sometimes weirdly moves the DOM selection around after
        // backspacing out the first element in a textblock
        if (result.ie && result.ie_version <= 11 && $from.parentOffset == 0) {
          view.domObserver.suppressSelectionUpdates();
          setTimeout(function () { return selectionToDOM(view); }, 20);
        }
        tr = view.state.tr.delete(chFrom, chTo);
        storedMarks = doc.resolve(change.start).marksAcross(doc.resolve(change.endA));
      } else if ( // Adding or removing a mark
        change.endA == change.endB && ($from1 = doc.resolve(change.start)) &&
        (markChange = isMarkChange($from.parent.content.cut($from.parentOffset, $to.parentOffset),
                                   $from1.parent.content.cut($from1.parentOffset, change.endA - $from1.start())))
      ) {
        tr = view.state.tr;
        if (markChange.type == "add") { tr.addMark(chFrom, chTo, markChange.mark); }
        else { tr.removeMark(chFrom, chTo, markChange.mark); }
      } else if ($from.parent.child($from.index()).isText && $from.index() == $to.index() - ($to.textOffset ? 0 : 1)) {
        // Both positions in the same text node -- simply insert text
        var text$1 = $from.parent.textBetween($from.parentOffset, $to.parentOffset);
        if (view.someProp("handleTextInput", function (f) { return f(view, chFrom, chTo, text$1); })) { return }
        tr = view.state.tr.insertText(text$1, chFrom, chTo);
      }
    }

    if (!tr)
      { tr = view.state.tr.replace(chFrom, chTo, parse.doc.slice(change.start - parse.from, change.endB - parse.from)); }
    if (parse.sel) {
      var sel$2 = resolveSelection$1(view, tr.doc, parse.sel);
      // Chrome Android will sometimes, during composition, report the
      // selection in the wrong place. If it looks like that is
      // happening, don't update the selection.
      // Edge just doesn't move the cursor forward when you start typing
      // in an empty block or between br nodes.
      if (sel$2 && !(result.chrome && result.android && view.composing && sel$2.empty &&
                   (change.from != change.toB || view.lastAndroidDelete < Date.now() - 100) &&
                   (sel$2.head == chFrom || sel$2.head == tr.mapping.map(chTo) - 1) ||
                   result.ie && sel$2.empty && sel$2.head == chFrom))
        { tr.setSelection(sel$2); }
    }
    if (storedMarks) { tr.ensureMarks(storedMarks); }
    view.dispatch(tr.scrollIntoView());
  }

  function resolveSelection$1(view, doc, parsedSel) {
    if (Math.max(parsedSel.anchor, parsedSel.head) > doc.content.size) { return null }
    return selectionBetween(view, doc.resolve(parsedSel.anchor), doc.resolve(parsedSel.head))
  }

  // : (Fragment, Fragment) → ?{mark: Mark, type: string}
  // Given two same-length, non-empty fragments of inline content,
  // determine whether the first could be created from the second by
  // removing or adding a single mark type.
  function isMarkChange(cur, prev) {
    var curMarks = cur.firstChild.marks, prevMarks = prev.firstChild.marks;
    var added = curMarks, removed = prevMarks, type, mark, update;
    for (var i = 0; i < prevMarks.length; i++) { added = prevMarks[i].removeFromSet(added); }
    for (var i$1 = 0; i$1 < curMarks.length; i$1++) { removed = curMarks[i$1].removeFromSet(removed); }
    if (added.length == 1 && removed.length == 0) {
      mark = added[0];
      type = "add";
      update = function (node) { return node.mark(mark.addToSet(node.marks)); };
    } else if (added.length == 0 && removed.length == 1) {
      mark = removed[0];
      type = "remove";
      update = function (node) { return node.mark(mark.removeFromSet(node.marks)); };
    } else {
      return null
    }
    var updated = [];
    for (var i$2 = 0; i$2 < prev.childCount; i$2++) { updated.push(update(prev.child(i$2))); }
    if (Fragment.from(updated).eq(cur)) { return {mark: mark, type: type} }
  }

  function looksLikeJoin(old, start, end, $newStart, $newEnd) {
    if (!$newStart.parent.isTextblock ||
        // The content must have shrunk
        end - start <= $newEnd.pos - $newStart.pos ||
        // newEnd must point directly at or after the end of the block that newStart points into
        skipClosingAndOpening($newStart, true, false) < $newEnd.pos)
      { return false }

    var $start = old.resolve(start);
    // Start must be at the end of a block
    if ($start.parentOffset < $start.parent.content.size || !$start.parent.isTextblock)
      { return false }
    var $next = old.resolve(skipClosingAndOpening($start, true, true));
    // The next textblock must start before end and end near it
    if (!$next.parent.isTextblock || $next.pos > end ||
        skipClosingAndOpening($next, true, false) < end)
      { return false }

    // The fragments after the join point must match
    return $newStart.parent.content.cut($newStart.parentOffset).eq($next.parent.content)
  }

  function skipClosingAndOpening($pos, fromEnd, mayOpen) {
    var depth = $pos.depth, end = fromEnd ? $pos.end() : $pos.pos;
    while (depth > 0 && (fromEnd || $pos.indexAfter(depth) == $pos.node(depth).childCount)) {
      depth--;
      end++;
      fromEnd = false;
    }
    if (mayOpen) {
      var next = $pos.node(depth).maybeChild($pos.indexAfter(depth));
      while (next && !next.isLeaf) {
        next = next.firstChild;
        end++;
      }
    }
    return end
  }

  function findDiff(a, b, pos, preferredPos, preferredSide) {
    var start = a.findDiffStart(b, pos);
    if (start == null) { return null }
    var ref = a.findDiffEnd(b, pos + a.size, pos + b.size);
    var endA = ref.a;
    var endB = ref.b;
    if (preferredSide == "end") {
      var adjust = Math.max(0, start - Math.min(endA, endB));
      preferredPos -= endA + adjust - start;
    }
    if (endA < start && a.size < b.size) {
      var move = preferredPos <= start && preferredPos >= endA ? start - preferredPos : 0;
      start -= move;
      endB = start + (endB - endA);
      endA = start;
    } else if (endB < start) {
      var move$1 = preferredPos <= start && preferredPos >= endB ? start - preferredPos : 0;
      start -= move$1;
      endA = start + (endA - endB);
      endB = start;
    }
    return {start: start, endA: endA, endB: endB}
  }

  function serializeForClipboard(view, slice) {
    var context = [];
    var content = slice.content;
    var openStart = slice.openStart;
    var openEnd = slice.openEnd;
    while (openStart > 1 && openEnd > 1 && content.childCount == 1 && content.firstChild.childCount == 1) {
      openStart--;
      openEnd--;
      var node = content.firstChild;
      context.push(node.type.name, node.attrs != node.type.defaultAttrs ? node.attrs : null);
      content = node.content;
    }

    var serializer = view.someProp("clipboardSerializer") || DOMSerializer.fromSchema(view.state.schema);
    var doc = detachedDoc(), wrap = doc.createElement("div");
    wrap.appendChild(serializer.serializeFragment(content, {document: doc}));

    var firstChild = wrap.firstChild, needsWrap;
    while (firstChild && firstChild.nodeType == 1 && (needsWrap = wrapMap[firstChild.nodeName.toLowerCase()])) {
      for (var i = needsWrap.length - 1; i >= 0; i--) {
        var wrapper = doc.createElement(needsWrap[i]);
        while (wrap.firstChild) { wrapper.appendChild(wrap.firstChild); }
        wrap.appendChild(wrapper);
      }
      firstChild = wrap.firstChild;
    }

    if (firstChild && firstChild.nodeType == 1)
      { firstChild.setAttribute("data-pm-slice", (openStart + " " + openEnd + " " + (JSON.stringify(context)))); }

    var text = view.someProp("clipboardTextSerializer", function (f) { return f(slice); }) ||
        slice.content.textBetween(0, slice.content.size, "\n\n");

    return {dom: wrap, text: text}
  }

  // : (EditorView, string, string, ?bool, ResolvedPos) → ?Slice
  // Read a slice of content from the clipboard (or drop data).
  function parseFromClipboard(view, text, html, plainText, $context) {
    var dom, inCode = $context.parent.type.spec.code, slice;
    if (!html && !text) { return null }
    var asText = text && (plainText || inCode || !html);
    if (asText) {
      view.someProp("transformPastedText", function (f) { text = f(text, inCode || plainText); });
      if (inCode) { return new Slice(Fragment.from(view.state.schema.text(text.replace(/\r\n?/g, "\n"))), 0, 0) }
      var parsed = view.someProp("clipboardTextParser", function (f) { return f(text, $context, plainText); });
      if (parsed) {
        slice = parsed;
      } else {
        dom = document.createElement("div");
        text.trim().split(/(?:\r\n?|\n)+/).forEach(function (block) {
          dom.appendChild(document.createElement("p")).textContent = block;
        });
      }
    } else {
      view.someProp("transformPastedHTML", function (f) { html = f(html); });
      dom = readHTML(html);
    }

    var contextNode = dom && dom.querySelector("[data-pm-slice]");
    var sliceData = contextNode && /^(\d+) (\d+) (.*)/.exec(contextNode.getAttribute("data-pm-slice"));
    if (!slice) {
      var parser = view.someProp("clipboardParser") || view.someProp("domParser") || DOMParser.fromSchema(view.state.schema);
      slice = parser.parseSlice(dom, {preserveWhitespace: !!(asText || sliceData), context: $context});
    }
    if (sliceData)
      { slice = addContext(closeSlice(slice, +sliceData[1], +sliceData[2]), sliceData[3]); }
    else // HTML wasn't created by ProseMirror. Make sure top-level siblings are coherent
      { slice = Slice.maxOpen(normalizeSiblings(slice.content, $context), false); }

    view.someProp("transformPasted", function (f) { slice = f(slice); });
    return slice
  }

  // Takes a slice parsed with parseSlice, which means there hasn't been
  // any content-expression checking done on the top nodes, tries to
  // find a parent node in the current context that might fit the nodes,
  // and if successful, rebuilds the slice so that it fits into that parent.
  //
  // This addresses the problem that Transform.replace expects a
  // coherent slice, and will fail to place a set of siblings that don't
  // fit anywhere in the schema.
  function normalizeSiblings(fragment, $context) {
    if (fragment.childCount < 2) { return fragment }
    var loop = function ( d ) {
      var parent = $context.node(d);
      var match = parent.contentMatchAt($context.index(d));
      var lastWrap = (void 0), result = [];
      fragment.forEach(function (node) {
        if (!result) { return }
        var wrap = match.findWrapping(node.type), inLast;
        if (!wrap) { return result = null }
        if (inLast = result.length && lastWrap.length && addToSibling(wrap, lastWrap, node, result[result.length - 1], 0)) {
          result[result.length - 1] = inLast;
        } else {
          if (result.length) { result[result.length - 1] = closeRight(result[result.length - 1], lastWrap.length); }
          var wrapped = withWrappers(node, wrap);
          result.push(wrapped);
          match = match.matchType(wrapped.type, wrapped.attrs);
          lastWrap = wrap;
        }
      });
      if (result) { return { v: Fragment.from(result) } }
    };

    for (var d = $context.depth; d >= 0; d--) {
      var returned = loop( d );

      if ( returned ) return returned.v;
    }
    return fragment
  }

  function withWrappers(node, wrap, from) {
    if ( from === void 0 ) from = 0;

    for (var i = wrap.length - 1; i >= from; i--)
      { node = wrap[i].create(null, Fragment.from(node)); }
    return node
  }

  // Used to group adjacent nodes wrapped in similar parents by
  // normalizeSiblings into the same parent node
  function addToSibling(wrap, lastWrap, node, sibling, depth) {
    if (depth < wrap.length && depth < lastWrap.length && wrap[depth] == lastWrap[depth]) {
      var inner = addToSibling(wrap, lastWrap, node, sibling.lastChild, depth + 1);
      if (inner) { return sibling.copy(sibling.content.replaceChild(sibling.childCount - 1, inner)) }
      var match = sibling.contentMatchAt(sibling.childCount);
      if (match.matchType(depth == wrap.length - 1 ? node.type : wrap[depth + 1]))
        { return sibling.copy(sibling.content.append(Fragment.from(withWrappers(node, wrap, depth + 1)))) }
    }
  }

  function closeRight(node, depth) {
    if (depth == 0) { return node }
    var fragment = node.content.replaceChild(node.childCount - 1, closeRight(node.lastChild, depth - 1));
    var fill = node.contentMatchAt(node.childCount).fillBefore(Fragment.empty, true);
    return node.copy(fragment.append(fill))
  }

  function closeRange(fragment, side, from, to, depth, openEnd) {
    var node = side < 0 ? fragment.firstChild : fragment.lastChild, inner = node.content;
    if (depth < to - 1) { inner = closeRange(inner, side, from, to, depth + 1, openEnd); }
    if (depth >= from)
      { inner = side < 0 ? node.contentMatchAt(0).fillBefore(inner, fragment.childCount > 1 || openEnd <= depth).append(inner)
        : inner.append(node.contentMatchAt(node.childCount).fillBefore(Fragment.empty, true)); }
    return fragment.replaceChild(side < 0 ? 0 : fragment.childCount - 1, node.copy(inner))
  }

  function closeSlice(slice, openStart, openEnd) {
    if (openStart < slice.openStart)
      { slice = new Slice(closeRange(slice.content, -1, openStart, slice.openStart, 0, slice.openEnd), openStart, slice.openEnd); }
    if (openEnd < slice.openEnd)
      { slice = new Slice(closeRange(slice.content, 1, openEnd, slice.openEnd, 0, 0), slice.openStart, openEnd); }
    return slice
  }

  // Trick from jQuery -- some elements must be wrapped in other
  // elements for innerHTML to work. I.e. if you do `div.innerHTML =
  // "<td>..</td>"` the table cells are ignored.
  var wrapMap = {
    thead: ["table"],
    tbody: ["table"],
    tfoot: ["table"],
    caption: ["table"],
    colgroup: ["table"],
    col: ["table", "colgroup"],
    tr: ["table", "tbody"],
    td: ["table", "tbody", "tr"],
    th: ["table", "tbody", "tr"]
  };

  var _detachedDoc = null;
  function detachedDoc() {
    return _detachedDoc || (_detachedDoc = document.implementation.createHTMLDocument("title"))
  }

  function readHTML(html) {
    var metas = /^(\s*<meta [^>]*>)*/.exec(html);
    if (metas) { html = html.slice(metas[0].length); }
    var elt = detachedDoc().createElement("div");
    var firstTag = /<([a-z][^>\s]+)/i.exec(html), wrap;
    if (wrap = firstTag && wrapMap[firstTag[1].toLowerCase()])
      { html = wrap.map(function (n) { return "<" + n + ">"; }).join("") + html + wrap.map(function (n) { return "</" + n + ">"; }).reverse().join(""); }
    elt.innerHTML = html;
    if (wrap) { for (var i = 0; i < wrap.length; i++) { elt = elt.querySelector(wrap[i]) || elt; } }
    return elt
  }

  function addContext(slice, context) {
    if (!slice.size) { return slice }
    var schema = slice.content.firstChild.type.schema, array;
    try { array = JSON.parse(context); }
    catch(e) { return slice }
    var content = slice.content;
    var openStart = slice.openStart;
    var openEnd = slice.openEnd;
    for (var i = array.length - 2; i >= 0; i -= 2) {
      var type = schema.nodes[array[i]];
      if (!type || type.hasRequiredAttrs()) { break }
      content = Fragment.from(type.create(array[i + 1], content));
      openStart++; openEnd++;
    }
    return new Slice(content, openStart, openEnd)
  }

  var observeOptions = {
    childList: true,
    characterData: true,
    characterDataOldValue: true,
    attributes: true,
    attributeOldValue: true,
    subtree: true
  };
  // IE11 has very broken mutation observers, so we also listen to DOMCharacterDataModified
  var useCharData = result.ie && result.ie_version <= 11;

  var SelectionState = function SelectionState() {
    this.anchorNode = this.anchorOffset = this.focusNode = this.focusOffset = null;
  };

  SelectionState.prototype.set = function set (sel) {
    this.anchorNode = sel.anchorNode; this.anchorOffset = sel.anchorOffset;
    this.focusNode = sel.focusNode; this.focusOffset = sel.focusOffset;
  };

  SelectionState.prototype.eq = function eq (sel) {
    return sel.anchorNode == this.anchorNode && sel.anchorOffset == this.anchorOffset &&
      sel.focusNode == this.focusNode && sel.focusOffset == this.focusOffset
  };

  var DOMObserver = function DOMObserver(view, handleDOMChange) {
    var this$1 = this;

    this.view = view;
    this.handleDOMChange = handleDOMChange;
    this.queue = [];
    this.flushingSoon = -1;
    this.observer = window.MutationObserver &&
      new window.MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i++) { this$1.queue.push(mutations[i]); }
        // IE11 will sometimes (on backspacing out a single character
        // text node after a BR node) call the observer callback
        // before actually updating the DOM, which will cause
        // ProseMirror to miss the change (see #930)
        if (result.ie && result.ie_version <= 11 && mutations.some(
          function (m) { return m.type == "childList" && m.removedNodes.length ||
               m.type == "characterData" && m.oldValue.length > m.target.nodeValue.length; }))
          { this$1.flushSoon(); }
        else
          { this$1.flush(); }
      });
    this.currentSelection = new SelectionState;
    if (useCharData) {
      this.onCharData = function (e) {
        this$1.queue.push({target: e.target, type: "characterData", oldValue: e.prevValue});
        this$1.flushSoon();
      };
    }
    this.onSelectionChange = this.onSelectionChange.bind(this);
    this.suppressingSelectionUpdates = false;
  };

  DOMObserver.prototype.flushSoon = function flushSoon () {
      var this$1 = this;

    if (this.flushingSoon < 0)
      { this.flushingSoon = window.setTimeout(function () { this$1.flushingSoon = -1; this$1.flush(); }, 20); }
  };

  DOMObserver.prototype.forceFlush = function forceFlush () {
    if (this.flushingSoon > -1) {
      window.clearTimeout(this.flushingSoon);
      this.flushingSoon = -1;
      this.flush();
    }
  };

  DOMObserver.prototype.start = function start () {
    if (this.observer)
      { this.observer.observe(this.view.dom, observeOptions); }
    if (useCharData)
      { this.view.dom.addEventListener("DOMCharacterDataModified", this.onCharData); }
    this.connectSelection();
  };

  DOMObserver.prototype.stop = function stop () {
      var this$1 = this;

    if (this.observer) {
      var take = this.observer.takeRecords();
      if (take.length) {
        for (var i = 0; i < take.length; i++) { this.queue.push(take[i]); }
        window.setTimeout(function () { return this$1.flush(); }, 20);
      }
      this.observer.disconnect();
    }
    if (useCharData) { this.view.dom.removeEventListener("DOMCharacterDataModified", this.onCharData); }
    this.disconnectSelection();
  };

  DOMObserver.prototype.connectSelection = function connectSelection () {
    this.view.dom.ownerDocument.addEventListener("selectionchange", this.onSelectionChange);
  };

  DOMObserver.prototype.disconnectSelection = function disconnectSelection () {
    this.view.dom.ownerDocument.removeEventListener("selectionchange", this.onSelectionChange);
  };

  DOMObserver.prototype.suppressSelectionUpdates = function suppressSelectionUpdates () {
      var this$1 = this;

    this.suppressingSelectionUpdates = true;
    setTimeout(function () { return this$1.suppressingSelectionUpdates = false; }, 50);
  };

  DOMObserver.prototype.onSelectionChange = function onSelectionChange () {
    if (!hasFocusAndSelection(this.view)) { return }
    if (this.suppressingSelectionUpdates) { return selectionToDOM(this.view) }
    // Deletions on IE11 fire their events in the wrong order, giving
    // us a selection change event before the DOM changes are
    // reported.
    if (result.ie && result.ie_version <= 11 && !this.view.state.selection.empty) {
      var sel = this.view.root.getSelection();
      // Selection.isCollapsed isn't reliable on IE
      if (sel.focusNode && isEquivalentPosition(sel.focusNode, sel.focusOffset, sel.anchorNode, sel.anchorOffset))
        { return this.flushSoon() }
    }
    this.flush();
  };

  DOMObserver.prototype.setCurSelection = function setCurSelection () {
    this.currentSelection.set(this.view.root.getSelection());
  };

  DOMObserver.prototype.ignoreSelectionChange = function ignoreSelectionChange (sel) {
    if (sel.rangeCount == 0) { return true }
    var container = sel.getRangeAt(0).commonAncestorContainer;
    var desc = this.view.docView.nearestDesc(container);
    if (desc && desc.ignoreMutation({type: "selection", target: container.nodeType == 3 ? container.parentNode : container})) {
      this.setCurSelection();
      return true
    }
  };

  DOMObserver.prototype.flush = function flush () {
    if (!this.view.docView || this.flushingSoon > -1) { return }
    var mutations = this.observer ? this.observer.takeRecords() : [];
    if (this.queue.length) {
      mutations = this.queue.concat(mutations);
      this.queue.length = 0;
    }

    var sel = this.view.root.getSelection();
    var newSel = !this.suppressingSelectionUpdates && !this.currentSelection.eq(sel) && hasSelection(this.view) && !this.ignoreSelectionChange(sel);

    var from = -1, to = -1, typeOver = false, added = [];
    if (this.view.editable) {
      for (var i = 0; i < mutations.length; i++) {
        var result$1 = this.registerMutation(mutations[i], added);
        if (result$1) {
          from = from < 0 ? result$1.from : Math.min(result$1.from, from);
          to = to < 0 ? result$1.to : Math.max(result$1.to, to);
          if (result$1.typeOver) { typeOver = true; }
        }
      }
    }

    if (result.gecko && added.length > 1) {
      var brs = added.filter(function (n) { return n.nodeName == "BR"; });
      if (brs.length == 2) {
        var a = brs[0];
          var b = brs[1];
        if (a.parentNode && a.parentNode.parentNode == b.parentNode) { b.remove(); }
        else { a.remove(); }
      }
    }

    if (from > -1 || newSel) {
      if (from > -1) {
        this.view.docView.markDirty(from, to);
        checkCSS(this.view);
      }
      this.handleDOMChange(from, to, typeOver, added);
      if (this.view.docView.dirty) { this.view.updateState(this.view.state); }
      else if (!this.currentSelection.eq(sel)) { selectionToDOM(this.view); }
      this.currentSelection.set(sel);
    }
  };

  DOMObserver.prototype.registerMutation = function registerMutation (mut, added) {
    // Ignore mutations inside nodes that were already noted as inserted
    if (added.indexOf(mut.target) > -1) { return null }
    var desc = this.view.docView.nearestDesc(mut.target);
    if (mut.type == "attributes" &&
        (desc == this.view.docView || mut.attributeName == "contenteditable" ||
         // Firefox sometimes fires spurious events for null/empty styles
         (mut.attributeName == "style" && !mut.oldValue && !mut.target.getAttribute("style"))))
      { return null }
    if (!desc || desc.ignoreMutation(mut)) { return null }

    if (mut.type == "childList") {
      for (var i = 0; i < mut.addedNodes.length; i++) { added.push(mut.addedNodes[i]); }
      if (desc.contentDOM && desc.contentDOM != desc.dom && !desc.contentDOM.contains(mut.target))
        { return {from: desc.posBefore, to: desc.posAfter} }
      var prev = mut.previousSibling, next = mut.nextSibling;
      if (result.ie && result.ie_version <= 11 && mut.addedNodes.length) {
        // IE11 gives us incorrect next/prev siblings for some
        // insertions, so if there are added nodes, recompute those
        for (var i$1 = 0; i$1 < mut.addedNodes.length; i$1++) {
          var ref = mut.addedNodes[i$1];
            var previousSibling = ref.previousSibling;
            var nextSibling = ref.nextSibling;
          if (!previousSibling || Array.prototype.indexOf.call(mut.addedNodes, previousSibling) < 0) { prev = previousSibling; }
          if (!nextSibling || Array.prototype.indexOf.call(mut.addedNodes, nextSibling) < 0) { next = nextSibling; }
        }
      }
      var fromOffset = prev && prev.parentNode == mut.target
          ? domIndex(prev) + 1 : 0;
      var from = desc.localPosFromDOM(mut.target, fromOffset, -1);
      var toOffset = next && next.parentNode == mut.target
          ? domIndex(next) : mut.target.childNodes.length;
      var to = desc.localPosFromDOM(mut.target, toOffset, 1);
      return {from: from, to: to}
    } else if (mut.type == "attributes") {
      return {from: desc.posAtStart - desc.border, to: desc.posAtEnd + desc.border}
    } else { // "characterData"
      return {
        from: desc.posAtStart,
        to: desc.posAtEnd,
        // An event was generated for a text change that didn't change
        // any text. Mark the dom change to fall back to assuming the
        // selection was typed over with an identical value if it can't
        // find another change.
        typeOver: mut.target.nodeValue == mut.oldValue
      }
    }
  };

  var cssChecked = false;

  function checkCSS(view) {
    if (cssChecked) { return }
    cssChecked = true;
    if (getComputedStyle(view.dom).whiteSpace == "normal")
      { console["warn"]("ProseMirror expects the CSS white-space property to be set, preferably to 'pre-wrap'. It is recommended to load style/prosemirror.css from the prosemirror-view package."); }
  }

  // A collection of DOM events that occur within the editor, and callback functions
  // to invoke when the event fires.
  var handlers = {}, editHandlers = {};

  function initInput(view) {
    view.shiftKey = false;
    view.mouseDown = null;
    view.lastKeyCode = null;
    view.lastKeyCodeTime = 0;
    view.lastClick = {time: 0, x: 0, y: 0, type: ""};
    view.lastSelectionOrigin = null;
    view.lastSelectionTime = 0;

    view.lastIOSEnter = 0;
    view.lastIOSEnterFallbackTimeout = null;
    view.lastAndroidDelete = 0;

    view.composing = false;
    view.composingTimeout = null;
    view.compositionNodes = [];
    view.compositionEndedAt = -2e8;

    view.domObserver = new DOMObserver(view, function (from, to, typeOver, added) { return readDOMChange(view, from, to, typeOver, added); });
    view.domObserver.start();
    // Used by hacks like the beforeinput handler to check whether anything happened in the DOM
    view.domChangeCount = 0;

    view.eventHandlers = Object.create(null);
    var loop = function ( event ) {
      var handler = handlers[event];
      view.dom.addEventListener(event, view.eventHandlers[event] = function (event) {
        if (eventBelongsToView(view, event) && !runCustomHandler(view, event) &&
            (view.editable || !(event.type in editHandlers)))
          { handler(view, event); }
      });
    };

    for (var event in handlers) loop( event );
    // On Safari, for reasons beyond my understanding, adding an input
    // event handler makes an issue where the composition vanishes when
    // you press enter go away.
    if (result.safari) { view.dom.addEventListener("input", function () { return null; }); }

    ensureListeners(view);
  }

  function setSelectionOrigin(view, origin) {
    view.lastSelectionOrigin = origin;
    view.lastSelectionTime = Date.now();
  }

  function destroyInput(view) {
    view.domObserver.stop();
    for (var type in view.eventHandlers)
      { view.dom.removeEventListener(type, view.eventHandlers[type]); }
    clearTimeout(view.composingTimeout);
    clearTimeout(view.lastIOSEnterFallbackTimeout);
  }

  function ensureListeners(view) {
    view.someProp("handleDOMEvents", function (currentHandlers) {
      for (var type in currentHandlers) { if (!view.eventHandlers[type])
        { view.dom.addEventListener(type, view.eventHandlers[type] = function (event) { return runCustomHandler(view, event); }); } }
    });
  }

  function runCustomHandler(view, event) {
    return view.someProp("handleDOMEvents", function (handlers) {
      var handler = handlers[event.type];
      return handler ? handler(view, event) || event.defaultPrevented : false
    })
  }

  function eventBelongsToView(view, event) {
    if (!event.bubbles) { return true }
    if (event.defaultPrevented) { return false }
    for (var node = event.target; node != view.dom; node = node.parentNode)
      { if (!node || node.nodeType == 11 ||
          (node.pmViewDesc && node.pmViewDesc.stopEvent(event)))
        { return false } }
    return true
  }

  function dispatchEvent(view, event) {
    if (!runCustomHandler(view, event) && handlers[event.type] &&
        (view.editable || !(event.type in editHandlers)))
      { handlers[event.type](view, event); }
  }

  editHandlers.keydown = function (view, event) {
    view.shiftKey = event.keyCode == 16 || event.shiftKey;
    if (inOrNearComposition(view, event)) { return }
    view.domObserver.forceFlush();
    view.lastKeyCode = event.keyCode;
    view.lastKeyCodeTime = Date.now();
    // On iOS, if we preventDefault enter key presses, the virtual
    // keyboard gets confused. So the hack here is to set a flag that
    // makes the DOM change code recognize that what just happens should
    // be replaced by whatever the Enter key handlers do.
    if (result.ios && event.keyCode == 13 && !event.ctrlKey && !event.altKey && !event.metaKey) {
      var now = Date.now();
      view.lastIOSEnter = now;
      view.lastIOSEnterFallbackTimeout = setTimeout(function () {
        if (view.lastIOSEnter == now) {
          view.someProp("handleKeyDown", function (f) { return f(view, keyEvent(13, "Enter")); });
          view.lastIOSEnter = 0;
        }
      }, 200);
    } else if (view.someProp("handleKeyDown", function (f) { return f(view, event); }) || captureKeyDown(view, event)) {
      event.preventDefault();
    } else {
      setSelectionOrigin(view, "key");
    }
  };

  editHandlers.keyup = function (view, e) {
    if (e.keyCode == 16) { view.shiftKey = false; }
  };

  editHandlers.keypress = function (view, event) {
    if (inOrNearComposition(view, event) || !event.charCode ||
        event.ctrlKey && !event.altKey || result.mac && event.metaKey) { return }

    if (view.someProp("handleKeyPress", function (f) { return f(view, event); })) {
      event.preventDefault();
      return
    }

    var sel = view.state.selection;
    if (!(sel instanceof TextSelection) || !sel.$from.sameParent(sel.$to)) {
      var text = String.fromCharCode(event.charCode);
      if (!view.someProp("handleTextInput", function (f) { return f(view, sel.$from.pos, sel.$to.pos, text); }))
        { view.dispatch(view.state.tr.insertText(text).scrollIntoView()); }
      event.preventDefault();
    }
  };

  function eventCoords(event) { return {left: event.clientX, top: event.clientY} }

  function isNear(event, click) {
    var dx = click.x - event.clientX, dy = click.y - event.clientY;
    return dx * dx + dy * dy < 100
  }

  function runHandlerOnContext(view, propName, pos, inside, event) {
    if (inside == -1) { return false }
    var $pos = view.state.doc.resolve(inside);
    var loop = function ( i ) {
      if (view.someProp(propName, function (f) { return i > $pos.depth ? f(view, pos, $pos.nodeAfter, $pos.before(i), event, true)
                                                      : f(view, pos, $pos.node(i), $pos.before(i), event, false); }))
        { return { v: true } }
    };

    for (var i = $pos.depth + 1; i > 0; i--) {
      var returned = loop( i );

      if ( returned ) return returned.v;
    }
    return false
  }

  function updateSelection(view, selection, origin) {
    if (!view.focused) { view.focus(); }
    var tr = view.state.tr.setSelection(selection);
    if (origin == "pointer") { tr.setMeta("pointer", true); }
    view.dispatch(tr);
  }

  function selectClickedLeaf(view, inside) {
    if (inside == -1) { return false }
    var $pos = view.state.doc.resolve(inside), node = $pos.nodeAfter;
    if (node && node.isAtom && NodeSelection.isSelectable(node)) {
      updateSelection(view, new NodeSelection($pos), "pointer");
      return true
    }
    return false
  }

  function selectClickedNode(view, inside) {
    if (inside == -1) { return false }
    var sel = view.state.selection, selectedNode, selectAt;
    if (sel instanceof NodeSelection) { selectedNode = sel.node; }

    var $pos = view.state.doc.resolve(inside);
    for (var i = $pos.depth + 1; i > 0; i--) {
      var node = i > $pos.depth ? $pos.nodeAfter : $pos.node(i);
      if (NodeSelection.isSelectable(node)) {
        if (selectedNode && sel.$from.depth > 0 &&
            i >= sel.$from.depth && $pos.before(sel.$from.depth + 1) == sel.$from.pos)
          { selectAt = $pos.before(sel.$from.depth); }
        else
          { selectAt = $pos.before(i); }
        break
      }
    }

    if (selectAt != null) {
      updateSelection(view, NodeSelection.create(view.state.doc, selectAt), "pointer");
      return true
    } else {
      return false
    }
  }

  function handleSingleClick(view, pos, inside, event, selectNode) {
    return runHandlerOnContext(view, "handleClickOn", pos, inside, event) ||
      view.someProp("handleClick", function (f) { return f(view, pos, event); }) ||
      (selectNode ? selectClickedNode(view, inside) : selectClickedLeaf(view, inside))
  }

  function handleDoubleClick(view, pos, inside, event) {
    return runHandlerOnContext(view, "handleDoubleClickOn", pos, inside, event) ||
      view.someProp("handleDoubleClick", function (f) { return f(view, pos, event); })
  }

  function handleTripleClick(view, pos, inside, event) {
    return runHandlerOnContext(view, "handleTripleClickOn", pos, inside, event) ||
      view.someProp("handleTripleClick", function (f) { return f(view, pos, event); }) ||
      defaultTripleClick(view, inside)
  }

  function defaultTripleClick(view, inside) {
    var doc = view.state.doc;
    if (inside == -1) {
      if (doc.inlineContent) {
        updateSelection(view, TextSelection.create(doc, 0, doc.content.size), "pointer");
        return true
      }
      return false
    }

    var $pos = doc.resolve(inside);
    for (var i = $pos.depth + 1; i > 0; i--) {
      var node = i > $pos.depth ? $pos.nodeAfter : $pos.node(i);
      var nodePos = $pos.before(i);
      if (node.inlineContent)
        { updateSelection(view, TextSelection.create(doc, nodePos + 1, nodePos + 1 + node.content.size), "pointer"); }
      else if (NodeSelection.isSelectable(node))
        { updateSelection(view, NodeSelection.create(doc, nodePos), "pointer"); }
      else
        { continue }
      return true
    }
  }

  function forceDOMFlush(view) {
    return endComposition(view)
  }

  var selectNodeModifier = result.mac ? "metaKey" : "ctrlKey";

  handlers.mousedown = function (view, event) {
    view.shiftKey = event.shiftKey;
    var flushed = forceDOMFlush(view);
    var now = Date.now(), type = "singleClick";
    if (now - view.lastClick.time < 500 && isNear(event, view.lastClick) && !event[selectNodeModifier]) {
      if (view.lastClick.type == "singleClick") { type = "doubleClick"; }
      else if (view.lastClick.type == "doubleClick") { type = "tripleClick"; }
    }
    view.lastClick = {time: now, x: event.clientX, y: event.clientY, type: type};

    var pos = view.posAtCoords(eventCoords(event));
    if (!pos) { return }

    if (type == "singleClick") {
      if (view.mouseDown) { view.mouseDown.done(); }
      view.mouseDown = new MouseDown(view, pos, event, flushed);
    } else if ((type == "doubleClick" ? handleDoubleClick : handleTripleClick)(view, pos.pos, pos.inside, event)) {
      event.preventDefault();
    } else {
      setSelectionOrigin(view, "pointer");
    }
  };

  var MouseDown = function MouseDown(view, pos, event, flushed) {
    var this$1 = this;

    this.view = view;
    this.startDoc = view.state.doc;
    this.pos = pos;
    this.event = event;
    this.flushed = flushed;
    this.selectNode = event[selectNodeModifier];
    this.allowDefault = event.shiftKey;

    var targetNode, targetPos;
    if (pos.inside > -1) {
      targetNode = view.state.doc.nodeAt(pos.inside);
      targetPos = pos.inside;
    } else {
      var $pos = view.state.doc.resolve(pos.pos);
      targetNode = $pos.parent;
      targetPos = $pos.depth ? $pos.before() : 0;
    }

    this.mightDrag = null;

    var target = flushed ? null : event.target;
    var targetDesc = target ? view.docView.nearestDesc(target, true) : null;
    this.target = targetDesc ? targetDesc.dom : null;

    if (targetNode.type.spec.draggable && targetNode.type.spec.selectable !== false ||
        view.state.selection instanceof NodeSelection && targetPos == view.state.selection.from)
      { this.mightDrag = {node: targetNode,
                        pos: targetPos,
                        addAttr: this.target && !this.target.draggable,
                        setUneditable: this.target && result.gecko && !this.target.hasAttribute("contentEditable")}; }

    if (this.target && this.mightDrag && (this.mightDrag.addAttr || this.mightDrag.setUneditable)) {
      this.view.domObserver.stop();
      if (this.mightDrag.addAttr) { this.target.draggable = true; }
      if (this.mightDrag.setUneditable)
        { setTimeout(function () {
          if (this$1.view.mouseDown == this$1) { this$1.target.setAttribute("contentEditable", "false"); }
        }, 20); }
      this.view.domObserver.start();
    }

    view.root.addEventListener("mouseup", this.up = this.up.bind(this));
    view.root.addEventListener("mousemove", this.move = this.move.bind(this));
    setSelectionOrigin(view, "pointer");
  };

  MouseDown.prototype.done = function done () {
    this.view.root.removeEventListener("mouseup", this.up);
    this.view.root.removeEventListener("mousemove", this.move);
    if (this.mightDrag && this.target) {
      this.view.domObserver.stop();
      if (this.mightDrag.addAttr) { this.target.removeAttribute("draggable"); }
      if (this.mightDrag.setUneditable) { this.target.removeAttribute("contentEditable"); }
      this.view.domObserver.start();
    }
    this.view.mouseDown = null;
  };

  MouseDown.prototype.up = function up (event) {
    this.done();

    if (!this.view.dom.contains(event.target.nodeType == 3 ? event.target.parentNode : event.target))
      { return }

    var pos = this.pos;
    if (this.view.state.doc != this.startDoc) { pos = this.view.posAtCoords(eventCoords(event)); }

    if (this.allowDefault || !pos) {
      setSelectionOrigin(this.view, "pointer");
    } else if (handleSingleClick(this.view, pos.pos, pos.inside, event, this.selectNode)) {
      event.preventDefault();
    } else if (this.flushed ||
               // Safari ignores clicks on draggable elements
               (result.safari && this.mightDrag && !this.mightDrag.node.isAtom) ||
               // Chrome will sometimes treat a node selection as a
               // cursor, but still report that the node is selected
               // when asked through getSelection. You'll then get a
               // situation where clicking at the point where that
               // (hidden) cursor is doesn't change the selection, and
               // thus doesn't get a reaction from ProseMirror. This
               // works around that.
               (result.chrome && !(this.view.state.selection instanceof TextSelection) &&
                (pos.pos == this.view.state.selection.from || pos.pos == this.view.state.selection.to))) {
      updateSelection(this.view, Selection.near(this.view.state.doc.resolve(pos.pos)), "pointer");
      event.preventDefault();
    } else {
      setSelectionOrigin(this.view, "pointer");
    }
  };

  MouseDown.prototype.move = function move (event) {
    if (!this.allowDefault && (Math.abs(this.event.x - event.clientX) > 4 ||
                               Math.abs(this.event.y - event.clientY) > 4))
      { this.allowDefault = true; }
    setSelectionOrigin(this.view, "pointer");
    if (event.buttons == 0) { this.done(); }
  };

  handlers.touchdown = function (view) {
    forceDOMFlush(view);
    setSelectionOrigin(view, "pointer");
  };

  handlers.contextmenu = function (view) { return forceDOMFlush(view); };

  function inOrNearComposition(view, event) {
    if (view.composing) { return true }
    // See https://www.stum.de/2016/06/24/handling-ime-events-in-javascript/.
    // On Japanese input method editors (IMEs), the Enter key is used to confirm character
    // selection. On Safari, when Enter is pressed, compositionend and keydown events are
    // emitted. The keydown event triggers newline insertion, which we don't want.
    // This method returns true if the keydown event should be ignored.
    // We only ignore it once, as pressing Enter a second time *should* insert a newline.
    // Furthermore, the keydown event timestamp must be close to the compositionEndedAt timestamp.
    // This guards against the case where compositionend is triggered without the keyboard
    // (e.g. character confirmation may be done with the mouse), and keydown is triggered
    // afterwards- we wouldn't want to ignore the keydown event in this case.
    if (result.safari && Math.abs(event.timeStamp - view.compositionEndedAt) < 500) {
      view.compositionEndedAt = -2e8;
      return true
    }
    return false
  }

  // Drop active composition after 5 seconds of inactivity on Android
  var timeoutComposition = result.android ? 5000 : -1;

  editHandlers.compositionstart = editHandlers.compositionupdate = function (view) {
    if (!view.composing) {
      view.domObserver.flush();
      var state = view.state;
      var $pos = state.selection.$from;
      if (state.selection.empty &&
          (state.storedMarks ||
           (!$pos.textOffset && $pos.parentOffset && $pos.nodeBefore.marks.some(function (m) { return m.type.spec.inclusive === false; })))) {
        // Need to wrap the cursor in mark nodes different from the ones in the DOM context
        view.markCursor = view.state.storedMarks || $pos.marks();
        endComposition(view, true);
        view.markCursor = null;
      } else {
        endComposition(view);
        // In firefox, if the cursor is after but outside a marked node,
        // the inserted text won't inherit the marks. So this moves it
        // inside if necessary.
        if (result.gecko && state.selection.empty && $pos.parentOffset && !$pos.textOffset && $pos.nodeBefore.marks.length) {
          var sel = view.root.getSelection();
          for (var node = sel.focusNode, offset = sel.focusOffset; node && node.nodeType == 1 && offset != 0;) {
            var before = offset < 0 ? node.lastChild : node.childNodes[offset - 1];
            if (!before) { break }
            if (before.nodeType == 3) {
              sel.collapse(before, before.nodeValue.length);
              break
            } else {
              node = before;
              offset = -1;
            }
          }
        }
      }
      view.composing = true;
    }
    scheduleComposeEnd(view, timeoutComposition);
  };

  editHandlers.compositionend = function (view, event) {
    if (view.composing) {
      view.composing = false;
      view.compositionEndedAt = event.timeStamp;
      scheduleComposeEnd(view, 20);
    }
  };

  function scheduleComposeEnd(view, delay) {
    clearTimeout(view.composingTimeout);
    if (delay > -1) { view.composingTimeout = setTimeout(function () { return endComposition(view); }, delay); }
  }

  function clearComposition(view) {
    view.composing = false;
    while (view.compositionNodes.length > 0) { view.compositionNodes.pop().markParentsDirty(); }
  }

  function endComposition(view, forceUpdate) {
    view.domObserver.forceFlush();
    clearComposition(view);
    if (forceUpdate || view.docView.dirty) {
      var sel = selectionFromDOM(view);
      if (sel && !sel.eq(view.state.selection)) { view.dispatch(view.state.tr.setSelection(sel)); }
      else { view.updateState(view.state); }
      return true
    }
    return false
  }

  function captureCopy(view, dom) {
    // The extra wrapper is somehow necessary on IE/Edge to prevent the
    // content from being mangled when it is put onto the clipboard
    if (!view.dom.parentNode) { return }
    var wrap = view.dom.parentNode.appendChild(document.createElement("div"));
    wrap.appendChild(dom);
    wrap.style.cssText = "position: fixed; left: -10000px; top: 10px";
    var sel = getSelection(), range = document.createRange();
    range.selectNodeContents(dom);
    // Done because IE will fire a selectionchange moving the selection
    // to its start when removeAllRanges is called and the editor still
    // has focus (which will mess up the editor's selection state).
    view.dom.blur();
    sel.removeAllRanges();
    sel.addRange(range);
    setTimeout(function () {
      if (wrap.parentNode) { wrap.parentNode.removeChild(wrap); }
      view.focus();
    }, 50);
  }

  // This is very crude, but unfortunately both these browsers _pretend_
  // that they have a clipboard API—all the objects and methods are
  // there, they just don't work, and they are hard to test.
  var brokenClipboardAPI = (result.ie && result.ie_version < 15) ||
        (result.ios && result.webkit_version < 604);

  handlers.copy = editHandlers.cut = function (view, e) {
    var sel = view.state.selection, cut = e.type == "cut";
    if (sel.empty) { return }

    // IE and Edge's clipboard interface is completely broken
    var data = brokenClipboardAPI ? null : e.clipboardData;
    var slice = sel.content();
    var ref = serializeForClipboard(view, slice);
    var dom = ref.dom;
    var text = ref.text;
    if (data) {
      e.preventDefault();
      data.clearData();
      data.setData("text/html", dom.innerHTML);
      data.setData("text/plain", text);
    } else {
      captureCopy(view, dom);
    }
    if (cut) { view.dispatch(view.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut")); }
  };

  function sliceSingleNode(slice) {
    return slice.openStart == 0 && slice.openEnd == 0 && slice.content.childCount == 1 ? slice.content.firstChild : null
  }

  function capturePaste(view, e) {
    if (!view.dom.parentNode) { return }
    var plainText = view.shiftKey || view.state.selection.$from.parent.type.spec.code;
    var target = view.dom.parentNode.appendChild(document.createElement(plainText ? "textarea" : "div"));
    if (!plainText) { target.contentEditable = "true"; }
    target.style.cssText = "position: fixed; left: -10000px; top: 10px";
    target.focus();
    setTimeout(function () {
      view.focus();
      if (target.parentNode) { target.parentNode.removeChild(target); }
      if (plainText) { doPaste(view, target.value, null, e); }
      else { doPaste(view, target.textContent, target.innerHTML, e); }
    }, 50);
  }

  function doPaste(view, text, html, e) {
    var slice = parseFromClipboard(view, text, html, view.shiftKey, view.state.selection.$from);
    if (view.someProp("handlePaste", function (f) { return f(view, e, slice || Slice.empty); })) { return true }
    if (!slice) { return false }

    var singleNode = sliceSingleNode(slice);
    var tr = singleNode ? view.state.tr.replaceSelectionWith(singleNode, view.shiftKey) : view.state.tr.replaceSelection(slice);
    view.dispatch(tr.scrollIntoView().setMeta("paste", true).setMeta("uiEvent", "paste"));
    return true
  }

  editHandlers.paste = function (view, e) {
    var data = brokenClipboardAPI ? null : e.clipboardData;
    if (data && doPaste(view, data.getData("text/plain"), data.getData("text/html"), e)) { e.preventDefault(); }
    else { capturePaste(view, e); }
  };

  var Dragging = function Dragging(slice, move) {
    this.slice = slice;
    this.move = move;
  };

  var dragCopyModifier = result.mac ? "altKey" : "ctrlKey";

  handlers.dragstart = function (view, e) {
    var mouseDown = view.mouseDown;
    if (mouseDown) { mouseDown.done(); }
    if (!e.dataTransfer) { return }

    var sel = view.state.selection;
    var pos = sel.empty ? null : view.posAtCoords(eventCoords(e));
    if (pos && pos.pos >= sel.from && pos.pos <= (sel instanceof NodeSelection ? sel.to - 1: sel.to)) ; else if (mouseDown && mouseDown.mightDrag) {
      view.dispatch(view.state.tr.setSelection(NodeSelection.create(view.state.doc, mouseDown.mightDrag.pos)));
    } else if (e.target && e.target.nodeType == 1) {
      var desc = view.docView.nearestDesc(e.target, true);
      if (!desc || !desc.node.type.spec.draggable || desc == view.docView) { return }
      view.dispatch(view.state.tr.setSelection(NodeSelection.create(view.state.doc, desc.posBefore)));
    }
    var slice = view.state.selection.content();
    var ref = serializeForClipboard(view, slice);
    var dom = ref.dom;
    var text = ref.text;
    e.dataTransfer.clearData();
    e.dataTransfer.setData(brokenClipboardAPI ? "Text" : "text/html", dom.innerHTML);
    // See https://github.com/ProseMirror/prosemirror/issues/1156
    e.dataTransfer.effectAllowed = "copyMove";
    if (!brokenClipboardAPI) { e.dataTransfer.setData("text/plain", text); }
    view.dragging = new Dragging(slice, !e[dragCopyModifier]);
  };

  handlers.dragend = function (view) {
    var dragging = view.dragging;
    window.setTimeout(function () {
      if (view.dragging == dragging)  { view.dragging = null; }
    }, 50);
  };

  editHandlers.dragover = editHandlers.dragenter = function (_, e) { return e.preventDefault(); };

  editHandlers.drop = function (view, e) {
    var dragging = view.dragging;
    view.dragging = null;

    if (!e.dataTransfer) { return }

    var eventPos = view.posAtCoords(eventCoords(e));
    if (!eventPos) { return }
    var $mouse = view.state.doc.resolve(eventPos.pos);
    if (!$mouse) { return }
    var slice = dragging && dragging.slice ||
        parseFromClipboard(view, e.dataTransfer.getData(brokenClipboardAPI ? "Text" : "text/plain"),
                           brokenClipboardAPI ? null : e.dataTransfer.getData("text/html"), false, $mouse);
    var move = dragging && !e[dragCopyModifier];
    if (view.someProp("handleDrop", function (f) { return f(view, e, slice || Slice.empty, move); })) {
      e.preventDefault();
      return
    }
    if (!slice) { return }

    e.preventDefault();
    var insertPos = slice ? dropPoint(view.state.doc, $mouse.pos, slice) : $mouse.pos;
    if (insertPos == null) { insertPos = $mouse.pos; }

    var tr = view.state.tr;
    if (move) { tr.deleteSelection(); }

    var pos = tr.mapping.map(insertPos);
    var isNode = slice.openStart == 0 && slice.openEnd == 0 && slice.content.childCount == 1;
    var beforeInsert = tr.doc;
    if (isNode)
      { tr.replaceRangeWith(pos, pos, slice.content.firstChild); }
    else
      { tr.replaceRange(pos, pos, slice); }
    if (tr.doc.eq(beforeInsert)) { return }

    var $pos = tr.doc.resolve(pos);
    if (isNode && NodeSelection.isSelectable(slice.content.firstChild) &&
        $pos.nodeAfter && $pos.nodeAfter.sameMarkup(slice.content.firstChild)) {
      tr.setSelection(new NodeSelection($pos));
    } else {
      var end = tr.mapping.map(insertPos);
      tr.mapping.maps[tr.mapping.maps.length - 1].forEach(function (_from, _to, _newFrom, newTo) { return end = newTo; });
      tr.setSelection(selectionBetween(view, $pos, tr.doc.resolve(end)));
    }
    view.focus();
    view.dispatch(tr.setMeta("uiEvent", "drop"));
  };

  handlers.focus = function (view) {
    if (!view.focused) {
      view.domObserver.stop();
      view.dom.classList.add("ProseMirror-focused");
      view.domObserver.start();
      view.focused = true;
      setTimeout(function () {
        if (view.docView && view.hasFocus() && !view.domObserver.currentSelection.eq(view.root.getSelection()))
          { selectionToDOM(view); }
      }, 20);
    }
  };

  handlers.blur = function (view) {
    if (view.focused) {
      view.domObserver.stop();
      view.dom.classList.remove("ProseMirror-focused");
      view.domObserver.start();
      view.domObserver.currentSelection.set({});
      view.focused = false;
    }
  };

  handlers.beforeinput = function (view, event) {
    // We should probably do more with beforeinput events, but support
    // is so spotty that I'm still waiting to see where they are going.

    // Very specific hack to deal with backspace sometimes failing on
    // Chrome Android when after an uneditable node.
    if (result.chrome && result.android && event.inputType == "deleteContentBackward") {
      var domChangeCount = view.domChangeCount;
      setTimeout(function () {
        if (view.domChangeCount != domChangeCount) { return } // Event already had some effect
        // This bug tends to close the virtual keyboard, so we refocus
        view.dom.blur();
        view.focus();
        if (view.someProp("handleKeyDown", function (f) { return f(view, keyEvent(8, "Backspace")); })) { return }
        var ref = view.state.selection;
        var $cursor = ref.$cursor;
        // Crude approximation of backspace behavior when no command handled it
        if ($cursor && $cursor.pos > 0) { view.dispatch(view.state.tr.delete($cursor.pos - 1, $cursor.pos).scrollIntoView()); }
      }, 50);
    }
  };

  // Make sure all handlers get registered
  for (var prop in editHandlers) { handlers[prop] = editHandlers[prop]; }

  function compareObjs(a, b) {
    if (a == b) { return true }
    for (var p in a) { if (a[p] !== b[p]) { return false } }
    for (var p$1 in b) { if (!(p$1 in a)) { return false } }
    return true
  }

  var WidgetType = function WidgetType(toDOM, spec) {
    this.spec = spec || noSpec;
    this.side = this.spec.side || 0;
    this.toDOM = toDOM;
  };

  WidgetType.prototype.map = function map (mapping, span, offset, oldOffset) {
    var ref = mapping.mapResult(span.from + oldOffset, this.side < 0 ? -1 : 1);
      var pos = ref.pos;
      var deleted = ref.deleted;
    return deleted ? null : new Decoration(pos - offset, pos - offset, this)
  };

  WidgetType.prototype.valid = function valid () { return true };

  WidgetType.prototype.eq = function eq (other) {
    return this == other ||
      (other instanceof WidgetType &&
       (this.spec.key && this.spec.key == other.spec.key ||
        this.toDOM == other.toDOM && compareObjs(this.spec, other.spec)))
  };

  var InlineType = function InlineType(attrs, spec) {
    this.spec = spec || noSpec;
    this.attrs = attrs;
  };

  InlineType.prototype.map = function map (mapping, span, offset, oldOffset) {
    var from = mapping.map(span.from + oldOffset, this.spec.inclusiveStart ? -1 : 1) - offset;
    var to = mapping.map(span.to + oldOffset, this.spec.inclusiveEnd ? 1 : -1) - offset;
    return from >= to ? null : new Decoration(from, to, this)
  };

  InlineType.prototype.valid = function valid (_, span) { return span.from < span.to };

  InlineType.prototype.eq = function eq (other) {
    return this == other ||
      (other instanceof InlineType && compareObjs(this.attrs, other.attrs) &&
       compareObjs(this.spec, other.spec))
  };

  InlineType.is = function is (span) { return span.type instanceof InlineType };

  var NodeType = function NodeType(attrs, spec) {
    this.spec = spec || noSpec;
    this.attrs = attrs;
  };

  NodeType.prototype.map = function map (mapping, span, offset, oldOffset) {
    var from = mapping.mapResult(span.from + oldOffset, 1);
    if (from.deleted) { return null }
    var to = mapping.mapResult(span.to + oldOffset, -1);
    if (to.deleted || to.pos <= from.pos) { return null }
    return new Decoration(from.pos - offset, to.pos - offset, this)
  };

  NodeType.prototype.valid = function valid (node, span) {
    var ref = node.content.findIndex(span.from);
      var index = ref.index;
      var offset = ref.offset;
    return offset == span.from && offset + node.child(index).nodeSize == span.to
  };

  NodeType.prototype.eq = function eq (other) {
    return this == other ||
      (other instanceof NodeType && compareObjs(this.attrs, other.attrs) &&
       compareObjs(this.spec, other.spec))
  };

  // ::- Decoration objects can be provided to the view through the
  // [`decorations` prop](#view.EditorProps.decorations). They come in
  // several variants—see the static members of this class for details.
  var Decoration = function Decoration(from, to, type) {
    // :: number
    // The start position of the decoration.
    this.from = from;
    // :: number
    // The end position. Will be the same as `from` for [widget
    // decorations](#view.Decoration^widget).
    this.to = to;
    this.type = type;
  };

  var prototypeAccessors$1 = { spec: { configurable: true },inline: { configurable: true } };

  Decoration.prototype.copy = function copy (from, to) {
    return new Decoration(from, to, this.type)
  };

  Decoration.prototype.eq = function eq (other, offset) {
      if ( offset === void 0 ) offset = 0;

    return this.type.eq(other.type) && this.from + offset == other.from && this.to + offset == other.to
  };

  Decoration.prototype.map = function map (mapping, offset, oldOffset) {
    return this.type.map(mapping, this, offset, oldOffset)
  };

  // :: (number, union<(view: EditorView, getPos: () → number) → dom.Node, dom.Node>, ?Object) → Decoration
  // Creates a widget decoration, which is a DOM node that's shown in
  // the document at the given position. It is recommended that you
  // delay rendering the widget by passing a function that will be
  // called when the widget is actually drawn in a view, but you can
  // also directly pass a DOM node. `getPos` can be used to find the
  // widget's current document position.
  //
  // spec::- These options are supported:
  //
  //   side:: ?number
  //   Controls which side of the document position this widget is
  //   associated with. When negative, it is drawn before a cursor
  //   at its position, and content inserted at that position ends
  //   up after the widget. When zero (the default) or positive, the
  //   widget is drawn after the cursor and content inserted there
  //   ends up before the widget.
  //
  //   When there are multiple widgets at a given position, their
  //   `side` values determine the order in which they appear. Those
  //   with lower values appear first. The ordering of widgets with
  //   the same `side` value is unspecified.
  //
  //   When `marks` is null, `side` also determines the marks that
  //   the widget is wrapped in—those of the node before when
  //   negative, those of the node after when positive.
  //
  //   marks:: ?[Mark]
  //   The precise set of marks to draw around the widget.
  //
  //   stopEvent:: ?(event: dom.Event) → bool
  //   Can be used to control which DOM events, when they bubble out
  //   of this widget, the editor view should ignore.
  //
  //   ignoreSelection:: ?bool
  //   When set (defaults to false), selection changes inside the
  //   widget are ignored, and don't cause ProseMirror to try and
  //   re-sync the selection with its selection state.
  //
  //   key:: ?string
  //   When comparing decorations of this type (in order to decide
  //   whether it needs to be redrawn), ProseMirror will by default
  //   compare the widget DOM node by identity. If you pass a key,
  //   that key will be compared instead, which can be useful when
  //   you generate decorations on the fly and don't want to store
  //   and reuse DOM nodes. Make sure that any widgets with the same
  //   key are interchangeable—if widgets differ in, for example,
  //   the behavior of some event handler, they should get
  //   different keys.
  Decoration.widget = function widget (pos, toDOM, spec) {
    return new Decoration(pos, pos, new WidgetType(toDOM, spec))
  };

  // :: (number, number, DecorationAttrs, ?Object) → Decoration
  // Creates an inline decoration, which adds the given attributes to
  // each inline node between `from` and `to`.
  //
  // spec::- These options are recognized:
  //
  //   inclusiveStart:: ?bool
  //   Determines how the left side of the decoration is
  //   [mapped](#transform.Position_Mapping) when content is
  //   inserted directly at that position. By default, the decoration
  //   won't include the new content, but you can set this to `true`
  //   to make it inclusive.
  //
  //   inclusiveEnd:: ?bool
  //   Determines how the right side of the decoration is mapped.
  //   See
  //   [`inclusiveStart`](#view.Decoration^inline^spec.inclusiveStart).
  Decoration.inline = function inline (from, to, attrs, spec) {
    return new Decoration(from, to, new InlineType(attrs, spec))
  };

  // :: (number, number, DecorationAttrs, ?Object) → Decoration
  // Creates a node decoration. `from` and `to` should point precisely
  // before and after a node in the document. That node, and only that
  // node, will receive the given attributes.
  //
  // spec::-
  //
  // Optional information to store with the decoration. It
  // is also used when comparing decorators for equality.
  Decoration.node = function node (from, to, attrs, spec) {
    return new Decoration(from, to, new NodeType(attrs, spec))
  };

  // :: Object
  // The spec provided when creating this decoration. Can be useful
  // if you've stored extra information in that object.
  prototypeAccessors$1.spec.get = function () { return this.type.spec };

  prototypeAccessors$1.inline.get = function () { return this.type instanceof InlineType };

  Object.defineProperties( Decoration.prototype, prototypeAccessors$1 );

  // DecorationAttrs:: interface
  // A set of attributes to add to a decorated node. Most properties
  // simply directly correspond to DOM attributes of the same name,
  // which will be set to the property's value. These are exceptions:
  //
  //   class:: ?string
  //   A CSS class name or a space-separated set of class names to be
  //   _added_ to the classes that the node already had.
  //
  //   style:: ?string
  //   A string of CSS to be _added_ to the node's existing `style` property.
  //
  //   nodeName:: ?string
  //   When non-null, the target node is wrapped in a DOM element of
  //   this type (and the other attributes are applied to this element).

  var none = [], noSpec = {};

  // :: class extends DecorationSource
  // A collection of [decorations](#view.Decoration), organized in
  // such a way that the drawing algorithm can efficiently use and
  // compare them. This is a persistent data structure—it is not
  // modified, updates create a new value.
  var DecorationSet = function DecorationSet(local, children) {
    this.local = local && local.length ? local : none;
    this.children = children && children.length ? children : none;
  };

  // :: (Node, [Decoration]) → DecorationSet
  // Create a set of decorations, using the structure of the given
  // document.
  DecorationSet.create = function create (doc, decorations) {
    return decorations.length ? buildTree(decorations, doc, 0, noSpec) : empty
  };

  // :: (?number, ?number, ?(spec: Object) → bool) → [Decoration]
  // Find all decorations in this set which touch the given range
  // (including decorations that start or end directly at the
  // boundaries) and match the given predicate on their spec. When
  // `start` and `end` are omitted, all decorations in the set are
  // considered. When `predicate` isn't given, all decorations are
  // assumed to match.
  DecorationSet.prototype.find = function find (start, end, predicate) {
    var result = [];
    this.findInner(start == null ? 0 : start, end == null ? 1e9 : end, result, 0, predicate);
    return result
  };

  DecorationSet.prototype.findInner = function findInner (start, end, result, offset, predicate) {
    for (var i = 0; i < this.local.length; i++) {
      var span = this.local[i];
      if (span.from <= end && span.to >= start && (!predicate || predicate(span.spec)))
        { result.push(span.copy(span.from + offset, span.to + offset)); }
    }
    for (var i$1 = 0; i$1 < this.children.length; i$1 += 3) {
      if (this.children[i$1] < end && this.children[i$1 + 1] > start) {
        var childOff = this.children[i$1] + 1;
        this.children[i$1 + 2].findInner(start - childOff, end - childOff, result, offset + childOff, predicate);
      }
    }
  };

  // :: (Mapping, Node, ?Object) → DecorationSet
  // Map the set of decorations in response to a change in the
  // document.
  //
  // options::- An optional set of options.
  //
  //   onRemove:: ?(decorationSpec: Object)
  //   When given, this function will be called for each decoration
  //   that gets dropped as a result of the mapping, passing the
  //   spec of that decoration.
  DecorationSet.prototype.map = function map (mapping, doc, options) {
    if (this == empty || mapping.maps.length == 0) { return this }
    return this.mapInner(mapping, doc, 0, 0, options || noSpec)
  };

  DecorationSet.prototype.mapInner = function mapInner (mapping, node, offset, oldOffset, options) {
    var newLocal;
    for (var i = 0; i < this.local.length; i++) {
      var mapped = this.local[i].map(mapping, offset, oldOffset);
      if (mapped && mapped.type.valid(node, mapped)) { (newLocal || (newLocal = [])).push(mapped); }
      else if (options.onRemove) { options.onRemove(this.local[i].spec); }
    }

    if (this.children.length)
      { return mapChildren(this.children, newLocal, mapping, node, offset, oldOffset, options) }
    else
      { return newLocal ? new DecorationSet(newLocal.sort(byPos)) : empty }
  };

  // :: (Node, [Decoration]) → DecorationSet
  // Add the given array of decorations to the ones in the set,
  // producing a new set. Needs access to the current document to
  // create the appropriate tree structure.
  DecorationSet.prototype.add = function add (doc, decorations) {
    if (!decorations.length) { return this }
    if (this == empty) { return DecorationSet.create(doc, decorations) }
    return this.addInner(doc, decorations, 0)
  };

  DecorationSet.prototype.addInner = function addInner (doc, decorations, offset) {
      var this$1 = this;

    var children, childIndex = 0;
    doc.forEach(function (childNode, childOffset) {
      var baseOffset = childOffset + offset, found;
      if (!(found = takeSpansForNode(decorations, childNode, baseOffset))) { return }

      if (!children) { children = this$1.children.slice(); }
      while (childIndex < children.length && children[childIndex] < childOffset) { childIndex += 3; }
      if (children[childIndex] == childOffset)
        { children[childIndex + 2] = children[childIndex + 2].addInner(childNode, found, baseOffset + 1); }
      else
        { children.splice(childIndex, 0, childOffset, childOffset + childNode.nodeSize, buildTree(found, childNode, baseOffset + 1, noSpec)); }
      childIndex += 3;
    });

    var local = moveSpans(childIndex ? withoutNulls(decorations) : decorations, -offset);
    for (var i = 0; i < local.length; i++) { if (!local[i].type.valid(doc, local[i])) { local.splice(i--, 1); } }

    return new DecorationSet(local.length ? this.local.concat(local).sort(byPos) : this.local,
                             children || this.children)
  };

  // :: ([Decoration]) → DecorationSet
  // Create a new set that contains the decorations in this set, minus
  // the ones in the given array.
  DecorationSet.prototype.remove = function remove (decorations) {
    if (decorations.length == 0 || this == empty) { return this }
    return this.removeInner(decorations, 0)
  };

  DecorationSet.prototype.removeInner = function removeInner (decorations, offset) {
    var children = this.children, local = this.local;
    for (var i = 0; i < children.length; i += 3) {
      var found = (void 0), from = children[i] + offset, to = children[i + 1] + offset;
      for (var j = 0, span = (void 0); j < decorations.length; j++) { if (span = decorations[j]) {
        if (span.from > from && span.to < to) {
          decorations[j] = null
          ;(found || (found = [])).push(span);
        }
      } }
      if (!found) { continue }
      if (children == this.children) { children = this.children.slice(); }
      var removed = children[i + 2].removeInner(found, from + 1);
      if (removed != empty) {
        children[i + 2] = removed;
      } else {
        children.splice(i, 3);
        i -= 3;
      }
    }
    if (local.length) { for (var i$1 = 0, span$1 = (void 0); i$1 < decorations.length; i$1++) { if (span$1 = decorations[i$1]) {
      for (var j$1 = 0; j$1 < local.length; j$1++) { if (local[j$1].eq(span$1, offset)) {
        if (local == this.local) { local = this.local.slice(); }
        local.splice(j$1--, 1);
      } }
    } } }
    if (children == this.children && local == this.local) { return this }
    return local.length || children.length ? new DecorationSet(local, children) : empty
  };

  DecorationSet.prototype.forChild = function forChild (offset, node) {
    if (this == empty) { return this }
    if (node.isLeaf) { return DecorationSet.empty }

    var child, local;
    for (var i = 0; i < this.children.length; i += 3) { if (this.children[i] >= offset) {
      if (this.children[i] == offset) { child = this.children[i + 2]; }
      break
    } }
    var start = offset + 1, end = start + node.content.size;
    for (var i$1 = 0; i$1 < this.local.length; i$1++) {
      var dec = this.local[i$1];
      if (dec.from < end && dec.to > start && (dec.type instanceof InlineType)) {
        var from = Math.max(start, dec.from) - start, to = Math.min(end, dec.to) - start;
        if (from < to) { (local || (local = [])).push(dec.copy(from, to)); }
      }
    }
    if (local) {
      var localSet = new DecorationSet(local.sort(byPos));
      return child ? new DecorationGroup([localSet, child]) : localSet
    }
    return child || empty
  };

  DecorationSet.prototype.eq = function eq (other) {
    if (this == other) { return true }
    if (!(other instanceof DecorationSet) ||
        this.local.length != other.local.length ||
        this.children.length != other.children.length) { return false }
    for (var i = 0; i < this.local.length; i++)
      { if (!this.local[i].eq(other.local[i])) { return false } }
    for (var i$1 = 0; i$1 < this.children.length; i$1 += 3)
      { if (this.children[i$1] != other.children[i$1] ||
          this.children[i$1 + 1] != other.children[i$1 + 1] ||
          !this.children[i$1 + 2].eq(other.children[i$1 + 2])) { return false } }
    return true
  };

  DecorationSet.prototype.locals = function locals (node) {
    return removeOverlap(this.localsInner(node))
  };

  DecorationSet.prototype.localsInner = function localsInner (node) {
    if (this == empty) { return none }
    if (node.inlineContent || !this.local.some(InlineType.is)) { return this.local }
    var result = [];
    for (var i = 0; i < this.local.length; i++) {
      if (!(this.local[i].type instanceof InlineType))
        { result.push(this.local[i]); }
    }
    return result
  };

  // DecorationSource:: interface
  // An object that can [provide](#view.EditorProps.decorations)
  // decorations. Implemented by [`DecorationSet`](#view.DecorationSet),
  // and passed to [node views](#view.EditorProps.nodeViews).

  var empty = new DecorationSet();

  // :: DecorationSet
  // The empty set of decorations.
  DecorationSet.empty = empty;

  DecorationSet.removeOverlap = removeOverlap;

  // :- An abstraction that allows the code dealing with decorations to
  // treat multiple DecorationSet objects as if it were a single object
  // with (a subset of) the same interface.
  var DecorationGroup = function DecorationGroup(members) {
    this.members = members;
  };

  DecorationGroup.prototype.forChild = function forChild (offset, child) {
    if (child.isLeaf) { return DecorationSet.empty }
    var found = [];
    for (var i = 0; i < this.members.length; i++) {
      var result = this.members[i].forChild(offset, child);
      if (result == empty) { continue }
      if (result instanceof DecorationGroup) { found = found.concat(result.members); }
      else { found.push(result); }
    }
    return DecorationGroup.from(found)
  };

  DecorationGroup.prototype.eq = function eq (other) {
    if (!(other instanceof DecorationGroup) ||
        other.members.length != this.members.length) { return false }
    for (var i = 0; i < this.members.length; i++)
      { if (!this.members[i].eq(other.members[i])) { return false } }
    return true
  };

  DecorationGroup.prototype.locals = function locals (node) {
    var result, sorted = true;
    for (var i = 0; i < this.members.length; i++) {
      var locals = this.members[i].localsInner(node);
      if (!locals.length) { continue }
      if (!result) {
        result = locals;
      } else {
        if (sorted) {
          result = result.slice();
          sorted = false;
        }
        for (var j = 0; j < locals.length; j++) { result.push(locals[j]); }
      }
    }
    return result ? removeOverlap(sorted ? result : result.sort(byPos)) : none
  };

  // : ([DecorationSet]) → union<DecorationSet, DecorationGroup>
  // Create a group for the given array of decoration sets, or return
  // a single set when possible.
  DecorationGroup.from = function from (members) {
    switch (members.length) {
      case 0: return empty
      case 1: return members[0]
      default: return new DecorationGroup(members)
    }
  };

  function mapChildren(oldChildren, newLocal, mapping, node, offset, oldOffset, options) {
    var children = oldChildren.slice();

    // Mark the children that are directly touched by changes, and
    // move those that are after the changes.
    var shift = function (oldStart, oldEnd, newStart, newEnd) {
      for (var i = 0; i < children.length; i += 3) {
        var end = children[i + 1], dSize = (void 0);
        if (end == -1 || oldStart > end + oldOffset) { continue }
        if (oldEnd >= children[i] + oldOffset) {
          children[i + 1] = -1;
        } else if (newStart >= offset && (dSize = (newEnd - newStart) - (oldEnd - oldStart))) {
          children[i] += dSize;
          children[i + 1] += dSize;
        }
      }
    };
    for (var i = 0; i < mapping.maps.length; i++) { mapping.maps[i].forEach(shift); }

    // Find the child nodes that still correspond to a single node,
    // recursively call mapInner on them and update their positions.
    var mustRebuild = false;
    for (var i$1 = 0; i$1 < children.length; i$1 += 3) { if (children[i$1 + 1] == -1) { // Touched nodes
      var from = mapping.map(oldChildren[i$1] + oldOffset), fromLocal = from - offset;
      if (fromLocal < 0 || fromLocal >= node.content.size) {
        mustRebuild = true;
        continue
      }
      // Must read oldChildren because children was tagged with -1
      var to = mapping.map(oldChildren[i$1 + 1] + oldOffset, -1), toLocal = to - offset;
      var ref = node.content.findIndex(fromLocal);
      var index = ref.index;
      var childOffset = ref.offset;
      var childNode = node.maybeChild(index);
      if (childNode && childOffset == fromLocal && childOffset + childNode.nodeSize == toLocal) {
        var mapped = children[i$1 + 2].mapInner(mapping, childNode, from + 1, oldChildren[i$1] + oldOffset + 1, options);
        if (mapped != empty) {
          children[i$1] = fromLocal;
          children[i$1 + 1] = toLocal;
          children[i$1 + 2] = mapped;
        } else {
          children[i$1 + 1] = -2;
          mustRebuild = true;
        }
      } else {
        mustRebuild = true;
      }
    } }

    // Remaining children must be collected and rebuilt into the appropriate structure
    if (mustRebuild) {
      var decorations = mapAndGatherRemainingDecorations(children, oldChildren, newLocal || [], mapping,
                                                         offset, oldOffset, options);
      var built = buildTree(decorations, node, 0, options);
      newLocal = built.local;
      for (var i$2 = 0; i$2 < children.length; i$2 += 3) { if (children[i$2 + 1] < 0) {
        children.splice(i$2, 3);
        i$2 -= 3;
      } }
      for (var i$3 = 0, j = 0; i$3 < built.children.length; i$3 += 3) {
        var from$1 = built.children[i$3];
        while (j < children.length && children[j] < from$1) { j += 3; }
        children.splice(j, 0, built.children[i$3], built.children[i$3 + 1], built.children[i$3 + 2]);
      }
    }

    return new DecorationSet(newLocal && newLocal.sort(byPos), children)
  }

  function moveSpans(spans, offset) {
    if (!offset || !spans.length) { return spans }
    var result = [];
    for (var i = 0; i < spans.length; i++) {
      var span = spans[i];
      result.push(new Decoration(span.from + offset, span.to + offset, span.type));
    }
    return result
  }

  function mapAndGatherRemainingDecorations(children, oldChildren, decorations, mapping, offset, oldOffset, options) {
    // Gather all decorations from the remaining marked children
    function gather(set, oldOffset) {
      for (var i = 0; i < set.local.length; i++) {
        var mapped = set.local[i].map(mapping, offset, oldOffset);
        if (mapped) { decorations.push(mapped); }
        else if (options.onRemove) { options.onRemove(set.local[i].spec); }
      }
      for (var i$1 = 0; i$1 < set.children.length; i$1 += 3)
        { gather(set.children[i$1 + 2], set.children[i$1] + oldOffset + 1); }
    }
    for (var i = 0; i < children.length; i += 3) { if (children[i + 1] == -1)
      { gather(children[i + 2], oldChildren[i] + oldOffset + 1); } }

    return decorations
  }

  function takeSpansForNode(spans, node, offset) {
    if (node.isLeaf) { return null }
    var end = offset + node.nodeSize, found = null;
    for (var i = 0, span = (void 0); i < spans.length; i++) {
      if ((span = spans[i]) && span.from > offset && span.to < end) {
  (found || (found = [])).push(span);
        spans[i] = null;
      }
    }
    return found
  }

  function withoutNulls(array) {
    var result = [];
    for (var i = 0; i < array.length; i++)
      { if (array[i] != null) { result.push(array[i]); } }
    return result
  }

  // : ([Decoration], Node, number) → DecorationSet
  // Build up a tree that corresponds to a set of decorations. `offset`
  // is a base offset that should be subtractet from the `from` and `to`
  // positions in the spans (so that we don't have to allocate new spans
  // for recursive calls).
  function buildTree(spans, node, offset, options) {
    var children = [], hasNulls = false;
    node.forEach(function (childNode, localStart) {
      var found = takeSpansForNode(spans, childNode, localStart + offset);
      if (found) {
        hasNulls = true;
        var subtree = buildTree(found, childNode, offset + localStart + 1, options);
        if (subtree != empty)
          { children.push(localStart, localStart + childNode.nodeSize, subtree); }
      }
    });
    var locals = moveSpans(hasNulls ? withoutNulls(spans) : spans, -offset).sort(byPos);
    for (var i = 0; i < locals.length; i++) { if (!locals[i].type.valid(node, locals[i])) {
      if (options.onRemove) { options.onRemove(locals[i].spec); }
      locals.splice(i--, 1);
    } }
    return locals.length || children.length ? new DecorationSet(locals, children) : empty
  }

  // : (Decoration, Decoration) → number
  // Used to sort decorations so that ones with a low start position
  // come first, and within a set with the same start position, those
  // with an smaller end position come first.
  function byPos(a, b) {
    return a.from - b.from || a.to - b.to
  }

  // : ([Decoration]) → [Decoration]
  // Scan a sorted array of decorations for partially overlapping spans,
  // and split those so that only fully overlapping spans are left (to
  // make subsequent rendering easier). Will return the input array if
  // no partially overlapping spans are found (the common case).
  function removeOverlap(spans) {
    var working = spans;
    for (var i = 0; i < working.length - 1; i++) {
      var span = working[i];
      if (span.from != span.to) { for (var j = i + 1; j < working.length; j++) {
        var next = working[j];
        if (next.from == span.from) {
          if (next.to != span.to) {
            if (working == spans) { working = spans.slice(); }
            // Followed by a partially overlapping larger span. Split that
            // span.
            working[j] = next.copy(next.from, span.to);
            insertAhead(working, j + 1, next.copy(span.to, next.to));
          }
          continue
        } else {
          if (next.from < span.to) {
            if (working == spans) { working = spans.slice(); }
            // The end of this one overlaps with a subsequent span. Split
            // this one.
            working[i] = span.copy(span.from, next.from);
            insertAhead(working, j, span.copy(next.from, span.to));
          }
          break
        }
      } }
    }
    return working
  }

  function insertAhead(array, i, deco) {
    while (i < array.length && byPos(deco, array[i]) > 0) { i++; }
    array.splice(i, 0, deco);
  }

  // : (EditorView) → union<DecorationSet, DecorationGroup>
  // Get the decorations associated with the current props of a view.
  function viewDecorations(view) {
    var found = [];
    view.someProp("decorations", function (f) {
      var result = f(view.state);
      if (result && result != empty) { found.push(result); }
    });
    if (view.cursorWrapper)
      { found.push(DecorationSet.create(view.state.doc, [view.cursorWrapper.deco])); }
    return DecorationGroup.from(found)
  }

  // ::- An editor view manages the DOM structure that represents an
  // editable document. Its state and behavior are determined by its
  // [props](#view.DirectEditorProps).
  var EditorView = function EditorView(place, props) {
    this._props = props;
    // :: EditorState
    // The view's current [state](#state.EditorState).
    this.state = props.state;

    this.dispatch = this.dispatch.bind(this);

    this._root = null;
    this.focused = false;
    // Kludge used to work around a Chrome bug
    this.trackWrites = null;

    // :: dom.Element
    // An editable DOM node containing the document. (You probably
    // should not directly interfere with its content.)
    this.dom = (place && place.mount) || document.createElement("div");
    if (place) {
      if (place.appendChild) { place.appendChild(this.dom); }
      else if (place.apply) { place(this.dom); }
      else if (place.mount) { this.mounted = true; }
    }

    // :: bool
    // Indicates whether the editor is currently [editable](#view.EditorProps.editable).
    this.editable = getEditable(this);
    this.markCursor = null;
    this.cursorWrapper = null;
    updateCursorWrapper(this);
    this.nodeViews = buildNodeViews(this);
    this.docView = docViewDesc(this.state.doc, computeDocDeco(this), viewDecorations(this), this.dom, this);

    this.lastSelectedViewDesc = null;
    // :: ?{slice: Slice, move: bool}
    // When editor content is being dragged, this object contains
    // information about the dragged slice and whether it is being
    // copied or moved. At any other time, it is null.
    this.dragging = null;

    initInput(this);

    this.pluginViews = [];
    this.updatePluginViews();
  };

  var prototypeAccessors$2 = { props: { configurable: true },root: { configurable: true } };

  // composing:: boolean
  // Holds `true` when a
  // [composition](https://developer.mozilla.org/en-US/docs/Mozilla/IME_handling_guide)
  // is active.

  // :: DirectEditorProps
  // The view's current [props](#view.EditorProps).
  prototypeAccessors$2.props.get = function () {
    if (this._props.state != this.state) {
      var prev = this._props;
      this._props = {};
      for (var name in prev) { this._props[name] = prev[name]; }
      this._props.state = this.state;
    }
    return this._props
  };

  // :: (DirectEditorProps)
  // Update the view's props. Will immediately cause an update to
  // the DOM.
  EditorView.prototype.update = function update (props) {
    if (props.handleDOMEvents != this._props.handleDOMEvents) { ensureListeners(this); }
    this._props = props;
    this.updateStateInner(props.state, true);
  };

  // :: (DirectEditorProps)
  // Update the view by updating existing props object with the object
  // given as argument. Equivalent to `view.update(Object.assign({},
  // view.props, props))`.
  EditorView.prototype.setProps = function setProps (props) {
    var updated = {};
    for (var name in this._props) { updated[name] = this._props[name]; }
    updated.state = this.state;
    for (var name$1 in props) { updated[name$1] = props[name$1]; }
    this.update(updated);
  };

  // :: (EditorState)
  // Update the editor's `state` prop, without touching any of the
  // other props.
  EditorView.prototype.updateState = function updateState (state) {
    this.updateStateInner(state, this.state.plugins != state.plugins);
  };

  EditorView.prototype.updateStateInner = function updateStateInner (state, reconfigured) {
      var this$1 = this;

    var prev = this.state, redraw = false, updateSel = false;
    // When stored marks are added, stop composition, so that they can
    // be displayed.
    if (state.storedMarks && this.composing) {
      clearComposition(this);
      updateSel = true;
    }
    this.state = state;
    if (reconfigured) {
      var nodeViews = buildNodeViews(this);
      if (changedNodeViews(nodeViews, this.nodeViews)) {
        this.nodeViews = nodeViews;
        redraw = true;
      }
      ensureListeners(this);
    }

    this.editable = getEditable(this);
    updateCursorWrapper(this);
    var innerDeco = viewDecorations(this), outerDeco = computeDocDeco(this);

    var scroll = reconfigured ? "reset"
        : state.scrollToSelection > prev.scrollToSelection ? "to selection" : "preserve";
    var updateDoc = redraw || !this.docView.matchesNode(state.doc, outerDeco, innerDeco);
    if (updateDoc || !state.selection.eq(prev.selection)) { updateSel = true; }
    var oldScrollPos = scroll == "preserve" && updateSel && this.dom.style.overflowAnchor == null && storeScrollPos(this);

    if (updateSel) {
      this.domObserver.stop();
      // Work around an issue in Chrome, IE, and Edge where changing
      // the DOM around an active selection puts it into a broken
      // state where the thing the user sees differs from the
      // selection reported by the Selection object (#710, #973,
      // #1011, #1013, #1035).
      var forceSelUpdate = updateDoc && (result.ie || result.chrome) && !this.composing &&
          !prev.selection.empty && !state.selection.empty && selectionContextChanged(prev.selection, state.selection);
      if (updateDoc) {
        // If the node that the selection points into is written to,
        // Chrome sometimes starts misreporting the selection, so this
        // tracks that and forces a selection reset when our update
        // did write to the node.
        var chromeKludge = result.chrome ? (this.trackWrites = this.root.getSelection().focusNode) : null;
        if (redraw || !this.docView.update(state.doc, outerDeco, innerDeco, this)) {
          this.docView.updateOuterDeco([]);
          this.docView.destroy();
          this.docView = docViewDesc(state.doc, outerDeco, innerDeco, this.dom, this);
        }
        if (chromeKludge && !this.trackWrites) { forceSelUpdate = true; }
      }
      // Work around for an issue where an update arriving right between
      // a DOM selection change and the "selectionchange" event for it
      // can cause a spurious DOM selection update, disrupting mouse
      // drag selection.
      if (forceSelUpdate ||
          !(this.mouseDown && this.domObserver.currentSelection.eq(this.root.getSelection()) && anchorInRightPlace(this))) {
        selectionToDOM(this, forceSelUpdate);
      } else {
        syncNodeSelection(this, state.selection);
        this.domObserver.setCurSelection();
      }
      this.domObserver.start();
    }

    this.updatePluginViews(prev);

    if (scroll == "reset") {
      this.dom.scrollTop = 0;
    } else if (scroll == "to selection") {
      var startDOM = this.root.getSelection().focusNode;
      if (this.someProp("handleScrollToSelection", function (f) { return f(this$1); }))
        ; // Handled
      else if (state.selection instanceof NodeSelection)
        { scrollRectIntoView(this, this.docView.domAfterPos(state.selection.from).getBoundingClientRect(), startDOM); }
      else
        { scrollRectIntoView(this, this.coordsAtPos(state.selection.head, 1), startDOM); }
    } else if (oldScrollPos) {
      resetScrollPos(oldScrollPos);
    }
  };

  EditorView.prototype.destroyPluginViews = function destroyPluginViews () {
    var view;
    while (view = this.pluginViews.pop()) { if (view.destroy) { view.destroy(); } }
  };

  EditorView.prototype.updatePluginViews = function updatePluginViews (prevState) {
    if (!prevState || prevState.plugins != this.state.plugins) {
      this.destroyPluginViews();
      for (var i = 0; i < this.state.plugins.length; i++) {
        var plugin = this.state.plugins[i];
        if (plugin.spec.view) { this.pluginViews.push(plugin.spec.view(this)); }
      }
    } else {
      for (var i$1 = 0; i$1 < this.pluginViews.length; i$1++) {
        var pluginView = this.pluginViews[i$1];
        if (pluginView.update) { pluginView.update(this, prevState); }
      }
    }
  };

  // :: (string, ?(prop: *) → *) → *
  // Goes over the values of a prop, first those provided directly,
  // then those from plugins (in order), and calls `f` every time a
  // non-undefined value is found. When `f` returns a truthy value,
  // that is immediately returned. When `f` isn't provided, it is
  // treated as the identity function (the prop value is returned
  // directly).
  EditorView.prototype.someProp = function someProp (propName, f) {
    var prop = this._props && this._props[propName], value;
    if (prop != null && (value = f ? f(prop) : prop)) { return value }
    var plugins = this.state.plugins;
    if (plugins) { for (var i = 0; i < plugins.length; i++) {
      var prop$1 = plugins[i].props[propName];
      if (prop$1 != null && (value = f ? f(prop$1) : prop$1)) { return value }
    } }
  };

  // :: () → bool
  // Query whether the view has focus.
  EditorView.prototype.hasFocus = function hasFocus () {
    return this.root.activeElement == this.dom
  };

  // :: ()
  // Focus the editor.
  EditorView.prototype.focus = function focus () {
    this.domObserver.stop();
    if (this.editable) { focusPreventScroll(this.dom); }
    selectionToDOM(this);
    this.domObserver.start();
  };

  // :: union<dom.Document, dom.DocumentFragment>
  // Get the document root in which the editor exists. This will
  // usually be the top-level `document`, but might be a [shadow
  // DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Shadow_DOM)
  // root if the editor is inside one.
  prototypeAccessors$2.root.get = function () {
    var cached = this._root;
    if (cached == null) { for (var search = this.dom.parentNode; search; search = search.parentNode) {
      if (search.nodeType == 9 || (search.nodeType == 11 && search.host)) {
        if (!search.getSelection) { Object.getPrototypeOf(search).getSelection = function () { return document.getSelection(); }; }
        return this._root = search
      }
    } }
    return cached || document
  };

  // :: ({left: number, top: number}) → ?{pos: number, inside: number}
  // Given a pair of viewport coordinates, return the document
  // position that corresponds to them. May return null if the given
  // coordinates aren't inside of the editor. When an object is
  // returned, its `pos` property is the position nearest to the
  // coordinates, and its `inside` property holds the position of the
  // inner node that the position falls inside of, or -1 if it is at
  // the top level, not in any node.
  EditorView.prototype.posAtCoords = function posAtCoords$1 (coords) {
    return posAtCoords(this, coords)
  };

  // :: (number, number) → {left: number, right: number, top: number, bottom: number}
  // Returns the viewport rectangle at a given document position.
  // `left` and `right` will be the same number, as this returns a
  // flat cursor-ish rectangle. If the position is between two things
  // that aren't directly adjacent, `side` determines which element is
  // used. When < 0, the element before the position is used,
  // otherwise the element after.
  EditorView.prototype.coordsAtPos = function coordsAtPos$1$1 (pos, side) {
      if ( side === void 0 ) side = 1;

    return coordsAtPos$1(this, pos, side)
  };

  // :: (number, number) → {node: dom.Node, offset: number}
  // Find the DOM position that corresponds to the given document
  // position. When `side` is negative, find the position as close as
  // possible to the content before the position. When positive,
  // prefer positions close to the content after the position. When
  // zero, prefer as shallow a position as possible.
  //
  // Note that you should **not** mutate the editor's internal DOM,
  // only inspect it (and even that is usually not necessary).
  EditorView.prototype.domAtPos = function domAtPos (pos, side) {
      if ( side === void 0 ) side = 0;

    return this.docView.domFromPos(pos, side)
  };

  // :: (number) → ?dom.Node
  // Find the DOM node that represents the document node after the
  // given position. May return `null` when the position doesn't point
  // in front of a node or if the node is inside an opaque node view.
  //
  // This is intended to be able to call things like
  // `getBoundingClientRect` on that DOM node. Do **not** mutate the
  // editor DOM directly, or add styling this way, since that will be
  // immediately overriden by the editor as it redraws the node.
  EditorView.prototype.nodeDOM = function nodeDOM (pos) {
    var desc = this.docView.descAt(pos);
    return desc ? desc.nodeDOM : null
  };

  // :: (dom.Node, number, ?number) → number
  // Find the document position that corresponds to a given DOM
  // position. (Whenever possible, it is preferable to inspect the
  // document structure directly, rather than poking around in the
  // DOM, but sometimes—for example when interpreting an event
  // target—you don't have a choice.)
  //
  // The `bias` parameter can be used to influence which side of a DOM
  // node to use when the position is inside a leaf node.
  EditorView.prototype.posAtDOM = function posAtDOM (node, offset, bias) {
      if ( bias === void 0 ) bias = -1;

    var pos = this.docView.posFromDOM(node, offset, bias);
    if (pos == null) { throw new RangeError("DOM position not inside the editor") }
    return pos
  };

  // :: (union<"up", "down", "left", "right", "forward", "backward">, ?EditorState) → bool
  // Find out whether the selection is at the end of a textblock when
  // moving in a given direction. When, for example, given `"left"`,
  // it will return true if moving left from the current cursor
  // position would leave that position's parent textblock. Will apply
  // to the view's current state by default, but it is possible to
  // pass a different state.
  EditorView.prototype.endOfTextblock = function endOfTextblock$1 (dir, state) {
    return endOfTextblock(this, state || this.state, dir)
  };

  // :: ()
  // Removes the editor from the DOM and destroys all [node
  // views](#view.NodeView).
  EditorView.prototype.destroy = function destroy () {
    if (!this.docView) { return }
    destroyInput(this);
    this.destroyPluginViews();
    if (this.mounted) {
      this.docView.update(this.state.doc, [], viewDecorations(this), this);
      this.dom.textContent = "";
    } else if (this.dom.parentNode) {
      this.dom.parentNode.removeChild(this.dom);
    }
    this.docView.destroy();
    this.docView = null;
  };

  // Used for testing.
  EditorView.prototype.dispatchEvent = function dispatchEvent$1 (event) {
    return dispatchEvent(this, event)
  };

  // :: (Transaction)
  // Dispatch a transaction. Will call
  // [`dispatchTransaction`](#view.DirectEditorProps.dispatchTransaction)
  // when given, and otherwise defaults to applying the transaction to
  // the current state and calling
  // [`updateState`](#view.EditorView.updateState) with the result.
  // This method is bound to the view instance, so that it can be
  // easily passed around.
  EditorView.prototype.dispatch = function dispatch (tr) {
    var dispatchTransaction = this._props.dispatchTransaction;
    if (dispatchTransaction) { dispatchTransaction.call(this, tr); }
    else { this.updateState(this.state.apply(tr)); }
  };

  Object.defineProperties( EditorView.prototype, prototypeAccessors$2 );

  function computeDocDeco(view) {
    var attrs = Object.create(null);
    attrs.class = "ProseMirror";
    attrs.contenteditable = String(view.editable);

    view.someProp("attributes", function (value) {
      if (typeof value == "function") { value = value(view.state); }
      if (value) { for (var attr in value) {
        if (attr == "class")
          { attrs.class += " " + value[attr]; }
        else if (!attrs[attr] && attr != "contenteditable" && attr != "nodeName")
          { attrs[attr] = String(value[attr]); }
      } }
    });

    return [Decoration.node(0, view.state.doc.content.size, attrs)]
  }

  function updateCursorWrapper(view) {
    if (view.markCursor) {
      var dom = document.createElement("img");
      dom.setAttribute("mark-placeholder", "true");
      view.cursorWrapper = {dom: dom, deco: Decoration.widget(view.state.selection.head, dom, {raw: true, marks: view.markCursor})};
    } else {
      view.cursorWrapper = null;
    }
  }

  function getEditable(view) {
    return !view.someProp("editable", function (value) { return value(view.state) === false; })
  }

  function selectionContextChanged(sel1, sel2) {
    var depth = Math.min(sel1.$anchor.sharedDepth(sel1.head), sel2.$anchor.sharedDepth(sel2.head));
    return sel1.$anchor.start(depth) != sel2.$anchor.start(depth)
  }

  function buildNodeViews(view) {
    var result = {};
    view.someProp("nodeViews", function (obj) {
      for (var prop in obj) { if (!Object.prototype.hasOwnProperty.call(result, prop))
        { result[prop] = obj[prop]; } }
    });
    return result
  }

  function changedNodeViews(a, b) {
    var nA = 0, nB = 0;
    for (var prop in a) {
      if (a[prop] != b[prop]) { return true }
      nA++;
    }
    for (var _ in b) { nB++; }
    return nA != nB
  }

  var base = {
    8: "Backspace",
    9: "Tab",
    10: "Enter",
    12: "NumLock",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    44: "PrintScreen",
    45: "Insert",
    46: "Delete",
    59: ";",
    61: "=",
    91: "Meta",
    92: "Meta",
    106: "*",
    107: "+",
    108: ",",
    109: "-",
    110: ".",
    111: "/",
    144: "NumLock",
    145: "ScrollLock",
    160: "Shift",
    161: "Shift",
    162: "Control",
    163: "Control",
    164: "Alt",
    165: "Alt",
    173: "-",
    186: ";",
    187: "=",
    188: ",",
    189: "-",
    190: ".",
    191: "/",
    192: "`",
    219: "[",
    220: "\\",
    221: "]",
    222: "'",
    229: "q"
  };

  var shift = {
    48: ")",
    49: "!",
    50: "@",
    51: "#",
    52: "$",
    53: "%",
    54: "^",
    55: "&",
    56: "*",
    57: "(",
    59: ":",
    61: "+",
    173: "_",
    186: ":",
    187: "+",
    188: "<",
    189: "_",
    190: ">",
    191: "?",
    192: "~",
    219: "{",
    220: "|",
    221: "}",
    222: "\"",
    229: "Q"
  };

  var chrome = typeof navigator != "undefined" && /Chrome\/(\d+)/.exec(navigator.userAgent);
  var safari = typeof navigator != "undefined" && /Apple Computer/.test(navigator.vendor);
  var gecko = typeof navigator != "undefined" && /Gecko\/\d+/.test(navigator.userAgent);
  var mac$2 = typeof navigator != "undefined" && /Mac/.test(navigator.platform);
  var ie = typeof navigator != "undefined" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
  var brokenModifierNames = chrome && (mac$2 || +chrome[1] < 57) || gecko && mac$2;

  // Fill in the digit keys
  for (var i = 0; i < 10; i++) base[48 + i] = base[96 + i] = String(i);

  // The function keys
  for (var i = 1; i <= 24; i++) base[i + 111] = "F" + i;

  // And the alphabetic keys
  for (var i = 65; i <= 90; i++) {
    base[i] = String.fromCharCode(i + 32);
    shift[i] = String.fromCharCode(i);
  }

  // For each code that doesn't have a shift-equivalent, copy the base name
  for (var code in base) if (!shift.hasOwnProperty(code)) shift[code] = base[code];

  function keyName(event) {
    // Don't trust event.key in Chrome when there are modifiers until
    // they fix https://bugs.chromium.org/p/chromium/issues/detail?id=633838
    var ignoreKey = brokenModifierNames && (event.ctrlKey || event.altKey || event.metaKey) ||
      (safari || ie) && event.shiftKey && event.key && event.key.length == 1;
    var name = (!ignoreKey && event.key) ||
      (event.shiftKey ? shift : base)[event.keyCode] ||
      event.key || "Unidentified";
    // Edge sometimes produces wrong names (Issue #3)
    if (name == "Esc") name = "Escape";
    if (name == "Del") name = "Delete";
    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/8860571/
    if (name == "Left") name = "ArrowLeft";
    if (name == "Up") name = "ArrowUp";
    if (name == "Right") name = "ArrowRight";
    if (name == "Down") name = "ArrowDown";
    return name
  }

  // declare global: navigator

  var mac$1 = typeof navigator != "undefined" ? /Mac/.test(navigator.platform) : false;

  function normalizeKeyName$1(name) {
    var parts = name.split(/-(?!$)/), result = parts[parts.length - 1];
    if (result == "Space") { result = " "; }
    var alt, ctrl, shift, meta;
    for (var i = 0; i < parts.length - 1; i++) {
      var mod = parts[i];
      if (/^(cmd|meta|m)$/i.test(mod)) { meta = true; }
      else if (/^a(lt)?$/i.test(mod)) { alt = true; }
      else if (/^(c|ctrl|control)$/i.test(mod)) { ctrl = true; }
      else if (/^s(hift)?$/i.test(mod)) { shift = true; }
      else if (/^mod$/i.test(mod)) { if (mac$1) { meta = true; } else { ctrl = true; } }
      else { throw new Error("Unrecognized modifier name: " + mod) }
    }
    if (alt) { result = "Alt-" + result; }
    if (ctrl) { result = "Ctrl-" + result; }
    if (meta) { result = "Meta-" + result; }
    if (shift) { result = "Shift-" + result; }
    return result
  }

  function normalize(map) {
    var copy = Object.create(null);
    for (var prop in map) { copy[normalizeKeyName$1(prop)] = map[prop]; }
    return copy
  }

  function modifiers(name, event, shift) {
    if (event.altKey) { name = "Alt-" + name; }
    if (event.ctrlKey) { name = "Ctrl-" + name; }
    if (event.metaKey) { name = "Meta-" + name; }
    if (shift !== false && event.shiftKey) { name = "Shift-" + name; }
    return name
  }

  // :: (Object) → (view: EditorView, event: dom.Event) → bool
  // Given a set of bindings (using the same format as
  // [`keymap`](#keymap.keymap), return a [keydown
  // handler](#view.EditorProps.handleKeyDown) that handles them.
  function keydownHandler(bindings) {
    var map = normalize(bindings);
    return function(view, event) {
      var name = keyName(event), isChar = name.length == 1 && name != " ", baseName;
      var direct = map[modifiers(name, event, !isChar)];
      if (direct && direct(view.state, view.dispatch, view)) { return true }
      if (isChar && (event.shiftKey || event.altKey || event.metaKey || name.charCodeAt(0) > 127) &&
          (baseName = base[event.keyCode]) && baseName != name) {
        // Try falling back to the keyCode when there's a modifier
        // active or the character produced isn't ASCII, and our table
        // produces a different name from the the keyCode. See #668,
        // #1060
        var fromCode = map[modifiers(baseName, event, true)];
        if (fromCode && fromCode(view.state, view.dispatch, view)) { return true }
      } else if (isChar && event.shiftKey) {
        // Otherwise, if shift is active, also try the binding with the
        // Shift- prefix enabled. See #997
        var withShift = map[modifiers(name, event, true)];
        if (withShift && withShift(view.state, view.dispatch, view)) { return true }
      }
      return false
    }
  }

  // ::- Input rules are regular expressions describing a piece of text
  // that, when typed, causes something to happen. This might be
  // changing two dashes into an emdash, wrapping a paragraph starting
  // with `"> "` into a blockquote, or something entirely different.
  var InputRule = function InputRule(match, handler) {
    this.match = match;
    this.handler = typeof handler == "string" ? stringHandler(handler) : handler;
  };

  function stringHandler(string) {
    return function(state, match, start, end) {
      var insert = string;
      if (match[1]) {
        var offset = match[0].lastIndexOf(match[1]);
        insert += match[0].slice(offset + match[1].length);
        start += offset;
        var cutOff = start - end;
        if (cutOff > 0) {
          insert = match[0].slice(offset - cutOff, offset) + insert;
          start = end;
        }
      }
      return state.tr.insertText(insert, start, end)
    }
  }

  // :: (EditorState, ?(Transaction)) → bool
  // This is a command that will undo an input rule, if applying such a
  // rule was the last thing that the user did.
  function undoInputRule$2(state, dispatch) {
    var plugins = state.plugins;
    for (var i = 0; i < plugins.length; i++) {
      var plugin = plugins[i], undoable = (void 0);
      if (plugin.spec.isInputRules && (undoable = plugin.getState(state))) {
        if (dispatch) {
          var tr = state.tr, toUndo = undoable.transform;
          for (var j = toUndo.steps.length - 1; j >= 0; j--)
            { tr.step(toUndo.steps[j].invert(toUndo.docs[j])); }
          if (undoable.text) {
            var marks = tr.doc.resolve(undoable.from).marks();
            tr.replaceWith(undoable.from, undoable.to, state.schema.text(undoable.text, marks));
          } else {
            tr.delete(undoable.from, undoable.to);
          }
          dispatch(tr);
        }
        return true
      }
    }
    return false
  }

  // :: (RegExp, NodeType, ?union<Object, ([string]) → ?Object>, ?([string], Node) → bool) → InputRule
  // Build an input rule for automatically wrapping a textblock when a
  // given string is typed. The `regexp` argument is
  // directly passed through to the `InputRule` constructor. You'll
  // probably want the regexp to start with `^`, so that the pattern can
  // only occur at the start of a textblock.
  //
  // `nodeType` is the type of node to wrap in. If it needs attributes,
  // you can either pass them directly, or pass a function that will
  // compute them from the regular expression match.
  //
  // By default, if there's a node with the same type above the newly
  // wrapped node, the rule will try to [join](#transform.Transform.join) those
  // two nodes. You can pass a join predicate, which takes a regular
  // expression match and the node before the wrapped node, and can
  // return a boolean to indicate whether a join should happen.
  function wrappingInputRule(regexp, nodeType, getAttrs, joinPredicate) {
    return new InputRule(regexp, function (state, match, start, end) {
      var attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;
      var tr = state.tr.delete(start, end);
      var $start = tr.doc.resolve(start), range = $start.blockRange(), wrapping = range && findWrapping(range, nodeType, attrs);
      if (!wrapping) { return null }
      tr.wrap(range, wrapping);
      var before = tr.doc.resolve(start - 1).nodeBefore;
      if (before && before.type == nodeType && canJoin(tr.doc, start - 1) &&
          (!joinPredicate || joinPredicate(match, before)))
        { tr.join(start - 1); }
      return tr
    })
  }

  // :: (RegExp, NodeType, ?union<Object, ([string]) → ?Object>) → InputRule
  // Build an input rule that changes the type of a textblock when the
  // matched text is typed into it. You'll usually want to start your
  // regexp with `^` to that it is only matched at the start of a
  // textblock. The optional `getAttrs` parameter can be used to compute
  // the new node's attributes, and works the same as in the
  // `wrappingInputRule` function.
  function textblockTypeInputRule(regexp, nodeType, getAttrs) {
    return new InputRule(regexp, function (state, match, start, end) {
      var $start = state.doc.resolve(start);
      var attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;
      if (!$start.node(-1).canReplaceWith($start.index(-1), $start.indexAfter(-1), nodeType)) { return null }
      return state.tr
        .delete(start, end)
        .setBlockType(start, start, nodeType, attrs)
    })
  }

  // :: (EditorState, ?(tr: Transaction)) → bool
  // Delete the selection, if there is one.
  function deleteSelection$2(state, dispatch) {
    if (state.selection.empty) { return false }
    if (dispatch) { dispatch(state.tr.deleteSelection().scrollIntoView()); }
    return true
  }

  // :: (EditorState, ?(tr: Transaction), ?EditorView) → bool
  // If the selection is empty and at the start of a textblock, try to
  // reduce the distance between that block and the one before it—if
  // there's a block directly before it that can be joined, join them.
  // If not, try to move the selected block closer to the next one in
  // the document structure by lifting it out of its parent or moving it
  // into a parent of the previous block. Will use the view for accurate
  // (bidi-aware) start-of-textblock detection if given.
  function joinBackward$2(state, dispatch, view) {
    var ref = state.selection;
    var $cursor = ref.$cursor;
    if (!$cursor || (view ? !view.endOfTextblock("backward", state)
                          : $cursor.parentOffset > 0))
      { return false }

    var $cut = findCutBefore($cursor);

    // If there is no node before this, try to lift
    if (!$cut) {
      var range = $cursor.blockRange(), target = range && liftTarget(range);
      if (target == null) { return false }
      if (dispatch) { dispatch(state.tr.lift(range, target).scrollIntoView()); }
      return true
    }

    var before = $cut.nodeBefore;
    // Apply the joining algorithm
    if (!before.type.spec.isolating && deleteBarrier(state, $cut, dispatch))
      { return true }

    // If the node below has no content and the node above is
    // selectable, delete the node below and select the one above.
    if ($cursor.parent.content.size == 0 &&
        (textblockAt(before, "end") || NodeSelection.isSelectable(before))) {
      if (dispatch) {
        var tr = state.tr.deleteRange($cursor.before(), $cursor.after());
        tr.setSelection(textblockAt(before, "end") ? Selection.findFrom(tr.doc.resolve(tr.mapping.map($cut.pos, -1)), -1)
                        : NodeSelection.create(tr.doc, $cut.pos - before.nodeSize));
        dispatch(tr.scrollIntoView());
      }
      return true
    }

    // If the node before is an atom, delete it
    if (before.isAtom && $cut.depth == $cursor.depth - 1) {
      if (dispatch) { dispatch(state.tr.delete($cut.pos - before.nodeSize, $cut.pos).scrollIntoView()); }
      return true
    }

    return false
  }

  function textblockAt(node, side) {
    for (; node; node = (side == "start" ? node.firstChild : node.lastChild))
      { if (node.isTextblock) { return true } }
    return false
  }

  // :: (EditorState, ?(tr: Transaction), ?EditorView) → bool
  // When the selection is empty and at the start of a textblock, select
  // the node before that textblock, if possible. This is intended to be
  // bound to keys like backspace, after
  // [`joinBackward`](#commands.joinBackward) or other deleting
  // commands, as a fall-back behavior when the schema doesn't allow
  // deletion at the selected point.
  function selectNodeBackward$2(state, dispatch, view) {
    var ref = state.selection;
    var $head = ref.$head;
    var empty = ref.empty;
    var $cut = $head;
    if (!empty) { return false }

    if ($head.parent.isTextblock) {
      if (view ? !view.endOfTextblock("backward", state) : $head.parentOffset > 0) { return false }
      $cut = findCutBefore($head);
    }
    var node = $cut && $cut.nodeBefore;
    if (!node || !NodeSelection.isSelectable(node)) { return false }
    if (dispatch)
      { dispatch(state.tr.setSelection(NodeSelection.create(state.doc, $cut.pos - node.nodeSize)).scrollIntoView()); }
    return true
  }

  function findCutBefore($pos) {
    if (!$pos.parent.type.spec.isolating) { for (var i = $pos.depth - 1; i >= 0; i--) {
      if ($pos.index(i) > 0) { return $pos.doc.resolve($pos.before(i + 1)) }
      if ($pos.node(i).type.spec.isolating) { break }
    } }
    return null
  }

  // :: (EditorState, ?(tr: Transaction), ?EditorView) → bool
  // If the selection is empty and the cursor is at the end of a
  // textblock, try to reduce or remove the boundary between that block
  // and the one after it, either by joining them or by moving the other
  // block closer to this one in the tree structure. Will use the view
  // for accurate start-of-textblock detection if given.
  function joinForward$2(state, dispatch, view) {
    var ref = state.selection;
    var $cursor = ref.$cursor;
    if (!$cursor || (view ? !view.endOfTextblock("forward", state)
                          : $cursor.parentOffset < $cursor.parent.content.size))
      { return false }

    var $cut = findCutAfter($cursor);

    // If there is no node after this, there's nothing to do
    if (!$cut) { return false }

    var after = $cut.nodeAfter;
    // Try the joining algorithm
    if (deleteBarrier(state, $cut, dispatch)) { return true }

    // If the node above has no content and the node below is
    // selectable, delete the node above and select the one below.
    if ($cursor.parent.content.size == 0 &&
        (textblockAt(after, "start") || NodeSelection.isSelectable(after))) {
      if (dispatch) {
        var tr = state.tr.deleteRange($cursor.before(), $cursor.after());
        tr.setSelection(textblockAt(after, "start") ? Selection.findFrom(tr.doc.resolve(tr.mapping.map($cut.pos)), 1)
                        : NodeSelection.create(tr.doc, tr.mapping.map($cut.pos)));
        dispatch(tr.scrollIntoView());
      }
      return true
    }

    // If the next node is an atom, delete it
    if (after.isAtom && $cut.depth == $cursor.depth - 1) {
      if (dispatch) { dispatch(state.tr.delete($cut.pos, $cut.pos + after.nodeSize).scrollIntoView()); }
      return true
    }

    return false
  }

  // :: (EditorState, ?(tr: Transaction), ?EditorView) → bool
  // When the selection is empty and at the end of a textblock, select
  // the node coming after that textblock, if possible. This is intended
  // to be bound to keys like delete, after
  // [`joinForward`](#commands.joinForward) and similar deleting
  // commands, to provide a fall-back behavior when the schema doesn't
  // allow deletion at the selected point.
  function selectNodeForward$2(state, dispatch, view) {
    var ref = state.selection;
    var $head = ref.$head;
    var empty = ref.empty;
    var $cut = $head;
    if (!empty) { return false }
    if ($head.parent.isTextblock) {
      if (view ? !view.endOfTextblock("forward", state) : $head.parentOffset < $head.parent.content.size)
        { return false }
      $cut = findCutAfter($head);
    }
    var node = $cut && $cut.nodeAfter;
    if (!node || !NodeSelection.isSelectable(node)) { return false }
    if (dispatch)
      { dispatch(state.tr.setSelection(NodeSelection.create(state.doc, $cut.pos)).scrollIntoView()); }
    return true
  }

  function findCutAfter($pos) {
    if (!$pos.parent.type.spec.isolating) { for (var i = $pos.depth - 1; i >= 0; i--) {
      var parent = $pos.node(i);
      if ($pos.index(i) + 1 < parent.childCount) { return $pos.doc.resolve($pos.after(i + 1)) }
      if (parent.type.spec.isolating) { break }
    } }
    return null
  }

  // :: (EditorState, ?(tr: Transaction)) → bool
  // Lift the selected block, or the closest ancestor block of the
  // selection that can be lifted, out of its parent node.
  function lift$2(state, dispatch) {
    var ref = state.selection;
    var $from = ref.$from;
    var $to = ref.$to;
    var range = $from.blockRange($to), target = range && liftTarget(range);
    if (target == null) { return false }
    if (dispatch) { dispatch(state.tr.lift(range, target).scrollIntoView()); }
    return true
  }

  // :: (EditorState, ?(tr: Transaction)) → bool
  // If the selection is in a node whose type has a truthy
  // [`code`](#model.NodeSpec.code) property in its spec, replace the
  // selection with a newline character.
  function newlineInCode$2(state, dispatch) {
    var ref = state.selection;
    var $head = ref.$head;
    var $anchor = ref.$anchor;
    if (!$head.parent.type.spec.code || !$head.sameParent($anchor)) { return false }
    if (dispatch) { dispatch(state.tr.insertText("\n").scrollIntoView()); }
    return true
  }

  function defaultBlockAt$1(match) {
    for (var i = 0; i < match.edgeCount; i++) {
      var ref = match.edge(i);
      var type = ref.type;
      if (type.isTextblock && !type.hasRequiredAttrs()) { return type }
    }
    return null
  }

  // :: (EditorState, ?(tr: Transaction)) → bool
  // When the selection is in a node with a truthy
  // [`code`](#model.NodeSpec.code) property in its spec, create a
  // default block after the code block, and move the cursor there.
  function exitCode$2(state, dispatch) {
    var ref = state.selection;
    var $head = ref.$head;
    var $anchor = ref.$anchor;
    if (!$head.parent.type.spec.code || !$head.sameParent($anchor)) { return false }
    var above = $head.node(-1), after = $head.indexAfter(-1), type = defaultBlockAt$1(above.contentMatchAt(after));
    if (!above.canReplaceWith(after, after, type)) { return false }
    if (dispatch) {
      var pos = $head.after(), tr = state.tr.replaceWith(pos, pos, type.createAndFill());
      tr.setSelection(Selection.near(tr.doc.resolve(pos), 1));
      dispatch(tr.scrollIntoView());
    }
    return true
  }

  // :: (EditorState, ?(tr: Transaction)) → bool
  // If a block node is selected, create an empty paragraph before (if
  // it is its parent's first child) or after it.
  function createParagraphNear$2(state, dispatch) {
    var sel = state.selection;
    var $from = sel.$from;
    var $to = sel.$to;
    if (sel instanceof AllSelection || $from.parent.inlineContent || $to.parent.inlineContent) { return false }
    var type = defaultBlockAt$1($to.parent.contentMatchAt($to.indexAfter()));
    if (!type || !type.isTextblock) { return false }
    if (dispatch) {
      var side = (!$from.parentOffset && $to.index() < $to.parent.childCount ? $from : $to).pos;
      var tr = state.tr.insert(side, type.createAndFill());
      tr.setSelection(TextSelection.create(tr.doc, side + 1));
      dispatch(tr.scrollIntoView());
    }
    return true
  }

  // :: (EditorState, ?(tr: Transaction)) → bool
  // If the cursor is in an empty textblock that can be lifted, lift the
  // block.
  function liftEmptyBlock$2(state, dispatch) {
    var ref = state.selection;
    var $cursor = ref.$cursor;
    if (!$cursor || $cursor.parent.content.size) { return false }
    if ($cursor.depth > 1 && $cursor.after() != $cursor.end(-1)) {
      var before = $cursor.before();
      if (canSplit(state.doc, before)) {
        if (dispatch) { dispatch(state.tr.split(before).scrollIntoView()); }
        return true
      }
    }
    var range = $cursor.blockRange(), target = range && liftTarget(range);
    if (target == null) { return false }
    if (dispatch) { dispatch(state.tr.lift(range, target).scrollIntoView()); }
    return true
  }

  // :: (EditorState, ?(tr: Transaction)) → bool
  // Split the parent block of the selection. If the selection is a text
  // selection, also delete its content.
  function splitBlock$2(state, dispatch) {
    var ref = state.selection;
    var $from = ref.$from;
    var $to = ref.$to;
    if (state.selection instanceof NodeSelection && state.selection.node.isBlock) {
      if (!$from.parentOffset || !canSplit(state.doc, $from.pos)) { return false }
      if (dispatch) { dispatch(state.tr.split($from.pos).scrollIntoView()); }
      return true
    }

    if (!$from.parent.isBlock) { return false }

    if (dispatch) {
      var atEnd = $to.parentOffset == $to.parent.content.size;
      var tr = state.tr;
      if (state.selection instanceof TextSelection || state.selection instanceof AllSelection) { tr.deleteSelection(); }
      var deflt = $from.depth == 0 ? null : defaultBlockAt$1($from.node(-1).contentMatchAt($from.indexAfter(-1)));
      var types = atEnd && deflt ? [{type: deflt}] : null;
      var can = canSplit(tr.doc, tr.mapping.map($from.pos), 1, types);
      if (!types && !can && canSplit(tr.doc, tr.mapping.map($from.pos), 1, deflt && [{type: deflt}])) {
        types = [{type: deflt}];
        can = true;
      }
      if (can) {
        tr.split(tr.mapping.map($from.pos), 1, types);
        if (!atEnd && !$from.parentOffset && $from.parent.type != deflt &&
            $from.node(-1).canReplace($from.index(-1), $from.indexAfter(-1), Fragment.from([deflt.create(), $from.parent])))
          { tr.setNodeMarkup(tr.mapping.map($from.before()), deflt); }
      }
      dispatch(tr.scrollIntoView());
    }
    return true
  }

  // :: (EditorState, ?(tr: Transaction)) → bool
  // Move the selection to the node wrapping the current selection, if
  // any. (Will not select the document node.)
  function selectParentNode$2(state, dispatch) {
    var ref = state.selection;
    var $from = ref.$from;
    var to = ref.to;
    var pos;
    var same = $from.sharedDepth(to);
    if (same == 0) { return false }
    pos = $from.before(same);
    if (dispatch) { dispatch(state.tr.setSelection(NodeSelection.create(state.doc, pos))); }
    return true
  }

  // :: (EditorState, ?(tr: Transaction)) → bool
  // Select the whole document.
  function selectAll$2(state, dispatch) {
    if (dispatch) { dispatch(state.tr.setSelection(new AllSelection(state.doc))); }
    return true
  }

  function joinMaybeClear(state, $pos, dispatch) {
    var before = $pos.nodeBefore, after = $pos.nodeAfter, index = $pos.index();
    if (!before || !after || !before.type.compatibleContent(after.type)) { return false }
    if (!before.content.size && $pos.parent.canReplace(index - 1, index)) {
      if (dispatch) { dispatch(state.tr.delete($pos.pos - before.nodeSize, $pos.pos).scrollIntoView()); }
      return true
    }
    if (!$pos.parent.canReplace(index, index + 1) || !(after.isTextblock || canJoin(state.doc, $pos.pos)))
      { return false }
    if (dispatch)
      { dispatch(state.tr
               .clearIncompatible($pos.pos, before.type, before.contentMatchAt(before.childCount))
               .join($pos.pos)
               .scrollIntoView()); }
    return true
  }

  function deleteBarrier(state, $cut, dispatch) {
    var before = $cut.nodeBefore, after = $cut.nodeAfter, conn, match;
    if (before.type.spec.isolating || after.type.spec.isolating) { return false }
    if (joinMaybeClear(state, $cut, dispatch)) { return true }

    var canDelAfter = $cut.parent.canReplace($cut.index(), $cut.index() + 1);
    if (canDelAfter &&
        (conn = (match = before.contentMatchAt(before.childCount)).findWrapping(after.type)) &&
        match.matchType(conn[0] || after.type).validEnd) {
      if (dispatch) {
        var end = $cut.pos + after.nodeSize, wrap = Fragment.empty;
        for (var i = conn.length - 1; i >= 0; i--)
          { wrap = Fragment.from(conn[i].create(null, wrap)); }
        wrap = Fragment.from(before.copy(wrap));
        var tr = state.tr.step(new ReplaceAroundStep($cut.pos - 1, end, $cut.pos, end, new Slice(wrap, 1, 0), conn.length, true));
        var joinAt = end + 2 * conn.length;
        if (canJoin(tr.doc, joinAt)) { tr.join(joinAt); }
        dispatch(tr.scrollIntoView());
      }
      return true
    }

    var selAfter = Selection.findFrom($cut, 1);
    var range = selAfter && selAfter.$from.blockRange(selAfter.$to), target = range && liftTarget(range);
    if (target != null && target >= $cut.depth) {
      if (dispatch) { dispatch(state.tr.lift(range, target).scrollIntoView()); }
      return true
    }

    if (canDelAfter && after.isTextblock && textblockAt(before, "end")) {
      var at = before, wrap$1 = [];
      for (;;) {
        wrap$1.push(at);
        if (at.isTextblock) { break }
        at = at.lastChild;
      }
      if (at.canReplace(at.childCount, at.childCount, after.content)) {
        if (dispatch) {
          var end$1 = Fragment.empty;
          for (var i$1 = wrap$1.length - 1; i$1 >= 0; i$1--) { end$1 = Fragment.from(wrap$1[i$1].copy(end$1)); }
          var tr$1 = state.tr.step(new ReplaceAroundStep($cut.pos - wrap$1.length, $cut.pos + after.nodeSize,
                                                       $cut.pos + 1, $cut.pos + after.nodeSize - 1,
                                                       new Slice(end$1, wrap$1.length, 0), 0, true));
          dispatch(tr$1.scrollIntoView());
        }
        return true
      }
    }

    return false
  }

  // Parameterized commands

  // :: (NodeType, ?Object) → (state: EditorState, dispatch: ?(tr: Transaction)) → bool
  // Wrap the selection in a node of the given type with the given
  // attributes.
  function wrapIn$2(nodeType, attrs) {
    return function(state, dispatch) {
      var ref = state.selection;
      var $from = ref.$from;
      var $to = ref.$to;
      var range = $from.blockRange($to), wrapping = range && findWrapping(range, nodeType, attrs);
      if (!wrapping) { return false }
      if (dispatch) { dispatch(state.tr.wrap(range, wrapping).scrollIntoView()); }
      return true
    }
  }

  // :: (NodeType, ?Object) → (state: EditorState, dispatch: ?(tr: Transaction)) → bool
  // Returns a command that tries to set the selected textblocks to the
  // given node type with the given attributes.
  function setBlockType(nodeType, attrs) {
    return function(state, dispatch) {
      var ref = state.selection;
      var from = ref.from;
      var to = ref.to;
      var applicable = false;
      state.doc.nodesBetween(from, to, function (node, pos) {
        if (applicable) { return false }
        if (!node.isTextblock || node.hasMarkup(nodeType, attrs)) { return }
        if (node.type == nodeType) {
          applicable = true;
        } else {
          var $pos = state.doc.resolve(pos), index = $pos.index();
          applicable = $pos.parent.canReplaceWith(index, index + 1, nodeType);
        }
      });
      if (!applicable) { return false }
      if (dispatch) { dispatch(state.tr.setBlockType(from, to, nodeType, attrs).scrollIntoView()); }
      return true
    }
  }

  // :: (...[(EditorState, ?(tr: Transaction), ?EditorView) → bool]) → (EditorState, ?(tr: Transaction), ?EditorView) → bool
  // Combine a number of command functions into a single function (which
  // calls them one by one until one returns true).
  function chainCommands() {
    var commands = [], len = arguments.length;
    while ( len-- ) commands[ len ] = arguments[ len ];

    return function(state, dispatch, view) {
      for (var i = 0; i < commands.length; i++)
        { if (commands[i](state, dispatch, view)) { return true } }
      return false
    }
  }

  var backspace = chainCommands(deleteSelection$2, joinBackward$2, selectNodeBackward$2);
  var del = chainCommands(deleteSelection$2, joinForward$2, selectNodeForward$2);

  // :: Object
  // A basic keymap containing bindings not specific to any schema.
  // Binds the following keys (when multiple commands are listed, they
  // are chained with [`chainCommands`](#commands.chainCommands)):
  //
  // * **Enter** to `newlineInCode`, `createParagraphNear`, `liftEmptyBlock`, `splitBlock`
  // * **Mod-Enter** to `exitCode`
  // * **Backspace** and **Mod-Backspace** to `deleteSelection`, `joinBackward`, `selectNodeBackward`
  // * **Delete** and **Mod-Delete** to `deleteSelection`, `joinForward`, `selectNodeForward`
  // * **Mod-Delete** to `deleteSelection`, `joinForward`, `selectNodeForward`
  // * **Mod-a** to `selectAll`
  ({
    "Enter": chainCommands(newlineInCode$2, createParagraphNear$2, liftEmptyBlock$2, splitBlock$2),
    "Mod-Enter": exitCode$2,
    "Backspace": backspace,
    "Mod-Backspace": backspace,
    "Delete": del,
    "Mod-Delete": del,
    "Mod-a": selectAll$2
  });

  // declare global: os, navigator
  typeof navigator != "undefined" ? /Mac/.test(navigator.platform)
            : typeof os != "undefined" ? os.platform() == "darwin" : false;

  // :: (NodeType, ?Object) → (state: EditorState, dispatch: ?(tr: Transaction)) → bool
  // Returns a command function that wraps the selection in a list with
  // the given type an attributes. If `dispatch` is null, only return a
  // value to indicate whether this is possible, but don't actually
  // perform the change.
  function wrapInList$2(listType, attrs) {
    return function(state, dispatch) {
      var ref = state.selection;
      var $from = ref.$from;
      var $to = ref.$to;
      var range = $from.blockRange($to), doJoin = false, outerRange = range;
      if (!range) { return false }
      // This is at the top of an existing list item
      if (range.depth >= 2 && $from.node(range.depth - 1).type.compatibleContent(listType) && range.startIndex == 0) {
        // Don't do anything if this is the top of the list
        if ($from.index(range.depth - 1) == 0) { return false }
        var $insert = state.doc.resolve(range.start - 2);
        outerRange = new NodeRange($insert, $insert, range.depth);
        if (range.endIndex < range.parent.childCount)
          { range = new NodeRange($from, state.doc.resolve($to.end(range.depth)), range.depth); }
        doJoin = true;
      }
      var wrap = findWrapping(outerRange, listType, attrs, range);
      if (!wrap) { return false }
      if (dispatch) { dispatch(doWrapInList(state.tr, range, wrap, doJoin, listType).scrollIntoView()); }
      return true
    }
  }

  function doWrapInList(tr, range, wrappers, joinBefore, listType) {
    var content = Fragment.empty;
    for (var i = wrappers.length - 1; i >= 0; i--)
      { content = Fragment.from(wrappers[i].type.create(wrappers[i].attrs, content)); }

    tr.step(new ReplaceAroundStep(range.start - (joinBefore ? 2 : 0), range.end, range.start, range.end,
                                  new Slice(content, 0, 0), wrappers.length, true));

    var found = 0;
    for (var i$1 = 0; i$1 < wrappers.length; i$1++) { if (wrappers[i$1].type == listType) { found = i$1 + 1; } }
    var splitDepth = wrappers.length - found;

    var splitPos = range.start + wrappers.length - (joinBefore ? 2 : 0), parent = range.parent;
    for (var i$2 = range.startIndex, e = range.endIndex, first = true; i$2 < e; i$2++, first = false) {
      if (!first && canSplit(tr.doc, splitPos, splitDepth)) {
        tr.split(splitPos, splitDepth);
        splitPos += 2 * splitDepth;
      }
      splitPos += parent.child(i$2).nodeSize;
    }
    return tr
  }

  // :: (NodeType) → (state: EditorState, dispatch: ?(tr: Transaction)) → bool
  // Create a command to lift the list item around the selection up into
  // a wrapping list.
  function liftListItem$2(itemType) {
    return function(state, dispatch) {
      var ref = state.selection;
      var $from = ref.$from;
      var $to = ref.$to;
      var range = $from.blockRange($to, function (node) { return node.childCount && node.firstChild.type == itemType; });
      if (!range) { return false }
      if (!dispatch) { return true }
      if ($from.node(range.depth - 1).type == itemType) // Inside a parent list
        { return liftToOuterList(state, dispatch, itemType, range) }
      else // Outer list node
        { return liftOutOfList(state, dispatch, range) }
    }
  }

  function liftToOuterList(state, dispatch, itemType, range) {
    var tr = state.tr, end = range.end, endOfList = range.$to.end(range.depth);
    if (end < endOfList) {
      // There are siblings after the lifted items, which must become
      // children of the last item
      tr.step(new ReplaceAroundStep(end - 1, endOfList, end, endOfList,
                                    new Slice(Fragment.from(itemType.create(null, range.parent.copy())), 1, 0), 1, true));
      range = new NodeRange(tr.doc.resolve(range.$from.pos), tr.doc.resolve(endOfList), range.depth);
    }
    dispatch(tr.lift(range, liftTarget(range)).scrollIntoView());
    return true
  }

  function liftOutOfList(state, dispatch, range) {
    var tr = state.tr, list = range.parent;
    // Merge the list items into a single big item
    for (var pos = range.end, i = range.endIndex - 1, e = range.startIndex; i > e; i--) {
      pos -= list.child(i).nodeSize;
      tr.delete(pos - 1, pos + 1);
    }
    var $start = tr.doc.resolve(range.start), item = $start.nodeAfter;
    var atStart = range.startIndex == 0, atEnd = range.endIndex == list.childCount;
    var parent = $start.node(-1), indexBefore = $start.index(-1);
    if (!parent.canReplace(indexBefore + (atStart ? 0 : 1), indexBefore + 1,
                           item.content.append(atEnd ? Fragment.empty : Fragment.from(list))))
      { return false }
    var start = $start.pos, end = start + item.nodeSize;
    // Strip off the surrounding list. At the sides where we're not at
    // the end of the list, the existing list is closed. At sides where
    // this is the end, it is overwritten to its end.
    tr.step(new ReplaceAroundStep(start - (atStart ? 1 : 0), end + (atEnd ? 1 : 0), start + 1, end - 1,
                                  new Slice((atStart ? Fragment.empty : Fragment.from(list.copy(Fragment.empty)))
                                            .append(atEnd ? Fragment.empty : Fragment.from(list.copy(Fragment.empty))),
                                            atStart ? 0 : 1, atEnd ? 0 : 1), atStart ? 0 : 1));
    dispatch(tr.scrollIntoView());
    return true
  }

  // :: (NodeType) → (state: EditorState, dispatch: ?(tr: Transaction)) → bool
  // Create a command to sink the list item around the selection down
  // into an inner list.
  function sinkListItem$2(itemType) {
    return function(state, dispatch) {
      var ref = state.selection;
      var $from = ref.$from;
      var $to = ref.$to;
      var range = $from.blockRange($to, function (node) { return node.childCount && node.firstChild.type == itemType; });
      if (!range) { return false }
      var startIndex = range.startIndex;
      if (startIndex == 0) { return false }
      var parent = range.parent, nodeBefore = parent.child(startIndex - 1);
      if (nodeBefore.type != itemType) { return false }

      if (dispatch) {
        var nestedBefore = nodeBefore.lastChild && nodeBefore.lastChild.type == parent.type;
        var inner = Fragment.from(nestedBefore ? itemType.create() : null);
        var slice = new Slice(Fragment.from(itemType.create(null, Fragment.from(parent.type.create(null, inner)))),
                              nestedBefore ? 3 : 1, 0);
        var before = range.start, after = range.end;
        dispatch(state.tr.step(new ReplaceAroundStep(before - (nestedBefore ? 3 : 1), after,
                                                     before, after, slice, 1, true))
                 .scrollIntoView());
      }
      return true
    }
  }

  function getSchemaTypeNameByName(name, schema) {
    if (schema.nodes[name]) {
      return 'node';
    }
    if (schema.marks[name]) {
      return 'mark';
    }
    return null;
  }

  function getNodeType(nameOrType, schema) {
    if (typeof nameOrType === 'string') {
      if (!schema.nodes[nameOrType]) {
        throw Error(`There is no node type named '${nameOrType}'. Maybe you forgot to add the extension?`);
      }
      return schema.nodes[nameOrType];
    }
    return nameOrType;
  }

  function getNodeAttributes(state, typeOrName) {
    const type = getNodeType(typeOrName, state.schema);
    const { from, to } = state.selection;
    let nodes = [];
    state.doc.nodesBetween(from, to, node => {
      nodes = [...nodes, node];
    });
    const node = nodes
      .reverse()
      .find(nodeItem => nodeItem.type.name === type.name);
    if (node) {
      return { ...node.attrs };
    }
    return {};
  }

  function getMarkType(nameOrType, schema) {
    if (typeof nameOrType === 'string') {
      if (!schema.marks[nameOrType]) {
        throw Error(`There is no mark type named '${nameOrType}'. Maybe you forgot to add the extension?`);
      }
      return schema.marks[nameOrType];
    }
    return nameOrType;
  }

  function getMarkAttributes(state, typeOrName) {
    const type = getMarkType(typeOrName, state.schema);
    const { from, to, empty } = state.selection;
    let marks = [];
    if (empty) {
      marks = state.selection.$head.marks();
    }
    else {
      state.doc.nodesBetween(from, to, node => {
        marks = [...marks, ...node.marks];
      });
    }
    const mark = marks.find(markItem => markItem.type.name === type.name);
    if (mark) {
      return { ...mark.attrs };
    }
    return {};
  }

  /**
   * Check if object1 includes object2
   * @param object1 Object
   * @param object2 Object
   */
  function objectIncludes(object1, object2) {
    const keys = Object.keys(object2);
    if (!keys.length) {
      return true;
    }
    return !!keys
      .filter(key => object2[key] === object1[key])
      .length;
  }

  function isNodeActive(state, typeOrName, attributes = {}) {
    const { from, to, empty } = state.selection;
    const type = typeOrName
      ? getNodeType(typeOrName, state.schema)
      : null;
    let nodeRanges = [];
    state.doc.nodesBetween(from, to, (node, pos) => {
      if (!node.isText) {
        const relativeFrom = Math.max(from, pos);
        const relativeTo = Math.min(to, pos + node.nodeSize);
        nodeRanges = [...nodeRanges, {
          node,
          from: relativeFrom,
          to: relativeTo,
        }];
      }
    });
    if (empty) {
      return !!nodeRanges
        .filter(nodeRange => {
          if (!type) {
            return true;
          }
          return type.name === nodeRange.node.type.name;
        })
        .find(nodeRange => objectIncludes(nodeRange.node.attrs, attributes));
    }
    const selectionRange = to - from;
    const range = nodeRanges
      .filter(nodeRange => {
        if (!type) {
          return true;
        }
        return type.name === nodeRange.node.type.name;
      })
      .filter(nodeRange => objectIncludes(nodeRange.node.attrs, attributes))
      .reduce((sum, nodeRange) => {
        const size = nodeRange.to - nodeRange.from;
        return sum + size;
      }, 0);
    return range >= selectionRange;
  }

  function isMarkActive(state, typeOrName, attributes = {}) {
    const { from, to, empty } = state.selection;
    const type = typeOrName
      ? getMarkType(typeOrName, state.schema)
      : null;
    if (empty) {
      return !!(state.storedMarks || state.selection.$from.marks())
        .filter(mark => {
          if (!type) {
            return true;
          }
          return type.name === mark.type.name;
        })
        .find(mark => objectIncludes(mark.attrs, attributes));
    }
    let selectionRange = 0;
    let markRanges = [];
    state.doc.nodesBetween(from, to, (node, pos) => {
      if (node.isText) {
        const relativeFrom = Math.max(from, pos);
        const relativeTo = Math.min(to, pos + node.nodeSize);
        const range = relativeTo - relativeFrom;
        selectionRange += range;
        markRanges = [...markRanges, ...node.marks.map(mark => ({
          mark,
          from: relativeFrom,
          to: relativeTo,
        }))];
      }
    });
    if (selectionRange === 0) {
      return false;
    }
    const range = markRanges
      .filter(markRange => {
        if (!type) {
          return true;
        }
        return type.name === markRange.mark.type.name;
      })
      .filter(markRange => objectIncludes(markRange.mark.attrs, attributes))
      .reduce((sum, markRange) => {
        const size = markRange.to - markRange.from;
        return sum + size;
      }, 0);
    return range >= selectionRange;
  }

  function elementFromString(value) {
    return new window.DOMParser().parseFromString(value, 'text/html').body;
  }

  function createNodeFromContent(content, schema, options) {
    options = {
      slice: true,
      parseOptions: {},
      ...options,
    };
    if (typeof content === 'object' && content !== null) {
      try {
        if (Array.isArray(content)) {
          return Fragment.fromArray(content.map(item => schema.nodeFromJSON(item)));
        }
        return schema.nodeFromJSON(content);
      }
      catch (error) {
        console.warn('[tiptap warn]: Invalid content.', 'Passed value:', content, 'Error:', error);
        return createNodeFromContent('', schema, options);
      }
    }
    if (typeof content === 'string') {
      const parser = DOMParser.fromSchema(schema);
      return options.slice
        ? parser.parseSlice(elementFromString(content), options.parseOptions).content
        : parser.parse(elementFromString(content), options.parseOptions);
    }
    return createNodeFromContent('', schema, options);
  }

  function createDocument(content, schema, parseOptions = {}) {
    return createNodeFromContent(content, schema, { slice: false, parseOptions });
  }

  function getExtensionField(extension, field, context = {}) {
    if (extension.config[field] === undefined && extension.parent) {
      return getExtensionField(extension.parent, field, context);
    }
    if (typeof extension.config[field] === 'function') {
      const value = extension.config[field].bind({
        ...context,
        parent: extension.parent
          ? getExtensionField(extension.parent, field, context)
          : null,
      });
      return value;
    }
    return extension.config[field];
  }

  function splitExtensions(extensions) {
    const baseExtensions = extensions.filter(extension => extension.type === 'extension');
    const nodeExtensions = extensions.filter(extension => extension.type === 'node');
    const markExtensions = extensions.filter(extension => extension.type === 'mark');
    return {
      baseExtensions,
      nodeExtensions,
      markExtensions,
    };
  }

  function mergeAttributes(...objects) {
    return objects
      .filter(item => !!item)
      .reduce((items, item) => {
        const mergedAttributes = { ...items };
        Object.entries(item).forEach(([key, value]) => {
          const exists = mergedAttributes[key];
          if (!exists) {
            mergedAttributes[key] = value;
            return;
          }
          if (key === 'class') {
            mergedAttributes[key] = [mergedAttributes[key], value].join(' ');
          }
          else if (key === 'style') {
            mergedAttributes[key] = [mergedAttributes[key], value].join('; ');
          }
          else {
            mergedAttributes[key] = value;
          }
        });
        return mergedAttributes;
      }, {});
  }

  /**
   * Optionally calls `value` as a function.
   * Otherwise it is returned directly.
   * @param value Function or any value.
   * @param context Optional context to bind to function.
   * @param props Optional props to pass to function.
   */
  function callOrReturn(value, context = undefined, ...props) {
    if (typeof value === 'function') {
      if (context) {
        return value.bind(context)(...props);
      }
      return value(...props);
    }
    return value;
  }

  // see: https://github.com/mesqueeb/is-what/blob/88d6e4ca92fb2baab6003c54e02eedf4e729e5ab/src/index.ts
  function getType(payload) {
    return Object.prototype.toString.call(payload).slice(8, -1);
  }
  function isPlainObject(payload) {
    if (getType(payload) !== 'Object')
      return false;
    return payload.constructor === Object && Object.getPrototypeOf(payload) === Object.prototype;
  }

  function mergeDeep(target, source) {
    const output = { ...target };
    if (isPlainObject(target) && isPlainObject(source)) {
      Object.keys(source).forEach(key => {
        if (isPlainObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] });
          }
          else {
            output[key] = mergeDeep(target[key], source[key]);
          }
        }
        else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    return output;
  }

  class Extension {
    constructor(config = {}) {
      this.type = 'extension';
      this.name = 'extension';
      this.parent = null;
      this.child = null;
      this.config = {
        name: this.name,
        defaultOptions: {},
      };
      this.config = {
        ...this.config,
        ...config,
      };
      this.name = this.config.name;
      this.options = this.config.defaultOptions;
    }
    static create(config = {}) {
      return new Extension(config);
    }
    configure(options = {}) {
      this.options = mergeDeep(this.options, options);
      return this;
    }
    extend(extendedConfig = {}) {
      const extension = new Extension(extendedConfig);
      extension.parent = this;
      this.child = extension;
      extension.name = extendedConfig.name
        ? extendedConfig.name
        : extension.parent.name;
      extension.options = extendedConfig.defaultOptions
        ? extendedConfig.defaultOptions
        : extension.parent.options;
      return extension;
    }
  }

  const textBetween = (editor, from, to, blockSeparator, leafText) => {
    let text = '';
    let separated = true;
    editor.state.doc.nodesBetween(from, to, (node, pos) => {
      var _a;
      const textSerializer = editor.extensionManager.textSerializers[node.type.name];
      if (textSerializer) {
        text += textSerializer({ node });
        separated = !blockSeparator;
      }
      else if (node.isText) {
        text += (_a = node === null || node === void 0 ? void 0 : node.text) === null || _a === void 0 ? void 0 : _a.slice(Math.max(from, pos) - pos, to - pos);
        separated = !blockSeparator;
      }
      else if (node.isLeaf && leafText) {
        text += leafText;
        separated = !blockSeparator;
      }
      else if (!separated && node.isBlock) {
        text += blockSeparator;
        separated = true;
      }
    }, 0);
    return text;
  };
  Extension.create({
    name: 'editable',
    addProseMirrorPlugins() {
      return [
        new Plugin({
          key: new PluginKey('clipboardTextSerializer'),
          props: {
            clipboardTextSerializer: () => {
              const { editor } = this;
              const { from, to } = editor.state.selection;
              return textBetween(editor, from, to, '\n');
            },
          },
        }),
      ];
    },
  });

  const blur = () => ({ view }) => {
    const element = view.dom;
    element.blur();
    return true;
  };

  var blur$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    blur: blur
  });

  const clearContent = (emitUpdate = false) => ({ commands }) => {
    return commands.setContent('', emitUpdate);
  };

  var clearContent$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    clearContent: clearContent
  });

  const clearNodes = () => ({ state, tr, dispatch }) => {
    const { selection } = tr;
    const { ranges } = selection;
    ranges.forEach(range => {
      state.doc.nodesBetween(range.$from.pos, range.$to.pos, (node, pos) => {
        if (!node.type.isText) {
          const fromPos = tr.doc.resolve(tr.mapping.map(pos + 1));
          const toPos = tr.doc.resolve(tr.mapping.map(pos + node.nodeSize - 1));
          const nodeRange = fromPos.blockRange(toPos);
          if (nodeRange) {
            const targetLiftDepth = liftTarget(nodeRange);
            if (node.type.isTextblock && dispatch) {
              tr.setNodeMarkup(nodeRange.start, state.doc.type.contentMatch.defaultType);
            }
            if ((targetLiftDepth || targetLiftDepth === 0) && dispatch) {
              tr.lift(nodeRange, targetLiftDepth);
            }
          }
        }
      });
    });
    return true;
  };

  var clearNodes$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    clearNodes: clearNodes
  });

  const command = fn => props => {
    return fn(props);
  };

  var command$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    command: command
  });

  const createParagraphNear = () => ({ state, dispatch }) => {
    return createParagraphNear$2(state, dispatch);
  };

  var createParagraphNear$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    createParagraphNear: createParagraphNear
  });

  const deleteRange = range => ({ tr, dispatch }) => {
    const { from, to } = range;
    if (dispatch) {
      tr.delete(from, to);
    }
    return true;
  };

  var deleteRange$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    deleteRange: deleteRange
  });

  const deleteSelection = () => ({ state, dispatch }) => {
    return deleteSelection$2(state, dispatch);
  };

  var deleteSelection$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    deleteSelection: deleteSelection
  });

  const enter = () => ({ commands }) => {
    return commands.keyboardShortcut('Enter');
  };

  var enter$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    enter: enter
  });

  const exitCode = () => ({ state, dispatch }) => {
    return exitCode$2(state, dispatch);
  };

  var exitCode$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    exitCode: exitCode
  });

  function getMarkRange($pos, type) {
    if (!$pos || !type) {
      return;
    }
    const start = $pos.parent.childAfter($pos.parentOffset);
    if (!start.node) {
      return;
    }
    const link = start.node.marks.find(mark => mark.type === type);
    if (!link) {
      return;
    }
    let startIndex = $pos.index();
    let startPos = $pos.start() + start.offset;
    let endIndex = startIndex + 1;
    let endPos = startPos + start.node.nodeSize;
    while (startIndex > 0 && link.isInSet($pos.parent.child(startIndex - 1).marks)) {
      startIndex -= 1;
      startPos -= $pos.parent.child(startIndex).nodeSize;
    }
    while (endIndex < $pos.parent.childCount && link.isInSet($pos.parent.child(endIndex).marks)) {
      endPos += $pos.parent.child(endIndex).nodeSize;
      endIndex += 1;
    }
    return {
      from: startPos,
      to: endPos,
    };
  }

  const extendMarkRange = typeOrName => ({ tr, state, dispatch }) => {
    const type = getMarkType(typeOrName, state.schema);
    const { doc, selection } = tr;
    const { $from, empty } = selection;
    if (empty && dispatch) {
      const range = getMarkRange($from, type);
      if (range) {
        const newSelection = TextSelection.create(doc, range.from, range.to);
        tr.setSelection(newSelection);
      }
    }
    return true;
  };

  var extendMarkRange$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    extendMarkRange: extendMarkRange
  });

  const first = commands => props => {
    const items = typeof commands === 'function'
      ? commands(props)
      : commands;
    for (let i = 0; i < items.length; i += 1) {
      if (items[i](props)) {
        return true;
      }
    }
    return false;
  };

  var first$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    first: first
  });

  function minMax(value = 0, min = 0, max = 0) {
    return Math.min(Math.max(value, min), max);
  }

  function isClass(item) {
    var _a;
    if (((_a = item.constructor) === null || _a === void 0 ? void 0 : _a.toString().substring(0, 5)) !== 'class') {
      return false;
    }
    return true;
  }

  function isObject$1(item) {
    return (item
      && typeof item === 'object'
      && !Array.isArray(item)
      && !isClass(item));
  }

  function isTextSelection(value) {
    return isObject$1(value) && value instanceof TextSelection;
  }

  function resolveSelection(state, position = null) {
    if (!position) {
      return null;
    }
    if (position === 'start' || position === true) {
      return {
        from: 0,
        to: 0,
      };
    }
    if (position === 'end') {
      const { size } = state.doc.content;
      return {
        from: size,
        to: size,
      };
    }
    return {
      from: position,
      to: position,
    };
  }
  const focus = (position = null) => ({ editor, view, tr, dispatch, }) => {
    if ((view.hasFocus() && position === null) || position === false) {
      return true;
    }
    // we don’t try to resolve a NodeSelection or CellSelection
    if (dispatch && position === null && !isTextSelection(editor.state.selection)) {
      view.focus();
      return true;
    }
    const { from, to } = resolveSelection(editor.state, position) || editor.state.selection;
    const { doc, storedMarks } = tr;
    const resolvedFrom = minMax(from, 0, doc.content.size);
    const resolvedEnd = minMax(to, 0, doc.content.size);
    const selection = TextSelection.create(doc, resolvedFrom, resolvedEnd);
    const isSameSelection = editor.state.selection.eq(selection);
    if (dispatch) {
      tr.setSelection(selection);
      // `tr.setSelection` resets the stored marks
      // so we’ll restore them if the selection is the same as before
      if (isSameSelection && storedMarks) {
        tr.setStoredMarks(storedMarks);
      }
      view.focus();
    }
    return true;
  };

  var focus$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    focus: focus
  });

  const insertContent = value => ({ tr, commands }) => {
    return commands.insertContentAt({ from: tr.selection.from, to: tr.selection.to }, value);
  };

  var insertContent$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    insertContent: insertContent
  });

  // source: https://github.com/ProseMirror/prosemirror-state/blob/master/src/selection.js#L466
  function selectionToInsertionEnd(tr, startLen, bias) {
    const last = tr.steps.length - 1;
    if (last < startLen) {
      return;
    }
    const step = tr.steps[last];
    if (!(step instanceof ReplaceStep || step instanceof ReplaceAroundStep)) {
      return;
    }
    const map = tr.mapping.maps[last];
    let end = 0;
    map.forEach((_from, _to, _newFrom, newTo) => {
      if (end === 0) {
        end = newTo;
      }
    });
    tr.setSelection(Selection.near(tr.doc.resolve(end), bias));
  }

  const insertContentAt = (range, value) => ({ tr, dispatch, editor }) => {
    if (dispatch) {
      const content = createNodeFromContent(value, editor.schema);
      tr.replaceWith(range.from, range.to, content);
      // set cursor at end of inserted content
      selectionToInsertionEnd(tr, tr.steps.length - 1, 1);
    }
    return true;
  };

  var insertContentAt$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    insertContentAt: insertContentAt
  });

  const joinBackward = () => ({ state, dispatch }) => {
    return joinBackward$2(state, dispatch);
  };

  var joinBackward$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    joinBackward: joinBackward
  });

  const joinForward = () => ({ state, dispatch }) => {
    return joinForward$2(state, dispatch);
  };

  var joinForward$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    joinForward: joinForward
  });

  const mac = typeof navigator !== 'undefined' ? /Mac/.test(navigator.platform) : false;
  function normalizeKeyName(name) {
    const parts = name.split(/-(?!$)/);
    let result = parts[parts.length - 1];
    if (result === 'Space') {
      result = ' ';
    }
    let alt;
    let ctrl;
    let shift;
    let meta;
    for (let i = 0; i < parts.length - 1; i += 1) {
      const mod = parts[i];
      if (/^(cmd|meta|m)$/i.test(mod)) {
        meta = true;
      }
      else if (/^a(lt)?$/i.test(mod)) {
        alt = true;
      }
      else if (/^(c|ctrl|control)$/i.test(mod)) {
        ctrl = true;
      }
      else if (/^s(hift)?$/i.test(mod)) {
        shift = true;
      }
      else if (/^mod$/i.test(mod)) {
        if (mac) {
          meta = true;
        }
        else {
          ctrl = true;
        }
      }
      else {
        throw new Error(`Unrecognized modifier name: ${mod}`);
      }
    }
    if (alt) {
      result = `Alt-${result}`;
    }
    if (ctrl) {
      result = `Ctrl-${result}`;
    }
    if (meta) {
      result = `Meta-${result}`;
    }
    if (shift) {
      result = `Shift-${result}`;
    }
    return result;
  }
  const keyboardShortcut = name => ({ editor, view, tr, dispatch, }) => {
    const keys = normalizeKeyName(name).split(/-(?!$)/);
    const key = keys.find(item => !['Alt', 'Ctrl', 'Meta', 'Shift'].includes(item));
    const event = new KeyboardEvent('keydown', {
      key: key === 'Space'
        ? ' '
        : key,
      altKey: keys.includes('Alt'),
      ctrlKey: keys.includes('Ctrl'),
      metaKey: keys.includes('Meta'),
      shiftKey: keys.includes('Shift'),
      bubbles: true,
      cancelable: true,
    });
    const capturedTransaction = editor.captureTransaction(() => {
      view.someProp('handleKeyDown', f => f(view, event));
    });
    capturedTransaction === null || capturedTransaction === void 0 ? void 0 : capturedTransaction.steps.forEach(step => {
      const newStep = step.map(tr.mapping);
      if (newStep && dispatch) {
        tr.maybeStep(newStep);
      }
    });
    return true;
  };

  var keyboardShortcut$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    keyboardShortcut: keyboardShortcut
  });

  const lift = (typeOrName, attributes = {}) => ({ state, dispatch }) => {
    const type = getNodeType(typeOrName, state.schema);
    const isActive = isNodeActive(state, type, attributes);
    if (!isActive) {
      return false;
    }
    return lift$2(state, dispatch);
  };

  var lift$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    lift: lift
  });

  const liftEmptyBlock = () => ({ state, dispatch }) => {
    return liftEmptyBlock$2(state, dispatch);
  };

  var liftEmptyBlock$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    liftEmptyBlock: liftEmptyBlock
  });

  const liftListItem = typeOrName => ({ state, dispatch }) => {
    const type = getNodeType(typeOrName, state.schema);
    return liftListItem$2(type)(state, dispatch);
  };

  var liftListItem$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    liftListItem: liftListItem
  });

  const newlineInCode = () => ({ state, dispatch }) => {
    return newlineInCode$2(state, dispatch);
  };

  var newlineInCode$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    newlineInCode: newlineInCode
  });

  const replace = (typeOrName, attributes = {}) => ({ state, commands }) => {
    console.warn('[tiptap warn]: replace() is deprecated. please use insertContent() instead.');
    const { from, to } = state.selection;
    const range = { from, to };
    return commands.replaceRange(range, typeOrName, attributes);
  };

  var replace$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    replace: replace
  });

  const replaceRange = (range, typeOrName, attributes = {}) => ({ tr, state, dispatch }) => {
    console.warn('[tiptap warn]: replaceRange() is deprecated. please use insertContent() instead.');
    const type = getNodeType(typeOrName, state.schema);
    const { from, to } = range;
    // const $from = tr.doc.resolve(from)
    // const index = $from.index()
    // if (!$from.parent.canReplaceWith(index, index, type)) {
    //   return false
    // }
    if (dispatch) {
      tr.replaceRangeWith(from, to, type.create(attributes));
    }
    return true;
  };

  var replaceRange$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    replaceRange: replaceRange
  });

  /**
   * Remove a property or an array of properties from an object
   * @param obj Object
   * @param key Key to remove
   */
  function deleteProps(obj, propOrProps) {
    const props = typeof propOrProps === 'string'
      ? [propOrProps]
      : propOrProps;
    return Object
      .keys(obj)
      .reduce((newObj, prop) => {
        if (!props.includes(prop)) {
          newObj[prop] = obj[prop];
        }
        return newObj;
      }, {});
  }

  const resetAttributes = (typeOrName, attributes) => ({ tr, state, dispatch }) => {
    let nodeType = null;
    let markType = null;
    const schemaType = getSchemaTypeNameByName(typeof typeOrName === 'string'
      ? typeOrName
      : typeOrName.name, state.schema);
    if (!schemaType) {
      return false;
    }
    if (schemaType === 'node') {
      nodeType = getNodeType(typeOrName, state.schema);
    }
    if (schemaType === 'mark') {
      markType = getMarkType(typeOrName, state.schema);
    }
    if (dispatch) {
      tr.selection.ranges.forEach(range => {
        state.doc.nodesBetween(range.$from.pos, range.$to.pos, (node, pos) => {
          if (nodeType && nodeType === node.type) {
            tr.setNodeMarkup(pos, undefined, deleteProps(node.attrs, attributes));
          }
          if (markType && node.marks.length) {
            node.marks.forEach(mark => {
              if (markType === mark.type) {
                tr.addMark(pos, pos + node.nodeSize, markType.create(deleteProps(mark.attrs, attributes)));
              }
            });
          }
        });
      });
    }
    return true;
  };

  var resetAttributes$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    resetAttributes: resetAttributes
  });

  const scrollIntoView = () => ({ tr, dispatch }) => {
    if (dispatch) {
      tr.scrollIntoView();
    }
    return true;
  };

  var scrollIntoView$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    scrollIntoView: scrollIntoView
  });

  const selectAll = () => ({ state, dispatch }) => {
    return selectAll$2(state, dispatch);
  };

  var selectAll$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    selectAll: selectAll
  });

  const selectNodeBackward = () => ({ state, dispatch }) => {
    return selectNodeBackward$2(state, dispatch);
  };

  var selectNodeBackward$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    selectNodeBackward: selectNodeBackward
  });

  const selectNodeForward = () => ({ state, dispatch }) => {
    return selectNodeForward$2(state, dispatch);
  };

  var selectNodeForward$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    selectNodeForward: selectNodeForward
  });

  const selectParentNode = () => ({ state, dispatch }) => {
    return selectParentNode$2(state, dispatch);
  };

  var selectParentNode$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    selectParentNode: selectParentNode
  });

  const setContent$1 = (content, emitUpdate = false, parseOptions = {}) => ({ tr, editor, dispatch }) => {
    const { doc } = tr;
    const document = createDocument(content, editor.schema, parseOptions);
    const selection = TextSelection.create(doc, 0, doc.content.size);
    if (dispatch) {
      tr.setSelection(selection)
        .replaceSelectionWith(document, false)
        .setMeta('preventUpdate', !emitUpdate);
    }
    return true;
  };

  var setContent$1$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    setContent: setContent$1
  });

  const setMark = (typeOrName, attributes = {}) => ({ tr, state, dispatch }) => {
    const { selection } = tr;
    const { empty, ranges } = selection;
    const type = getMarkType(typeOrName, state.schema);
    if (dispatch) {
      if (empty) {
        const oldAttributes = getMarkAttributes(state, type);
        tr.addStoredMark(type.create({
          ...oldAttributes,
          ...attributes,
        }));
      }
      else {
        ranges.forEach(range => {
          const from = range.$from.pos;
          const to = range.$to.pos;
          state.doc.nodesBetween(from, to, (node, pos) => {
            const trimmedFrom = Math.max(pos, from);
            const trimmedTo = Math.min(pos + node.nodeSize, to);
            const someHasMark = node.marks.find(mark => mark.type === type);
            // if there is already a mark of this type
            // we know that we have to merge its attributes
            // otherwise we add a fresh new mark
            if (someHasMark) {
              node.marks.forEach(mark => {
                if (type === mark.type) {
                  tr.addMark(trimmedFrom, trimmedTo, type.create({
                    ...mark.attrs,
                    ...attributes,
                  }));
                }
              });
            }
            else {
              tr.addMark(trimmedFrom, trimmedTo, type.create(attributes));
            }
          });
        });
      }
    }
    return true;
  };

  var setMark$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    setMark: setMark
  });

  const setNode = (typeOrName, attributes = {}) => ({ state, dispatch }) => {
    const type = getNodeType(typeOrName, state.schema);
    return setBlockType(type, attributes)(state, dispatch);
  };

  var setNode$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    setNode: setNode
  });

  const setNodeSelection = position => ({ tr, dispatch }) => {
    if (dispatch) {
      const { doc } = tr;
      const from = minMax(position, 0, doc.content.size);
      const selection = NodeSelection.create(doc, from);
      tr.setSelection(selection);
    }
    return true;
  };

  var setNodeSelection$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    setNodeSelection: setNodeSelection
  });

  const setTextSelection = range => ({ tr, dispatch }) => {
    if (dispatch) {
      const { doc } = tr;
      const from = minMax(range.from, 0, doc.content.size);
      const to = minMax(range.to, 0, doc.content.size);
      const selection = TextSelection.create(doc, from, to);
      tr.setSelection(selection);
    }
    return true;
  };

  var setTextSelection$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    setTextSelection: setTextSelection
  });

  const sinkListItem = typeOrName => ({ state, dispatch }) => {
    const type = getNodeType(typeOrName, state.schema);
    return sinkListItem$2(type)(state, dispatch);
  };

  var sinkListItem$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    sinkListItem: sinkListItem
  });

  function getSplittedAttributes(extensionAttributes, typeName, attributes) {
    return Object.fromEntries(Object
      .entries(attributes)
      .filter(([name]) => {
        const extensionAttribute = extensionAttributes.find(item => {
          return item.type === typeName && item.name === name;
        });
        if (!extensionAttribute) {
          return false;
        }
        return extensionAttribute.attribute.keepOnSplit;
      }));
  }

  function defaultBlockAt(match) {
    for (let i = 0; i < match.edgeCount; i + 1) {
      const { type } = match.edge(i);
      if (type.isTextblock && !type.hasRequiredAttrs()) {
        return type;
      }
    }
    return null;
  }
  function ensureMarks(state, splittableMarks) {
    const marks = state.storedMarks
      || (state.selection.$to.parentOffset && state.selection.$from.marks());
    if (marks) {
      const filteredMarks = marks.filter(mark => splittableMarks === null || splittableMarks === void 0 ? void 0 : splittableMarks.includes(mark.type.name));
      state.tr.ensureMarks(filteredMarks);
    }
  }
  const splitBlock = ({ keepMarks = true } = {}) => ({ tr, state, dispatch, editor, }) => {
    const { selection, doc } = tr;
    const { $from, $to } = selection;
    const extensionAttributes = editor.extensionManager.attributes;
    const newAttributes = getSplittedAttributes(extensionAttributes, $from.node().type.name, $from.node().attrs);
    if (selection instanceof NodeSelection && selection.node.isBlock) {
      if (!$from.parentOffset || !canSplit(doc, $from.pos)) {
        return false;
      }
      if (dispatch) {
        if (keepMarks) {
          ensureMarks(state, editor.extensionManager.splittableMarks);
        }
        tr.split($from.pos).scrollIntoView();
      }
      return true;
    }
    if (!$from.parent.isBlock) {
      return false;
    }
    if (dispatch) {
      const atEnd = $to.parentOffset === $to.parent.content.size;
      if (selection instanceof TextSelection) {
        tr.deleteSelection();
      }
      const deflt = $from.depth === 0
        ? undefined
        : defaultBlockAt($from.node(-1).contentMatchAt($from.indexAfter(-1)));
      let types = atEnd && deflt
        ? [{
          type: deflt,
          attrs: newAttributes,
        }]
        : undefined;
      let can = canSplit(tr.doc, tr.mapping.map($from.pos), 1, types);
      if (!types
        && !can
        && canSplit(tr.doc, tr.mapping.map($from.pos), 1, deflt ? [{ type: deflt }] : undefined)) {
        can = true;
        types = deflt
          ? [{
            type: deflt,
            attrs: newAttributes,
          }]
          : undefined;
      }
      if (can) {
        tr.split(tr.mapping.map($from.pos), 1, types);
        if (!atEnd
          && !$from.parentOffset
          && $from.parent.type !== deflt
          && $from.node(-1).canReplace($from.index(-1), $from.indexAfter(-1), Fragment.from(deflt === null || deflt === void 0 ? void 0 : deflt.create()))) {
          tr.setNodeMarkup(tr.mapping.map($from.before()), deflt || undefined);
        }
      }
      if (keepMarks) {
        ensureMarks(state, editor.extensionManager.splittableMarks);
      }
      tr.scrollIntoView();
    }
    return true;
  };

  var splitBlock$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    splitBlock: splitBlock
  });

  const splitListItem = typeOrName => ({ tr, state, dispatch, editor, }) => {
    var _a;
    const type = getNodeType(typeOrName, state.schema);
    const { $from, $to } = state.selection;
    // @ts-ignore
    // eslint-disable-next-line
    const node = state.selection.node;
    if ((node && node.isBlock) || $from.depth < 2 || !$from.sameParent($to)) {
      return false;
    }
    const grandParent = $from.node(-1);
    if (grandParent.type !== type) {
      return false;
    }
    const extensionAttributes = editor.extensionManager.attributes;
    if ($from.parent.content.size === 0 && $from.node(-1).childCount === $from.indexAfter(-1)) {
      // In an empty block. If this is a nested list, the wrapping
      // list item should be split. Otherwise, bail out and let next
      // command handle lifting.
      if ($from.depth === 2
        || $from.node(-3).type !== type
        || $from.index(-2) !== $from.node(-2).childCount - 1) {
        return false;
      }
      if (dispatch) {
        let wrap = Fragment.empty;
        const keepItem = $from.index(-1) > 0;
        // Build a fragment containing empty versions of the structure
        // from the outer list item to the parent node of the cursor
        for (let d = $from.depth - (keepItem ? 1 : 2); d >= $from.depth - 3; d -= 1) {
          wrap = Fragment.from($from.node(d).copy(wrap));
        }
        // Add a second list item with an empty default start node
        const newNextTypeAttributes = getSplittedAttributes(extensionAttributes, $from.node().type.name, $from.node().attrs);
        const nextType = ((_a = type.contentMatch.defaultType) === null || _a === void 0 ? void 0 : _a.createAndFill(newNextTypeAttributes)) || undefined;
        wrap = wrap.append(Fragment.from(type.createAndFill(null, nextType) || undefined));
        tr
          .replace($from.before(keepItem ? undefined : -1), $from.after(-3), new Slice(wrap, keepItem ? 3 : 2, 2))
          .setSelection(TextSelection.near(tr.doc.resolve($from.pos + (keepItem ? 3 : 2))))
          .scrollIntoView();
      }
      return true;
    }
    const nextType = $to.pos === $from.end()
      ? grandParent.contentMatchAt(0).defaultType
      : null;
    const newTypeAttributes = getSplittedAttributes(extensionAttributes, grandParent.type.name, grandParent.attrs);
    const newNextTypeAttributes = getSplittedAttributes(extensionAttributes, $from.node().type.name, $from.node().attrs);
    tr.delete($from.pos, $to.pos);
    const types = nextType
      ? [{ type, attrs: newTypeAttributes }, { type: nextType, attrs: newNextTypeAttributes }]
      : [{ type, attrs: newTypeAttributes }];
    if (!canSplit(tr.doc, $from.pos, 2)) {
      return false;
    }
    if (dispatch) {
      tr.split($from.pos, 2, types).scrollIntoView();
    }
    return true;
  };

  var splitListItem$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    splitListItem: splitListItem
  });

  function findParentNodeClosestToPos($pos, predicate) {
    for (let i = $pos.depth; i > 0; i -= 1) {
      const node = $pos.node(i);
      if (predicate(node)) {
        return {
          pos: i > 0 ? $pos.before(i) : 0,
          start: $pos.start(i),
          depth: i,
          node,
        };
      }
    }
  }

  function findParentNode(predicate) {
    return (selection) => findParentNodeClosestToPos(selection.$from, predicate);
  }

  function isList(name, extensions) {
    const { nodeExtensions } = splitExtensions(extensions);
    const extension = nodeExtensions.find(item => item.name === name);
    if (!extension) {
      return false;
    }
    const context = {
      name: extension.name,
      options: extension.options,
    };
    const group = callOrReturn(getExtensionField(extension, 'group', context));
    if (typeof group !== 'string') {
      return false;
    }
    return group.split(' ').includes('list');
  }

  const toggleList = (listTypeOrName, itemTypeOrName) => ({ editor, tr, state, dispatch, chain, commands, can, }) => {
    const { extensions } = editor.options;
    const listType = getNodeType(listTypeOrName, state.schema);
    const itemType = getNodeType(itemTypeOrName, state.schema);
    const { selection } = state;
    const { $from, $to } = selection;
    const range = $from.blockRange($to);
    if (!range) {
      return false;
    }
    const parentList = findParentNode(node => isList(node.type.name, extensions))(selection);
    if (range.depth >= 1 && parentList && range.depth - parentList.depth <= 1) {
      // remove list
      if (parentList.node.type === listType) {
        return commands.liftListItem(itemType);
      }
      // change list type
      if (isList(parentList.node.type.name, extensions)
        && listType.validContent(parentList.node.content)
        && dispatch) {
        tr.setNodeMarkup(parentList.pos, listType);
        return true;
      }
    }
    const canWrapInList = can().wrapInList(listType);
    // try to convert node to paragraph if needed
    if (!canWrapInList) {
      return chain()
        .clearNodes()
        .wrapInList(listType)
        .run();
    }
    return commands.wrapInList(listType);
  };

  var toggleList$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    toggleList: toggleList
  });

  const toggleMark = (typeOrName, attributes = {}) => ({ state, commands }) => {
    const type = getMarkType(typeOrName, state.schema);
    const isActive = isMarkActive(state, type, attributes);
    if (isActive) {
      return commands.unsetMark(type);
    }
    return commands.setMark(type, attributes);
  };

  var toggleMark$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    toggleMark: toggleMark
  });

  const toggleNode = (typeOrName, toggleTypeOrName, attributes = {}) => ({ state, commands }) => {
    const type = getNodeType(typeOrName, state.schema);
    const toggleType = getNodeType(toggleTypeOrName, state.schema);
    const isActive = isNodeActive(state, type, attributes);
    if (isActive) {
      return commands.setNode(toggleType);
    }
    return commands.setNode(type, attributes);
  };

  var toggleNode$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    toggleNode: toggleNode
  });

  const toggleWrap = (typeOrName, attributes = {}) => ({ state, dispatch }) => {
    const type = getNodeType(typeOrName, state.schema);
    const isActive = isNodeActive(state, type, attributes);
    if (isActive) {
      return lift$2(state, dispatch);
    }
    return wrapIn$2(type, attributes)(state, dispatch);
  };

  var toggleWrap$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    toggleWrap: toggleWrap
  });

  const undoInputRule = () => ({ state, dispatch }) => {
    return undoInputRule$2(state, dispatch);
  };

  var undoInputRule$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    undoInputRule: undoInputRule
  });

  const unsetAllMarks = () => ({ tr, state, dispatch }) => {
    const { selection } = tr;
    const { empty, ranges } = selection;
    if (empty) {
      return true;
    }
    if (dispatch) {
      Object
        .entries(state.schema.marks)
        .forEach(([, mark]) => {
          ranges.forEach(range => {
            tr.removeMark(range.$from.pos, range.$to.pos, mark);
          });
        });
    }
    return true;
  };

  var unsetAllMarks$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    unsetAllMarks: unsetAllMarks
  });

  const unsetMark = typeOrName => ({ tr, state, dispatch }) => {
    const { selection } = tr;
    const type = getMarkType(typeOrName, state.schema);
    const { $from, empty, ranges } = selection;
    if (dispatch) {
      if (empty) {
        let { from, to } = selection;
        const range = getMarkRange($from, type);
        if (range) {
          from = range.from;
          to = range.to;
        }
        tr.removeMark(from, to, type);
      }
      else {
        ranges.forEach(range => {
          tr.removeMark(range.$from.pos, range.$to.pos, type);
        });
      }
      tr.removeStoredMark(type);
    }
    return true;
  };

  var unsetMark$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    unsetMark: unsetMark
  });

  const updateAttributes = (typeOrName, attributes = {}) => ({ tr, state, dispatch }) => {
    let nodeType = null;
    let markType = null;
    const schemaType = getSchemaTypeNameByName(typeof typeOrName === 'string'
      ? typeOrName
      : typeOrName.name, state.schema);
    if (!schemaType) {
      return false;
    }
    if (schemaType === 'node') {
      nodeType = getNodeType(typeOrName, state.schema);
    }
    if (schemaType === 'mark') {
      markType = getMarkType(typeOrName, state.schema);
    }
    if (dispatch) {
      tr.selection.ranges.forEach(range => {
        const from = range.$from.pos;
        const to = range.$to.pos;
        state.doc.nodesBetween(from, to, (node, pos) => {
          if (nodeType && nodeType === node.type) {
            tr.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              ...attributes,
            });
          }
          if (markType && node.marks.length) {
            node.marks.forEach(mark => {
              if (markType === mark.type) {
                const trimmedFrom = Math.max(pos, from);
                const trimmedTo = Math.min(pos + node.nodeSize, to);
                tr.addMark(trimmedFrom, trimmedTo, markType.create({
                  ...mark.attrs,
                  ...attributes,
                }));
              }
            });
          }
        });
      });
    }
    return true;
  };

  var updateAttributes$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    updateAttributes: updateAttributes
  });

  const wrapIn = (typeOrName, attributes = {}) => ({ state, dispatch }) => {
    const type = getNodeType(typeOrName, state.schema);
    const isActive = isNodeActive(state, type, attributes);
    if (isActive) {
      return false;
    }
    return wrapIn$2(type, attributes)(state, dispatch);
  };

  var wrapIn$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    wrapIn: wrapIn
  });

  const wrapInList = (typeOrName, attributes = {}) => ({ state, dispatch }) => {
    const type = getNodeType(typeOrName, state.schema);
    return wrapInList$2(type, attributes)(state, dispatch);
  };

  var wrapInList$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    wrapInList: wrapInList
  });

  Extension.create({
    name: 'commands',
    addCommands() {
      return {
        ...blur$1,
        ...clearContent$1,
        ...clearNodes$1,
        ...command$1,
        ...createParagraphNear$1,
        ...deleteRange$1,
        ...deleteSelection$1,
        ...enter$1,
        ...exitCode$1,
        ...extendMarkRange$1,
        ...first$1,
        ...focus$1,
        ...insertContent$1,
        ...insertContentAt$1,
        ...joinBackward$1,
        ...joinForward$1,
        ...keyboardShortcut$1,
        ...lift$1,
        ...liftEmptyBlock$1,
        ...liftListItem$1,
        ...newlineInCode$1,
        ...replace$1,
        ...replaceRange$1,
        ...resetAttributes$1,
        ...scrollIntoView$1,
        ...selectAll$1,
        ...selectNodeBackward$1,
        ...selectNodeForward$1,
        ...selectParentNode$1,
        ...setContent$1$1,
        ...setMark$1,
        ...setNode$1,
        ...setNodeSelection$1,
        ...setTextSelection$1,
        ...sinkListItem$1,
        ...splitBlock$1,
        ...splitListItem$1,
        ...toggleList$1,
        ...toggleMark$1,
        ...toggleNode$1,
        ...toggleWrap$1,
        ...undoInputRule$1,
        ...unsetAllMarks$1,
        ...unsetMark$1,
        ...updateAttributes$1,
        ...wrapIn$1,
        ...wrapInList$1,
      };
    },
  });

  Extension.create({
    name: 'editable',
    addProseMirrorPlugins() {
      return [
        new Plugin({
          key: new PluginKey('editable'),
          props: {
            editable: () => this.editor.options.editable,
          },
        }),
      ];
    },
  });

  Extension.create({
    name: 'focusEvents',
    addProseMirrorPlugins() {
      const { editor } = this;
      return [
        new Plugin({
          key: new PluginKey('focusEvents'),
          props: {
            attributes: {
              tabindex: '0',
            },
            handleDOMEvents: {
              focus: (view, event) => {
                editor.isFocused = true;
                const transaction = editor.state.tr
                  .setMeta('focus', { event })
                  .setMeta('addToHistory', false);
                view.dispatch(transaction);
                return false;
              },
              blur: (view, event) => {
                editor.isFocused = false;
                const transaction = editor.state.tr
                  .setMeta('blur', { event })
                  .setMeta('addToHistory', false);
                view.dispatch(transaction);
                return false;
              },
            },
          },
        }),
      ];
    },
  });

  Extension.create({
    name: 'keymap',
    addKeyboardShortcuts() {
      const handleBackspace = () => this.editor.commands.first(({ commands }) => [
        () => commands.undoInputRule(),
        () => commands.deleteSelection(),
        () => commands.joinBackward(),
        () => commands.selectNodeBackward(),
      ]);
      const handleDelete = () => this.editor.commands.first(({ commands }) => [
        () => commands.deleteSelection(),
        () => commands.joinForward(),
        () => commands.selectNodeForward(),
      ]);
      return {
        Enter: () => this.editor.commands.first(({ commands }) => [
          () => commands.newlineInCode(),
          () => commands.createParagraphNear(),
          () => commands.liftEmptyBlock(),
          () => commands.splitBlock(),
        ]),
        'Mod-Enter': () => this.editor.commands.exitCode(),
        Backspace: () => handleBackspace(),
        'Mod-Backspace': () => handleBackspace(),
        Delete: () => handleDelete(),
        'Mod-Delete': () => handleDelete(),
        // we don’t need a custom `selectAll` for now
        // 'Mod-a': () => this.editor.commands.selectAll(),
      };
    },
  });

  class Node {
    constructor(config = {}) {
      this.type = 'node';
      this.name = 'node';
      this.parent = null;
      this.child = null;
      this.config = {
        name: this.name,
        defaultOptions: {},
      };
      this.config = {
        ...this.config,
        ...config,
      };
      this.name = this.config.name;
      this.options = this.config.defaultOptions;
    }
    static create(config = {}) {
      return new Node(config);
    }
    configure(options = {}) {
      this.options = mergeDeep(this.options, options);
      return this;
    }
    extend(extendedConfig = {}) {
      const extension = new Node(extendedConfig);
      extension.parent = this;
      this.child = extension;
      extension.name = extendedConfig.name
        ? extendedConfig.name
        : extension.parent.name;
      extension.options = extendedConfig.defaultOptions
        ? extendedConfig.defaultOptions
        : extension.parent.options;
      return extension;
    }
  }

  class Mark {
    constructor(config = {}) {
      this.type = 'mark';
      this.name = 'mark';
      this.parent = null;
      this.child = null;
      this.config = {
        name: this.name,
        defaultOptions: {},
      };
      this.config = {
        ...this.config,
        ...config,
      };
      this.name = this.config.name;
      this.options = this.config.defaultOptions;
    }
    static create(config = {}) {
      return new Mark(config);
    }
    configure(options = {}) {
      this.options = mergeDeep(this.options, options);
      return this;
    }
    extend(extendedConfig = {}) {
      const extension = new Mark(extendedConfig);
      extension.parent = this;
      this.child = extension;
      extension.name = extendedConfig.name
        ? extendedConfig.name
        : extension.parent.name;
      extension.options = extendedConfig.defaultOptions
        ? extendedConfig.defaultOptions
        : extension.parent.options;
      return extension;
    }
  }

  function nodeInputRule(regexp, type, getAttributes) {
    return new InputRule(regexp, (state, match, start, end) => {
      const attributes = getAttributes instanceof Function
        ? getAttributes(match)
        : getAttributes;
      const { tr } = state;
      if (match[0]) {
        tr.replaceWith(start - 1, end, type.create(attributes));
      }
      return tr;
    });
  }

  function getMarksBetween(from, to, state) {
    let marks = [];
    state.doc.nodesBetween(from, to, (node, pos) => {
      marks = [...marks, ...node.marks.map(mark => ({
        from: pos,
        to: pos + node.nodeSize,
        mark,
      }))];
    });
    return marks;
  }

  function markInputRule(regexp, markType, getAttributes) {
    return new InputRule(regexp, (state, match, start, end) => {
      const attributes = getAttributes instanceof Function
        ? getAttributes(match)
        : getAttributes;
      const { tr } = state;
      const captureGroup = match[match.length - 1];
      const fullMatch = match[0];
      let markEnd = end;
      if (captureGroup) {
        const startSpaces = fullMatch.search(/\S/);
        const textStart = start + fullMatch.indexOf(captureGroup);
        const textEnd = textStart + captureGroup.length;
        const excludedMarks = getMarksBetween(start, end, state)
          .filter(item => {
            // TODO: PR to add excluded to MarkType
            // @ts-ignore
            const { excluded } = item.mark.type;
            return excluded.find((type) => type.name === markType.name);
          })
          .filter(item => item.to > textStart);
        if (excludedMarks.length) {
          return null;
        }
        if (textEnd < end) {
          tr.delete(textEnd, end);
        }
        if (textStart > start) {
          tr.delete(start + startSpaces, textStart);
        }
        markEnd = start + startSpaces + captureGroup.length;
        tr.addMark(start + startSpaces, markEnd, markType.create(attributes));
        tr.removeStoredMark(markType);
      }
      return tr;
    });
  }

  function markPasteRule(regexp, type, getAttributes) {
    const handler = (fragment, parent) => {
      const nodes = [];
      fragment.forEach(child => {
        if (child.isText && child.text) {
          const { text } = child;
          let pos = 0;
          let match;
          // eslint-disable-next-line
          while ((match = regexp.exec(text)) !== null) {
            const outerMatch = Math.max(match.length - 2, 0);
            const innerMatch = Math.max(match.length - 1, 0);
            if (parent === null || parent === void 0 ? void 0 : parent.type.allowsMarkType(type)) {
              const start = match.index;
              const matchStart = start + match[0].indexOf(match[outerMatch]);
              const matchEnd = matchStart + match[outerMatch].length;
              const textStart = matchStart + match[outerMatch].lastIndexOf(match[innerMatch]);
              const textEnd = textStart + match[innerMatch].length;
              const attrs = getAttributes instanceof Function
                ? getAttributes(match)
                : getAttributes;
              // adding text before markdown to nodes
              if (matchStart > 0) {
                nodes.push(child.cut(pos, matchStart));
              }
              // adding the markdown part to nodes
              nodes.push(child
                .cut(textStart, textEnd)
                .mark(type.create(attrs).addToSet(child.marks)));
              pos = matchEnd;
            }
          }
          // adding rest of text to nodes
          if (pos < text.length) {
            nodes.push(child.cut(pos));
          }
        }
        else {
          nodes.push(child.copy(handler(child.content, child)));
        }
      });
      return Fragment.fromArray(nodes);
    };
    return new Plugin({
      key: new PluginKey('markPasteRule'),
      props: {
        transformPasted: slice => {
          return new Slice(handler(slice.content), slice.openStart, slice.openEnd);
        },
      },
    });
  }

  function textRange(node, from, to) {
    const range = document.createRange();
    range.setEnd(node, typeof to === 'number' ? to : (node.nodeValue || '').length);
    range.setStart(node, Math.max(from || 0, 0));
    return range;
  }
  function singleRect(object, bias) {
    const rects = object.getClientRects();
    return !rects.length
      ? object.getBoundingClientRect()
      : rects[bias < 0 ? 0 : rects.length - 1];
  }
  function coordsAtPos(view, pos, end = false) {
    const { node, offset } = view.domAtPos(pos); // view.docView.domFromPos(pos);
    let side = null;
    let rect = null;
    if (node.nodeType === 3) {
      const nodeValue = node.nodeValue || '';
      if (end && offset < nodeValue.length) {
        rect = singleRect(textRange(node, offset - 1, offset), -1);
        side = 'right';
      }
      else if (offset < nodeValue.length) {
        rect = singleRect(textRange(node, offset, offset + 1), -1);
        side = 'left';
      }
    }
    else if (node.firstChild) {
      if (offset < node.childNodes.length) {
        const child = node.childNodes[offset];
        rect = singleRect(child.nodeType === 3 ? textRange(child) : child, -1);
        side = 'left';
      }
      if ((!rect || rect.top === rect.bottom) && offset) {
        const child = node.childNodes[offset - 1];
        rect = singleRect(child.nodeType === 3 ? textRange(child) : child, 1);
        side = 'right';
      }
    }
    else {
      const element = node;
      rect = element.getBoundingClientRect();
      side = 'left';
    }
    if (rect && side) {
      const x = rect[side];
      return {
        top: rect.top,
        bottom: rect.bottom,
        left: x,
        right: x,
      };
    }
    return {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    };
  }

  function posToDOMRect(view, from, to) {
    const start = coordsAtPos(view, from);
    const end = coordsAtPos(view, to, true);
    const top = Math.min(start.top, end.top);
    const bottom = Math.max(start.bottom, end.bottom);
    const left = Math.min(start.left, end.left);
    const right = Math.max(start.right, end.right);
    const width = right - left;
    const height = bottom - top;
    const x = left;
    const y = top;
    const data = {
      top,
      bottom,
      left,
      right,
      width,
      height,
      x,
      y,
    };
    console.log(data);
    return {
      ...data,
      toJSON: () => data,
    };
  }

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

  var Image = Image__default['default'].extend({
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

  const inputRegex$4 = /^\s*>\s$/gm;
  const Blockquote = Node.create({
      name: 'blockquote',
      defaultOptions: {
          HTMLAttributes: {},
      },
      content: 'block*',
      group: 'block',
      defining: true,
      parseHTML() {
          return [
              { tag: 'blockquote' },
          ];
      },
      renderHTML({ HTMLAttributes }) {
          return ['blockquote', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
      },
      addCommands() {
          return {
              setBlockquote: () => ({ commands }) => {
                  return commands.wrapIn('blockquote');
              },
              toggleBlockquote: () => ({ commands }) => {
                  return commands.toggleWrap('blockquote');
              },
              unsetBlockquote: () => ({ commands }) => {
                  return commands.lift('blockquote');
              },
          };
      },
      addKeyboardShortcuts() {
          return {
              'Mod-Shift-b': () => this.editor.commands.toggleBlockquote(),
          };
      },
      addInputRules() {
          return [
              wrappingInputRule(inputRegex$4, this.type),
          ];
      },
  });

  const starInputRegex$1 = /(?:^|\s)((?:\*\*)((?:[^*]+))(?:\*\*))$/gm;
  const starPasteRegex$1 = /(?:^|\s)((?:\*\*)((?:[^*]+))(?:\*\*))/gm;
  const underscoreInputRegex$1 = /(?:^|\s)((?:__)((?:[^__]+))(?:__))$/gm;
  const underscorePasteRegex$1 = /(?:^|\s)((?:__)((?:[^__]+))(?:__))/gm;
  const Bold = Mark.create({
      name: 'bold',
      defaultOptions: {
          HTMLAttributes: {},
      },
      parseHTML() {
          return [
              {
                  tag: 'strong',
              },
              {
                  tag: 'b',
                  getAttrs: node => node.style.fontWeight !== 'normal' && null,
              },
              {
                  style: 'font-weight',
                  getAttrs: value => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null,
              },
          ];
      },
      renderHTML({ HTMLAttributes }) {
          return ['strong', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
      },
      addCommands() {
          return {
              setBold: () => ({ commands }) => {
                  return commands.setMark('bold');
              },
              toggleBold: () => ({ commands }) => {
                  return commands.toggleMark('bold');
              },
              unsetBold: () => ({ commands }) => {
                  return commands.unsetMark('bold');
              },
          };
      },
      addKeyboardShortcuts() {
          return {
              'Mod-b': () => this.editor.commands.toggleBold(),
          };
      },
      addInputRules() {
          return [
              markInputRule(starInputRegex$1, this.type),
              markInputRule(underscoreInputRegex$1, this.type),
          ];
      },
      addPasteRules() {
          return [
              markPasteRule(starPasteRegex$1, this.type),
              markPasteRule(underscorePasteRegex$1, this.type),
          ];
      },
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
        deleteSelection$2(state, dispatch);
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
      BubbleMenu: vue2.BubbleMenu,
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

  var top = 'top';
  var bottom = 'bottom';
  var right = 'right';
  var left = 'left';
  var auto = 'auto';
  var basePlacements = [top, bottom, right, left];
  var start = 'start';
  var end = 'end';
  var clippingParents = 'clippingParents';
  var viewport = 'viewport';
  var popper = 'popper';
  var reference = 'reference';
  var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
    return acc.concat([placement + "-" + start, placement + "-" + end]);
  }, []);
  var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
    return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
  }, []); // modifiers that need to read the DOM

  var beforeRead = 'beforeRead';
  var read = 'read';
  var afterRead = 'afterRead'; // pure-logic modifiers

  var beforeMain = 'beforeMain';
  var main = 'main';
  var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

  var beforeWrite = 'beforeWrite';
  var write = 'write';
  var afterWrite = 'afterWrite';
  var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

  function getNodeName(element) {
    return element ? (element.nodeName || '').toLowerCase() : null;
  }

  function getWindow(node) {
    if (node == null) {
      return window;
    }

    if (node.toString() !== '[object Window]') {
      var ownerDocument = node.ownerDocument;
      return ownerDocument ? ownerDocument.defaultView || window : window;
    }

    return node;
  }

  function isElement$1(node) {
    var OwnElement = getWindow(node).Element;
    return node instanceof OwnElement || node instanceof Element;
  }

  function isHTMLElement(node) {
    var OwnElement = getWindow(node).HTMLElement;
    return node instanceof OwnElement || node instanceof HTMLElement;
  }

  function isShadowRoot(node) {
    // IE 11 has no ShadowRoot
    if (typeof ShadowRoot === 'undefined') {
      return false;
    }

    var OwnElement = getWindow(node).ShadowRoot;
    return node instanceof OwnElement || node instanceof ShadowRoot;
  }

  // and applies them to the HTMLElements such as popper and arrow

  function applyStyles(_ref) {
    var state = _ref.state;
    Object.keys(state.elements).forEach(function (name) {
      var style = state.styles[name] || {};
      var attributes = state.attributes[name] || {};
      var element = state.elements[name]; // arrow is optional + virtual elements

      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      } // Flow doesn't support to extend this property, but it's the most
      // effective way to apply styles to an HTMLElement
      // $FlowFixMe[cannot-write]


      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function (name) {
        var value = attributes[name];

        if (value === false) {
          element.removeAttribute(name);
        } else {
          element.setAttribute(name, value === true ? '' : value);
        }
      });
    });
  }

  function effect$2(_ref2) {
    var state = _ref2.state;
    var initialStyles = {
      popper: {
        position: state.options.strategy,
        left: '0',
        top: '0',
        margin: '0'
      },
      arrow: {
        position: 'absolute'
      },
      reference: {}
    };
    Object.assign(state.elements.popper.style, initialStyles.popper);
    state.styles = initialStyles;

    if (state.elements.arrow) {
      Object.assign(state.elements.arrow.style, initialStyles.arrow);
    }

    return function () {
      Object.keys(state.elements).forEach(function (name) {
        var element = state.elements[name];
        var attributes = state.attributes[name] || {};
        var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

        var style = styleProperties.reduce(function (style, property) {
          style[property] = '';
          return style;
        }, {}); // arrow is optional + virtual elements

        if (!isHTMLElement(element) || !getNodeName(element)) {
          return;
        }

        Object.assign(element.style, style);
        Object.keys(attributes).forEach(function (attribute) {
          element.removeAttribute(attribute);
        });
      });
    };
  } // eslint-disable-next-line import/no-unused-modules


  var applyStyles$1 = {
    name: 'applyStyles',
    enabled: true,
    phase: 'write',
    fn: applyStyles,
    effect: effect$2,
    requires: ['computeStyles']
  };

  function getBasePlacement$1(placement) {
    return placement.split('-')[0];
  }

  function getBoundingClientRect(element) {
    var rect = element.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
      x: rect.left,
      y: rect.top
    };
  }

  // means it doesn't take into account transforms.

  function getLayoutRect(element) {
    var clientRect = getBoundingClientRect(element); // Use the clientRect sizes if it's not been transformed.
    // Fixes https://github.com/popperjs/popper-core/issues/1223

    var width = element.offsetWidth;
    var height = element.offsetHeight;

    if (Math.abs(clientRect.width - width) <= 1) {
      width = clientRect.width;
    }

    if (Math.abs(clientRect.height - height) <= 1) {
      height = clientRect.height;
    }

    return {
      x: element.offsetLeft,
      y: element.offsetTop,
      width: width,
      height: height
    };
  }

  function contains(parent, child) {
    var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

    if (parent.contains(child)) {
      return true;
    } // then fallback to custom implementation with Shadow DOM support
    else if (rootNode && isShadowRoot(rootNode)) {
        var next = child;

        do {
          if (next && parent.isSameNode(next)) {
            return true;
          } // $FlowFixMe[prop-missing]: need a better way to handle this...


          next = next.parentNode || next.host;
        } while (next);
      } // Give up, the result is false


    return false;
  }

  function getComputedStyle$1(element) {
    return getWindow(element).getComputedStyle(element);
  }

  function isTableElement(element) {
    return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
  }

  function getDocumentElement(element) {
    // $FlowFixMe[incompatible-return]: assume body is always available
    return ((isElement$1(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
    element.document) || window.document).documentElement;
  }

  function getParentNode(element) {
    if (getNodeName(element) === 'html') {
      return element;
    }

    return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
      // $FlowFixMe[incompatible-return]
      // $FlowFixMe[prop-missing]
      element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
      element.parentNode || ( // DOM Element detected
      isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
      // $FlowFixMe[incompatible-call]: HTMLElement is a Node
      getDocumentElement(element) // fallback

    );
  }

  function getTrueOffsetParent(element) {
    if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
    getComputedStyle$1(element).position === 'fixed') {
      return null;
    }

    return element.offsetParent;
  } // `.offsetParent` reports `null` for fixed elements, while absolute elements
  // return the containing block


  function getContainingBlock(element) {
    var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') !== -1;
    var isIE = navigator.userAgent.indexOf('Trident') !== -1;

    if (isIE && isHTMLElement(element)) {
      // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
      var elementCss = getComputedStyle$1(element);

      if (elementCss.position === 'fixed') {
        return null;
      }
    }

    var currentNode = getParentNode(element);

    while (isHTMLElement(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
      var css = getComputedStyle$1(currentNode); // This is non-exhaustive but covers the most common CSS properties that
      // create a containing block.
      // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

      if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
        return currentNode;
      } else {
        currentNode = currentNode.parentNode;
      }
    }

    return null;
  } // Gets the closest ancestor positioned element. Handles some edge cases,
  // such as table ancestors and cross browser bugs.


  function getOffsetParent(element) {
    var window = getWindow(element);
    var offsetParent = getTrueOffsetParent(element);

    while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === 'static') {
      offsetParent = getTrueOffsetParent(offsetParent);
    }

    if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle$1(offsetParent).position === 'static')) {
      return window;
    }

    return offsetParent || getContainingBlock(element) || window;
  }

  function getMainAxisFromPlacement(placement) {
    return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
  }

  var max = Math.max;
  var min = Math.min;
  var round = Math.round;

  function within(min$1, value, max$1) {
    return max(min$1, min(value, max$1));
  }

  function getFreshSideObject() {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };
  }

  function mergePaddingObject(paddingObject) {
    return Object.assign({}, getFreshSideObject(), paddingObject);
  }

  function expandToHashMap(value, keys) {
    return keys.reduce(function (hashMap, key) {
      hashMap[key] = value;
      return hashMap;
    }, {});
  }

  var toPaddingObject = function toPaddingObject(padding, state) {
    padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
      placement: state.placement
    })) : padding;
    return mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
  };

  function arrow$2(_ref) {
    var _state$modifiersData$;

    var state = _ref.state,
        name = _ref.name,
        options = _ref.options;
    var arrowElement = state.elements.arrow;
    var popperOffsets = state.modifiersData.popperOffsets;
    var basePlacement = getBasePlacement$1(state.placement);
    var axis = getMainAxisFromPlacement(basePlacement);
    var isVertical = [left, right].indexOf(basePlacement) >= 0;
    var len = isVertical ? 'height' : 'width';

    if (!arrowElement || !popperOffsets) {
      return;
    }

    var paddingObject = toPaddingObject(options.padding, state);
    var arrowRect = getLayoutRect(arrowElement);
    var minProp = axis === 'y' ? top : left;
    var maxProp = axis === 'y' ? bottom : right;
    var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
    var startDiff = popperOffsets[axis] - state.rects.reference[axis];
    var arrowOffsetParent = getOffsetParent(arrowElement);
    var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
    var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
    // outside of the popper bounds

    var min = paddingObject[minProp];
    var max = clientSize - arrowRect[len] - paddingObject[maxProp];
    var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
    var offset = within(min, center, max); // Prevents breaking syntax highlighting...

    var axisProp = axis;
    state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
  }

  function effect$1(_ref2) {
    var state = _ref2.state,
        options = _ref2.options;
    var _options$element = options.element,
        arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

    if (arrowElement == null) {
      return;
    } // CSS selector


    if (typeof arrowElement === 'string') {
      arrowElement = state.elements.popper.querySelector(arrowElement);

      if (!arrowElement) {
        return;
      }
    }

    {
      if (!isHTMLElement(arrowElement)) {
        console.error(['Popper: "arrow" element must be an HTMLElement (not an SVGElement).', 'To use an SVG arrow, wrap it in an HTMLElement that will be used as', 'the arrow.'].join(' '));
      }
    }

    if (!contains(state.elements.popper, arrowElement)) {
      {
        console.error(['Popper: "arrow" modifier\'s `element` must be a child of the popper', 'element.'].join(' '));
      }

      return;
    }

    state.elements.arrow = arrowElement;
  } // eslint-disable-next-line import/no-unused-modules


  var arrow$3 = {
    name: 'arrow',
    enabled: true,
    phase: 'main',
    fn: arrow$2,
    effect: effect$1,
    requires: ['popperOffsets'],
    requiresIfExists: ['preventOverflow']
  };

  var unsetSides = {
    top: 'auto',
    right: 'auto',
    bottom: 'auto',
    left: 'auto'
  }; // Round the offsets to the nearest suitable subpixel based on the DPR.
  // Zooming can change the DPR, but it seems to report a value that will
  // cleanly divide the values into the appropriate subpixels.

  function roundOffsetsByDPR(_ref) {
    var x = _ref.x,
        y = _ref.y;
    var win = window;
    var dpr = win.devicePixelRatio || 1;
    return {
      x: round(round(x * dpr) / dpr) || 0,
      y: round(round(y * dpr) / dpr) || 0
    };
  }

  function mapToStyles(_ref2) {
    var _Object$assign2;

    var popper = _ref2.popper,
        popperRect = _ref2.popperRect,
        placement = _ref2.placement,
        offsets = _ref2.offsets,
        position = _ref2.position,
        gpuAcceleration = _ref2.gpuAcceleration,
        adaptive = _ref2.adaptive,
        roundOffsets = _ref2.roundOffsets;

    var _ref3 = roundOffsets === true ? roundOffsetsByDPR(offsets) : typeof roundOffsets === 'function' ? roundOffsets(offsets) : offsets,
        _ref3$x = _ref3.x,
        x = _ref3$x === void 0 ? 0 : _ref3$x,
        _ref3$y = _ref3.y,
        y = _ref3$y === void 0 ? 0 : _ref3$y;

    var hasX = offsets.hasOwnProperty('x');
    var hasY = offsets.hasOwnProperty('y');
    var sideX = left;
    var sideY = top;
    var win = window;

    if (adaptive) {
      var offsetParent = getOffsetParent(popper);
      var heightProp = 'clientHeight';
      var widthProp = 'clientWidth';

      if (offsetParent === getWindow(popper)) {
        offsetParent = getDocumentElement(popper);

        if (getComputedStyle$1(offsetParent).position !== 'static') {
          heightProp = 'scrollHeight';
          widthProp = 'scrollWidth';
        }
      } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


      offsetParent = offsetParent;

      if (placement === top) {
        sideY = bottom; // $FlowFixMe[prop-missing]

        y -= offsetParent[heightProp] - popperRect.height;
        y *= gpuAcceleration ? 1 : -1;
      }

      if (placement === left) {
        sideX = right; // $FlowFixMe[prop-missing]

        x -= offsetParent[widthProp] - popperRect.width;
        x *= gpuAcceleration ? 1 : -1;
      }
    }

    var commonStyles = Object.assign({
      position: position
    }, adaptive && unsetSides);

    if (gpuAcceleration) {
      var _Object$assign;

      return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) < 2 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
    }

    return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
  }

  function computeStyles(_ref4) {
    var state = _ref4.state,
        options = _ref4.options;
    var _options$gpuAccelerat = options.gpuAcceleration,
        gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
        _options$adaptive = options.adaptive,
        adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
        _options$roundOffsets = options.roundOffsets,
        roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;

    {
      var transitionProperty = getComputedStyle$1(state.elements.popper).transitionProperty || '';

      if (adaptive && ['transform', 'top', 'right', 'bottom', 'left'].some(function (property) {
        return transitionProperty.indexOf(property) >= 0;
      })) {
        console.warn(['Popper: Detected CSS transitions on at least one of the following', 'CSS properties: "transform", "top", "right", "bottom", "left".', '\n\n', 'Disable the "computeStyles" modifier\'s `adaptive` option to allow', 'for smooth transitions, or remove these properties from the CSS', 'transition declaration on the popper element if only transitioning', 'opacity or background-color for example.', '\n\n', 'We recommend using the popper element as a wrapper around an inner', 'element that can have any CSS property transitioned for animations.'].join(' '));
      }
    }

    var commonStyles = {
      placement: getBasePlacement$1(state.placement),
      popper: state.elements.popper,
      popperRect: state.rects.popper,
      gpuAcceleration: gpuAcceleration
    };

    if (state.modifiersData.popperOffsets != null) {
      state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
        offsets: state.modifiersData.popperOffsets,
        position: state.options.strategy,
        adaptive: adaptive,
        roundOffsets: roundOffsets
      })));
    }

    if (state.modifiersData.arrow != null) {
      state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
        offsets: state.modifiersData.arrow,
        position: 'absolute',
        adaptive: false,
        roundOffsets: roundOffsets
      })));
    }

    state.attributes.popper = Object.assign({}, state.attributes.popper, {
      'data-popper-placement': state.placement
    });
  } // eslint-disable-next-line import/no-unused-modules


  var computeStyles$1 = {
    name: 'computeStyles',
    enabled: true,
    phase: 'beforeWrite',
    fn: computeStyles,
    data: {}
  };

  var passive = {
    passive: true
  };

  function effect(_ref) {
    var state = _ref.state,
        instance = _ref.instance,
        options = _ref.options;
    var _options$scroll = options.scroll,
        scroll = _options$scroll === void 0 ? true : _options$scroll,
        _options$resize = options.resize,
        resize = _options$resize === void 0 ? true : _options$resize;
    var window = getWindow(state.elements.popper);
    var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

    if (scroll) {
      scrollParents.forEach(function (scrollParent) {
        scrollParent.addEventListener('scroll', instance.update, passive);
      });
    }

    if (resize) {
      window.addEventListener('resize', instance.update, passive);
    }

    return function () {
      if (scroll) {
        scrollParents.forEach(function (scrollParent) {
          scrollParent.removeEventListener('scroll', instance.update, passive);
        });
      }

      if (resize) {
        window.removeEventListener('resize', instance.update, passive);
      }
    };
  } // eslint-disable-next-line import/no-unused-modules


  var eventListeners = {
    name: 'eventListeners',
    enabled: true,
    phase: 'write',
    fn: function fn() {},
    effect: effect,
    data: {}
  };

  var hash$1 = {
    left: 'right',
    right: 'left',
    bottom: 'top',
    top: 'bottom'
  };
  function getOppositePlacement(placement) {
    return placement.replace(/left|right|bottom|top/g, function (matched) {
      return hash$1[matched];
    });
  }

  var hash = {
    start: 'end',
    end: 'start'
  };
  function getOppositeVariationPlacement(placement) {
    return placement.replace(/start|end/g, function (matched) {
      return hash[matched];
    });
  }

  function getWindowScroll(node) {
    var win = getWindow(node);
    var scrollLeft = win.pageXOffset;
    var scrollTop = win.pageYOffset;
    return {
      scrollLeft: scrollLeft,
      scrollTop: scrollTop
    };
  }

  function getWindowScrollBarX(element) {
    // If <html> has a CSS width greater than the viewport, then this will be
    // incorrect for RTL.
    // Popper 1 is broken in this case and never had a bug report so let's assume
    // it's not an issue. I don't think anyone ever specifies width on <html>
    // anyway.
    // Browsers where the left scrollbar doesn't cause an issue report `0` for
    // this (e.g. Edge 2019, IE11, Safari)
    return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
  }

  function getViewportRect(element) {
    var win = getWindow(element);
    var html = getDocumentElement(element);
    var visualViewport = win.visualViewport;
    var width = html.clientWidth;
    var height = html.clientHeight;
    var x = 0;
    var y = 0; // NB: This isn't supported on iOS <= 12. If the keyboard is open, the popper
    // can be obscured underneath it.
    // Also, `html.clientHeight` adds the bottom bar height in Safari iOS, even
    // if it isn't open, so if this isn't available, the popper will be detected
    // to overflow the bottom of the screen too early.

    if (visualViewport) {
      width = visualViewport.width;
      height = visualViewport.height; // Uses Layout Viewport (like Chrome; Safari does not currently)
      // In Chrome, it returns a value very close to 0 (+/-) but contains rounding
      // errors due to floating point numbers, so we need to check precision.
      // Safari returns a number <= 0, usually < -1 when pinch-zoomed
      // Feature detection fails in mobile emulation mode in Chrome.
      // Math.abs(win.innerWidth / visualViewport.scale - visualViewport.width) <
      // 0.001
      // Fallback here: "Not Safari" userAgent

      if (!/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
        x = visualViewport.offsetLeft;
        y = visualViewport.offsetTop;
      }
    }

    return {
      width: width,
      height: height,
      x: x + getWindowScrollBarX(element),
      y: y
    };
  }

  // of the `<html>` and `<body>` rect bounds if horizontally scrollable

  function getDocumentRect(element) {
    var _element$ownerDocumen;

    var html = getDocumentElement(element);
    var winScroll = getWindowScroll(element);
    var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
    var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
    var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
    var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
    var y = -winScroll.scrollTop;

    if (getComputedStyle$1(body || html).direction === 'rtl') {
      x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
    }

    return {
      width: width,
      height: height,
      x: x,
      y: y
    };
  }

  function isScrollParent(element) {
    // Firefox wants us to check `-x` and `-y` variations as well
    var _getComputedStyle = getComputedStyle$1(element),
        overflow = _getComputedStyle.overflow,
        overflowX = _getComputedStyle.overflowX,
        overflowY = _getComputedStyle.overflowY;

    return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
  }

  function getScrollParent(node) {
    if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
      // $FlowFixMe[incompatible-return]: assume body is always available
      return node.ownerDocument.body;
    }

    if (isHTMLElement(node) && isScrollParent(node)) {
      return node;
    }

    return getScrollParent(getParentNode(node));
  }

  /*
  given a DOM element, return the list of all scroll parents, up the list of ancesors
  until we get to the top window object. This list is what we attach scroll listeners
  to, because if any of these parent elements scroll, we'll need to re-calculate the
  reference element's position.
  */

  function listScrollParents(element, list) {
    var _element$ownerDocumen;

    if (list === void 0) {
      list = [];
    }

    var scrollParent = getScrollParent(element);
    var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
    var win = getWindow(scrollParent);
    var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
    var updatedList = list.concat(target);
    return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
    updatedList.concat(listScrollParents(getParentNode(target)));
  }

  function rectToClientRect(rect) {
    return Object.assign({}, rect, {
      left: rect.x,
      top: rect.y,
      right: rect.x + rect.width,
      bottom: rect.y + rect.height
    });
  }

  function getInnerBoundingClientRect(element) {
    var rect = getBoundingClientRect(element);
    rect.top = rect.top + element.clientTop;
    rect.left = rect.left + element.clientLeft;
    rect.bottom = rect.top + element.clientHeight;
    rect.right = rect.left + element.clientWidth;
    rect.width = element.clientWidth;
    rect.height = element.clientHeight;
    rect.x = rect.left;
    rect.y = rect.top;
    return rect;
  }

  function getClientRectFromMixedType(element, clippingParent) {
    return clippingParent === viewport ? rectToClientRect(getViewportRect(element)) : isHTMLElement(clippingParent) ? getInnerBoundingClientRect(clippingParent) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
  } // A "clipping parent" is an overflowable container with the characteristic of
  // clipping (or hiding) overflowing elements with a position different from
  // `initial`


  function getClippingParents(element) {
    var clippingParents = listScrollParents(getParentNode(element));
    var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle$1(element).position) >= 0;
    var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;

    if (!isElement$1(clipperElement)) {
      return [];
    } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


    return clippingParents.filter(function (clippingParent) {
      return isElement$1(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body';
    });
  } // Gets the maximum area that the element is visible in due to any number of
  // clipping parents


  function getClippingRect(element, boundary, rootBoundary) {
    var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
    var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
    var firstClippingParent = clippingParents[0];
    var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
      var rect = getClientRectFromMixedType(element, clippingParent);
      accRect.top = max(rect.top, accRect.top);
      accRect.right = min(rect.right, accRect.right);
      accRect.bottom = min(rect.bottom, accRect.bottom);
      accRect.left = max(rect.left, accRect.left);
      return accRect;
    }, getClientRectFromMixedType(element, firstClippingParent));
    clippingRect.width = clippingRect.right - clippingRect.left;
    clippingRect.height = clippingRect.bottom - clippingRect.top;
    clippingRect.x = clippingRect.left;
    clippingRect.y = clippingRect.top;
    return clippingRect;
  }

  function getVariation(placement) {
    return placement.split('-')[1];
  }

  function computeOffsets(_ref) {
    var reference = _ref.reference,
        element = _ref.element,
        placement = _ref.placement;
    var basePlacement = placement ? getBasePlacement$1(placement) : null;
    var variation = placement ? getVariation(placement) : null;
    var commonX = reference.x + reference.width / 2 - element.width / 2;
    var commonY = reference.y + reference.height / 2 - element.height / 2;
    var offsets;

    switch (basePlacement) {
      case top:
        offsets = {
          x: commonX,
          y: reference.y - element.height
        };
        break;

      case bottom:
        offsets = {
          x: commonX,
          y: reference.y + reference.height
        };
        break;

      case right:
        offsets = {
          x: reference.x + reference.width,
          y: commonY
        };
        break;

      case left:
        offsets = {
          x: reference.x - element.width,
          y: commonY
        };
        break;

      default:
        offsets = {
          x: reference.x,
          y: reference.y
        };
    }

    var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;

    if (mainAxis != null) {
      var len = mainAxis === 'y' ? 'height' : 'width';

      switch (variation) {
        case start:
          offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
          break;

        case end:
          offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
          break;
      }
    }

    return offsets;
  }

  function detectOverflow(state, options) {
    if (options === void 0) {
      options = {};
    }

    var _options = options,
        _options$placement = _options.placement,
        placement = _options$placement === void 0 ? state.placement : _options$placement,
        _options$boundary = _options.boundary,
        boundary = _options$boundary === void 0 ? clippingParents : _options$boundary,
        _options$rootBoundary = _options.rootBoundary,
        rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary,
        _options$elementConte = _options.elementContext,
        elementContext = _options$elementConte === void 0 ? popper : _options$elementConte,
        _options$altBoundary = _options.altBoundary,
        altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
        _options$padding = _options.padding,
        padding = _options$padding === void 0 ? 0 : _options$padding;
    var paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
    var altContext = elementContext === popper ? reference : popper;
    var referenceElement = state.elements.reference;
    var popperRect = state.rects.popper;
    var element = state.elements[altBoundary ? altContext : elementContext];
    var clippingClientRect = getClippingRect(isElement$1(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary);
    var referenceClientRect = getBoundingClientRect(referenceElement);
    var popperOffsets = computeOffsets({
      reference: referenceClientRect,
      element: popperRect,
      strategy: 'absolute',
      placement: placement
    });
    var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
    var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
    // 0 or negative = within the clipping rect

    var overflowOffsets = {
      top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
      bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
      left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
      right: elementClientRect.right - clippingClientRect.right + paddingObject.right
    };
    var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

    if (elementContext === popper && offsetData) {
      var offset = offsetData[placement];
      Object.keys(overflowOffsets).forEach(function (key) {
        var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
        var axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
        overflowOffsets[key] += offset[axis] * multiply;
      });
    }

    return overflowOffsets;
  }

  function computeAutoPlacement(state, options) {
    if (options === void 0) {
      options = {};
    }

    var _options = options,
        placement = _options.placement,
        boundary = _options.boundary,
        rootBoundary = _options.rootBoundary,
        padding = _options.padding,
        flipVariations = _options.flipVariations,
        _options$allowedAutoP = _options.allowedAutoPlacements,
        allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
    var variation = getVariation(placement);
    var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function (placement) {
      return getVariation(placement) === variation;
    }) : basePlacements;
    var allowedPlacements = placements$1.filter(function (placement) {
      return allowedAutoPlacements.indexOf(placement) >= 0;
    });

    if (allowedPlacements.length === 0) {
      allowedPlacements = placements$1;

      {
        console.error(['Popper: The `allowedAutoPlacements` option did not allow any', 'placements. Ensure the `placement` option matches the variation', 'of the allowed placements.', 'For example, "auto" cannot be used to allow "bottom-start".', 'Use "auto-start" instead.'].join(' '));
      }
    } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


    var overflows = allowedPlacements.reduce(function (acc, placement) {
      acc[placement] = detectOverflow(state, {
        placement: placement,
        boundary: boundary,
        rootBoundary: rootBoundary,
        padding: padding
      })[getBasePlacement$1(placement)];
      return acc;
    }, {});
    return Object.keys(overflows).sort(function (a, b) {
      return overflows[a] - overflows[b];
    });
  }

  function getExpandedFallbackPlacements(placement) {
    if (getBasePlacement$1(placement) === auto) {
      return [];
    }

    var oppositePlacement = getOppositePlacement(placement);
    return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
  }

  function flip(_ref) {
    var state = _ref.state,
        options = _ref.options,
        name = _ref.name;

    if (state.modifiersData[name]._skip) {
      return;
    }

    var _options$mainAxis = options.mainAxis,
        checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
        _options$altAxis = options.altAxis,
        checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
        specifiedFallbackPlacements = options.fallbackPlacements,
        padding = options.padding,
        boundary = options.boundary,
        rootBoundary = options.rootBoundary,
        altBoundary = options.altBoundary,
        _options$flipVariatio = options.flipVariations,
        flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
        allowedAutoPlacements = options.allowedAutoPlacements;
    var preferredPlacement = state.options.placement;
    var basePlacement = getBasePlacement$1(preferredPlacement);
    var isBasePlacement = basePlacement === preferredPlacement;
    var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
    var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
      return acc.concat(getBasePlacement$1(placement) === auto ? computeAutoPlacement(state, {
        placement: placement,
        boundary: boundary,
        rootBoundary: rootBoundary,
        padding: padding,
        flipVariations: flipVariations,
        allowedAutoPlacements: allowedAutoPlacements
      }) : placement);
    }, []);
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var checksMap = new Map();
    var makeFallbackChecks = true;
    var firstFittingPlacement = placements[0];

    for (var i = 0; i < placements.length; i++) {
      var placement = placements[i];

      var _basePlacement = getBasePlacement$1(placement);

      var isStartVariation = getVariation(placement) === start;
      var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
      var len = isVertical ? 'width' : 'height';
      var overflow = detectOverflow(state, {
        placement: placement,
        boundary: boundary,
        rootBoundary: rootBoundary,
        altBoundary: altBoundary,
        padding: padding
      });
      var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;

      if (referenceRect[len] > popperRect[len]) {
        mainVariationSide = getOppositePlacement(mainVariationSide);
      }

      var altVariationSide = getOppositePlacement(mainVariationSide);
      var checks = [];

      if (checkMainAxis) {
        checks.push(overflow[_basePlacement] <= 0);
      }

      if (checkAltAxis) {
        checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
      }

      if (checks.every(function (check) {
        return check;
      })) {
        firstFittingPlacement = placement;
        makeFallbackChecks = false;
        break;
      }

      checksMap.set(placement, checks);
    }

    if (makeFallbackChecks) {
      // `2` may be desired in some cases – research later
      var numberOfChecks = flipVariations ? 3 : 1;

      var _loop = function _loop(_i) {
        var fittingPlacement = placements.find(function (placement) {
          var checks = checksMap.get(placement);

          if (checks) {
            return checks.slice(0, _i).every(function (check) {
              return check;
            });
          }
        });

        if (fittingPlacement) {
          firstFittingPlacement = fittingPlacement;
          return "break";
        }
      };

      for (var _i = numberOfChecks; _i > 0; _i--) {
        var _ret = _loop(_i);

        if (_ret === "break") break;
      }
    }

    if (state.placement !== firstFittingPlacement) {
      state.modifiersData[name]._skip = true;
      state.placement = firstFittingPlacement;
      state.reset = true;
    }
  } // eslint-disable-next-line import/no-unused-modules


  var flip$1 = {
    name: 'flip',
    enabled: true,
    phase: 'main',
    fn: flip,
    requiresIfExists: ['offset'],
    data: {
      _skip: false
    }
  };

  function getSideOffsets(overflow, rect, preventedOffsets) {
    if (preventedOffsets === void 0) {
      preventedOffsets = {
        x: 0,
        y: 0
      };
    }

    return {
      top: overflow.top - rect.height - preventedOffsets.y,
      right: overflow.right - rect.width + preventedOffsets.x,
      bottom: overflow.bottom - rect.height + preventedOffsets.y,
      left: overflow.left - rect.width - preventedOffsets.x
    };
  }

  function isAnySideFullyClipped(overflow) {
    return [top, right, bottom, left].some(function (side) {
      return overflow[side] >= 0;
    });
  }

  function hide(_ref) {
    var state = _ref.state,
        name = _ref.name;
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var preventedOffsets = state.modifiersData.preventOverflow;
    var referenceOverflow = detectOverflow(state, {
      elementContext: 'reference'
    });
    var popperAltOverflow = detectOverflow(state, {
      altBoundary: true
    });
    var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
    var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
    var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
    var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
    state.modifiersData[name] = {
      referenceClippingOffsets: referenceClippingOffsets,
      popperEscapeOffsets: popperEscapeOffsets,
      isReferenceHidden: isReferenceHidden,
      hasPopperEscaped: hasPopperEscaped
    };
    state.attributes.popper = Object.assign({}, state.attributes.popper, {
      'data-popper-reference-hidden': isReferenceHidden,
      'data-popper-escaped': hasPopperEscaped
    });
  } // eslint-disable-next-line import/no-unused-modules


  var hide$1 = {
    name: 'hide',
    enabled: true,
    phase: 'main',
    requiresIfExists: ['preventOverflow'],
    fn: hide
  };

  function distanceAndSkiddingToXY(placement, rects, offset) {
    var basePlacement = getBasePlacement$1(placement);
    var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;

    var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
      placement: placement
    })) : offset,
        skidding = _ref[0],
        distance = _ref[1];

    skidding = skidding || 0;
    distance = (distance || 0) * invertDistance;
    return [left, right].indexOf(basePlacement) >= 0 ? {
      x: distance,
      y: skidding
    } : {
      x: skidding,
      y: distance
    };
  }

  function offset(_ref2) {
    var state = _ref2.state,
        options = _ref2.options,
        name = _ref2.name;
    var _options$offset = options.offset,
        offset = _options$offset === void 0 ? [0, 0] : _options$offset;
    var data = placements.reduce(function (acc, placement) {
      acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
      return acc;
    }, {});
    var _data$state$placement = data[state.placement],
        x = _data$state$placement.x,
        y = _data$state$placement.y;

    if (state.modifiersData.popperOffsets != null) {
      state.modifiersData.popperOffsets.x += x;
      state.modifiersData.popperOffsets.y += y;
    }

    state.modifiersData[name] = data;
  } // eslint-disable-next-line import/no-unused-modules


  var offset$1 = {
    name: 'offset',
    enabled: true,
    phase: 'main',
    requires: ['popperOffsets'],
    fn: offset
  };

  function popperOffsets(_ref) {
    var state = _ref.state,
        name = _ref.name;
    // Offsets are the actual position the popper needs to have to be
    // properly positioned near its reference element
    // This is the most basic placement, and will be adjusted by
    // the modifiers in the next step
    state.modifiersData[name] = computeOffsets({
      reference: state.rects.reference,
      element: state.rects.popper,
      strategy: 'absolute',
      placement: state.placement
    });
  } // eslint-disable-next-line import/no-unused-modules


  var popperOffsets$1 = {
    name: 'popperOffsets',
    enabled: true,
    phase: 'read',
    fn: popperOffsets,
    data: {}
  };

  function getAltAxis(axis) {
    return axis === 'x' ? 'y' : 'x';
  }

  function preventOverflow(_ref) {
    var state = _ref.state,
        options = _ref.options,
        name = _ref.name;
    var _options$mainAxis = options.mainAxis,
        checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
        _options$altAxis = options.altAxis,
        checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
        boundary = options.boundary,
        rootBoundary = options.rootBoundary,
        altBoundary = options.altBoundary,
        padding = options.padding,
        _options$tether = options.tether,
        tether = _options$tether === void 0 ? true : _options$tether,
        _options$tetherOffset = options.tetherOffset,
        tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
    var overflow = detectOverflow(state, {
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding,
      altBoundary: altBoundary
    });
    var basePlacement = getBasePlacement$1(state.placement);
    var variation = getVariation(state.placement);
    var isBasePlacement = !variation;
    var mainAxis = getMainAxisFromPlacement(basePlacement);
    var altAxis = getAltAxis(mainAxis);
    var popperOffsets = state.modifiersData.popperOffsets;
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
      placement: state.placement
    })) : tetherOffset;
    var data = {
      x: 0,
      y: 0
    };

    if (!popperOffsets) {
      return;
    }

    if (checkMainAxis || checkAltAxis) {
      var mainSide = mainAxis === 'y' ? top : left;
      var altSide = mainAxis === 'y' ? bottom : right;
      var len = mainAxis === 'y' ? 'height' : 'width';
      var offset = popperOffsets[mainAxis];
      var min$1 = popperOffsets[mainAxis] + overflow[mainSide];
      var max$1 = popperOffsets[mainAxis] - overflow[altSide];
      var additive = tether ? -popperRect[len] / 2 : 0;
      var minLen = variation === start ? referenceRect[len] : popperRect[len];
      var maxLen = variation === start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
      // outside the reference bounds

      var arrowElement = state.elements.arrow;
      var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
        width: 0,
        height: 0
      };
      var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject();
      var arrowPaddingMin = arrowPaddingObject[mainSide];
      var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
      // to include its full size in the calculation. If the reference is small
      // and near the edge of a boundary, the popper can overflow even if the
      // reference is not overflowing as well (e.g. virtual elements with no
      // width or height)

      var arrowLen = within(0, referenceRect[len], arrowRect[len]);
      var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - tetherOffsetValue : minLen - arrowLen - arrowPaddingMin - tetherOffsetValue;
      var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + tetherOffsetValue : maxLen + arrowLen + arrowPaddingMax + tetherOffsetValue;
      var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
      var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
      var offsetModifierValue = state.modifiersData.offset ? state.modifiersData.offset[state.placement][mainAxis] : 0;
      var tetherMin = popperOffsets[mainAxis] + minOffset - offsetModifierValue - clientOffset;
      var tetherMax = popperOffsets[mainAxis] + maxOffset - offsetModifierValue;

      if (checkMainAxis) {
        var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset, tether ? max(max$1, tetherMax) : max$1);
        popperOffsets[mainAxis] = preventedOffset;
        data[mainAxis] = preventedOffset - offset;
      }

      if (checkAltAxis) {
        var _mainSide = mainAxis === 'x' ? top : left;

        var _altSide = mainAxis === 'x' ? bottom : right;

        var _offset = popperOffsets[altAxis];

        var _min = _offset + overflow[_mainSide];

        var _max = _offset - overflow[_altSide];

        var _preventedOffset = within(tether ? min(_min, tetherMin) : _min, _offset, tether ? max(_max, tetherMax) : _max);

        popperOffsets[altAxis] = _preventedOffset;
        data[altAxis] = _preventedOffset - _offset;
      }
    }

    state.modifiersData[name] = data;
  } // eslint-disable-next-line import/no-unused-modules


  var preventOverflow$1 = {
    name: 'preventOverflow',
    enabled: true,
    phase: 'main',
    fn: preventOverflow,
    requiresIfExists: ['offset']
  };

  function getHTMLElementScroll(element) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }

  function getNodeScroll(node) {
    if (node === getWindow(node) || !isHTMLElement(node)) {
      return getWindowScroll(node);
    } else {
      return getHTMLElementScroll(node);
    }
  }

  // Composite means it takes into account transforms as well as layout.

  function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
    if (isFixed === void 0) {
      isFixed = false;
    }

    var documentElement = getDocumentElement(offsetParent);
    var rect = getBoundingClientRect(elementOrVirtualElement);
    var isOffsetParentAnElement = isHTMLElement(offsetParent);
    var scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    var offsets = {
      x: 0,
      y: 0
    };

    if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
      if (getNodeName(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
      isScrollParent(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }

      if (isHTMLElement(offsetParent)) {
        offsets = getBoundingClientRect(offsetParent);
        offsets.x += offsetParent.clientLeft;
        offsets.y += offsetParent.clientTop;
      } else if (documentElement) {
        offsets.x = getWindowScrollBarX(documentElement);
      }
    }

    return {
      x: rect.left + scroll.scrollLeft - offsets.x,
      y: rect.top + scroll.scrollTop - offsets.y,
      width: rect.width,
      height: rect.height
    };
  }

  function order(modifiers) {
    var map = new Map();
    var visited = new Set();
    var result = [];
    modifiers.forEach(function (modifier) {
      map.set(modifier.name, modifier);
    }); // On visiting object, check for its dependencies and visit them recursively

    function sort(modifier) {
      visited.add(modifier.name);
      var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
      requires.forEach(function (dep) {
        if (!visited.has(dep)) {
          var depModifier = map.get(dep);

          if (depModifier) {
            sort(depModifier);
          }
        }
      });
      result.push(modifier);
    }

    modifiers.forEach(function (modifier) {
      if (!visited.has(modifier.name)) {
        // check for visited object
        sort(modifier);
      }
    });
    return result;
  }

  function orderModifiers(modifiers) {
    // order based on dependencies
    var orderedModifiers = order(modifiers); // order based on phase

    return modifierPhases.reduce(function (acc, phase) {
      return acc.concat(orderedModifiers.filter(function (modifier) {
        return modifier.phase === phase;
      }));
    }, []);
  }

  function debounce$2(fn) {
    var pending;
    return function () {
      if (!pending) {
        pending = new Promise(function (resolve) {
          Promise.resolve().then(function () {
            pending = undefined;
            resolve(fn());
          });
        });
      }

      return pending;
    };
  }

  function format(str) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return [].concat(args).reduce(function (p, c) {
      return p.replace(/%s/, c);
    }, str);
  }

  var INVALID_MODIFIER_ERROR = 'Popper: modifier "%s" provided an invalid %s property, expected %s but got %s';
  var MISSING_DEPENDENCY_ERROR = 'Popper: modifier "%s" requires "%s", but "%s" modifier is not available';
  var VALID_PROPERTIES = ['name', 'enabled', 'phase', 'fn', 'effect', 'requires', 'options'];
  function validateModifiers(modifiers) {
    modifiers.forEach(function (modifier) {
      Object.keys(modifier).forEach(function (key) {
        switch (key) {
          case 'name':
            if (typeof modifier.name !== 'string') {
              console.error(format(INVALID_MODIFIER_ERROR, String(modifier.name), '"name"', '"string"', "\"" + String(modifier.name) + "\""));
            }

            break;

          case 'enabled':
            if (typeof modifier.enabled !== 'boolean') {
              console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"enabled"', '"boolean"', "\"" + String(modifier.enabled) + "\""));
            }

          case 'phase':
            if (modifierPhases.indexOf(modifier.phase) < 0) {
              console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"phase"', "either " + modifierPhases.join(', '), "\"" + String(modifier.phase) + "\""));
            }

            break;

          case 'fn':
            if (typeof modifier.fn !== 'function') {
              console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"fn"', '"function"', "\"" + String(modifier.fn) + "\""));
            }

            break;

          case 'effect':
            if (typeof modifier.effect !== 'function') {
              console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"effect"', '"function"', "\"" + String(modifier.fn) + "\""));
            }

            break;

          case 'requires':
            if (!Array.isArray(modifier.requires)) {
              console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"requires"', '"array"', "\"" + String(modifier.requires) + "\""));
            }

            break;

          case 'requiresIfExists':
            if (!Array.isArray(modifier.requiresIfExists)) {
              console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"requiresIfExists"', '"array"', "\"" + String(modifier.requiresIfExists) + "\""));
            }

            break;

          case 'options':
          case 'data':
            break;

          default:
            console.error("PopperJS: an invalid property has been provided to the \"" + modifier.name + "\" modifier, valid properties are " + VALID_PROPERTIES.map(function (s) {
              return "\"" + s + "\"";
            }).join(', ') + "; but \"" + key + "\" was provided.");
        }

        modifier.requires && modifier.requires.forEach(function (requirement) {
          if (modifiers.find(function (mod) {
            return mod.name === requirement;
          }) == null) {
            console.error(format(MISSING_DEPENDENCY_ERROR, String(modifier.name), requirement, requirement));
          }
        });
      });
    });
  }

  function uniqueBy(arr, fn) {
    var identifiers = new Set();
    return arr.filter(function (item) {
      var identifier = fn(item);

      if (!identifiers.has(identifier)) {
        identifiers.add(identifier);
        return true;
      }
    });
  }

  function mergeByName(modifiers) {
    var merged = modifiers.reduce(function (merged, current) {
      var existing = merged[current.name];
      merged[current.name] = existing ? Object.assign({}, existing, current, {
        options: Object.assign({}, existing.options, current.options),
        data: Object.assign({}, existing.data, current.data)
      }) : current;
      return merged;
    }, {}); // IE11 does not support Object.values

    return Object.keys(merged).map(function (key) {
      return merged[key];
    });
  }

  var INVALID_ELEMENT_ERROR = 'Popper: Invalid reference or popper argument provided. They must be either a DOM element or virtual element.';
  var INFINITE_LOOP_ERROR = 'Popper: An infinite loop in the modifiers cycle has been detected! The cycle has been interrupted to prevent a browser crash.';
  var DEFAULT_OPTIONS = {
    placement: 'bottom',
    modifiers: [],
    strategy: 'absolute'
  };

  function areValidElements() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return !args.some(function (element) {
      return !(element && typeof element.getBoundingClientRect === 'function');
    });
  }

  function popperGenerator(generatorOptions) {
    if (generatorOptions === void 0) {
      generatorOptions = {};
    }

    var _generatorOptions = generatorOptions,
        _generatorOptions$def = _generatorOptions.defaultModifiers,
        defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
        _generatorOptions$def2 = _generatorOptions.defaultOptions,
        defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
    return function createPopper(reference, popper, options) {
      if (options === void 0) {
        options = defaultOptions;
      }

      var state = {
        placement: 'bottom',
        orderedModifiers: [],
        options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
        modifiersData: {},
        elements: {
          reference: reference,
          popper: popper
        },
        attributes: {},
        styles: {}
      };
      var effectCleanupFns = [];
      var isDestroyed = false;
      var instance = {
        state: state,
        setOptions: function setOptions(options) {
          cleanupModifierEffects();
          state.options = Object.assign({}, defaultOptions, state.options, options);
          state.scrollParents = {
            reference: isElement$1(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
            popper: listScrollParents(popper)
          }; // Orders the modifiers based on their dependencies and `phase`
          // properties

          var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

          state.orderedModifiers = orderedModifiers.filter(function (m) {
            return m.enabled;
          }); // Validate the provided modifiers so that the consumer will get warned
          // if one of the modifiers is invalid for any reason

          {
            var modifiers = uniqueBy([].concat(orderedModifiers, state.options.modifiers), function (_ref) {
              var name = _ref.name;
              return name;
            });
            validateModifiers(modifiers);

            if (getBasePlacement$1(state.options.placement) === auto) {
              var flipModifier = state.orderedModifiers.find(function (_ref2) {
                var name = _ref2.name;
                return name === 'flip';
              });

              if (!flipModifier) {
                console.error(['Popper: "auto" placements require the "flip" modifier be', 'present and enabled to work.'].join(' '));
              }
            }

            var _getComputedStyle = getComputedStyle$1(popper),
                marginTop = _getComputedStyle.marginTop,
                marginRight = _getComputedStyle.marginRight,
                marginBottom = _getComputedStyle.marginBottom,
                marginLeft = _getComputedStyle.marginLeft; // We no longer take into account `margins` on the popper, and it can
            // cause bugs with positioning, so we'll warn the consumer


            if ([marginTop, marginRight, marginBottom, marginLeft].some(function (margin) {
              return parseFloat(margin);
            })) {
              console.warn(['Popper: CSS "margin" styles cannot be used to apply padding', 'between the popper and its reference element or boundary.', 'To replicate margin, use the `offset` modifier, as well as', 'the `padding` option in the `preventOverflow` and `flip`', 'modifiers.'].join(' '));
            }
          }

          runModifierEffects();
          return instance.update();
        },
        // Sync update – it will always be executed, even if not necessary. This
        // is useful for low frequency updates where sync behavior simplifies the
        // logic.
        // For high frequency updates (e.g. `resize` and `scroll` events), always
        // prefer the async Popper#update method
        forceUpdate: function forceUpdate() {
          if (isDestroyed) {
            return;
          }

          var _state$elements = state.elements,
              reference = _state$elements.reference,
              popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
          // anymore

          if (!areValidElements(reference, popper)) {
            {
              console.error(INVALID_ELEMENT_ERROR);
            }

            return;
          } // Store the reference and popper rects to be read by modifiers


          state.rects = {
            reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
            popper: getLayoutRect(popper)
          }; // Modifiers have the ability to reset the current update cycle. The
          // most common use case for this is the `flip` modifier changing the
          // placement, which then needs to re-run all the modifiers, because the
          // logic was previously ran for the previous placement and is therefore
          // stale/incorrect

          state.reset = false;
          state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
          // is filled with the initial data specified by the modifier. This means
          // it doesn't persist and is fresh on each update.
          // To ensure persistent data, use `${name}#persistent`

          state.orderedModifiers.forEach(function (modifier) {
            return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
          });
          var __debug_loops__ = 0;

          for (var index = 0; index < state.orderedModifiers.length; index++) {
            {
              __debug_loops__ += 1;

              if (__debug_loops__ > 100) {
                console.error(INFINITE_LOOP_ERROR);
                break;
              }
            }

            if (state.reset === true) {
              state.reset = false;
              index = -1;
              continue;
            }

            var _state$orderedModifie = state.orderedModifiers[index],
                fn = _state$orderedModifie.fn,
                _state$orderedModifie2 = _state$orderedModifie.options,
                _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
                name = _state$orderedModifie.name;

            if (typeof fn === 'function') {
              state = fn({
                state: state,
                options: _options,
                name: name,
                instance: instance
              }) || state;
            }
          }
        },
        // Async and optimistically optimized update – it will not be executed if
        // not necessary (debounced to run at most once-per-tick)
        update: debounce$2(function () {
          return new Promise(function (resolve) {
            instance.forceUpdate();
            resolve(state);
          });
        }),
        destroy: function destroy() {
          cleanupModifierEffects();
          isDestroyed = true;
        }
      };

      if (!areValidElements(reference, popper)) {
        {
          console.error(INVALID_ELEMENT_ERROR);
        }

        return instance;
      }

      instance.setOptions(options).then(function (state) {
        if (!isDestroyed && options.onFirstUpdate) {
          options.onFirstUpdate(state);
        }
      }); // Modifiers have the ability to execute arbitrary code before the first
      // update cycle runs. They will be executed in the same order as the update
      // cycle. This is useful when a modifier adds some persistent data that
      // other modifiers need to use, but the modifier is run after the dependent
      // one.

      function runModifierEffects() {
        state.orderedModifiers.forEach(function (_ref3) {
          var name = _ref3.name,
              _ref3$options = _ref3.options,
              options = _ref3$options === void 0 ? {} : _ref3$options,
              effect = _ref3.effect;

          if (typeof effect === 'function') {
            var cleanupFn = effect({
              state: state,
              name: name,
              instance: instance,
              options: options
            });

            var noopFn = function noopFn() {};

            effectCleanupFns.push(cleanupFn || noopFn);
          }
        });
      }

      function cleanupModifierEffects() {
        effectCleanupFns.forEach(function (fn) {
          return fn();
        });
        effectCleanupFns = [];
      }

      return instance;
    };
  }

  var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$3, hide$1];
  var createPopper = /*#__PURE__*/popperGenerator({
    defaultModifiers: defaultModifiers
  }); // eslint-disable-next-line import/no-unused-modules

  /**!
  * tippy.js v6.3.1
  * (c) 2017-2021 atomiks
  * MIT License
  */
  var BOX_CLASS = "tippy-box";
  var CONTENT_CLASS = "tippy-content";
  var BACKDROP_CLASS = "tippy-backdrop";
  var ARROW_CLASS = "tippy-arrow";
  var SVG_ARROW_CLASS = "tippy-svg-arrow";
  var TOUCH_OPTIONS = {
    passive: true,
    capture: true
  };

  function hasOwnProperty$1(obj, key) {
    return {}.hasOwnProperty.call(obj, key);
  }
  function getValueAtIndexOrReturn(value, index, defaultValue) {
    if (Array.isArray(value)) {
      var v = value[index];
      return v == null ? Array.isArray(defaultValue) ? defaultValue[index] : defaultValue : v;
    }

    return value;
  }
  function isType(value, type) {
    var str = {}.toString.call(value);
    return str.indexOf('[object') === 0 && str.indexOf(type + "]") > -1;
  }
  function invokeWithArgsOrReturn(value, args) {
    return typeof value === 'function' ? value.apply(void 0, args) : value;
  }
  function debounce$1(fn, ms) {
    // Avoid wrapping in `setTimeout` if ms is 0 anyway
    if (ms === 0) {
      return fn;
    }

    var timeout;
    return function (arg) {
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        fn(arg);
      }, ms);
    };
  }
  function removeProperties(obj, keys) {
    var clone = Object.assign({}, obj);
    keys.forEach(function (key) {
      delete clone[key];
    });
    return clone;
  }
  function splitBySpaces(value) {
    return value.split(/\s+/).filter(Boolean);
  }
  function normalizeToArray(value) {
    return [].concat(value);
  }
  function pushIfUnique(arr, value) {
    if (arr.indexOf(value) === -1) {
      arr.push(value);
    }
  }
  function unique(arr) {
    return arr.filter(function (item, index) {
      return arr.indexOf(item) === index;
    });
  }
  function getBasePlacement(placement) {
    return placement.split('-')[0];
  }
  function arrayFrom(value) {
    return [].slice.call(value);
  }
  function removeUndefinedProps(obj) {
    return Object.keys(obj).reduce(function (acc, key) {
      if (obj[key] !== undefined) {
        acc[key] = obj[key];
      }

      return acc;
    }, {});
  }

  function div() {
    return document.createElement('div');
  }
  function isElement(value) {
    return ['Element', 'Fragment'].some(function (type) {
      return isType(value, type);
    });
  }
  function isNodeList(value) {
    return isType(value, 'NodeList');
  }
  function isMouseEvent(value) {
    return isType(value, 'MouseEvent');
  }
  function isReferenceElement(value) {
    return !!(value && value._tippy && value._tippy.reference === value);
  }
  function getArrayOfElements(value) {
    if (isElement(value)) {
      return [value];
    }

    if (isNodeList(value)) {
      return arrayFrom(value);
    }

    if (Array.isArray(value)) {
      return value;
    }

    return arrayFrom(document.querySelectorAll(value));
  }
  function setTransitionDuration(els, value) {
    els.forEach(function (el) {
      if (el) {
        el.style.transitionDuration = value + "ms";
      }
    });
  }
  function setVisibilityState(els, state) {
    els.forEach(function (el) {
      if (el) {
        el.setAttribute('data-state', state);
      }
    });
  }
  function getOwnerDocument(elementOrElements) {
    var _element$ownerDocumen;

    var _normalizeToArray = normalizeToArray(elementOrElements),
        element = _normalizeToArray[0]; // Elements created via a <template> have an ownerDocument with no reference to the body


    return (element == null ? void 0 : (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body) ? element.ownerDocument : document;
  }
  function isCursorOutsideInteractiveBorder(popperTreeData, event) {
    var clientX = event.clientX,
        clientY = event.clientY;
    return popperTreeData.every(function (_ref) {
      var popperRect = _ref.popperRect,
          popperState = _ref.popperState,
          props = _ref.props;
      var interactiveBorder = props.interactiveBorder;
      var basePlacement = getBasePlacement(popperState.placement);
      var offsetData = popperState.modifiersData.offset;

      if (!offsetData) {
        return true;
      }

      var topDistance = basePlacement === 'bottom' ? offsetData.top.y : 0;
      var bottomDistance = basePlacement === 'top' ? offsetData.bottom.y : 0;
      var leftDistance = basePlacement === 'right' ? offsetData.left.x : 0;
      var rightDistance = basePlacement === 'left' ? offsetData.right.x : 0;
      var exceedsTop = popperRect.top - clientY + topDistance > interactiveBorder;
      var exceedsBottom = clientY - popperRect.bottom - bottomDistance > interactiveBorder;
      var exceedsLeft = popperRect.left - clientX + leftDistance > interactiveBorder;
      var exceedsRight = clientX - popperRect.right - rightDistance > interactiveBorder;
      return exceedsTop || exceedsBottom || exceedsLeft || exceedsRight;
    });
  }
  function updateTransitionEndListener(box, action, listener) {
    var method = action + "EventListener"; // some browsers apparently support `transition` (unprefixed) but only fire
    // `webkitTransitionEnd`...

    ['transitionend', 'webkitTransitionEnd'].forEach(function (event) {
      box[method](event, listener);
    });
  }

  var currentInput = {
    isTouch: false
  };
  var lastMouseMoveTime = 0;
  /**
   * When a `touchstart` event is fired, it's assumed the user is using touch
   * input. We'll bind a `mousemove` event listener to listen for mouse input in
   * the future. This way, the `isTouch` property is fully dynamic and will handle
   * hybrid devices that use a mix of touch + mouse input.
   */

  function onDocumentTouchStart() {
    if (currentInput.isTouch) {
      return;
    }

    currentInput.isTouch = true;

    if (window.performance) {
      document.addEventListener('mousemove', onDocumentMouseMove);
    }
  }
  /**
   * When two `mousemove` event are fired consecutively within 20ms, it's assumed
   * the user is using mouse input again. `mousemove` can fire on touch devices as
   * well, but very rarely that quickly.
   */

  function onDocumentMouseMove() {
    var now = performance.now();

    if (now - lastMouseMoveTime < 20) {
      currentInput.isTouch = false;
      document.removeEventListener('mousemove', onDocumentMouseMove);
    }

    lastMouseMoveTime = now;
  }
  /**
   * When an element is in focus and has a tippy, leaving the tab/window and
   * returning causes it to show again. For mouse users this is unexpected, but
   * for keyboard use it makes sense.
   * TODO: find a better technique to solve this problem
   */

  function onWindowBlur() {
    var activeElement = document.activeElement;

    if (isReferenceElement(activeElement)) {
      var instance = activeElement._tippy;

      if (activeElement.blur && !instance.state.isVisible) {
        activeElement.blur();
      }
    }
  }
  function bindGlobalEventListeners() {
    document.addEventListener('touchstart', onDocumentTouchStart, TOUCH_OPTIONS);
    window.addEventListener('blur', onWindowBlur);
  }

  var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
  var ua = isBrowser ? navigator.userAgent : '';
  var isIE = /MSIE |Trident\//.test(ua);

  function createMemoryLeakWarning(method) {
    var txt = method === 'destroy' ? 'n already-' : ' ';
    return [method + "() was called on a" + txt + "destroyed instance. This is a no-op but", 'indicates a potential memory leak.'].join(' ');
  }
  function clean(value) {
    var spacesAndTabs = /[ \t]{2,}/g;
    var lineStartWithSpaces = /^[ \t]*/gm;
    return value.replace(spacesAndTabs, ' ').replace(lineStartWithSpaces, '').trim();
  }

  function getDevMessage(message) {
    return clean("\n  %ctippy.js\n\n  %c" + clean(message) + "\n\n  %c\uD83D\uDC77\u200D This is a development-only message. It will be removed in production.\n  ");
  }

  function getFormattedMessage(message) {
    return [getDevMessage(message), // title
    'color: #00C584; font-size: 1.3em; font-weight: bold;', // message
    'line-height: 1.5', // footer
    'color: #a6a095;'];
  } // Assume warnings and errors never have the same message

  var visitedMessages;

  {
    resetVisitedMessages();
  }

  function resetVisitedMessages() {
    visitedMessages = new Set();
  }
  function warnWhen(condition, message) {
    if (condition && !visitedMessages.has(message)) {
      var _console;

      visitedMessages.add(message);

      (_console = console).warn.apply(_console, getFormattedMessage(message));
    }
  }
  function errorWhen(condition, message) {
    if (condition && !visitedMessages.has(message)) {
      var _console2;

      visitedMessages.add(message);

      (_console2 = console).error.apply(_console2, getFormattedMessage(message));
    }
  }
  function validateTargets(targets) {
    var didPassFalsyValue = !targets;
    var didPassPlainObject = Object.prototype.toString.call(targets) === '[object Object]' && !targets.addEventListener;
    errorWhen(didPassFalsyValue, ['tippy() was passed', '`' + String(targets) + '`', 'as its targets (first) argument. Valid types are: String, Element,', 'Element[], or NodeList.'].join(' '));
    errorWhen(didPassPlainObject, ['tippy() was passed a plain object which is not supported as an argument', 'for virtual positioning. Use props.getReferenceClientRect instead.'].join(' '));
  }

  var pluginProps = {
    animateFill: false,
    followCursor: false,
    inlinePositioning: false,
    sticky: false
  };
  var renderProps = {
    allowHTML: false,
    animation: 'fade',
    arrow: true,
    content: '',
    inertia: false,
    maxWidth: 350,
    role: 'tooltip',
    theme: '',
    zIndex: 9999
  };
  var defaultProps = Object.assign({
    appendTo: function appendTo() {
      return document.body;
    },
    aria: {
      content: 'auto',
      expanded: 'auto'
    },
    delay: 0,
    duration: [300, 250],
    getReferenceClientRect: null,
    hideOnClick: true,
    ignoreAttributes: false,
    interactive: false,
    interactiveBorder: 2,
    interactiveDebounce: 0,
    moveTransition: '',
    offset: [0, 10],
    onAfterUpdate: function onAfterUpdate() {},
    onBeforeUpdate: function onBeforeUpdate() {},
    onCreate: function onCreate() {},
    onDestroy: function onDestroy() {},
    onHidden: function onHidden() {},
    onHide: function onHide() {},
    onMount: function onMount() {},
    onShow: function onShow() {},
    onShown: function onShown() {},
    onTrigger: function onTrigger() {},
    onUntrigger: function onUntrigger() {},
    onClickOutside: function onClickOutside() {},
    placement: 'top',
    plugins: [],
    popperOptions: {},
    render: null,
    showOnCreate: false,
    touch: true,
    trigger: 'mouseenter focus',
    triggerTarget: null
  }, pluginProps, {}, renderProps);
  var defaultKeys = Object.keys(defaultProps);
  var setDefaultProps = function setDefaultProps(partialProps) {
    /* istanbul ignore else */
    {
      validateProps(partialProps, []);
    }

    var keys = Object.keys(partialProps);
    keys.forEach(function (key) {
      defaultProps[key] = partialProps[key];
    });
  };
  function getExtendedPassedProps(passedProps) {
    var plugins = passedProps.plugins || [];
    var pluginProps = plugins.reduce(function (acc, plugin) {
      var name = plugin.name,
          defaultValue = plugin.defaultValue;

      if (name) {
        acc[name] = passedProps[name] !== undefined ? passedProps[name] : defaultValue;
      }

      return acc;
    }, {});
    return Object.assign({}, passedProps, {}, pluginProps);
  }
  function getDataAttributeProps(reference, plugins) {
    var propKeys = plugins ? Object.keys(getExtendedPassedProps(Object.assign({}, defaultProps, {
      plugins: plugins
    }))) : defaultKeys;
    var props = propKeys.reduce(function (acc, key) {
      var valueAsString = (reference.getAttribute("data-tippy-" + key) || '').trim();

      if (!valueAsString) {
        return acc;
      }

      if (key === 'content') {
        acc[key] = valueAsString;
      } else {
        try {
          acc[key] = JSON.parse(valueAsString);
        } catch (e) {
          acc[key] = valueAsString;
        }
      }

      return acc;
    }, {});
    return props;
  }
  function evaluateProps(reference, props) {
    var out = Object.assign({}, props, {
      content: invokeWithArgsOrReturn(props.content, [reference])
    }, props.ignoreAttributes ? {} : getDataAttributeProps(reference, props.plugins));
    out.aria = Object.assign({}, defaultProps.aria, {}, out.aria);
    out.aria = {
      expanded: out.aria.expanded === 'auto' ? props.interactive : out.aria.expanded,
      content: out.aria.content === 'auto' ? props.interactive ? null : 'describedby' : out.aria.content
    };
    return out;
  }
  function validateProps(partialProps, plugins) {
    if (partialProps === void 0) {
      partialProps = {};
    }

    if (plugins === void 0) {
      plugins = [];
    }

    var keys = Object.keys(partialProps);
    keys.forEach(function (prop) {
      var nonPluginProps = removeProperties(defaultProps, Object.keys(pluginProps));
      var didPassUnknownProp = !hasOwnProperty$1(nonPluginProps, prop); // Check if the prop exists in `plugins`

      if (didPassUnknownProp) {
        didPassUnknownProp = plugins.filter(function (plugin) {
          return plugin.name === prop;
        }).length === 0;
      }

      warnWhen(didPassUnknownProp, ["`" + prop + "`", "is not a valid prop. You may have spelled it incorrectly, or if it's", 'a plugin, forgot to pass it in an array as props.plugins.', '\n\n', 'All props: https://atomiks.github.io/tippyjs/v6/all-props/\n', 'Plugins: https://atomiks.github.io/tippyjs/v6/plugins/'].join(' '));
    });
  }

  var innerHTML = function innerHTML() {
    return 'innerHTML';
  };

  function dangerouslySetInnerHTML(element, html) {
    element[innerHTML()] = html;
  }

  function createArrowElement(value) {
    var arrow = div();

    if (value === true) {
      arrow.className = ARROW_CLASS;
    } else {
      arrow.className = SVG_ARROW_CLASS;

      if (isElement(value)) {
        arrow.appendChild(value);
      } else {
        dangerouslySetInnerHTML(arrow, value);
      }
    }

    return arrow;
  }

  function setContent(content, props) {
    if (isElement(props.content)) {
      dangerouslySetInnerHTML(content, '');
      content.appendChild(props.content);
    } else if (typeof props.content !== 'function') {
      if (props.allowHTML) {
        dangerouslySetInnerHTML(content, props.content);
      } else {
        content.textContent = props.content;
      }
    }
  }
  function getChildren(popper) {
    var box = popper.firstElementChild;
    var boxChildren = arrayFrom(box.children);
    return {
      box: box,
      content: boxChildren.find(function (node) {
        return node.classList.contains(CONTENT_CLASS);
      }),
      arrow: boxChildren.find(function (node) {
        return node.classList.contains(ARROW_CLASS) || node.classList.contains(SVG_ARROW_CLASS);
      }),
      backdrop: boxChildren.find(function (node) {
        return node.classList.contains(BACKDROP_CLASS);
      })
    };
  }
  function render(instance) {
    var popper = div();
    var box = div();
    box.className = BOX_CLASS;
    box.setAttribute('data-state', 'hidden');
    box.setAttribute('tabindex', '-1');
    var content = div();
    content.className = CONTENT_CLASS;
    content.setAttribute('data-state', 'hidden');
    setContent(content, instance.props);
    popper.appendChild(box);
    box.appendChild(content);
    onUpdate(instance.props, instance.props);

    function onUpdate(prevProps, nextProps) {
      var _getChildren = getChildren(popper),
          box = _getChildren.box,
          content = _getChildren.content,
          arrow = _getChildren.arrow;

      if (nextProps.theme) {
        box.setAttribute('data-theme', nextProps.theme);
      } else {
        box.removeAttribute('data-theme');
      }

      if (typeof nextProps.animation === 'string') {
        box.setAttribute('data-animation', nextProps.animation);
      } else {
        box.removeAttribute('data-animation');
      }

      if (nextProps.inertia) {
        box.setAttribute('data-inertia', '');
      } else {
        box.removeAttribute('data-inertia');
      }

      box.style.maxWidth = typeof nextProps.maxWidth === 'number' ? nextProps.maxWidth + "px" : nextProps.maxWidth;

      if (nextProps.role) {
        box.setAttribute('role', nextProps.role);
      } else {
        box.removeAttribute('role');
      }

      if (prevProps.content !== nextProps.content || prevProps.allowHTML !== nextProps.allowHTML) {
        setContent(content, instance.props);
      }

      if (nextProps.arrow) {
        if (!arrow) {
          box.appendChild(createArrowElement(nextProps.arrow));
        } else if (prevProps.arrow !== nextProps.arrow) {
          box.removeChild(arrow);
          box.appendChild(createArrowElement(nextProps.arrow));
        }
      } else if (arrow) {
        box.removeChild(arrow);
      }
    }

    return {
      popper: popper,
      onUpdate: onUpdate
    };
  } // Runtime check to identify if the render function is the default one; this
  // way we can apply default CSS transitions logic and it can be tree-shaken away

  render.$$tippy = true;

  var idCounter = 1;
  var mouseMoveListeners = []; // Used by `hideAll()`

  var mountedInstances = [];
  function createTippy(reference, passedProps) {
    var props = evaluateProps(reference, Object.assign({}, defaultProps, {}, getExtendedPassedProps(removeUndefinedProps(passedProps)))); // ===========================================================================
    // 🔒 Private members
    // ===========================================================================

    var showTimeout;
    var hideTimeout;
    var scheduleHideAnimationFrame;
    var isVisibleFromClick = false;
    var didHideDueToDocumentMouseDown = false;
    var didTouchMove = false;
    var ignoreOnFirstUpdate = false;
    var lastTriggerEvent;
    var currentTransitionEndListener;
    var onFirstUpdate;
    var listeners = [];
    var debouncedOnMouseMove = debounce$1(onMouseMove, props.interactiveDebounce);
    var currentTarget; // ===========================================================================
    // 🔑 Public members
    // ===========================================================================

    var id = idCounter++;
    var popperInstance = null;
    var plugins = unique(props.plugins);
    var state = {
      // Is the instance currently enabled?
      isEnabled: true,
      // Is the tippy currently showing and not transitioning out?
      isVisible: false,
      // Has the instance been destroyed?
      isDestroyed: false,
      // Is the tippy currently mounted to the DOM?
      isMounted: false,
      // Has the tippy finished transitioning in?
      isShown: false
    };
    var instance = {
      // properties
      id: id,
      reference: reference,
      popper: div(),
      popperInstance: popperInstance,
      props: props,
      state: state,
      plugins: plugins,
      // methods
      clearDelayTimeouts: clearDelayTimeouts,
      setProps: setProps,
      setContent: setContent,
      show: show,
      hide: hide,
      hideWithInteractivity: hideWithInteractivity,
      enable: enable,
      disable: disable,
      unmount: unmount,
      destroy: destroy
    }; // TODO: Investigate why this early return causes a TDZ error in the tests —
    // it doesn't seem to happen in the browser

    /* istanbul ignore if */

    if (!props.render) {
      {
        errorWhen(true, 'render() function has not been supplied.');
      }

      return instance;
    } // ===========================================================================
    // Initial mutations
    // ===========================================================================


    var _props$render = props.render(instance),
        popper = _props$render.popper,
        onUpdate = _props$render.onUpdate;

    popper.setAttribute('data-tippy-root', '');
    popper.id = "tippy-" + instance.id;
    instance.popper = popper;
    reference._tippy = instance;
    popper._tippy = instance;
    var pluginsHooks = plugins.map(function (plugin) {
      return plugin.fn(instance);
    });
    var hasAriaExpanded = reference.hasAttribute('aria-expanded');
    addListeners();
    handleAriaExpandedAttribute();
    handleStyles();
    invokeHook('onCreate', [instance]);

    if (props.showOnCreate) {
      scheduleShow();
    } // Prevent a tippy with a delay from hiding if the cursor left then returned
    // before it started hiding


    popper.addEventListener('mouseenter', function () {
      if (instance.props.interactive && instance.state.isVisible) {
        instance.clearDelayTimeouts();
      }
    });
    popper.addEventListener('mouseleave', function (event) {
      if (instance.props.interactive && instance.props.trigger.indexOf('mouseenter') >= 0) {
        getDocument().addEventListener('mousemove', debouncedOnMouseMove);
        debouncedOnMouseMove(event);
      }
    });
    return instance; // ===========================================================================
    // 🔒 Private methods
    // ===========================================================================

    function getNormalizedTouchSettings() {
      var touch = instance.props.touch;
      return Array.isArray(touch) ? touch : [touch, 0];
    }

    function getIsCustomTouchBehavior() {
      return getNormalizedTouchSettings()[0] === 'hold';
    }

    function getIsDefaultRenderFn() {
      var _instance$props$rende;

      // @ts-ignore
      return !!((_instance$props$rende = instance.props.render) == null ? void 0 : _instance$props$rende.$$tippy);
    }

    function getCurrentTarget() {
      return currentTarget || reference;
    }

    function getDocument() {
      var parent = getCurrentTarget().parentNode;
      return parent ? getOwnerDocument(parent) : document;
    }

    function getDefaultTemplateChildren() {
      return getChildren(popper);
    }

    function getDelay(isShow) {
      // For touch or keyboard input, force `0` delay for UX reasons
      // Also if the instance is mounted but not visible (transitioning out),
      // ignore delay
      if (instance.state.isMounted && !instance.state.isVisible || currentInput.isTouch || lastTriggerEvent && lastTriggerEvent.type === 'focus') {
        return 0;
      }

      return getValueAtIndexOrReturn(instance.props.delay, isShow ? 0 : 1, defaultProps.delay);
    }

    function handleStyles() {
      popper.style.pointerEvents = instance.props.interactive && instance.state.isVisible ? '' : 'none';
      popper.style.zIndex = "" + instance.props.zIndex;
    }

    function invokeHook(hook, args, shouldInvokePropsHook) {
      if (shouldInvokePropsHook === void 0) {
        shouldInvokePropsHook = true;
      }

      pluginsHooks.forEach(function (pluginHooks) {
        if (pluginHooks[hook]) {
          pluginHooks[hook].apply(void 0, args);
        }
      });

      if (shouldInvokePropsHook) {
        var _instance$props;

        (_instance$props = instance.props)[hook].apply(_instance$props, args);
      }
    }

    function handleAriaContentAttribute() {
      var aria = instance.props.aria;

      if (!aria.content) {
        return;
      }

      var attr = "aria-" + aria.content;
      var id = popper.id;
      var nodes = normalizeToArray(instance.props.triggerTarget || reference);
      nodes.forEach(function (node) {
        var currentValue = node.getAttribute(attr);

        if (instance.state.isVisible) {
          node.setAttribute(attr, currentValue ? currentValue + " " + id : id);
        } else {
          var nextValue = currentValue && currentValue.replace(id, '').trim();

          if (nextValue) {
            node.setAttribute(attr, nextValue);
          } else {
            node.removeAttribute(attr);
          }
        }
      });
    }

    function handleAriaExpandedAttribute() {
      if (hasAriaExpanded || !instance.props.aria.expanded) {
        return;
      }

      var nodes = normalizeToArray(instance.props.triggerTarget || reference);
      nodes.forEach(function (node) {
        if (instance.props.interactive) {
          node.setAttribute('aria-expanded', instance.state.isVisible && node === getCurrentTarget() ? 'true' : 'false');
        } else {
          node.removeAttribute('aria-expanded');
        }
      });
    }

    function cleanupInteractiveMouseListeners() {
      getDocument().removeEventListener('mousemove', debouncedOnMouseMove);
      mouseMoveListeners = mouseMoveListeners.filter(function (listener) {
        return listener !== debouncedOnMouseMove;
      });
    }

    function onDocumentPress(event) {
      // Moved finger to scroll instead of an intentional tap outside
      if (currentInput.isTouch) {
        if (didTouchMove || event.type === 'mousedown') {
          return;
        }
      } // Clicked on interactive popper


      if (instance.props.interactive && popper.contains(event.target)) {
        return;
      } // Clicked on the event listeners target


      if (getCurrentTarget().contains(event.target)) {
        if (currentInput.isTouch) {
          return;
        }

        if (instance.state.isVisible && instance.props.trigger.indexOf('click') >= 0) {
          return;
        }
      } else {
        invokeHook('onClickOutside', [instance, event]);
      }

      if (instance.props.hideOnClick === true) {
        instance.clearDelayTimeouts();
        instance.hide(); // `mousedown` event is fired right before `focus` if pressing the
        // currentTarget. This lets a tippy with `focus` trigger know that it
        // should not show

        didHideDueToDocumentMouseDown = true;
        setTimeout(function () {
          didHideDueToDocumentMouseDown = false;
        }); // The listener gets added in `scheduleShow()`, but this may be hiding it
        // before it shows, and hide()'s early bail-out behavior can prevent it
        // from being cleaned up

        if (!instance.state.isMounted) {
          removeDocumentPress();
        }
      }
    }

    function onTouchMove() {
      didTouchMove = true;
    }

    function onTouchStart() {
      didTouchMove = false;
    }

    function addDocumentPress() {
      var doc = getDocument();
      doc.addEventListener('mousedown', onDocumentPress, true);
      doc.addEventListener('touchend', onDocumentPress, TOUCH_OPTIONS);
      doc.addEventListener('touchstart', onTouchStart, TOUCH_OPTIONS);
      doc.addEventListener('touchmove', onTouchMove, TOUCH_OPTIONS);
    }

    function removeDocumentPress() {
      var doc = getDocument();
      doc.removeEventListener('mousedown', onDocumentPress, true);
      doc.removeEventListener('touchend', onDocumentPress, TOUCH_OPTIONS);
      doc.removeEventListener('touchstart', onTouchStart, TOUCH_OPTIONS);
      doc.removeEventListener('touchmove', onTouchMove, TOUCH_OPTIONS);
    }

    function onTransitionedOut(duration, callback) {
      onTransitionEnd(duration, function () {
        if (!instance.state.isVisible && popper.parentNode && popper.parentNode.contains(popper)) {
          callback();
        }
      });
    }

    function onTransitionedIn(duration, callback) {
      onTransitionEnd(duration, callback);
    }

    function onTransitionEnd(duration, callback) {
      var box = getDefaultTemplateChildren().box;

      function listener(event) {
        if (event.target === box) {
          updateTransitionEndListener(box, 'remove', listener);
          callback();
        }
      } // Make callback synchronous if duration is 0
      // `transitionend` won't fire otherwise


      if (duration === 0) {
        return callback();
      }

      updateTransitionEndListener(box, 'remove', currentTransitionEndListener);
      updateTransitionEndListener(box, 'add', listener);
      currentTransitionEndListener = listener;
    }

    function on(eventType, handler, options) {
      if (options === void 0) {
        options = false;
      }

      var nodes = normalizeToArray(instance.props.triggerTarget || reference);
      nodes.forEach(function (node) {
        node.addEventListener(eventType, handler, options);
        listeners.push({
          node: node,
          eventType: eventType,
          handler: handler,
          options: options
        });
      });
    }

    function addListeners() {
      if (getIsCustomTouchBehavior()) {
        on('touchstart', onTrigger, {
          passive: true
        });
        on('touchend', onMouseLeave, {
          passive: true
        });
      }

      splitBySpaces(instance.props.trigger).forEach(function (eventType) {
        if (eventType === 'manual') {
          return;
        }

        on(eventType, onTrigger);

        switch (eventType) {
          case 'mouseenter':
            on('mouseleave', onMouseLeave);
            break;

          case 'focus':
            on(isIE ? 'focusout' : 'blur', onBlurOrFocusOut);
            break;

          case 'focusin':
            on('focusout', onBlurOrFocusOut);
            break;
        }
      });
    }

    function removeListeners() {
      listeners.forEach(function (_ref) {
        var node = _ref.node,
            eventType = _ref.eventType,
            handler = _ref.handler,
            options = _ref.options;
        node.removeEventListener(eventType, handler, options);
      });
      listeners = [];
    }

    function onTrigger(event) {
      var _lastTriggerEvent;

      var shouldScheduleClickHide = false;

      if (!instance.state.isEnabled || isEventListenerStopped(event) || didHideDueToDocumentMouseDown) {
        return;
      }

      var wasFocused = ((_lastTriggerEvent = lastTriggerEvent) == null ? void 0 : _lastTriggerEvent.type) === 'focus';
      lastTriggerEvent = event;
      currentTarget = event.currentTarget;
      handleAriaExpandedAttribute();

      if (!instance.state.isVisible && isMouseEvent(event)) {
        // If scrolling, `mouseenter` events can be fired if the cursor lands
        // over a new target, but `mousemove` events don't get fired. This
        // causes interactive tooltips to get stuck open until the cursor is
        // moved
        mouseMoveListeners.forEach(function (listener) {
          return listener(event);
        });
      } // Toggle show/hide when clicking click-triggered tooltips


      if (event.type === 'click' && (instance.props.trigger.indexOf('mouseenter') < 0 || isVisibleFromClick) && instance.props.hideOnClick !== false && instance.state.isVisible) {
        shouldScheduleClickHide = true;
      } else {
        scheduleShow(event);
      }

      if (event.type === 'click') {
        isVisibleFromClick = !shouldScheduleClickHide;
      }

      if (shouldScheduleClickHide && !wasFocused) {
        scheduleHide(event);
      }
    }

    function onMouseMove(event) {
      var target = event.target;
      var isCursorOverReferenceOrPopper = getCurrentTarget().contains(target) || popper.contains(target);

      if (event.type === 'mousemove' && isCursorOverReferenceOrPopper) {
        return;
      }

      var popperTreeData = getNestedPopperTree().concat(popper).map(function (popper) {
        var _instance$popperInsta;

        var instance = popper._tippy;
        var state = (_instance$popperInsta = instance.popperInstance) == null ? void 0 : _instance$popperInsta.state;

        if (state) {
          return {
            popperRect: popper.getBoundingClientRect(),
            popperState: state,
            props: props
          };
        }

        return null;
      }).filter(Boolean);

      if (isCursorOutsideInteractiveBorder(popperTreeData, event)) {
        cleanupInteractiveMouseListeners();
        scheduleHide(event);
      }
    }

    function onMouseLeave(event) {
      var shouldBail = isEventListenerStopped(event) || instance.props.trigger.indexOf('click') >= 0 && isVisibleFromClick;

      if (shouldBail) {
        return;
      }

      if (instance.props.interactive) {
        instance.hideWithInteractivity(event);
        return;
      }

      scheduleHide(event);
    }

    function onBlurOrFocusOut(event) {
      if (instance.props.trigger.indexOf('focusin') < 0 && event.target !== getCurrentTarget()) {
        return;
      } // If focus was moved to within the popper


      if (instance.props.interactive && event.relatedTarget && popper.contains(event.relatedTarget)) {
        return;
      }

      scheduleHide(event);
    }

    function isEventListenerStopped(event) {
      return currentInput.isTouch ? getIsCustomTouchBehavior() !== event.type.indexOf('touch') >= 0 : false;
    }

    function createPopperInstance() {
      destroyPopperInstance();
      var _instance$props2 = instance.props,
          popperOptions = _instance$props2.popperOptions,
          placement = _instance$props2.placement,
          offset = _instance$props2.offset,
          getReferenceClientRect = _instance$props2.getReferenceClientRect,
          moveTransition = _instance$props2.moveTransition;
      var arrow = getIsDefaultRenderFn() ? getChildren(popper).arrow : null;
      var computedReference = getReferenceClientRect ? {
        getBoundingClientRect: getReferenceClientRect,
        contextElement: getReferenceClientRect.contextElement || getCurrentTarget()
      } : reference;
      var tippyModifier = {
        name: '$$tippy',
        enabled: true,
        phase: 'beforeWrite',
        requires: ['computeStyles'],
        fn: function fn(_ref2) {
          var state = _ref2.state;

          if (getIsDefaultRenderFn()) {
            var _getDefaultTemplateCh = getDefaultTemplateChildren(),
                box = _getDefaultTemplateCh.box;

            ['placement', 'reference-hidden', 'escaped'].forEach(function (attr) {
              if (attr === 'placement') {
                box.setAttribute('data-placement', state.placement);
              } else {
                if (state.attributes.popper["data-popper-" + attr]) {
                  box.setAttribute("data-" + attr, '');
                } else {
                  box.removeAttribute("data-" + attr);
                }
              }
            });
            state.attributes.popper = {};
          }
        }
      };
      var modifiers = [{
        name: 'offset',
        options: {
          offset: offset
        }
      }, {
        name: 'preventOverflow',
        options: {
          padding: {
            top: 2,
            bottom: 2,
            left: 5,
            right: 5
          }
        }
      }, {
        name: 'flip',
        options: {
          padding: 5
        }
      }, {
        name: 'computeStyles',
        options: {
          adaptive: !moveTransition
        }
      }, tippyModifier];

      if (getIsDefaultRenderFn() && arrow) {
        modifiers.push({
          name: 'arrow',
          options: {
            element: arrow,
            padding: 3
          }
        });
      }

      modifiers.push.apply(modifiers, (popperOptions == null ? void 0 : popperOptions.modifiers) || []);
      instance.popperInstance = createPopper(computedReference, popper, Object.assign({}, popperOptions, {
        placement: placement,
        onFirstUpdate: onFirstUpdate,
        modifiers: modifiers
      }));
    }

    function destroyPopperInstance() {
      if (instance.popperInstance) {
        instance.popperInstance.destroy();
        instance.popperInstance = null;
      }
    }

    function mount() {
      var appendTo = instance.props.appendTo;
      var parentNode; // By default, we'll append the popper to the triggerTargets's parentNode so
      // it's directly after the reference element so the elements inside the
      // tippy can be tabbed to
      // If there are clipping issues, the user can specify a different appendTo
      // and ensure focus management is handled correctly manually

      var node = getCurrentTarget();

      if (instance.props.interactive && appendTo === defaultProps.appendTo || appendTo === 'parent') {
        parentNode = node.parentNode;
      } else {
        parentNode = invokeWithArgsOrReturn(appendTo, [node]);
      } // The popper element needs to exist on the DOM before its position can be
      // updated as Popper needs to read its dimensions


      if (!parentNode.contains(popper)) {
        parentNode.appendChild(popper);
      }

      createPopperInstance();
      /* istanbul ignore else */

      {
        // Accessibility check
        warnWhen(instance.props.interactive && appendTo === defaultProps.appendTo && node.nextElementSibling !== popper, ['Interactive tippy element may not be accessible via keyboard', 'navigation because it is not directly after the reference element', 'in the DOM source order.', '\n\n', 'Using a wrapper <div> or <span> tag around the reference element', 'solves this by creating a new parentNode context.', '\n\n', 'Specifying `appendTo: document.body` silences this warning, but it', 'assumes you are using a focus management solution to handle', 'keyboard navigation.', '\n\n', 'See: https://atomiks.github.io/tippyjs/v6/accessibility/#interactivity'].join(' '));
      }
    }

    function getNestedPopperTree() {
      return arrayFrom(popper.querySelectorAll('[data-tippy-root]'));
    }

    function scheduleShow(event) {
      instance.clearDelayTimeouts();

      if (event) {
        invokeHook('onTrigger', [instance, event]);
      }

      addDocumentPress();
      var delay = getDelay(true);

      var _getNormalizedTouchSe = getNormalizedTouchSettings(),
          touchValue = _getNormalizedTouchSe[0],
          touchDelay = _getNormalizedTouchSe[1];

      if (currentInput.isTouch && touchValue === 'hold' && touchDelay) {
        delay = touchDelay;
      }

      if (delay) {
        showTimeout = setTimeout(function () {
          instance.show();
        }, delay);
      } else {
        instance.show();
      }
    }

    function scheduleHide(event) {
      instance.clearDelayTimeouts();
      invokeHook('onUntrigger', [instance, event]);

      if (!instance.state.isVisible) {
        removeDocumentPress();
        return;
      } // For interactive tippies, scheduleHide is added to a document.body handler
      // from onMouseLeave so must intercept scheduled hides from mousemove/leave
      // events when trigger contains mouseenter and click, and the tip is
      // currently shown as a result of a click.


      if (instance.props.trigger.indexOf('mouseenter') >= 0 && instance.props.trigger.indexOf('click') >= 0 && ['mouseleave', 'mousemove'].indexOf(event.type) >= 0 && isVisibleFromClick) {
        return;
      }

      var delay = getDelay(false);

      if (delay) {
        hideTimeout = setTimeout(function () {
          if (instance.state.isVisible) {
            instance.hide();
          }
        }, delay);
      } else {
        // Fixes a `transitionend` problem when it fires 1 frame too
        // late sometimes, we don't want hide() to be called.
        scheduleHideAnimationFrame = requestAnimationFrame(function () {
          instance.hide();
        });
      }
    } // ===========================================================================
    // 🔑 Public methods
    // ===========================================================================


    function enable() {
      instance.state.isEnabled = true;
    }

    function disable() {
      // Disabling the instance should also hide it
      // https://github.com/atomiks/tippy.js-react/issues/106
      instance.hide();
      instance.state.isEnabled = false;
    }

    function clearDelayTimeouts() {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
      cancelAnimationFrame(scheduleHideAnimationFrame);
    }

    function setProps(partialProps) {
      /* istanbul ignore else */
      {
        warnWhen(instance.state.isDestroyed, createMemoryLeakWarning('setProps'));
      }

      if (instance.state.isDestroyed) {
        return;
      }

      invokeHook('onBeforeUpdate', [instance, partialProps]);
      removeListeners();
      var prevProps = instance.props;
      var nextProps = evaluateProps(reference, Object.assign({}, instance.props, {}, partialProps, {
        ignoreAttributes: true
      }));
      instance.props = nextProps;
      addListeners();

      if (prevProps.interactiveDebounce !== nextProps.interactiveDebounce) {
        cleanupInteractiveMouseListeners();
        debouncedOnMouseMove = debounce$1(onMouseMove, nextProps.interactiveDebounce);
      } // Ensure stale aria-expanded attributes are removed


      if (prevProps.triggerTarget && !nextProps.triggerTarget) {
        normalizeToArray(prevProps.triggerTarget).forEach(function (node) {
          node.removeAttribute('aria-expanded');
        });
      } else if (nextProps.triggerTarget) {
        reference.removeAttribute('aria-expanded');
      }

      handleAriaExpandedAttribute();
      handleStyles();

      if (onUpdate) {
        onUpdate(prevProps, nextProps);
      }

      if (instance.popperInstance) {
        createPopperInstance(); // Fixes an issue with nested tippies if they are all getting re-rendered,
        // and the nested ones get re-rendered first.
        // https://github.com/atomiks/tippyjs-react/issues/177
        // TODO: find a cleaner / more efficient solution(!)

        getNestedPopperTree().forEach(function (nestedPopper) {
          // React (and other UI libs likely) requires a rAF wrapper as it flushes
          // its work in one
          requestAnimationFrame(nestedPopper._tippy.popperInstance.forceUpdate);
        });
      }

      invokeHook('onAfterUpdate', [instance, partialProps]);
    }

    function setContent(content) {
      instance.setProps({
        content: content
      });
    }

    function show() {
      /* istanbul ignore else */
      {
        warnWhen(instance.state.isDestroyed, createMemoryLeakWarning('show'));
      } // Early bail-out


      var isAlreadyVisible = instance.state.isVisible;
      var isDestroyed = instance.state.isDestroyed;
      var isDisabled = !instance.state.isEnabled;
      var isTouchAndTouchDisabled = currentInput.isTouch && !instance.props.touch;
      var duration = getValueAtIndexOrReturn(instance.props.duration, 0, defaultProps.duration);

      if (isAlreadyVisible || isDestroyed || isDisabled || isTouchAndTouchDisabled) {
        return;
      } // Normalize `disabled` behavior across browsers.
      // Firefox allows events on disabled elements, but Chrome doesn't.
      // Using a wrapper element (i.e. <span>) is recommended.


      if (getCurrentTarget().hasAttribute('disabled')) {
        return;
      }

      invokeHook('onShow', [instance], false);

      if (instance.props.onShow(instance) === false) {
        return;
      }

      instance.state.isVisible = true;

      if (getIsDefaultRenderFn()) {
        popper.style.visibility = 'visible';
      }

      handleStyles();
      addDocumentPress();

      if (!instance.state.isMounted) {
        popper.style.transition = 'none';
      } // If flipping to the opposite side after hiding at least once, the
      // animation will use the wrong placement without resetting the duration


      if (getIsDefaultRenderFn()) {
        var _getDefaultTemplateCh2 = getDefaultTemplateChildren(),
            box = _getDefaultTemplateCh2.box,
            content = _getDefaultTemplateCh2.content;

        setTransitionDuration([box, content], 0);
      }

      onFirstUpdate = function onFirstUpdate() {
        var _instance$popperInsta2;

        if (!instance.state.isVisible || ignoreOnFirstUpdate) {
          return;
        }

        ignoreOnFirstUpdate = true; // reflow

        void popper.offsetHeight;
        popper.style.transition = instance.props.moveTransition;

        if (getIsDefaultRenderFn() && instance.props.animation) {
          var _getDefaultTemplateCh3 = getDefaultTemplateChildren(),
              _box = _getDefaultTemplateCh3.box,
              _content = _getDefaultTemplateCh3.content;

          setTransitionDuration([_box, _content], duration);
          setVisibilityState([_box, _content], 'visible');
        }

        handleAriaContentAttribute();
        handleAriaExpandedAttribute();
        pushIfUnique(mountedInstances, instance); // certain modifiers (e.g. `maxSize`) require a second update after the
        // popper has been positioned for the first time

        (_instance$popperInsta2 = instance.popperInstance) == null ? void 0 : _instance$popperInsta2.forceUpdate();
        instance.state.isMounted = true;
        invokeHook('onMount', [instance]);

        if (instance.props.animation && getIsDefaultRenderFn()) {
          onTransitionedIn(duration, function () {
            instance.state.isShown = true;
            invokeHook('onShown', [instance]);
          });
        }
      };

      mount();
    }

    function hide() {
      /* istanbul ignore else */
      {
        warnWhen(instance.state.isDestroyed, createMemoryLeakWarning('hide'));
      } // Early bail-out


      var isAlreadyHidden = !instance.state.isVisible;
      var isDestroyed = instance.state.isDestroyed;
      var isDisabled = !instance.state.isEnabled;
      var duration = getValueAtIndexOrReturn(instance.props.duration, 1, defaultProps.duration);

      if (isAlreadyHidden || isDestroyed || isDisabled) {
        return;
      }

      invokeHook('onHide', [instance], false);

      if (instance.props.onHide(instance) === false) {
        return;
      }

      instance.state.isVisible = false;
      instance.state.isShown = false;
      ignoreOnFirstUpdate = false;
      isVisibleFromClick = false;

      if (getIsDefaultRenderFn()) {
        popper.style.visibility = 'hidden';
      }

      cleanupInteractiveMouseListeners();
      removeDocumentPress();
      handleStyles();

      if (getIsDefaultRenderFn()) {
        var _getDefaultTemplateCh4 = getDefaultTemplateChildren(),
            box = _getDefaultTemplateCh4.box,
            content = _getDefaultTemplateCh4.content;

        if (instance.props.animation) {
          setTransitionDuration([box, content], duration);
          setVisibilityState([box, content], 'hidden');
        }
      }

      handleAriaContentAttribute();
      handleAriaExpandedAttribute();

      if (instance.props.animation) {
        if (getIsDefaultRenderFn()) {
          onTransitionedOut(duration, instance.unmount);
        }
      } else {
        instance.unmount();
      }
    }

    function hideWithInteractivity(event) {
      /* istanbul ignore else */
      {
        warnWhen(instance.state.isDestroyed, createMemoryLeakWarning('hideWithInteractivity'));
      }

      getDocument().addEventListener('mousemove', debouncedOnMouseMove);
      pushIfUnique(mouseMoveListeners, debouncedOnMouseMove);
      debouncedOnMouseMove(event);
    }

    function unmount() {
      /* istanbul ignore else */
      {
        warnWhen(instance.state.isDestroyed, createMemoryLeakWarning('unmount'));
      }

      if (instance.state.isVisible) {
        instance.hide();
      }

      if (!instance.state.isMounted) {
        return;
      }

      destroyPopperInstance(); // If a popper is not interactive, it will be appended outside the popper
      // tree by default. This seems mainly for interactive tippies, but we should
      // find a workaround if possible

      getNestedPopperTree().forEach(function (nestedPopper) {
        nestedPopper._tippy.unmount();
      });

      if (popper.parentNode) {
        popper.parentNode.removeChild(popper);
      }

      mountedInstances = mountedInstances.filter(function (i) {
        return i !== instance;
      });
      instance.state.isMounted = false;
      invokeHook('onHidden', [instance]);
    }

    function destroy() {
      /* istanbul ignore else */
      {
        warnWhen(instance.state.isDestroyed, createMemoryLeakWarning('destroy'));
      }

      if (instance.state.isDestroyed) {
        return;
      }

      instance.clearDelayTimeouts();
      instance.unmount();
      removeListeners();
      delete reference._tippy;
      instance.state.isDestroyed = true;
      invokeHook('onDestroy', [instance]);
    }
  }

  function tippy(targets, optionalProps) {
    if (optionalProps === void 0) {
      optionalProps = {};
    }

    var plugins = defaultProps.plugins.concat(optionalProps.plugins || []);
    /* istanbul ignore else */

    {
      validateTargets(targets);
      validateProps(optionalProps, plugins);
    }

    bindGlobalEventListeners();
    var passedProps = Object.assign({}, optionalProps, {
      plugins: plugins
    });
    var elements = getArrayOfElements(targets);
    /* istanbul ignore else */

    {
      var isSingleContentElement = isElement(passedProps.content);
      var isMoreThanOneReferenceElement = elements.length > 1;
      warnWhen(isSingleContentElement && isMoreThanOneReferenceElement, ['tippy() was passed an Element as the `content` prop, but more than', 'one tippy instance was created by this invocation. This means the', 'content element will only be appended to the last tippy instance.', '\n\n', 'Instead, pass the .innerHTML of the element, or use a function that', 'returns a cloned version of the element instead.', '\n\n', '1) content: element.innerHTML\n', '2) content: () => element.cloneNode(true)'].join(' '));
    }

    var instances = elements.reduce(function (acc, reference) {
      var instance = reference && createTippy(reference, passedProps);

      if (instance) {
        acc.push(instance);
      }

      return acc;
    }, []);
    return isElement(targets) ? instances[0] : instances;
  }

  tippy.defaultProps = defaultProps;
  tippy.setDefaultProps = setDefaultProps;
  tippy.currentInput = currentInput;

  // every time the popper is destroyed (i.e. a new target), removing the styles
  // and causing transitions to break for singletons when the console is open, but
  // most notably for non-transform styles being used, `gpuAcceleration: false`.

  Object.assign({}, applyStyles$1, {
    effect: function effect(_ref) {
      var state = _ref.state;
      var initialStyles = {
        popper: {
          position: state.options.strategy,
          left: '0',
          top: '0',
          margin: '0'
        },
        arrow: {
          position: 'absolute'
        },
        reference: {}
      };
      Object.assign(state.elements.popper.style, initialStyles.popper);
      state.styles = initialStyles;

      if (state.elements.arrow) {
        Object.assign(state.elements.arrow.style, initialStyles.arrow);
      } // intentionally return no cleanup function
      // return () => { ... }

    }
  });

  tippy.setDefaultProps({
    render: render
  });

  class BubbleMenuView {
    constructor({ editor, element, view, tippyOptions, }) {
      this.preventHide = false;
      this.mousedownHandler = () => {
        this.preventHide = true;
      };
      this.focusHandler = () => {
        // we use `setTimeout` to make sure `selection` is already updated
        setTimeout(() => this.update(this.editor.view));
      };
      this.blurHandler = ({ event }) => {
        var _a;
        if (this.preventHide) {
          this.preventHide = false;
          return;
        }
        if ((event === null || event === void 0 ? void 0 : event.relatedTarget)
          && ((_a = this.element.parentNode) === null || _a === void 0 ? void 0 : _a.contains(event.relatedTarget))) {
          return;
        }
        this.hide();
      };
      this.editor = editor;
      this.element = element;
      this.view = view;
      this.element.addEventListener('mousedown', this.mousedownHandler, { capture: true });
      this.editor.on('focus', this.focusHandler);
      this.editor.on('blur', this.blurHandler);
      this.createTooltip(tippyOptions);
      this.element.style.visibility = 'visible';
    }
    createTooltip(options = {}) {
      this.tippy = tippy(this.view.dom, {
        duration: 0,
        getReferenceClientRect: null,
        content: this.element,
        interactive: true,
        trigger: 'manual',
        placement: 'top',
        hideOnClick: 'toggle',
        ...options,
      });
    }
    update(view, oldState) {
      const { state, composing } = view;
      const { doc, selection } = state;
      const isSame = oldState && oldState.doc.eq(doc) && oldState.selection.eq(selection);
      if (composing || isSame) {
        return;
      }
      const { empty, $anchor, ranges } = selection;
      // support for CellSelections
      const from = Math.min(...ranges.map(range => range.$from.pos));
      const to = Math.max(...ranges.map(range => range.$to.pos));
      // Sometime check for `empty` is not enough.
      // Doubleclick an empty paragraph returns a node size of 2.
      // So we check also for an empty text size.
      if (empty || !$anchor.parent.textContent) {
        this.hide();
        return;
      }
      this.tippy.setProps({
        getReferenceClientRect: () => {
          return posToDOMRect(view, from, to);
        }
      });
      this.show();
    }
    show() {
      this.tippy.show();
      this.editor.emit('bubble-menu-show');
    }
    hide() {
      this.tippy.hide();
      this.editor.emit('bubble-menu-hide');
    }
    destroy() {
      this.tippy.destroy();
      this.element.removeEventListener('mousedown', this.mousedownHandler);
      this.editor.off('focus', this.focusHandler);
      this.editor.off('blur', this.blurHandler);
    }
  }
  new PluginKey('menuBubble');
  const BubbleMenuPlugin = (options) => {
    return new Plugin({
      key: new PluginKey(options.key || 'menuBubble'),
      view: view => new BubbleMenuView({ view, ...options }),
    });
  };

  const BubbleMenu = Extension.create({
    name: 'bubbleMenu',
    defaultOptions: {
      element: null,
      tippyOptions: {},
    },
    addProseMirrorPlugins() {
      if (!this.options.element) {
        return [];
      }
      return [
        BubbleMenuPlugin({
          key: this.options.key || 'menuBubble',
          editor: this.editor,
          element: this.options.element,
          tippyOptions: this.options.tippyOptions,
        }),
      ];
    },
  });

  const inputRegex$3 = /^\s*([-+*])\s$/;
  const BulletList = Node.create({
      name: 'bulletList',
      defaultOptions: {
          HTMLAttributes: {},
      },
      group: 'block list',
      content: 'listItem+',
      parseHTML() {
          return [
              { tag: 'ul' },
          ];
      },
      renderHTML({ HTMLAttributes }) {
          return ['ul', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
      },
      addCommands() {
          return {
              toggleBulletList: () => ({ commands }) => {
                  return commands.toggleList('bulletList', 'listItem');
              },
          };
      },
      addKeyboardShortcuts() {
          return {
              'Mod-Shift-8': () => this.editor.commands.toggleBulletList(),
          };
      },
      addInputRules() {
          return [
              wrappingInputRule(inputRegex$3, this.type),
          ];
      },
  });

  const inputRegex$2 = /(?:^|\s)((?:`)((?:[^`]+))(?:`))$/gm;
  const Code = Mark.create({
      name: 'code',
      defaultOptions: {
          HTMLAttributes: {},
      },
      excludes: '_',
      parseHTML() {
          return [
              { tag: 'code' },
          ];
      },
      renderHTML({ HTMLAttributes }) {
          return ['code', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
      },
      addCommands() {
          return {
              setCode: () => ({ commands }) => {
                  return commands.setMark('code');
              },
              toggleCode: () => ({ commands }) => {
                  return commands.toggleMark('code');
              },
              unsetCode: () => ({ commands }) => {
                  return commands.unsetMark('code');
              },
          };
      },
      addKeyboardShortcuts() {
          return {
              'Mod-e': () => this.editor.commands.toggleCode(),
          };
      },
      addInputRules() {
          return [
              markInputRule(inputRegex$2, this.type),
          ];
      },
      addPasteRules() {
          return [
              markPasteRule(inputRegex$2, this.type),
          ];
      },
  });

  const backtickInputRegex = /^```(?<language>[a-z]*)? $/;
  const tildeInputRegex = /^~~~(?<language>[a-z]*)? $/;
  const CodeBlock = Node.create({
      name: 'codeBlock',
      defaultOptions: {
          languageClassPrefix: 'language-',
          HTMLAttributes: {},
      },
      content: 'text*',
      marks: '',
      group: 'block',
      code: true,
      defining: true,
      addAttributes() {
          return {
              language: {
                  default: null,
                  parseHTML: element => {
                      var _a;
                      const classAttribute = (_a = element.firstElementChild) === null || _a === void 0 ? void 0 : _a.getAttribute('class');
                      if (!classAttribute) {
                          return null;
                      }
                      const regexLanguageClassPrefix = new RegExp(`^(${this.options.languageClassPrefix})`);
                      return {
                          language: classAttribute.replace(regexLanguageClassPrefix, ''),
                      };
                  },
                  renderHTML: attributes => {
                      if (!attributes.language) {
                          return null;
                      }
                      return {
                          class: this.options.languageClassPrefix + attributes.language,
                      };
                  },
              },
          };
      },
      parseHTML() {
          return [
              {
                  tag: 'pre',
                  preserveWhitespace: 'full',
              },
          ];
      },
      renderHTML({ HTMLAttributes }) {
          return ['pre', this.options.HTMLAttributes, ['code', HTMLAttributes, 0]];
      },
      addCommands() {
          return {
              setCodeBlock: attributes => ({ commands }) => {
                  return commands.setNode('codeBlock', attributes);
              },
              toggleCodeBlock: attributes => ({ commands }) => {
                  return commands.toggleNode('codeBlock', 'paragraph', attributes);
              },
          };
      },
      addKeyboardShortcuts() {
          return {
              'Mod-Alt-c': () => this.editor.commands.toggleCodeBlock(),
              // remove code block when at start of document or code block is empty
              Backspace: () => {
                  const { empty, $anchor } = this.editor.state.selection;
                  const isAtStart = $anchor.pos === 1;
                  if (!empty || $anchor.parent.type.name !== this.name) {
                      return false;
                  }
                  if (isAtStart || !$anchor.parent.textContent.length) {
                      return this.editor.commands.clearNodes();
                  }
                  return false;
              },
          };
      },
      addInputRules() {
          return [
              textblockTypeInputRule(backtickInputRegex, this.type, ({ groups }) => groups),
              textblockTypeInputRule(tildeInputRegex, this.type, ({ groups }) => groups),
          ];
      },
  });

  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */
  function isObject(value) {
    var type = typeof value;
    return value != null && (type == 'object' || type == 'function');
  }

  var isObject_1 = isObject;

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

  var _freeGlobal = freeGlobal;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = _freeGlobal || freeSelf || Function('return this')();

  var _root = root;

  /**
   * Gets the timestamp of the number of milliseconds that have elapsed since
   * the Unix epoch (1 January 1970 00:00:00 UTC).
   *
   * @static
   * @memberOf _
   * @since 2.4.0
   * @category Date
   * @returns {number} Returns the timestamp.
   * @example
   *
   * _.defer(function(stamp) {
   *   console.log(_.now() - stamp);
   * }, _.now());
   * // => Logs the number of milliseconds it took for the deferred invocation.
   */
  var now = function() {
    return _root.Date.now();
  };

  var now_1 = now;

  /** Used to match a single whitespace character. */
  var reWhitespace = /\s/;

  /**
   * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
   * character of `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the index of the last non-whitespace character.
   */
  function trimmedEndIndex(string) {
    var index = string.length;

    while (index-- && reWhitespace.test(string.charAt(index))) {}
    return index;
  }

  var _trimmedEndIndex = trimmedEndIndex;

  /** Used to match leading whitespace. */
  var reTrimStart = /^\s+/;

  /**
   * The base implementation of `_.trim`.
   *
   * @private
   * @param {string} string The string to trim.
   * @returns {string} Returns the trimmed string.
   */
  function baseTrim(string) {
    return string
      ? string.slice(0, _trimmedEndIndex(string) + 1).replace(reTrimStart, '')
      : string;
  }

  var _baseTrim = baseTrim;

  /** Built-in value references. */
  var Symbol$1 = _root.Symbol;

  var _Symbol = Symbol$1;

  /** Used for built-in method references. */
  var objectProto$1 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto$1.hasOwnProperty;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString$1 = objectProto$1.toString;

  /** Built-in value references. */
  var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

  /**
   * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the raw `toStringTag`.
   */
  function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag$1),
        tag = value[symToStringTag$1];

    try {
      value[symToStringTag$1] = undefined;
      var unmasked = true;
    } catch (e) {}

    var result = nativeObjectToString$1.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag$1] = tag;
      } else {
        delete value[symToStringTag$1];
      }
    }
    return result;
  }

  var _getRawTag = getRawTag;

  /** Used for built-in method references. */
  var objectProto = Object.prototype;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString = objectProto.toString;

  /**
   * Converts `value` to a string using `Object.prototype.toString`.
   *
   * @private
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   */
  function objectToString(value) {
    return nativeObjectToString.call(value);
  }

  var _objectToString = objectToString;

  /** `Object#toString` result references. */
  var nullTag = '[object Null]',
      undefinedTag = '[object Undefined]';

  /** Built-in value references. */
  var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

  /**
   * The base implementation of `getTag` without fallbacks for buggy environments.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  function baseGetTag(value) {
    if (value == null) {
      return value === undefined ? undefinedTag : nullTag;
    }
    return (symToStringTag && symToStringTag in Object(value))
      ? _getRawTag(value)
      : _objectToString(value);
  }

  var _baseGetTag = baseGetTag;

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike(value) {
    return value != null && typeof value == 'object';
  }

  var isObjectLike_1 = isObjectLike;

  /** `Object#toString` result references. */
  var symbolTag = '[object Symbol]';

  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */
  function isSymbol(value) {
    return typeof value == 'symbol' ||
      (isObjectLike_1(value) && _baseGetTag(value) == symbolTag);
  }

  var isSymbol_1 = isSymbol;

  /** Used as references for various `Number` constants. */
  var NAN = 0 / 0;

  /** Used to detect bad signed hexadecimal string values. */
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

  /** Used to detect binary string values. */
  var reIsBinary = /^0b[01]+$/i;

  /** Used to detect octal string values. */
  var reIsOctal = /^0o[0-7]+$/i;

  /** Built-in method references without a dependency on `root`. */
  var freeParseInt = parseInt;

  /**
   * Converts `value` to a number.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to process.
   * @returns {number} Returns the number.
   * @example
   *
   * _.toNumber(3.2);
   * // => 3.2
   *
   * _.toNumber(Number.MIN_VALUE);
   * // => 5e-324
   *
   * _.toNumber(Infinity);
   * // => Infinity
   *
   * _.toNumber('3.2');
   * // => 3.2
   */
  function toNumber(value) {
    if (typeof value == 'number') {
      return value;
    }
    if (isSymbol_1(value)) {
      return NAN;
    }
    if (isObject_1(value)) {
      var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
      value = isObject_1(other) ? (other + '') : other;
    }
    if (typeof value != 'string') {
      return value === 0 ? value : +value;
    }
    value = _baseTrim(value);
    var isBinary = reIsBinary.test(value);
    return (isBinary || reIsOctal.test(value))
      ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
      : (reIsBadHex.test(value) ? NAN : +value);
  }

  var toNumber_1 = toNumber;

  /** Error message constants. */
  var FUNC_ERROR_TEXT = 'Expected a function';

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeMax = Math.max,
      nativeMin = Math.min;

  /**
   * Creates a debounced function that delays invoking `func` until after `wait`
   * milliseconds have elapsed since the last time the debounced function was
   * invoked. The debounced function comes with a `cancel` method to cancel
   * delayed `func` invocations and a `flush` method to immediately invoke them.
   * Provide `options` to indicate whether `func` should be invoked on the
   * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
   * with the last arguments provided to the debounced function. Subsequent
   * calls to the debounced function return the result of the last `func`
   * invocation.
   *
   * **Note:** If `leading` and `trailing` options are `true`, `func` is
   * invoked on the trailing edge of the timeout only if the debounced function
   * is invoked more than once during the `wait` timeout.
   *
   * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
   * until to the next tick, similar to `setTimeout` with a timeout of `0`.
   *
   * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
   * for details over the differences between `_.debounce` and `_.throttle`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Function
   * @param {Function} func The function to debounce.
   * @param {number} [wait=0] The number of milliseconds to delay.
   * @param {Object} [options={}] The options object.
   * @param {boolean} [options.leading=false]
   *  Specify invoking on the leading edge of the timeout.
   * @param {number} [options.maxWait]
   *  The maximum time `func` is allowed to be delayed before it's invoked.
   * @param {boolean} [options.trailing=true]
   *  Specify invoking on the trailing edge of the timeout.
   * @returns {Function} Returns the new debounced function.
   * @example
   *
   * // Avoid costly calculations while the window size is in flux.
   * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
   *
   * // Invoke `sendMail` when clicked, debouncing subsequent calls.
   * jQuery(element).on('click', _.debounce(sendMail, 300, {
   *   'leading': true,
   *   'trailing': false
   * }));
   *
   * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
   * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
   * var source = new EventSource('/stream');
   * jQuery(source).on('message', debounced);
   *
   * // Cancel the trailing debounced invocation.
   * jQuery(window).on('popstate', debounced.cancel);
   */
  function debounce(func, wait, options) {
    var lastArgs,
        lastThis,
        maxWait,
        result,
        timerId,
        lastCallTime,
        lastInvokeTime = 0,
        leading = false,
        maxing = false,
        trailing = true;

    if (typeof func != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    wait = toNumber_1(wait) || 0;
    if (isObject_1(options)) {
      leading = !!options.leading;
      maxing = 'maxWait' in options;
      maxWait = maxing ? nativeMax(toNumber_1(options.maxWait) || 0, wait) : maxWait;
      trailing = 'trailing' in options ? !!options.trailing : trailing;
    }

    function invokeFunc(time) {
      var args = lastArgs,
          thisArg = lastThis;

      lastArgs = lastThis = undefined;
      lastInvokeTime = time;
      result = func.apply(thisArg, args);
      return result;
    }

    function leadingEdge(time) {
      // Reset any `maxWait` timer.
      lastInvokeTime = time;
      // Start the timer for the trailing edge.
      timerId = setTimeout(timerExpired, wait);
      // Invoke the leading edge.
      return leading ? invokeFunc(time) : result;
    }

    function remainingWait(time) {
      var timeSinceLastCall = time - lastCallTime,
          timeSinceLastInvoke = time - lastInvokeTime,
          timeWaiting = wait - timeSinceLastCall;

      return maxing
        ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
        : timeWaiting;
    }

    function shouldInvoke(time) {
      var timeSinceLastCall = time - lastCallTime,
          timeSinceLastInvoke = time - lastInvokeTime;

      // Either this is the first call, activity has stopped and we're at the
      // trailing edge, the system time has gone backwards and we're treating
      // it as the trailing edge, or we've hit the `maxWait` limit.
      return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
        (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
    }

    function timerExpired() {
      var time = now_1();
      if (shouldInvoke(time)) {
        return trailingEdge(time);
      }
      // Restart the timer.
      timerId = setTimeout(timerExpired, remainingWait(time));
    }

    function trailingEdge(time) {
      timerId = undefined;

      // Only invoke if we have `lastArgs` which means `func` has been
      // debounced at least once.
      if (trailing && lastArgs) {
        return invokeFunc(time);
      }
      lastArgs = lastThis = undefined;
      return result;
    }

    function cancel() {
      if (timerId !== undefined) {
        clearTimeout(timerId);
      }
      lastInvokeTime = 0;
      lastArgs = lastCallTime = lastThis = timerId = undefined;
    }

    function flush() {
      return timerId === undefined ? result : trailingEdge(now_1());
    }

    function debounced() {
      var time = now_1(),
          isInvoking = shouldInvoke(time);

      lastArgs = arguments;
      lastThis = this;
      lastCallTime = time;

      if (isInvoking) {
        if (timerId === undefined) {
          return leadingEdge(lastCallTime);
        }
        if (maxing) {
          // Handle invocations in a tight loop.
          clearTimeout(timerId);
          timerId = setTimeout(timerExpired, wait);
          return invokeFunc(lastCallTime);
        }
      }
      if (timerId === undefined) {
        timerId = setTimeout(timerExpired, wait);
      }
      return result;
    }
    debounced.cancel = cancel;
    debounced.flush = flush;
    return debounced;
  }

  var debounce_1 = debounce;

  const Document = Node.create({
      name: 'doc',
      topNode: true,
      content: 'block+',
  });

  // :: (options: ?Object) → Plugin
  // Create a plugin that, when added to a ProseMirror instance,
  // causes a decoration to show up at the drop position when something
  // is dragged over the editor.
  //
  //   options::- These options are supported:
  //
  //     color:: ?string
  //     The color of the cursor. Defaults to `black`.
  //
  //     width:: ?number
  //     The precise width of the cursor in pixels. Defaults to 1.
  //
  //     class:: ?string
  //     A CSS class name to add to the cursor element.
  function dropCursor(options) {
    if ( options === void 0 ) options = {};

    return new Plugin({
      view: function view(editorView) { return new DropCursorView(editorView, options) }
    })
  }

  var DropCursorView = function DropCursorView(editorView, options) {
    var this$1 = this;

    this.editorView = editorView;
    this.width = options.width || 1;
    this.color = options.color || "black";
    this.class = options.class;
    this.cursorPos = null;
    this.element = null;
    this.timeout = null;

    this.handlers = ["dragover", "dragend", "drop", "dragleave"].map(function (name) {
      var handler = function (e) { return this$1[name](e); };
      editorView.dom.addEventListener(name, handler);
      return {name: name, handler: handler}
    });
  };

  DropCursorView.prototype.destroy = function destroy () {
      var this$1 = this;

    this.handlers.forEach(function (ref) {
        var name = ref.name;
        var handler = ref.handler;

        return this$1.editorView.dom.removeEventListener(name, handler);
      });
  };

  DropCursorView.prototype.update = function update (editorView, prevState) {
    if (this.cursorPos != null && prevState.doc != editorView.state.doc) { this.updateOverlay(); }
  };

  DropCursorView.prototype.setCursor = function setCursor (pos) {
    if (pos == this.cursorPos) { return }
    this.cursorPos = pos;
    if (pos == null) {
      this.element.parentNode.removeChild(this.element);
      this.element = null;
    } else {
      this.updateOverlay();
    }
  };

  DropCursorView.prototype.updateOverlay = function updateOverlay () {
    var $pos = this.editorView.state.doc.resolve(this.cursorPos), rect;
    if (!$pos.parent.inlineContent) {
      var before = $pos.nodeBefore, after = $pos.nodeAfter;
      if (before || after) {
        var nodeRect = this.editorView.nodeDOM(this.cursorPos - (before ?before.nodeSize : 0)).getBoundingClientRect();
        var top = before ? nodeRect.bottom : nodeRect.top;
        if (before && after)
          { top = (top + this.editorView.nodeDOM(this.cursorPos).getBoundingClientRect().top) / 2; }
        rect = {left: nodeRect.left, right: nodeRect.right, top: top - this.width / 2, bottom: top + this.width / 2};
      }
    }
    if (!rect) {
      var coords = this.editorView.coordsAtPos(this.cursorPos);
      rect = {left: coords.left - this.width / 2, right: coords.left + this.width / 2, top: coords.top, bottom: coords.bottom};
    }

    var parent = this.editorView.dom.offsetParent;
    if (!this.element) {
      this.element = parent.appendChild(document.createElement("div"));
      if (this.class) { this.element.className = this.class; }
      this.element.style.cssText = "position: absolute; z-index: 50; pointer-events: none; background-color: " + this.color;
    }
    var parentLeft, parentTop;
    if (!parent || parent == document.body && getComputedStyle(parent).position == "static") {
      parentLeft = -pageXOffset;
      parentTop = -pageYOffset;
    } else {
      var rect$1 = parent.getBoundingClientRect();
      parentLeft = rect$1.left - parent.scrollLeft;
      parentTop = rect$1.top - parent.scrollTop;
    }
    this.element.style.left = (rect.left - parentLeft) + "px";
    this.element.style.top = (rect.top - parentTop) + "px";
    this.element.style.width = (rect.right - rect.left) + "px";
    this.element.style.height = (rect.bottom - rect.top) + "px";
  };

  DropCursorView.prototype.scheduleRemoval = function scheduleRemoval (timeout) {
      var this$1 = this;

    clearTimeout(this.timeout);
    this.timeout = setTimeout(function () { return this$1.setCursor(null); }, timeout);
  };

  DropCursorView.prototype.dragover = function dragover (event) {
    if (!this.editorView.editable) { return }
    var pos = this.editorView.posAtCoords({left: event.clientX, top: event.clientY});
    if (pos) {
      var target = pos.pos;
      if (this.editorView.dragging && this.editorView.dragging.slice) {
        target = dropPoint(this.editorView.state.doc, target, this.editorView.dragging.slice);
        if (target == null) { return this.setCursor(null) }
      }
      this.setCursor(target);
      this.scheduleRemoval(5000);
    }
  };

  DropCursorView.prototype.dragend = function dragend () {
    this.scheduleRemoval(20);
  };

  DropCursorView.prototype.drop = function drop () {
    this.scheduleRemoval(20);
  };

  DropCursorView.prototype.dragleave = function dragleave (event) {
    if (event.target == this.editorView.dom || !this.editorView.dom.contains(event.relatedTarget))
      { this.setCursor(null); }
  };

  const Dropcursor = Extension.create({
      name: 'dropCursor',
      defaultOptions: {
          color: 'black',
          width: 1,
          class: null,
      },
      addProseMirrorPlugins() {
          return [
              dropCursor(this.options),
          ];
      },
  });

  // ::- Gap cursor selections are represented using this class. Its
  // `$anchor` and `$head` properties both point at the cursor position.
  var GapCursor = /*@__PURE__*/(function (Selection) {
    function GapCursor($pos) {
      Selection.call(this, $pos, $pos);
    }

    if ( Selection ) GapCursor.__proto__ = Selection;
    GapCursor.prototype = Object.create( Selection && Selection.prototype );
    GapCursor.prototype.constructor = GapCursor;

    GapCursor.prototype.map = function map (doc, mapping) {
      var $pos = doc.resolve(mapping.map(this.head));
      return GapCursor.valid($pos) ? new GapCursor($pos) : Selection.near($pos)
    };

    GapCursor.prototype.content = function content () { return Slice.empty };

    GapCursor.prototype.eq = function eq (other) {
      return other instanceof GapCursor && other.head == this.head
    };

    GapCursor.prototype.toJSON = function toJSON () {
      return {type: "gapcursor", pos: this.head}
    };

    GapCursor.fromJSON = function fromJSON (doc, json) {
      if (typeof json.pos != "number") { throw new RangeError("Invalid input for GapCursor.fromJSON") }
      return new GapCursor(doc.resolve(json.pos))
    };

    GapCursor.prototype.getBookmark = function getBookmark () { return new GapBookmark(this.anchor) };

    GapCursor.valid = function valid ($pos) {
      var parent = $pos.parent;
      if (parent.isTextblock || !closedBefore($pos) || !closedAfter($pos)) { return false }
      var override = parent.type.spec.allowGapCursor;
      if (override != null) { return override }
      var deflt = parent.contentMatchAt($pos.index()).defaultType;
      return deflt && deflt.isTextblock
    };

    GapCursor.findFrom = function findFrom ($pos, dir, mustMove) {
      search: for (;;) {
        if (!mustMove && GapCursor.valid($pos)) { return $pos }
        var pos = $pos.pos, next = null;
        // Scan up from this position
        for (var d = $pos.depth;; d--) {
          var parent = $pos.node(d);
          if (dir > 0 ? $pos.indexAfter(d) < parent.childCount : $pos.index(d) > 0) {
            next = parent.child(dir > 0 ? $pos.indexAfter(d) : $pos.index(d) - 1);
            break
          } else if (d == 0) {
            return null
          }
          pos += dir;
          var $cur = $pos.doc.resolve(pos);
          if (GapCursor.valid($cur)) { return $cur }
        }

        // And then down into the next node
        for (;;) {
          var inside = dir > 0 ? next.firstChild : next.lastChild;
          if (!inside) {
            if (next.isAtom && !next.isText && !NodeSelection.isSelectable(next)) {
              $pos = $pos.doc.resolve(pos + next.nodeSize * dir);
              mustMove = false;
              continue search
            }
            break
          }
          next = inside;
          pos += dir;
          var $cur$1 = $pos.doc.resolve(pos);
          if (GapCursor.valid($cur$1)) { return $cur$1 }
        }

        return null
      }
    };

    return GapCursor;
  }(Selection));

  GapCursor.prototype.visible = false;

  Selection.jsonID("gapcursor", GapCursor);

  var GapBookmark = function GapBookmark(pos) {
    this.pos = pos;
  };
  GapBookmark.prototype.map = function map (mapping) {
    return new GapBookmark(mapping.map(this.pos))
  };
  GapBookmark.prototype.resolve = function resolve (doc) {
    var $pos = doc.resolve(this.pos);
    return GapCursor.valid($pos) ? new GapCursor($pos) : Selection.near($pos)
  };

  function closedBefore($pos) {
    for (var d = $pos.depth; d >= 0; d--) {
      var index = $pos.index(d);
      // At the start of this parent, look at next one
      if (index == 0) { continue }
      // See if the node before (or its first ancestor) is closed
      for (var before = $pos.node(d).child(index - 1);; before = before.lastChild) {
        if ((before.childCount == 0 && !before.inlineContent) || before.isAtom || before.type.spec.isolating) { return true }
        if (before.inlineContent) { return false }
      }
    }
    // Hit start of document
    return true
  }

  function closedAfter($pos) {
    for (var d = $pos.depth; d >= 0; d--) {
      var index = $pos.indexAfter(d), parent = $pos.node(d);
      if (index == parent.childCount) { continue }
      for (var after = parent.child(index);; after = after.firstChild) {
        if ((after.childCount == 0 && !after.inlineContent) || after.isAtom || after.type.spec.isolating) { return true }
        if (after.inlineContent) { return false }
      }
    }
    return true
  }

  // :: () → Plugin
  // Create a gap cursor plugin. When enabled, this will capture clicks
  // near and arrow-key-motion past places that don't have a normally
  // selectable position nearby, and create a gap cursor selection for
  // them. The cursor is drawn as an element with class
  // `ProseMirror-gapcursor`. You can either include
  // `style/gapcursor.css` from the package's directory or add your own
  // styles to make it visible.
  var gapCursor = function() {
    return new Plugin({
      props: {
        decorations: drawGapCursor,

        createSelectionBetween: function createSelectionBetween(_view, $anchor, $head) {
          if ($anchor.pos == $head.pos && GapCursor.valid($head)) { return new GapCursor($head) }
        },

        handleClick: handleClick,
        handleKeyDown: handleKeyDown
      }
    })
  };

  var handleKeyDown = keydownHandler({
    "ArrowLeft": arrow$1("horiz", -1),
    "ArrowRight": arrow$1("horiz", 1),
    "ArrowUp": arrow$1("vert", -1),
    "ArrowDown": arrow$1("vert", 1)
  });

  function arrow$1(axis, dir) {
    var dirStr = axis == "vert" ? (dir > 0 ? "down" : "up") : (dir > 0 ? "right" : "left");
    return function(state, dispatch, view) {
      var sel = state.selection;
      var $start = dir > 0 ? sel.$to : sel.$from, mustMove = sel.empty;
      if (sel instanceof TextSelection) {
        if (!view.endOfTextblock(dirStr) || $start.depth == 0) { return false }
        mustMove = false;
        $start = state.doc.resolve(dir > 0 ? $start.after() : $start.before());
      }
      var $found = GapCursor.findFrom($start, dir, mustMove);
      if (!$found) { return false }
      if (dispatch) { dispatch(state.tr.setSelection(new GapCursor($found))); }
      return true
    }
  }

  function handleClick(view, pos, event) {
    if (!view.editable) { return false }
    var $pos = view.state.doc.resolve(pos);
    if (!GapCursor.valid($pos)) { return false }
    var ref = view.posAtCoords({left: event.clientX, top: event.clientY});
    var inside = ref.inside;
    if (inside > -1 && NodeSelection.isSelectable(view.state.doc.nodeAt(inside))) { return false }
    view.dispatch(view.state.tr.setSelection(new GapCursor($pos)));
    return true
  }

  function drawGapCursor(state) {
    if (!(state.selection instanceof GapCursor)) { return null }
    var node = document.createElement("div");
    node.className = "ProseMirror-gapcursor";
    return DecorationSet.create(state.doc, [Decoration.widget(state.selection.head, node, {key: "gapcursor"})])
  }

  const Gapcursor = Extension.create({
      name: 'gapCursor',
      addProseMirrorPlugins() {
          return [
              gapCursor(),
          ];
      },
      extendNodeSchema(extension) {
          var _a;
          const context = {
              name: extension.name,
              options: extension.options,
          };
          return {
              allowGapCursor: (_a = callOrReturn(getExtensionField(extension, 'allowGapCursor', context))) !== null && _a !== void 0 ? _a : null,
          };
      },
  });

  const HardBreak = Node.create({
      name: 'hardBreak',
      defaultOptions: {
          HTMLAttributes: {},
      },
      inline: true,
      group: 'inline',
      selectable: false,
      parseHTML() {
          return [
              { tag: 'br' },
          ];
      },
      renderHTML({ HTMLAttributes }) {
          return ['br', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
      },
      addCommands() {
          return {
              setHardBreak: () => ({ commands }) => {
                  return commands.first([
                      () => commands.exitCode(),
                      () => commands.insertContent({ type: this.name }),
                  ]);
              },
          };
      },
      addKeyboardShortcuts() {
          return {
              'Mod-Enter': () => this.editor.commands.setHardBreak(),
              'Shift-Enter': () => this.editor.commands.setHardBreak(),
          };
      },
  });

  const Heading = Node.create({
      name: 'heading',
      defaultOptions: {
          levels: [1, 2, 3, 4, 5, 6],
          HTMLAttributes: {},
      },
      content: 'inline*',
      group: 'block',
      defining: true,
      addAttributes() {
          return {
              level: {
                  default: 1,
                  rendered: false,
              },
          };
      },
      parseHTML() {
          return this.options.levels
              .map((level) => ({
              tag: `h${level}`,
              attrs: { level },
          }));
      },
      renderHTML({ node, HTMLAttributes }) {
          const hasLevel = this.options.levels.includes(node.attrs.level);
          const level = hasLevel
              ? node.attrs.level
              : this.options.levels[0];
          return [`h${level}`, mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
      },
      addCommands() {
          return {
              setHeading: attributes => ({ commands }) => {
                  if (!this.options.levels.includes(attributes.level)) {
                      return false;
                  }
                  return commands.setNode('heading', attributes);
              },
              toggleHeading: attributes => ({ commands }) => {
                  if (!this.options.levels.includes(attributes.level)) {
                      return false;
                  }
                  return commands.toggleNode('heading', 'paragraph', attributes);
              },
          };
      },
      addKeyboardShortcuts() {
          return this.options.levels.reduce((items, level) => ({
              ...items,
              ...{
                  [`Mod-Alt-${level}`]: () => this.editor.commands.toggleHeading({ level }),
              },
          }), {});
      },
      addInputRules() {
          return this.options.levels.map(level => {
              return textblockTypeInputRule(new RegExp(`^(#{1,${level}})\\s$`), this.type, { level });
          });
      },
  });

  var GOOD_LEAF_SIZE = 200;

  // :: class<T> A rope sequence is a persistent sequence data structure
  // that supports appending, prepending, and slicing without doing a
  // full copy. It is represented as a mostly-balanced tree.
  var RopeSequence = function RopeSequence () {};

  RopeSequence.prototype.append = function append (other) {
    if (!other.length) { return this }
    other = RopeSequence.from(other);

    return (!this.length && other) ||
      (other.length < GOOD_LEAF_SIZE && this.leafAppend(other)) ||
      (this.length < GOOD_LEAF_SIZE && other.leafPrepend(this)) ||
      this.appendInner(other)
  };

  // :: (union<[T], RopeSequence<T>>) → RopeSequence<T>
  // Prepend an array or other rope to this one, returning a new rope.
  RopeSequence.prototype.prepend = function prepend (other) {
    if (!other.length) { return this }
    return RopeSequence.from(other).append(this)
  };

  RopeSequence.prototype.appendInner = function appendInner (other) {
    return new Append(this, other)
  };

  // :: (?number, ?number) → RopeSequence<T>
  // Create a rope repesenting a sub-sequence of this rope.
  RopeSequence.prototype.slice = function slice (from, to) {
      if ( from === void 0 ) from = 0;
      if ( to === void 0 ) to = this.length;

    if (from >= to) { return RopeSequence.empty }
    return this.sliceInner(Math.max(0, from), Math.min(this.length, to))
  };

  // :: (number) → T
  // Retrieve the element at the given position from this rope.
  RopeSequence.prototype.get = function get (i) {
    if (i < 0 || i >= this.length) { return undefined }
    return this.getInner(i)
  };

  // :: ((element: T, index: number) → ?bool, ?number, ?number)
  // Call the given function for each element between the given
  // indices. This tends to be more efficient than looping over the
  // indices and calling `get`, because it doesn't have to descend the
  // tree for every element.
  RopeSequence.prototype.forEach = function forEach (f, from, to) {
      if ( from === void 0 ) from = 0;
      if ( to === void 0 ) to = this.length;

    if (from <= to)
      { this.forEachInner(f, from, to, 0); }
    else
      { this.forEachInvertedInner(f, from, to, 0); }
  };

  // :: ((element: T, index: number) → U, ?number, ?number) → [U]
  // Map the given functions over the elements of the rope, producing
  // a flat array.
  RopeSequence.prototype.map = function map (f, from, to) {
      if ( from === void 0 ) from = 0;
      if ( to === void 0 ) to = this.length;

    var result = [];
    this.forEach(function (elt, i) { return result.push(f(elt, i)); }, from, to);
    return result
  };

  // :: (?union<[T], RopeSequence<T>>) → RopeSequence<T>
  // Create a rope representing the given array, or return the rope
  // itself if a rope was given.
  RopeSequence.from = function from (values) {
    if (values instanceof RopeSequence) { return values }
    return values && values.length ? new Leaf(values) : RopeSequence.empty
  };

  var Leaf = /*@__PURE__*/(function (RopeSequence) {
    function Leaf(values) {
      RopeSequence.call(this);
      this.values = values;
    }

    if ( RopeSequence ) Leaf.__proto__ = RopeSequence;
    Leaf.prototype = Object.create( RopeSequence && RopeSequence.prototype );
    Leaf.prototype.constructor = Leaf;

    var prototypeAccessors = { length: { configurable: true },depth: { configurable: true } };

    Leaf.prototype.flatten = function flatten () {
      return this.values
    };

    Leaf.prototype.sliceInner = function sliceInner (from, to) {
      if (from == 0 && to == this.length) { return this }
      return new Leaf(this.values.slice(from, to))
    };

    Leaf.prototype.getInner = function getInner (i) {
      return this.values[i]
    };

    Leaf.prototype.forEachInner = function forEachInner (f, from, to, start) {
      for (var i = from; i < to; i++)
        { if (f(this.values[i], start + i) === false) { return false } }
    };

    Leaf.prototype.forEachInvertedInner = function forEachInvertedInner (f, from, to, start) {
      for (var i = from - 1; i >= to; i--)
        { if (f(this.values[i], start + i) === false) { return false } }
    };

    Leaf.prototype.leafAppend = function leafAppend (other) {
      if (this.length + other.length <= GOOD_LEAF_SIZE)
        { return new Leaf(this.values.concat(other.flatten())) }
    };

    Leaf.prototype.leafPrepend = function leafPrepend (other) {
      if (this.length + other.length <= GOOD_LEAF_SIZE)
        { return new Leaf(other.flatten().concat(this.values)) }
    };

    prototypeAccessors.length.get = function () { return this.values.length };

    prototypeAccessors.depth.get = function () { return 0 };

    Object.defineProperties( Leaf.prototype, prototypeAccessors );

    return Leaf;
  }(RopeSequence));

  // :: RopeSequence
  // The empty rope sequence.
  RopeSequence.empty = new Leaf([]);

  var Append = /*@__PURE__*/(function (RopeSequence) {
    function Append(left, right) {
      RopeSequence.call(this);
      this.left = left;
      this.right = right;
      this.length = left.length + right.length;
      this.depth = Math.max(left.depth, right.depth) + 1;
    }

    if ( RopeSequence ) Append.__proto__ = RopeSequence;
    Append.prototype = Object.create( RopeSequence && RopeSequence.prototype );
    Append.prototype.constructor = Append;

    Append.prototype.flatten = function flatten () {
      return this.left.flatten().concat(this.right.flatten())
    };

    Append.prototype.getInner = function getInner (i) {
      return i < this.left.length ? this.left.get(i) : this.right.get(i - this.left.length)
    };

    Append.prototype.forEachInner = function forEachInner (f, from, to, start) {
      var leftLen = this.left.length;
      if (from < leftLen &&
          this.left.forEachInner(f, from, Math.min(to, leftLen), start) === false)
        { return false }
      if (to > leftLen &&
          this.right.forEachInner(f, Math.max(from - leftLen, 0), Math.min(this.length, to) - leftLen, start + leftLen) === false)
        { return false }
    };

    Append.prototype.forEachInvertedInner = function forEachInvertedInner (f, from, to, start) {
      var leftLen = this.left.length;
      if (from > leftLen &&
          this.right.forEachInvertedInner(f, from - leftLen, Math.max(to, leftLen) - leftLen, start + leftLen) === false)
        { return false }
      if (to < leftLen &&
          this.left.forEachInvertedInner(f, Math.min(from, leftLen), to, start) === false)
        { return false }
    };

    Append.prototype.sliceInner = function sliceInner (from, to) {
      if (from == 0 && to == this.length) { return this }
      var leftLen = this.left.length;
      if (to <= leftLen) { return this.left.slice(from, to) }
      if (from >= leftLen) { return this.right.slice(from - leftLen, to - leftLen) }
      return this.left.slice(from, leftLen).append(this.right.slice(0, to - leftLen))
    };

    Append.prototype.leafAppend = function leafAppend (other) {
      var inner = this.right.leafAppend(other);
      if (inner) { return new Append(this.left, inner) }
    };

    Append.prototype.leafPrepend = function leafPrepend (other) {
      var inner = this.left.leafPrepend(other);
      if (inner) { return new Append(inner, this.right) }
    };

    Append.prototype.appendInner = function appendInner (other) {
      if (this.left.depth >= Math.max(this.right.depth, other.depth) + 1)
        { return new Append(this.left, new Append(this.right, other)) }
      return new Append(this, other)
    };

    return Append;
  }(RopeSequence));

  var ropeSequence = RopeSequence;

  // ProseMirror's history isn't simply a way to roll back to a previous
  // state, because ProseMirror supports applying changes without adding
  // them to the history (for example during collaboration).
  //
  // To this end, each 'Branch' (one for the undo history and one for
  // the redo history) keeps an array of 'Items', which can optionally
  // hold a step (an actual undoable change), and always hold a position
  // map (which is needed to move changes below them to apply to the
  // current document).
  //
  // An item that has both a step and a selection bookmark is the start
  // of an 'event' — a group of changes that will be undone or redone at
  // once. (It stores only the bookmark, since that way we don't have to
  // provide a document until the selection is actually applied, which
  // is useful when compressing.)

  // Used to schedule history compression
  var max_empty_items = 500;

  var Branch = function Branch(items, eventCount) {
    this.items = items;
    this.eventCount = eventCount;
  };

  // : (EditorState, bool) → ?{transform: Transform, selection: ?SelectionBookmark, remaining: Branch}
  // Pop the latest event off the branch's history and apply it
  // to a document transform.
  Branch.prototype.popEvent = function popEvent (state, preserveItems) {
      var this$1 = this;

    if (this.eventCount == 0) { return null }

    var end = this.items.length;
    for (;; end--) {
      var next = this.items.get(end - 1);
      if (next.selection) { --end; break }
    }

    var remap, mapFrom;
    if (preserveItems) {
      remap = this.remapping(end, this.items.length);
      mapFrom = remap.maps.length;
    }
    var transform = state.tr;
    var selection, remaining;
    var addAfter = [], addBefore = [];

    this.items.forEach(function (item, i) {
      if (!item.step) {
        if (!remap) {
          remap = this$1.remapping(end, i + 1);
          mapFrom = remap.maps.length;
        }
        mapFrom--;
        addBefore.push(item);
        return
      }

      if (remap) {
        addBefore.push(new Item(item.map));
        var step = item.step.map(remap.slice(mapFrom)), map;

        if (step && transform.maybeStep(step).doc) {
          map = transform.mapping.maps[transform.mapping.maps.length - 1];
          addAfter.push(new Item(map, null, null, addAfter.length + addBefore.length));
        }
        mapFrom--;
        if (map) { remap.appendMap(map, mapFrom); }
      } else {
        transform.maybeStep(item.step);
      }

      if (item.selection) {
        selection = remap ? item.selection.map(remap.slice(mapFrom)) : item.selection;
        remaining = new Branch(this$1.items.slice(0, end).append(addBefore.reverse().concat(addAfter)), this$1.eventCount - 1);
        return false
      }
    }, this.items.length, 0);

    return {remaining: remaining, transform: transform, selection: selection}
  };

  // : (Transform, ?SelectionBookmark, Object) → Branch
  // Create a new branch with the given transform added.
  Branch.prototype.addTransform = function addTransform (transform, selection, histOptions, preserveItems) {
    var newItems = [], eventCount = this.eventCount;
    var oldItems = this.items, lastItem = !preserveItems && oldItems.length ? oldItems.get(oldItems.length - 1) : null;

    for (var i = 0; i < transform.steps.length; i++) {
      var step = transform.steps[i].invert(transform.docs[i]);
      var item = new Item(transform.mapping.maps[i], step, selection), merged = (void 0);
      if (merged = lastItem && lastItem.merge(item)) {
        item = merged;
        if (i) { newItems.pop(); }
        else { oldItems = oldItems.slice(0, oldItems.length - 1); }
      }
      newItems.push(item);
      if (selection) {
        eventCount++;
        selection = null;
      }
      if (!preserveItems) { lastItem = item; }
    }
    var overflow = eventCount - histOptions.depth;
    if (overflow > DEPTH_OVERFLOW) {
      oldItems = cutOffEvents(oldItems, overflow);
      eventCount -= overflow;
    }
    return new Branch(oldItems.append(newItems), eventCount)
  };

  Branch.prototype.remapping = function remapping (from, to) {
    var maps = new Mapping;
    this.items.forEach(function (item, i) {
      var mirrorPos = item.mirrorOffset != null && i - item.mirrorOffset >= from
          ? maps.maps.length - item.mirrorOffset : null;
      maps.appendMap(item.map, mirrorPos);
    }, from, to);
    return maps
  };

  Branch.prototype.addMaps = function addMaps (array) {
    if (this.eventCount == 0) { return this }
    return new Branch(this.items.append(array.map(function (map) { return new Item(map); })), this.eventCount)
  };

  // : (Transform, number)
  // When the collab module receives remote changes, the history has
  // to know about those, so that it can adjust the steps that were
  // rebased on top of the remote changes, and include the position
  // maps for the remote changes in its array of items.
  Branch.prototype.rebased = function rebased (rebasedTransform, rebasedCount) {
    if (!this.eventCount) { return this }

    var rebasedItems = [], start = Math.max(0, this.items.length - rebasedCount);

    var mapping = rebasedTransform.mapping;
    var newUntil = rebasedTransform.steps.length;
    var eventCount = this.eventCount;
    this.items.forEach(function (item) { if (item.selection) { eventCount--; } }, start);

    var iRebased = rebasedCount;
    this.items.forEach(function (item) {
      var pos = mapping.getMirror(--iRebased);
      if (pos == null) { return }
      newUntil = Math.min(newUntil, pos);
      var map = mapping.maps[pos];
      if (item.step) {
        var step = rebasedTransform.steps[pos].invert(rebasedTransform.docs[pos]);
        var selection = item.selection && item.selection.map(mapping.slice(iRebased + 1, pos));
        if (selection) { eventCount++; }
        rebasedItems.push(new Item(map, step, selection));
      } else {
        rebasedItems.push(new Item(map));
      }
    }, start);

    var newMaps = [];
    for (var i = rebasedCount; i < newUntil; i++)
      { newMaps.push(new Item(mapping.maps[i])); }
    var items = this.items.slice(0, start).append(newMaps).append(rebasedItems);
    var branch = new Branch(items, eventCount);

    if (branch.emptyItemCount() > max_empty_items)
      { branch = branch.compress(this.items.length - rebasedItems.length); }
    return branch
  };

  Branch.prototype.emptyItemCount = function emptyItemCount () {
    var count = 0;
    this.items.forEach(function (item) { if (!item.step) { count++; } });
    return count
  };

  // Compressing a branch means rewriting it to push the air (map-only
  // items) out. During collaboration, these naturally accumulate
  // because each remote change adds one. The `upto` argument is used
  // to ensure that only the items below a given level are compressed,
  // because `rebased` relies on a clean, untouched set of items in
  // order to associate old items with rebased steps.
  Branch.prototype.compress = function compress (upto) {
      if ( upto === void 0 ) upto = this.items.length;

    var remap = this.remapping(0, upto), mapFrom = remap.maps.length;
    var items = [], events = 0;
    this.items.forEach(function (item, i) {
      if (i >= upto) {
        items.push(item);
        if (item.selection) { events++; }
      } else if (item.step) {
        var step = item.step.map(remap.slice(mapFrom)), map = step && step.getMap();
        mapFrom--;
        if (map) { remap.appendMap(map, mapFrom); }
        if (step) {
          var selection = item.selection && item.selection.map(remap.slice(mapFrom));
          if (selection) { events++; }
          var newItem = new Item(map.invert(), step, selection), merged, last = items.length - 1;
          if (merged = items.length && items[last].merge(newItem))
            { items[last] = merged; }
          else
            { items.push(newItem); }
        }
      } else if (item.map) {
        mapFrom--;
      }
    }, this.items.length, 0);
    return new Branch(ropeSequence.from(items.reverse()), events)
  };

  Branch.empty = new Branch(ropeSequence.empty, 0);

  function cutOffEvents(items, n) {
    var cutPoint;
    items.forEach(function (item, i) {
      if (item.selection && (n-- == 0)) {
        cutPoint = i;
        return false
      }
    });
    return items.slice(cutPoint)
  }

  var Item = function Item(map, step, selection, mirrorOffset) {
    // The (forward) step map for this item.
    this.map = map;
    // The inverted step
    this.step = step;
    // If this is non-null, this item is the start of a group, and
    // this selection is the starting selection for the group (the one
    // that was active before the first step was applied)
    this.selection = selection;
    // If this item is the inverse of a previous mapping on the stack,
    // this points at the inverse's offset
    this.mirrorOffset = mirrorOffset;
  };

  Item.prototype.merge = function merge (other) {
    if (this.step && other.step && !other.selection) {
      var step = other.step.merge(this.step);
      if (step) { return new Item(step.getMap().invert(), step, this.selection) }
    }
  };

  // The value of the state field that tracks undo/redo history for that
  // state. Will be stored in the plugin state when the history plugin
  // is active.
  var HistoryState = function HistoryState(done, undone, prevRanges, prevTime) {
    this.done = done;
    this.undone = undone;
    this.prevRanges = prevRanges;
    this.prevTime = prevTime;
  };

  var DEPTH_OVERFLOW = 20;

  // : (HistoryState, EditorState, Transaction, Object)
  // Record a transformation in undo history.
  function applyTransaction(history, state, tr, options) {
    var historyTr = tr.getMeta(historyKey), rebased;
    if (historyTr) { return historyTr.historyState }

    if (tr.getMeta(closeHistoryKey)) { history = new HistoryState(history.done, history.undone, null, 0); }

    var appended = tr.getMeta("appendedTransaction");

    if (tr.steps.length == 0) {
      return history
    } else if (appended && appended.getMeta(historyKey)) {
      if (appended.getMeta(historyKey).redo)
        { return new HistoryState(history.done.addTransform(tr, null, options, mustPreserveItems(state)),
                                history.undone, rangesFor(tr.mapping.maps[tr.steps.length - 1]), history.prevTime) }
      else
        { return new HistoryState(history.done, history.undone.addTransform(tr, null, options, mustPreserveItems(state)),
                                null, history.prevTime) }
    } else if (tr.getMeta("addToHistory") !== false && !(appended && appended.getMeta("addToHistory") === false)) {
      // Group transforms that occur in quick succession into one event.
      var newGroup = history.prevTime == 0 || !appended && (history.prevTime < (tr.time || 0) - options.newGroupDelay ||
                                                            !isAdjacentTo(tr, history.prevRanges));
      var prevRanges = appended ? mapRanges(history.prevRanges, tr.mapping) : rangesFor(tr.mapping.maps[tr.steps.length - 1]);
      return new HistoryState(history.done.addTransform(tr, newGroup ? state.selection.getBookmark() : null,
                                                        options, mustPreserveItems(state)),
                              Branch.empty, prevRanges, tr.time)
    } else if (rebased = tr.getMeta("rebased")) {
      // Used by the collab module to tell the history that some of its
      // content has been rebased.
      return new HistoryState(history.done.rebased(tr, rebased),
                              history.undone.rebased(tr, rebased),
                              mapRanges(history.prevRanges, tr.mapping), history.prevTime)
    } else {
      return new HistoryState(history.done.addMaps(tr.mapping.maps),
                              history.undone.addMaps(tr.mapping.maps),
                              mapRanges(history.prevRanges, tr.mapping), history.prevTime)
    }
  }

  function isAdjacentTo(transform, prevRanges) {
    if (!prevRanges) { return false }
    if (!transform.docChanged) { return true }
    var adjacent = false;
    transform.mapping.maps[0].forEach(function (start, end) {
      for (var i = 0; i < prevRanges.length; i += 2)
        { if (start <= prevRanges[i + 1] && end >= prevRanges[i])
          { adjacent = true; } }
    });
    return adjacent
  }

  function rangesFor(map) {
    var result = [];
    map.forEach(function (_from, _to, from, to) { return result.push(from, to); });
    return result
  }

  function mapRanges(ranges, mapping) {
    if (!ranges) { return null }
    var result = [];
    for (var i = 0; i < ranges.length; i += 2) {
      var from = mapping.map(ranges[i], 1), to = mapping.map(ranges[i + 1], -1);
      if (from <= to) { result.push(from, to); }
    }
    return result
  }

  // : (HistoryState, EditorState, (tr: Transaction), bool)
  // Apply the latest event from one branch to the document and shift the event
  // onto the other branch.
  function histTransaction(history, state, dispatch, redo) {
    var preserveItems = mustPreserveItems(state), histOptions = historyKey.get(state).spec.config;
    var pop = (redo ? history.undone : history.done).popEvent(state, preserveItems);
    if (!pop) { return }

    var selection = pop.selection.resolve(pop.transform.doc);
    var added = (redo ? history.done : history.undone).addTransform(pop.transform, state.selection.getBookmark(),
                                                                    histOptions, preserveItems);

    var newHist = new HistoryState(redo ? added : pop.remaining, redo ? pop.remaining : added, null, 0);
    dispatch(pop.transform.setSelection(selection).setMeta(historyKey, {redo: redo, historyState: newHist}).scrollIntoView());
  }

  var cachedPreserveItems = false, cachedPreserveItemsPlugins = null;
  // Check whether any plugin in the given state has a
  // `historyPreserveItems` property in its spec, in which case we must
  // preserve steps exactly as they came in, so that they can be
  // rebased.
  function mustPreserveItems(state) {
    var plugins = state.plugins;
    if (cachedPreserveItemsPlugins != plugins) {
      cachedPreserveItems = false;
      cachedPreserveItemsPlugins = plugins;
      for (var i = 0; i < plugins.length; i++) { if (plugins[i].spec.historyPreserveItems) {
        cachedPreserveItems = true;
        break
      } }
    }
    return cachedPreserveItems
  }

  var historyKey = new PluginKey("history");
  var closeHistoryKey = new PluginKey("closeHistory");

  // :: (?Object) → Plugin
  // Returns a plugin that enables the undo history for an editor. The
  // plugin will track undo and redo stacks, which can be used with the
  // [`undo`](#history.undo) and [`redo`](#history.redo) commands.
  //
  // You can set an `"addToHistory"` [metadata
  // property](#state.Transaction.setMeta) of `false` on a transaction
  // to prevent it from being rolled back by undo.
  //
  //   config::-
  //   Supports the following configuration options:
  //
  //     depth:: ?number
  //     The amount of history events that are collected before the
  //     oldest events are discarded. Defaults to 100.
  //
  //     newGroupDelay:: ?number
  //     The delay between changes after which a new group should be
  //     started. Defaults to 500 (milliseconds). Note that when changes
  //     aren't adjacent, a new group is always started.
  function history(config) {
    config = {depth: config && config.depth || 100,
              newGroupDelay: config && config.newGroupDelay || 500};
    return new Plugin({
      key: historyKey,

      state: {
        init: function init() {
          return new HistoryState(Branch.empty, Branch.empty, null, 0)
        },
        apply: function apply(tr, hist, state) {
          return applyTransaction(hist, state, tr, config)
        }
      },

      config: config
    })
  }

  // :: (EditorState, ?(tr: Transaction)) → bool
  // A command function that undoes the last change, if any.
  function undo(state, dispatch) {
    var hist = historyKey.getState(state);
    if (!hist || hist.done.eventCount == 0) { return false }
    if (dispatch) { histTransaction(hist, state, dispatch, false); }
    return true
  }

  // :: (EditorState, ?(tr: Transaction)) → bool
  // A command function that redoes the last undone change, if any.
  function redo(state, dispatch) {
    var hist = historyKey.getState(state);
    if (!hist || hist.undone.eventCount == 0) { return false }
    if (dispatch) { histTransaction(hist, state, dispatch, true); }
    return true
  }

  const History = Extension.create({
      name: 'history',
      defaultOptions: {
          depth: 100,
          newGroupDelay: 500,
      },
      addCommands() {
          return {
              undo: () => ({ state, dispatch }) => {
                  return undo(state, dispatch);
              },
              redo: () => ({ state, dispatch }) => {
                  return redo(state, dispatch);
              },
          };
      },
      addProseMirrorPlugins() {
          return [
              history(this.options),
          ];
      },
      addKeyboardShortcuts() {
          return {
              'Mod-z': () => this.editor.commands.undo(),
              'Mod-y': () => this.editor.commands.redo(),
              'Shift-Mod-z': () => this.editor.commands.redo(),
          };
      },
  });

  const HorizontalRule = Node.create({
      name: 'horizontalRule',
      defaultOptions: {
          HTMLAttributes: {},
      },
      group: 'block',
      parseHTML() {
          return [
              { tag: 'hr' },
          ];
      },
      renderHTML({ HTMLAttributes }) {
          return ['hr', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
      },
      addCommands() {
          return {
              setHorizontalRule: () => ({ chain }) => {
                  return chain()
                      .insertContent({ type: this.name })
                      .command(({ tr, dispatch }) => {
                      var _a;
                      if (dispatch) {
                          const { parent, pos } = tr.selection.$from;
                          const posAfter = pos + 1;
                          const nodeAfter = tr.doc.nodeAt(posAfter);
                          // end of document
                          if (!nodeAfter) {
                              const node = (_a = parent.type.contentMatch.defaultType) === null || _a === void 0 ? void 0 : _a.create();
                              if (node) {
                                  tr.insert(posAfter, node);
                                  tr.setSelection(TextSelection.create(tr.doc, posAfter));
                              }
                          }
                          tr.scrollIntoView();
                      }
                      return true;
                  })
                      .run();
              },
          };
      },
      addInputRules() {
          return [
              nodeInputRule(/^(?:---|—-|___\s|\*\*\*\s)$/, this.type),
          ];
      },
  });

  const starInputRegex = /(?:^|\s)((?:\*)((?:[^*]+))(?:\*))$/gm;
  const starPasteRegex = /(?:^|\s)((?:\*)((?:[^*]+))(?:\*))/gm;
  const underscoreInputRegex = /(?:^|\s)((?:_)((?:[^_]+))(?:_))$/gm;
  const underscorePasteRegex = /(?:^|\s)((?:_)((?:[^_]+))(?:_))/gm;
  const Italic = Mark.create({
      name: 'italic',
      defaultOptions: {
          HTMLAttributes: {},
      },
      parseHTML() {
          return [
              {
                  tag: 'em',
              },
              {
                  tag: 'i',
                  getAttrs: node => node.style.fontStyle !== 'normal' && null,
              },
              {
                  style: 'font-style=italic',
              },
          ];
      },
      renderHTML({ HTMLAttributes }) {
          return ['em', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
      },
      addCommands() {
          return {
              setItalic: () => ({ commands }) => {
                  return commands.setMark('italic');
              },
              toggleItalic: () => ({ commands }) => {
                  return commands.toggleMark('italic');
              },
              unsetItalic: () => ({ commands }) => {
                  return commands.unsetMark('italic');
              },
          };
      },
      addKeyboardShortcuts() {
          return {
              'Mod-i': () => this.editor.commands.toggleItalic(),
          };
      },
      addInputRules() {
          return [
              markInputRule(starInputRegex, this.type),
              markInputRule(underscoreInputRegex, this.type),
          ];
      },
      addPasteRules() {
          return [
              markPasteRule(starPasteRegex, this.type),
              markPasteRule(underscorePasteRegex, this.type),
          ];
      },
  });

  const ListItem = Node.create({
      name: 'listItem',
      defaultOptions: {
          HTMLAttributes: {},
      },
      content: 'paragraph block*',
      defining: true,
      parseHTML() {
          return [
              {
                  tag: 'li',
              },
          ];
      },
      renderHTML({ HTMLAttributes }) {
          return ['li', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
      },
      addKeyboardShortcuts() {
          return {
              Enter: () => this.editor.commands.splitListItem('listItem'),
              Tab: () => this.editor.commands.sinkListItem('listItem'),
              'Shift-Tab': () => this.editor.commands.liftListItem('listItem'),
          };
      },
  });

  const inputRegex$1 = /^(\d+)\.\s$/;
  const OrderedList = Node.create({
      name: 'orderedList',
      defaultOptions: {
          HTMLAttributes: {},
      },
      group: 'block list',
      content: 'listItem+',
      addAttributes() {
          return {
              start: {
                  default: 1,
                  parseHTML: element => ({
                      start: element.hasAttribute('start')
                          ? parseInt(element.getAttribute('start') || '', 10)
                          : 1,
                  }),
              },
          };
      },
      parseHTML() {
          return [
              {
                  tag: 'ol',
              },
          ];
      },
      renderHTML({ HTMLAttributes }) {
          const { start, ...attributesWithoutStart } = HTMLAttributes;
          return start === 1
              ? ['ol', mergeAttributes(this.options.HTMLAttributes, attributesWithoutStart), 0]
              : ['ol', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
      },
      addCommands() {
          return {
              toggleOrderedList: () => ({ commands }) => {
                  return commands.toggleList('orderedList', 'listItem');
              },
          };
      },
      addKeyboardShortcuts() {
          return {
              'Mod-Shift-7': () => this.editor.commands.toggleOrderedList(),
          };
      },
      addInputRules() {
          return [
              wrappingInputRule(inputRegex$1, this.type, match => ({ order: +match[1] }), (match, node) => node.childCount + node.attrs.order === +match[1]),
          ];
      },
  });

  const Paragraph = Node.create({
      name: 'paragraph',
      priority: 1000,
      defaultOptions: {
          HTMLAttributes: {},
      },
      group: 'block',
      content: 'inline*',
      parseHTML() {
          return [
              { tag: 'p' },
          ];
      },
      renderHTML({ HTMLAttributes }) {
          return ['p', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
      },
      addCommands() {
          return {
              setParagraph: () => ({ commands }) => {
                  return commands.toggleNode('paragraph', 'paragraph');
              },
          };
      },
      addKeyboardShortcuts() {
          return {
              'Mod-Alt-0': () => this.editor.commands.setParagraph(),
          };
      },
  });

  const inputRegex = /(?:^|\s)((?:~~)((?:[^~]+))(?:~~))$/gm;
  const Strike = Mark.create({
      name: 'strike',
      defaultOptions: {
          HTMLAttributes: {},
      },
      parseHTML() {
          return [
              {
                  tag: 's',
              },
              {
                  tag: 'del',
              },
              {
                  tag: 'strike',
              },
              {
                  style: 'text-decoration',
                  consuming: false,
                  getAttrs: style => (style.includes('line-through') ? {} : false),
              },
          ];
      },
      renderHTML({ HTMLAttributes }) {
          return ['s', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
      },
      addCommands() {
          return {
              setStrike: () => ({ commands }) => {
                  return commands.setMark('strike');
              },
              toggleStrike: () => ({ commands }) => {
                  return commands.toggleMark('strike');
              },
              unsetStrike: () => ({ commands }) => {
                  return commands.unsetMark('strike');
              },
          };
      },
      addKeyboardShortcuts() {
          return {
              'Mod-Shift-x': () => this.editor.commands.toggleStrike(),
          };
      },
      addInputRules() {
          return [
              markInputRule(inputRegex, this.type),
          ];
      },
      addPasteRules() {
          return [
              markPasteRule(inputRegex, this.type),
          ];
      },
  });

  const Text = Node.create({
      name: 'text',
      group: 'inline',
  });

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

      content: debounce_1(function () {
        this.save();
      }, 4000)
    },

    mounted() {
      this.editor = new vue2.Editor({
        content: this.content,
        extensions: [BubbleMenu, Blockquote, Bold, BulletList, Code, CodeBlock, Document, Dropcursor, Gapcursor, HardBreak, Heading, History, HorizontalRule, Indent, Image, Italic, ListItem, Link__default['default'].configure({
          openOnClick: false
        }), OrderedList, Paragraph, Strike, Text, TextStyle__default['default'], FontFamily__default['default'], FontSize, Underline__default['default'], Table__default['default'].configure({
          resizable: true
        }), TableRow__default['default'], TableHeader__default['default'], TableCell__default['default'], TextAlign__default['default'], TextColor, TextHighlight],
        onUpdate: () => {
          this.content = this.editor.getHTML();
        }
      });
    },

    beforeDestroy() {
      this.editor.destroy();
    },

    components: {
      EditorContent: vue2.EditorContent,
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

  // Because working with row and column-spanning cells is not quite
  // trivial, this code builds up a descriptive structure for a given
  // table node. The structures are cached with the (persistent) table
  // nodes as key, so that they only have to be recomputed when the
  // content of the table changes.
  //
  // This does mean that they have to store table-relative, not
  // document-relative positions. So code that uses them will typically
  // compute the start position of the table and offset positions passed
  // to or gotten from this structure by that amount.

  var readFromCache, addToCache;
  // Prefer using a weak map to cache table maps. Fall back on a
  // fixed-size cache if that's not supported.
  if (typeof WeakMap != "undefined") {
    var cache = new WeakMap;
    readFromCache = function (key) { return cache.get(key); };
    addToCache = function (key, value) {
      cache.set(key, value);
      return value
    };
  } else {
    var cache$1 = [], cacheSize = 10, cachePos = 0;
    readFromCache = function (key) {
      for (var i = 0; i < cache$1.length; i += 2)
        { if (cache$1[i] == key) { return cache$1[i + 1] } }
    };
    addToCache = function (key, value) {
      if (cachePos == cacheSize) { cachePos = 0; }
      cache$1[cachePos++] = key;
      return cache$1[cachePos++] = value
    };
  }

  var Rect = function Rect(left, top, right, bottom) {
    this.left = left; this.top = top; this.right = right; this.bottom = bottom;
  };

  // ::- A table map describes the structore of a given table. To avoid
  // recomputing them all the time, they are cached per table node. To
  // be able to do that, positions saved in the map are relative to the
  // start of the table, rather than the start of the document.
  var TableMap = function TableMap(width, height, map, problems) {
    // :: number The width of the table
    this.width = width;
    // :: number The table's height
    this.height = height;
    // :: [number] A width * height array with the start position of
    // the cell covering that part of the table in each slot
    this.map = map;
    // An optional array of problems (cell overlap or non-rectangular
    // shape) for the table, used by the table normalizer.
    this.problems = problems;
  };

  // :: (number) → Rect
  // Find the dimensions of the cell at the given position.
  TableMap.prototype.findCell = function findCell (pos) {
    for (var i = 0; i < this.map.length; i++) {
      var curPos = this.map[i];
      if (curPos != pos) { continue }
      var left = i % this.width, top = (i / this.width) | 0;
      var right = left + 1, bottom = top + 1;
      for (var j = 1; right < this.width && this.map[i + j] == curPos; j++) { right++; }
      for (var j$1 = 1; bottom < this.height && this.map[i + (this.width * j$1)] == curPos; j$1++) { bottom++; }
      return new Rect(left, top, right, bottom)
    }
    throw new RangeError("No cell with offset " + pos + " found")
  };

  // :: (number) → number
  // Find the left side of the cell at the given position.
  TableMap.prototype.colCount = function colCount (pos) {
    for (var i = 0; i < this.map.length; i++)
      { if (this.map[i] == pos) { return i % this.width } }
    throw new RangeError("No cell with offset " + pos + " found")
  };

  // :: (number, string, number) → ?number
  // Find the next cell in the given direction, starting from the cell
  // at `pos`, if any.
  TableMap.prototype.nextCell = function nextCell (pos, axis, dir) {
    var ref = this.findCell(pos);
      var left = ref.left;
      var right = ref.right;
      var top = ref.top;
      var bottom = ref.bottom;
    if (axis == "horiz") {
      if (dir < 0 ? left == 0 : right == this.width) { return null }
      return this.map[top * this.width + (dir < 0 ? left - 1 : right)]
    } else {
      if (dir < 0 ? top == 0 : bottom == this.height) { return null }
      return this.map[left + this.width * (dir < 0 ? top - 1 : bottom)]
    }
  };

  // :: (number, number) → Rect
  // Get the rectangle spanning the two given cells.
  TableMap.prototype.rectBetween = function rectBetween (a, b) {
    var ref = this.findCell(a);
      var leftA = ref.left;
      var rightA = ref.right;
      var topA = ref.top;
      var bottomA = ref.bottom;
    var ref$1 = this.findCell(b);
      var leftB = ref$1.left;
      var rightB = ref$1.right;
      var topB = ref$1.top;
      var bottomB = ref$1.bottom;
    return new Rect(Math.min(leftA, leftB), Math.min(topA, topB),
                    Math.max(rightA, rightB), Math.max(bottomA, bottomB))
  };

  // :: (Rect) → [number]
  // Return the position of all cells that have the top left corner in
  // the given rectangle.
  TableMap.prototype.cellsInRect = function cellsInRect (rect) {
    var result = [], seen = {};
    for (var row = rect.top; row < rect.bottom; row++) {
      for (var col = rect.left; col < rect.right; col++) {
        var index = row * this.width + col, pos = this.map[index];
        if (seen[pos]) { continue }
        seen[pos] = true;
        if ((col != rect.left || !col || this.map[index - 1] != pos) &&
            (row != rect.top || !row || this.map[index - this.width] != pos))
          { result.push(pos); }
      }
    }
    return result
  };

  // :: (number, number, Node) → number
  // Return the position at which the cell at the given row and column
  // starts, or would start, if a cell started there.
  TableMap.prototype.positionAt = function positionAt (row, col, table) {
    for (var i = 0, rowStart = 0;; i++) {
      var rowEnd = rowStart + table.child(i).nodeSize;
      if (i == row) {
        var index = col + row * this.width, rowEndIndex = (row + 1) * this.width;
        // Skip past cells from previous rows (via rowspan)
        while (index < rowEndIndex && this.map[index] < rowStart) { index++; }
        return index == rowEndIndex ? rowEnd - 1 : this.map[index]
      }
      rowStart = rowEnd;
    }
  };

  // :: (Node) → TableMap
  // Find the table map for the given table node.
  TableMap.get = function get (table) {
    return readFromCache(table) || addToCache(table, computeMap(table))
  };

  // Compute a table map.
  function computeMap(table) {
    if (table.type.spec.tableRole != "table") { throw new RangeError("Not a table node: " + table.type.name) }
    var width = findWidth(table), height = table.childCount;
    var map = [], mapPos = 0, problems = null, colWidths = [];
    for (var i = 0, e = width * height; i < e; i++) { map[i] = 0; }

    for (var row = 0, pos = 0; row < height; row++) {
      var rowNode = table.child(row);
      pos++;
      for (var i$1 = 0;; i$1++) {
        while (mapPos < map.length && map[mapPos] != 0) { mapPos++; }
        if (i$1 == rowNode.childCount) { break }
        var cellNode = rowNode.child(i$1);
        var ref = cellNode.attrs;
        var colspan = ref.colspan;
        var rowspan = ref.rowspan;
        var colwidth = ref.colwidth;
        for (var h = 0; h < rowspan; h++) {
          if (h + row >= height) {
            (problems || (problems = [])).push({type: "overlong_rowspan", pos: pos, n: rowspan - h});
            break
          }
          var start = mapPos + (h * width);
          for (var w = 0; w < colspan; w++) {
            if (map[start + w] == 0)
              { map[start + w] = pos; }
            else
              { (problems || (problems = [])).push({type: "collision", row: row, pos: pos, n: colspan - w}); }
            var colW = colwidth && colwidth[w];
            if (colW) {
              var widthIndex = ((start + w) % width) * 2, prev = colWidths[widthIndex];
              if (prev == null || (prev != colW && colWidths[widthIndex + 1] == 1)) {
                colWidths[widthIndex] = colW;
                colWidths[widthIndex + 1] = 1;
              } else if (prev == colW) {
                colWidths[widthIndex + 1]++;
              }
            }
          }
        }
        mapPos += colspan;
        pos += cellNode.nodeSize;
      }
      var expectedPos = (row + 1) * width, missing = 0;
      while (mapPos < expectedPos) { if (map[mapPos++] == 0) { missing++; } }
      if (missing) { (problems || (problems = [])).push({type: "missing", row: row, n: missing}); }
      pos++;
    }

    var tableMap = new TableMap(width, height, map, problems), badWidths = false;

    // For columns that have defined widths, but whose widths disagree
    // between rows, fix up the cells whose width doesn't match the
    // computed one.
    for (var i$2 = 0; !badWidths && i$2 < colWidths.length; i$2 += 2)
      { if (colWidths[i$2] != null && colWidths[i$2 + 1] < height) { badWidths = true; } }
    if (badWidths) { findBadColWidths(tableMap, colWidths, table); }

    return tableMap
  }

  function findWidth(table) {
    var width = -1, hasRowSpan = false;
    for (var row = 0; row < table.childCount; row++) {
      var rowNode = table.child(row), rowWidth = 0;
      if (hasRowSpan) { for (var j = 0; j < row; j++) {
        var prevRow = table.child(j);
        for (var i = 0; i < prevRow.childCount; i++) {
          var cell = prevRow.child(i);
          if (j + cell.attrs.rowspan > row) { rowWidth += cell.attrs.colspan; }
        }
      } }
      for (var i$1 = 0; i$1 < rowNode.childCount; i$1++) {
        var cell$1 = rowNode.child(i$1);
        rowWidth += cell$1.attrs.colspan;
        if (cell$1.attrs.rowspan > 1) { hasRowSpan = true; }
      }
      if (width == -1)
        { width = rowWidth; }
      else if (width != rowWidth)
        { width = Math.max(width, rowWidth); }
    }
    return width
  }

  function findBadColWidths(map, colWidths, table) {
    if (!map.problems) { map.problems = []; }
    for (var i = 0, seen = {}; i < map.map.length; i++) {
      var pos = map.map[i];
      if (seen[pos]) { continue }
      seen[pos] = true;
      var node = table.nodeAt(pos), updated = null;
      for (var j = 0; j < node.attrs.colspan; j++) {
        var col = (i + j) % map.width, colWidth = colWidths[col * 2];
        if (colWidth != null && (!node.attrs.colwidth || node.attrs.colwidth[j] != colWidth))
          { (updated || (updated = freshColWidth(node.attrs)))[j] = colWidth; }
      }
      if (updated) { map.problems.unshift({type: "colwidth mismatch", pos: pos, colwidth: updated}); }
    }
  }

  function freshColWidth(attrs) {
    if (attrs.colwidth) { return attrs.colwidth.slice() }
    var result = [];
    for (var i = 0; i < attrs.colspan; i++) { result.push(0); }
    return result
  }

  function tableNodeTypes(schema) {
    var result = schema.cached.tableNodeTypes;
    if (!result) {
      result = schema.cached.tableNodeTypes = {};
      for (var name in schema.nodes) {
        var type = schema.nodes[name], role = type.spec.tableRole;
        if (role) { result[role] = type; }
      }
    }
    return result
  }

  // Various helper function for working with tables

  new PluginKey("selectingCells");

  function cellAround($pos) {
    for (var d = $pos.depth - 1; d > 0; d--)
      { if ($pos.node(d).type.spec.tableRole == "row") { return $pos.node(0).resolve($pos.before(d + 1)) } }
    return null
  }

  function cellWrapping($pos) {
    for (var d = $pos.depth; d > 0; d--) { // Sometimes the cell can be in the same depth.
      var role = $pos.node(d).type.spec.tableRole;
      if (role === "cell" || role === 'header_cell') { return $pos.node(d) }
    }
    return null
  }

  function isInTable(state) {
    var $head = state.selection.$head;
    for (var d = $head.depth; d > 0; d--) { if ($head.node(d).type.spec.tableRole == "row") { return true } }
    return false
  }

  function selectionCell(state) {
    var sel = state.selection;
    if (sel.$anchorCell) {
      return sel.$anchorCell.pos > sel.$headCell.pos ? sel.$anchorCell : sel.$headCell;
    } else if (sel.node && sel.node.type.spec.tableRole == "cell") {
      return sel.$anchor
    }
    return cellAround(sel.$head) || cellNear(sel.$head)
  }

  function cellNear($pos) {
    for (var after = $pos.nodeAfter, pos = $pos.pos; after; after = after.firstChild, pos++) {
      var role = after.type.spec.tableRole;
      if (role == "cell" || role == "header_cell") { return $pos.doc.resolve(pos) }
    }
    for (var before = $pos.nodeBefore, pos$1 = $pos.pos; before; before = before.lastChild, pos$1--) {
      var role$1 = before.type.spec.tableRole;
      if (role$1 == "cell" || role$1 == "header_cell") { return $pos.doc.resolve(pos$1 - before.nodeSize) }
    }
  }

  function pointsAtCell($pos) {
    return $pos.parent.type.spec.tableRole == "row" && $pos.nodeAfter
  }

  function inSameTable($a, $b) {
    return $a.depth == $b.depth && $a.pos >= $b.start(-1) && $a.pos <= $b.end(-1)
  }

  function nextCell($pos, axis, dir) {
    var start = $pos.start(-1), map = TableMap.get($pos.node(-1));
    var moved = map.nextCell($pos.pos - start, axis, dir);
    return moved == null ? null : $pos.node(0).resolve(start + moved)
  }

  function setAttr(attrs, name, value) {
    var result = {};
    for (var prop in attrs) { result[prop] = attrs[prop]; }
    result[name] = value;
    return result
  }

  function removeColSpan(attrs, pos, n) {
    if ( n === void 0 ) n=1;

    var result = setAttr(attrs, "colspan", attrs.colspan - n);
    if (result.colwidth) {
      result.colwidth = result.colwidth.slice();
      result.colwidth.splice(pos, n);
      if (!result.colwidth.some(function (w) { return w > 0; })) { result.colwidth = null; }
    }
    return result
  }

  function addColSpan(attrs, pos, n) {
    if ( n === void 0 ) n=1;

    var result = setAttr(attrs, "colspan", attrs.colspan + n);
    if (result.colwidth) {
      result.colwidth = result.colwidth.slice();
      for (var i = 0; i < n; i++) { result.colwidth.splice(pos, 0, 0); }
    }
    return result
  }

  // This file defines a ProseMirror selection subclass that models

  // ::- A [`Selection`](http://prosemirror.net/docs/ref/#state.Selection)
  // subclass that represents a cell selection spanning part of a table.
  // With the plugin enabled, these will be created when the user
  // selects across cells, and will be drawn by giving selected cells a
  // `selectedCell` CSS class.
  var CellSelection = /*@__PURE__*/(function (Selection) {
    function CellSelection($anchorCell, $headCell) {
      if ( $headCell === void 0 ) $headCell = $anchorCell;

      var table = $anchorCell.node(-1), map = TableMap.get(table), start = $anchorCell.start(-1);
      var rect = map.rectBetween($anchorCell.pos - start, $headCell.pos - start);
      var doc = $anchorCell.node(0);
      var cells = map.cellsInRect(rect).filter(function (p) { return p != $headCell.pos - start; });
      // Make the head cell the first range, so that it counts as the
      // primary part of the selection
      cells.unshift($headCell.pos - start);
      var ranges = cells.map(function (pos) {
        var cell = table.nodeAt(pos), from = pos + start + 1;
        return new SelectionRange(doc.resolve(from), doc.resolve(from + cell.content.size))
      });
      Selection.call(this, ranges[0].$from, ranges[0].$to, ranges);
      // :: ResolvedPos
      // A resolved position pointing _in front of_ the anchor cell (the one
      // that doesn't move when extending the selection).
      this.$anchorCell = $anchorCell;
      // :: ResolvedPos
      // A resolved position pointing in front of the head cell (the one
      // moves when extending the selection).
      this.$headCell = $headCell;
    }

    if ( Selection ) CellSelection.__proto__ = Selection;
    CellSelection.prototype = Object.create( Selection && Selection.prototype );
    CellSelection.prototype.constructor = CellSelection;

    CellSelection.prototype.map = function map (doc, mapping) {
      var $anchorCell = doc.resolve(mapping.map(this.$anchorCell.pos));
      var $headCell = doc.resolve(mapping.map(this.$headCell.pos));
      if (pointsAtCell($anchorCell) && pointsAtCell($headCell) && inSameTable($anchorCell, $headCell)) {
        var tableChanged = this.$anchorCell.node(-1) != $anchorCell.node(-1);
        if (tableChanged && this.isRowSelection())
          { return CellSelection.rowSelection($anchorCell, $headCell) }
        else if (tableChanged && this.isColSelection())
          { return CellSelection.colSelection($anchorCell, $headCell) }
        else
          { return new CellSelection($anchorCell, $headCell) }
      }
      return TextSelection.between($anchorCell, $headCell)
    };

    // :: () → Slice
    // Returns a rectangular slice of table rows containing the selected
    // cells.
    CellSelection.prototype.content = function content () {
      var table = this.$anchorCell.node(-1), map = TableMap.get(table), start = this.$anchorCell.start(-1);
      var rect = map.rectBetween(this.$anchorCell.pos - start, this.$headCell.pos - start);
      var seen = {}, rows = [];
      for (var row = rect.top; row < rect.bottom; row++) {
        var rowContent = [];
        for (var index = row * map.width + rect.left, col = rect.left; col < rect.right; col++, index++) {
          var pos = map.map[index];
          if (!seen[pos]) {
            seen[pos] = true;
            var cellRect = map.findCell(pos), cell = table.nodeAt(pos);
            var extraLeft = rect.left - cellRect.left, extraRight = cellRect.right - rect.right;
            if (extraLeft > 0 || extraRight > 0) {
              var attrs = cell.attrs;
              if (extraLeft > 0) { attrs = removeColSpan(attrs, 0, extraLeft); }
              if (extraRight > 0) { attrs = removeColSpan(attrs, attrs.colspan - extraRight, extraRight); }
              if (cellRect.left < rect.left) { cell = cell.type.createAndFill(attrs); }
              else { cell = cell.type.create(attrs, cell.content); }
            }
            if (cellRect.top < rect.top || cellRect.bottom > rect.bottom) {
              var attrs$1 = setAttr(cell.attrs, "rowspan", Math.min(cellRect.bottom, rect.bottom) - Math.max(cellRect.top, rect.top));
              if (cellRect.top < rect.top) { cell = cell.type.createAndFill(attrs$1); }
              else { cell = cell.type.create(attrs$1, cell.content); }
            }
            rowContent.push(cell);
          }
        }
        rows.push(table.child(row).copy(Fragment.from(rowContent)));
      }

      var fragment = this.isColSelection() && this.isRowSelection() ? table : rows;
      return new Slice(Fragment.from(fragment), 1, 1)
    };

    CellSelection.prototype.replace = function replace (tr, content) {
      if ( content === void 0 ) content = Slice.empty;

      var mapFrom = tr.steps.length, ranges = this.ranges;
      for (var i = 0; i < ranges.length; i++) {
        var ref = ranges[i];
        var $from = ref.$from;
        var $to = ref.$to;
        var mapping = tr.mapping.slice(mapFrom);
        tr.replace(mapping.map($from.pos), mapping.map($to.pos), i ? Slice.empty : content);
      }
      var sel = Selection.findFrom(tr.doc.resolve(tr.mapping.slice(mapFrom).map(this.to)), -1);
      if (sel) { tr.setSelection(sel); }
    };

    CellSelection.prototype.replaceWith = function replaceWith (tr, node) {
      this.replace(tr, new Slice(Fragment.from(node), 0, 0));
    };

    CellSelection.prototype.forEachCell = function forEachCell (f) {
      var table = this.$anchorCell.node(-1), map = TableMap.get(table), start = this.$anchorCell.start(-1);
      var cells = map.cellsInRect(map.rectBetween(this.$anchorCell.pos - start, this.$headCell.pos - start));
      for (var i = 0; i < cells.length; i++)
        { f(table.nodeAt(cells[i]), start + cells[i]); }
    };

    // :: () → bool
    // True if this selection goes all the way from the top to the
    // bottom of the table.
    CellSelection.prototype.isColSelection = function isColSelection () {
      var anchorTop = this.$anchorCell.index(-1), headTop = this.$headCell.index(-1);
      if (Math.min(anchorTop, headTop) > 0) { return false }
      var anchorBot = anchorTop + this.$anchorCell.nodeAfter.attrs.rowspan,
          headBot = headTop + this.$headCell.nodeAfter.attrs.rowspan;
      return Math.max(anchorBot, headBot) == this.$headCell.node(-1).childCount
    };

    // :: (ResolvedPos, ?ResolvedPos) → CellSelection
    // Returns the smallest column selection that covers the given anchor
    // and head cell.
    CellSelection.colSelection = function colSelection ($anchorCell, $headCell) {
      if ( $headCell === void 0 ) $headCell = $anchorCell;

      var map = TableMap.get($anchorCell.node(-1)), start = $anchorCell.start(-1);
      var anchorRect = map.findCell($anchorCell.pos - start), headRect = map.findCell($headCell.pos - start);
      var doc = $anchorCell.node(0);
      if (anchorRect.top <= headRect.top) {
        if (anchorRect.top > 0)
          { $anchorCell = doc.resolve(start + map.map[anchorRect.left]); }
        if (headRect.bottom < map.height)
          { $headCell = doc.resolve(start + map.map[map.width * (map.height - 1) + headRect.right - 1]); }
      } else {
        if (headRect.top > 0)
          { $headCell = doc.resolve(start + map.map[headRect.left]); }
        if (anchorRect.bottom < map.height)
          { $anchorCell = doc.resolve(start + map.map[map.width * (map.height - 1) + anchorRect.right - 1]); }
      }
      return new CellSelection($anchorCell, $headCell)
    };

    // :: () → bool
    // True if this selection goes all the way from the left to the
    // right of the table.
    CellSelection.prototype.isRowSelection = function isRowSelection () {
      var map = TableMap.get(this.$anchorCell.node(-1)), start = this.$anchorCell.start(-1);
      var anchorLeft = map.colCount(this.$anchorCell.pos - start),
          headLeft = map.colCount(this.$headCell.pos - start);
      if (Math.min(anchorLeft, headLeft) > 0) { return false }
      var anchorRight = anchorLeft + this.$anchorCell.nodeAfter.attrs.colspan,
          headRight = headLeft + this.$headCell.nodeAfter.attrs.colspan;
      return Math.max(anchorRight, headRight) == map.width
    };

    CellSelection.prototype.eq = function eq (other) {
      return other instanceof CellSelection && other.$anchorCell.pos == this.$anchorCell.pos &&
        other.$headCell.pos == this.$headCell.pos
    };

    // :: (ResolvedPos, ?ResolvedPos) → CellSelection
    // Returns the smallest row selection that covers the given anchor
    // and head cell.
    CellSelection.rowSelection = function rowSelection ($anchorCell, $headCell) {
      if ( $headCell === void 0 ) $headCell = $anchorCell;

      var map = TableMap.get($anchorCell.node(-1)), start = $anchorCell.start(-1);
      var anchorRect = map.findCell($anchorCell.pos - start), headRect = map.findCell($headCell.pos - start);
      var doc = $anchorCell.node(0);
      if (anchorRect.left <= headRect.left) {
        if (anchorRect.left > 0)
          { $anchorCell = doc.resolve(start + map.map[anchorRect.top * map.width]); }
        if (headRect.right < map.width)
          { $headCell = doc.resolve(start + map.map[map.width * (headRect.top + 1) - 1]); }
      } else {
        if (headRect.left > 0)
          { $headCell = doc.resolve(start + map.map[headRect.top * map.width]); }
        if (anchorRect.right < map.width)
          { $anchorCell = doc.resolve(start + map.map[map.width * (anchorRect.top + 1) - 1]); }
      }
      return new CellSelection($anchorCell, $headCell)
    };

    CellSelection.prototype.toJSON = function toJSON () {
      return {type: "cell", anchor: this.$anchorCell.pos, head: this.$headCell.pos}
    };

    CellSelection.fromJSON = function fromJSON (doc, json) {
      return new CellSelection(doc.resolve(json.anchor), doc.resolve(json.head))
    };

    // :: (Node, number, ?number) → CellSelection
    CellSelection.create = function create (doc, anchorCell, headCell) {
      if ( headCell === void 0 ) headCell = anchorCell;

      return new CellSelection(doc.resolve(anchorCell), doc.resolve(headCell))
    };

    CellSelection.prototype.getBookmark = function getBookmark () { return new CellBookmark(this.$anchorCell.pos, this.$headCell.pos) };

    return CellSelection;
  }(Selection));

  CellSelection.prototype.visible = false;

  Selection.jsonID("cell", CellSelection);

  var CellBookmark = function CellBookmark(anchor, head) {
    this.anchor = anchor;
    this.head = head;
  };
  CellBookmark.prototype.map = function map (mapping) {
    return new CellBookmark(mapping.map(this.anchor), mapping.map(this.head))
  };
  CellBookmark.prototype.resolve = function resolve (doc) {
    var $anchorCell = doc.resolve(this.anchor), $headCell = doc.resolve(this.head);
    if ($anchorCell.parent.type.spec.tableRole == "row" &&
        $headCell.parent.type.spec.tableRole == "row" &&
        $anchorCell.index() < $anchorCell.parent.childCount &&
        $headCell.index() < $headCell.parent.childCount &&
        inSameTable($anchorCell, $headCell))
      { return new CellSelection($anchorCell, $headCell) }
    else
      { return Selection.near($headCell, 1) }
  };

  // This file defines a number of helpers for wiring up user input to

  keydownHandler({
    "ArrowLeft": arrow("horiz", -1),
    "ArrowRight": arrow("horiz", 1),
    "ArrowUp": arrow("vert", -1),
    "ArrowDown": arrow("vert", 1),

    "Shift-ArrowLeft": shiftArrow("horiz", -1),
    "Shift-ArrowRight": shiftArrow("horiz", 1),
    "Shift-ArrowUp": shiftArrow("vert", -1),
    "Shift-ArrowDown": shiftArrow("vert", 1),

    "Backspace": deleteCellSelection,
    "Mod-Backspace": deleteCellSelection,
    "Delete": deleteCellSelection,
    "Mod-Delete": deleteCellSelection
  });

  function maybeSetSelection(state, dispatch, selection) {
    if (selection.eq(state.selection)) { return false }
    if (dispatch) { dispatch(state.tr.setSelection(selection).scrollIntoView()); }
    return true
  }

  function arrow(axis, dir) {
    return function (state, dispatch, view) {
      var sel = state.selection;
      if (sel instanceof CellSelection) {
        return maybeSetSelection(state, dispatch, Selection.near(sel.$headCell, dir))
      }
      if (axis != "horiz" && !sel.empty) { return false }
      var end = atEndOfCell(view, axis, dir);
      if (end == null) { return false }
      if (axis == "horiz") {
        return maybeSetSelection(state, dispatch, Selection.near(state.doc.resolve(sel.head + dir), dir))
      } else {
        var $cell = state.doc.resolve(end), $next = nextCell($cell, axis, dir), newSel;
        if ($next) { newSel = Selection.near($next, 1); }
        else if (dir < 0) { newSel = Selection.near(state.doc.resolve($cell.before(-1)), -1); }
        else { newSel = Selection.near(state.doc.resolve($cell.after(-1)), 1); }
        return maybeSetSelection(state, dispatch, newSel)
      }
    }
  }

  function shiftArrow(axis, dir) {
    return function (state, dispatch, view) {
      var sel = state.selection;
      if (!(sel instanceof CellSelection)) {
        var end = atEndOfCell(view, axis, dir);
        if (end == null) { return false }
        sel = new CellSelection(state.doc.resolve(end));
      }
      var $head = nextCell(sel.$headCell, axis, dir);
      if (!$head) { return false }
      return maybeSetSelection(state, dispatch, new CellSelection(sel.$anchorCell, $head))
    }
  }

  function deleteCellSelection(state, dispatch) {
    var sel = state.selection;
    if (!(sel instanceof CellSelection)) { return false }
    if (dispatch) {
      var tr = state.tr, baseContent = tableNodeTypes(state.schema).cell.createAndFill().content;
      sel.forEachCell(function (cell, pos) {
        if (!cell.content.eq(baseContent))
          { tr.replace(tr.mapping.map(pos + 1), tr.mapping.map(pos + cell.nodeSize - 1),
                     new Slice(baseContent, 0, 0)); }
      });
      if (tr.docChanged) { dispatch(tr); }
    }
    return true
  }

  // Check whether the cursor is at the end of a cell (so that further
  // motion would move out of the cell)
  function atEndOfCell(view, axis, dir) {
    if (!(view.state.selection instanceof TextSelection)) { return null }
    var ref = view.state.selection;
    var $head = ref.$head;
    for (var d = $head.depth - 1; d >= 0; d--) {
      var parent = $head.node(d), index = dir < 0 ? $head.index(d) : $head.indexAfter(d);
      if (index != (dir < 0 ? 0 : parent.childCount)) { return null }
      if (parent.type.spec.tableRole == "cell" || parent.type.spec.tableRole == "header_cell") {
        var cellPos = $head.before(d);
        var dirStr = axis == "vert" ? (dir > 0 ? "down" : "up") : (dir > 0 ? "right" : "left");
        return view.endOfTextblock(dirStr) ? cellPos : null
      }
    }
    return null
  }

  // This file defines helpers for normalizing tables, making sure no

  new PluginKey("fix-tables");

  // This file defines a number of table-related commands.

  // Helper to get the selected rectangle in a table, if any. Adds table
  // map, table node, and table start offset to the object for
  // convenience.
  function selectedRect(state) {
    var sel = state.selection, $pos = selectionCell(state);
    var table = $pos.node(-1), tableStart = $pos.start(-1), map = TableMap.get(table);
    var rect;
    if (sel instanceof CellSelection)
      { rect = map.rectBetween(sel.$anchorCell.pos - tableStart, sel.$headCell.pos - tableStart); }
    else
      { rect = map.findCell($pos.pos - tableStart); }
    rect.tableStart = tableStart;
    rect.map = map;
    rect.table = table;
    return rect
  }

  function isEmpty(cell) {
    var c = cell.content;
    return c.childCount == 1 && c.firstChild.isTextblock && c.firstChild.childCount == 0
  }

  function cellsOverlapRectangle(ref, rect) {
    var width = ref.width;
    var height = ref.height;
    var map = ref.map;

    var indexTop = rect.top * width + rect.left, indexLeft = indexTop;
    var indexBottom = (rect.bottom - 1) * width + rect.left, indexRight = indexTop + (rect.right - rect.left - 1);
    for (var i = rect.top; i < rect.bottom; i++) {
      if (rect.left > 0 && map[indexLeft] == map[indexLeft - 1] ||
          rect.right < width && map[indexRight] == map[indexRight + 1]) { return true }
      indexLeft += width; indexRight += width;
    }
    for (var i$1 = rect.left; i$1 < rect.right; i$1++) {
      if (rect.top > 0 && map[indexTop] == map[indexTop - width] ||
          rect.bottom < height && map[indexBottom] == map[indexBottom + width]) { return true }
      indexTop++; indexBottom++;
    }
    return false
  }

  // :: (EditorState, dispatch: ?(tr: Transaction)) → bool
  // Merge the selected cells into a single cell. Only available when
  // the selected cells' outline forms a rectangle.
  function mergeCells(state, dispatch) {
    var sel = state.selection;
    if (!(sel instanceof CellSelection) || sel.$anchorCell.pos == sel.$headCell.pos) { return false }
    var rect = selectedRect(state);
    var map = rect.map;
    if (cellsOverlapRectangle(map, rect)) { return false }
    if (dispatch) {
      var tr = state.tr, seen = {}, content = Fragment.empty, mergedPos, mergedCell;
      for (var row = rect.top; row < rect.bottom; row++) {
        for (var col = rect.left; col < rect.right; col++) {
          var cellPos = map.map[row * map.width + col], cell = rect.table.nodeAt(cellPos);
          if (seen[cellPos]) { continue }
          seen[cellPos] = true;
          if (mergedPos == null) {
            mergedPos = cellPos;
            mergedCell = cell;
          } else {
            if (!isEmpty(cell)) { content = content.append(cell.content); }
            var mapped = tr.mapping.map(cellPos + rect.tableStart);
            tr.delete(mapped, mapped + cell.nodeSize);
          }
        }
      }
      tr.setNodeMarkup(mergedPos + rect.tableStart, null,
                       setAttr(addColSpan(mergedCell.attrs, mergedCell.attrs.colspan, (rect.right - rect.left) - mergedCell.attrs.colspan),
                               "rowspan", rect.bottom - rect.top));
      if (content.size) {
        var end = mergedPos + 1 + mergedCell.content.size;
        var start = isEmpty(mergedCell) ? mergedPos + 1 : end;
        tr.replaceWith(start + rect.tableStart, end + rect.tableStart, content);
      }
      tr.setSelection(new CellSelection(tr.doc.resolve(mergedPos + rect.tableStart)));
      dispatch(tr);
    }
    return true
  }
  // :: (EditorState, dispatch: ?(tr: Transaction)) → bool
  // Split a selected cell, whose rowpan or colspan is greater than one,
  // into smaller cells. Use the first cell type for the new cells.
  function splitCell(state, dispatch) {
    var nodeTypes = tableNodeTypes(state.schema);
    return splitCellWithType(function (ref) {
      var node = ref.node;

      return nodeTypes[node.type.spec.tableRole]
    })(state, dispatch)
  }

  // :: (getCellType: ({ row: number, col: number, node: Node}) → NodeType) → (EditorState, dispatch: ?(tr: Transaction)) → bool
  // Split a selected cell, whose rowpan or colspan is greater than one,
  // into smaller cells with the cell type (th, td) returned by getType function.
  function splitCellWithType(getCellType) {
    return function (state, dispatch) {
      var sel = state.selection;
      var cellNode, cellPos;
      if (!(sel instanceof CellSelection)) {
        cellNode = cellWrapping(sel.$from);
        if (!cellNode) { return false }
        cellPos = cellAround(sel.$from).pos;
      } else {
        if (sel.$anchorCell.pos != sel.$headCell.pos) { return false }
        cellNode = sel.$anchorCell.nodeAfter;
        cellPos = sel.$anchorCell.pos;
      }
      if (cellNode.attrs.colspan == 1 && cellNode.attrs.rowspan == 1) {return false}
      if (dispatch) {
        var baseAttrs = cellNode.attrs, attrs = [], colwidth = baseAttrs.colwidth;
        if (baseAttrs.rowspan > 1) { baseAttrs = setAttr(baseAttrs, "rowspan", 1); }
        if (baseAttrs.colspan > 1) { baseAttrs = setAttr(baseAttrs, "colspan", 1); }
        var rect = selectedRect(state), tr = state.tr;
        for (var i = 0; i < rect.right - rect.left; i++)
          { attrs.push(colwidth ? setAttr(baseAttrs, "colwidth", colwidth && colwidth[i] ? [colwidth[i]] : null) : baseAttrs); }
        var lastCell;
        for (var row = rect.top; row < rect.bottom; row++) {
          var pos = rect.map.positionAt(row, rect.left, rect.table);
          if (row == rect.top) { pos += cellNode.nodeSize; }
          for (var col = rect.left, i$1 = 0; col < rect.right; col++, i$1++) {
            if (col == rect.left && row == rect.top) { continue }
            tr.insert(lastCell = tr.mapping.map(pos + rect.tableStart, 1), getCellType({ node: cellNode, row: row, col: col}).createAndFill(attrs[i$1]));
          }
        }
        tr.setNodeMarkup(cellPos, getCellType({ node: cellNode, row: rect.top, col: rect.left}), attrs[0]);
        if (sel instanceof CellSelection)
          { tr.setSelection(new CellSelection(tr.doc.resolve(sel.$anchorCell.pos),
                                            lastCell && tr.doc.resolve(lastCell))); }
        dispatch(tr);
      }
      return true
    }
  }

  function deprecated_toggleHeader(type) {
    return function(state, dispatch) {
      if (!isInTable(state)) { return false }
      if (dispatch) {
        var types = tableNodeTypes(state.schema);
        var rect = selectedRect(state), tr = state.tr;
        var cells = rect.map.cellsInRect(type == "column" ? new Rect(rect.left, 0, rect.right, rect.map.height) :
                                         type == "row" ? new Rect(0, rect.top, rect.map.width, rect.bottom) : rect);
        var nodes = cells.map(function (pos) { return rect.table.nodeAt(pos); });
        for (var i = 0; i < cells.length; i++) // Remove headers, if any
          { if (nodes[i].type == types.header_cell)
            { tr.setNodeMarkup(rect.tableStart + cells[i], types.cell, nodes[i].attrs); } }
        if (tr.steps.length == 0) { for (var i$1 = 0; i$1 < cells.length; i$1++) // No headers removed, add instead
          { tr.setNodeMarkup(rect.tableStart + cells[i$1], types.header_cell, nodes[i$1].attrs); } }
        dispatch(tr);
      }
      return true
    }
  }

  function isHeaderEnabledByType(type, rect, types) {
    // Get cell positions for first row or first column
    var cellPositions = rect.map.cellsInRect({
      left: 0,
      top: 0,
      right: type == "row" ? rect.map.width : 1,
      bottom: type == "column" ? rect.map.height : 1,
    });

    for (var i = 0; i < cellPositions.length; i++) {
      var cell = rect.table.nodeAt(cellPositions[i]);
      if (cell && cell.type !== types.header_cell) {
        return false
      }
    }

    return true
  }

  // :: (string, ?{ useDeprecatedLogic: bool }) → (EditorState, dispatch: ?(tr: Transaction)) → bool
  // Toggles between row/column header and normal cells (Only applies to first row/column).
  // For deprecated behavior pass `useDeprecatedLogic` in options with true.
  function toggleHeader(type, options) {
    options = options || { useDeprecatedLogic: false };

    if (options.useDeprecatedLogic)
      { return deprecated_toggleHeader(type) }

    return function(state, dispatch) {
      if (!isInTable(state)) { return false }
      if (dispatch) {
        var types = tableNodeTypes(state.schema);
        var rect = selectedRect(state), tr = state.tr;

        var isHeaderRowEnabled = isHeaderEnabledByType("row", rect, types);
        var isHeaderColumnEnabled = isHeaderEnabledByType("column", rect, types);

        var isHeaderEnabled = type === "column" ? isHeaderRowEnabled :
                              type === "row"    ? isHeaderColumnEnabled : false;

        var selectionStartsAt = isHeaderEnabled ? 1 : 0;

        var cellsRect = type == "column" ? new Rect(0, selectionStartsAt, 1, rect.map.height) :
                        type == "row" ? new Rect(selectionStartsAt, 0, rect.map.width, 1) : rect;

        var newType = type == "column" ? isHeaderColumnEnabled ? types.cell : types.header_cell :
                      type == "row" ? isHeaderRowEnabled ? types.cell : types.header_cell : types.cell;

        rect.map.cellsInRect(cellsRect).forEach(function (relativeCellPos) {
          var cellPos = relativeCellPos + rect.tableStart;
          var cell = tr.doc.nodeAt(cellPos);

          if (cell) {
            tr.setNodeMarkup(cellPos, newType, cell.attrs);
          }
        });

        dispatch(tr);
      }
      return true
    }
  }

  // :: (EditorState, dispatch: ?(tr: Transaction)) → bool
  // Toggles whether the selected row contains header cells.
  toggleHeader("row", { useDeprecatedLogic: true });

  // :: (EditorState, dispatch: ?(tr: Transaction)) → bool
  // Toggles whether the selected column contains header cells.
  toggleHeader("column", { useDeprecatedLogic: true });

  // :: (EditorState, dispatch: ?(tr: Transaction)) → bool
  // Toggles whether the selected cells are header cells.
  toggleHeader("cell", { useDeprecatedLogic: true });

  new PluginKey("tableColumnResizing");

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

  exports.Edit = __vue_component__$a;
  exports.Toolbar = __vue_component__;
  exports.default = install;
  exports.install = install;
  exports.options = options;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
