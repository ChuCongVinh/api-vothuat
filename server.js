const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend'))); 

const upload = multer({ storage: multer.memoryStorage() });

// ============================================================
// 1. KẾT NỐI DATABASE
// ============================================================
// ============================================================
// 1. KẾT NỐI DATABASE
// ============================================================
// ============================================================
// 1. KẾT NỐI DATABASE
// ============================================================
// ============================================================
// 1. KẾT NỐI DATABASE
// ============================================================
const db = mysql.createConnection({
    host: '202.92.4.66', // Đã thay bằng IP của Hosting 1Panel
    user: 'jxcjzqgbhosting_Chucongvinh2004', 
    password: 'Chucongvinh2004@', 
    database: 'jxcjzqgbhosting_nangkhieuTriDuc' 
});

db.connect((err) => {
    if (err) { console.error('❌ Lỗi MySQL:', err); return; }
    console.log('✅ Đã kết nối MySQL thành công!');
});

// ============================================================
// 2. API QUẢN LÝ CÂU LẠC BỘ (CLUBS)
// ============================================================
app.get('/api/clubs', (req, res) => {
    db.query("SELECT * FROM clubs ORDER BY created_at DESC", (err, r) => res.json(r));
});
app.post('/api/clubs', (req, res) => {
    const { name, leader, phone } = req.body;
    db.query("INSERT INTO clubs (name, leader, phone) VALUES (?, ?, ?)", [name, leader, phone], (err) => res.json({success: !err}));
});
app.put('/api/clubs/:id', (req, res) => {
    const { name, leader, phone } = req.body;
    db.query("UPDATE clubs SET name=?, leader=?, phone=? WHERE id=?", [name, leader, phone, req.params.id], (err) => res.json({success: !err}));
});
app.delete('/api/clubs/:id', (req, res) => {
    db.query("DELETE FROM clubs WHERE id=?", [req.params.id], (err) => res.json({success: !err}));
});
app.get('/api/clubs/:id/members', (req, res) => {
    db.query("SELECT * FROM users WHERE club_id = ? ORDER BY created_at DESC", [req.params.id], (err, r) => res.json(r));
});
app.get('/api/clubs/:id/funds', (req, res) => {
    db.query("SELECT * FROM club_funds WHERE club_id = ? ORDER BY created_at DESC", [req.params.id], (err, r) => res.json(r));
});
app.post('/api/funds', (req, res) => {
    const { club_id, description, amount, type } = req.body;
    const finalAmount = type === 'chi' ? -Math.abs(amount) : Math.abs(amount);
    db.query("INSERT INTO club_funds (club_id, description, amount, type) VALUES (?, ?, ?, ?)", [club_id, description, finalAmount, type], (err) => res.json({success: !err}));
});
app.delete('/api/funds/:id', (req, res) => {
    db.query("DELETE FROM club_funds WHERE id=?", [req.params.id], (err) => res.json({success: !err}));
});

// ============================================================
// 3. API QUẢN LÝ HỌC VIÊN (USERS) - [ĐÃ SỬA LỖI Ở ĐÂY]
// ============================================================
app.get('/api/users', (req, res) => {
    const sql = `SELECT u.*, c.name as club_name FROM users u LEFT JOIN clubs c ON u.club_id = c.id ORDER BY u.created_at DESC`;
    db.query(sql, (err, r) => res.json(r));
});

// API THÊM USER (Đã bổ sung level vào INSERT)
app.post('/api/users', (req, res) => {
    // 1. Lấy thêm biến 'level' từ req.body
    const { fullname, username, password, role, subject, club_id, join_date, status, note, level } = req.body; 
    
    db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
        if (results.length > 0) return res.json({ success: false, message: "Trùng username!" });
        
        // 2. Thêm 'level' vào câu lệnh SQL
        const sql = "INSERT INTO users (fullname, username, password, role, subject, club_id, join_date, status, note, level) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        // 3. Truyền giá trị vào mảng tham số
        db.query(sql, [
            fullname, 
            username, 
            password, 
            role || 'student', 
            subject || 'Karate', 
            club_id || null, 
            join_date || new Date(), 
            status || 'Chính thức', 
            note || '', 
            level || 'Đai trắng' // Mặc định Đai trắng nếu thiếu
        ], (err) => {
            if (err) {
                console.error("Lỗi thêm user:", err); // Log lỗi ra terminal để debug
                return res.status(500).json({ success: false, message: err.message });
            }
            res.json({ success: true });
        });
    });
});

// API CẬP NHẬT USER (Đã bổ sung level vào UPDATE)
app.put('/api/users/:id', (req, res) => {
    const { fullname, join_date, status, note, level, club_id } = req.body; // Lấy level
    
    const sql = `UPDATE users SET fullname = ?, join_date = ?, status = ?, note = ?, level = ?, club_id = ? WHERE id = ?`;
    
    db.query(sql, [
        fullname, 
        join_date, 
        status, 
        note, 
        level || 'Đai trắng', 
        club_id, 
        req.params.id
    ], (err) => {
        if (err) {
            console.error("Lỗi sửa user:", err);
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json({ success: true });
    });
});

app.delete('/api/users/:id', (req, res) => {
    db.query("DELETE FROM users WHERE id=?", [req.params.id], (err) => res.json({success: !err}));
});
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.query("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, results) => {
        if (results.length > 0) res.json({ success: true, role: results[0].role, fullname: results[0].fullname });
        else res.status(401).json({ success: false });
    });
});

// ============================================================
// 4. API ĐĂNG KÝ & ĐIỂM SỐ & ĐỊA ĐIỂM
// ============================================================
app.get('/api/registrations', (req, res) => { db.query(`SELECT r.*, l.name as location_name FROM registrations r LEFT JOIN locations l ON r.location_id = l.id ORDER BY r.created_at DESC`, (e,r)=>res.json(r)); });
app.post('/api/registrations', (req, res) => { const { fullname, phone, location_id, subject } = req.body; db.query("INSERT INTO registrations (fullname, phone, location_id, subject) VALUES (?, ?, ?, ?)", [fullname, phone, location_id, subject], (e)=>res.json({success:!e})); });
app.post('/api/register', (req, res) => { 
    const { name, phone, locationId, subject } = req.body; 
    db.query("INSERT INTO registrations (fullname, phone, location_id, subject) VALUES (?, ?, ?, ?)", [name, phone, locationId, subject || 'Karate'], (e)=>res.json({success:!e})); 
});
app.delete('/api/registrations/:id', (req, res) => { db.query("DELETE FROM registrations WHERE id=?", [req.params.id], (e)=>res.json({success:!e})); });

// --- ĐỊA ĐIỂM ---
app.get('/api/locations', (req, res) => { db.query("SELECT * FROM locations", (e,r) => res.json(r)); });
app.post('/api/locations', (req, res) => { db.query("INSERT INTO locations (name, address) VALUES (?, ?)", [req.body.name, req.body.address || ''], (e) => res.json({success: !e})); });
app.delete('/api/locations/:id', (req, res) => { db.query("DELETE FROM locations WHERE id=?", [req.params.id], (e) => res.json({success: !e})); });

// --- ĐIỂM THI ---
app.get('/api/scores', (req, res) => { const sql = `SELECT s.*, u.fullname, c.name as club_name FROM scores s JOIN users u ON s.user_id = u.id LEFT JOIN clubs c ON u.club_id = c.id ORDER BY s.exam_date DESC`; db.query(sql, (e,r)=>res.json(r)); });
app.post('/api/scores', (req, res) => { const { userId, subject, theory, practice, date } = req.body; db.query("INSERT INTO scores (user_id, subject, score_theory, score_practice, exam_date) VALUES (?,?,?,?,?)", [userId, subject, theory, practice, date], (e)=>res.json({success:!e})); });
app.delete('/api/scores/:id', (req, res) => { db.query("DELETE FROM scores WHERE id=?", [req.params.id], (e)=>res.json({success:!e})); });


// ============================================================
// 5. API GIẢI ĐẤU (TOURNAMENT)
// ============================================================

// A. Lấy Sơ đồ thi đấu
app.get('/api/tournament/bracket', (req, res) => {
    db.query("SELECT * FROM matches ORDER BY id ASC", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        const rounds = {};
        let champion = null;
        results.forEach(m => {
            if (!rounds[m.round - 1]) rounds[m.round - 1] = [];
            rounds[m.round - 1].push(m);
        });
        const maxRound = results.length > 0 ? Math.max(...results.map(m => m.round)) : 0;
        const finalMatch = results.find(m => m.round === maxRound);
        if(finalMatch && finalMatch.winner) champion = finalMatch.winner;
        res.json({ rounds: Object.values(rounds), champion });
    });
});

// B. Lấy chi tiết 1 trận đấu
app.get('/api/tournament/match/:id', (req, res) => {
    db.query("SELECT * FROM matches WHERE id = ?", [req.params.id], (err, result) => {
        if (err || result.length === 0) return res.status(404).send("Not Found");
        res.json(result[0]);
    });
});

// C. Bắt đầu giải đấu (Setup - TẠO TOÀN BỘ CÂY SƠ ĐỒ)
app.post('/api/tournament/start', upload.single('file'), (req, res) => {
    if (!req.file) return res.json({ success: false, message: "Chưa chọn file!" });

    try {
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

        const players = data.slice(1).map(row => {
            return { name: row[0], team: row[1] || '' }; 
        }).filter(p => p.name); 

        if (players.length < 2) {
            console.log("❌ Lỗi: File Excel có ít hơn 2 VĐV hợp lệ.");
            return res.json({ success: false, message: "Cần ít nhất 2 VĐV để tạo giải!" });
        }

        console.log(`✅ Đã đọc được ${players.length} VĐV. Đang tạo sơ đồ...`);
        players.sort(() => Math.random() - 0.5);
        
        let totalSlots = 1; while(totalSlots < players.length) totalSlots *= 2;

        const matches = [];
        
        for (let i = 0; i < totalSlots / 2; i++) {
            const p1 = players[i];
            const p2 = players[totalSlots - 1 - i];
            let winner = (!p2 && p1) ? p1.name : null;
            let status = winner ? 'finished' : 'pending';
            matches.push([p1 ? p1.name : null, p2 ? p2.name : null, p1 ? p1.team : '', p2 ? p2.team : '', 1, winner, status, 0, 0]);
        }

        let currentRoundMatches = totalSlots / 2;
        let round = 2;
        while (currentRoundMatches > 1) {
            currentRoundMatches /= 2;
            for (let j = 0; j < currentRoundMatches; j++) {
                matches.push([null, null, '', '', round, null, 'pending', 0, 0]);
            }
            round++;
        }

        db.query("TRUNCATE TABLE matches", (err) => {
            if (err) {
                console.error("Lỗi xóa DB:", err);
                return res.json({ success: false, message: "Lỗi Database" });
            }
            const sql = "INSERT INTO matches (p1, p2, team1, team2, round, winner, status, score1, score2) VALUES ?";
            db.query(sql, [matches], (err) => {
                if (err) {
                    console.error("Lỗi Insert:", err);
                    return res.json({ success: false });
                }
                console.log("✅ Tạo sơ đồ thành công!");
                res.json({ success: true });
            });
        });

    } catch (error) {
        console.error("❌ Lỗi xử lý file:", error);
        res.json({ success: false, message: "File Excel lỗi định dạng" });
    }
});

// D. Lưu người thắng & Điểm số (Kết thúc trận)
app.post('/api/tournament/winner', (req, res) => {
    const { matchId, winnerName, score1, score2 } = req.body;
    const sqlUpdate = "UPDATE matches SET winner = ?, score1 = ?, score2 = ?, status = 'finished' WHERE id = ?";
    
    db.query(sqlUpdate, [winnerName, score1 || 0, score2 || 0, matchId], (err) => {
        if(err) return res.json({ success: false });

        db.query("SELECT * FROM matches WHERE id = ?", [matchId], (err, results) => {
            if(err || results.length === 0) return res.json({ success: true });
            
            const currentMatch = results[0];
            const currentRound = currentMatch.round;

            db.query("SELECT * FROM matches WHERE round = ? ORDER BY id ASC", [currentRound], (err, roundMatches) => {
                const matchIndex = roundMatches.findIndex(m => m.id == matchId);
                const nextMatchIndex = Math.floor(matchIndex / 2);
                const positionInNextMatch = (matchIndex % 2 === 0) ? 'p1' : 'p2';
                const teamField = (matchIndex % 2 === 0) ? 'team1' : 'team2';
                let teamName = (winnerName === currentMatch.p1) ? currentMatch.team1 : currentMatch.team2;

                db.query("SELECT * FROM matches WHERE round = ? ORDER BY id ASC", [currentRound + 1], (err, nextRoundMatches) => {
                    if (nextRoundMatches.length > 0) {
                        const targetMatch = nextRoundMatches[nextMatchIndex];
                        if (targetMatch) {
                            const sqlNext = `UPDATE matches SET ${positionInNextMatch} = ?, ${teamField} = ? WHERE id = ?`;
                            db.query(sqlNext, [winnerName, teamName, targetMatch.id]);
                        }
                    }
                    res.json({ success: true, data: { champion: nextRoundMatches.length === 0 ? winnerName : null } });
                });
            });
        });
    });
});

// E. BẮT ĐẦU TRẬN ĐẤU - Set Active
app.post('/api/tournament/match/start', (req, res) => {
    const { matchId } = req.body;
    db.query("UPDATE matches SET status = 'pending' WHERE status = 'active'", (err) => {
        if(err) return res.json({ success: false });
        db.query("UPDATE matches SET status = 'active' WHERE id = ?", [matchId], (err) => {
            res.json({ success: !err });
        });
    });
});

// F. Reset giải đấu
app.post('/api/tournament/reset', (req, res) => {
    db.query("TRUNCATE TABLE matches", (err) => res.json({ success: !err }));
});

// G. Lấy trận đấu hiện tại (Active)
app.get('/api/tournament/current', (req, res) => {
    db.query("SELECT * FROM matches WHERE status = 'active' LIMIT 1", (err, result) => {
        if (result && result.length > 0) res.json({ currentMatch: result[0] });
        else res.json({ currentMatch: null });
    });
});

// H. Bảng tổng sắp huy chương
app.get('/api/tournament/medals', (req, res) => {
    const sql = `
        SELECT team1 as name, COUNT(*) as gold FROM matches WHERE winner = p1 AND team1 != '' GROUP BY team1
        UNION
        SELECT team2 as name, COUNT(*) as gold FROM matches WHERE winner = p2 AND team2 != '' GROUP BY team2
    `;
    db.query(sql, (err, results) => {
        if(err) return res.json([]);
        const medals = {};
        results.forEach(r => {
            if(!medals[r.name]) medals[r.name] = { gold: 0, silver: 0, bronze: 0 };
            medals[r.name].gold += r.gold; 
        });
        res.json(Object.keys(medals).map(k => ({ name: k, ...medals[k] })));
    });
});
// ============================================================
// 6. API ĐIỂM DANH (ATTENDANCE)
// ============================================================
app.get('/api/attendance', (req, res) => {
    const { date, club_id } = req.query;
    let sql = `
        SELECT u.id as user_id, u.fullname, u.level, a.status, a.note 
        FROM users u 
        LEFT JOIN attendance a ON u.id = a.user_id AND a.date = ?
        WHERE u.role = 'student' AND u.status != 'Đã nghỉ' AND u.club_id = ?
        ORDER BY u.fullname ASC
    `;
    db.query(sql, [date, club_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/attendance', (req, res) => {
    const { date, records } = req.body; 
    if (!date || !records || records.length === 0) return res.json({success: true});

    const values = records.map(r => [r.user_id, date, r.status, r.note || '']);
    const sql = `
        INSERT INTO attendance (user_id, date, status, note) 
        VALUES ? 
        ON DUPLICATE KEY UPDATE status = VALUES(status), note = VALUES(note)
    `;

    db.query(sql, [values], (err) => {
        if (err) {
            console.error("Lỗi điểm danh:", err);
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json({ success: true });
    });
});
// Lấy lịch sử điểm danh của 1 học viên cụ thể
app.get('/api/users/:id/attendance', (req, res) => {
    const sql = `SELECT date, status, note FROM attendance WHERE user_id = ? ORDER BY date DESC`;
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});
// ============================================================
// KHỞI CHẠY
// ============================================================
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại https://nangkhieutriduc.com:${PORT}`);
});