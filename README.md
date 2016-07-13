# FENIX Visualization box

```javascript

var Viewer = require('fx-md-v/start');

var viewer = new Viewer(options);
```

# Configuration

Check `fx-md-v/config/config.js` to have a look of the default configuration.

<table>
   <thead>
      <tr>
         <th>Parameter</th>
         <th>Type</th>
         <th>Default Value</th>
         <th>Example</th>
         <th>Description</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td>el</td>
         <td>CSS3 Selector/JavaScript DOM element/jQuery DOM element</td>
         <td> - </td>
         <td>"#container"</td>
         <td>component container</td>
      </tr>
      <tr>
         <td>cache</td>
         <td>boolean</td>
         <td>false</td>
         <td>true</td>
         <td>whether or not to use FENIX bridge cache</td>
      </tr>
      <tr>
         <td>model</td>
         <td>Object</td>
         <td>-</td>
         <td>-</td>
         <td>FENIX resource</td>
      </tr>
      <tr>
         <td>popover</td>
         <td>Object</td>
         <td>-</td>
         <td>-</td>
         <td>Bootstrap popover configuration</td>
      </tr>
      <tr>
         <td>config</td>
         <td>Object</td>
         <td>-</td>
         <td>-</td>
         <td>jquery-treegrid configuration</td>
      </tr>
      <tr>
         <td>whiteList</td>
         <td>Object</td>
         <td>-</td>
         <td>-</td>
         <td>-</td>
      </tr>
      <tr>
         <td>export</td>
         <td>boolean</td>
         <td>false</td>
         <td>true</td>
         <td>Whether or not to show export button</td>
      </tr>
      <tr>
         <td>expandedSingleAttributes</td>
         <td>Array of metadata attributes</td>
         <td>[]</td>
         <td>["uid"]</td>
         <td>Expanded single metadata attributes by default</td>
      </tr>
      <tr>
         <td>expandedRecursiveAttributes</td>
         <td>Array of metadata attributes</td>
         <td>[]</td>
         <td>['meContent']</td>
         <td>Expanded recursive metadata attributes by default</td>
      </tr>
      <tr>
         <td>environment</td>
         <td>string</td>
         <td>'develop'</td>
         <td>'production'</td>
         <td>Server environment</td>
      </tr>
   </tbody>
</table>

# API

```javascript
//This is an example
viewer.on("export", function (state) {...});
```

- `viewer.on(event, callback[, context])` : pub/sub 
- `viewer.dispose()` : dispose the catalog instance

# Events

- `ready` : triggered when the metadata viewer is ready
- `dispose` : triggered when the box is disposed
- `export` : triggered when export button is clicked