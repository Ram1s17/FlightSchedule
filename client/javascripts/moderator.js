//текущая дата
var currentDate = new Date;
//выбранная опция: вылет или прилет
var currentSelectedOption;
//словарь с текущим расписанием при редактировании вида: "индекс блока": "{данные рейса в виде объекта}"
var currentSchedule = new Map();
//флаг проверки на совершение поиска в данный момент
var isSearched = false;

//функция получения даты в формате "ГГГГ-MM-ДД"
var convertDateToString = function(date) {
    var mm = date.getMonth() + 1;
    var dd = date.getDate();
    return [date.getFullYear(),
        (mm>9 ? '' : '0') + mm,
        (dd>9 ? '' : '0') + dd
       ].join('-');
};

//функция получения указанного расписания на вылет/на прилет
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
    if (scheduleElement != null) {
        var $main_table_cells;
        var $type_of_flight_cell, $flight_direction_cell, $airline_cell, $flight_cell, 
            $time_cell, $type_of_airplane_cell, $execution_period_cell;
        if (currentSelectedOption == "ВЫЛЕТ") {
            $(".flight-direction-header b").text("Направление");
            $(".time-header b").text("Время вылета");
            (scheduleElement.departure).sort(function(a,b){
                return new Date(a.departure_time) - new Date(b.departure_time);
            });
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
            (scheduleElement.arrival).sort(function(a,b){
                return new Date(a.arrival_time) - new Date(b.arrival_time);
            });
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

//функция отображения авиарейсов на основе поиска
var createScheduleAfterSearch = function(result){
    var $main_table_cells;
    var $type_of_flight_cell, $flight_direction_cell, $airline_cell, $flight_cell, 
        $time_cell, $type_of_airplane_cell, $execution_period_cell;

        $main_table_cells = $("<div class='main-table-cells'>");
    $type_of_flight_cell = $("<div class='type-of-flight-cell'>");
    $type_of_flight_cell.text(result.type_of_flight);

    $flight_direction_cell = $("<div class='flight-direction-cell'>");
    $time_cell = $("<div class='time-cell'>");

    if (currentSelectedOption == "ВЫЛЕТ") {
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

    $main_table_cells.append($type_of_flight_cell);
    $main_table_cells.append($flight_direction_cell);
    $main_table_cells.append($airline_cell);
    $main_table_cells.append($flight_cell);
    $main_table_cells.append($time_cell);
    $main_table_cells.append($type_of_airplane_cell);
    $main_table_cells.append($execution_period_cell);

    $(".sсhedule-table").append($main_table_cells);    
};

//функция поиска
var search = function(input_value) {
    $(".sсhedule-table .main-table-cells").toArray().forEach(function(row){
        row.remove();
    });
    if (currentSelectedOption == "ВЫЛЕТ") {
        var direction_body = {date: $("#input-date-field").val(), direction: input_value};
        $.get("/directions", direction_body, function(directions){
            if (directions.length == 0)
            {
                var flight_body = {date: $("#input-date-field").val(), flight: input_value};
                $.get("/departure_flights", flight_body, function(flights){
                    if (flights.length != 0) {
                        flights.forEach(function(flight){
                            createScheduleAfterSearch(flight.departure);
                        });
                    }
                });
            }
            else {
                directions.forEach(function(direction){
                    createScheduleAfterSearch(direction.departure);
                });
            }
        });
    }
    else {
        var city_body = {date: $("#input-date-field").val(), departure_city: input_value};
        $.get("/cities", city_body, function(cities){
            if (cities.length == 0) {
                var flight_body = {date: $("#input-date-field").val(), flight: input_value};
                $.get("/arrival_flights", flight_body, function(flights){
                    if (flights.length != 0) {
                        flights.forEach(function(flight){
                            createScheduleAfterSearch(flight.arrival);
                        });
                    }
                });
            }
            else {
                cities.forEach(function(city){
                    createScheduleAfterSearch(city.arrival);
                });
            }
        });
    }
}

//функция добавления нового авиарейса
var addNewFlight = function($panel_block, option) {
    $(".managment-panel").append($panel_block);
    $panel_block.append($("<button class='add-flight-button'>Добавить</button>"))
    $("#type-of-flight-selection option[value='Дневной']").prop('selected', true);
    $("#execution-period-selection option[value='Регулярный']").prop('selected', true);
    if (currentSelectedOption == "ВЫЛЕТ") {
        $(".flight-direction-header b").text("Направление");
        $(".time-header b").text("Время вылета");
        $(".flight-direction-input").attr("placeholder", "Направление");
        $(".flight-direction-input").attr("title", "Направление");
        $(".time-input").attr("title", "Время вылета");
    }
    else {
        $(".flight-direction-header b").text("Город вылета");
        $(".time-header b").text("Время прилета");
        $(".flight-direction-input").attr("placeholder", "Город вылета");
        $(".flight-direction-input").attr("title", "Город вылета");
        $(".time-input").attr("title", "Время прилета");
    }
    $(".add-flight-button").on("click", function()  {
        var input_array = [], isInvalidInput = false;
        var type_of_flight =  $("#type-of-flight-selection").children(":selected").val();
        input_array.push(type_of_flight);
        var direction_or_departure_city = $(".flight-direction-input").val().trim().toUpperCase();
        input_array.push(direction_or_departure_city);
        var airline = $(".airline-input").val().trim();
        input_array.push(airline);
        var flight = $(".flight-input").val().trim().toUpperCase();
        input_array.push(flight);
        var departure_time = $(".time-input").val();
        input_array.push(departure_time);
        var type_of_airplane = $(".type-of-airplane-input").val().trim().toUpperCase();
        input_array.push(type_of_airplane);
        var execution_period = $("#execution-period-selection").children(":selected").val();
        input_array.push(execution_period);
        input_array.forEach(function(value){
            if (!(value !== null && value.trim() !== "")) {
                isInvalidInput = true;
            }
        });
        if (isInvalidInput) {
            alert("Присутствуют незаполненные поля! Попробуйте еще раз!");
        }
        else {
            if (option == 1) {
                //расписание пустое, добавляем в departure рейс и создаем пустой arrival
                var newScheduleWithDepartureFlight = {
                    "date": new Date( $("#input-date-field").val()),
                    "departure": [
                        {
                            "type_of_flight": type_of_flight,
                            "direction": direction_or_departure_city,
                            "airline": airline,
                            "flight": flight,
                            "departure_time": $("#input-date-field").val() + "T" + departure_time + ":00Z",
                            "type_of_airplane": type_of_airplane,
                            "execution_period": execution_period
                        }
                    ],
                    "arrival": []
                }
                $.ajax({ 
                    'url': '/newScheduleWithFlight',
                    'type': 'POST',
                    'data': newScheduleWithDepartureFlight,
                    'success':function (data, status, xhr) {
                        alert('Расписание на '+ $("#input-date-field").val() +' c рейсом на ' + 
                                $("#departure-arrival-select").children(":selected").val().toLowerCase() + ' успешно добавлено!');
                        $(".cancel-button").trigger("click");
                        $("#input-date-field").change();
                    },
                    'error': function (jqXHR, exception) {
                        alert("Ошибка! Статус: " + jqXHR.status + " – " + jqXHR.textStatus);
                    }
                });
            }
            else if (option == 2) {
                //расписание пустое, добавляем в arrival рейс и создаем пустой departure
                var newScheduleWithArrivalFlight = {
                    "date": new Date( $("#input-date-field").val()),
                    "departure": [],
                    "arrival": [
                        {
                            "type_of_flight": type_of_flight,
                            "departure_city": direction_or_departure_city,
                            "airline": airline,
                            "flight": flight,
                            "arrival_time": $("#input-date-field").val() + "T" + departure_time + ":00Z",
                            "type_of_airplane": type_of_airplane,
                            "execution_period": execution_period
                        }
                    ]
                }
                $.ajax({ 
                    'url': '/newScheduleWithFlight',
                    'type': 'POST',
                    'data': newScheduleWithArrivalFlight,
                    'success':function (data, status, xhr) {
                        alert('Расписание на '+ $("#input-date-field").val() +' c рейсом на ' + 
                                $("#departure-arrival-select").children(":selected").val().toLowerCase() + ' успешно добавлено!');
                        $(".cancel-button").trigger("click");
                        $("#input-date-field").change();
                    },
                    'error': function (jqXHR, exception) {
                        alert("Ошибка! Статус: " + jqXHR.status + " – " + jqXHR.textStatus);
                    }
                });
            }
            else if (option == 3) {
                //расписание не пустое. Departure пуст. Добавляем рейс на вылет
                //ИЛИ
                //расписание не пустое. Departure не пуст. Добавляем рейс на вылет
                var newDepartureFlight = {
                    "type_of_flight": type_of_flight,
                    "direction": direction_or_departure_city,
                    "airline": airline,
                    "flight": flight,
                    "departure_time": $("#input-date-field").val() + "T" + departure_time + ":00Z",
                    "type_of_airplane": type_of_airplane,
                    "execution_period": execution_period
                }
                $.ajax({ 
                    'url': '/newDepartureFlight/' + $("#input-date-field").val(),
                    'type': 'POST',
                    'data': newDepartureFlight,
                    'success':function (data, status, xhr) {
                        alert('В расписание на '+ $("#input-date-field").val() +' успешно добавлен рейс на ' + 
                                $("#departure-arrival-select").children(":selected").val().toLowerCase() + "!");
                        $(".cancel-button").trigger("click");
                        $("#input-date-field").change();
                        $(".search-schedule-button").trigger("click");
                    },
                    'error': function (jqXHR, exception) {
                        alert("Ошибка! Статус: " + jqXHR.status + " – " + jqXHR.textStatus);
                    }
                });
            }
            else if (option == 4) {
                //расписание не пустое. Arrival пуст. Добавляем рейс на прилет
                //ИЛИ
                //расписание не пустое. Arrival не пуст. Добавляем рейс на прилет
                var newArrivalFlight = {
                    "type_of_flight": type_of_flight,
                    "departure_city": direction_or_departure_city,
                    "airline": airline,
                    "flight": flight,
                    "arrival_time": $("#input-date-field").val() + "T" + departure_time + ":00Z",
                    "type_of_airplane": type_of_airplane,
                    "execution_period": execution_period
                }
                $.ajax({ 
                    'url': '/newArrivalFlight/' + $("#input-date-field").val(),
                    'type': 'POST',
                    'data': newArrivalFlight,
                    'success':function (data, status, xhr) {
                        alert('В расписание на '+ $("#input-date-field").val() +' успешно добавлен рейс на ' + 
                                $("#departure-arrival-select").children(":selected").val().toLowerCase() + "!");
                        $(".cancel-button").trigger("click");
                        $("#input-date-field").change();
                        $(".search-schedule-button").trigger("click");
                    },
                    'error': function (jqXHR, exception) {
                        alert("Ошибка! Статус: " + jqXHR.status + " – " + jqXHR.textStatus);
                    }
                });
            }
        }
    });
}

//проверка на факт изменения данных авиарейса
var checkIsUpdated = function(num, input_array) {
    var isUpdated = false;
    var defaultData = currentSchedule.get(parseInt(num));
    var defaultArray = Object.keys(defaultData).map(function(key) {
        return defaultData[key];
    });
    for (var i = 0; i < defaultArray.length; i++) {
        if (input_array[i] != defaultArray[i]) 
            isUpdated = true;
    }
    return isUpdated;
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
    $(".input-field").on("input",function(ev){
        isSearched = true;
        if($(ev.target).val() != "") {
            search($(".input-field").val());
        }
        else {
            isSearched = false;
            $("#input-date-field").change();
        }
    });                          
    $("#input-date-field").change(function() {
        $(".sсhedule-table").empty();
        if ($("#input-date-field").val() != '') {
            if (!isSearched) {
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
            else {
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
                if (currentSelectedOption == "ВЫЛЕТ") {
                        $(".flight-direction-header b").text("Направление");
                        $(".time-header b").text("Время вылета");
                    }
                else {
                    $(".flight-direction-header b").text("Город вылета");
                    $(".time-header b").text("Время прилета");
                } 
                search($(".input-field").val());
            }
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
    $(".search-schedule-button").on("click", function(e) { 
        e.preventDefault();
        $(".cancel-button").attr('disabled', false);
        if ( $("#input-date-field").val() == '') {
            alert("Пожалуйста, выберите дату!")
        }
        else {
            $("#input-date-field").attr('disabled', true);
            $("#departure-arrival-select").attr('disabled', true);
            $(".search-schedule-button").attr('disabled', true);
            $(".delete-schedule-button").attr('disabled', true);
            $(".delete-selected-schedule-button").attr('disabled', true);
            $(".panel-block").remove();
            var $panel_block = $("<div class='panel-block'>");
            $panel_block.append($("<div class='main-table-header '>" +
                "<div class='type-of-flight-header'><b>Тип рейса</b></div>" +
                "<div class='flight-direction-header'><b></b></div>" +
                "<div class='airline-header'><b>Авиакомпания</b></div>" +
                "<div class='flight-header'><b>Рейс</b></div>" +
                "<div class='time-header'><b></b></div>" +
                "<div class='type-of-airplane-header'><b>Тип самолета</b></div>" +
                "<div class='execution-period-header'><b>Период выполнения</b></div></div>"));
            $panel_block.append($("<div class='main-table-cells'>" +
                "<div class='type-of-flight-cell'><select id='type-of-flight-selection' placeholder='Тип рейса' title='Тип рейса'>" +
                "<option value='Дневной'>Дневной</option>" +
                "<option value='Ночной'>Ночной</option></select></div>" +
                "<div class='flight-direction-cell'><input type='text' class='flight-direction-input' style='text-transform: uppercase'></div>" +
                "<div class='airline-cell'><input type='text' class='airline-input' placeholder='Авиакомпания' title='Авиакомпания'></div>" +
                "<div class='flight-cell'><input type='text' class='flight-input' placeholder='Рейс' title='Рейс' style='text-transform: uppercase'></div>" +
                "<div class='time-cell'><input type='time' class='time-input'></div>" +
                "<div class='type-of-airplane-cell'><input type='text' class='type-of-airplane-input' placeholder='Тип самолета' title='Тип самолета' style='text-transform: uppercase'></div>" +
                "<div class='execution-period-cell'><select id='execution-period-selection' placeholder='Период выполнения' title='Период выполнения'>" +
                "<option value='Регулярный'>Регулярный</option>" +
                "<option value='Чартерный'>Чартерный</option></select></div>" +
                                "</div>"));
            $.get("/schedule/" + $("#input-date-field").val(), function(schedule) {
                if (schedule == null) {
                    if (confirm("На "+ $("#input-date-field").val() +" расписание отсутствует. Хотите добавить рейс на " +  
                            currentSelectedOption.toLowerCase() +"?")) {
                        if (currentSelectedOption == "ВЫЛЕТ") 
                            addNewFlight($panel_block, 1);
                        else 
                            addNewFlight($panel_block, 2);
                    }
                    else {
                        $(".cancel-button").trigger("click");
                    }
                }
                else {
                    if (currentSelectedOption == "ВЫЛЕТ") {
                        if (schedule.departure.length == 0) {
                            if (confirm("На "+ $("#input-date-field").val() +" расписание на " + currentSelectedOption.toLowerCase() + " отсутствует. Хотите добавить?")) {
                                addNewFlight($panel_block, 3);
                            }
                            else {
                                $(".cancel-button").trigger("click");
                            }
                        }
                        else {
                            addNewFlight($panel_block, 3);
                            //редактирование и удаление рейсов на вылет
                            $panel_block.append($("<div class='main-table-header '>" +
                                "<div class='type-of-flight-header'><b>Тип рейса</b></div>" +
                                "<div class='flight-direction-header'><b>Направление</b></div>" +
                                "<div class='airline-header'><b>Авиакомпания</b></div>" +
                                "<div class='flight-header'><b>Рейс</b></div>" +
                                "<div class='time-header'><b>Время вылета</b></div>" +
                                "<div class='type-of-airplane-header'><b>Тип самолета</b></div>" +
                                "<div class='execution-period-header'><b>Период выполнения</b></div></div>"));
                            var i = 0;
                            var countOfFlights = 0;
                            (schedule.departure).sort(function(a,b){
                                return new Date(a.departure_time) - new Date(b.departure_time);
                            });
                            currentSchedule.clear();
                            (schedule.departure).forEach(function(flightElem){
                                $panel_block.append($("<div class='main-table-cells' num='" + i + "' flight_id='" + flightElem._id + "'>" +
                                    "<div class='type-of-flight-cell'><select id='type-of-flight-selection" + i + "' placeholder='Тип рейса' title='Тип рейса'>" +
                                    "<option value='Дневной'>Дневной</option>" +
                                    "<option value='Ночной'>Ночной</option></select></div>" +
                                    "<div class='flight-direction-cell'><input type='text' id='flight-direction-input" + i + "' placeholder='Направление' style='text-transform: uppercase' title='Направление'></div>" +
                                    "<div class='airline-cell'><input type='text' id='airline-input" + i + "' placeholder='Авиакомпания' title='Авиакомпания'></div>" +
                                    "<div class='flight-cell'><input type='text' id='flight-input" + i + "' placeholder='Рейс' title='Рейс' style='text-transform: uppercase'></div>" +
                                    "<div class='time-cell'><input type='time' id='time-input" + i + "' placeholder='Время вылета' title='Время вылета'></div>" +
                                    "<div class='type-of-airplane-cell'><input type='text' id='type-of-airplane-input" + i + "' placeholder='Тип самолета' title='Тип самолета' style='text-transform: uppercase'></div>" +
                                    "<div class='execution-period-cell'><select id='execution-period-selection" + i + "' placeholder='Период выполнения' title='Период выполнения'>" +
                                    "<option value='Регулярный'>Регулярный</option>" +
                                    "<option value='Чартерный'>Чартерный</option></select></div>" +
                                                    "</div>"));
                                
                                $("#type-of-flight-selection" + i  + " option[value='" + flightElem.type_of_flight + "']").prop('selected', true);
                                $("#flight-direction-input" + i).val(flightElem.direction);
                                $("#airline-input" + i).val(flightElem.airline);
                                $("#flight-input" + i).val(flightElem.flight);
                                $("#time-input" + i).val(flightElem.departure_time.slice(11,16));
                                $("#type-of-airplane-input" + i).val(flightElem.type_of_airplane);
                                $("#execution-period-selection" + i  + " option[value='" + flightElem.execution_period + "']").prop('selected', true);
                                
                                currentSchedule.set(i, {
                                    type_of_flight: flightElem.type_of_flight,
		                            direction: flightElem.direction,
		                            airline: flightElem.airline,
                                    flight: flightElem.flight,
                                    departure_time: flightElem.departure_time.slice(11,16),
                                    type_of_airplane: flightElem.type_of_airplane,
                                    execution_period: flightElem.execution_period
                                });

                                $(".main-table-cells[flight_id='" + flightElem._id + "'] input").change(function(){
                                    $(".main-table-cells-buttons[flight_id='" + flightElem._id + "']").children(".cancel-flight-button").attr("disabled", false);
                                    $(".main-table-cells-buttons[flight_id='" + flightElem._id + "']").children(".delete-flight-button").attr("disabled", true);
                                });
                                $(".main-table-cells[flight_id='" + flightElem._id + "'] select").change(function(){
                                    $(".main-table-cells-buttons[flight_id='" + flightElem._id + "']").children(".cancel-flight-button").attr("disabled", false);
                                    $(".main-table-cells-buttons[flight_id='" + flightElem._id + "']").children(".delete-flight-button").attr("disabled", true);
                                });
                                $panel_block.append($("<div class='main-table-cells-buttons' num='" + i + "' flight_id='" + flightElem._id + "'>" +
                                    "<button class='delete-flight-button'>Удалить</button>" +
                                    "<button class='update-flight-button'>Редактировать</button>" +
                                    "<button class='cancel-flight-button'>Отмена</button>" +
                                    "</div>"));
                                $(".main-table-cells-buttons[flight_id='" + flightElem._id + "']").children(".cancel-flight-button").attr("disabled", true);
                                countOfFlights++;
                                i++;
                            });
                            $(".cancel-flight-button").on("click", function(){
                                var $main_table_cells_buttons = $(this).parent();
                                var num =  $main_table_cells_buttons.attr("num");
                                $main_table_cells_buttons.children(".cancel-flight-button").attr("disabled", true);
                                $main_table_cells_buttons.children(".delete-flight-button").attr("disabled", false);
                                var defaultData = currentSchedule.get(parseInt(num));
                                $("#type-of-flight-selection" + num  + " option[value='" + defaultData.type_of_flight + "']").prop('selected', true);
                                $("#flight-direction-input" + num).val(defaultData.direction);
                                $("#airline-input" + num).val(defaultData.airline);
                                $("#flight-input" + num).val(defaultData.flight);
                                $("#time-input" + num).val(defaultData.departure_time);
                                $("#type-of-airplane-input" + num).val(defaultData.type_of_airplane);
                                $("#execution-period-selection" + num  + " option[value='" + defaultData.execution_period + "']").prop('selected', true);
                            });
                            $(".update-flight-button").on("click", function(){
                                var num =  $(this).parent().attr("num");
                                var input_array = [], isInvalidInput = false;
                                var type_of_flight =  $("#type-of-flight-selection" + num).children(":selected").val();
                                input_array.push(type_of_flight);
                                var direction_or_departure_city = $("#flight-direction-input" + num).val().trim().toUpperCase();
                                input_array.push(direction_or_departure_city);
                                var airline = $("#airline-input" + num).val().trim();
                                input_array.push(airline);
                                var flight = $("#flight-input" + num).val().trim().toUpperCase();
                                input_array.push(flight);
                                var departure_time = $("#time-input" + num).val();
                                input_array.push(departure_time);
                                var type_of_airplane = $("#type-of-airplane-input" + num).val().trim().toUpperCase();
                                input_array.push(type_of_airplane);
                                var execution_period = $("#execution-period-selection" + num).children(":selected").val();
                                input_array.push(execution_period);
                                input_array.forEach(function(value){
                                    if (!(value !== null && value.trim() !== "")) {
                                        isInvalidInput = true;
                                    }
                                });
                                if (isInvalidInput) {
                                    alert("Присутствуют незаполненные поля! Попробуйте еще раз!");
                                    $(".cancel-flight-button").trigger("click");
                                }
                                else {
                                    if (!checkIsUpdated(num, input_array)) {
                                        alert("Данные не были изменены!");
                                    }
                                    else {
                                        $.ajax({ 
                                            'url': '/departureFlight',
                                            'type': 'PUT',
                                            'data': {
                                                "flight_id":  $(this).parent().parent().children(".main-table-cells[num='" + num + "']").attr("flight_id"),
                                                "type_of_flight": type_of_flight,
                                                "direction": direction_or_departure_city,
                                                "airline": airline,
                                                "flight": flight,
                                                "departure_time": $("#input-date-field").val() + "T" + departure_time + ":00Z",
                                                "type_of_airplane": type_of_airplane,
                                                "execution_period": execution_period
                                            },
                                            'success':function (data, status, xhr) {
                                                alert('Рейс ' + currentSchedule.get(parseInt(num)).flight + ' на вылет успешно изменен!');
                                                $(".cancel-button").trigger("click");
                                                $("#input-date-field").change();
                                                $(".search-schedule-button").trigger("click");
                                            },
                                            'error': function (jqXHR, exception) {
                                                alert("Ошибка! Статус: " + jqXHR.status + " – " + jqXHR.textStatus);
                                            }
                                        });
                                    }
                                }
                            });
                            $(".delete-flight-button").on("click", function(){
                                var num =  $(this).parent().attr("num");
                                if (confirm("Вы уверены, что хотите удалить рейс " + currentSchedule.get(parseInt(num)).flight + " на вылет?")) {
                                    $.ajax({ 
                                        'url': '/departureFlight/' + $("#input-date-field").val(),
                                        'type': 'DELETE',
                                        'data': {"flight_id": $(this).parent().parent().children(".main-table-cells[num='" + num + "']").attr("flight_id")},
                                        'success':function (data, status, xhr) {
                                            alert('Рейс ' + currentSchedule.get(parseInt(num)).flight + ' на вылет успешно удален!');
                                            $(".cancel-button").trigger("click");
                                            if (countOfFlights - 1 > 0) 
                                                $(".search-schedule-button").trigger("click");
                                            $("#input-date-field").change();
                                        },
                                        'error': function (jqXHR, exception) {
                                            alert("Ошибка! Статус: " + jqXHR.status + " – " + jqXHR.textStatus);
                                        }
                                    });
                                }
                            });
                        }
                    }
                    else {
                        if (schedule.arrival.length == 0) {
                            if (confirm("На "+ $("#input-date-field").val() +" расписание на " + currentSelectedOption.toLowerCase() + " отсутствует. Хотите добавить?")) {
                                addNewFlight($panel_block, 4);
                            }
                            else {
                                $(".cancel-button").trigger("click");
                            }
                        }
                        else {
                            addNewFlight($panel_block, 4);
                            //редактирование и удаление рейсов на прилет
                            $panel_block.append($("<div class='main-table-header '>" +
                                "<div class='type-of-flight-header'><b>Тип рейса</b></div>" +
                                "<div class='flight-direction-header'><b>Город вылета</b></div>" +
                                "<div class='airline-header'><b>Авиакомпания</b></div>" +
                                "<div class='flight-header'><b>Рейс</b></div>" +
                                "<div class='time-header'><b>Время прилета</b></div>" +
                                "<div class='type-of-airplane-header'><b>Тип самолета</b></div>" +
                                "<div class='execution-period-header'><b>Период выполнения</b></div></div>"));
                            var i = 0;
                            var countOfFlights = 0;
                            (schedule.arrival).sort(function(a,b){
                                return new Date(a.arrival_time) - new Date(b.arrival_time);
                            });
                            currentSchedule.clear();
                            (schedule.arrival).forEach(function(flightElem){
                                $panel_block.append($("<div class='main-table-cells' num='" + i + "' flight_id='" + flightElem._id + "'>" +
                                    "<div class='type-of-flight-cell'><select id='type-of-flight-selection" + i + "' placeholder='Тип рейса' title='Тип рейса'>" +
                                    "<option value='Дневной'>Дневной</option>" +
                                    "<option value='Ночной'>Ночной</option></select></div>" +
                                    "<div class='flight-direction-cell'><input type='text' id='flight-direction-input" + i + "' placeholder='Город вылета' style='text-transform: uppercase' title='Город вылета'></div>" +
                                    "<div class='airline-cell'><input type='text' id='airline-input" + i + "' placeholder='Авиакомпания' title='Авиакомпания'></div>" +
                                    "<div class='flight-cell'><input type='text' id='flight-input" + i + "' placeholder='Рейс' title='Рейс' style='text-transform: uppercase'></div>" +
                                    "<div class='time-cell'><input type='time' id='time-input" + i + "' placeholder='Время прилета' title='Время прилета'></div>" +
                                    "<div class='type-of-airplane-cell'><input type='text' id='type-of-airplane-input" + i + "' placeholder='Тип самолета' title='Тип самолета' style='text-transform: uppercase'></div>" +
                                    "<div class='execution-period-cell'><select id='execution-period-selection" + i + "' placeholder='Период выполнения' title='Период выполнения'>" +
                                    "<option value='Регулярный'>Регулярный</option>" +
                                    "<option value='Чартерный'>Чартерный</option></select></div>" +
                                                    "</div>"));
                                
                                $("#type-of-flight-selection" + i  + " option[value='" + flightElem.type_of_flight + "']").prop('selected', true);
                                $("#flight-direction-input" + i).val(flightElem.departure_city);
                                $("#airline-input" + i).val(flightElem.airline);
                                $("#flight-input" + i).val(flightElem.flight);
                                $("#time-input" + i).val(flightElem.arrival_time.slice(11,16));
                                $("#type-of-airplane-input" + i).val(flightElem.type_of_airplane);
                                $("#execution-period-selection" + i  + " option[value='" + flightElem.execution_period + "']").prop('selected', true);
                                
                                currentSchedule.set(i, {
                                    type_of_flight: flightElem.type_of_flight,
                                    departure_city: flightElem.departure_city,
                                    airline: flightElem.airline,
                                    flight: flightElem.flight,
                                    arrival_time: flightElem.arrival_time.slice(11,16),
                                    type_of_airplane: flightElem.type_of_airplane,
                                    execution_period: flightElem.execution_period
                                });

                                $(".main-table-cells[flight_id='" + flightElem._id + "'] input").change(function(){
                                    $(".main-table-cells-buttons[flight_id='" + flightElem._id + "']").children(".cancel-flight-button").attr("disabled", false);
                                    $(".main-table-cells-buttons[flight_id='" + flightElem._id + "']").children(".delete-flight-button").attr("disabled", true);
                                });
                                $(".main-table-cells[flight_id='" + flightElem._id + "'] select").change(function(){
                                    $(".main-table-cells-buttons[flight_id='" + flightElem._id + "']").children(".cancel-flight-button").attr("disabled", false);
                                    $(".main-table-cells-buttons[flight_id='" + flightElem._id + "']").children(".delete-flight-button").attr("disabled", true);
                                });
                                $panel_block.append($("<div class='main-table-cells-buttons' num='" + i + "' flight_id='" + flightElem._id + "'>" +
                                    "<button class='delete-flight-button'>Удалить</button>" +
                                    "<button class='update-flight-button'>Редактировать</button>" +
                                    "<button class='cancel-flight-button'>Отмена</button>" +
                                    "</div>"));
                                $(".main-table-cells-buttons[flight_id='" + flightElem._id + "']").children(".cancel-flight-button").attr("disabled", true);
                                countOfFlights++;
                                i++;
                            });
                            $(".cancel-flight-button").on("click", function(){
                                var $main_table_cells_buttons = $(this).parent();
                                var num =  $main_table_cells_buttons.attr("num");
                                $main_table_cells_buttons.children(".cancel-flight-button").attr("disabled", true);
                                $main_table_cells_buttons.children(".delete-flight-button").attr("disabled", false);
                                var defaultData = currentSchedule.get(parseInt(num));
                                $("#type-of-flight-selection" + num  + " option[value='" + defaultData.type_of_flight + "']").prop('selected', true);
                                $("#flight-direction-input" + num).val(defaultData.departure_city);
                                $("#airline-input" + num).val(defaultData.airline);
                                $("#flight-input" + num).val(defaultData.flight);
                                $("#time-input" + num).val(defaultData.arrival_time);
                                $("#type-of-airplane-input" + num).val(defaultData.type_of_airplane);
                                $("#execution-period-selection" + num  + " option[value='" + defaultData.execution_period + "']").prop('selected', true);
                            });
                            $(".update-flight-button").on("click", function(){
                                var num =  $(this).parent().attr("num");
                                var input_array = [], isInvalidInput = false;
                                var type_of_flight =  $("#type-of-flight-selection" + num).children(":selected").val();
                                input_array.push(type_of_flight);
                                var direction_or_departure_city = $("#flight-direction-input" + num).val().trim().toUpperCase();
                                input_array.push(direction_or_departure_city);
                                var airline = $("#airline-input" + num).val().trim();
                                input_array.push(airline);
                                var flight = $("#flight-input" + num).val().trim().toUpperCase();
                                input_array.push(flight);
                                var arrival_time = $("#time-input" + num).val();
                                input_array.push(arrival_time);
                                var type_of_airplane = $("#type-of-airplane-input" + num).val().trim().toUpperCase();
                                input_array.push(type_of_airplane);
                                var execution_period = $("#execution-period-selection" + num).children(":selected").val();
                                input_array.push(execution_period);
                                input_array.forEach(function(value){
                                    if (!(value !== null && value.trim() !== "")) {
                                        isInvalidInput = true;
                                    }
                                });
                                if (isInvalidInput) {
                                    alert("Присутствуют незаполненные поля! Попробуйте еще раз!");
                                    $(".cancel-flight-button").trigger("click");
                                }
                                else {
                                    if (!checkIsUpdated(num, input_array)) {
                                        alert("Данные не были изменены!");
                                    }
                                    else {
                                        $.ajax({ 
                                            'url': '/arrivalFlight',
                                            'type': 'PUT',
                                            'data': {
                                                "flight_id":  $(this).parent().parent().children(".main-table-cells[num='" + num + "']").attr("flight_id"),
                                                "type_of_flight": type_of_flight,
                                                "departure_city": direction_or_departure_city,
                                                "airline": airline,
                                                "flight": flight,
                                                "arrival_time": $("#input-date-field").val() + "T" + arrival_time + ":00Z",
                                                "type_of_airplane": type_of_airplane,
                                                "execution_period": execution_period
                                            },
                                            'success':function (data, status, xhr) {
                                                alert('Рейс ' + currentSchedule.get(parseInt(num)).flight + ' на прилет успешно изменен!');
                                                $(".cancel-button").trigger("click");
                                                $("#input-date-field").change();
                                                $(".search-schedule-button").trigger("click");
                                            },
                                            'error': function (jqXHR, exception) {
                                                alert("Ошибка! Статус: " + jqXHR.status + " – " + jqXHR.textStatus);
                                            }
                                        });
                                    }
                                }
                            });
                            $(".delete-flight-button").on("click", function(){
                                var num =  $(this).parent().attr("num");
                                if (confirm("Вы уверены, что хотите удалить рейс " + currentSchedule.get(parseInt(num)).flight + " на прилет?")) {
                                    $.ajax({ 
                                        'url': '/arrivalFlight/' + $("#input-date-field").val(),
                                        'type': 'DELETE',
                                        'data': {"flight_id": $(this).parent().parent().children(".main-table-cells[num='" + num + "']").attr("flight_id")},
                                        'success':function (data, status, xhr) {
                                            alert('Рейс ' + currentSchedule.get(parseInt(num)).flight + ' на прилет успешно удален!');
                                            $(".cancel-button").trigger("click");
                                            if (countOfFlights - 1 > 0) 
                                                $(".search-schedule-button").trigger("click");
                                            $("#input-date-field").change();
                                        },
                                        'error': function (jqXHR, exception) {
                                            alert("Ошибка! Статус: " + jqXHR.status + " – " + jqXHR.textStatus);
                                        }
                                    });
                                }
                            });
                        }
                    }
                }
            });       
        }
    });
    $(".delete-schedule-button").on("click", function(e) {
        e.preventDefault();
        if ( $("#input-date-field").val() == '') {
            alert("Пожалуйста, выберите дату!")
        }
        else {
            var date = $("#input-date-field").val();
            $.get("/schedule/" + date, function(schedule) {
                if(schedule != null) {
                    if (confirm("Вы уверены, что хотите удалить расписание на " + date + "?")) {
                        $.ajax({
                            'url': '/schedule/' + date,
                            'type': 'DELETE',
                        }).done(function(responde) {
                            alert('Расписание на '+ date +' успешно удалено!');
                            $("#input-date-field").change();
                        }).fail(function(jqXHR, textStatus, error) {
                            alert("Ошибка! Статус: " + jqXHR.status + " – " + jqXHR.textStatus);	
                        });
                    }
                }
                else {
                    alert("Расписание на данную дату отсутствует!");
                }
            });
        }
    });
    $(".delete-selected-schedule-button").on("click", function(e) {
        e.preventDefault();
        if ( $("#input-date-field").val() == '') {
            alert("Пожалуйста, выберите дату!")
        }
        else {
            var date = $("#input-date-field").val();
            $.get("/schedule/" + date, function(schedule) {
                if(schedule != null) {
                    if (currentSelectedOption == "ВЫЛЕТ") {
                        if (schedule.departure.length != 0) {
                            if (confirm("Вы уверены, что хотите удалить расписание на вылет на " + date + "?")) {
                                $.ajax({ 
                                    'url': '/departureSchedule/' + date,
                                    'type': 'DELETE',
                                    'success':function (data, status, xhr) {
                                        alert('Расписание на вылет на ' + date + ' успешно удалено!');
                                        $("#input-date-field").change();
                                    },
                                    'error': function (jqXHR, exception) {
                                        alert("Ошибка! Статус: " + jqXHR.status + " – " + jqXHR.textStatus);
                                    }
                                });
                            }
                        }
                        else {
                            alert("Расписание на вылет на данную дату отсутствует!");
                        }
                    }
                    else {
                        if (schedule.arrival.length != 0) {
                            if (confirm("Вы уверены, что хотите удалить расписание на прилет на " + date + "?")) {
                                $.ajax({ 
                                    'url': '/arrivalSchedule/' + date,
                                    'type': 'DELETE',
                                    'success':function (data, status, xhr) {
                                        alert('Расписание на прилет на ' + date + ' успешно удалено!');
                                        $("#input-date-field").change();
                                    },
                                    'error': function (jqXHR, exception) {
                                        alert("Ошибка! Статус: " + jqXHR.status + " – " + jqXHR.textStatus);
                                    }
                                });
                            }
                        }
                        else {
                            alert("Расписание на прилет на данную дату отсутствует!");
                        }
                    }
                }
                else {
                    alert("Расписание на данную дату отсутствует!");
                }
            });
        }
    });
};

$(document).ready(function() {
	main();
});