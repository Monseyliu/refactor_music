//共用逻辑处理
import { mapGetters, mapMutations, mapActions } from "vuex";
import { playMode } from "config/playMode";
import { shuffle } from "config/util";

//mini播放器高度适配
export const playlistMixn = {
    computed: {
        ...mapGetters(['playlist'])
    },
    mounted() {
        this.handlPlaylist(this.playlist);
    },
    activated() {
        this.handlPlaylist(this.playlist);
    },
    watch: {
        playlist(newVal) {
            this.handlPlaylist(newVal);
        }
    },
    methods: {
        handlPlaylist() {
            throw new Error('component must implement handlePlaylist method')
        }
    },
}

//播放模式等设置
export const playerMixin = {
    computed: {
        ...mapGetters(["sequenceList", "currentSong", "playlist", "mode"]),
        // 播放模式-icon设置
        iconMode() {
            return this.mode === playMode.sequence
                ? "icon-sequence"
                : this.mode === playMode.loop
                    ? "icon-loop"
                    : "icon-random";
        }
    },
    methods: {
        ...mapMutations([
            "SET_FULL_SCREEN",
            "SET_PLAING_STATE",
            "SET_CURRENT_INDEX",
            "SET_PLAY_MODE",
            "SET_PLAYLIST",
        ]),
        //点击切换播放模式
        changeMode() {
            // 更改播放模式
            const mode = (this.mode + 1) % 3;
            this.SET_PLAY_MODE(mode);
            let list = null;
            if (mode === playMode.random) {
                list = shuffle(this.sequenceList);
            } else {
                list = this.sequenceList;
            }
            this.resetCurrentIndex(list);
            this.SET_PLAYLIST(list);
        },
        resetCurrentIndex(list) {
            // 控制当前歌曲
            let index = list.findIndex((item) => {
                return item.id === this.currentSong.id;
            });
            this.SET_CURRENT_INDEX(index);
        },
    },
}

//搜索歌曲相关
export const searchMixin = {
    data() {
        return {
            query: "",
            refreshDelay: 100
        }
    },
    computed: {
        ...mapGetters(["searchHistory"]),
    },
    methods: {
        ...mapActions(["saveSearchHistory",
            "deleteSearchHistory",]),
        //收其手机键盘
        blurInput() {
            this.$refs.searchBox.blur();
        },
        //保存搜索历史
        saveSearch() {
            this.saveSearchHistory(this.query);
        },
        //监听query变化
        onQueryChange(query) {
            this.query = query;
        },
        addQuery(query) {
            this.$refs.searchBox.setQuery(query);
        },
    },
}