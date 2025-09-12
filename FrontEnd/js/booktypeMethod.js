import { CreateBookTypeGUI, tableBody } from "./createGUI.js";
import { API_URL } from "./api.js";
import { setupSorting, changeArray } from "./sort.js"
import { showNotification } from "./showNotif.js";

const informationField = document.getElementById('field-info');
const infoIdInput = document.getElementById('info-id');

/*
 *
 * Hiển thị thông tin loại sách lên form
 * 
 */

export const showInfoBookType = (booktype) => {
    const inputList = informationField.querySelectorAll('input');
    const submitBtn = document.getElementById('submit-btn');
    const informationFormContainer = document.getElementById('information-form-container');
    const titleForm = informationFormContainer.getElementsByTagName('h3')[0];

    try {
        // Điền thông tin thể loại sách vào form
        infoIdInput.value = booktype.id;
        inputList[0].value = booktype.name;

        // Thay đổi UI khi cập nhật thể loại sách
        submitBtn.textContent = 'Sửa';
        titleForm.textContent = 'Cập nhật thể loại Sách';
        informationFormContainer.classList.remove('hidden');
    } catch (error) {
        console.error('Lỗi lấy dữ liệu:', error);
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
 * Fetch toàn bộ bảng BookType trong CSDL vào biến allPublishers
 * sử dụng displayBookType() để hiển thị lên GUI
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
        console.error('Error fetching publishers:', error);
    }
};

// Hàm displayPublishers
export const displayBookTypes = (allbooktypes) => {
    changeArray(allbooktypes);
    tableBody.innerHTML = '';
    allbooktypes.forEach(booktype => {
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
 * nút thêm/cập nhật thể loại sách trên form
 * 
 */

export const addOrUpdateBookType = async () => {
    const inputList = informationField.querySelectorAll('input');
    const id = infoIdInput.value || '';

    let bookTypeData = {
        'name': inputList[0].value,
    }

    try {
        let response;
        if (!id) {
            response = await fetch(`${API_URL}/book_types`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookTypeData)
            });
        }
        else {
            response = await fetch(`${API_URL}/book_types/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookTypeData)
            });
        }

        if (response.ok) {
            showNotification(id ? 'Cập nhật thể loại sách thành công!' : 'Thêm thể loại sách mới thành công!');
            booktypeGUI();
        }
        else {
            const error = await response.json();
            showNotification(` Lỗi: ${error.detail}`, false);
        }
    }
    catch (error) {
        console.error(error);
        showNotification('Có lỗi đã xảy ra!', false);
    }
};