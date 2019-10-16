import { get } from './helpers'
//获取卖家信息的接口
const getSeller = get('api/seller');
const getGoods = get('api/goods');//获取商家商品信息
const getRatings = get('api/ratings');//获取评论信息

export {
  getSeller,
  getGoods,
  getRatings
}
