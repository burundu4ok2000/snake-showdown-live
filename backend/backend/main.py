from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List, Optional
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os

from models import (
    User, AuthResponse, UserCreate, UserLogin, 
    LeaderboardEntry, ScoreSubmit, LivePlayer, GameMode
)
from database import engine, Base, get_db
import db_models
import crud

# Create database tables
Base.metadata.create_all(bind=engine)

# JWT configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

app = FastAPI(title="Snake Showdown Live API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Production: replace with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> db_models.User:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = crud.get_user_by_id(db, user_id=user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    return user

@app.post("/auth/login", response_model=AuthResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, credentials.email)
    if not user or not crud.verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token(data={"sub": str(user.id)})
    return AuthResponse(
        user=User(id=str(user.id), username=user.username, email=user.email),
        token=token
    )

@app.post("/auth/signup", status_code=201, response_model=AuthResponse)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    if crud.get_user_by_email(db, user_data.email):
        raise HTTPException(status_code=409, detail="User already exists")
    
    user = crud.create_user(db, user_data.username, user_data.email, user_data.password)
    token = create_access_token(data={"sub": str(user.id)})
    return AuthResponse(
        user=User(id=str(user.id), username=user.username, email=user.email),
        token=token
    )

@app.post("/auth/logout")
def logout(current_user: db_models.User = Depends(get_current_user)):
    return {"message": "Successfully logged out"}

@app.get("/auth/me", response_model=User)
def get_me(current_user: db_models.User = Depends(get_current_user)):
    return User(
        id=str(current_user.id),
        username=current_user.username,
        email=current_user.email
    )

@app.get("/leaderboard", response_model=List[LeaderboardEntry])
def get_leaderboard(mode: Optional[GameMode] = None, db: Session = Depends(get_db)):
    entries = crud.get_leaderboard(db, mode)
    return [
        LeaderboardEntry(
            id=str(entry.id),
            username=entry.username,
            score=entry.score,
            mode=GameMode(entry.mode),
            date=entry.date.strftime("%Y-%m-%d")
        )
        for entry in entries
    ]

@app.post("/leaderboard", status_code=201, response_model=LeaderboardEntry)
def submit_score(
    score_data: ScoreSubmit,
    current_user: db_models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    entry = crud.create_leaderboard_entry(
        db,
        user_id=current_user.id,
        username=current_user.username,
        score=score_data.score,
        mode=score_data.mode
    )
    return LeaderboardEntry(
        id=str(entry.id),
        username=entry.username,
        score=entry.score,
        mode=GameMode(entry.mode),
        date=entry.date.strftime("%Y-%m-%d")
    )

@app.get("/live-players", response_model=List[LivePlayer])
def get_live_players(db: Session = Depends(get_db)):
    players = crud.get_live_players(db)
    return [
        LivePlayer(
            id=player.id,
            username=player.username,
            score=player.score,
            mode=GameMode(player.mode),
            snake=player.snake,
            food=player.food,
            direction=player.direction,
            status=player.status
        )
        for player in players
    ]

@app.get("/live-players/{player_id}", response_model=LivePlayer)
def get_live_player(player_id: str, db: Session = Depends(get_db)):
    player = crud.get_live_player(db, player_id)
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    return LivePlayer(
        id=player.id,
        username=player.username,
        score=player.score,
        mode=GameMode(player.mode),
        snake=player.snake,
        food=player.food,
        direction=player.direction,
        status=player.status
    )

@app.post("/live-players", status_code=201, response_model=LivePlayer)
def create_live_player(
    player_data: LivePlayer,
    db: Session = Depends(get_db)
):
    """Create a new live player when game starts"""
    player = crud.create_live_player(
        db,
        player_id=player_data.id,
        username=player_data.username,
        score=player_data.score,
        mode=player_data.mode,
        snake=player_data.snake,
        food=player_data.food,
        direction=player_data.direction,
        status=player_data.status
    )
    return LivePlayer(
        id=player.id,
        username=player.username,
        score=player.score,
        mode=GameMode(player.mode),
        snake=player.snake,
        food=player.food,
        direction=player.direction,
        status=player.status
    )

@app.put("/live-players/{player_id}", response_model=LivePlayer)
def update_live_player(
    player_id: str,
    player_data: LivePlayer,
    db: Session = Depends(get_db)
):
    """Update live player state during gameplay"""
    player = crud.update_live_player(
        db,
        player_id=player_id,
        score=player_data.score,
        snake=player_data.snake,
        food=player_data.food,
        direction=player_data.direction,
        status=player_data.status
    )
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    return LivePlayer(
        id=player.id,
        username=player.username,
        score=player.score,
        mode=GameMode(player.mode),
        snake=player.snake,
        food=player.food,
        direction=player.direction,
        status=player.status
    )

@app.delete("/live-players/{player_id}", status_code=204)
def delete_live_player(player_id: str, db: Session = Depends(get_db)):
    """Remove player when game ends or player disconnects"""
    success = crud.delete_live_player(db, player_id)
    if not success:
        raise HTTPException(status_code=404, detail="Player not found")
    return None

# RPG Leaderboard Endpoints
@app.post("/rpg/leaderboard", status_code=201)
def submit_rpg_score(
    level_id: int,
    score: int,
    time_seconds: float,
    current_user: db_models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit RPG leaderboard score for a specific level"""
    if level_id < 1 or level_id > 20:
        raise HTTPException(status_code=400, detail="Level ID must be between 1 and 20")
    
    entry = crud.create_rpg_leaderboard_entry(
        db,
        user_id=current_user.id,
        username=current_user.username,
        level_id=level_id,
        score=score,
        time_seconds=time_seconds
    )
    return {
        "id": entry.id,
        "username": entry.username,
        "level_id": entry.level_id,
        "score": entry.score,
        "time_seconds": entry.time_seconds,
        "completed_at": entry.completed_at.isoformat()
    }

@app.get("/rpg/leaderboard/{level_id}")
def get_rpg_leaderboard(
    level_id: int,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """Get top scores for a specific RPG level"""
    if level_id < 1 or level_id > 20:
        raise HTTPException(status_code=400, detail="Level ID must be between 1 and 20")
    
    entries = crud.get_rpg_leaderboard(db, level_id, limit)
    return [
        {
            "rank": idx + 1,
            "username": entry.username,
            "score": entry.score,
            "time_seconds": entry.time_seconds,
            "completed_at": entry.completed_at.isoformat()
        }
        for idx, entry in enumerate(entries)
    ]
