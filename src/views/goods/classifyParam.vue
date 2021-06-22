<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card align="left">
      <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning">
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <el-form
            :model="categoryForm"
            ref="categoryFormRef"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="选择商品分类">
              <!-- Cascader 级联选择器 -->
              <div class="block">
                <el-cascader
                  v-model="selectedKeysList"
                  :options="categoryList"
                  :props="cascaderProps"
                  @change="parentCateChanged"
                  clearable
                ></el-cascader>
              </div>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <!-- 标签页 -->
          <template>
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
              <el-tab-pane label="动态参数" name="many">
                <el-button
                  :disabled="idBtnDisable"
                  size="small"
                  type="primary"
                  @click="addManyParam"
                  >添加参数</el-button
                >
                <!-- 动态参数表格 -->
                <el-table :data="manyTabData" style="width: 100%">
                  <!-- 展开行 -->
                  <el-table-column type="expand">
                    <template slot-scope="scope">
                      <el-row>
                        <!-- 循环渲染tag标签 -->
                        <el-tag
                          class="el-tag"
                          v-for="(item, index) in scope.row.attr_vals"
                          :key="index"
                          closable
                          @close="handleTagClose(index, scope.row)"
                          >{{ item }}
                        </el-tag>
                        <!-- 输入的文本框 -->
                        <!-- 注意这里的inputNewTag、inputNewTagValue需要获取这一行数据的 -->
                        <el-input
                          class="input-new-tag"
                          v-if="scope.row.inputNewTag"
                          v-model="scope.row.inputNewTagValue"
                          ref="saveTagInput"
                          size="small"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)"
                        >
                        </el-input>
                        <!-- 添加的按钮 -->
                        <el-button
                          v-else
                          class="button-new-tag"
                          size="small"
                          @click="showInput(scope.row)"
                          >+ 添加</el-button
                        >
                      </el-row>
                    </template>
                  </el-table-column>
                  <!-- 索引列 -->
                  <el-table-column type="index" label="序号"></el-table-column>
                  <el-table-column
                    prop="attr_name"
                    label="参数名称"
                    width="180"
                  >
                  </el-table-column>
                  <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                      <el-button
                        type="primary"
                        size="small"
                        @click="showEditDialog(scope.row)"
                      >
                        <i class="el-icon-edit"></i>修改</el-button
                      >
                      <el-button
                        type="danger"
                        size="small"
                        @click="deleteCategories(scope.row)"
                      >
                        <i class="el-icon-delete"></i>删除</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="静态属性" name="only">
                <el-button
                  :disabled="idBtnDisable"
                  size="small"
                  type="primary"
                  @click="addManyParam"
                  >添加参数</el-button
                >
                <!-- 静态参数表格 -->
                <el-table :data="onlyTabData" style="width: 100%">
                  <!-- 展开行 -->
                  <el-table-column type="expand">
                    <template slot-scope="scope">
                      <el-row>
                        <el-tag
                          class="el-tag"
                          v-for="(item, index) in scope.row.attr_vals"
                          :key="index"
                          closable
                          >{{ item }}</el-tag
                        >
                      </el-row>
                    </template>
                  </el-table-column>
                  <!-- 索引列 -->
                  <el-table-column type="index" label="序号"></el-table-column>
                  <el-table-column
                    prop="attr_name"
                    label="属性名称"
                    width="180"
                  >
                  </el-table-column>
                  <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                      <el-button
                        type="primary"
                        size="small"
                        @click="showEditDialog(scope.row)"
                      >
                        <i class="el-icon-edit"></i>修改</el-button
                      >
                      <el-button
                        type="danger"
                        size="small"
                        @click="deleteCategories(scope.row)"
                      >
                        <i class="el-icon-delete"></i>删除</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </template>
        </el-col>
      </el-row>
    </el-card>
    <!-- 新增dialog框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="dialogManyVisible"
      width="50%"
      :before-close="handleClose"
      @close="addDialogClosed"
    >
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="80px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <!-- 校验规则的时候prop和v-model的属性名要一致 -->
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogManyVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改dialog框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      :before-close="handleClose"
      @close="editDialogClosed"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="addFormRules"
        label-width="80px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <!-- 校验规则的时候prop和v-model的属性名要一致 -->
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
   

<script>
import {
  getCategoryList,
  getCateParamsList,
  addManyOrOnlyParam,
  getManyOrOnlyById,
  editCategories,
  deleteCate,
} from "network/categories/categories";
export default {
  name: "ClassifyParam",
  data() {
    return {
      categoryList: [],
      selectedKeysList: [],
      categoryForm: {},
      //被激活标签页名称
      activeName: "many",
      // 按钮启用禁用
      isDisabled: false,
      //动态参数数据
      manyTabData: [],
      //静态数据
      onlyTabData: [],
      dialogManyVisible: false,
      editDialogVisible: false,
      /* //控制按钮和文本框切换显示
      inputNewTag: false,
      //tag标签文本框输入的内容
      inputNewTagValue: "", */
      manyParam: "",
      //当前属性的id
      attrId: 0,
      //添加参数表单对象
      addForm: {
        attr_name: "",
      },
      editForm: {
        attr_name: "",
      },
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入", trigger: "blur" },
          {
            min: 1,
            max: 18,
            message: "长度在 1 到 18 个字符",
            trigger: "blur",
          },
        ],
      },
      //级联选择器的配置对象
      cascaderProps: {
        expandTrigger: "hover",
        value: "cat_id", //选择参数
        label: "cat_name", //展示方式
        children: "children", //父子嵌套属性
      },
    };
  },
  methods: {
    //获取商品分类数据 级联选择框使用
    getCategoryList2() {
      getCategoryList().then((res) => {
        console.log(res);
        this.categoryList = res.data.data;
      });
    },
    parentCateChanged() {
      //这里必须选中3及分类才能请求
      if (this.selectedKeysList.length !== 3) {
        this.selectedKeysList = [];
        this.manyTabData = [];
        this.onlyTabData = [];
        return;
      }
      this.getCateParams();
    },
    //tab标签点击处理函数
    handleTabClick() {
      //console.log(this.activeName)
      this.getCateParams();
    },
    getCateParams() {
      getCateParamsList(this.cateId, { sel: this.activeName }).then((res) => {
        //渲染展开行中每一行中的attr_vals属性
        res.data.data.forEach((item) => {
          //split函数分割后变成数组
          //不为空则分割，为空则为空数组
          item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
          //自定义属性，控制tab文本框的显示与隐藏
          item.inputNewTag = false;
          //自定义属性，tab文本框的输入内容
          item.inputNewTagValue = "";
        });

        if (this.activeName == "many") {
          this.manyTabData = res.data.data;
        } else if (this.activeName == "only") {
          this.onlyTabData = res.data.data;
        }
        console.log(res.data.data);
      });
    },
    addManyParam() {
      this.dialogManyVisible = true;
    },
    //监听dialog关闭处理,关闭对话框的同时校验规则也要关闭
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    addParams() {
      this.dialogManyVisible = false;
      this.$refs.addFormRef.validate((vaild) => {
        if (!vaild) return;
        let categorId = this.cateId;
        let addParamObj = {};
        addParamObj.attr_name = this.addForm.attr_name;
        addParamObj.attr_sel = this.activeName;
        addManyOrOnlyParam(categorId, addParamObj).then((res) => {
          console.log(res);
          if (res.data.meta.status !== 201)
            return this.$message.error("新增参数失败");
          this.$message.success("新增参数成功");
          this.getCateParams();
        });
      });
    },
    //修改
    showEditDialog(row) {
      let cateId = this.cateId;
      this.attrId = row.attr_id;
      getManyOrOnlyById(cateId, this.attrId, {
        attr_sel: this.activeName,
      }).then((res) => {
        console.log(res);
        this.editForm.attr_name = res.data.data.attr_name;
      });
      this.editDialogVisible = true;
    },
    //修改后提交数据
    editParams() {
      this.$refs.editFormRef.validate((vaild) => {
        if (!vaild) return;
        let cateId = this.cateId;
        editCategories(cateId, this.attrId, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName,
        }).then((res) => {
          console.log(res);
          if (res.data.meta.status !== 200)
            return this.$message.error("修改失败");
          this.$message.success("修改成功");
          this.editDialogVisible = false;
          this.getCateParams();
        });
      });
    },
    deleteCategories(row) {
      console.log(row);
      this.$confirm("数据删除后将无法恢复, 是否继续?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteCate(this.cateId, row.attr_id).then((res) => {
            console.log(res);
            if (res.data.meta.status !== 200)
              return this.$message.error("删除失败");
            this.$message.success("删除成功");
            this.getCateParams();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleClose() {
      this.$refs.editFormRef.resetFields();
      this.editDialogVisible = false;
      done();
    },
    // tag标签失焦或者按回车键以后
    handleInputConfirm(row) {
      console.log(row);
      //如果输入框为空（去掉空格）
      if (row.inputNewTagValue.trim().length === 0) {
        row.inputNewTagValue = "";
        row.inputNewTag = false;
        return;
      }
      //代表输入合法值则
      row.attr_vals.push(row.inputNewTagValue.trim());
      row.inputNewTagValue = "";
      row.inputNewTag = false;
      //发起请求，保存数据库
      editCategories(this.cateId, row.attr_id, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        //服务器这个参数接收的是字符串，把数组转换成字符串
        attr_vals: row.attr_vals.join(" "),
      }).then((res) => {
        console.log(res);
        if (res.data.meta.status !== 200)
          return this.$message.error("添加失败");
        this.$message.success("添加成功");
      });
    },
    //展示文本输入框
    showInput(row) {
      row.inputNewTag = true;
      //自动聚焦
      //$nextTick 方法的作用，就是当前页面上的元素被重新渲染之后，才会指定回调函数中的代码
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleTagClose(index, row) {
      //删除这个数组，索引为index的
      row.attr_vals.splice(index, 1);
      //发起请求，保存数据库
      editCategories(this.cateId, row.attr_id, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        //服务器这个参数接收的是字符串，把数组转换成字符串
        attr_vals: row.attr_vals.join(" "),
      }).then((res) => {
        console.log(res);
        if (res.data.meta.status !== 200)
          return this.$message.error("删除失败");
        this.$message.success("删除成功");
      });
    },
  },
  computed: {
    //判断级联选择器是否选择了数据，没有选择的话标签内的按钮置灰
    idBtnDisable() {
      if (this.selectedKeysList.length !== 3) {
        return true;
      }
      return false;
    },
    //三级分类id
    cateId() {
      if (this.selectedKeysList.length === 3) {
        return this.selectedKeysList[2];
      }
      return null;
    },
    //动态计算dialog标题文本
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      }
      return "静态属性";
    },
  },
  created() {
    this.getCategoryList2();
  },
};
</script>

<style scoped>
.cat_opt {
  margin-top: 20px;
}
.el-tag {
  margin: 10px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>