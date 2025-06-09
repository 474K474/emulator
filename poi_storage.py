import json
import os

class POIStorage:
    def __init__(self, filename='poi_data.json'):
        self.filename = filename
        self._initialize_json()

    def _initialize_json(self):
        if not os.path.exists(self.filename):
            with open(self.filename, 'w') as f:
                json.dump({}, f)

    def save_poi(self, poi_name: str, poi_data: dict):
        with open(self.filename, 'r+') as f:
            data = json.load(f)
            data[poi_name] = poi_data
            f.seek(0)
            json.dump(data, f, indent=4)
            f.truncate()

    def get_poi(self, poi_name: str):
        with open(self.filename, 'r') as f:
            data = json.load(f)
            return data.get(poi_name)

    def get_all_poi_names(self):
        with open(self.filename, 'r') as f:
            data = json.load(f)
            return list(data.keys()) 