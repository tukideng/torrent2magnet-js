import torrent2magnet from "../index";
import fs from "fs";
import { Buffer } from "buffer";

const torrent_file = fs.readFileSync("./test/ubuntu.torrent");
const torrent_file_buffer = Buffer.from(torrent_file);

test("test local ubuntu torrent", () => {
  expect(torrent2magnet(torrent_file_buffer)).toEqual({
    success: true,
    infohash: "9ECD4676FD0F0474151A4B74A5958F42639CEBDF",
    magnet_uri: "magnet:?xt=urn:btih:9ECD4676FD0F0474151A4B74A5958F42639CEBDF&dn=ubuntu-23.10.1-desktop-amd64.iso&xl=5173995520&tr=https://torrent.ubuntu.com/announce&tr=https://ipv6.torrent.ubuntu.com/announce",
    dn: "ubuntu-23.10.1-desktop-amd64.iso",
    xl: 5173995520,
    main_tracker: "https://torrent.ubuntu.com/announce",
    tracker_list: ["https://torrent.ubuntu.com/announce", "https://ipv6.torrent.ubuntu.com/announce"],
    is_private: false,
    files: [],
  });
});

test("empty input", () => {
  expect(torrent2magnet()).toEqual({ success: false, infohash: "", magnet_uri: "", dn: "", xl: 0, main_tracker: "", tracker_list: [], is_private: false, files: [] });
});

const torrent_multi_file = fs.readFileSync("./test/my.torrent");
const torrent_multi_file_buffer = Buffer.from(torrent_multi_file);
test("test local torrent contains multiple files", () => {
  expect(torrent2magnet(torrent_multi_file_buffer)).toEqual({
    success: true,
    infohash: "C091BA56D7F3CEA0DD6E6335CC6FF723C9B3952C",
    magnet_uri: "magnet:?xt=urn:btih:C091BA56D7F3CEA0DD6E6335CC6FF723C9B3952C&dn=elk&xl=0&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.opentrackr.org:1337&tr=udp://explodie.org:6969&tr=udp://tracker.empire-js.us:1337&tr=wss://tracker.btorrent.xyz&tr=wss://tracker.openwebtorrent.com&tr=wss://tracker.webtorrent.dev",
    dn: "elk",
    xl: 0,
    main_tracker: "udp://tracker.leechers-paradise.org:6969",
    tracker_list: ["udp://tracker.leechers-paradise.org:6969", "udp://tracker.coppersurfer.tk:6969", "udp://tracker.opentrackr.org:1337", "udp://explodie.org:6969", "udp://tracker.empire-js.us:1337", "wss://tracker.btorrent.xyz", "wss://tracker.openwebtorrent.com", "wss://tracker.webtorrent.dev"],
    is_private: false,
    files: [
      { path: "1-elk-larry-dez-dismang.jpg", length: 124945 },
      { path: "testdir/elk-nicklas-gustafsson.jpg", length: 12988 },
      { path: "testdir/euler-equation.jpg", length: 185550 },
    ],
  });
});
