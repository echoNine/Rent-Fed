<template>
  <div class="WithOwnerDiv">
    <el-card>
      <el-dialog title="新增合同" :visible.sync="dialogFormVisible">
        <el-form :model="dialogForm" ref="dialogForm">
          <el-row>
            <el-form-item label="委托房源：" :label-width="formLabelWidth" required>
              <el-select v-model="dialogForm.houseId" clearable placeholder="请选择" @change="getUserIdByHouseId">
                <el-option
                  v-for="item in houseIdList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="房主编号：" :label-width="formLabelWidth" required>
                <el-input v-model="dialogForm.userId" disabled autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item label="房屋租金：" prop="rentPrice" :label-width="formLabelWidth" required>
                <el-input v-model="dialogForm.rentPrice" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="支付方式：" prop="payForm" :label-width="formLabelWidth" required>
                <el-radio-group v-model="dialogForm.payForm">
                  <el-radio label="月付"></el-radio>
                  <el-radio label="年付"></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item label="签订日期：" prop="startAt" :label-width="formLabelWidth" required>
                <el-date-picker type="date" clearable placeholder="选择日期" v-model="dialogForm.startAt"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="到期时间：" prop="endAt" :label-width="formLabelWidth" required>
                <el-date-picker type="date" clearable placeholder="选择日期" v-model="dialogForm.endAt"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="纸质合同：" :label-width="formLabelWidth" required>
              <el-upload
                name="files"
                :action="uploadUrl"
                list-type="picture-card"
                :limit=1
                :on-success="getFilePath"
                :on-preview="handlePictureCardPreview">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="createOwnerContract('dialogForm')">立即创建</el-button>
        </div>
      </el-dialog>

      <el-dialog title="续签合同" :visible.sync="renewalDialogFormVisible">
        <el-form :model="renewalDialogForm" ref="renewalDialogForm">
          <el-row>
              <el-form-item label="原合同编号" :label-width="formLabelWidth">
                <el-input v-model="renewalDialogForm.contractId" autocomplete="off" :disabled="true"></el-input>
              </el-form-item>
          </el-row>
          <el-row>
              <el-form-item label="房主编号" :label-width="formLabelWidth">
                <el-input v-model="renewalDialogForm.userId" autocomplete="off" :disabled="true"></el-input>
              </el-form-item>
          </el-row>
          <el-row>
              <el-form-item label="房源编号" :label-width="formLabelWidth">
                <el-input v-model="renewalDialogForm.houseId" autocomplete="off" :disabled="true"></el-input>
              </el-form-item>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item label="房屋租金：" prop="rentPrice" :label-width="formLabelWidth" required>
                <el-input v-model="renewalDialogForm.rentPrice" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="支付方式：" prop="payForm" :label-width="formLabelWidth" required>
                <el-radio-group v-model="renewalDialogForm.payForm">
                  <el-radio label="月付"></el-radio>
                  <el-radio label="年付"></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item label="签订日期：" :label-width="formLabelWidth" required>
                <el-form-item prop="startAt">
                  <el-date-picker type="date" clearable placeholder="选择日期" v-model="renewalDialogForm.startAt"
                                  style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="到期时间：" :label-width="formLabelWidth" required>
                <el-form-item prop="endAt">
                  <el-date-picker type="date" clearable placeholder="选择日期" v-model="renewalDialogForm.endAt"
                                  style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
              <el-form-item label="上传合同：" :label-width="formLabelWidth" required>
                <el-upload
                  name="files"
                  :action="uploadUrl"
                  list-type="picture-card"
                  :limit=1
                  :on-success="getRenewalFilePath"
                  :on-preview="renewalHandlePictureCardPreview">
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="renewalDialogVisible">
                  <img width="100%" :src="renewalDialogImageUrl" alt="">
                </el-dialog>
              </el-form-item>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="renewalDialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="renewalOwnerContract('renewalDialogForm')">立即续签</el-button>
        </div>
      </el-dialog>

      <el-row style="height: 65px;">
        <el-button type="primary" icon="el-icon-plus" size="small" @click="dialogFormVisible = true" style="margin-left: 10px">新建合同</el-button>
      </el-row>
      <el-table
        :data="tableData"
        row-key="id"
        lazy
        stripe>
        <el-table-column align="center"
          prop="id"
          label="合同编号">
        </el-table-column>
        <el-table-column align="center"
          prop="userId"
          label="房主编号">
        </el-table-column>
        <el-table-column align="center"
          prop="houseId"
          label="房源编号">
        </el-table-column>
        <el-table-column align="center"
          prop="rentPrice"
          label="委托收租">
        </el-table-column>
        <el-table-column align="center"
          prop="startAt"
          label="签订时间"
          sortable>
        </el-table-column>
        <el-table-column align="center"
          prop="endAt"
          label="到期时间"
          sortable>
        </el-table-column>
        <el-table-column align="center"
          label="合同预览">
          <template slot-scope="item">
            <viewer>
              <img :src="getUrl(item.row.contractPic)" style="cursor: pointer; width: 35px">
            </viewer>
          </template>
        </el-table-column>
        <el-table-column align="center"
          prop="contractStatus"
          label="合同状态"
          :filters="[{ text: '未到期', value: '未到期' }, { text: '已到期', value: '已到期' }]"
          :filter-method="filterTag"
          filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.contractStatus === '未到期' ? 'primary' : 'success'"
              disable-transitions>{{scope.row.contractStatus}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center"
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="renewal(scope.row)" v-show="scope.row.contractStatus=='已到期'" size="mini">续签</el-button>
            <el-button type="warning" @click="dissolve(scope.row)" v-show="scope.row.contractStatus=='未到期'" size="mini">解约</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'WithOwner',
  inject: ['reload'],
  data: function () {
    return {
      uploadUrl: process.env.VUE_APP_BASE_URL + '/file/upload',
      tableData: [],
      houseIdList: [],
      value: '',
      dialogFormVisible: false,
      dialogImageUrl: '',
      dialogVisible: false,
      renewalDialogFormVisible: false,
      renewalDialogImageUrl: '',
      renewalDialogVisible: false,
      formLabelWidth: '100px',
      dialogForm: {
        houseId: '',
        userId: '',
        rentPrice: '',
        payForm: '',
        startAt: '',
        endAt: '',
        contractPic: ''
      },
      renewalDialogForm: {
        contractId: '',
        userId: '',
        houseId: '',
        rentPrice: '',
        payForm: '',
        startAt: '',
        endAt: '',
        contractPic: ''
      }
    }
  },
  created: function () {
    this.init()
  },
  methods: {
    init () {
      let houseId = this.$route.query.houseId
      if (houseId) {
        this.houseIdList = [{ value: houseId, label: 'House_' + houseId }]
        this.dialogForm.houseId = houseId
        this.dialogFormVisible = true
        this.getUserIdByHouseId()
      } else {
        this.dialogFormVisible = false
        this.loadAll().then(res => {
          this.houseIdList = res
        })
      }
      this.getContractData()
    },
    getUserIdByHouseId: function () {
      this.$ajax.get('/backend/user/getUserIdByHouseId', { params: { houseId: this.dialogForm.houseId } }).then(res => {
        if (res.data.success) {
          this.dialogForm.userId = 'Owner_' + res.data.msg.table[0].userId
        }
      })
    },
    convertContractStatus: function (contractStatus) {
      switch (contractStatus) {
        case 'undue':
          return '未到期'
        case 'fallDue':
          return '已到期'
      }
    },
    getContractData: function () {
      this.$ajax.get('/backend/contract/getOwnerContractList')
        .then(res => {
          this.tableData = res.data.msg.map(item => {
            item.contractStatus = this.convertContractStatus(item.contractStatus)
            item.startAt = this.$moment(item.startAt).format('YYYY-MM-DD')
            item.endAt = this.$moment(item.endAt).format('YYYY-MM-DD')
            item.id = 'OC_' + item.id
            item.userId = 'Owner_' + item.userId
            if (item.houseId !== null) {
              item.houseId = 'House_' + item.houseId
            }

            item.children = item.children.map(child => {
              child.contractStatus = this.convertContractStatus(child.contractStatus)
              child.startAt = this.$moment(child.startAt).format('YYYY-MM-DD')
              child.endAt = this.$moment(child.endAt).format('YYYY-MM-DD')
              child.id = 'OC_' + child.id
              child.userId = 'Owner_' + child.userId
              child.houseId = 'House_' + child.houseId
              return child
            })
            return item
          })
        })
    },
    async loadAll () {
      let res = await this.$ajax.get('/backend/house/getUnactivatedHouseList')
      return res.data.msg.table.map(item => {
        item.value = item.id
        item.label = 'House_' + item.id
        return item
      })
    },
    filterTag: function (value, row) {
      let childRight = false
      for (let i = 0; i < row.children.length; i++) {
        if (row.children[i].contractStatus === value) {
          childRight = true
          break
        }
      }
      return row.contractStatus === value || childRight
    },
    getFilePath (res) {
      this.dialogForm.contractPic = res.msg[0]
    },
    renewal (row) {
      this.$ajax.get('/backend/contract/renewalHouseContract', {
        params: {
          contractId: Number(row.id.replace(/(^OC_*)/g, ''))
        }
      })
        .then(res => {
          if (res.data.success) {
            this.renewalDialogFormVisible = true
            this.renewalDialogForm.contractId = 'OC_' + res.data.msg.table[0].id
            this.renewalDialogForm.userId = 'Owner_' + res.data.msg.table[0].userId
            this.renewalDialogForm.houseId = 'House_' + res.data.msg.table[0].houseId
          }
        })
    },
    dissolve (row) {
      this.$ajax.post('/backend/contract/dissolveHouseContract', {
        contractId: Number(row.id.replace(/(^OC_*)/g, '')),
        houseId: Number(row.houseId.replace(/(^House_*)/g, ''))
      })
        .then(res => {
          if (res.data.success) {
            this.$message.success({
              message: '解约成功！'
            })
          } else {
            this.$message.error({
              message: '该合同关联房源已被租用，不可解约..'
            })
          }
          this.reload()
        })
    },
    getRenewalFilePath (res) {
      this.renewalDialogForm.contractPic = res.msg[0]
    },

    getUrl (img) {
      return process.env.VUE_APP_RESOURCE_URL + img
    },

    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },

    renewalHandlePictureCardPreview (file) {
      this.renewalDialogImageUrl = file.url
      this.renewalDialogVisible = true
    },

    createOwnerContract: function (dialogForm) {
      this.$refs[dialogForm].validate((valid) => {
        if (valid) {
          this.$loading({ text: '正在添加, 请稍等...' })
          this.$ajax.post('/backend/contract/createHouseContract', {
            houseId: Number(this.dialogForm.houseId),
            userId: Number(this.dialogForm.userId.replace(/(^Owner_*)/g, '')),
            rentPrice: this.dialogForm.rentPrice,
            payForm: this.convertPayForm(this.dialogForm.payForm),
            startAt: this.$moment(this.dialogForm.startAt).format('YYYY-MM-DD'),
            endAt: this.$moment(this.dialogForm.endAt).format('YYYY-MM-DD'),
            contractPic: this.dialogForm.contractPic
          })
            .then(res => {
              if (res.data) {
                this.$message.success({
                  duration: 1000,
                  message: '创建成功！',
                  onClose: () => {
                    this.$loading().close()
                    window.location.href = '/Contract/WithOwner'
                  }
                })
              } else {
                this.$message.error({
                  message: '创建失败..',
                  onClose: () => {
                    this.$loading().close()
                    window.location.href = '/Contract/WithOwner'
                  }
                })
              }
              this.reload()
            })
            .catch(() => {
              this.$loading().close()
            }).finally(() => {
              this.dialogFormVisible = false
            })
        } else {
          return false
        }
      })
    },

    renewalOwnerContract: function (dialogForm) {
      this.$refs[dialogForm].validate((valid) => {
        if (valid) {
          this.$loading({ text: '正在添加, 请稍等...' })
          this.$ajax.post('/backend/contract/createHouseContract', {
            contractId: Number(this.renewalDialogForm.contractId.replace(/(^OC_*)/g, '')),
            userId: Number(this.renewalDialogForm.userId.replace(/(^Owner_*)/g, '')),
            houseId: Number(this.renewalDialogForm.houseId.replace(/(^House_*)/g, '')),
            rentPrice: this.renewalDialogForm.rentPrice,
            payForm: this.convertPayForm(this.renewalDialogForm.payForm),
            startAt: this.$moment(this.renewalDialogForm.startAt).format('YYYY-MM-DD'),
            endAt: this.$moment(this.renewalDialogForm.endAt).format('YYYY-MM-DD'),
            contractPic: this.renewalDialogForm.contractPic
          })
            .then(res => {
              if (res.data) {
                this.$message.success({
                  duration: 1000,
                  message: '续签成功！',
                  onClose: () => {
                    this.$loading().close()
                    this.renewalDialogFormVisible = false
                    this.init()
                  }
                })
              } else {
                this.$message.error({
                  message: '续签失败..',
                  onClose: () => {
                    this.$loading().close()
                    this.renewalDialogFormVisible = false
                    this.reload()
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

    convertPayForm: function (payForm) {
      switch (payForm) {
        case '月付':
          return 'byMonth'
        case '年付':
          return 'byYear'
      }
    }
  }
}
</script>
<style lang="scss">
  .WithOwnerDiv {
    width: 100%;
    height: 100%;
    .el-select .el-input {
      width: 130px;
    }
    .input-with-select .el-input-group__prepend {
      background-color: #fff;
    }
  }
</style>
