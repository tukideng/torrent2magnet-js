# torrent2magnet-js

[![npm Package](https://img.shields.io/npm/v/torrent2magnet-js.svg)](https://www.npmjs.org/package/torrent2magnet-js)
[![License](https://img.shields.io/npm/l/torrent2magnet-js.svg)](https://github.com/tukideng/torrent2magnet-js/blob/master/LICENSE)
[![downloads per month](http://img.shields.io/npm/dm/torrent2magnet-js.svg)](https://www.npmjs.org/package/torrent2magnet-js)

Takes a buffer of torrent file and returns it's xt, dn, magneturi and more details.

## Install

Install via
`npm install torrent2magnet-js`

## Usage

### use in node

```js
import torrent2magnet from "torrent2magnet-js";
import fs from "fs";
import { Buffer } from "buffer";

const torrent_file = fs.readFileSync("./ubuntu.torrent");
const torrent_file_buffer = Buffer.from(torrent_file);

const { infohash, magnet_uri, dn, xl, tracker_list, success } = torrent2magnet(torrent_file_buffer);

// success is a boolean value, if success is true, then the following values are valid
if (success) {
  //...
}
```

### use in Angular

```html
<input type="file" id="upload-btn" style="display: none" accept=".torrent" (change)="uploadTorrent($event)" />
```

```ts
import torrent2magnet from "torrent2magnet-js";

  uploadTorrent(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    // bencode.decode need ArrayBuffer as input, so we need to use readAsArrayBuffer
    reader.readAsArrayBuffer(file);
    reader.onload = (file: any) => {
      // bencode need Buffer as input, but Buffer is not exist in native library, so we need to import it and set it as global variable in [polyfills.ts]
      const buffer_content = Buffer.from(file.target.result);
      const { infohash, magnet_uri, dn, xl, tracker_list, success } = torrent2magnet(buffer_content);
      if (success) {
        //...
      }
    };
};
```

```ts
// polyfills.ts
import * as buffer from "buffer";
(window as any).Buffer = buffer.Buffer;
```

## License

MIT
