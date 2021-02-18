import * as types from './mutation-types';
import { playMode } from 'config/playMode';
import { shuffle } from 'config/util'

//选择播放歌曲
export const selectPlay = function ({ commit, state }, { list, index }) {
    commit(types.SET_PLAYLIST, list);
    if (state.mode === playMode.random) {
        let randomList = shuffle(list);
        commit(types.SET_PLAYLIST, randomList);
        index = findIndex(randomList, list[index]);
    } else {
        commit(types.SET_PLAYLIST, list);
    }
    commit(types.SET_SEQUENCE_LIST, list);
    commit(types.SET_CURRENT_INDEX, index);
    commit(types.SET_FULL_SCREEN, true);
    commit(types.SET_PLAING_STATE, true);
}

//随机播放歌曲
export const randomPlay = function ({ commit }, { list }) {
    commit(types.SET_PLAY_MODE, playMode.random);
    commit(types.SET_SEQUENCE_LIST, list);
    let randomList = shuffle(list);
    commit(types.SET_PLAYLIST, randomList);
    commit(types.SET_CURRENT_INDEX, 0);
    commit(types.SET_FULL_SCREEN, true);
    commit(types.SET_PLAING_STATE, true);
}

//findIndex
function findIndex(list, song) {
    return list.findIndex(item => {
        return item.id === song.id;
    })
}

//插入歌曲
export const insertSong = function ({ commit, state }, song) {
    let playlist = state.playlist.slice();
    let sequenceList = state.sequenceList.slice();
    let currentIndex = state.currentIndex;

    //记录当前歌曲
    let currentSong = playlist[currentIndex];
    //查找当前列表中是否有待插入的歌曲并返回其索引
    let fpIndex = findIndex(playlist, song);
    //插入歌曲 索引加1
    currentIndex++;
    //插入这首歌到当前索引位置
    playlist.splice(currentIndex, 0, song);
    //如果已经包含了这首歌
    if (fpIndex > -1) {
        //如果插入的序号大于列表中歌曲的序号
        if (currentIndex > fpIndex) {
            playlist.splice(fpIndex, 1);
            currentIndex--;
        } else {
            playlist.splice(fpIndex + 1, 1);
        }
    }

    let currentSIndex = findIndex(sequenceList, currentSong) + 1;
    let fsIndex = findIndex(sequenceList, song);

    sequenceList.splice(currentSIndex, 0, song);
    if(fsIndex > -1) {
        if(currentSIndex > fsIndex ){
            sequenceList.splice(fsIndex, 1)
        } else {
            sequenceList.splice(fsIndex + 1, 1)
        }
    }

    commit(types.SET_PLAYLIST, playlist);
    commit(types.SET_SEQUENCE_LIST, sequenceList);
    commit(types.SET_CURRENT_INDEX, currentIndex);
    commit(types.SET_FULL_SCREEN, true);
    commit(types.SET_PLAING_STATE, true)
}