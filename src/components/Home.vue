<template>
  <el-container class="home">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 下方主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="toggleflag? '64px':'200px'">
        <div class="toggle" @click="toggleflag=!toggleflag"><i class="el-icon-menu hover" ></i></div>
        <el-menu
          background-color="#333f"
          text-color="#fff"
          active-text-color="#369"
          :unique-opened="true"
          :collapse="toggleflag"
          :collapse-transition="false"
          :router="true"
          :default-active='defActive'>
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id"  >
            <template slot="title">
              <i class="icon" :class="iconObject[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/'+subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="setDefActive('/'+subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体 -->
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menulist: [],
      iconObject: {
        '125': 'iconfont icon-users',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      toggleflag: false,
      defActive:'',

    }
  },

  methods: {
    logout() {
      sessionStorage.removeItem('token')
      this.$router.push('/login')
      this.$message('退出成功')
    },
    // async await 让异步操作做更加简单, async 修饰函数. await 修饰promise 实例对象,
    async getMenuList() {
      //向服务器发送请求,并且用解构赋值来接受这个从数据库返回的值;
      var { data: res } = await this.axios.get('menus')
      //打印返回的值
      //这个是用来判断是否接收成功如果不成功 弹出错误信息;
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      this.$message.success(res.meta.msg)
    },
    setDefActive(path){
     this.defActive=path
      sessionStorage.setItem('path',path)
    }
  },
  //声明周期函数,created可以操作数据和方法,
  created() {
    this.getMenuList()
    this.defActive = sessionStorage.getItem('path')
  }
}
</script>

<style lang='less' scoped>
.home {
  height: 100%;
  .el-header {
    display: flex;
    justify-content: space-between;
    background: #333f;
    align-items: center;
    > div {
      padding-left: 15px;
      display: flex;
      align-items: center;
      color: #fff;
      font-size: 25px;
    }
  }
  .el-aside {
    background: #333f;
  }
  .el-main {
    background:rgba(199,237,204);
  }
  .icon {
    margin-right: 10px;
  }
  .el-menu {
    border-right: none;
  }
  .toggle {
    cursor: pointer;
    width: 200px;
    background-color: #333f;
    text-align: center;
    line-height: 19px;
    letter-spacing: 6px;
  }
}

</style>
