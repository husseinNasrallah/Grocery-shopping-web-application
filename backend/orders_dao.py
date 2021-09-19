from datetime import datetime
from sql_connection import get_sql_connection


def insert_order(connection, order):
    cursor = connection.cursor()

    order_query = ("INSERT INTO orders "
                   "( total, date_time)"
                   "VALUES ( %s, %s)")
    order_data = (order['grand_total'], datetime.now())

    cursor.execute(order_query, order_data)
    order_id = cursor.lastrowid

    order_details_query = ("INSERT INTO order_details "
                           "(order_id, product_id, quantity, total_price)"
                           "VALUES (%s, %s, %s, %s)")

    order_details_data = []
    for order_detail_record in order['order_details']:
        order_details_data.append([
            order_id,
            int(order_detail_record['product_id']),
            float(order_detail_record['quantity']),
            float(order_detail_record['total_price'])
        ])
        if order_detail_record['piece']:
            # we need one piece
            get_product_query = (
                "SELECT quantity_available,quantity_per_pack FROM grocery_store.products where (products.product_id = %s)")
            get_product_data = (int(order_detail_record['product_id']),)
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
            modify_quantity_data = (int(quantity[0]['quantity_available']) - int(order_detail_record['quantity']),
                                    int(order_detail_record['product_id']))
            print(modify_quantity_data)
            cursor.execute(modify_quantity_query, modify_quantity_data)
        else:
            get_product_query = (
                "SELECT quantity_available,quantity_per_pack FROM grocery_store.products where (products.product_id = %s)")
            get_product_data = (int(order_detail_record['product_id']),)
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
            modify_quantity_data = (int(quantity[0]['quantity_available']) - (int(order_detail_record['quantity'])* int(quantity[0]['quantity_per_pack'])),
                                    int(order_detail_record['product_id']))
            print(modify_quantity_data)
            cursor.execute(modify_quantity_query, modify_quantity_data)
    cursor.executemany(order_details_query, order_details_data)

    connection.commit()

    return order_id


def get_order_details(connection, order_id):
    cursor = connection.cursor()

    query = "SELECT order_details.order_id, order_details.quantity, order_details.total_price, " \
            "products.name, products.price_per_unit FROM order_details LEFT JOIN products on " \
            "order_details.product_id = products.product_id where order_details.order_id = %s"

    data = (order_id,)

    cursor.execute(query, data)

    records = []
    for (order_id, quantity, total_price, product_name, price_per_unit) in cursor:
        records.append({
            'order_id': order_id,
            'quantity': quantity,
            'total_price': total_price,
            'product_name': product_name,
            'price_per_unit': price_per_unit
        })

    cursor.close()

    return records


def get_all_orders(connection):
    cursor = connection.cursor()
    query = ("SELECT * FROM orders")
    cursor.execute(query)
    response = []
    for (order_id, total, dt) in cursor:
        response.append({
            'order_id': order_id,
            'total': total,
            'date_time': dt,
        })

    cursor.close()

    # append order details in each order
    for record in response:
        record['order_details'] = get_order_details(connection, record['order_id'])

    return response


if __name__ == '__main__':
    connection = get_sql_connection()
    print(get_all_orders(connection))
