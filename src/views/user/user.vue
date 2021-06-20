<template>
  <div class="box-card">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片主键 -->
    <el-card align="left">
      <!-- 行 -->
      <!--搜索框和按钮-->
      <el-row :gutter="19">
        <!-- 列 -->
        <el-col :span="10">
          <div style="margin-top: 8px">
            <el-input
              placeholder="请输入内容"
              v-model="usersInfo.query"
              class="input-with-select"
              clearable
              @clear="getUsersInfo"
            >
              <!-- clear事件清空后请求所有数据 -->
              <!-- @clear="searchVal" -->
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getUsersInfo"
              ></el-button>
            </el-input>
          </div>
        </el-col>
        <!-- 列 -->
        <el-col :span="4">
          <div style="margin-top: 8px">
            <el-button type="primary" @click="addUserDialogVisible = true"
              >添加用户</el-button
            >
          </div>
        </el-col>
      </el-row>
      <!-- 渲染数据表格 -->
      <el-row>
        <el-table
          ref="singleTable"
          :data="userList"
          highlight-current-row
          @current-change="handleCurrentChange"
          style="width: 100%"
          height="400px"
        >
          <el-table-column
            type="index"
            label="序号"
            width="100"
          ></el-table-column>
          <el-table-column
            property="username"
            label="姓名"
            width="120"
          ></el-table-column>
          <el-table-column
            property="email"
            label="邮箱"
            width="200"
          ></el-table-column>
          <el-table-column
            property="mobile"
            label="电话"
            width="150"
          ></el-table-column>
          <el-table-column
            property="role_name"
            label="角色"
            width="150"
          ></el-table-column>
          <el-table-column property="mg_state" label="状态" width="200">
            <!-- 作用域插槽的主要作用是在书写插槽内容时可以获取到插槽作用域的值。 -->
            <!-- 作用域插槽 scope相当于一行数据    scope.row是当前行的数据对象 -->
            <!-- slot-scope属性拿到作用域对象 -->
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.mg_state"
                @change="changeStatus(scope.row)"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column property="operation" label="操作" width="200">
            <template slot-scope="scope">
              <el-tooltip content="修改" placement="top">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="small"
                  circle
                  @click="update(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="small"
                  circle
                  @click="handleDeleteOne(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="分配角色" placement="top">
                <el-button
                  type="warning"
                  icon="el-icon-star-off"
                  size="small"
                  circle
                  @click="assignUserRoles(scope.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="usersInfo.pagenum"
        :page-sizes="[10, 20, 30]"
        :page-size="usersInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        class="el-pagination"
        style="margin-top: 12px"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户dialog对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialogVisible"
      width="60%"
      :before-close="handleClose"
    >
      <el-form
        ref="addUserFormRel"
        :rules="addUserFormRul"
        :model="userForm"
        label-width="80px"
      >
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="userForm.username"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="userForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button
          @click="
            addUserDialogVisible = false;
            handleClose();
          "
          >取 消</el-button
        >
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户diaolog对话框 -->

    <el-dialog
      align="left"
      title="修改用户"
      :visible.sync="editUserVisible"
      width="60%"
    >
      <!--主体部分 -->
      <el-form
        :model="editUserForm"
        status-icon
        :rules="addUserFormRul"
        ref="editUserFormRel"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名">
          <el-input
            :disabled="true"
            v-model="editUserForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model.number="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      align="left"
      title="分配角色"
      :visible.sync="assignRolesVisible"
      width="60%"
    >
    <p>当前用户：{{currentUserInfo.username}}</p>
    <p>当前角色：{{currentUserInfo.role_name}}</p>
    <p>分配新角色：
      <el-select v-model="roleid" placeholder="请选择角色">
            <el-option v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value ="item.id"
            >
            </el-option>
      </el-select>
    </p>
        <span slot="footer" class="dialog-footer">
        <el-button @click="assignRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUsersInfo,
  updateUserState,
  addUser,
  getUserById,
  updateUserInfo,
  deleteUser,
  setUserRole,
} from "network/users/users";

import {getRoles} from "network/roles/roles"
export default {
  name: "User",
  data() {
    //验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/;
      if (regEmail.test(value)) {
        return cb();
      }
      //返回一个错误提示
      cb(new Error("请输入合法的邮箱"));
    };
    //验证手机号码的规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^1[345789]\d{9}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      //返回一个错误提示
      cb(new Error("请输入合法的手机号码"));
    };

    return {
      inputValue: "",
      //请求用户列表参数
      usersInfo: {
        query: "",
        pagenum: 1, //当前在第几页
        pagesize: 10, //每页展示多少条
      },
      userList: [],
      value1: true,
      addUserDialogVisible: false,
      assignRolesVisible:false,
      userForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      //当前选用户信息
      currentUserInfo:{

      },
      //保存所有角色列表
      rolesList:[],
      //存储当前用户select框选中的角色id
      roleid:'',
       //添加用户规则
      addUserFormRul: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            min: 6,
            max: 6,
            message: "长度为6个字符",
            trigger: "blur",
          },
        ],
        email: [{ validator: checkEmail, trigger: "blur" }],
        mobile: [{ validator: checkMobile, trigger: "blur", required: false }],
      },
      //是否展示修改用户对话框
      editUserVisible: false,
      //存储获取到的用户信息
      editUserForm: {
        email: "",
        mobile: "",
        rid: "",
        username: "",
      },
    };
  },
  computed: {
    total() {
      return this.userList.length;
    },
  },
  methods: {
    getUsersInfo() {
      getUsersInfo(this.usersInfo).then((res) => {
        console.log(res);
        if (res.data.meta.status !== 200)
          return this.$message.error("请求用户列表失败");
        this.userList = res.data.data.users;
      });
    },
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    //当前页码发生改变的时候触发
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    changeStatus(row) {
      //console.log("row", row);
      /*   let data = {
        uId: row.id,
        type: row.mg_state,
      }; */
      updateUserState(row.id, row.mg_state).then((res) => {
        console.log(res);
        if (res.data.meta.status !== 200) {
          return this.$message.error("请求用户列表失败");
        }
        return;
      });
    },
    //当每页数据条数发生改变的时候触发
    handleSizeChange(newSize) {
      this.usersInfo.pagesize = newSize;
      this.getUsersInfo();
    },
    handleClose(done) {
      this.$refs.addUserFormRel.resetFields();
      done();
    },
    addUser() {
      //校验规则确认是否提交form表单
      console.log(this.$refs.addUserFormRel);
      let isVaild = false;
      this.$refs.addUserFormRel.validate((vaild) => {
        isVaild = vaild;
        if (!vaild) return;
      });
      if (!isVaild) return;
      addUser(this.userForm).then((res) => {
        console.log(res);
        if (res.data.meta.status !== 201)
          return this.$message.error("创建用户失败");
        this.$message.success("创建用户成功");
        this.addUserDialogVisible = false;
        this.getUsersInfo();
      });
    },
    //回填用户编辑页面的数据
    update(row) {
      this.editUserVisible = true;
      this.editUserForm = {
        username: row.username,
        email: row.email,
        mobile: row.mobile,
        id: row.id,
      };
    },
    editUser() {
      let id = this.editUserForm.id;
      let editData = {
        email: this.editUserForm.email,
        mobile: this.editUserForm.mobile,
      };
      let isVaild = false;
      this.$refs.editUserFormRel.validate((vaild) => {
        isVaild = vaild;
        if (!vaild) return;
      });
      if (!isVaild) return;
      updateUserInfo(id, editData).then((res) => {
        //console.log(res)
        if (res.data.meta.status !== 200)
          return this.$message.error("修改失败");
        this.$message.success("修改成功");
        this.editUserVisible = false;
        this.getUsersInfo();
      });
    },
    handleDeleteOne(row) {
      this.open(row.id);
    },
    open(id) {
      this.$confirm("数据删除后将无法恢复, 是否继续?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteUser(id);
          this.getUsersInfo();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    assignUserRoles(row){
      console.log(row)
      this.currentUserInfo = row;
      //获取所有角色信息供用户选择
      getRoles().then(res=>{
        console.log(res)
        this.rolesList = res.data.data;
      })
        this.assignRolesVisible = true;
    },
    //点击确定按钮分配用户角色
    setRoles(){
      const userId = this.currentUserInfo.id;
      const roleId = this.roleid
      setUserRole(userId,roleId).then(res=>{
          console.log(res)
          if(res.data.meta.status!== 200) return this.$message.error('分配角色权限失败')
          this.$message.success('分配角色权限成功')
            this.getUsersInfo();
      })
      this.assignRolesVisible = false;
    }
  },
  created() {
    this.getUsersInfo(this.usersInfo);
  },
};
</script>

<style scoped>
</style>