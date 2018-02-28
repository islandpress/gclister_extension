var createResource = function(){
    var listUrl = localStorage.listurl;
    var accessKey = localStorage.accesskey;
    var secretKey = localStorage.secretkey;
    var gcAsKeys = 'GC ' + accessKey + ':' + secretKey;
    if (! listUrl){
    	alert("Invalid list URL.");
    	return;
    }
    if (! accessKey){
    	alert("Invalid accessKey.");
    	return;
    }
    if (! secretKey){
    	alert("Invalid secretKey.");
    	return;
    }

	var split = listUrl.split('/');
    var listId = split[split.length - 1];

    $.ajax({
	   	url: 'https://greencommons.net/api/v1/resources',
	    type: 'post',
	    data: JSON.stringify({
	    	'data': {
		    	'type': 'resources', 
		    	'attributes': { 
		          	'title': $('#title').val(),
			        'url': $('#url').val()
			    }
			}
	    }),
	    headers: {
	        'Authorization': gcAsKeys,
	        'Content-Type': 'application/vnd.api+json',
	        'Accept': 'application/vnd.api+json'
	    },
		success: function (response) {
			console.log("successful resource creation");
			addToList(response['data']['id'], listId, gcAsKeys);
		},
		error: function (xhr, ajaxOptions, thrownError) {
			console.log("error during resource creation");
			alert(xhr.status);
			alert(thrownError);
		}		    
    });
};

var addToList = function(resourceId, listId, gcAsKeys){
	url = 'https://greencommons.net/api/v1/lists/' + listId + '/relationships/items';
    $.ajax({
	   	url: url,
	    type: 'post',
	    data: JSON.stringify({
	    	'data': [{ "id": resourceId, "type": "resources" }]
	    }),
	    headers: {
	        'Authorization': gcAsKeys,
	        'Content-Type': 'application/vnd.api+json',
	        'Accept': 'application/vnd.api+json'
	    },
		success: function (response) {
			console.log("successful addition of resource to list");
		},
		error: function (xhr, ajaxOptions, thrownError) {
			console.log("error adding resource to list");
			alert(xhr.status);
			alert(thrownError);
		}		    
    }).done(function() {
        window.close();
    });
}

document.addEventListener('DOMContentLoaded', function () {
    $('#listtext').text(localStorage.listname||"None");

    $('#submit').on('click', function(e) {
    	console.log("in submit");
        e.preventDefault();

		var ret = createResource();
		console.log("ret from create_resource: " + ret);
    });

    $('#options').on('click', function(e) {
        e.preventDefault();
        var optionsUrl = chrome.extension.getURL('options.html');

        chrome.tabs.query({url: optionsUrl}, function(tabs) {
            if (tabs.length) {
                chrome.tabs.update(tabs[0].id, {active: true});
            } else {
                chrome.tabs.create({url: optionsUrl});
            }
        });
    });
});

chrome.tabs.getSelected(null, function(tab) {
    $('#url').val(tab.url);
    $('#title').val(tab.title);
    $('#listtext').text(localStorage.listname);
});
