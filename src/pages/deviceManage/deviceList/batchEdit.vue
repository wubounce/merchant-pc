<template>
  <el-dialog title="批量编辑设备" :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="768px">
    <el-form :model="deviceEditForm" :rules="deviceEditFormRules" ref="deviceEditForm" label-position="left" class="device-edit-wrap">
      <div class="base">
        <p class="device-type">设备类型：{{ deviceEditForm.parentTypeName }}</p>
        <p class="device-type">设备型号：{{ deviceEditForm.subTypeName }}</p>
        <el-form-item label="类别：" class="check-batch-funtion">
          <el-radio-group v-model="checkBatchFuntion">
            <el-radio :label="1">功能设置</el-radio>
            <el-radio :label="2" v-if="deviceEditForm.isDetergent === 1">洗衣液属性</el-radio>
            <el-radio :label="3" v-if="deviceEditForm.setting && deviceEditForm.setting.length > 0">其他属性</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 功能设置 -->
        <div v-if="checkBatchFuntion === 1 && configVO">
          <!-- 充电桩 -->
          <div v-if="deviceEditForm.isQuantifyCharge === 1 && deviceEditForm.extraAttr">
            <el-form-item label="编辑内容：">
              <el-checkbox-group v-model="baseEditBatchFuntion">
                <el-checkbox label="extraAttr" v-if="configVO.extra.available">{{ configVO.extra.unit }}</el-checkbox>
                <el-checkbox label="functionPrice" v-if="configVO.price.available">{{ configVO.price.unit }}</el-checkbox>
                <el-checkbox label="ifOpen" v-if="configVO.open.available">{{ configVO.open.unit }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <div v-if="configVO.extra.available && isShowOptions('extraAttr')">
              <el-form-item label="可选时间范围：">
                <el-col :span="5">
                  <el-select v-model="deviceEditForm.extraAttr.min" placeholder="请选择">
                    <el-option v-for="item in chargeTimeMax" v-show="item >= chargeTimeMin" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                  <span style="position: absolute;left: 235px;color:#bfbfbf;">小时</span>
                </el-col>
                <el-col class="line" :span="1">-</el-col>
                <el-col :span="5">
                  <el-select v-model="deviceEditForm.extraAttr.max" placeholder="请选择">
                    <el-option v-for="item in chargeTimeMax" v-show="item >= chargeTimeMin" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                  <span style="position: absolute;left: 410px;color:#bfbfbf;">小时</span>
                </el-col>
              </el-form-item>
              <el-form-item label="单位刻度时间：" prop="step">
                <div class="add-discount">
                  <el-select v-model="deviceEditForm.extraAttr.step" placeholder="请选择">
                    <el-option label="0.5" :value="0.5"></el-option>
                    <el-option label="1" :value="1"></el-option>
                  </el-select>
                  <span style="position: absolute;left: 235px;color:#bfbfbf;">小时</span>
                </div>
              </el-form-item>
              <el-form-item label="推荐充电时间：">
                <div class="add-discount">
                  <el-select v-model="deviceEditForm.extraAttr.default" placeholder="请选择">
                    <el-option
                      v-for="item in (1 / deviceEditForm.extraAttr.step) * deviceEditForm.extraAttr.max"
                      v-show="item * deviceEditForm.extraAttr.step >= deviceEditForm.extraAttr.min"
                      :key="item"
                      :label="item * deviceEditForm.extraAttr.step"
                      :value="item * deviceEditForm.extraAttr.step"
                    ></el-option>
                  </el-select>
                  <span style="position: absolute;left: 235px;color:#bfbfbf;">小时</span>
                </div>
              </el-form-item>
            </div>
            <el-form-item label="价格：" v-if="configVO.price.available && isShowOptions('functionPrice')" prop="chargeMachinePirce">
              <div class="add-discount">
                <el-input v-model.trim="deviceEditForm.chargeMachinePirce"></el-input>
                <span style="position: absolute;left: 190px;color:#bfbfbf;">元/小时</span>
              </div>
            </el-form-item>
            <el-table :data="deviceEditForm.functionList" style="width: 100%">
              <el-table-column prop="functionName" :label="configVO.name.title" v-if="configVO.name.available"></el-table-column>
              <el-table-column prop="ifOpenStatus" header-align="right" align="right" :label="configVO.open.title" v-if="configVO.open.available && isShowOptions('ifOpen')">
                <template slot-scope="scope">
                  <el-switch v-model="scope.row.ifOpenStatus"></el-switch>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 正常 -->
          <div v-if="deviceEditForm.isQuantifyCharge !== 1">
            <el-form-item label="编辑内容：">
              <el-checkbox-group v-model="baseEditBatchFuntion">
                <el-checkbox label="needMinutes" v-if="configVO.time.available">{{ configVO.time.unit }}</el-checkbox>
                <el-checkbox label="functionPrice" v-if="configVO.price.available">{{ configVO.price.unit }}</el-checkbox>
                <el-checkbox label="functionCode" v-if="configVO.pulse.available">{{ configVO.pulse.unit }}</el-checkbox>
                <el-checkbox label="ifOpen" v-if="configVO.open.available">{{ configVO.open.unit }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-table :data="deviceEditForm.functionList" style="width: 100%" key="functionList">
              <el-table-column prop="functionName" :label="configVO.name.title" v-if="configVO.name.available"></el-table-column>
              <el-table-column prop="needMinutes" :label="configVO.time.title" v-if="configVO.time.available && isShowOptions('needMinutes')">
                <template slot-scope="scope">
                  <div v-if="configVO.time.join">
                    <el-form-item v-if="scope.$index === 0" :prop="'functionList.' + scope.$index + '.needMinutes'" :rules="validatorRules(configVO.time)">
                      <el-input v-model.trim="scope.row.needMinutes"></el-input>
                    </el-form-item>
                    <span v-else>{{ getRestNeedMinutes(scope.row) }}</span>
                  </div>
                  <el-form-item v-else :prop="'functionList.' + scope.$index + '.needMinutes'" :rules="validatorRules(configVO.time)">
                    <el-input v-model.trim="scope.row.needMinutes"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="functionPrice" :label="configVO.price.title" v-if="configVO.price.available && isShowOptions('functionPrice')">
                <template slot-scope="scope">
                  <div v-if="configVO.price.join">
                    <el-form-item v-if="scope.$index === 0" :prop="'functionList.' + scope.$index + '.functionPrice'" :rules="validatorRules(configVO.price)">
                      <el-input v-model.trim="scope.row.functionPrice"></el-input>
                    </el-form-item>
                    <span v-else>{{ getRestFunctionPrice(scope.row) }}</span>
                  </div>
                  <el-form-item v-else :prop="'functionList.' + scope.$index + '.functionPrice'" :rules="validatorRules(configVO.price)">
                    <el-input v-model.trim="scope.row.functionPrice"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="functionCode" :label="configVO.pulse.title" v-if="configVO.pulse.available && isShowOptions('functionCode')">
                <template slot-scope="scope">
                  <el-form-item :prop="'functionList.' + scope.$index + '.functionCode'" :rules="validatorRules(configVO.pulse)">
                    <el-input v-model.trim="scope.row.functionCode"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="ifOpenStatus" header-align="right" align="right" :label="configVO.open.title" v-if="configVO.open.available && isShowOptions('ifOpen')">
                <template slot-scope="scope">
                  <el-switch v-model="scope.row.ifOpenStatus"></el-switch>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <!-- 洗衣液属性 -->
        <div class="detergent" v-if="checkBatchFuntion === 2 && deviceEditForm.isDetergent === 1">
          <el-form-item label="洗衣液功能" prop="isOpenDetergent" class="edit-isOpenDetergent">
            <el-switch v-model="deviceEditForm.isOpenDetergentStatus"></el-switch>
          </el-form-item>
          <el-table :data="deviceEditForm.detergentFunctionList" key="detergentFunctionList" style="width: 100%">
            <el-table-column prop="functionName" label="功能"></el-table-column>
            <el-table-column prop="detergentLiquid" label="用量/ml">
              <template slot-scope="scope">
                <el-form-item :prop="'detergentFunctionList.' + scope.$index + '.detergentLiquid'" :rules="deviceEditFormRules.detergentLiquid">
                  <el-input v-model.trim="scope.row.detergentLiquid" maxlength="3"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="functionPrice" label="原价/元">
              <template slot-scope="scope">
                <el-form-item :prop="'detergentFunctionList.' + scope.$index + '.detergentPrice'" :rules="deviceEditFormRules.detergentPrice">
                  <el-input v-model.trim="scope.row.detergentPrice"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 其他属性 -->
        <el-table :data="deviceEditForm.setting" style="width: 100%" key="waterLevel" v-if="checkBatchFuntion === 3">
          <el-table-column prop="functionName" label="属性名称" width="300"></el-table-column>
          <el-table-column prop="setting" label="属性值">
            <template slot-scope="scope">
              <span v-for="(item, index) in scope.row.setting" :key="index" class="extraAttr_setting">
                <el-form-item prop="setting" class="edit-waterLevel" v-if="item.type && item.type === 'select'" :label="item.name">
                  <el-select v-model="item.default" :placeholder="item.desc">
                    <el-option v-if="deviceEditForm.company === 'qiekj'" v-for="item in item.options" :key="item.value" :label="item.name" :value="item.value"></el-option>
                    <el-option v-if="deviceEditForm.company === 'youfang'" v-for="item in item.youfangOptions || item.options" :key="item.value" :label="item.name" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <!-- <el-form-item v-else :label="item.name" :prop="'setting.'+ scope.$index +'.setting.'+ index +'.default'" :rules='deviceEditFormRules.default'> -->
                <el-form-item v-else :label="item.name">
                  <el-input v-model.trim="item.default" :placeholder="item.desc" maxlength="10"></el-input>
                </el-form-item>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-form-item class="action">
        <el-button type="primary" @click="onEditDecive('deviceEditForm')">确定</el-button>
        <el-button @click="resetForm('deviceEditForm')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import {
  getFunctionSetListFun,
  batchEditDetergentListFun,
  batchEditFun,
  batchEditDetergentFun
} from "@/service/device";
import { validatNum } from "@/utils/validate";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    deviceEditdetailForm: {
      type: Object,
      default: () => {
        return {};
      }
    },
    multipleSelectionMachineIds: {
      type: String,
      default: () => {
        return [];
      }
    }
  },
  data() {
    var validatorPower1 = (rule, value, callback) => {
      if (value <= 1) {
        return callback(new Error("功率必须大于1"));
      } else if (value > this.deviceEditForm.extraAttr.maxPower) {
        return callback(new Error(`请填写正确的功率范围数值`));
      } else if (!validatNum(value)) {
        callback(new Error("功率必须为数字值，,无小数"));
      } else {
        callback();
      }
    };
    var validatorPower2 = (rule, value, callback) => {
      let power = this.$options.filters.getBeginPower(
        this.deviceEditForm.extraAttr.power1
      );
      if (value <= power) {
        return callback(new Error(`功率必须大于${power}`));
      } else if (value > this.deviceEditForm.extraAttr.maxPower) {
        return callback(new Error(`请填写正确的功率范围数值`));
      } else if (!validatNum(value)) {
        callback(new Error("功率必须为数字值，,无小数"));
      } else {
        callback();
      }
    };
    var validatorPower3 = (rule, value, callback) => {
      let power = this.$options.filters.getBeginPower(
        this.deviceEditForm.extraAttr.power2
      );
      if (value <= power) {
        return callback(new Error(`功率必须大于${power}`));
      } else if (value > this.deviceEditForm.extraAttr.maxPower) {
        return callback(new Error(`请填写正确的功率范围数值`));
      } else if (!validatNum(value)) {
        callback(new Error("功率必须为数字值，,无小数"));
      } else {
        callback();
      }
    };
    return {
      nativeFunctionList: [],
      nativeBaseEditBatchFuntion: [
        "needMinutes",
        "functionPrice",
        "functionCode",
        "ifOpen",
        "extraAttr"
      ], //正常原始选项
      baseEditBatchFuntion: [
        "needMinutes",
        "functionPrice",
        "functionCode",
        "ifOpen",
        "extraAttr"
      ], //正常编辑内容
      checkBatchFuntion: 1,
      deviceEditForm: this.deviceEditdetailForm,
      deviceEditFormRules: {
        chargeMachinePirce: [
          { required: true, message: "请输入价格", trigger: "blur" },
          {
            pattern: /^([0-4]{1}([.]{1}[0-9]{0,2})?|5|5.0|5.00)$/,
            message: "请输入0.01-5之间数字，最多保留2位小数",
            trigger: "blur"
          }
        ],
        detergentLiquid: [
          { required: true, message: "请输入用量", trigger: "blur" },
          {
            pattern: /^([1-9]\d{0,2})$/,
            message: "请输入1-999之间的数字",
            trigger: "blur"
          }
        ],
        detergentPrice: [
          { required: true, message: "请输入洗衣液价格", trigger: "blur" },
          {
            pattern: /^(([1-9]|[1-9][0-8])(\.\d{0,2})?|(([1-8][0-9])(\.\d{0,2})?)|0\.[1-9]{0,2}|99|99.0|99.00)$/,
            message: "请输入0.01-99之间的数字,最多保留2位小数",
            trigger: "blur"
          }
        ],
        "extraAttr.power1": [
          { required: true, message: "请输入功率", trigger: "blur" },
          { validator: validatorPower1, trigger: "blur" }
        ],
        "extraAttr.power2": [
          { required: true, message: "请输入功率", trigger: "blur" },
          { validator: validatorPower2, trigger: "blur" }
        ],
        "extraAttr.power3": [
          { required: true, message: "请输入功率", trigger: "blur" },
          { validator: validatorPower3, trigger: "blur" }
        ],
        "extraAttr.ratio2": [
          { required: true, message: "请输入系数", trigger: "blur" },
          {
            pattern: /^((0\.[1-9]{0,1}?)|1|1.0)$/,
            message: "请输入0.1-1之间的数字，最多保留1位小数",
            trigger: "blur"
          }
        ],
        "extraAttr.ratio3": [
          { required: true, message: "请输入系数", trigger: "blur" },
          {
            pattern: /^((0\.[1-9]{0,1}?)|1|1.0)$/,
            message: "请输入0.1-1之间的数字，最多保留1位小数",
            trigger: "blur"
          }
        ],
        default: [
          { required: true, message: "内容不可为空", trigger: "blur" },
          {
            pattern: /^([1-9]+\d*)|(0\.[1-9]{0,1}?)$/,
            message: "请输入整数，最多保留1位小数",
            trigger: "blur"
          }
        ]
      },
      //充电时间选择
      chargeTimeMax: 0,
      chargeTimeMin: 0,
      chargeTimeStep: 0,
      configVO: null
    };
  },
  filters: {
    getBeginPower(val) {
      return val ? +val + 1 : val;
    }
  },
  components: {},
  created() {
    this.getFunctionSetList();
    this.getbatchEditDetergentList();
  },
  mounted() {},
  methods: {
    modalClose() {
      this.$emit("update:visible", false); // 直接修改父组件的属性
    },
    validatorRules(params){
      return [
          { required: true, message: `请输入${params.unit}`, trigger: ['blur', 'change'] },
          {
            trigger: ['blur', 'change'],
            validator: (rule, value, callback) => {
              let point = String(value).indexOf('.');
              let pointLen = 0;
              if(point!==-1){
                pointLen = String(value).substring((point+1))
              }
              if (params.point>0&&point!==-1&&pointLen.length>params.point) {
                callback(
                  new Error(`请输入${params.min}-${params.max}之间的数字，最多保留${params.point}位小数`)
                );
              } else if (Number(value) < params.min || Number(value) > params.max) {
                callback(
                  new Error(`请输入${params.min}-${params.max}之间的数字，${params.point?`最多保留${params.point}位小数`:''}`)
                );
              } else {
                callback();
              }
            }
          }
        ]
    },
    async getFunctionSetList() {
      //批量编辑获取功能列表
      let payload = Object.assign(
        {},
        {
          subTypeId: this.deviceEditForm.subTypeId,
          shopId: this.deviceEditForm.shopId
        }
      );
      let res = await getFunctionSetListFun(payload);
      this.configVO = this._.get(res, "configVO", {});
      if (this.deviceEditForm.isQuantifyCharge === 1) {
        let extraAttr = this._.get(res, "extraAttr", {});
        this.chargeTimeMax = extraAttr.max || 0;
        this.chargeTimeMin = extraAttr.min || 0;
        this.chargeTimeStep = extraAttr.step || 0;
      }
      this.deviceEditForm.functionList = res.list || [];
      this.nativeFunctionList = this._.cloneDeep(res.list || []);
      this.deviceEditForm.setting = res.setting || [];
      this.deviceEditForm.functionTempletType = res.functionTempletType;
      this.$set(
        this.deviceEditForm,
        "extraAttr",
        this._.get(res, "list[0].extraAttr", {})
      );
      this.$set(
        this.deviceEditForm,
        "chargeMachinePirce",
        this._.get(res, "list[0].functionPrice", "")
      );
      this.deviceEditForm.functionList.forEach(item => {
        item.ifOpen === 0
          ? this.$set(item, "ifOpenStatus", true)
          : this.$set(item, "ifOpenStatus", false);
      });
      this.formatExtraAttr();
    },
    formatExtraAttr() {
      //额外参数设置充电桩功率，水位default字段代表options中的第几位
      if (!this._.isEmpty(this.deviceEditForm.setting)) {
        this.deviceEditForm.setting = this.deviceEditForm.setting.filter(
          item => {
            if (!this._.isEmpty(item.setting)) {
              item.setting = this._.isString(item.setting)
                ? JSON.parse(item.setting)
                : item.setting;
              if (!this._.isEmpty(item.setting)) {
                item = item.setting.filter(j => {
                  return j.type && j.type === "select"
                    ? this.waterSet(j)
                    : item;
                });
              }
              return item;
            }
          }
        );
      }
    },
    waterSet(j = {}) {
      let defaultvalue = Number(this._.get(j, "default", "0")) - 1;
      if (this.deviceEditForm.company === "qiekj") {
        j.default = this._.get(j, `options[${defaultvalue}].value`, "0");
      }
      if (this.deviceEditForm.company === "youfang") {
        j.default = j.youfangOptions
          ? this._.get(j, `youfangOptions[${defaultvalue}].value`, "0")
          : this._.get(j, `options[${defaultvalue}].value`, "0");
      }
      return j;
    },
    async getbatchEditDetergentList() {
      //批量编辑获取洗衣液功能列表
      let payload = Object.assign(
        {},
        {
          subTypeId: this.deviceEditForm.subTypeId,
          shopId: this.deviceEditForm.shopId
        }
      );
      let res = await batchEditDetergentListFun(payload);
      this.deviceEditForm.detergentFunctionList = res.list;
      this.deviceEditForm.isOpenDetergent == 1
        ? this.$set(this.deviceEditForm, "isOpenDetergentStatus", true)
        : this.$set(this.deviceEditForm, "isOpenDetergentStatus", false);
    },
    getRestNeedMinutes(row) {
      return (row.needMinutes = this._.get(
        this.deviceEditForm,
        "functionList[0].needMinutes",
        row.needMinutes
      ));
    },
    getRestFunctionPrice(row) {
      return (row.functionPrice = this._.get(
        this.deviceEditForm,
        "functionList[0].functionPrice",
        row.needMinutes
      ));
    },
    //去掉uncitonlist中不批量修改的项,取数组差集
    formatBathEditData() {
      let xorList = this._.xor(
        this.baseEditBatchFuntion,
        this.nativeBaseEditBatchFuntion
      );
      let ifOpenLen = 0;
      this.deviceEditForm.functionList = this.deviceEditForm.functionList.map(
        (item, index) => {
          if (item.ifOpenStatus) {
            item.ifOpen = 0;
          } else {
            item.ifOpen = 1;
            ifOpenLen = ifOpenLen + 1;
          }
          if (this.deviceEditForm.isQuantifyCharge === 1) {
            let neextraAttr = this._.cloneDeep(this.deviceEditForm.extraAttr);
            this.$set(
              neextraAttr,
              "channel",
              this._.get(item, "extraAttr.channel", "")
            );
            item.extraAttr = neextraAttr;
            item.functionPrice = this.deviceEditForm.chargeMachinePirce;
          }
          //使用 omit 方法移除不要的属性或者 pick 方法只留下需要的属性
          // const pickNativeProperty = this._.omit(item, xorList);
          // return (item = { ...item, ...pickNativeProperty });
          return this._.omit(item, xorList);
        }
      );
      return ifOpenLen;
    },
    //批量基本功能设置和其他属性
    batchEditBaseFunction() {
      //编辑内容是否开启状态栏，开启状态栏至少要开启一项功能
      if (
        this._.includes(this.baseEditBatchFuntion, "ifOpen") &&
        this.formatBathEditData() === this.deviceEditForm.functionList.length
      ) {
        this.$Message.error("请至少开启一项功能");
        return false;
      }
      let payload = Object.assign(
        {},
        {
          machineIdList: this.multipleSelectionMachineIds,
          subTypeId: this.deviceEditForm.subTypeId,
          shopId: this.deviceEditForm.shopId,
          functionTempletType: this.deviceEditForm.functionTempletType,
          functionJson: this.deviceEditForm.functionList
            ? JSON.stringify(this.deviceEditForm.functionList)
            : null,
          setting: this.getFormatExtraAttr(this.deviceEditForm.setting)
        }
      );
      batchEditFun(payload).then(() => {
        this.$Message.success("批量编辑成功");
        this.modalClose();
        this.$listeners.getDeviceDataToTable &&
          this.$listeners.getDeviceDataToTable();
      });
    },

    getFormatExtraAttr(list = []) {
      //setting说明
      let setting = [];
      list.forEach(item => {
        if (!this._.isEmpty(item.setting)) {
          let values = [];
          item.setting.forEach(i => {
            values.push(i.default);
          });
          setting.push({
            functionId: item.functionId,
            values: values
          });
        }
      });
      return setting.length > 0 ? JSON.stringify(setting) : null;
    },
    //批量洗衣液
    batchEditDetergent() {
      this.deviceEditForm.isOpenDetergentStatus === true
        ? (this.deviceEditForm.isOpenDetergent = 1)
        : (this.deviceEditForm.isOpenDetergent = 0);
      let payload = Object.assign(
        {},
        {
          machineIdList: this.multipleSelectionMachineIds,
          subTypeId: this.deviceEditForm.subTypeId,
          shopId: this.deviceEditForm.shopId,
          isOpenDetergent: this.deviceEditForm.isOpenDetergent,
          detergentJson: JSON.stringify(
            this.deviceEditForm.detergentFunctionList
          )
        }
      );
      batchEditDetergentFun(payload).then(() => {
        this.$Message.success("批量编辑成功");
        this.modalClose();
        this.$listeners.getDeviceDataToTable &&
          this.$listeners.getDeviceDataToTable();
      });
    },
    onEditDecive(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.checkBatchFuntion === 2
            ? this.batchEditDetergent()
            : this.batchEditBaseFunction();
        } else {
          this.$Message.error("请填写完整信息");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].clearValidate();
      this.$refs[formName].resetFields();
      this.modalClose();
    },
    isShowOptions(option) {
      return this._.includes(this.baseEditBatchFuntion, option);
    }
  },
  watch: {
    deviceEditdetailForm: function(val) {
      this.deviceEditForm = val;
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/variables.scss';
.device-type {
  margin-top: 20px;
}
.check-batch-funtion {
  margin-top: 14px;
  margin-bottom: 4px !important;
}
.action {
  text-align: right;
  padding: 16px 0 24px 0;
}
.add-discount {
  display: flex;
}
.charge-control {
  padding-bottom: 24px;
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
.charge-control /deep/ .el-form-item {
  padding-top: 10px;
  margin-bottom: 0 !important;
}
.water-machine-pirce {
  padding-top: 24px;
  padding-bottom: 24px;
}
/deep/ .el-table {
  .el-form-item--small.el-form-item {
    margin-bottom: 25px;
  }
  td,
  th {
    vertical-align: top;
  }
}
.extraAttr_setting /deep/ .el-form-item {
  display: flex;
}
</style>
