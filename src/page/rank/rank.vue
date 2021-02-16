<template>
  <div class="rank" ref="rank">
    <Scroll class="toplist" ref="toplist" :data="topList">
      <ul>
        <li @click="selectItem(item)" class="item" v-for="item of topList" :key="item.id">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl" />
          </div>
          <ul class="songList">
            <li
              class="song"
              v-for="(song, index) of item.songList"
              :key="index"
            >
              <span>{{ index + 1 }}. </span>
              <span>{{ song.songname }}-{{ song.singername }}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length">
        <loading></loading>
      </div>
    </Scroll>
    <router-view></router-view>
  </div>
</template>

<script>
//组件
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
//js 配置
import { getTopList } from "api/rank";
import { ERR_OK } from "config/commonParams";
import { playlistMixn } from "config/mixin";
import { mapMutations } from "vuex";

export default {
  mixins: [playlistMixn],
  data() {
    return {
      topList: [],
    };
  },
  components: {
    Scroll,
    Loading,
  },
  created() {
    this._getTopList();
  },
  methods: {
      ...mapMutations(["SET_TOP_LIST"]),
    //mini播放器高度适配
    handlPlaylist(playlist) {
      const bottom = playlist.length ? "1.2rem" : "";

      this.$refs.rank.style.bottom = bottom;
      this.$refs.toplist.refresh();
    },
    _getTopList() {
      getTopList().then((res) => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList;
        }
      });
    },
    selectItem(item){
        this.$router.push({
            path: `/rank/${item.id}`
        })

        this.SET_TOP_LIST(item);
    }
  },
};
</script>

<style lang="scss" scoped>
@import "style/mixin.scss";
.rank {
  position: fixed;
  width: 100%;
  top: 1.76rem;
  bottom: 0;
  .toplist {
    height: 100%;
    overflow: hidden;
    .item {
      display: flex;
      margin: 0 0.4rem;
      padding-top: 0.4rem;
      height: 2rem;
      &:last-child {
        padding-bottom: 0.4rem;
      }
      .icon {
        flex: 0 0 2rem;
        @include wh(2rem, 2rem);
      }
      .songList {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 0.4rem;
        height: 2rem;
        overflow: hidden;
        background: $color-highlight-background;
        color: $color-text-d;
        font-size: $font-size-small;
        .song {
          @include ellipsis;
          line-height: 0.52rem;
        }
      }
    }
  }
}
.loading-container {
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}
</style>