from datetime import datetime
from sql_connection import get_sql_connection



def insert_restock(connection, restocks):
    cursor = connection.cursor()

    restocks_query = ("INSERT INTO restock "
                   "( total, date_time)"
                   "VALUES ( %s, %s)")
    restocks_data = (restocks['grand_total'], datetime.now())

    cursor.execute(restocks_query, restocks_data)
    restocks_id = cursor.lastrowid

    restocks_details_query = ("INSERT INTO restock_details "
                           "(restock_id, product_id, quantity, total_price)"
                           "VALUES (%s, %s, %s, %s)")

    restocks_details_data = []
    for restocks_detail_record in restocks['restock_details']:
        restocks_details_data.append([
            restocks_id,
            int(restocks_detail_record['product_id']),
            float(restocks_detail_record['quantity']),
            float(restocks_detail_record['total_price'])
        ])
        if restocks_detail_record['piece']:
            # we need one piece
            get_product_query = (
                "SELECT quantity_available,quantity_per_pack FROM grocery_store.products where (products.product_id = %s)")
            get_product_data = (int(restocks_detail_record['product_id']),)
            cursor.execute(get_product_query, get_product_data)
            quantity = []
            for quantity_available, quantity_per_pack in cursor:
                quantity.append({
                    'quantity_available': quantity_available,
                    'quantity_per_pack': quantity_per_pack,
                })
            modify_quantity_query = ("UPDATE `grocery_store`.`products` "
                                     "SET quantity_available = %s "
                                     "WHERE (product_id = %s)")
            modify_quantity_data = (int(quantity[0]['quantity_available']) + int(restocks_detail_record['quantity']),
                                    int(restocks_detail_record['product_id']))
            print(modify_quantity_data)
            cursor.execute(modify_quantity_query, modify_quantity_data)
        else:
            get_product_query = (
                "SELECT quantity_available,quantity_per_pack FROM grocery_store.products where (products.product_id = %s)")
            get_product_data = (int(restocks_detail_record['product_id']),)
            cursor.execute(get_product_query, get_product_data)
            quantity = []
            for quantity_available, quantity_per_pack in cursor:
                quantity.append({
                    'quantity_available': quantity_available,
                    'quantity_per_pack': quantity_per_pack,
                })
            modify_quantity_query = ("UPDATE `grocery_store`.`products` "
                                     "SET quantity_available = %s "
                                     "WHERE (product_id = %s)")
            modify_quantity_data = (int(quantity[0]['quantity_available']) + (int(restocks_detail_record['quantity'])* int(quantity[0]['quantity_per_pack'])),
                                    int(restocks_detail_record['product_id']))
            print((int(restocks_detail_record['quantity'])* int(quantity[0]['quantity_per_pack'])))
            cursor.execute(modify_quantity_query, modify_quantity_data)
    cursor.executemany(restocks_details_query, restocks_details_data)

    connection.commit()

    return restocks_id

def get_restock_details(connection, restocks_id):
    cursor = connection.cursor()
    # stopped here
    query = "SELECT restock_details.restock_id, restock_details.quantity, restock_details.total_price, " \
            "products.name, products.price_per_unit FROM restock_details LEFT JOIN products on " \
            "restock_details.product_id = products.product_id where restock_details.restock_id = %s"

    data = (restocks_id,)

    cursor.execute(query, data)

    records = []
    for (restocks_id, quantity, total_price, product_name, price_per_unit) in cursor:
        records.append({
            'restock_id': restocks_id,
            'quantity': quantity,
            'total_price': total_price,
            'product_name': product_name,
            'price_per_unit': price_per_unit
        })

    cursor.close()

    return records


def get_all_restock(connection):
    cursor = connection.cursor()
    query = ("SELECT * FROM restock")
    cursor.execute(query)
    response = []
    for (restock_id, total, dt) in cursor:
        response.append({
            'restock_id': restock_id,
            'total': total,
            'date_time': dt,
        })

    cursor.close()

    # append order details in each order
    for record in response:
        record['restock_details'] = get_restock_details(connection, record['restock_id'])

    return response