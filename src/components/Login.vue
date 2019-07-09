<template>
  <div id="login">
    <div id="login-login">
     
     <div class="avatar">
       <img src="../assets/3.jpg" alt="">
     </div>
     <el-form :model='loginForm' :rules="rules" ref="loginForm">
        <el-form-item prop='username'>
            <el-input v-model="loginForm.username" placeholder="账号" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item prop='password'>
            <el-input v-model="loginForm.password" placeholder="密码"   prefix-icon="iconfont icon-lock_fill " type='password'></el-input>
        </el-form-item>
        <el-form-item class="btns">
        <el-button type="primary" @click="login" class="btn">login</el-button>
      <el-button type="info" @click="reset" class="btn">reset</el-button>
        </el-form-item>
     </el-form>
     
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 账号密码表单中双向绑定的数据
      loginForm:{
        username:'admin',
        password:'123456'
      },
      rules:{
        //验证账号
        username:[
            { required: true, message: '请输入账号', trigger: 'blur' },
            { min: 3, max: 10, message: '账号长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        //验证密码
        password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 10, message: '密码长度在 6 到 18 个字符', trigger: 'blur' }
        ]

      }
    }
  },
  methods: {
    reset(){
      this.$refs.loginForm.resetFields()
    },
    login(){
      this.$refs.loginForm.validate(async flag=>{
        if(flag){
          const {data:res} = await this.axios.post('login',this.loginForm)
         if(res.meta.status==200){
            console.log(res.meta.msg);
            //把token存到session中
            sessionStorage.setItem('token',res.data.token)
            this.$router.push('/home')
              this.$message({
              message: res.meta.msg,
              type: 'success'
            })
         }else{
            console.log(res.meta.msg);
            this.$message({
              message: res.meta.msg,
              type: 'warning'
            })
         }
        }
      })
    }
  },

  created () {
  }
}
</script>

<style lang='less' scoped>
  #login{
    background:-webkit-radial-gradient(bottom,skyblue,#369,pink);
    // 
    // red,#000,#000,#000,red,red,red,#000
    height: 100%;
    #login-login{
      width: 450px;
      height: 300px;
      background:-webkit-radial-gradient(top11,skyblue,#369,pink);
      border-radius: 10px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      // border: 1px solid #000 ;
      box-shadow: 0 0 30px 1px skyblue;
      // border-top: 4px solid pink;
      // border-right: 4px solid yellow;
      // border-left: 4px solid red;
      // border-bottom: 4px solid yellowgreen;
      .avatar{
        position: absolute;
        width: 130px;
        height: 130px;
        border: 1px solid #ccc;   
        border-radius: 50%; 
        padding: 10px;
        left: 5%;
        transform: translate(-50%,-50%);
        background: #fff;
        box-shadow: 0 0 10px 10px #ccc;
        img{
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: #ccc;
        }
      }
      .el-form{
      position: absolute;
      width: 100%;
      padding:0 30px;
      box-sizing: border-box;
      bottom: 0px;
      .btns{
          float: right;
      }
    }
    }
   
  }

</style>
