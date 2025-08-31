import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Tải các biến môi trường từ file .env
load_dotenv()

# Lấy thông tin kết nối từ biến môi trường
DATABASE_URL = f"postgresql+psycopg2://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"

# Tạo engine SQLAlchemy để kết nối đến database
engine = create_engine(DATABASE_URL)

# Tạo một sessionmaker để tạo các session tương tác với database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Một lớp cơ sở mà các lớp mô hình của bạn sẽ kế thừa từ đó
Base = declarative_base()

def get_db():
    """Hàm dependency để lấy một database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
