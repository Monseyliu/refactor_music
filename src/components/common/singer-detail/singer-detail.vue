<template>
  <transition name="slider" appear>
    <!-- 歌曲列表 -->
    <MusicList :bgImage="bgImage" :title="title" :songs="songs" />
  </transition>
</template>

<script>
// js 配置
import { mapGetters } from "vuex";
import { getSingerDetail } from "api/singer";
import { ERR_OK } from "config/commonParams";
import { Song, createSong, isValidMusic, processSongsUrl } from "config/song";

// 组件
import MusicList from "common/music-list/music-list";
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
    this._getSingerDetail();
  },
  computed: {
    ...mapGetters(["singer"]),
    title() {
      return this.singer.name;
    },
    bgImage() {
      return this.singer.avatar;
    },
  },
  methods: {
    //歌手详情数据
    _getSingerDetail() {
      if (!this.singer.id) {
        this.$router.push("/singer");
        return;
      }
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          processSongsUrl(this._normalizeSongs(res.data.list)).then((songs) => {
            this.songs = songs;
          });
        }
      });
    },
    //数据处理
    _normalizeSongs(list) {
      let ret = [];
      list.forEach((item) => {
        let { musicData } = item;
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
.slider-enter-active,
.slider-leave-active {
  transition: all 0.3s;
}
.slider-enter,
.slider-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>