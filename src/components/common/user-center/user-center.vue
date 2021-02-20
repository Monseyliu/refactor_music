<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <!-- table切换栏 -->
      <div class="switches-wrapper">
        <Switches
          @switch="switchItem"
          :currentIndex="currentIndex"
          :switches="switches"
        />
      </div>
      <div ref="playBtn" class="play-btn" @click="random">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <!-- 列表区 -->
      <div class="list-wrapper" ref="listWrapper">
        <!-- 收藏列表 -->
        <scroll
          ref="favoriteList"
          class="list-scroll"
          v-if="currentIndex === 0"
          :data="favoriteList"
        >
          <div class="list-inner">
            <song-list :songs="favoriteList" @select="selectSong"></song-list>
          </div>
        </scroll>
        <!-- 播放列表 -->
        <scroll
          ref="playList"
          class="list-scroll"
          v-if="currentIndex === 1"
          :data="playHistory"
        >
          <div class="list-inner">
            <song-list :songs="playHistory" @select="selectSong"></song-list>
          </div>
        </scroll>
      </div>
      <!-- 无结果的 -->
      <div class="no-result-wrapper" v-show="noResult">
        <NoResult :title="noResultDesc" />
      </div>
    </div>
  </transition>
</template>

<script>
//组件
import Switches from "base/switches/switches";
import Scroll from "base/scroll/scroll";
import SongList from "base/song-list/song-list";
import NoResult from "base/no-result/no-result";
//js配置
import { mapGetters, mapActions } from "vuex";
import Song from "config/song";
import { playlistMixn } from "config/mixin";

export default {
  mixins: [playlistMixn],
  data() {
    return {
      currentIndex: 0,
      switches: [{ name: "我喜欢的" }, { name: "最近听的" }],
    };
  },
  computed: {
    ...mapGetters(["playHistory", "favoriteList"]),
    noResult() {
      if (this.currentIndex === 0) {
        return !this.favoriteList.length;
      } else {
        return !this.playHistory.length;
      }
    },
    noResultDesc() {
      if (this.currentIndex === 0) {
        return "暂无收藏歌曲";
      } else {
        return "你还没有听过歌曲";
      }
    },
  },
  components: {
    Switches,
    Scroll,
    SongList,
    NoResult,
  },
  methods: {
    ...mapActions(["insertSong", "randomPlay"]),
    //处理mini播放器高度适配
    handlPlaylist(playlist) {
      const bottom = playlist.length > 0 ? "1.2rem" : "";
      this.$refs.listWrapper.style.bottom = bottom;

      this.$refs.favoriteList && this.$refs.favoriteList.refresh();
      this.$refs.playList && this.$refs.playList.refresh();
    },
    back() {
      this.$router.back();
    },
    switchItem(index) {
      this.currentIndex = index;
    },
    selectSong(song) {
      this.insertSong(new Song(song));
    },
    random() {
      let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory;
      if (list.length === 0) return;
      
      list = list.map((song) => {
        return new Song(song);
      });
      this.randomPlay({ list });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "style/mixin.scss";

.user-center {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  background: $color-background;
  .back {
    position: absolute;
    top: 0;
    left: 0.12rem;
    z-index: 50;
    .icon-back {
      display: block;
      padding: 0.2rem;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  //table栏
  .switches-wrapper {
    margin: 0.2rem 0 0.6rem 0;
  }
  //随机播放
  .play-btn {
    box-sizing: border-box;
    width: 2.7rem;
    padding: 0.14rem 0;
    margin: 0 auto;
    text-align: center;
    border: 1px solid $color-text-l;
    color: $color-text-l;
    border-radius: 2rem;
    font-size: 0;
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
  // 列表区
  .list-wrapper {
    position: absolute;
    top: 2.2rem;
    bottom: 0;
    width: 100%;
    .list-scroll {
      height: 100%;
      overflow: hidden;
    }
    .list-inner {
      padding: 0.4rem 0.6rem;
    }
  }
  //无结果时
  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}
.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>