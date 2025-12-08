#!/bin/bash
# SQLite database viewer script

DB_PATH="/workspaces/snake-showdown-live/backend/backend/snake_showdown.db"

echo "========================================="
echo "   Snake Showdown Database Viewer"
echo "========================================="
echo ""

# Function to run queries
run_query() {
    sqlite3 "$DB_PATH" -column -header "$1"
}

while true; do
    echo "Выберите опцию:"
    echo "1) Показать всех пользователей"
    echo "2) Показать таблицу лидеров"
    echo "3) Показать активных игроков"
    echo "4) Показать структуру базы"
    echo "5) Свой SQL запрос"
    echo "0) Выход"
    echo ""
    read -p "Ваш выбор: " choice

    case $choice in
        1)
            echo ""
            echo "=== ПОЛЬЗОВАТЕЛИ ==="
            run_query "SELECT id, username, email, datetime(created_at, 'localtime') as created FROM users;"
            echo ""
            ;;
        2)
            echo ""
            echo "=== ТАБЛИЦА ЛИДЕРОВ ==="
            run_query "SELECT id, username, score, mode, date FROM leaderboard ORDER BY score DESC;"
            echo ""
            ;;
        3)
            echo ""
            echo "=== АКТИВНЫЕ ИГРОКИ ==="
            run_query "SELECT id, username, score, mode, status FROM live_players;"
            echo ""
            ;;
        4)
            echo ""
            echo "=== СТРУКТУРА БАЗЫ ДАННЫХ ==="
            sqlite3 "$DB_PATH" ".schema"
            echo ""
            ;;
        5)
            echo ""
            read -p "Введите SQL запрос: " sql
            echo ""
            run_query "$sql"
            echo ""
            ;;
        0)
            echo "До свидания!"
            exit 0
            ;;
        *)
            echo "Неверный выбор!"
            ;;
    esac
done
