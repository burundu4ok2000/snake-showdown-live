from typing import List, Optional, Dict
from datetime import date
from models import User, LeaderboardEntry, LivePlayer, GameMode, Direction, GameStatus, Position

class MockDB:
    def __init__(self):
        self.users: List[User] = [
            User(id="1", username="ProSnaker", email="pro@snake.com"),
            User(id="2", username="SnakeKing", email="king@snake.com"),
            User(id="3", username="Slither99", email="slither@snake.com"),
            User(id="4", username="ViperQueen", email="viper@snake.com"),
            User(id="5", username="PythonMaster", email="python@snake.com"),
            User(id="6", username="CobraKai", email="cobra@snake.com"),
            User(id="7", username="Anaconda", email="ana@snake.com"),
        ]
        # Simulate password storage (insecure for mock)
        self.passwords: Dict[str, str] = {
            "pro@snake.com": "password",
            "king@snake.com": "password",
            "slither@snake.com": "password",
            "viper@snake.com": "password",
            "python@snake.com": "password",
            "cobra@snake.com": "password",
            "ana@snake.com": "password",
        }
        
        self.leaderboard: List[LeaderboardEntry] = [
            LeaderboardEntry(id="1", username="ProSnaker", score=2450, mode=GameMode.WALLS, date="2024-01-15"),
            LeaderboardEntry(id="2", username="SnakeKing", score=2100, mode=GameMode.PASS_THROUGH, date="2024-01-14"),
            LeaderboardEntry(id="3", username="Slither99", score=1890, mode=GameMode.WALLS, date="2024-01-13"),
            LeaderboardEntry(id="4", username="ViperQueen", score=1750, mode=GameMode.PASS_THROUGH, date="2024-01-12"),
            LeaderboardEntry(id="5", username="PythonMaster", score=1620, mode=GameMode.WALLS, date="2024-01-11"),
            LeaderboardEntry(id="6", username="CobraKai", score=1500, mode=GameMode.PASS_THROUGH, date="2024-01-10"),
            LeaderboardEntry(id="7", username="Anaconda", score=1350, mode=GameMode.WALLS, date="2024-01-09"),
            LeaderboardEntry(id="8", username="BlackMamba", score=1200, mode=GameMode.PASS_THROUGH, date="2024-01-08"),
            LeaderboardEntry(id="9", username="RattleSnake", score=1100, mode=GameMode.WALLS, date="2024-01-07"),
            LeaderboardEntry(id="10", username="BoaConstrictor", score=950, mode=GameMode.PASS_THROUGH, date="2024-01-06"),
            LeaderboardEntry(id="11", username="NoFeet", score=850, mode=GameMode.WALLS, date="2024-01-05"),
            LeaderboardEntry(id="12", username="SlipperySteve", score=750, mode=GameMode.PASS_THROUGH, date="2024-01-04"),
        ]
        
        self.live_players: List[LivePlayer] = [
             LivePlayer(
                id="live-1",
                username="SpeedySnake",
                score=150,
                mode=GameMode.PASS_THROUGH,
                snake=[Position(x=10, y=10), Position(x=9, y=10), Position(x=8, y=10)],
                food=Position(x=15, y=15),
                direction=Direction.RIGHT,
                status=GameStatus.PLAYING
            ),
             LivePlayer(
                id="live-2",
                username="NeonViper",
                score=340,
                mode=GameMode.WALLS,
                snake=[Position(x=20, y=20), Position(x=20, y=19), Position(x=20, y=18), Position(x=20, y=17)],
                food=Position(x=5, y=5),
                direction=Direction.DOWN,
                status=GameStatus.PLAYING
            ),
             LivePlayer(
                id="live-3",
                username="CyberSerpent",
                score=80,
                mode=GameMode.PASS_THROUGH,
                snake=[Position(x=5, y=5), Position(x=6, y=5), Position(x=7, y=5)],
                food=Position(x=12, y=12),
                direction=Direction.LEFT,
                status=GameStatus.PLAYING
            )
        ]

    def get_user_by_email(self, email: str) -> Optional[User]:
        return next((u for u in self.users if u.email == email), None)

    def create_user(self, username: str, email: str, password: str) -> User:
        user_id = str(len(self.users) + 1)
        new_user = User(id=user_id, username=username, email=email)
        self.users.append(new_user)
        self.passwords[email] = password
        return new_user

    def verify_password(self, email: str, password: str) -> bool:
        return self.passwords.get(email) == password

    def get_leaderboard(self, mode: Optional[GameMode] = None) -> List[LeaderboardEntry]:
        entries = self.leaderboard
        if mode:
            entries = [e for e in entries if e.mode == mode]
        return sorted(entries, key=lambda x: x.score, reverse=True)

    def add_score(self, username: str, score: int, mode: GameMode) -> LeaderboardEntry:
        entry_id = str(len(self.leaderboard) + 1)
        entry = LeaderboardEntry(
            id=entry_id,
            username=username,
            score=score,
            mode=mode,
            date=date.today().isoformat()
        )
        self.leaderboard.append(entry)
        return entry

    def get_live_players(self) -> List[LivePlayer]:
        return self.live_players

    def get_live_player(self, player_id: str) -> Optional[LivePlayer]:
        return next((p for p in self.live_players if p.id == player_id), None)

db = MockDB()
