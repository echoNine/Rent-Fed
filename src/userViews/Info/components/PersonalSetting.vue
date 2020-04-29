<template>
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
      <el-form ref="accountForm" :model="accountForm" v-if="toChangePwd">
        <el-row style="margin-left: 10px;">
          <el-col :span="18">
            <el-form-item label="用户账号">
              <el-input v-model="accountForm.email"></el-input>
            </el-form-item>
            <el-form-item label="登录密码">
              <el-input v-model="accountForm.pwd"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="warning" @click="updatePwd">修改登录密码</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form v-else :model="updatePwdForm" status-icon :rules="rules" ref="updatePwdForm" label-width="100px"
               style="width: 60%; margin-top: 5%">
        <el-form-item label="原密码">
          <el-input type="password" v-model="updatePwdForm.oldPwd" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input type="password" v-model="updatePwdForm.newPwd" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input type="password" v-model="updatePwdForm.checkNewPwd" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" size="small" @click="submitForm('updatePwdForm')">保存</el-button>
          <el-button type="warning" plain size="small" @click="resetForm('updatePwdForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
let nativeList = require('@/assets/js/city.json')
export default {
  name: 'PersonalSetting',
  inject: ['reload'],
  data () {
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
        pwd: ''
      },
      updatePwdForm: {
        oldPwd: '',
        newPwd: '',
        checkNewPwd: ''
      },
      toChangePwd: true,
      inputVisible: false,
      inputValue: '',
      options: nativeList
    }
  },
  created: function () {
    let userInfo = this.$store.getters.mustGetUser
    this.infoData.avatarURL = this.getUrl(userInfo.avatar)
    this.infoData.avatar = userInfo.avatar

    this.$ajax.get('/user/selfDescTags').then(res => {
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
      this.$ajax.post('/user/updateInfo', {
        name: this.infoData.name,
        sex: this.infoData.sex,
        phone: this.infoData.phone,
        native: node.pathLabels[0] + node.pathLabels[1],
        avatar: this.infoData.avatar,
        selfDescTags: this.infoData.selfDescTags
      })
        .then(res => {
          if (res.data.success) {
            this.$ajax.get('/user/userInfo')
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
      this.toChangePwd = false
    },
    handleTab: function () {
      this.toChangePwd = true
    }
  }
}
</script>

<style scoped>
  .avatarImg {
    width: 160px;
    height: 160px;
    margin-left: 70px;
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

  .el-tabs__nav {
    margin-top: 23px;
  }

  .el-form-item__label {
    padding: 0 20px 0 0;
  }

  .el-tabs--border-card > .el-tabs__header {
    background-color: #faf8f3;
  }

  /deep/ .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active,
  /deep/ .el-tabs--border-card > .el-tabs__header .el-tabs__item:not(.is-disabled):hover {
    color: #ff961e;
  }

  /deep/ .el-radio__input.is-checked .el-radio__inner {
    border-color: #ff961e;
    background: #ff961e;
  }

  /deep/ .el-radio__input.is-checked + .el-radio__label {
    color: #ff961e;
  }

  /deep/ .el-tabs--border-card > .el-tabs__header .el-tabs__item:not(.is-disabled):hover {
    color: #ff961e;
  }
</style>
