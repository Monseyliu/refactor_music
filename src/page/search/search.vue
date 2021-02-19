<template>
  <div class="search">
    <!-- 搜索框 -->
    <div class="search-box-wrapper">
      <SearchBox ref="searchBox" @query="onQueryChange" />
    </div>
    <!-- 热词 -->
    <div class="shortcut-wrapper" v-show="!query" ref="shorcutWrapper">
      <Scroll class="shortcut" :data="shortcut" ref="shortcut">
        <div>
          <!-- 热词 -->
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li
                @click="addQuery(item.k)"
                class="item"
                v-for="item of hotKey"
                :key="item.n"
              >
                <span>{{ item.k }}</span>
              </li>
            </ul>
          </div>
          <!-- 搜索历史 -->
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <SearchList
              :searches="searchHistory"
              @deleteOne="deleteSearchHistory"
              @select="addQuery"
            />
          </div>
        </div>
      </Scroll>
    </div>
    <!-- 搜索结果 -->
    <div class="search-result" v-show="query" ref="searchResult">
      <Suggest
        ref="suggest"
        @select="saveSearch"
        :query="query"
        @listScroll="blurInput"
      />
    </div>
    <!-- confirm 弹窗组件 -->
    <div class="confirm-container">
      <Confirm
        @confirm="clearSearchHistory"
        ref="confirm"
        text="是否清空所有搜索历史"
        confirmBtnText="清空"
      />
    </div>
    <!-- 子组件容器 -->
    <router-view></router-view>
  </div>
</template>

<script>
//组件
import SearchBox from "base/search-box/search-box";
import Suggest from "common/suggest/suggest";
import SearchList from "base/search-list/search-list";
import Confirm from "base/confirm/confirm";
import Scroll from "base/scroll/scroll";
//js 配置
import { getHotKey } from "api/search";
import { ERR_OK } from "config/commonParams";
import { mapActions } from "vuex";
import { playlistMixn, searchMixin } from "config/mixin";

export default {
  mixins: [playlistMixn, searchMixin],
  data() {
    return {
      hotKey: [],
    };
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll,
  },
  created() {
    this._getHotKey();
  },
  watch: {
    query(newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh();
        }, 20);
      }
    },
  },
  computed: {
    shortcut() {
      return this.hotKey.concat(this.searchHistory);
    },
  },
  methods: {
    ...mapActions([
      "clearSearchHistory",
    ]),
    //mini 播放器高度适配
    handlPlaylist(playlist) {
      const bottom = playlist.length > 0 ? "1.2rem" : "";

      this.$refs.shorcutWrapper.style.bottom = bottom;
      this.$refs.shortcut.refresh();

      this.$refs.searchResult.style.bottom = bottom;
      this.$refs.suggest.refresh();
    },
    _getHotKey() {
      getHotKey().then((res) => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 15);
        }
      });
    },
    showConfirm() {
      this.$refs.confirm.show();
      //this.clearSearchHistory();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "style/mixin.scss";

.search {
  .search-box-wrapper {
    margin: 0.4rem;
  }
  //热词
  .shortcut-wrapper {
    position: fixed;
    top: 3.56rem;
    bottom: 0;
    width: 100%;
    .shortcut {
      height: 100%;
      overflow: hidden;
      //热刺
      .hot-key {
        margin: 0 0.4rem 0.4rem 0.4rem;
        .title {
          margin-bottom: 0.4rem;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
        .item {
          display: inline-block;
          padding: 0.1rem 0.2rem;
          margin: 0 0.4rem 0.2rem 0;
          border-radius: 0.12rem;
          background: $color-highlight-background;
          font-size: $font-size-medium;
          color: $color-text-d;
        }
      }
      //搜索历史
      .search-history {
        position: relative;
        margin: 0 0.4rem;
        .title {
          display: flex;
          align-items: center;
          height: 0.8rem;
          font-size: $font-size-medium;
          color: $color-text-l;
          .text {
            flex: 1;
          }
          .clear {
            @include ellipsis;
            .icon-clear {
              font-size: $font-size-medium;
              color: $color-text-d;
            }
          }
        }
      }
    }
  }
  //搜索结果
  .search-result {
    position: fixed;
    width: 100%;
    top: 3.56rem;
    bottom: 0;
  }
}
</style>