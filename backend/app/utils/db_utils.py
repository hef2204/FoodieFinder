from flask import current_app
from app.extensions.database import db

def get_db_session():
    """
    Returns the current database session.
    """
    return db.session

def commit_session():
    """
    Commits the current database session.
    """
    try:
        db.session.commit()
    except Exception as e:
        current_app.logger.error(f"Error during DB commit: {e}")
        db.session.rollback()
        raise

def rollback_session():
    """
    Rolls back the current database session.
    """
    try:
        db.session.rollback()
    except Exception as e:
        current_app.logger.error(f"Error during DB rollback: {e}")

def close_session():
    """
    Closes the current database session.
    """
    try:
        db.session.close()
    except Exception as e:
        current_app.logger.error(f"Error during DB session close: {e}")
