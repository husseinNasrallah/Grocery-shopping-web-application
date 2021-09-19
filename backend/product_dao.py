from sql_connection import get_sql_connection

def get_all_products(connection):
    cursor = connection.cursor()
    query = ("select products.product_id, products.name, products.uom_id, products.price_per_unit,products.price_per_pack, uom.uom_name, "
             "products.quantity_available , products.quantity_per_pack from products inner join uom on products.uom_id=uom.uom_id ORDER BY products.name")
    cursor.execute(query)
    response = []
    for (product_id, name, uom_id, price_per_unit, price_per_pack,uom_name, quantity_available , quantity_per_pack) in cursor:
        response.append({
            'product_id': product_id,
            'name': name,
            'uom_id': uom_id,
            'price_per_unit': price_per_unit,
            'price_per_pack' : price_per_pack,
            'uom_name': uom_name,
            'quantity_available': quantity_available,
            'quantity_per_pack' : quantity_per_pack
        })
    return response

def insert_new_product(connection, product):
    cursor = connection.cursor()
    query = ("INSERT INTO products "
             "(product_id, name, uom_id, price_per_unit,price_per_pack,quantity_available,quantity_per_pack)"
             "VALUES (%s, %s, %s, %s, %s,%s,%s)")
    data = (product['product_id'], product['product_name'], product['uom_id'], product['price_per_unit'], product['price_per_pack'], product['quantity_available'], product['quantity_per_pack'])

    cursor.execute(query, data)
    connection.commit()

    return cursor.lastrowid

def edit_product(connection, product):
    cursor = connection.cursor()
    query = ("UPDATE `grocery_store`.`products` "
             "SET product_id=%s, name = %s, uom_id = %s, price_per_unit = %s, price_per_pack = %s, quantity_available = %s , quantity_per_pack = %s "
             "WHERE (product_id = %s)")
    data = (product['product_id_new'],product['product_name'], product['uom_id'], product['price_per_unit'], product['price_per_pack'], product['quantity_available'],product['quantity_per_pack'],product['product_id_old'])
    print(data)
    cursor.execute(query, data)
    connection.commit()

    return cursor.lastrowid

def delete_product(connection, product_id):
    cursor = connection.cursor()
    query = ("DELETE FROM products where product_id=" + str(product_id))
    cursor.execute(query)
    connection.commit()

    return cursor.lastrowid

if __name__ == '__main__':
    connection = get_sql_connection()
    #print(get_all_products(connection))
    #delete_product(connection,6)
