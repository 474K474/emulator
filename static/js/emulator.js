
setInterval(randomize, 1000)
setInterval(connection, 3000)


let b1 = 0
let b2 = 0
let b3 = 0

function b1_click(){
    b1+=1
}
function b2_click(){
    b2+=1
}
function b3_click(){
    b3+=1
}



function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function connection(){
    if (document.getElementById("robot_gripper_connect").checked){
        connect_robot_1()
    }
    if (document.getElementById("robot_vacuum_connect").checked){
        connect_robot_2()
    }
    if (document.getElementById("remote_terminal_connect").checked){
        connect_remote_terminal()
    }
    if (document.getElementById("traffic_lights_connect").checked){
        connect_traffic_lights()
    }
    if (document.getElementById("smart_camera_connect").checked){
        connect_smart_camera()
    }


}




function randomize(){
    if (document.getElementById("randomize").checked){
        document.getElementById("t1_1").value = getRandomInt(0, 100)
        document.getElementById("t2_1").value = getRandomInt(0, 100)
        document.getElementById("t3_1").value = getRandomInt(0, 100)
        document.getElementById("t4_1").value = getRandomInt(0, 100)
        document.getElementById("t5_1").value = getRandomInt(0, 100)
        document.getElementById("t6_1").value = getRandomInt(0, 100)
        document.getElementById("l1_1").value = getRandomInt(0, 2048)
        document.getElementById("l2_1").value = getRandomInt(0, 2048)
        document.getElementById("l3_1").value = getRandomInt(0, 2048)
        document.getElementById("l4_1").value = getRandomInt(0, 2048)
        document.getElementById("l5_1").value = getRandomInt(0, 2048)
        document.getElementById("l6_1").value = getRandomInt(0, 2048)
        document.getElementById("m1_1").value = getRandomInt(0, 2048)
        document.getElementById("m2_1").value = getRandomInt(0, 2048)
        document.getElementById("m3_1").value = getRandomInt(0, 2048)
        document.getElementById("m4_1").value = getRandomInt(0, 2048)
        document.getElementById("m5_1").value = getRandomInt(0, 2048)
        document.getElementById("m6_1").value = getRandomInt(0, 2048)
        document.getElementById("s_1").value = getRandomInt(0, 100)
        document.getElementById("c_1").value = getRandomInt(0, 100)
        document.getElementById("n_1").value = getRandomInt(0, 100)

        document.getElementById("t1_2").value = getRandomInt(0, 100)
        document.getElementById("t2_2").value = getRandomInt(0, 100)
        document.getElementById("t3_2").value = getRandomInt(0, 100)
        document.getElementById("t4_2").value = getRandomInt(0, 100)
        document.getElementById("t5_2").value = getRandomInt(0, 100)
        document.getElementById("t6_2").value = getRandomInt(0, 100)
        document.getElementById("l1_2").value = getRandomInt(0, 4096)
        document.getElementById("l2_2").value = getRandomInt(0, 4096)
        document.getElementById("l3_2").value = getRandomInt(0, 4096)
        document.getElementById("l4_2").value = getRandomInt(0, 4096)
        document.getElementById("l5_2").value = getRandomInt(0, 4096)
        document.getElementById("l6_2").value = getRandomInt(0, 4096)
        document.getElementById("m1_2").value = getRandomInt(0, 2048)
        document.getElementById("m2_2").value = getRandomInt(0, 2048)
        document.getElementById("m3_2").value = getRandomInt(0, 2048)
        document.getElementById("m4_2").value = getRandomInt(0, 2048)
        document.getElementById("m5_2").value = getRandomInt(0, 2048)
        document.getElementById("m6_2").value = getRandomInt(0, 2048)
        document.getElementById("s_2").value = getRandomInt(0, 100)
        document.getElementById("c_2").value = getRandomInt(0, 100)
        document.getElementById("n_2").value = getRandomInt(0, 100)

        document.getElementById("code").value = getRandomInt(100, 999)
    }
}




function connect_smart_camera() {
    $.ajax({
        type: 'GET',
        url: document.getElementById("URL_system").value + document.getElementById("smart_camera_connect_URL").value,
        dataType: 'json',
        contentType: 'application/json',
        data: {
            'code': document.getElementById("code").value,
        },

        success: function (response) {    }});
}


function connect_traffic_lights() {
    $.ajax({
        type: 'GET',
        url: document.getElementById("URL_system").value + document.getElementById("traffic_lights_connect_URL").value,
        dataType: 'json',
        contentType: 'application/json',
        data: {},

        success: function (response) {
            if (response['L1'] == 1){
                document.getElementById("traffic_blue").style.backgroundColor = 'blue'
            }
            else{
                document.getElementById("traffic_blue").style.backgroundColor = 'black'
            }
            if (response['L2'] == 1){
                document.getElementById("traffic_red").style.backgroundColor = 'red'
            }
            else{
                document.getElementById("traffic_red").style.backgroundColor = 'black'
            }
            if (response['L3'] == 1){
                document.getElementById("traffic_yellow").style.backgroundColor = 'yellow'
            }
            else{
                document.getElementById("traffic_yellow").style.backgroundColor = 'black'
            }
            if (response['L4'] == 1){
                document.getElementById("traffic_green").style.backgroundColor = 'green'
            }
            else{
                document.getElementById("traffic_greengreen").style.backgroundColor = 'black'
            }
            }
    });
}


function connect_remote_terminal() {
    $.ajax({
        type: 'GET',
        url: document.getElementById("URL_system").value + document.getElementById("remote_terminal_connect_URL").value,
        dataType: 'json',
        contentType: 'application/json',
        data: {
            'b1': b1,
            'b2': b2,
            'b3': b3,
            'p': Number(document.getElementById("p").checked)
        },

        success: function (response) {
            if (response['L1'] == 1){
                document.getElementById("remote_blue").style.backgroundColor = 'blue'
            }
            else{
                document.getElementById("remote_blue").style.backgroundColor = 'black'
            }
            if (response['L2'] == 1){
                document.getElementById("remote_red").style.backgroundColor = 'red'
            }
            else{
                document.getElementById("remote_red").style.backgroundColor = 'black'
            }
            if (response['L3'] == 1){
                document.getElementById("remote_yellow").style.backgroundColor = 'yellow'
            }
            else{
                document.getElementById("remote_yellow").style.backgroundColor = 'black'
            }
            if (response['L4'] == 1){
                document.getElementById("remote_green").style.backgroundColor = 'green'
            }
            else{
                document.getElementById("remote_green").style.backgroundColor = 'black'
            }
            console.log(response['L4'])
            }
    });
}


function connect_robot_1() {
    $.ajax({
        type: 'GET',
        url: document.getElementById("URL_system").value + document.getElementById("robot_gripper_connect_URL").value,
        dataType: 'json',
        contentType: 'application/json',
        data: {
            't1': document.getElementById("t1_1").value,
            't2': document.getElementById("t2_1").value,
            't3': document.getElementById("t3_1").value,
            't4': document.getElementById("t4_1").value,
            't5': document.getElementById("t5_1").value,
            't6': document.getElementById("t6_1").value,
            'l1': document.getElementById("l1_1").value,
            'l2': document.getElementById("l2_1").value,
            'l3': document.getElementById("l3_1").value,
            'l4': document.getElementById("l4_1").value,
            'l5': document.getElementById("l5_1").value,
            'l6': document.getElementById("m6_1").value,
            'm1': document.getElementById("m1_1").value,
            'm2': document.getElementById("m2_1").value,
            'm3': document.getElementById("m3_1").value,
            'm4': document.getElementById("m4_1").value,
            'm5': document.getElementById("m5_1").value,
            'm6': document.getElementById("m6_1").value,
            's': document.getElementById("s_1").value,
            'c': document.getElementById("c_1").value,
            'n': document.getElementById("n_1").value,
        },

        success: function (response) {
            console.log(response)
            document.getElementById("N_control_1").value = response["N"]
            document.getElementById("X_1").value = response["X"]
            document.getElementById("Y_1").value = response["Y"]
            document.getElementById("T_1").value = response["T"]
            document.getElementById("G_1").value = response["G"]
            }
    });
}


function connect_robot_2() {
    $.ajax({
        type: 'GET',
        url: document.getElementById("URL_system").value + document.getElementById("robot_vacuum_connect_URL").value,
        dataType: 'json',
        contentType: 'application/json',
        data: {
            't1': document.getElementById("t1_2").value,
            't2': document.getElementById("t2_2").value,
            't3': document.getElementById("t3_2").value,
            't4': document.getElementById("t4_2").value,
            't5': document.getElementById("t5_2").value,
            't6': document.getElementById("t6_2").value,
            'l1': document.getElementById("l1_2").value,
            'l2': document.getElementById("l2_2").value,
            'l3': document.getElementById("l3_2").value,
            'l4': document.getElementById("l4_2").value,
            'l5': document.getElementById("l5_2").value,
            'l6': document.getElementById("m6_2").value,
            'm1': document.getElementById("m1_2").value,
            'm2': document.getElementById("m2_2").value,
            'm3': document.getElementById("m3_2").value,
            'm4': document.getElementById("m4_2").value,
            'm5': document.getElementById("m5_2").value,
            'm6': document.getElementById("m6_2").value,
            's': document.getElementById("s_2").value,
            'c': document.getElementById("c_2").value,
            'n': document.getElementById("n_2").value,
        },
        
        success: function (response) {
            console.log(response)
            document.getElementById("N_control_2").value = response["N"]
            document.getElementById("X_2").value = response["X"]
            document.getElementById("Y_2").value = response["Y"]
            document.getElementById("V_2").value = response["V"]
            }
    });
}