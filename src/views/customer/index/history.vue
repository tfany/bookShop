<template> 
  <div class="app-container">
    <el-card class="operate-container" shadow="never">

      <el-row>
        <el-col :span="4">
          <i class="el-icon-tickets"></i>
          <span>租借列表</span>
        </el-col>

        <el-col :span="3" :offset=17>

          <el-button type="primary" @click="toIndex"> 返回首页</el-button>
        </el-col>
      </el-row>
    </el-card>
    <div class="table-container">
      <el-table ref="orderTable"
                :data="list"
                style="width: 100%;"
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
        <el-table-column label="书籍名称" align="center">
          <template slot-scope="scope">{{scope.row.book.bookName}}</template>
        </el-table-column>
        <el-table-column label="租借时间" align="center">
          <template slot-scope="scope">{{scope.row.rentTime | formatCreateTime}}</template>
        </el-table-column>
        <el-table-column label="租借时长" align="center">
          <template slot-scope="scope">{{scope.row.time}}天</template>
        </el-table-column>
        <el-table-column label="租借数量" align="center">
          <template slot-scope="scope">{{scope.row.num }}本</template>
        </el-table-column>

        <el-table-column label="应还日期" align="center">
          <template slot-scope="scope">{{new Date(new Date(scope.row.rentTime).getTime()+scope.row.time*24*60*60*1000) |
            formatCreateTime}}
          </template>
        </el-table-column>
        <el-table-column label="还书日期" align="center">
          <template slot-scope="scope">{{scope.row.remandTime | formatCreateTime}}</template>
        </el-table-column>
        <el-table-column label="订单金额" align="center">
          <template slot-scope="scope">￥{{scope.row.money}}元</template>
        </el-table-column>
        <el-table-column label="是否已还" align="center">
          <template slot-scope="scope">{{scope.row.status | formatStatus}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status===0"
                       size="mini"
                       @click="handleHuan(scope.row.historyId)">还书
            </el-button>
            <p v-if="scope.row.status===0">(提前还书不退钱)</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import {getByUser, huan} from '@/api/order'
  import {formatDate} from '@/utils/date';
  import {getUserInfo} from '@/api/user';

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    orderSn: null,
    receiverKeyword: null,
    status: null,
    createTime: null,
  };
  export default {
    name: "history",
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        listLoading: true,
        list: null,
        total: null,
        user: [],
      }
    },
    created() {
      this.getUser();
    },
    filters: {
      formatCreateTime(time) {
        if (time == null)
          return '尚未归还'
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
      getUser() {
        getUserInfo().then(response => {
          this.user = response.data
          this.getList()
        })
      },
      getList() {
        this.listLoading = true;
        let param = {};
        param.id = this.user.userId;
        getByUser(param).then(response => {
          this.listLoading = false;
          this.list = response.data;
        });
      },
      handleHuan(id) {
        let param = {};
        param.id = id;
        huan(param).then(response => {
          this.getUser();
        })
      },
      toIndex() {
        this.$router.push("/customer")
      }
    }
  }
</script>
<style scoped>

</style>


