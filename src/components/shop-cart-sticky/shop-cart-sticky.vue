<template>
    <div class="shop-cart-sticky" v-show="visible">
      <shop-cart
        ref="shopCart"
        :selectFoods="selectFoods"
        :deliveryPrice="deliveryPrice"
        :minPrice="minPrice"
        :fold="fold"
        :sticky="sticky"
      >
      </shop-cart>
    </div>
</template>

<script>
  import ShopCart from 'components/shop-cart/shop-cart'
  import popupMixin from 'common/mixins/popup'

  export default {
    name: 'shop-cart-sticky',
    mixins: [popupMixin],
    props: {
      selectFoods: {
        type: Array,
        default() {
          return []
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      },
      fold: {
        type: Boolean,
        default: false
      },
      sticky: {
        type: Boolean,
        default: false
      },
      list: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    methods: {
      drop(el) {
        this.$refs.shopCart.drop(el)
      }
    },
    components: {
      ShopCart
    }
  }
</script>

<style lang="stylus" scoped>
  .shop-cart-sticky
    position: absolute
    left: 0
    bottom: 0
    z-index: 999
    width: 100%
    height: 48px
    >>>.content
      background aquamarine


  /* .fade-enter-active{
     -webkit-transition: all 0s  ease-in-out
     -moz-transition: all 0s  ease-in-out
     -ms-transition: all 0s  ease-in-out
     -o-transition: all 0s  ease-in-out
     transition: all 0s  ease-in-out
   }
   .fade-leave-active{
     -webkit-transition: all 0s  ease-in-out .3s
     -moz-transition: all 0s  ease-in-out .3s
     -ms-transition: all 0s  ease-in-out .3s
     -o-transition: all 0s  ease-in-out .3s
     transition: all 0s  ease-in-out .3s
   }
   .fade-enter,.fade-leave-to{
     opacity: 0
   }*/
</style>
