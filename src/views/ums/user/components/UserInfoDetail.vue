<template>
  <div style="margin-top: 50px">
    <el-form :model="value" :rules="rules" ref="userInfoForm" label-width="120px" style="width: 600px" size="small">
      <el-form-item label="姓名：" prop="name">
        <el-input v-model="value.name" size="small"></el-input>
      </el-form-item>
      <el-form-item label="性别：" prop="gender">
        <el-select
          v-model="value.gender"
          placeholder="性别">

          <el-option value="男" label="男" key="0"/>
          <el-option value="女" label="女" key="1"/>

        </el-select>
      </el-form-item>
      <el-form-item label="等级：" prop="level">
        <el-select
          v-model="value.level"
          @change="handleRankChange"
          placeholder="等级">
          <el-option
            v-for="item in rankOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手机号码：" prop="phoneNum">
        <el-input v-model="value.phoneNum"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="password">
        <el-input name="password"
                  :type="pwdType"
                  v-model="value.password"
                  autoComplete="on"
                  placeholder="请输入密码"
        >
          <span slot="suffix" @click="showPwd">
            <svg-icon icon-class="eye" class="color-main"></svg-icon>
          </span>
        </el-input>
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select
          v-model="value.status"
          placeholder="状态">
          <el-option value="1" label="可用" key="1"/>
          <el-option value="0" label="不可用" key="0"/>
        </el-select>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button type="primary" size="medium" @click="handleNext('userInfoForm')">下一步，修改头像</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {fetchList as fetchBrandList} from '@/api/rank'
  import {validPhone} from '@/utils/validate';

  export default {
    name: "UserInfoDetail",
    props: {
      value: Object,
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      const validatePhoneNum = (rule, value, callback) => {
        if (!validPhone(value)) {
          callback(new Error('请输入正确的手机号码'))
        } else {
          callback()
        }
      };
      return {
        hasEditCreated: false,
        rankOptions: [],
        pwdType: 'password',
        rules: {
          name: [
            {required: true, message: '请输入姓名', trigger: 'blur'},
            {min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur'}
          ],
          gender: [{required: true, message: '请选择性别', trigger: 'blur'}],
          level: [{required: true, message: '请选择等级', trigger: 'blur'}],
          phoneNum: [{required: true, validator: validatePhoneNum, message: '请输入正确的手机号码'}],
          status: [{required: true, message: '请选择状态', trigger: 'blur'}],
          password: [{required: true, message: '请输入密码', trigger: 'blur'},
            {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}]
        }
      };
    },
    created() {
      this.getRankList();
    },
    methods: {
      //处理编辑逻辑
      handleEditCreated() {
        this.hasEditCreated = true;
      },
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },
      getRankList() {
        fetchBrandList({pageNum: 1, pageSize: 100}).then(response => {
          this.rankOptions = [];
          let rank = response.data.list;
          for (let i = 0; i < rank.length; i++) {
            this.rankOptions.push({label: rank[i].name, value: rank[i].level});
          }
        });
      },
      handleNext(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$emit('nextStep');
          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration: 1000
            });
            return false;
          }
        });
      },
      handleRankChange(val) {
        this.value.level = val;
      }
    }
  }
</script>

<style scoped>
</style>
