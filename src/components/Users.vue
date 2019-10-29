<template>
  <div class="users">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
      <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
    </el-input>
    <el-button class="addBtn" plain type="success" @click="showAddDialog">添加用户</el-button>
    <!-- 表格 -->
    <el-table :data="userList">
      <!-- prop="date"
      label="日期"
      width="180">-->
      <el-table-column prop="username" label="姓名" width="150"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="200"></el-table-column>
      <el-table-column prop label="用户状态" width="150">
        <!-- 通过 Scoped slot 可以获取到 row, column, $index 和 store（table 内部的状态管理）的数据 -->
        <template v-slot:default="obj">
          <!-- {{obj.row}} -->
          <el-switch
            v-model="obj.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeState(obj.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop label="操作" width="400">
        <template v-slot:default="obj">
          <el-button type="primary" class="el-icon-edit" plain @click="showEditDialog(obj.row)"></el-button>
          <el-button type="danger" class="el-icon-delete" plain @click="delUser(obj.row.id)"></el-button>
          <el-button type="success" class="el-icon-check" plain>分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- @size-change 每页条数的变化
         @current-change  当前页变化时触发
         :current-page 当前页
         :page-sizes 供用户选择的, 每页条数
         :page-size  当前每页的条数
         layout 指的是控件列表
         :total 总条数
    -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 添加用户弹框 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="40%">
      <el-form ref="form" :model="form" :rules="rules" status-icon label-width="100px">
        <el-form-item label="用户名称" prop="username">
          <el-input placeholder="请输入用户名称" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input type="password" placeholder="请输入用户密码" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱" v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input placeholder="请输入手机号" v-model="form.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <!-- 点击提交表单添加用户 -->
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 用户修改弹框 -->
    <el-dialog title="修改用户" :visible.sync="editVisible" width="40%">
      <!-- 用户修改表单 -->
      <el-form ref="editForm" :rules="rules" status-icon :model="editForm" label-width="100px">
        <el-tag type="info">{{editForm.username}}</el-tag>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 将axios挂载到vue原型上，就不需要再引入axios，直接使用this.$axios
// import axios from 'axios'
export default {
  // vue组件也是vue实例，也有自己的钩子函数
  // created:会将data中的数据注入当前实例上，此时实例上已经有数据了
  created () {
    this.getUserList()
  },
  data () {
    return {
      userList: [],
      query: '',
      pagenum: 1,
      pagesize: 4,
      total: 0,
      dialogVisible: false,
      // 表单数据
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 表单校验规则
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: ['blur', 'change']
          },
          {
            min: 3,
            max: 12,
            message: '用户长度在3到12字符',
            trigger: ['blur', 'change']
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: ['blur', 'change']
          },
          {
            min: 3,
            max: 12,
            message: '密码长度在3到12字符',
            trigger: ['blur', 'change']
          }
        ],
        email: [
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        mobile: [
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确的手机号',
            trigger: ['blur', 'change']
          }
        ]
      },
      // 用户修改弹框
      editVisible: false,
      editForm: {
        username: '',
        mobile: '',
        email: '',
        id: ''
      }
    }
  },
  methods: {
    // 获取用户列表
    async getUserList () {
      const { meta, data } = await this.$axios.get('users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      if (meta.status === 200) {
        this.userList = data.users
        this.total = data.total
      }
    },

    // 修改每页的条数
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      // 将当前页更新成第一页
      this.pagenum = 1
      // 重新渲染
      this.getUserList()
    },

    // 当前页变化时, 触发
    handleCurrentChange (val) {
      // val 用户选择的当前页
      this.pagenum = val
      // 重新渲染
      this.getUserList()
    },

    // 删除用户
    // 优化回调问题
    async delUser (id) {
      try {
        // 等待用户的确认
        await this.$confirm('亲, 你确认要删除么?', '温馨提示', {
          type: 'warning'
        })
        // console.log('到这里表示确定')
        // 发送ajax
        const { meta } = await this.$axios.delete(`users/${id}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          // 如果当前页只有一条了, 删除后, 当前页 --
          if (this.userList.length === 1 && this.pagenum > 1) {
            this.pagenum--
          }
          // 重新渲染当前页
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },

    // 查询用户
    searchUser () {
      this.pagenum = 1
      this.getUserList()
    },

    // 改变用户状态
    changeState (row) {
      console.log(row)
      this.$axios.put(`users/${row.id}/state/${row.mg_state}`).then(res => {
        const { meta } = res
        if (meta.status === 200) {
          this.$message.success('修改成功')
        } else {
          this.$message.error(meta.msg)
        }
      })
    },

    // 显示showAddDialog
    showAddDialog () {
      this.dialogVisible = true
    },

    // 添加用户
    async addUser () {
      try {
        await this.$refs.form.validate()
        // 说明校验成功了
        const res = await this.$axios.post('users', this.form)
        // console.log(res)
        const { msg, status } = res.meta
        if (status === 201) {
          // 成功提示
          this.$message.success(msg)
          // 重置表单
          this.$refs.form.resetFields()
          // 关闭弹框
          this.dialogVisible = false
          // 将当前页，更新成最后一页 总条数/每页多少条
          // 先让total+1
          this.total++
          this.pagenum = Math.ceil(this.total / this.pagesize)
          // 重新渲染
          this.getUserList()
        } else {
          // 失败提示
          this.$message.error(msg)
        }
      } catch (e) {
        console.log(e)
      }
    },

    // 显示showEditDialog
    showEditDialog (row) {
      console.log(row)
      this.editVisible = true
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
      this.editForm.id = row.id
    },

    // 修改用户
    async editUser () {
      try {
        await this.$refs.editForm.validate()
        // 校验成功
        const { id, email, mobile } = this.editForm
        const res = await this.$axios.put(`users/${id}`, { id, email, mobile })
        console.log(res)
        const { msg, status } = res.meta
        if (status === 200) {
          this.$message.success(msg)
          this.editVisible = false
          // 清空表单
          // this.$refs.editForm.resetFields()
          this.getUserList()
        } else {
          this.$message.error(msg)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.users {
  .input-with-select {
    width: 300px;
    margin-bottom: 10px;
  }
  .addBtn {
    margin: 0 20px;
  }
}
</style>
