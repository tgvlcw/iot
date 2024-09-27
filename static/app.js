const TVControl = {
    template: `
        <div class="tv-control">
            <div class="d-flex justify-content-center">
                <button @click="control('up')" class="btn btn-outline-primary tv-btn" :disabled="disabled">↑</button>
            </div>
            <div class="d-flex justify-content-center my-2">
                <button @click="control('left')" class="btn btn-outline-primary tv-btn me-2" :disabled="disabled">←</button>
                <button @click="control('ok')" class="btn btn-outline-primary tv-btn" :disabled="disabled">OK</button>
                <button @click="control('right')" class="btn btn-outline-primary tv-btn ms-2" :disabled="disabled">→</button>
            </div>
            <div class="d-flex justify-content-center">
                <button @click="control('down')" class="btn btn-outline-primary tv-btn" :disabled="disabled">↓</button>
            </div>
        </div>
    `,
    props: {
        deviceId: {
            type: Number,
            required: true
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        control(action) {
            this.$emit('tv-control', this.deviceId, action);
        }
    }
};

const DevicesPage = {
    components: {
		'tv-control': TVControl
    },
    template: `
        <div>
            <div class="row">
                <div class="col-md-6" v-for="device in devices" :key="device.id">
                    <div class="card mb-4">
                        <div class="card-body">
                            <h5 class="card-title">{{ device.name }}</h5>
                            <p class="card-text">Status: {{ device.status }}</p>
                            <div class="on-btn mb-2">
                                <div class="btn-group" role="group">
                                    <button @click="toggleDevice(device.id, 'ON')"
                                            class="btn"
                                            :class="{'btn-primary': device.status !== 'ON', 'btn-secondary': device.status === 'ON'}"
                                            :disabled="device.status === 'ON'">
                                        ON
                                    </button>
                                    <button @click="toggleDevice(device.id, 'OFF')"
                                            class="btn"
                                            :class="{'btn-primary': device.status !== 'OFF', 'btn-secondary': device.status === 'OFF'}"
                                            :disabled="device.status === 'OFF'">
                                        OFF
                                    </button>
                                </div>

                                <!-- Light Control -->
                                <div v-if="device.name === 'Light'" class="ms-4 slide-btn">
                                    <input type="range" class="form-range" min="0" max="100"
                                           v-model="device.brightness"
                                           @change="updateBrightness(device.id, device.brightness)"
                                           :disabled="device.status === 'OFF'">
                                </div>

                                <!-- Fan Control -->
                                <div v-if="device.name === 'Fan'" class="ms-4 fan-control">
                                    <div class="btn-group1" role="group">
                                        <button v-for="speed in [1, 2, 3]" :key="speed"
                                                @click="setFanSpeed(device.id, speed)"
                                                class="btn btn-outline-primary rounded-circle spd-btn"
                                                :class="{ active: device.speed === speed }"
                                                :disabled="device.status === 'OFF'">
                                            {{ speed }}
                                        </button>
                                    </div>
                                </div>

                            	<!-- TV Control Component -->
                            	<tv-control 
                                	v-if="device.name === 'TV'"
                                	:device-id="device.id"
                                	:disabled="device.status === 'OFF'"
                                	@tv-control="tvControl"
                                	class="mb-3"
                            	></tv-control> 

                                <!-- Sound Control -->
                                <div v-if="device.name === 'Sound'" class="ms-4 slide-btn">
                                    <input type="range" class="form-range" min="0" max="100"
                                           v-model="device.volume"
                                           @change="updateVolume(device.id, device.volume)"
                                           :disabled="device.status === 'OFF'">
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    props: ['devices', 'fetchDevices'],
    methods: {
        toggleDevice(deviceId, targetStatus) {
            const device = this.devices.find(d => d.id === deviceId);
            if (device && device.status !== targetStatus) {
                axios.post('/api/toggle-device', { deviceName: device.name, status: targetStatus })
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
		updateBrightness(deviceId, brightness) {
			axios.post('/api/update-brightness', { deviceId, brightness })
				.then(response => {
					if (response.data.success) {
						this.fetchDevices(); 
					}
				})
				.catch(error => {
					console.error('Error updating brightness:', error);
				});
		},
		setFanSpeed(deviceId, speed) {
			axios.post('/api/set-fan-speed', { deviceId, speed })
				.then(response => {
					if (response.data.success) {
						this.fetchDevices(); 
					}
				})
				.catch(error => {
					console.error('Error setting fan speed:', error);
				});
		},
		updateVolume(deviceId, volume) {
			axios.post('/api/update-volume', { deviceId, volume })
				.then(response => {
					if (response.data.success) {
						this.fetchDevices(); 
					}
				})
				.catch(error => {
					console.error('Error updating volume:', error);
				});
		},
		tvControl(deviceId, action) {
			axios.post('/api/tv-control', { deviceId, action })
				.then(response => {
					if (response.data.success) {
						this.fetchDevices(); 
					}
				})
				.catch(error => {
					console.error('Error controlling TV:', error);
				});
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
        'video-page': VideoPage,
        'info-page': InfoPage,
        'about-page': AboutPage
    },
    data: {
        devices: initialDevices,
        currentPage: 'devices', // Default page
		navItems: initialNavItems
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

