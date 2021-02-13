<template>
  <div class="recommend">
    <Scroll :data="discList" ref="scroll" class="recomment-content">
      <div>
        <!-- 轮播 -->
        <div class="slider-wrapper" v-if="recommends.length">
          <div class="slider-content">
            <Slider>
              <div v-for="item of recommends" :key="item.id">
                <a :href="item.linkUrl">
                  <img :src="item.picUrl" @load="loadImage" />
                </a>
              </div>
            </Slider>
          </div>
        </div>
        <!-- 推荐列表 -->
        <div class="recommend-list">
          <!-- title -->
          <div class="list-title">热门歌曲推荐</div>
          <!-- 歌单列表 -->
          <div class="list-wrapper">
            <ul>
              <li class="list-item" v-for="item of discList" :key="item.dissid">
                <img
                  width="60"
                  height="60"
                  v-lazy="item.imgurl"
                  class="item-img"
                />
                <div class="item-left">
                  <span class="item-title" v-html="item.creator.name"></span>
                  <span class="item-desc" v-html="item.dissname"></span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Scroll>
    <!-- loading 组件 -->
    <div class="loading-wrapper" v-show="!discList.length">
      <Loading />
    </div>
  </div>
</template>

<script>
// 组件
import Slider from "base/slider/slider";
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
// js 配置
import { getRecommendList, getDiscList } from "api/recommend";
import { ERR_OK } from "config/commonParams";

export default {
  data() {
    return {
      recommends: [],
      discList: [],
    };
  },
  components: {
    Slider,
    Scroll,
    Loading,
  },
  created() {
    this._getRecommend();
    this._getDiscList();
  },
  methods: {
    //Banner
    _getRecommend() {
      getRecommendList().then((res) => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider;
        }
      });
    },
    // 推荐歌单礼拜
    _getDiscList() {
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list;
        }
      });
    },
    loadImage() {
      // 监听图片下载，刷新scroll组件
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh();
        this.checkLoaded = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "style/mixin.scss";
.recommend {
  position: fixed;
  top: 1.76rem;
  width: 100%;
  bottom: 0;
  .recomment-content {
    height: 100%;
    overflow: hidden;
    // 轮播
    .slider-wrapper {
      position: relative;
      @include wh(100%, 0);
      padding-top: 40%;
      .slider-content {
        position: absolute;
        @include wh(100%, 100%);
        background: #fff;
        top: 0;
        left: 0;
      }
    }
    // 推荐列表
    .recommend-list {
      height: 100%;
      overflow: hidden;
      .list-title {
        line-height: 1.3rem;
        height: 1.3rem;
        text-align: center;
      }
      .list-wrapper {
        .list-item {
          display: flex;
          align-items: center;
          padding: 0 0.4rem 0.4rem 0.4rem;
          .item-img {
            padding-right: 0.4rem;
          }
          .item-left {
            flex: 1;
            @include flex-column-center;
            font-size: $font-size-medium;
            .item-title {
              color: $color-text-ll;
              margin-bottom: 0.2rem;
            }
            .item-desc {
              @include ellipsis;
              color: $color-text-l;
            }
          }
        }
      }
    }
  }
  // loading
  .loading-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>