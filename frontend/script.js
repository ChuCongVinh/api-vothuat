const API_URL = 'https://api-vothuat.onrender.com/api';

// 1. Hàm chạy ngay khi web tải xong
document.addEventListener('DOMContentLoaded', () => {
    fetchLocations();
});

// 2. Hàm gọi API lấy danh sách địa điểm
async function fetchLocations() {
    try {
        const response = await fetch(`${API_URL}/locations`);
        const locations = await response.json();
        
        renderLocations(locations);
        fillLocationOptions(locations); // Điền vào dropdown trong form đăng ký
    } catch (error) {
        console.error('Lỗi kết nối Backend:', error);
        document.getElementById('location-list').innerHTML = '<p style="color:red">Không thể kết nối đến máy chủ!</p>';
    }
}

// 3. Hàm hiển thị dữ liệu lên HTML (DOM Manipulation)
function renderLocations(data) {
    const listContainer = document.getElementById('location-list');
    listContainer.innerHTML = ''; // Xóa chữ "Đang tải..."

    data.forEach(item => {
        // Tạo HTML cho từng thẻ địa điểm
        const card = `
            <div class="location-card">
                <h3>${item.name}</h3>
                <p><i class="fa-solid fa-location-dot"></i> ${item.address}</p>
                <p><i class="fa-solid fa-user"></i> HLV: ${item.coach}</p>
                <p><i class="fa-solid fa-clock"></i> ${item.time}</p>
                <a href="tel:${item.hotline}" class="hotline">Hotline: ${item.hotline}</a>
            </div>
        `;
        listContainer.innerHTML += card;
    });
}

// 4. Hàm điền option vào thẻ Select trong Modal
function fillLocationOptions(data) {
    const select = document.getElementById('userLocation');
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.name;
        select.appendChild(option);
    });
}

// 5. Xử lý Form Đăng ký gửi về Backend
document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const name = document.getElementById('userName').value;
    const phone = document.getElementById('userPhone').value;
    const locationId = document.getElementById('userLocation').value;
    const subject = document.getElementById('userSubject').value; // <--- Lấy thêm cái này

    try {
        // --- SỬA QUAN TRỌNG: GỌI ĐÚNG API /api/register (TRÊN RENDER) ---
        const res = await fetch('https://api-vothuat.onrender.com/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phone, locationId, subject }) // <--- Gửi thêm subject
        });
        const result = await res.json();
        alert(result.message); // Thông báo thành công
        closeModal();
    } catch (error) {
        alert("Có lỗi xảy ra khi gửi đơn!");
    }
    
});

// --- CÁC HÀM TIỆN ÍCH UI ---
function toggleMenu() {
    document.getElementById('menuList').classList.toggle('active');
}

function scrollToLocations() {
    document.getElementById('locations').scrollIntoView({ behavior: 'smooth' });
}

function openModal() {
    document.getElementById('registerModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('registerModal').style.display = 'none';
}

// Đóng modal khi click ra ngoài
window.onclick = function(event) {
    const modal = document.getElementById('registerModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
// =========================================
// DATA & LOGIC CHO GALLERY MODAL
// =========================================

const extendedData = {
    'info1': `
        <p>Tham gia lớp học của chúng tôi, học viên không chỉ học được kỹ thuật đấm, đá, đỡ gạt mà còn được rèn luyện tinh thần thép. Đối diện với những khó khăn trên sân tập chính là lúc bản lĩnh được bộc lộ rõ nhất.</p>
        <p><b>Lợi ích:</b></p>
        <ul>
            <li>Vượt qua sự nhút nhát, tự ti.</li>
            <li>Tăng cường khả năng phản xạ và bảo vệ bản thân.</li>
            <li>Hình thành ý chí kiên định trước mọi thử thách.</li>
        </ul>
    `,
    'info2': `
        <p>Võ thuật không thể thiếu kỷ luật. Tại CLB Trí Đức, chúng tôi đề cao sự tôn trọng: tôn trọng sư phụ, tôn trọng đồng môn và tôn trọng chính bản thân mình.</p>
        <p>Mỗi buổi tập đều tuân thủ nghiêm ngặt quy tắc khởi động, luyện tập và giãn cơ, giúp học viên rèn thói quen nề nếp áp dụng vào cả cuộc sống và học tập.</p>
    `,
    'info3': `
        <p>Lớp học dành riêng cho trẻ em được thiết kế dựa trên sự thấu hiểu tâm lý lứa tuổi. Các bài tập được lồng ghép trò chơi vận động giúp các bé phát triển chiều cao, chống béo phì và rèn luyện tư duy nhanh nhạy.</p>
        <p>Nhiều tài năng nhí từ CLB đã tham gia và đạt thành tích cao tại các giải đấu phong trào và chuyên nghiệp.</p>
    `,
    'info4': `
        <p>Võ thuật bắt nguồn từ sự chuẩn xác. Từng cú đấm (Tsuki), cú đá (Geri) hay kỹ thuật đỡ gạt (Uke) đều được các huấn luyện viên hướng dẫn tỉ mỉ từng góc độ, nhịp thở và cách phát lực.</p>
        <p>Sự lặp đi lặp lại hàng ngàn lần một kỹ thuật cơ bản (Kihon) và các bài quyền (Kata) chính là chìa khóa để đạt được sự hoàn mỹ và phản xạ vô điều kiện trong thực chiến.</p>
    `,
    'info5': `
        <p>Đối kháng (Kumite) không chỉ là sự va chạm thể xác mà là cuộc đấu của trí tuệ và phản xạ. Học viên được trang bị đầy đủ giáp bảo hộ và rèn luyện trong môi trường an toàn, chuyên nghiệp.</p>
        <p><b>Kỹ năng đạt được:</b></p>
        <ul>
            <li>Kiểm soát cự ly và nhịp độ trận đấu.</li>
            <li>Phát triển kỹ năng tự vệ thực tế trong các tình huống nguy hiểm.</li>
            <li>Tăng cường sự tự tin khi đối mặt với áp lực.</li>
        </ul>
    `,
    'info6': `
        <p>Trên sân tập, không ai bị bỏ lại phía sau. Một võ sinh giỏi không chỉ biết đánh bại đối thủ mà còn biết nâng đỡ đồng đội của mình.</p>
        <p>CLB Trí Đức xây dựng một môi trường hòa đồng, đoàn kết, nơi các anh chị đai cao hướng dẫn đàn em đai thấp, tạo nên một gia đình võ thuật thực thụ, gắn kết và chia sẻ buồn vui cùng nhau.</p>
    `,
    'info7': `
        <p>Không có một ý chí vững vàng nào tồn tại trong một cơ thể yếu ớt. Thể lực là nền tảng của mọi môn thể thao, đặc biệt là võ thuật.</p>
        <p>Các bài tập ép dẻo, rèn luyện sức bền tim mạch (cardio), cơ bắp và độ lỳ đòn được lồng ghép khoa học vào mỗi buổi tập, giúp học viên đánh thức giới hạn tiềm ẩn của bản thân và sở hữu một thể trạng sung mãn nhất.</p>
    `,
    'info8': `
        <p>Những giọt mồ hôi, nước mắt và cả máu trên sàn tập đều sẽ được đền đáp xứng đáng trên bục vinh quang. CLB thường xuyên tổ chức và tạo điều kiện cho học viên cọ xát tại các giải đấu phong trào lẫn chuyên nghiệp.</p>
        <p>Chiến thắng huy chương là quan trọng, nhưng chiến thắng chính sự lười biếng và nỗi sợ hãi của bản thân mới là tấm huy chương vàng danh giá nhất mà chúng tôi hướng tới.</p>
    `,
    'info9': `
        <p>Karate không chỉ là một môn thể thao, nó là một lối sống (Đạo - Do). Khi niềm đam mê đủ lớn, võ thuật sẽ ngấm vào máu và trở thành nguồn năng lượng tích cực theo bạn suốt cả cuộc đời.</p>
        <p>Dù bạn là sinh viên, nhân viên văn phòng hay trẻ nhỏ, sân tập luôn mở rộng cửa chào đón bạn đến để giải tỏa căng thẳng, tìm lại sự cân bằng và cháy hết mình với đam mê.</p>
    `
};

let currentImgScale = 1;

function openGalleryModal(imgSrc, title, shortDesc, infoKey) {
    const modal = document.getElementById('galleryDetailModal');
    modal.style.display = 'block';
    
    // Gán dữ liệu cơ bản
    document.getElementById('modalGalleryImg').src = imgSrc;
    document.getElementById('modalGalleryTitle').innerText = title;
    document.getElementById('modalGalleryShort').innerText = shortDesc;
    
    // Gán dữ liệu HTML dài từ data object
    let longContent = extendedData[infoKey] ? extendedData[infoKey] : "<p>Đang cập nhật thông tin...</p>";
    document.getElementById('modalGalleryLong').innerHTML = longContent;

    resetZoomGallery(); // Đặt lại zoom về mặc định
    document.body.style.overflow = 'hidden'; // Khóa cuộn trang nền
}

function closeGalleryModal() {
    document.getElementById('galleryDetailModal').style.display = 'none';
    document.body.style.overflow = 'auto'; // Mở khóa cuộn trang nền
}

function zoomGallery(step) {
    const img = document.getElementById('modalGalleryImg');
    currentImgScale += step;
    
    // Giới hạn mức độ zoom (nhỏ nhất 0.5x, lớn nhất 4x)
    if(currentImgScale < 0.5) currentImgScale = 0.5;
    if(currentImgScale > 4) currentImgScale = 4;
    
    img.style.transform = `scale(${currentImgScale})`;
}

function resetZoomGallery() {
    currentImgScale = 1;
    document.getElementById('modalGalleryImg').style.transform = `scale(1)`;
}