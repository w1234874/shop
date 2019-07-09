<template>
  <div>
    <!-- 面包屑 -->
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/welcome' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
    <!-- 搜索框 -->
    <el-input placeholder="请输入内容" style="width:30%" v-model="queryInfo.query">
        <el-button slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <!-- 表格 -->
    <el-table :data="orderList" border stripe style="margin-top:20px;">
        <el-table-column type="index" ></el-table-column>
        <el-table-column label='订单编号' prop="order_number" width="688px"></el-table-column>
        <el-table-column label="订单价格" prop="order_price" width="188px"></el-table-column>
        <el-table-column label="是否付款" width="188px">
            <template slot-scope="scope">
                <el-tag  type="primary" v-if="scope.row.order_pay == 1"> 已付款</el-tag>
                <el-tag  type="danger"  v-else> 未付款</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"  width="188px"></el-table-column>
        <el-table-column label="下单时间"  width="188px">
            <template slot-scope="scope">
                {{scope.row.create_time | dataformate('yyyy-MM-dd')}}
            </template>
        </el-table-column>
        <el-table-column label="操作" >
            <el-button icon="el-icon-edit" type="primary" size="mini" @click="dialogVisible=true"></el-button>
            <el-button icon="el-icon-location" type="success" size="mini" @click='getKuaiDiInfo'></el-button>
        </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5,10,20,40,]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
   

    </el-card>
     <!-- 对话框 -->
    <el-dialog
    title="选择城市"
    :visible.sync="dialogVisible"
    width="40%">
    <el-form  ref="ruleForm"  class="demo-ruleForm">
  <el-form-item label="选择城市">
 <el-cascader
    expand-trigger="hover"
    :options="item"
    v-model="selectedOpt"
    @change="handleChange"
    clearable
    >
  </el-cascader>
  </el-form-item>
    </el-form>
    <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
    </el-dialog>
    <!-- 快递信息对话框 -->
         <el-dialog
    title="快递信息"
    :visible.sync="kddialogVisible"
    width="40%">
    <el-timeline :reverse="reverse">
    <el-timeline-item v-for="(activity, index) in kdList" :key="index" :timestamp="activity.time"> 
        {{activity.context}}
    </el-timeline-item>
  </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import item from './citydata.js'
export default {

  data () {
    return {
        queryInfo:{
            query:'',
            pagenum:1,
            pagesize:5
        },
    // 存放数据
    orderList:[],
    // 存放总条目
    total:0,
    kddialogVisible:false,
    dialogVisible:false,
    selectedOpt:[],
    item:item,
    reverse:true,
    kdList:[]
    }
  },
  methods: {
    //   获取订单数据
    async getOrderList(){
        var {data:res} = await this.axios('orders',{
            params:this.queryInfo
        })
        if(res.meta.status == 200){
           this.orderList = res.data.goods
           this.total = res.data.total 
        }    
    },
    // 页面显示条目发生改变时
    handleSizeChange(val){
        this.queryInfo.pagesize = val
        this.getOrderList()
    },
    // 当前页发生改变时
    handleCurrentChange(val){
        this.queryInfo.pagenum = val
        this.getOrderList()
    },
    handleChange(a){
        console.log(a);
        console.log(this.selectedOpt);
        
    },
    async getKuaiDiInfo(){
        this.kddialogVisible =  true
        var {data:res} = await this.axios.get('/kuaidi/1106975712662')
        if(res.meta.status == 200){
         this.kdList = res.data
         console.log(this.kdList);
         
        }
       
        
    }

  },

  created () {
      this.getOrderList()
  }
}
</script>

<style lang='less' scoped>

</style>
