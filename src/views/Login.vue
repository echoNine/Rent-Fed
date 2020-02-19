<template>
  <div class="login-container">
    <el-form v-show="!isRegister" :model="loginForm" status-icon :rules="rules" ref="loginForm" label-width="100px"
             class="login-form">
      <h3 class="title">欢迎登录</h3>
      <el-form-item label="用户名" prop="emailOne">
        <el-input type="text" v-model="loginForm.emailOne" placeholder="邮箱" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="passwordOne">
        <el-input type="password" v-model="loginForm.passwordOne" autocomplete="off"></el-input>
      </el-form-item>
      <div class="btn">
        <el-button type="primary" @click="login()" style="margin-right: 10%">登录</el-button>
        <el-button type="primary" @click="isRegister = true">去注册</el-button>
      </div>
    </el-form>

    <el-form v-show="isRegister" :model="registerForm" status-icon :rules="rules" ref="registerForm" label-width="100px"
             class="login-form">
      <h3 class="title">欢迎注册</h3>
      <el-form-item label="用户名" prop="email">
        <el-input type="text" v-model="registerForm.email" placeholder="邮箱" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="registerForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <el-input type="text" style="width: 50%; margin-right: 10%;" v-model="registerForm.code" autocomplete="off"></el-input>
        <el-button type="primary" @click="send()" style="width: 25%; padding: 12px;">获取验证码</el-button>
      </el-form-item>
      <div class="btn">
        <el-button type="primary" @click="register()" style="margin-right: 10%">注册</el-button>
        <el-button type="primary" @click="isRegister = false">去登录</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      isRegister: false,
      loginForm: {
        emailOne: '',
        passwordOne: ''
      },
      registerForm: {
        email: '',
        password: ''
      },
      rules: {
        emailOne: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        passwordOne: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: '邮箱格式不正确' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: /^\w{6,18}$/, message: '只能包含字母、数字和下划线，长度在6~18之间' }
        ]
      }
    }
  },
  methods: {
    login () {
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          this.$ajax.post('/user/login', {
            email: this.loginForm.emailOne,
            password: this.loginForm.passwordOne
          }).then(res => {
            if (res.data.success) {
              this.$message.success({
                message: '登录成功！'
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
    },

    register () {
      this.$refs['registerForm'].validate((valid) => {
        if (valid) {
          this.$ajax.post('/user/register', {
            email: this.registerForm.email,
            password: this.registerForm.password,
            code: this.registerForm.code
          }).then(res => {
            if (res.data.success) {
              this.$message.success({
                message: '恭喜您，注册成功！'
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
    },

    send () {
      this.$refs['registerForm'].validate((valid) => {
        if (valid) {
          this.$ajax.post('/user/send', {
            email: this.registerForm.email,
            password: this.registerForm.password
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

<style>
  .login-container {
    min-height: 100%;
    width: 100%;
    background: url(../assets/bg.jpg) center center no-repeat;
    overflow: hidden
  }

  .el-input {
    height: 47px;
    width: 85%;
  }

  .login-form {
    position: absolute;
    width: 530px;
    max-width: 100%;
    font-size: 26px;
    font-weight: 700;
    left: 50%;
    top: 48%;
    transform: translate(-50%, -50%);
    background-color: #fbfbfb;
    border: 1px solid #bab7b3;
    box-shadow: 2px 2px 2px #b1aeaa;
    border-radius: 5px;
  }

  .el-form-item__error {
    left: 8%;
  }

  .btn{
    padding-top: 2%;
    margin-bottom: 7%;
  }
</style>
