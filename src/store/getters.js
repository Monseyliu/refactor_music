

// 歌手
export const singer = state => state.singer;
// 歌曲相关
export const playing = state => state.playing;
export const fullScreen = state => state.fullScreen;
export const playlist = state => state.playlist;
export const sequenceList = state => state.sequenceList;
export const mode = state => state.mode;
export const currentIndex = state => state.currentIndex;
export const disc = state => state.disc;
export const topList = state => state.topList;
// 当前歌曲
export const currentSong = state => {
    return state.playlist[state.currentIndex] || {};
}
//搜索历史 播放历史 收藏列表
export const searchHistory = state => state.searchHistory;
export const playHistory = state => state.playHistory;
export const favoriteList = state => state.favoriteList;