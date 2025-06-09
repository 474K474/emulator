# /mnt/data/data_converter.py

def raw_to_angle(raw_value: int) -> float:
    # Пример: 0–2048 → 0–180°
    return round((raw_value / 2048) * 180, 2)

def raw_to_load(raw_value: int) -> float:
    # Пример: 0–2048 → 0–10 Н·м
    return round((raw_value / 2048) * 10, 2)

def raw_to_temp(raw_value: int) -> float:
    # Пример: 0–100 → 0–100°C
    return round(raw_value, 1)
