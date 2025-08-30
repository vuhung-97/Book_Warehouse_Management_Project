
# 📚 API Quản lý Kho Sách

Một API RESTful đơn giản được xây dựng bằng Python để quản lý thông tin sách.

## 🌟 Tính năng
- Thêm sách mới vào kho.
- Lấy thông tin của tất cả sách.
- Lấy thông tin một cuốn sách cụ thể theo ID.
- Cập nhật thông tin sách.
- Xóa một cuốn sách khỏi kho.

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
    git clone <URL_repository_của_bạn>
    cd <tên_thư_mục_dự_án>
    ```

2.  **Kích hoạt môi trường ảo**:
    * **Windows**: `venv\Scripts\activate`
    * **macOS/Linux**: `source venv/bin/activate`

3.  **Cài đặt các thư viện**:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Chạy ứng dụng**:
    * **Với Flask**: `python app.py`
    * **Với FastAPI**: `uvicorn main:app --reload`

## 📝 Tài liệu API
- Sau khi chạy ứng dụng FastAPI, truy cập `http://127.0.0.1:8000/docs` để xem tài liệu API tương tác. (Chỉ áp dụng với FastAPI)

---

Bạn có thể chỉnh sửa `README.md` để phù hợp với dự án của mình, ví dụ như thay đổi framework hoặc thêm các bước cụ thể hơn. Chúc bạn thành công với dự án!