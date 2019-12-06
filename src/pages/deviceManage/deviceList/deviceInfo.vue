<template>
  <el-dialog title="设备详情" :visible.sync="visible" :before-close="modalClose" :close="modalClose" @close="detailActiveTab = 'first'" width="640px" top="50px">
    <h3 class="detail-base-title">基本信息</h3>
    <ul class="deatil-list">
      <li><span>设备名称：</span>{{ detailData.machineName }}</li>
      <li><span>所属店铺：</span>{{ detailData.shopName }}</li>
      <li><span>设备类型：</span>{{ detailData.parentTypeName }}</li>
      <li><span>设备型号：</span>{{ detailData.subTypeName }}</li>
      <li><span>通信类型：</span>{{ detailData.communicateType | communicateType }}</li>
      <li><span>公司：</span>{{ detailData.company }}</li>
      <li><span>NQT：</span>{{ detailData.nqt }}</li>
      <li><span>IMEI：</span>{{ detailData.imei }}</li>
      <li><span>创建人：</span>{{ detailData.createUser }}</li>
      <li><span>创建时间：</span>{{ detailData.createTime }}</li>
    </ul>
    <h3 class="detail-base-title" style="border:none">功能属性</h3>
    <el-tabs v-model="detailActiveTab">
      <el-tab-pane label="功能设置" name="first">
        <div v-if="detailData.isQuantifyCharge === 1">
          <ul class="deatil-list charge-base">
            <li><span class="charge-base">可选时间范围：</span>{{ detailData.extraAttr.min || '' }}-{{ detailData.extraAttr.max || '' }}小时</li>
            <li><span class="charge-base">单位刻度时间：</span>{{ detailData.extraAttr.step || '' }}小时</li>
            <li><span class="charge-base">推荐充电时间：</span>{{ detailData.extraAttr.default || '' }}小时</li>
            <li></li>
          </ul>
          <div class="charge-control">
            <h2>
              <span>充电功率范围 (瓦)</span>
              <span style="float:right">
                <el-tooltip content="用户充电时间=用户选择时间 × 充电功率对应时间系数" placement="top">
                  <svg-icon icon-class="zhibiaoshuoming" />
                </el-tooltip>
                时间系数
              </span>
            </h2>
            <ul>
              <li>
                <span>低功率 1-{{ detailData.extraAttr.power1 }}</span>
                <span style="float:right">{{ detailData.extraAttr.ratio1 }}</span>
              </li>
              <li>
                <span>中功率 {{ detailData.extraAttr.power1 ? detailData.extraAttr.power1 + 1 : '' }}-{{ detailData.extraAttr.power2 }}</span>
                <span style="float:right">{{ detailData.extraAttr.ratio2 }}</span>
              </li>
              <li>
                <span>高功率 {{ detailData.extraAttr.power2 ? detailData.extraAttr.power2 + 1 : '' }}-{{ detailData.extraAttr.power3 }}</span>
                <span style="float:right">{{ detailData.extraAttr.ratio3 }}</span>
              </li>
            </ul>
          </div>
        </div>
        <el-table :data="detailData.functionList" style="width: 100%" v-if="detailData.configVO">
          <el-table-column prop="functionName" :label="detailData.configVO.name.title" v-if="detailData.configVO.name.available"></el-table-column>
          <el-table-column prop="needMinutes" :label="detailData.configVO.time.title" v-if="detailData.configVO.time.available"></el-table-column>
          <el-table-column prop="functionPrice" :label="detailData.configVO.price.title" v-if="detailData.configVO.price.available"></el-table-column>
          <el-table-column prop="functionCode" :label="detailData.configVO.pulse.title" v-if="detailData.configVO.pulse.available"></el-table-column>
          <el-table-column prop="ifOpen" :label="detailData.configVO.open.title" v-if="detailData.configVO.open.available">
            <template slot-scope="scope">
              <span>{{ scope.row.ifOpen | ifOpenType }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="洗衣液设置" name="second" v-if="detailData.isDetergent === 1">
        <el-table :data="detailData.detergentFunctionList" style="width: 100%">
          <el-table-column prop="functionName" label="功能"></el-table-column>
          <el-table-column prop="detergentLiquid" label="用量/ml"></el-table-column>
          <el-table-column prop="detergentPrice" label="原价/元"></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { communicateType, ifOpenType, waterStatus } from '@/utils/mapping';
export default {
  props: {
    detailData: {
      type: Object,
      default: () => {
        return {configVO:null}
      }
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      detailActiveTab: 'first'
    };
  },
  filters: {
    communicateType(val) {
      return communicateType[val];
    },
    ifOpenType(val) {
      return ifOpenType[val];
    },
    waterStatus(val) {
      return waterStatus[val];
    }
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/variables.scss';
.detail-base-title {
  font-size: 16px;
  padding: 10px 0;
  font-weight: normal;
}
.deatil-list {
  padding-bottom: 15px;
  display: flex;
  flex-flow: row wrap;
  align-content: flex-start;
  li {
    padding: 11px 0;
    width: 50%;
    word-break: break-word;
    border-bottom: 1px solid $under_line;
    span {
      float: left;
      color: rgba(23, 26, 46, 0.45);
      display: inline-block;
      width: 70px;
      height: 100%;
    }
    .charge-base {
      width: 110px;
    }
    i {
      font-style: normal;
    }
  }
}
.charge-control {
  padding-bottom: 10px;
  h2 {
    font-size: 14px;
    font-weight: 600;
    height: 54px;
    line-height: 54px;
    background: rgba(250, 250, 250, 1);
    border-radius: 4px 4px 0px 0px;
    border-bottom: 1px solid $under_line;
    padding: 0 10px;
    color: #262626;
  }

  li {
    height: 54px;
    line-height: 54px;
    border-bottom: 1px solid $under_line;
    padding: 0 10px;
  }
}
</style>
