<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/welcome' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
        <!-- el-row 是element中的行元素 -->
        <!-- :gutter 设置列间距20px -->
          <!-- el-col是element中的列元素 -->
          <!-- :span相当于栅格系统中的col-xx-x 注意栅格系统默认分为12分.element默认分为24份 -->
          <el-input placeholder="请输入内容" v-model="queryinfo.query" clearable @clear="getGoodsParamsList" style="width:300px">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsParamsList"></el-button>
          </el-input>
          <el-button type="primary"  style="margin-left:20px;" @click="$router.push('/goods/add')">添加商品</el-button>
            <el-table :data="goodsParamsList" border style="margin-top:15px;"> 
                <el-table-column type="index"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name" ></el-table-column>
                <el-table-column label="商品价格(元)" prop="goods_price" width="100px" ></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight" width="100px"></el-table-column>
                <el-table-column label="创建时间"  width="180px">
                    <template slot-scope="scope">
                            {{scope.row.add_time | dataformate('yyyy-MM-dd hh:mm:ss')}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                         <el-button size="mini" type="primary" icon="el-icon-edit" @click="editGoods(scope.row)"></el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete"  @click="delGoods(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryinfo.pagenum"
      :page-sizes="[3, 5, 8, 20]"
      :page-size="queryinfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <!-- 编辑对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="editDialogVisible"
      width="40%">
      <el-form :model="editForm"  :rules="editFormrul" label-width="100px" >
        <el-form-item label="账号"  prop="cat_name" >
        <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      editForm:{
        cat_name:''
      },
        // 参数列表对应的数据
        queryinfo:{
            query:'',
            pagenum:1,
            pagesize:5    
        },
        // 把参数列表保存到date中
        goodsParamsList:[],
        //把参数中的总条数存到date中
        total:0,
        //控制编辑对话框的显示与隐藏
        editDialogVisible:false,
        goodsParamsListrul:{},
        editFormrul:{
          cat_name:[
             { required: true, message: '请输入分类名称', trigger: 'blur' }
          ]
        }
    }
  },
  methods: {
      //获取goods参数列表
     async getGoodsParamsList(){
        var {data:res} = await this.axios.get('goods',{
            params:{
                query:this.queryinfo.query,
                pagenum:this.queryinfo.pagenum,
                pagesize:this.queryinfo.pagesize
            }
        })
        if(res.meta.status == !200){
         return this.$message.warining('获取失败')
        }else{
            this.goodsParamsList = res.data.goods
            this.total=res.data.total
            this.editGoods.goods_name = res.data.goods.goods_name
            console.log(res.data.goods);
            
        }
      },
    //   当页面显示条目数发生变化时
    handleSizeChange(val){
        console.log(val);
        this.queryinfo.pagesize=val
        this.getGoodsParamsList()
    },
     // 当当前页面发生变化时
    handleCurrentChange(val){
         this.queryinfo.pagenum=val
        this.getGoodsParamsList()
    },
    // 点击删除按钮时
  async delGoods(row){
      //弹出确认框
   var result = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err =>err)
     if(result != 'confirm'){ 
         return this.$message.info('取消删除')
     }
    var {data:res} = await this.axios.delete(`goods/${row.goods_id}`)
    if(res.meta.status == 200){
        this.$message.success('删除成功')
        this.getGoodsParamsList()
    }
    },
    // 点击编辑按钮
    editGoods(row){
      this.editDialogVisible = true
       this.editForm.cat_name=row.goods_name
      console.log(this.editForm.cat_name);
      
    }
  },
  created() {
      this.getGoodsParamsList()   
  },
}
</script>
<style lang='less' scoped>
</style>
