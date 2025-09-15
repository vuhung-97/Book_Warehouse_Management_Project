from typing import List, Optional
from pydantic import BaseModel, Field

# Pydantic models for request bodies and response models

class BookTypeBase(BaseModel):
    name: str
    amount: Optional[int]

class BookType(BookTypeBase):
    id: Optional[int]

class PublisherBase(BaseModel):
    name: str
    address: Optional[str]
    tax_code: Optional[str]
    amount: Optional[int]

class Publisher(PublisherBase):
    id: Optional[int]

class BookBase(BaseModel):    
    name: str
    author: Optional[str]
    year: Optional[int]
    amount: Optional[int] = 0
    price: Optional[float] = 0.00
    image: Optional[str]
    description: Optional[str]
    publisher_id: Optional[int]
    book_type_id: Optional[int]

class Book(BookBase):
    id: Optional[int]

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

    class Config:
        orm_mode = True # This tells Pydantic to read data from ORM objects