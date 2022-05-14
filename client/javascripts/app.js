//текущая дата
var currentDate = new Date;
//словать вида: "День недели, число": "ГГГГ-ММ-ДД" 
var datesDict = new Map();
var currentTabText, currentDateTabText, tabContent;
var selectedType, selectedPeriod;
var isSearched = false;
var searchResult = [];

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

//функция формирования содержания вкладки
var getFlightSchedule = function() {
    $(".main-tabs-table-cells").remove();
    //поиск нужного документа на заданную дату
    var currentSchedule = null;
    tabContent.forEach(function(tabObject){
        if ((tabObject.date).split("T")[0] == datesDict.get(currentDateTabText)) {
            currentSchedule = tabObject;
        }
    });
    //заполнение расписания на странице данными
    if (currentSchedule != null) {
        var $main_tabs_table_cells;
        var $type_of_flight_cell, $flight_direction_cell, $airline_cell, $flight_cell, 
            $time_cell, $type_of_airplane_cell, $execution_period_cell;
        if (currentTabText == "ВЫЛЕТ") {
            $(".flight-direction-header b").text("Направление");
            $(".time-header b").text("Время вылета");
            (currentSchedule.departure).forEach(function(departureObject) {
                $main_tabs_table_cells = $("<div class='main-tabs-table-cells'>");
                $type_of_flight_cell = $("<div class='type-of-flight-cell'>");
                $type_of_flight_cell.text(departureObject.type_of_flight);
                $main_tabs_table_cells.attr("type", departureObject.type_of_flight );
                $flight_direction_cell = $("<div class='flight-direction-cell'>");
                $flight_direction_cell.text(departureObject.direction);
                $airline_cell = $("<div class='airline-cell'>");
                $airline_cell.text(departureObject.airline);
                $flight_cell = $("<div class='flight-cell'>");
                $flight_cell.text(departureObject.flight);
                $time_cell = $("<div class='time-cell'>");
                $time_cell.text(departureObject.departure_time.slice(11,16));
                $type_of_airplane_cell = $("<div class='type-of-airplane-cell'>");
                $type_of_airplane_cell.text(departureObject.type_of_airplane);
                $execution_period_cell = $("<div class='execution-period-cell'>");
                $execution_period_cell.text(departureObject.execution_period);
                $main_tabs_table_cells.attr("period", departureObject.execution_period);
                $main_tabs_table_cells.append($type_of_flight_cell);
                $main_tabs_table_cells.append($flight_direction_cell);
                $main_tabs_table_cells.append($airline_cell);
                $main_tabs_table_cells.append($flight_cell);
                $main_tabs_table_cells.append($time_cell);
                $main_tabs_table_cells.append($type_of_airplane_cell);
                $main_tabs_table_cells.append($execution_period_cell);
                $(".main-container").append( $main_tabs_table_cells);
            });
        }
        else {
            $(".flight-direction-header b").text("Город вылета");
            $(".time-header b").text("Время прилета");
            (currentSchedule.arrival).forEach(function(arrivalObject) {
                $main_tabs_table_cells = $("<div class='main-tabs-table-cells'>");
                $type_of_flight_cell = $("<div class='type-of-flight-cell'>");
                $type_of_flight_cell.text(arrivalObject.type_of_flight);
                $main_tabs_table_cells.attr("type", arrivalObject.type_of_flight );
                $flight_direction_cell = $("<div class='flight-direction-cell'>");
                $flight_direction_cell.text(arrivalObject.departure_city);
                $airline_cell = $("<div class='airline-cell'>");
                $airline_cell.text(arrivalObject.airline);
                $flight_cell = $("<div class='flight-cell'>");
                $flight_cell.text(arrivalObject.flight);
                $time_cell = $("<div class='time-cell'>");
                $time_cell.text(arrivalObject.arrival_time.slice(11,16));
                $type_of_airplane_cell = $("<div class='type-of-airplane-cell'>");
                $type_of_airplane_cell.text(arrivalObject.type_of_airplane);
                $execution_period_cell = $("<div class='execution-period-cell'>");
                $execution_period_cell.text(arrivalObject.execution_period);
                $main_tabs_table_cells.attr("period", arrivalObject.execution_period);
                $main_tabs_table_cells.append($type_of_flight_cell);
                $main_tabs_table_cells.append($flight_direction_cell);
                $main_tabs_table_cells.append($airline_cell);
                $main_tabs_table_cells.append($flight_cell);
                $main_tabs_table_cells.append($time_cell);
                $main_tabs_table_cells.append($type_of_airplane_cell);
                $main_tabs_table_cells.append($execution_period_cell);
                $(".main-container").append( $main_tabs_table_cells);
            });
        }
    }
    else {
        if (currentTabText == "ВЫЛЕТ") {
            $(".flight-direction-header b").text("Направление");
            $(".time-header b").text("Время вылета");
        }
        else {
            $(".flight-direction-header b").text("Город вылета");
            $(".time-header b").text("Время прилета");
        } 
    }  
};

//функция отображения рейсов на основе селекторов
var selectFlights = function() {
    selectedType = $("#type-of-flight-select option:selected").text();
    selectedPeriod = $("#execution-period-select option:selected").text();
    if (!isSearched)  {
        getFlightSchedule();
    }
    else {
        $(".main-tabs-table-cells").toArray().forEach(function(row){
            row.remove();
        });
        searchResult.forEach(function(res){
            createScheduleAfterSearch(res);
        });
    }
    if (selectedType == "Все рейсы" && selectedPeriod == "Все рейсы") {
        return;
    }
    else if (selectedType == "Все рейсы" && selectedPeriod != "Все рейсы") {
        $(".main-tabs-table-cells").toArray().forEach(function(cell){
            if (($(cell).attr("period") != selectedPeriod)) {
                $(cell).remove();
            }
        });
    }
    else if (selectedType != "Все рейсы" && selectedPeriod == "Все рейсы") {
        $(".main-tabs-table-cells").toArray().forEach(function(cell){
            if (($(cell).attr("type") != selectedType)) {
                $(cell).remove();
            }
        });
    }
    else {
        $(".main-tabs-table-cells").toArray().forEach(function(cell){
            if (($(cell).attr("type") != selectedType) || ($(cell).attr("period") != selectedPeriod)) {
                $(cell).remove();
            }
        });
    }
};

//функция отображения авиарейсов по выбранному типу
var getFlightsByType = function() {
    $("#type-of-flight-select").change(function(){
        selectFlights();
    });
}

//функция отображения авиарейсов по выбранному периоду
var getFlightsByPeriod = function() {
    $("#execution-period-select").change(function(){
        selectFlights();
    });
};

//функция отображения авиарейсов на основе поиска
var createScheduleAfterSearch = function(result){
    var $main_tabs_table_cells;
    var $type_of_flight_cell, $flight_direction_cell, $airline_cell, $flight_cell, 
        $time_cell, $type_of_airplane_cell, $execution_period_cell;

    $main_tabs_table_cells = $("<div class='main-tabs-table-cells'>");
    $type_of_flight_cell = $("<div class='type-of-flight-cell'>");
    $type_of_flight_cell.text(result.type_of_flight);
    $main_tabs_table_cells.attr("type", result.type_of_flight );

    $flight_direction_cell = $("<div class='flight-direction-cell'>");
    $time_cell = $("<div class='time-cell'>");

    if (currentTabText == "ВЫЛЕТ") {
        $flight_direction_cell.text(result.direction);
        $time_cell.text(result.departure_time.slice(11,16));
    }
    else {
        $flight_direction_cell.text(result.departure_city);
        $time_cell.text(result.arrival_time.slice(11,16));
    }

    $airline_cell = $("<div class='airline-cell'>");
    $airline_cell.text(result.airline);

    $flight_cell = $("<div class='flight-cell'>");
    $flight_cell.text(result.flight);

    $type_of_airplane_cell = $("<div class='type-of-airplane-cell'>");
    $type_of_airplane_cell.text(result.type_of_airplane);

    $execution_period_cell = $("<div class='execution-period-cell'>");
    $execution_period_cell.text(result.execution_period);
    $main_tabs_table_cells.attr("period", result.execution_period);

    $main_tabs_table_cells.append($type_of_flight_cell);
    $main_tabs_table_cells.append($flight_direction_cell);
    $main_tabs_table_cells.append($airline_cell);
    $main_tabs_table_cells.append($flight_cell);
    $main_tabs_table_cells.append($time_cell);
    $main_tabs_table_cells.append($type_of_airplane_cell);
    $main_tabs_table_cells.append($execution_period_cell);

    $(".main-container").append( $main_tabs_table_cells);    
};

//функция поиска
var search = function(input_value) {
    $(".main-tabs-table-cells").toArray().forEach(function(row){
        row.remove();
    });
    searchResult.length = 0;
    if (currentTabText == "ВЫЛЕТ") {
        var direction_body = {date: datesDict.get(currentDateTabText), direction: input_value};
        $.get("/directions", direction_body, function(directions){
            if (directions.length == 0)
            {
                var flight_body = {date: datesDict.get(currentDateTabText), flight: input_value};
                $.get("/departure_flights", flight_body, function(flights){
                    if (flights.length != 0) {
                        flights.forEach(function(flight){
                            searchResult.push(flight.departure);
                            createScheduleAfterSearch(flight.departure);
                        });
                        $("#type-of-flight-select").change();
                        $("#execution-period-select").change();
                    }
                });
            }
            else {
                directions.forEach(function(direction){
                    searchResult.push(direction.departure);
                    createScheduleAfterSearch(direction.departure);
                });
                $("#type-of-flight-select").change();
                $("#execution-period-select").change();
            }
            
        });
    }
    else {
        var city_body = {date: datesDict.get(currentDateTabText), departure_city: input_value};
        $.get("/cities", city_body, function(cities){
            if (cities.length == 0) {
                var flight_body = {date: datesDict.get(currentDateTabText), flight: input_value};
                $.get("/arrival_flights", flight_body, function(flights){
                    if (flights.length != 0) {
                        flights.forEach(function(flight){
                            searchResult.push(flight.arrival);
                            createScheduleAfterSearch(flight.arrival);
                        });
                        $("#type-of-flight-select").change();
                        $("#execution-period-select").change();
                    }
                });
            }
            else {
                cities.forEach(function(city){
                    searchResult.push(city.arrival);
                    createScheduleAfterSearch(city.arrival);
                });
                $("#type-of-flight-select").change();
                $("#execution-period-select").change();
            }
        });

    }
}

var main = function () { 
    "use strict";
    var flag = true;
    $("#type-of-flight-select").attr("selected", null);
    $("#type-of-flight-select option:nth-child(1)").attr("selected", "selected");
    $("#execution-period-select").attr("selected", null);
    $("#execution-period-select option:nth-child(1)").attr("selected", "selected");
    $(".main-tabs-departure-and-arrival div").toArray().forEach(function (element) {
        $(element).on("click", function () {
	        var $element = $(element);
	        $(".main-tabs-departure-and-arrival div").removeClass("tab-active");
	        $element.addClass("tab-active");
            if ($(".tab-active a").text() == "ВЫЛЕТ") {
                currentTabText = "ВЫЛЕТ";
            }
            else {
                currentTabText = "ПРИЛЕТ";
            }
            $(".main-tabs-items a.active").trigger("click"); 
            return false;
	    });
    });
    getFlightsByType();
    getFlightsByPeriod(); 
    $(".main-tabs-items a").toArray().forEach(function (tabElement) {
        $(tabElement).on("click", function () {
            isSearched = false;
            $(".input-field").val("");
            var $tabElement = $(tabElement);
            $(".main-tabs-items a span").removeClass("active");
            $(".main-tabs-items a").removeClass("active");
            $tabElement.children().addClass("active"); 
            $tabElement.addClass("active");
            currentDateTabText = $tabElement.children().text();
            getFlightSchedule();
            $("#type-of-flight-select").change();
            $("#execution-period-select").change();
            return false;
        });
        if (flag) {
            $(".main-tabs-departure-and-arrival .tab-active").trigger("click");
            flag = false;
        }
    });
    $(".input-field").on("input",function(ev){
        isSearched = true;
        if($(ev.target).val() != "") {
            search($(".input-field").val());
        }
        else {
            getFlightSchedule();
            isSearched = false;
            $("#type-of-flight-select").change();
            $("#execution-period-select").change();
        }
    });
};

$(document).ready(function () {
	$.getJSON("/data.json", function (tabObjects) { 
        tabContent = tabObjects;
        tabsFormation();
        main();
	}); 
});