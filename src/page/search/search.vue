<template>
  <div class="search">
    <!-- 搜索框 -->
    <div class="search-box-wrapper">
      <SearchBox ref="searchBox" @query="onQueryChange" />
    </div>
    <!-- 热词 -->
    <div class="shortcut-wrapper" v-show="!query">
      <div class="shortcut">
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
      </div>
    </div>
    <!-- 搜索结果 -->
    <div class="search-result" v-show="query">
      <Suggest :query="query" @listScroll="blurInput" />
    </div>
    <!-- 子组件容器 -->
    <router-view></router-view>
  </div>
</template>

<script>
//组件
import SearchBox from "base/search-box/search-box";
import Suggest from "common/suggest/suggest";
//js 配置
import { getHotKey } from "api/search";
import { ERR_OK } from "config/commonParams";

export default {
  data() {
    return {
      hotKey: [],
      query: "",
    };
  },
  components: {
    SearchBox,
    Suggest,
  },
  created() {
    this._getHotKey();
  },
  methods: {
    _getHotKey() {
      getHotKey().then((res) => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 15);
        }
      });
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query);
    },
    //监听query变化
    onQueryChange(query) {
      this.query = query;
    },
    //收其手机键盘
    blurInput(){
        this.$refs.searchBox.blur();
    }
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