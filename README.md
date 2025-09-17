
# 📚 API Quản lý Kho Sách

Một API RESTful đơn giản được xây dựng bằng Python để quản lý thông tin sách.

## Thư mục dự án
- Book_Warehouse_Management
	- app
		- __init__.py
		- crud.py
		- database.py
		- main.py
		- models.py
		- schemas.py
	- FrontEnd
		- js
			- api.js
			- bookMethod.js
			- booktypeMehod.js
			- createGUI.js
			- publisherMethod.js
			- showNotif.js
			- sort.js
		- index.html
		- scripts.js
		- style.css
	- venv
	- .env
	- .gitignore
	- ERROR.txt
	- README.md
	- requirement_python.txt

## 🌟 Tính năng
- CRUD sách
- CRUD thể loại sách
- CRUD NXB sách
- Lấy thông tin của tất cả sách.
- Lấy thông tin một cuốn sách cụ thể theo tên sách, tác giả, thể loại, NXB

## 🚀 Các bước thực hiện dự án

### 1. Chuẩn bị môi trường
- Tạo thư mục dự án và khởi tạo môi trường ảo Python.
- Cài đặt các thư viện cần thiết trong file requirement_python.txt.

### 2. Xây dựng API
- Thiết kế các mô hình dữ liệu.
- Viết các điểm cuối (endpoints) để xử lý các yêu cầu HTTP (GET, POST, PUT, DELETE).
- Tích hợp các logic nghiệp vụ cơ bản cho từng điểm cuối.

### 3. Kiểm thử
- Sử dụng công cụ như Postman để kiểm thử từng điểm cuối API, đảm bảo chúng hoạt động đúng như mong đợi.

## 🛠️ Hướng dẫn cài đặt và chạy
1.  **Clone dự án**:
    ```bash
    git clone https://github.com/vuhung-97/Book_Warehouse_Management_Project.git
    cd <tên_thư_mục_dự_án>
    ```

2.  **Kích hoạt môi trường ảo**:
    * **Windows**: 
	```bash
	python -m venv venv
	venv\Scripts\activate
	```

3.  **Cài đặt các thư viện**:
    ```bash
    pip install -r requirements_python.txt
    ```

4.  **Cài đặt cơ sở dữ liệu**:
    ```bash
    python app\database.py
    ```

5.  **Chạy ứng dụng**:
    ```bash
    uvicorn app.main:api --reload (--port 5500 nếu muốn mở port khác)
    ```
6. **Nếu bị treo cổng**:
    - Mở cmd
    - Nhập "netstat -ano | findstr :8000"
    - Mở Task Manager/Details
    - Tìm kiếm các Pid trong danh sách và "End task"
    - Quay lại bước 5

## 📝 Tài liệu API
- Sau khi chạy ứng dụng FastAPI, truy cập `http://127.0.0.1:8000/docs` để xem tài liệu API tương tác. 
- Truy cập `http://127.0.0.1:8000/redoc` để xem tài liệu api dạng redoc

---

Chúc bạn thành công với dự án!