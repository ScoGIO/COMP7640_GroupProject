<?php
// 数据库连接设置
$host = 'localhost';
$dbname = 'phpmyadmin';
$username = 'root';
$password = 'Xgv587666';

// 创建连接
$conn = new mysqli('localhost', 'root', '', 'phpmyadmin');

// 检查连接
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// 获取表单数据
$vendor_ID = $_POST['vendor_ID'];
$name = $_POST['name'];
$price = $_POST['price'];
$inventory = $_POST['inventory'];
//$tags = $_POST['tags'];
$tagsInput = $_POST['tags'];
$tagsArray = json_decode($tagsInput, true);

// 验证JSON有效性
if (json_last_error() !== JSON_ERROR_NONE) {
    // 返回错误标识到前端
    header("Location: addProduct.html?success=0&error=invalid_json");
    exit();
}

// 转换为JSON字符串（确保编码正确）
$tagsJson = json_encode($tagsArray, JSON_UNESCAPED_UNICODE);

// 准备 SQL 语句
$sql = "INSERT INTO product (vendor_ID, product_name, price, inventory, tags) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
//$stmt->bind_param("isdss", $vendor_ID, $name, $price, $inventory, $tags);
$stmt->bind_param("issss", $vendor_ID, $name, $price, $inventory, $tagsJson);

// 执行插入
if ($stmt->execute()) {
    $product_ID = $stmt->insert_id;
    $stmt->close();
    $conn->close();
    
    // 重定向并附加成功标识
    header("Location: addProduct.html?product_ID=" . urlencode($product_ID) 
	. "&success=1&vendor_ID=" . urlencode($vendor_ID)
    . "&name=" . urlencode($name)
    . "&price=" . urlencode($price)
    . "&inventory=" . urlencode($inventory)
    . "&tags=" . urlencode($tagsJson)
	. "&success=1");
    exit();
} else {
    $stmt->close();
    $conn->close();
    // 重定向并附加失败标识
    header("Location: addProduct.html?success=0");
    exit();
}
?>