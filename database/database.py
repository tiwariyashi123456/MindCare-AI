import sqlite3
import os


# =====================================================
# DATABASE PATH
# =====================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

DATABASE_PATH = os.path.join(
    BASE_DIR,
    "database",
    "mindcare.db"
)


# =====================================================
# GET DATABASE CONNECTION
# =====================================================

def get_db_connection():

    connection = sqlite3.connect(
        DATABASE_PATH
    )

    connection.row_factory = sqlite3.Row

    return connection


# =====================================================
# INITIALIZE DATABASE
# =====================================================

def init_db():

    # Make sure database folder exists
    os.makedirs(
        os.path.dirname(DATABASE_PATH),
        exist_ok=True
    )

    connection = get_db_connection()


    # -------------------------------------------------
    # USERS TABLE
    # -------------------------------------------------

    connection.execute("""
        CREATE TABLE IF NOT EXISTS users (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            name TEXT NOT NULL,

            email TEXT NOT NULL UNIQUE,

            password TEXT NOT NULL,

            mobile TEXT,

            created_at TIMESTAMP
                DEFAULT CURRENT_TIMESTAMP

        )
    """)


    # -------------------------------------------------
    # ADD MOBILE COLUMN TO OLD DATABASE
    # -------------------------------------------------
    # If users table already existed before mobile
    # was added, this will safely add the new column.

    columns = connection.execute(
        "PRAGMA table_info(users)"
    ).fetchall()

    column_names = [
        column["name"]
        for column in columns
    ]

    if "mobile" not in column_names:

        connection.execute("""
            ALTER TABLE users
            ADD COLUMN mobile TEXT
        """)


    # -------------------------------------------------
    # MOODS TABLE
    # -------------------------------------------------

    connection.execute("""
        CREATE TABLE IF NOT EXISTS moods (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_id INTEGER NOT NULL,

            mood TEXT NOT NULL,

            mood_date DATE
                DEFAULT CURRENT_DATE,

            created_at TIMESTAMP
                DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (user_id)
                REFERENCES users(id)

        )
    """)


    # -------------------------------------------------
    # JOURNAL TABLE
    # -------------------------------------------------

    connection.execute("""
        CREATE TABLE IF NOT EXISTS journal (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_id INTEGER NOT NULL,

            title TEXT,

            content TEXT,

            created_at TIMESTAMP
                DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (user_id)
                REFERENCES users(id)

        )
    """)


    # -------------------------------------------------
    # MEDITATION TABLE
    # -------------------------------------------------

    connection.execute("""
        CREATE TABLE IF NOT EXISTS meditation (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_id INTEGER NOT NULL,

            activity TEXT,

            duration INTEGER DEFAULT 0,

            completed INTEGER DEFAULT 0,

            created_at TIMESTAMP
                DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (user_id)
                REFERENCES users(id)

        )
    """)


    # -------------------------------------------------
    # EXERCISE TABLE
    # -------------------------------------------------

    connection.execute("""
        CREATE TABLE IF NOT EXISTS exercises (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_id INTEGER NOT NULL,

            exercise_name TEXT,

            duration INTEGER DEFAULT 0,

            completed INTEGER DEFAULT 0,

            created_at TIMESTAMP
                DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (user_id)
                REFERENCES users(id)

        )
    """)


    # -------------------------------------------------
    # YOGA TABLE
    # -------------------------------------------------

    connection.execute("""
        CREATE TABLE IF NOT EXISTS yoga (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_id INTEGER NOT NULL,

            yoga_name TEXT,

            duration INTEGER DEFAULT 0,

            completed INTEGER DEFAULT 0,

            created_at TIMESTAMP
                DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (user_id)
                REFERENCES users(id)

        )
    """)


    # -------------------------------------------------
    # STRESS ANALYSIS TABLE
    # -------------------------------------------------

    connection.execute("""
        CREATE TABLE IF NOT EXISTS stress_analysis (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_id INTEGER NOT NULL,

            stress_level INTEGER DEFAULT 0,

            result TEXT,

            created_at TIMESTAMP
                DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (user_id)
                REFERENCES users(id)

        )
    """)


    # -------------------------------------------------
    # CHAT HISTORY TABLE
    # -------------------------------------------------

    connection.execute("""
        CREATE TABLE IF NOT EXISTS chat_history (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_id INTEGER NOT NULL,

            message TEXT,

            response TEXT,

            created_at TIMESTAMP
                DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (user_id)
                REFERENCES users(id)

        )
    """)


    # -------------------------------------------------
    # REMINDERS TABLE
    # -------------------------------------------------

    connection.execute("""
        CREATE TABLE IF NOT EXISTS reminders (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_id INTEGER NOT NULL,

            title TEXT,

            reminder_time TEXT,

            completed INTEGER DEFAULT 0,

            created_at TIMESTAMP
                DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (user_id)
                REFERENCES users(id)

        )
    """)


    # =================================================
    # WELLNESS REMINDERS TABLE
    # =================================================

    connection.execute("""
        CREATE TABLE IF NOT EXISTS wellness_reminders (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_id INTEGER NOT NULL,

            reminder_type TEXT NOT NULL,

            reminder_title TEXT NOT NULL,

            reminder_message TEXT,

            reminder_time TEXT NOT NULL,

            repeat_type TEXT DEFAULT 'daily',

            enabled INTEGER DEFAULT 1,

            last_sent TEXT,

            created_at TIMESTAMP
                DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (user_id)
                REFERENCES users(id)

        )
    """)
    connection.execute("""
    CREATE TABLE IF NOT EXISTS admin (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # -------------------------------------------------
    # SAVE CHANGES
    # -------------------------------------------------

    connection.commit()

    connection.close()


# =====================================================
# TEST DATABASE
# =====================================================

if __name__ == "__main__":

    init_db()

    print(
        "✅ MindCare database initialized successfully."
    )

    print(
        "📁 Database:",
        DATABASE_PATH
    )