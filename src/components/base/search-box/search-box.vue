<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="query" type="text" class="box" v-model="query" :placeholder="placeholder" />
    <i class="icon-dismiss" v-show="query" @click="clear"></i>
  </div>
</template>

<script>
import { debounce } from "config/util";

export default {
  data() {
    return {
      query: "",
    };
  },
  props: {
    placeholder: {
      type: String,
      default: "搜索歌曲,歌手",
    },
  },
  created() {
    this.$watch(
      "query",
      debounce((newQuery) => {
        this.$emit("query", newQuery);
      }, 200)
    );
  },
  methods: {
    clear() {
      this.query = "";
    },
    setQuery(query) {
      this.query = query;
    },
    blur(){
        this.$refs.query.blur();
    }
  },
};
</script>

<style lang="scss" scoped>
@import "style/mixin.scss";

.search-box {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 0.12rem;
  height: 0.8rem;
  background: $color-highlight-background;
  border-radius: 0.12rem;
  .icon-search {
    font-size: 24px;
    color: $color-background;
  }
  .box {
    flex: 1;
    margin: 0 0.1rem;
    line-height: 0.36rem;
    background: $color-highlight-background;
    color: $color-text;
    font-size: $font-size-medium;
    outline: 0;
    &::placeholder {
      color: $color-text-d;
    }
  }
  .icon-dismiss {
    font-size: 16px;
    color: $color-background;
  }
}
</style>