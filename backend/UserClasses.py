class User:
    def __init__(self, row):
        self.row = row

    @property
    def is_active(self):
        # This should return True if this is an active user 
        # (in addition to being authenticated), False otherwise.
        return True

    @property
    def is_authenticated(self):
        # This should return True if the user is authenticated, False otherwise.
        return True

    @property
    def is_anonymous(self):
        # This should return True if this is an anonymous user, False otherwise.
        return False

    def get_id(self):
        # This should return a unique identifier for the user as a string (unicode, if using Python 2).
        return str(self.row['username'])