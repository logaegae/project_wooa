function inputTelNumber(phoneNumber,callback){
	if(phoneNumber){
		$.ajax({
			method: "POST",
			url:"inputTelNumber",
			data: {
				phoneNumber : phoneNumber
			}
		})
		.done(function( msg ) {
			if(msg.msg){
				// if(msg.msg == 'login') alert("로그인하였습니다")
				// else if(msg.msg == 'signUp') alert("회원가입하였습니다")
				if(typeof callback === 'function') {
					callback();
				}
			}else{
				alert("실패하였습니다. 다시 시도해주세요");
			}
		});
	}else{
		alert("입력정보를 다시 확인해주세요");
	}
}
function checkId(phoneNumber,callback){
	if(phoneNumber){
		$.ajax({
            method: "POST",
            url:"signUpStep1",
            data: {
            	phoneNumber : phoneNumber
            }
        })
        .done(function( msg ) {
    	    if(!msg.msg){
    		    if(typeof callback === 'function') {
    			    callback();
			    }
    	    }else{
    		  alert('정보가 없습니다');
    	    }
        });
    }else{
	    alert("입력정보를 다시 확인해주세요");
    }
}
