<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card align="left">
      <!-- 渲染数据表格 -->
      <el-row>
        <el-table
          ref="singleTable"
          :data="rightsList"
          highlight-current-row
          style="width: 100%"
          height="491px"
        >
          <el-table-column
            type="index"
            label="序号"
            width="100"
          ></el-table-column>
          <el-table-column
            property="authName"
            label="权限名称"
            width="300"
          ></el-table-column>
          <el-table-column
            property="path"
            label="路径"
            width="300"
          ></el-table-column>
          <el-table-column property="level" label="权限等级" width="300">
            <template slot-scope="scope">
              <el-tag type="primary" v-if="scope.row.level === '0'"
                >一级</el-tag
              >
              <el-tag type="success" v-else-if="scope.row.level === '1'"
                >二级</el-tag
              >
              <el-tag type="info" v-else>三级</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { getRights } from "network/rights/rights";
export default {
  name: "Rights",
  data() {
    return {
      rightsList: [],
    };
  },
  methods: {
    getUserRights() {
      getRights().then((res) => {
        console.log(res);
        this.rightsList = res.data.data;
      });
    },
  },
  created() {
    this.getUserRights();
  },
};
</script>   

<style>
</style>