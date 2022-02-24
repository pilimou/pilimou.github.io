
      	var d = new Date();
	    var endDay = new Date();
	    endDay.setDate(d.getDate() - 1);
	
	    $( "#startDate" ).datepicker({
		    timepicker: false,
	 	    language: 'zh',						 	  
	 	    minView: 'days', 
	 	    view: 'days',
	 	    dateFormat:"yyyy-mm-dd",	
	    });
	
	    $( "#endDate" ).datepicker({ 
		    timepicker: false,
	 	    language: 'zh',						 	  
	 	    minView: 'days', 
	 	    view: 'days',
	 	    dateFormat:"yyyy-mm-dd",
	    });

      	function appendZero(obj) {
			if (obj < 10) {
				return "0" + obj;
			} else {
			 	return obj; 
			}
	    }

      	//input連動datepicker
   	  	function changeDatefunc(id, value){
   		  	let inputDate;
   		  	let inputTime;
   		  	if(moment(value, 'YYYY-MM-DD',true).isValid()){
				let inputArray = value.split(" ");
				inputDate = inputArray[0].split("-");
				$("#" + id).data('datepicker').selectDate(
					new Date(inputDate[0], inputDate[1] - 1, inputDate[2]));
		    }
	    }	

      	init();
      	function init(){
        	//預設input顯示和datepicker日期
		    $( "#startDate" ).val(d.getFullYear() + '-' + appendZero(d.getMonth() + 1) + '-' + appendZero(d.getDate()));
		    $( "#endDate" ).val(d.getFullYear() + '-' + appendZero(d.getMonth() + 1) + '-' + appendZero(d.getDate()));
		    $("#startDate").data('datepicker').selectDate(new Date());
		    $("#endDate").data('datepicker').selectDate(new Date());

			$("#startDate").prop("disabled", "disabled");
			$("#checkFlag").prop("checked", true);
     	}
		//國定假日(不包含六日)
		const national_holiday = ["2022-01-31", 
								  "2022-02-01", "2022-02-02", "2022-02-03", "2022-02-04", "2022-02-28",
								  "2022-04-04", "2022-04-05",
								  "2022-05-02",
								  "2022-06-03",
								  "2022-09-09",
								  "2022-10-10"];

		let countdownDay;
		let endTime
		let interval;
		let interval_2;
		let addDay;
	  	$("#query").click(function(){

		  	//檢查格式
		  	if(!checkDate()){
			  	return;
		  	}

		  	//計算兩日期相隔天數
		  	let diffDay = getDiffDay();
			//console.log("diffDay = " + diffDay);
		
		  	//計算相隔日期裡面的國定假日天數
		  	let na_holiday = getNa_holiday();
			//console.log("na_holiday = " + na_holiday);
			
			//計算相隔日期裡面的六日
			let holday = getHoliday(diffDay);
			//console.log("holday = " + holday);
			
			if($("#checkFlag").prop("checked")){

			} else {
				na_holiday = 0;
				holday = 0;
			}
		
			countdownDay = diffDay - na_holiday - holday;
            if(countdownDay == 0){
                alert("沒有工作天");
                return;
            }

			endTime = new Date(startDate);
			endTime.setDate(endTime.getDate() + countdownDay);
			if($("#checkFlag").prop("checked")){
				clearInterval(interval_2);
				interval = setInterval(finalCountdown, 1000);
			} else {
				clearInterval(interval);
				interval_2 = setInterval(finalCountdown_2, 1000);
			}
			
	  	});
		
		let between_holiday;
		let fozenDay = 0;
		let fozenFlag = true;
		let show = null;
		let now;
		function finalCountdown(){
			clearInterval(interval_2);
			let time = new Date();
			let nowTime = time.getTime();
			let time_str = time.getFullYear() + "-" + appendZero(time.getMonth()+1) + "-" + appendZero(time.getDate());
			
			//開始倒數當天等於假日(show還沒資料)
			if(!show && (time_str == between_holiday[0] || time.getDay() == 0 || time.getDay() == 6 )){
				let offsetTime = (endTime.getTime() - nowTime) / 1000; // ** 以秒為單位
            	let day = parseInt(offsetTime / 60 / 60 / 24);
				show = day + "天";
				$("#contdown").text(show + "00時" + "00分" + "00秒");
				$("#holiday").text("放假中");
			}

			if(between_holiday.length > 0){

				if( now != time_str && (time_str == between_holiday[0] || time.getDay() == 0 || time.getDay() == 6 )){
					now = time_str;
					fozenDay += 1;
					$("#contdown").text(show + "00時" + "00分" + "00秒");
					$("#holiday").text("放假中");
					return;
				} else if(time_str > between_holiday[0]){
					between_holiday.shift();
				}

			} else if( now != time_str && (time.getDay() == 0 || time.getDay() == 6)){
				fozenDay += 1;
				$("#contdown").text(show + "00時" + "00分" + "00秒");
				$("#holiday").text("放假中");
				return;
			}

			if(between_holiday.length > 0){

				if( (time_str == between_holiday[0] || time.getDay() == 0 || time.getDay() == 6 )){
					$("#contdown").text(show + "00時" + "00分" + "00秒");
					$("#holiday").text("放假中");
					return;
				} else if(time_str > between_holiday[0]){
					between_holiday.shift();
				}

			} else if((time.getDay() == 0 || time.getDay() == 6)){
				$("#contdown").text(show + "00時" + "00分" + "00秒");
				$("#holiday").text("放假中");
				return;
			}


			if(fozenDay > 0){
				endTime.setDate(endTime.getDate() + fozenDay);
				fozenDay = 0;
			}
			// 倒數計時: 差值
			let offsetTime = (endTime.getTime() - nowTime) / 1000; // ** 以秒為單位
			let sec = parseInt(offsetTime % 60); // 秒
			let min = parseInt((offsetTime / 60) % 60); // 分
			let hr = parseInt((offsetTime / 60 / 60) % 24); // 時
            let day = parseInt(offsetTime / 60 / 60 / 24);
			show = day + "天";
			$("#contdown").text(show + appendZero(hr) + "時" + appendZero(min) + "分" + appendZero(sec) + "秒");
			$("#holiday").text("");
		
			
		}

		function finalCountdown_2(){
			clearInterval(interval);
			let time = new Date();
			let nowTime = time.getTime();
			endTime.getTime();
			// 倒數計時: 差值
			let offsetTime = (endTime.getTime() - nowTime) / 1000; // ** 以秒為單位
			let sec = parseInt(offsetTime % 60); // 秒
			let min = parseInt((offsetTime / 60) % 60); // 分
			let hr = parseInt((offsetTime / 60 / 60) % 24); // 時
            let day = parseInt(offsetTime / 60 / 60 / 24);
			$("#contdown").text(day + "天" + appendZero(hr) + "時" + appendZero(min) + "分" + (sec) + "秒");
		}

	  	let startDate;
	  	let endDate;
	  	function checkDate(){
			startDate = $("#startDate").val();
			endDate = $("#endDate").val();
			if(!moment(startDate, 'YYYY-MM-DD',true).isValid()){
				alert("起始時間格式錯誤");
				return false;
			}
			if(!moment(endDate, 'YYYY-MM-DD',true).isValid()){
				alert("結束時間格式錯誤");
				return false;
			}

			if(startDate > endDate){
				alert("起始時間不能超過結束時間");
				return false;
			}

			return true;
	  	}
		//計算兩日期相隔天數
		function getDiffDay(){
			let start = moment(startDate);
			let end = moment(endDate);
			return end.diff(start,"day");
		}
		//計算相隔日期裡面的國定假日天數
		function getNa_holiday(){
			between_holiday = [];
			let na_holiday = 0;
			$.each(national_holiday, function(index, value){
				if(moment(value).isBetween(startDate, endDate) || value == startDate){
					between_holiday.push(value);
					na_holiday += 1;
				}
			});
			return na_holiday;
		}
		//計算相隔日期裡面的六日
		function getHoliday(diffDay){
			let a = new Date(startDate);
			let firstDay = a.getDate(); 
			let b = new Date(startDate);
			let holday = 0;
			for(let i = 0; i < diffDay; i++){
				b.setDate(firstDay + i);
				if(b.getDay() == 0 || b.getDay() == 6){
					holday++; 
				}
			}  
			
			return holday;
		}
  