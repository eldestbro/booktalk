// FG_tabContent
(function() {
	var FG_tabContent = function(hook, currentNum){
		this.hook = hook;
		this.currentNum = currentNum;
		this.objAnchor = [];
		this.objLink = [];
		this.objLI = hook.find('li');
	};

	FG_tabContent.prototype = {
		_load : function() {
			var that = this;
			for (var i=0; i<that.objLI.length; i++) {
				that.objLink[i] = that.objLI[i].getElementsByTagName('a')[0];
				that.objAnchor[i] = document.getElementById(that.objLink[i].getAttribute('href').split('#')[1]);
				if (i != 0) that.objAnchor[i].className += ' hidden';
				else that.objLink[i].parentNode.className += ' visible';
				that.objEvent(i);
			}
			if (!that.currentNum) that.objLink[0].onclick();
			if (that.currentNum) that.objLink[that.currentNum-1].onclick();
		},
		objEvent : function(num) {
			var that = this;
			that.objLink[num].onclick = function() {
				for (var i=0; i<that.objLI.length; i++) {
					var imgEl = that.objLink[i].getElementsByTagName('img')[0]
					if (i == num) {
						if (imgEl) imgEl.src = imgEl.src.replace('_off.gif', '_over.gif');
						if (that.objLink[i].parentNode.className.indexOf('visible') == -1) that.objLink[i].parentNode.className += ' visible';
						that.objAnchor[i].className = that.objAnchor[i].className.replace('hidden', '');
					} else {
						if (imgEl) imgEl.src = imgEl.src.replace('_over.gif', '_off.gif');
						that.objLink[i].parentNode.className = that.objLink[i].parentNode.className.replace('visible', '');
						if (that.objAnchor[i].className.indexOf('hidden') == -1) that.objAnchor[i].className += ' hidden';
					}
				} return false;
			}
		}
	};

	window.FG_tabContent = FG_tabContent;
})();


//공통 script
$(document).ready(function(){
	//tabbox
	//input jquery-fakeform
	$('input[type="radio"], input[type="checkbox"]').fakecheck();
	$('select').fakeselect();
	$(".location .select-loc, .select-option.select-loc").css({"width":"auto"});
//	$('input, textarea').placeholder({customClass:'placeholder'});
	// PLACEHOLDER
	fn.placeholder('[placeholder]');

	//input file
	var fileTarget = $('.form-file .upload-hidden');
	fileTarget.on('change', function(){  // 값이 변경되면
		if(window.FileReader){  // modern browser
			var filename = $(this)[0].files[0].name;
		}else{  // old IE
			var filename = $(this).val().split('/').pop().split('\\').pop();  // 파일명만 추출
		}
		// 추출한 파일명 삽입
		$(this).siblings('.upload-name').val(filename);
	});
	//image load check
	/*
	var magazine = $("#wrap.main #magazine");
	imagesLoaded( magazine, function() {
		chMainResponsive();
	});
	*/

	//datepicker
	$.datepicker.regional['ko'] = {
		inline : true,
		showAnim: "none",
		dateFormat: "yy-mm-dd",
		showMonthAfterYear: true,
		yearSuffix: "년",
		monthNames : ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
		monthNamesShort : ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
		dayNames : ['일', '월', '화', '수', '목', '금', '토'],
		dayNamesShort : ['일', '월', '화', '수', '목', '금', '토'],
		dayNamesMin : ['일', '월', '화', '수', '목', '금', '토']
	};
	$.datepicker.setDefaults($.datepicker.regional['ko']);

	//topbtn
	function topBtnScroll(){
		var docuHeight = $("#wrap").height();
		var winHeight = $(window).height();
		var movePosition = $(document).scrollTop();
		if ( docuHeight > 2000 ){
			if ( movePosition > 2000 ){
				$("#footer .topbtn").stop().fadeIn(600);
			}else{
				$("#footer .topbtn").stop().fadeOut(400);
			}
		}
	}
	topBtnScroll();
	$(window).scroll(function(){
		topBtnScroll();
	});
	$("#footer .topbtn").click(function(e){
		$("html, body").animate({scrollTop: 0}, 400);
		e.preventDefault();
	});
	//topbtn
	function wholesaleTopBtnScroll(){
		var docuHeight = $("#wrap").height();
		var winHeight = $(window).height();
		var movePosition = $(document).scrollTop();
		if ( docuHeight > 500 ){
			if ( movePosition > 500 ){
				$("#wholesale-footer .topbtn").stop().fadeIn(600);
			}else{
				$("#wholesale-footer .topbtn").stop().fadeOut(400);
			}
		}
	}
	wholesaleTopBtnScroll();
	$(window).scroll(function(){
		wholesaleTopBtnScroll();
	});
});

// 새창 띄우기 scroll no
function owScrollNo(xurl, tar, wid, hei, t, l){
	set = 'width='+wid+',height='+hei+',top='+t+',left='+l+', toolbar=no,location=no,directory=no,status=no,menubar=no,scrollbars=no,resizable=no,copyhistory=no';
	win = window.open(xurl,tar,set);
};
// 새창 띄우기 scroll yes
function owScrollYes(xurl, tar, wid, hei, t, l){
	set = 'width='+wid+',height='+hei+',top='+t+',left='+l+', toolbar=no,location=no,directory=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no';
	win = window.open(xurl,tar,set);
};
// 새창 센터띄우기 scroll no
function owScrollNoCenter(xurl, tar, wid, hei){
	var winl = (screen.width - wid) / 2;
	var wint = (screen.height - hei) / 2;
	set = 'width='+wid+',height='+hei+',top='+wint+',left='+winl+', toolbar=no,location=no,directory=no,status=no,menubar=no,scrollbars=no,resizable=no,copyhistory=no';
	win = window.open(xurl,tar,set);
};
// 새창 센터띄우기 scroll yes
function owScrollYesCenter(xurl, tar, wid, hei){
	var winl = (screen.width - wid) / 2;
	var wint = (screen.height - hei) / 2;
	set = 'width='+wid+',height='+hei+',top='+wint+',left='+winl+', toolbar=no,location=no,directory=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no';
	win = window.open(xurl,tar,set);
};
// 팝업창 닫기
function popWinClose(){
	window.close();
};
// 프린트하기
function winPrint(){
	window.print();
};
//쿠키 설정
function setCookiePopup(name, value, expiredays){
	var todayDate = new Date();
	todayDate.setDate( todayDate.getDate() + expiredays );
	document.cookie = name + "=" + escape( value ) + ";path=/;"
}
//쿠키 체크
function getCookiePopup(name){
	var Found = false
	var start, end
	var i = 0
	while(i <= document.cookie.length) {
		start = i
		end = start + name.length
		if(document.cookie.substring(start, end) == name) {
			Found = true
			break
		}
		i++
	}
	if(Found == true) {
		start = end + 1
		end = document.cookie.indexOf(";", start)
		if(end < start)
			end = document.cookie.length
		return document.cookie.substring(start, end)
	}
	return ""
}
//쿠키값 체크후 새창 팝업
function popupNewCookieCheck(cookiename, xurl, tar, wid, hei, top, left){
	if (getCookiePopup(cookiename) != "no") {
		owScrollNo(xurl, tar, wid, hei, top, left);
	}
}
//쿠키값 체크후 레이어 팝업
function popupCookieCheck(cookiename, obj, any){
	if (getCookiePopup(cookiename) != "no") {
		layerFadeIn(obj, any);
	}
}
//layer fadeIn
function layerFadeIn(obj, any){
	$(obj).fadeIn(any);
}
//layer fadeOut
function layerFadeOut(obj, any){
	$(obj).fadeOut(any);
}
//addClass
function uiAddClass(obj, classname){
	$(obj).addClass(classname);
}
//removeClass
function uiRemoveClass(obj, classname){
	$(obj).removeClass(classname);
}
//toggleClass
function uiToggleClass(obj, classname){
	if ( $(obj).hasClass(classname) ){
		$(obj).removeClass(classname);
	}else{
		$(obj).addClass(classname);
	}
}
//uiToggleText
function uiToggleText(_this, txt1, txt2){
	if ( $(_this).text() == txt1 ){
		$(_this).text(txt2);
	}else{
		$(_this).text(txt1);
	}
}
