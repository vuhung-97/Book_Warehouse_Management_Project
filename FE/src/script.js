// Import các hàm & biến cần thiết
import {
    showInfoBook,
    addOrUpdatebook,
    bookGUI,
    fetchBooks,
    displayBooks,
    changeAllBooks,
} from "./assets/js/bookMethod.js";
import {
    showInfoBookType,
    addOrUpdateBookType,
    booktypeGUI,
    fetchBookTypes,
} from "./assets/js/booktypeMethod.js";
import {
    showInfoPublisher,
    addOrUpdatePublisher,
    publisherGUI,
    fetchPublishers,
} from "./assets/js/publisherMethod.js";
import { showNotification } from "./assets/js/showNotif.js";
import { tableBody } from "./assets/js/createGUI.js";
import { API_URL, t_ms } from "./assets/js/var.js";

// Biến toàn cục
let nameTable = "";

/* ----------------------------
 * Menu
 * ---------------------------- */
function initMenu() {
    const closeBtn = document.getElementById("close-btn");
    const leftMenu = document.querySelector(".left-menu");
    const mainContainer = document.querySelector(".container");
    const menuListItems = document.querySelectorAll("#menu-list a");
    const submitBtn = document.getElementById("submit-btn");

    menuListItems.forEach((btn) => {
        btn.addEventListener("click", () => {
            menuListItems.forEach((e) => e.classList.remove("active"));
            btn.classList.add("active");

            nameTable = btn.id;
            submitBtn.innerText = "Thêm";

            switch (btn.id) {
                case "book_types":
                    booktypeGUI();
                    break;
                case "publishers":
                    publisherGUI();
                    break;
                default:
                    bookGUI();
                    break;
            }
        });
    });

    closeBtn.addEventListener("click", () => {
        leftMenu.classList.toggle("collapsed");
        mainContainer.classList.toggle("expanded-left");
    });

    // Trả về menuListItems để dùng cho init mặc định
    return menuListItems;
}

/* ----------------------------
 * Form
 * ---------------------------- */
function initForm() {
    const informationForm = document.getElementById("information-form");
    const informationFormContainer = document.getElementById(
        "information-form-container"
    );
    const titleForm = informationFormContainer.querySelector("h3");
    const showFormBtn = document.getElementById("show-form-btn");
    const submitBtn = document.getElementById("submit-btn");
    const cancelBtn = document.getElementById("cancel-btn");
    const infoIdInput = document.getElementById("info-id");
    const mainContainer = document.querySelector(".container");

    const resetForm = () => {
        informationForm.reset();
        infoIdInput.value = "";

        let content = "";
        if (nameTable === "books") content = "Thêm sách mới";
        else if (nameTable === "publishers") content = "Thêm NXB mới";
        else content = "Thêm thể loại mới";

        submitBtn.textContent = "Thêm";
        titleForm.textContent = content;
    };

    showFormBtn.addEventListener("click", () => {
        informationFormContainer.classList.remove("hidden-form");
        mainContainer.classList.add("expanded-right");
        showFormBtn.style.pointerEvents = "none";
        setTimeout(() => {
            showFormBtn.style.pointerEvents = "auto";
        }, t_ms);
        resetForm();
    });

    cancelBtn.addEventListener("click", () => {
        resetForm();
        informationFormContainer.classList.add("hidden-form");
        mainContainer.classList.remove("expanded-right");
    });

    informationForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (nameTable === "books") addOrUpdatebook();
        else if (nameTable === "publishers") addOrUpdatePublisher();
        else addOrUpdateBookType();
    });
}

/* ----------------------------
 * Table (Sửa, xóa)
 * ---------------------------- */
function initTable() {
    const confirmationModal = document.getElementById("confirmation-modal");
    const modalMessage = document.getElementById("modal-message");
    const modalConfirmBtn = document.getElementById("modal-confirm-btn");

    tableBody.addEventListener("click", async (e) => {
        const deleteBtn = e.target.closest(".delete-btn");
        const editBtn = e.target.closest(".edit-btn");

        let button;
        if (deleteBtn) button = deleteBtn;
        else if (editBtn) button = editBtn;
        else return;

        button.style.pointerEvents = "none";
        setTimeout(() => (button.style.pointerEvents = "auto"), t_ms);

        const id = parseInt(button.dataset.id);
        if (isNaN(id) || id <= 0) return;

        const response = await fetch(`${API_URL}/${nameTable}/${id}`);
        const target = await response.json();

        const mapTableName = {
            books: "sách",
            publishers: "NXB",
            book_types: "thể loại",
        };

        const tableName = mapTableName[nameTable];

        if (deleteBtn) {
            modalMessage.innerHTML = `Bạn có chắc chắn muốn xóa </br><i>${tableName}</i> <b>"${target.name}"</b> không?`;
            confirmationModal.classList.remove("modal-hidden");
            modalConfirmBtn.dataset.id = id;
        } else if (editBtn) {
            switch (nameTable) {
                case "books":
                    showInfoBook(target);
                    break;
                case "publishers":
                    showInfoPublisher(target);
                    break;
                default:
                    showInfoBookType(target);
                    break;
            }
        }
    });
}

/* ----------------------------
 * Modal
 * ---------------------------- */
function initModal() {
    const confirmationModal = document.getElementById("confirmation-modal");
    const modalCancelBtn = document.getElementById("modal-cancel-btn");
    const modalConfirmBtn = document.getElementById("modal-confirm-btn");

    modalCancelBtn.addEventListener("click", () => {
        confirmationModal.classList.add("modal-hidden");
    });

    modalConfirmBtn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;

        try {
            const response = await fetch(`${API_URL}/${nameTable}/${id}`, {
                method: "DELETE",
            });

            let headers = document.querySelectorAll("#main-table thead th");
            if (response.ok) {
                showNotification("Xóa thành công!", true);
                if (nameTable === "books") fetchBooks(headers);
                else if (nameTable === "book_types") fetchBookTypes(headers);
                else fetchPublishers(headers);
            } else {
                const error = await response.json();
                throw error;
            }
        } catch (error) {
            showNotification(
                `Lỗi: ${error.error?.message || "Không xác định"}`,
                false
            );
            console.error("Error deleting:", error);
        } finally {
            confirmationModal.classList.add("modal-hidden");
        }
    });
}

/* ----------------------------
 * Search
 * ---------------------------- */
function initSearch() {
    const searchContainer = document.getElementById("search-container");
    const search = document.getElementById("search");
    const searchInput = search.querySelector("input");
    const searchIcon = document.getElementById("search-icon");

    searchIcon.addEventListener("click", () => {
        const query = searchInput.value.trim();
        if (searchInput.classList.contains("open")) {
            if (!query) {
                setTimeout(() => {
                    searchInput.classList.remove("open");
                    searchContainer.classList.remove("open");
                }, 300);
            } else {
                SearchBook(query);
            }
        }
    });

    search.parentElement.addEventListener("click", () => {
        setTimeout(() => searchInput.classList.add("open"), 10);
        setTimeout(() => search.parentElement.classList.add("open"), 10);
        searchInput.focus();
    });

    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const query = searchInput.value.trim();
            if (!query) {
                setTimeout(() => {
                    searchInput.classList.remove("open");
                    searchContainer.classList.remove("open");
                }, 300);
            } else {
                SearchBook(query);
            }
        }
    });

    async function SearchBook(value) {
        try {
            const urls = [
                `${API_URL}/books/search/name?book_name=${value}`,
                `${API_URL}/books/search/publisher?publisher_name=${value}`,
                `${API_URL}/books/search/author?author=${value}`,
                `${API_URL}/books/search/type?book_type_name=${value}`,
            ];

            const responses = await Promise.all(urls.map((url) => fetch(url)));
            let allBooks = (
                await Promise.all(responses.map((res) => res.json()))
            )
                .filter((arr) => Array.isArray(arr) && arr.length > 0)
                .flat()
                .filter(Boolean)
                .sort((a, b) => a.id - b.id);

            const id_map = new Map();
            allBooks.forEach((book) => {
                if (!id_map.has(book.id)) {
                    id_map.set(book.id, book);
                }
            });
            allBooks = Array.from(id_map.values());

            if (allBooks.length > 0) {
                showNotification(`Hoàn thành!`, true);
            } else {
                throw new Error(
                    `Không tìm thấy nội dung khớp với từ khóa <br>${value}</br>`
                );
            }

            changeAllBooks(allBooks);
            displayBooks();
        } catch (error) {
            console.log(error);

            showNotification(
                `Lỗi: ${
                    error.error?.message || error.message || "Không xác định"
                }`,
                false
            );
        }
    }
}

/* ----------------------------
 * Chạy init sau khi DOM load
 * ---------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    const menuListItems = initMenu();
    initForm();
    initTable();
    initModal();
    initSearch();

    // Chọn mặc định menu đầu tiên
    menuListItems[0].classList.add("active");
    menuListItems[0].click();
});
