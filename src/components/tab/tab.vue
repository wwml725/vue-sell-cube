<template>
  <div class="tab">
    <cube-tab-bar
      :useTransition=false
      :showSlider=true
      v-model="selectedLabel"
      :data="tabs"
      ref="tabBar"
      class="border-bottom-1px"
    >
      <!--
        :useTransition=false  ：  下面的下划线是否需要过度
        :showSlider=true    ：  是否需要下划线
      -->

    </cube-tab-bar>

    <div class="slide-wrapper">
      <cube-slide
        :loop="false"
        :auto-play="false"
        :show-dots="false"
        :initial-index="index"
        @change="onChange"
        :options="slideOptions"
        @scroll="onScroll"
        ref="slide">
        <cube-slide-item v-for="(tab,index) in tabs" :key="index">
          <!--<component ref="component" :is="tab.component" :data="tab.data"></component>-->
          <component ref="component" :is="tab.component" :data="tab.data"></component>
        </cube-slide-item>
      </cube-slide>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'tab',
    props: {
      tabs: {
        type: Array,
        default () {
          return []
        }
      },
      initialIndex: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        index: this.initialIndex,
        slideOptions: {
          listenScroll: true,
          probeType: 3,
          directionLockThreshold: 0
        }
      }
    },
    computed: {
      selectedLabel: {
        get () {
          return this.tabs[this.index].label
        },
        set (newVal) {
          this.index = this.tabs.findIndex((value) => {
            return value.label === newVal
          })
        }
      }
    },
    mounted () {
      this.onChange(this.index)
    },
    methods: {
      onScroll(pos) {
        const tabBarWidth = this.$refs.tabBar.$el.clientWidth
        const slideWidth = this.$refs.slide.slide.scrollerWidth
        const transform = -pos.x / slideWidth * tabBarWidth
        this.$refs.tabBar.setSliderTransform(transform)
      },
      onChange(current) {
        this.index = current
        // console.log(this.$refs);
        const instance = this.$refs.component[current]
        if (instance && instance.fetch) {
          instance.fetch()
        }
      }
    },
    components: {

    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .tab
    display: flex
    flex-direction: column
    height: 100%

    >>> .cube-tab    /*>>>表示增加权重 vue-loader*/
      padding: 10px 0

    .slide-wrapper
      flex: 1
      overflow: hidden
</style>
