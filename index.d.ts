declare function torrent2magnet(buffer: Buffer): {
  infohash: string;
  magnet_uri: string;
  dn: string;
  xl: number;
  tracker_list: string[];
  suceess: boolean;
};

export default torrent2magnet;
