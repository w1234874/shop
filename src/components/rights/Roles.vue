<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 按钮 -->
      <el-button type="primary" style="margin-bottom:20px" @click="addDialogVisible =true">添加角色</el-button>
      <!-- 表格 -->
      <el-table border :data="rolesList" stripe>
        <!-- 展开符 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 第一行6层 -->
            <el-row :class="i==0? 'bt':''" v-for="(item1,i) in scope.row.children" :key="item1.id">
              <el-col :span="6">
                <el-tag closable @close="removeRights(scope.row,item1.id)">
                  {{item1.authName}}
                  <i class="el-icon-caret-right"></i>
                </el-tag>
              </el-col>
              <el-col :span="19">
                <!-- 第二行在6层里面循环8层 -->
                <el-row v-for="(item2,i) in item1.children" :key="item2.id" class="bd">
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRights(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRights(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 序号 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editRoles(scope.row.id)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteRoles(scope.row.id)"
            >删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="assignright(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="resetFile">
      <el-form :model="setroles" label-width="100px" :rules="addrolesRules" ref="addrolesRules">
        <!-- ref='addform' 为当前的引用是addFormRef
        roules 是验证规则,要在需要验证的表单中添加prop='对应的验证规则'-->
        <!-- 主体 -->
        <el-form-item label="角色" prop="roleName">
          <el-input v-model="setroles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="setroles.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogVisibleclosed"
    >
      <el-form :model="editroles" label-width="100px" :rules="editrolesrules" ref="editrolesref">
        <!-- ref='addform' 为当前的引用是addFormRef
        roules 是验证规则,要在需要验证的表单中添加prop='对应的验证规则'-->
        <!-- 主体 -->
        <el-form-item label="角色" prop="roleName">
          <el-input v-model="editroles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editroles.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAddRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="assignRightDialogVisible" width="30%">
      <!-- 树控件 -->
      <!-- show-checkbox 是前面的全选复选框 -->
      <el-tree
        :data="rightsList"
        ref="rightsRef"
        :props="treeProps"
        show-checkbox
        :default-expand-all="true"
        node-key="id"
        :default-checked-keys="defKey"
      ></el-tree>
      <span slot="footer">
        <el-button @click="assignRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  //数据集合
  data() {
    return {
      rolesList: [],
      setroles: {
        roleName: '',
        roleDesc: ''
      },
      treeProps: {
        //父子节点要关联的数据用children来表示
        children: 'children',
        //label表示树形图中要展示的每一项;
        label: 'authName'
      },
      editroles: [],
      rightsList: [],
      //控制添加角色对话框显示隐藏
      addDialogVisible: false,
      //控制修改校色对话框显示隐藏
      editDialogVisible: false,
      //控制分配权限内对话框显示隐藏
      assignRightDialogVisible: false,
      // 添加规则
      addrolesRules: {
        roleName: [
          { required: true, message: '请输入角色', trigger: 'blur' },
          {
            min: 2,
            max: 16,
            message: '角色名称长度在2-16之间',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 2,
            max: 30,
            message: '角色名称长度在2-30之间',
            trigger: 'blur'
          }
        ]
      },
      //编辑规则
      editrolesrules: {
        roleName: [
          { required: true, message: '请输入角色', trigger: 'blur' },
          {
            min: 2,
            max: 16,
            message: '角色名称长度在2-16之间',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 2,
            max: 30,
            message: '角色名称长度在2-30之间',
            trigger: 'blur'
          }
        ]
      },
      // 权限勾选
      defKey: [],
      // 角色id
      rouleId: 0
    }
  },
  //声明周期函数
  created() {
    this.getRoles()
  },
  //方法集合
  methods: {
    //发送请求获取角色数据
    async getRoles() {
      var { data: res } = await this.axios.get('roles')
      if (res.meta.status == 200) {
        this.rolesList = res.data
      }
    },
    // 添加角色逻辑
    addRoles() {
      //验证是否合法
      this.$refs.addrolesRules.validate(async valid => {
        //如果合法
        if (valid) {
          var { data: res } = await this.axios.post('roles', this.setroles)
        } else {
          this.$message.warning('添加失败')
        }
        this.getRoles()
        this.addDialogVisible = false
      })
    },
    // 关闭添加角色弹出框时重置表单
    resetFile() {
      this.$refs.addrolesRules.resetFields()
    },
    //  编辑角色逻辑
    async editRoles(id) {
      //    根据id查询角色
      var { data: res } = await this.axios.get('roles/' + id)
      //    如果数据获取成功
      if (res.meta.status !== 200) return this.$message.error('失败')
      this.editroles = res.data
      this.editDialogVisible = true
    },
    // 编辑弹框关闭重置表单
    editDialogVisibleclosed() {
      this.$refs.editrolesref.resetFields()
    },
    //点击编辑表单确定时
    editAddRoles() {
      this.$refs.editrolesref.validate(async valid => {
        if (valid) {
          var { data: res } = await this.axios.put(
            'roles/' + this.editroles.roleId,
            {
              roleName: this.editroles.roleName,
              roleDesc: this.editroles.roleDesc
            }
          )
        } else {
          this.$message.error('修改失败')
        }
        this.$message.success('修改成功')
        this.getRoles()
        this.editDialogVisible = false
      })
    },
    //   删除逻辑
    async deleteRoles(id) {
      //  确认删除弹出框 Message.box
      var result = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(error => error)
      //如果点击确认删除
      if (result !== 'confirm') return this.$message('取消删除')
      var { data: res } = await this.axios.delete('roles/' + id)
      if (res.meta.status == 200) {
        console.log(res)
        this.getRoles()
        this.$message.success('删除成功')
      }
    },
    // 删除权限逻辑
    async removeRights(role, rightId) {
      //    弹框是否删除
      var result = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(error => error)

      //如果点击的不是确定
      if (result != 'confirm') return this.$message('取消删除')
      //否则发送请求删除权限
      var { data: res } = await this.axios.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      console.log(res.data)
      //因为返回的是当前的权限,所以重新给scope赋值当前权限.
      role.children = res.data
      this.$message.success('成功')
    },
    // 分配权限
    async assignright(row) {
      // 这个row是传递的scope.row
      this.assignRightDialogVisible = true
      var { data: res } = await this.axios.get('rights/tree')
      this.defKey = []
      if (res.meta.status == 200) {
        this.$message.success('获取列表成功')
        this.rightsList = res.data
      }
      this.getDefKeys(row)
      // 把当前的角色ID存放代date中
      this.rouleId = row.id
    },
    //勾选分配权限弹出框
    getDefKeys(row) {
      row.children.forEach(item => {
        if (!item.children) {
          return this.defKey.push(item.id)
        }
        this.getDefKeys(item)
      })
    },
    // 分配角色后删除按钮
    async setRights() {
      var checkedNodes = this.$refs.rightsRef.getCheckedKeys()
      var halfCheckedNodes = this.$refs.rightsRef.getHalfCheckedKeys()
      var keys = [...checkedNodes, ...halfCheckedNodes]
      var rids = keys.join(',')
      var { data: res } = await this.axios.post(
        `roles/${this.rouleId}/rights`,
        { rids }
      )
      if (res.meta.status == 200) {
        this.$message.success('更新成功')
        this.assignRightDialogVisible = false
        this.getRoles()
      }
    }
  }
}
</script>

<style lang='less' scoped>
.el-tag {
  margin: 7px;
}
.bt {
  border-top: 1px solid #eee;
}
.bd {
  border-bottom: 1px solid #eee;
}
.el-row {
  display: flex;
  align-items: center;
}
.el-message-box {
  width: 100px;
}
</style>
