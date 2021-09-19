$(function () {
    //Json data by api call for restock table
    $.get(restockListApiUrl, function (response) {
        if(response) {
            var table = '';
            var totalCost = 0;
            $.each(response, function(index, restock) {
                totalCost += parseFloat(restock.total);
                table += '<tr>' +
                    '<td>'+ restock.date_time +'</td>'+
                    '<td>'+ restock.restock_id +'</td>'+
                    '<td>'+ restock.total.toFixed(2) +' Rs</td></tr>';
            });
            table += '<tr><td colspan="3" style="text-align: end"><b>Total</b></td><td><b>'+ totalCost.toFixed(2) +' Rs</b></td></tr>';
            $("table").find('tbody').empty().html(table);
        }
    });
});