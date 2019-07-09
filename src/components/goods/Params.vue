<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/welcome' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片石头 -->
    <el-card>
      <!-- 提示框 -->
      <el-alert title="注意: 只允许为第三级设置相关参数" type="warning" show-icon :closable="false"></el-alert>
      <!-- 级联选择框 -->
      <div class="selectBox">
        选择框:
        <!-- options是级联框绑定的数据 -->
        <!-- props是级联框显示的数据 -->
        <!-- v-model级联框发生改变时的对应数据 -->
        <el-cascader
          :options="GoodsParamsList"
          v-model="selectedKeys"
          :props="propsObj"
          @change="goodsParamsChange"
          clearable
        ></el-cascader>
      </div>
      <el-tabs v-model="tabsActiveName" @tab-click="tabsHandleClick">
        <!-- 动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button size="mini" type="primary" :disabled="isDisable" @click="addParams">添加参数</el-button>
          <el-table :data="manyParamsList">
            <!-- 展开符 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                  <!-- 展开符里面的tag标签 -->
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close='closetag(scope.row,index)'>{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @blur="handleInputConfirm(scope.row)"
                  @keyup.enter.native="handleInputConfirm(scope.row)">
                  </el-input>
                  
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">添加</el-button>
              </template>
            </el-table-column>
            <!-- 索引 -->
            <el-table-column type="index"></el-table-column>
            <!-- 参数名称列  prop指定数据绑定的对象-->
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  icon="el-icon-edit"
                  type="primary"
                  @click="editParams(scope.row)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  icon="el-icon-delete"
                  type="danger"
                  @click="deleteParams(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性面板 -->
        <el-tab-pane label="静态参数" name="only">
          <el-button size="mini" type="primary" :disabled="isDisable" @click="addParams">添加属性</el-button>
          <el-table :data="onlyParamsList">
            <el-table-column type="expand">
              <template slot-scope="scope">
                  <!-- 展开符里面的tag标签 -->
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close='closetag(scope.row,index)'>{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @blur="handleInputConfirm(scope.row)"
                  @keyup.enter.native="handleInputConfirm(scope.row)">
                  </el-input>
                  
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">添加</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  icon="el-icon-edit"
                  type="primary"
                  @click="editParams(scope.row)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  icon="el-icon-delete"
                  type="danger"
                  @click="deleteParams(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      :title="tabsActiveName=='only'? '添加静态属性':'添加动态参数'"
      :visible.sync="addParamsDialogVisible"
      width="40%"
      @close="addParamsDialogVisibleClosed"
    >
      <el-form
        :model="addParamsForm"
        :rules="addParamsFormRules"
        ref="addParamsFormRef"
        label-width="100px"
       class="demo-ruleForm">
        <el-form-item :label="tabsActiveName=='only'? '静态属性':'动态参数'" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParamsYes">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog
      :title="tabsActiveName=='only'? '修改静态属性':'修改动态参数'"
      :visible.sync="editParamsDialogVisible"
      width="40%"
      @close="editParamsDialogVisibleClosed"
    >
      <el-form
        :model="eidtParamsForm"
        :rules="editParamsFormRules"
        ref="editParamsFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="tabsActiveName=='only'? '静态属性':'动态参数'" prop="attr_name">
          <el-input v-model="eidtParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParamSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 级联绑定的数据
      GoodsParamsList: [],
      //级联发生选择改变时
      selectedKeys: [1,2,6],
      propsObj: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id'
      },
      tabsActiveName: 'many',
      //  控制添加对话框的显示隐藏
      addParamsDialogVisible: false,
      //  动态参数存放处
      manyParamsList: [],
      //  静态参数存放处
      onlyParamsList: [],
      // 表单绑定的数据
      addParamsForm: {
        attr_name: ''
      },
      // 添加对话框路由验证规则
      addParamsFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      },
      // 控制编辑对话框的显示隐藏
      editParamsDialogVisible: false,
      eidtParamsForm: {
        attr_name: ''
      },
      // 编辑对话路由框验证规则
      editParamsFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      },
      // 用于存放编辑对话框中的属性的id
      paramsAttrId: '',
      //存放tag标签的数据;
      taglist:[]
    }
  },

  methods: {
    //获取级联数据
    async getGoodsCate() {
      var { data: res } = await this.axios.get('categories', {
        params: { type: 3 }
      })
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      this.GoodsParamsList = res.data
    },
    //   当级联数据改变时
    goodsParamsChange() {
      if (this.selectedKeys.length == 0) {
        this.onlyParamsList = []
        this.manyParamsList = []
       
      }
    // 获取参数列表
      this.getParamsList()
    },
    // 点击标签页触发的事件
    tabsHandleClick() {
      console.log(this.tabsActiveName)
      this.getParamsList()
    },
    // 获取参数
    async getParamsList() {
      // 如果级联选择发生改变时级联框id不等于三的时候清空
      if (this.selectedKeys.length !== 3){
              this.onlyParamsList = []
              this.manyParamsList = []
         return this.selectedKeys = []
         
         }
      var { data: res } = await this.axios.get(
        `categories/${this.paramsId}/attributes`,
        { params: { sel: [`${this.tabsActiveName}`] } }
      )
       res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          // 控制tag标签切换input标签
          item.inputVisible=false
          // 文本框输入的值
          item.inputValue=''
        })
      if (res.meta.status == 200) {
        if (this.tabsActiveName == 'only') {
          this.onlyParamsList = res.data
        } else {
          this.manyParamsList = res.data
        }
        console.log(res.data)
      }
    },
    // 添加按钮和编辑按钮点击时
    addParams() {
      this.addParamsDialogVisible = true
    },
    // 关闭添加对话框时
    addParamsDialogVisibleClosed() {
      this.$refs.addParamsFormRef.resetFields()
    },
    // 点击对话框中的确定时
    addParamsYes() {
      this.$refs.addParamsFormRef.validate(async valid => {
        if (!valid) return this.$message.error('添加失败')
        var { data: res } = await this.axios.post(
          `categories/${this.paramsId}/attributes`,
          {
            attr_name: this.addParamsForm.attr_name,
            attr_sel: this.tabsActiveName
          }
        )
        if (res.meta.status != 201) return this.$message.error('添加失败')
        this.$message.success('添加成功')
      })
      this.getParamsList()
      this.addParamsDialogVisible = false
    },
    // 点击编辑按钮时
    editParams(row) {
      console.log(row)

      // 赋值给input双向绑定的对象属性中
      this.eidtParamsForm.attr_name = row.attr_name
      this.paramsAttrId = row.cat_id
      this.editParamsDialogVisible = true
    },
    // 关闭编辑对话框
    editParamsDialogVisibleClosed() {
      this.$refs.editParamsFormRef.resetFields()
    },
    // 点击编辑对话框中的确定按钮
    editParamSubmit() {
      this.$refs.editParamsFormRef.validate(async valid => {
        if (!valid) return
        var { data: res } = await this.axios.put(
          `categories/${this.paramsId}/attributes/${this.paramsAttrId}`,
          {
            attr_name: this.eidtParamsForm.attr_name,
            attr_sel: this.tabsActiveName
          }
        )
        if (res.meta.status == 200) {
          this.$message.success('修改成功')
          this.getParamsList()
          this.editParamsDialogVisible = false
        }
      })
    },
    // 点击删除按钮
    async deleteParams(row) {
      var { data: res } = await this.axios.delete(
        `categories/${row.cat_id}/attributes/${row.attr_id}`
      )
      if (res.meta.status == 200) {
        this.getParamsList()
        this.$message.success('删除成功')
      }
    },
    // 文本框回车或者失去焦点触发的事件
  async handleInputConfirm(row){
       
       if(row.inputValue.trim().length === 0){
         row.inputValue='';
         row.inputVisible=false;
         return
       }
    row.attr_vals.push(row.inputValue) 
    row.inputVisible=false;
    row.inputValue='';
      //发送请求
      // 因为可以共用被抽取出去了(edittag)
    this.editTagAttr(row)
  },
    // tag标签点击时
    showInput(row){
      row.inputVisible= true
      // 让文本框自己获得焦点
      // nextTick作用是当页面重新渲染之后才会指定回调函数中的代码
      this.$nextTick(_=> {
          this.$refs.saveTagInput.$refs.input.focus();
        });
        // 发送请求
    console.log(row);
    },
    // 关闭tag标签时
  async closetag(row,i){
    //  给attr_vals 重新赋值
    row.attr_vals.splice(i,1)
    //  发送请求
    this.editTagAttr(row)
    },
    // tag标签添加删除共用请求
  async editTagAttr(row){
      var {data:res} =await this.axios.put(`categories/${row.cat_id}/attributes/${row.attr_id}`,{
    attr_name:row.attr_name,
    attr_sel:this.tabsActiveName,
    attr_vals:row.attr_vals.join(' ')
  })
  if(res.meta.status ==200){
    this.$message.success('修改完成')
  }
    }
  },
  created() {
    this.getGoodsCate()
    this.getParamsList()
  },
  // 计算属性定义时用方法,使用时用方法
  computed: {
    isDisable() {
      // 如果级联选择框选择的级别不等于3 禁用按钮,否则不仅用按钮
      if (this.selectedKeys.length !== 3) {
        return true
      }
      return false
    },
    // 获取三级分类id
    paramsId() {
      if (this.selectedKeys.length == 3) {
        return this.selectedKeys[2]
      }
      return null
    }
  }
}
</script>

<style lang='less' scoped>
.selectBox {
  margin: 10px 0px;
}
.el-cascader {
  width: 300px;
}
.el-tag {
  margin: 10px;
}
.input-new-tag{
  width: 120px;
}
</style>
