<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'Exception.php';
require 'PHPMailer.php';
require 'SMTP.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');

// 1. Kiểm tra Secret (Giữ nguyên cho khớp Render)
$secret = $_POST['secret'] ?? '';
if ($secret !== "TriDucKarate@2026") {
    die(json_encode(['success' => false, 'message' => 'Lỗi bảo mật']));
}

$mail = new PHPMailer(true);

try {
    // 2. Cấu hình Server Gmail
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'nangkhieutriduc@gmail.com'; // Nhập Gmail của bạn
    $mail->Password   = 'qquenshclhipdskv';      // Nhập mã 16 ký tự ở Bước 2
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;
    $mail->CharSet    = 'UTF-8';

    // 3. Người gửi & Người nhận
    $mail->setFrom('nangkhieutriduc@gmail.com', 'CLB Karate Tri Duc');
    $mail->addAddress($_POST['email']); 

    // 4. Nội dung Email
    $mail->isHTML(true);
    $mail->Subject = 'Khôi phục mật khẩu - Karate Trí Đức';
    $mail->Body    = "Chào <b>".$_POST['fullname']."</b>, mật khẩu mới của bạn là: <b style='color:red;'>".$_POST['newpass']."</b>";

    $mail->send();
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => "Lỗi gửi mail: {$mail->ErrorInfo}"]);
}
?>