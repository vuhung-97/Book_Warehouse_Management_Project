from sqlalchemy.orm import Session
from typing import List, Optional
from . import models, schemas

# ----------------------------------------
#               BOOK TYPES CRUD
# ----------------------------------------

def create_book_type_db(db: Session, book_type: schemas.BookTypeBase) -> models.BookType:
    db_book_type = models.BookType(name=book_type.name)
    db.add(db_book_type)
    db.commit()
    db.refresh(db_book_type)
    return db_book_type

def get_all_book_types_db(db: Session) -> List[models.BookType]:
    return db.query(models.BookType).all()

def get_book_type_by_id_db(book_type_id: int, db: Session) -> Optional[models.BookType]:
    return db.query(models.BookType).filter(models.BookType.id == book_type_id).first()

def get_book_type_by_name_db(book_type_name: str, db: Session) -> List[models.BookType]:
    return db.query(models.BookType).filter(models.BookType.name.ilike(f"%{book_type_name}%")).all()

def update_book_type_db(book_type_id: int, book_type: schemas.BookTypeBase, db: Session) -> Optional[models.BookType]:
    db_book_type = db.query(models.BookType).filter(models.BookType.id == book_type_id).first()
    if db_book_type:
        db_book_type.name = book_type.name
        db.commit()
        db.refresh(db_book_type)
    return db_book_type

def delete_book_type_db(book_type_id: int, db: Session) -> bool:
    db_book_type = db.query(models.BookType).filter(models.BookType.id == book_type_id).first()
    if db_book_type:
        db.delete(db_book_type)
        db.commit()
        return True
    return False

# ----------------------------------------
#              PUBLISHERS CRUD
# ----------------------------------------

def create_publisher_db(publisher: schemas.PublisherBase, db: Session) -> models.Publisher:
    db_publisher = models.Publisher(name=publisher.name, address=publisher.address, tax_code=publisher.tax_code)
    db.add(db_publisher)
    db.commit()
    db.refresh(db_publisher)
    return db_publisher

def get_all_publishers_db(db: Session) -> List[models.Publisher]:
    return db.query(models.Publisher).all()

def get_publisher_by_id_db(publisher_id: int, db: Session) -> Optional[models.Publisher]:
    return db.query(models.Publisher).filter(models.Publisher.id == publisher_id).first()

def get_publisher_by_name_db(publisher_name: str, db: Session) -> List[models.Publisher]:
    return db.query(models.Publisher).filter(models.Publisher.name.ilike(f"%{publisher_name}%")).all()

def update_publisher_db(publisher_id: int, new_publisher: schemas.Publisher, db: Session) -> Optional[models.Publisher]:
    db_publisher = db.query(models.Publisher).filter(models.Publisher.id == publisher_id).first()
    if db_publisher:
        for key, value in new_publisher.model_dump(exclude_unset=True).items():
            setattr(db_publisher, key, value)
        db.commit()
        db.refresh(db_publisher)
    return db_publisher

def delete_publisher_db(publisher_id: int, db: Session) -> bool:
    db_publisher = db.query(models.Publisher).filter(models.Publisher.id == publisher_id).first()
    if db_publisher:
        db.delete(db_publisher)
        db.commit()
        return True
    return False

# ----------------------------------------
#                 BOOKS CRUD
# ----------------------------------------

def create_book_db(book: schemas.BookBase, db: Session) -> models.Book:
    db_book = models.Book(**book.model_dump())
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

def get_all_books_db(db: Session) -> List[models.Book]:
    return db.query(models.Book).all()

def get_book_by_id_db(book_id: int, db:Session) -> Optional[models.Book]:
    return db.query(models.Book).filter(models.Book.id == book_id).first()

def get_books_by_name_db(book_name: str, db: Session) -> List[models.Book]:
    return db.query(models.Book).filter(models.Book.name.ilike(f"%{book_name}%")).all()

def get_books_by_author_db(author: str, db: Session) -> List[models.Book]:
    return db.query(models.Book).filter(models.Book.author.ilike(f"%{author}%")).all()

def get_books_by_publisher_name_db(publisher_name: str, db: Session) -> List[models.Book]:
    return db.query(models.Book).join(models.Publisher).filter(models.Publisher.name.ilike(f"%{publisher_name}%")).all()

def get_books_by_type_name_db(type_name: str, db: Session) -> List[models.Book]:
    return db.query(models.Book).join(models.BookType).filter(models.BookType.name.ilike(f"%{type_name}%")).all()

def get_books_by_publisher_id_db(publisher_id: int, db: Session) -> List[models.Book]:
    return db.query(models.Book).filter(models.Book.publisher_id == publisher_id).all()

def get_books_by_type_id_db(type_id: int, db: Session) -> List[models.Book]:
    return db.query(models.Book).filter(models.Book.book_type_id == type_id).all()

def update_book_db(book_id: int, updated_book: schemas.BookBase, db: Session) -> Optional[models.Book]:
    db_book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if db_book:
        for key, value in updated_book.model_dump(exclude_unset=True).items():
            setattr(db_book, key, value)
        db.commit()
        db.refresh(db_book)
    return db_book

def delete_book_db(book_id: int, db: Session) -> bool:
    db_book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if db_book:
        db.delete(db_book)
        db.commit()
        return True
    return False