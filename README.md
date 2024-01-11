# torrent2magnet-js

[![npm Package](https://img.shields.io/npm/v/torrent2magnet-js.svg)](https://www.npmjs.org/package/torrent2magnet-js)
[![License](https://img.shields.io/npm/l/torrent2magnet-js.svg)](https://github.com/tukideng/torrent2magnet-js/blob/master/LICENSE)
[![downloads per month](http://img.shields.io/npm/dm/torrent2magnet-js.svg)](https://www.npmjs.org/package/torrent2magnet-js)

Takes a buffer of torrent file and returns it's xt, dn, magneturi and more details.

## Install

Install via
`npm install torrent2magnet-js`

## Usage

Use a torrent file buffer as input, and return an object with the following properties:

| Name         | Description                                                                                                                                                     | Example                                                                                                                                                                                           |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| success      | Whether the result was parsed successfully                                                                                                                      | true/false                                                                                                                                                                                        |
| infohash     | Calculated over the contents of the info dictionary in [bencode](https://en.wikipedia.org/wiki/Bencode) form                                                    | 9ECD4676FD0F0474151A4B74A5958F42639CEBDF                                                                                                                                                          |
| magnet_uri   | It consists of a set of parameters, the most commonly used parameter is xt, which is usually a URN formed by the content hash function value of a specific file | magnet:?xt=urn:btih:9ECD4676FD0F0474151A4B74A5958F42639CEBDF&dn=ubuntu-23.10.1-desktop-amd64.iso&xl=5173995520&tr=https://torrent.ubuntu.com/announce&tr=https://ipv6.torrent.ubuntu.com/announce |
| dn           | The name or folder name of the resource                                                                                                                         | ubuntu-23.10.1-desktop-amd64.iso                                                                                                                                                                  |
| xl           | The size of the file in bytes                                                                                                                                   | 5173995520                                                                                                                                                                                        |
| main_tracker | main tracker. The first element of tracker_list                                                                                                                 | 'https://torrent.ubuntu.com/announce'                                                                                                                                                             |
| tracker_list | A list of tracker url                                                                                                                                           | ['https://torrent.ubuntu.com/announce', 'https://ipv6.torrent.ubuntu.com/announce']                                                                                                               |
| is_private   | If the torrent file is private                                                                                                                                  | true/false                                                                                                                                                                                        |
| files        | If the torrent file contains multiple files, this parameter returns the path and file size information of all files.                                            | [{path: 'my-torrent', length: 124945}]                                                                                                                                                            |

### Use in node

```js
import torrent2magnet from "torrent2magnet-js";
import fs from "fs";
import { Buffer } from "buffer";

const torrent_file = fs.readFileSync("./ubuntu.torrent");
const torrent_file_buffer = Buffer.from(torrent_file);

const { success, infohash, magnet_uri, dn, xl, main_tracker, tracker_list, is_private, files } = torrent2magnet(torrent_file_buffer);

// success is a boolean value, if success is true, then the following values are valid
if (success) {
  //...
}
```

### Use in Angular

```html
<input type="file" accept=".torrent" (change)="uploadTorrent($event)" />
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
      const { success, infohash, magnet_uri, dn, xl, main_tracker, tracker_list, is_private, files } = torrent2magnet(buffer_content);
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
