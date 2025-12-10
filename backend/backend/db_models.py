"""
SQLAlchemy database models.
"""
from sqlalchemy import Column, String, Integer, Float, DateTime, Enum as SQLEnum, JSON
from datetime import datetime
from database import Base
import enum

class GameModeEnum(str, enum.Enum):
    PASS_THROUGH = "pass-through"
    WALLS = "walls"

class GameStatusEnum(str, enum.Enum):
    IDLE = "idle"
    PLAYING = "playing"
    PAUSED = "paused"
    GAME_OVER = "game-over"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class LeaderboardEntry(Base):
    __tablename__ = "leaderboard"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    username = Column(String, nullable=False)
    score = Column(Integer, nullable=False)
    mode = Column(SQLEnum(GameModeEnum), nullable=False)
    date = Column(DateTime, default=datetime.utcnow)

class LivePlayer(Base):
    __tablename__ = "live_players"

    id = Column(String, primary_key=True, index=True)
    username = Column(String, nullable=False)
    score = Column(Integer, default=0)
    mode = Column(SQLEnum(GameModeEnum), nullable=False)
    snake = Column(JSON, nullable=False)  # Array of positions
    food = Column(JSON, nullable=False)   # Single position
    direction = Column(String, nullable=False)
    status = Column(SQLEnum(GameStatusEnum), default=GameStatusEnum.PLAYING)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class RPGLeaderboard(Base):
    __tablename__ = "rpg_leaderboard"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    username = Column(String, nullable=False)
    level_id = Column(Integer, nullable=False, index=True)  # 1-20
    score = Column(Integer, nullable=False)  # Total score achieved
    time_seconds = Column(Float, nullable=False)  # Time to complete
    completed_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Composite index for fast queries per level
    __table_args__ = (
        # Index for getting top scores per level
        {'mysql_index': [('level_id', 'score', 'time_seconds')]},
    )
