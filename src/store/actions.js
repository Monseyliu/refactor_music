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