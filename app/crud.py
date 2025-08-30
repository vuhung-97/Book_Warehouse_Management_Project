import psycopg2
from typing import List, Optional
from pydantic import BaseModel, Field
from .database import create_connection

# --- Pydantic Models ---
class BookType(BaseModel):
    id: Optional[int]
    name: str

class Publisher(BaseModel):
    id: Optional[int]
    name: str
    address: Optional[str]
    tax_code: Optional[str]

class Book(BaseModel):
    id: Optional[int]
    name: str
    author: Optional[str]
    year: Optional[int]
    amount: Optional[int] = 0
    price: Optional[float] = 0.00
    image: Optional[str]
    description: Optional[str]
    publisher_id: Optional[int]
    book_type_id: Optional[int]

class BookWithNames(BaseModel):
    id: int
    name: str
    author: Optional[str]
    year: Optional[int]
    amount: Optional[int]
    price: Optional[float]
    image: Optional[str]
    description: Optional[str]
    publisher_name: Optional[str] = Field(None, description="Tên nhà xuất bản")
    book_type_name: Optional[str] = Field(None, description="Tên loại sách")

# ----------------------------------------
#               BOOK TYPES CRUD
# ----------------------------------------

def create_book_type_db(book_type: BookType) -> BookType:
    conn = create_connection()
    if not conn:
        raise Exception("Không thể kết nối database")
    try:
        with conn.cursor() as cur:
            cur.execute("""
                        INSERT INTO book_types (name) 
                        VALUES (%s) 
                        RETURNING id;
                        """, (book_type.name,))
            book_type.id = cur.fetchone()[0]
            conn.commit()
            return book_type
    except psycopg2.IntegrityError:
        raise ValueError("Loại sách đã tồn tại.")
    finally:
        conn.close()

def get_all_book_types_db() -> List[BookType]:
    conn = create_connection()
    if not conn:
        raise Exception("Không thể kết nối database")
    try:
        with conn.cursor() as cur:
            cur.execute("""
                        SELECT id, name 
                        FROM book_types;
                        """)
            rows = cur.fetchall()
            book_types = [
                BookType(
                    id=row[0], 
                    name=row[1]
                ) for row in rows
            ]
            return book_types
    finally:
        conn.close()

def get_book_type_by_id_db(book_type_id: int) -> Optional[BookType]:
    conn = create_connection()
    if not conn:
        raise Exception("Không thể kết nối database")
    try:
        with conn.cursor() as cur:
            cur.execute("""
                        SELECT id, name 
                        FROM book_types 
                        WHERE id = %s;
                        """, (book_type_id,))
            row = cur.fetchone()
            if row:
                return BookType(id=row[0], name=row[1])
            return None
    finally:
        conn.close()

def get_book_type_by_name_db(book_type_name: str) -> List[BookType]:
    conn = create_connection()
    if not conn:
        raise Exception("Không thể kết nối database")
    try:
        with conn.cursor() as cur:
            search_query = f"%{book_type_name}%"
            cur.execute("""
                        SELECT id, name 
                        FROM book_types 
                        WHERE name ILIKE %s;
                        """, (search_query,))
            rows = cur.fetchall()
            book_types = [BookType(id=row[0], name=row[1]) for row in rows]
            return book_types
    finally:
        conn.close()

def update_book_type_db(book_type_id: int, new_name: str) -> Optional[BookType]:
    conn = create_connection()
    if not conn:
        raise Exception("Không thể kết nối database")
    try:
        with conn.cursor() as cur:
            cur.execute("""
                        UPDATE book_types 
                        SET name = %s 
                        WHERE id = %s 
                        RETURNING id, name;
                        """, (new_name, book_type_id))
            row = cur.fetchone()
            if row:
                conn.commit()
                return BookType(id=row[0], name=row[1])
            return None
    except psycopg2.IntegrityError:
        raise ValueError("Loại sách đã tồn tại.")
    finally:
        conn.close()

def delete_book_type_db(book_type_id: int) -> bool:
    conn = create_connection()
    if not conn:
        raise Exception("Không thể kết nối database")
    try:
        with conn.cursor() as cur:
            cur.execute("""
                        DELETE FROM book_types 
                        WHERE id = %s 
                        RETURNING id;
                        """, (book_type_id,))
            deleted = cur.fetchone() is not None
            conn.commit()
            return deleted
    finally:
        conn.close()

# ----------------------------------------
#              PUBLISHERS CRUD
# ----------------------------------------

def create_publisher_db(publisher: Publisher) -> Publisher:
    conn = create_connection()
    if not conn:
        raise Exception("Không thể kết nối database")
    try:
        with conn.cursor() as cur:
            cur.execute("""
                        INSERT INTO publishers (name, address, tax_code) 
                        VALUES (%s, %s, %s) 
                        RETURNING id;
                        """, (
                            publisher.name,
                            publisher.address,
                            publisher.tax_code)
                        )
            publisher.id = cur.fetchone()[0]
            conn.commit()
            return publisher
    except psycopg2.IntegrityError:
        raise ValueError("Nhà xuất bản đã tồn tại.")
    finally:
        conn.close()

def get_all_publishers_db() -> List[Publisher]:
    conn = create_connection()
    if not conn:
        raise Exception("Không thể kết nối database")
    try:
        with conn.cursor() as cur:
            cur.execute("""
                        SELECT id, name, address, tax_code 
                        FROM publishers;
                        """)
            rows = cur.fetchall()
            publishers = [
                Publisher(
                    id=row[0], 
                    name=row[1], 
                    address=row[2], 
                    tax_code=row[3]
                ) for row in rows
            ]
            return publishers
    finally:
        conn.close()

def get_publisher_by_id_db(publisher_id: int) -> Optional[Publisher]:
    conn = create_connection()
    if not conn:
        raise Exception("Không thể kết nối database")
    try:
        with conn.cursor() as cur:
            cur.execute("""
                        SELECT id, name, address, tax_code 
                        FROM publishers 
                        WHERE id = %s;
                        """, (publisher_id,))
            row = cur.fetchone()
            if row:
                return Publisher(id=row[0], name=row[1], address=row[2], tax_code=row[3])
            return None
    finally:
        conn.close()

def get_publisher_by_name_db(publisher_name: str) -> List[Publisher]:
    conn = create_connection()
    if not conn:
        raise Exception("Không thể kết nối database")
    try:
        with conn.cursor() as cur:
            search_query = f"%{publisher_name}%"
            cur.execute("""
                        SELECT id, name, address, tax_code 
                        FROM publishers 
                        WHERE name ILIKE %s;
                        """, (search_query,))
            rows = cur.fetchall()
            publishers = [
                Publisher(
                    id=row[0], 
                    name=row[1], 
                    address=row[2], 
                    tax_code=row[3]
                ) for row in rows
            ]
            return publishers
    finally:
        conn.close()

def update_publisher_db(publisher_id: int, new_publisher: Publisher) -> Optional[Publisher]:
    conn = create_connection()
    if not conn:
        raise Exception("Không thể kết nối database")
    try:
        with conn.cursor() as cur:
            cur.execute("""
                        UPDATE publishers 
                        SET name = %s, address = %s, tax_code = %s 
                        WHERE id = %s 
                        RETURNING id;
                        """, (
                            new_publisher.name,
                            new_publisher.address,
                            new_publisher.tax_code,
                            publisher_id)
                        )
            if cur.fetchone():
                conn.commit()
                return new_publisher
            return None
    except psycopg2.IntegrityError:
        raise ValueError("Nhà xuất bản đã tồn tại.")
    finally:
        conn.close()

def delete_publisher_db(publisher_id: int) -> bool:
    conn = create_connection()
    if not conn:
        raise Exception("Không thể kết nối database")
    try:
        with conn.cursor() as cur:
            cur.execute("""
                        DELETE FROM publishers 
                        WHERE id = %s 
                        RETURNING id;
                        """, (publisher_id,))
            deleted = cur.fetchone() is not None
            conn.commit()
            return deleted
    finally:
        conn.close()

# ----------------------------------------
#                 BOOKS CRUD
# ----------------------------------------

def create_book_db(book: Book) -> Book:
    conn = create_connection()
    if not conn:
        raise Exception("Không thể kết nối database")
    try:
        with conn.cursor() as cur:
            cur.execute("""
                        INSERT INTO books (name, author, year, amount, price, image, description, publisher_id, book_type_id)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) 
                        RETURNING id;
                        """, (
                            book.name,
                            book.author,
                            book.year,
                            book.amount,
                            book.price,
                            book.image,
                            book.description,
                            book.publisher_id,
                            book.book_type_id)
                        )
            book.id = cur.fetchone()[0]
            conn.commit()
            return book
    except psycopg2.IntegrityError:
        raise ValueError("Dữ liệu sách không hợp lệ. Vui lòng kiểm tra publisher_id và book_type_id.")
    finally:
        conn.close()

def get_all_books_db() -> List[Book]:
    conn = create_connection()
    if not conn:
        raise Exception("Không thể kết nối database")
    try:
        with conn.cursor() as cur:
            cur.execute("""
                        SELECT id, name, author, year, amount, price, image, description, publisher_id, book_type_id 
                        FROM books;
                        """)
            books = [
                Book(
                    id=row[0],
                    name=row[1],
                    author=row[2],
                    year=row[3],
                    amount=row[4],
                    price=float(row[5]),
                    image=row[6],
                    description=row[7],
                    publisher_id=row[8],
                    book_type_id=row[9]
                ) for row in cur.fetchall()
            ]
            return books
    finally:
        conn.close()

def get_all_books_with_names_db() -> List[BookWithNames]:
    conn = create_connection()
    if not conn:
        raise Exception("Không thể kết nối database")
    try:
        with conn.cursor() as cur:
            cur.execute("""
                        SELECT
                            b.id, b.name, b.author, b.year, b.amount, b.price, b.image, b.description,
                            p.name AS publisher_name, bt.name AS book_type_name
                        FROM books AS b
                        LEFT JOIN publishers AS p ON b.publisher_id = p.id
                        LEFT JOIN book_types AS bt ON b.book_type_id = bt.id;
                        """)
            rows = cur.fetchall()
            books = [
                BookWithNames(
                    id=row[0],
                    name=row[1],
                    author=row[2],
                    year=row[3],
                    amount=row[4],
                    price=float(row[5]) if row[5] is not None else None,
                    image=row[6],
                    description=row[7],
                    publisher_name=row[8],
                    book_type_name=row[9]
                ) for row in rows
            ]
            return books
    finally:
        conn.close()

def get_book_by_id_with_names_db(book_id: int) -> Optional[BookWithNames]:
    conn = create_connection()
    if not conn:
        raise Exception("Không thể kết nối database")
    try:
        with conn.cursor() as cur:
            cur.execute("""
                        SELECT
                            b.id, b.name, b.author, b.year, b.amount, b.price, b.image, b.description,
                            p.name AS publisher_name, bt.name AS book_type_name
                        FROM books AS b
                        LEFT JOIN publishers AS p ON b.publisher_id = p.id
                        LEFT JOIN book_types AS bt ON b.book_type_id = bt.id
                        WHERE b.id = %s;
                        """, (book_id,))
            row = cur.fetchone()
            if not row:
                return None
            return BookWithNames(
                id=row[0],
                name=row[1],
                author=row[2],
                year=row[3],
                amount=row[4],
                price=float(row[5]) if row[5] is not None else None,
                image=row[6],
                description=row[7],
                publisher_name=row[8],
                book_type_name=row[9]
            )
    finally:
        conn.close()

def get_books_by_name_db(book_name: str) -> List[BookWithNames]:
    conn = create_connection()
    if not conn:
        raise Exception("Không thể kết nối database")
    try:
        with conn.cursor() as cur:
            search_query = f"%{book_name}%"
            cur.execute("""
                        SELECT
                            b.id, b.name, b.author, b.year, b.amount, b.price, b.image, b.description,
                            p.name AS publisher_name, bt.name AS book_type_name
                        FROM books AS b
                        LEFT JOIN publishers AS p ON b.publisher_id = p.id
                        LEFT JOIN book_types AS bt ON b.book_type_id = bt.id
                        WHERE b.name ILIKE %s;
                        """, (search_query,))
            rows = cur.fetchall()
            books = [
                BookWithNames(
                    id=row[0],
                    name=row[1],
                    author=row[2],
                    year=row[3],
                    amount=row[4],
                    price=float(row[5]) if row[5] is not None else None,
                    image=row[6],
                    description=row[7],
                    publisher_name=row[8],
                    book_type_name=row[9]
                ) for row in rows
            ]
            return books
    finally:
        conn.close()

def get_books_by_author_db(author: str) -> List[BookWithNames]:
    conn = create_connection()
    if not conn:
        raise Exception("Không thể kết nối database")
    try:
        with conn.cursor() as cur:
            search_query = f"%{author}%"
            cur.execute("""
                        SELECT
                            b.id, b.name, b.author, b.year, b.amount, b.price, b.image, b.description,
                            p.name AS publisher_name, bt.name AS book_type_name
                        FROM books AS b
                        LEFT JOIN publishers AS p ON b.publisher_id = p.id
                        LEFT JOIN book_types AS bt ON b.book_type_id = bt.id
                        WHERE b.author ILIKE %s;
                        """, (search_query,))
            rows = cur.fetchall()
            books = [
                BookWithNames(
                    id=row[0],
                    name=row[1],
                    author=row[2],
                    year=row[3],
                    amount=row[4],
                    price=float(row[5]) if row[5] is not None else None,
                    image=row[6],
                    description=row[7],
                    publisher_name=row[8],
                    book_type_name=row[9]
                ) for row in rows
            ]
            return books
    finally:
        conn.close()

def get_books_by_publisher_name_db(publisher_name: str) -> List[BookWithNames]:
    conn = create_connection()
    if not conn:
        raise Exception("Không thể kết nối database")
    try:
        with conn.cursor() as cur:
            search_query = f"%{publisher_name}%"
            cur.execute("""
                        SELECT
                            b.id, b.name, b.author, b.year, b.amount, b.price, b.image, b.description,
                            p.name AS publisher_name, bt.name AS book_type_name
                        FROM books AS b
                        LEFT JOIN publishers AS p ON b.publisher_id = p.id
                        LEFT JOIN book_types AS bt ON b.book_type_id = bt.id
                        WHERE p.name ILIKE %s;
                        """, (search_query,))
            rows = cur.fetchall()
            books = [
                BookWithNames(
                    id=row[0],
                    name=row[1],
                    author=row[2],
                    year=row[3],
                    amount=row[4],
                    price=float(row[5]) if row[5] is not None else None,
                    image=row[6],
                    description=row[7],
                    publisher_name=row[8],
                    book_type_name=row[9]
                ) for row in rows
            ]
            return books
    finally:
        conn.close()

def get_books_by_type_name_db(type_name: str) -> List[BookWithNames]:
    conn = create_connection()
    if not conn:
        raise Exception("Không thể kết nối database")
    try:
        with conn.cursor() as cur:
            search_query = f"%{type_name}%"
            cur.execute("""
                        SELECT
                            b.id, b.name, b.author, b.year, b.amount, b.price, b.image, b.description,
                            p.name AS publisher_name, bt.name AS book_type_name
                        FROM books AS b
                        LEFT JOIN publishers AS p ON b.publisher_id = p.id
                        LEFT JOIN book_types AS bt ON b.book_type_id = bt.id
                        WHERE bt.name ILIKE %s;
                        """, (search_query,))
            rows = cur.fetchall()
            books = [
                BookWithNames(
                    id=row[0],
                    name=row[1],
                    author=row[2],
                    year=row[3],
                    amount=row[4],
                    price=float(row[5]) if row[5] is not None else None,
                    image=row[6],
                    description=row[7],
                    publisher_name=row[8],
                    book_type_name=row[9]
                ) for row in rows
            ]
            return books
    finally:
        conn.close()

def get_books_by_publisher_id_db(publisher_id: int) -> List[BookWithNames]:
    conn = create_connection()
    if not conn:
        raise Exception("Không thể kết nối database")
    try:
        with conn.cursor() as cur:
            cur.execute("""
                        SELECT 
                            b.id, b.name, b.author, b.year, b.amount, b.price, b.image, b.description,
                            p.name AS publisher_name, bt.name AS book_type_name
                        FROM books AS b
                        LEFT JOIN publishers AS p ON b.publisher_id = p.id
                        LEFT JOIN book_types AS bt ON b.book_type_id = bt.id
                        WHERE b.publisher_id = %s;
                        """, (publisher_id,))
            rows = cur.fetchall()
            books = [
                BookWithNames(
                    id=row[0], 
                    name=row[1], 
                    author=row[2], 
                    year=row[3], 
                    amount=row[4], 
                    price=float(row[5]) if row[5] is not None else None,
                    image=row[6], 
                    description=row[7], 
                    publisher_name=row[8], 
                    book_type_name=row[9]
                ) for row in rows
            ]
            return books
    finally:
        conn.close()

def get_books_by_type_id_db(type_id: int) -> List[BookWithNames]:
    conn = create_connection()
    if not conn:
        raise Exception("Không thể kết nối database")
    try:
        with conn.cursor() as cur:
            cur.execute("""
                        SELECT 
                            b.id, b.name, b.author, b.year, b.amount, b.price, b.image, b.description,
                            p.name AS publisher_name, bt.name AS book_type_name
                        FROM books AS b
                        LEFT JOIN publishers AS p ON b.publisher_id = p.id
                        LEFT JOIN book_types AS bt ON b.book_type_id = bt.id
                        WHERE b.book_type_id = %s;
                        """, (type_id,))
            rows = cur.fetchall()
            books = [
                BookWithNames(
                    id=row[0], 
                    name=row[1], 
                    author=row[2], 
                    year=row[3], 
                    amount=row[4], 
                    price=float(row[5]) if row[5] is not None else None,
                    image=row[6], 
                    description=row[7], 
                    publisher_name=row[8], 
                    book_type_name=row[9]
                ) for row in rows
            ]
            return books
    finally:
        conn.close()

def update_book_db(book_id: int, updated_book: Book) -> Optional[Book]:
    conn = create_connection()
    if not conn:
        raise Exception("Không thể kết nối database")
    try:
        with conn.cursor() as cur:
            cur.execute("""
                        UPDATE books SET
                        name = %s, author = %s, year = %s, amount = %s, price = %s, image = %s, description = %s, publisher_id = %s, book_type_id = %s
                        WHERE id = %s RETURNING id;
                        """, (
                            updated_book.name, 
                            updated_book.author, 
                            updated_book.year, 
                            updated_book.amount, 
                            updated_book.price, 
                            updated_book.image, 
                            updated_book.description, 
                            updated_book.publisher_id, 
                            updated_book.book_type_id, 
                            book_id))
            if not cur.fetchone():
                return None
            conn.commit()
            return updated_book
    except psycopg2.IntegrityError:
        raise ValueError("Dữ liệu cập nhật không hợp lệ.")
    finally:
        conn.close()

def delete_book_db(book_id: int) -> bool:
    conn = create_connection()
    if not conn:
        raise Exception("Không thể kết nối database")
    try:
        with conn.cursor() as cur:
            cur.execute("""
                        DELETE FROM books 
                        WHERE id = %s 
                        RETURNING id;
                        """, (book_id,))
            deleted = cur.fetchone() is not None
            conn.commit()
            return deleted
    finally:
        conn.close()