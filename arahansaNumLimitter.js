
(function($) {
	const 
		 BACKSPACE_KEY = 8
		, END_KEY = 35
		, RIGHT_KEY = 39
		, ARROW_DOWN = 40
		, DELETE_KEY = 46
		, ZERO = 48 
		, NINE = 57
		, F1_KEY = 112
		, F12_KEY = 123
		;

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
			var datableOptions = ['initalValue', 'limitNumber', 'basicMsg' , 'msgAlert','minValue', 'maxValue', 'validMinMax', 'errorClassName'];

			 base.options = $.extend({}, $.arahanNumLimitter.defaultOptions, options);
			 
			 // data- 형식으로 지정할 옵션 지정...
			 $.each(datableOptions, function(k,v){
			 	if(typeof base.$el.attr("data-"+v) != "undefined" ){
    	  			base.options[v] = base.$el.attr("data-"+v);
      		 	}
			 });

			base.$el.click(base.clickBaseElem);
			base.$el.focus(base.clickBaseElem);
			base.$el.keyup(base.keyUpBaseElem);
			base.$el.keydown(base.keyDownBaseElem);
			base.$el.focusout(base.focusOutBaseElem);
      		
			base.options.init(base.el);
		}

		// 도우미 함수들 모음
		base.isNumberCode = function(c){
			return ZERO <=c && c <= NINE;
		}
		base.isNavigationCode = function(c){
			return END_KEY < c && c < ARROW_DOWN;
		}

		// 커서 위치 세팅
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

		// 현재 커서 위치 구함
		// 참고 소스 http://javascript.nwbox.com/cursor_position/
		base.getSelectionStart = function(o) {
			if (o.createTextRange) {
				var r = document.selection.createRange().duplicate()
				r.moveEnd('character', o.value.length)
				if (r.text == '') return o.value.length
				return o.value.lastIndexOf(r.text)
			} else return o.selectionStart
		}

		// 포커스 들어올 시 가격 제한 설정 걸림
		base.clickBaseElem = function(e){
			if(!base.isInitValue){
				base.$el.val(base.options.initalValue)
				base.isInitValue = true;
			}
			base.setCursorBasicPoint();
		}

		// 초기 커서 위치로 이동
		base.setCursorBasicPoint = function(e){
			var cursorPosition = base.$el.val().length - base.options.limitNumber;
			base.$el.setSelectionRange(cursorPosition, cursorPosition);
		}

		// 키업
		base.keyUpBaseElem = function(e){
			var c = e.keyCode;
			
			if (  base.isNavigationCode(c) || (c==BACKSPACE_KEY || c==DELETE_KEY ) || base.isNumberCode(c) ){
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
			var isNotNumber = c < ZERO || NINE < c;
			var isNotArrow =   c < BACKSPACE_KEY  ||  DELETE_KEY < c;
			var isNotFKey = c > F12_KEY || c < F1_KEY;

			var startPos = base.getSelectionStart( base.el );
			var differ = (base.$el.val().length - startPos );
			
			// hacky 한 방법으로 마우스 커서를 이동시키게 했을 경우에는 자릿수로 이동시킨다.
			if(differ < base.options.limitNumber){
				base.setCursorBasicPoint();
			}

			// 숫자가 아니거나 화살표키가 아니거나 F키가 아닌 경우에는 입력제한 시킨다.
			if( isNotNumber && isNotArrow && isNotFKey){
				if( base.options.msgAlert != "false" ){
					alert(base.options.basicMsg);	
				}
				e.preventDefault();
				return false;
			}

			// end 키나 화살표 밑의 키로 가는 경우에는 최소 자릿수로 이동시킨다.
			if(c == ARROW_DOWN || c == END_KEY){
				e.preventDefault();
				var lastLength = base.$el.val().length - base.options.limitNumber;
				base.$el.setSelectionRange( lastLength, lastLength );
				return false;
			}

			// 최소 자릿수 밑에서 백스페이스 방지
			if ( (differ < base.options.limitNumber &&  c == BACKSPACE_KEY) ){ 
				e.preventDefault();
				return false;
			}
						
			// 최소 자릿수 바로 앞에서 오른쪽방향키와 딜리트 방지
			if(  differ < (Number(base.options.limitNumber) + 1)  ){ 
				switch(c){
					case RIGHT_KEY:
					case DELETE_KEY:
						e.preventDefault();
				}
			}
		}

		// 포커스를 잃을 때 가격 제한 밸리데이션이 걸려있다면 특정함수를 발동시킨다.
		base.focusOutBaseElem = function(e){
			var validMinMax = base.options.validMinMax != "false";
			var isNotValidValue = base.$el.val() < base.options.minValue || base.$el.val() > base.options.maxValue;
			if( validMinMax && isNotValidValue){
				base.options.validMinMaxFunc(base.options.minValue, base.options.maxValue);
				base.$el.focus();
				base.$el.addClass(base.options.errorClassName);
			}else{
				base.$el.removeClass(base.options.errorClassName);
			}
		}

		base.init();
	}


  $.arahanNumLimitter.defaultOptions = {
  	'initalValue' : 3000,  //초기 금액
  	'limitNumber' : 2, // 자리수
  	'basicMsg' : "숫자와 기본적인 방향키만 입력할 수 있습니다", // 
  	'msgAlert' : true,
  	
  	'minValue' : 3000,
  	'maxValue' : 100000,
  	'validMinMax' : true,
  	'errorClassName' : 'errorValidation',
  	'validMinMaxFunc' : function(min, max){
  		alert( min + "와 "+max+" 사이의 값을 입력해주셔야 합니다");
  	},

  	// Callback API
    'init' : function(el){}            // Callback: function(element) - Fires after the counter is initially setup (text카운터 참조)
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

