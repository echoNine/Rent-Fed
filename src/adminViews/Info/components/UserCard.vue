<template>
  <div class="UserCardDiv">
    <el-card style="margin-bottom: 20px;">
      <div slot="header" class="clearfix">
        <span>关于我</span>
      </div>

      <div class="userHeader">
        <el-avatar :src="this.infoData.avatar" style="width: 100px; height: 100px;"></el-avatar>
        <div class="boxCenter">
          <div class="admin-name">{{infoData.name}}</div>
          <div class="role">管理员 <i class="el-icon-female" style="color: #ff8cb5" v-show="isFemale"/><i class="el-icon-male" style="color: #93d4ff" v-show="!isFemale"/></div>
        </div>
      </div>

      <div class="baseInfo">
        <div class="baseTitle">基本信息</div>
        <div><i class="el-icon-education"></i><span class="infoText">{{infoData.major}}</span></div>
        <div><i class="el-icon-phone-outline"></i><span class="infoText">{{infoData.phone}}</span></div>
        <div><i class="el-icon-email"></i><span class="infoText">{{infoData.email}}</span></div>
        <div><i class="el-icon-location-outline"></i><span class="infoText">{{infoData.native}}</span></div>
      </div>

      <div class="selfTag">
        <div class="tagTitle">自我描述</div>
        <el-tag
          :key="index"
          v-for="(tag, index) in infoData.selfDescTags">
          {{tag}}
        </el-tag>
      </div>
    </el-card>
  </div>
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
        sex: '',
        phone: '',
        email: '',
        major: '',
        native: '',
        selfDescTags: []
      },
      isFemale: ''
    }
  },
  methods: {
    getUrl (img) {
      return process.env.VUE_APP_RESOURCE_URL + img
    }
  },
  created: function () {
    this.$ajax.get('/backend/admin/getAdminInfo')
      .then(res => {
        if (res.data.msg.table[0].avatar) {
          this.infoData.avatar = this.getUrl(res.data.msg.table[0].avatar)
        } else {
          this.infoData.avatar = require('@/assets/imgs/defaultHead.png')
        }
        this.infoData.name = res.data.msg.table[0].name
        this.infoData.sex = res.data.msg.table[0].sex
        this.isFemale = this.infoData.sex === '女'
        this.infoData.phone = res.data.msg.table[0].phone
        this.infoData.email = res.data.msg.table[0].email
        this.infoData.major = res.data.msg.table[0].major
        this.infoData.native = res.data.msg.table[0].native
        this.$ajax.get('/backend/admin/selfDescTags')
          .then(res => {
            let tags = []
            res.data.msg.table.forEach(function (item) {
              tags.push(item.tag)
            })
            this.infoData.selfDescTags = tags
          })
      })
  }
}
</script>

<style lang="scss">
  .UserCardDiv {
    width: 100%;
    height: 100%;
    .userHeader {
      margin: 0 auto;
      display: table;
    }

    .boxCenter {
      padding-top: 10px;
      text-align: center;
      margin-bottom: 30px;
    }

    .admin-name {
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
  }
</style>
