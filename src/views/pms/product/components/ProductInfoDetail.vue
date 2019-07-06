<template>
  <div style="margin-top: 50px">
    <el-form :model="value" :rules="rules" ref="productInfoForm" label-width="120px" style="width: 600px" size="small">
      <el-form-item label="书籍分类：" prop="categoryId">
        <el-cascader
          v-model="selectProductCateValue"
          @change="handleCategory"
          :options="productCateOptions">
        </el-cascader>
      </el-form-item>
      <el-form-item label="书籍名称：" prop="bookName">
        <el-input v-model="value.bookName"></el-input>
      </el-form-item>

      <el-form-item label="作者：" prop="author">
        <el-input v-model="value.author"></el-input>
      </el-form-item>

      <el-form-item label="出版社：" prop="supplierName">
        <el-select
          v-model="value.supplierName"
          @change="handleBrandChange"
          placeholder="请选择出版社" >
          <el-option
            v-for="item in brandOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="ISBN：" prop="bookId">
        <el-input v-model="value.bookId"></el-input>
      </el-form-item>
      <el-form-item label="书籍售价：" prop="price">
        <el-input v-model="value.price"></el-input>
      </el-form-item>
      <el-form-item label="市场价：">
        <el-input v-model="value.price"></el-input>
      </el-form-item>
      <el-form-item label="书籍库存：" prop="stock">
        <el-input v-model="value.stock"></el-input>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button type="primary" size="medium" @click="handleNext('productInfoForm')">下一步，填写图书封面</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {fetchListWithChildren} from '@/api/productCate'
  import {fetchList as fetchBrandList} from '@/api/brand'
  import {getProduct} from '@/api/product';

  export default {
    name: "ProductInfoDetail",
    props: {
      value: Object,
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        hasEditCreated:false,
        //选中书籍分类的值
        selectProductCateValue: [],
        productCateOptions: [],
        brandOptions: [],
        rules: {
          bookName: [
            {required: true, message: '请输入书籍名称', trigger: 'blur'},
            {min: 1, max: 140, message: '长度在 1 到 140 个字符', trigger: 'blur'}
          ],
          categoryId: [{required: true, message: '请选择书籍分类', trigger: 'blur'}],
          supplierName: [{required: true, message: '请选择书籍出版社', trigger: 'blur'}],
          bookId: [{required: true, message: '请输入ISBN', trigger: 'blur'}],
          author: [{required: true, message: '请输入作者', trigger: 'blur'}],
          price: [{required: true, message: '请输入价格', trigger: 'blur'}],
          stock: [{required: true, message: '请输入库存', trigger: 'blur'}],
        }
      };
    },
    created() {
      this.getProductCateList();
      this.getBrandList();
    },
    computed: {
      //书籍的编号
      bookId() {
        return this.value.id;
      }
    },
    watch: {
      productId:function(newValue){
        if(!this.isEdit)return;
        if(this.hasEditCreated)return;
        if(newValue===undefined||newValue==null||newValue===0)return;
        this.handleEditCreated();
      },

    },
    methods: {
      //处理编辑逻辑
      handleEditCreated(){
        if(this.value.bookId!==''){
          this.selectProductCateValue.push(this.value.parentId);
          this.selectProductCateValue.push(this.value.categoryId);
        }
        this.hasEditCreated=true;
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
                if(this.value.categoryId===list[i].children[j].categoryId){
                  this.value.parentId=list[j].categoryId;
                }
              }
            }
            this.productCateOptions.push({label: list[i].categoryName, value: list[i].categoryId, children: children});
          }
          if(this.isEdit){
            this.handleEditCreated();
          }
        });
      },
      getBrandList() {
        fetchBrandList({pageNum: 1, pageSize: 100}).then(response => {
          this.brandOptions = [];
          let supplier = response.data.list;
          for (let i = 0; i < supplier.length; i++) {
            this.brandOptions.push({label: supplier[i].supplierName, value: supplier[i].supplierId});
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
      handleBrandChange(val) {
        let supplierName = '';
        let supplierId = '';
        for (let i = 0; i < this.brandOptions.length; i++) {
          if (this.brandOptions[i].value === val) {
            supplierName = this.brandOptions[i].label;
            supplierId = this.brandOptions[i].value;
            break;
          }
        }
        this.value.supplierId = supplierId;
        this.value.supplierName = supplierName;
      },
      handleCategory(val){
        this.value.categoryId = val[1];
      }
    }
  }
</script>

<style scoped>
</style>
