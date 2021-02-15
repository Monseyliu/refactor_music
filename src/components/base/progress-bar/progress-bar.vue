<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div
        class="progress-btn-wrapper"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend.prevent="progressTouchEnd"
      >
        <div class="progress-btn" ref="progressBtn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { prefixStyle } from "config/dom";

const progressBtnWidth = 16;
const transform = prefixStyle("transform");

export default {
  data() {
    return {};
  },
  props: {
    percent: {
      type: Number,
      default: 0,
    },
  },
  watch: {
    percent(newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
        const offsetWidth = newPercent * barWidth;
        this._offset(offsetWidth);
      }
    },
  },
  created() {
    this.touch = {};
  },
  methods: {
    //进度条拖动处理
    progressTouchStart(e) {
      this.touch.initiated = true;
      this.touch.startX = e.touches[0].pageX;
      this.touch.left = this.$refs.progress.clientWidth;
    },
    progressTouchMove(e) {
      if (!this.touch.initiated) return;
      const deltaX = e.touches[0].pageX - this.touch.startX;
      const offsetWidth = Math.min(
        this.$refs.progressBar.clientWidth - progressBtnWidth,
        Math.max(0, this.touch.left + deltaX)
      );
      this._offset(offsetWidth);
    },
    progressTouchEnd() {
        this.touch.initiated = false;
        this._triggerPercent();
    },
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`;
      this.$refs.progressBtn.style[
        transform
      ] = `translate3d(${offsetWidth}px, 0, 0)`;
    },
    _triggerPercent(){
        // 拖动结束派发进度事件
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
        const percent = this.$refs.progress.clientWidth / barWidth;
        this.$emit('percentChange', percent);
    },
    progressClick(e){
        this._offset(e.offsetX);
        this._triggerPercent();
    }
  },
};
</script>

<style lang="scss" scoped>
@import "style/mixin.scss";
.progress-bar {
  height: 0.6rem;
  .bar-inner {
    position: relative;
    top: 0.26rem;
    height: 0.08rem;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -0.16rem;
      top: -0.26rem;
      width: 0.6rem;
      height: 0.6rem;
      .progress-btn {
        position: relative;
        top: 0.14rem;
        left: 0.14rem;
        box-sizing: border-box;
        width: 0.32rem;
        height: 0.32rem;
        border: 0.06rem solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>