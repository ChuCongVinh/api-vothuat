<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8'); // Thêm charset ở đây

// Chìa khóa bảo mật để không ai gửi bậy bạ
$secret = "TriDucKarate@2026";

if (!isset($_POST['secret']) || $_POST['secret'] !== $secret) {
    die(json_encode(['success' => false, 'message' => 'Lỗi bảo mật']));
}

$to = $_POST['email'];
$newPass = $_POST['newpass'];
$username = $_POST['username'];
$fullname = $_POST['fullname'];

$subject = "Khoi phuc mat khau - CLB Karate Tri Duc";
$message = "
<html>
<body>
    <h3>Xin chao $fullname,</h3>
    <p>Tai khoan cua ban la: <b>$username</b></p>
    <p>Mat khau moi cua ban la: <b style='color:red; font-size:18px;'>$newPass</b></p>
    <p>Vui long dang nhap va doi lai mat khau nhe!</p>
</body>
</html>
";

$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= 'From: <noreply@nangkhieutriduc.com>' . "\r\n";

if(mail($to, $subject, $message, $headers)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'May chu tu choi gui mail']);
}
?>