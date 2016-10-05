
(function($) {

	$.fn.setSelectionRange = function(start, end) {
		return this.each(function() {
			if(this.setSelectionRange) {
				this.focus();
				this.setSelectionRange(start, end);
			}
			else if(this.createTextRange) {
				var range = this.createTextRange();
				range.collapse(true);
				range.moveEnd('character', end);
				range.moveStart('character', start);
				range.select();
			}
		});
	};

	$.arahanNumLimitter = function(el, options){
		// base 는 함수를 말하고 el 은 선택된 엘리먼트이다. 
		// To avoid scope issues, use 'base' instead of 'this'
    	// to reference this class from internal events and functions.(textcouter 참조)
		var base = this; 
		// Access to jQuery and DOM versions of element (textcouter 참조)
		base.$el = $(el);  
		base.el = el;

		base.isInitValue = false; // 초기 클릭 여부 저장
		// Add a reverse reference to the DOM object (textcouter 참조)
		base.$el.data("arahanNumLimitter", base);

		base.init = function(){
			var datableOptions = ['limitNumber', 'msgAlert', 'initalValue', 'basicMsg'];

			 base.options = $.extend({}, $.arahanNumLimitter.defaultOptions, options);
			 
			 // data- 형식으로 지정할 옵션 지정...
			 $.each(datableOptions, function(k,v){
			 	if(typeof base.$el.attr("data-"+v) != "undefined" ){
    	  			base.options[v] = base.$el.attr("data-"+v);
      		 	}
			 });

			$(el).click(base.clickBaseElem);
			$(el).focus(base.clickBaseElem);
			$(el).keyup(base.keyUpBaseElem);
			$(el).keydown(base.keyDownBaseElem);
      		
			base.options.init(base.el);
		}

		// 도우미 함수들 모음
		base.isNumberCode = function(c){
			return 48<=c && c<=57;
		}

		// 어디선가 가져온 소스인데 어딘지 모르겠습니다.ㅠㅠ... 
		base.setSelectionRange = function(start, end) {
			return this.each(function() {
				if(this.setSelectionRange) {
					this.focus();
					this.setSelectionRange(start, end);
				}
				else if(this.createTextRange) {
					var range = this.createTextRange();
					range.collapse(true);
					range.moveEnd('character', end);
					range.moveStart('character', start);
					range.select();
				}
			});
		}

		// 참고 소스 http://javascript.nwbox.com/cursor_position/
		base.getSelectionStart = function(o) {
			if (o.createTextRange) {
				var r = document.selection.createRange().duplicate()
				r.moveEnd('character', o.value.length)
				if (r.text == '') return o.value.length
				return o.value.lastIndexOf(r.text)
			} else return o.selectionStart
		}

		// 최초클릭
		base.clickBaseElem = function(e){
			if(!base.isInitValue){
				base.$el.val(base.options.initalValue)
				base.isInitValue = true;
			}
			var cursorPosition = base.$el.val().length - base.options.limitNumber;
			base.$el.setSelectionRange(cursorPosition, cursorPosition);
		}

		// 키업
		base.keyUpBaseElem = function(e){
			var c = e.keyCode;
			
			if (  (35 < c && c < 40) || (c==8 || c==46 ) || base.isNumberCode(c) ){
				return false;
			}
			
			var startPos = base.getSelectionStart( base.el );
			var differ = base.$el.val().length - startPos ;
			
			var replacedNumber = base.$el.val().replace(/[^0-9]/gi, ""); 

			var SquareOfLimitNumber = Math.pow(10, base.options.limitNumber);
			if( replacedNumber >= SquareOfLimitNumber ){
				replacedNumber = Math.floor( replacedNumber / SquareOfLimitNumber) * SquareOfLimitNumber; 
				base.$el.val(replacedNumber);	
				base.$el.setSelectionRange( startPos , startPos );
			}
		}

		// 키다운
		base.keyDownBaseElem = function(e){
			var c = e.keyCode;
			var isNotNumber = c < 48 || 57 < c;
			var isNotArrow =   c < 8  ||  46 < c;
			var isNotFKey = c > 123 || c < 112;

			var startPos = base.getSelectionStart( base.el );
			var differ = (base.$el.val().length - startPos );
			
			if( isNotNumber && isNotArrow && isNotFKey){
				if( base.options.msgAlert != "false" ){
					alert(base.options.basicMsg);	
				}
				e.preventDefault();
				return false;
			}

			if(c==40 || c==35){
				e.preventDefault();
				var lastLength = base.$el.val().length - base.options.limitNumber;
				base.$el.setSelectionRange( lastLength, lastLength );
			}

			// 지정한 단계 밑에서 백스페이스 방지
			if ( (differ < base.options.limitNumber &&  c == 8) ){ 
				e.preventDefault();
			}
			
			// 지정한 단계 앞에서 오른쪽방향키와 딜리트 방지
			if(  differ < (base.options.limitNumber + 1)  ){ 
				switch(c){
					case 39:
					case 46:
						e.preventDefault();
				}
			}
		}

		base.init();
	}


  $.arahanNumLimitter.defaultOptions = {
  	'initalValue' : 1000,  //초기 금액
  	'limitNumber' : 2, // 자리수
  	'basicMsg' : "숫자와 기본적인 방향키만 입력할 수 있습니다", // 
  	'msgAlert' : true,
  	// Callback API
    init                        : function(el){}            // Callback: function(element) - Fires after the counter is initially setup (text카운터 참조)
  }	

  $.fn.arahanNumLimitter = function(options) {
    return this.each(function() {
      new $.arahanNumLimitter(this, options);
    });
  };

})(jQuery);
// 참고 소스 http://javascript.nwbox.com/cursor_position/
// 참고 링크 하나 더 https://blog.outsider.ne.kr/322 js 키코드
// 참고 소스 https://github.com/ractoon/jQuery-Text-Counter :: jQuery 라이브러리화 
// TODOS 
// 숫자키코드 받는 부분이 있는데 아직 키패드숫자는 포함 를 안 시켰다.. 
// 급하게 만들어서 아직 뭔가 더 할 부분들이 많겠지...

