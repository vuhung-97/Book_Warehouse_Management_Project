import { CreateBookGUI, CreateBookTypeGUI, CreatePublisherGUI } from "./js/createGUI.js";
import { showInfoBook } from "./js/bookMethod.js";
import { showInfoBookType } from "./js/booktypeMethod.js";
import { showInfoPublisher } from "./js/publisherMethod.js";

document.addEventListener('DOMContentLoaded', () => {
    // --- API and DOM Element Constants ---
    const API_URL = 'http://127.0.0.1:8000';

    // Form chính và các thành phần bảng
    const informationForm = document.getElementById('information-form');
    const tableBody = document.querySelector('#main-table tbody');
    const informationFormContainer = document.getElementById('information-form-container');
    const titleForm = informationFormContainer.getElementsByTagName('h3')[0];
    const showFormBtn = document.getElementById('show-form-btn');
    const notificationBox = document.getElementById('notification-box');
    const confirmationModal = document.getElementById('confirmation-modal');
    const modalMessage = document.getElementById('modal-message');
    const modalConfirmBtn = document.getElementById('modal-confirm-btn');
    const modalCancelBtn = document.getElementById('modal-cancel-btn');

    // Các trường input
    const infoIdInput = document.getElementById('info-id');
    const informationField = document.getElementById('field-info');
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
    const searchContainer = document.getElementById('search-container');

    // Phân trang
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageNumbersContainer = document.getElementById('page-numbers');

    // Biến toàn cục
    let allBooks = [];
    let allBookTypes = [];
    let allPublishers = [];
    let currentPage = 1;
    let sortDirections = {};
    let headers;
    let nameTable = '';
    const BOOKS_PER_PAGE = 10;


    // --- Hàm chính ---

    /**
     * Hiển thị một thông báo tạm thời cho người dùng.
     */
    const showNotification = (message, isNotif = true) => {
        notificationBox.textContent = message;

        if (!isNotif)
            notificationBox.style.backgroundColor = "#f44336";
        else
            notificationBox.style.backgroundColor = "#2196f3";

        setTimeout(() => {
            notificationBox.classList.add('visible');
        }, 10);
        setTimeout(() => {
            notificationBox.classList.remove('visible');
        }, 3000);

    };

    /*
     *
     * Lấy dữ liệu nhà xuất bản và loại sách từ API và điền vào các menu thả xuống.
     * 
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

    /*
     *
     * Fetch toàn bộ bảng books trong CSDL vào biến allBooks
     * sử dụng displayBooks() để hiển thị lên GUI
     * 
     */

    const fetchBooks = async () => {
        try {
            const response = await fetch(`${API_URL}/books`);
            allBooks = await response.json()
            displayBooks();
            setupSorting(allBooks, displayBooks);
        } catch (error) {
            showNotification(`Lỗi: ${error}`, false);
            console.error('Error fetching books:', error);
        }
    };

    /*
     *
     * Hiển thị một phần của allBooks trên bảng dựa theo trang hiện tại.
     * 
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
                        <img src="${book.image || ''}">
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

    /*
     *
     * Fetch toàn bộ bảng publishers trong CSDL vào biến allPublishers
     * sử dụng displayPublisher() để hiển thị lên GUI
     * 
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
    };

    /*
     *
     * Fetch toàn bộ bảng BookType trong CSDL vào biến allPublishers
     * sử dụng displayBookType() để hiển thị lên GUI
     * 
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
    };

    /*
     *
     * Reset bookForm về trạng thái mặc định.
     * 
     */

    const resetForm = () => {
        informationForm.reset();
        infoIdInput.value = '';

        let content = '';
        if (nameTable === 'books')
            content = 'Thêm sách mới';
        else if (nameTable === 'publishers')
            content = 'Thêm NXB mới';
        else
            content = 'Thêm thể loại mới';

        submitBtn.textContent = 'Thêm';
        titleForm.textContent = content;

    };

    /*
     *
     * Tạo nút phân trang động.
     * 
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
    *
    * --- Sự kiện ---
    * 
    */

    // GUI books
    const bookGUI = () => {
        CreateBookGUI();
        fetchPublishersAndTypes();
        headers = document.querySelectorAll("#main-table thead th");
        fetchBooks();
    };

    //GUI booktype
    const booktypeGUI = () => {
        CreateBookTypeGUI();
        headers = document.querySelectorAll("#main-table thead th");
        fetchBookTypes();
    };

    // GUI publisher
    const publisherGUI = () => {
        CreatePublisherGUI();
        headers = document.querySelectorAll("#main-table thead th");
        fetchPublishers();
    }

    // Điều khiển lựa chọn trong left-menu
    menuListItems.forEach((btn, index) => {
        btn.addEventListener("click", () => {
            menuListItems.forEach(e => {
                e.classList.remove('active');
            })
            btn.classList.add('active');
            nameTable = btn.id;
            submitBtn.innerText = 'Thêm';
            switch (btn.id) {
                case 'book_types':
                    booktypeGUI();
                    break;

                case 'publishers':
                    publisherGUI();
                    break;

                default:
                    bookGUI();
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

    // Ẩn/hiện bookForm
    showFormBtn.addEventListener('click', () => {
        informationFormContainer.classList.remove('hidden');
        if (informationFormContainer.classList.contains('hidden')) {
            resetForm();
        } else {
            resetForm();
        }
    });

    // Thoát và ẩn bookForm
    cancelBtn.addEventListener('click', () => {
        resetForm();
        informationFormContainer.classList.add('hidden');
    });

    // Điều khiển sự kiện thêm và sửa sách

    const addOrUpdatebook = async () => {
        const inputList = informationField.querySelectorAll('input');
        const textarea = informationField.querySelector('textarea');
        const bookId = infoIdInput.value;
        const bookData = {
            name: inputList[0].value,
            author: inputList[1].value || null,
            year: parseInt(inputList[2].value, 10) || null,
            amount: parseInt(inputList[3].value, 10) || 0,
            price: parseFloat(inputList[4].value) || 0.00,
            image: inputList[5].value || null,
            description: textarea.value || null,
            publisher_id: publisherSelect.value ? parseInt(publisherSelect.value) : null,
            book_type_id: bookTypeSelect.value ? parseInt(bookTypeSelect.value) : null
        };


        // Kiểm tra thông tin đưa vào
        if (bookData.amount < 0 || bookData.price < 0 || (bookData.year != null && bookData.year < 1900)) {
            let error;
            if (bookData.year < 1900) error = 'Năm nhập vào không hợp lệ (năm > 1900).';
            else if (bookData.amount < 0) error = 'Số lượng sách phải lớn hơn 0.';
            else error = 'Giá sách phải lớn hơn 0.';
            showNotification(error, false);
            return;
        }

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
                bookGUI();
            } else {
                const error = await response.json();
                showNotification(`Lỗi: ${error.detail}`, false);
            }

        } catch (error) {
            console.error('Error adding/updating book:', error);
            showNotification('An error occurred. Please try again.', false);
        }
    };

    informationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        addOrUpdatebook();
    });

    /*
    *
    *  Điều khiển bắt sự kiện bấm nút sửa, xóa
    * 
    */

    tableBody.addEventListener('click', async (e) => {
        const id = parseInt(e.target.dataset.id);

        if (!id) return;

        const response = await fetch(`${API_URL}/${nameTable}/${id}`);

        const target = await response.json();

        if (e.target.classList.contains('delete-btn')) {
            // Hiển thị modal xác nhận
            modalMessage.innerHTML = `Bạn có chắc chắn muốn xóa <b>"${target.name}"</b> không?`;
            confirmationModal.classList.remove('modal-hidden');

            // Gắn bookId vào nút xác nhận để sử dụng sau
            modalConfirmBtn.dataset.id = id;
        }
        if (e.target.classList.contains('edit-btn')) {
            switch (nameTable) {
                case 'books':
                    showInfoBook(target);
                    break;
                case 'publishers':
                    showInfoPublisher(target);
                    break;
                default:
                    showInfoBookType(target);
                    break;
            }
        }
    });

    /* 
    *
    *  Sắp xếp
    * 
    */

    function setupSorting(array, func) {
        headers.forEach((header, index) => {
            header.addEventListener("click", () => {
                const currentDir = sortDirections[index] === "asc" ? "desc" : "asc";

                if (!header.querySelector('label')) return;

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

    /*
    *
    * Điều khiển phân trang (Previous và Next buttons)
    * 
    */

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

    /*
    *
    * Modal Yêu cầu xóa
    * 
    */

    // Xử lý nút Hủy trong modal
    modalCancelBtn.addEventListener('click', () => {
        confirmationModal.classList.add('modal-hidden');
    });

    // Xử lý nút Xóa trong modal
    modalConfirmBtn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;

        // Xóa nội dung tương ứng
        try {
            const response = await fetch(`${API_URL}/${nameTable}/${id}`, { method: 'DELETE' });

            if (response.ok) {
                showNotification('Xóa thành công!');
                if (nameTable === 'books')
                    fetchBooks();
                else if (nameTable === 'book_types')
                    fetchBookTypes();
                else
                    fetchPublishers();
            } else {
                const error = await response.json();
                showNotification(`Lỗi: ${error.detail}`, false);
            }
        } catch (error) {
            showNotification(`Lỗi: ${error}`, false);
            console.error('Error deleting:', error);
        } finally {
            confirmationModal.classList.add('modal-hidden'); // Ẩn modal sau khi xử lý
        }
    });

    /*
    *
    *  Xử lý Search
    *
    */

    // click vào icon search
    searchIcon.addEventListener('click', () => {
        const searchInput = search.querySelector('input.open');
        if (searchInput) {
            const query = searchInput.value.trim();
            if (!query) {
                setTimeout(() => {
                    searchInput.classList.remove('open');
                    searchContainer.classList.remove('open');
                }, 300); // đợi animation kết thúc
            } else {
                SearchBook(query);
            }
        }
    });

    // Click vào khung search sẽ mở rộng phần input nhập liệu
    search.parentElement.addEventListener('click', () => {
        // Lấy phần tử input
        const searchInput = search.querySelector('input');

        // Delay một chút trước khi thêm class để transition chạy
        setTimeout(() => searchInput.classList.add('open'), 10);
        setTimeout(() => search.parentElement.classList.add('open'), 10);
        searchInput.focus();

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (!query) {
                    setTimeout(() => {
                        searchInput.classList.remove('open');
                        searchContainer.classList.remove('open');
                    }, 300); // đợi animation kết thúc
                } else {
                    SearchBook(query);
                }
            }
        });
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
    menuListItems[0].classList.add('active');
    menuListItems[0].click();
});