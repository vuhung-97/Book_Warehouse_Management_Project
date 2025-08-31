document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://127.0.0.1:8000'; // Thay đổi nếu API của bạn chạy ở địa chỉ khác

    const form = document.getElementById('book-form');
    const tableBody = document.querySelector('#book-table tbody');
    const bookIdInput = document.getElementById('book-id');
    const bookNameInput = document.getElementById('book-name');
    const bookAuthorInput = document.getElementById('book-author');
    const bookYearInput = document.getElementById('book-year');
    const submitBtn = document.getElementById('submit-btn');
    const cancelBtn = document.getElementById('cancel-btn');

    // Hàm để tải và hiển thị danh sách sách
    const fetchBooks = async () => {
        try {
            const response = await fetch(`${API_URL}/books`);
            const books = await response.json();
            tableBody.innerHTML = '';
            books.forEach(book => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${book.name}</td>
                    <td>${book.author || ''}</td>
                    <td>${book.year || ''}</td>
                    <td class="action-buttons">
                        <button class="edit-btn" data-id="${book.id}">Sửa</button>
                        <button class="delete-btn" data-id="${book.id}">Xóa</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Lỗi khi tải sách:', error);
        }
    };

    // Hàm để thêm hoặc cập nhật sách
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const bookId = bookIdInput.value;
        const bookData = {
            name: bookNameInput.value,
            author: bookAuthorInput.value,
            year: parseInt(bookYearInput.value, 10) || null
        };

        if (bookId) {
            // Cập nhật sách
            try {
                await fetch(`${API_URL}/books/${bookId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(bookData)
                });
                alert('Cập nhật sách thành công!');
                resetForm();
                fetchBooks();
            } catch (error) {
                console.error('Lỗi khi cập nhật sách:', error);
            }
        } else {
            // Thêm sách mới
            try {
                await fetch(`${API_URL}/books`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(bookData)
                });
                alert('Thêm sách thành công!');
                form.reset();
                fetchBooks();
            } catch (error) {
                error_name: "Lỗi khi thêm sách:", error
            }
        }
    });

    // Bắt sự kiện click vào nút Sửa hoặc Xóa
    tableBody.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const bookId = e.target.dataset.id;
            if (confirm('Bạn có chắc chắn muốn xóa sách này không?')) {
                try {
                    await fetch(`${API_URL}/books/${bookId}`, {
                        method: 'DELETE'
                    });
                    alert('Xóa sách thành công!');
                    fetchBooks();
                } catch (error) {
                    console.error('Lỗi khi xóa sách:', error);
                }
            }
        }

        if (e.target.classList.contains('edit-btn')) {
            const bookId = e.target.dataset.id;
            // Tải thông tin sách để điền vào form
            try {
                const response = await fetch(`${API_URL}/books/${bookId}`);
                const book = await response.json();
                bookIdInput.value = book.id;
                bookNameInput.value = book.name;
                bookAuthorInput.value = book.author;
                bookYearInput.value = book.year;
                submitBtn.textContent = 'Cập nhật Sách';
                cancelBtn.style.display = 'inline-block';
            } catch (error) {
                console.error('Lỗi khi tải thông tin sách:', error);
            }
        }
    });

    // Hàm để reset form về trạng thái ban đầu
    const resetForm = () => {
        form.reset();
        bookIdInput.value = '';
        submitBtn.textContent = 'Thêm Sách';
        cancelBtn.style.display = 'none';
    };

    cancelBtn.addEventListener('click', resetForm);

    // Tải danh sách sách khi trang web được load
    fetchBooks();
});