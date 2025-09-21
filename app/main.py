import os
from typing import List

from fastapi import FastAPI, Depends, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError, IntegrityError, DataError, OperationalError

from .database import get_db, Base, engine
from . import crud, schemas
from dotenv import load_dotenv

# Create database tables if they don't exist
Base.metadata.create_all(bind=engine)

api = FastAPI(
    title="API Quản lý Kho Sách",
    description="Một API đơn giản để quản lý thông tin sách với PostgreSQL.",
    version="1.0.0",
)

# ----------------------------------------
#              CORS
# ----------------------------------------
load_dotenv()
origins = os.getenv("FRONTEND_URLS", "").split(",")

api.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in origins if origin.strip()] or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------------------
#          GLOBAL ERROR HANDLERS
# ----------------------------------------

# 400 Bad Request → Request sai (dữ liệu không hợp lệ, validate fail).
# 404 Not Found → Không tìm thấy tài nguyên (ID không tồn tại).
# 409 Conflict → Trùng lặp dữ liệu (ví dụ unique constraint).
# 422 Unprocessable Entity → FastAPI hay dùng khi body JSON không khớp schema.
# 500 Internal Server Error → Lỗi không xác định trong server.
def error_response(status_code: int, code: str, message: str):
    return JSONResponse(
        status_code=status_code,
        content={"error": {"code": code, "message": message}},
    )

# Bắt lỗi HTTPException
@api.exception_handler(404)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return error_response(404, "NOT_FOUND", "Không tìm thấy tài nguyên được yêu cầu.")

# Bắt lỗi validate request body / query
@api.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return error_response(422, "VALIDATION_ERROR", "Dữ liệu không hợp lệ.")

# Bắt lỗi database IntegrityError từ SQLAlchemy
@api.exception_handler(IntegrityError)
async def integrity_error_handler(request: Request, exc: IntegrityError):
    return error_response(409, "DUPLICATE_DATA", "Dữ liệu bị trùng.")

# Bắt lỗi DataError từ SQLAlchemy
@api.exception_handler(DataError)
async def sqlalchemy_dataerror(request: Request, exc: DataError):
    return error_response(400, "DATA_TOO_LONG", "Dữ liệu nhập vào vượt quá giới hạn.")

# Bắt lỗi OperationalError từ SQLAlchemy
@api.exception_handler(OperationalError)
async def sqlalchemy_operational_error(request: Request, exc: OperationalError):
    return error_response(500, "DB_OPERATIONAL_ERROR", "Database không hoạt động.")

# Bắt lỗi tổng quát
@api.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    return error_response(500, "INTERNAL_SERVER_ERROR", "Lỗi hệ thống, vui lòng thử lại sau.")

# ----------------------------------------
#              BOOK TYPES ENDPOINTS
# ----------------------------------------

@api.post("/book_types", response_model=schemas.BookType, status_code=201, summary="Thêm loại sách mới")
def create_book_type(book_type: schemas.BookTypeBase, db: Session = Depends(get_db)):
    return crud.create_book_type_db(db, book_type)

@api.get("/book_types", response_model=List[schemas.BookTypeWithAmount], summary="Lấy tất cả loại sách")
def get_all_book_types(db: Session = Depends(get_db)):
    return crud.get_all_book_types_db(db)
    
@api.get("/book_types/{book_type_id}", response_model=schemas.BookType, summary="Tìm loại sách theo ID")
def get_book_type_by_id(book_type_id: int, db: Session = Depends(get_db)):
    book_type = crud.get_book_type_by_id_db(book_type_id, db)
    return book_type

@api.get("/book_types/search/name", response_model = List[schemas.BookType], summary="Tìm loại sách theo tên loại")
def get_book_type_by_name(book_type_name: str, db: Session = Depends(get_db)):
    book_types = crud.get_book_type_by_name_db(book_type_name, db)
    return book_types

@api.patch("/book_types/{book_type_id}", response_model=schemas.BookTypeBase, summary="Cập nhật loại sách")
def update_book_type(book_type_id: int, book_type: schemas.BookTypeBase, db: Session = Depends(get_db)):
    updated_book_type = crud.update_book_type_db(book_type_id, book_type, db)
    if updated_book_type is None:
        raise HTTPException(status_code=404)
    return updated_book_type

@api.delete("/book_types/{book_type_id}", summary="Xóa loại sách")
def delete_book_type(book_type_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_book_type_db(book_type_id, db)
    if deleted is None: 
        raise HTTPException(status_code = 404)
    return {"message": f"Đã xóa thể loại sách {deleted}"}

# ----------------------------------------
#              PUBLISHERS ENDPOINTS
# ----------------------------------------

@api.post("/publishers", response_model=schemas.Publisher, status_code=201, summary="Thêm nhà xuất bản mới")
def create_publisher(publisher: schemas.PublisherBase, db: Session = Depends(get_db)):
    return crud.create_publisher_db(publisher, db)

@api.get("/publishers", response_model=List[schemas.PublisherWithAmount], summary="Lấy tất cả nhà xuất bản")
def get_all_publishers(db: Session = Depends(get_db)):
    return crud.get_all_publishers_db(db)

@api.get("/publishers/{publisher_id}", response_model=schemas.Publisher, summary="Tìm nhà xuất bản theo ID")
def get_publisher_by_id(publisher_id: int, db: Session = Depends(get_db)):
    publisher = crud.get_publisher_by_id_db(publisher_id, db)
    return publisher

@api.get("/publishers/search/name", response_model=List[schemas.Publisher], summary="Tìm nhà xuất bản theo tên")
def get_publisher_by_name(publisher_name: str, db: Session=Depends(get_db)):
    model_publishers = crud.get_publisher_by_name_db(publisher_name, db)
    return model_publishers

@api.patch("/publishers/{publisher_id}", response_model=schemas.PublisherBase, summary="Cập nhật nhà xuất bản")
def update_publisher(publisher_id: int, publisher: schemas.PublisherBase, db: Session = Depends(get_db)):
    updated_publisher = crud.update_publisher_db( publisher_id, publisher, db)
    if updated_publisher is None:
        raise HTTPException(status_code=404)
    return updated_publisher

@api.delete("/publishers/{publisher_id}", summary="Xóa nhà xuất bản")
def delete_publisher(publisher_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_publisher_db(publisher_id, db)
    if deleted is None:
        raise HTTPException(status_code=404)
    return {"message": f"Đã xóa NXB {deleted}"}

# ----------------------------------------
#                 BOOKS ENDPOINTS
# ----------------------------------------

@api.post("/books", response_model=schemas.Book, status_code=201, summary="Thêm sách mới")
def create_book(book: schemas.BookBase, db: Session = Depends(get_db)):
    return crud.create_book_db(book, db)

@api.get("/books", response_model=List[schemas.BookWithNames], summary="Lấy tất cả sách với tên liên kết")
def get_all_books(db: Session = Depends(get_db)):
    books = crud.get_all_books_db(db)
    return convert_books_to_book_with_names(books)

@api.get("/books/{book_id}", response_model=schemas.Book, summary="Tìm sách theo ID")
def get_book_by_id(book_id: int, db:Session = Depends(get_db)):
    book = crud.get_book_by_id_db(book_id, db)
    return book

@api.patch("/books/{book_id}", response_model=schemas.BookBase, summary="Cập nhật sách")
def update_book(book_id: int, book: schemas.BookBase, db: Session = Depends(get_db)):
    updated_book = crud.update_book_db(book_id, book, db)
    if updated_book is None:
        raise HTTPException(status_code=404)
    return updated_book

@api.delete("/books/{book_id}", summary="Xóa sách")
def delete_book(book_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_book_db(book_id, db)
    if deleted is None:
        raise HTTPException(status_code=404)
    return {"message": f"Đã xóa sách {deleted}"}

@api.get("/books/search/name", response_model=List[schemas.BookWithNames], summary="Tìm sách theo tên sách")
def get_books_by_name(book_name: str, db: Session = Depends(get_db)):
    books = crud.get_books_by_name_db(book_name, db)
    return convert_books_to_book_with_names(books)

@api.get("/books/search/author", response_model=List[schemas.BookWithNames], summary="Tìm sách theo tên tác giả")
def get_books_by_author(author: str, db: Session = Depends(get_db)):
    books = crud.get_books_by_author_db(author, db)
    return convert_books_to_book_with_names(books)

@api.get("/books/search/publisher", response_model=List[schemas.BookWithNames], summary="Tìm sách theo tên nhà xuất bản")
def get_books_by_publisher_name(publisher_name: str, db: Session = Depends(get_db)):
    books = crud.get_books_by_publisher_name_db(publisher_name, db)
    return convert_books_to_book_with_names(books)

@api.get("/books/search/type", response_model=List[schemas.BookWithNames], summary="Tìm sách theo tên loại sách")
def get_books_by_type_name(book_type_name: str, db: Session = Depends(get_db)):
    books = crud.get_books_by_type_name_db(book_type_name, db)
    return convert_books_to_book_with_names(books)

def convert_books_to_book_with_names(books: List[schemas.Book]) -> List[schemas.BookWithNames]:
    book_with_names = []
    for book in books:
        book_type_name = book.book_type.name if book.book_type else None
        publisher_name = book.publisher.name if book.publisher else None
        book_with_names.append(schemas.BookWithNames(
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
    return book_with_names