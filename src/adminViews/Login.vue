<template>
  <div class="login-container">
    <el-dialog title="完善个人信息" style="text-align: left" :visible.sync="dialogFormVisible">
      <el-form :model="infoForm" :rules="rules" ref="infoForm" label-width="95px">
        <el-form-item label="姓名" prop="name" required>
          <el-input v-model="infoForm.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex" required>
          <el-radio-group v-model="infoForm.sex">
            <el-radio label="男" value="男"></el-radio>
            <el-radio label="女" value="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="身份证号" prop="cardNum" required>
          <el-input v-model="infoForm.cardNum" clearable></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone" required>
          <el-input v-model="infoForm.phone" clearable></el-input>
        </el-form-item>
        <el-form-item label="所属省市" prop="native" required>
          <el-cascader :options="options" v-model="infoForm.native" ref="nativeCascader" clearable></el-cascader>
        </el-form-item>
        <el-form-item label="主修专业" required>
          <el-input v-model="infoForm.major" clearable></el-input>
        </el-form-item>
        <el-form-item label="个人头像" prop="avatarURL" required>
          <el-upload
            name="files"
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="getFilePath"
            :on-remove="handleRemove"
            :on-preview="handlePictureCardPreview">
            <img v-if="infoForm.avatarURL" :src="infoForm.avatarURL" class="avatar">
            <span v-if="infoForm.avatarURL" class="el-upload-action" @click.stop="handleRemove()">
                    <i class="el-icon-delete"></i>
                </span>
            <i v-else class="el-icon-upload2 avatar-uploader-icon" stop></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitInfo">提 交</el-button>
      </div>
    </el-dialog>
    <div class="login-box" v-show="isLogin">
      <h2 class="title">欢迎登录</h2>
      <el-form :model="LoginForm" :rules="LoginFormRules" ref="LoginFormRef" class="login-form">
        <el-form-item prop="email">
          <el-input v-model="LoginForm.email" prefix-icon="el-icon-user" clearable></el-input>
        </el-form-item>
        <el-form-item prop="pwd">
          <el-input v-model="LoginForm.pwd" type="password" prefix-icon="el-icon-lock" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="btns" type="primary" @click="login">登录</el-button>
          <el-button class="btns" type="info" @click="toRegister">去注册</el-button>
        </el-form-item>
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
        <el-form-item prop="licenseKey">
          <el-input v-model="RegisterForm.licenseKey" type="password" placeholder="授权码" clearable></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="RegisterForm.code" style="width: 70%; float: left" placeholder="验证码" clearable></el-input>
          <el-button style="width: 25%; padding: 11px; float: right" type="primary" @click="send">获取验证码</el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="btns" type="primary" @click="register">注册</el-button>
          <el-button class="btns" type="info" @click="toLogin">去登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
let nativeList = require('@/assets/js/city.json')
export default {
  name: 'Login',
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
        code: '',
        licenseKey: ''
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
      },
      uploadUrl: process.env.VUE_APP_BASE_URL + '/file/upload',
      dialogFormVisible: false,
      options: nativeList,
      infoForm: {
        name: '',
        sex: '',
        cardNum: '',
        phone: '',
        native: '',
        major: '',
        avatar: '',
        avatarURL: ''
      }
    }
  },
  methods: {
    toLogin () {
      this.isLogin = true
      this.RegisterForm.email = ''
      this.RegisterForm.pwd = ''
      this.RegisterForm.code = ''
    },
    toRegister () {
      this.isLogin = false
      this.LoginForm.email = ''
      this.LoginForm.pwd = ''
    },
    login () {
      this.$refs.LoginFormRef.validate(valid => {
        if (valid) {
          this.$ajax.post('/admin/login', {
            email: this.LoginForm.email,
            pwd: this.LoginForm.pwd
          }).then(res => {
            console.log(res)
            if (res.data.success) {
              this.$message.success({
                message: '登录成功！'
              })
              window.sessionStorage.setItem('adminToken', res.data.token)
              window.sessionStorage.setItem('adminEmail', this.LoginForm.email)
              let adminToken = sessionStorage.getItem('adminToken')
              this.$ajax.get('/admin/adminList', {
                params: {
                  adminEmail: sessionStorage.getItem('adminEmail')
                }
              })
                .then(res => {
                  if (adminToken != null) {
                    if (res.data.msg.table[0].username == null) {
                      this.dialogFormVisible = true
                    } else {
                      this.dialogFormVisible = false
                      this.$router.push('/ShowData')
                    }
                  }
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
    getFilePath (res, file) {
      this.infoForm.avatarURL = URL.createObjectURL(file.raw)
      this.infoForm.avatar = res.msg[0]
    },
    getUrl (img) {
      return process.env.VUE_APP_RESOURCE_URL + img
    },
    handleRemove () {
      console.log(1)
      this.infoForm.avatarURL = ''
    },
    submitInfo () {
      let node = this.$refs['nativeCascader'].getCheckedNodes()[0]
      this.$ajax.post('/admin/perfectInfo', {
        email: sessionStorage.getItem('adminEmail'),
        name: this.infoForm.name,
        sex: this.infoForm.sex,
        cardNum: this.infoForm.cardNum,
        phone: this.infoForm.phone,
        native: node.pathLabels[0] + node.pathLabels[1],
        major: this.infoForm.major,
        avatar: this.infoForm.avatar
      })
        .then(res => {
          if (res.data.success) {
            this.$message.success({
              duration: 1000,
              message: '个人信息已完善！',
              onClose: () => {
                this.dialogFormVisible = false
                this.$loading().close()
                this.$router.push('/ShowData')
              }
            })
          }
        })
        .catch(() => {
          this.$loading().close()
        })
    },
    register () {
      this.$refs.RegisterFormRef.validate(valid => {
        if (valid) {
          this.$ajax.post('/admin/register', {
            email: this.RegisterForm.email,
            pwd: this.RegisterForm.pwd,
            code: this.RegisterForm.code,
            licenseKey: this.RegisterForm.licenseKey,
            nowTime: this.$moment(new Date()).format('YYYY-MM-DD')
          }).then(res => {
            if (res.data.success) {
              this.$message.success({
                message: '恭喜您，注册成功！请登录'
              })
              this.reload()
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
          this.$ajax.post('/admin/send', {
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

<style scoped>
  .login-container {
    min-height: 100%;
    width: 100%;
    background: url(../assets/imgs/adminBg.jpg) center center no-repeat;
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
    height: 420px;
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

  .avatar-uploader {
    width: 120PX;
    height: 120px;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    background: url('../assets/imgs/defaultHead.png') no-repeat;
    background-size: 100% 100%;
  }

  .avatar-uploader-icon {
    font-size: 0;
    color: #fff;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }

  .avatar-uploader-icon:hover {
    font-size: 28px;
    background-color: rgba(0, 0, 0, .3);
  }

  .avatar {
    position: relative;
    width: 120px;
    height: 120px;
    display: block;
  }

  .el-upload-action {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    font-size: 0;
    color: #fff;
    text-align: center;
    line-height: 120px;

  }

  .el-upload-action:hover {
    font-size: 20px;
    background-color: #000;
    background-color: rgba(0, 0, 0, .3)
  }
</style>
