import os
from datetime import datetime

class EventLogger:
    def __init__(self, filename='critical_events.log'):
        self.filename = filename

    def log_event(self, event_type: str, value: str):
        timestamp = datetime.now().isoformat()
        with open(self.filename, 'a') as f:
            f.write(f'{timestamp} - Type: {event_type}, Value: {value}\n') 