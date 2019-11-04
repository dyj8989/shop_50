<template>
  <div class="goods-add">
    <!-- 步骤条 -->
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
    </el-steps>

    <!-- 面板 -->
    <el-tabs tab-position="left" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="0">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name" placeholder="请输入商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price" placeholder="请输入商品价格"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight" placeholder="请输入商品重量"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number" placeholder="请输入商品数量"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader clearable :props="props" v-model="form.goods_cat" :options="options"></el-cascader>
          </el-form-item>
          <el-button type="primary" @click="goNext">下一步</el-button>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="1">
        <!-- multiple支持多选文件
        headers设置上传的请求头部
        action必选参数，上传的地址
        name上传的文件字段名-->
        <el-upload
          multiple
          :headers="headers"
          name="file"
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture-card"
          :on-success="handleSuccess"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>

        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>

        <el-button type="primary" @click="goNext">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="2">
        <quill-editor v-model="form.goods_introduce">

        </quill-editor>
        <el-button type="primary" @click="goodsAdd">添加</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 0,
      activeName: '0',
      form: {
        goods_name: '',
        goods_cat: [], // 商品分类，绑定级联
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [] // 图片数组，存储着上传的图片对象
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      headers: {
        Authorization: localStorage.getItem('token')
      },
      dialogVisible: false,
      dialogImageUrl: ''
    }
  },
  async created () {
    const { data, meta } = await this.$axios.get('categories?type=3')
    // console.log(data, meta)
    if (meta.status === 200) {
      this.options = data
    } else {
      this.$message.error(meta.msg)
    }
  },
  methods: {
    handleClick (tab, event) {
      // console.log(tab, event)
      this.active = +tab.index
    },
    goNext () {
      this.active++
      this.activeName = this.active + ''
    },
    // 移除图片
    handleRemove (file, fileList) {
      // console.log(file, fileList)
      const path = file.response.data.tmp_path
      this.form.pics = this.form.pics.filter(item => item.pic !== path)
    },
    // 预览图片
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 上传成功
    handleSuccess (response, file, fileList) {
      const { data, meta } = response
      // console.log(data, meta)
      if (meta.status === 200) {
        this.form.pics.push({
          pic: data.tmp_path
        })
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 添加商品
    async goodsAdd () {
      const { data, meta } = await this.$axios.post('goods', { ...this.form, goods_cat: this.form.goods_cat.join(',') })
      console.log(data, meta)
      if (meta.status === 201) {
        this.$message.success(meta.msg)
        this.$router.push('/goods')
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// 只要添加了scoped, 样式只会作用于当前模板中的内容, 不会往下渗透到子组件中的
.quill-editor{
  background-color: #fff;
  ::v-deep .ql-container{
    min-height: 300px
  }
}
</style>
