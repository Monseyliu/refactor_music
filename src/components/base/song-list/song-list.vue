<template>
  <div class="song-list">
    <ul>
      <li class="item" v-for="song in songs" :key="song.id">
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
  },
  methods: {
      getDesc(song) {
          return `${song.singer}·${song.album}`
      }
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
    .content {
        flex: 1;
        line-height: .4rem;
        overflow: hidden;
      .name {
          @include ellipsis;
          color: $color-text;
      }
      .desc {
          @include ellipsis;
          margin-top: .08rem;
          color: $color-text-l;
      }
    }
  }
}
</style>