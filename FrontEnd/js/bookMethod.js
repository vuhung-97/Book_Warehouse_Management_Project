const informationField = document.getElementById('field-info');
const publisherSelect = document.getElementById('book-publisher-select');
const bookTypeSelect = document.getElementById('book-type-select');
const informationFormContainer = document.getElementById('information-form-container');
const titleForm = informationFormContainer.getElementsByTagName('h3')[0];
const submitBtn = document.getElementById('submit-btn');
const infoIdInput = document.getElementById('info-id');

// Hiển thị thông tin sách
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