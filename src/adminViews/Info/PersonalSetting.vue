<template>
  <div class="PersonSettingDiv">
    <el-tabs tab-position="left" style="height: 100%" type="border-card" @tab-click="handleTab">
      <el-tab-pane label="基本信息">
        <div class="headerTitle">基本信息</div>
        <el-form ref="infoForm" :model="infoForm" label-width="90px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名">
                <el-input v-model="infoForm.name"></el-input>
              </el-form-item>
              <el-form-item label="性别">
                <el-radio-group v-model="infoForm.sex">
                  <el-radio label="男"></el-radio>
                  <el-radio label="女"></el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="联系电话">
                <el-input v-model="infoForm.phone"></el-input>
              </el-form-item>
              <el-form-item label="所属省市">
                <el-cascader :options="options" v-model="infoForm.native" ref="nativeCascader" clearable></el-cascader>
              </el-form-item>
              <el-form-item label="主修专业">
                <el-input v-model="infoForm.major"></el-input>
              </el-form-item>
              <el-form-item label="自我描述">
                <el-tag
                  :key="tag"
                  v-for="tag in infoForm.selfDescTags"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag)">
                  {{tag}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm"
                >
                </el-input>
                <el-button v-else class="button-new-tag" plain size="small" type="primary" @click="showInput">+</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="updateInfo">更新基本信息</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <el-avatar class="avatarImg" :src="infoForm.avatarURL"></el-avatar>
                <el-upload
                  name="files"
                  class="avatar-uploader"
                  :action="uploadUrl"
                  :show-file-list="false"
                  :on-success="getFilePath">
                  <el-button size="small" icon="el-icon-upload2" type="primary" plain style="margin-left: 105px">更换头像</el-button>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="账户管理">
        <div class="headerTitle">账户管理</div>
        <el-form ref="accountForm" :model="accountForm" status-icon :rules="accountRules">
          <el-row style="margin-left: 10px;">
            <el-col :span="18">
              <el-form-item label="用户账号">
                <el-input v-model="accountForm.email" disabled></el-input>
              </el-form-item>
              <el-form-item label="登录密码" prop="pwd">
                <el-input type="password" v-model="accountForm.pwd"></el-input>
              </el-form-item>
              <el-form-item label="新密码" prop="newPwd">
                <el-input type="password" v-model="accountForm.newPwd"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="checkNewPwd">
                <el-input type="password" v-model="accountForm.checkNewPwd"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="updatePwd">修改登录密码</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
let nativeList = require('@/assets/js/city.json')
export default {
  name: 'PersonalSetting',
  inject: ['reload'],
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.accountForm.newPwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      uploadUrl: process.env.VUE_APP_BASE_URL + '/file/upload',
      infoForm: {
        name: '',
        sex: '',
        phone: '',
        native: '',
        major: '',
        selfDescTags: [],
        avatar: '',
        avatarURL: ''
      },
      accountForm: {
        email: '',
        pwd: '',
        newPwd: '',
        checkNewPwd: ''
      },
      inputVisible: false,
      inputValue: '',
      options: nativeList,
      accountRules: {
        checkNewPwd: { validator: validatePass, trigger: 'blur' }
      }
    }
  },
  created: function () {
    this.$ajax.get('/backend/admin/getAdminInfo')
      .then(res => {
        if (res.data.msg.table[0].avatar) {
          this.infoForm.avatarURL = this.getUrl(res.data.msg.table[0].avatar)
          this.infoForm.avatar = res.data.msg.table[0].avatar
        } else {
          this.infoForm.avatarURL = require('@/assets/imgs/defaultHead.png')
        }
        this.accountForm.email = res.data.msg.table[0].email
        this.$ajax.get('/backend/admin/selfDescTags')
          .then(res => {
            let tags = []
            res.data.msg.table.forEach(function (item) {
              tags.push(item.tag)
            })
            this.infoForm.selfDescTags = tags
          })
      })
  },
  methods: {
    handleClose (tag) {
      this.infoForm.selfDescTags.splice(this.infoForm.selfDescTags.indexOf(tag), 1)
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm () {
      let inputValue = this.inputValue
      if (inputValue) {
        this.infoForm.selfDescTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    getFilePath (res, file) {
      this.infoForm.avatarURL = URL.createObjectURL(file.raw)
      this.infoForm.avatar = res.msg[0]
    },
    getUrl (img) {
      return process.env.VUE_APP_RESOURCE_URL + img
    },
    updateInfo: function () {
      let node = this.$refs['nativeCascader'].getCheckedNodes()[0]
      this.$ajax.post('/backend/admin/updateInfo', {
        name: this.infoForm.name,
        sex: this.infoForm.sex,
        phone: this.infoForm.phone,
        native: node.pathLabels[0] + node.pathLabels[1],
        avatar: this.infoForm.avatar,
        major: this.infoForm.major,
        selfDescTags: this.infoForm.selfDescTags
      })
        .then(res => {
          if (res.data.success) {
            this.$message.success({
              duration: 1000,
              message: '信息修改成功！',
              onClose: () => {
                this.$loading().close()
                this.$router.push('/Info/PersonalCenter')
                window.location.reload()
              }
            })
          }
        })
        .catch(() => {
          this.$loading().close()
        })
    },
    updatePwd: function () {
      this.$refs['accountForm'].validate((valid) => {
        if (valid) {
          this.$ajax.post('/backend/admin/updatePwd', {
            pwd: this.accountForm.pwd,
            newPwd: this.accountForm.newPwd
          })
            .then(res => {
              if (res.data.success) {
                this.$message.success({
                  duration: 1000,
                  message: '密码修改成功！请重新登录',
                  onClose: () => {
                    this.$loading().close()
                    this.$router.push('/Login')
                  }
                })
              } else {
                this.$message.error({
                  duration: 1000,
                  message: '密码修改失败',
                  onClose: () => {
                    this.$loading().close()
                  }
                })
                this.toChangePwd = true
              }
            })
            .catch(() => {
              this.$loading().close()
            })
        }
      })
    },
    handleTab: function () {
      this.toChangePwd = true
    }
  }
}
</script>

<style lang="scss">
  .PersonSettingDiv {
    width: 100%;
    .headerTitle {
      color: rgba(0, 0, 0, .85);
      font-weight: 500;
      font-size: 20px;
      line-height: 28px;
      margin: 10px 0 30px 10px;
    }

    .avatarImg {
      width: 160px;
      height: 160px;
      margin-left: 70px;
    }

    .el-tag {
      margin-right: 10px;
    }

    .el-tabs--left.el-tabs--border-card .el-tabs__item.is-left {
      text-align: center;
      line-height: 60px;
      height: 60px;
      font-size: 18px;
    }

    .el-tabs--left .el-tabs__header.is-left {
      width: 15%;
      height: 575px;
    }

    .el-tabs__nav {
      margin-top: 40px;
    }

    .el-form-item__label {
      padding: 0 20px 0 0;
    }
  }
</style>
