Backend settings:
1. Download MySQL and use the provided SQL statements(in file `Group8_insert_sql.txt`) to create the database and tables, and insert data.

2. Open the project code file `demo` using an IDE (such as IntelliJ IDEA). The code uses Java 17. If you need to change the Java version, modify it in the `pom.xml` file as follows:
```
<properties>
    <java.version>(Enter your Java version number)</java.version>
</properties>
```
Also, update the versions of other dependencies to ensure compatibility, and then re-import the dependencies using Maven.

3. Modify your MySQL connection information in `src/main/resources/application.yml`, including `username`, `password`, and `url`.

4. Start the backend Java project code under `src/main/java/com/hkbu/commerce/CommerceApplication.java`.

Frontend settings:
1. Update `SERVER_URL` in `assets/js/config.js` to your backend ip address. If you are running a 
    local server, use 
    >localhost:8080/commerce/  
or  
    >127.0.0.1:8080/commerce/

2. Double click `login.html` to start the program. Use customerId '6' and pwd 'cust1pass' as a test
    example. You are strongly recommended to use **Chrome**.

Our program features includes:
1. User login 
2. View all products
3. View products by tags or vendors
4. Add a vendor to DB
5. A vendor add a product to DB
6. Cart functions: add to cart, delete from cart and modify your cart
7. Checkout and purchase
8. View your all history orders in your account page
9. Delete or add existing product before shipping
10. Check status of orders