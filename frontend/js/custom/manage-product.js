var productModal = $("#productModal");
var editModal = $("#editModal");
var editid = 0;
var product_id_list = []
var product_name_list = []
var product_uom_list = []
var product_price_per_unit_list = []
var product_price_per_pack_list = []
var product_quantity_available_list = []
var product_quantity_per_pack_list = []
    $(function () {

        //JSON data by API call
        $.get(productListApiUrl, function (response) {
            if(response) {
                var table = '';
                $.each(response, function(index, product) {
                    product_id_list.push(product.product_id)
                    product_name_list.push(product.name)
                    product_uom_list.push(product.uom_name)
                    product_price_per_unit_list.push(product.price_per_unit)
                    product_price_per_pack_list.push(product.price_per_pack)
                    product_quantity_available_list.push(product.quantity_available)
                    product_quantity_per_pack_list.push(product.quantity_per_pack)
                    table +=
                        '<tr data-id="'+ product.product_id +'" data-name="'+ product.name +'" data-unit="'+ product.uom_id +'" data-price="'+ product.price_per_unit +'" data-price_pack="'+ product.price_per_pack +'" data-quantity_per_pack="'+ product.quantity_per_pack+'">' +
                        '<td>'+ product.product_id +'</td>'+
                        '<td>'+ product.name +'</td>'+
                        '<td>'+ product.uom_name +'</td>'+
                        '<td>'+ product.price_per_unit +'</td>'+
                        '<td>'+ product.price_per_pack +'</td>'+
                        '<td>'+ product.quantity_available +'</td>'+
                        '<td>'+ product.quantity_per_pack +'</td>'+
                        '<td><span class="btn btn-xs btn-danger delete-product">Delete</span>'
                         +'<button type="button" class="btn btn-xs btn-danger edit-product" data-toggle="modal" data-target="#editModal">Edit</button>'
                        +'</td>'
                        +'</tr>'

                        ;

                });
                $("table").find('tbody').empty().html(table);
            }
        });
    });

$(document).on("change", ".search", function (){
    search_id = document.getElementById("search").value;
    console.log(search_id)
    for (let i = 0; i < product_id_list.length; i++) {
        if(search_id==product_id_list[i]){
         var table = '';
            table =
                        '<tr data-id="'+ product_id_list[i] +'" data-name="'+ product_name_list[i] +'" data-unit="'+ product_uom_list[i] +'" data-price="'+ product_price_per_unit_list[i] +'" data-price_pack="'+ product_price_per_pack_list[i] +'" data-quantity_per_pack="'+ product_quantity_per_pack_list[i]+'">' +
                        '<td>'+ product_id_list[i] +'</td>'+
                        '<td>'+ product_name_list[i] +'</td>'+
                        '<td>'+  product_uom_list[i] +'</td>'+
                        '<td>'+ product_price_per_unit_list[i] +'</td>'+
                        '<td>'+ product_price_per_pack_list[i] +'</td>'+
                        '<td>'+ product_quantity_available_list[i] +'</td>'+
                        '<td>'+ product_quantity_per_pack_list[i] +'</td>'+
                        '<td><span class="btn btn-xs btn-danger delete-product">Delete</span>'
                         +'<button type="button" class="btn btn-xs btn-danger edit-product" data-toggle="modal" data-target="#editModal">Edit</button>'
                        +'</td>'
                        +'</tr>'
                        ;
            $("table").find('tbody').empty().html(table);

         break;
        }
    }
});



    // Save Product
    $("#saveProduct").on("click", function () {
        // If we found id value in form then update product detail
        var data = $("#productForm").serializeArray();
        var requestPayload = {
            product_id: null,
            product_name: null,
            uom_id: null,
            price_per_unit: null,
            price_per_pack: null,
            quantity_per_pack: null,
            quantity_available: 0
        };
        for (var i=0;i<data.length;++i) {
            var element = data[i];
            switch(element.name) {
                case 'product_id':
                    requestPayload.product_id = element.value;
                    break;
                case 'name':
                    requestPayload.product_name = element.value;
                    break;
                case 'uoms':
                    requestPayload.uom_id = element.value;
                    break;
                case 'price':
                    requestPayload.price_per_unit = element.value;
                    break;
                case 'price_pack':
                    requestPayload.price_per_pack = element.value;
                    break;
                case 'quantity_per_pack':
                requestPayload.quantity_per_pack = element.value;
                    break;
            }
        }
        callApi("POST", productSaveApiUrl, {
            'data': JSON.stringify(requestPayload)
        });
    });
    // delete
    $(document).on("click", ".delete-product", function (){
        var tr = $(this).closest('tr');
        var data = {
            product_id : tr.data('id')
        };
        var isDelete = confirm("Are you sure to delete "+ tr.data('name') +" item?");
        if (isDelete) {
            callApi("POST", productDeleteApiUrl, data);
        }
    });
    // edit
    $(document).on("click", ".edit-product", function (){
        var tr = $(this).closest('tr');
        editid = tr.data('id');
        document.getElementById("editproduct_id").value = editid;
        document.getElementById("editname").value = tr.data('name');
        document.getElementById("edituoms").value = tr.data('unit');
        document.getElementById("editprice").value = tr.data('price');
        document.getElementById("editprice_pack").value = tr.data('price_pack');
        document.getElementById("quantity_per_pack_edit").value = tr.data('quantity_per_pack');

    });

    $("#editProduct").on("click", function (){

        // If we found id value in form then update product detail
        var data = $("#editForm").serializeArray();
        var requestPayload = {
            product_id_new: null,
            product_name: null,
            uom_id: null,
            price_per_unit: null,
            price_per_pack: null,
            quantity_per_pack: null,
            quantity_available: 0

        };
        for (var i=0;i<data.length;++i) {
            var element = data[i];
            switch(element.name) {
                case 'editproduct_id':
                    requestPayload.product_id_new = element.value;
                    break;
                case 'editname':
                    requestPayload.product_name = element.value;
                    break;
                case 'edituoms':
                    requestPayload.uom_id = element.value;
                    break;
                case 'editprice':
                    requestPayload.price_per_unit = element.value;
                    break;
                case 'editprice_pack':
                    requestPayload.price_per_pack = element.value;
                    break;
                case 'quantity_per_pack_edit':
                    requestPayload.quantity_per_pack = element.value;
                    break;
            }
        }
        requestPayload["product_id_old"]=editid;
        callApi("POST", productEditApiUrl, {
            'data': JSON.stringify(requestPayload)
        });
    });

        productModal.on('hide.bs.modal', function(){
        $("#id").val('0');
        $("#name, #unit, #price, #price_pack, #quantity_per_pack").val('');
        productModal.find('.modal-title').text('Add New Product');
    });

        productModal.on('show.bs.modal', function(){
        //JSON data by API call
        $.get(uomListApiUrl, function (response) {
            if(response) {
                var options = '<option value="">--Select--</option>';
                $.each(response, function(index, uom) {
                    options += '<option value="'+ uom.uom_id +'">'+ uom.uom_name +'</option>';
                });
                $("#uoms").empty().html(options);
            }
        });
    });
        editModal.on('hide.bs.modal', function(){
        $("#editid").val('0');
        $("#editname, #unit, #editprice, #editprice_pack, #quantity_per_pack_edit").val('');
        editModal.find('.modal-title').text('Edit Product');
    });

        editModal.on('show.bs.modal', function(){
        //JSON data by API call
        $.get(uomListApiUrl, function (response) {
            if(response) {
                var options = '<option value="">--Select--</option>';
                $.each(response, function(index, uom) {
                    options += '<option value="'+ uom.uom_id +'">'+ uom.uom_name +'</option>';
                });
                $("#edituoms").empty().html(options);
            }
        });
    });






