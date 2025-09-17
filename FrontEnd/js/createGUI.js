const titleHeader = document.getElementById("title-header");
const showFormBtn = document.getElementById("show-form-btn");
const tr = document.querySelector("#main-table tr");
const paginationContainer = document.querySelector("div.pagination");
const informationFormContainer = document.getElementById(
  "information-form-container"
);
const titleForm = informationFormContainer.getElementsByTagName("h3")[0];
const informationField = document.getElementById("field-info");
const publisherInfo = document.getElementById("pub-info");
const booktypeInfo = document.getElementById("type-info");
const searchContainer = document.getElementById("search-container");

export const tableBody = document.querySelector("#main-table tbody");

export const CreateBookTypeGUI = () => {
  titleHeader.innerText = "Danh sách thể loại sách";
  paginationContainer.classList.add("hidden");
  publisherInfo.classList.add("hidden");
  booktypeInfo.classList.add("hidden");
  searchContainer.classList.add("hidden");
  showFormBtn.querySelector("label").textContent = "Thêm thể loại mới";
  tr.innerHTML = `
                        <th width="10%"><label data-key="id">ID</label></th>
                        <th width="50%"><label data-key="name">Thể loại</label></th>
                        <th width="20%"><label data-key="amount">Số lượng đầu sách</label></th>
                        <th width="20%"></th>
                    `;
  titleForm.innerText = "Thêm/Cập nhật thể loại sách mới";
  informationField.innerHTML = `
                        <div class="input-group">
                                <input type="text" id="book-type-name" placeholder=" " required>
                                <label for="book-type-name">Tên thể loại</label>
                            </div>
                        `;
};

export const CreateBookGUI = () => {
  titleHeader.innerText = "Danh sách sách trong kho";
  paginationContainer.classList.remove("hidden");
  publisherInfo.classList.remove("hidden");
  booktypeInfo.classList.remove("hidden");
  searchContainer.classList.remove("hidden");
  showFormBtn.querySelector("label").textContent = "Thêm sách mới";
  tr.innerHTML = `
                        <th width="6%"><label data-key="id">ID</label></th>
                        <th width="27%"><label data-key="name">Tên sách</label></th>
                        <th width="13%"><label data-key="author">Tác giả</label></th>
                        <th width="7%"><label data-key="year">Năm XB</label></th>
                        <th width="7%"><label data-key="amount">Số lượng</label></th>
                        <th width="10%"><label data-key="price">Đơn giá</label></th>
                        <th width="10%"><label data-key="publisher_name">Nhà xuất bản</label></th>
                        <th width="10%"><label data-key="book_type_name">Thể loại</label></th>
                        <th width="10%"> </th>
                    `;
  titleForm.innerText = "Thêm/Cập nhật sách mới";
  informationField.innerHTML = `                        
                            <legend>Thông tin Sách</legend>
                            <div class="input-group">
                                <input type="text" id="book-name" placeholder=" " required>
                                <label for="book-name">Tên sách</label>
                            </div>

                            <div class="input-group">
                                <input type="text" id="book-author" placeholder=" ">
                                <label for="book-author">Tên tác giả</label>
                            </div>

                            <div class="input-group">
                                <input type="number" id="book-year" placeholder=" ">
                                <label for="book-year">Năm xuất bản</label>
                            </div>

                            <div class="input-group">
                                <input type="number" id="book-amount" placeholder=" ">
                                <label for="book-amount">Số lượng</label>
                            </div>

                            <div class="input-group">
                                <input type="number" id="book-price" placeholder=" ">
                                <label for="book-price">Đơn giá sách</label>
                            </div>

                            <div class="input-group">
                                <input type="text" id="book-image" placeholder=" ">
                                <label for="book-image">URL hình ảnh</label>
                            </div>

                            <div class="input-group">
                                <textarea id="book-description" placeholder=""></textarea>
                                <label for="book-description">Mô tả sách</label>
                            </div>
                    `;
};

export const CreatePublisherGUI = () => {
  titleHeader.innerText = "Danh sách Nhà xuất bản";
  paginationContainer.classList.add("hidden");
  publisherInfo.classList.add("hidden");
  booktypeInfo.classList.add("hidden");
  searchContainer.classList.add("hidden");
  showFormBtn.querySelector("label").textContent = "Thêm NXB mới";
  tr.innerHTML = `
                            <th width="10%"><label data-key="id">ID</label></th>
                            <th width="20%"><label data-key="name">Nhà xuất bản</label></th>
                            <th width="30%"><label data-key="address">Địa chỉ</label></th>
                            <th width="20%"><label data-key="tax_code">Mã số thuế</label></th>
                            <th width="10%"><label data-key="amount">Số lượng đầu sách</label></th>
                            <th width="10%"></th>
                        `;
  titleForm.innerText = "Thêm/Cập nhật NXB mới";
  informationField.innerHTML = `                        
                            <legend>Thông tin NXB</legend>
                            <div class="input-group">
                                <input type="text" id="publisher-name" placeholder=" " required>
                                <label for="publisher-name">Tên NXB</label>
                            </div>
                            
                            <div class="input-group">
                                <input type="text" id="publisher-address" placeholder=" " required>
                                <label for="publisher-address">Địa chỉ</label>
                            </div>
                            
                            <div class="input-group">
                                <input type="text" id="publisher-tax-code" placeholder=" " required>
                                <label for="publisher-tax-code">Mã số thuế</label>
                            </div>
                            `;
};
