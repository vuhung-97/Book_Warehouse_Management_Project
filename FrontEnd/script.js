document.addEventListener('DOMContentLoaded', () => {

    // Khai báo root css
    const root = document.documentElement;
    // Form chính và các thành phần bảng
    const form = document.getElementById('book-form');
    const tableBody = document.querySelector('#main-table tbody');
    const bookFormContainer = document.getElementById('book-form-container');
    const titleForm = bookFormContainer.getElementsByTagName('h3')[0];
    const showFormBtn = document.getElementById('show-form-btn');
    const notificationBox = document.getElementById('notification-box');
    const confirmationModal = document.getElementById('confirmation-modal');
    const modalMessage = document.getElementById('modal-message');
    const modalConfirmBtn = document.getElementById('modal-confirm-btn');
    const modalCancelBtn = document.getElementById('modal-cancel-btn');

    // Các trường input
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

    // Button của Form
    const submitBtn = document.getElementById('submit-btn');
    const cancelBtn = document.getElementById('cancel-btn');

    // Các thành phần bố cục và điều hướng
    const closeBtn = document.getElementById('close-btn');
    const leftMenu = document.querySelector('.left-menu');
    const mainContainer = document.querySelector('.container');
    const menuListItems = document.querySelectorAll('#menu-list a');
    const search = document.getElementById('search');
    const searchIcon = document.getElementById('search-icon');

    // Phân trang
    const paginationContainer = document.querySelector('.pagination');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageNumbersContainer = document.getElementById('page-numbers');

    // Biến toàn cục
    let allBooks = [];
    let allPublishers = [];
    let allBookTypes = [];
    let currentPage = 1;
    let sortDirections = {};
    let headers;
    const BOOKS_PER_PAGE = 10;


    // --- Hàm chính ---

    /*
    * Modal Yêu cầu xóa
    */

    // Xử lý nút Hủy trong modal
    modalCancelBtn.addEventListener('click', () => {
        confirmationModal.classList.add('modal-hidden');
    });

    /**
     * Hiển thị một thông báo tạm thời cho người dùng.
     */
    const showNotification = (message, isNotif = true) => {
        notificationBox.innerHTML = message;

        if (!isNotif)
            notificationBox.style.backgroundColor = getComputedStyle(root).getPropertyValue('--secondary-color').trim();
        else
            notificationBox.style.backgroundColor = getComputedStyle(root).getPropertyValue('--primary-color').trim();

        notificationBox.classList.remove('visible');
        setTimeout(() => {
            notificationBox.classList.add('visible');
        }, 10);
        setTimeout(() => {
            notificationBox.classList.remove('visible');
        }, 3000);
    };

    /**
     * Lấy dữ liệu nhà xuất bản và loại sách từ API và điền vào các menu thả xuống.
     */
    const fetchPublishersAndTypes = async () => {
        try {
            const [publishersRes, bookTypesRes] = await Promise.all([
                fetch(`${API_URL}/publishers`),
                fetch(`${API_URL}/book_types`)
            ]);
            const publishers = await publishersRes.json();
            const bookTypes = await bookTypesRes.json();

            // Lấy nội dung điền vào dropdown nhà xuất bản
            publisherSelect.innerHTML = '<option value="">-- Chọn --</option>';
            publishers.forEach(p => {
                const option = document.createElement('option');
                option.value = p.id;
                option.textContent = p.name;
                publisherSelect.appendChild(option);
            });

            // Lấy nội dung điền vào dropdown loại sách
            bookTypeSelect.innerHTML = '<option value="">-- Chọn --</option>';
            bookTypes.forEach(t => {
                const option = document.createElement('option');
                option.value = t.id;
                option.textContent = t.name;
                bookTypeSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching dropdown data:', error);
        }
    };

    /**
     * Fetch toàn bộ bảng books trong CSDL vào biến allBooks
     * sử dụng displayBooks() để hiển thị lên GUI
     */
    const fetchBooks = async () => {
        try {
            const response = await fetch(`${API_URL}/books`);
            allBooks = await response.json();
            displayBooks();
            setupSorting(allBooks, displayBooks);
        } catch (error) {
            showNotification(`Lỗi: ${error}`, false);
            console.error('Error fetching books:', error);
        }
    };

    /**
     * Hiển thị một phần của allBooks trên bảng dựa theo trang hiện tại.
     */
    const displayBooks = () => {
        tableBody.innerHTML = '';
        const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
        const endIndex = startIndex + BOOKS_PER_PAGE;
        const booksToDisplay = allBooks.slice(startIndex, endIndex);

        booksToDisplay.forEach(book => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><label>${book.id}</label></td>
                <td>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <label>${book.name}</label>
                        <img src="${book.image}">
                    </div>
                </td>
                <td><label>${book.author || ''}</label></td>
                <td><label>${book.year || ''}</label></td>
                <td><label>${book.amount || 0}</label></td>
                <td><label>${book.price || 0}</label></td>
                <td><label>${book.publisher_name || 'N/A'}</label></td>
                <td><label>${book.book_type_name || 'N/A'}</label></td>
                <td class="action-buttons">
                    <button class="edit-btn" data-id="${book.id}">Sửa</button>
                    <button class="delete-btn" data-id="${book.id}">Xóa</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        createPaginationControls();
    };

    /**
     * Fetch toàn bộ bảng publishers trong CSDL vào biến allPublishers
     * sử dụng displayPublisher() để hiển thị lên GUI
     */
    const fetchPublishers = async () => {
        try {
            const response = await fetch(`${API_URL}/publishers`);
            allPublishers = await response.json();
            displayPublishers();
            setupSorting(allPublishers, displayPublishers);
        } catch (error) {
            showNotification(`Lỗi: ${error}`, false);
            console.error('Error fetching publishers:', error);
        }
    };

    // Hàm displayPublishers
    const displayPublishers = () => {
        tableBody.innerHTML = '';
        allPublishers.forEach(publisher => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><label>${publisher.id}</label></td>
                <td><label>${publisher.name}</label></td>
                <td><label>${publisher.address || ''}</label></td>
                <td><label>${publisher.tax_code}</label></td>
                <td><label></label></td>
                <td class="action-buttons">
                    <button class="edit-btn" data-id="${publisher.id}">Sửa</button>
                    <button class="delete-btn" data-id="${publisher.id}">Xóa</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    /**
     * Fetch toàn bộ bảng publishers trong CSDL vào biến allPublishers
     * sử dụng displayPublisher() để hiển thị lên GUI
     */
    const fetchBookTypes = async () => {
        try {
            const response = await fetch(`${API_URL}/book_types`);
            allBookTypes = await response.json();
            displayBookTypes();
            setupSorting(allBookTypes, displayBookTypes);
        } catch (error) {
            showNotification(`Lỗi: ${error}`, false);
            console.error('Error fetching publishers:', error);
        }
    };

    // Hàm displayPublishers
    const displayBookTypes = () => {
        tableBody.innerHTML = '';
        allBookTypes.forEach(booktype => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><label>${booktype.id}</label></td>
                <td><label>${booktype.name}</label></td>
                <td><label></label></td>
                <td class="action-buttons">
                    <button class="edit-btn" data-id="${booktype.id}">Sửa</button>
                    <button class="delete-btn" data-id="${booktype.id}">Xóa</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    /**
     * Reset bookForm về trạng thái mặc định.
     */
    const resetForm = () => {
        form.reset();
        bookIdInput.value = '';
        submitBtn.textContent = 'Thêm sách';
        titleForm.textContent = 'Thêm sách mới';
        showFormBtn.textContent = 'Thêm sách mới';
    };

    /**
     * Tạo nút phân trang động.
     */
    const createPaginationControls = () => {
        const totalPages = Math.ceil(allBooks.length / BOOKS_PER_PAGE);
        pageNumbersContainer.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            pageBtn.classList.add('page-number-btn');
            if (i === currentPage) {
                pageBtn.classList.add('active');
            }
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                displayBooks();
            });
            pageNumbersContainer.appendChild(pageBtn);
        }

        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
    };


    /*
    * --- Sự kiện ---
    */

    // Điều khiển lựa chọn trong left-menu
    menuListItems.forEach((btn, index) => {
        btn.addEventListener("click", () => {
            menuListItems.forEach(e => {
                e.classList.remove('active');
            })
            btn.classList.add('active')
            const titleHeader = document.getElementById('title-header');
            const tr = document.querySelector('#main-table tr');
            bookFormContainer.classList.add('hidden');
            switch (btn.id) {
                case 'BookTypes':
                    titleHeader.innerText = 'Danh sách thể loại sách';
                    paginationContainer.style.visibility = 'hidden';
                    showFormBtn.innerText = 'Thêm thể loại mới'
                    tr.innerHTML = `
                        <th width="10%"><label data-key="id">ID</label></th>
                        <th width="30%"><label data-key="name">Thể loại</label></th>
                        <th width="20%"><label data-key="Amount">Số lượng đầu sách</label></th>
                        <th width="10%"></th>
                    `;
                    headers = document.querySelectorAll("#main-table thead th");
                    fetchBookTypes();
                    break;

                case 'Publishers':
                    titleHeader.innerText = 'Danh sách Nhà xuất bản';
                    paginationContainer.style.visibility = 'hidden';
                    showFormBtn.innerText = 'Thêm NXB mới'
                    tr.innerHTML = `
                        <th width="10%"><label data-key="id">ID</label></th>
                        <th width="15%"><label data-key="name">Nhà xuất bản</label></th>
                        <th width="35%"><label data-key="address">Địa chỉ</label></th>
                        <th width="15%"><label data-key="tax_code">Mã số thuế</label></th>
                        <th width="15%"><label data-key="Amount">Số lượng đầu sách</label></th>
                        <th width="10%"></th>
                    `;
                    headers = document.querySelectorAll("#main-table thead th");
                    fetchPublishers();
                    break;
                default:
                    titleHeader.innerText = 'Danh sách sách trong kho';
                    paginationContainer.style.visibility = 'visible';
                    showFormBtn.innerText = 'Thêm sách mới'
                    tr.innerHTML = `
                        <th width="5%"><label data-key="id">ID</label></th>
                        <th width="27%"><label data-key="name">Tên sách</label></th>
                        <th width="13%"><label data-key="author">Tác giả</label></th>
                        <th width="7%"><label data-key="year">Năm XB</label></th>
                        <th width="7%"><label data-key="amount">Số lượng</label></th>
                        <th width="10%"><label data-key="price">Đơn giá</label></th>
                        <th width="10%"><label data-key="publisher_name">Nhà xuất bản</label></th>
                        <th width="10%"><label data-key="book_type_name">Thể loại</label></th>
                        <th width="10%"> </th>
                    `;
                    headers = document.querySelectorAll("#main-table thead th");
                    fetchBooks();
                    break;
            }
        })
    });

    // Đóng/mở left-menu và thay đổi kích thước main-container.
    closeBtn.addEventListener('click', () => {
        leftMenu.classList.toggle('collapsed');
        mainContainer.classList.toggle('expanded');
        closeBtn.innerHTML = leftMenu.classList.contains('collapsed') ? '&#9776;' : '&times;';
    });

    // Click button Thêm sách mới để hiện/reset bookForm
    showFormBtn.addEventListener('click', () => {
        bookFormContainer.classList.remove('hidden');
        if (bookFormContainer.classList.contains('hidden')) {
            showFormBtn.textContent = 'Thêm sách mới';
            resetForm();
        } else {
            resetForm();
        }
    });

    // Thoát và ẩn bookForm
    cancelBtn.addEventListener('click', () => {
        resetForm();
        bookFormContainer.classList.add('hidden');
        showFormBtn.textContent = 'Thêm sách mới';
        showFormBtn.disabled = false;
    });

    // Điều khiển sự kiện thêm và sửa sách
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const bookId = bookIdInput.value;

        // Kiểm tra thông tin đưa vào
        let bookAmount = parseInt(bookAmountInput.value, 10) || 0;
        let bookPrice = parseFloat(bookPriceInput.value) || 0.00;
        let bookYear = parseInt(bookYearInput.value, 10) || null;
        if (bookAmount < 0 || bookPrice < 0 || (bookYear != null && bookYear < 1900)) {
            let error = "";
            if (bookAmount < 0) {
                bookAmountInput.value = 0;
                bookAmount = 0;
                error += "Số lượng sách phải lớn hơn 0.<br>";
            }
            if (bookPrice < 1000) {
                bookPriceInput.value = 10;
                bookPrice = 0;
                error += " Đơn giá sách phải lớn hơn 0.<br>";
            }
            if (bookYear < 1900) {
                bookYearInput.value = 1900;
                bookYear = 1900;
                error += " Năm xuất bản phải lớn hơn 1900.";
            }
            showNotification(error.trim(), false);
            return;
        }

        const bookData = {
            name: bookNameInput.value,
            author: bookAuthorInput.value || null,
            year: bookYear,
            amount: bookAmount,
            price: bookPrice,
            image: bookImageInput.value || null,
            description: bookDescriptionInput.value || null,
            publisher_id: publisherSelect.value ? parseInt(publisherSelect.value) : null,
            book_type_id: bookTypeSelect.value ? parseInt(bookTypeSelect.value) : null
        };

        let response;
        try {
            if (bookId) {
                // Cập nhật
                response = await fetch(`${API_URL}/books/${bookId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bookData)
                });
            } else {
                // Thêm mới
                response = await fetch(`${API_URL}/books`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bookData)
                });
            }

            if (response.ok) {
                showNotification(bookId ? 'Cập nhật sách thành công!' : 'Thêm sách thành công!');
                resetForm();
                fetchBooks();
            } else {
                const error = await response.json();
                showNotification(`Lỗi: ${error.detail}`, false);
            }
        } catch (error) {
            console.error('Error adding/updating book:', error);
            showNotification('An error occurred. Please try again.', false);
        }
    });

    // Điều khiển bắt sự kiện sửa, xóa sách
    tableBody.addEventListener('click', async (e) => {
        const bookId = e.target.dataset.id;
        const response = await fetch(`${API_URL}/books/simple${bookId}`);
        const book = await response.json();

        if (e.target.classList.contains('delete-btn')) {
            // Hiển thị modal xác nhận
            modalMessage.innerHTML = `Bạn có chắc chắn muốn xóa sách <b>"${book.name}"</b> không?`;
            confirmationModal.classList.remove('modal-hidden');

            // Gắn bookId vào nút xác nhận để sử dụng sau
            modalConfirmBtn.dataset.id = bookId;
        }
        if (e.target.classList.contains('edit-btn')) {
            try {
                // Điền thông tin sách vào form
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

                // Thay đổi UI khi cập nhật sách
                submitBtn.textContent = 'Cập nhật sách';
                titleForm.textContent = 'Cập nhật sách';
                bookFormContainer.classList.remove('hidden');
            } catch (error) {
                console.error('Error fetching book details for edit:', error);
            }
        }
    });

    // Sắp xếp
    function setupSorting(array, func) {
        headers.forEach((header, index) => {
            header.addEventListener("click", () => {

                const currentDir = sortDirections[index] === "asc" ? "desc" : "asc";

                const key = header.querySelector('label').dataset.key;
                if (!key) return;

                sortDirections[index] = currentDir;

                array.sort((a, b) => {
                    let valA = a[key];
                    let valB = b[key];

                    // Xử lý giá trị null/undefined để đảm bảo chúng được sắp xếp đúng
                    if (valA === null || valA === undefined) valA = (currentDir === "asc" ? Infinity : -Infinity);
                    if (valB === null || valB === undefined) valB = (currentDir === "asc" ? Infinity : -Infinity);

                    // Chuyển về chữ thường khi so sánh chuỗi
                    if (typeof valA === 'string' && typeof valB === 'string') {
                        valA = valA.toLowerCase();
                        valB = valB.toLowerCase();
                    }

                    if (valA < valB) {
                        return currentDir === "asc" ? -1 : 1;
                    }
                    if (valA > valB) {
                        return currentDir === "asc" ? 1 : -1;
                    }
                    return 0;
                });

                func();
            });
        });
    }

    // Điều khiển phân trang (Previous và Next buttons)
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayBooks();
        }
    });

    nextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(allBooks.length / BOOKS_PER_PAGE);
        if (currentPage < totalPages) {
            currentPage++;
            displayBooks();
        }
    });

    // Xử lý nút Xóa trong modal
    modalConfirmBtn.addEventListener('click', async (e) => {
        const bookId = e.target.dataset.id;
        try {
            const response = await fetch(`${API_URL}/books/${bookId}`, { method: 'DELETE' });

            if (response.ok) {
                showNotification('Xóa sách thành công!');
                fetchBooks();
            } else {
                const error = await response.json();
                showNotification(`Lỗi: ${error.detail}`, false);
            }
        } catch (error) {
            showNotification(`Lỗi: ${error}`, false);
            console.error('Error deleting book:', error);
        } finally {
            confirmationModal.classList.add('modal-hidden'); // Ẩn modal sau khi xử lý
        }
    });

    // Xử lý nút Search
    searchIcon.addEventListener('click', () => {
        const searchInput = search.querySelector('input');
        if (searchInput) {
            const query = searchInput.value.trim();
            if (!query) {
                searchInput.classList.remove('open');
                setTimeout(() => searchInput.remove(), 300); // đợi animation kết thúc
            } else {
                SearchBook(query);
            }
        }
    });



    // Click vào khung search sẽ mở rộng phần input nhập liệu
    search.parentElement.addEventListener('click', () => {
        let searchInput = search.querySelector('input');
        if (!searchInput) {
            // Tạo input mới bằng createElement
            searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.placeholder = 'Tìm kiếm...';
            search.appendChild(searchInput);

            // Delay một chút trước khi thêm class để transition chạy
            setTimeout(() => searchInput.classList.add('open'), 10);
            searchInput.focus();

            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const query = searchInput.value.trim();
                    if (!query) {
                        searchInput.classList.remove('open');
                        setTimeout(() => searchInput.remove(), 300); // đợi animation kết thúc
                    } else {
                        SearchBook(query);
                    }
                }
            });
        }
    });

    // Tìm kiếm
    async function SearchBook(value) {
        try {
            const urls = [
                `${API_URL}/books/search/name?book_name=${value}`,
                `${API_URL}/books/search/publisher?publisher_name=${value}`,
                `${API_URL}/books/search/author?author=${value}`,
                `${API_URL}/books/search/type?book_type_name=${value}`
            ];

            const responses = await Promise.all(urls.map(url => fetch(url)));
            allBooks = (await Promise.all(responses.map(res => res.json())))
                .filter(arr => Array.isArray(arr) && arr.length > 0)
                .flat()
                .filter(book => book != null); // loại bỏ null/undefined

            if (allBooks.length > 0)
                showNotification(`Hoàn thành!`);
            else {
                throw new Error(`Không tìm thấy nội dung khớp với từ khóa <br>${value}</br>`);

            }
            console.log(allBooks);

            displayBooks();

        } catch (error) {
            showNotification(`Lỗi: ${error}`, false);
        }
    }

    // --- Khởi tạo ---
    fetchPublishersAndTypes();
    document.getElementById("Books").click();
});