$(document).ready(function (){
  var getDate = function(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!

    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd;
    } 
    if(mm<10){
        mm='0'+mm;
    } 
    var today = dd+mm+yyyy;
    console.log(today);
    $("#txtDate").attr("value", today);
    return today;
  }
  var date="";
  date = getDate();
  var  date1 = date;
  $("#txtDate").click(function(){
       date1 = date;
       date = $(this).val();  
       if(date!=date1)
           doAJAX(date);
  });
var doAJAX = function(date){
    $.ajax({
        url: "http://localhost:9001/api/v1/date/"+date,
        type: "GET",
        crossDomain: true,
        dataType: 'json',
        cache: false,
        success: function(response){
             returnedData = response;
             order(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            var s  = "<p id='ifServerDown' style='text-align:center'> THE URL IS NOT AVAILABLE AT THE MOMENT\. PLEASE TRY AGAIN LATER.</p>";
            $('#ifServerDown').replaceWith(s);
        }
  });
}
doAJAX(date);
var order = function(response){
    var s  = "<table class='table table-hover' id='dataTable' style='background-color: cornsilk;'><tr></tr><tr><td>id</td><td>title</td><td>url</td><td>time</td><td>score</td></tr>"
    if(response.length === 0){
        var temp = "<tr></tr><tr>"
             + "<td>No matches for the date</td>" 
             + "<td>No matches for the date</td>"
             + "<td>No matches for the date</td>"
             + "<td>No matches for the date</td>"
             + "<td>No matches for the date</td>"
             + "</tr>";
        $('#dataTable').replaceWith(s+temp+"</table>");
        return;
    }
    
    var s1 = "";
    response = response.sort(function(a,b){
                return b.score - a.score; 
             });
    for(var i = 0 ; i< response.length; i++){
       s1 = s1  + "<tr>"
                + "<td>" + response[i].id + "</td>" 
                + "<td>" + response[i].title+ "</td>"
                + "<td>" + "<a href= "+response[i].url+"> Link</a>" + "</td>"
                + "<td>" + response[i].time + "</td>"
                + "<td>" + response[i].score + "</td>"
                + "</tr>";
    };
                $('#dataTable').replaceWith(s+s1+"</table>");
}
});