
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

			countdownDay = diffDay - na_holiday - holday;
            if(countdownDay == 0){
                alert("沒有工作天");
                return;
            }
			let nowTime = new Date();
			endTime = new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate());
			endTime.setDate(nowTime.getDate() + countdownDay);
			
			setInterval(finalCountdown, 1000);
			
	  	});

		function finalCountdown(){
			let time = new Date();
			let nowTime = time.getTime();
			endTime.getTime();
			// 倒數計時: 差值
			let offsetTime = (endTime - nowTime) / 1000; // ** 以秒為單位
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
			let na_holiday = 0;
			$.each(national_holiday, function(index, value){
				if(moment(value).isBetween(startDate, endDate) || value == startDate){
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
			//最後一天不算(如果是假日)
			let lastDay = new Date(endDate);
			
			return holday;
		}
  