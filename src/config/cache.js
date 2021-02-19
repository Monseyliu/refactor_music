// 本地存储等相关
import storage from "good-storage";

const SEARCH_KEY = "_search_";
const SEARCH_MAX_LENGTH = 15;

const PLAY_KEY = "_play_";
const PLAY_MAX_LENGTH = 200;

//搜索结果
export function saveSearch(query) {
    let searches = storage.get(SEARCH_KEY, []);

    insertArray(searches, query, (item) => {
        return item === query;
    }, SEARCH_MAX_LENGTH);
    storage.set(SEARCH_KEY, searches);

    return searches;
}

//数组插入的方法
function insertArray(arr, val, compare, maxLen) {
    const index = arr.findIndex(compare);
    if (index === 0) return;

    if (index > 0) {
        arr.splice(index, 1);
    }
    arr.unshift(val);

    if (maxLen && arr.length > maxLen) {
        arr.pop();
    }
}

//读取本地存储数据
export function loadSearch() {
    return storage.get(SEARCH_KEY, []);
}

//删除一个历史
export function deleteSearch(query) {
    let searches = storage.get(SEARCH_KEY, []);

    deleteFromArray(searches, (item) => {
        return item === query;
    })

    storage.set(SEARCH_KEY, searches);
    return searches;
}
//数组删除方法
function deleteFromArray(arr, compare) {
    const index = arr.findIndex(compare);

    if (index > -1) {
        arr.splice(index, 1)
    }
}

//清除所有搜索历史
export function clearSearch() {
    storage.remove(SEARCH_KEY);
    return [];
}

//存储播放历史记录
export function savePlay(song) {
    let songs = storage.get(PLAY_KEY, []);
    insertArray(songs, song, (item) => {
        return item.id === song.id
    }, PLAY_MAX_LENGTH)
    storage.set(PLAY_KEY, songs);
    return songs;
}
//读取
export function loadPlay(){
    return storage.get(PLAY_KEY, [])
}