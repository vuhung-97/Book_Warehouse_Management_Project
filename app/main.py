from typing import List, Optional
from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from .database import get_db, Base, engine
from . import crud, schemas
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Create database tables if they don't exist
Base.metadata.create_all(bind=engine)

api = FastAPI(
    title="API Quản lý Kho Sách",
    description="Một API đơn giản để quản lý thông tin sách với PostgreSQL.",
    version="1.0.0"
)

# Cấu hình CORS để cho phép các yêu cầu từ frontend
load_dotenv()

origins = os.getenv("FRONTEND_URLS", "").split(",")

api.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in origins if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ----------------------------------------
#              BOOK TYPES ENDPOINTS
# ----------------------------------------

@api.post("/book_types", response_model=schemas.BookType, status_code=201, summary="Thêm loại sách mới")
def create_book_type(book_type: schemas.BookTypeBase, db: Session = Depends(get_db)):
    try:
        return crud.create_book_type_db(db, book_type)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Lỗi: {e}")

@api.get("/book_types", response_model=List[schemas.BookTypeWithAmount], summary="Lấy tất cả loại sách")
def get_all_book_types(db: Session = Depends(get_db)):
    return crud.get_all_book_types_db(db)
    
@api.get("/book_types/{book_type_id}", response_model=schemas.BookType, summary="Tìm loại sách theo ID")
def get_book_type_by_id(book_type_id: int, db: Session = Depends(get_db)):
    book_type = crud.get_book_type_by_id_db(book_type_id, db)
    if not book_type:
        raise HTTPException(status_code=404, detail="Không tìm thấy loại sách")
    return book_type

@api.get("/book_types/search/name", response_model = List[schemas.BookType], summary="Tìm loại sách theo tên loại")
def get_book_type_by_name(book_type_name: str, db: Session = Depends(get_db)):
    book_types = crud.get_book_type_by_name_db(book_type_name, db)
    if not book_types:
        raise HTTPException(status_code=404, detail="Không tìm thấy loại sách")
    return book_types

@api.patch("/book_types/{book_type_id}", response_model=schemas.BookTypeBase, summary="Cập nhật loại sách")
def update_book_type(book_type_id: int, book_type: schemas.BookTypeBase, db: Session = Depends(get_db)):
    updated_book_type = crud.update_book_type_db(book_type_id, book_type, db)
    if not updated_book_type:
        raise HTTPException(status_code=404, detail="Không tìm thấy loại sách")
    return updated_book_type

@api.delete("/book_types/{book_type_id}", summary="Xóa loại sách")
def delete_book_type(book_type_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_book_type_db(book_type_id, db)
    if not deleted:
        raise HTTPException(status_code=404, detail="Không tìm thấy loại sách")
    return {"message": "Loại sách đã được xóa thành công"}

# ----------------------------------------
#              PUBLISHERS ENDPOINTS
# ----------------------------------------

@api.post("/publishers", response_model=schemas.Publisher, status_code=201, summary="Thêm nhà xuất bản mới")
def create_publisher(publisher: schemas.PublisherBase, db: Session = Depends(get_db)):
    try:
        return crud.create_publisher_db(publisher, db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Lỗi: {e}")

@api.get("/publishers", response_model=List[schemas.PublisherWithAmount], summary="Lấy tất cả nhà xuất bản")
def get_all_publishers(db: Session = Depends(get_db)):
    return crud.get_all_publishers_db(db)

@api.get("/publishers/{publisher_id}", response_model=schemas.Publisher, summary="Tìm nhà xuất bản theo ID")
def get_publisher_by_id(publisher_id: int, db: Session = Depends(get_db)):
    publisher = crud.get_publisher_by_id_db(publisher_id, db)
    if not publisher:
        raise HTTPException(status_code=404, detail="Không tìm thấy nhà xuất bản")
    return publisher

@api.get("/publishers/search/name", response_model=List[schemas.Publisher], summary="Tìm nhà xuất bản theo tên")
def get_publisher_by_name(publisher_name: str, db: Session=Depends(get_db)):
    model_publishers = crud.get_publisher_by_name_db(publisher_name, db)
    if not model_publishers:
        raise HTTPException(status_code=404, detail="Không tìm thấy nhà xuất bản")
    return model_publishers

@api.patch("/publishers/{publisher_id}", response_model=schemas.PublisherBase, summary="Cập nhật nhà xuất bản")
def update_publisher(publisher_id: int, publisher: schemas.PublisherBase, db: Session = Depends(get_db)):
    updated_publisher = crud.update_publisher_db( publisher_id, publisher, db)
    if not updated_publisher:
        raise HTTPException(status_code=404, detail="Không tìm thấy nhà xuất bản")
    return updated_publisher

@api.delete("/publishers/{publisher_id}", summary="Xóa nhà xuất bản")
def delete_publisher(publisher_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_publisher_db(publisher_id, db)
    if not deleted:
        raise HTTPException(status_code=404, detail="Không tìm thấy nhà xuất bản")
    return {"message": "Nhà xuất bản đã được xóa thành công"}

# ----------------------------------------
#                 BOOKS ENDPOINTS
# ----------------------------------------

@api.post("/books", response_model=schemas.Book, status_code=201, summary="Thêm sách mới")
def create_book(book: schemas.BookBase, db: Session = Depends(get_db)):
    try:
        return crud.create_book_db(book, db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Lỗi: {e}")

@api.get("/books", response_model=List[schemas.BookWithNames], summary="Lấy tất cả sách với tên liên kết")
def get_all_books(db: Session = Depends(get_db)):
    books_with_names = []
    books = crud.get_all_books_db(db)
    for book in books:
        book_type_name = book.book_type.name if book.book_type else None
        publisher_name = book.publisher.name if book.publisher else None
        books_with_names.append(schemas.BookWithNames(
            id=book.id,
            name=book.name,
            author=book.author,
            year=book.year,
            amount=book.amount,
            price=book.price,
            image=book.image,
            description=book.description,
            publisher_name=publisher_name,
            book_type_name=book_type_name
        ))
    return books_with_names

@api.get("/books/{book_id}", response_model=schemas.Book, summary="Tìm sách theo ID")
def get_book_by_id(book_id: int, db:Session = Depends(get_db)):
    book = crud.get_book_by_id_db(book_id, db)
    if not book:
        raise HTTPException(status_code=404, detail="Không tìm thấy sách")
    return book

@api.get("/books/add_name{book_id}", response_model=schemas.BookWithNames, summary="Tìm sách theo ID với tên liên kết")
def get_book_by_id(book_id: int, db: Session = Depends(get_db)):
    book = crud.get_book_by_id_db(book_id, db)
    if not book:
        raise HTTPException(status_code=404, detail="Không tìm thấy sách")

    book_type_name = book.book_type.name if book.book_type else None
    publisher_name = book.publisher.name if book.publisher else None
    
    return schemas.BookWithNames(
        id=book.id,
        name=book.name,
        author=book.author,
        year=book.year,
        amount=book.amount,
        price=book.price,
        image=book.image,
        description=book.description,
        publisher_name=publisher_name,
        book_type_name=book_type_name
    )

@api.patch("/books/{book_id}", response_model=schemas.BookBase, summary="Cập nhật sách")
def update_book(book_id: int, updated_book: schemas.BookBase, db: Session = Depends(get_db)):
    book = crud.update_book_db(book_id, updated_book, db)
    if not book:
        raise HTTPException(status_code=404, detail="Không tìm thấy sách")
    return book

@api.delete("/books/{book_id}", summary="Xóa sách")
def delete_book(book_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_book_db(book_id, db)
    if not deleted:
        raise HTTPException(status_code=404, detail="Không tìm thấy sách")
    return {"message": "Sách đã được xóa thành công"}

@api.get("/books/search/name", response_model=List[schemas.BookWithNames], summary="Tìm sách theo tên sách")
def get_books_by_name(book_name: str, db: Session = Depends(get_db)):
    books = crud.get_books_by_name_db(book_name, db)
    if not books:
        raise HTTPException(status_code=404, detail="Không tìm thấy sách nào cho tên này")
    
    books_with_names = []
    for book in books:
        book_type_name = book.book_type.name if book.book_type else None
        publisher_name = book.publisher.name if book.publisher else None
        books_with_names.append(schemas.BookWithNames(
            id=book.id,
            name=book.name,
            author=book.author,
            year=book.year,
            amount=book.amount,
            price=book.price,
            image=book.image,
            description=book.description,
            publisher_name=publisher_name,
            book_type_name=book_type_name
        ))
    return books_with_names

@api.get("/books/search/author", response_model=List[schemas.BookWithNames], summary="Tìm sách theo tên tác giả")
def get_books_by_author(author: str, db: Session = Depends(get_db)):
    books = crud.get_books_by_author_db(author, db)
    if not books:
        raise HTTPException(status_code=404, detail="Không tìm thấy sách nào cho tác giả này")
    
    books_with_names = []
    for book in books:
        book_type_name = book.book_type.name if book.book_type else None
        publisher_name = book.publisher.name if book.publisher else None
        books_with_names.append(schemas.BookWithNames(
            id=book.id,
            name=book.name,
            author=book.author,
            year=book.year,
            amount=book.amount,
            price=book.price,
            image=book.image,
            description=book.description,
            publisher_name=publisher_name,
            book_type_name=book_type_name
        ))
    return books_with_names

@api.get("/books/search/publisher", response_model=List[schemas.BookWithNames], summary="Tìm sách theo tên nhà xuất bản")
def get_books_by_publisher_name(publisher_name: str, db: Session = Depends(get_db)):
    books = crud.get_books_by_publisher_name_db(publisher_name, db)
    if not books:
        raise HTTPException(status_code=404, detail="Không tìm thấy sách nào cho nhà xuất bản này")
    
    books_with_names = []
    for book in books:
        book_type_name = book.book_type.name if book.book_type else None
        publisher_name = book.publisher.name if book.publisher else None
        books_with_names.append(schemas.BookWithNames(
            id=book.id,
            name=book.name,
            author=book.author,
            year=book.year,
            amount=book.amount,
            price=book.price,
            image=book.image,
            description=book.description,
            publisher_name=publisher_name,
            book_type_name=book_type_name
        ))
    return books_with_names

@api.get("/books/search/type", response_model=List[schemas.BookWithNames], summary="Tìm sách theo tên loại sách")
def get_books_by_type_name(book_type_name: str, db: Session = Depends(get_db)):
    books = crud.get_books_by_type_name_db(book_type_name, db)
    if not books:
        raise HTTPException(status_code=404, detail="Không tìm thấy sách nào cho loại sách này")
    
    books_with_names = []
    for book in books:
        book_type_name = book.book_type.name if book.book_type else None
        publisher_name = book.publisher.name if book.publisher else None
        books_with_names.append(schemas.BookWithNames(
            id=book.id,
            name=book.name,
            author=book.author,
            year=book.year,
            amount=book.amount,
            price=book.price,
            image=book.image,
            description=book.description,
            publisher_name=publisher_name,
            book_type_name=book_type_name
        ))
    return books_with_names

@api.get("/books/search/publisher_id", response_model=List[schemas.BookWithNames], summary="Tìm sách theo ID nhà xuất bản")
def get_books_by_publisher_id(publisher_id: int, db: Session = Depends(get_db)):
    books = crud.get_books_by_publisher_id_db(publisher_id, db)
    if not books:
        raise HTTPException(status_code=404, detail="Không tìm thấy sách nào cho nhà xuất bản này")
    
    books_with_names = []
    for book in books:
        book_type_name = book.book_type.name if book.book_type else None
        publisher_name = book.publisher.name if book.publisher else None
        books_with_names.append(schemas.BookWithNames(
            id=book.id,
            name=book.name,
            author=book.author,
            year=book.year,
            amount=book.amount,
            price=book.price,
            image=book.image,
            description=book.description,
            publisher_name=publisher_name,
            book_type_name=book_type_name
        ))
    return books_with_names

@api.get("/books/search/type_id", response_model=List[schemas.BookWithNames], summary="Tìm sách theo ID loại sách")
def get_books_by_type_id(type_id: int, db: Session = Depends(get_db)):
    books = crud.get_books_by_type_id_db(type_id, db)
    if not books:
        raise HTTPException(status_code=404, detail="Không tìm thấy sách nào cho loại sách này")
    
    books_with_names = []
    for book in books:
        book_type_name = book.book_type.name if book.book_type else None
        publisher_name = book.publisher.name if book.publisher else None
        books_with_names.append(schemas.BookWithNames(
            id=book.id,
            name=book.name,
            author=book.author,
            year=book.year,
            amount=book.amount,
            price=book.price,
            image=book.image,
            description=book.description,
            publisher_name=publisher_name,
            book_type_name=book_type_name
        ))
    return books_with_names