from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


dataBaseUrl = "mysql+pymysql://root:1234567@127.0.0.1:3306/userManagement"

engine = create_engine(dataBaseUrl, pool_size=20, max_overflow=0)

sessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

base = declarative_base()