import torrent2magnet from "./index";
import fs from "fs";
import { Buffer } from "buffer";

const torrent_file = fs.readFileSync("./ubuntu.torrent");
const torrent_file_buffer = Buffer.from(torrent_file);

test("test local ubuntu torrent", () => {
  expect(torrent2magnet(torrent_file_buffer)).toEqual({
    infohash: "9ECD4676FD0F0474151A4B74A5958F42639CEBDF",
    magnet_uri: "magnet:?xt=urn:btih:9ECD4676FD0F0474151A4B74A5958F42639CEBDF&dn=ubuntu-23.10.1-desktop-amd64.iso&xl=5173995520&tr=https://torrent.ubuntu.com/announce&tr=https://ipv6.torrent.ubuntu.com/announce",
    dn: "ubuntu-23.10.1-desktop-amd64.iso",
    xl: 5173995520,
    tracker_list: ["https://torrent.ubuntu.com/announce", "https://ipv6.torrent.ubuntu.com/announce"],
    success: true,
  });
});

test("empty input", () => {
  expect(torrent2magnet()).toEqual({ infohash: "", magnet_uri: "", dn: "", xl: 0, tracker_list: [], success: false });
});
