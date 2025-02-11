from fastapi import FastAPI, HTTPException, Depends, status
from pydantic import BaseModel, field_validator, EmailStr, Field
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError, jwt
from datetime import datetime, timedelta, date
from typing import Optional, List, Dict
from models.userModel import TradeData, Users, userRole, Status, Brokers, Ids, Strategy
from config.dbconnection import sessionLocal
from sqlalchemy.orm import Session
from sqlalchemy import exc, desc
from sqlalchemy.future import select
from config.dbconnection import engine, base


# Initialize the FastAPI app
app = FastAPI()


def get_db():
    db = sessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.on_event("startup")
async def createTable(session: Session = Depends(get_db)):
    base.metadata.create_all(bind=engine)
    print("Created table successfully")
    with engine.begin() as conn:
        with Session(bind=conn) as session:
            # Insert initial data
            status_count = (session.execute(select(Status))).scalars().all()
            if not status_count:
                statusData = ["Active", "Deactive", "Released"]
                for status in statusData:
                    statusDatacommit = Status(statusName=status)
                    session.add(statusDatacommit)
                session.commit()
                print("Status data inserted successfully")
            role_count = (session.execute(select(userRole))).scalars().all()
            if not role_count:
                # Insert initial data
                roleData = ["Admin", "Dealer", "Trader", "Deleted"]
                for role in roleData:
                    roleDatacommit = userRole(roleName=role)
                    session.add(roleDatacommit)
                session.commit()
                print("Role data inserted successfully")


# JWT configuration
SECRET_KEY = "your_secret_key"  # Replace with a strong secret key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Add CORS middleware to allow cross-origin requests
origins = [
    "http://localhost:3000",  # Replace with your frontend URL, e.g., React app
    "https://yourfrontenddomain.com",
    "http://localhost:5173",
    "*",
    "http://43.204.150.47" "http://43.204.150.47:3000",
    # Another domain that needs access
    # You can add more origins here as needed
]

# Add CORSMiddleware to the app
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows all listed origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Password hashing
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    print(token)
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("email")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = (
            db.query(Users).filter(Users.email == email, Users.userStatus == 1).first()
        )
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError as error:
        print(error)
        raise HTTPException(status_code=401, detail="Invalid token")


class Token(BaseModel):
    access_token: str
    token_type: str


class UserCreate(BaseModel):
    firstName: str
    lastName: Optional[str] = None
    email: EmailStr
    phonenumber: Optional[str] = None
    password: str
    role: Optional[int] = 2  # Default role
    userStatus: Optional[int] = 1  # Default user status

    class Config:
        orm_mode = True


class StrategyCreate(BaseModel):
    strategyName: str


class StrategyOut(BaseModel):
    StrategyName: str

    class Config:
        orm_mode = True


class CreateIdRequest(BaseModel):
    id: str
    brokerName: int
    employee: int
    idType: str
    nism: str | None = None
    startDate: date
    releaseDate: date | None = None


class StrategyUpdate(BaseModel):
    StrategyName: str


class TradeDataRequest(BaseModel):
    brokerId: int
    broker: str
    Date: str
    tradeId: str
    strategy: str
    counter: Optional[int] = None
    buyValue: int
    sellValue: int

    # Pydantic validator for Date field to ensure correct datetime format
    @field_validator("Date")
    def validate_date(cls, v):
        try:
            return datetime.strptime(v, "%Y-%m-%d %H:%M:%S")
        except ValueError:
            raise ValueError("Date must be in the format YYYY-MM-DD HH:MM:SS")


class UserResponse(BaseModel):
    id: int
    firstName: str
    lastName: str
    email: str
    role: str
    phoneNumber: str
    userStatus: str
    createAt: datetime
    # updatedAt: datetime

    class Config:
        orm_mode = True


class fetchUserData(BaseModel):
    status: Optional[int] = None


# Helper functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=90))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# def get_user(username: str):
#     return users_db.get(username)


# API Endpoints


@app.get("/")
def root():
    return {"message": "Welcome to the API"}


@app.post("/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = (
        db.query(Users).filter(Users.email == user.email, Users.userStatus == 1).first()
    )
    if existing_user:
        raise HTTPException(status_code=400, detail="Email is already registered")

    # Hash the password
    hashed_password = get_password_hash(user.password)

    # Create a new user record
    db_user = Users(
        firstName=user.firstName,
        lastName=user.lastName,
        email=user.email,
        pwd=hashed_password,
        role=user.role,
        phonenumber=user.phonenumber,
        userStatus=user.userStatus,
        createAt=datetime.now(),
        updatedAt=datetime.now(),
    )

    # Add the user to the database
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return {"message": "User Created successfully"}
    except exc.SQLAlchemyError as e:
        db.rollback()
        print("Error", e)
        raise HTTPException(status_code=500, detail="Database error")
    except Exception as err:
        print("Error", err)
        raise HTTPException(status_code=500, detail="internal server error")


@app.put("/updateUser/{user_id}")
def update_user(user_id: int, user: UserCreate, db: Session = Depends(get_db)):
    # Check if the user exists by their ID
    existing_user = db.query(Users).filter(Users.id == user_id).first()

    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    # If password is provided, hash it
    if user.password:
        hashed_password = get_password_hash(user.password)
        existing_user.pwd = hashed_password

    # Update other user details
    # existing_user.email = user.email
    existing_user.firstName = user.firstName
    existing_user.lastName = user.lastName
    existing_user.role = user.role
    existing_user.phonenumber = user.phonenumber
    existing_user.userStatus = user.userStatus
    existing_user.updatedAt = datetime.now()

    try:
        db.add(existing_user)
        db.commit()  # Commit the changes to the user
        db.refresh(existing_user)
        return {"message": "User updated successfully"}
    except exc.SQLAlchemyError as e:
        db.rollback()
        print("Error:", e)
        raise HTTPException(status_code=500, detail="Database error")
    except Exception as err:
        print("Error:", err)
        raise HTTPException(status_code=500, detail="Internal server error")


@app.delete("/deleteUser/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    # Check if the user exists by their ID
    existing_user = db.query(Users).filter(Users.id == user_id).first()

    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    existing_user.userStatus = 2  # Set user status to Deactive

    try:
        db.commit()  # Commit the deletion
        return {"message": "User deleted successfully"}
    except exc.SQLAlchemyError as e:
        db.rollback()
        print("Error:", e)
        raise HTTPException(status_code=500, detail="Database error")
    except Exception as err:
        print("Error:", err)
        raise HTTPException(status_code=500, detail="Internal server error")


@app.post("/login", response_model=Token)
def login_user(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
):
    user = (
        db.query(Users, userRole)
        .join(userRole, userRole.id == Users.role)
        .filter(Users.email == form_data.username, Users.userStatus == 1)
        .first()
    )
    if user is None or not verify_password(form_data.password, user.Users.pwd):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create the JWT token
    if user.Users.userStatus != 1:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User is not active",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(
        data={
            "email": user.Users.email,
            "role": user.Users.role,
            "userId": user.Users.id,
            "fullName": user.Users.firstName,
            "roleName": user.userRole.roleName,
        }
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/create_trade")
async def create_trade(
    trade_data: TradeDataRequest,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    try:
        # Validate the token and extract the username
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("email")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        # Insert trade data into database
        db_trade = TradeData(
            brokerId=trade_data.brokerId,
            broker=trade_data.broker,
            Date=trade_data.Date,
            tradeId=trade_data.tradeId,
            strategy=trade_data.strategy,
            counter=trade_data.counter,
            buyValue=trade_data.buyValue,
            sellValue=trade_data.sellValue,
            userId=payload.get("userId"),
        )
        db.add(db_trade)
        db.commit()
        db.refresh(db_trade)

        return {"message": "Trade data created successfully", "trade_id": db_trade.id}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


@app.put("/update_trade/{trade_id}")
async def update_trade(
    trade_id: int,
    trade_data: TradeDataRequest,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    try:
        # Validate the token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("email")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        # Retrieve trade data
        db_trade = db.query(TradeData).filter(TradeData.id == trade_id).first()
        if db_trade is None:
            raise HTTPException(status_code=404, detail="Trade not found")

        # Update trade data
        db_trade.brokerId = trade_data.brokerId
        db_trade.broker = trade_data.broker
        db_trade.Date = trade_data.Date
        db_trade.tradeId = trade_data.tradeId
        db_trade.strategy = trade_data.strategy
        db_trade.counter = trade_data.counter
        db_trade.buyValue = trade_data.buyValue
        db_trade.sellValue = trade_data.sellValue

        db.commit()
        db.refresh(db_trade)

        return {"message": "Trade data updated successfully", "trade_id": db_trade.id}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


@app.delete("/delete_trade/{trade_id}")
async def delete_trade(
    trade_id: int,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    try:
        # Validate the token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("email")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        # Retrieve and delete trade data
        db_trade = db.query(TradeData).filter(TradeData.id == trade_id).first()
        if db_trade is None:
            raise HTTPException(status_code=404, detail="Trade not found")

        db.delete(db_trade)
        db.commit()

        return {"message": "Trade data deleted successfully", "trade_id": trade_id}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/getAllTrade")
def getAllTrade(
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Fetch all trade data from the database.
    This is a protected route that requires JWT token to access.
    """
    try:
        outPut = []
        # Query all trade data
        trades = db.query(TradeData).all()
        for trade in trades:
            outPut.append(
                {
                    "id": trade.id,
                    "broker": trade.broker,
                    "Date": trade.Date.strftime("%Y-%m-%d"),
                    "tradeId": trade.tradeId,
                    "strategy": trade.strategy,
                    "counter": trade.counter,
                    "buyValue": trade.buyValue,
                    "sellValue": trade.sellValue,
                }
            )
        return outPut
    except exc.SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Database error occurred")


@app.get("/getTrade")
def getTradeById(
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Fetch trade data for a specific user from the database.
    This is a protected route that requires JWT token to access.
    """
    try:
        outPut = []
        # Query trade data for the specific user
        print(current_user.id)
        trades = db.query(TradeData).filter(TradeData.userId == current_user.id).all()
        for trade in trades:
            print(trade)
            outPut.append(
                {
                    "id": trade.id,
                    "broker": trade.broker,
                    "Date": trade.Date.strftime("%Y-%m-%d %H:%M:%S"),
                    "tradeId": trade.tradeId,
                    "strategy": trade.strategy,
                    "counter": trade.counter,
                    "buyValue": trade.buyValue,
                    "sellValue": trade.sellValue,
                    "brokerId": trade.brokerId,
                    "pl": trade.sellValue - trade.buyValue
                }
            )
        return outPut
    except exc.SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Database error occurred")


@app.get("/users", response_model=List[UserResponse])
async def get_users(
    user_data: fetchUserData = None,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Fetch all users from the database.
    This is a protected route that requires JWT token to access.
    """
    try:
        outPut = []
        # Query all users
        print("current user: %s" % current_user.id)
        users = (
            db.query(Users, userRole, Status)
            .join(userRole, Users.role == userRole.id)
            .join(Status, Users.userStatus == Status.id)
            .filter(Users.id != current_user.id, Users.userStatus == 1)
            .all()
        )

        for userdata, roledata, statusdata in users:
            print(userdata.phonenumber)
            outPut.append(
                {
                    "id": userdata.id,
                    "firstName": userdata.firstName,
                    "lastName": userdata.lastName,
                    "email": userdata.email,
                    "role": roledata.roleName,
                    "phoneNumber": userdata.phonenumber if userdata.phonenumber else "",
                    "userStatus": statusdata.statusName,
                    "createAt": userdata.createAt,
                }
            )
        return outPut
    except exc.SQLAlchemyError as e:
        print("Error", e)
        raise HTTPException(status_code=500, detail="Database error occurred")


@app.post("/createBroker")
async def create_broker(
    response: dict,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user),
):
    # Authorization Check - Only Admin (role = 1) can create a broker
    if current_user.role != 1:
        raise HTTPException(status_code=403, detail="Unauthorized")

    broker_name = response.get("brokerName")

    # Check if a broker with the same name and status not 3 exists
    existing_broker = (
        db.query(Brokers)
        .filter(Brokers.brokerName == broker_name, Brokers.brokerStatus != 3, Brokers.brokerStatus != 4)
        .first()
    )

    if existing_broker:
        raise HTTPException(status_code=400, detail="The broker name is already active")

    # Extract and Convert Fields
    gross_fund = int(response.get("grossFund", 0))
    gross_fund_interest = float(response.get("grossFundInterest", 0))
    gross_fund_sharing = float(response.get("grossFundSharing", 0))

    arbitrage_fund = int(response.get("arbitrageFund", 0))
    arbitrage_fund_interest = float(response.get("arbitrageFundInterest", 0))
    arbitrage_fund_sharing = float(response.get("arbitrageFundSharing", 0))

    prop_fund = int(response.get("propFund", 0))
    prop_fund_interest = float(response.get("propFundInterest", 0))
    prop_fund_sharing = float(response.get("propFundSharing", 0))
    
    b2p_fund = int(response.get("b2pFund", 0))
    b2p_fund_interest = float(response.get("b2pFundInterest", 0))
    b2p_fund_sharing = float(response.get("b2pFundSharing", 0))
    
    client_fund = int(response.get("clientFund", 0))
    client_fund_interest = float(response.get("clientFundInterest", 0))
    client_fund_sharing = float(response.get("clientFundSharing", 0))
    

    cost_per_cr = float(response.get("costPerCr", 0))

    # Calculate Total Fund
    total_fund = gross_fund + arbitrage_fund + prop_fund

    # Create Broker Entry
    new_broker = Brokers(
        brokerName=broker_name,
        grossFund=gross_fund,
        grossFundInterest=gross_fund_interest,
        grossFundSharing=gross_fund_sharing,
        arbitrageFund=arbitrage_fund,
        arbitrageFundInterest=arbitrage_fund_interest,
        arbitrageFundSharing=arbitrage_fund_sharing,
        propFund=prop_fund,
        propFundInterest=prop_fund_interest,
        propFundSharing=prop_fund_sharing,
        b2pFund=b2p_fund,
        b2pFundInterest=b2p_fund_interest,
        b2pFundSharing=b2p_fund_sharing,
        clientFund=client_fund,
        clientFundInterest=client_fund_interest,
        clientSharing=client_fund_sharing,
        costPerCr=cost_per_cr,
        totalFund=total_fund,
    )

    try:
        db.add(new_broker)
        db.commit()
        return {"message": "Broker created successfully"}
    except exc.SQLAlchemyError as e:
        db.rollback()  # Rollback if there is a database error
        print("Database Error:", e)
        raise HTTPException(status_code=500, detail="Database error")
    except Exception as err:
        print("Error:", err)
        raise HTTPException(status_code=500, detail="Internal server error")


# Helper functions for calculation (as before)
def calculate_interest(gross_fund, arbitrage_fund, prop_fund):
    # Placeholder calculation for interest
    return gross_fund * 0.05  # Assuming 5% interest on gross fund


def calculate_sharing(gross_fund):
    # Placeholder calculation for sharing
    return gross_fund * 0.10  # Assuming 10% sharing on gross fund


def calculate_cost_per_cr(gross_fund):
    # Placeholder calculation for cost per CR
    return (
        gross_fund / 100
    )  # Assuming cost per CR is calculated as gross fund divided by 100


def calculate_interest(gross_fund, arbitrage_fund, prop_fund):
    # Placeholder calculation for interest
    return gross_fund * 0.05  # Assuming 5% interest on gross fund


def calculate_sharing(gross_fund):
    # Placeholder calculation for sharing
    return gross_fund * 0.10  # Assuming 10% sharing on gross fund


def calculate_cost_per_cr(gross_fund):
    # Placeholder calculation for cost per CR
    return (
        gross_fund / 100
    )  # Assuming cost per CR is calculated as gross fund divided by 100


@app.post("/createId")
async def createId(
    response: CreateIdRequest,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user),
):
    if current_user.role != 1:
        HTTPException(status_code=500, detail="unAuthorized")

    print(response)

    existing_id = (
        db.query(Ids)
        .filter(
            Ids.idNumber == response.id,
            Ids.idStatus != 3,
        )
        .first()
    )

    if existing_id:
        raise HTTPException(status_code=400, detail="ID already exists")

    createId = Ids(
        idNumber=response.id,
        brokerId=response.brokerName,
        emloyeeId=response.employee,
        idType=response.idType,
        nism=response.nism,
        startDate=response.startDate,
        releaseDate=response.releaseDate,
    )
    try:
        db.add(createId)
        db.commit()
        return {"message": "Ids created successfully"}
    except exc.SQLAlchemyError as e:
        db.rollback()
        print("Error", e)
        raise HTTPException(status_code=500, detail="Database error")
    except Exception as err:
        print("Error", err)
        raise HTTPException(status_code=500, detail="internal server error")

@app.put("/changeStatus/{id}")
async def changeStatus(
    id: int,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user),
):
    if current_user.role != 1:
        raise HTTPException(status_code=401, detail="Unauthorized")

    existing_id = db.query(Ids).filter(Ids.recordId == id).first()

    if not existing_id:
        raise HTTPException(status_code=404, detail="ID not found")

    try:
        existing_id.idStatus = 4
        db.commit()
        return {"message": "ID status Deleted successfully"}
    except exc.SQLAlchemyError as e:
        db.rollback()
        print("Error", e)
        raise HTTPException(status_code=500, detail="Database error")
    except Exception as err:
        print("Error", err)
        raise HTTPException(status_code=500, detail="Internal server error")


@app.put("/updateId/{record_id}")
async def update_id(
    record_id: int,
    response: CreateIdRequest,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user),
):
    if current_user.role != 1:
        raise HTTPException(status_code=403, detail="Unauthorized access")

    # Fetch existing record
    existing_record = db.query(Ids).filter(Ids.recordId == record_id).first()

    if not existing_record:
        raise HTTPException(status_code=404, detail="ID record not found")

    # Update fields
    existing_record.idNumber = response.id
    existing_record.brokerId = response.brokerName
    existing_record.employeeId = response.employee  # Fixed typo
    existing_record.idType = response.idType
    existing_record.nism = response.nism
    existing_record.startDate = response.startDate
    existing_record.releaseDate = response.releaseDate  # Ensure consistency

    try:
        db.add(existing_record)
        db.commit()
        db.refresh(existing_record)
        return {"message": "ID updated successfully"}
    except exc.SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except Exception as err:
        raise HTTPException(
            status_code=500, detail=f"Internal server error: {str(err)}"
        )


@app.get("/getIds")
async def get_ids(
    broker_id: int | None = None,  # Optional query parameter
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user),
):
    # Authorization check
    if current_user.role != 1:
        raise HTTPException(status_code=403, detail="Unauthorized")

    try:
        # Fetch IDs with optional filtering
        if broker_id:
            # Filter out brokers with status 3
            results = (
                db.query(Ids).filter(Ids.brokerId == broker_id, Ids.brokerId != 3, Ids.brokerId != 4).all()
            )
        else:
            results = (
                db.query(Ids, Brokers, Users)
                .outerjoin(Brokers, Brokers.id == Ids.brokerId)
                .outerjoin(Users, Users.id == Ids.emloyeeId)
                .filter(Ids.idStatus != 4)
                .all()
            )

        if not results:
            return {"status_code": 404, "detail": "No IDs found"}

        ids = [
            {
                "idNumber": id_record.idNumber,
                "recordId": id_record.recordId,
                "brokerId": id_record.brokerId,
                "brokerName": broker_record.brokerName if broker_record else None,
                "employeeId": user_record.firstName if user_record else None,
                "idType": id_record.idType,
                "nism": id_record.nism,
                "status": id_record.idStatus,
                "startDate": id_record.startDate,
                "releaseDate": id_record.releaseDate,
            }
            for id_record, broker_record, user_record in results
        ]

        return {"data": ids}
    except Exception as err:
        print("Error:", err)
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/getAllBroker")
@app.get("/getAllBroker/{status}")
async def getBroker(
    status: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user),
):
    try:
        # Fetch brokers based on status
        if status is None:
            print("No status")
            brokerData = db.query(Brokers).filter(Brokers.brokerStatus != 4).all()
        else:
            brokerData = (
                db.query(Brokers)
                .filter(Brokers.brokerStatus == status, Brokers.brokerStatus != 4)
                .order_by(desc(Brokers.createAt))
                .all()
            )

        # Prepare output data
        outPut = []
        total_gross_fund = 0
        total_b2p_fund = 0
        total_arbitrage_fund = 0
        total_prop_fund = 0
        total_client_fund = 0

        for datas in brokerData:
            total_gross_fund += datas.grossFund
            total_b2p_fund += datas.b2pFund
            total_arbitrage_fund += datas.arbitrageFund
            total_prop_fund += datas.propFund
            total_client_fund += datas.clientFund

            outPut.append(
                {
                    "id": datas.id,
                    "brokerName": datas.brokerName,
                    "grossFund": datas.grossFund,
                    "grossFundInterest": datas.grossFundInterest,
                    "grossFundSharing": datas.grossFundSharing,
                    "arbitrageFund": datas.arbitrageFund,
                    "arbitrageFundInterest": datas.arbitrageFundInterest,
                    "arbitrageFundSharing": datas.arbitrageFundSharing,
                    "propFund": datas.propFund,
                    "propFundInterest": datas.propFundInterest,
                    "propFundSharing": datas.propFundSharing,
                    "b2pFund": datas.b2pFund,
                    "b2pFundInterest": datas.b2pFundInterest,
                    "b2pFundSharing": datas.b2pFundSharing,
                    "clientFund": datas.clientFund,
                    "clientFundInterest": datas.clientFundInterest,
                    "clientFundSharing": datas.clientSharing,
                    "costPerCr": datas.costPerCr,
                    "startDate": datas.createAt.strftime("%Y-%m-%d %H:%M:%S"),
                    "status": datas.brokerStatus,
                    "releaseDate": (
                        datas.releaseDate.strftime("%Y-%m-%d %H:%M:%S")
                        if datas.releaseDate
                        else None
                    ),
                }
            )

        # Add total fund calculations
        totals = [{
            "totalGrossFund": total_gross_fund,
            "totalB2pFund": total_b2p_fund,
            "totalArbitrageFund": total_arbitrage_fund,
            "totalPropFund": total_prop_fund,
            "totalClientFund": total_client_fund,
        }]

        return {"message": "Brokers fetched successfully", "data": outPut, "totals": totals}

    except Exception as e:
        print("Error in getBroker API:", e)
        raise HTTPException(status_code=500, detail="Internal server error")


@app.put("/softDeleteBroker/{id}")
async def softDeleteBroker(
    id: int,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user),
):
    if current_user.role != 1:
        raise HTTPException(status_code=401, detail="Unauthorized")

    existing_broker = db.query(Brokers).filter(Brokers.id == id).first()

    if not existing_broker:
        raise HTTPException(status_code=404, detail="Broker not found")

    try:
        existing_broker.brokerStatus = 4
        db.commit()
        return {"message": "Broker deleted successfully"}
    except exc.SQLAlchemyError as e:
        db.rollback()
        print("Error", e)
        raise HTTPException(status_code=500, detail="Database error")
    except Exception as err:
        print("Error", err)
        raise HTTPException(status_code=500, detail="Internal server error")


@app.put("/releaseBroker/{id}/{status}")
async def relaseBroker(
    id: int,
    status: int,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user),
):
    try:
        brokerData = db.query(Brokers).filter(Brokers.id == id).first()

        if brokerData is None:
            raise HTTPException(status_code=404, detail="Broker not found")

        ids = db.query(Ids).filter(Ids.brokerId == brokerData.id).all()
        if ids:
            for id in ids:
                id.idStatus = status
                id.releaseDate = datetime.now()
                id.updatedAt = datetime.now()

        brokerData.brokerStatus = status
        brokerData.releaseDate = datetime.now()
        brokerData.updatedAt = datetime.now()

        db.commit()

        return {"message": "Broker relase Successfully"}

    except Exception as e:
        print("error in relaseBroker", e)
        raise HTTPException(status_code=500, details="Internal server error")


@app.put("/releaseId/{id}/{status}")
async def relaseId(
    id: int,
    status: int,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user),
):
    try:
        idData = db.query(Ids).filter(Ids.recordId == id).first()

        if idData is None:
            return {"status": 404, "detail": "Id not found"}

        idData.idStatus = status
        idData.releaseDate = datetime.now()
        idData.updatedAt = datetime.now()

        db.commit()

        return {"message": "Id relase Successfully"}

    except Exception as e:
        print("error in relaseId", e)
        return {"status": 500, "details": "Internal server error"}


@app.put("/updateBroker/{broker_id}")
async def update_broker(
    broker_id: int,
    response: dict,  # Properly typed response for broker update
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user),
):
    # Authorization check - Role should be 1 (admin or any other privileged role)
    if current_user.role != 1:
        raise HTTPException(status_code=403, detail="Unauthorized")

    # Check if the broker exists
    broker = db.query(Brokers).filter(Brokers.id == broker_id).first()
    if not broker:
        raise HTTPException(status_code=404, detail="Broker not found")

    broker_name = response.get("brokerName")

    # If the broker name is changed, check if the new name is active
    if broker_name != broker.brokerName:
        existing_broker = (
            db.query(Brokers)
            .filter(Brokers.brokerName == broker_name, Brokers.brokerStatus != 3)
            .first()
        )

        if existing_broker:
            raise HTTPException(
                status_code=400, detail="The broker name is already active"
            )

    # Update the broker fields (if provided in the response)
    broker.brokerName = broker_name
    broker.grossFund = int(response.get("grossFund", broker.grossFund))
    broker.arbitrageFund = int(response.get("arbitrageFund", broker.arbitrageFund))
    broker.propFund = int(response.get("propFund", broker.propFund))
    broker.b2pFund = int(response.get("b2pFund", broker.b2pFund))
    broker.clientFund = int(response.get("clientFund", broker.clientFund))
    # Assuming these are calculations for the new fields
    broker.grossFundInterest = response.get("grossFundInterest", broker.grossFundInterest)
    broker.grossFundSharing = response.get("grossFundSharing", broker.grossFundSharing)
    broker.arbitrageFundInterest = response.get("arbitrageFundInterest", broker.arbitrageFundInterest)
    broker.arbitrageFundSharing = response.get("arbitrageFundSharing", broker.arbitrageFundSharing)
    broker.b2pFundInterest = response.get("b2pFundInterest", broker.b2pFundInterest)
    broker.b2pFundSharing = response.get("b2pFundSharing", broker.b2pFundSharing)
    broker.clientFundInterest = response.get("clientFundInterest", broker.clientFundInterest)
    broker.clientFundInterest = response.get("clientFundInterest", broker.clientFundInterest)
    broker.costPerCr = response.get("costPerCr", broker.costPerCr)
    broker.totalFund = (
        broker.grossFund + broker.arbitrageFund + broker.propFund
    )  # Update total fund

    # Optionally update release date if provided
    if response.get("releaseDate"):
        broker.releaseDate = response.get("releaseDate")

    try:
        db.commit()
        return {"message": "Broker updated successfully"}
    except exc.SQLAlchemyError as e:
        db.rollback()  # Rollback the transaction if there is a database error
        print("Database Error:", e)
        raise HTTPException(status_code=500, detail="Database error")
    except Exception as err:
        print("Error:", err)
        raise HTTPException(status_code=500, detail="Internal server error")


@app.get("/getIdsByBroker/{broker_id}")
async def getIdsByBroker(
    broker_id: int,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user),
):
    try:
        # Fetch IDs with optional filtering
        print("User role", current_user.role)
        if current_user.role == 1:
            results = (
                db.query(Ids)
                .filter(
                    Ids.brokerId == broker_id,
                    Ids.idStatus == 1,
                )
                .all()
            )
        else:
            results = (
                db.query(Ids)
                .filter(
                    Ids.brokerId == broker_id,
                    Ids.emloyeeId == current_user.id,
                    Ids.idStatus == 1,
                )
                .all()
            )

        if not results:
            return {"status_code": 404, "detail": "No IDs found"}

        return {"data": results}
    except Exception as err:
        print("Error:", err)
        raise HTTPException(status_code=500, detail="Internal server error")


@app.post("/strategies", status_code=status.HTTP_201_CREATED)
def create_strategy(strategy: StrategyCreate, db: Session = Depends(get_db)):
    try:
        db_strategy = Strategy(StrategyName=strategy.strategyName)
        db.add(db_strategy)
        db.commit()
        db.refresh(db_strategy)
        return {"status_code": 201, "details": "Strategy Created successfully"}
    except Exception as e:
        db.rollback()
        print("error", e)
        raise HTTPException(status_code=500, detail="internal server error")


@app.put("/strategies/{strategy_id}", response_model=StrategyOut)
def update_strategy(
    strategy_id: int, strategy_update: StrategyUpdate, db: Session = Depends(get_db)
):
    strategy = db.query(Strategy).filter(Strategy.id == strategy_id).first()
    if strategy is None:
        raise HTTPException(status_code=404, detail="Strategy not found")
    strategy.StrategyName = strategy_update.StrategyName
    db.commit()
    db.refresh(strategy)
    return strategy


@app.delete("/strategies/{strategy_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_strategy(strategy_id: int, db: Session = Depends(get_db)):
    strategy = db.query(Strategy).filter(Strategy.id == strategy_id).first()
    if strategy is None:
        raise HTTPException(status_code=404, detail="Strategy not found")
    db.delete(strategy)
    db.commit()
    return None


@app.get("/getStrategies")
def read_strategies(db: Session = Depends(get_db)):
    try:
        strategies = db.query(Strategy).all()
        return strategies
    except Exception as e:
        print("error", e)
        raise HTTPException(status_code=500, detail="internal server error")


class StrategyDataIn(BaseModel):
    stratagyData: dict


class StrategyDataOut(StrategyDataIn):
    id: int
