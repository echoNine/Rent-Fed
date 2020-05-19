<template>
  <div class="UserPersonSettingDiv">
    <el-tabs tab-position="top" style="height: 97%" type="border-card" @tab-click="handleTab">
      <el-tab-pane label="基本信息">
        <el-form ref="infoData" :model="infoData" label-width="90px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名">
                <el-input v-model="infoData.name"></el-input>
              </el-form-item>
              <el-form-item label="性别">
                <el-radio-group v-model="infoData.sex">
                  <el-radio label="男"></el-radio>
                  <el-radio label="女"></el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="联系电话">
                <el-input v-model="infoData.phone"></el-input>
              </el-form-item>
              <el-form-item label="所属省市">
                <el-cascader :options="options" v-model="infoData.native" ref="nativeCascader" clearable></el-cascader>
              </el-form-item>
              <el-form-item label="自我描述">
                <el-tag
                  :key="tag"
                  v-for="tag in infoData.selfDescTags"
                  closable
                  :disable-transitions="false"
                  type="warning"
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
                <el-button v-else class="button-new-tag" plain size="small" type="warning" @click="showInput">+
                </el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="warning" @click="updateInfo">更新基本信息</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <el-avatar class="avatarImg" :src="infoData.avatarURL"></el-avatar>
                <el-upload
                  name="files"
                  class="avatar-uploader"
                  :action="uploadUrl"
                  :show-file-list="false"
                  :on-success="getFilePath">
                  <el-button size="small" icon="el-icon-upload2" type="warning" plain style="margin-left: 105px">更换头像
                  </el-button>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="账户管理">
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
                <el-button type="warning" @click="updatePwd">修改登录密码</el-button>
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
      infoData: {
        name: '',
        sex: '',
        phone: '',
        native: '',
        avatar: '',
        avatarURL: '',
        selfDescTags: []
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
    let userInfo = this.$store.getters.mustGetUser
    this.infoData.avatarURL = this.getUrl(userInfo.avatar)
    this.infoData.avatar = userInfo.avatar
    this.accountForm.email = userInfo.email
    this.$ajax.get('/frontend/user/selfDescTags').then(res => {
      let tags = []
      res.data.msg.table.forEach(function (item) {
        tags.push(item.tag)
      })
      this.infoData.selfDescTags = tags
    })
  },
  methods: {
    handleClose (tag) {
      this.infoData.selfDescTags.splice(this.infoData.selfDescTags.indexOf(tag), 1)
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
        this.infoData.selfDescTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    getFilePath (res, file) {
      this.infoData.avatarURL = URL.createObjectURL(file.raw)
      this.infoData.avatar = res.msg[0]
    },
    userAvatarUrl (img) {
      if (img) {
        return process.env.VUE_APP_RESOURCE_URL + img
      }

      return require('@/assets/imgs/defaultHead.png')
    },
    getUrl (img) {
      return process.env.VUE_APP_RESOURCE_URL + img
    },

    updateInfo: function () {
      let node = this.$refs['nativeCascader'].getCheckedNodes()[0]
      this.$ajax.post('/frontend/user/updateInfo', {
        name: this.infoData.name,
        sex: this.infoData.sex,
        phone: this.infoData.phone,
        native: node.pathLabels[0] + node.pathLabels[1],
        avatar: this.infoData.avatar,
        selfDescTags: this.infoData.selfDescTags
      })
        .then(res => {
          if (res.data.success) {
            this.$ajax.get('/frontend/user/getUserInfo')
              .then(res => {
                this.$store.dispatch('setUser', res.data.msg)
                this.$message.success({
                  duration: 1000,
                  message: '信息修改成功！',
                  onClose: () => {
                    this.$loading().close()
                    this.reload()
                  }
                })
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
          this.$ajax.post('/frontend/user/updatePwd', {
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
                    this.$router.push('/UserLogin')
                    window.location.reload()
                  }
                })
              } else {
                this.$message.error({
                  duration: 1000,
                  message: '密码修改失败'
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
  .UserPersonSettingDiv {
    width: 100%;
    height: 100%;
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
      line-height: 50px;
      height: 50px;
      font-size: 16px;
    }

    .el-tabs--border-card > .el-tabs__content {
      padding: 20px;
    }

    .el-tabs--left .el-tabs__header.is-left {
      width: 15%;
    }

    .el-tabs__item {
      font-size: 16px;
    }

    .el-form-item__label {
      padding: 0 20px 0 0;
    }

    .el-tabs--border-card > .el-tabs__header {
      background-color: #faf8f3;
    }

    .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active {
      color: #ff961e;
      height: 64px;
      line-height: 64px;
    }

    .el-tabs--border-card > .el-tabs__header .el-tabs__item:not(.is-disabled):hover {
      color: #ff961e;
    }

    .el-radio__input.is-checked .el-radio__inner {
      border-color: #ff961e;
      background: #ff961e;
    }

    .el-radio__input.is-checked + .el-radio__label {
      color: #ff961e;
    }

    .el-cascader-node.in-active-path, .el-cascader-node.is-active, .el-cascader-node.is-selectable.in-checked-path {
      color: #ff961e;
    }
  }
</style>
