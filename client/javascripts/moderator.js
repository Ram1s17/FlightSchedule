//текущая дата
var currentDate = new Date;
var currentSelectedOption;

//функция получения даты в формате "ГГГГ-MM-ДД"
var convertDateToString = function(date) {
    var mm = date.getMonth() + 1;
    var dd = date.getDate();
    return [date.getFullYear(),
        (mm>9 ? '' : '0') + mm,
        (dd>9 ? '' : '0') + dd
       ].join('-');
};

var getFlightSchedule = function(scheduleElement) {
    $(".sсhedule-table").empty();
    $(".sсhedule-table").append($( 
    "<div class='main-table-header '>" +
    "<div class='type-of-flight-header'><b>Тип рейса</b></div>" +
    "<div class='flight-direction-header'><b></b></div>" +
    "<div class='airline-header'><b>Авиакомпания</b></div>" +
    "<div class='flight-header'><b>Рейс</b></div>" +
    "<div class='time-header'><b></b></div>" +
    "<div class='type-of-airplane-header'><b>Тип самолета</b></div>" +
    "<div class='execution-period-header'><b>Период выполнения</b></div></div>"));
    //заполнение расписания на странице данными
    if (scheduleElement != null) {
        var $main_table_cells;
        var $type_of_flight_cell, $flight_direction_cell, $airline_cell, $flight_cell, 
            $time_cell, $type_of_airplane_cell, $execution_period_cell;
        if (currentSelectedOption == "ВЫЛЕТ") {
            $(".flight-direction-header b").text("Направление");
            $(".time-header b").text("Время вылета");
            (scheduleElement.departure).forEach(function(departureObject) {
                $main_table_cells = $("<div class='main-table-cells'>");
                $type_of_flight_cell = $("<div class='type-of-flight-cell'>");
                $type_of_flight_cell.text(departureObject.type_of_flight);
                $main_table_cells.attr("type", departureObject.type_of_flight );
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
                $main_table_cells.attr("period", departureObject.execution_period);
                $main_table_cells.append($type_of_flight_cell);
                $main_table_cells.append($flight_direction_cell);
                $main_table_cells.append($airline_cell);
                $main_table_cells.append($flight_cell);
                $main_table_cells.append($time_cell);
                $main_table_cells.append($type_of_airplane_cell);
                $main_table_cells.append($execution_period_cell);
                $(".sсhedule-table").append($main_table_cells);
            });
        }
        else {
            $(".flight-direction-header b").text("Город вылета");
            $(".time-header b").text("Время прилета");
            (scheduleElement.arrival).forEach(function(arrivalObject) {
                $main_table_cells = $("<div class='main-table-cells'>");
                $type_of_flight_cell = $("<div class='type-of-flight-cell'>");
                $type_of_flight_cell.text(arrivalObject.type_of_flight);
                $main_table_cells.attr("type", arrivalObject.type_of_flight );
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
                $main_table_cells.attr("period", arrivalObject.execution_period);
                $main_table_cells.append($type_of_flight_cell);
                $main_table_cells.append($flight_direction_cell);
                $main_table_cells.append($airline_cell);
                $main_table_cells.append($flight_cell);
                $main_table_cells.append($time_cell);
                $main_table_cells.append($type_of_airplane_cell);
                $main_table_cells.append($execution_period_cell);
                $(".sсhedule-table").append($main_table_cells);
            });
        }
    }
    else {
        if (currentSelectedOption == "ВЫЛЕТ") {
            $(".flight-direction-header b").text("Направление");
            $(".time-header b").text("Время вылета");
        }
        else {
            $(".flight-direction-header b").text("Город вылета");
            $(".time-header b").text("Время прилета");
        } 
    }  
};

var main = function(){
    "use strict"
    $(".managment-panel").append($(
        "<form class='schedule-form'><input type='date' id='input-date-field' placeholder='Дата'  title='Дата'value=" + convertDateToString(currentDate) +">" + 
        "<select id='departure-arrival-select'>" +
        "<option value'ВЫЛЕТ'>ВЫЛЕТ</option>" +
        "<option value'ПРИЛЕТ'>ПРИЛЕТ</option></select>'" +
        "<button class='search-schedule-button'>Найти</button>" +
        "<button class='delete-schedule-button'>Удалить</button>" +
        "<button class='delete-selected-schedule-button'>Удалить расписание на вылет</button>" +
        "<button class='cancel-button'>Отмена</button></form>"));
    $(".cancel-button").attr('disabled', true);
    $("#departure-arrival-select option[value='ВЫЛЕТ']").prop('selected', true);
    currentSelectedOption =  $("#departure-arrival-select").children(":selected").val();
    $.get("/schedule/" + $("#input-date-field").val(), function(schedule) {
        if (schedule != null) {
            getFlightSchedule(schedule);
        }
        else {
            $(".sсhedule-table").append($("<img src='/img/no-results.png' width='12%'>" +
                                        "<h3>На " + $("#input-date-field").val() +" расписания нет</h3>"));  
        }
    });                          
    $("#input-date-field").change(function() {
        $(".sсhedule-table").empty();
        if ($("#input-date-field").val() != '') {
            $.get("/schedule/" + $("#input-date-field").val(), function(schedule) {
                if (schedule != null) { 
                    getFlightSchedule(schedule);
                }
                else {
                    $(".sсhedule-table").append($("<img src='/img/no-results.png' width='12%'>" +
                    "<h3>На " + $("#input-date-field").val() +" расписания нет</h3>"));
                }
            });
        }
    });
    $("#departure-arrival-select").change(function(){
        currentSelectedOption = $("#departure-arrival-select option:selected").val();
        if (currentSelectedOption == "ВЫЛЕТ") 
            $(".delete-selected-schedule-button").text("Удалить расписание на вылет");
        else
            $(".delete-selected-schedule-button").text("Удалить расписание на прилет");
        $("#input-date-field").change();
    });
    $(".cancel-button").on("click", function(e) { 
        e.preventDefault();
        $(".cancel-button").attr('disabled', true);
        $("#input-date-field").attr('disabled', false);
        $("#departure-arrival-select").attr('disabled', false);
        $(".search-schedule-button").attr('disabled', false);
        $(".delete-schedule-button").attr('disabled', false);
        $(".delete-selected-schedule-button").attr('disabled', false);
        $(".panel-block").remove();
    });
};

$(document).ready(function() {
	main();
});