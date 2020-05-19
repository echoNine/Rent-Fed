<template>
  <div class="AddHouseDiv">
    <el-card>
      <el-row class="formTitle">
        <label style="margin-right: 18px">合同编号: </label>
        <el-select v-model="contractId" clearable placeholder="请选择合同编号" @change="contractIdChange">
          <el-option
            v-for="item in contractIdList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-row>
      <el-form :model="houseForm" ref="houseForm" label-width="100px" class="demo-houseForm">
        <el-row :gutter="30">
          <el-col :span="12">
            <el-form-item label="房屋城市：" :label-width="formLabelWidth" prop="atCity" required>
              <el-input v-model="houseForm.atCity" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="小区名称：" :label-width="formLabelWidth" prop="community" required>
              <el-input v-model="houseForm.community" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="12">
            <el-form-item label="详细地址：" :label-width="formLabelWidth" prop="address" required>
              <el-input v-model="houseForm.address" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在楼层：" :label-width="formLabelWidth" prop="floor" required>
              <el-input v-model="houseForm.floor" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="12">
            <el-form-item label="门牌号码：" :label-width="formLabelWidth" prop="houseNum" required>
              <el-input v-model="houseForm.houseNum" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="房间号码：" :label-width="formLabelWidth" prop="roomNum">
              <el-input v-model="houseForm.roomNum" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="12">
            <el-form-item label="房屋户型：" :label-width="formLabelWidth" prop="layout" required>
              <el-input v-model="houseForm.layout" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="房屋朝向：" :label-width="formLabelWidth" prop="orientation" required>
              <el-select v-model="houseForm.orientation" placeholder="请选择房源朝向">
                <el-option label="朝南" value="朝南"></el-option>
                <el-option label="朝北" value="朝北"></el-option>
                <el-option label="朝东" value="朝东"></el-option>
                <el-option label="朝西" value="朝西"></el-option>
                <el-option label="东南朝向" value="东南朝向"></el-option>
                <el-option label="西南朝向" value="西南朝向"></el-option>
                <el-option label="东北朝向" value="东北朝向"></el-option>
                <el-option label="西北朝向" value="西北朝向"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="12">
            <el-form-item label="使用面积：" :label-width="formLabelWidth" prop="area" required>
              <el-input v-model="houseForm.area" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="建筑年份：" :label-width="formLabelWidth" prop="buildAt" required>
              <el-date-picker type="date" placeholder="选择日期" v-model="houseForm.buildAt"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="配置独卫：" :label-width="formLabelWidth" prop="toilet" required>
              <el-switch v-model="houseForm.toilet"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="配置阳台：" :label-width="formLabelWidth" prop="balcony" required>
              <el-switch v-model="houseForm.balcony"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="租用类型：" :label-width="formLabelWidth" prop="rentType" required>
              <el-radio-group v-model="houseForm.rentType">
                <el-radio label="整租"></el-radio>
                <el-radio label="合租"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="12">
            <el-form-item label="房源简介：" prop="intro" required>
              <el-input type="textarea" v-model="houseForm.intro"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模型资源：" :label-width="formLabelWidth" prop="res3D">
              <el-input v-model="houseForm.res3D" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="12">
            <el-form-item label="图片资源：" :label-width="formLabelWidth">
              <el-upload
                name="files"
                :action="uploadUrl"
                :on-success="getFilePath"
                :on-remove="handleImgRemove">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="视频资源：" :label-width="formLabelWidth">
              <el-upload
                name="files"
                :action="uploadVideoUrl"
                :on-success="handleVideoSuccess"
                :before-upload="beforeUploadVideo"
                :on-remove="handleVideoRemove"
                :on-progress="uploadVideoProcess">
                <video v-if="VideoPlayUrl !=='' && videoFlag === false" :src="VideoPlayUrl" class="avatar" controls="controls" width="40%">您的浏览器不支持视频播放</video>
                <el-button size="small" type="primary" v-else-if="VideoPlayUrl ==='' && videoFlag === false">点击上传</el-button>
                <el-progress v-if="videoFlag === true" type="circle" :percentage="videoUploadPercent" style="margin-top:30px;"></el-progress>
              </el-upload>
              <P class="text">请保证视频格式正确，且不超过10M</P>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item style="margin-left: 30%">
          <el-button type="primary" @click="submitForm('houseForm')">立即创建</el-button>
          <el-button @click="resetForm('houseForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'AddHouse',
  data () {
    return {
      formLabelWidth: '100px',
      uploadUrl: process.env.VUE_APP_BASE_URL + '/file/upload',
      uploadVideoUrl: process.env.VUE_APP_BASE_URL + '/file/upload/video',
      idList: [],
      files: [],
      videoFlag: false,
      videoUploadPercent: 0,
      VideoPlayUrl: '',
      contractIdList: [],
      cityList: [],
      contractId: '',
      houseForm: {
        atCity: '',
        community: '',
        address: '',
        floor: '',
        houseNum: '',
        roomNum: '',
        layout: '',
        orientation: '',
        area: '',
        buildAt: '',
        toilet: false,
        balcony: false,
        rentType: '',
        intro: '',
        resImgs: [],
        resVideo: '',
        res3D: ''
      },
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  created: function () {
    let contractId = this.$route.query.contractId
    if (contractId) {
      this.contractIdList = [{ value: contractId, label: 'OC_' + contractId }]
      this.contractId = contractId
      this.contractIdChange()
    } else {
      this.getContractList()
    }
  },
  methods: {
    convertRentTypeZhToEn: function (rentType) {
      switch (rentType) {
        case '整租':
          return 'wholeRented'
        case '合租':
          return 'cotenancy'
      }
    },
    convertRentType (rentType) {
      switch (rentType) {
        case 'wholeRented':
          return '整租'
        case 'cotenancy':
          return '合租'
      }
    },
    contractIdChange () {
      this.$ajax.get('/backend/house/getHouseInfoByContractId', { params: { contractId: this.contractId } }).then(res => {
        if (res.data.success) {
          for (let [key, value] of Object.entries(res.data.msg.table[0])) {
            this.houseForm[key] = value
          }
          this.houseForm.buildAt = this.$moment(res.data.msg.table[0].buildAt).toDate()
          this.houseForm.rentType = this.convertRentType(res.data.msg.table[0].rentType)
        }
      })
    },
    getContractList () {
      this.$ajax.get('/backend/contract/getContractList').then(res => {
        if (res.data.success) {
          this.contractIdList = res.data.msg.table.map(item => {
            return {
              label: 'OC_' + item.id,
              value: item.id
            }
          })
        }
      })
    },
    getUrl (path) {
      return process.env.VUE_APP_RESOURCE_URL + path
    },
    handleVideoSuccess (res, file) { // 获取上传图片地址
      this.videoFlag = false
      this.videoUploadPercent = 0
      if (res.success === true) {
        this.houseForm.resVideo = res.msg[0]
        this.VideoPlayUrl = this.getUrl(res.msg[0])
      } else {
        this.$message.error('视频上传失败，请重新上传！')
      }
    },
    uploadVideoProcess (event, file, fileList) {
      this.videoFlag = true
      this.videoUploadPercent = Number(file.percentage.toFixed(0))
    },
    beforeUploadVideo (file) {
      const isLt10M = file.size / 1024 / 1024 < 10
      if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb'].indexOf(file.type) === -1) {
        this.$message.error('请上传正确的视频格式')
        return false
      }
      if (!isLt10M) {
        this.$message.error('上传视频大小不能超过10MB哦!')
        return false
      }
    },
    getFilePath (res) {
      this.houseForm.resImgs.push(res.msg[0])
    },

    submitForm (houseForm) {
      this.$refs[houseForm].validate((valid) => {
        if (valid) {
          this.$loading({ text: '正在添加, 请稍等...' })
          this.$ajax.post('/backend/house/createHouse', {
            contractId: this.contractId,
            atCity: this.houseForm.atCity,
            community: this.houseForm.community,
            address: this.houseForm.address,
            floor: this.houseForm.floor,
            houseNum: this.houseForm.houseNum,
            roomNum: this.houseForm.roomNum,
            layout: this.houseForm.layout,
            orientation: this.houseForm.orientation,
            area: this.houseForm.area,
            buildAt: this.$moment(this.houseForm.buildAt).format('YYYY-MM-DD'),
            toilet: Number(this.houseForm.toilet),
            balcony: Number(this.houseForm.balcony),
            rentType: this.convertRentTypeZhToEn(this.houseForm.rentType),
            intro: this.houseForm.intro,
            resImgs: this.houseForm.resImgs,
            resVideo: this.houseForm.resVideo,
            res3D: this.houseForm.res3D
          })
            .then(res => {
              if (res.data.success) {
                this.$message.success({
                  duration: 1000,
                  message: '成功发布房源！',
                  onClose: () => {
                    this.$loading().close()
                    this.$router.push({ path: '/House/OpHouse' })
                  }
                })
              }
            })
            .catch(() => {
              this.$loading().close()
            })
        } else {
          return false
        }
      })
    },

    resetForm (formName) {
      this.$refs[formName].resetFields()
    },

    handleImgRemove (file, fileList) {
      this.houseForm.resImgs = fileList.map(file => {
        return file.response.msg[0]
      })
    },

    handleVideoRemove (file, fileList) {
      this.VideoPlayUrl = ''
      this.houseForm.resVideo = ''
    }
  }
}
</script>

<style lang="scss">
  .AddHouseDiv {
    width: 100%;
    height: 100%;
    .el-upload{
      text-align: left;
    }

    .formTitle {
      font-size: 14px;
      color: #606266;
      margin-left: 19px;
      margin-bottom: 24px;
    }

    .text {
      color: #606266;
      font-size: 12px;
    }
  }
</style>
