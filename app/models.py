from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column
from .database import Base

class BookType(Base):
    __tablename__ = "book_types"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String, unique=True, index=True)
    
    books = relationship("Book", back_populates="book_type")

class Publisher(Base):
    __tablename__ = "publishers"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String, unique=True, index=True)
    address: Mapped[str] = mapped_column(Text, nullable=True)
    tax_code: Mapped[str] = mapped_column(String, nullable=True)
    
    books = relationship("Book", back_populates="publisher")

class Book(Base):
    __tablename__ = "books"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String, index=True)
    author: Mapped[str] = mapped_column(String, nullable=True)
    year: Mapped[int] = mapped_column(Integer, nullable=True)
    amount: Mapped[int] = mapped_column(Integer, default=0)
    price: Mapped[float] = mapped_column(Float, default=0.00)
    image: Mapped[str] = mapped_column(String, nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    publisher_id: Mapped[int] = mapped_column(Integer, ForeignKey("publishers.id"), nullable=True)
    book_type_id: Mapped[int] = mapped_column(Integer, ForeignKey("book_types.id"), nullable=True)
    
    publisher = relationship("Publisher", back_populates="books")
    book_type = relationship("BookType", back_populates="books")