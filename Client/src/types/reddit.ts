// Reddit API Types based on https://www.reddit.com/dev/api

export interface RedditPost {
  id: string;
  title: string;
  selftext?: string;
  url?: string;
  author: string;
  subreddit: string;
  subreddit_id: string;
  score: number;
  ups: number;
  downs: number;
  upvote_ratio: number;
  num_comments: number;
  created_utc: number;
  permalink: string;
  thumbnail?: string;
  preview?: {
    images: Array<{
      source: {
        url: string;
        width: number;
        height: number;
      };
      resolutions: Array<{
        url: string;
        width: number;
        height: number;
      }>;
    }>;
  };
  is_video: boolean;
  media?: {
    reddit_video?: {
      bitrate_kbps: number;
      fallback_url: string;
      height: number;
      width: number;
      scrubber_media_url: string;
      dash_url: string;
      duration: number;
      hls_url: string;
      is_gif: boolean;
      transcoding_status: string;
    };
  };
  post_hint?: string;
  domain?: string;
  is_self: boolean;
  over_18: boolean;
  spoiler: boolean;
  locked: boolean;
  stickied: boolean;
  archived: boolean;
  clicked: boolean;
  saved: boolean;
  can_gild: boolean;
  is_crosspostable: boolean;
  pinned: boolean;
  all_awardings: any[];
  awarders: any[];
  author_flair_text?: string;
  author_flair_richtext?: any[];
  author_flair_type?: string;
  author_flair_css_class?: string;
  author_flair_template_id?: string;
  author_fullname: string;
  author_patreon_flair: boolean;
  author_premium: boolean;
  contest_mode: boolean;
  created: number;
  distinguished?: string;
  edited: boolean | number;
  gilded: number;
  gildings: any;
  hidden: boolean;
  is_meta: boolean;
  is_original_content: boolean;
  is_reddit_media_domain: boolean;
  is_robot_indexable: boolean;
  link_flair_background_color?: string;
  link_flair_css_class?: string;
  link_flair_richtext?: any[];
  link_flair_template_id?: string;
  link_flair_text?: string;
  link_flair_text_color?: string;
  link_flair_type?: string;
  media_embed: any;
  media_only: boolean;
  mod_note?: string;
  mod_reason_by?: string;
  mod_reason_title?: string;
  mod_reports: any[];
  name: string;
  no_follow: boolean;
  num_crossposts: number;
  num_reports?: number;
  parent_whitelist_status?: string;
  pwls?: number;
  quarantine: boolean;
  removal_reason?: string;
  report_reasons?: any[];
  secure_media?: any;
  secure_media_embed?: any;
  selftext_html?: string;
  send_replies: boolean;
  shortlink: string;
  subreddit_name_prefixed: string;
  subreddit_subscribers: number;
  subreddit_type: string;
  suggested_sort?: string;
  thumbnail_height?: number;
  thumbnail_width?: number;
  total_awards_received: number;
  treatment_tags: any[];
  upvoted?: boolean;
  user_reports: any[];
  view_count?: number;
  whitelist_status?: string;
  wls?: number;
}

export interface RedditComment {
  id: string;
  body: string;
  author: string;
  score: number;
  ups: number;
  downs: number;
  created_utc: number;
  permalink: string;
  parent_id: string;
  link_id: string;
  subreddit: string;
  subreddit_id: string;
  author_fullname: string;
  author_flair_text?: string;
  author_flair_richtext?: any[];
  author_flair_type?: string;
  author_flair_css_class?: string;
  author_flair_template_id?: string;
  author_patreon_flair: boolean;
  author_premium: boolean;
  can_gild: boolean;
  can_mod_post: boolean;
  collapsed: boolean;
  collapsed_reason?: string;
  controversiality: number;
  depth: number;
  edited: boolean | number;
  gilded: number;
  gildings: any;
  is_submitter: boolean;
  locked: boolean;
  no_follow: boolean;
  removal_reason?: string;
  score_hidden: boolean;
  send_replies: boolean;
  stickied: boolean;
  subreddit_name_prefixed: string;
  subreddit_type: string;
  total_awards_received: number;
  treatment_tags: any[];
  upvoted?: boolean;
  user_reports: any[];
  replies?: string | RedditComment[];
}

export interface RedditSubreddit {
  id: string;
  display_name: string;
  display_name_prefixed: string;
  title: string;
  description: string;
  description_html: string;
  public_description: string;
  public_description_html: string;
  subscribers: number;
  created_utc: number;
  url: string;
  banner_img?: string;
  banner_background_image?: string;
  header_img?: string;
  header_title?: string;
  icon_img?: string;
  community_icon?: string;
  primary_color?: string;
  key_color?: string;
  lang: string;
  over18: boolean;
  quarantine: boolean;
  hide_ads: boolean;
  emojis_enabled: boolean;
  advertiser_category?: string;
  public_traffic: boolean;
  show_media: boolean;
  show_media_preview: boolean;
  spoilers_enabled: boolean;
  submission_type: string;
  submit_link_label?: string;
  submit_text_label?: string;
  submit_text?: string;
  submit_text_html?: string;
  allow_videos: boolean;
  allow_videogifs: boolean;
  allow_polls: boolean;
  allow_images: boolean;
  allow_galleries: boolean;
  user_is_subscriber: boolean;
  user_is_moderator: boolean;
  user_is_banned: boolean;
  user_is_contributor: boolean;
  user_is_muted: boolean;
  user_flair_enabled_in_sr: boolean;
  user_flair_position: string;
  user_flair_richtext: any[];
  user_flair_template_id?: string;
  user_flair_text?: string;
  user_flair_text_color?: string;
  user_flair_css_class?: string;
  user_flair_background_color?: string;
  user_flair_type: string;
  user_sr_flair_enabled: boolean;
  user_sr_theme_enabled: boolean;
  user_has_favorited: boolean;
  user_is_ignored: boolean;
  user_can_flair_in_sr: boolean;
  whitelist_status?: string;
  wls?: number;
  free_form_reports: boolean;
  wiki_enabled: boolean;
}

export interface RedditUser {
  id: string;
  name: string;
  created_utc: number;
  link_karma: number;
  comment_karma: number;
  is_employee: boolean;
  is_friend: boolean;
  is_mod: boolean;
  is_gold: boolean;
  is_verified: boolean;
  has_verified_email: boolean;
  has_paypal_verification: boolean;
  has_android_subscription: boolean;
  has_ios_subscription: boolean;
  has_stripe_subscription: boolean;
  has_subscribed_to_premium: boolean;
  has_subscribed: boolean;
  accept_chats: boolean;
  accept_followers: boolean;
  accept_pms: boolean;
  awardee_karma: number;
  awarder_karma: number;
  coins: number;
  created: number;
  has_external_account: boolean;
  hide_from_robots: boolean;
  icon_img?: string;
  is_blocked: boolean;
  pref_show_snoovatar: boolean;
  snoovatar_img?: string;
  snoovatar_size?: number[];
  subreddit: {
    banner_img?: string;
    banner_size?: number[];
    community_icon?: string;
    default_set: boolean;
    description: string;
    description_html: string;
    disable_contributor_requests: boolean;
    display_name: string;
    display_name_prefixed: string;
    free_form_reports: boolean;
    header_img?: string;
    header_size?: number[];
    icon_color: string;
    icon_img?: string;
    icon_size?: number[];
    is_default_banner: boolean;
    is_default_icon: boolean;
    key_color: string;
    link_flair_enabled: boolean;
    link_flair_position: string;
    name: string;
    over_18: boolean;
    primary_color: string;
    public_description: string;
    public_description_html: string;
    public_traffic: boolean;
    restrict_commenting: boolean;
    restrict_posting: boolean;
    show_media: boolean;
    show_media_preview: boolean;
    spoilers_enabled: boolean;
    submission_type: string;
    submit_link_label?: string;
    submit_text_label?: string;
    submit_text?: string;
    submit_text_html?: string;
    subreddit_type: string;
    subscribers: number;
    title: string;
    url: string;
    user_is_banned: boolean;
    user_is_contributor: boolean;
    user_is_moderator: boolean;
    user_is_muted: boolean;
    user_is_subscriber: boolean;
  };
  verified: boolean;
}

export interface RedditListing<T> {
  kind: string;
  data: {
    after?: string;
    before?: string;
    children: Array<{
      kind: string;
      data: T;
    }>;
    dist?: number;
    facets?: any;
    modhash?: string;
    geo_filter?: string;
  };
}

export interface RedditResponse<T> {
  kind: string;
  data: T;
}

// API Response Types
export type RedditPostsResponse = RedditListing<RedditPost>;
export type RedditCommentsResponse = RedditListing<RedditComment>;
export type RedditSubredditsResponse = RedditListing<RedditSubreddit>;
export type RedditUsersResponse = RedditListing<RedditUser>;

// Query Parameters
export interface RedditPostsQuery {
  limit?: number;
  after?: string;
  before?: string;
  count?: number;
  show?: string;
  sr_detail?: boolean;
  raw_json?: number;
  g?: string;
  include_categories?: boolean;
  t?: "hour" | "day" | "week" | "month" | "year" | "all";
  sort?: "hot" | "new" | "rising" | "top" | "controversial";
  subreddit?: string;
}

export interface RedditCommentsQuery {
  limit?: number;
  after?: string;
  before?: string;
  count?: number;
  show?: string;
  sr_detail?: boolean;
  raw_json?: number;
  sort?:
    | "confidence"
    | "top"
    | "new"
    | "controversial"
    | "old"
    | "random"
    | "qa";
  threaded?: boolean;
  depth?: number;
  context?: number;
  showmore?: boolean;
  article?: string;
}

export interface RedditSubredditsQuery {
  limit?: number;
  after?: string;
  before?: string;
  count?: number;
  show?: string;
  sr_detail?: boolean;
  raw_json?: number;
  include_categories?: boolean;
  t?: "hour" | "day" | "week" | "month" | "year" | "all";
  sort?: "popular" | "new" | "default";
  q?: string;
}
