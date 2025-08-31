from typing import List, Optional
from pydantic import BaseModel, Field

# --- Pydantic Models ---

# Model sử dụng khi code
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

class BookTypeBase(BaseModel):
    name: str

class PublisherBase(BaseModel):
    name: str
    address: Optional[str]
    tax_code: Optional[str]

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

# Model sử dụng khi lấy dữ liệu từ DB
class BookType(BookTypeBase):
    id: Optional[int]

class Publisher(PublisherBase):
    id: Optional[int]

class Book(BookBase):
    id: Optional[int]

class Config:
    from_attributes = True