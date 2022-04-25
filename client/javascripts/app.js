var currentTabText;

$(document).ready(function () {
	$.getJSON("/data.json", function (tabObjects) { 
        tabContent = tabObjects;
        console.log(tabContent);
	}); 
});