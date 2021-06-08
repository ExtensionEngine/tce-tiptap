import Blockquote from '@tiptap/extension-blockquote';
import Bold from '@tiptap/extension-bold';
import BubbleMenuExtension from '@tiptap/extension-bubble-menu';
import BulletList from '@tiptap/extension-bullet-list';
import Code from '@tiptap/extension-code';
import CodeBlock from '@tiptap/extension-code-block';
import Document from '@tiptap/extension-document';
import Dropcursor from '@tiptap/extension-dropcursor';
import FontFamily from '@tiptap/extension-font-family';
import FontSize from './font-size';
import Gapcursor from '@tiptap/extension-gapcursor';
import HardBreak from '@tiptap/extension-hard-break';
import Heading from '@tiptap/extension-heading';
import History from '@tiptap/extension-history';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Image from './image';
import Indent from './indent';
import Italic from '@tiptap/extension-italic';
import Link from '@tiptap/extension-link';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Paragraph from '@tiptap/extension-paragraph';
import Placeholder from '@tiptap/extension-placeholder';
import Strike from '@tiptap/extension-strike';
import Subscript from './subscript';
import Superscript from './superscript';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import Text from '@tiptap/extension-text';
import TextAlign from '@tiptap/extension-text-align';
import TextColor from './text-color';
import TextHighlight from './text-highlight';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';

export default [
  BubbleMenuExtension,
  Blockquote,
  Bold,
  BulletList,
  Code,
  CodeBlock,
  Document,
  Dropcursor,
  Gapcursor,
  HardBreak,
  Heading,
  History,
  HorizontalRule,
  Indent,
  Image,
  Italic,
  ListItem,
  Link.configure({ openOnClick: false }),
  OrderedList,
  Paragraph,
  Placeholder.configure({ placeholder: 'Insert text here...' }),
  Strike,
  Text,
  TextStyle,
  FontFamily,
  FontSize,
  Underline,
  Table.configure({ resizable: true }),
  TableRow,
  TableHeader,
  TableCell,
  TextAlign,
  TextColor,
  TextHighlight,
  Superscript,
  Subscript
];
