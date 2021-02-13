<template>
  <div class="recommend">
    <div class="recomment-content">
      <div>
        <!-- 轮播 -->
        <div class="slider-wrapper" v-if="recommends.length">
          <div class="slider-content">
            <Slider>
                <div v-for="item of recommends" :key="item.id">
                    <a :href="item.linkUrl">
                        <img :src="item.picUrl">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 组件
import Slider from "base/slider/slider";
// js 配置
import { getRecommendList } from "api/recommend";
import { ERR_OK } from "config/commonParams";

export default {
  data() {
    return {
        recommends: [],
    };
  },
  components: {
    Slider,
  },
  created() {
    this._getRecommend();
  },
  methods: {
    //推荐列表数据获取
    _getRecommend() {
      getRecommendList().then((res) => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider;
        }
      });
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
      .list-title {
      }
    }
  }
}
</style>