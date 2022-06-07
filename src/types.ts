export type CliOptions = Record<string, boolean | number | string>;

export type CliOArgs = (string | number)[];

export interface BiliJsonApiBody {
  code: number;
  message: string;
  ttl: number;
  data: unknown;
}

export interface BiliSpace {
  has_more: boolean;
  items: BiliSpaceItem[];
  offset: string;
  update_baseline: string;
  update_num: number;
}

export interface BiliSpaceItem {
  basic: {
    comment_id_str: string;
    comment_type: number;
    like_icon: {
      action_url: string;
      end_url: string;
      id: number;
      start_url: string;
    };
    rid_str: string;
  };
  id_str: string;
  modules: {
    module_author: BiliSpaceItemModuleAuthor;
    module_dynamic: BiliSpaceItemModuleDynamic;
    module_more: BiliSpaceItemModuleMore;
    module_stat: BiliSpaceItemModuleStat;
    module_interaction?: BiliSpaceItemModuleInteraction;
  };
  type: "DYNAMIC_TYPE_DRAW" | "DYNAMIC_TYPE_FORWARD";
  visible: boolean;
  orig?: BiliSpaceItem;
}

interface BiliSpaceItemModuleAuthor {
  face: string;
  face_nft: boolean;
  following: boolean;
  jump_url: string;
  label: string;
  mid: number;
  name: string;
  official_verify: {
    desc: string;
    type: -1 | 1;
  };
  pendant: {
    expire: number;
    image: string;
    image_enhance: string;
    image_enhance_frame: string;
    name: string;
    pid: number;
  };
  pub_action: string;
  pub_time: string;
  pub_ts: number;
  type: "AUTHOR_TYPE_NORMAL";
}

interface BiliSpaceItemModuleDynamic {
  desc?: {
    rich_text_nodes: RichTextNode[];
    text: string;
  };
  additional?: { // todo
    type: string;
  };
  major?: {
    draw?: {
      id: number;
      items: {
        width: number;
        height: number;
        size: number;
        src: string;
        tags: string[];
      }[];
    };
    archive?: Record<string, unknown>; // todo
    type: "MAJOR_TYPE_DRAW" | "MAJOR_TYPE_ARCHIVE";
  };
  topic?: {
    id: number;
    jump_url: string;
    name: string;
  };
}

interface BiliSpaceItemModuleInteraction {
  items: {
    desc: {
      rich_text_nodes: RichTextNode[];
      text: string;
    };
    type: number;
  }[];
}

interface BiliSpaceItemModuleMore {
  three_point_items: {
    label: string;
    type: string;
  }[];
}

interface BiliSpaceItemModuleStat {
  comment: {
    count: number;
    forbidden: boolean;
  };
  forward: {
    count: number;
    forbidden: boolean;
  };
  like: {
    count: number;
    forbidden: boolean;
  };
}

interface RichTextNode {
  orig_text: string;
  text: string;
  type: string;
}
