"""
CRUD operations for database.
"""
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional
import bcrypt
from datetime import datetime

import db_models
from models import GameMode

# Password hashing using bcrypt directly
def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

# User operations
def get_user_by_email(db: Session, email: str) -> Optional[db_models.User]:
    return db.query(db_models.User).filter(db_models.User.email == email).first()

def get_user_by_id(db: Session, user_id: int) -> Optional[db_models.User]:
    return db.query(db_models.User).filter(db_models.User.id == user_id).first()

def create_user(db: Session, username: str, email: str, password: str) -> db_models.User:
    hashed_password = get_password_hash(password)
    db_user = db_models.User(
        username=username,
        email=email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Leaderboard operations
def get_leaderboard(db: Session, mode: Optional[GameMode] = None, limit: int = 100) -> List[db_models.LeaderboardEntry]:
    query = db.query(db_models.LeaderboardEntry)
    if mode:
        query = query.filter(db_models.LeaderboardEntry.mode == mode.value)
    return query.order_by(desc(db_models.LeaderboardEntry.score)).limit(limit).all()

def create_leaderboard_entry(
    db: Session,
    user_id: int,
    username: str,
    score: int,
    mode: GameMode
) -> db_models.LeaderboardEntry:
    entry = db_models.LeaderboardEntry(
        user_id=user_id,
        username=username,
        score=score,
        mode=mode.value
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry

# Live players operations
def get_live_players(db: Session) -> List[db_models.LivePlayer]:
    return db.query(db_models.LivePlayer).all()

def get_live_player(db: Session, player_id: str) -> Optional[db_models.LivePlayer]:
    return db.query(db_models.LivePlayer).filter(db_models.LivePlayer.id == player_id).first()

def create_live_player(
    db: Session,
    player_id: str,
    username: str,
    score: int,
    mode: GameMode,
    snake: list,
    food: dict,
    direction: str,
    status: str
) -> db_models.LivePlayer:
    player = db_models.LivePlayer(
        id=player_id,
        username=username,
        score=score,
        mode=mode.value,
        snake=snake,
        food=food,
        direction=direction,
        status=status
    )
    db.add(player)
    db.commit()
    db.refresh(player)
    return player

def update_live_player(
    db: Session,
    player_id: str,
    score: int,
    snake: list,
    food: dict,
    direction: str,
    status: str
) -> Optional[db_models.LivePlayer]:
    player = get_live_player(db, player_id)
    if player:
        player.score = score
        player.snake = snake
        player.food = food
        player.direction = direction
        player.status = status
        db.commit()
        db.refresh(player)
        return player
    return None

def delete_live_player(db: Session, player_id: str) -> bool:
    player = get_live_player(db, player_id)
    if player:
        db.delete(player)
        db.commit()
        return True
    return False

# RPG Leaderboard operations
def create_rpg_leaderboard_entry(
    db: Session,
    user_id: int,
    username: str,
    level_id: int,
    score: int,
    time_seconds: float
) -> db_models.RPGLeaderboard:
    entry = db_models.RPGLeaderboard(
        user_id=user_id,
        username=username,
        level_id=level_id,
        score=score,
        time_seconds=time_seconds
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry

def get_rpg_leaderboard(
    db: Session,
    level_id: int,
    limit: int = 10
) -> List[db_models.RPGLeaderboard]:
    """Get top scores for a specific level, ordered by score DESC, then time ASC"""
    return (
        db.query(db_models.RPGLeaderboard)
        .filter(db_models.RPGLeaderboard.level_id == level_id)
        .order_by(
            desc(db_models.RPGLeaderboard.score),
            db_models.RPGLeaderboard.time_seconds.asc()
        )
        .limit(limit)
        .all()
    )
