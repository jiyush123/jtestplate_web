<template>
  <el-form :model="formdata">
    <el-form-item label="定时策略">
      <el-row>
        <el-col :span="24">
          <el-text type="success">cron表达式：{{ str_cron }}</el-text>
        </el-col>
        <el-col :span="24">
          <el-tabs type="border-card" style="min-width: 800px">
            <el-tab-pane label="秒">
              <div class="cron-radio-group">
                <el-radio-group v-model="formdata.second" class="cronradio">
                  <el-radio label="0">每一秒</el-radio>
                  <el-radio label='1'>每隔<el-input-number class="radio-input" v-model="interval_second" :min="1"
                      :max="60"></el-input-number>秒执行，从<el-input-number class="radio-input"
                      v-model="interval_start_second" :min="0" :max="59"></el-input-number>秒开始</el-radio>
                  <div class="radio-select"><el-radio label='2'>具体秒数（可多选）

                    </el-radio>
                    <el-select v-model="seconds" multiple placeholder="请选择" style="width: 240px;margin-bottom: auto;"
                      @click="changeSecondRadio">
                      <el-option v-for="item in seconds_list" :key="item.value" :label="item.label"
                        :value="item.value" />
                    </el-select>
                  </div>
                  <el-radio label='3'>周期从<el-input-number class="radio-input" v-model="sencond_start" :min="1"
                      :max="60"></el-input-number>
                    到<el-input-number class="radio-input" v-model="sencond_end" :min="0"
                      :max="59"></el-input-number>秒</el-radio>
                </el-radio-group>
              </div>
            </el-tab-pane>

            <!-- 分钟 -->

            <el-tab-pane label="分">
              <div class="cron-radio-group">
                <el-radio-group v-model="formdata.minute" class="cronradio">
                  <el-radio label="0">每一分钟</el-radio>
                  <el-radio label='1'>每隔<el-input-number class="radio-input" v-model="interval_minute" :min="1"
                      :max="60"></el-input-number>分执行，从<el-input-number class="radio-input"
                      v-model="interval_start_minute" :min="0" :max="59"></el-input-number>分开始</el-radio>
                  <div class="radio-select"><el-radio label='2'>具体分钟数（可多选）

                    </el-radio>
                    <el-select v-model="minute" multiple placeholder="请选择" style="width: 240px;margin-bottom: auto;"
                      @click="changeMinuteRadio">
                      <el-option v-for="item in minute_list" :key="item.value" :label="item.label"
                        :value="item.value" />
                    </el-select>
                  </div>
                  <el-radio label='3'>周期从<el-input-number class="radio-input" v-model="minute_start" :min="1"
                      :max="60"></el-input-number>
                    到<el-input-number class="radio-input" v-model="minute_end" :min="0"
                      :max="59"></el-input-number>分</el-radio>
                </el-radio-group>
              </div>
            </el-tab-pane>

            <!-- 时 -->

            <el-tab-pane label="时">
              <div class="cron-radio-group">
                <el-radio-group v-model="formdata.hours" class="cronradio">
                  <el-radio label="0">每一小时</el-radio>
                  <el-radio label='1'>每隔<el-input-number class="radio-input" v-model="interval_hours" :min="1"
                      :max="24"></el-input-number>小时执行，从<el-input-number class="radio-input"
                      v-model="interval_start_hours" :min="0" :max="23"></el-input-number>小时开始</el-radio>
                  <div class="radio-select"><el-radio label='2'>具体小时数（可多选）

                    </el-radio>
                    <el-select v-model="hours" multiple placeholder="请选择" style="width: 240px;margin-bottom: auto;"
                      @click="changeHoursRadio">
                      <el-option v-for="item in hours_list" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </div>
                  <el-radio label='3'>周期从<el-input-number class="radio-input" v-model="hours_start" :min="0"
                      :max="23"></el-input-number>
                    到<el-input-number class="radio-input" v-model="hours_end" :min="0"
                      :max="23"></el-input-number>小时</el-radio>
                </el-radio-group>
              </div>
            </el-tab-pane>
            <!-- 天 -->
            <el-tab-pane label="天">
              <div class="cron-radio-group">
                <el-radio-group v-model="formdata.day" class="cronradio">
                  <el-radio label="0">每一天</el-radio>
                  <el-radio label='1'>每隔<el-input-number class="radio-input" v-model="interval_day" :min="1"
                      :max="31"></el-input-number>天执行，从<el-input-number class="radio-input" v-model="interval_start_day"
                      :min="1" :max="31"></el-input-number>天开始</el-radio>
                  <div class="radio-select"><el-radio label='2'>具体天数（可多选）
                    </el-radio>
                    <el-select v-model="day" multiple placeholder="请选择" style="width: 240px;margin-bottom: auto;"
                      @click="changeDayRadio">
                      <el-option v-for="item in day_list" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </div>
                  <el-radio label='3'>周期从<el-input-number class="radio-input" v-model="day_start" :min="1"
                      :max="31"></el-input-number>
                    到<el-input-number class="radio-input" v-model="day_end" :min="1"
                      :max="31"></el-input-number>天</el-radio>
                </el-radio-group>
              </div>
            </el-tab-pane>
            <!-- 月 -->
            <el-tab-pane label="月">
              <div class="cron-radio-group">
                <el-radio-group v-model="formdata.month" class="cronradio">
                  <el-radio label="0">每一月</el-radio>
                  <el-radio label='1'>每隔<el-input-number class="radio-input" v-model="interval_month" :min="1"
                      :max="12"></el-input-number>月执行，从<el-input-number class="radio-input"
                      v-model="interval_start_month" :min="1" :max="12"></el-input-number>月开始</el-radio>
                  <div class="radio-select"><el-radio label='2'>具体月数（可多选）

                    </el-radio>
                    <el-select v-model="month" multiple placeholder="请选择" style="width: 240px;margin-bottom: auto;"
                      @click="changeMonthRadio">
                      <el-option v-for="item in month_list" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </div>
                  <el-radio label='3'>周期从<el-input-number class="radio-input" v-model="month_start" :min="1"
                      :max="12"></el-input-number>
                    到<el-input-number class="radio-input" v-model="month_end" :min="1"
                      :max="12"></el-input-number>月</el-radio>
                </el-radio-group>
              </div>
            </el-tab-pane>

            <!-- 年 -->
            <el-tab-pane label="年">
              <div class="cron-radio-group">
                <el-radio-group v-model="formdata.year" class="cronradio">
                  <el-radio label="0">每一年</el-radio>
                  <el-radio label='1'>每隔<el-input-number class="radio-input" v-model="interval_year" :min="1"
                      :max="5"></el-input-number>年执行，从<el-input-number class="radio-input" v-model="interval_start_year"
                      :min="2024" :max="2030"></el-input-number>年开始</el-radio>
                  <div class="radio-select"><el-radio label='2'>具体年份（可多选）

                    </el-radio>
                    <el-select v-model="year" multiple placeholder="请选择" style="width: 240px;margin-bottom: auto;"
                      @click="changeYearRadio">
                      <el-option v-for="item in year_list" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </div>
                  <el-radio label='3'>周期从<el-input-number class="radio-input" v-model="year_start" :min="2024"
                      :max="2030"></el-input-number>
                    到<el-input-number class="radio-input" v-model="year_end" :min="2024"
                      :max="2035"></el-input-number>年</el-radio>
                </el-radio-group>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-form-item>

  </el-form>

</template>


<style>
.cronradio .el-radio {
  display: block;
  margin-bottom: 10px;
}

.cron-radio-group .el-radio-group {
  display: block;
}

.radio-input {
  margin-left: 2px;
  margin-right: 2px;
}

.radio-select {
  display: flex;
  align-items: center
}
</style>

<script setup>
import { reactive, ref, computed, defineProps, defineEmits, defineExpose, watch } from 'vue';


const props = defineProps({
  schedule: String,
})
const emit = defineEmits(['update:schedule'])
// '* * * * * ? *'
// 秒字符串格式化
const str_cron_second = computed(() => {
  if (formdata.second === '1') {
    return str_interval_second.value
  }
  else if (formdata.second === '2') {
    return seconds_select.value
  }
  else if (formdata.second === '3') {
    return str_sencond_start_end.value
  }
  else {
    return '*'
  }
})
// 分钟字符串格式化
const str_cron_minute = computed(() => {
  if (formdata.minute === '1') {
    return str_interval_minute.value
  }
  else if (formdata.minute === '2') {
    return minute_select.value
  }
  else if (formdata.minute === '3') {
    return str_minute_start_end.value
  }
  else {
    return '*'
  }
})
// 小时字符串格式化
const str_cron_hours = computed(() => {
  if (formdata.hours === '1') {
    return str_interval_hours.value
  }
  else if (formdata.hours === '2') {
    return hours_select.value
  }
  else if (formdata.hours === '3') {
    return str_hours_start_end.value
  }
  else {
    return '*'
  }
})

// 天字符串格式化
const str_cron_day = computed(() => {
  if (formdata.day === '1') {
    return str_interval_day.value
  }
  else if (formdata.day === '2') {
    return day_select.value
  }
  else if (formdata.day === '3') {
    return str_day_start_end.value
  }
  else {
    return '*'
  }
})

// 月字符串格式化
const str_cron_month = computed(() => {
  if (formdata.month === '1') {
    return str_interval_month.value
  }
  else if (formdata.month === '2') {
    return month_select.value
  }
  else if (formdata.month === '3') {
    return str_month_start_end.value
  }
  else {
    return '*'
  }
})

// 年字符串格式化
const str_cron_year = computed(() => {
  if (formdata.year === '1') {
    return str_interval_year.value
  }
  else if (formdata.year === '2') {
    return year_select.value
  }
  else if (formdata.year === '3') {
    return str_year_start_end.value
  }
  else {
    return '*'
  }
})

// cron每一项
const formdata = reactive({
  second: '0',
  minute: '0',
  hours: '0',
  day: '0',
  month: '0',
  year: '0'
})

// 间隔多少秒，从几秒开始
const interval_second = ref(1);
const interval_start_second = ref(0);
const str_interval_second = computed(() => {
  return interval_start_second.value.toString() + '/' + interval_second.value.toString();
})

// 具体那一秒开始
const seconds = ref([]);
const seconds_list = [
  {
    value: '0',
    label: '0',
  },
  {
    value: '1',
    label: '1',
  },
  {
    value: '2',
    label: '2',
  },
  {
    value: '3',
    label: '3',
  },
  {
    value: '4',
    label: '4',
  },
  {
    value: '5',
    label: '5',
  },
  {
    value: '6',
    label: '6',
  },
  {
    value: '7',
    label: '7',
  },
  {
    value: '8',
    label: '8',
  },
  {
    value: '9',
    label: '9',
  },
  {
    value: '10',
    label: '10',
  },
  {
    value: '11',
    label: '11',
  },
  {
    value: '12',
    label: '12',
  },
  {
    value: '13',
    label: '13',
  },
  {
    value: '14',
    label: '14',
  },
  {
    value: '15',
    label: '15',
  },
  {
    value: '16',
    label: '16',
  },
  {
    value: '17',
    label: '17',
  },
  {
    value: '18',
    label: '18',
  },
  {
    value: '19',
    label: '19',
  },
  {
    value: '20',
    label: '20',
  },
  {
    value: '21',
    label: '21',
  },
  {
    value: '22',
    label: '22',
  },
  {
    value: '23',
    label: '23',
  },
  {
    value: '24',
    label: '24',
  },
  {
    value: '25',
    label: '25',
  },
  {
    value: '26',
    label: '26',
  },
  {
    value: '27',
    label: '27',
  },
  {
    value: '28',
    label: '28',
  },
  {
    value: '29',
    label: '29',
  },
  {
    value: '30',
    label: '30',
  },
  {
    value: '31',
    label: '31',
  },
  {
    value: '32',
    label: '32',
  },
  {
    value: '33',
    label: '33',
  },
  {
    value: '34',
    label: '34',
  },
  {
    value: '35',
    label: '35',
  },
  {
    value: '36',
    label: '36',
  },
  {
    value: '37',
    label: '37',
  },
  {
    value: '38',
    label: '38',
  },
  {
    value: '39',
    label: '39',
  },
  {
    value: '40',
    label: '40',
  },
  {
    value: '41',
    label: '41',
  },
  {
    value: '42',
    label: '42',
  },
  {
    value: '43',
    label: '43',
  },
  {
    value: '44',
    label: '44',
  },
  {
    value: '45',
    label: '45',
  },
  {
    value: '46',
    label: '46',
  },
  {
    value: '47',
    label: '47',
  },
  {
    value: '48',
    label: '48',
  },
  {
    value: '49',
    label: '49',
  },
  {
    value: '50',
    label: '50',
  },
  {
    value: '51',
    label: '51',
  },
  {
    value: '52',
    label: '52',
  },
  {
    value: '53',
    label: '53',
  },
  {
    value: '54',
    label: '54',
  },
  {
    value: '55',
    label: '55',
  },
  {
    value: '56',
    label: '56',
  },
  {
    value: '57',
    label: '57',
  },
  {
    value: '58',
    label: '58',
  },
  {
    value: '59',
    label: '59',
  }
]
const seconds_select = computed(() => {
  return seconds.value.join(',');
})

const changeSecondRadio = () => {
  formdata.second = '2'
}

// 周期
const sencond_start = ref(1);
const sencond_end = ref(0);
const str_sencond_start_end = computed(() => {
  return sencond_start.value.toString() + '-' + sencond_end.value.toString();
})

//分钟
// 间隔多少分钟，从分钟开始
const interval_minute = ref(1);
const interval_start_minute = ref(0);
const str_interval_minute = computed(() => {
  return interval_start_minute.value.toString() + '/' + interval_minute.value.toString();
})

// 具体那一分钟开始
const minute = ref([]);
const minute_list = [
  {
    value: '0',
    label: '0',
  },
  {
    value: '1',
    label: '1',
  },
  {
    value: '2',
    label: '2',
  },
  {
    value: '3',
    label: '3',
  },
  {
    value: '4',
    label: '4',
  },
  {
    value: '5',
    label: '5',
  },
  {
    value: '6',
    label: '6',
  },
  {
    value: '7',
    label: '7',
  },
  {
    value: '8',
    label: '8',
  },
  {
    value: '9',
    label: '9',
  },
  {
    value: '10',
    label: '10',
  },
  {
    value: '11',
    label: '11',
  },
  {
    value: '12',
    label: '12',
  },
  {
    value: '13',
    label: '13',
  },
  {
    value: '14',
    label: '14',
  },
  {
    value: '15',
    label: '15',
  },
  {
    value: '16',
    label: '16',
  },
  {
    value: '17',
    label: '17',
  },
  {
    value: '18',
    label: '18',
  },
  {
    value: '19',
    label: '19',
  },
  {
    value: '20',
    label: '20',
  },
  {
    value: '21',
    label: '21',
  },
  {
    value: '22',
    label: '22',
  },
  {
    value: '23',
    label: '23',
  },
  {
    value: '24',
    label: '24',
  },
  {
    value: '25',
    label: '25',
  },
  {
    value: '26',
    label: '26',
  },
  {
    value: '27',
    label: '27',
  },
  {
    value: '28',
    label: '28',
  },
  {
    value: '29',
    label: '29',
  },
  {
    value: '30',
    label: '30',
  },
  {
    value: '31',
    label: '31',
  },
  {
    value: '32',
    label: '32',
  },
  {
    value: '33',
    label: '33',
  },
  {
    value: '34',
    label: '34',
  },
  {
    value: '35',
    label: '35',
  },
  {
    value: '36',
    label: '36',
  },
  {
    value: '37',
    label: '37',
  },
  {
    value: '38',
    label: '38',
  },
  {
    value: '39',
    label: '39',
  },
  {
    value: '40',
    label: '40',
  },
  {
    value: '41',
    label: '41',
  },
  {
    value: '42',
    label: '42',
  },
  {
    value: '43',
    label: '43',
  },
  {
    value: '44',
    label: '44',
  },
  {
    value: '45',
    label: '45',
  },
  {
    value: '46',
    label: '46',
  },
  {
    value: '47',
    label: '47',
  },
  {
    value: '48',
    label: '48',
  },
  {
    value: '49',
    label: '49',
  },
  {
    value: '50',
    label: '50',
  },
  {
    value: '51',
    label: '51',
  },
  {
    value: '52',
    label: '52',
  },
  {
    value: '53',
    label: '53',
  },
  {
    value: '54',
    label: '54',
  },
  {
    value: '55',
    label: '55',
  },
  {
    value: '56',
    label: '56',
  },
  {
    value: '57',
    label: '57',
  },
  {
    value: '58',
    label: '58',
  },
  {
    value: '59',
    label: '59',
  }
]
const minute_select = computed(() => {
  return minute.value.join(',');
})

const changeMinuteRadio = () => {
  formdata.minute = '2'
}

// 周期
const minute_start = ref(1);
const minute_end = ref(0);
const str_minute_start_end = computed(() => {
  return minute_start.value.toString() + '-' + minute_end.value.toString();
})

//小时
// 间隔多少小时，从小时开始
const interval_hours = ref(1);
const interval_start_hours = ref(0);
const str_interval_hours = computed(() => {
  return interval_start_hours.value.toString() + '/' + interval_hours.value.toString();
})

// 具体那一小时开始
const hours = ref([]);
const hours_list = [
  {
    value: '0',
    label: '0',
  },
  {
    value: '1',
    label: '1',
  },
  {
    value: '2',
    label: '2',
  },
  {
    value: '3',
    label: '3',
  },
  {
    value: '4',
    label: '4',
  },
  {
    value: '5',
    label: '5',
  },
  {
    value: '6',
    label: '6',
  },
  {
    value: '7',
    label: '7',
  },
  {
    value: '8',
    label: '8',
  },
  {
    value: '9',
    label: '9',
  },
  {
    value: '10',
    label: '10',
  },
  {
    value: '11',
    label: '11',
  },
  {
    value: '12',
    label: '12',
  },
  {
    value: '13',
    label: '13',
  },
  {
    value: '14',
    label: '14',
  },
  {
    value: '15',
    label: '15',
  },
  {
    value: '16',
    label: '16',
  },
  {
    value: '17',
    label: '17',
  },
  {
    value: '18',
    label: '18',
  },
  {
    value: '19',
    label: '19',
  },
  {
    value: '20',
    label: '20',
  },
  {
    value: '21',
    label: '21',
  },
  {
    value: '22',
    label: '22',
  },
  {
    value: '23',
    label: '23',
  }
]
const hours_select = computed(() => {
  return hours.value.join(',');
})

const changeHoursRadio = () => {
  formdata.hours = '2'
}

// 周期
const hours_start = ref(1);
const hours_end = ref(0);
const str_hours_start_end = computed(() => {
  return hours_start.value.toString() + '-' + hours_end.value.toString();
})

// 天
// 间隔多少天，从天开始
const interval_day = ref(1);
const interval_start_day = ref(1);
const str_interval_day = computed(() => {
  return interval_start_day.value.toString() + '/' + interval_day.value.toString();
})

// 具体那一小时开始
const day = ref([]);
const day_list = [
  {
    value: '0',
    label: '0',
  },
  {
    value: '1',
    label: '1',
  },
  {
    value: '2',
    label: '2',
  },
  {
    value: '3',
    label: '3',
  },
  {
    value: '4',
    label: '4',
  },
  {
    value: '5',
    label: '5',
  },
  {
    value: '6',
    label: '6',
  },
  {
    value: '7',
    label: '7',
  },
  {
    value: '8',
    label: '8',
  },
  {
    value: '9',
    label: '9',
  },
  {
    value: '10',
    label: '10',
  },
  {
    value: '11',
    label: '11',
  },
  {
    value: '12',
    label: '12',
  },
  {
    value: '13',
    label: '13',
  },
  {
    value: '14',
    label: '14',
  },
  {
    value: '15',
    label: '15',
  },
  {
    value: '16',
    label: '16',
  },
  {
    value: '17',
    label: '17',
  },
  {
    value: '18',
    label: '18',
  },
  {
    value: '19',
    label: '19',
  },
  {
    value: '20',
    label: '20',
  },
  {
    value: '21',
    label: '21',
  },
  {
    value: '22',
    label: '22',
  },
  {
    value: '23',
    label: '23',
  },
  {
    value: '24',
    label: '24',
  },
  {
    value: '25',
    label: '25',
  },
  {
    value: '26',
    label: '26',
  },
  {
    value: '27',
    label: '27',
  },
  {
    value: '28',
    label: '28',
  },
  {
    value: '29',
    label: '29',
  },
  {
    value: '30',
    label: '30',
  },
  {
    value: '31',
    label: '31',
  }
]
const day_select = computed(() => {
  return day.value.join(',');
})

const changeDayRadio = () => {
  formdata.day = '2'
}

// 周期
const day_start = ref(1);
const day_end = ref(0);
const str_day_start_end = computed(() => {
  return day_start.value.toString() + '-' + day_end.value.toString();
})

//月
// 间隔多少月，从月开始
const interval_month = ref(1);
const interval_start_month = ref(0);
const str_interval_month = computed(() => {
  return interval_start_month.value.toString() + '/' + interval_month.value.toString();
})

// 具体那一月开始
const month = ref([]);
const month_list = [
  {
    value: '1',
    label: '1',
  },
  {
    value: '2',
    label: '2',
  },
  {
    value: '3',
    label: '3',
  },
  {
    value: '4',
    label: '4',
  },
  {
    value: '5',
    label: '5',
  },
  {
    value: '6',
    label: '6',
  },
  {
    value: '7',
    label: '7',
  },
  {
    value: '8',
    label: '8',
  },
  {
    value: '9',
    label: '9',
  },
  {
    value: '10',
    label: '10',
  },
  {
    value: '11',
    label: '11',
  },
  {
    value: '12',
    label: '12',
  }
]
const month_select = computed(() => {
  return month.value.join(',');
})

const changeMonthRadio = () => {
  formdata.month = '2'
}

// 周期
const month_start = ref(1);
const month_end = ref(0);
const str_month_start_end = computed(() => {
  return month_start.value.toString() + '-' + month_end.value.toString();
})

//年
// 间隔多少年，从年开始
const interval_year = ref(1);
const interval_start_year = ref(2024);
const str_interval_year = computed(() => {
  return interval_start_year.value.toString() + '/' + interval_year.value.toString();
})

// 具体那一年开始
const year = ref([]);
const year_list = [
  {
    value: '2024',
    label: '2024',
  },
  {
    value: '2025',
    label: '2025',
  },
  {
    value: '2026',
    label: '2026',
  },
  {
    value: '2027',
    label: '2027',
  },
  {
    value: '2028',
    label: '2028',
  },
  {
    value: '2029',
    label: '2029',
  },
  {
    value: '2030',
    label: '2030',
  },
  {
    value: '2031',
    label: '2031',
  },
  {
    value: '2032',
    label: '2032',
  },
  {
    value: '2033',
    label: '2033',
  },
  {
    value: '2034',
    label: '2034',
  },
  {
    value: '2035',
    label: '2035',
  }
]
const year_select = computed(() => {
  return year.value.join(',');
})

const changeYearRadio = () => {
  formdata.month = '2'
}

// 周期
const year_start = ref(1);
const year_end = ref(0);
const str_year_start_end = computed(() => {
  return year_start.value.toString() + '-' + year_end.value.toString();
})

// 最后拼接的字符串
const str_cron = computed(() => {
  return str_cron_second.value + ' ' +
    str_cron_minute.value + ' ' +
    str_cron_hours.value + ' ' + str_cron_day.value + ' ' + str_cron_month.value + ' ? ' +
    str_cron_year.value
})

const getStrCron = () => {
  // 计算属性不能被修改，需要一个新的列表，然后将各下标的值转换成拼接计算属性的基础数值
  let cron_str = props.schedule.split(" ")
  // 秒
  if (cron_str[0] === '*') {
    formdata.second = '0';
  }
  else if (cron_str[0].includes('/')) {
    formdata.second = '1';
    const interval = cron_str[0].split("/")
    interval_second.value = Number(interval[1]);
    interval_start_second.value = Number(interval[0]);
  }
  else if (cron_str[0].includes('-')) {
    formdata.second = '3';
    const sencond_between = cron_str[0].split("-");
    sencond_start.value = Number(sencond_between[0]);
    sencond_end.value = Number(sencond_between[1]);
  }
  else {
    formdata.second = '2';
    seconds.value = cron_str[0].split(",");
  }
  // 分
  if (cron_str[1] === '*') {
    formdata.minute = '0';
  }
  else if (cron_str[1].includes('/')) {
    formdata.minute = '1';
    const interval = cron_str[1].split("/")
    interval_minute.value = Number(interval[1]);
    interval_start_minute.value = Number(interval[0]);
  }
  else if (cron_str[1].includes('-')) {
    formdata.minute = '3';
    const minute_between = cron_str[1].split("-");
    minute_start.value = Number(minute_between[0]);
    minute_end.value = Number(minute_between[1]);
  }
  else {
    formdata.minute = '2';
    minute.value = cron_str[1].split(",");
  }
  // 时
  if (cron_str[2] === '*') {
    formdata.hours = '0';
  }
  else if (cron_str[2].includes('/')) {
    formdata.hours = '1';
    const interval = cron_str[2].split("/")
    interval_hours.value = Number(interval[1]);
    interval_start_hours.value = Number(interval[0]);
  }
  else if (cron_str[2].includes('-')) {
    formdata.hours = '3';
    const hours_between = cron_str[2].split("-");
    hours_start.value = Number(hours_between[0]);
    hours_end.value = Number(hours_between[1]);
  }
  else {
    formdata.hours = '2';
    hours.value = cron_str[2].split(",");
  }
  // 天 第4位和第6位
  if (cron_str[3] === '*') {
    formdata.day = '0';
  }
  else if (cron_str[3].includes('/')) {
    formdata.day = '1';
    const interval = cron_str[3].split("/")
    interval_day.value = Number(interval[1]);
    interval_start_day.value = Number(interval[0]);
  }
  else if (cron_str[3].includes('-')) {
    formdata.day = '3';
    const day_between = cron_str[3].split("-");
    day_start.value = Number(day_between[0]);
    day_end.value = Number(day_between[1]);
  }
  else {
    formdata.day = '2';
    day.value = cron_str[3].split(",");
  }
  // 月
  if (cron_str[4] === '*') {
    formdata.month = '0';
  }
  else if (cron_str[4].includes('/')) {
    formdata.month = '1';
    const interval = cron_str[4].split("/")
    interval_month.value = Number(interval[1]);
    interval_start_month.value = Number(interval[0]);
  }
  else if (cron_str[4].includes('-')) {
    formdata.month = '3';
    const month_between = cron_str[4].split("-");
    month_start.value = Number(month_between[0]);
    month_end.value = Number(month_between[1]);
  }
  else {
    formdata.month = '2';
    month.value = cron_str[4].split(",");
  }
  // 年
  if (cron_str[6] === '*') {
    formdata.year = '0';
  }
  else if (cron_str[6].includes('/')) {
    formdata.year = '1';
    const interval = cron_str[6].split("/")
    interval_year.value = Number(interval[1]);
    interval_start_year.value = Number(interval[0]);
  }
  else if (cron_str[6].includes('-')) {
    formdata.year = '3';
    const year_between = cron_str[6].split("-");
    year_start.value = Number(year_between[0]);
    year_end.value = Number(year_between[1]);
  }
  else {
    formdata.year = '2';
    year.value = cron_str[6].split(",");
  }
}

defineExpose({ getStrCron })

watch(str_cron, () => {
  emit('update:schedule', str_cron);
})
// 以下是防抖动导致ResizeObserver出现BUG的代码，如果写在全局main.js里，可能会导致部分页面功能不正常，先写在出现BUG的模块
const debounce = (fn, delay) => {
  let timer
  return (...args) => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}
// 在这里设置延迟操作代码，这样就不会弹出报错
const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
  constructor(callback) {
    callback = debounce(callback, 200);
    super(callback);
  }
}

</script>