import bencode from "bencode";
import js_sha1 from "js-sha1";

function response(success = false, infohash = "", magnet_uri = "", dn = "", xl = 0, main_tracker = "", tracker_list = [], is_private = false, files = []) {
  return { success, infohash, magnet_uri, dn, xl, main_tracker, tracker_list, is_private, files };
}

function torrent2magnet(buffer_content) {
  if (!buffer_content || buffer_content instanceof Buffer === false) {
    console.error("input is not a buffer");
    return response();
  }

  // decode torrent file
  const torrent = bencode.decode(buffer_content);

  if (!torrent.info) {
    console.error("invalid torrent file");
    return response();
  }

  // exact topic (xt) is a URN containing the content hash of the torrent file
  const infohash = js_sha1(bencode.encode(torrent.info)).toUpperCase();

  const decoder = new TextDecoder("utf-8");

  // name of torrent file (dn)
  const dn = torrent.info.name ? decoder.decode(torrent.info.name) : "";

  // length of torrent file (xl)
  const xl = torrent.info.length || 0;

  // main tracker (tr)
  const main_tracker = torrent.announce ? decoder.decode(torrent.announce) : "";

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

  // if torrent has multiple files, info contains files with their length and path
  const files = [];
  if (torrent.info.files && torrent.info.files.length > 0) {
    for (let i = 0; i < torrent.info.files.length; i++) {
      let path = "";
      // if the torrent file has folders inside, the path is an array of strings, so we need to join the paths with "/"
      for (let j = 0; j < torrent.info.files[i].path.length; j++) {
        path += `${j > 0 ? "/" : ""}` + decoder.decode(torrent.info.files[i].path[j]);
      }
      const length = torrent.info.files[i].length || 0;
      files.push({ path, length });
    }
  }

  // magnet uri, so far we have: xt, dn, xl, tr
  const magnet_uri = `magnet:?xt=urn:btih:${infohash}${dn ? `&dn=${dn}` : ""}${`&xl=${xl}`}${tr ? `&tr=${tr}` : ""}`;

  // is torrent private (private), 1 = true, 0 = false. If private, only the main tracker can be used
  const is_private = torrent.info.private === 1 ? true : false;

  return response(true, infohash, magnet_uri, dn, xl, main_tracker, tracker_list, is_private, files);
}

export default torrent2magnet;
