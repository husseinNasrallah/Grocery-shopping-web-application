// Define your api here
var productListApiUrl = 'http://127.0.0.1:5000/getProducts';
var uomListApiUrl = 'http://127.0.0.1:5000/getUOM';
var productSaveApiUrl = 'http://127.0.0.1:5000/insertProduct';
var productDeleteApiUrl = 'http://127.0.0.1:5000/deleteProduct';
var productEditApiUrl = 'http://127.0.0.1:5000/editProduct';
var orderListApiUrl = 'http://127.0.0.1:5000/getAllOrders';
var orderSaveApiUrl = 'http://127.0.0.1:5000/insertOrder';
var restockSaveApiUrl = 'http://127.0.0.1:5000/insertrestocks';
var restockListApiUrl = 'http://127.0.0.1:5000/getAllrestocks'
var productsApiUrl = 'https://fakestoreapi.com/products';



function callApi(method, url, data) {
    $.ajax({
        method: method,
        url: url,
        data: data
    }).done(function( msg ) {
        window.location.reload();
    });
}



function calculateValue() {
    var total = 0;
    $(".product-item").each(function( index ) {
        var total_item = 0
        var qty = parseFloat($(this).find('.product-qty').val());
        var checkbox = $(this).closest('.row').find('#buy_type');
        var product_id = $(this).closest('.row').find('.cart-product').val();
        var price_unit = parseFloat($(this).find('#product_price').val());
        var price_pack = parseFloat($(this).find('#product_price_pack').val());
        if(checkbox.prop("checked")){
            total_item = qty*price_unit;
            $(this).find('#item_total').val(total_item.toFixed(2));
            total = total + total_item;
        }else{
            total_item = qty*price_pack;
            $(this).find('#item_total').val(total_item.toFixed(2));
            total = total + total_item;
        }


    });
    total_test = $(".product-grand-total").val(total.toFixed(2));
}

function orderParser(order) {
    return {
        id : order.id,
        date : order.employee_name,
        orderNo : order.employee_name,
        cost : parseInt(order.employee_salary)
    }
}

function productParser(product) {
    return {
        id : product.id,
        name : product.employee_name,
        unit : product.employee_name,
        price : product.employee_name
    }
}

function productDropParser(product) {
    return {
        id : product.id,
        name : product.title
    }
}

//To enable bootstrap tooltip globally
// $(function () {
//     $('[data-toggle="tooltip"]').tooltip()
// });