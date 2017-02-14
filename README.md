# dateRangePicker
基于jquery的日期选择插件
# options
"ele"：绑定日期段选择的文本框对象；
"yearOffset"：往前推进年数，比如yearOffset=10，则下拉框每次只显示当前往前推10年的年份；
"pos"：日期选择框出现的位置，一般居左或者居右；
"min_date"：最小日期,
"format"：日期格式，如YYYY-MM-DD
"confirmDateFn"：日期确认回调函数
# 使用方法
var daterangepicker = new DateRangePicker();
   daterangepicker.init({
   	"ele": $("#daterange"),
   	"yearOffset": 50,
   	"pos": "left",
   	"min_date": "1990-01-01",
   	"format": "YYYY-MM-DD",
   	"confirmDateFn": function() {
   		var selectedDate = self.daterangepicker.getDate();
   		console.log(selectedDate)
   	}
});
