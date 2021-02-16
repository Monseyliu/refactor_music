<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <!-- 标题 -->
    <h1 class="title" v-html="title"></h1>
    <!-- 背景图 -->
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div
          @click="random"
          ref="playBtn"
          v-show="songs.length > 0"
          class="play"
        >
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll
      :data="songs"
      @scroll="scroll"
      :listen-scroll="listenScroll"
      :probe-type="probeType"
      class="list"
      ref="list"
    >
      <div class="song-list-wrapper">
        <song-list :rank="rank" :songs="songs" @select="selectItem"></song-list>
      </div>
      <!-- loading -->
      <div class="loading-container" v-show="!songs.length">
        <Loading />
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
//组件
import Scroll from "base/scroll/scroll";
import SongList from "base/song-list/song-list";
import Loading from "base/loading/loading";
// js配置
import { prefixStyle } from "config/dom";
import { mapActions } from "vuex";
import { playlistMixn } from "config/mixin";

const RESERVED_HEIGHT = 40;
const transform = prefixStyle("transform");
const backdrop = prefixStyle("backdrop-filter");

export default {
  mixins: [playlistMixn],
  props: {
    bgImage: {
      type: String,
      default: "",
    },
    songs: {
      type: Array,
      default() {
        return [];
      },
    },
    title: {
      type: String,
      default: "",
    },
    rank: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      scrollY: 0,
    };
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`;
    },
  },
  created() {
    this.probeType = 3;
    this.listenScroll = true;
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight;
    this.minTransalteY = -this.imageHeight + RESERVED_HEIGHT;
    this.$refs.list.$el.style.top = `${this.imageHeight}px`;
  },
  methods: {
    ...mapActions(["selectPlay", "randomPlay"]),
    //mini播放器高度适配
    handlPlaylist(playlist) {
      const bottom = playlist.length > 0 ? '1.2rem' : '';

      this.$refs.list.$el.style.bottom = bottom;
      this.$refs.list.refresh();
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    back() {
      this.$router.back();
    },
    selectItem(item, index) {
      // 选择播放的歌曲，
      this.selectPlay({
        list: this.songs,
        index,
      });
    },
    random() {
      this.randomPlay({
        list: this.songs,
      });
    },
  },
  watch: {
    scrollY(newVal) {
      let translateY = Math.max(this.minTransalteY, newVal);
      let scale = 1;
      let zIndex = 0;
      let blur = 0;
      const percent = Math.abs(newVal / this.imageHeight);
      if (newVal > 0) {
        scale = 1 + percent;
        zIndex = 10;
      } else {
        blur = Math.min(20, percent * 20);
      }

      this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`;
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`;
      if (newVal < this.minTransalteY) {
        zIndex = 10;
        this.$refs.bgImage.style.paddingTop = 0;
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`;
        this.$refs.playBtn.style.display = "none";
      } else {
        this.$refs.bgImage.style.paddingTop = "70%";
        this.$refs.bgImage.style.height = 0;
        this.$refs.playBtn.style.display = "";
      }
      this.$refs.bgImage.style[transform] = `scale(${scale})`;
      this.$refs.bgImage.style.zIndex = zIndex;
    },
  },
  components: {
    Scroll,
    SongList,
    Loading,
  },
};
</script>

<style lang="scss" scoped>
@import "style/mixin.scss";
.music-list {
  @include fixed-full-screen;
  z-index: 100;
  background: $color-background;
  .back {
    position: absolute;
    top: 0;
    left: 0.12rem;
    z-index: 50;
    i {
      display: block;
      padding: 0.2rem;
      font-size: $font-size-large-x;
    }
  }
  // 标题
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    text-align: center;
    line-height: 0.8rem;
    font-size: $font-size-large;
    @include ellipsis;
    z-index: 40;
    color: $color-text;
  }
  // 背景图
  .bg-image {
    position: relative;
    @include wh(100%, 0);
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;
    // 随机播放全部
    .play-wrapper {
      position: absolute;
      bottom: 0.4rem;
      width: 100%;
      z-index: 50;
      .play {
        box-sizing: border-box;
        width: 2.7rem;
        margin: 0 auto;
        padding: 0.14rem 0;
        text-align: center;
        font-size: 0;
        color: $color-theme;
        border: 1px solid;
        border-radius: 2rem;
        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 0.12rem;
          font-size: $font-size-medium-x;
        }
        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
        }
      }
    }
    // 蒙板
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      @include wh(100%, 100%);
      background: rgba(7, 17, 27, 0.4);
    }
  }
  //gblayer 层
  .bg-layer {
    position: relative;
    height: 100%;
    background: $color-background;
  }
  //歌曲列表
  .list {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    background: $color-background;
    .song-list-wrapper {
      padding: 0.4rem 0.6rem;
    }
    // loading
    .loading-container {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
    }
  }
}
</style>