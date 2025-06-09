import sqlite3
import json
from datetime import datetime

class DatabaseManager:
    def __init__(self, db_name='emulator_data.db'):
        self.db_name = db_name
        self.conn = None
        self.cursor = None

    def connect(self):
        try:
            self.conn = sqlite3.connect(self.db_name)
            self.conn.row_factory = sqlite3.Row # This allows accessing columns by name
            self.cursor = self.conn.cursor()
            print(f"Подключено к базе данных: {self.db_name}")
        except sqlite3.Error as e:
            print(f"Ошибка при подключении к базе данных: {e}")

    def disconnect(self):
        if self.conn:
            self.conn.close()
            print("Отключено от базы данных.")

    def create_tables(self):
        if not self.conn:
            self.connect()

        # Table for monitoring data
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS measurements (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                device_name TEXT NOT NULL,
                t1 REAL, t2 REAL, t3 REAL, t4 REAL, t5 REAL, t6 REAL,
                l1 REAL, l2 REAL, l3 REAL, l4 REAL, l5 REAL, l6 REAL,
                m1 REAL, m2 REAL, m3 REAL, m4 REAL, m5 REAL, m6 REAL,
                n REAL, s REAL, c REAL
            );
        ''')

        # Table for critical events
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS critical_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                event_type TEXT NOT NULL,
                value TEXT NOT NULL,
                device_name TEXT
            );
        ''')

        # Table for POIs
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS pois (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                poi_name TEXT UNIQUE NOT NULL,
                N INTEGER, X INTEGER, Y INTEGER, T INTEGER, G INTEGER
            );
        ''')

        # Table for command queue
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS command_queue (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp_added TEXT NOT NULL,
                command_type TEXT NOT NULL,
                command_data TEXT NOT NULL,
                status TEXT DEFAULT 'pending'
            );
        ''')
        self.conn.commit()
        print("Таблицы созданы или уже существуют.")

    def insert_measurement(self, data: dict):
        columns = ['timestamp', 'device_name', 't1', 't2', 't3', 't4', 't5', 't6',
                   'l1', 'l2', 'l3', 'l4', 'l5', 'l6',
                   'm1', 'm2', 'm3', 'm4', 'm5', 'm6',
                   'n', 's', 'c']
        
        values = [data.get(col) for col in columns]
        
        placeholders = ', '.join(['?' for _ in columns])
        column_names = ', '.join(columns)
        
        self.cursor.execute(f'INSERT INTO measurements ({column_names}) VALUES ({placeholders})', values)
        self.conn.commit()

    def get_all_measurements(self):
        self.cursor.execute('SELECT * FROM measurements ORDER BY timestamp')
        rows = self.cursor.fetchall()
        # Return as list of lists to match previous CSV output format
        # Or, if front-end expects JSON, convert to dicts
        return [list(row) for row in rows]

    def get_measurements_by_time_and_param(self, start_time: str = None, end_time: str = None, device_name: str = None, params: list = None):
        query = "SELECT timestamp, device_name"
        if params:
            query += ", " + ", ".join(params)
        query += " FROM measurements WHERE 1=1"
        
        query_args = []

        if device_name:
            query += " AND device_name = ?"
            query_args.append(device_name)
        
        if start_time:
            query += " AND timestamp >= ?"
            query_args.append(start_time)

        if end_time:
            query += " AND timestamp <= ?"
            query_args.append(end_time)
            
        query += " ORDER BY timestamp"
        
        self.cursor.execute(query, query_args)
        rows = self.cursor.fetchall()

        return [list(row) for row in rows]

    def insert_critical_event(self, timestamp: str, event_type: str, value: str, device_name: str = None):
        print(f"[DEBUG] insert_critical_event called with: timestamp={timestamp}, event_type={event_type}, value={value}, device_name={device_name}")
        try:
            self.cursor.execute('INSERT INTO critical_events (timestamp, event_type, value, device_name) VALUES (?, ?, ?, ?)', (timestamp, event_type, value, device_name))
            self.conn.commit()
            print("[DEBUG] Critical event committed to database.")
        except sqlite3.Error as e:
            print(f"[DEBUG] Error inserting critical event: {e}")

    def insert_poi(self, poi_name: str, N: int, X: int, Y: int, T: int, G: int):
        self.cursor.execute('INSERT OR REPLACE INTO pois (poi_name, N, X, Y, T, G) VALUES (?, ?, ?, ?, ?, ?)', (poi_name, N, X, Y, T, G))
        self.conn.commit()

    def get_poi_by_name(self, poi_name: str):
        self.cursor.execute('SELECT N, X, Y, T, G FROM pois WHERE poi_name = ?', (poi_name,))
        row = self.cursor.fetchone()
        if row:
            return {'N': row[0], 'X': row[1], 'Y': row[2], 'T': row[3], 'G': row[4]}
        return None

    def get_all_poi_names(self):
        self.cursor.execute('SELECT poi_name FROM pois')
        return [row[0] for row in self.cursor.fetchall()]

    def add_command_to_queue(self, timestamp_added: str, command_type: str, command_data: dict, status: str = 'pending'):
        self.cursor.execute('INSERT INTO command_queue (timestamp_added, command_type, command_data, status) VALUES (?, ?, ?, ?)', 
                            (timestamp_added, command_type, json.dumps(command_data), status))
        self.conn.commit()

    def get_command_queue(self, status: str = 'pending'):
        self.cursor.execute('SELECT id, timestamp_added, command_type, command_data, status FROM command_queue WHERE status = ? ORDER BY id', (status,))
        rows = self.cursor.fetchall()
        return [{'id': row[0], 'timestamp_added': row[1], 'command_type': row[2], 'command_data': json.loads(row[3]), 'status': row[4]} for row in rows]

    def update_command_status(self, command_id: int, new_status: str):
        self.cursor.execute('UPDATE command_queue SET status = ? WHERE id = ?', (new_status, command_id))
        self.conn.commit()

    def clear_command_queue_by_status(self, status: str = 'pending'):
        self.cursor.execute('DELETE FROM command_queue WHERE status = ?', (status,))
        self.conn.commit()

    def get_all_critical_events(self):
        self.cursor.execute('SELECT * FROM critical_events ORDER BY timestamp')
        rows = self.cursor.fetchall()
        return [dict(row) for row in rows]

# Example usage (for testing/initialization):
if __name__ == '__main__':
    db_manager = DatabaseManager()
    db_manager.connect()
    db_manager.create_tables()
    # You can add some initial data insertions here for testing
    db_manager.disconnect() 