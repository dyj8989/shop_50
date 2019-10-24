<template>
  <el-container class="index">
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
      <el-aside width="200px"></el-aside>
      <el-main></el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
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
