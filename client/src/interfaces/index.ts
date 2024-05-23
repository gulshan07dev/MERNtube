export interface IPaginationInfo {
  currentPage: number;
  totalPages: number;
  totalDocs: number;
  hasNextPage: boolean;
}

export interface IUser {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  avatar?: string;
  coverImage?: string;
  isWatchHistoryPaused?: boolean;
}

export interface IChannel extends IUser {
  subscriberCount: number;
  channelSubscribedToCount: number;
  videoCount: number;
  isSubscribed: boolean;
}

export interface IPlaylist {
  _id: string;
  name: string;
  description: string;
  owner?: IUser;
  videosCount?: number;
  totalViews?: number;
  isPrivate: boolean;
  playlistThumbnail: string;
  isVideoAddedToPlaylist?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISubscriber extends IUser {
  isSubscribed: boolean;
}

export interface IVideo {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoFile: string;
  duration: number;
  views: number;
  isPublished: boolean;
  owner?: IUser;
  videoLikesCount?: number;
  isLiked?: boolean;
  createdAt: Date;
}

export interface IWatchHistoryVideo {
  _id: string;
  videoId: string;
  owner: string;
  watchHistoryVideo: IVideo;
  createdAt: Date;
}

export interface ITweet {
  _id: string;
  content: string;
  owner: IUser;
  tweetLikesCount: number;
  isLiked: boolean;
  createdAt: Date;
}

export interface IComment {
  _id: string;
  content: string;
  owner: IUser;
  isLiked: boolean;
  commentLikesCount: number;
  createdAt: Date;
}

export interface IVideoComment extends IComment {
  video: string;
}

export interface ITweetComment extends IComment {
  tweet: string;
}
