# Database Integration Summary

## Changes Made

### 1. **Database Configuration** (`database.py`)
- Created SQLAlchemy engine and session management
- Supports both SQLite (default) and PostgreSQL
- Database URL configurable via `DATABASE_URL` environment variable

### 2. **Database Models** (`db_models.py`)
- `User`: Stores user accounts with hashed passwords
- `LeaderboardEntry`: Stores game scores and rankings
- `LivePlayer`: Stores active player game states

### 3. **CRUD Operations** (`crud.py`)
- Password hashing with bcrypt
- User management (create, authenticate)
- Leaderboard operations (get, create)
- Live player management (get, create, delete)

### 4. **Updated Main Application** (`main.py`)
- Integrated SQLAlchemy sessions via dependency injection
- JWT-based authentication (tokens expire in 7 days)
- All endpoints now use real database operations

### 5. **Seeding Script** (`seed.py`)
- Populates database with test users, leaderboard entries, and live players
- Run with `make db-seed` or `uv run python seed.py`

### 6. **Environment Configuration** (`.env.example`)
- `DATABASE_URL`: Database connection string
- `SECRET_KEY`: JWT signing key (must be changed in production!)

### 7. **Updated Makefile**
New commands:
- `make db-init` - Initialize database tables
- `make db-seed` - Seed with initial data
- `make db-reset` - Reset database (drop and recreate)

## Usage

### Development (SQLite)
```bash
cd backend/backend
make db-reset  # Initialize and seed database
make dev       # Start server
```

### Production (PostgreSQL)
```bash
# Set environment variable
export DATABASE_URL="postgresql://user:password@localhost/snake_showdown"

# Or create .env file
echo 'DATABASE_URL=postgresql://user:password@localhost/snake_showdown' > .env
echo 'SECRET_KEY=your-very-long-random-secret-key-here' >> .env

# Initialize database
make db-init
make db-seed

# Start server
make dev
```

## Test Credentials

After seeding, you can login with:
- Email: `pro@snake.com`, Password: `pass123`
- Email: `king@snake.com`, Password: `pass123`
- (5 more test accounts available)

## Security Notes

1. **JWT Secret**: Change `SECRET_KEY` in production!
2. **Password Hashing**: Uses bcrypt for secure password storage
3. **Database**: SQLite is for development only. Use PostgreSQL in production.
4. **CORS**: Currently allows all origins. Restrict in production!

## Database Schema

### users
- id (INT, PRIMARY KEY)
- username (STRING, UNIQUE)
- email (STRING, UNIQUE)
- hashed_password (STRING)
- created_at (DATETIME)

### leaderboard
- id (INT, PRIMARY KEY)
- user_id (INT)
- username (STRING)
- score (INT)
- mode (ENUM: 'pass-through', 'walls')
- date (DATETIME)

### live_players
- id (STRING, PRIMARY KEY)
- username (STRING)
- score (INT)
- mode (ENUM)
- snake (JSON)
- food (JSON)
- direction (STRING)
- status (ENUM)
- last_updated (DATETIME)
