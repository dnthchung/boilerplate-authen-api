# Dockerize Backend (BE) & MongoDB với PowerShell

## 1️⃣ Hướng dẫn cho người lần đầu cài đặt

### 🔹 1.1 Tạo Docker Network
Tạo một **network** để backend và database có thể giao tiếp:
```powershell
docker network create boilerplate_authen_api_network
```

### 🔹 1.2 Chạy MongoDB container với volume lưu trữ dữ liệu
```powershell
docker run -d --name mongodb `
  --network boilerplate_authen_api_network `
  -p 27017:27017 `
  -v mongodb_data:/data/db `
  mongo
```
✅ Lệnh này sẽ chạy MongoDB trong Docker và giữ dữ liệu ngay cả khi container bị xóa.

### 🔹 1.3 Build Backend thành Docker Image
Chạy lệnh sau để **build backend**:
```powershell
docker build -t backend-no-session .
```

### 🔹 1.4 Chạy Backend container và kết nối với MongoDB
```powershell
docker run -d --name backend-no-session `
  --network boilerplate_authen_api_network `
  -p 4004:4004 `
  -e MONGO_URI="mongodb://mongodb:27017/boilerplate-authen-api" `
  -e PORT=4004 `
  backend-no-session
```
✅ Backend sẽ chạy trên port **4004** và kết nối với MongoDB container.

### 🔹 1.5 Kiểm tra container đang chạy
```powershell
docker ps
```
Bạn sẽ thấy danh sách các container đang chạy (MongoDB & Backend).

---

## 2️⃣ Cập nhật code & database

### 🔹 2.1 Cập nhật code
Khi có thay đổi code backend, bạn cần **build lại image và restart container**:
```powershell
docker stop backend-no-session
```
```powershell
docker rm backend-no-session
```
```powershell
docker build -t backend-no-session .
```
```powershell
docker run -d --name backend-no-session `
  --network boilerplate_authen_api_network `
  -p 4004:4004 `
  -e MONGO_URI="mongodb://mongodb:27017/boilerplate-authen-api" `
  -e PORT=4004 `
  backend-no-session
```
✅ Backend đã được cập nhật!

### 🔹 2.2 Cập nhật database (Import từ file JSON)
Nếu bạn cần **import dữ liệu mới vào MongoDB**, làm như sau:

#### 🔹 2.2.1 Copy file JSON vào container MongoDB
Giả sử file `data.json` nằm ở thư mục `be-no-session/db/`:
```powershell
docker cp "D:\Workspace\Github_folder\boilerplate-authen-api\db\boilerplate-authen-api.users.json" mongodb:/data/data.json
```

#### 🔹 2.2.2 Import dữ liệu từ file JSON vào MongoDB
```powershell
docker exec -it mongodb mongoimport --db boilerplate-authen-api --collection users --jsonArray --file /data/data.json
```
✅ Nếu thành công, bạn sẽ thấy thông báo **"X document(s) imported successfully"**.

---

## 3️⃣ Kiểm tra dữ liệu trong MongoDB
Sau khi import dữ liệu, bạn có thể kiểm tra bằng cách vào MongoDB shell:
```powershell
docker exec -it mongodb mongosh
```
Sau đó, chạy các lệnh sau trong MongoDB shell:

### 🔹 3.1 Xem danh sách database
```javascript
show dbs;
```

### 🔹 3.2 Chọn database `boilerplate-authen-api`
```javascript
use boilerplate-authen-api;
```

### 🔹 3.3 Xem danh sách collections
```javascript
show collections;
```

### 🔹 3.4 Xem dữ liệu trong collection `users`
```javascript
db.users.find().pretty();
```

### 🔹 3.5 Đếm số lượng documents trong collection `users`
```javascript
db.users.countDocuments();
```

### 🔹 3.6 Thoát khỏi MongoDB shell
```javascript
exit;
```

---

## 4️⃣ Quản lý Containers

### 🔹 4.1 Dừng container
```powershell
docker stop backend-no-session mongodb
```

### 🔹 4.2 Xóa container (không mất dữ liệu MongoDB do dùng volume)
```powershell
docker rm backend-no-session mongodb
```

### 🔹 4.3 Xóa volume MongoDB (⚠️ **Mất dữ liệu**)
```powershell
docker volume rm mongodb_data
```

✅ **Bây giờ, bạn đã Dockerize thành công Backend và Database bằng PowerShell!** 🚀

