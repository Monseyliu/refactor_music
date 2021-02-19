<template>
  <div class="search-list" v-show="searches.length">
    <transition-group name="list" tag="ul">
      <li @click="selectItem(item)" class="search-item" v-for="(item, index) of searches" :key="index">
        <span class="text">{{ item }}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    searches: {
      type: Array,
      default(){
          return []
      }
    },
  },
  methods: {
      selectItem(item){
          this.$emit("select", item)
      },
      deleteOne(item){
          this.$emit("deleteOne", item)
      }
  },
};
</script>

<style lang="scss" scoped>
@import "style/mixin.scss";

.search-list {
  .search-item {
    display: flex;
    align-items: center;
    height: 0.8rem;
    overflow: hidden;
    .text {
      flex: 1;
      color: $color-text-l;
    }
    .icon {
      @include ellipsis;
      .icon-delete {
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }
  }
}
//transition
.list-enter-active, .list-leave-active {
  transition: all .1s;
}
.list-enter, .list-leave-to {
  height: 0;
}
</style>