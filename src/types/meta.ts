export type ChannelLink = {
    name: string;
    url: string;
}

export type Channel = {
    name: string;
    id: string;
    handle: string;
    description: string;
    subscriber: number;
    videoCount: number;
    views: number;
    canPaid: boolean;
    links?: ChannelLink[];
    location?: string;
    joinAt?: Date;
}

export type YTAuthor = {
    name: string;
    channelId: string;
}

export type specificMeta = {
    likeCount?: number;
    dislikeCount?: number;
    description?: string;
    uploadAt?: Date;
}

export type YTPlayerMeta = {
    name?: string;
    author?: YTAuthor;
    videoId?: string;
    paused?: boolean;
    currentTime?: number;
    duration?: number;
    isLive?: boolean;
    onMusic?: boolean; // is Youtube or Youtube Music
    meta?: specificMeta;
}