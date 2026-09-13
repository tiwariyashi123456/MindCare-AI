# ============================================================
# MindCare AI - Create Admin Account
# ============================================================

from database.database import get_db_connection
from werkzeug.security import generate_password_hash


# ============================================================
# HEADER
# ============================================================

print("")
print("==============================================")
print("       💜 MindCare AI - Create Admin")
print("==============================================")
print("")


# ============================================================
# ADMIN USERNAME
# ============================================================

username = input(
    "Enter admin username: "
).strip()


while not username:

    print("❌ Username cannot be empty.")

    username = input(
        "Enter admin username: "
    ).strip()


# ============================================================
# ADMIN PASSWORD
# ============================================================

password = input(
    "Enter admin password: "
)


while not password:

    print("❌ Password cannot be empty.")

    password = input(
        "Enter admin password: "
    )


# ============================================================
# CONFIRM PASSWORD
# ============================================================

confirm_password = input(
    "Confirm admin password: "
)


if password != confirm_password:

    print("")
    print("❌ Passwords do not match.")
    print("Please run the program again.")
    print("")

    exit()


# ============================================================
# HASH PASSWORD
# ============================================================

hashed_password = generate_password_hash(
    password
)


# ============================================================
# DATABASE CONNECTION
# ============================================================

connection = get_db_connection()


# ============================================================
# CHECK EXISTING ADMIN
# ============================================================

existing_admin = connection.execute(
    """
    SELECT id
    FROM admin
    WHERE username = ?
    """,
    (username,)
).fetchone()


# ============================================================
# CREATE / UPDATE ADMIN
# ============================================================

if existing_admin:

    connection.execute(
        """
        UPDATE admin
        SET password = ?
        WHERE username = ?
        """,
        (
            hashed_password,
            username
        )
    )

    connection.commit()
    connection.close()

    print("")
    print("==============================================")
    print("✅ Admin account already existed.")
    print("✅ Admin password has been updated.")
    print("==============================================")
    print("")


else:

    connection.execute(
        """
        INSERT INTO admin
        (
            username,
            password
        )
        VALUES (?, ?)
        """,
        (
            username,
            hashed_password
        )
    )

    connection.commit()
    connection.close()

    print("")
    print("==============================================")
    print("✅ Admin account created successfully!")
    print("==============================================")
    print("")


# ============================================================
# LOGIN INFORMATION
# ============================================================

print("Admin Username:", username)

print("")
print("Now start your Flask application:")
print("python app.py")

print("")
print("Then open:")
print("http://127.0.0.1:5000/admin/login")

print("")
print("==============================================")
print("          👑 Admin Setup Complete")
print("==============================================")
print("")