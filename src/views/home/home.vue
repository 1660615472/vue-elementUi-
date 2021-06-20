<template>
  <div class="home">
    <el-container class="home-container">
      <!-- 顶部导航 -->
      <el-header class="el-header" style="height: 50px">
        <div class="el-image">
          <img src="~assets/img/honghu.jpg" width="30" height="30" alt="" />
          <span>鸿鹄后台管理系统</span>
        </div>
        <button type="primary" @click="loginOut">退出</button>
      </el-header>

      <el-container>
        <el-aside class="el-aside" :width="isCollapse ? '64px' : '155px'">
          <!-- 收起导航栏按钮 -->
          <div
            style="color: #fff; background: rgb(74, 80, 100); cursor: pointer"
            @click="changeCollapse"
          >
            |||
          </div>
          <!-- 左侧导航菜单 -->
          <!-- default-active="2" 当前激活菜单的index值  是为了浏览器刷新后，仍然可以定位到之前选中的路由。-->
          <el-menu
            :default-active="currentActivePath"
            class="el-menu-vertical-demo"
            background-color="rgb(51, 55, 68)"
            text-color="white"
            active-text-color="#ffd04b"
            :unique-opened="true"
            :router="true"
            :collapse="isCollapse"
            :collapse-transition="false"
           
          >
            <!-- 一级导航 -->
            <el-submenu
              :index="item.id + ''"
              v-for="item in menuList"
              :key="item.id"
            >
              <template slot="title">
                <i :class="objIcon[item.id]"></i>
                <span>{{ item.authName }}</span>
              </template>
              <!-- 二级导航 -->
              <!-- changeActive这个事件用来存储当前选中的子菜单路径，给default-active属性使用 -->
              <el-menu-item
                :index="childrenItem.path"
                v-for="childrenItem in item.children"
                :key="childrenItem.id"
                @click="changeActive(childrenItem.path)"
              >
                <i class="el-icon-menu"></i>
                <span slot="title">{{ childrenItem.authName }}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 底部软件信息 -->
        <el-container>
          <!-- main -->
          <el-main class="el-main">
            <router-view></router-view>
          </el-main>
          <el-footer class="el-footer" style="height: 28px"
            >昆山鸿鹄信息技术服务有限公司 | v1.1.73 |</el-footer
          >
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { getMenuList } from "network/menu/menu.js";
export default {
  name: "Home",
  data() {
    return {
      menuList: [],
      isCollapse: false,
      //当前选中菜单路径
      currentActivePath:'',
      //icon图标列表
      objIcon: {
        125: "iconfont icon-icon_user",
        103: "iconfont icon-shangpin",
        101: "iconfont icon-danju",
        102: "iconfont icon-tijikongjian",
        145: "iconfont icon-baobiao",
      },
    };
  },
  methods: {
    loginOut() {
      window.sessionStorage.removeItem("token");
      this.$router.push("/login");
    },
    getMenuList() {
      getMenuList().then((res) => {
        console.log(res);
        if (res.data.meta.status !== 200) this.$message.error("请求导航栏失败");
        this.menuList = res.data.data;
      });
    },
    changeCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    //用来存储当前选中的子菜单路径，给default-active属性使用 使栏位高亮显示
    changeActive(childrenItem){
      window.localStorage.setItem('activePath',childrenItem)
      this.currentActivePath = childrenItem;
    }
  },
  computed: {
    /* defaultActive() {
      return "/" + this.$route.path.split("/").reverse()[0];
    }, */
  },
  created() {
    this.getMenuList();
    //从localStorage中拿到当前选中的子标题栏
    this.currentActivePath = window.localStorage.getItem('activePath');

  },
};
</script>

<style scoped>
.home {
  height: 100%;
}
.home-container {
  height: 100%;
}
.el-header {
  background: rgb(51, 55, 68);
  display: flex;
  justify-content: space-between;
  line-height: 30px;
  color: rgb(245, 243, 243);
}
.el-image {
  margin: auto -20px;
}
.el-header img {
  vertical-align: middle;
}
.el-header button {
  width: 50px;
  height: 30px;
  background: cornflowerblue;
  color: white;
  border-radius: 5px;
  margin: auto 40px;
}
.el-image span {
  font-size: 18px;
}
.el-aside {
  background: rgb(51, 55, 68);
  height: 100%;
  box-sizing: border-box;

}
 .el-menu-vertical-demo {
      border-right-width:0
    }
.el-main {
  background: rgb(234, 237, 241);
}
.el-footer {
  background: rgb(55, 61, 65);
  /* line-height: 20px; */
  color: white;
  font-size: 5px;
  text-align: center;
}
</style>