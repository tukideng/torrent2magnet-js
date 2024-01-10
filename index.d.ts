declare function torrent2magnet(buffer: Buffer): {
  suceess: boolean;
  infohash: string;
  magnet_uri: string;
  dn: string;
  xl: number;
  main_tracker: string;
  tracker_list: string[];
  is_private: boolean;
  files: { path: string; length: number }[];
};

export default torrent2magnet;
