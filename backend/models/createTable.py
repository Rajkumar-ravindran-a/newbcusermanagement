from config.dbconnection import engine
from userModel import base

if __name__ == '__main__':
    base.metadata.create_all(bind=engine)