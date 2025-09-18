import { CreateBookTypeGUI, tableBody } from "./createGUI.js";
import { API_URL } from "./var.js";
import { setupSorting, changeArray } from "./sort.js";
import { showNotification } from "./showNotif.js";

const informationField = document.getElementById("field-info");
const infoIdInput = document.getElementById("info-id");
const mainContainer = document.querySelector("div.container");

/*
 *
 * Hiển thị thông tin loại sách lên form
 *
 */

export const showInfoBookType = (booktype) => {
    const inputList = informationField.querySelectorAll("input");
    const submitBtn = document.getElementById("submit-btn");
    const informationFormContainer = document.getElementById(
        "information-form-container"
    );
    const titleForm = informationFormContainer.getElementsByTagName("h3")[0];

    try {
        // Điền thông tin thể loại sách vào form
        infoIdInput.value = booktype.id;
        inputList[0].value = booktype.name;

        // Thay đổi UI khi cập nhật thể loại sách
        submitBtn.textContent = "Sửa";
        titleForm.textContent = "Cập nhật thể loại Sách";
        informationFormContainer.classList.remove("hidden-form");
        mainContainer.classList.add("expanded-right");
    } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
    }
};

/*
 *
 * GUI booktype
 *
 */

export const booktypeGUI = () => {
    CreateBookTypeGUI();
    let headers = document.querySelectorAll("#main-table thead th");
    fetchBookTypes(headers);
};

/*
 *
 * Fetch toàn bộ bảng BookType trong CSDL vào biến allBookTypes
 * sử dụng displayBookTypes() để hiển thị lên GUI
 *
 */

export const fetchBookTypes = async (headers) => {
    try {
        const response = await fetch(`${API_URL}/book_types`);
        let allBookTypes = await response.json();
        displayBookTypes(allBookTypes);
        setupSorting(headers, displayBookTypes);
    } catch (error) {
        showNotification(`Lỗi: ${error}`, false);
        console.error("Error fetching book types:", error);
    }
};

// Hàm displayBookTypes
export const displayBookTypes = (allBookTypes) => {
    changeArray(allBookTypes);
    tableBody.innerHTML = "";
    allBookTypes.forEach((booktype) => {
        const row = document.createElement("tr");

        // Tạo ô id
        const idCell = document.createElement("td");
        idCell.classList.add("content-center");

        const idLabel = document.createElement("label");
        idLabel.textContent = booktype.id;
        idCell.appendChild(idLabel);

        // Tạo ô name
        const nameCell = document.createElement("td");

        const nameLabel = document.createElement("label");
        nameLabel.textContent = booktype.name;
        nameCell.appendChild(nameLabel);

        // Tạo ô amount
        const amountCell = document.createElement("td");
        amountCell.classList.add("content-center");

        const amountLabel = document.createElement("label");
        amountLabel.textContent = booktype.amount;
        amountCell.appendChild(amountLabel);

        // Tạo ô button
        const buttonCell = document.createElement("td");
        buttonCell.classList.add("action-buttons");

        // edit-btn
        const editButton = document.createElement("button");
        editButton.classList.add("edit-btn");
        editButton.setAttribute("data-id", booktype.id);

        const edit_icon = document.createElement("icon");
        edit_icon.classList = "bi bi-pen-fill";

        const edit_label = document.createElement("label");
        edit_label.textContent = "Sửa";

        editButton.appendChild(edit_icon);
        editButton.appendChild(edit_label);

        // delete-btn
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-btn");
        deleteButton.setAttribute("data-id", booktype.id);

        const del_icon = document.createElement("icon");
        del_icon.classList = "bi bi-trash-fill";

        const del_label = document.createElement("label");
        del_label.textContent = "Xóa";

        deleteButton.appendChild(del_icon);
        deleteButton.appendChild(del_label);

        buttonCell.appendChild(editButton);
        buttonCell.appendChild(deleteButton);

        // append vào row
        row.appendChild(idCell);
        row.appendChild(nameCell);
        row.appendChild(amountCell);
        row.appendChild(buttonCell);

        tableBody.appendChild(row);
    });
};

/*
 *
 * nút thêm/cập nhật thể loại sách trên form
 *
 */

export const addOrUpdateBookType = async () => {
    const inputList = informationField.querySelectorAll("input");
    const id = infoIdInput.value || "";

    let bookTypeData = {
        name: inputList[0].value,
    };

    try {
        let response;
        if (!id) {
            response = await fetch(`${API_URL}/book_types`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookTypeData),
            });
        } else {
            response = await fetch(`${API_URL}/book_types/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookTypeData),
            });
        }

        if (response.ok) {
            showNotification(
                id
                    ? "Cập nhật thể loại sách thành công!"
                    : "Thêm thể loại sách mới thành công!"
            );
            booktypeGUI();
        } else {
            const error = await response.json();
            console.log(error);
            showNotification(`Lỗi khi thêm/cập nhật dữ liệu`, false);
        }
    } catch (error) {
        console.error(error);
        showNotification("Lỗi kết nối server!", false);
    }
};
