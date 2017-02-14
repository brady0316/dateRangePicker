function DatePicker() {
	this.opts = null;
	this.today = new Date(); //今天
	this.todayDate=this.today.getDate();
	this.currentDate = new Date(); //当前选中日期
}
DatePicker.prototype.init = function(opts) {
	var opts = $.extend({
		'min_date':"1970-01-01",
		"yearOffset": 20//默认往前推20年
	}, opts || {});
	this.opts = opts;
	this.renderCalendar();
	this.bindEvent();
};
DatePicker.prototype.bindEvent = function() {
	var self = this;
	self.opts.container.on("change", ".year-select", function() {
		self.renderSelectedDate();
	});
	//选中月份
	self.opts.container.on("change", ".month-select", function() {
		self.renderSelectedDate();
	});
	//下一月
	self.opts.container.on("click", ".next-btn", function(e) {
		e.stopPropagation();
		var cur_date =self.currentDate.setMonth(self.currentDate.getMonth()+1);
		self.setCurrentDate(cur_date);
	});
	//上一月
	self.opts.container.on("click", ".prev-btn", function(e) {
		e.stopPropagation();
		var cur_date = self.currentDate.setMonth(self.currentDate.getMonth()-1);
		self.setCurrentDate(cur_date);
	});
	//选择日历中某一天
	self.opts.container.on("click", ".date-item", function() {
		if (!$(this).hasClass("disabled")) {
			var _day = $(this).attr("date");
			var cur_date = self.currentDate.setDate(_day);
			self.setCurrentDate(cur_date);
		}
	});
};
//临时被选中的日期
DatePicker.prototype.tempActiveDate=(function(){
	var _date=new Date();
	return {
		getDate: function() {
			return _date;
		},
		setDate:function(date){
			_date=new Date(date);
		}
	};
})();
//设置下拉框选中的日期
DatePicker.prototype.renderSelectedDate = function() {
	var _year = this.opts.container.find(".year-select").val();
	var _month = this.opts.container.find(".month-select").val();
	var _day = this.currentDate.getDate();
	var cur_date = new Date(_year, _month, _day);
	this.setCurrentDate(cur_date);
};
//渲染日历框架
DatePicker.prototype.renderCalendar = function() {
	var calendar_header = this.renderHeader();
	var calendar_days = '<table class="calendar-table"><thead><tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr></thead>';
	var calendar_body = '<tbody class="calendar_body">';
	for (var i = 0; i < 6; i++) {
		calendar_body += '<tr><td class="date-item"></td><td class="date-item"></td><td class="date-item"></td><td class="date-item"></td><td class="date-item"></td><td class="date-item"></td><td class="date-item"></td></tr>';
	}
	calendar_body + '</tbody></table>';
	this.opts.container.html(calendar_header + calendar_days + calendar_body);
	this.renderCalendarData();
};
//渲染日历头部
DatePicker.prototype.renderHeader = function() {
	var _year = this.today.getFullYear();
	var _month = this.today.getMonth() + 1;
	var current_year = this.currentDate.getFullYear();
	var current_month = this.currentDate.getMonth();
	var monthArr = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"];
	var min_year=(new Date(this.opts.min_date.replace(/-/g,"/"))).getFullYear();//最小年份
	var start_year=current_year - this.opts.yearOffset>=min_year?current_year - this.opts.yearOffset:min_year;//下拉框起始年份
	var yearSelect="";
	//如果已经是最小日期，不显示上月按钮
	if (current_year <= min_year && current_month <= 0) {
		yearSelect+='<select class="year-select">';
	}else{
		yearSelect = '<span class="prev-btn"><</span> <select class="year-select">';
	}
	for (var i =start_year; i <= _year; i++) {
		if (i == current_year) {
			yearSelect += '<option value="' + i + '" selected>' + i + '</option>';
		} else {
			yearSelect += '<option value="' + i + '">' + i + '</option>';
		}
	}
	yearSelect += '</select>';
	var monthSelect = '<select class="month-select">';
	for (var i = 0; i < 12; i++) {
		var state="";
		if (current_year < _year) {
			if (i == current_month) {
				state="selected";
			}
		}else if (current_year == _year) {
			if(i==current_month){
				state="selected";
			}else if(i>_month-1){
				state="disabled";
			}
		}else{
			state="disabled";
		}
		monthSelect += '<option value="' + i + '" '+state+'>' + monthArr[i] + '月</option>';
	}
	if (current_year >= _year && current_month+1 >= _month) {
		monthSelect += '</select>';
	}else{
		monthSelect += '</select><span class="next-btn">></span>';
	}
	return "<div class='calendar_header'>" + yearSelect + monthSelect + "</div>";
};
//渲染日历数据
DatePicker.prototype.renderCalendarData = function() {
	var self = this;
	var _year = this.currentDate.getFullYear(); //当前年
	var _month = this.currentDate.getMonth(); //当前月
	var _firstDay = new Date(_year, _month - 1, 1); //当前月第一天
	var _lastDay=new Date(_year,_month+1,0).getDate();//当前月最后一天
	var tds = this.opts.container.find(".calendar_body td");
	var header = self.renderHeader();
	this.opts.container.find(".calendar_header").html(header);
	tds.each(function(index, item) {
		var _thisDate = new Date(_year, _month - 1, index + 1 - _firstDay.getDay());
		var _thisYear=_thisDate.getFullYear();
		var _thisDay = _thisDate.getDate();
		var _thisMonth = _thisDate.getMonth() + 1;
		var _thisDateTime=_thisDate.getTime();
		$(item).html(_thisDay).attr("date", _thisDay).removeClass("active").removeClass("disabled").removeClass("today");
		//当前月并且当前选中日期高亮
		if (_thisDay == self.tempActiveDate.getDate().getDate()) {
			$(item).addClass("active");
		}
		//非当前月或者大于今天的日期禁用
		if (_year == _thisYear && _thisMonth != _month || _year == _thisYear && _thisMonth == _month && _thisDay > _lastDay || self.today.getTime() < new Date(_thisYear, _thisMonth, _thisDay).getTime()) {
			$(item).addClass("disabled").removeClass('active today');
		}
		//处理跨年边界值，比如1990年1月显示的日期实际是1989年12月的日期
		if (_year == _thisYear + 1 && new Date(_thisYear, _thisMonth-1, _thisDay).getTime()<_firstDay.getTime()) {
			$(item).addClass("disabled").removeClass('active today');
		}
		//今天日期样式
		if (_thisDate.getTime() == new Date(self.today.getFullYear(),self.today.getMonth(),self.today.getDate()).getTime()) {
			$(item).addClass("today");
		}
		//如果选择的日期大于今天，则日期重置
		if (_thisDateTime>self.today.getTime() && _thisDay == self.todayDate) {
			$(item).addClass("active");
			self.currentDate = _thisDate;
		}
	});
};
//设置当前日期
DatePicker.prototype.setCurrentDate = function(date, opt_notrigger) {
	this.tempActiveDate.setDate(date);
	this.currentDate = this.tempActiveDate.getDate();
	this.renderCalendarData();
	if(!opt_notrigger&&this.opts.updateCallback){
		this.opts.updateCallback.call(null,this.currentDate);
	}
};

//日期段由两个单独日期实例组成
function DateRangePicker() {
	this.start_picker = null;
	this.end_picker = null;
}
DateRangePicker.prototype.init = function(opts) {
	var self = this;
	this.opts = $.extend({
		"pos":"left",//日历位置，靠左或靠右
		"min_date":"1970-01-01",//最小日期
		"confirmDateFn":function(){//日期更新回调
			
		}
	}, opts || {});
	this.createCalendarWrap();
	this.$wrap=this.opts.ele.parents(".ui-datepicker");
	this.start_picker = new DatePicker();
	this.end_picker = new DatePicker();
	this.start_picker.init({
		"container": this.$wrap.find(".calendar-container"),
		"min_date":self.opts.min_date,
		"yearOffset": self.opts.yearOffset,
		"updateCallback": function(){
			self.updateDate();
		}
	});
	this.end_picker.init({
		"container": this.$wrap.find(".calendar-container2"),
		"yearOffset": self.opts.yearOffset,
		"min_date":self.opts.min_date,
		"updateCallback": function(){
			self.updateDate();
		}
	});
	this.bindEvent();
};
DateRangePicker.prototype.bindEvent = function() {
	var self = this;
	var start_picker = self.start_picker,
		end_picker = self.end_picker;
	var showStart, showEnd;
	this.opts.ele.on("focus",function(){
		self.$wrap.find(".ui-daterangepicker-wrap").show();
		showStart = self.start_picker.currentDate.getTime();
		showEnd = self.end_picker.currentDate.getTime();
	});
	this.$wrap.on("click", "[range-key]", function() {
		var _year = start_picker.currentDate.getFullYear();
		var _month = start_picker.currentDate.getMonth();
		var range = $(this).attr("range-key");
		var start_day = start_picker.todayDate,
			end_day = new Date();
		switch (range) {
			case "今日":
				start_day = new Date(moment());
				break;
			case "昨日":
				start_day = new Date(moment().subtract(1, 'days'));
				end_day=new Date(moment().subtract(1, 'days'));
				break;
			case "最近7日":
				start_day = new Date(moment().subtract(6, 'days'));
				break;
			case "最近30日":
				start_day = new Date(moment().subtract(29, 'days'));
				break;
		}
		self.setDate(start_day,end_day);
		$(this).addClass("active").siblings("[range-key]").removeClass("active");
	});
	this.$wrap.on("click", ".range-confirmBtn", function() {
		var start_day = start_picker.currentDate,
			end_day = end_picker.currentDate;
		showStart = null, showEnd = null;
		self.$wrap.find(".ui-daterangepicker-wrap").hide();
		self.setDate(start_day, end_day);
		self.opts.confirmDateFn();
	});
	this.$wrap.on("click", ".range-cancel", function() {
		self.$wrap.find(".ui-daterangepicker-wrap").hide();
		if (showStart != null && showEnd != null) {
			self.setDate(showStart, showEnd);
		}
	});
	$("html").on("click",function(e){
		var $target=$(e.target);
		if($target.closest(".ui-daterangepicker-wrap").length==0&&$target[0]!=self.opts.ele[0]){
			if (self.$wrap.find(".ui-daterangepicker-wrap").is(":visible")) {
				var cur_daterange=self.getDate();
				var cur_startTime=new Date(cur_daterange.start_date).getTime();
				var cur_endTime=new Date(cur_daterange.end_date).getTime();
				if(cur_startTime!=showStart||cur_endTime!=showEnd){
					e.preventDefault();
					e.stopPropagation();
					self.opts.confirmDateFn();
				}
				self.$wrap.find(".ui-daterangepicker-wrap").hide();
			}
		}
	});
};
DateRangePicker.prototype.updateDate = function() {
	var self = this;
	var start_date = moment(self.start_picker.currentDate).format(self.opts.format);
	var end_date = moment(self.end_picker.currentDate).format(self.opts.format);
	var start_date_time=new Date(self.start_picker.currentDate).getTime();
	var end_date_time=new Date(self.end_picker.currentDate).getTime();
	if(start_date_time>new Date().getTime()){
		self.start_picker.setCurrentDate(new Date(),true);
	}
	if(end_date_time>new Date().getTime()){
		self.end_picker.setCurrentDate(new Date(),true);
	}
	if(start_date_time>end_date_time){
		self.opts.ele.val(end_date + "~" + start_date);
	}else{
		self.opts.ele.val(start_date + "~" + end_date);
	}
	$(".ui-daterangepicker-range li").removeClass("active");
};
//获取起始日期和结束日期段,起始日期若大于结束日期则互换
DateRangePicker.prototype.getDate = function() {
	var start_date=Math.min(this.start_picker.currentDate.getTime(),this.end_picker.currentDate.getTime());
	var end_date=Math.max(this.start_picker.currentDate.getTime(),this.end_picker.currentDate.getTime());
	start_date=moment(start_date).format(this.opts.format);
	end_date=moment(end_date).format(this.opts.format);
	return {
		"start_date":start_date,
		"end_date": end_date
	};
};
//设置起始日期和结束日期
DateRangePicker.prototype.setDate = function(start_date, end_date) {
	if(typeof(start_date)=="string"){
		start_date=start_date.replace(/-/g,"/");
	}
	if(typeof(end_date)=="string"){
		end_date=end_date.replace(/-/g,"/");
	}
	this.start_picker.setCurrentDate(new Date(start_date), true);
	this.end_picker.setCurrentDate(new Date(end_date), true);
	this.updateDate();
};
//创建日期段容器
DateRangePicker.prototype.createCalendarWrap = function() {
	var $parent=this.opts.ele.parents(".ui-datepicker");
	var h=$parent.height(),w=$parent.width();
	var wrap = '<div class="ui-daterangepicker-wrap pos-'+this.opts.pos+'" style="top:'+h+'px;"><div class="ui-calendar"><p class="calendar-title">开始日期</p><div class="calendar-container"></div></div>' +
		'<div class="ui-calendar"><p class="calendar-title">结束日期</p><div class="calendar-container2"></div></div>' +
		'<div class="ui-daterangepicker-range"><ul>' +
		'<li range-key="今日">今日</li>' +
		'<li range-key="昨日">昨日</li>' +
		'<li range-key="最近7日">最近7日</li>' +
		'<li range-key="最近30日">最近30日</li>' +
		'</ul>' +
		'<span class="range-btn range-confirmBtn">确定</span><span class="range-btn range-cancel">取消</span>'
		'</div></div>';
	$parent.append(wrap);
};
