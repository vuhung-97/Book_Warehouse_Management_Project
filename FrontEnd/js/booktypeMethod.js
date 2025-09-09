const informationField = document.getElementById('field-info');
const informationFormContainer = document.getElementById('information-form-container');
const titleForm = informationFormContainer.getElementsByTagName('h3')[0];
const submitBtn = document.getElementById('submit-btn');
const infoIdInput = document.getElementById('info-id');

// hiển thị thông tin loại sách
export const showInfoBookType = (booktype) => {
    const inputList = informationField.querySelectorAll('input');

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
