<template>
  <div class="home">
    <!-- 头部 -->
    <MyHeader />
    <!-- tabbar -->
    <TabBar />
    <!-- 展示区 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <!-- 播放器 -->
    <Player />
  </div>
</template>

<script>
import MyHeader from "common/my-header/my-header";
import TabBar from "common/tab-bar/tab-bar";
import Player from "common/player/player";

export default {
  data() {
    return {};
  },
  components: {
    MyHeader,
    TabBar,
    Player
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
@import "style/mixin.scss";
.home {
  overflow: hidden;
}
</style>