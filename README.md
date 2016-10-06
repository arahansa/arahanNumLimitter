# arahanNumLimitter


#용도 
특정 넘버 밑의 자리수 더해주는... 프로그램 + 숫자만 입력되게..

예를 들자면 1000원에서 밑의 1의자리는 무조건 0으로 맞추게 한다던가...

(링크는 컨트롤 키를 눌르고 새창으로 눌러주시는 미덕..)
[https://arahansa.github.io/arahanNumLimitter/arahanNumLimitter.html](https://arahansa.github.io/arahanNumLimitter/arahanNumLimitter.html)


# 사용법
사용법1.   $(요소선택자).arahanNumLimitter(옵션들);
사용법2.  
<pre><code>
<input type="text" class="클래스명" data-limitNumber="1" data-initalValue="2000" > // 으로 요소에서 선언하고
$(".클래스명").arahanNumLimitter(); // 로도 할 수 있게함
</pre></code>
# 옵션들에 줄수있는 것들
<pre><code>
{
'initalValue' : 1000,  // 초기 포커스 시 금액
'limitNumber' : 2, // 자리수
'basicMsg' : "숫자와 기본적인 방향키만 입력할 수 있습니다", //  글자 입력시 띄울 메시지
'msgAlert' : true, // 글자 입력할 때 메시지 띄울 것인지.
'init' : function(el){} // textcounter 참조한 인잇? 그냥 넣어봤다. ㅋ

'minValue' : 3000, // 최소가격
'maxValue' : 100000, // 최대가격
'validMinMax' : true, // 밸리데이션할지 여부
'errorClassName' : 'errorValidation', // 밸리데이션 실패시 추가될 에러클래스명
'validMinMaxFunc' : function(min, max){  // 밸리데이션 실패시 발생할 함수
	alert( min + "와 "+max+" 사이의 값을 입력해주셔야 합니다");

}    
</pre></code>
# 참고소스
참고 소스 http://javascript.nwbox.com/cursor_position/

참고 링크 하나 더 https://blog.outsider.ne.kr/322 js 키코드

참고 소스 https://github.com/ractoon/jQuery-Text-Counter :: jQuery 라이브러리화하는데 이걸 기초로 시작함.

# TODOS 
 숫자키코드 받는 부분이 있는데 아직 키패드숫자는 포함 를 안 시킨듯 하다.
 
 급하게 만들어서 아직 뭔가 더 할 부분들이 많겠지...
 
 친절함 생략.
