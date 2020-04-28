<template>
  <el-card>
    <el-form :model="houseForm" :rules="rules" ref="houseForm" label-width="100px" class="demo-houseForm">
      <el-row>
        <el-col :span="12">
          <el-form-item label="房源编号">
            <el-input v-model="houseForm.id" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="户主编号" prop="owner">
            <el-select v-model="houseForm.owner" clearable placeholder="请选择户主编号">
              <el-option
                v-for="item in idList"
                :key="item.value"
                :label="item.value"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="租赁类型" prop="rentType">
            <el-radio-group v-model="houseForm.rentType">
              <el-radio label="整租"></el-radio>
              <el-radio label="合租"></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="首次出租" prop="firstRent">
            <el-switch v-model="houseForm.firstRent"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="小区名称" prop="community">
            <el-input v-model="houseForm.community"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="详细地址" prop="address">
            <el-input v-model="houseForm.address"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="9">
          <el-form-item label="使用面积" prop="area">
            <el-input v-model="houseForm.area"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <span style="line-height: 40px; padding-left: 15px">m^2</span>
        </el-col>
        <el-col :span="9">
          <el-form-item label="租赁价格" prop="price">
            <el-input v-model="houseForm.price"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <span style="line-height: 40px; padding-left: 15px">元 / 月</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="房源朝向" prop="orientation">
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
        <el-col :span="11">
          <el-form-item label="建筑年份" required>
            <el-form-item prop="buildTime">
              <el-date-picker type="date" placeholder="选择日期" v-model="houseForm.buildTime"
                              style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="房源户型" prop="layout">
            <el-input v-model="houseForm.layout"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="所在楼层" prop="floor">
            <el-input v-model="houseForm.floor"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="房源简介" prop="intro">
            <el-input type="textarea" v-model="houseForm.intro"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="添加封面" prop="cover">
            <el-upload
              name="files"
              :action="uploadUrl"
              list-type="picture-card"
              :limit=1
              :on-success="getFilePath"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item style="margin-left: 30%">
        <el-button type="primary" @click="submitForm('houseForm')">立即创建</el-button>
        <el-button @click="resetForm('houseForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: 'AddHouse',
  data () {
    return {
      uploadUrl: process.env.VUE_APP_BASE_URL + '/file/upload',
      idList: [],
      files: [],
      houseForm: {
        id: '',
        address: '',
        price: '',
        area: '',
        rentType: '',
        floor: '',
        layout: '',
        orientation: '',
        buildTime: '',
        intro: '',
        community: '',
        cover: '',
        owner: '',
        firstRent: false
      },
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  created: function () {
    this.getOwnerId()
    this.newHouseId()
  },
  methods: {
    getOwnerId: function () {
      this.$ajax.get('/list/owner')
        .then(res => {
          this.idList = res.data.msg.table.map(item => {
            item.value = item.id.toString()
            let j = 4 - item.id.toString().length
            for (let i = 0; i < j; i++) {
              item.value = '0' + item.value
            }
            item.value = 'O_' + item.value
            return item
          })
        })
    },
    newHouseId: function () {
      this.$ajax.post('/list/newHouseId')
        .then(res => {
          let j = 4 - res.data.msg.table[0].id.toString().length
          for (let i = 0; i < j; i++) {
            res.data.msg.table[0].id = '0' + res.data.msg.table[0].id
          }
          this.houseForm.id = 'H_' + res.data.msg.table[0].id
        })
    },
    getFilePath (res) {
      this.houseForm.cover = res.msg[0]
    },

    submitForm (houseForm) {
      this.$refs[houseForm].validate((valid) => {
        if (valid) {
          this.$loading({ text: '正在添加, 请稍等...' })
          this.$ajax.post('/list/addHouse', {
            id: Number(this.houseForm.id.replace(/(^H_*)/g, '')),
            address: this.houseForm.address,
            price: this.houseForm.price,
            area: this.houseForm.area,
            rentType: this.houseForm.rentType,
            floor: this.houseForm.floor,
            layout: this.houseForm.layout,
            orientation: this.houseForm.orientation,
            buildTime: this.$moment(this.houseForm.buildTime).format('YYYY-MM-DD'),
            intro: this.houseForm.intro,
            community: this.houseForm.community,
            cover: this.houseForm.cover,
            owner: Number(this.houseForm.owner.replace(/(^O_*)/g, '')),
            firstRent: this.houseForm.firstRent
          })
            .then(res => {
              if (res.data.success) {
                this.$message.success({
                  duration: 1000,
                  message: '成功添加房源！',
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
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>
<style scoped>
</style>
