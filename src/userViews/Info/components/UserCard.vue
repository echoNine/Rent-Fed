<template>
  <el-card style="margin-bottom: 20px;">
    <div slot="header">
      <span>关于我</span>
    </div>

    <div class="userHeader">
      <el-avatar :src="this.infoData.avatar" style="width: 100px; height: 100px;"></el-avatar>
      <div class="boxCenter">
        <div class="name">{{infoData.name}}</div>
        <div class="role">{{infoData.typeName}} <i class="el-icon-female" style="color: #ff8cb5"></i></div>
      </div>
    </div>

    <div class="baseInfo">
      <div class="baseTitle">基本信息</div>
      <div><i class="el-icon-phone-outline"></i><span class="infoText">{{infoData.phone}}</span></div>
      <div><i class="el-icon-email"></i><span class="infoText">{{infoData.email}}</span></div>
      <div><i class="el-icon-location-outline"></i><span class="infoText">{{infoData.native}}</span></div>
    </div>

    <div class="selfTag">
      <div class="tagTitle">自我描述</div>
      <el-tag
        :key="tag"
        type="warning"
        v-for="tag in infoData.selfDescTags">
        {{tag}}
      </el-tag>
    </div>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      inputVisible: false,
      inputValue: '',
      infoData: {
        avatar: '',
        name: '',
        typeName: '',
        sex: '',
        phone: '',
        email: '',
        native: '',
        selfDescTags: []
      }
    }
  },
  methods: {
    userAvatarUrl (img) {
      if (img) {
        return process.env.VUE_APP_RESOURCE_URL + img
      }

      return require('@/assets/imgs/defaultHead.png')
    },
    getUrl (img) {
      return process.env.VUE_APP_RESOURCE_URL + img
    }
  },
  created: function () {
    let userInfo = this.$store.getters.mustGetUser
    this.infoData.avatar = this.userAvatarUrl(userInfo.avatar)
    this.infoData.name = userInfo.name
    this.infoData.typeName = userInfo.typeName
    this.infoData.sex = userInfo.sex
    this.infoData.phone = userInfo.phone
    this.infoData.email = userInfo.email
    this.infoData.native = userInfo.native

    this.$ajax.get('/user/selfDescTags', {
      params: {
        email: sessionStorage.getItem('email')
      }
    })
      .then(res => {
        let tags = []
        res.data.msg.table.forEach(function (item) {
          tags.push(item.tag)
        })
        this.infoData.selfDescTags = tags
      })
  }
}
</script>

<style scoped>
  .userHeader {
    margin: 0 auto;
    display: table;
  }

  .boxCenter {
    padding-top: 10px;
    text-align: center;
    margin-bottom: 30px;
  }

  .name {
    font-weight: 700;
    color: #323333;
  }

  .role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
    color: #777;
  }

  .infoText {
    padding-left: 8px;
    font-size: 14px;
    line-height: 35px;
    color: rgba(0,0,0,.65);
  }

  .selfTag {
    margin-top: 18px;
  }

  .baseTitle,.tagTitle {
    border-bottom: 1px solid #dfe6ec;
    padding-top: 10px;
    padding-bottom: 15px;
    margin-bottom: 15px;
    color: #606266;
    font-size: 15px;
    font-weight: 700;
  }

  .el-tag + .el-tag {
    margin-left: 10px;
    margin-bottom: 10px;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
