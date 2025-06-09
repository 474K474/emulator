from flask import Flask, request, render_template, g
import things
from database_manager import DatabaseManager
from datetime import datetime
import json # Import json for command_data parsing

app = Flask(__name__)


# Database connection management
def get_db():
    if 'db' not in g:
        g.db = DatabaseManager()
        g.db.connect()
        g.db.create_tables() # Ensure tables are created on first connection
    return g.db

@app.teardown_appcontext
def close_db(e=None):
    db = g.pop('db', None)
    if db is not None:
        db.disconnect()


robotGripper = things.RobotGripper()
robotVacuum = things.RobotVacuum()
remoteTerminal = things.RemoteTerminal()
trafficLights = things.TrafficLights()
smartCamera = things.SmartCamera()


command_queue_memory = [] # In-memory command queue for active session, if not using DB for queue


@app.route('/traffic_lights_connect')
def traffic_lights_connect():
    return trafficLights.connect()

@app.route('/set_traffic_light_status')
def set_traffic_light_status():
    db_manager = get_db()
    trafficLights.set_properties(request)
    return {"status": "success"}


@app.route('/robot_gripper_connect')
def robot1_connect():
    db_manager = get_db()
    if 25 < int(request.args.get('t1', '')) < 75:
        trafficLights.L2 = 1
    else:
        trafficLights.L2 = 0

    # Prepare data for insertion into measurements table
    measurement_data = request.args.to_dict()
    measurement_data['timestamp'] = datetime.now().isoformat()
    measurement_data['device_name'] = 'robotGripper'
    db_manager.insert_measurement(measurement_data)

    return robotGripper.connect(request)

@app.route('/robot_gripper_get_data')
def robot_gripper_get_data():
    db_manager = get_db()
    return robotGripper.__dict__


@app.route('/set_remote_terminal_data')
def set_remote_terminal_data():
    db_manager = get_db()
    return remoteTerminal.set_properties(request)

@app.route('/set_remote_terminal_color')
def set_remote_terminal_color():
    db_manager = get_db()
    remoteTerminal.set_properties(request)
    return {"status": "success"}


@app.route('/set_robot_gripper_data')
def set_robot_gripper_data():
    db_manager = get_db()

    # Проверка: если параметр save_data не true — не сохраняем
    save_data_flag = request.args.get('save_data', 'true').lower() == 'true'
    if not save_data_flag:
        return {"status": "skipped", "reason": "save_data disabled"}

    gripper_g = int(request.args.get('G', 0))
    if gripper_g > 0:
        trafficLights.L1 = 1
    else:
        trafficLights.L1 = 0
    trafficLights.set_properties(request)

    measurement_data = request.args.to_dict()
    measurement_data['timestamp'] = datetime.now().isoformat()
    measurement_data['device_name'] = 'robotGripper'
    db_manager.insert_measurement(measurement_data)

    return robotGripper.set_properties(request)



@app.route('/save_poi')
def save_poi():
    db_manager = get_db()
    poi_name = request.args.get('name')
    if not poi_name:
        return {"status": "error", "message": "POI name is required"}, 400

    try:
        N = int(request.args.get('N', 0))
        X = int(request.args.get('X', 0))
        Y = int(request.args.get('Y', 0))
        T = int(request.args.get('T', 0))
        G = int(request.args.get('G', 0))
        db_manager.insert_poi(poi_name, N, X, Y, T, G)
        return {"status": "success"}
    except ValueError:
        return {"status": "error", "message": "Invalid POI data. N, X, Y, T, G must be integers"}, 400


@app.route('/get_poi_names')
def get_poi_names():
    db_manager = get_db()
    names = db_manager.get_all_poi_names()
    return {"names": names}

@app.route('/get_poi_data')
def get_poi_data():
    db_manager = get_db()
    poi_name = request.args.get('name')
    if not poi_name:
        return {"status": "error", "message": "POI name is required"}, 400
    data = db_manager.get_poi_by_name(poi_name)
    if data:
        return {"status": "success", "data": data}
    return {"status": "error", "message": "POI not found"}, 404


@app.route('/add_command_to_queue')
def add_command_to_queue():
    db_manager = get_db()
    command_type = request.args.get('type')
    command_data = request.args.to_dict()
    command_data.pop('type', None)
    
    db_manager.add_command_to_queue(datetime.now().isoformat(), command_type, command_data)
    return {"status": "success"}

@app.route('/get_command_queue')
def get_command_queue():
    db_manager = get_db()
    queue = db_manager.get_command_queue()
    return {"queue": queue}

@app.route('/execute_next_command')
def execute_next_command():
    db_manager = get_db()
    queue = db_manager.get_command_queue(status='pending')
    if not queue:
        return {"status": "error", "message": "Command queue is empty"}, 400
    
    next_command = queue[0] # Get the first pending command
    command_id = next_command['id']

    # Here you would add logic to actually execute the command
    print(f"Executing command: {next_command}")

    if next_command['command_type'] == 'poi':
        poi_data = next_command['command_data']
        robotGripper.N = int(poi_data.get('N', 0))
        robotGripper.X = int(poi_data.get('X', 0))
        robotGripper.Y = int(poi_data.get('Y', 0))
        robotGripper.T = int(poi_data.get('T', 0))
        robotGripper.G = int(poi_data.get('G', 0))

    db_manager.update_command_status(command_id, 'executed')
    return {"status": "success", "executed_command": next_command}

@app.route('/clear_command_queue')
def clear_command_queue():
    db_manager = get_db()
    db_manager.clear_command_queue_by_status(status='pending')
    return {"status": "success"}


@app.route('/engineer_interface')
def engineer_interface():
    return render_template('egeneer_interface.html')


@app.route('/')
def hello_world():
    return render_template('emulator.html')


@app.route('/get_all_data')
def get_all_data():
    db_manager = get_db()
    data = db_manager.get_all_measurements()
    return {"data": data}


@app.route('/log_event')
def log_event():
    db_manager = get_db()
    event_type = request.args.get('type')
    value = request.args.get('value')
    device_name = request.args.get('device')
    if event_type and value:
        db_manager.insert_critical_event(datetime.now().isoformat(), event_type, value, device_name)
        return {"status": "success"}
    return {"status": "error", "message": "Missing type or value"}, 400


@app.route('/get_chart_data')
def get_chart_data():
    db_manager = get_db()
    param = request.args.get('param')
    start_time = request.args.get('start')
    end_time = request.args.get('end')
    device_name = request.args.get('device', 'robotGripper')

    data = db_manager.get_measurements_by_time_and_param(
        start_time=start_time,
        end_time=end_time,
        device_name=device_name,
        params=[param] if param else None
    )
    return {"data": data}


@app.route('/get_all_critical_events')
def get_all_critical_events_route():
    db_manager = get_db()
    events = db_manager.get_all_critical_events()
    return {"events": events}


if __name__ == '__main__':
    try:
        app.run(debug=True) # debug=True will also provide more detailed error messages
    except Exception as e:
        print(f"Ошибка при запуске приложения: {e}")
