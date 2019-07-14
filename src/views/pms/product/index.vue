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
            <el-input style="width: 203px" v-model="listQuery.keyword" placeholder="书籍名称"></el-input>
          </el-form-item>
          <el-form-item label="书籍编号：">
            <el-input style="width: 203px" v-model="listQuery.productSn" placeholder="书籍编号"></el-input>
          </el-form-item>
          <el-form-item label="书籍分类：">
            <el-cascader
              clearable
              v-model="selectProductCateValue"
              :options="productCateOptions">
            </el-cascader>
          </el-form-item>
          <el-form-item label="供应商：">
            <el-select v-model="listQuery.brandId" placeholder="请选择供应商" clearable>
              <el-option
                v-for="item in supplierOptions"
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
      <span>数据列表</span>
      <el-button
        class="btn-add"
        @click="handleAddProduct()"
        size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable"
                :data="list"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                border>
        <el-table-column label="书籍编号"  align="center">
          <template slot-scope="scope">{{scope.row.bookId}}</template>
        </el-table-column>
        <el-table-column label="书籍图片"  align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="scope.row.img"></template>
        </el-table-column>


        <el-table-column label="书籍名称" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.bookName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="作者" >
          <template slot-scope="scope">
            <p>{{scope.row.author}}</p>
          </template>
        </el-table-column>
        <el-table-column label="分类">
          <template slot-scope="scope">
            <p>{{getParentNameById(scope.row.bookCategory.parentId)}} / {{scope.row.bookCategory.categoryName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="供应商" >
          <template slot-scope="scope">
            <p>{{scope.row.supplier.supplierName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="价格" align="center">
          <template slot-scope="scope">
            <p>价格：￥{{scope.row.price}}</p>
          </template>
        </el-table-column>


        <el-table-column label="库存"  align="center">
          <template slot-scope="scope">{{scope.row.stock}}</template>
        </el-table-column>
        <el-table-column label="销量"  align="center">
          <template slot-scope="scope">{{scope.row.sale}}</template>
        </el-table-column>
        <el-table-column label="操作"  width="300" align="center">
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
<!--    <div class="batch-operate-container">-->
<!--      <el-select-->
<!--        size="small"-->
<!--        v-model="operateType" placeholder="批量操作">-->
<!--        <el-option-->
<!--          v-for="item in operates"-->
<!--          :key="item.value"-->
<!--          :label="item.label"-->
<!--          :value="item.value">-->
<!--        </el-option>-->
<!--      </el-select>-->
<!--      <el-button-->
<!--        style="margin-left: 20px"-->
<!--        class="search-button"-->
<!--        @click="handleBatchOperate()"-->
<!--        type="primary"-->
<!--        size="small">-->
<!--        确定-->
<!--      </el-button>-->
<!--    </div>-->
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
  } from '@/api/product'
  import {fetchList as fetchBrandList} from '@/api/brand'
  import {fetchListWithChildren} from '@/api/productCate'

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
        // operates: [
        //   {
        //     label: "批量删除",
        //     value: "delete"
        //   }
        // ],
        operateType: null,
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: true,
        selectProductCateValue: null,
        multipleSelection: [],
        productCateOptions: [],
        supplierOptions: [],
      }
    },
    created() {
      this.getList();
      this.getBrandList();
      this.getProductCateList();
    },
    watch: {
      selectProductCateValue: function (newValue) {
        if (newValue != null && newValue.length == 2) {
          this.listQuery.productCategoryId = newValue[1];
        } else {
          this.listQuery.productCategoryId = null;
        }

      }
    },

    methods: {
      getProductSkuSp(row, index) {
        if (index === 0) {
          return row.sp1;
        } else if (index === 1) {
          return row.sp2;
        } else {
          return row.sp3;
        }
      },
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        });
      },
      getBrandList() {
        fetchBrandList({pageNum: 1, pageSize: 100}).then(response => {
          this.supplierOptions = [];
          let supplierList = response.data.list;
          for (let i = 0; i < supplierList.length; i++) {
            this.supplierOptions.push({label: supplierList[i].supplierName, value: supplierList[i].supplierId});
          }
        });
      },
      getProductCateList() {
        fetchListWithChildren().then(response => {
          let list = response.data;
          this.productCateOptions = [];
          for (let i = 0; i < list.length; i++) {
            let children = [];
            if (list[i].children != null && list[i].children.length > 0) {
              for (let j = 0; j < list[i].children.length; j++) {
                children.push({label: list[i].children[j].categoryName, value: list[i].children[j].categoryId});
              }
            }
            this.productCateOptions.push({label: list[i].categoryName, value: list[i].categoryId, children: children});
          }
        });
      },
      getParentNameById(id){
        let name=null;
        for(let i=0;i<this.productCateOptions.length;i++){
            if(this.productCateOptions[i].value===id){
              name=this.productCateOptions[i].label;
            }

        }
        return name;
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
            message: '请选择要操作的书籍',
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
        this.selectProductCateValue = [];
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleDelete(index, row) {
        this.$confirm('是否要进行删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = [];
          ids.push(row.bookId);
          this.updateDeleteStatus(1, ids);
          this.getList()
        });
      },
      handleUpdateProduct(index, row) {
        this.$router.push({path: '/pms/updateProduct', query: {id: row.bookId}});
      },

      updateDeleteStatus(deleteStatus, ids) {
        let params = new URLSearchParams();
        params.append('ids', ids);
        params.append('deleteStatus', deleteStatus);
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


