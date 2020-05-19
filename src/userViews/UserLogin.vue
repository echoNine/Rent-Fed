<template>
  <div class="UserLoginDiv">
    <div class="login-container">
      <div class="login-box" v-show="isLogin">
        <h2 class="title">欢迎登录</h2>
        <el-form :model="LoginForm" :rules="LoginFormRules" ref="LoginFormRef" class="login-form">
          <el-form-item prop="email">
            <el-input v-model="LoginForm.email" prefix-icon="el-icon-user" clearable placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item prop="pwd">
            <el-input v-model="LoginForm.pwd" type="password" prefix-icon="el-icon-lock" clearable placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="btns" type="warning" @click="login">登录</el-button>
            <el-button class="btns" type="info" @click="toRegister">去注册</el-button>
          </el-form-item>
          <p style="color: #c5bcb2;font-size: 14px">测试账户: 2507388395@qq.com 密码: 123321 <el-button type="warning" plain size="mini" @click="toAdmin">管理后台</el-button></p>
        </el-form>
      </div>
      <div class="register-box"  v-show="!isLogin">
        <h2 class="title">欢迎注册</h2>
        <el-form :model="RegisterForm" :rules="RegisterFormRules" ref="RegisterFormRef" class="register-form">
          <el-form-item prop="email">
            <el-input v-model="RegisterForm.email" prefix-icon="el-icon-user" clearable></el-input>
          </el-form-item>
          <el-form-item prop="pwd">
            <el-input v-model="RegisterForm.pwd" type="password" prefix-icon="el-icon-lock" clearable></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-input v-model="RegisterForm.code" style="width: 70%; float: left" placeholder="验证码" clearable></el-input>
            <el-button style="width: 25%; padding: 11px; float: right" type="warning" @click="send">获取验证码</el-button>
          </el-form-item>
          <el-form-item>
            <el-button class="btns" type="warning" @click="register">注册</el-button>
            <el-button class="btns" type="info" @click="toLogin">去登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserLogin',
  inject: ['reload'],
  data () {
    return {
      isLogin: true,
      LoginForm: {
        email: '',
        pwd: ''
      },
      RegisterForm: {
        email: '',
        pwd: '',
        code: ''
      },
      LoginFormRules: {
        email: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      RegisterFormRules: {
        email: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: '注册邮箱格式有误' }
        ],
        pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: /^\w{6,18}$/, message: '只能包含字母、数字和下划线，长度在6~18之间' }
        ]
      }
    }
  },
  created () {
    if (this.$route.query.isLogin == null) {
      this.isLogin = true
    } else {
      this.isLogin = this.$route.query.isLogin
    }
  },
  methods: {
    toLogin () {
      this.isLogin = true
      this.RegisterForm.email = ''
      this.RegisterForm.pwd = ''
      this.RegisterForm.code = ''
    },
    toAdmin () {
      this.$router.push('/Login')
    },
    toRegister () {
      this.isLogin = false
      this.LoginForm.email = ''
      this.LoginForm.pwd = ''
    },
    login () {
      this.$refs.LoginFormRef.validate(valid => {
        if (valid) {
          this.$ajax.post('/frontend/user/login', {
            email: this.LoginForm.email,
            pwd: this.LoginForm.pwd
          }).then(res => {
            if (res.data.success) {
              this.$message.success({
                message: '登录成功！'
              })
              this.$store.dispatch('setUser', res.data.msg)
              this.$router.push('/')
            } else {
              this.$message.error({
                message: res.data.msg
              })
            }
          })
          // 对服务端的请求
        } else {
          return false
        }
      })
    },
    register () {
      this.$refs.RegisterFormRef.validate(valid => {
        if (valid) {
          this.$ajax.post('/frontend/user/register', {
            email: this.RegisterForm.email,
            pwd: this.RegisterForm.pwd,
            code: this.RegisterForm.code
          }).then(res => {
            if (res.data.success) {
              this.$message.success({
                message: '恭喜您，注册成功！请登录'
              })
              this.isLogin = true
            } else {
              this.$message.error({
                message: res.data.msg
              })
            }
          })
          // 对服务端的请求
        } else {
          return false
        }
      })
    },
    send () {
      this.$refs.RegisterFormRef.validate((valid) => {
        if (valid) {
          this.$ajax.post('/frontend/user/send', {
            email: this.RegisterForm.email,
            pwd: this.RegisterForm.pwd
          }).then(res => {
            if (res.data.success) {
              this.$message.success({
                message: '验证码发送成功，请及时查收！'
              })
            } else {
              this.$message.error({
                message: res.data.msg
              })
            }
          })
          // 对服务端的请求
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .UserLoginDiv {
    width: 100%;
    height: 100%;
    .login-container {
      min-height: 100%;
      width: 100%;
      background: url(../assets/imgs/userBg.jpg) center center no-repeat;
      background-size: cover;
      overflow: hidden;
      text-align: center;
    }

    .login-box, .register-box {
      width: 500px;
      position: absolute;
      left: 50%;
      top: 48%;
      transform: translate(-50%, -50%);
      background-color: #fbfbfb;
      border: 1px solid #bab7b3;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
      border-radius: 5px;
      opacity: 0.9;
    }

    .login-box {
      height: 320px;
    }

    .register-box {
      height: 380px;
    }

    .title {
      margin-top: 35px;
      color: #5d6b7b;
    }

    .login-form, .register-form {
      position: absolute;
      bottom: 25px;
      width: 100%;
      padding: 0 40px;
      box-sizing: border-box;
    }

    .btns {
      margin: 0 30px;
    }
  }
</style>
