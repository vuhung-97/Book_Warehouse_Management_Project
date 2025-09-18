import { showNotification } from "./showNotif.js";
import { API_URL, t_ms } from "./var.js";
import { setupSorting, changeArray } from "./sort.js";
import { CreateBookGUI, tableBody } from "./createGUI.js";

const pageNumbersContainer = document.getElementById("page-numbers");
const mainContainer = document.querySelector("div.container");

// book form
const informationField = document.getElementById("field-info");
const publisherSelect = document.getElementById("book-publisher-select");
const bookTypeSelect = document.getElementById("book-type-select");
const informationFormContainer = document.getElementById(
    "information-form-container"
);
const titleForm = informationFormContainer.getElementsByTagName("h3")[0];
const submitBtn = document.getElementById("submit-btn");
const infoIdInput = document.getElementById("info-id");

// Phân trang
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

const BOOKS_PER_PAGE = 20;
const PAGES_WILL_SHOW = 5;
let allBooks = [];
let currentPage = 1;

const sanitizeInput = (input) => {
    return input.replace(/[<>\"']/g, "");
};

/**
 * Lấy dữ liệu nhà xuất bản và loại sách từ API và điền vào các menu thả xuống.
 */

export const fetchPublishersAndTypes = async () => {
    try {
        const [publishersRes, bookTypesRes] = await Promise.all([
            fetch(`${API_URL}/publishers`),
            fetch(`${API_URL}/book_types`),
        ]);
        if (!publishersRes.ok || !bookTypesRes.ok) {
            throw new Error(
                "Không thể tải dữ liệu bookTypes, publishers từ server."
            );
        }
        const publishers = await publishersRes.json();
        const bookTypes = await bookTypesRes.json();

        // Lấy nội dung điền vào dropdown nhà xuất bản
        publisherSelect.innerHTML = '<option value="">-- Chọn --</option>';
        publishers.forEach((p) => {
            const option = document.createElement("option");
            option.value = p.id;
            option.textContent = p.name;
            publisherSelect.appendChild(option);
        });

        // Lấy nội dung điền vào dropdown loại sách
        bookTypeSelect.innerHTML = '<option value="">-- Chọn --</option>';
        bookTypes.forEach((t) => {
            const option = document.createElement("option");
            option.value = t.id;
            option.textContent = t.name;
            bookTypeSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching dropdown data:", error);
        showNotification("Lỗi tải dữ liệu dropdown: " + error.message, false);
    }
};

/**
 * Hiển thị thông tin sách lên form
 * @param {Object} book - The book object to display
 */

export const showInfoBook = (book) => {
    const inputList = informationField.querySelectorAll("input");
    const textarea = informationField.querySelector("textarea");
    try {
        // Điền thông tin sách vào form
        infoIdInput.value = book.id;
        inputList[0].value = book.name;
        inputList[1].value = book.author;
        inputList[2].value = book.year;
        inputList[3].value = book.amount;
        inputList[4].value = book.price;
        inputList[5].value = book.image;
        textarea.value = book.description || "";

        publisherSelect.value = book.publisher_id || "";
        bookTypeSelect.value = book.book_type_id || "";

        // Thay đổi UI khi cập nhật sách
        submitBtn.textContent = "Sửa";
        titleForm.textContent = "Cập nhật Sách";
        informationFormContainer.classList.remove("hidden-form");
        mainContainer.classList.add("expanded-right");
    } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
    }
};

/**
 * Initializes the book GUI, fetches data, and sets up sorting.
 */

export const bookGUI = () => {
    CreateBookGUI();
    fetchPublishersAndTypes();
    let headers = document.querySelectorAll("#main-table thead th");
    fetchBooks(headers);
};

/**
 * Fetch toàn bộ bảng books trong CSDL vào biến allBooks
 * sử dụng displayBooks() để hiển thị lên GUI
 * @param {NodeList} headers - Table headers for sorting setup
 */

export const fetchBooks = async (headers) => {
    const loading = document.getElementById("loading");
    if (loading) loading.style.display = "block";
    try {
        const response = await fetch(`${API_URL}/books`);
        allBooks = await response.json();
        changeAllBooks(allBooks);
        displayBooks();
        setupSorting(headers, displayBooks);
    } catch (error) {
        showNotification(`Lỗi: ${error}`, false);
        console.error("Error fetching books:", error);
    } finally {
        if (loading) loading.style.display = "none";
    }
};

/**
 * Hiển thị một phần của allBooks trên bảng dựa theo trang hiện tại.
 */

export const displayBooks = () => {
    tableBody.innerHTML = "";
    const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
    const endIndex = startIndex + BOOKS_PER_PAGE;
    const booksToDisplay = allBooks.slice(startIndex, endIndex);

    booksToDisplay.forEach((book) => {
        const row = document.createElement("tr");

        // Tạo ô id
        const idCell = document.createElement("td");
        idCell.classList.add("content-center");

        const idLabel = document.createElement("label");
        idLabel.textContent = book.id;
        idCell.appendChild(idLabel);

        // Tạo ô name + image
        const nameCell = document.createElement("td");

        const nameDiv = document.createElement("div");
        nameDiv.style.display = "flex";
        nameDiv.style.justifyContent = "space-between";
        nameDiv.style.alignItems = "center";

        const nameLabel = document.createElement("label");
        nameLabel.textContent = book.name;

        const div = document.createElement("div");
        div.classList.add("box-image");

        const img = document.createElement("img");
        img.src = book.image || "";
        img.alt = "Book image";

        div.appendChild(img);
        nameDiv.appendChild(nameLabel);
        nameDiv.appendChild(div);
        nameCell.appendChild(nameDiv);

        // Tạo ô author
        const authorCell = document.createElement("td");
        authorCell.classList.add("content-center");

        const authorLabel = document.createElement("label");
        authorLabel.textContent = book.author || "";
        authorCell.appendChild(authorLabel);

        // Tạo ô year
        const yearCell = document.createElement("td");
        yearCell.classList.add("content-center");

        const yearLabel = document.createElement("label");
        yearLabel.textContent = book.year || "";
        yearCell.appendChild(yearLabel);

        // Tạo ô amount
        const amountCell = document.createElement("td");
        amountCell.classList.add("content-center");

        const amountLabel = document.createElement("label");
        amountLabel.textContent = book.amount || 0;
        amountCell.appendChild(amountLabel);

        // Tạo ô price
        const priceCell = document.createElement("td");
        priceCell.classList.add("content-center");

        const priceLabel = document.createElement("label");
        priceLabel.textContent = book.price || 0;
        priceCell.appendChild(priceLabel);

        // Tạo ô publisher
        const publisherCell = document.createElement("td");
        publisherCell.classList.add("content-center");

        const publisherLabel = document.createElement("label");
        publisherLabel.textContent = book.publisher_name || "N/A";
        publisherCell.appendChild(publisherLabel);

        // Tạo ô type
        const typeCell = document.createElement("td");
        typeCell.classList.add("content-center");

        const typeLabel = document.createElement("label");
        typeLabel.textContent = book.book_type_name || "N/A";
        typeCell.appendChild(typeLabel);

        // Tạo ô button
        const actionCell = document.createElement("td");
        actionCell.className = "action-buttons";

        //edit-btn
        const editBtn = document.createElement("button");
        editBtn.className = "edit-btn";
        editBtn.setAttribute("data-id", book.id);

        const edit_icon = document.createElement("icon");
        edit_icon.classList = "bi bi-pen-fill";

        const edit_label = document.createElement("label");
        edit_label.textContent = "Sửa";

        editBtn.appendChild(edit_icon);
        editBtn.appendChild(edit_label);

        // delete-btn
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.setAttribute("data-id", book.id);

        const del_icon = document.createElement("icon");
        del_icon.classList = "bi bi-trash-fill";

        const del_label = document.createElement("label");
        del_label.textContent = "Xóa";

        deleteBtn.appendChild(del_icon);
        deleteBtn.appendChild(del_label);
        actionCell.appendChild(editBtn);
        actionCell.appendChild(deleteBtn);

        // append các phần tử vào row
        row.appendChild(idCell);
        row.appendChild(nameCell);
        row.appendChild(authorCell);
        row.appendChild(yearCell);
        row.appendChild(amountCell);
        row.appendChild(priceCell);
        row.appendChild(publisherCell);
        row.appendChild(typeCell);
        row.appendChild(actionCell);

        tableBody.appendChild(row);
    });

    createPaginationControls();
};

/**
 * Nút thêm/cập nhật sách trong form
 */

export const addOrUpdatebook = async () => {
    const inputList = informationField.querySelectorAll("input");
    const textarea = informationField.querySelector("textarea");
    const id = infoIdInput.value;
    const bookData = {
        name: sanitizeInput(inputList[0].value.trim()),
        author: sanitizeInput(inputList[1].value || ""),
        year: parseInt(inputList[2].value, 10) || null,
        amount: parseInt(inputList[3].value, 10) || 0,
        price: parseFloat(inputList[4].value) || 0.0,
        image: sanitizeInput(inputList[5].value || `./resources/img/book.webp`),
        description: sanitizeInput(textarea.value || ""),
        publisher_id: publisherSelect.value
            ? parseInt(publisherSelect.value)
            : null,
        book_type_id: bookTypeSelect.value
            ? parseInt(bookTypeSelect.value)
            : null,
    };

    const now = new Date();

    // Kiểm tra thông tin đưa vào
    if (
        bookData.amount < 0 ||
        bookData.price < 0 ||
        (bookData.year != null &&
            (bookData.year < 1900 || bookData.year > now.getFullYear))
    ) {
        let error = [];
        if (bookData.year < 1900) {
            error.push("Năm nhập vào không hợp lệ (năm > 1900).");
            bookData.year = 1900;
            inputList[2].value = 1900;
        } else if (bookData.year > now.getFullYear) {
            error.push("Năm nhập vào không thể lớn hơn năm hiện tại.");
            bookData.year = now.getFullYear;
            inputList[2].value = now.getFullYear;
        }
        if (bookData.amount < 0) {
            error.push("Số lượng sách phải lớn hơn 0.");
            bookData.amount = 0;
            inputList[3].value = 0;
        }
        if (bookData.price < 0) {
            error.push("Giá sách phải lớn hơn 0.");
            bookData.price = 0;
            inputList[4].value = 0;
        }
        showNotification(error.join("; "), false);
        return;
    }

    submitBtn.disabled = true;
    try {
        let response;
        if (id) {
            // Cập nhật
            response = await fetch(`${API_URL}/books/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookData),
            });
        } else {
            // Thêm mới
            response = await fetch(`${API_URL}/books`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookData),
            });
        }

        if (response.ok) {
            showNotification(
                id ? "Cập nhật sách thành công!" : "Thêm sách thành công!"
            );
            bookGUI();
        } else {
            const error = await response.json();
            console.log(error);
            showNotification(`Lỗi khi thêm/cập nhật dữ liệu`, false);
        }
    } catch (error) {
        console.log(error);
        showNotification("Lỗi kết nối server!", false);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = id ? "Sửa" : "Thêm";
    }
};

/**
 * Tạo nút phân trang động.
 */

// Số nút phân trang hiển thị tối đa là PAGE_WILL_SHOW, trang hiện tại sẽ luôn ở giữa nếu có thể
const createPaginationControls = () => {
    const totalPages = Math.ceil(allBooks.length / BOOKS_PER_PAGE);
    pageNumbersContainer.innerHTML = "";

    let start = 1;
    let end = totalPages;

    if (totalPages > PAGES_WILL_SHOW) {
        if (currentPage <= Math.ceil(PAGES_WILL_SHOW / 2)) {
            end = PAGES_WILL_SHOW;
        } else if (
            currentPage >=
            totalPages - Math.floor(PAGES_WILL_SHOW / 2)
        ) {
            start = totalPages - PAGES_WILL_SHOW + 1;
        } else {
            start = currentPage - Math.floor(PAGES_WILL_SHOW / 2);
            end = currentPage + Math.floor(PAGES_WILL_SHOW / 2);
        }
    }

    for (let i = start; i <= end; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.textContent = i;
        pageBtn.classList.add("page-number-btn");
        if (i === currentPage) {
            pageBtn.classList.add("active");
        }
        pageBtn.addEventListener("click", () => {
            pageBtn.disabled = true;
            currentPage = i;
            displayBooks();
            pageBtn.disabled = false;
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

prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        displayBooks();
    }
    prevBtn.style.pointerEvents = "none";
    setTimeout(() => {
        prevBtn.style.pointerEvents = "auto";
    }, t_ms);
});

nextBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(allBooks.length / BOOKS_PER_PAGE);
    if (currentPage < totalPages) {
        currentPage++;
        displayBooks();
    }
    nextBtn.style.pointerEvents = "none";
    setTimeout(() => {
        nextBtn.style.pointerEvents = "auto";
    }, t_ms);
});

export const changeAllBooks = (newallbooks) => {
    allBooks = newallbooks;
    changeArray(allBooks);
};
