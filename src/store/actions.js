import * as types from './mutation-types';

//选择播放歌曲
export const selectPlay = function ({commit, state}, {list, index}) {
    commit(types.SET_PLAYLIST, list);
    commit(types.SET_SEQUENCE_LIST, list);
    commit(types.SET_CURRENT_INDEX, index);
    commit(types.SET_FULL_SCREEN, true);
    commit(types.SET_PLAING_STATE, true);
}