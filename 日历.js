let yearEle = document.querySelector(".year")
let mouthEle = document.querySelector(".mouth")
let todayEle = document.querySelector(".today")
let hoursEle = document.querySelector(".hours")
let minutesEle = document.querySelector(".minutes")
let secondEle = document.querySelector(".second")
setInterval(function(){
	let nowTime = new Date();
	let year = nowTime.getFullYear()
	let mouth = nowTime.getMonth()
	let today = nowTime.getDate()
	let hours = nowTime.getHours()
	let minutes = nowTime.getMinutes()
	let second = nowTime.getSeconds()
	yearEle.innerText = year
	mouthEle.innerText = mouth + 1
	todayEle.innerText = today
	hoursEle.innerText = zero(hours) 
	minutesEle.innerText = zero(minutes) 
	secondEle.innerText = zero(second) 
},1000)
//给个位设置0
function zero(nums){
	return nums>=10?nums:"0"+nums
}

//根据年月获得当前月份的天数
function mouthDays(year,mouth){
	//保存月份对应的天数
	let mouthnums = [31,"?",31,30,31,30,31,31,30,31,30,31]       //设置一年的月份数组
	
	//判断是否为闰年
	let flag1 = year%4===0;              //能否被4整除
	let flag2 = year%100!==0;            //能否被100且余数不等于0
	let flag3 = year%400===0;            //能否被400整除
	
	if((flag1&&flag2)||flag3){           //如果(能否被4整除并且被100且余数不等于0)或能否被400整除
		mouthnums[1]=29;                 //为29天
	}else{
		mouthnums[1]=28;                  //否则28天
	}
	return mouthnums[mouth]               //返回当前月份
}

//根据年和月获得当前月份第一天是周几
function mouthStart(year,mouth){
	let time = new Date(year,mouth,1)
	return time.getDay()===0?7:time.getDay()
}
console.log(mouthStart(2019,1))
//渲染日历
let nowTime = new Date();
let nowyear = nowTime.getFullYear();
let nowmonth = nowTime.getMonth();
let nowdate =nowTime.getDate();
console.log(nowdate)
function render (year,mouth){
	let firstDay = mouthStart(year,mouth)
	let allDays =mouthDays(year,mouth)
	let num=1;
	let lis = document.querySelectorAll(".bottom .days li")
	let monthbtn = document.querySelector(".monthbtn")
	let yearbtn = document.querySelector(".yearbtn")
	monthbtn.innerText=nowmonth+1;
	yearbtn.innerText=nowyear;
	
	lis.forEach((val)=>{
		val.querySelector("div").innerText="";
		val.querySelector("div").setAttribute("id","")
		val.classList.remove("active")
	})
	for(let i=firstDay-1;i<allDays+firstDay-1;i++){            //周几的下标加上天数减去多余的一个
		if(year==nowTime.getFullYear() && mouth==nowTime.getMonth() && num==nowTime.getDate()){
			lis[i].classList.add("active")
			
		}
		lis[i].querySelector("div").innerText=num;             //从周一开始加上日期
		lis[i].querySelector("div").setAttribute("id",year+"_"+mouth+"_"+num)
		num++;
		
	}
}
render(nowyear,nowmonth);
//获取切换日期的按钮
let btns = document.querySelectorAll(".bottom .title .btn div")
btns[0].onclick = (function(){
	nowmonth--;
	if(nowmonth<0){
		nowmonth = 11;
		nowyear--;
	}
	render(nowyear,nowmonth)
})
btns[1].onclick = (function(){
	nowmonth++;
	if(nowmonth>11){
		nowmonth = 0;
		nowyear++;
	}
	render(nowyear,nowmonth)
})

let dayDiv = document.querySelectorAll(".days>li>div[id*='_']");
dayDiv.forEach(function(val){
	let time;
	val.onmousemove = function(){
		clearTimeout(time);
		time = setTimeout(()=>{
			if(document.querySelector(".tip")){
				return;
			}
			let div = document.createElement("div");
			div.innerHTML = "<div class='jiantou'></div><div class='addEvent'>填写事件</div><div class='see'>查看事件</div>";
			div.classList.add("tip");
			this.appendChild(div);
		},1000);
	}
	val.onmouseout = function(){
		clearTimeout(time);
	}
})

let bigBox = document.querySelector(".big-box")
		
let dateTime = "";
window.onclick = function(e){
	let target = e.target;
	//跳转到添加事件页面
	if(target.classList.contains("addEvent")){
		bigBox.style.left="0"
		dateTime = target.parentNode.parentNode.id;
	}
	//保存信息的
	if(target.classList.contains("save")){
		
		/*
		*获取旧数据
		*
		* */ 
	
	   let data =localStorage.data;
	   data=data?JSON.parse(data):{}           //如果data为真的话输出JSON格式的对象,为假的话转为空对象,
	   
	   /*
	   *获取添加的数据
	   * */
		let nameEle = document.querySelector("#name")
		let desEle = document.querySelector("#des")
		let addressEle = document.querySelector("#address")
		let name =nameEle.value;
		let des = desEle.value;
		let adress = addressEle.value;
		
		let obj ={
			name:name,
			des:des,
			adress:adress
		};
		if(dateTime in data){
			data[dateTime].push(obj)
		}else{
			data[dateTime] = [obj] 
		}
		localStorage.data = JSON.stringify(data);
		nameEle.value = "";
		desEle.value = "";
		addressEle.value = "home";
		bigBox.style.left ="-100%";
		console.log(data)
	}
	//跳转到查看事件页面
	if(target.classList.contains("see")){
		bigBox.style.left="-200%"
		let data = localStorage.data ? JSON.parse(localStorage.data): {};
		let today = target.parentNode.parentNode.id;          //获取到选中日期
		console.log(target.parentNode.parentNode.id)
		let nowData = data[today];        //找到选中日期的事件
		renderSeler(nowData,today)          //传入事件和日期
	}
	//点击其他地方移除提示
	if(!(target.classList.contains("tip"))){
		let tip = document.querySelector(".tip");
		if(tip){
			tip.parentNode.removeChild(tip);
		}
	}

}

let box = document.querySelector(".box");
window.onkeydown = function (e) {
    /*
    * 返回日历页面
    * */
    if (e.keyCode === 27 && bigBox.offsetLeft !== box.offsetWidth) {
        bigBox.style.left = "-100%";
    }

}

//遍历日程
function renderSeler(data,today){
	let ul = document.querySelector(".select ul")

	let addressObj ={
		school:"x学校",
		home:"家",
		company:"公司"
	};
	today = today.split("_")
	ul.innerHTML="";
	 if(!data){
	    ul.innerHTML = "<div style='color: #fff;font-size: 30px;text-align: center;'>没有日程安排</div>";
		}else{
			data.forEach((val)=>{
				let li =document.createElement("li")
				li.innerHTML=`
					<div class="select-top">
						<span>${val.name}</span>
						<i>${today[0]}年${Number(today[1]) +1}月${today[2]}日</i>
						<em>${addressObj[val.adress]}</em>
					</div>
					<p>${val.des}</p>
				`
				ul.appendChild(li)
			})
			
		}
	
}
function checkSize(year,month,day) {
    /*
    * 获取今天时间信息
    *
    * */
    let date = new Date();
    let nowYear = date.getFullYear();
    let nowMonth = date.getMonth();
    let nowDay = date.getDate();
    /*
    * 比较今天和要比较的日期信息
    * */
    if(year>nowYear){
        return true;
    }else  if(year === nowYear && nowMonth<month){
        return true;
    }else if(year === nowYear && month === nowMonth && day>nowDay){
        return true;
    }else {
        return false;
    }
}

