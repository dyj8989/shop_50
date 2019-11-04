<template>
  <el-container class="index">
    <!-- 头部 -->
    <el-header>
      <div class="logo">
        <img src="../assets/logo.png" alt />
      </div>
      <div class="title">
        <h1>黑马电商管理</h1>
      </div>
      <div class="logout">
        欢迎光临~
        <a href="javascript:;" @click="logout">退出</a>
      </div>
    </el-header>

    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <!-- el-menu: 主菜单
        default-active = '2' 默认激活的导航
        unique-opened 只保持一个打开
        el-submenu: 子菜单
        el-menu-item 子菜单展开内容-->
        <!-- router是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path行路由跳转  boolean—false -->
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          router
          :default-active="defaultActive"
        >
          <!-- <el-submenu index="1">
            标题
            <template v-slot:title>
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            展开内容
            解析式，会将配置的路径，当成绝对路径使用，写的是users=>/users
            <el-menu-item index="users">
              <i class="el-icon-menu"></i>
              <span slot="title">用户列表</span>
            </el-menu-item>
          </el-submenu>-->

          <!-- <el-submenu index="2">
            标题
            <template v-slot:title>
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>

            <el-menu-item index="roles">
              <i class="el-icon-menu"></i>
              <span slot="title">角色列表</span>
            </el-menu-item>

            <el-menu-item index="rights">
              <i class="el-icon-menu"></i>
              <span template>权限列表</span>
            </el-menu-item>
          </el-submenu>-->

          <el-submenu :index="menu.path" v-for="menu in menuList" :key="menu.id">
            <!-- 标题 -->
            <template v-slot:title>
              <i class="el-icon-location"></i>
              <span>{{ menu.authName }}</span>
            </template>

            <el-menu-item :index="item.path" v-for="item in menu.children" :key="item.id">
              <i class="el-icon-menu"></i>
              <span slot="title">{{ item.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menuList: []
    }
  },
  async created () {
    const { data, meta } = await this.$axios.get('menus')
    // console.log(data, meta)
    if (meta.status === 200) {
      // this.$message.success(meta.msg)
      this.menuList = data
    } else {
      this.$message.error(meta.msg)
    }
  },
  computed: {
    defaultActive () {
      // 如何获取当前路由的相关信息？？this.$route
      // this.$route拿到当前相关的信息对象（路径，参数）
      // return console.log(this.$route.path)
      return this.$route.path.slice(1)
    }
  },
  methods: {
    logout () {
      // 调用$confirm方法即可打开消息提示，它模拟了系统的 confirm。Message Box 组件也拥有极高的定制性，我们可以传入options作为第三个参数，它是一个字面量对象。type字段表明消息类型，可以为success，error，info和warning，无效的设置将会被忽略。注意，第二个参数title必须定义为String类型，如果是Object，会被理解为options。在这里我们用了 Promise 来处理后续响应。
      // this.$confirm
      // 参数1: 提示消息
      // 参数2: 标题
      // 参数3: 配置对象
      this.$confirm('亲，你确定要退出系统吗？', '温馨提示', {
        type: 'warning'
      })
        .then(() => {
          // 删除token
          localStorage.removeItem('token')
          // 回到登录页
          this.$router.push('/login')
          this.$message.success('退出成功')
        })
        .catch(() => {
          this.$message('取消退出')
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.index {
  height: 100%;
  .el-header {
    background-color: #d8d8d8;
    display: flex;
    .logo {
      width: 180px;
      img {
        height: 40px;
        margin: 10px;
      }
    }
    .title {
      flex: 1;
      text-align: center;
      height: 60px;
      line-height: 60px;
      color: #545c64;
    }
    .logout {
      width: 180px;
      height: 60px;
      line-height: 60px;
      text-align: right;
      a {
        color: orange;
      }
    }
  }
  .el-aside {
    background-color: #545c64;
  }
  .el-main {
    background-color: #ecf0f1;
  }
}
</style>
