function save_options() {
    var status = $('#status');
	var alert_string = '';

    var accesskey = $('#accesskey').val();
    if (accesskey.length > 0) {
        localStorage.accesskey = $('#accesskey').val();
    }
	else{
		alert_string = alert_string + 'Invalid Access Key\n';
	}

    var secretkey = $('#secretkey').val();
    if (secretkey.length > 0) {
        localStorage.secretkey = $('#secretkey').val();
    }else{    	
		alert_string = alert_string + 'Invalid Secret Key\n';
    }

	////
    var listurl = $('#listurl').val();
    if (listurl.length > 0) {
        localStorage.listurl = $('#listurl').val();
        console.log("saved listurl: " + localStorage.listurl);
    }else{    	
        console.log("didn't save listurl");
		alert_string = alert_string + 'Invalid URL\n';
    }

	if (alert_string.length > 0){
	    alert(alert_string);
	    return;
	}

    ////////

    var list_url = $("#listurl").val();
    if (! list_url.startsWith("https://greencommons.net/lists/")){
    	list_url = '';
    }
    var split = list_url.split('/');
    var list_id = split[split.length - 1];
    var list_api_url = "https://greencommons.net/api/v1/lists/" + list_id;
	$.getJSON(list_api_url, function( data ) {
		console.log('got list name: ' + data.data.attributes.name);
		if (data.data.attributes.name){
			var listname = data.data.attributes.name;
			$("#listname").html(listname);
		    if (listname.length > 0) {
		        localStorage.listname = $('#listname').text();
		        console.log("saved listname: " + localStorage.listname);
		    }else{    	
		        console.log("didn't save listname");
		    }
		}
		else{
			$("#listname").html("None");
		}
	}).fail(function(jqXHR) {
	    alert('Invalid URL');
	});
}

function restore_options() {
    if(!localStorage.accesskey || !localStorage.secretkey 
    	|| !localStorage.listurl || !localStorage.listname){
        return false;
    }
    var stored_accesskey = localStorage.accesskey;
    var stored_secretkey = localStorage.secretkey;
    var stored_listurl = localStorage.listurl;
    var stored_listname = localStorage.listname;

    $('#accesskey').val(stored_accesskey);
    $('#secretkey').val(stored_secretkey);
    $('#listurl').val(stored_listurl);
    $('#listname').val(stored_listname);
}

var updateLists = function (boardid) {
    $lists.empty();
    Trello.get("boards/"+boardid+"/lists", function(lists) {
        $.each(lists, function(i){
            var thislist = lists[i];
            if(!thislist.closed){
                if(thislist.idBoard == boardid){
                $lists.append('<option id="'+thislist.id+'" '+(localStorage['list'] == thislist.id?'selected="selected"':'')+'>'+thislist.name+'</option>');
                }
            }
        });
    });
};

document.addEventListener('DOMContentLoaded', function (){
    restore_options();
});
$('#save').on('click', function (e) {
    e.preventDefault();
    save_options();
});
