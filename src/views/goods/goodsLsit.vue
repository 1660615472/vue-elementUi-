<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card align="left">
      <el-row>
        <el-col :span="8">
          <div style="margin-top: 15px">
            <el-input
              placeholder="请输入内容"
              v-model="queryInfo.query"
              class="input-with-select"
              clearable
              @clear="getAllGoodsList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getAllGoodsList"
              ></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="4">
          <div style="margin-top: 15px; margin-left: 40px">
            <el-button type="primary" @click="addGoods">添加商品</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <template>
          <el-table :data="goodsList" border style="width: 100%" height="390px">
            <el-table-column type="index" label="#" width="40">
            </el-table-column>
            <el-table-column prop="goods_name" label="商品名称" width="180">
            </el-table-column>
            <el-table-column
              prop="goods_price"
              label="商品价格（元）"
              width="180"
            >
            </el-table-column>
            <el-table-column prop="goods_weight" label="商品重量">
            </el-table-column>
            <el-table-column prop="add_time" label="创建时间">
              <template slot-scope="scope">
                {{ scope.row.add_time | dateFormat }}
              </template>
            </el-table-column>
            <el-table-column prop="address" label="操作">
              <template slot-scope="scope">
                <el-button size="small" type="primary">
                  <i class="el-icon-edit"></i>编辑</el-button
                >
                <el-button
                  size="small"
                  type="danger"
                  @click="deleteGood(scope.row)"
                >
                  <i class="el-icon-delete"></i>删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-row>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[10, 20, 30]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          style="margin-top: 12px"
          background
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getGoodsList, deleteGood } from "network/goods/goods";
export default {
  name: "GoodsLsit",
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      goodsList: [],
      total: 0,
      isClearable: true,
    };
  },
  methods: {
    getAllGoodsList() {
      getGoodsList(this.queryInfo).then((res) => {
        console.log(res);
        if (res.data.meta.status !== 200)
          return this.$message.error("获取失败");
        this.goodsList = res.data.data.goods;
        this.total = res.data.data.total;
      });
    },
    //当前一页显示多少个
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getAllGoodsList();
    },
    //页码值发生变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getAllGoodsList();
    },
    deleteGood(row) {
      console.log(row);
      this.$confirm("数据删除后将无法恢复, 是否继续?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteGood(row.goods_id).then((res) => {
            console.log(res);
            if (res.data.meta.status !== 200)
              return this.$message.error("删除失败");
            this.$message.success("删除成功");
            this.getAllGoodsList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    addGoods(){
      this.$router.push('/goods/addGoods')
    }
  },
  created() {
    this.getAllGoodsList();
  },
};
</script>

<style>
</style>