from typing import List, Optional
from pydantic import BaseModel, Field

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
