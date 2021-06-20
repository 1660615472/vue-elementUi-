<template>
  <div class="login">
    <div class="login_context">
      <!-- 头部图片 -->
      <div class="login_logo">
        <img src="~assets/img/logo.png" alt="" />
      </div>
      <!-- 登录表单 -->
      <div class="login_form">
        <el-form
          ref="loginFormRel"
          :rules="loginFormRules"
          class="login_box"
          :model="loginForm"
        >
          <el-form-item prop="username">
            <el-input v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="loginForm.password"></el-input>
          </el-form-item>
          <el-form-item class="button">
            <el-button type="primary" @click="Userlogin()"
              >登录</el-button
            >
            <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {login} from "network/login/login.js"
export default {
  name: "Login",
  data() {
    return {
      //登录信息
      loginForm: {
        username: "",
        password: "",
      },
      ruleForm: {
        name: "",
      },
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 6 个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    Userlogin(){
      //规则校验成功登陆
      this.$refs.loginFormRel.validate(vaild=>{
        //console.log('点击了登陆')
        if(!vaild) return;
        login(this.loginForm).then(res=>{
         // console.log(res)
          if(res.data.meta.status != 200){
            this.$message.error('登录失败')
          }else{
            this.$message.success('登录成功');
            window.sessionStorage.setItem('token',res.data.data.token);
            //跳转home页面
            this.$router.push('/home')
          }
        })
      })
    },
   /*  resetForm(formName) {
      this.$refs[formName].resetFields();
    }, */
  },
};
</script>

<style scoped>
.login {
  height: 100%;
  background: rgb(43, 75, 107);
}
.login_context {
  width: 450px;
  height: 300px;
  background: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 8px;
  box-shadow: 0 0 2px 5px #ddd;
}
.login_context .login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.login_logo {
  width: 150px;
  height: 150px;
  position: absolute;
  top: -75px;
  left: 50%;
  margin-left: -75px;
  border: 10px solid #eee;
  border-radius: 100%;
  background: rgba(170, 165, 165, 0.767);
  /*   padding: 10px; */
}
.login_logo img {
  height: 100%;
  width: 100%;
  border-radius: 100%;
}
.button {
  position: relative;
  left: 130px;
}
</style>