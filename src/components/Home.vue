<template>
  <div class="Home">
    <!--      显示年份 月份-->
    <div class="month">
      <p class="pre_btn" @click="handlePrevMonth()"> < </p>
      <p class="show_ym">{{time.year}}年{{time.month+1}}月</p>
      <p class="next_btn" @click="handleNextMonth()"> > </p>
    </div>
    <ul class="weeks">
      <li v-for="(week,inx) in weekList" :key="inx" v-text="week"></li>
    </ul>
    <ul class="days">
      <li v-for="(item, index) in visibleCalendar"  :key="index" class="day-item"  >
            <div v-if="item.month!=(time.month+1) || (item.month==cuMonth&&item.day<(today+1))" class="past_time">
            {{item.day}}
          </div>
          <div v-else class="date-day" @click="selectDays(index)" >
            <p>{{item.day}}</p>
            <p class="icon" v-if="item.month== cuMonth&&item.day==(today+1)"></p>
          </div>
      </li>
    </ul>

  </div>
</template>

<script>
    import * as utils from '../assets/js/utils.js';
    export default {
        name: "Home",
        data(){
            let {year, month, day} = utils.getNewDate(new Date());
            return{
                weekList: ['日','一', '二', '三', '四', '五', '六'],
                days:[],
                cuYear:'',
                cuMonth:'',
                today:'',
                cuDate:'',
                time:{year, month, day},
                monthLastDay:{
                    0:31,
                    1:28,
                    2:31,
                    3:30,
                    4:31,
                    5:30,
                    6:31,
                    7:31,
                    8:30,
                    9:31,
                    10:30,
                    11:31
                },
                calendarList: [],
                chooseDate:{
                    startDate:-1,
                    endDate:-1,
                }

        }},
        computed:{
            /*获取 日期*/
            visibleCalendar () {
                let calendatArr = [];
                let {year, month, day} = utils.getNewDate(utils.getDate(this.time.year, this.time.month, 1));
                /*这个月的第一天*/
                let currentFirstDay = utils.getDate(year, month, 1);

                // 获取当前月第一天星期几
                let weekDay = currentFirstDay.getDay();
                // console.log(weekDay,'weekDay')
                let startTime = currentFirstDay - weekDay * 24 * 60 * 60 * 1000;
                // console.log(  new Date(startTime + 0* 24 * 60 * 60 * 1000),'startTime')
                let monthDayNum;
                if (weekDay == 5 || weekDay == 6){
                    monthDayNum = 42
                }else {
                    monthDayNum = 35
                }
                for (let i = 0; i < monthDayNum; i++) {
                    calendatArr.push({
                        date: new Date(startTime + i * 24 * 60 * 60 * 1000),
                        year: new Date(startTime + i * 24 * 60 * 60 * 1000).getFullYear(),
                        month: new Date(startTime + i * 24 * 60 * 60 * 1000).getMonth()+1,
                        day: new Date(startTime + i * 24 * 60 * 60 * 1000).getDate(),
                        /*clickDay: false,*/
                    })
                }
                return calendatArr
            }
        },
        mounted(){
          this.cuDate=new Date();
          this.cuYear=new Date().getFullYear();
          this.cuMonth=new Date().getMonth()+1;
          this.today = new Date().getDate()-1;
          // console.log(this.cuDate,this.today)
        },
        methods:{
            /*判断是否是闰年，然后来判断二月的最后一天*/
            getMonthLastDay (year, month){
                if (month != 1) {
                    return this.monthLastDay[month];
                } else {
                    //this.leapyear是布尔值 它表示该年是否为闰年
                    if (this.leapyear) {
                        return 29;
                    } else {
                        return 28;
                    }
                }
            },
            selectDays(n){
                let Dates=this.chooseDate;
                let calenderList=document.querySelectorAll('.days>li');
                let chooseStyle='background:orange;color:#FFFFFF;border-radius:50%;';
                let noStyle='background:"";color:"";border-radius:"";';
                if(Dates.startDate==-1&&Dates.endDate==-1){
                    console.log(n)
                    calenderList[n].children[0].style.cssText=chooseStyle;
                    Dates.startDate=this.visibleCalendar[n].date;
                }else if(Dates.startDate!=-1&&Dates.endDate==-1){
                      if(Dates.startDate<this.visibleCalendar[n].date){
                          /*在这个区间内的日子都加上样式*/
                          Dates.endDate=this.visibleCalendar[n].date;
                          this.visibleCalendar.forEach((v,i)=>{
                              if(v.date>=Dates.startDate&&v.date<=Dates.endDate){
                                  calenderList[i].children[0].style.cssText=chooseStyle
                              }
                          });
                      }else if(Dates.startDate>this.visibleCalendar[n].date){
                          /*当选中的日期小于起始日期时 以这个小的日期作为起始日期*/
                          this.clearStyle();
                          Dates.startDate=this.visibleCalendar[n].date;
                          calenderList[n].children[0].style.cssText=chooseStyle;
                      }
                }else if(Dates.startDate!=-1&& Dates.endDate!=-1){
                    this.clearStyle();
                    Dates.endDate=-1;
                    Dates.startDate=this.visibleCalendar[n].date;
                    calenderList[n].children[0].style.cssText=chooseStyle;
                }
                this.$emit('chooseDate',this.chooseDate)

            },
            /*将日期转化为 YY-MM-DD 的格式*/
            getFormatDate(n){
                let dd=new Date(n);

                let YY=dd.getFullYear();
                let MM=dd.getMonth()+1;
                let DD=dd.getDate();
                console.log(dd);
                return  YY + "-" + MM + "-" + DD;
            },
            /*删除选中样式*/
            clearStyle(){
                let calenderList=document.querySelectorAll('.days>li');
                let noStyle='background:"";color:"";border-radius:"";';
                this.visibleCalendar.forEach((v,i)=>{
                    calenderList[i].children[0].style.cssText=noStyle;
                })
            },
            // 上一个月
            handlePrevMonth () {
                this.clearStyle();
                let prevMonth = utils.getDate(this.time.year,this.time.month,1);
                prevMonth.setMonth(prevMonth.getMonth() - 1);
                this.time = utils.getNewDate(prevMonth);
                this.$emit('handlePrevMonth');
            },
            // 下一个月
            handleNextMonth () {
                this.clearStyle();
                let nextMonth = utils.getDate(this.time.year,this.time.month,1);
                nextMonth.setMonth(nextMonth.getMonth() + 1);
                this.time = utils.getNewDate(nextMonth);
                this.$emit('handleNextMonth');
            },

        },
    }
</script>

<style scoped>
  .Home {
    width: 100%;
    height: 100%;
  }
  ul {
    list-style-type: none;
  }
  .Home .month {
    width: 100%;
    height: 60px;
    padding: 0 15px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .Home .month> p{
    margin: 0 10px;
  }
  .weeks {
    width: 100%;
    height: 30px;
    background: #F1F1F1;
    padding: 0 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    list-style-type: none;
  }
  .days {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
  }
  .days>li {
    width: 14.286%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 34px;
    position: relative;
  }
  .days .day-item .past_time {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    color: #F1F1F1;
  }
  .days .day-item .date-day {
    width: 28px;
    height: 28px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .days .day-item .date-day .icon {
    width: 5px;
    height: 5px;
    background: orange;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 0px;
  }

</style>
