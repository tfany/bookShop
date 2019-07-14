<template> 
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        class="btn-add"
        @click="addSupplier()"
        size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="brandTable"
                :data="list"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                border>
        <el-table-column label="编号" align="center">
          <template slot-scope="scope">{{scope.row.supplierId}}</template>
        </el-table-column>
        <el-table-column label="供应商名称" align="center">
          <template slot-scope="scope">{{scope.row.supplierName}}</template>
        </el-table-column>
        <el-table-column label="供应商联系方式"  align="center">
          <template slot-scope="scope">{{scope.row.phoneNum}}</template>
        </el-table-column>
        <el-table-column label="书籍数量"  align="center">
          <template slot-scope="scope">{{scope.row.count}}</template>
        </el-table-column>

        <el-table-column label="操作"  align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import {fetchList, updateShowStatus, updateFactoryStatus, deleteBrand} from '@/api/brand'

  export default {
    name: 'brandList',
    data() {
      return {
        operateType: null,
        listQuery: {
          keyword: null,
          pageNum: 1,
          pageSize: 5
        },
        list: null,
        total: null,
        listLoading: true,
        multipleSelection: []
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
          this.totalPage = response.data.totalPage;
          this.pageSize = response.data.pageSize;
        });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleUpdate(index, row) {
        this.$router.push({path: '/pms/updateSupplier', query: {id: row.supplierId}})
      },
      handleDelete(index, row) {
        this.$confirm('此操作会删除该供应商及该供应商所有书籍,此操作不可逆!', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteBrand(row.supplierId).then(response => {
            this.$alert("删除成功");
            this.getList();
          });
        });
      },

      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
      searchBrandList() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      handleBatchOperate() {
        console.log(this.multipleSelection);
        if (this.multipleSelection < 1) {
          this.$message({
            message: '请选择一条记录',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        let showStatus = 0;
        if (this.operateType === 'showBrand') {
          showStatus = 1;
        } else if (this.operateType === 'hideBrand') {
          showStatus = 0;
        } else {
          this.$message({
            message: '请选择批量操作类型',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        let ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id);
        }
        let data = new URLSearchParams();
        data.append("ids", ids);
        data.append("showStatus", showStatus);
        updateShowStatus(data).then(response => {
          this.getList();
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        });
      },
      addSupplier() {
        this.$router.push({path: '/pms/addSupplier'})
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>


</style>


