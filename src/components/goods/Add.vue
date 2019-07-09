<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/welcome' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card style="marign-top：10px">
      <!-- 带有消息提示的警告框 -->
      <el-alert title="添加商品分类" type="info" center :closable="false" show-icon></el-alert>
      <!-- 含状态的步骤条 -->
      <el-steps :space="200" :active="activeIndex-0" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab标签页 tab-position 控住标签页的位置 -->
      <el-form
        :model="addForm"
        :rules="AddFormrules"
        ref="AddFormRef"
        label-width="100px"
        class="demo-ruleForm"
        label-position="top"
      >
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeLeave"
          type="border-card"
          @tab-click="tabsClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" >
              <!-- options表示当前级联框绑定的数据 -->
              <!-- v-model表示当前级联框选择时,显示的数组元素 -->
              <!-- props是一个配置对象 配置的有 鼠标经过显示级联框,label 绑定的值, value,绑定的id -->
              <el-cascader
                :options="GoodsParamsList"
                v-model="cascaderOpt"
                :props="propsObj"
                @change="goodsParamsChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in tabsGoodsParams"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border v-for="(item1,i) in item.attr_vals" :key="i" :label="item1"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyGoodsParams"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="uploadSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" style="margin-top:18px;" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 预览图片对话框 -->
    <el-dialog
      title="预览图片"
      :visible.sync="previewDialogVisible"
      width="30%">
     <div id="imgbox">
        <img :src="prievwImg" alt="">
     </div>
    </el-dialog>
  </div>
</template>
<script>
import { log } from 'util'
export default {
  data() {
    return {
      cascaderOpt:[1,3,6],
      // 对话框显示隐藏
      previewDialogVisible:false,
      // 图片的预览地址
      prievwImg:'',
      // 步骤条绑定的数据
      activeIndex: '0',
      // 添加商品绑定的对象
      addForm: {
        goods_name: 'test',
        goods_price: 1,
        goods_number: 1,
        goods_weight: 1,
        goods_cat: '',
        pics: [],
        goods_introduce:'',
        attrs:[]
      },
      // 添加商品分类的校验规则
      AddFormrules: {
        goods_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ],
        goods_cat: [{ required: true, message: '请选择分类', trigger: 'blur' }]
      },
      // 存放级联框参数列表
      GoodsParamsList: [],
      // casder的prop配置对象
      propsObj: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id'
      },
      //存放tab动态参数列表
      tabsGoodsParams: [],
      //存放tab静态列表
      onlyGoodsParams: [],
      //上传图片的请求地址
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      //给上传图片设置请求头Authorization值;
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      }
    }
  },
  methods: {
    //   级联框参数列表
    async getGoodsCate() {
      var { data: res } = await this.axios.get('categories', {
        params: { type: 3 }
      })
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      this.GoodsParamsList = res.data
    },
    //级联框选择改变时触发的函数
    goodsParamsChange() {
      if (this.cascaderOpt.length !== 3) {
        return (this.cascaderOpt = [])
      }
    },
    //tabs选择框离开之前触发的事件,第一个值为新,第二个值为老 绑定的是activeIndex的值
    //如果向阻止跳转请return false
    beforeLeave(n, o) {
      if (o == 0 && this.cascaderOpt.length !== 3) {
        this.$message.error('请选择三级分类')
        return false
      }
    },
    // 点击tabs导航时触发
    async tabsClick() {
      if (this.activeIndex == 1) {
        // 当tab发上改变时activeIndex==1时发送请求获取数据
        var { data: res } = await this.axios.get(
          `categories/${this.goodsId}/attributes`,
          {
            params: {
              sel: 'many'
            }
          }
        )
        if (res.meta.status == 200) {
          // 循环遍历res.data 把attr_vals 变为数组
          res.data.forEach(item => {
            item.attr_vals =
              item.attr_vals.length == 0 ? [] : item.attr_vals.split(' ')
          })
          //    存放到data中
          this.tabsGoodsParams = res.data
        }
      } else if (this.activeIndex == 2) {
        //   当activeindex == 2时获取静态属性
        var { data: res } = await this.axios.get(
          `categories/${this.goodsId}/attributes`,
          {
            params: {
              sel: 'only'
            }
          }
        )
        if (res.meta.status == 200) {
          this.onlyGoodsParams = res.data
        }
      }
    },
    // 点击预览图片时触发
    handlePreview(priew) {
      this.previewDialogVisible  = true
      this.prievwImg = priew.response.data.url
    },
    // 删除图片时触发
    handleRemove(del) {
   var index =  this.addForm.pics.findIndex(item=>{
       return del.response.data.tmp_path ==item.pic
     })
  this.addForm.pics.splice(index,1)
      console.log(this.addForm);
      
    },
    // 上传图片成功时触发
    uploadSuccess(response) {
      if (response.meta.status == 200) {
        this.addForm.pics.push({
          pic: response.data.tmp_path
        })
      }
    },
    // 点击添加商品按钮时触发
   addGoods(){
      this.$refs.AddFormRef.validate(async valid=>{
        if(!valid){
          return this.$message.error('请填写必要条件')
        }
        // 把级联数据转化为字符串
      this.addForm.goods_cat=this.cascaderOpt.join(' ')
        //  把动态属性和静态属性存放到addform的attrs中
        this.tabsGoodsParams.forEach(item=>{
            this.addForm.attrs.push({
              attr_id:item.attr_id,
              attr_valus:item.attr_vals.join(',')
            })
        })
        this.onlyGoodsParams.forEach(item=>{
          this.addForm.attrs.push({
             attr_id:item.attr_id,
              attr_valus:item.attr_vals
          })
        })
        console.log( this.addForm);
        
      var {data:res} = await this.axios.post('goods',this.addForm)
        if(res.meta.status !== 201){
         return this.$message.error(res.meta.msg)
        }
        this.$router.push('/goods')
        this.$message.success(res.meta.msg)
       
      })
    }
  },
  //   生命周期函数
  created() {
    this.getGoodsCate()
  },
  //   计算属性
  computed: {
    goodsId() {
      if (this.cascaderOpt.length == 3) {
        return this.cascaderOpt[2]
      }
    }
  }
}
</script>

<style lang='less' scoped>
.el-steps {
  margin: 40px 200px 40px;
}
#imgbox{
 
 margin: 0 auto;
 img{
   width: 100%;
 }
}

</style>
