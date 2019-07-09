<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/welcome' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="addcategories">添加分类</el-button>
      <tree-grid
        :data="getlist"
        :columns="columns"
        :show-index="true"
        :selection-type="false"
        :expand-type="false"
        border
        class="treeTable"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:green"></i>
          <i class="el-icon-error" v-if="scope.row.cat_deleted===true" style="color:red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level==0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level==1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="editCate">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-grid>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 8]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total"
      ></el-pagination>
    </el-card>
    <!-- 添加对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCatagoriesdialogVisible"
      width="30%"
      @close="closeDialogVisible"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- 级联选择器 -->
          <!-- options用来指定数据源 -->
          <el-cascader
            :options="parentCateList"
            :props="propsObj"
            v-model="selectedKeys"
            clearable
            change-on-select
            @change="parentCateChange"
            class="input11"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addCatagoriesdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //传递给获取商品分类数据的参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 3
      },
      // 把获取到的数据存到data中;
      getlist: [],
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          //表示将当前页定义为模板页
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      //控制添加对话框的显示与隐藏
      addCatagoriesdialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        //分类名称:
        cat_name: '',
        //父分类ID:
        cat_pid: 0,
        //分类等级
        cat_level: 0
      },
      // 添加分类表单验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 选中的父级分类的ID数组
      selectedKeys: [],
      // 父级分类列表
      parentCateList: [],
      // 级联配置对象
      propsObj: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name'
      }
    }
  },
  created() {
    this.getcatalist()
  },

  methods: {
    //获取数据
    async getcatalist() {
      var { data: res } = await this.axios.get('categories', {
        params: this.queryInfo
      })
      console.log(res)

      //  把获取到的数据存到data中;
      this.getlist = res.data.result
      this.total = res.data.total
    },
    // 监听页面显示条目改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getcatalist()
    },
    //监听页面第几页改变的事件
    handleCurrentChange(newchange) {
      this.queryInfo.pagenum = newchange
      this.getcatalist()
    },
    //   点击添加分类按钮
    addcategories() {
      // 获取父级列表
      this.getparentlist()
      //显示对话框
      this.addCatagoriesdialogVisible = true
    },
    // 获取父级联元素
    async getparentlist() {
      var { data: res } = await this.axios.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      this.parentCateList = res.data
    },
    // 选项发生变化时触发
    parentCateChange(id) {
      console.log(this.selectedKeys)
      //如果selectedKey的长度大于0证明选中了父级分类,反之就证明没有选择任何分类
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    //关闭对话框
    closeDialogVisible() {
      // 重置验证规则
      this.$refs.addCateFormRef.resetFields()
      // 重置级联框
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 点击添加的确定按钮
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return this.$message.error('创建失败')
        var { data: res } = await this.axios.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status == 201) {
          this.$message.success('创建成功')
          this.getcatalist()
          this.addCatagoriesdialogVisible = false
        }
      })
    },
    // 编辑商品分类按钮
    editCate() {}
  }
}
</script>

<style lang='less' scoped>
.treeTable {
  margin-top: 15px;
}
</style>
