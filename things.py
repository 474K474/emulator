import abc
import json


class Robot(abc.ABC):
    def __init__(self):
        print('Create robot')
        self.n = 0
        self.s = 0
        self.c = 0
        self.t1 = 0
        self.t2 = 0
        self.t3 = 0
        self.t4 = 0
        self.t5 = 0
        self.t6 = 0
        self.m1 = 0
        self.m2 = 0
        self.m3 = 0
        self.m4 = 0
        self.m5 = 0
        self.m6 = 0
        self.l1 = 0
        self.l2 = 0
        self.l3 = 0
        self.l4 = 0
        self.l5 = 0
        self.l6 = 0

        self.N = 0
        self.X = 0
        self.Y = 0




class RobotGripper(Robot):
    def __init__(self):
        super().__init__()
        self.motor_maximum = 4096
        self.T = 0
        self.G = 0

    def connect(self, request):
        self.n = request.args.get('n', '')
        self.s = request.args.get('s', '')
        self.c = request.args.get('c', '')
        self.t1 = request.args.get('t1', '')
        self.t2 = request.args.get('t2', '')
        self.t3 = request.args.get('t3', '')
        self.t4 = request.args.get('t4', '')
        self.t5 = request.args.get('t5', '')
        self.t6 = request.args.get('t6', '')
        self.m1 = request.args.get('m1', '')
        self.m2 = request.args.get('m2', '')
        self.m3 = request.args.get('m3', '')
        self.m4 = request.args.get('m4', '')
        self.m5 = request.args.get('m5', '')
        self.m6 = request.args.get('m6', '')
        self.l1 = request.args.get('l1', '')
        self.l2 = request.args.get('l2', '')
        self.l3 = request.args.get('l3', '')
        self.l4 = request.args.get('l4', '')
        self.l5 = request.args.get('l5', '')
        self.l6 = request.args.get('l6', '')
        # super().load_convert()
        # super().motor_convert()

        return json.dumps({
            'N': self.N,
            'X': self.X,
            'Y': self.Y,
            'G': self.G,
            'T': self.T
        })

    def set_properties(self, request):
        try:
            self.N = int(request.args.get('N', ''))
            self.X = int(request.args.get('X', ''))
            self.Y = int(request.args.get('Y', ''))
            self.G = int(request.args.get('G', ''))
            self.T = int(request.args.get('T', ''))
            return {}
        except:
            print('Недопустимая комманда, ожидлось целое значение')
            return {'404'}



class TrafficLights:
    def __init__(self):
        self.L1 = 0
        self.L2 = 0
        self.L3 = 0
        self.L4 = 0

    def connect(self):
        return json.dumps({
            'L1': self.L1,
            'L2': self.L2,
            'L3': self.L3,
            'L4': self.L4,
        })

    def set_properties(self, request):
        self.L1 = request.args.get('L1', '')
        self.L2 = request.args.get('L2', '')
        self.L3 = request.args.get('L3', '')
        self.L4 = request.args.get('L4', '')
        return {}

class RemoteTerminal:
    def __init__(self):
        self.blue = 0
        self.red = 0
        self.yellow = 0
        self.green = 0

    def connect(self):
        return json.dumps({
            'blue': self.blue,
            'red': self.red,
            'yellow': self.yellow,
            'green': self.green,
        })

    def set_properties(self, request):
        self.blue = int(request.args.get('blue', 0))
        self.red = int(request.args.get('red', 0))
        self.yellow = int(request.args.get('yellow', 0))
        self.green = int(request.args.get('green', 0))
        return {}

class RobotVacuum(Robot):
    def __init__(self):
        super().__init__()

    def connect(self, request):
        # Implement connection logic for RobotVacuum if needed
        return json.dumps({'status': 'RobotVacuum connected'})

    def set_properties(self, request):
        # Implement set properties logic for RobotVacuum if needed
        return {}

class SmartCamera:
    def __init__(self):
        self.status = "off"

    def connect(self):
        return json.dumps({'status': 'SmartCamera connected'})

    def set_properties(self, request):
        self.status = request.args.get('status', self.status)
        return {}
