var nextUrl;
var clientId;
var ready = true;

// get via hashtag (apiUrl: 'hashtag' + tagName), user (apiUrl: 'user' + userId) or popular (option - default)

function getInstagram(params, context) {
    var option, value;
    this.options = {
        apiUrl: 'popular',
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
	
	ready = false;
	
	if ( apiUrl == 'hashtag' ){
		$("#photo_grid").html("");
		if (hashtag == undefined) {
			return false;
		}				
		apiUrl = "https://api.instagram.com/v1/tags/"+hashtag+"/media/recent/";
	} else if ( apiUrl == 'user' ){
		$("#photo_grid").html("");
		apiUrl = "https://api.instagram.com/v1/users/"+this.options.userId+"/media/recent/";
	} else if ( apiUrl == 'popular' ){
		$("#photo_grid").html("");
		apiUrl = "https://api.instagram.com/v1/media/popular/";
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
			ready = true;
			if (typeof nextUrl == undefined) {
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
				clientId: clientId,
			});
		return false;
	});
	$("#loading").hide();		
});
