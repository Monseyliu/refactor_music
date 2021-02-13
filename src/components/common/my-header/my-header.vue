<template>
  <div class="my_header">
    <div class="icon"></div>
    <span class="text">Favorit-Music</span>
    <div class="mine">
      <i class="icon-mine"></i>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
@import "style/mixin.scss";
.my_header {
  position: relative;
  height: $headHeight;
  color: $color-theme;
  text-align: center;
  font-size: 0;
  .icon {
    @include wh(0.6rem, 0.64rem);
    @include bg-image("logo");
    display: inline-block;
    vertical-align: top;
    background-size: 0.6rem 0.64rem;
    margin: 0.18rem 0.18rem 0 0;
  }
  .text {
    display: inline-block;
    font-size: $font-size-large;
    line-height: $headHeight;
  }
  .mine {
    position: absolute;
    right: 0;
    top: 0;
    i{
        font-size: .4rem;
        padding: .4rem;
        line-height: $headHeight;
    }
  }
}
</style>