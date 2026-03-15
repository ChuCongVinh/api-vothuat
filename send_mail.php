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

// ... đoạn code gửi mail tiếp theo giữ nguyên ...
$email = $_POST['email'];
$newPass = $_POST['newpass'];
$fullname = $_POST['fullname'];

$subject = "Khoi phuc mat khau - Karate Tri Duc";
$message = "Mat khau moi cua ban la: $newPass";
$headers = "From: noreply@nangkhieutriduc.com";

if(mail($email, $subject, $message, $headers)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Hosting chặn hàm mail()']);
}
?>