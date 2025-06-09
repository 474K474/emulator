setInterval(connect, 2000)

let sensorCriticalStatus = {};

function connect(){

    if(document.getElementById("connect").checked){
        robot_gripper_get_data()
    }

    set_remote_terminal_data()
}


function check_sensors(response){
    let temperature_mass = ['t1', 't2', 't3', 't4', 't5', 't6']
    let load_mass = ['l1', 'l2', 'l3', 'l4', 'l5', 'l6']
    let motor_mass = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6']

    const deviceName = 'robotGripper';
    let globalCriticalSignalNeeded = false;

    // Check temperature sensors
    for (const sensor of temperature_mass) {
        const sensorValue = Number(response[sensor]);
        const criticalLeft = Number(document.getElementById("critical_left_t").value);
        const criticalRight = Number(document.getElementById("critical_right_t").value);

        if (isNaN(sensorValue) || isNaN(criticalLeft) || isNaN(criticalRight)) {
            console.warn(`[WARN] Пропущены критические проверки для ${sensor}: Некорректные значения датчика или порогов.`);
            continue; // Пропустить текущий датчик, если значения некорректны
        }

        if (sensorValue < criticalLeft || sensorValue > criticalRight) {
            if (!sensorCriticalStatus[sensor]) { // If it just became critical
                logCriticalEvent(`temperature_${sensor}_critical_exceeded`, sensorValue, deviceName);
                sensorCriticalStatus[sensor] = true;
            }
            globalCriticalSignalNeeded = true;
        } else {
            sensorCriticalStatus[sensor] = false;
        }
    }

    // Check load sensors
    for (const sensor of load_mass) {
        const sensorValue = Number(response[sensor]);
        const criticalLeft = Number(document.getElementById("critical_left_l").value);
        const criticalRight = Number(document.getElementById("critical_right_l").value);

        if (isNaN(sensorValue) || isNaN(criticalLeft) || isNaN(criticalRight)) {
            console.warn(`[WARN] Пропущены критические проверки для ${sensor}: Некорректные значения датчика или порогов.`);
            continue; // Пропустить текущий датчик, если значения некорректны
        }

        if (sensorValue < criticalLeft || sensorValue > criticalRight) {
            if (!sensorCriticalStatus[sensor]) { // If it just became critical
                logCriticalEvent(`load_${sensor}_critical_exceeded`, sensorValue, deviceName);
                sensorCriticalStatus[sensor] = true;
            }
            globalCriticalSignalNeeded = true;
        } else {
            sensorCriticalStatus[sensor] = false;
        }
    }

    // Check motor sensors
    for (const sensor of motor_mass) {
        const sensorValue = Number(response[sensor]);
        const criticalLeft = Number(document.getElementById("critical_left_m").value);
        const criticalRight = Number(document.getElementById("critical_right_m").value);

        if (isNaN(sensorValue) || isNaN(criticalLeft) || isNaN(criticalRight)) {
            console.warn(`[WARN] Пропущены критические проверки для ${sensor}: Некорректные значения датчика или порогов.`);
            continue; // Пропустить текущий датчик, если значения некорректны
        }

        if (sensorValue < criticalLeft || sensorValue > criticalRight) {
            if (!sensorCriticalStatus[sensor]) { // If it just became critical
                logCriticalEvent(`motor_${sensor}_critical_exceeded`, sensorValue, deviceName);
                sensorCriticalStatus[sensor] = true;
            }
            globalCriticalSignalNeeded = true;
        } else {
            sensorCriticalStatus[sensor] = false;
        }
    }

    // Update global critical signal display
    if (globalCriticalSignalNeeded) {
        document.getElementById("critical_signal").style.display = 'block';
    } else {
        document.getElementById("critical_signal").style.display = 'none';
    }

    // Also handle limit signal (not critical, just warning)
    let limitExceeded = false;
    for (const sensor of temperature_mass) {
        const sensorValue = Number(response[sensor]);
        const limitLeft = Number(document.getElementById("limit_left_t").value);
        const limitRight = Number(document.getElementById("limit_right_t").value);
        
        if (isNaN(sensorValue) || isNaN(limitLeft) || isNaN(limitRight)) {
            console.warn(`[WARN] Пропущены проверки лимитов для ${sensor}: Некорректные значения датчика или порогов.`);
            continue; // Пропустить текущий датчик, если значения некорректны
        }

        if (sensorValue < limitLeft || sensorValue > limitRight) {
            limitExceeded = true;
            break;
        }
    }
    for (const sensor of load_mass) {
        const sensorValue = Number(response[sensor]);
        const limitLeft = Number(document.getElementById("limit_left_l").value);
        const limitRight = Number(document.getElementById("limit_right_l").value);

        if (isNaN(sensorValue) || isNaN(limitLeft) || isNaN(limitRight)) {
            console.warn(`[WARN] Пропущены проверки лимитов для ${sensor}: Некорректные значения датчика или порогов.`);
            continue; // Пропустить текущий датчик, если значения некорректны
        }

        if (sensorValue < limitLeft || sensorValue > limitRight) {
            limitExceeded = true;
            break;
        }
    }
    for (const sensor of motor_mass) {
        const sensorValue = Number(response[sensor]);
        const limitLeft = Number(document.getElementById("limit_left_m").value);
        const limitRight = Number(document.getElementById("limit_right_m").value);

        if (isNaN(sensorValue) || isNaN(limitLeft) || isNaN(limitRight)) {
            console.warn(`[WARN] Пропущены проверки лимитов для ${sensor}: Некорректные значения датчика или порогов.`);
            continue; // Пропустить текущий датчик, если значения некорректны
        }

        if (sensorValue < limitLeft || sensorValue > limitRight) {
            limitExceeded = true;
            break;
        }
    }

    if (limitExceeded) {
        document.getElementById("limit_signal").style.display = 'block';
    } else {
        document.getElementById("limit_signal").style.display = 'none';
    }
}




function POI_1(){
     document.getElementById("N_control_1").value = 1;
     document.getElementById("X_1").value = 1;
     document.getElementById("Y_1").value = 1;
     document.getElementById("T_1").value = 1;
     document.getElementById("G_1").value = 1;
     set_remote_terminal_data()

}


function POI_2(){
     document.getElementById("N_control_1").value = 2;
     document.getElementById("X_1").value = 2;
     document.getElementById("Y_1").value = 2;
     document.getElementById("T_1").value = 2;
     document.getElementById("G_1").value = 2;
     set_remote_terminal_data()

}



function set_robot_gripper_data(){
    if (!document.getElementById("save_data").checked) {
        return; // не отправляем, если чекбокс выключен
    }

    $.ajax({
        type: 'GET',
        url: '/set_robot_gripper_data',
        dataType: 'json',
        contentType: 'application/json',
        data: {
            'N': document.getElementById("N_control_1").value,
            'X': document.getElementById("X_1").value,
            'Y': document.getElementById("Y_1").value,
            'T': document.getElementById("T_1").value,
            'G': document.getElementById("G_1").value,
            'save_data': true // передаём флаг на сервер
        },
        success: function (response) {}
    });
}



function set_remote_terminal_data() {
    $.ajax({
        type: 'GET',
        url: '/set_remote_terminal_color',
        dataType: 'json',
        contentType: 'application/json',
        data: {
            'blue': Number(document.getElementById("remote_terminal_blue").checked),
            'red': Number(document.getElementById("remote_terminal_red").checked),
            'yellow': Number(document.getElementById("remote_terminal_yellow").checked),
            'green': Number(document.getElementById("remote_terminal_green").checked)

        },
        success: function (response) {

        }
    });
}


function setTrafficLightStatus(lightId) {
    const isChecked = document.getElementById(`traffic_lights_${lightId}`).checked;
    const data = {};
    data[lightId] = Number(isChecked);

    $.ajax({
        type: 'GET',
        url: '/set_traffic_light_status',
        dataType: 'json',
        contentType: 'application/json',
        data: data,
        success: function (response) {
            console.log(`Traffic light ${lightId} status updated:`, response);
        },
        error: function(error) {
            console.error(`Error updating traffic light ${lightId} status:`, error);
        }
    });
}


function robot_gripper_get_data() {
    $.ajax({
        type: 'GET',
        url: '/robot_gripper_get_data',
        dataType: 'json',
        contentType: 'application/json',
        data: {},
        success: function (response) {
            document.getElementById("t1_1").value = response['t1'],
            document.getElementById("t2_1").value = response['t2'],
            document.getElementById("t3_1").value = response['t3'],
            document.getElementById("t4_1").value = response['t4'],
            document.getElementById("t5_1").value = response['t5'],
            document.getElementById("t6_1").value = response['t6'],
            document.getElementById("l1_1").value = response['l1'],
            document.getElementById("l2_1").value = response['l2'],
            document.getElementById("l3_1").value = response['l3'],
            document.getElementById("l4_1").value = response['l4'],
            document.getElementById("l5_1").value = response['l5'],
            document.getElementById("m6_1").value = response['l6'],
            document.getElementById("m1_1").value = response['m1'],
            document.getElementById("m2_1").value = response['m2'],
            document.getElementById("m3_1").value = response['m3'],
            document.getElementById("m4_1").value = response['m4'],
            document.getElementById("m5_1").value = response['m5'],
            document.getElementById("m6_1").value = response['m6'],
            document.getElementById("s_1").value = response['s'],
            document.getElementById("c_1").value = response['c'],
            document.getElementById("n_1").value = response['n'],

            check_sensors(response)
        }
    });
}

function savePOI() {
    const poiName = document.getElementById('poi_name').value;
    if (!poiName) {
        alert('Пожалуйста, введите название для POI.');
        return;
    }

    const poiData = {
        N: document.getElementById('N_control_1').value,
        X: document.getElementById('X_1').value,
        Y: document.getElementById('Y_1').value,
        T: document.getElementById('T_1').value,
        G: document.getElementById('G_1').value,
    };

    $.ajax({
        type: 'GET',
        url: '/save_poi',
        dataType: 'json',
        data: { name: poiName, ...poiData },
        success: function (response) {
            alert('POI сохранено!');
            populatePOIList(); // Refresh the list after saving
        },
        error: function (error) {
            console.error('Ошибка при сохранении POI:', error);
            alert('Ошибка при сохранении POI.');
        }
    });
}

async function loadPOI() {
    const poiName = document.getElementById('poi_list').value;
    if (!poiName) {
        alert('Пожалуйста, выберите POI для загрузки.');
        return;
    }

    try {
        const response = await fetch(`/get_poi_data?name=${poiName}`);
        const result = await response.json();

        if (result.status === "success") {
            const poiData = result.data;
            document.getElementById('N_control_1').value = poiData.N;
            document.getElementById('X_1').value = poiData.X;
            document.getElementById('Y_1').value = poiData.Y;
            document.getElementById('T_1').value = poiData.T;
            document.getElementById('G_1').value = poiData.G;
            alert('POI загружено!');
        } else {
            alert(`Ошибка: ${result.message}`);
        }
    } catch (error) {
        console.error('Ошибка при загрузке POI:', error);
        alert('Ошибка при загрузке POI.');
    }
}

async function populatePOIList() {
    try {
        const response = await fetch('/get_poi_names');
        const result = await response.json();
        const poiList = document.getElementById('poi_list');
        poiList.innerHTML = '<option value="">Выберите POI</option>'; // Clear and add default option

        result.names.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            poiList.appendChild(option);
        });
    } catch (error) {
        console.error('Ошибка при загрузке списка POI:', error);
    }
}

document.addEventListener('DOMContentLoaded', populatePOIList);


async function addCurrentPOIToQueue() {
    const poiData = {
        type: 'poi',
        N: document.getElementById('N_control_1').value,
        X: document.getElementById('X_1').value,
        Y: document.getElementById('Y_1').value,
        T: document.getElementById('T_1').value,
        G: document.getElementById('G_1').value,
    };

    try {
        const response = await fetch(`/add_command_to_queue?${new URLSearchParams(poiData).toString()}`);
        const result = await response.json();
        if (result.status === "success") {
            alert('Текущая POI добавлена в очередь!');
            displayCommandQueue(); // Refresh the displayed queue
        } else {
            alert(`Ошибка при добавлении в очередь: ${result.message}`);
        }
    } catch (error) {
        console.error('Ошибка при добавлении POI в очередь:', error);
        alert('Ошибка при добавлении POI в очередь.');
    }
}

async function displayCommandQueue() {
    try {
        const response = await fetch('/get_command_queue');
        const result = await response.json();
        const commandQueueList = document.getElementById('command_queue_list');
        commandQueueList.innerHTML = ''; // Clear existing list

        if (result.queue && result.queue.length > 0) {
            result.queue.forEach(command => {
                const listItem = document.createElement('li');
                listItem.textContent = `Тип: ${command.command_type}, Данные: ${JSON.stringify(command.command_data)}, Статус: ${command.status}`;
                commandQueueList.appendChild(listItem);
            });
        } else {
            const listItem = document.createElement('li');
            listItem.textContent = 'Очередь команд пуста.';
            commandQueueList.appendChild(listItem);
        }
    } catch (error) {
        console.error('Ошибка при получении очереди команд:', error);
    }
}

async function executeNextCommandInQueue() {
    try {
        const response = await fetch('/execute_next_command');
        const result = await response.json();
        if (result.status === "success") {
            alert(`Команда выполнена: ${JSON.stringify(result.executed_command)}`);
            displayCommandQueue(); // Refresh the displayed queue
            // Also, update the robot controls on the UI if a POI command was executed
            if (result.executed_command.command_type === 'poi') {
                const poiData = result.executed_command.command_data;
                document.getElementById('N_control_1').value = poiData.N;
                document.getElementById('X_1').value = poiData.X;
                document.getElementById('Y_1').value = poiData.Y;
                document.getElementById('T_1').value = poiData.T;
                document.getElementById('G_1').value = poiData.G;
            }
        } else {
            alert(`Ошибка выполнения команды: ${result.message}`);
        }
    } catch (error) {
        console.error('Ошибка при выполнении команды:', error);
        alert('Ошибка при выполнении команды.');
    }
}

async function clearCommandQueue() {
    if (confirm('Вы уверены, что хотите очистить очередь команд?')) {
        try {
            const response = await fetch('/clear_command_queue');
            const result = await response.json();
            if (result.status === "success") {
                alert('Очередь команд очищена!');
                displayCommandQueue(); // Refresh the displayed queue
            } else {
                alert(`Ошибка очистки очереди: ${result.message}`);
            }
        } catch (error) {
            console.error('Ошибка при очистке очереди команд:', error);
            alert('Ошибка при очистке очереди команд.');
        }
    }
}

document.addEventListener('DOMContentLoaded', displayCommandQueue); // Initial display of the queue

function logCriticalEvent(eventTypeParam = null, eventValueParam = null, eventDeviceParam = null) {
    const eventType = eventTypeParam !== null ? eventTypeParam : document.getElementById('log_event_type').value;
    const eventValue = eventValueParam !== null ? eventValueParam : document.getElementById('log_event_value').value;
    const eventDevice = eventDeviceParam !== null ? eventDeviceParam : document.getElementById('log_event_device').value;

    console.log(`[DEBUG] logCriticalEvent received: eventType='${eventType}', eventValue='${eventValue}', eventDevice='${eventDevice}'`);

    if (!eventType || (eventValue === null || eventValue === '')) {
        console.error('Пожалуйста, введите тип события и значение.');
        return;
    }

    $.ajax({
        type: 'GET',
        url: '/log_event',
        dataType: 'json',
        data: {
            type: eventType,
            value: eventValue,
            device: eventDevice
        },
        success: function (response) {
            if (response.status === 'success') {
                console.log('Критическое событие успешно записано!');
                if (eventTypeParam === null) {
                    document.getElementById('log_event_type').value = '';
                    document.getElementById('log_event_value').value = '';
                    document.getElementById('log_event_device').value = '';
                }
            } else {
                console.error('Ошибка при записи критического события: ' + response.message);
            }
        },
        error: function (error) {
            console.error('Ошибка AJAX при записи критического события:', error);
        }
    });
}




