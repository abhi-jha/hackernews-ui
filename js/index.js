$(document).ready(function () {
    let base_rul = "http://localhost:9001/api/v1/paginate/";
    let url_for_paginate_date = base_rul + "date/";
    let url_for_paginate_score = base_rul + "score/";
    let url_for_paginate_text = base_rul + "match/";
    let prevpage = document.querySelector(".prevpage");
    let nextpage = document.querySelector(".nextpage");
    let countforward = 1, countbackward = 1;
    let date_message = "date :";
    let score_message = "score : ";
    let text_message= "text : "
    let current_url = url_for_paginate_date;
    let defaultLowerlimitScore = 4000;
    let num_fo_columns = 6;
    let tableHeader = "<table class='table table-hover' id='dataTable' style='background-color: cornsilk;'><tr></tr><tr><td>S.No.</td><td>id</td><td>title</td><td>url</td><td>time</td><td>score</td></tr>";
    let getbyDate = document.querySelector("#getbyDate");
    let getByScore = document.querySelector("#getByScore");
    let getByText = document.querySelector("#getByText");
    let messagetodisplay = document.querySelector("#messagetodisplay span");
    let datatable = $('#dataTable');

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
                displayAjaxResult(response, count);
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

    function buildDefaultMessage(defaultMessage, count_of_columns){
        let temp = "<tr></tr><tr>";
        for(let i  = 0 ; i <  count_of_columns; i++){
            temp += `<td>${defaultMessage}</td>`;
        }
        return tableHeader + temp + "</tr>" + "</table>";
    }

    function displayAjaxResult(response, count) {
        if (response.length === 0) {
            datatable.replaceWith(buildDefaultMessage("No matches", num_fo_columns));
            return;
        }

        let tableData = "";
        response = response.sort(function (a, b) {
            return b.score - a.score;
        });
        for (let i = 0; i < response.length; i++) {
            let d = new Date(response[i].time);
            tableData = tableData + "<tr>"
                + "<td>" + count++ + "</td>"
                + "<td>" + response[i].id + "</td>"
                + "<td>" + response[i].title + "</td>"
                + "<td>" + "<a href= " + response[i].url + "> Link</a>" + "</td>"
                + `<td title=${d.toTimeString()}>` + d.toDateString() + "</td>"
                + "<td>" + response[i].score + "</td>"
                + "</tr>";
        }
        datatable.replaceWith(tableHeader + tableData + "</table>");
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

    function basicButtonSetup(event, other_selectors, message, value_to_put_in_check_box, baseUrl){
        event.target.style.backgroundColor = "#f16430";
        current_url = baseUrl;
        for(let  i = 0; i < other_selectors.length; i++)
            other_selectors[i].style.backgroundColor = "white"
        messagetodisplay.innerText = message;
        let txtDate = document.querySelector("#txtDate");
        txtDate.value = value_to_put_in_check_box;
        prevpage.style.display = 'none';
        prevpage.title = "gibtitle";
        nextpage.style.display = 'none';
        nextpage.title = "gibtitle";
        datatable.replaceWith(buildDefaultMessage("Looking", num_fo_columns));
        doAJAX(baseUrl + txtDate.value, countforward);//Call AJAX. Another API calling point.
    }

    getbyDate.addEventListener('click', function(event){
        let other_selectors = [getByScore, getByText]
        basicButtonSetup(event, other_selectors, date_message, getDate(), url_for_paginate_date)
    })

    getByScore.addEventListener('click', function(event){
        let other_selectors = [getbyDate, getByText]
        basicButtonSetup(event, other_selectors, score_message, defaultLowerlimitScore, url_for_paginate_score);
    })

    getByText.addEventListener('click', function(event){
        let other_selectors = [getbyDate, getByScore]
        basicButtonSetup(event, other_selectors, text_message, "math", url_for_paginate_text);
    })

    function runthis() {
        let date = getDate();
        messagetodisplay.innerText = date_message;
        getbyDate.style.backgroundColor = "#f16430";
        getByScore.style.backgroundColor = "white";
        getByText.style.backgroundColor = "white";
        $("#txtDate").attr("value", date);
        doAJAX(url_for_paginate_date + date, countforward);//Call AJAX. This is the first API calling point.
    }

    runthis();//The actual INITIAL call happens here.
});