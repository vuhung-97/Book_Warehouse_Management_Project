import { CreatePublisherGUI, tableBody } from "./createGUI.js";
import { API_URL } from "./api.js";
import { setupSorting, changeArray } from "./sort.js";
import { showNotification } from "./showNotif.js";

const informationField = document.getElementById("field-info");
const informationFormContainer = document.getElementById(
    "information-form-container"
);
const mainContainer = document.querySelector("div.container");
const titleForm = informationFormContainer.getElementsByTagName("h3")[0];
const submitBtn = document.getElementById("submit-btn");
const infoIdInput = document.getElementById("info-id");

/*
 *
 * Hiển thị thông tin publisher lên form
 *
 */

export const showInfoPublisher = (publisher) => {
    const inputList = informationField.querySelectorAll("input");

    try {
        //Điền thông tin NXB
        infoIdInput.value = publisher.id;
        inputList[0].value = publisher.name;
        inputList[1].value = publisher.address;
        inputList[2].value = publisher.tax_code;

        // Thay đổi UI khi cập nhật NXB
        submitBtn.textContent = "Sửa";
        titleForm.textContent = "Cập nhật Nhà xuất bản";
        informationFormContainer.classList.remove("hidden-form");
        mainContainer.classList.add("expanded-right");
    } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
    }
};

/*
 *
 * GUI publisher
 *
 */

export const publisherGUI = () => {
    CreatePublisherGUI();
    let headers = document.querySelectorAll("#main-table thead th");
    fetchPublishers(headers);
};

/*
 *
 * Fetch toàn bộ bảng publishers trong CSDL vào biến allPublishers
 * sử dụng displayPublisher() để hiển thị lên GUI
 *
 */

export const fetchPublishers = async (headers) => {
    try {
        const response = await fetch(`${API_URL}/publishers`);
        let allPublishers = await response.json();
        displayPublishers(allPublishers);
        setupSorting(headers, displayPublishers);
    } catch (error) {
        showNotification(`Lỗi: ${error}`, false);
        console.error("Error fetching publishers:", error);
    }
};

// Hàm displayPublishers
export const displayPublishers = (allPublishers) => {
    changeArray(allPublishers);
    tableBody.innerHTML = "";
    allPublishers.forEach((publisher) => {
        const row = document.createElement("tr");

        // Tạo ô id
        const idCell = document.createElement("td");
        idCell.classList.add("content-center");

        const idLabel = document.createElement("label");
        idLabel.textContent = publisher.id;
        idCell.appendChild(idLabel);

        // Tạo ô name
        const nameCell = document.createElement("td");

        const nameLabel = document.createElement("label");
        nameLabel.textContent = publisher.name;
        nameCell.appendChild(nameLabel);

        // Tạo ô address
        const addressCell = document.createElement("td");

        const addressLabel = document.createElement("label");
        addressLabel.textContent = publisher.address || "";
        addressCell.appendChild(addressLabel);

        // Tạo ô taxcode
        const taxCodeCell = document.createElement("td");

        const taxCodeLabel = document.createElement("label");
        taxCodeLabel.textContent = publisher.tax_code;
        taxCodeCell.appendChild(taxCodeLabel);

        // Tạo ô amount
        const amountCell = document.createElement("td");
        amountCell.classList.add("content-center");

        const amountLabel = document.createElement("label");
        amountLabel.textContent = publisher.amount;
        amountCell.appendChild(amountLabel);

        // Tạo ô button
        const buttonCell = document.createElement("td");
        buttonCell.classList.add("action-buttons");

        // edit-btn
        const editButton = document.createElement("button");
        editButton.classList.add("edit-btn");
        editButton.setAttribute("data-id", publisher.id);

        const edit_icon = document.createElement("icon");
        edit_icon.classList = "bi bi-pen-fill";

        const edit_label = document.createElement("label");
        edit_label.textContent = "Sửa";

        editButton.appendChild(edit_icon);
        editButton.appendChild(edit_label);

        // delete-btn
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-btn");
        deleteButton.setAttribute("data-id", publisher.id);

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
        row.appendChild(addressCell);
        row.appendChild(taxCodeCell);
        row.appendChild(amountCell);
        row.appendChild(buttonCell);

        tableBody.appendChild(row);
    });
};

/*
 *
 * Nút thêm/cập nhật NXB trên form
 *
 */

export const addOrUpdatePublisher = async () => {
    const inputList = informationField.querySelectorAll("input");
    const id = infoIdInput.value || "";

    let publisherData = {
        name: inputList[0].value,
        address: inputList[1].value,
        tax_code: inputList[2].value,
    };

    try {
        let response;
        if (!id) {
            response = await fetch(`${API_URL}/publishers`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(publisherData),
            });
        } else {
            response = await fetch(`${API_URL}/publishers/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(publisherData),
            });
        }
        if (response.ok) {
            showNotification(
                id ? "Cập nhật NXB thành công!" : "Thêm NXB mới thành công!"
            );
            publisherGUI();
        } else {
            const error = await response.json();
            showNotification(`Lỗi: ${error.detail}`, false);
        }
    } catch (error) {
        console.error(error);
        showNotification("Có lỗi đã xảy ra!", false);
    }
};
