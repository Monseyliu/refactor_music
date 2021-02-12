<template>
  <div class="tab-bar">
    <router-link
      class="tab-item"
      v-for="item of tables"
      :key="item.id"
      :to="item.path"
    >
      <span class="tab-text">{{ item.title }}</span>
    </router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tables: [
        { title: "推荐", path: "/recommend", id: 11 },
        { title: "歌手", path: "/singer", id: 12 },
        { title: "排行", path: "/rank", id: 13 },
        { title: "搜索", path: "/search", id: 14 },
      ]
    };
  },
};
</script>

<style lang="scss" scoped>
@import "style/mixin.scss";
.tab-bar {
  height: $headHeight;
  line-height: $headHeight;
  font-size: $font-size-medium;
  display: flex;
  .tab-item {
    flex: 1;
    text-align: center;
    .tab-text {
      color: $color-text-ll;
    }
  }
  .router-link-active{
      .tab-text{
          color: $color-theme;
          border-bottom: .04rem solid $color-theme;
      }
  }
}
</style>