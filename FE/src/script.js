import { showInfoBook } from "./assets/js/bookMethod.js";
import { showInfoBookType } from "./assets/js/booktypeMethod.js";
import { showInfoPublisher } from "./assets/js/publisherMethod.js";
import { showNotification } from "./assets/js/showNotif.js";
import {
    addOrUpdatebook,
    bookGUI,
    fetchBooks,
    displayBooks,
    changeAllBooks,
} from "./assets/js/bookMethod.js";
import {
    addOrUpdateBookType,
    booktypeGUI,
    fetchBookTypes,
} from "./assets/js/booktypeMethod.js";
import {
    addOrUpdatePublisher,
    publisherGUI,
    fetchPublishers,
} from "./assets/js/publisherMethod.js";
import { tableBody } from "./assets/js/createGUI.js";
import { API_URL, t_ms } from "./assets/js/var.js";

document.addEventListener("DOMContentLoaded", () => {
    // Form chính và các thành phần bảng
    const informationForm = document.getElementById("information-form");
    const informationFormContainer = document.getElementById(
        "information-form-container"
    );
    const titleForm = informationFormContainer.getElementsByTagName("h3")[0];
    const showFormBtn = document.getElementById("show-form-btn");
    const confirmationModal = document.getElementById("confirmation-modal");
    const modalMessage = document.getElementById("modal-message");
    const modalConfirmBtn = document.getElementById("modal-confirm-btn");
    const modalCancelBtn = document.getElementById("modal-cancel-btn");
    const mainContainer = document.querySelector(".container");

    // Các trường input
    const infoIdInput = document.getElementById("info-id");

    // Button của Form
    const submitBtn = document.getElementById("submit-btn");
    const cancelBtn = document.getElementById("cancel-btn");

    // Các thành phần bố cục và điều hướng

    const closeBtn = document.getElementById("close-btn");
    const leftMenu = document.querySelector(".left-menu");
    const menuListItems = document.querySelectorAll("#menu-list a");
    const searchContainer = document.getElementById("search-container");
    const search = document.getElementById("search");
    const searchInput = search.querySelector("input");
    const searchIcon = document.getElementById("search-icon");

    // Biến toàn cục
    let nameTable = "";

    // --- Hàm chính ---

    /*
     *
     * left-menu
     *
     */

    // Điều khiển lựa chọn trong left-menu
    menuListItems.forEach((btn, index) => {
        btn.addEventListener("click", () => {
            menuListItems.forEach((e) => {
                e.classList.remove("active");
            });
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

    // Đóng/mở left-menu và thay đổi kích thước main-container.
    closeBtn.addEventListener("click", () => {
        leftMenu.classList.toggle("collapsed");
        mainContainer.classList.toggle("expanded-left");
    });

    /*
     *
     * Information Form
     *
     */

    // reset form
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

    // nút thêm để hiện form
    showFormBtn.addEventListener("click", () => {
        informationFormContainer.classList.remove("hidden-form");
        mainContainer.classList.add("expanded-right");
        showFormBtn.style.pointerEvents = "none";
        setTimeout(() => {
            showFormBtn.style.pointerEvents = "auto";
        }, t_ms);
        resetForm();
    });

    // nút hủy để ẩn form
    cancelBtn.addEventListener("click", () => {
        resetForm();
        informationFormContainer.classList.add("hidden-form");
        mainContainer.classList.remove("expanded-right");
    });

    // submit form
    informationForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (nameTable === "books") addOrUpdatebook();
        else if (nameTable === "publishers") addOrUpdatePublisher();
        else addOrUpdateBookType();
    });

    /*
     *
     *  nút sửa, xóa
     *
     */

    tableBody.addEventListener("click", async (e) => {
        const deleteBtn = e.target.closest(".delete-btn");
        const editBtn = e.target.closest(".edit-btn");

        let button;
        if (deleteBtn) button = deleteBtn;
        else if (editBtn) button = editBtn;
        else {
            return;
        }

        button.style.pointerEvents = "none";
        console.log("none");

        setTimeout(() => {
            button.style.pointerEvents = "auto";
        }, t_ms);
        console.log("auto");

        const id = parseInt(button.dataset.id);
        if (isNaN(id) || id <= 0) return;

        const response = await fetch(`${API_URL}/${nameTable}/${id}`);

        const target = await response.json();

        const table =
            nameTable === "books"
                ? "sách"
                : nameTable === "publishers"
                ? "NXB"
                : "thể loại";
        if (deleteBtn) {
            // Hiển thị modal xác nhận
            modalMessage.innerHTML = `Bạn có chắc chắn muốn xóa </br><i>${table}</i> <b>"${target.name}"</b> không?`;
            confirmationModal.classList.remove("modal-hidden");
            // Gắn bookId vào nút xác nhận để sử dụng sau
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

    /*
     *
     * Modal yêu cầu xóa
     *
     */

    // Xử lý nút Hủy trong modal
    modalCancelBtn.addEventListener("click", () => {
        confirmationModal.classList.add("modal-hidden");
    });

    // Xử lý nút Xóa trong modal
    modalConfirmBtn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;

        // Xóa nội dung tương ứng
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
                showNotification(`Lỗi: ${error.detail}`, false);
            }
        } catch (error) {
            showNotification(`Lỗi: ${error}`, false);
            console.error("Error deleting:", error);
        } finally {
            confirmationModal.classList.add("modal-hidden"); // Ẩn modal sau khi xử lý
        }
    });

    /*
     *
     *  Search
     *
     */

    // click vào icon search
    searchIcon.addEventListener("click", () => {
        const searchInput = search.querySelector("input.open");
        if (searchInput) {
            const query = searchInput.value.trim();
            if (!query) {
                setTimeout(() => {
                    searchInput.classList.remove("open");
                    searchContainer.classList.remove("open");
                }, 300); // đợi animation kết thúc
            } else {
                SearchBook(query);
            }
        }
    });

    // Click vào khung search sẽ mở rộng phần input nhập liệu
    search.parentElement.addEventListener("click", () => {
        // Lấy phần tử input

        // Delay một chút trước khi thêm class để transition chạy
        setTimeout(() => searchInput.classList.add("open"), 10);
        setTimeout(() => search.parentElement.classList.add("open"), 10);
        searchInput.focus();
    });

    // Event ấn enter trong searchinput
    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const query = searchInput.value.trim();
            if (!query) {
                setTimeout(() => {
                    searchInput.classList.remove("open");
                    searchContainer.classList.remove("open");
                }, 300); // đợi animation kết thúc
            } else {
                SearchBook(query);
            }
        }
    });

    // Searching
    async function SearchBook(value) {
        console.log(value);

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
                .filter(Boolean) // loại bỏ null/undefined
                .sort((a, b) => a.id - b.id); // Sắp xếp tăng

            // Loại bỏ sách trùng id
            const id_map = new Map();
            allBooks.forEach((book) => {
                if (!id_map.has(book.id)) {
                    id_map.set(book.id, book);
                }
            });
            allBooks = Array.from(id_map.values());

            if (allBooks.length > 0) showNotification(`Hoàn thành!`, true);
            else {
                throw new Error(
                    `Không tìm thấy nội dung khớp với từ khóa <br>${value}</br>`
                );
            }

            changeAllBooks(allBooks);
            displayBooks();
        } catch (error) {
            showNotification(`Lỗi: ${error}`, false);
        }
    }

    // --- Khởi tạo ---

    menuListItems[0].classList.add("active");
    menuListItems[0].click();
});
