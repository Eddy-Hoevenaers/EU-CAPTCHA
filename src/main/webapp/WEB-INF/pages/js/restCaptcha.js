var useAudio = false;
 var EuCaptchaToken;
function onPlayAudio(){
         useAudio = true;
}
$(function(){
	     function getcaptcha(){
                   var getCaptchaUrl = $.ajax({
                     type: "GET",
                     url: 'http://localhost:8080/api/captchaImg',
                     success: function (data) {
                       EuCaptchaToken = getCaptchaUrl.getResponseHeader("token");
                       var jsonData=JSON.parse(data);
                       $("#captchaImg").attr("src","data:image/png;base64,"+jsonData.captchaImg);
                       $("#captchaImg").attr("captchaId",jsonData.captchaId);
                       $("#audioCaptcha").attr("src","data:audio/wav;base64,"+jsonData.audioCaptcha);
                     }
                   });
	               }
	 function reloadCaptcha(){
	               var reloadCaptchaUrl = $.ajax({
                          type: "GET",
                          url: 'http://localhost:8080/api/reloadCaptchaImg/'+$("#captchaImg").attr("captchaId"),
                           beforeSend: function(xhr) {
                                      xhr.setRequestHeader("Accept", "application/json");
                                      xhr.setRequestHeader("Content-Type", "application/json");
                                      xhr.setRequestHeader("jwtString", EuCaptchaToken);
                                  },
                          success: function (data) {
                            var jsonData=JSON.parse(data);
                             $("#captchaImg").attr("src","data:image/png;base64,"+jsonData.captchaImg);
                             $("#captchaImg").attr("captchaId",jsonData.captchaId);
                             $("#audioCaptcha").attr("src","data:audio/wav;base64,"+jsonData.audioCaptcha);
                             $("#captchaAnswer").val("");
                             useAudio = false;
                          }
                       });
	               }
	 function validateCaptcha(){
	   var validateCaptcha = $.ajax({
             type: "POST",
             contentType: 'application/json; charset=utf-8',
             url: "http://localhost:8080/api/validateCaptcha/"+$("#captchaImg").attr("captchaId"),
            beforeSend: function(xhr) {
                          xhr.setRequestHeader("Accept", "application/json");
                          xhr.setRequestHeader("Content-Type", "application/json");
                          xhr.setRequestHeader("jwtString", EuCaptchaToken);
                          },
             data: jQuery.param({ captchaAnswer: $("#captchaAnswer").val() ,
                                  useAudio : useAudio}) ,
             contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
             cache: false,
             timeout: 600000,
             success: function (data) {
               $("input").css({"border": ""});
                 obj = JSON.parse(data);
                if ('success' === obj.responseCaptcha)
                {
                 $("#success").css("visibility", "visible");
                 $("#fail").css("visibility", "hidden");
                }else
                {
                $("#fail").css("visibility", "visible");
                $("#success").css("visibility", "hidden");
                reloadCaptcha();
                }
             },
             error: function (e) {
               $("input").css({"border": "2px solid red"});
             }
         });
	 }

	 $("#captchaReload").click(function(){
	 $("#fail").css("visibility", "hidden");
	 $("#success").css("visibility", "hidden");
		 reloadCaptcha();
	 });

	 $("#captchaSubmit").click(function(){
		 validateCaptcha();
	 });

	 $('#captchaAnswer').keypress(function(e) {
	        if (e.keyCode === 13) {
	        	validateCaptcha();
	            return false; // prevent the button click from happening
	        }
	});

	$(document).ready(function () {
            $("#dropdown-language").change(function () {
                var selectedOption = $('#dropdown-language').val();
                var languageSelected = selectedOption;
                if (selectedOption !== '') {
                    window.location.replace('?lang=' + selectedOption);
                }
            });
        });
	 getcaptcha();

 });
