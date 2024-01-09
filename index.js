import bencode from "bencode";
import js_sha1 from "js-sha1";

function response(infohash = "", magnet_uri = "", dn = "", xl = 0, tracker_list = [], success = false) {
  return { infohash, magnet_uri, dn, xl, tracker_list, success };
}

function torrent2magnet(buffer_content) {
  if (!buffer_content || buffer_content instanceof Buffer === false) {
    console.error("input is not a buffer");
    return response();
  }

  // decode torrent file
  const torrent = bencode.decode(buffer_content);

  // exact topic (xt) is a URN containing the content hash of the torrent file
  const infohash = js_sha1(bencode.encode(torrent.info)).toUpperCase();

  const decoder = new TextDecoder("utf-8");

  // name of torrent file (dn)
  const dn = decoder.decode(torrent.info.name) || "";

  // length of torrent file (xl)
  const xl = torrent.info.length || 0;

  // url of trackers (tr)
  let tracker_list = [];
  const announce_list = torrent["announce-list"];
  if (announce_list) {
    for (let i = 0; i < announce_list.length; i++) {
      const tracker = announce_list[i];
      tracker_list.push(decoder.decode(tracker[0]));
    }
  }
  const tr = tracker_list.join("&tr=") || "";

  const magnet_uri = `magnet:?xt=urn:btih:${infohash}${dn ? `&dn=${dn}` : ""}${`&xl=${xl}`}${tr ? `&tr=${tr}` : ""}`;

  return response(infohash, magnet_uri, dn, xl, tracker_list, true);
}

export default torrent2magnet;
