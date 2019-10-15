<template>
  <!--这个组件是由register文件引入的，通过main引入了app组建中-->
  <transition name="fade">
    <!--<div v-show="visible" class="header-detail" @touchmove.stop.prevent>-->
    <div v-show="visible" class="header-detail">
      <!-- @touchmove.stop.prevent:为什么要这样设置？如果公告或者这个页面的内容过多，是屏幕容不下，就只能通过滑动页面来，查看更多内容，这样设置会不会更加不方便，在这里暂时删除，可是如果占用过多的话，这样布局还是有问题，因为有些用户可能没有耐心看完整个页面，所以将关闭按钮换到合适的位置，要不然就对数据内容进行设置，最好不要超过屏幕区域-->
        <div class="detail-wrapper clear-fix">
          <!--clear-fix删除之后貌似也一样，这里为什么需要清浮动-->
          <div class="detail-main">
            <h1 class="name">{{seller.name}}</h1>
            <div class="star-wrapper">
              <star :size="48" :score="seller.score"></star>
            </div>
            <div class="title">
              <div class="line"></div>
              <div class="text">优惠信息</div>
              <div class="line"></div>
            </div>
            <ul v-if="seller.supports" class="supports">
              <li class="support-item" v-for="(item,index) in seller.supports" :key="item.id">
                <support-ico :size=2 :type="seller.supports[index].type"></support-ico>
                <span class="text">{{seller.supports[index].description}}</span>
              </li>
            </ul>
            <div class="title">
              <div class="line"></div>
              <div class="text">商家公告</div>
              <div class="line"></div>
            </div>
            <div class="bulletin">
              <p class="content">{{seller.bulletin}}</p>
            </div>
          </div>
        </div>
        <div class="detail-close" @click="hide">
          <i class="icon-close"></i>
        </div>
    </div>
  </transition>
</template>

<script>
  // import popupMixin from 'common/mixins/popup'
  import Star from 'components/star/star'
  import SupportIco from 'components/support-ico/support-ico'

  export default {
    name: 'header-detail',
    // mixins: [popupMixin],
    props: {
      seller: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        visible: false
      }
    },
    methods: {
      show () {
        this.visible = true
      },
      hide () {
        this.visible = false
      }
    },
    components: {
      SupportIco,
      Star
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/mixin"
  @import "~common/stylus/variable"

  .header-detail
    /*为什么这个页面鼠标滑动不能滚动页面，只有使用滚轮才可以，之前没有碰上过这样的问题*/
    position: fixed
    z-index: 100
    top: 0
    left: 0
    width: 100%
    height: 100%
    overflow: auto
    backdrop-filter: blur(10px) /*貌似是第二次看到这个属性，什么意思？*/
    opacity: 1 /*为什么是1*/
    color: $color-white
    background: $color-background-s
    /*动画效果*/

    &.fade-enter-active, &.fade-leave-active
      transition: all 0.5s

    &.fade-enter, &.fade-leave-active
      opacity: 0
      background: $color-background

    .detail-wrapper
      display: inline-block
      width: 100%
      min-height: 100%

      .detail-main
        margin: 64px 0
        /*margin-top: 64px */
        /*padding-bottom: 64px*//*这里为什么不设置为margin-bottom*/

        .name
          line-height: 16px
          text-align: center
          font-size: $fontsize-large /*16*/
          font-weight: 700

        .star-wrapper
          margin-top: 18px
          /*padding: 2px 0*/
          text-align: center

        .title
          display: flex
          width: 80%
          margin: 28px auto 24px auto

          .line
            flex: 1
            position: relative
            top: -6px
            border-bottom: 1px solid rgba(255, 255, 255, 0.2)

          .text
            padding: 0 12px
            font-weight: 700
            font-size: $fontsize-medium

        /*14px*/

        .supports
          width: 80%
          margin: 0 auto

          .support-item
            display: flex
            align-items: center
            padding: 0 12px
            margin-bottom: 12px

            &:last-child
              margin-bottom: 0

            .support-ico
              margin-right: 6px

            .text
              line-height: 16px
              font-size: $fontsize-small

        .bulletin
          width: 80%
          margin: 0 auto

          .content
            /*默认会换行*/
            /*问题：如果公告过多会不会产生问题*/
            padding: 0 12px
            line-height: 24px /*行高24px*/
            font-size: $fontsize-small

    /*12px*/

    .detail-close
      position: relative
      width: 30px
      height: 30px
      margin: -64px auto 0 auto
      clear: both
      font-size: $fontsize-large-xxxx
</style>
