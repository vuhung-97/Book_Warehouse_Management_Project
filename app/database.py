import psycopg2
import os
from dotenv import load_dotenv

# Tải các biến môi trường từ file .env
load_dotenv()

def create_connection():
    """Tạo và trả về đối tượng kết nối đến cơ sở dữ liệu PostgreSQL."""
    try:
        conn = psycopg2.connect(
            dbname=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT")
        )
        return conn
    except psycopg2.OperationalError as e:
        print(f"Lỗi kết nối cơ sở dữ liệu: {e}")
        return None

def create_tables():
    """Tạo các bảng 'book_types', 'publishers', và 'books' nếu chúng chưa tồn tại."""
    conn = create_connection()
    if conn:
        with conn.cursor() as cur:
            # Tạo bảng 'book_types'
            book_types_table_query = """
            CREATE TABLE IF NOT EXISTS book_types (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL
            );
            """
            
            # Tạo bảng 'publishers'
            publishers_table_query = """
            CREATE TABLE IF NOT EXISTS publishers (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL,
                address TEXT,
                tax_code VARCHAR(50)
            );
            """

            # Tạo bảng 'books' với các khóa ngoại
            books_table_query = """
            CREATE TABLE IF NOT EXISTS books (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                author VARCHAR(255),
                year INTEGER,
                amount INTEGER DEFAULT 0,
                price DECIMAL(10, 2) DEFAULT 0.00,
                image VARCHAR(255),
                description TEXT,
                publisher_id INTEGER,
                book_type_id INTEGER,
                
                FOREIGN KEY (publisher_id) REFERENCES publishers (id) ON DELETE SET NULL,
                FOREIGN KEY (book_type_id) REFERENCES book_types (id) ON DELETE SET NULL
            );
            """
            
            # Thực thi các câu lệnh tạo bảng
            cur.execute(book_types_table_query)
            cur.execute(publishers_table_query)
            cur.execute(books_table_query)
            
            # Thêm các chỉ mục để tối ưu hiệu suất truy vấn
            print("Đang tạo các chỉ mục...")
            create_indexes(cur)

            conn.commit()
            print("Các bảng và chỉ mục đã được tạo thành công.")
        conn.close()

def create_indexes(cur):
    """Tạo các chỉ mục để tối ưu hiệu suất."""
    # Chỉ mục cho các khóa ngoại trên bảng books để tăng tốc JOINs
    cur.execute("CREATE INDEX IF NOT EXISTS idx_books_publisher_id ON books (publisher_id);")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_books_book_type_id ON books (book_type_id);")
    
    # Chỉ mục trên cột name của bảng books để tăng tốc tìm kiếm theo tên sách
    cur.execute("CREATE INDEX IF NOT EXISTS idx_books_name ON books (name);")
    
    print("Đã tạo chỉ mục thành công.")

if __name__ == '__main__':
    create_tables()