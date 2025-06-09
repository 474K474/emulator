import csv
import os
from datetime import datetime

class DataStorage:
    def __init__(self, filename='monitoring_data.csv'):
        self.filename = filename
        self._initialize_csv()

    def _initialize_csv(self):
        if not os.path.exists(self.filename):
            with open(self.filename, 'w', newline='') as f:
                writer = csv.writer(f)
                writer.writerow(['timestamp', 'device', 't1', 't2', 't3', 't4', 't5', 't6', 'l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'm1', 'm2', 'm3', 'm4', 'm5', 'm6'])

    def save_measurements(self, device_name: str, data: dict):
        timestamp = datetime.now().isoformat()
        row = [timestamp, device_name]
        # Order of columns: t1-t6, l1-l6, m1-m6
        for prefix in ['t', 'l', 'm']:
            for i in range(1, 7):
                key = f'{prefix}{i}'
                row.append(data.get(key, '')) # Use get to avoid KeyError if data is missing

        with open(self.filename, 'a', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(row)

    def get_all_measurements(self):
        data = []
        if os.path.exists(self.filename):
            with open(self.filename, 'r') as f:
                reader = csv.reader(f)
                header = next(reader) # Skip header row
                for row in reader:
                    data.append(row)
        return data

    def get_measurements_by_time_and_param(self, start_time: str = None, end_time: str = None, device_name: str = None, params: list = None):
        filtered_data = []
        if not os.path.exists(self.filename):
            return filtered_data

        with open(self.filename, 'r') as f:
            reader = csv.reader(f)
            header = next(reader)  # Skip header row
            
            param_indices = []
            if params:
                for p in params:
                    try:
                        param_indices.append(header.index(p))
                    except ValueError:
                        # Handle case where param is not in header
                        continue
            
            for row in reader:
                row_timestamp = datetime.fromisoformat(row[0])
                
                if start_time and row_timestamp < datetime.fromisoformat(start_time):
                    continue
                if end_time and row_timestamp > datetime.fromisoformat(end_time):
                    continue
                
                if device_name and row[1] != device_name:
                    continue
                
                if params:
                    selected_data = [row[0], row[1]] # timestamp and device_name
                    for idx in param_indices:
                        selected_data.append(row[idx])
                    filtered_data.append(selected_data)
                else:
                    filtered_data.append(row)
        return filtered_data 