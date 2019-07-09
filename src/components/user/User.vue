  <template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/welcome' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- :gutter 用来设置列与列之间的间距 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- :span相当于栅格系统中的col-xx-x 注意栅格系统默认分为12分.element默认分为24份 -->
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryinfo.query"
            clearable
            @clear="getUsersList">
            <el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="手机" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="item">
            <el-switch v-model="item.row.mg_state" @change="userStateChanged(item.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="item">
            <!-- 提示 -->
            <el-tooltip
              :enterable="false"
              class="item"
              effect="dark"
              content="编辑"
              placement="top-start"
            >
              <el-button type="primary" icon="el-icon-edit" @click="editUser(item.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip
              :enterable="false"
              class="item"
              effect="dark"
              content="删除"
              placement="top-start"
            >
              <el-button type="danger" icon="el-icon-delete" @click="delUser(item.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip
              :enterable="false"
              class="item"
              effect="dark"
              content="设置"
              placement="top-start"
            >
              <el-button type="warning" icon="el-icon-setting" @click="setUser(item.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[1,2,4,8]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户提示框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <!-- ref='addform' 为当前的引用是addFormRef
        roules 是验证规则,要在需要验证的表单中添加prop='对应的验证规则'-->
        <!-- 主体 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <!-- :visible.sync用来判断是fou显示dailog弹框 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogVisibleClose"
    >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <!-- /*双向绑定data中editform.username;
      editform.username改变,文本框也会改变,
          文本框改变.editform.usernam也会该白案*/-->
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAddForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- /分配权限对话框 -->
    <el-dialog
  title="分配权限"
  :visible.sync="setUserdialogVisible"
  width="30%">
  <div>
    <p>用户名:{{userinfo.username}}</p>
    <p>用户角色:{{userinfo.role_name}}</p>
    <div>
      选择角色:
      <el-select v-model="sleectroleId" placeholder="请选择">
      <el-option
      v-for="item in rolesList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select>
    </div>
  </div>
  <span slot="footer" >
    <el-button @click="setUserdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="setRoleInfo">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

  <script>
import { type } from 'os'
import { log } from 'util'
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
      if (regEmail.test(value)) {
        return cb()
      } else {
        return cb(new Error('请输入合法邮箱'))
      }
    }
    // 验证手机的规则
    var checkmobile = (rule, value, cb) => {
      let regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        cb()
      } else {
        cb(new Error('请输入合法手机号'))
      }
    }
    return {
      queryinfo: {
        query: '',
        //当前页
        pagenum: 1,
        //每页显示的条目
        pagesize: 2
      },
      userlist: [],
      total: 0,
      //控制添加用户提示框的显示,
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {},
      //验证规则 对应rules='addFormRules'的addFormRules
      addFormRules: {
        //
        //验证规则 对应prop='username'的username
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        //验证规则 对应prop='password' 的password
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 16,
            message: '密码长度在6~10个字符之间',
            trigger: 'blur'
          }
        ],
        //验证规则 对应prop='email' 的email
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        //验证规则 对应prop='mobile' 的mobile
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkmobile, trigger: 'blur' }
        ]
      },
      //编辑表单验证规则
      editFormRules: {
        username: [{ required: true }],
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        //验证规则 对应prop='mobile' 的mobile
        mobile: [
          { required: true, message: '请输入用户手机号', trigger: 'blur' },
          { validator: checkmobile, trigger: 'blur' }
        ]
      },
    setUserdialogVisible:false,
    userinfo:{},
    rolesList:[],
    sleectroleId:'',
    }
  },
  created() {
    this.getUsersList()
  },

  methods: {
    async getUsersList() {
      // 这里注意get传递对象参数时需要加上params
      var { data: res } = await this.axios.get('users', {
        params: this.queryinfo
      })
      if (res.meta.status != 200) return this.$message(res.meta.msg)
      this.userlist = res.data.users
      this.total = res.data.total
    },
    handleSizeChange(val) {
      this.queryinfo.pagesize = val
      this.getUsersList()
    },
    handleCurrentChange(val) {
      this.queryinfo.pagenum = val
      this.getUsersList()
    },
    async userStateChanged(val) {
      var { data: res } = await this.axios.put(
        `users/${val.id}/state/${val.mg_state}`
      )
      if (res.meta.status != 200) {
        val.mg_state = !val.mg_state
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    addUser() {
      console.log(this.$refs)
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        var { data: res } = await this.axios.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败')
        this.$message.success('添加用户成功')
        this.addDialogVisible = false
        this.getUsersList()
      })
    },
    //编辑表单
    async editUser(id) {
      //  发送请求
      const { data: res } = await this.axios.get('users/' + id)
      console.log(res.data)

      if (res.meta.status !== 200) return this.$message.error('查询失败')
      this.editForm = res.data
      console.log(this.editForm)
      this.editDialogVisible = true
    },
    //表单关闭重置表单
    editDialogVisibleClose() {
      this.$refs.editFormRef.resetFields()
    },
    //点击确定发送请求重新渲染表单
    editAddForm() {
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          var { data: res } = await this.axios.put(
            'users/' + this.editForm.id,
            {
              email: this.editForm.email,
              mobile: this.editForm.mobile
            }
          )
          this.$message.success('修改成功')
          this.editDialogVisible = false
          this.getUsersList()
        }
      })
    },
    async delUser(id) {
      var result = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (result == 'confirm') {
        var { data: res } = await this.axios.delete('users/' + id)
        if (res.meta.status == 200) {
          this.$message.success('删除成功')
          console.log(res)

          this.getUsersList()
        } else {
          this.$message.warning('删除失败')
        }
      } else {
        this.$message.info('取消删除')
      }
    },
    async setUser(row){
     this.setUserdialogVisible=true
      this.userinfo = row
      console.log(this.userinfo);
       var { data: res } = await this.axios.get('roles')
      if (res.meta.status == 200) {
        this.rolesList = res.data
        console.log(this.rolesList);
      }
    },
    // 用户分配角色权限
   async setRoleInfo(){
      if(!this.sleectroleId){
        return this.$message.error('请选择要修改的数据')
      }
      //发送请求获取数据
      console.log(this.sleectroleId);
      
      var {data:res}  = await this.axios.put(`users/${this.userinfo.id}/role`,{
        rid:this.sleectroleId
      })
      if(res.meta.status!==200){
        return this.$message.error('修改失败')
      }
      this.getUsersList()
     this.setUserdialogVisible = false;
     this.$message.success('修改成功')

    }
  }
}
</script>

  <style lang='less' scoped>
.el-table {
  margin-top: 15px;
}
</style>
