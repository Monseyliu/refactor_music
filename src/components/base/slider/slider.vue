<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <!-- 轮播点 -->
    <div class="dots">
      <span
        class="dot"
        v-for="(item, index) of dots"
        :key="index"
        :class="{ active: currentPageIndex === index }"
      ></span>
    </div>
  </div>
</template>

<script>
import Bscroll from "better-scroll";
import { addClass } from "config/dom";

export default {
  data() {
    return {
      dots: [],
      currentPageIndex: 0,
    };
  },
  props: {
    loop: {
      type: Boolean,
      default: true,
    },
    autoPlay: {
      type: Boolean,
      default: true,
    },
    interval: {
      type: Number,
      default: 4000,
    },
  },
  mounted() {
    setTimeout(() => {
      this._setSliderWidth();
      //初始化BScroll之前初始化dots
      this._initDots();
      this._initSlider();
      //自动播放
      if (this.autoPlay) {
        this._play();
      }
    }, 20);
    // 修复视口变化宽度导致不能使用的bug
    window.addEventListener("resize", () => {
      if (!this.slider) return;
      this._setSliderWidth(true);
      this.slider.refresh();
    });
  },
  methods: {
    //计算并设置宽度-用于轮播
    _setSliderWidth(isResize) {
      // 获取容器的所有的子元素
      this.children = this.$refs.sliderGroup.children;
      // 设置总容器宽度
      let width = 0;
      // 子元素宽度
      let sliderWidth = this.$refs.slider.clientWidth;
      // 计算
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i];
        // 设置子元素的类和宽度
        addClass(child, "slider-item");
        child.style.width = sliderWidth + "px";
        // 父容器宽度累加
        width += sliderWidth;
      }
      //当是循环模式的时候，需要加两倍宽度
      if (this.loop && !isResize) {
        width += 2 * sliderWidth;
      }
      //父容器总宽
      this.$refs.sliderGroup.style.width = width + "px";
    },
    _initSlider() {
      // 初始化 BScroll
      this.slider = new Bscroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400,
        },
        click: true,
      });
      //监听 滚动事件-用于处理dot 动态样式
      this.slider.on("scrollEnd", this._onScrollEnd);
      // 清除计时器
      this.slider.on("beforeScrollStart", () => {
        if (this.autoPlay) {
          clearTimeout(this.timer);
        }
      });
      //触摸
      this.slider.on("touchend", () => {
        if (this.autoPlay) {
          this._play();
        }
      });
    },
    _onScrollEnd() {
      let pageIndex = this.slider.getCurrentPage().pageX;
      this.currentPageIndex = pageIndex;
      if (this.autoPlay) {
        this._play();
      }
    },
    _initDots() {
      // 获得dots的长度
      this.dots = new Array(this.children.length);
    },
    _play() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.slider.next();
      }, this.interval);
    },
  },
  activated() {
    this.slider.enable();
    let pageIndex = this.slider.getCurrentPage().pageX;
    this.slider.goToPage(pageIndex, 0, 0);
    this.currentPageIndex = pageIndex;
    if (this.autoPlay) {
      this._play();
    }
  },
  deactivated() {
    this.slider.disable();
    clearTimeout(this.timer);
  },
  beforeDestroy() {
    this.slider.disable();
    clearTimeout(this.timer);
  }
};
</script>

<style lang="scss" scoped>
@import "style/mixin.scss";

.slider {
  min-height: 1px;
  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    .slider-item {
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;
      a {
        display: block;
        width: 100%;
        overflow: hidden;
        text-decoration: none;
      }
      img {
        display: block;
        width: 100%;
      }
    }
  }
  .dots {
    position: absolute;
    bottom: 0.24rem;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 0;
    transform: translateZ(1px);
    .dot {
      @include wh(0.16rem, 0.16rem);
      border-radius: 50%;
      display: inline-block;
      margin: 0 0.08rem;
      background: $color-text-l;
    }
    .active {
      width: 0.4rem;
      border-radius: 0.1rem;
      background: $color-text-ll;
    }
  }
}
</style>