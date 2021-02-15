<template>
  <div class="player" v-show="playlist.length > 0">
    <!-- 全屏播放器 -->
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <!-- 背景 -->
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image" />
        </div>
        <!-- 顶部返回 -->
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <!-- 中间 -->
        <div class="middle">
          <!-- 唱片旋转区 -->
          <div class="middle-l">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image" />
              </div>
            </div>
          </div>
        </div>
        <!-- 底部控制区 -->
        <div class="bottom">
          <!-- 歌曲操作 -->
          <div class="operators">
            <!-- 播放模式 -->
            <div class="icon i-left">
              <i class="icon-random"></i>
            </div>
            <!-- 上一曲 -->
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <!-- 播放暂停 -->
            <div class="icon i-center" :class="disableCls">
              <i
                :class="playIcon"
                class="needsclick"
                @click="togglePlaying"
              ></i>
            </div>
            <!-- 下一首 -->
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- mini 播放器 -->
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <div class="imgWrapper">
            <img
              width="40"
              height="40"
              :class="cdCls"
              :src="currentSong.image"
            />
          </div>
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <div>
            <i :class="miniIcon" @click.stop="togglePlaying"></i>
          </div>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <!-- 歌曲播放 -->
    <audio
      :src="currentSong.url"
      ref="audio"
      @canplay="readey"
      @error="error"
    ></audio>
  </div>
</template>

<script>
// js 配置
import { mapGetters, mapMutations } from "vuex";
import animations from "create-keyframe-animation";
import { prefixStyle } from "config/dom";

const transform = prefixStyle("transform");
const transitionDuration = prefixStyle("transitionDuration");

export default {
  data() {
    return {
      songReady: false,
    };
  },
  computed: {
    ...mapGetters([
      "playlist",
      "fullScreen",
      "currentSong",
      "playing",
      "currentIndex",
    ]),
    playIcon() {
      return this.playing ? "icon-pause" : "icon-play";
    },
    miniIcon() {
      return this.playing ? "icon-pause-mini" : "icon-play-mini";
    },
    cdCls() {
      return this.playing ? "play" : "play pause";
    },
    disableCls() {
        return this.songReady ? '' : 'disable';
    },
  },
  watch: {
    currentSong() {
      //播放歌曲
      this.$nextTick(() => {
        this.$refs.audio.play();
      });
    },
    playing(newPlaying) {
      this.$nextTick(() => {
        const audio = this.$refs.audio;
        newPlaying ? audio.play() : audio.pause();
      });
    },
  },
  methods: {
    ...mapMutations([
      "SET_FULL_SCREEN",
      "SET_PLAING_STATE",
      "SET_CURRENT_INDEX",
    ]),
    back() {
      this.SET_FULL_SCREEN(false);
    },
    open() {
      this.SET_FULL_SCREEN(true);
    },
    //JS动画钩子
    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale();

      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`,
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`,
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`,
        },
      };

      animations.registerAnimation({
        name: "move",
        animation,
        presets: {
          duration: 400,
          easing: "linear",
        },
      });

      animations.runAnimation(this.$refs.cdWrapper, "move", done);
    },
    afterEnter() {
      animations.unregisterAnimation("move");
      this.$refs.cdWrapper.style.animation = "";
    },
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = "all 0.4s";
      const { x, y, scale } = this._getPosAndScale();
      this.$refs.cdWrapper.style[
        transform
      ] = `translate3d(${x}px,${y}px,0) scale(${scale})`;
      const timer = setTimeout(done, 400);
      this.$refs.cdWrapper.addEventListener("transitionend", () => {
        clearTimeout(timer);
        done();
      });
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = "";
      this.$refs.cdWrapper.style[transform] = "";
    },
    _getPosAndScale() {
      const targetWidth = 40;
      const paddingLeft = 40;
      const paddingBottom = 30;
      const paddingTop = 80;
      const width = window.innerWidth * 0.8;
      const scale = targetWidth / width;
      const x = -(window.innerWidth / 2 - paddingLeft);
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
      return {
        x,
        y,
        scale,
      };
    },
    // 歌曲播放
    togglePlaying() {
      this.SET_PLAING_STATE(!this.playing);
    },
    prev() {
      if (!this.songReady) return;
      let index = this.currentIndex - 1;
      if (index === -1) {
        index = this.playlist.length - 1;
      }
      this.SET_CURRENT_INDEX(index);
      if (!this.playing) {
        this.togglePlaying();
      }
      this.songReady = false;
    },
    next() {
      if (!this.songReady) return;
      let index = this.currentIndex + 1;
      if (index === this.playlist.length) {
        index = 0;
      }
      this.SET_CURRENT_INDEX(index);
      if (!this.playing) {
        this.togglePlaying();
      }
      this.songReady = false;
    },
    readey() {
      this.songReady = true;
    },
    error() {
      this.songReady = true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "style/mixin.scss";
.player {
  // 全屏播放器
  .normal-player {
    @include fixed-full-screen;
    z-index: 150;
    background: $color-background;
    // 背景图
    .background {
      position: absolute;
      left: 0;
      top: 0;
      @include wh(100%, 100%);
      z-index: -1;
      opacity: 0.6;
      filter: blur(0.4rem);
    }
    //顶部
    .top {
      position: relative;
      margin-bottom: 0.5rem;
      .back {
        position: absolute;
        top: 0;
        left: 0.12rem;
        z-index: 50;
        .icon-back {
          display: block;
          padding: 0.18rem;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 0.8rem;
        text-align: center;
        @include ellipsis;
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 0.4rem;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    //中间
    .middle {
      position: fixed;
      width: 100%;
      top: 1.6rem;
      bottom: 3.4rem;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        position: relative;
        display: inline-block;
        vertical-align: top;
        height: 0;
        width: 100%;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          top: 0;
          left: 10%;
          @include wh(80%, 100%);
          box-sizing: border-box;
          .cd {
            @include wh(100%, 100%);
            border-radius: 50%;
            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 0.2rem solid rgba(255, 255, 255, 0.1);
            }
          }
        }
      }
    }
    //底部
    .bottom {
      position: absolute;
      bottom: 1rem;
      width: 100%;
      .operators {
        @include flex-align-center;
        i {
          font-size: 0.6rem;
        }
        .icon {
          flex: 1;
          color: $color-theme;
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 0.4rem;
          text-align: center;
          i {
            font-size: 0.8rem;
          }
        }
        .i-right {
          text-align: left;
        }
        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
  }
  //mini 播放器
  .mini-player {
    position: fixed;
    @include wh(100%, 1.2rem);
    left: 0;
    bottom: 0;
    z-index: 180;
    background: $color-highlight-background;
    @include flex-align-center;
    .icon {
      flex: 0 0 0.8rem;
      width: 0.8rem;
      height: 0.8rem;
      padding: 0 0.2rem 0 0.4rem;
      .imgWrapper {
        height: 100%;
        width: 100%;
        img {
          border-radius: 50%;
        }
      }
    }
    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 0.4rem;
      overflow: hidden;
      .name {
        margin-bottom: 0.04rem;
        @include ellipsis;
        font-size: $font-size-medium;
        color: $color-text;
      }
      .desc {
        @include ellipsis;
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }
    .control {
      flex: 0 0 0.6rem;
      width: 0.6rem;
      padding: 0 0.2rem;
      .icon-play-mini,
      .icon-pause-mini,
      .icon-playlist {
        font-size: 0.6rem;
        color: $color-theme-d;
      }
      .icon-mini {
        font-size: 0.64rem;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
}
//transition
.normal-enter-active,
.normal-leave-active {
  transition: all 0.4s;
  .top,
  .bottom {
    transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
  }
}
.normal-enter,
.normal-leave-to {
  opacity: 0;
  .top {
    transform: translate3d(0, -2rem, 0);
  }
  .bottom {
    transform: translate3d(0, 2rem, 0);
  }
}
// mini
.mini-enter-active,
.mini-leave-active {
  transition: all 0.4s;
}
.mini-enter,
.mini-leave-to {
  opacity: 0;
}
// 旋转
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
//唱片旋转
.play {
  animation: rotate 20s linear infinite;
}
.pause {
  animation-play-state: paused;
}
//禁用状态
.disable{
    color: $color-theme-d;
}
</style>