<template>
    <div class="shopcart">
      <div class="content" @click="toggleList" >
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight':totalCount>0}">
              <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
            </div>
            <div class="num" v-show="totalCount>0">
              <bubble :num="totalCount"></bubble>
            </div>
          </div>
          <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
          <p class="desc">另需配送费￥{{deliveryPrice}}元</p>
        </div>
        <div class="content-right" @click="pay">
          <div class="pay" :class="payClass">
            {{payDesc}}
          </div>
        </div>
      </div>

      <div class="ball-container">
        <!--balls有几个？balls的位置？？-->
        <div v-for="(ball,index) in balls" :key="index">
          <transition
            @before-enter="beforeDrop"
            @enter="dropping"
            @after-enter="afterDrop">
            <div class="ball" v-show="ball.show" >
              <div class="inner inner-hook">11</div>
            </div>
          </transition>
        </div>
      </div>
    </div>
</template>

<script>
  import Bubble from 'components/bubble/bubble'

  //下坠小球的数量
  const BALL_LEN = 10//为什么设置10个ball，因为如果只有一个小球，点击的时候可能很快，如果第一个小球的动画未完成再点击，就会影响视觉效果
  const innerClsHook = 'inner-hook'//小球的类名，注意：以为小球的运动是一个抛物线，所以需要给小球添加一个盒子，盒子做纵向运动，小球做横向运动，并且运动速度不一样，需要用到贝塞尔曲线

  //给这10个或者n个小球添加一个显示或者隐藏的标识{show:false},并且将这些小球的放到一个数组中
  function createBalls() {
    //balls代表每一个小球的标识，或者添加的数据
    let balls = [];
    for (let i = 0; i < BALL_LEN; i++) {
      balls.push({show: false})
    }
    return balls
  }

  export default {
    name: 'shop-cart',
    props: {
      selectFoods: {//加入购物车的所有食品
        type: Array,
        default() {
          return []
        }
      },
      deliveryPrice: {//运费，配送费
        type: Number,
        default: 0
      },
      minPrice: {//起送价格
        type: Number,
        default: 0
      },
      sticky: { // this.sticky 这个数据是做什么的？？用来判断是不是shop-cart-sticky组件
        type: Boolean,
        default: false
      },
      fold: {//用来控制是否显示cart-list组件
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        balls: createBalls(),//保存一系列小球的显示隐藏标识 将小球定位到下面购物车图片的位置
        listFold: this.fold,//控制购物车列表是否显示？？？？？？？？？？。
        // dropBalls :[]//用来保存正在下坠的小球，小球的效果是点击下坠，到一定位置后，消失
      }
    },
    created() {
      //dropBalls是什么？？//用来保存正在下坠的小球，小球的效果是点击下坠，到一定位置后，消失
      this.dropBalls = []//因为这个属性不需要加入响应是系统，所以不用放到data中
    },
    computed: {
      //总价格
      totalPrice() {
        let total = 0
        this.selectFoods.forEach((food) => {
          total += food.price * food.count
        })
        return total
      },
      //总数量
      totalCount() {
        let count = 0
        this.selectFoods.forEach((food) => {
          count += food.count
        })
        return count
      },
      //起送价格
      payDesc() {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}元起送`
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice
          return `还差￥${diff}元起送`
        } else {
          return '去结算'
        }
      },
      //到达起送价格之后的样式
      payClass() {
        if (!this.totalCount || this.totalPrice < this.minPrice) {
          return 'not-enough'
        } else {
          return 'enough'
        }
      }
    },
    methods: {
      pay(e) {
        if (this.totalPrice < this.minPrice) {
          return
        }
        this.$createDialog({
          title: '支付',
          content: `您需要支付${this.totalPrice}元`
        }).show()
        e.stopPropagation()
      },
      //小球的动画效果,动画时间是怎么控制的
      drop(el) {//el代表点击的dom元素，在函数执行的时候传参数
        // console.log(el);
        //点击按钮显示小球
        for (let i = 0; i < this.balls.length; i++) {
          const ball = this.balls[i]//依次获取小球中的{show：false}
          if (!ball.show) {//如果show是false，执行下面代码，如果是true就不执行下面代码，根据for循环，找到下一个索引i+1对应的数据，如果所有的数据都是true，就不执行，注意每一次点击都会从第一个数据来判断，0,1,2,3,4...
            ball.show = true //
            ball.el = el//依次将点击的dom元素放进小球
            // console.log(ball);//ball中保存的是对象的引用地址，这样就代表下面
            //创建一个中间层数组（在created(){}，之所以不放入data中，是因为他不需要响应式的，问题：如果放入data中会有什么不好的影响？耗费性能？这不废话吗？还有什么，详细点？）,将小球复制放到这里面，
            //注意：自始至终都只有那10个或者n个小球，不存在复制问题，只是把下坠的小球的引用地址放到了dropBalls数组中，目的是方便操作，区分下坠和不下坠的小球集合
            this.dropBalls.push(ball)//这些小球的生命周期就是：显示--下坠--消失
            //问：为什么不直接使用原数组，为什么要创建一个dropBalls
            return//这里的return有什么作用？？ 结束这一个循环. 这里return的用法非常的巧妙，之前是很少用到的，要多注意注意
          }
        }
      },
      beforeDrop(el) {
        //找到动画元素，也就是小球的“动画起始位置”
        // console.log("beforeDrop");
        //为什么选择最后一个，因为点击的添加按钮不止一个，ball除了包含show之外，还有点击的dom元素，这个dom元素，被添加到了数组末尾
        const ball = this.dropBalls[this.dropBalls.length - 1]
        const rect = ball.el.getBoundingClientRect()//返回元素的位置和大小
        const x = rect.left - 32
        const y = -(window.innerHeight - rect.top-22)

        el.style.display = '';
        el.style.transform = el.style.webkitTransform = `translate3d(0,${y}px,0)`

        const inner = el.getElementsByClassName(innerClsHook)[0]
        inner.style.transform = inner.style.webkitTransform = `translate3d(${x}px,0,0)`
      },
      dropping(el, done) {
        //移动到一个位置之后才执行动画，必须要进行重绘。在JS知识点中完成相关实例
        this._reflow = document.body.offsetHeight//触发浏览器的重绘，为什么要重绘？？有什么作用？
        //如果不触发这个，小球在动画结束位置出现，也就是beforeDrop函数貌似没有什么作用
        el.style.transform = el.style.webkitTransform = `translate3d(0,0,0)`//回到dom初始位置
        const inner = el.getElementsByClassName(innerClsHook)[0]
        inner.style.transform = inner.style.webkitTransform = `translate3d(0,0,0)`
        el.addEventListener('transitionend', done)//有什么作用
      },
      afterDrop(el) {
        const ball = this.dropBalls.shift()//动画执行完毕后删除dropBalls第一项
        /*这个ball是dropBalls中的show，为什么会改变balls中的ball.show？？？？？？？？？？
        因为dropBalls这个数组中保存的仅仅是，小球的引用地址，这样紧紧是删除这个数组中的引用地址，而不是真正的删除小球*/
        if (ball) {//shift删除数组中的第一项，并且返回这一项（是指引用地址）
          ball.show = false  //改变这一项，本质就是改变ball的数据
          el.style.display = 'none'
        }
      },
      //点击content，显示购物列表，
      toggleList() {
        //也可以在这里创建一个标识，控制是否执行下面的代码
        if (!this.listFold) {//如果this.listFold为false，执行下面代码
          if (!this.totalCount) {//如果购物车列表信息为空，不显示cart-list
            return
          }else{//如果购物车列表信息不为空，显示cart-list
            this.listFold = true//
            if(this.sticky===false){//this.sticky:判定是不是sticky组件
              this._showShopCartList()//调用shop-cart-list组件列表
              this._showShopCartSticky()
            }
          }
        } else {
          // console.log(222);
          this.listFold = false
          this._hideShopCartList()
        }
      },

      //通过register控制组件是否显示（是否加载），register这个文件的语法是cube-ui特有的，后续一定要搞明白了
      //显示购物车列表，组件
      _showShopCartList() {//调用cart-list组件api
        console.log(1);
        this.shopCartListComp = this.shopCartListComp || this.$createShopCartList({
          $props: {
            selectFoods: 'selectFoods'
          },
          $events: {
            //在这个标签上添加自定义事件，在子组件模板中可以通过this.$emit("hide")调用这个函数
            hide: () => {
              this.listFold = false//通过组件的隐藏事件更改这个值为初始值，这样才可以重新触发点击事件
              // this._hideShopCartSticky()//动画结束之后隐藏sticky  在这里隐藏动画效果会有问题
            },
            leave: () => {
              console.log('leave');
              this._hideShopCartSticky()//动画结束之后隐藏sticky
              /*//快速点击购物车图标，会创建多个cart-list-sticky和shop-cart-list元素，为什么
              //在上面hide执行此代码，就没有这个问题，但是会出现新的bug
              //做一个限制，在原来的shop-cart中可以调用api，在shop-cart-sticky不能掉用*/
            },

            add: (el) => {
              //执行小球动画
              this.shopCartStickyComp.drop(el)
            }
          }
        });
        this.shopCartListComp.show()//显示这个组件
      },
      _hideShopCartList() {
        const list = this.sticky ? this.$parent.list : this.shopCartListComp
        //this.$parent代表什么？？
        list.hide && list.hide()
        // console.log(this);//shop-cart
        // console.log(this.$parent);//shop-cart-sticky
        console.log(2);
      },

      _showShopCartSticky() {
        this.shopCartStickyComp = this.shopCartStickyComp || this.$createShopCartSticky({
          $props: {
            selectFoods: 'selectFoods',
            deliveryPrice: 'deliveryPrice',
            minPrice: 'minPrice',
            fold: 'listFold',
            sticky: true,
            list: this.shopCartListComp,
          }
        })
        this.shopCartStickyComp.show()
      },
      _hideShopCartSticky() {
        this.shopCartStickyComp.hide()
      }
    },
    watch: {
      // 为什么要监听这个有什么用？？ 维护点击事件
      //监听sticky中子组件shop-cart中的folo
      fold(newVal) {
        this.listFold = newVal
      },

      //监听totalCount，如果totalCount变为0，隐藏cart-list
      totalCount(count) {
        if (this.fold && count === 0) {
          this._hideShopCartList()
        }
      }
    },
    components: {
      Bubble
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/mixin"
  @import "~common/stylus/variable"

  .shopcart
    height: 100%
    .content
      display: flex
      background: $color-background
      font-size: 0
      color: $color-light-grey
      .content-left
        flex: 1
        display flex
        .logo-wrapper
          display: inline-block
          vertical-align: top
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          border-radius: 50%
          background: $color-background
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
            background: $color-dark-grey
            &.highlight
              background: $color-blue
            .icon-shopping_cart
              line-height: 44px
              font-size: $fontsize-large-xxx
              color: $color-light-grey
              &.highlight
                color: $color-white
          .num
            position: absolute
            top: 0
            right: 0
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          line-height: 24px
          padding-right: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-weight: 700
          font-size: $fontsize-large
          &.highlight
            color: $color-white
        .desc
          display: inline-block
          /*vertical-align: top*/
          margin: 5px
          word-break:break-all
          line-height: 38px
          font-size: $fontsize-small-s
      .content-right
        /*flex: 0 0 105px*/
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-weight: 700
          font-size: $fontsize-small
          &.not-enough
            background: $color-dark-grey
          &.enough
            background: $color-green
            color: $color-white
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        width:30px
        height:30px
        background :red
        transition: all .5s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: $color-blue
          transition: all .5s linear
</style>
