/*
 * @Description: 购物车状态模块
 * @Author: hai-27
 * @Date: 2020-02-21 18:40:41
 * @LastEditors: hai-27
 * @LastEditTime: 2020-03-07 20:38:55
 *
 * Something like model to handle all data management.
 */
export default {
  state: {
    goods: []
    // Cart结构
    /*
    goods = {
      id: "", // 购物车id
      productID: "", // 商品id
      productName: "", // 商品名称
      productImg: "", // 商品图片
      price: "", // 商品价格
      num: "", // 商品数量
      maxNum: "", // 商品限购数量
      check: false // 是否勾选
    } */
  },
  getters: {
    getCart (state) {
      // 获取购物车状态
      return state.goods;
    },
    getNum (state) {
      // 购物车商品总数量
      let totalNum = 0;
      // for (let i = 0; i < state.goods.length; i++) {
      //   const temp = state.goods[i];
      //   totalNum += temp.num;
      // }

      state.goods.forEach(({num}) => totalNum += num);

      return totalNum;
    },
    getIsAllCheck (state) {
      // 判断是否全选
      /*
      let isAllCheck = true;
      for (let i = 0; i < state.goods.length; i++) {
        const temp = state.goods[i];
        // 只要有一个商品没有勾选立即return false;
        if (!temp.check) {
          isAllCheck = false;
          return isAllCheck;
        }
      }
      return isAllCheck;
      */
      return state.goods.every(({check}) => check);
    },
    getCheckgoods (state) {
      // 获取勾选的商品信息
      // 用于确认订单页面
      // let checkgoods = [];
      // for (let i = 0; i < state.goods.length; i++) {
      //   const temp = state.goods[i];
      //   if (temp.check) {
      //     checkgoods.push(temp);
      //   }
      // }
      // return checkgoods;

      return state.goods.filter(({check}) => check);

    },
    getCheckNum (state) {
      // 获取购物车勾选的商品数量
      // let totalNum = 0;
      // for (let i = 0; i < state.goods.length; i++) {
      //   const temp = state.goods[i];
      //   if (temp.check) {
      //     totalNum += temp.num;
      //   }
      // }
      //
      // return totalNum;

      return this.getNum(this.getCheckgoods(state));
    },
    getTotalPrice (state) {
      // 购物车勾选的商品总价格
      let totalPrice = 0;
      // for (let i = 0; i < state.goods.length; i++) {
      //   const temp = state.goods[i];
      //   if (temp.check) {
      //     totalPrice += temp.price * temp.num;
      //   }
      // }

      this.getCheckgoods(state).forEach(({price, num}) => totalPrice += price * num);

      return totalPrice;
    }
  },
  mutations: {
    setCart (state, data) {
      // 设置购物车状态
      state.goods = data;
    },
    unshiftCart (state, data) {
      // 添加购物车
      // 用于在商品详情页点击添加购物车,后台添加成功后，更新vuex状态
      state.goods.unshift(data);
    },
    updateCart (state, payload) {
      // 更新购物车
      // 可更新商品数量和是否勾选
      // 用于购物车点击勾选及加减商品数量
      if (payload.prop == "num") {
        // 判断效果的商品数量是否大于限购数量或小于1
        if (state.goods[payload.key].maxNum < payload.val) {
          return;
        }
        if (payload.val < 1) {
          return;
        }
      }
      // 根据商品在购物车的数组的索引和属性更改
      state.goods[payload.key][payload.prop] = payload.val;
    },
    addCartNum (state, productID) {
      // 增加购物车商品数量
      console.log(`addCartNum`);
      // 用于在商品详情页点击添加购物车,后台返回002，“该商品已在购物车，数量 +1”，更新vuex的商品数量
      for (let i = 0; i < state.goods.length; i++) {
        const temp = state.goods[i];
        if (temp.productID == productID) {
          if (temp.num < temp.maxNum) {
            temp.num++;
          }
        }
      }

      // state.goods.filter(good => good.productID === productID)
    },
    deleteCart (state, id) {
      // 根据购物车id删除购物车商品
      for (let i = 0; i < state.goods.length; i++) {
        const temp = state.goods[i];
        if (temp.id == id) {
          state.goods.splice(i, 1);
        }
      }
    },
    checkAll (state, data) {
      // 点击全选按钮，更改每个商品的勾选状态
      // for (let i = 0; i < state.goods.length; i++) {
      //   state.goods[i].check = data;
      // }
      state.goods.map((cart) => cart.check = data);
    }
  },
  actions: {
    setCart ({ commit }, data) {
      commit('setCart', data);
    },
    unshiftCart ({ commit }, data) {
      commit('unshiftCart', data);
    },
    updateCart ({ commit }, payload) {
      commit('updateCart', payload);
    },
    addCartNum ({ commit }, productID) {
      commit('addCartNum', productID);
    },
    deleteCart ({ commit }, id) {
      commit('deleteCart', id);
    },
    checkAll ({ commit }, data) {
      commit('checkAll', data);
    }
  }
}
