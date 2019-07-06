<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          @click="handleSearchList()"
          type="primary"
          size="small">
          查询结果
        </el-button>
        <el-button
          style="float: right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input style="width: 203px" v-model="listQuery.keyword" placeholder="会员名称"></el-input>
          </el-form-item>
          <el-form-item label="会员编号：">
            <el-input style="width: 203px" v-model="listQuery.productSn" placeholder="会员编号"></el-input>
          </el-form-item>
          <el-form-item label="会员等级：">
            <el-select v-model="listQuery.rank" placeholder="请选择会员等级" clearable>
              <el-option
                v-for="item in rankOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>会员列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable"
                :data="list"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                border>
        <el-table-column type="selection" width="80" align="center"></el-table-column>
        <el-table-column label="用户ID"  align="center">
          <template slot-scope="scope">{{scope.row.userId}}</template>
        </el-table-column>
        <el-table-column label="会员头像"  align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="scope.row.headImg"></template>
        </el-table-column>


        <el-table-column label="会员姓名" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.name}}</p>
          </template>
        </el-table-column>
        <el-table-column label="性别"  align="center">
          <template slot-scope="scope">
            <p>{{scope.row.gender}}</p>
          </template>
        </el-table-column>
        <el-table-column label="会员等级" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.rank.level}}</p>
          </template>
        </el-table-column>
        <el-table-column label="手机号码" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.phoneNum}}</p>
          </template>
        </el-table-column>


        <el-table-column label="注册时间"  align="center">
          <template slot-scope="scope">{{scope.row.createTime}}</template>
        </el-table-column>
        <el-table-column label="上次登录时间"  align="center">
          <template slot-scope="scope">{{scope.row.updateTime}}</template>
        </el-table-column>
        <el-table-column label="状态"  align="center">
          <template slot-scope="scope">{{scope.row.status}}</template>
        </el-table-column>
        <el-table-column label="操作"  width="150" align="center">
          <template slot-scope="scope">
            <p>
              <el-button
                size="mini"
                @click="handleUpdateProduct(scope.$index, scope.row)">编辑
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select
        size="small"
        v-model="operateType" placeholder="批量操作" value="">
        <el-option
          v-for="item in operates"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button
        style="margin-left: 20px"
        class="search-button"
        @click="handleBatchOperate()"
        type="primary"
        size="small">
        确定
      </el-button>
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
    <p>
      <br>
      <br>
      <br>
      <br>
    </p>
  </div>

</template>
<script>
  import {
    fetchList,
    updateDeleteStatus,
  } from '@/api/user'
  import {fetchList as fetchRankList} from '@/api/rank'

  const defaultListQuery = {
    keyword: null,
    pageNum: 1,
    pageSize: 5,
    publishStatus: null,
    verifyStatus: null,
    productSn: null,
    productCategoryId: null,
    brandId: null
  };
  export default {
    name: "productList",
    data() {
      return {
        operates: [
          {
            label: "批量删除",
            value: "delete"
          }
        ],
        operateType: null,
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: true,
        multipleSelection: [],
        rankOptions: [],
      }
    },
    created() {
      this.getList();
      this.getRankList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        });
      },
      getRankList() {
        fetchRankList({pageNum: 1, pageSize: 100}).then(response => {
          this.rankOptions = [];
          let rankList = response.data.list;
          for (let i = 0; i < rankList.length; i++) {
            this.rankOptions.push({label: rankList[i].name, value: rankList[i].level});
          }
        });
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      handleAddProduct() {
        this.$router.push({path: '/pms/addProduct'});
      },
      handleBatchOperate() {
        if (this.operateType == null) {
          this.$message({
            message: '请选择操作类型',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        if (this.multipleSelection == null || this.multipleSelection.length < 1) {
          this.$message({
            message: '请选择要操作的会员',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        this.$confirm('是否要进行该批量操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = multipleSelection[0].id;
          this.updateDeleteStatus(1, ids);
          this.getList();
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
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleDelete(index, row) {
        this.$confirm('是否要进行删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let id = row.userId;
          this.updateDeleteStatus(id);
        });
      },
      handleUpdateProduct(index, row) {
        this.$router.push({path: '/ums/updateUser', query: {id: row.userId}});
      },

      updateDeleteStatus(id) {
        let params = new URLSearchParams();
        params.append('id', id);
        updateDeleteStatus(params).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1000
          });
        });
        this.getList();
      }
    }
  }
</script>
<style></style>


