<template>
  <div class="goods">
    <div class="scroll-nav-wrapper">
      <cube-scroll-nav
        :side=true
        :data="goods"
        :options="scrollOptions"
        v-if="goods.length"
      >
        <template slot="bar" slot-scope="props">
          <cube-scroll-nav-bar
            direction="vertical"
            :labels="props.labels"
            :txts="barTxts"
            :current="props.current"
          >
            <template slot-scope="props">
              <div class="text">
                <support-ico
                  v-if="props.txt.type>=1"
                  :size=3
                  :type="props.txt.type"
                ></support-ico>
                <span>{{props.txt.name}}</span>
                <span class="num" v-if="props.txt.count">
                  <bubble :num="props.txt.count"></bubble>
                </span>
              </div>
            </template>
          </cube-scroll-nav-bar>
        </template>

        <cube-scroll-nav-panel
          v-for="good in goods"
          :key="good.name"
          :label="good.name"
          :title="good.name"
        >
          <ul>
            <li
              v-for="food in good.foods"
              :key="food.name"
              class="food-item"
              @click="selectFood(food)"
            >
              <div class="icon">
                <img width="57" height="57" :src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span>
                  <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cart-control-wrapper">
                  <cart-control @add="onAdd" :food="food"></cart-control>
                </div>

              </div>
            </li>
          </ul>
        </cube-scroll-nav-panel>
      </cube-scroll-nav>
    </div>
    <div class="shop-cart-wrapper">
      <shop-cart
        ref="shopCart"
        :select-foods="selectFoods"
        :delivery-price="seller.deliveryPrice"
        :min-price="seller.minPrice"></shop-cart>
    </div>
    <!--<food :food="selectedFood" ref="food"></food>-->
  </div>
</template>

<script>
  import {getGoods} from 'api'
  //引入的子组件
  import ShopCart from 'components/shop-cart/shop-cart'
   import CartControl from 'components/cart-control/cart-control'
  // import Food from 'components/food/food'

  import SupportIco from 'components/support-ico/support-ico'
  import Bubble from 'components/bubble/bubble'


  export default {
    name: 'goods',
    props: {
      data: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        goods: [],
        scrollOptions: {
          click: false,
          directionLockThreshold: 0
        },
        selectedFood: {},
      }
    },
    computed: {
      seller() {
        return this.data.seller
      },
      //保存了食品种类名称和数量以及type（type是给support-icon使用的）
      barTxts() {
        let ret = []
        this.goods.forEach((good) => {
          const {type, name, foods} = good
          let count = 0
          foods.forEach((food) => {
            count += food.count || 0
          })
          ret.push({
            type,
            name,
            count
          })
        })
        return ret
      },
      //被添加值购物车的食品信息
      //selectFoods就是：食品信息中count>0,将食品放进这个对象中、
      //将这个数据，放到购物车组件的中的购物车组件，在组建中获取食品数量
      selectFoods() {
        let foods = []
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food)
            }
          })
        })
        return foods
      },
    },
    methods: {
      selectFood(food) {
        this.selectedFood = food
        // this.$refs.food.show()
        this._showFood()
        this._showShopCartSticky()
      },
      _showFood() {
        this.foodComp = this.foodComp || this.$createFood({
          $props: {
            food: 'selectedFood'
          },
          $events: {
            add: (target) => {
              this.shopCartStickyComp.drop(target)
            },
            leave: () => {
              this._hideShopCartSticky()
            }
          }
        })
        this.foodComp.show()
      },
      fetch() {
        //获取商品信息，在这里获取商品信息，然后从这里传送给这里的子组件
        getGoods().then((goods) => {
          this.goods = goods
        })
      },
      onAdd(target) {
        // console.log("onAdd");
        this.$refs.shopCart.drop(target)//驱动shop-cart组件中的小球下坠动画
      },

      _showShopCartSticky() {
        this.shopCartStickyComp = this.shopCartStickyComp || this.$createShopCartSticky({
          $props: {
            selectFoods: 'selectFoods',
            deliveryPrice: this.seller.deliveryPrice,
            minPrice: this.seller.minPrice,
            fold: false,
            sticky:false
      }
        })
        this.shopCartStickyComp.show()
      },
      _hideShopCartSticky() {
        this.shopCartStickyComp.hide()
      }



    },

    components: {
      Bubble,
      SupportIco,
      ShopCart,
      CartControl,
      // Food
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/mixin"
  @import "~common/stylus/variable"
  .goods
    position: relative
    text-align: left
    height: 100%

    .scroll-nav-wrapper
      position: absolute
      width: 100%
      top: 0
      left: 0
      bottom: 48px

    >>> .cube-scroll-nav-bar
      width: 80px
      white-space: normal
      overflow: hidden

    >>> .cube-scroll-nav-bar-item
      padding: 0 10px
      display: flex
      align-items: center
      height: 56px
      line-height: 14px
      font-size: $fontsize-small
      background: $color-background-ssss

      .text
        flex: 1
        position: relative

      .num
        position: absolute
        right: -8px
        top: -10px

      .support-ico
        display: inline-block
        vertical-align: top
        margin-right: 4px

    >>> .cube-scroll-nav-bar-item_active
      background: $color-white
      color: $color-dark-grey

    >>> .cube-scroll-nav-panel-title
      padding-left: 14px
      height: 26px
      line-height: 26px
      border-left: 2px solid $color-col-line
      font-size: $fontsize-small
      color: $color-grey
      background: $color-background-ssss

    .food-item
      display: flex
      margin: 18px
      padding-bottom: 18px
      position: relative

      &:last-child
        border-none()
        margin-bottom: 0

      .icon
        flex: 0 0 57px
        margin-right: 10px

        img
          height: auto

      .content
        flex: 1

        .name
          margin: 2px 0 8px 0
          height: 14px
          line-height: 14px
          font-size: $fontsize-medium
          color: $color-dark-grey

        .desc, .extra
          line-height: 10px
          font-size: $fontsize-small-s
          color: $color-light-grey

        .desc
          line-height: 12px
          margin-bottom: 8px

        .extra
          .count
            margin-right: 12px

        .price
          font-weight: 700
          line-height: 24px

          .now
            margin-right: 8px
            font-size: $fontsize-medium
            color: $color-red

          .old
            text-decoration: line-through
            font-size: $fontsize-small-s
            color: $color-light-grey

      .cart-control-wrapper
        position: absolute
        right: 0
        bottom: 12px

    .shop-cart-wrapper
      position: absolute
      left: 0
      bottom: 0
      z-index: 50
      width: 100%
      height: 48px
</style>
