<template>
    <div class="Header">
        <!--<pre v-text="$attrs"/>-->
        <!-- 顶栏容器 -->
        <el-header>
            <el-menu
                    :default-active="activeIndex"
                    class="el-menu-demo"
                    mode="horizontal"
                    active-text-color="#409eff"
                    router
            >
                <div class="logo">
                    <router-link to="/">
                        <img src="./assets/imgs/logo.png" alt />
                    </router-link>
                </div>
                <el-menu-item index="/">首页</el-menu-item>
                <el-menu-item index="/goods">全部商品</el-menu-item>
                <el-menu-item index="/about">关于我们</el-menu-item>

                <div class="so">
                    <el-input placeholder="请输入搜索内容" v-model="search">
                        <el-button slot="append" icon="el-icon-search" @click="searchClick"></el-button>
                    </el-input>
                </div>
            </el-menu>
        </el-header>
        <!-- 顶栏容器END -->
    </div>
</template>

<script>
    export default {
        props: {
        },
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
            getUser: function(val) {
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
                    this.$router.push({ path: "/goods", query: { search: this.search } });
                    this.search = "";
                }
            }
        }
    };
</script>
