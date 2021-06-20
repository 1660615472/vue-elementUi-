<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- @click="addCategory" -->
    <el-card align="left">
      <el-row>
        <el-button
          class="addCategoryButton"
          type="primary"
          size="small"
          @click="addCategoryButton"
          >添加分类</el-button
        >
      </el-row>
      <!-- 分类表格 -->
      <zk-table
        class="zk-table"
        ref="table"
        :data="categoryList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="序号"
        border
      >
        <!-- 这个插槽代表columns中的模板，给columns中的模板传作用域插槽值 -->
        <template slot="isok" slot-scope="scope">
          <i
            v-if="!scope.row.cat_deleted"
            style="color: lightgreen"
            class="el-icon-success"
          ></i>
          <i v-else style="color: red" class="el-icon-error"></i>
        </template>

        <template slot="level" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0" type="primary"
            >一级</el-tag
          >
          <el-tag
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            type="success"
            >二级</el-tag
          >
          <el-tag size="mini" v-else type="warning">三级</el-tag>
        </template>

        <template slot="opt" slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            @click="editCategory(scope.row)"
          >
            <i class="el-icon-edit"></i>编辑</el-button
          >
          <el-button size="small" type="danger">
            <i class="el-icon-delete"></i>删除</el-button
          >
        </template>
      </zk-table>
      <!-- 分页控件 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 30, 40]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改分类的dialog框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editCategoryDialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCategoryDialogVisible"
      width="60%"
      :before-close="handleClose"
      @close="addCateDialogClose"
    >
      <el-form
        :model="categoryForm"
        :rules="rules"
        ref="categoryFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="categoryForm.cat_name"></el-input>
        </el-form-item>

        <el-form-item label="父级分类">
          <!-- Cascader 级联选择器 -->
          <div class="block">
            <el-cascader
              v-model="selectedKeysList"
              :options="parentCateList"
              :props="cascaderProps"
              @change="parentCateChanged"
              clearable
            ></el-cascader>
          </div>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="resteForm('categoryFormRef')">重置</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCategoriess,
  getCategoryList,
  addCategories,
} from "network/categories/categories";
export default {
  name: "GoodsCategory",
  data() {
    return {
      //分页展示的数组
      categoryList: [],
      //新增按钮的分类数组，只显示2J分类
      parentCateList: [],
      //选中的父级分类id数组
      selectedKeysList: [],
      total: 0,
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //数据总条数
      editCategoryDialogVisible: false,
      addCategoryDialogVisible: false,
      //新增分类对象
      categoryForm: {
        cat_name: "",
        cat_pid: 0,
        //默认为1J分类
        cat_level: 0,
      },
      //级联选择器的配置对象
      cascaderProps: {
        expandTrigger: "hover",
        value: "cat_id", //选择参数
        label: "cat_name", //展示方式
        children: "children", //父子嵌套属性
        checkStrictly: "true",
      },
      rules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { min: 3, max: 18, message: "长度在 3 到 18 个字符", trigger: "blur" },
        ],
      },
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          // 将当前列定义为模板列
          type: "template",
          prop: "cat_deleted",
          //当前列使用的模板名称
          template: "isok",
        },
        {
          label: "排序",
          type: "template",
          prop: "cat_level",
          template: "level",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],
    };
  },
  /*   computed:{
    total(){
      return this.categoryList.length
    }
  }, */
  methods: {
    getCategories() {
      getCategoriess(this.queryInfo).then((res) => {
        console.log(res);
        if (res.data.meta.status !== 200)
          return this.$message.console.error("获取商品分类信息失败");
        this.categoryList = res.data.data.result;
        this.total = res.data.data.total;
        this.$message.success("获取商品分类信息成功");
      });
    },
    editCategory(row) {
      console.log("点击了");
      this.editCategoryDialogVisible = true;
    },
    handleClose(done) {
      // this.$refs.addUserFormRel.resetFields();
      done();
    },
    //监听size的变化  queryInfo中的pagesize变化
    handleSizeChange(newPageSize) {
      this.queryInfo.pagesize = newPageSize;
      this.getCategories();
    },
    //当前页码 pagenum
    handleCurrentChange(pagenum) {
      this.queryInfo.pagenum = pagenum;
      this.getCategories();
    },
    addCategoryButton() {
      //{type:2} 获取父级分类数据列表
      getCategoryList({ type: 2 }).then((res) => {
        console.log(res);
        this.parentCateList = res.data.data;
      });
      this.addCategoryDialogVisible = true;
    },
    //选择项发生变化立即触发这个函数
    parentCateChanged() {
      //如果selectedKeys数组中length大于0证明选中父级分类,反之就没有选分类
      if (this.selectedKeysList.length > 0) {
        //获取选中的分类数组中最后一个分类id，这边可能是二级分类
        //this.selectedKeysList[this.selectedKeysList.length - 1  拿到数组最后一个元素
        this.categoryForm.cat_pid =
          this.selectedKeysList[this.selectedKeysList.length - 1];
        //设置level值
        this.categoryForm.cat_level = this.selectedKeysList.length;
        return;
      }
      //没有走这个if语句就代表当前分类就是父级分类
      this.categoryForm.cat_pid = 0;
      this.categoryForm.cat_level = 0;
    },
    addCategory() {
      console.log(this.categoryForm);
      this.$refs.categoryFormRef.validate((vaild) => {
        if(!vaild) return
           addCategories(this.categoryForm).then((res) => {
        console.log(res);
        this.getCategories();
        this.addCategoryDialogVisible = false;
      });
      });
    },
    resteForm() {
      //重置表单数据
      this.$refs.categoryFormRef.resetFields();
      //重置级联下拉框绑定的数据
        //重置级联下拉框绑定的数据
      this.selectedKeysList = [];
      this.categoryForm.cat_level = 0;
      this.categoryForm.cat_pid = 0 ;
    },
    //关闭对话框清除表单数据
    addCateDialogClose(){
      this.$refs.categoryFormRef.resetFields();
        //重置级联下拉框绑定的数据
      this.selectedKeysList = [];
      this.categoryForm.cat_level = 0;
      this.categoryForm.cat_pid = 0 ;

    }
  },
  created() {
    this.getCategories();
  },
};
</script>

<style scoped>
.zk-table {
  margin-top: 30px;
}
.el-cascader {
  width: 100%;
}
</style>