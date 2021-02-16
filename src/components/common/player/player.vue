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
        <div
          class="middle"
          @touchstart.prevent="middleTouchStart"
          @touchmove.prevent="middleTouchMove"
          @touchend.prevent="middleTouchEnd"
        >
          <!-- 唱片旋转区 -->
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image" />
              </div>
            </div>
            <!-- 当前行歌词 -->
            <div class="playing-lyric-wrap">
              <div class="playing-lyric">{{ playingLyric }}</div>
            </div>
          </div>
          <!-- 歌词展示 -->
          <Scroll
            class="middle-r"
            ref="lyricList"
            :data="currentLyric && currentLyric.lines"
          >
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p
                  ref="lyricLine"
                  class="text"
                  v-for="(line, index) in currentLyric.lines"
                  :key="index"
                  :class="{ current: currentLineNum === index }"
                >
                  {{ line.txt }}
                </p>
              </div>
              <div class="pure-music">
                <p></p>
              </div>
            </div>
          </Scroll>
        </div>
        <!-- 底部控制区 -->
        <div class="bottom">
          <!-- dot 点显示区 -->
          <div class="dot-wrapper">
            <span class="dot" :class="{ active: currentShow === 'cd' }"></span>
            <span
              class="dot"
              :class="{ active: currentShow === 'lyric' }"
            ></span>
          </div>
          <!-- 歌曲进度条 -->
          <div class="progress-wrapper">
            <span class="time time-l">{{ format(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <!-- 进度条组件 -->
              <ProgressBar
                :percent="percent"
                @percentChange="onProgressBarChange"
              />
            </div>
            <span class="time time-r">{{ format(currentSong.duration) }}</span>
          </div>
          <!-- 歌曲操作 -->
          <div class="operators">
            <!-- 播放模式 -->
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
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
          <ProgressCircle :radius="radius" :percent="percent">
            <i
              :class="miniIcon"
              class="icon-mini"
              @click.stop="togglePlaying"
            ></i>
          </ProgressCircle>
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
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
  </div>
</template>

<script>
// js 配置
import { mapGetters, mapMutations } from "vuex";
import animations from "create-keyframe-animation";
import { prefixStyle } from "config/dom";
import { playMode } from "config/playMode";
import { shuffle } from "config/util";
import Lyric from "lyric-parser";
//组件
import ProgressBar from "base/progress-bar/progress-bar";
import ProgressCircle from "base/progress-circle/progress-circle";
import Scroll from "base/scroll/scroll";

const transform = prefixStyle("transform");
const transitionDuration = prefixStyle("transitionDuration");

export default {
  data() {
    return {
      songReady: false,
      currentTime: 0,
      radius: 32,
      currentLyric: null,
      currentLineNum: 0,
      currentShow: "cd",
      playingLyric: "",
    };
  },
  created() {
    this.touch = {};
  },
  computed: {
    ...mapGetters([
      "playlist",
      "fullScreen",
      "currentSong",
      "playing",
      "currentIndex",
      "mode",
      "sequenceList",
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
      return this.songReady ? "" : "disable";
    },
    percent() {
      return this.currentTime / this.currentSong.duration;
    },
    // 播放模式
    iconMode() {
      return this.mode === playMode.sequence
        ? "icon-sequence"
        : this.mode === playMode.loop
        ? "icon-loop"
        : "icon-random";
    },
  },
  watch: {
    currentSong(newSong, oldSong) {
      //播放歌曲
      if (newSong.id === oldSong.id) return;

      if (this.currentLyric) {
        this.currentLyric.stop();
      }

      setTimeout(() => {
        this.$refs.audio.play();
        this.getLyric();
      }, 1000);
    },
    playing(newPlaying) {
      this.$nextTick(() => {
        const audio = this.$refs.audio;
        newPlaying ? audio.play() : audio.pause();
      });
    },
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll,
  },
  methods: {
    ...mapMutations([
      "SET_FULL_SCREEN",
      "SET_PLAING_STATE",
      "SET_CURRENT_INDEX",
      "SET_PLAY_MODE",
      "SET_PLAYLIST",
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
      if (!this.songReady) return;
      this.SET_PLAING_STATE(!this.playing);

      if (this.currentLyric) {
        this.currentLyric.togglePlay();
      }
    },
    prev() {
      if (!this.songReady) return;

      if (this.playlist.length === 1) {
        this.loop();
      } else {
        let index = this.currentIndex - 1;
        if (index === -1) {
          index = this.playlist.length - 1;
        }
        this.SET_CURRENT_INDEX(index);
        if (!this.playing) {
          this.togglePlaying();
        }
      }

      this.songReady = false;
    },
    next() {
      if (!this.songReady) return;

      if (this.playlist.length === 1) {
        this.loop();
      } else {
        let index = this.currentIndex + 1;
        if (index === this.playlist.length) {
          index = 0;
        }
        this.SET_CURRENT_INDEX(index);
        if (!this.playing) {
          this.togglePlaying();
        }
      }

      this.songReady = false;
    },
    end() {
      //监听歌曲播放完成切换下一首
      if (this.mode === playMode.loop) {
        this.loop();
      } else {
        this.next();
      }
    },
    loop() {
      //单曲循环
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
      //歌词
      if (this.currentLyric) {
        this.currentLyric.seek(0);
      }
    },
    readey() {
      this.songReady = true;
    },
    error() {
      this.songReady = true;
    },
    //进度条
    updateTime(e) {
      this.currentTime = e.target.currentTime;
    },
    format(interval) {
      interval = interval | 0;
      const minute = this._pad((interval / 60) | 0);
      const second = this._pad(interval % 60);
      return `${minute}:${second}`;
    },
    _pad(num, n = 2) {
      let len = num.toString().length;
      while (len < n) {
        num = "0" + num;
        len++;
      }
      return num;
    },
    onProgressBarChange(percent) {
      // 接收子组件传递过来的percent 拖动
      const currentTime = this.currentSong.duration * percent;
      this.$refs.audio.currentTime = currentTime;
      if (!this.playing) {
        this.togglePlaying();
      }
      //歌词处理
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000);
      }
    },
    //播放模式
    changeMode() {
      // 更改播放模式
      const mode = (this.mode + 1) % 3;
      this.SET_PLAY_MODE(mode);
      let list = null;
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      this.resetCurrentIndex(list);
      this.SET_PLAYLIST(list);
    },
    resetCurrentIndex(list) {
      // 控制当前歌曲
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id;
      });
      this.SET_CURRENT_INDEX(index);
    },
    //歌词
    getLyric() {
      this.currentSong
        .getLyric()
        .then((lyric) => {
          this.currentLyric = new Lyric(lyric, this.handleLyric);
          if (this.playing) {
            this.currentLyric.play();
          }
        })
        .catch(() => {
          this.currentLyric = null;
          this.playingLyric = "";
          this.currentLineNum = 0;
        });
    },
    handleLyric({ lineNum, txt }) {
      if (!this.$refs.lyricLine) {
        return;
      }
      this.currentLineNum = lineNum;
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5];
        this.$refs.lyricList.scrollToElement(lineEl, 1000);
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000);
      }
      //当前歌词
      this.playingLyric = txt;
    },
    //左右滑动切换CD和歌词展示
    middleTouchStart(e) {
      this.touch.initiated = true;
      const touch = e.touches[0];
      this.touch.startX = touch.pageX;
      this.touch.startY = touch.pageY;
    },
    middleTouchMove(e) {
      if (!this.touch.initiated) return;
      const touch = e.touches[0];
      const deltaX = touch.pageX - this.touch.startX;
      const deltaY = touch.pageY - this.touch.startY;

      if (Math.abs(deltaY) > Math.abs(deltaX)) return;

      const left = this.currentShow === "cd" ? 0 : -window.innerWidth;
      const offsetWidth = Math.min(
        0,
        Math.max(-window.innerWidth, left + deltaX)
      );
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth);
      this.$refs.lyricList.$el.style[
        transform
      ] = `translate3d(${offsetWidth}px, 0, 0)`;
      this.$refs.lyricList.$el.style[transitionDuration] = 0;

      this.$refs.middleL.style.opacity = 1 - this.touch.percent;
      this.$refs.middleL.style[transitionDuration] = 0;
    },
    middleTouchEnd() {
      let offsetWidth;
      let opacity;

      if (this.currentShow === "cd") {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth;
          opacity = 0;
          this.currentShow = "lyric";
        } else {
          offsetWidth = 0;
          opacity = 1;
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0;
          this.currentShow = "cd";
          opacity = 1;
        } else {
          offsetWidth = -window.innerWidth;
          opacity = 0;
        }
      }
      this.$refs.lyricList.$el.style[
        transform
      ] = `translate3d(${offsetWidth}px, 0, 0)`;
      const time = 300;
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`;

      this.$refs.middleL.style.opacity = opacity;
      this.$refs.middleL.style[transitionDuration] = `${time}ms`;
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
      //唱片
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
        //当前行歌词
        .playing-lyric-wrap {
          width: 80%;
          margin: 0.6rem auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 0.4rem;
            line-height: 0.4rem;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
      //歌词
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 0.64rem;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
          .current {
            color: $color-text;
          }
          .pure-music {
            padding-top: 50%;
            line-height: 0.64rem;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }
    //底部
    .bottom {
      position: absolute;
      bottom: 1rem;
      width: 100%;
      // dot 区域
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 0.08rem;
          width: 0.16rem;
          height: 0.16rem;
          border-radius: 50%;
          background: $color-text-l;
        }
        .active {
          width: 0.4rem;
          border-radius: 0.1rem;
          background: $color-text-ll;
        }
      }
      //歌曲进度条
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0 auto;
        padding: 0.2rem 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 0.6rem;
          line-height: 0.6rem;
          width: 0.6rem;
        }
        .time-l {
          text-align: left;
          margin-right: 0.15rem;
        }
        .time-r {
          text-align: right;
          margin-left: 0.15rem;
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      //歌曲操作
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
.disable {
  color: $color-theme-d;
}
</style>