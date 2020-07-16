<!--
 * @Description: 项目根组件
 * @Author: hai-27
 * @Date: 2020-02-07 16:23:00
 * @LastEditors: hai-27
 * @LastEditTime: 2020-04-05 13:14:48
 -->
<template>
    <div>
        <el-container>
            <LoginStatusBar/>
            <Header/>



            <!-- 主要区域容器 -->
            <el-main>
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
            </el-main>
            <!-- 主要区域容器END -->


        </el-container>
    </div>
</template>

<script>
    import {mapActions} from "vuex";
    import {mapGetters} from "vuex";
    import Footer from "./components/Footer/Footer";
    import LoginStatusBar from "./components/LoginStatusBar/LoginStatusBar";
    import Header from "./components/Header/Header";

    export default {
        beforeUpdate() {
            this.activeIndex = this.$route.path;
        },
        data() {
            return {
                activeIndex: "", // 头部导航栏选中的标签
                search: "", // 搜索条件
                register: false, // 是否显示注册组件
                visible: false // 是否退出登录
            };
        },
        components: {
            LoginStatusBar,
            Header,
            Footer,
        },
        created() {
            // 获取浏览器localStorage，判断用户是否已经登录
            if (localStorage.getItem("user")) {
                // 如果已经登录，设置vuex登录状态
                this.setUser(JSON.parse(localStorage.getItem("user")));
            }
            /* window.setTimeout(() => {
              this.$message({
                duration: 0,
                showClose: true,
                message: `
                <p>如果觉得这个项目还不错，</p>
                <p style="padding:10px 0">您可以给项目源代码仓库点Star支持一下，谢谢！</p>
                <p><a href="https://github.com/hai-27/vue-store" target="_blank">Github传送门</a></p>`,
                dangerouslyUseHTMLString: true,
                type: "success"
              });
            }, 1000 * 60); */
        },
        computed: {
            ...mapGetters(["getUser", "getNum"])
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
            // 点击搜索按钮
            searchClick() {
                if (this.search != "") {
                    // 跳转到全部商品页面,并传递搜索条件
                    this.$router.push({path: "/goods", query: {search: this.search}});
                    this.search = "";
                }
            }
        }
    };
</script>

<style>
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

    /* 顶栏容器CSS */
    .el-header .el-menu {
        max-width: 1225px;
        margin: 0 auto;
    }

    .el-header .logo {
        height: 60px;
        width: 189px;
        float: left;
        margin-right: 100px;
    }

    .el-header .so {
        margin-top: 10px;
        width: 300px;
        float: right;
    }

    /* 顶栏容器CSS END */

    /* 底栏容器CSS */
    .footer {
        width: 100%;
        text-align: center;
        background: #2f2f2f;
        padding-bottom: 20px;
    }

    .footer .ng-promise-box {
        border-bottom: 1px solid #3d3d3d;
        line-height: 145px;
    }

    .footer .ng-promise-box {
        margin: 0 auto;
        border-bottom: 1px solid #3d3d3d;
        line-height: 145px;
    }

    .footer .ng-promise-box .ng-promise p a {
        color: #fff;
        font-size: 20px;
        margin-right: 210px;
        padding-left: 44px;
        height: 40px;
        display: inline-block;
        line-height: 40px;
        text-decoration: none;
        background: url("./assets/imgs/us-icon.png") no-repeat left 0;
    }

    .footer .github {
        height: 50px;
        line-height: 50px;
        margin-top: 20px;
    }

    .footer .github .github-but {
        width: 50px;
        height: 50px;
        margin: 0 auto;
        background: url("./assets/imgs/github.png") no-repeat;
    }

    .footer .mod_help {
        text-align: center;
        color: #888888;
    }

    .footer .mod_help p {
        margin: 20px 0 16px 0;
    }

    .footer .mod_help p a {
        color: #888888;
        text-decoration: none;
    }

    .footer .mod_help p a:hover {
        color: #fff;
    }

    .footer .mod_help p span {
        padding: 0 22px;
    }

    /* 底栏容器CSS END */
</style>
