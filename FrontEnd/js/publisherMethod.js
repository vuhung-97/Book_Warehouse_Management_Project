const informationField = document.getElementById('field-info');
const informationFormContainer = document.getElementById('information-form-container');
const titleForm = informationFormContainer.getElementsByTagName('h3')[0];
const submitBtn = document.getElementById('submit-btn');
const infoIdInput = document.getElementById('info-id');

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
