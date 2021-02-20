import { playMode } from 'config/playMode';
import { loadSearch, loadPlay, loadFavorite } from 'config/cache';

const state = {
    singer: {}, //歌手数据
    playing: false, //播放暂停
    fullScreen: false, //控制全屏
    playlist: [], //播放列表
    sequenceList: [], //顺序列表-用于随机播放
    mode: playMode.sequence, //播放模式
    currentIndex: -1, //当前播放歌曲索引
    disc: {}, //歌单对象
    topList: {}, 
    searchHistory: loadSearch(), //搜索历史
    playHistory: loadPlay(), //播放历史
    favoriteList: loadFavorite(), //收藏礼拜
}

export default state;