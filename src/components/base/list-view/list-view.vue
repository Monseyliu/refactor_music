<template>
  <Scroll
    :listenScroll="listenScroll"
    class="list-view"
    ref="listview"
    :data="data"
    @scroll="scroll"
    :probeType="probeType"
  >
    <!-- 歌手列表 -->
    <ul>
      <li
        class="list-group"
        ref="listGroup"
        v-for="(singer, index) of data"
        :key="index"
      >
        <!-- 标题 -->
        <h2 class="list-group-title">{{ singer.title }}</h2>
        <ul>
          <li
            class="list-group-item"
            v-for="item of singer.items"
            :key="item.id"
            @click="selectItem(item)"
          >
            <img class="avatar" width="50" height="50" v-lazy="item.avatar" />
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- a-z快速入口 -->
    <div
      class="list-shortcut"
      @touchstart="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
    >
      <ul>
        <li
          class="item"
          :data-index="index"
          v-for="(item, index) of shortcutList"
          :key="index"
          :class="{ current: currentIndex === index }"
        >
          {{ item }}
        </li>
      </ul>
    </div>
    <!-- 固定栏 -->
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <div class="fixed-title">{{ fixedTitle }}</div>
    </div>
    <!-- loading -->
    <div class="loading-container" v-show="!data.length">
      <Loading />
    </div>
  </Scroll>
</template>

<script>
// 组件
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
// js 配置
import { getData } from "config/dom";

const ANCHOR_HEIGHT = 18;
const TITLE_HEIGHT = 30;

export default {
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: 0,
    };
  },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  components: {
    Scroll,
    Loading,
  },
  created() {
    this.touch = {};
    this.listenScroll = true;
    this.listHeight = [];
    this.probeType = 3;
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight();
      }, 20);
    },
    scrollY(newY) {
      const listHeight = this.listHeight;
      // 当滚动到顶部，newY>0
      if (newY > 0) {
        this.currentIndex = 0;
        return;
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i];
        let height2 = listHeight[i + 1];
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i;
          this.diff = height2 + newY;
          return;
        }
      }
      // 当滚动到底部，且-newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2;
    },
    diff(newVal) {
      let fixedTop =
        newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0;
      if (this.fixedTop === fixedTop) return;
      this.fixedTop = fixedTop;
      this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`;
    },
  },
  computed: {
    shortcutList() {
      return this.data.map((group) => {
        return group.title.substr(0, 1);
      });
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return "";
      }
      return this.data[this.currentIndex]
        ? this.data[this.currentIndex].title
        : "";
    },
  },
  methods: {
    //   快速入口触摸事件
    onShortcutTouchStart(e) {
      let anchorIndex = getData(e.target, "index");
      let firstTouch = e.touches[0];
      this.touch.y1 = firstTouch.pageY;
      this.touch.anchorIndex = anchorIndex;
      this._scrollTo(anchorIndex);
    },
    onShortcutTouchMove(e) {
      let firstTouch = e.touches[0];
      this.touch.y2 = firstTouch.pageY;
      let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0;
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
      this._scrollTo(anchorIndex);
    },
    _scrollTo(index) {
      if (!index && index !== 0) return;
      if (index < 0) {
        index = 0;
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2;
      }
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0);
      this.scrollY = this.$refs.listview.scroll.y;
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    _calculateHeight() {
      this.listHeight = [];
      const list = this.$refs.listGroup;
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    // 派发点击事件
    selectItem(item){
      this.$emit('select', item)
    }
  },
};
</script>

<style lang="scss" scoped>
@import "style/mixin.scss";

.list-view {
  position: relative;
  @include wh(100%, 100%);
  overflow: hidden;
  background: $color-background;
  //歌手列表
  .list-group {
    padding-bottom: 0.6rem;
    .list-group-title {
      line-height: 0.6rem;
      height: 0.6rem;
      padding-left: 0.4rem;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $darkColor;
    }
    .list-group-item {
      display: flex;
      padding: 0.4rem 0 0 0.6rem;
      align-items: center;
      color: $color-text-l;
      .avatar {
        border-radius: 50%;
      }
      .name {
        flex: 1;
        margin-left: 0.4rem;
        font-size: $font-size-medium;
      }
    }
  }
  //a-z快速入口
  .list-shortcut {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
    width: 0.4rem;
    padding: 0.4rem 0;
    text-align: center;
    font-family: Helvetica;
    background: $color-background-d;
    border-radius: 0.2rem;
    z-index: 30;
    .item {
      line-height: 1;
      padding: 0.06rem;
      color: $color-text-l;
      font-size: $font-size-small;
    }
    .current {
      color: $color-theme;
    }
  }
  //fixed title 固定栏
  .list-fixed {
    position: absolute;
    top: -.05rem;
    left: 0;
    width: 100%;
    .fixed-title {
      height: 0.65rem;
      line-height: 0.65rem;
      padding-left: 0.4rem;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }
  //loading 
  .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
  }
}
</style>