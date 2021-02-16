<template>
  <div class="disc">
    <!-- 歌单列表 -->
    <MusicList :title="title" :bgImage="bgImage" :songs="songs" />
  </div>
</template>

<script>
//组件
import MusicList from "common/music-list/music-list";
//js 配置
import { mapGetters } from "vuex";
import { getSongList } from "api/recommend";
import { ERR_OK } from "config/commonParams";
import { createSong, isValidMusic, processSongsUrl } from "config/song";

export default {
  data() {
    return {
      songs: [],
    };
  },
  components: {
    MusicList,
  },
  created() {
    this._getSongList();
  },
  computed: {
    ...mapGetters(["disc"]),
    title() {
      return this.disc.dissname;
    },
    bgImage() {
      return this.disc.imgurl;
    },
  },
  methods: {
    _getSongList() {
      if (!this.disc.dissid) {
        this.$router.push("/recommend");
        return;
      }
      getSongList(this.disc.dissid).then((res) => {
        if (res.code === ERR_OK) {
          processSongsUrl(this._normalizeSongs(res.cdlist[0].songlist)).then(
            (songs) => {
              this.songs = songs;
            }
          );
        }
      });
    },
    //歌曲处理
    _normalizeSongs(list) {
      let ret = [];

      list.forEach((musicData) => {
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "style/mixin.scss";
</style>