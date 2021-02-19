<template>
  <Scroll
    class="suggest"
    :data="result"
    :pullup="pullup"
    @scrollToEnd="searchMore"
    ref="suggest"
    :beforeScroll="beforeScroll"
    @beforeScroll="listScroll"
  >
    <ul class="suggest-list">
      <li
        @click="selectItem(item)"
        class="suggest-item"
        v-for="(item, index) of result"
        :key="index"
      >
        <div class="icon">
          <i :class="getIcon(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <!-- loading -->
      <div class="loading-container" v-show="hasMore">
        <Loading />
      </div>
    </ul>
    <!-- 无结果展示 -->
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <NoResult />
    </div>
  </Scroll>
</template>

<script>
//js配置
import { search } from "api/search";
import { ERR_OK } from "config/commonParams";
import { processSongsUrl, isValidMusic, createSong } from "config/song";
import Singer from "config/singer";
import { mapMutations, mapActions } from "vuex";
//组件
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import NoResult from "base/no-result/no-result";

const TYPE_SINGER = "singer";
const perpage = 30;

export default {
  data() {
    return {
      page: 1,
      result: [],
      pullup: true,
      hasMore: true,
      beforeScroll: true,
    };
  },
  components: {
    Scroll,
    Loading,
    NoResult,
  },
  props: {
    query: {
      type: String,
      default: "",
    },
    showSinger: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    query() {
      this._search();
    },
  },
  methods: {
    ...mapMutations(["SET_SINGER"]),
    ...mapActions(["insertSong"]),
    _search() {
      this.hasMore = true;
      this.page = 1;
      //this.$refs.suggest.scrollTo(0,0)
      search(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this._genResult(res.data).then((result) => {
            this.result = result;
            this._checkMore(res.data);
            this.hasMore = false;
          });
        }
      });
    },
    _genResult(data) {
      let ret = [];
      if (data.zhida && data.zhida.singerid && this.page === 1) {
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } });
      }
      return processSongsUrl(this._normalizeSongs(data.song.list)).then(
        (songs) => {
          ret = ret.concat(songs);
          return ret;
        }
      );
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach((musicData) => {
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    },
    getIcon(item) {
      if (item.type === TYPE_SINGER) {
        return "icon-mine";
      } else {
        return "icon-music";
      }
    },
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername;
      } else {
        return `${item.name}-${item.singer}`;
      }
    },
    //搜索更多
    searchMore() {
      if (!this.hasMore) return;
      this.page++;
      search(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this.result.concat(this._genResult(res.data));
          this._checkMore(res.data);
        }
      });
    },
    _checkMore(data) {
      const song = data.song;
      if (
        !song.list.length ||
        song.curnum + song.curpage * perpage >= song.totalnum
      ) {
        this.hasMore = false;
      }
    },
    //点击事件
    selectItem(item) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername,
        });
        this.$router.push({
          path: `/search/${singer.id}`,
        });
        this.SET_SINGER(singer);
      } else {
        this.insertSong(item);
      }
      this.$emit('select')
    },
    //手机键盘处理
    listScroll() {
      this.$emit("listScroll");
    },
    refresh(){
        this.$refs.suggest.refresh();
    }
  },
};
</script>

<style lang="scss" scoped>
@import "style/mixin.scss";

.suggest {
  height: 100%;
  overflow: hidden;
  .suggest-list {
    padding: 0 0.6rem;
    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 0.4rem;
      .icon {
        flex: 0 0 30px;
        width: 30px;
        [class^="icon-"] {
          font-size: 14px;
          color: $color-text-d;
        }
      }
      .name {
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-d;
        overflow: hidden;
        .text {
          @include ellipsis;
        }
      }
    }
  }
  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>