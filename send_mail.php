<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');

// LẤY DỮ LIỆU TỪ RENDER GỬI SANG
$secret = $_POST['secret'] ?? '';
$email = $_POST['email'] ?? '';
$newPass = $_POST['newpass'] ?? '';
$fullname = $_POST['fullname'] ?? '';

// KIỂM TRA KHÓA (Phải khớp 100% với server.js)
if ($secret !== "TriDucKarate@2026") {
    die(json_encode(['success' => false, 'message' => 'Khoa khong khop: ' . $secret]));
}

$subject = "Mat khau moi - Karate Tri Duc";
$message = "Xin chao $fullname. Mat khau moi cua ban la: $newPass";
$headers = "From: noreply@nangkhieutriduc.com";

if(mail($email, $subject, $message, $headers)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Hosting tu choi gui mail']);
}
?>