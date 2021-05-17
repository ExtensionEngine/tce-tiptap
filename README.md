<div align="center" style="display: flex; align-items: center; justify-content: center;">
  <img width="50" style="margin-right: 20px;" src="https://raw.githubusercontent.com/ExtensionEngine/tailor/d6e8ce002b49092421ca5437fa17700dd368c82d/client/assets/img/default-logo-full.svg">
  <img width="200"style="margin-left: 20px;"  src="https://www.tiptap.dev/assets/img/logo.5bc64ab8.svg">
</div>

# A better text editor for Tailor

`tce-tiptap` is based on [`tiptap editor`](https://www.tiptap.dev/). It covers all the basic features needed for Tailor.

## Installation  and setup
Install the package with last commit hash in tailor
```
npm install @extensionengine/tce-tiptap#[last-commit-hash]
```

Add `tce-tiptap` folder to `client/components/content-elements` and  `index.js` file with this configuration: 
```js
// client/components/content-elements/tce-tiptap/index.js
import '@extensionengine/tce-tiptap/dist/tce-tiptap.css';
import { Edit, options, Toolbar } from '@extensionengine/tce-tiptap/dist/tce-tiptap.esm';

export default {
  ...options,
  name: options.label,
  Edit,
  Toolbar
};
```
## Development 
Install dependecies:
```
npm install
```

### Local development with example
For local development 
```
npm run serve
```
This will run code from the example folder and this can be use as a preview for development changes. 

### Local development with `tailor`

To preview inside `tailor` while developing you need to: 
1. Run [`npm link`](https://docs.npmjs.com/cli/v7/commands/npm-link) inside root folder of this repository. 
2. You need to [setup `tailor` locally ](https://github.com/ExtensionEngine/tailor#setup)
3. Inside `tailor` root folder you need to link this repository with `npm link @extensionengine/tce-tiptap`. This will replace published version of `tce-tiptap` with local version. 
4. In `tailor` you need to update `/client/components/content-elements/tce-tiptap/index.js` to this: 
```js
import '@extensionengine/tce-tiptap/dist/tce-tiptap.css';
import { Edit, Toolbar } from '@extensionengine/tce-tiptap/src/index';

const options = {
  label: 'Html',
  type: 'TIPTAP_HTML',
  ui: {
    icon: 'mdi-text',
    forceFullWidth: false
  }
};

export default {
  ...options,
  name: options.label,
  Edit,
  Toolbar
};
```
If `tce-tiptap` isn't part of `tailor` yet, please consult [this PR](https://github.com/ExtensionEngine/tailor/pull/835/files) all other required changes. 

## Production build
For production build and deployment
```
npm run build
```
And commit `dist` folder and push to repository. Update `tailor` `package.json` with the last commit from `tce-tiptap`, for example. 
```diff
  - "@extensionengine/tce-tiptap": "github:extensionengine/tce-tiptap#af04747",
  + "@extensionengine/tce-tiptap": "github:extensionengine/tce-tiptap#d978684",
```
