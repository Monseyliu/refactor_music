<template>
  <div class="song-list">
    <ul>
      <li
        @click="selectItem(song, index)"
        class="item"
        v-for="(song, index) in songs"
        :key="song.id"
      >
        <!-- 排行 -->
        <div class="rank" v-show="rank">
          <span :class="getRankCls(index)">{{ getRankText(index) }}</span>
        </div>
        <!-- 描述 -->
        <div class="content">
          <h2 class="name">{{ song.name }}</h2>
          <p class="desc">{{ getDesc(song) }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    songs: {
      type: Array,
      default() {
        return [];
      },
    },
    rank: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    getDesc(song) {
      return `${song.singer}·${song.album}`;
    },
    selectItem(item, index) {
      //派发点击事件
      this.$emit("select", item, index);
    },
    getRankCls(index) {
      if (index <= 2) {
        return `icon icon${index}`;
      } else {
        return "text";
      }
    },
    getRankText(index) {
      if (index > 2) {
        return index + 1;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "style/mixin.scss";

.song-list {
  .item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 1.28rem;
    font-size: $font-size-medium;
    //排行图标
    .rank {
      flex: 0 0 0.5rem;
      width: 0.5rem;
      margin-right: 0.6rem;
      text-align: center;
      .icon {
        display: inline-block;
        width: 0.5rem;
        height: 0.48rem;
        background-size: 0.5rem 0.48rem;
      }
      .icon0 {
        @include bg-image("first");
      }
      .icon1 {
        @include bg-image("second");
      }
      .icon2 {
        @include bg-image("third");
      }
      .text {
        color: $color-theme;
        font-size: $font-size-large;
      }
    }
    // 名称描述
    .content {
      flex: 1;
      line-height: 0.4rem;
      overflow: hidden;
      .name {
        @include ellipsis;
        color: $color-text;
      }
      .desc {
        @include ellipsis;
        margin-top: 0.08rem;
        color: $color-text-l;
      }
    }
  }
}
</style>