import { showNotification } from "./showNotif.js";
import { API_URL } from "./api.js";
import { setupSorting, changeArray } from "./sort.js";
import { CreateBookGUI, tableBody } from "./createGUI.js";

const pageNumbersContainer = document.getElementById('page-numbers');

// book form
const informationField = document.getElementById('field-info');
const publisherSelect = document.getElementById('book-publisher-select');
const bookTypeSelect = document.getElementById('book-type-select');
const informationFormContainer = document.getElementById('information-form-container');
const titleForm = informationFormContainer.getElementsByTagName('h3')[0];
const submitBtn = document.getElementById('submit-btn');
const infoIdInput = document.getElementById('info-id');

// Phân trang
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');


const BOOKS_PER_PAGE = 3;
let allBooks = [];
let currentPage = 1;

/*
 *
 * Lấy dữ liệu nhà xuất bản và loại sách từ API và điền vào các menu thả xuống.
 * 
 */

export const fetchPublishersAndTypes = async () => {
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
 * Hiển thị thông tin sách lên form
 * 
 */

export const showInfoBook = (book) => {
    const inputList = informationField.querySelectorAll('input');
    const textarea = informationField.querySelector('textarea');
    try {
        // Điền thông tin sách vào form
        infoIdInput.value = book.id;
        inputList[0].value = book.name;
        inputList[1].value = book.author;
        inputList[2].value = book.year;
        inputList[3].value = book.amount;
        inputList[4].value = book.price;
        inputList[5].value = book.image;
        textarea.value = book.description || '';

        publisherSelect.value = book.publisher_id || '';
        bookTypeSelect.value = book.book_type_id || '';


        // Thay đổi UI khi cập nhật sách
        submitBtn.textContent = 'Sửa';
        titleForm.textContent = 'Cập nhật Sách';
        informationFormContainer.classList.remove('hidden');
    } catch (error) {
        console.error('Lỗi lấy dữ liệu:', error);
    }
};

/*
 *
 * GUI books
 * 
 */

export const bookGUI = () => {
    CreateBookGUI();
    fetchPublishersAndTypes();
    let headers = document.querySelectorAll("#main-table thead th");
    fetchBooks(headers);
};

/*
 *
 * Fetch toàn bộ bảng books trong CSDL vào biến allBooks
 * sử dụng displayBooks() để hiển thị lên GUI
 * 
 */

export const fetchBooks = async (headers) => {
    try {
        const response = await fetch(`${API_URL}/books`);
        allBooks = await response.json();
        changeAllBooks(allBooks);
        displayBooks();
        setupSorting(headers, displayBooks);
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

export const displayBooks = () => {
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
 * Nút thêm/cập nhật sách trong form
 * 
 */

export const addOrUpdatebook = async () => {
    const inputList = informationField.querySelectorAll('input');
    const textarea = informationField.querySelector('textarea');
    const id = infoIdInput.value;
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
        if (bookData.year < 1900) {
            error = 'Năm nhập vào không hợp lệ (năm > 1900).';
            bookData.year = 1900;
            inputList[2].value = 1900;
        }
        if (bookData.amount < 0) {
            error += ' Số lượng sách phải lớn hơn 0.';
            bookData.amount = 0;
            inputList[3].value = 0;
        }
        if (bookData.price < 0) {
            error += ' Giá sách phải lớn hơn 0.';
            bookData.price = 0;
            inputList[4].value = 0;
        }
        showNotification(error, false);
        return;
    }

    try {
        let response;
        if (id) {
            // Cập nhật
            response = await fetch(`${API_URL}/books/${id}`, {
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
            showNotification(id ? 'Cập nhật sách thành công!' : 'Thêm sách thành công!');
            bookGUI();
        } else {
            const error = await response.json();
            showNotification(`Lỗi: ${error.detail}`, false);
        }

    } catch (error) {
        console.error(error);
        showNotification('Có lỗi đã xảy ra!', false);
    }
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

export const changeAllBooks = (newallbooks) => {
    allBooks = newallbooks;
    changeArray(allBooks);
};