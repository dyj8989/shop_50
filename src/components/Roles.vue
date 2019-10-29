<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index ' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加角色按钮 -->
    <el-button type="success" plain class="addUser" @click="showAddUser">添加角色</el-button>
    <!-- 表单渲染 -->
    <template>
      <el-table :data="rolesList" style="width: 100%">
        <el-table-column type="expand">
          <template v-slot:default="{row}">
            <el-row v-for="l1 in row.children" :key="l1.id" class="l1">
              <el-col :span="4">
                <el-tag closable @close="delRight(row,l1.id)">{{l1.authName}}</el-tag>
              </el-col>
              <el-col :span="20">
                <el-row v-for="l2 in l1.children" :key="l2.id" class="l2">
                  <el-col :span="4">
                    <el-tag closable type="success" @close="delRight(row,l2.id)">{{l2.authName}}</el-tag>
                  </el-col>
                  <el-col :span="20">
                    <el-tag
                      class="l3"
                      closable
                      v-for="l3 in l2.children"
                      :key="l3.id"
                      type="warning"
                      @close="delRight(row,l3.id)"
                    >{{l3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="描述"></el-table-column>
        <el-table-column label="操作">
          <template v-slot:default="{row}">
            <el-button
              type="primary"
              icon="el-icon-edit"
              plain
              size="small"
              @click="showAmendDialog(row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              plain
              size="small"
              @click="delRole(row.id)"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-check"
              plain
              size="small"
              @click="showAssignDialog(row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <!-- 添加角色弹框 -->
    <el-dialog title="添加角色" :visible.sync="addUserDialog" width="40%">
      <el-form ref="roleForm" :model="roleForm" label-width="100px" :rules="rules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色名描述" prop="roleDesc">
          <el-input v-model="roleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色弹框 -->
    <el-dialog title="修改角色" :visible.sync="amendUserDialog" width="40%">
      <el-form ref="amendForm" :model="amendForm" label-width="100px" :rules="rules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="amendForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色名描述" prop="roleDesc">
          <el-input v-model="amendForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="amendUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="amendRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="assignVisible" width="40%">
      <el-tree
        :data="assigData"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRights">分 配</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rolesList: [],
      addUserDialog: false,
      amendUserDialog: false,
      assignVisible: false,
      // 角色id
      roleId: '',
      roleForm: {
        roleName: '',
        roleDesc: ''
      },
      amendForm: {
        roleId: '',
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名',
            trigger: ['blur', 'change']
          },
          {
            min: 2,
            max: 6,
            message: '长度在 2 到 6 个字符',
            trigger: ['blur', 'change']
          }
        ],
        roleDesc: [
          {
            required: true,
            message: '请输入角色名',
            trigger: ['blur', 'change']
          }
        ]
      },
      // 树状权限数据
      assigData: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  created () {
    this.getRolesList()
  },

  methods: {
    // 获取列表
    async getRolesList () {
      const res = await this.$axios.get('roles')
      // console.log(res)
      const { data, meta } = res
      if (meta.status === 200) {
        this.rolesList = data
        // console.log(this.rolesList)
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 删除权限
    async delRight (row, rightId) {
      const { meta, data } = await this.$axios.delete(
        `roles/${row.id}/rights/${rightId}`
      )
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        // 重新渲染所有的数据，整个表格都更新了
        // this.getRoleList()
        // 这里不需要更新整个表格，只需要更新当前角色即可，只需要更新 row.children 即可
        // console.log(data)
        row.children = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 显示showAddUser弹框
    showAddUser () {
      this.addUserDialog = true
    },
    // 添加角色
    async addRole () {
      try {
        await this.$refs.roleForm.validate()
        const res = await this.$axios.post('roles', this.roleForm)
        // console.log(res)
        const { meta } = res
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          // 关闭模态框
          this.addUserDialog = false
          // 重置表单
          this.$refs.roleForm.resetFields()
          // 重新渲染
          this.getRolesList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 显示修改弹框
    showAmendDialog (row) {
      this.amendUserDialog = true
      // console.log(row)
      this.$nextTick(() => {
        this.amendForm.roleId = row.id
        this.amendForm.roleDesc = row.roleDesc
        this.amendForm.roleName = row.roleName
      })
    },
    // 修改角色
    async amendRole () {
      await this.$refs.amendForm.validate()
      // 校验成功
      const { roleId } = this.amendForm
      // console.log(roleId)
      const res = await this.$axios.put(`roles/${roleId}`, this.amendForm)
      // console.log(res)
      const { status } = res.meta
      if (status === 200) {
        this.$message.success('修改成功')
        this.amendUserDialog = false
        this.getRolesList()
      } else {
        this.$message.error('修改失败')
      }
    },
    // 删除角色
    async delRole (id) {
      try {
        await this.$confirm('亲，你确定要删除么？', '温馨提示', {
          type: 'warning'
        })
        const { meta } = await this.$axios.delete(`roles/${id}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          // 重置表单
          this.getRolesList()
        } else {
          this.$message.error(meta.message)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 显示分配权限弹框
    async showAssignDialog (row) {
      this.assignVisible = true
      // 一展示弹框就发axios请求，获取的是 全部的权限列表
      // 储存角色id
      this.roleId = row.id
      const { data, meta } = await this.$axios.get(`rights/tree`)
      // console.log(data, meta)
      if (meta.status === 200) {
        this.assigData = data
        console.log(data)
        // 获取所有的三级id回显
        const ids = []
        row.children.forEach(l1 => {
          l1.children.forEach(l2 => {
            l2.children.forEach(l3 => {
              ids.push(l3.id)
            })
          })
        })
        this.$refs.tree.setCheckedKeys(ids)
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 分配权限
    async assignRights () {
      const ids = this.$refs.tree.getCheckedKeys() // 全选
      const halfs = this.$refs.tree.getHalfCheckedKeys()// 半选的
      const rids = [...ids, ...halfs].join(',')
      // 发送ajax
      const { meta } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids })
      // console.log(meta)
      if (meta.status === 200) {
        this.assignVisible = false
        this.getRolesList()
        this.$message.success(meta.msg)
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.roles {
  .addUser {
    margin-bottom: 10px;
  }
  .l1 {
    padding: 10px 0;
    border-bottom: 1px solid #ccc;
    &:last-child {
      border-bottom: none;
    }
  }
  .l2 {
    margin-bottom: 5px;
  }
  .l3 {
    margin-right: 5px;
    margin-bottom: 5px;
  }
}
</style>
