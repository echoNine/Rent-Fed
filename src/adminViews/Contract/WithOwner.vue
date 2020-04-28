<template>
  <el-card>
    <el-dialog title="新增合同" :visible.sync="dialogFormVisible">
      <el-form :model="dialogForm" ref="dialogForm">
        <el-row>
          <el-col :span="22">
            <el-form-item label="合同编号" :label-width="formLabelWidth">
              <el-input v-model="dialogForm.id" autocomplete="off" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="房主编号" :label-width="formLabelWidth" required>
              <el-autocomplete
                clearable
                class="inline-input"
                v-model="dialogForm.userId"
                :fetch-suggestions="querySearch"
                placeholder="请输入内容"
                @select="handleSelect"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="房源编号" :label-width="formLabelWidth" required>
              <el-select v-model="dialogForm.houseId" clearable placeholder="请选择">
                <el-option
                  v-for="item in houseIdList"
                  :disabled="item.status!=='未激活'"
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
            <el-form-item label="签订日期" :label-width="formLabelWidth" required>
              <el-form-item prop="startAt">
                <el-date-picker type="date" clearable placeholder="选择日期" v-model="dialogForm.startAt"
                                style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="到期时间" :label-width="formLabelWidth" required>
              <el-form-item prop="endAt">
                <el-date-picker type="date" clearable placeholder="选择日期" v-model="dialogForm.endAt"
                                style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="合同状态" :label-width="formLabelWidth" required>
              <el-select v-model="dialogForm.contractStatus" clearable placeholder="请选择">
                <el-option value="未到期" :disabled="false"></el-option>
                <el-option value="已到期" :disabled="true"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="上传合同" :label-width="formLabelWidth" required>
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addOwnerContract('dialogForm')">立即创建</el-button>
      </div>
    </el-dialog>

    <el-dialog title="续签合同" :visible.sync="renewdialogFormVisible">
      <el-form :model="renewdialogForm" ref="renewdialogForm">
        <el-row>
          <el-col :span="22">
            <el-form-item label="合同编号" :label-width="formLabelWidth">
              <el-input v-model="renewdialogForm.id" autocomplete="off" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="房主编号" :label-width="formLabelWidth">
              <el-input v-model="renewdialogForm.userId" autocomplete="off" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="房源编号" :label-width="formLabelWidth" required>
              <el-input v-model="renewdialogForm.houseId" autocomplete="off" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="签订日期" :label-width="formLabelWidth" required>
              <el-form-item prop="startAt">
                <el-date-picker type="date" clearable placeholder="选择日期" v-model="renewdialogForm.startAt"
                                style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="到期时间" :label-width="formLabelWidth" required>
              <el-form-item prop="endAt">
                <el-date-picker type="date" clearable placeholder="选择日期" v-model="renewdialogForm.endAt"
                                style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="合同状态" :label-width="formLabelWidth" required>
              <el-select v-model="renewdialogForm.contractStatus" clearable placeholder="请选择">
                <el-option value="未到期" :disabled="false"></el-option>
                <el-option value="已到期" :disabled="true"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="上传合同" :label-width="formLabelWidth" required>
              <el-upload
                name="files"
                :action="uploadUrl"
                list-type="picture-card"
                :limit=1
                :on-success="getrenewFilePath"
                :on-preview="renewhandlePictureCardPreview"
                :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="renewdialogVisible">
                <img width="100%" :src="renewdialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="renewdialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="renewOwnerContract('renewdialogForm')">立即续签</el-button>
      </div>
    </el-dialog>

    <el-row style="height: 65px;">
      <el-col :span="6">
        <el-button type="primary" icon="el-icon-plus" size="small" @click="showDialog" style="margin-left: 10px">新建合同</el-button>
      </el-col>
      <el-col :span="8" style="float: right">
        <el-input placeholder="请输入内容" v-model="input" clearable class="input-with-select">
          <el-select v-model="select" slot="prepend" placeholder="请选择">
            <el-option label="房主编号" value="1"></el-option>
            <el-option label="房源编号" value="2"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="toFind"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-table
      :data="tableData"
      row-key="id"
      lazy
      stripe>
      <el-table-column
        prop="id"
        label="合同编号">
      </el-table-column>
      <el-table-column
        prop="userId"
        label="房主编号">
      </el-table-column>
      <el-table-column
        prop="houseId"
        label="房源编号">
      </el-table-column>
      <el-table-column
        prop="startAt"
        label="签订时间"
        sortable>
      </el-table-column>
      <el-table-column
        prop="endAt"
        label="到期时间"
        sortable>
      </el-table-column>
      <el-table-column
        label="合同预览">
        <template slot-scope="item">
          <viewer>
            <img :src="getUrl(item.row.contractPic)" style="cursor: pointer; width: 35px">
          </viewer>
        </template>
      </el-table-column>
      <el-table-column
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
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button type="text" @click="renew(scope.row)" size="small">续签</el-button>
          <el-button type="text" @click="rescission(scope.row)" size="small">解约</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script>
export default {
  name: 'WithOwner',
  inject: ['reload'],
  data: function () {
    return {
      uploadUrl: process.env.VUE_APP_BASE_URL + '/file/upload',
      tableData: [{
        id: '',
        houseId: '',
        userId: '',
        startAt: '',
        endAt: '',
        contractPic: '',
        contractStatus: ''
      }],
      ownerIdList: [],
      houseIdList: [],
      value: '',
      dialogFormVisible: false,
      renewdialogFormVisible: false,
      dialogForm: {
        id: '',
        houseId: '',
        userId: '',
        startAt: '',
        endAt: '',
        contractStatus: '',
        ContractPic: ''
      },
      renewdialogForm: {
        id: '',
        houseId: '',
        userId: '',
        startAt: '',
        endAt: '',
        contractStatus: '',
        ContractPic: '',
        parentNum: ''
      },
      dialogImageUrl: '',
      dialogVisible: false,
      renewdialogImageUrl: '',
      renewdialogVisible: false,
      formLabelWidth: '120px',
      input: '',
      select: '',
      search: {
        ownerId: '',
        houseId: ''
      }
    }
  },
  created: function () {
    this.toFind()
  },
  mounted () {
    this.loadAll().then(res => {
      this.ownerIdList = res
    })
  },
  methods: {
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
      console.log(this.dialogForm.contractPic)
    },

    getrenewFilePath (res) {
      this.renewdialogForm.contractPic = res.msg[0]
      console.log(this.renewdialogForm.contractPic)
    },

    getUrl (img) {
      return process.env.VUE_APP_RESOURCE_URL + img
    },

    handleRemove (file, fileList) {
      console.log(file, fileList)
    },

    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },

    renewhandlePictureCardPreview (file) {
      this.renewdialogImageUrl = file.url
      this.renewdialogVisible = true
    },

    showDialog: function () {
      this.dialogFormVisible = true
      this.$ajax.post('/list/newOwnerContractId')
        .then(res => {
          this.dialogForm.id = 'OC_' + res.data.msg.table[0].id
        })
    },

    renew (row) {
      this.renewdialogFormVisible = true
      this.$ajax.post('/list/newOwnerContractId')
        .then(res => {
          this.renewdialogForm.id = 'OC_' + res.data.msg.table[0].id
        })
      this.renewdialogForm.houseId = row.houseId
      this.renewdialogForm.userId = row.userId
      this.renewdialogForm.parentNum = row.id
    },

    renewOwnerContract: function (renewdialogForm) {
      this.$refs[renewdialogForm].validate((valid) => {
        if (valid) {
          this.$loading({ text: '正在添加, 请稍等...' })
          this.$ajax.post('/list/renewOwnerContract', {
            id: Number(this.renewdialogForm.id.replace(/(^OC_*)/g, '')),
            userId: Number(this.renewdialogForm.userId.replace(/(^O_*)/g, '')),
            houseId: Number(this.renewdialogForm.houseId.replace(/(^H_*)/g, '')),
            startAt: this.$moment(this.renewdialogForm.startAt).format('YYYY-MM-DD'),
            endAt: this.$moment(this.renewdialogForm.endAt).format('YYYY-MM-DD'),
            contractStatus: this.renewdialogForm.contractStatus,
            contractPic: this.renewdialogForm.contractPic,
            parentNum: Number(this.renewdialogForm.parentNum.replace(/(^OC_*)/g, ''))
          })
            .then(res => {
              if (res.data) {
                this.$message.success({
                  duration: 1000,
                  message: '续签成功！',
                  onClose: () => {
                    this.$loading().close()
                    this.renewdialogFormVisible = false
                    this.reload()
                  }
                })
              } else {
                this.$message.error({
                  message: '续签失败..',
                  onClose: () => {
                    this.$loading().close()
                    this.renewdialogFormVisible = false
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

    rescission: function (row) {
      this.$loading({ text: '正在删除, 请稍等...' })
      this.$ajax.post('/list/deleteOwnerContract', {
        id: Number(row.houseId.replace(/(^H_*)/g, ''))
      })
        .then(res => {
          if (res.data) {
            this.$message.success({
              duration: 1000,
              message: '解约成功！',
              onClose: () => {
                this.$loading().close()
                this.reload()
              }
            })
          } else {
            this.$message.error({
              message: '该房源已被租赁，解约失败..',
              onClose: () => {
                this.$loading().close()
                this.reload()
              }
            })
          }
        })
        .catch(() => {
          this.$loading().close()
        })
    },

    addOwnerContract: function (dialogForm) {
      this.$refs[dialogForm].validate((valid) => {
        if (valid) {
          this.$loading({ text: '正在添加, 请稍等...' })
          this.$ajax.post('/list/addOwnerContract', {
            id: Number(this.dialogForm.id.replace(/(^OC_*)/g, '')),
            userId: Number(this.dialogForm.userId.replace(/(^O_*)/g, '')),
            houseId: Number(this.dialogForm.houseId.replace(/(^H_*)/g, '')),
            startAt: this.$moment(this.dialogForm.startAt).format('YYYY-MM-DD'),
            endAt: this.$moment(this.dialogForm.endAt).format('YYYY-MM-DD'),
            contractStatus: this.dialogForm.contractStatus,
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
                    this.reload()
                  }
                })
              } else {
                this.$message.error({
                  message: '创建失败..',
                  onClose: () => {
                    this.$loading().close()
                    this.dialogFormVisible = false
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

    querySearch (queryString, cb) {
      var ownerIdList = this.ownerIdList
      var results = queryString ? ownerIdList.filter(this.createFilter(queryString)) : ownerIdList
      cb(results)
    },

    createFilter (queryString) {
      return (ownerIdList) => {
        return (ownerIdList.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
      }
    },

    async loadAll () {
      let res = await this.$ajax.get('/list/getOwnerId')
      return res.data.msg.table.map(item => {
        item.value = 'O_' + item.id
        return item
      })
    },

    handleSelect (item) {
      this.$ajax.get('/list/getHouseId', {
        params: {
          id: item.id
        }
      })
        .then(res => {
          this.houseIdList = res.data.msg.table.map(item => {
            item.value = 'H_' + item.id
            return item
          })
        })
    },
    toFind: function () {
      if (this.select === '1') {
        console.log(this.select)
        this.search.ownerId = Number(this.input.replace(/(^O_*)/g, ''))
        this.search.houseId = ''
      } else if (this.select === '2') {
        this.search.ownerId = ''
        this.search.houseId = Number(this.input.replace(/(^H_*)/g, ''))
      } else {
        this.search.ownerId = ''
        this.search.houseId = ''
      }
      this.$ajax.get('/list/ownerContract', {
        params: {
          seaOwnerId: this.search.ownerId,
          seaHouseId: this.search.houseId
        }
      })
        .then(res => {
          this.tableData = res.data.msg.map(item => {
            item.startAt = this.$moment(item.startAt).format('YYYY-MM-DD')
            item.endAt = this.$moment(item.endAt).format('YYYY-MM-DD')
            item.id = 'OC_' + item.id
            item.userId = 'O_' + item.userId
            item.houseId = 'H_' + item.houseId

            item.children = item.children.map(child => {
              child.startAt = this.$moment(child.startAt).format('YYYY-MM-DD')
              child.endAt = this.$moment(child.endAt).format('YYYY-MM-DD')
              child.id = 'OC_' + child.id
              child.userId = 'O_' + child.userId
              child.houseId = 'H_' + child.houseId
              return child
            })
            return item
          })
        })
    }
  }
}
</script>
<style>
  .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
