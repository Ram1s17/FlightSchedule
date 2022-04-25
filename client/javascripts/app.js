//текущая дата
var currentDate = new Date;
//словать вида: "День недели, число": "ГГГГ-ММ-ДД" 
var datesDict = new Map();
var currentTabText, tabContent;

//функция получения даты в формате "ГГГГ-MM-ДД"
var convertDateToString = function(date) {
    var mm = date.getMonth() + 1;
    var dd = date.getDate();
    return [date.getFullYear(),
        (mm>9 ? '' : '0') + mm,
        (dd>9 ? '' : '0') + dd
       ].join('-');
};

//функция формирования вкладок
var tabsFormation = function() {
     //добавление вчерашней даты в словарь
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    var textYesterdayDate = convertDateToString(yesterday);
    datesDict.set("Вчера, " + yesterday.getDate() + "." + textYesterdayDate.slice(5,7), textYesterdayDate);
    //добавление сегодняшней даты в словарь
    var textCurrentDate = convertDateToString(currentDate);
    datesDict.set("Сегодня, " + currentDate.getDate() + "." + textCurrentDate.slice(5,7), textCurrentDate);
    //добавление завтрашней даты в словарь
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var textTommorowDate = convertDateToString(tomorrow);
    datesDict.set("Завтра, " + tomorrow.getDate() + "." + textTommorowDate.slice(5,7), textTommorowDate);
    //map iterator с ключами словаря
    var days = datesDict.keys();
    //формирование вкладок на странице
    $(".main-tabs-items span").toArray().forEach(function (span_element) {
        $(span_element).text(days.next().value);
    });
}

$(document).ready(function () {
	$.getJSON("/data.json", function (tabObjects) { 
        tabContent = tabObjects;
        tabsFormation();
        console.log(tabContent);
	}); 
});