//共用逻辑处理
import { mapGetters } from "vuex";

//mini播放器高度适配
export const playlistMixn = {
    computed:{
        ...mapGetters(['playlist'])
    },
    mounted() {
        this.handlPlaylist(this.playlist);
    },
    activated() {
        this.handlPlaylist(this.playlist);
    },
    watch:{
        playlist(newVal){
            this.handlPlaylist(newVal);
        }
    },
    methods: {
        handlPlaylist(){
            throw new Error('component must implement handlePlaylist method')
        }
    },
}