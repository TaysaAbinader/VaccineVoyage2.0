import mysql.connector

connection = mysql.connector.connect(
         host='127.0.0.1',
         port= 3306,
         database='vaccine_voyage',
         user='newuser',
         password='password',
         autocommit=True,
         collation='utf8mb4_bin'
         )

