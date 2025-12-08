"""
Seed initial data for development.
"""
from database import SessionLocal, engine, Base
import crud
from models import GameMode, Direction, GameStatus, Position

def seed_database():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if users already exist
        existing_user = crud.get_user_by_email(db, "pro@snake.com")
        if existing_user:
            print("Database already seeded!")
            return
        
        # Create users
        print("Creating users...")
        users_data = [
            ("ProSnaker", "pro@snake.com", "pass123"),
            ("SnakeKing", "king@snake.com", "pass123"),
            ("Slither99", "slither@snake.com", "pass123"),
            ("ViperQueen", "viper@snake.com", "pass123"),
            ("PythonMaster", "python@snake.com", "pass123"),
            ("CobraKai", "cobra@snake.com", "pass123"),
            ("Anaconda", "ana@snake.com", "pass123"),
        ]
        
        users = []
        for username, email, password in users_data:
            user = crud.create_user(db, username, email, password)
            users.append(user)
            print(f"  Created user: {username}")
        
        # Create leaderboard entries
        print("Creating leaderboard entries...")
        leaderboard_data = [
            (users[0].id, "ProSnaker", 2450, GameMode.WALLS),
            (users[1].id, "SnakeKing", 2100, GameMode.PASS_THROUGH),
            (users[2].id, "Slither99", 1890, GameMode.WALLS),
            (users[3].id, "ViperQueen", 1750, GameMode.PASS_THROUGH),
            (users[4].id, "PythonMaster", 1620, GameMode.WALLS),
            (users[5].id, "CobraKai", 1500, GameMode.PASS_THROUGH),
            (users[6].id, "Anaconda", 1350, GameMode.WALLS),
        ]
        
        for user_id, username, score, mode in leaderboard_data:
            crud.create_leaderboard_entry(db, user_id, username, score, mode)
            print(f"  Created leaderboard entry for {username}: {score}")
        
        # Create live players
        print("Creating live players...")
        live_players_data = [
            ("live-1", "SpeedySnake", 150, GameMode.PASS_THROUGH,
             [{"x": 10, "y": 10}, {"x": 9, "y": 10}, {"x": 8, "y": 10}],
             {"x": 15, "y": 15}, "RIGHT", "playing"),
            ("live-2", "NeonViper", 340, GameMode.WALLS,
             [{"x": 20, "y": 20}, {"x": 20, "y": 19}, {"x": 20, "y": 18}, {"x": 20, "y": 17}],
             {"x": 5, "y": 5}, "DOWN", "playing"),
            ("live-3", "CyberSerpent", 80, GameMode.PASS_THROUGH,
             [{"x": 5, "y": 5}, {"x": 6, "y": 5}, {"x": 7, "y": 5}],
             {"x": 12, "y": 12}, "LEFT", "playing"),
        ]
        
        for player_id, username, score, mode, snake, food, direction, status in live_players_data:
            crud.create_live_player(db, player_id, username, score, mode, snake, food, direction, status)
            print(f"  Created live player: {username}")
        
        print("\n✅ Database seeded successfully!")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
