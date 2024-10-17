const DevicesPage = {
    components: {
		'tv-control': TVControl,
		'light-control': LightControl,
		'fan-control': FanControl,
		'sound-control': SoundControl
    },
    provide() {
        return {
            fetchDevices: this.fetchDevices 
        };
    },
    template: `
        <div>
            <div class="row">
				<div class="col-xl-6 col-lg-6 col-md-12 mb-4" v-for="device in devices" :key="device.id">
					<div class="card">
                        <div class="card-body">
                            <h5 class="card-title">{{ device.name }}</h5>
                            <p class="card-text">Status: {{ device.component.switch }}</p>
                            <div class="on-btn mb-2">
                                <div class="btn-group" role="group">
                                    <button @click="toggleDevice(device, 'ON')"
                                            class="btn"
                                            :class="buttonOnClass(device)"
                                            :disabled="device.component.switch === 'ON'">
                                        ON
                                    </button>
                                    <button @click="toggleDevice(device, 'OFF')"
                                            class="btn"
                                            :class="buttonOffClass(device)"
                                            :disabled="device.component.switch === 'OFF'">
                                        OFF
                                    </button>
                                </div>

                                <!-- Light Control Component -->
                                <light-control
                                    v-if="device.name === 'Light'"
                                    :device="device"
                                    :brightness="device.component.brightness"
                                    :disabled="device.component.switch === 'OFF'"
                                ></light-control>

                                <!-- Fan Control Component -->
                                <fan-control
                                    v-if="device.name === 'Fan'"
                                    :device="device"
                                    :current-speed="device.component.speed"
                                    :disabled="device.component.switch === 'OFF'"
                                ></fan-control>

                            	<!-- TV Control Component -->
                            	<tv-control 
                                	v-if="device.name === 'TV'"
                                    :device="device"
                                	:disabled="device.component.switch === 'OFF'"
                                	class="mb-3"
                            	></tv-control> 

                                <!-- Sound Control Component -->
                                <sound-control
                                    v-if="device.name === 'Sound'"
                                    :device="device"
                                    :volume="device.component.volume"
                                    :disabled="device.component.switch === 'OFF'"
                                ></sound-control>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    props: ['devices', 'fetchDevices'],
    methods: {
        buttonOnClass(device) {
            return {
                'btn-primary': device.component.switch === 'OFF',
                'btn-secondary': device.component.switch === 'ON'
            }
        },
        buttonOffClass(device) {
            return {
                'btn-primary': device.component.switch === 'ON',
                'btn-secondary': device.component.switch === 'OFF'
            }
        },
        toggleDevice(device, targetStatus) {
			const payload = {
				deviceName: device.name,
                id: device.id,
				opt: 'set',
				key: 'switch',
				value: targetStatus
			};
            if (device.component.switch !== targetStatus) {
				axios.post('/api/toggle-device', payload)
                    .then(response => {
                        if (response.data.success) {
                            this.fetchDevices(); // Fetch the latest status from the server
                        }
                    })
                    .catch(error => {
                        console.error('Error toggling device:', error);
                    });
            }
        },
    }
};

const AirConditionPage = {
    template: `
    <div class="air-conditioner-remotes">
    <div class="ac-remote">
        <div class="display">
            <template v-if="power">
                <div class="temperature">{{ temperature }}°C</div>
                <div class="mode text">Mode: {{ mode }}</div>
                <div class="fan-speed text">Fan: {{ fanSpeed }}</div>
                <div class="direction text">Direction: {{ direction }}</div>
                <div class="swing text">Swing: {{ swing }}</div>
                <div class="timer text">Timer: {{ timer > 0 ? timer + ' hours' : 'OFF' }}</div>
                <div class="sleep text">Sleep: {{ sleep }}</div>
            </template>
        </div>
        <div class="controls">
            <div class="control-row1">
                <button @click="togglePower" :class="{ 'btn-controls': true, 'active': power }">
                    {{ power ? 'OFF' : 'ON' }}
                </button>
                <button @click="changeMode" :disabled="!power" class="btn-controls">Mode</button>
            </div>
            <div class="control-row2">
                <button @click="changeFanSpeed" :disabled="!power" class="btn-controls">Fan</button>
                <button @click="changeDirection" :disabled="!power" class="btn-controls">Direction</button>
                <button @click="changeSwing" :disabled="!power" class="btn-controls">Direction</button>
            </div>
            <div class="control-row3">
                <button @click="increaseTemp" :disabled="!power" class="btn-controls">+</button>
                <button @click="decreaseTemp" :disabled="!power" class="btn-controls">-</button>
            </div>
            <div class="control-row1">
                <button @click="setTimer" :disabled="!power" class="btn-controls">Timer</button>
                <button @click="changeSleep" :disabled="!power" class="btn-controls">sleep</button>
            </div>
        </div>
    </div>

    </div>
    `,
    data() {
        return {
            power: false,
            temperature: 25,
            mode: 'Cool',
            fanSpeed: 'Auto',
            direction: 'Auto',
            swing: 'Auto',
            sleep: 'OFF',
            timer: 0
        }
    },
    methods: {
        togglePower() {
            this.power = !this.power;
            if (!this.power) {
                // Reset all settings when turned off
                this.temperature = 25;
                this.mode = 'Cool';
                this.fanSpeed = 'Auto';
                this.direction = 'Auto';
                this.swing = 'Auto';
                this.sleep = 'OFF';
                this.timer = 0;
            }
        },
        changeMode() {
            if (this.power) {
                const modes = ['Cool', 'Heat', 'Dry', 'Fan'];
                const currentIndex = modes.indexOf(this.mode);
                this.mode = modes[(currentIndex + 1) % modes.length];
            }
        },
        changeFanSpeed() {
            if (this.power) {
                const speeds = ['Auto', 'Low', 'Medium', 'High'];
                const currentIndex = speeds.indexOf(this.fanSpeed);
                this.fanSpeed = speeds[(currentIndex + 1) % speeds.length];
            }
        },
        changeDirection() {
            if (this.power) {
                const directions = ['Auto', 'Up', 'Middle', 'Down'];
                const currentIndex = directions.indexOf(this.direction);
                this.direction = directions[(currentIndex + 1) % directions.length];
            }
        },
        changeSwing() {
            if (this.power) {
                const swings = ['Auto', 'Manual'];
                const currentIndex = swings.indexOf(this.swing);
                this.swing = swings[(currentIndex + 1) % swings.length];
            }
        },
        increaseTemp() {
            if (this.power && this.temperature < 30) this.temperature++;
        },
        decreaseTemp() {
            if (this.power && this.temperature > 16) this.temperature--;
        },
        setTimer() {
            if (this.power) {
                this.timer = (this.timer + 1) % 13; // 0-12 hours cycle
            }
        },
        changeSleep() {
            if (this.power) {
                const sleeps = ['OFF', 'ON'];
                const currentIndex = sleeps.indexOf(this.sleep);
                this.sleep = sleeps[(currentIndex + 1) % sleeps.length];
            }
        }
    }
};

const VideoPage = {
    template: '<p>This page is currently empty.</p>'
};

const InfoPage = {
    template: '<p>This page is currently empty.</p>'
};

const AboutPage = {
    template: `
        <div class="about-content">
            <h1>About</h1>
            <p>Software Version: 1.0.0</p>
        </div>
    `
};

new Vue({
    el: '#app',
    components: {
        'devices-page': DevicesPage,
        'aircondition-page': AirConditionPage,
        'video-page': VideoPage,
        'info-page': InfoPage,
        'about-page': AboutPage
    },
    data: {
        devices: initialDevices,
        navItems: [
            { name: 'Devices', page: 'devices' },
            { name: 'AirCondition', page: 'aircondition' },
            { name: 'Video', page: 'video' },
            { name: 'Info', page: 'info' },
            { name: 'About', page: 'about' }
        ],
        currentPage: 'aircondition' 
    },
    computed: {
        currentPageComponent() {
            return this.currentPage + '-page';
        }
    },
    methods: {
        setPage(page) {
            this.currentPage = page;
        },
        fetchDevices() {
            axios.get('/api/devices')
                .then(response => {
                    this.devices = response.data;
                })
                .catch(error => {
                    console.error('Error fetching devices:', error);
                });
        }
    },
    mounted() {
        this.fetchDevices();
        setInterval(this.fetchDevices, 5000); // Fetch every 5 seconds
	}
});

