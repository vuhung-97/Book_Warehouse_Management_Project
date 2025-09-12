import { CreatePublisherGUI, tableBody } from "./createGUI.js";
import { API_URL } from "./api.js";
import { setupSorting, changeArray } from "./sort.js"
import { showNotification } from "./showNotif.js";

const informationField = document.getElementById('field-info');
const informationFormContainer = document.getElementById('information-form-container');
const titleForm = informationFormContainer.getElementsByTagName('h3')[0];
const submitBtn = document.getElementById('submit-btn');
const infoIdInput = document.getElementById('info-id');

/*
 *
 * Hiển thị thông tin publisher lên form
 * 
 */

export const showInfoPublisher = (publisher) => {
    const inputList = informationField.querySelectorAll('input');

    try {
        //Điền thông tin NXB
        infoIdInput.value = publisher.id;
        inputList[0].value = publisher.name;
        inputList[1].value = publisher.address;
        inputList[2].value = publisher.tax_code;

        // Thay đổi UI khi cập nhật NXB
        submitBtn.textContent = 'Sửa';
        titleForm.textContent = 'Cập nhật Nhà xuất bản';
        informationFormContainer.classList.remove('hidden');
    }
    catch (error) {
        console.error('Lỗi lấy dữ liệu:', error);
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
}

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
        console.error('Error fetching publishers:', error);
    }
};

// Hàm displayPublishers
const displayPublishers = (allpublishers) => {
    changeArray(allpublishers);
    tableBody.innerHTML = '';
    allpublishers.forEach(publisher => {
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
 * Nút thêm/cập nhật NXB trên form
 * 
 */

export const addOrUpdatePublisher = async () => {
    const inputList = informationField.querySelectorAll('input');
    const id = infoIdInput.value;

    let publisherData = {
        'name': inputList[0].value,
        'address': inputList[1].value,
        'tax-code': inputList[2].value
    }

    try {
        let response;
        if (id) {
            response = await fetch(`${API_URL}/publishers/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(publisherData)
            });
        }
        else {
            response = await fetch(`${API_URL}/publishers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(publisherData)
            });
        }
        if (response.ok) {
            showNotification(id ? 'Cập nhật NXB thành công!' : 'Thêm NXB mới thành công!');
            publisherGUI();
        } else {
            const error = await response.json();
            showNotification(`Lỗi: ${error.detail}`, false);
        }
    }
    catch (error) {
        console.error(error);
        showNotification('Có lỗi đã xảy ra!', false);
    }
};