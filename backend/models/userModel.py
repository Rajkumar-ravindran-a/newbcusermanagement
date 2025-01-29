from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Float
from datetime import datetime
from config.dbconnection import engine, base

base = base

class Brokers(base):
    __tablename__ = "brokers"

    id = Column(Integer, primary_key=True, index=True)
    brokerName = Column(String, nullable=False)
    grossFund = Column(Integer, default=0)
    grossFundInterest = Column(Float, default=0.0)
    grossFundSharing = Column(Float, default=0.0)
    arbitrageFund = Column(Integer, default=0)
    arbitrageFundInterest = Column(Float, default=0.0)
    arbitrageFundSharing = Column(Float, default=0.0)
    propFund = Column(Integer, default=0)
    propFundInterest = Column(Float, default=0.0)
    propFundSharing = Column(Float, default=0.0)
    costPerCr = Column(Float, default=0.0)
    totalFund = Column(Integer, default=0)
    releaseDate = Column(DateTime, nullable=True)
    brokerStatus = Column(Integer, ForeignKey("status.id"), nullable=False, default=1)
    createAt = Column(DateTime, index=True, default=datetime.now)
    updatedAt = Column(DateTime, index=True, default=datetime.now)


# class Brokers(base):
#     __tablename__ = 'brokers'
#     id = Column(Integer, primary_key=True, index=True, autoincrement=True)
#     # New column names as per the given structure
#     brokerName = Column(String(50), nullable=False)
#     grossFund = Column(Integer)  # Renamed 'grossfund'
#     arbitrageFund = Column(Integer)  # Renamed 'arbitragefund'
#     propFund = Column(Integer)  # Renamed 'propfund'
#     interest = Column(Float, nullable=True)  # Assuming a calculation for Interest
#     sharing = Column(Float, nullable=True)  # Assuming a calculation for Sharing
#     costPerCr = Column(Float, nullable=True)  # Assuming a calculation for CostPerCr
#     totalFund = Column(Integer, nullable=True)  # Total fund calculation can be added here
#     brokerStatus = Column(Integer, ForeignKey("status.id"), nullable=False, default=1)
#     releaseDate = Column(DateTime, nullable=True)
#     createAt = Column(DateTime, index=True, default=datetime.now)
#     updatedAt = Column(DateTime, index=True, default=datetime.now)
    
class Ids(base):
    __tablename__ = "ids"
    recordId = Column(Integer, primary_key=True, index=True, autoincrement=True)
    idNumber = Column(String(50), unique=True, index=True, nullable=False)
    brokerId = Column(Integer, nullable=False)
    emloyeeId = Column(Integer, ForeignKey("users.id"), nullable=False)
    idType = Column(String(50), nullable=False)
    nism = Column(String(100), nullable=False)
    idStatus = Column(Integer, ForeignKey("status.id"), nullable=False, default=1)
    startDate = Column(DateTime, nullable=False)
    releaseDate = Column(DateTime, nullable=True)
    createAt = Column(DateTime, index=True, default=datetime.now)
    updatedAt = Column(DateTime, index=True, default=datetime.now)


class userRole(base):
    __tablename__ = "userRole"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    roleName = Column(String(50), index=True, nullable=False)


class Status(base):
    __tablename__ = "status"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    statusName = Column(String(50), index=True, nullable=False)


class Users(base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    firstName = Column(String(100), index=True, nullable=False)
    lastName = Column(String(100), index=True, nullable=True)
    email = Column(String(200), unique=True, index=True, nullable=False)
    phonenumber = Column(String(50), index=True, nullable=True)
    role = Column(
        Integer,
        ForeignKey("userRole.id"),
        nullable=False,
        index=True,
        default=2,
    )
    pwd = Column(String(255))
    userStatus = Column(Integer, ForeignKey("status.id"), index=True, default=1)
    createAt = Column(DateTime, index=True, default=datetime.now)
    updatedAt = Column(DateTime, index=True, default=datetime.now)
    

class TradeData(base):
    __tablename__ = "trade_data"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    broker = Column(String(200), nullable=False, index=True)
    Date = Column(DateTime, nullable=False, index=True)
    tradeId = Column(Integer, nullable=False, index=True)
    strategy = Column(String(200), index=True, nullable=False)
    counter = Column(Integer)
    buyValue = Column(Integer, nullable=False)
    sellValue = Column(Integer, nullable=False)
    userId = Column(Integer, ForeignKey("users.id"), nullable=False)


class RegisterUser(BaseModel):
    firstName: str
    lastName: str
    email: str
    role: str
    pwd: str


class Token(BaseModel):
    access_token: str
    token_type: str

if __name__ == '__main__':
    base.metadata.create_all(bind=engine)
    print("Tables created successfully!")