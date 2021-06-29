<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card align="left">
      <el-row>
        <el-alert title="添加商品信息" type="info" center show-icon> </el-alert>
      </el-row>
      <!-- 步骤条 -->
      <el-row>
        <el-steps
          :space="200"
          :active="activeIndex - 0"
          finish-status="success"
          align-center
        >
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
      </el-row>
      <!-- tabs页签 -->
      <el-row>
        <template>
          <!-- form要包在el-tabs外面 -->
          <el-form
            :model="addForm"
            :rules="addRules"
            ref="addFormRef"
            label-width="100px"
            class="demo-ruleForm"
            label-position="top"
          >
            <el-tabs
              v-model="activeIndex"
              tab-position="left"
              @tab-click="handleClick"
              :before-leave="beforeTabLeave"
            >
              <el-tab-pane label="基本信息" name="0">
                <el-form-item label="商品名称" prop="goods_name">
                  <el-input v-model="addForm.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="goods_price">
                  <el-input
                    type="number"
                    v-model="addForm.goods_price"
                  ></el-input>
                </el-form-item>
                <el-form-item label="商品重量" prop="goods_weight">
                  <el-input v-model="addForm.goods_weight"></el-input>
                </el-form-item>
                <el-form-item label="商品数量" prop="goods_number">
                  <el-input
                    type="number"
                    v-model="addForm.goods_number"
                  ></el-input>
                </el-form-item>
                <el-form-item label="商品分类">
                  <!-- Cascader 级联选择器 -->
                  <div class="block">
                    <el-cascader
                      v-model="addForm.goods_cat"
                      :options="categoryList"
                      :props="cascaderProps"
                      @change="parentCateChanged"
                      clearable
                    ></el-cascader>
                  </div>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="商品参数" name="1">
                <el-form-item
                  :label="item.attr_name"
                  v-for="item in manyTabData"
                  :key="item.attr_id"
                >
                  <el-checkbox-group v-model="item.attr_vals">
                    <el-checkbox
                      v-for="value in item.attr_vals"
                      :key="value.id"
                      :label="value"
                      border
                    ></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="商品属性" name="2">
                <el-form-item
                  :label="item.attr_name"
                  v-for="item in onlyTabData"
                  :key="item.attr_id"
                >
                  <el-input v-model="item.attr_vals"></el-input>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="商品图片" name="3">
                <!-- 上传图片控件 -->
                <el-upload
                  class="upload-demo"
                  :action="upLoadUrl"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  list-type="picture"
                  :headers="uploadHeaders"
                  :on-success="handleSuccess"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">
                    只能上传jpg/png文件，且不超过500kb
                  </div>
                </el-upload>
              </el-tab-pane>
              <el-tab-pane label="商品内容" name="4">
                <!-- 富文本 -->
                  <quill-editor v-model="addForm.goods_introduce">

                  </quill-editor>  
                  <!-- 添加商品按钮 -->
                  <el-button class="add-buttom" @click="addGood" type="primary">添加商品</el-button>
              </el-tab-pane>
            </el-tabs>
          </el-form>
        </template>
      </el-row>
    </el-card>
    <!-- 显示预览图片的对话框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="dialogImageVisible"
      width="50%"
    >
      <img class="showImage" :src="previewPath" alt="">
    </el-dialog>
  </div>
</template>

<script>
import {getCategoryList,getCateParamsList,} from "network/categories/categories";
import {addGoods} from 'network/goods/goods';

import _ from 'lodash'
export default {
  name: "AddGoods",
  data() {
    const validateMoney = (rule, value, callback) => {
      if (!value) {
        callback(new Error("价格不能为空"));
      } else if (value.indexOf(".") != -1 && value.split(".").length > 2) {
        callback(new Error("请输入正确格式的金额")); //防止输入多个小数点
      } else if (value.indexOf(".") != -1 && value.split(".")[1].length > 2) {
        callback(new Error("请输入正确的小数位数")); //小数点后两位
      } else {
        callback();
      }
    };
    return {
      activeIndex: "0",
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        //图片
        pics: [],
        attrs:[],
        //富文本，商品描述信息
        goods_introduce:''
      },
      upLoadUrl: "http://127.0.0.1:8888/api/private/v1/upload",
      //上传附件需要请求头 token
      uploadHeaders: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      selectedKeysList: [],
      categoryList: [],
      manyTabData: [],
      onlyTabData: [],
      previewPath: "",
      dialogImageVisible:false,
      //级联选择器的配置对象
      cascaderProps: {
        expandTrigger: "hover",
        value: "cat_id", //选择参数
        label: "cat_name", //展示方式
        children: "children", //父子嵌套属性
      },
      addRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          {
            min: 1,
            max: 30,
            message: "长度在 1 到 30 个字符",
            trigger: "blur",
          },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
          {
            type: "number",
            validator: validateMoney,
          },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    //级联选择器选中项发生变化会触发这个函数
    parentCateChanged() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
        //console.log(this.addForm.goods_cat)
      }
    },
    //获取商品分类数据 级联选择框使用
    getCategoryList2() {
      getCategoryList().then((res) => {
        console.log(res);
        this.categoryList = res.data.data;
      });
    },
    //切换taps页签干的事情
    beforeTabLeave(activeName, oldActiveName) {
      console.log(activeName, oldActiveName);
      if (oldActiveName === "0" && this.addForm.goods_cat.length != 3) {
        this.$message.error("请先选择商品分类");
        return false;
      }
    },
    handleClick(tab, event) {
      console.log(this.activeIndex);
      //动态参数面板
      if (this.activeIndex === "1") {
        getCateParamsList(this.currentCateId, { sel: "many" }).then((res) => {
          console.log(res);
          //渲染展开行中每一行中的attr_vals属性
          res.data.data.forEach((item) => {
            //split函数分割后变成数组
            //不为空则分割，为空则为空数组
            item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
          });
          this.manyTabData = res.data.data;
        });
      } else if (this.activeIndex === "2") {
        getCateParamsList(this.currentCateId, { sel: "only" }).then((res) => {
          console.log(res);
          //渲染展开行中每一行中的attr_vals属性
          res.data.data.forEach((item) => {});
          this.onlyTabData = res.data.data;
        });
      }
    },
    //上传控件预览图片的事件
    handlePreview(file) {
      console.log(file);
      this.previewPath = file.response.data.url;
      this.dialogImageVisible = true;
    },
    //移出图片操作
    handleRemove(file, fileList) {
      console.log(file, fileList);
      //1、获取将要删除的图片路径
      const filePath = file.response.data.tmp_path;
      console.log(filePath);
      //2、从form表单对象pics数组中找到这个图片对应索引值
      const i = this.addForm.pics.findIndex((x) => {
        return x.pic === filePath;
      });
      console.log(i);

      //3、调用数组的splice方法，把图片信息对象从pics数组中移出
      this.addForm.pics.splice(i, 1);
    },
    handleSuccess(response, file, fileList) {
      //拼接得到一个信息对象
      const picInfo = { pic: response.data.tmp_path };
      //将图片对象保存到addForm
      this.addForm.pics.push(picInfo);
    },
    addGood(){
      this.$refs.addFormRef.validate(valid=>{
          if(!valid) return this.$message.error('请填写必要的表单项！');
              //处理动态参数
          this.manyTabData.forEach(item=>{
            const newInfo = {attr_id:item.attr_id,attr_value:item.attr_vals.join(' ')}
            this.addForm.attrs.push(newInfo)
          })
          //处理静态属性
          this.onlyTabData.forEach(item=>{
            const newInfo = {attr_id:item.attr_id,attr_value:item.attr_vals}
            this.addForm.attrs.push(newInfo)
          })
          //深拷贝，不影响级联选择器调用的addForm对象的goods_cat,实际表单提交的是这个对象
         const newForm = _.cloneDeep(this.addForm) //返回一个全新的对象，地址与原来的不同
          //发起请求前，把addForm对象的goods_cat数组转换成字符串addForm
          newForm.goods_cat = newForm.goods_cat.join(',');
          console.log(newForm)
          //发起添加商品请求
          addGoods(newForm).then(res=>{
            console.log(res);
            if(res.data.meta.status !== 201) return this.$message.error('商品添加失败')
            this.$message.success('商品添加成功');
          })
      })
    }
  },
  computed: {
    currentCateId() {
      if (this.addForm.goods_cat.length === 3) return this.addForm.goods_cat[2];
    },
  },
  created() {
    this.getCategoryList2();
  },
};
</script>

<style scoped>
.el-card{
  width: 100%;
  height: 540px;
  overflow:auto;/*当内容超过，出现滚动条*/
}

.el-checkbox {
  margin: 0 10px 0 0;
}
.showImage{
  width: 100%;
  height: 100%;
}
 .add-buttom{
  margin-top: 10px;
} 

</style>