<template>
  <div class="WithTenantDiv">
    <el-card>
      <el-dialog title="新增合同" :visible.sync="dialogFormVisible">
        <el-form :model="dialogForm" ref="dialogForm">
          <el-row>
            <el-form-item label="租赁房源：" :label-width="formLabelWidth" required>
              <el-select v-model="dialogForm.houseId" clearable placeholder="请选择" @change="getPriceByHouseId">
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
            <el-form-item label="租户编号：" :label-width="formLabelWidth" required>
              <el-select v-model="dialogForm.userId" clearable placeholder="请选择">
                <el-option
                  v-for="item in tenantIdList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item label="房屋租金：" prop="rentPrice" :label-width="formLabelWidth" required>
                <el-input v-model="dialogForm.rentPrice" autocomplete="off" disabled></el-input>
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
          <el-button type="primary" @click="createTenantContract('dialogForm')">立即创建</el-button>
        </div>
      </el-dialog>

      <el-dialog title="续签合同" :visible.sync="renewalDialogFormVisible">
        <el-form :model="renewalDialogForm" ref="renewalDialogForm">
          <el-row>
            <el-form-item label="原合同编号：" :label-width="formLabelWidth">
              <el-input v-model="renewalDialogForm.contractId" autocomplete="off" :disabled="true"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="租户编号：" :label-width="formLabelWidth">
              <el-input v-model="renewalDialogForm.userId" autocomplete="off" :disabled="true"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="房源编号：" :label-width="formLabelWidth">
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
          <el-button type="primary" @click="renewalTenantContract('renewalDialogForm')">立即续签</el-button>
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
          label="租户编号">
        </el-table-column>
        <el-table-column align="center"
          prop="houseId"
          label="房源编号">
        </el-table-column>
        <el-table-column align="center"
          prop="rentPrice"
          label="房屋租金">
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
  name: 'WithTenant',
  inject: ['reload'],
  data: function () {
    return {
      uploadUrl: process.env.VUE_APP_BASE_URL + '/file/upload',
      tableData: [],
      houseIdList: [],
      tenantIdList: [],
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
      let userId = this.$route.query.userId
      if (houseId && userId) {
        this.houseIdList = [{ value: houseId, label: 'House_' + houseId }]
        this.tenantIdList = [{ value: userId, label: 'Tenant_' + userId }]
        this.dialogForm.houseId = houseId
        this.dialogForm.userId = userId
        this.getPriceByHouseId()
        this.dialogFormVisible = true
      } else {
        this.dialogFormVisible = false
        this.loadAllHouse().then(res => {
          this.houseIdList = res
        })
        this.loadAllTenant().then(res => {
          this.tenantIdList = res
        })
      }

      this.getContractData()
    },
    getContractData: function () {
      this.$ajax.get('/backend/contract/getTenantContractList')
        .then(res => {
          this.tableData = res.data.msg.map(item => {
            item.contractStatus = this.convertContractStatus(item.contractStatus)
            item.startAt = this.$moment(item.startAt).format('YYYY-MM-DD')
            item.endAt = this.$moment(item.endAt).format('YYYY-MM-DD')
            item.id = 'TC_' + item.id
            item.userId = 'Tenant_' + item.userId
            item.houseId = 'House_' + item.houseId

            item.children = item.children.map(child => {
              child.contractStatus = this.convertContractStatus(child.contractStatus)
              child.startAt = this.$moment(child.startAt).format('YYYY-MM-DD')
              child.endAt = this.$moment(child.endAt).format('YYYY-MM-DD')
              child.id = 'TC_' + child.id
              child.userId = 'Tenant_' + child.userId
              child.houseId = 'House_' + child.houseId
              return child
            })
            return item
          })
        })
    },
    async loadAllTenant () {
      let res = await this.$ajax.get('/backend/user/getAllUser', {
        params: { pageNum: 1, pageSize: 100 }
      })
      return res.data.msg.table.map(item => {
        item.value = item.id
        item.label = 'Tenant_' + item.id
        return item
      })
    },
    async loadAllHouse () {
      let res = await this.$ajax.get('/backend/house/getEmptyHouseList')
      return res.data.msg.table.map(item => {
        item.value = item.id
        item.label = 'House_' + item.id
        return item
      })
    },
    getPriceByHouseId () {
      this.$ajax.get('/backend/house/getPriceByHouseId', {
        params: {
          houseId: this.dialogForm.houseId
        }
      })
        .then(res => {
          this.dialogForm.rentPrice = res.data.msg.table[0].rentPrice
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
    createTenantContract: function (dialogForm) {
      this.$refs[dialogForm].validate((valid) => {
        if (valid) {
          this.$loading({ text: '正在添加, 请稍等...' })
          this.$ajax.post('/backend/contract/createTenantContract', {
            houseId: Number(this.dialogForm.houseId),
            userId: Number(this.dialogForm.userId),
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
                    this.dialogFormVisible = false
                    window.location.href = '/Contract/WithTenant'
                  }
                })
              } else {
                this.$message.error({
                  message: '创建失败..',
                  onClose: () => {
                    this.$loading().close()
                    this.dialogFormVisible = false
                    window.location.href = '/Contract/WithTenant'
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
    dissolve (row) {
      this.$ajax.post('/backend/contract/dissolveTenantContract', {
        contractId: Number(row.id.replace(/(^TC_*)/g, '')),
        houseId: Number(row.houseId.replace(/(^House_*)/g, ''))
      })
        .then(res => {
          if (res.data.success) {
            this.$message.success({
              message: '解约成功！'
            })
          } else {
            this.$message.error({
              message: '解约失败..'
            })
          }
          this.reload()
        })
    },

    renewal (id) {
      this.$ajax.get('/backend/contract/renewalHouseContract', {
        params: {
          contractId: Number(id.replace(/(^TC_*)/g, ''))
        }
      })
        .then(res => {
          if (res.data.success) {
            this.renewalDialogFormVisible = true
            this.renewalDialogForm.contractId = 'TC_' + res.data.msg.table[0].id
            this.renewalDialogForm.userId = 'Tenant_' + res.data.msg.table[0].userId
            this.renewalDialogForm.houseId = 'House_' + res.data.msg.table[0].houseId
          }
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
    renewalTenantContract: function (dialogForm) {
      this.$refs[dialogForm].validate((valid) => {
        if (valid) {
          this.$loading({ text: '正在添加, 请稍等...' })
          this.$ajax.post('/backend/contract/createTenantContract', {
            contractId: Number(this.renewalDialogForm.contractId.replace(/(^TC_*)/g, '')),
            userId: Number(this.renewalDialogForm.userId.replace(/(^Tenant_*)/g, '')),
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
  .WithTenantDiv {
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
