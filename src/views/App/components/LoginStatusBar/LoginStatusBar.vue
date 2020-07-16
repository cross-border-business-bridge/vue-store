<template>
    <div class="LoginStatusBar">
        <!-- 顶部导航栏 -->
        <div class="topbar">
            <div class="nav">
                <ul>
                    <li v-if="!this.$store.getters.getUser">
                        <el-button type="text" @click="login">登录</el-button>
                        <span class="sep">|</span>
                        <el-button type="text" @click="register = true">注册</el-button>
                    </li>
                    <li v-else>
                        欢迎
                        <el-popover placement="top" width="180" v-model="visible">
                            <p>确定退出登录吗？</p>
                            <div style="text-align: right; margin: 10px 0 0">
                                <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                                <el-button type="primary" size="mini" @click="logout">确定</el-button>
                            </div>
                            <el-button type="text" slot="reference">{{this.$store.getters.getUser.userName}}</el-button>
                        </el-popover>
                    </li>
                    <li>
                        <router-link to="/order">我的订单</router-link>
                    </li>
                    <li>
                        <router-link to="/collect">我的收藏</router-link>
                    </li>
                    <li :class="getNum > 0 ? 'shopCart-full' : 'shopCart'">
                        <router-link to="/shoppingCart">
                            <i class="el-icon-shopping-cart-full"></i> 购物车
                            <span class="num">({{getNum}})</span>
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
        <!-- 顶部导航栏END -->

        <!-- 登录模块 -->
        <MyLogin></MyLogin>
        <!-- 注册模块 -->
        <MyRegister :register="register" @fromChild="isRegister"></MyRegister>
    </div>
</template>

<script>
    // import Vuex from 'vuex';
    import {mapActions, mapGetters} from "vuex";

    export default {
        props: {},
        data() {
            return {
                // userName: '',
            };
        },
        watch: {
            // 获取vuex的登录状态
            getUser: function (val) {
                if (val === "") {
                    // 用户没有登录
                    this.setCart([]);
                } else {
                    // 用户已经登录,获取该用户的购物车信息
                    this.$axios
                        .post("/api/user/shoppingCart/getShoppingCart", {
                            user_id: val.user_id
                        })
                        .then(res => {
                            if (res.data.code === "001") {
                                // 001 为成功, 更新vuex购物车状态
                                this.setCart(res.data.shoppingCartData);
                            } else {
                                // 提示失败信息
                                this.notifyError(res.data.msg);
                            }
                        })
                        .catch(err => {
                            return Promise.reject(err);
                        });
                }
            }
        },
        computed: {
            ...mapGetters(["getUser", "getNum"])
        },
        methods: {
            ...mapActions(["setUser", "setShowLogin", "setShoppingCart"]),
            login() {
                // 点击登录按钮, 通过更改vuex的showLogin值显示登录组件
                this.setShowLogin(true);
            },
            // 退出登录
            logout() {
                this.visible = false;
                // 清空本地登录信息
                localStorage.setItem("user", "");
                // 清空vuex登录信息
                this.setUser("");
                this.notifySucceed("成功退出登录");
            },
            // 接收注册子组件传过来的数据
            isRegister(val) {
                this.register = val;
            },
        },
        created() {
            // 获取浏览器localStorage，判断用户是否已经登录
            if (localStorage.getItem("user")) {
                // 如果已经登录，设置vuex登录状态
                this.setUser(JSON.parse(localStorage.getItem("user")));
            }
        },
        mounted() {
            // fetch user info

        }
    };
</script>

<style lang="less" scoped>
    /* 全局CSS */
    * {
        padding: 0;
        margin: 0;
        border: 0;
        list-style: none;
    }

    #app .el-header {
        padding: 0;
    }

    #app .el-main {
        min-height: 300px;
        padding: 20px 0;
    }

    #app .el-footer {
        padding: 0;
    }

    a,
    a:hover {
        text-decoration: none;
    }

    /* 全局CSS END */

    /* 顶部导航栏CSS */
    .topbar {
        height: 40px;
        background-color: #3d3d3d;
        margin-bottom: 20px;
    }

    .topbar .nav {
        width: 1225px;
        margin: 0 auto;
    }

    .topbar .nav ul {
        float: right;
    }

    .topbar .nav li {
        float: left;
        height: 40px;
        color: #b0b0b0;
        font-size: 14px;
        text-align: center;
        line-height: 40px;
        margin-left: 20px;
    }

    .topbar .nav .sep {
        color: #b0b0b0;
        font-size: 12px;
        margin: 0 5px;
    }

    .topbar .nav li .el-button {
        color: #b0b0b0;
    }

    .topbar .nav .el-button:hover {
        color: #fff;
    }

    .topbar .nav li a {
        color: #b0b0b0;
    }

    .topbar .nav a:hover {
        color: #fff;
    }

    .topbar .nav .shopCart {
        width: 120px;
        background: #424242;
    }

    .topbar .nav .shopCart:hover {
        background: #fff;
    }

    .topbar .nav .shopCart:hover a {
        color: #ff6700;
    }

    .topbar .nav .shopCart-full {
        width: 120px;
        background: #ff6700;
    }

    .topbar .nav .shopCart-full a {
        color: white;
    }

    /* 顶部导航栏CSS END */

</style>
