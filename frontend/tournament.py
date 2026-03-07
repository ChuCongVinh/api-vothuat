import pandas as pd
import random
import time

def load_participants(file_path):
    try:
        # Đọc file Excel
        df = pd.read_excel(file_path)
        # Lấy danh sách từ cột 'Name' và loại bỏ dòng trống
        names = df['Name'].dropna().tolist()
        return names
    except Exception as e:
        print(f"Lỗi đọc file: {e}")
        return []

def get_winner_input(p1, p2):
    """Hàm nhập kết quả trận đấu"""
    while True:
        print(f"\n⚔️  TRẬN ĐẤU: [1] {p1}  vs  [2] {p2}")
        choice = input("👉 Chọn người thắng (nhập 1 hoặc 2): ")
        if choice == '1':
            return p1
        elif choice == '2':
            return p2
        else:
            print("❌ Vui lòng chỉ nhập 1 hoặc 2!")

def play_round(participants, round_num):
    print(f"\n{'='*40}")
    print(f"🏆 VÒNG {round_num} - Số người tham gia: {len(participants)}")
    print(f"{'='*40}")
    
    winners = []
    # Tạo danh sách các cặp đấu
    # Dùng range bước nhảy 2 để lấy cặp (0,1), (2,3)...
    for i in range(0, len(participants), 2):
        p1 = participants[i]
        
        # Kiểm tra xem có người cặp cùng không (trường hợp lẻ người)
        if i + 1 < len(participants):
            p2 = participants[i+1]
            winner = get_winner_input(p1, p2)
            print(f"✅ Người thắng: {winner}")
            winners.append(winner)
        else:
            # Trường hợp lẻ người, người cuối cùng được đặc cách vào vòng sau
            print(f"\n🔔 {p1} không có đối thủ -> Được đặc cách vào vòng sau!")
            winners.append(p1)
            
    return winners

def main():
    file_path = 'players.xlsx' # Tên file Excel của bạn
    
    print("ang đọc danh sách từ Excel...")
    participants = load_participants(file_path)
    
    if not participants:
        print("Không tìm thấy danh sách người chơi!")
        return

    print(f"Đã tìm thấy {len(participants)} người chơi.")
    
    # Xáo trộn danh sách ngẫu nhiên
    print("Đang bốc thăm ngẫu nhiên...")
    random.shuffle(participants)
    time.sleep(1)
    
    round_count = 1
    
    # Vòng lặp chính: Chạy cho đến khi chỉ còn 1 người
    while len(participants) > 1:
        participants = play_round(participants, round_count)
        round_count += 1
        
        if len(participants) > 1:
            input("\nNhấn Enter để tiếp tục vòng sau...")

    # Công bố người vô địch
    print(f"\n{'*'*50}")
    print(f"👑  NHÀ VÔ ĐỊCH LÀ: {participants[0].upper()}  👑")
    print(f"{'*'*50}")

if __name__ == "__main__":
    main()