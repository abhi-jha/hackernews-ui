$(document).ready(function () {
    let url_for_paginate_date = "http://localhost:9001/api/v1/paginate/date/";
    let url_for_paginate_score = "http://localhost:9001/api/v1/paginate/score/";
    let prevpage = document.querySelector(".prevpage");
    let nextpage = document.querySelector(".nextpage");
    let countforward = 1, countbackward = 1;
    let date_message = "Please enter a date in DDMMYYYY format:";
    let score_message = "Please enter a score value";
    let current_url = url_for_paginate_date;
    let defaultLowerlimitScore = 4000;

    function getDate() {
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1; //January is 0!

        let yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        today = dd + mm + yyyy;
        return today;
    }

    function doAJAX(url, count) {
        $.ajax({
            url: url,
            type: "GET",
            crossDomain: true,
            dataType: 'json',
            cache: false,
            success: function (response, status, xhr) {
                order(response, count);
                let nextpagelink = xhr.getResponseHeader("nextpage");
                let prevpagelink = xhr.getResponseHeader("prevpage");
                if (prevpagelink === null) {
                    prevpage.style.display = 'none';
                    prevpage.title = "gibtitle";
                } else {
                    if (prevpage.style.display === 'none')
                        prevpage.style.display = 'inline-block';
                    prevpage.title = prevpagelink;
                }

                if (nextpagelink === null) {
                    nextpage.style.display = 'none';
                    nextpage.title = "gibtitle";
                } else {
                    if (nextpage.style.display === 'none')
                        nextpage.style.display = 'inline-block';
                    nextpage.title = nextpagelink;
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                let errorMessage = "<p id='ifServerDown' style='text-align:center'> THE URL IS NOT AVAILABLE AT THE MOMENT\. PLEASE TRY AGAIN LATER.</p>";
                $('#ifServerDown').replaceWith(errorMessage);
            }
        });
    }

    function order(response, count) {
        let tableHeader = "<table class='table table-hover' id='dataTable' style='background-color: cornsilk;'><tr></tr><tr><td>S.No.</td><td>id</td><td>title</td><td>url</td><td>time</td><td>score</td></tr>"
        if (response.length === 0) {
            let temp = "<tr></tr><tr>"
                + "<td>No matches for the date</td>"
                + "<td>No matches for the date</td>"
                + "<td>No matches for the date</td>"
                + "<td>No matches for the date</td>"
                + "<td>No matches for the date</td>"
                + "<td>No matches for the date</td>"
                + "</tr>";
            $('#dataTable').replaceWith(tableHeader + temp + "</table>");
            return;
        }

        let tableData = "";
        response = response.sort(function (a, b) {
            return b.score - a.score;
        });
        for (let i = 0; i < response.length; i++) {
            tableData = tableData + "<tr>"
                + "<td>" + count++ + "</td>"
                + "<td>" + response[i].id + "</td>"
                + "<td>" + response[i].title + "</td>"
                + "<td>" + "<a href= " + response[i].url + "> Link</a>" + "</td>"
                + "<td>" + response[i].time + "</td>"
                + "<td>" + response[i].score + "</td>"
                + "</tr>";
        }
        $('#dataTable').replaceWith(tableHeader + tableData + "</table>");
    }

    $("#getarticles").click(function (event) {
        countforward = 1, countbackward = 1;
        doAJAX(current_url + $("#txtDate").val(), countforward);//Called when Get Articles button clicked
        event.preventDefault();
    });

    nextpage.addEventListener('click', function (event) {
        countforward += 10;
        doAJAX(event.target.title, countforward);
    });
    prevpage.addEventListener('click', function (event) {
        countbackward = countforward - 10;
        countforward = countbackward;
        doAJAX(event.target.title, countbackward);
    });

    getbyDate = document.querySelector("#getbyDate");
    getByScore = document.querySelector("#getByScore");
    messagetodisplay = document.querySelector("#messagetodisplay span");


    getbyDate.addEventListener('click', function(event){
        event.target.style.backgroundColor = "green";
        getByScore.style.backgroundColor = "white"
        messagetodisplay.innerText = date_message;
        let date = getDate();
        txtDate = document.querySelector("#txtDate");
        txtDate.value = date;
        current_url = url_for_paginate_date;
        doAJAX(current_url + date, countforward);//Call AJAX. Another calling point.
    })

    getByScore.addEventListener('click', function(event){
        event.target.style.backgroundColor = "green";
        getbyDate.style.backgroundColor = "white";
        messagetodisplay.innerText = score_message;
        txtDate = document.querySelector("#txtDate");
        txtDate.value = defaultLowerlimitScore;
        current_url = url_for_paginate_score;
        doAJAX(current_url + txtDate.value, countforward);//Call AJAX. Another calling point.
    })


    function runthis() {
        let date = getDate();
        messagetodisplay.innerText = date_message;
        getbyDate.style.backgroundColor = "red";
        getByScore.style.backgroundColor = "white";
        $("#txtDate").attr("value", date);
        doAJAX(url_for_paginate_date + date, countforward);//Call AJAX. This is the first calling point.
    }

    runthis();
});