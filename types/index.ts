export interface Profile {
  id: string;
  name: string;
  bio: string;
  attributes: Attribute[];
  followNftAddress: string;
  metadata: string;
  isDefault: boolean;
  picture: Picture | null;
  handle: string;
  coverPicture: Picture | null;
  ownedBy: string;
  dispatcher: Dispatcher;
  stats: Stats;
  followModule: null;
}

export interface Attribute {
  displayType: null;
  traitType: string;
  key: string;
  value: string;
}

export interface Dispatcher {
  address: string;
  canUseRelay: boolean;
}

export interface Picture {
  original: Original;
  __typename: string;
}

export interface Original {
  url: string;
  mimeType: null;
}

export interface Stats {
  totalFollowers: number;
  totalFollowing: number;
  totalPosts: number;
  totalComments: number;
  totalMirrors: number;
  totalPublications: number;
  totalCollects: number;
}
