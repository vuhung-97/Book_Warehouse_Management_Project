from sqlalchemy.orm import Session
from sqlalchemy import func
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Optional
from . import database, schemas

# ----------------------------------------
#               BOOK TYPES CRUD
# ----------------------------------------

def create_book_type_db(db: Session, book_type: schemas.BookTypeBase) -> schemas.BookType:
    db_book_type = database.BookType(**book_type.model_dump())
    try:
        db.add(db_book_type)
        db.commit()
        db.refresh(db_book_type)
        return db_book_type
    except SQLAlchemyError as e:
        db.rollback()
        raise e

def get_all_book_types_db(db: Session) -> List[schemas.BookTypeWithAmount]:
    results = db.query(
        database.BookType,
        func.count(database.Book.id).label("book_count")
    ).outerjoin(
        database.Book, database.BookType.id == database.Book.book_type_id
    ).group_by(
        database.BookType.id
    ).order_by(
        database.BookType.id
    ).all()

    booktypes = [
        schemas.BookTypeWithAmount(
            id=booktype.id,
            name=booktype.name,
            amount=book_count
        ) for booktype, book_count in results
    ]
    return booktypes

def get_book_type_by_id_db(book_type_id: int, db: Session) -> Optional[schemas.BookType]:
    return db.get(database.BookType, book_type_id)

#Chưa sử dụng
def get_book_type_by_name_db(book_type_name: str, db: Session) -> List[schemas.BookType]:
    return db.query(database.BookType).filter(database.BookType.name.ilike(f"%{book_type_name}%")).all()

def update_book_type_db(book_type_id: int, update_book_type: schemas.BookTypeBase, db: Session) -> Optional[schemas.BookType]:
    db_book_type = db.query(database.BookType).filter(database.BookType.id == book_type_id).first()
    if not db_book_type:
        return None
    try:
        for key, value in update_book_type.model_dump(exclude_unset=True).items():
            setattr(db_book_type, key, value)
        db.commit()
        db.refresh(db_book_type)
        return db_book_type
    except SQLAlchemyError as e:
        db.rollback()
        raise e

def delete_book_type_db(book_type_id: int, db: Session) -> bool:
    db_book_type = db.query(database.BookType).filter(database.BookType.id == book_type_id).first()
    if not db_book_type:
        return False
    try:
        db.delete(db_book_type)
        db.commit()
        return True
    except SQLAlchemyError as e:
        db.rollback()
        raise e

# ----------------------------------------
#              PUBLISHERS CRUD
# ----------------------------------------

def create_publisher_db(publisher: schemas.PublisherBase, db: Session) -> schemas.Publisher:
    db_publisher = database.Publisher(**publisher.model_dump())
    try:
        db.add(db_publisher)
        db.commit()
        db.refresh(db_publisher)
        return db_publisher
    except SQLAlchemyError as e:
        db.rollback()
        raise e

def get_all_publishers_db(db: Session) -> List[schemas.PublisherWithAmount]:
    results = db.query(
        database.Publisher,
        func.count(database.Book.id).label("book_count")
    ).outerjoin(
        database.Book, database.Publisher.id == database.Book.publisher_id
    ).group_by(
        database.Publisher.id
    ).order_by(
        database.Publisher.id
    ).all()

    # Gán số lượng sách vào thuộc tính 'amount' của mỗi object Publisher
    publishers = [
        schemas.PublisherWithAmount(
            id=publisher.id,
            name=publisher.name,
            address=publisher.address,
            tax_code=publisher.tax_code,
            amount=book_count
        ) for publisher, book_count in results
    ]
        
    return publishers

def get_publisher_by_id_db(publisher_id: int, db: Session) -> Optional[schemas.Publisher]:
    return db.get(database.Publisher, publisher_id)

# Chưa sử dụng
def get_publisher_by_name_db(publisher_name: str, db: Session) -> List[schemas.Publisher]:
    return db.query(database.Publisher).filter(database.Publisher.name.ilike(f"%{publisher_name}%")).all()

def update_publisher_db(publisher_id: int, update_publisher: schemas.PublisherBase, db: Session) -> Optional[schemas.Publisher]:
    db_publisher = db.query(database.Publisher).filter(database.Publisher.id == publisher_id).first()
    if not db_publisher:
        return None
    try:
        for key, value in update_publisher.model_dump(exclude_unset=True).items():
            setattr(db_publisher, key, value)
        db.commit()
        db.refresh(db_publisher)
        return db_publisher
    except SQLAlchemyError as e:
        db.rollback()
        raise e

def delete_publisher_db(publisher_id: int, db: Session) -> bool:
    db_publisher = db.query(database.Publisher).filter(database.Publisher.id == publisher_id).first()
    if not db_publisher:
        return False
    try:
        db.delete(db_publisher)
        db.commit()
        return True
    except SQLAlchemyError as e:
        db.rollback()
        raise e

# ----------------------------------------
#                 BOOKS CRUD
# ----------------------------------------

def create_book_db(book: schemas.BookBase, db: Session) -> schemas.Book:
    db_book = database.Book(**book.model_dump())
    try:
        db.add(db_book)
        db.commit()
        db.refresh(db_book)
        return db_book
    except SQLAlchemyError as e:
        db.rollback()
        raise e

def get_all_books_db(db: Session) -> List[schemas.Book]:
    return db.query(database.Book).order_by(database.Book.id).all()

def get_book_by_id_db(book_id: int, db: Session) -> Optional[schemas.Book]:
    return db.get(database.Book, book_id)

def get_books_by_name_db(book_name: str, db: Session) -> List[schemas.Book]:
    return db.query(database.Book).filter(database.Book.name.ilike(f"%{book_name}%")).all()

def get_books_by_author_db(author: str, db: Session) -> List[schemas.Book]:
    return db.query(database.Book).filter(database.Book.author.ilike(f"%{author}%")).all()

def get_books_by_publisher_name_db(publisher_name: str, db: Session) -> List[schemas.Book]:
    return db.query(database.Book).join(database.Publisher).filter(database.Publisher.name.ilike(f"%{publisher_name}%")).all()

def get_books_by_type_name_db(type_name: str, db: Session) -> List[schemas.Book]:
    return db.query(database.Book).join(database.BookType).filter(database.BookType.name.ilike(f"%{type_name}%")).all()

def get_books_by_publisher_id_db(publisher_id: int, db: Session) -> List[schemas.Book]:
    return db.query(database.Book).filter(database.Book.publisher_id == publisher_id).all()

def get_books_by_type_id_db(type_id: int, db: Session) -> List[schemas.Book]:
    return db.query(database.Book).filter(database.Book.book_type_id == type_id).all()

def update_book_db(book_id: int, updated_book: schemas.BookBase, db: Session) -> Optional[schemas.Book]:
    db_book = db.query(database.Book).filter(database.Book.id == book_id).first()
    if not db_book: 
        return None
    try:
        for key, value in updated_book.model_dump(exclude_unset=True).items():
            setattr(db_book, key, value)
        db.commit()
        db.refresh(db_book)
        return db_book
    except SQLAlchemyError as e:
        db.rollback()
        raise e

def delete_book_db(book_id: int, db: Session) -> bool:
    db_book = db.query(database.Book).filter(database.Book.id == book_id).first()
    if not db_book:
        return False
    try:
        db.delete(db_book)
        db.commit()
        return True
    except SQLAlchemyError as e:
        db.rollback()
        raise e