<template>
    <div class="home">
        <!-- 头部 -->
        <MyHeader />
        <!-- tabbar -->
        <TabBar />
        <!-- 展示区 -->
        <router-view></router-view>
    </div>
</template>

<script>
import MyHeader from "common/my-header/my-header";
import TabBar from "common/tab-bar/tab-bar"

export default {
    data(){
        return{}
    },
    components: {
        MyHeader,
        TabBar
    },
    methods:{}
}
</script>

<style lang="scss" scoped>
@import "style/mixin.scss";
.home{
    overflow: hidden;
}
</style>