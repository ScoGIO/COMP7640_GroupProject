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
$user_ID = $_POST['user_ID'];
$vendor_name = $_POST['vendor_name'];
$geographical_presence = $_POST['geographical_presence'];

// 准备 SQL 语句
$sql = "INSERT INTO Vendor (user_ID, vendor_name, geographical_presence) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iss", $user_ID, $vendor_name, $geographical_presence);

// 执行插入
if ($stmt->execute()) {
    $vendor_ID = $stmt->insert_id;
    $stmt->close();
    $conn->close();
    
    // 重定向并附加成功标识
    header("Location: addVendor.html?vendor_ID=" . urlencode($vendor_ID) 
	. "&user_ID=" . urlencode($user_ID)
    . "&vendor_name=" . urlencode($vendor_name)
    . "&geographical_presence=" . urlencode($geographical_presence)
	. "&success=1");
    exit();
} else {
    $stmt->close();
    $conn->close();
    echo '<script>alert("Database failed：' . $stmt->error . '"); history.back();</script>';
    exit();
}
?>