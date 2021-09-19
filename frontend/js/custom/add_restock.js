var productPrices = {};
var checkbox_list = [];
var product_available = {};
var product_quantity_pack = {}
var product_id_list = []
$(function () {
    //Json data by api call for order table
    $.get(productListApiUrl, function (response) {
        productPrices = {}
        checkbox_list = []
        product_available =  {}
        product_quantity_pack = {}
        if(response) {
            var options = '<option value="">--Select--</option>';
            $.each(response, function(index, product) {
                options += '<option value="'+ product.product_id +'">'+ product.name +'</option>';
                productPrices[product.product_id] = [product.price_per_unit,product.price_per_pack];
                product_available[product.product_id] = product.quantity_available;
                product_quantity_pack[product.product_id] = product.quantity_per_pack;
                product_id_list.push(product.product_id);
            });
            console.log(product_available);
            console.log(product_quantity_pack);
            $(".product-box").find("select").empty().html(options);
        }
    });
});

let counter = 1;
$("#addMoreButton").click(function () {
    var row = $(".product-box").html();
    $(".product-box-extra").append(row);
    $(".product-box-extra .remove-row").last().removeClass('hideit');
    $(".product-box-extra .product-price").last().text('0.0');
    $(".product-box-extra .product-price_pack").last().text('0.0');
    $(".product-box-extra .product-qty").last().val('1');
    $(".product-box-extra .product-total").last().text('0.0');
});

$(document).on("click", ".remove-row", function (){
    $(this).closest('.row').remove();
    calculateValue();
});

$(document).on("change", ".cart-product", function (){
    var product_id = $(this).val();
    var price_unit = productPrices[product_id][0];
    var price_pack = productPrices[product_id][1];
    $(this).closest('.row').find('#product_price').val(price_unit);
    $(this).closest('.row').find('#product_price_pack').val(price_pack);
    $(this).closest('.row').find('#product_id').val(product_id);
    calculateValue();
}

);

$(document).on("change", ".product-id", function (){
    console.log(product_id);
    console.log(product_id_list);
    var product_id = $(this).val();
    var price_unit = productPrices[product_id][0];
    var price_pack = productPrices[product_id][1];
    var select_pos = 0
    var sel =$(this).closest('.row').find('#product');
    for (let i = 0; i < product_id_list.length; i++) {
            if(product_id==product_id_list[i]){
                select_pos=i;
            }
    }
    sel.prop('selectedIndex', select_pos+1);
    $(this).closest('.row').find('#product_price').val(price_unit);
    $(this).closest('.row').find('#product_price_pack').val(price_pack);
    $(this).closest('.row').find('#product_id').val(product_id);
    calculateValue();
});









$(document).on("click", ".form-check-input", function (){
    calculateValue();
}
);


$(document).on("change", ".product-qty", function (e){
    calculateValue();
});

$("#saveRestock").on("click", function(){
var allow = true;
checkbox_list = []
    $(".product-item").each(function( index ) {
        var checkbox = $(this).closest('.row').find('#buy_type');
        checkbox_list.push(checkbox.prop("checked"));
    });
    var formData = $("form").serializeArray();
    var requestPayload = {
        total: null,
        restock_details: []
    };
    for(var i=0;i<formData.length;++i) {
        var element = formData[i];
        var lastElement = null;
        switch(element.name) {
            case 'product_grand_total':
                requestPayload.grand_total = element.value;
                break;
            case 'product':
                requestPayload.restock_details.push({
                    product_id: element.value,
                    quantity: null,
                    total_price: null
                });
                break;
            case 'qty':
                lastElement = requestPayload.restock_details[requestPayload.restock_details.length-1];
                lastElement.quantity = element.value
                break;
            case 'item_total':
                lastElement = requestPayload.restock_details[requestPayload.restock_details.length-1];
                lastElement.total_price = element.value
                break;

        }
    }
    for(var i=0;i<checkbox_list.length-1;++i){
        requestPayload.restock_details[i].piece = checkbox_list[i];
        var product_id_in_box = requestPayload.restock_details[i].product_id;
        var quantity_in_box = requestPayload.restock_details[i].quantity;
        console.log(requestPayload.restock_details[i]);
        console.log(checkbox_list[i]);
    }
    console.log(requestPayload);
        callApi("POST", restockSaveApiUrl, {
        'data': JSON.stringify(requestPayload)
    });

});