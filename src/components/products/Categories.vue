<template>
  <div class="categories">
    <el-button type="success" plain @click="showAddDialog">添加分类</el-button>
    <el-table
    :data="categoryList"
    style="width:100%"
    row-key="cat_id"
    v-loading="isLoading">
      <el-table-column prop="cat_name" label="分类名称"></el-table-column>
      <el-table-column label="是否有效">
        <template v-slot:default="{row}">{{row.cat_deleted?'否':'是'}}</template>
      </el-table-column>
      <el-table-column prop="cat_level" label="排序"></el-table-column>
      <el-table-column label="操作">
        <el-button type="primary" icon="el-icon-edit" size="small" plain>修改</el-button>
        <el-button type="danger" icon="el-icon-delete" size="small" plain>删除</el-button>
      </el-table-column>
    </el-table>

    <!-- 分页 -->

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 添加分类 -->
    <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="40%">
      <el-form
      :rules="rules"
      ref="addForm"
      :model="addForm"
      label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name" placeholder="请输入分类名称"></el-input>
        </el-form-item>

        <el-form-item label="父级名称" prop="cat_pid">
          <!--  级联选择器 -->
          <el-cascader
          v-model="addForm.cat_pid"
          :options="options"
          :props="props">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      categoryList: [],
      pagenum: 1,
      pagesize: 5,
      total: 0,
      isLoading: false,
      addDialogVisible: false,
      addForm: {
        cat_pid: [], // 分类父id
        cat_name: '', // 分类名称
        cat_level: ''// 分类层级
      },
      options: [],
      props: {
        value: 'cat_id', // 指定选项的值为选项对象的某个属性值
        label: 'cat_name', // 指定选项标签为选项对象的某个属性值
        children: 'children', // 指定选项的子选项为选项对象的某个属性值
        checkStrictly: true// 是否严格的遵守父子节点不互相关联
      },
      // 校验规则
      rules: {
        cat_name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getCategoryList()
  },
  methods: {
    async getCategoryList () {
      this.isLoading = true
      const { data, meta } = await this.$axios.get('categories', {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize,
          type: 3
        }
      })
      // console.log(data, meta)
      if (meta.status === 200) {
        this.categoryList = data.result
        this.total = data.total
        // console.log(data)
      } else {
        this.$message.error(meta.msg)
      }
      this.isLoading = false
    },

    // 分页功能
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.pagenum = 1
      this.getCategoryList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getCategoryList()
    },

    // 显示add
    async showAddDialog () {
      this.addDialogVisible = true
      // 发送axios获取,二级分类，用于添加分类时的选择
      const { data, meta } = await this.$axios.get('categories?type=2')
      // console.log(data, meta)
      if (meta.status === 200) {
        this.options = data
        // console.log(this.options)
      } else {
        this.$message.error(meta.msg)
      }
    },

    // 添加分类
    async addCategory () {
      try {
        // 校验表单
        await this.$refs.addForm.validate()
        const { meta } = await this.$axios.post('categories', {
          cat_pid: this.addForm.cat_pid[this.addForm.cat_pid.length - 1] || 0,
          cat_name: this.addForm.cat_name,
          cat_level: this.addForm.cat_pid.length
        })
        console.log(meta)
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.addDialogVisible = false
          this.getCategoryList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style>
</style>
