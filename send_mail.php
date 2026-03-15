<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');

// Chìa khóa hệ thống
$secret_key = "TriDucKarate@2026";

// Lấy chìa khóa từ Render gửi sang (xem có bị trống không)
$secret_received = $_POST['secret'] ?? 'TRỐNG KHÔNG';

if ($secret_received !== $secret_key) {
    die(json_encode([
        'success' => false, 
        'message' => 'Lỗi bảo mật. Khóa nhận được là: ' . $secret_received
    ]));
}

$to = $_POST['email'];
$newPass = $_POST['newpass'];
$fullname = $_POST['fullname'];

$subject = "=?UTF-8?B?".base64_encode("Mật khẩu mới - Karate Trí Đức")."?=";
$message = "Xin chào $fullname,\n\nMật khẩu mới của bạn là: $newPass\n\nVui lòng đăng nhập lại.";

// Thêm đầy đủ thông tin gửi để Hosting không chặn
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/plain;charset=UTF-8" . "\r\n";
$headers .= "From: CLB Karate Tri Duc <noreply@nangkhieutriduc.com>" . "\r\n";
$headers .= "Reply-To: noreply@nangkhieutriduc.com" . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

if(mail($to, $subject, $message, $headers)) {
    echo json_encode(['success' => true]);
} else {
    // Đoạn này giúp mình xem lỗi cụ thể là gì
    $error = error_get_last();
    echo json_encode([
        'success' => false, 
        'message' => 'Hosting chặn hàm mail. Chi tiết: ' . ($error['message'] ?? 'Không có thông báo lỗi')
    ]);
}