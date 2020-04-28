<template>
  <el-tabs tab-position="left" style="height: 100%" type="border-card" @tab-click="handleTab">
      <el-tab-pane label="基本信息">
        <div class="headerTitle">基本信息</div>
        <el-form ref="infoForm" :model="infoForm" label-width="90px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名">
                <el-input v-model="infoForm.username"></el-input>
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
                <el-button type="primary" @click="updatePwd">修改登录密码</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-form v-else :model="updatePwdForm" status-icon :rules="rules" ref="updatePwdForm" label-width="100px" style="width: 60%; margin-top: 5%">
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
            <el-button type="primary" size="small" @click="submitForm('updatePwdForm')">保存</el-button>
            <el-button size="small" @click="resetForm('updatePwdForm')">重置</el-button>
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
    let adminToken = sessionStorage.getItem('adminToken')
    this.$ajax.get('/admin/adminList', {
      params: {
        email: sessionStorage.getItem('adminEmail')
      }
    })
      .then(res => {
        if (adminToken != null) {
          if (res.data.msg.table[0].avatar) {
            this.infoForm.avatarURL = this.getUrl(res.data.msg.table[0].avatar)
            this.infoForm.avatar = res.data.msg.table[0].avatar
          } else {
            this.infoForm.avatarURL = require('@/assets/imgs/defaultHead.png')
          }
          this.$ajax.get('/admin/selfDescTags', {
            params: {
              email: sessionStorage.getItem('adminEmail')
            }
          })
            .then(res => {
              let tags = []
              res.data.msg.table.forEach(function (item) {
                tags.push(item.tag)
              })
              this.infoForm.selfDescTags = tags
            })
        }
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
      console.log(this.infoForm.avatar)
    },

    getUrl (img) {
      return process.env.VUE_APP_RESOURCE_URL + img
    },

    updateInfo: function () {
      let node = this.$refs['nativeCascader'].getCheckedNodes()[0]
      this.$ajax.post('/admin/updateInfo', {
        email: sessionStorage.getItem('adminEmail'),
        name: this.infoForm.username,
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
              }
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

<style>
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

  .el-tabs--left.el-tabs--border-card .el-tabs__item.is-left {
    text-align: center;
    line-height: 50px;
    height: 50px;
    font-size: 16px;
  }

  .el-tabs--left .el-tabs__header.is-left {
    width: 15%;
  }

  .el-tabs__nav {
    margin-top: 40px;
  }

  .el-form-item__label {
    padding: 0 20px 0 0;
  }
</style>
