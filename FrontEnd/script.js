document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://127.0.0.1:8000';

    const form = document.getElementById('book-form');
    const tableBody = document.querySelector('#book-table tbody');
    const bookFormContainer = document.getElementById('book-form-container');
    const titleForm = bookFormContainer.getElementsByTagName('h3')[0];
    const showFormBtn = document.getElementById('show-form-btn');
    const bookIdInput = document.getElementById('book-id');
    const bookNameInput = document.getElementById('book-name');
    const bookAuthorInput = document.getElementById('book-author');
    const bookYearInput = document.getElementById('book-year');
    const bookAmountInput = document.getElementById('book-amount');
    const bookPriceInput = document.getElementById('book-price');
    const bookImageInput = document.getElementById('book-image');
    const bookDescriptionInput = document.getElementById('book-description');
    const publisherSelect = document.getElementById('book-publisher-select');
    const bookTypeSelect = document.getElementById('book-type-select');
    const submitBtn = document.getElementById('submit-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const closeBtn = document.getElementById('close-btn');
    const leftMenu = document.querySelector('.left-menu');
    const mainContainer = document.querySelector('.container');
    const menuListItems = document.getElementById('menu-list').getElementsByTagName('a');
    const notificationBox = document.getElementById('notification-box');

    // Tạo hàm để hiển thị thông báo
    const showNotification = (message) => {
        notificationBox.textContent = message;

        // Đảm bảo thông báo đã ở trạng thái ẩn trước khi hiển thị lại
        notificationBox.classList.remove('visible');

        // Thêm một độ trễ nhỏ để reset hiệu ứng, đảm bảo nó chạy lại đúng cách
        setTimeout(() => {
            notificationBox.classList.add('visible');
        }, 10); // Độ trễ rất nhỏ

        // Tự động ẩn thông báo sau 3 giây
        setTimeout(() => {
            notificationBox.classList.remove('visible');
        }, 3000); // 3000ms = 3 giây
    };

    // Hàm để tải và điền dữ liệu vào dropdown
    const fetchPublishersAndTypes = async () => {
        try {
            const [publishersRes, bookTypesRes] = await Promise.all([
                fetch(`${API_URL}/publishers`),
                fetch(`${API_URL}/book_types`)
            ]);
            const publishers = await publishersRes.json();
            const bookTypes = await bookTypesRes.json();

            // Điền dữ liệu vào dropdown Nhà xuất bản
            publisherSelect.innerHTML = '<option value="">-- Chọn --</option>';
            publishers.forEach(p => {
                const option = document.createElement('option');
                option.value = p.id;
                option.textContent = p.name;
                publisherSelect.appendChild(option);
            });

            // Điền dữ liệu vào dropdown Loại sách
            bookTypeSelect.innerHTML = '<option value="">-- Chọn --</option>';
            bookTypes.forEach(t => {
                const option = document.createElement('option');
                option.value = t.id;
                option.textContent = t.name;
                bookTypeSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu dropdown:', error);
        }
    };

    // Thêm event listener cho nút đóng menu
    closeBtn.addEventListener('click', () => {
        leftMenu.classList.toggle('collapsed');
        mainContainer.classList.toggle('expanded');
        if (leftMenu.classList.contains('collapsed')) {
            closeBtn.innerHTML = '&#9776;'; // Biểu tượng menu
        } else {
            closeBtn.innerHTML = '&times;'; // Biểu tượng đóng
        }
    });

    // Hàm để tải và hiển thị danh sách sách
    const fetchBooks = async () => {
        try {
            const response = await fetch(`${API_URL}/books`);
            const books = await response.json();
            tableBody.innerHTML = '';
            books.forEach(book => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <div style="display: flex; justify-content: space-between;">
                            <label style="margin: auto 0;">${book.name}</label>
                            <img src="${book.image}">
                        </div>                        
                    </td>
                    <td><label margin="0 auto">${book.author || ''}</label></td>
                    <td><label margin="0 auto">${book.year || ''}</label></td>
                    <td><label margin="0 auto">${book.amount || 0}</label></td>
                    <td><label margin="0 auto">${book.price || 0}</label></td>
                    <td><label margin="0 auto">${book.publisher_name || 'N/A'}</label></td>
                    <td><label margin="0 auto">${book.book_type_name || 'N/A'}</label></td>
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
            author: bookAuthorInput.value || null,
            year: parseInt(bookYearInput.value, 10) || null,
            amount: parseInt(bookAmountInput.value, 10) || 0,
            price: parseFloat(bookPriceInput.value) || 0.00,
            image: bookImageInput.value || null,
            description: bookDescriptionInput.value || null,
            publisher_id: publisherSelect.value ? parseInt(publisherSelect.value) : null,
            book_type_id: bookTypeSelect.value ? parseInt(bookTypeSelect.value) : null
        };

        if (bookId) {
            // Cập nhật sách
            try {
                const response = await fetch(`${API_URL}/books/${bookId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bookData)
                });
                if (response.ok) {
                    showNotification('Cập nhật sách thành công!');
                    resetForm();
                    fetchBooks();
                } else {
                    const error = await response.json();
                    showNotification(`Lỗi: ${error.detail}`);
                }
            } catch (error) {
                console.error('Lỗi khi cập nhật sách:', error);
            }
        } else {
            // Thêm sách mới
            try {
                console.log(bookData);
                const response = await fetch(`${API_URL}/books`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bookData)
                });
                if (response.ok) {
                    showNotification('Thêm sách thành công!');
                    resetForm();
                    fetchBooks();
                } else {
                    const error = await response.json();
                    showNotification(`Lỗi: ${error.detail}`);
                }
            } catch (error) {
                console.error('Lỗi khi thêm sách:', error);
            }
        }
    });

    // Bắt sự kiện click vào nút Sửa hoặc Xóa
    tableBody.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const bookId = e.target.dataset.id;
            if (confirm('Bạn có chắc chắn muốn xóa sách này không?')) {
                try {
                    const response = await fetch(`${API_URL}/books/${bookId}`, { method: 'DELETE' });
                    if (response.ok) {
                        showNotification('Xóa sách thành công!');
                        fetchBooks();
                    } else {
                        const error = await response.json();
                        showNotification(`Lỗi: ${error.detail}`);
                    }
                } catch (error) {
                    console.error('Lỗi khi xóa sách:', error);
                }
            }
        }

        if (e.target.classList.contains('edit-btn')) {
            const bookId = e.target.dataset.id;
            try {
                const response = await fetch(`${API_URL}/books/simple${bookId}`);
                const book = await response.json();
                bookIdInput.value = book.id;
                bookNameInput.value = book.name;
                bookAuthorInput.value = book.author;
                bookYearInput.value = book.year;
                bookAmountInput.value = book.amount;
                bookPriceInput.value = book.price;
                bookImageInput.value = book.image;
                bookDescriptionInput.value = book.description || '';
                publisherSelect.value = book.publisher_id || '';
                bookTypeSelect.value = book.book_type_id || '';

                submitBtn.textContent = 'Cập nhật Sách';
                titleForm.textContent = 'Cập nhật Sách';
                bookFormContainer.classList.remove('hidden');
                showFormBtn.textContent = 'Đang sửa sách ...';
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
    };

    // Ẩn/hiện form khi click vào nút "Thêm Sách Mới"
    showFormBtn.addEventListener('click', () => {
        titleForm.textContent = 'Thêm Sách Mới';
        bookFormContainer.classList.toggle('hidden');
        if (bookFormContainer.classList.contains('hidden')) {
            showFormBtn.textContent = 'Thêm Sách Mới';
            resetForm();
        } else {
            showFormBtn.textContent = 'Đang thêm sách ...';
        }
    });

    cancelBtn.addEventListener('click', () => {
        resetForm();
        bookFormContainer.classList.add('hidden');
        showFormBtn.textContent = 'Thêm Sách Mới';
        showFormBtn.disabled = false;
    });

    // Tải danh sách sách và dropdown khi trang web được load
    fetchPublishersAndTypes();
    fetchBooks();

    // Sắp xếp danh sách sách
    const table = document.getElementById("book-table");
    const headers = table.querySelectorAll("th");
    const tbody = table.querySelector("tbody");

    // Biến lưu trạng thái sắp xếp
    let sortDirections = {};

    headers.forEach((header, index) => {
        header.addEventListener("click", () => {
            const rows = Array.from(tbody.querySelectorAll("tr"));
            const currentDir = sortDirections[index] === "asc" ? "desc" : "asc";
            sortDirections[index] = currentDir;

            rows.sort((a, b) => {
                let cellA = a.children[index];
                let cellB = b.children[index];

                cellA = cellA.querySelector("label").innerText.trim().toLowerCase();
                cellB = cellB.querySelector("label").innerText.trim().toLowerCase();

                let valA, valB;
                if (isNaN(cellA) || isNaN(cellB)) {
                    valA = cellA;
                    valB = cellB;
                } else {
                    valA = parseFloat(cellA);
                    valB = parseFloat(cellB);
                }

                if (valA < valB) return currentDir === "asc" ? -1 : 1;
                if (valA > valB) return currentDir === "asc" ? 1 : -1;
                return 0;
            });

            // Xóa tbody cũ và gắn lại các hàng theo thứ tự mới
            tbody.innerHTML = "";
            rows.forEach(row => tbody.appendChild(row));
        });
    });
});