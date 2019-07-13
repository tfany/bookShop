<template> 
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>租借列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="orderTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column label="订单编号" align="center">
          <template slot-scope="scope">{{scope.row.historyId}}</template>
        </el-table-column>
        <el-table-column label="用户账号" align="center">
          <template slot-scope="scope">{{scope.row.user.userId}}</template>
        </el-table-column>
        <el-table-column label="用户姓名" align="center">
          <template slot-scope="scope">{{scope.row.user.name}}</template>
        </el-table-column>
        <el-table-column label="书籍名称"  align="center">
          <template slot-scope="scope">{{scope.row.book.bookName}}</template>
        </el-table-column>
        <el-table-column label="租借时间" align="center">
          <template slot-scope="scope">{{scope.row.rentTime | formatCreateTime}}</template>
        </el-table-column>
        <el-table-column label="租借时长"  align="center">
          <template slot-scope="scope">{{scope.row.time}}天</template>
        </el-table-column>
        <el-table-column label="租借数量"  align="center">
          <template slot-scope="scope">{{scope.row.num }}本</template>
        </el-table-column>

        <el-table-column label="应还日期"  align="center">
          <template slot-scope="scope">{{new Date(new Date(scope.row.rentTime).getTime()+scope.row.time*24*60*60*1000) | formatCreateTime}}</template>
        </el-table-column>
        <el-table-column label="还书日期"  align="center">
          <template slot-scope="scope">{{scope.row.remandTime | formatCreateTime}}</template>
        </el-table-column>
        <el-table-column label="订单金额"  align="center">
          <template slot-scope="scope">￥{{scope.row.money}}元</template>
        </el-table-column>
        <el-table-column label="是否已还"  align="center">
          <template slot-scope="scope">{{scope.row.status | formatStatus}} </template>
        </el-table-column>
<!--        <el-table-column label="操作" width="200" align="center">-->
<!--          <template slot-scope="scope">-->
<!--            <el-button-->
<!--              size="mini"-->
<!--              @click="handleViewOrder(scope.$index, scope.row)"-->
<!--            >查看订单</el-button>-->
<!--            <el-button-->
<!--              size="mini"-->
<!--              @click="handleCloseOrder(scope.$index, scope.row)"-->
<!--              v-show="scope.row.status===0">关闭订单</el-button>-->
<!--            <el-button-->
<!--              size="mini"-->
<!--              @click="handleDeliveryOrder(scope.$index, scope.row)"-->
<!--              v-show="scope.row.status===1">订单发货</el-button>-->
<!--            <el-button-->
<!--              size="mini"-->
<!--              @click="handleViewLogistics(scope.$index, scope.row)"-->
<!--              v-show="scope.row.status===2||scope.row.status===3">订单跟踪</el-button>-->
<!--            <el-button-->
<!--              size="mini"-->
<!--              type="danger"-->
<!--              @click="handleDeleteOrder(scope.$index, scope.row)"-->
<!--              v-show="scope.row.status===4">删除订单</el-button>-->
<!--          </template>-->
<!--        </el-table-column>-->
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import {fetchList,closeOrder,deleteOrder} from '@/api/order'
  import {formatDate} from '@/utils/date';
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    orderSn: null,
    receiverKeyword: null,
    status: null,
    orderType: null,
    sourceType: null,
    createTime: null,
  };
  export default {
    name: "orderList",
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        listLoading: true,
        list: null,
        total: null,
        operateType: null,
        multipleSelection: [],
        closeOrder: {
          dialogVisible: false,
          content: null,
          orderIds: []
        },
      }
    },
    created() {
      this.getList();
    },
    filters: {
      formatCreateTime(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      formatStatus(value) {
        if (value === 1) {
          return '已还';
        } else {
          return '未还';
        }
      },
    },
    methods: {
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      handleSelectionChange(val){
        this.multipleSelection = val;
      },
      handleViewOrder(index, row){
        this.$router.push({path:'/oms/orderDetail',query:{id:row.id}})
      },
      handleCloseOrder(index, row){
        this.closeOrder.dialogVisible=true;
        this.closeOrder.orderIds=[row.id];
      },
      handleDeliveryOrder(index, row){
        let listItem = this.covertOrder(row);
        this.$router.push({path:'/oms/deliverOrderList',query:{list:[listItem]}})
      },
      handleViewLogistics(index, row){
        this.logisticsDialogVisible=true;
      },
      handleDeleteOrder(index, row){
        let ids=[];
        ids.push(row.id);
        this.deleteOrder(ids);
      },
      handleBatchOperate(){
        if(this.multipleSelection==null||this.multipleSelection.length<1){
          this.$message({
            message: '请选择要操作的订单',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        if(this.operateType===1){
          //批量发货
          let list=[];
          for(let i=0;i<this.multipleSelection.length;i++){
            if(this.multipleSelection[i].status===1){
              list.push(this.covertOrder(this.multipleSelection[i]));
            }
          }
          if(list.length===0){
            this.$message({
              message: '选中订单中没有可以发货的订单',
              type: 'warning',
              duration: 1000
            });
            return;
          }
          this.$router.push({path:'/oms/deliverOrderList',query:{list:list}})
        }else if(this.operateType===2){
          //关闭订单
          this.closeOrder.orderIds=[];
          for(let i=0;i<this.multipleSelection.length;i++){
            this.closeOrder.orderIds.push(this.multipleSelection[i].id);
          }
          this.closeOrder.dialogVisible=true;
        }else if(this.operateType===3){
          //删除订单
          let ids=[];
          for(let i=0;i<this.multipleSelection.length;i++){
            ids.push(this.multipleSelection[i].id);
          }
          this.deleteOrder(ids);
        }
      },
      handleSizeChange(val){
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val){
        this.listQuery.pageNum = val;
        this.getList();
      },
      handleCloseOrderConfirm() {
        if (this.closeOrder.content == null || this.closeOrder.content === '') {
          this.$message({
            message: '操作备注不能为空',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        let params = new URLSearchParams();
        params.append('ids', this.closeOrder.orderIds);
        params.append('note', this.closeOrder.content);
        closeOrder(params).then(response=>{
          this.closeOrder.orderIds=[];
          this.closeOrder.dialogVisible=false;
          this.getList();
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        });
      },
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        });
      },
      deleteOrder(ids){
        this.$confirm('是否要进行该删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams();
          params.append("ids",ids);
          deleteOrder(params).then(response=>{
            this.$message({
              message: '删除成功！',
              type: 'success',
              duration: 1000
            });
            this.getList();
          });
        })
      },
      covertOrder(order){
        let address=order.receiverProvince+order.receiverCity+order.receiverRegion+order.receiverDetailAddress;
        let listItem={
          orderId:order.id,
          orderSn:order.orderSn,
          receiverName:order.receiverName,
          receiverPhone:order.receiverPhone,
          receiverPostCode:order.receiverPostCode,
          address:address,
          deliveryCompany:null,
          deliverySn:null
        };
        return listItem;
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 203px;
  }
</style>


