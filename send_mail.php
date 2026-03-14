<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');

$secret_he_thong = "TriDucKarate@2026";

// Lấy chìa khóa từ phía Render gửi sang
$secret_nhan_duoc = isset($_POST['secret']) ? $_POST['secret'] : 'KHÔNG CÓ KHÓA';

// KIỂM TRA BẢO MẬT
if ($secret_nhan_duoc !== $secret_he_thong) {
    echo json_encode([
        'success' => false, 
        'message' => 'Lỗi bảo mật. Khóa nhận được là: ' . $secret_nhan_duoc 
    ]);
    exit;
}

// --- Nếu khóa đúng thì mới chạy tiếp đoạn dưới ---
$to = $_POST['email'];
$newPass = $_POST['newpass'];
$username = $_POST['username'];
$fullname = $_POST['fullname'];

$subject = "Khoi phuc mat khau - CLB Karate Tri Duc";
$message = "<html><body><h3>Xin chao $fullname,</h3><p>Tai khoan: <b>$username</b></p><p>Mat khau moi: <b style='color:red;'>$newPass</b></p></body></html>";

$headers = "MIME-Version: 1.0\r\nContent-type:text/html;charset=UTF-8\r\nFrom: <noreply@nangkhieutriduc.com>";

if(mail($to, $subject, $message, $headers)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Hosting chặn hàm gửi mail']);
}
?>