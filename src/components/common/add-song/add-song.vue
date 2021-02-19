<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <!-- 头部 -->
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <!-- 搜索框 -->
      <div class="search-box-wrapper">
        <SearchBox
          ref="searchBox"
          placeholder="搜索歌曲"
          @query="onQueryChange"
        />
      </div>
      <!-- 热词 -->
      <div class="shortcut" v-show="!query">
        <Switches
          @switch="switchItem"
          :switches="switches"
          :currentIndex="currentIndex"
        />
        <!-- 播放历史 -->
        <div class="list-wrapper">
          <Scroll
            ref="songList"
            class="list-scroll"
            v-if="currentIndex === 0"
            :data="playHistory"
          >
            <div class="list-inner">
              <SongList :songs="playHistory" @select="selectSong" />
            </div>
          </Scroll>
          <!-- 搜索历史 -->
          <Scroll
            ref="searchList"
            class="list-scroll"
            :data="searchHistory"
            v-if="currentIndex === 1"
            :refreshDelay="refreshDelay"
          >
            <div class="list-inner">
              <SearchList
                @deleteOne="deleteSearchHistory"
                @select="addQuery"
                :searches="searchHistory"
              />
            </div>
          </Scroll>
        </div>
      </div>
      <!-- 搜索结果 -->
      <div class="search-result" v-show="query">
        <Suggest
          :query="query"
          :showSinger="showSinger"
          @select="selectSuggest"
          @listScroll="blurInput"
        />
      </div>
      <!-- toptip 提示组件 -->
      <TopTip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放队列</span>
        </div>
      </TopTip>
    </div>
  </transition>
</template>

<script>
//组件
import SearchBox from "base/search-box/search-box";
import Suggest from "common/suggest/suggest";
import Switches from "base/switches/switches";
import Scroll from "base/scroll/scroll";
import SongList from "base/song-list/song-list";
import SearchList from "base/search-list/search-list";
import TopTip from "base/top-tip/top-tip";
//js配置
import { searchMixin } from "config/mixin";
import { mapGetters, mapActions } from "vuex";
import Song from "config/song";

export default {
  mixins: [searchMixin],
  data() {
    return {
      showFlag: false,
      showSinger: false,
      currentIndex: 0,
      switches: [{ name: "最近播放" }, { name: "搜索历史" }],
    };
  },
  computed: {
    ...mapGetters(["playHistory"]),
  },
  components: {
    SearchBox,
    Suggest,
    Switches,
    Scroll,
    SongList,
    SearchList,
    TopTip,
  },
  methods: {
    ...mapActions(["insertSong"]),
    show() {
      this.showFlag = true;
      setTimeout(() => {
        if (this.currentIndex === 0) {
          this.$refs.songList.refresh();
        } else {
          this.$refs.searchList.refresh();
        }
      }, 20);
    },
    hide() {
      this.showFlag = false;
    },
    search(query) {
      this.query = query;
    },
    selectSuggest() {
      this.saveSearch();
      this.showTip();
    },
    switchItem(index) {
      this.currentIndex = index;
    },
    selectSong(song, index) {
      if (index !== 0) {
        this.insertSong(new Song(song));
        this.showTip();
      }
    },
    showTip() {
      this.$refs.topTip.show();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "style/mixin.scss";

.add-song {
  @include fixed-full-screen;
  z-index: 200;
  background: $color-background;
  // 头部
  .header {
    position: relative;
    height: 0.88rem;
    text-align: center;
    .title {
      line-height: 0.88rem;
      font-size: $font-size-large;
      color: $color-text;
    }
    .close {
      position: absolute;
      top: 0;
      right: 0.16rem;
      .icon-close {
        display: block;
        padding: 0.24rem;
        font-size: 0.4rem;
        color: $color-theme;
      }
    }
  }
  //搜索框
  .search-box-wrapper {
    margin: 0.4rem;
  }
  //热词
  .shortcut {
    .list-wrapper {
      position: absolute;
      top: 3.3rem;
      bottom: 0;
      width: 100%;
      .list-scroll {
        height: 100%;
        overflow: hidden;
        .list-inner {
          padding: 0.4rem 0.6rem;
        }
      }
    }
  }
  //搜索结果
  .search-result {
    position: fixed;
    top: 2.48rem;
    bottom: 0;
    width: 100%;
  }
  //toptip提示
  .tip-title {
    text-align: center;
    padding: 0.36rem 0;
    font-size: 0;
    .icon-ok {
      font-size: $font-size-medium;
      color: $color-theme;
      margin-right: 0.08rem;
    }
    .text {
      font-size: $font-size-medium;
      color: $color-text;
    }
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