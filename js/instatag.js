var nextUrl = 'undefined';
var clientId;

// get via hashtag (apiUrl: 'hashtag' + tagName), user (apiUrl: 'user' + userId) or popular (option - default)

function scrollToPhoto() {
	$('html, body').animate({
		scrollTop: $("#photo_grid").offset().top
	}, 1500);
}

function getInstagram(params, context) {
      var option, value;
      this.options = {
        apiUrl: 'popular',
		animate: true,
      };
      if (typeof params === 'object') {
        for (option in params) {
          value = params[option];
          this.options[option] = value;
        }
      }
	 
	var count = 20;
	var hashtag = this.options.tagName;
	var apiUrl = this.options.apiUrl;
	
	if (this.options.clientId == undefined){
		alert ("No ClientID specified");
	}
	
	clientId = this.options.clientId;
	
	if ( apiUrl == 'hashtag' ){
		$("#photo_grid").html("");
		if (hashtag == undefined) {
			return;
		}				
		apiUrl = "https://api.instagram.com/v1/tags/"+hashtag+"/media/recent/";
		if (this.options.animate) {
			scrollToPhoto()
		}
	} else if ( apiUrl == 'user' ){
		$("#photo_grid").html("");
		apiUrl = "https://api.instagram.com/v1/users/"+this.options.userId+"/media/recent/";
		if (this.options.animate) {
			scrollToPhoto()
		}		
	} else if ( apiUrl == 'popular' ){
		$("#photo_grid").html("");
		apiUrl = "https://api.instagram.com/v1/media/popular/";
		if (this.options.animate) {
			scrollToPhoto()
		}		
	}
		
	$.ajax({
		type: "GET",
		dataType: "jsonp",			
		url: apiUrl,
		data: {client_id: clientId},

		success: function(data) {
			nextUrl = data.pagination.next_url;	
			for (var i = 0; i < count; i++) {
					if (typeof data.data[i] !== 'undefined' ) {
						$("#photo_grid").append("<span class='instagram-wrap' id='pic-"+ data.data[i].id +"' ><a target='_blank' href='" + data.data[i].link +"'><img class='instagram-image' src='" + data.data[i].images.low_resolution.url +"' /></a><span class='likes'>"+data.data[i].likes.count +" likes</span></span>"
						); 
					}  
			}
			$("#loading").hide();
			if (typeof nextUrl === 'undefined') {
				$("#showMore").hide();
			} else {
				$("#showMore").show();
			}	
		}
	});
}

$(document).ready(function() {
	//manual click to load more
	$("#more").click(function() {  
		$("#loading").show();
		getInstagram({
				apiUrl: nextUrl,
				client_id: clientId,
			});
		return false;
	});
	$("#loading").hide();		
});
