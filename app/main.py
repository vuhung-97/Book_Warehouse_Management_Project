from typing import List, Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from .crud import (
    BookType,
    Publisher,
    Book,
    BookWithNames,
    create_book_type_db, 
    get_all_book_types_db, 
    get_book_type_by_id_db, 
    get_book_type_by_name_db, 
    update_book_type_db, 
    delete_book_type_db,
    create_publisher_db, 
    get_all_publishers_db, 
    get_publisher_by_id_db,
    get_publisher_by_name_db, 
    update_publisher_db, 
    delete_publisher_db,
    create_book_db, 
    get_all_books_with_names_db, 
    get_book_by_id_with_names_db,
    update_book_db, 
    delete_book_db, 
    get_books_by_name_db, 
    get_books_by_author_db, 
    get_books_by_publisher_name_db, 
    get_books_by_type_name_db, 
    get_books_by_publisher_id_db, 
    get_books_by_type_id_db
)

app = FastAPI(
    title="API Quản lý Kho Sách",
    description="Một API đơn giản để quản lý thông tin sách với PostgreSQL.",
    version="1.0.0"
)

# ----------------------------------------
#              BOOK TYPES ENDPOINTS
# ----------------------------------------

@app.post("/book_types", response_model=BookType, status_code=201, summary="Thêm loại sách mới")
def create_book_type(book_type: BookType):
    try:
        return create_book_type_db(book_type)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@app.get("/book_types", response_model=List[BookType], summary="Lấy tất cả loại sách")
def get_all_book_types():
    try:
        return get_all_book_types_db()
    except Exception:
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
        
@app.get("/book_types/{book_type_id}", response_model=BookType, summary="Tìm loại sách theo ID")
def get_book_type_by_id(book_type_id: int):
    try:
        book_type = get_book_type_by_id_db(book_type_id)
        if not book_type:
            raise HTTPException(status_code=404, detail="Không tìm thấy loại sách")
        return book_type
    except Exception:
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
    
@app.get("/book_types/search", response_model=BookType, summary="Tìm loại sách theo tên")
def get_book_type_by_name(name: str):
    try:
        book_type = get_book_type_by_name_db(name)
        if not book_type:
            raise HTTPException(status_code=404, detail="Không tìm thấy loại sách")
        return book_type
    except Exception:
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@app.put("/book_types/{book_type_id}", response_model=BookType, summary="Cập nhật loại sách")
def update_book_type(book_type_id: int, book_type: BookType):
    try:
        updated_book_type = update_book_type_db(book_type_id, book_type.name)
        if not updated_book_type:
            raise HTTPException(status_code=404, detail="Không tìm thấy loại sách")
        return updated_book_type
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@app.delete("/book_types/{book_type_id}", summary="Xóa loại sách")
def delete_book_type(book_type_id: int):
    try:
        deleted = delete_book_type_db(book_type_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Không tìm thấy loại sách")
        return {"message": "Loại sách đã được xóa thành công"}
    except Exception:
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

# ----------------------------------------
#              PUBLISHERS ENDPOINTS
# ----------------------------------------

@app.post("/publishers", response_model=Publisher, status_code=201, summary="Thêm nhà xuất bản mới")
def create_publisher(publisher: Publisher):
    try:
        return create_publisher_db(publisher)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@app.get("/publishers", response_model=List[Publisher], summary="Lấy tất cả nhà xuất bản")
def get_all_publishers():
    try:
        return get_all_publishers_db()
    except Exception:
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@app.get("/publishers/{publisher_id}", response_model=Publisher, summary="Tìm nhà xuất bản theo ID")
def get_publisher_by_id(publisher_id: int):
    try:
        publisher = get_publisher_by_id_db(publisher_id)
        if not publisher:
            raise HTTPException(status_code=404, detail="Không tìm thấy nhà xuất bản")
        return publisher
    except Exception:
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@app.get("/publishers/search", response_model=Publisher, summary="Tìm nhà xuất bản theo tên")
def get_publisher_by_name(name: str):
    try:
        publisher = get_publisher_by_name_db(name)
        if not publisher:
            raise HTTPException(status_code=404, detail="Không tìm thấy nhà xuất bản")
        return publisher
    except Exception:
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@app.put("/publishers/{publisher_id}", response_model=Publisher, summary="Cập nhật nhà xuất bản")
def update_publisher(publisher_id: int, publisher: Publisher):
    try:
        updated_publisher = update_publisher_db(publisher_id, publisher)
        if not updated_publisher:
            raise HTTPException(status_code=404, detail="Không tìm thấy nhà xuất bản")
        return updated_publisher
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@app.delete("/publishers/{publisher_id}", summary="Xóa nhà xuất bản")
def delete_publisher(publisher_id: int):
    try:
        deleted = delete_publisher_db(publisher_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Không tìm thấy nhà xuất bản")
        return {"message": "Nhà xuất bản đã được xóa thành công"}
    except Exception:
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

# ----------------------------------------
#                 BOOKS ENDPOINTS
# ----------------------------------------

@app.post("/books", response_model=Book, status_code=201, summary="Thêm sách mới")
def create_book(book: Book):
    try:
        return create_book_db(book)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@app.get("/books", response_model=List[BookWithNames], summary="Lấy tất cả sách với tên liên kết")
def get_all_books():
    try:
        return get_all_books_with_names_db()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi server nội bộ: {e}")

@app.get("/books/{book_id}", response_model=BookWithNames, summary="Tìm sách theo ID với tên liên kết")
def get_book_by_id(book_id: int):
    try:
        book = get_book_by_id_with_names_db(book_id)
        if not book:
            raise HTTPException(status_code=404, detail="Không tìm thấy sách")
        return book
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi server nội bộ: {e}")

@app.put("/books/{book_id}", response_model=Book, summary="Cập nhật sách")
def update_book(book_id: int, updated_book: Book):
    try:
        book = update_book_db(book_id, updated_book)
        if not book:
            raise HTTPException(status_code=404, detail="Không tìm thấy sách")
        return book
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@app.delete("/books/{book_id}", summary="Xóa sách")
def delete_book(book_id: int):
    try:
        deleted = delete_book_db(book_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Không tìm thấy sách")
        return {"message": "Sách đã được xóa thành công"}
    except Exception:
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@app.get("/books/search/name", response_model=List[BookWithNames], summary="Tìm sách theo tên sách")
def get_books_by_name(book_name: str):
    try:
        books = get_books_by_name_db(book_name)
        if not books:
            raise HTTPException(status_code=404, detail="Không tìm thấy sách nào cho tên này")
        return books
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi server nội bộ: {e}")

@app.get("/books/search/author", response_model=List[BookWithNames], summary="Tìm sách theo tên tác giả")
def get_books_by_author(author: str):
    try:
        books = get_books_by_author_db(author)
        if not books:
            raise HTTPException(status_code=404, detail="Không tìm thấy sách nào cho tác giả này")
        return books
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi server nội bộ: {e}")

@app.get("/books/search/publisher", response_model=List[BookWithNames], summary="Tìm sách theo tên nhà xuất bản")
def get_books_by_publisher_name(publisher_name: str):
    try:
        books = get_books_by_publisher_name_db(publisher_name)
        if not books:
            raise HTTPException(status_code=404, detail="Không tìm thấy sách nào cho nhà xuất bản này")
        return books
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi server nội bộ: {e}")

@app.get("/books/search/type", response_model=List[BookWithNames], summary="Tìm sách theo tên loại sách")
def get_books_by_type_name(book_type_name: str):
    try:
        books = get_books_by_type_name_db(book_type_name)
        if not books:
            raise HTTPException(status_code=404, detail="Không tìm thấy sách nào cho loại sách này")
        return books
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi server nội bộ: {e}")
    
@app.get("/books/search/publisher_id", response_model=List[BookWithNames], summary="Tìm sách theo ID nhà xuất bản")
def get_books_by_publisher_id(publisher_id: int):
    try:
        books = get_books_by_publisher_id_db(publisher_id)
        if not books:
            raise HTTPException(status_code=404, detail="Không tìm thấy sách nào cho nhà xuất bản này")
        return books
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi server nội bộ: {e}")
    
@app.get("/books/search/type_id", response_model=List[BookWithNames], summary="Tìm sách theo ID loại sách")
def get_books_by_type_id(type_id: int):
    try:
        books = get_books_by_type_id_db(type_id)
        if not books:
            raise HTTPException(status_code=404, detail="Không tìm thấy sách nào cho loại sách này")
        return books
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi server nội bộ: {e}")
