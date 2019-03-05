$(document).ready(function() {
    $('#WeatherTimes').hide();
    var months = {
        "01" : "January",
        "02" : "February",
        "03" : "March",
        "04" : "April",
        "05" : "May",
        "06" : "June",
        "07" : "July",
        "08" : "August",
        "09" : "September",
        "10" : "October",
        "11" : "November",
        "12" : "December",
    }

    var weatherData;

    var url = 'http://api.openweathermap.org/data/2.5/forecast?q=Salt+Lake+City,us&units=imperial&APPID=fc10c3deb804fce628025ed0ddcc55de';
    $.getJSON(url, function(data) {
        console.log(data);

        weatherData = data;

        var datesPrinted = [];
        var dayCount = 1;
        var timeTable = "<div>";
        var datesPrintedForTime = [];

        for(var i = 0; i < data.list.length; i++) {
            var date = data.list[i].dt_txt;
            var dateParse1 = date.split("-")[2].split(" ");
            var dateToAdd = dateParse1[0];
            var time = parseInt(date.split(" ")[1].split(':')[0]);
            var amPm;
            if(time < 12) {
                amPm = "Am";
            } else {
                amPm = "Pm";
            }
            if(time > 12) {
                time -= 12;
            }
            if(time < 0) {
                time *= -1;
            }
            if(!datesPrintedForTime.includes(dateToAdd)) {
                timeTable += "</div><div class='Hourly'><p class='dateTime'>" + months[date.split("-")[1]] + " " + dateToAdd + "</p>";
                datesPrintedForTime[i] = dateToAdd;
            } else {
                timeTable += "<p class='time'>" + time + amPm +"</p>";
            }

            if(!datesPrinted.includes(dateToAdd) && time > 6 && time < 12 && amPm == "Am") {
                datesPrinted[i] = dateToAdd;
                var dateToPrint = months[date.split("-")[1]] + " " + dateToAdd;

                $('#date' + dayCount).html(dateToPrint);

                var temp = data.list[i].main.temp;
                var weather = data.list[i].weather[0].description;
                
                weather = weather.toLowerCase()
                .split(' ')
                .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                .join(' ');

                var blue = Math.round((temp / 100) * 256);
                var red = 256 - blue;
                blue = blue.toString(16);
                red = red.toString(16);

                var color = "#00" + blue + red;

                $('#temp' + dayCount).html(Math.round(temp) + "&deg");
                $('#temp' + dayCount).css("background-color", color);
                $('#weather' + dayCount).html(weather);

                dayCount++;
            }
        }
        timeTable += "</div>";
        $("#HourSet").html(timeTable);
    })

    var sideBarOpen = false;
    var isHourly = false;
    var hoursInit = false;

    $('#navButton').click(function() {
        if(sideBarOpen) {
            $('#sideNav').css('width', "0px");
            $('#sideNav').css('box-shadow', "none");
            sideBarOpen = false;
        } else {
            sideBarOpen = true;
            $('#sideNav').css('width', "13%");
            $('#sideNav').css('box-shadow', "5px 17px 10px 10px #EEEEEEEE");
        }
    })

    $('#closeBtn').click(function() {
        $('#sideNav').css('width', "0px");
        $('#sideNav').css('box-shadow', "none");
        sideBarOpen = false;
    })

    $('#showTimes').click(function() {
        if(!isHourly) {
            $('#Weather').fadeOut(1000).promise().done(function() {
                $('#WeatherTimes').fadeIn(1000);
                $('.Hourly').css('animation-play-state', 'running');
                isHourly = true;
            });
        }
    })

    $('#showDays').click(function() {
        if(isHourly) {
            $('#WeatherTimes').fadeOut(1000).promise().done(function() {
                $('#Weather').fadeIn(1000);
                isHourly = false;
            });
        }
    })
});