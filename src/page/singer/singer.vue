<template>
  <div class="singer" ref="singer">
    <!-- 歌手列表 -->
    <ListView :data="singers" @select="selectSinger" ref="listView" />
    <!-- 歌手详情页 -->
    <router-view></router-view>
  </div>
</template>

<script>
// js 配置
import { getSingerList } from "api/singer";
import { ERR_OK } from "config/commonParams";
import Singer from "config/singer";
import { mapMutations } from "vuex";
import { playlistMixn } from "config/mixin";
// 组件
import ListView from "base/list-view/list-view";

const HOT_NAME = "热门";
const HOT_SINGER_LEN = 10;

export default {
  mixins: [playlistMixn],
  data() {
    return {
      singers: [],
    };
  },
  components: {
    ListView,
  },
  created() {
    this._getSingerList();
  },
  methods: {
    ...mapMutations(["SET_SINGER"]),
    //mini播放器高度适配
    handlPlaylist(playlist){
      const bottom = playlist.length > 0 ? '1.2rem' : '';

      this.$refs.singer.style.bottom = bottom;
      this.$refs.listView.refresh();
    },
    _getSingerList() {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.list);
        }
      });
    },
    // 接口数据处理
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: [],
        },
      };
      // 热门歌手和全部数据处理
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(
            new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name,
            })
          );
        }
        // 全部数据
        let key = item.Findex;
        if (!map[key]) {
          map[key] = {
            title: key,
            items: [],
          };
        }
        map[key].items.push(
          new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name,
          })
        );
      });
      // 处理map 得到有序列表
      let hot = [];
      let ret = [];

      for (let key in map) {
        let val = map[key];
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val);
        } else if (val.title === HOT_NAME) {
          hot.push(val);
        }
      }
      //排序ret
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return hot.concat(ret);
    },
    // list-view 派发的点击事件
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`,
      });
      this.SET_SINGER(singer);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "style/mixin.scss";
.singer {
  position: fixed;
  top: 1.76rem;
  width: 100%;
  bottom: 0;
}
</style>