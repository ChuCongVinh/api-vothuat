<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');

// TẠM THỜI BỎ QUA KIỂM TRA BẢO MẬT ĐỂ TEST
$to = $_POST['email'];
$newPass = $_POST['newpass'];
$username = $_POST['username'];
$fullname = $_POST['fullname'];

if (!$to) {
    die(json_encode(['success' => false, 'message' => 'Không nhận được dữ liệu POST']));
}

$subject = "Khoi phuc mat khau - CLB Karate Tri Duc";
$message = "<html><body><h3>Xin chao $fullname,</h3><p>Tai khoan: <b>$username</b></p><p>Mat khau moi: <b style='color:red;'>$newPass</b></p></body></html>";

$headers = "MIME-Version: 1.0\r\nContent-type:text/html;charset=UTF-8\r\nFrom: CLB Karate Tri Duc <noreply@nangkhieutriduc.com>";

if(mail($to, $subject, $message, $headers)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Hosting dang chan ham mail()']);
}
?>