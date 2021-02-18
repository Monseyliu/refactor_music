<template >
  <div class="no-result">
    <div class="no-result-icon"></div>
    <p class="no-result-text">{{ title }}</p>
  </div>
</template>

<script>
export default {
  name: "noResult",
  props: {
    title: {
      type: String,
      default: "暂无结果,请重试",
    },
  },
};
</script>

<style lang="scss" scoped>
@import "style/mixin.scss";
.no-result {
  text-align: center;
  .no-result-icon {
    width: 1.72rem;
    height: 1.8rem;
    margin: 0 auto;
    @include bg-image("no-result");
    background-size: 1.72rem 1.8rem;
    opacity: .5;
  }
  .no-result-text {
    margin-top: 0.6rem;
    font-size: $font-size-medium;
    color: $color-text-d;
  }
}
</style>