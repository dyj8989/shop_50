<template>
  <div class="login">
    <el-form ref="form" :model="form" label-width="80px" :rules="rules" status-icon>
      <img src="../assets/微信图片_20190708214537.gif" alt class="logoImg" />

      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>

      <el-form-item label="用户密码" prop="password">
        <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" class="loginBtn" @click="login">登录</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      // 表单校验规则对象
      rules: {
        username: [
          // required 非空校验
          // message 提示消息
          // trigger 触发条件
          // min 和 max 长度校验
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          {
            min: 3,
            max: 12,
            message: '用户名长度必须在3-12位',
            trigger: ['change', 'blur']
          }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          {
            min: 3,
            max: 12,
            message: '密码长度必须在3-12位',
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },
  methods: {
    reset () {
      this.$refs.form.resetFields()
    },
    login () {
      this.$refs.form.validate((isValid, obj) => {
        // isValid 是否通过校验 obj 未通过校验的信息
        if (!isValid) return
        // 通过校验了, 该发ajax了
        // console.log('发ajax')
        // axios({
        //   method: 'post',
        //   url: 'http://localhost:8888/api/private/v1/login',
        //   data: this.form
        // }).then(res => {
        //   console.log(res)
        //   if (res.data.meta.status === 200) {
        //     console.log(res.meta.msg)
        //   } else {
        //     console.log(res.data.meta.msg)
        //   }
        // })
        axios.post('http://localhost:8888/api/private/v1/login', this.form).then(res => {
          const { meta, data } = res.data
          if (meta.status === 200) {
            console.log(meta.msg)
            // 一登录成功，就存储token令牌到本地
            localStorage.setItem('token', data.token)
            this.$message({
              message: meta.msg,
              type: 'success'
            })
            this.$router.push({ name: 'index' })
          } else {
            console.log(meta.msg)
            this.$message.error(meta.msg)
          }
        })
      })
    }
  }
}
</script>

<style lang="scss">
.login {
  width: 100%;
  height: 100%;
  background-color: #2d434c;
  overflow: hidden;
  .el-form {
    width: 400px;
    margin: 0 auto;
    margin-top: 200px;
    background-color: #fff;
    padding: 20px;
    padding-top: 70px;
    border-radius: 5px;
    position: relative;
    .logoImg {
      width: 150px;
      position: absolute;
      left: 50%;
      top: -61px;
      transform: translate(-50%);
      border-radius: 50%;
      border: 5px solid #fff;
    }
    .loginBtn {
      margin-right: 80px;
    }
  }
}
</style>
