

// 歌手
export const singer = state => state.singer;
// 歌曲相关
export const playing = state => state.playing;
export const fullScreen = state => state.fullScreen;
export const playlist = state => state.playlist;
export const sequenceList = state => state.sequenceList;
export const mode = state => state.mode;
export const currentIndex = state => state.currentIndex;
// 当前歌曲
export const currentSong = state => {
    return state.playlist[state.currentIndex] || {};
}