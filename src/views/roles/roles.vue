<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card align="left">
      <!-- 渲染数据表格 -->
      <el-row>
        <el-table
          ref="singleTable"
          :data="rolesList"
          highlight-current-row
          style="width: 100%"
          height="491px"
        >
          <el-table-column type="expand" width="100">
            <template slot-scope="scope">
              <el-row
                class="botter-bd"
                v-for="item in scope.row.children"
                :key="item.id"
              >
                <!-- 渲染一级权限 -->
                <el-col :span="10">
                  <el-tag closable>{{ item.authName }}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 渲染二级 三级权限 -->
                <el-col :span="14">
                  <!-- 循环二级权限 -->
                  <el-row v-for="item2 in item.children" :key="item2.id">
                    <!-- 二级 -->
                    <el-col :span="5">
                      <el-tag closable type="success">{{
                        item2.authName
                      }}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!-- 三级 -->
                    <el-col :span="19">
                      <el-tag
                        v-for="item3 in item2.children"
                        :key="item3.id"
                        closable
                        type="warning"
                        >{{ item3.authName }}</el-tag
                      >
                      <!-- <i class="el-icon-caret-right"></i> -->
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            type="index"
            label="序号"
            width="100"
          ></el-table-column>
          <el-table-column
            property="roleName"
            label="角色名称"
            width="300"
          ></el-table-column>
          <el-table-column
            property="roleDesc"
            label="角色描述"
            width="300"
          ></el-table-column>
          <el-table-column property="level" label="操作" width="300">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="small"
                >编辑</el-button
              >
              <el-button type="danger" icon="el-icon-delete" size="small"
                >删除</el-button
              >
              <el-button
                type="warning"
                icon="el-icon-star-off"
                size="small"
                @click="assignRoles(scope.row)"
                >分配角色
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>

    <!-- 分配权限dialog -->
    <el-dialog
      align="left"
      title="分配权限"
      :visible.sync="assignRolesVisible"
      width="60%"
      @close="closeRolesVisible"
    >
      <!-- 树形控件  -->
      <el-tree
        :data="rightList"
        show-checkbox
        node-key="id"
        default-expand-all="true"
        :default-checked-keys="checkedArr"
        :props="rightsProps"
        ref = "treeRef"
      >
      </el-tree>
        <span slot="footer" class="dialog-footer">
           <el-button @click=" assignRolesVisible = false;handleClose();">取 消</el-button>
           <el-button type="primary" @click="setRolesId()">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRoles, getAllRights,setRoles } from "network/roles/roles";
export default {
  name: "Roles",
  data() {
    return {
      rolesList: [],
      assignRolesVisible: false,
      rightList: [],
      //角色所拥有的权限
      checkedArr: [],
      //props属性选项
      rightsProps: {
        label: "authName",
        children: "children",
      },
      //当前角色id
      currentRoleId : 0
    };
  },
  methods: {
    getRolesList() {
      getRoles().then((res) => {
        console.log(res);
        this.rolesList = res.data.data;
      });
    },
    assignRoles(row) {
       //存储当前角色id给分配权限接口使用
       this.currentRoleId = row.id
      getAllRights().then((res) => {
        console.log(res);
        this.rightList = res.data.data;

        //当前角色所拥有的权限
        this.getLeafKeys(row, this.checkedArr);
      });
      this.assignRolesVisible = true;
    },
    getLeafKeys(node, arr) {
      //节点不包含children属性则判定为三级权限
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => this.getLeafKeys(item, arr));
    },
    //关闭分配权限的dialog对话框之前的节点id应该清空掉
    closeRolesVisible() {
      this.checkedArr = [];
    },
    setRolesId(){
      //所有半选全选状态下的ID
        /* const allKeys = [];
        //获取全选节点key
        this.$refs.treeRef.getCheckedKeys();
         //获取半选节点key
        this.$refs.treeRef.getHalfCheckedKeys()  */

        // 装逼写法
        let allKeys = [...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()];
        // join方法生成的是字符串
        let rids = allKeys.join(',');
        console.log(rids)
          console.log(typeof(rids));
        //join 数组内的数据转成字符串
        setRoles(this.currentRoleId,{rids}).then(res=>{
            console.log(res);
            if(res.data.meta.status !== 200) return this.$message.error('权限更新失败');
            this.$message.success('权限更新成功');
             this.assignRolesVisible = false;
             this.getRolesList();
        })

    }
  },
  created() {
    this.getRolesList();
  },
};
</script>   

<style scoped>
.botter-bd {
  border-bottom: 1px solid #ddd;
}

</style>