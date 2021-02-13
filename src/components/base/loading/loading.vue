<template>
    <div class="loading">
        <img width="24" height="24" src="./loading.gif" alt="">
        <p class="title">{{title}}</p>
    </div>
</template>

<script>
export default {
   props:{
       title: {
           type: String,
           default: '正在载入...'
       }
   }
}
</script>

<style lang="scss" scoped>
@import "style/mixin.scss";
.loading{
    width: 100%;
    text-align: center;
    .title{
        line-height: .4rem;
        font-size: $font-size-small;
        color: $color-text-l;
    }
}

</style>