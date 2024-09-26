const DevicesPage = {
    template: `
        <div>
            <div class="row">
                <div class="col-md-6" v-for="device in devices" :key="device.id">
                    <div class="card mb-4">
                        <div class="card-body">
                            <h5 class="card-title">{{ device.name }}</h5>
                            <p class="card-text">Status: {{ device.status }}</p>
                            <div class="d-flex align-items-center mb-2">
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
                                <div v-if="device.name === 'Light'" class="ms-3 flex-grow-1">
                                    <input type="range" class="form-range" min="0" max="100" 
                                           v-model="device.brightness" 
                                           @change="updateBrightness(device.id, device.brightness)"
                                           :disabled="device.status === 'OFF'">
                                </div>
                                
                                <!-- Fan Control -->
                                <div v-if="device.name === 'Fan'" class="ms-4">
                                    <div class="btn-group" role="group">
                                        <button v-for="speed in [1, 2, 3]" :key="speed"
                                                @click="setFanSpeed(device.id, speed)"
                                                class="btn btn-outline-primary rounded-circle me-1"
                                                :class="{ active: device.speed === speed }"
                                                :disabled="device.status === 'OFF'">
                                            {{ speed }}
                                        </button>
                                    </div>
                                </div>
                                
								<!-- Sound Control -->
								<div v-if="device.name === 'Sound'" class="ms-3 flex-grow-1">
									<input type="range" class="form-range" min="0" max="100" 
										   v-model="device.volume" 
										   @change="updateVolume(device.id, device.volume)"
										   :disabled="device.status === 'OFF'">
								</div>

								<!-- TV Control -->
								<div v-if="device.name === 'TV'" class="mt-3">
									<div class="d-flex1">
										<button @click="tvControl(device.id, 'up')"
											class="btn btn-outline-secondary"
											:disabled="device.status === 'OFF'">↑</button>
									</div>
									<div class="d-flex2 my-2">
										<button @click="tvControl(device.id, 'left')"
											class="btn btn-outline-secondary me-2"
											:disabled="device.status === 'OFF'">←</button>
										<button @click="tvControl(device.id, 'ok')"
											class="btn btn-outline-primary"
											:disabled="device.status === 'OFF'">OK</button>
										<button @click="tvControl(device.id, 'right')"
											class="btn btn-outline-secondary ms-2"
											:disabled="device.status === 'OFF'">→</button>
									</div>
									<div class="d-flex1">
										<button @click="tvControl(device.id, 'down')"
											class="btn btn-outline-secondary"
											:disabled="device.status === 'OFF'">↓</button>
									</div>
								</div>
							</div>
						</div>
                    </div>
                </div>
            </div>
        </div>
    `,
    props: ['devices'],
    methods: {
        toggleDevice(deviceId, targetStatus) {
            this.$emit('toggle-device', deviceId, targetStatus);
        },
        updateBrightness(deviceId, brightness) {
            this.$emit('update-brightness', deviceId, brightness);
        },
        setFanSpeed(deviceId, speed) {
            this.$emit('set-fan-speed', deviceId, speed);
        },
        updateVolume(deviceId, volume) {
            this.$emit('update-volume', deviceId, volume);
        },
        tvControl(deviceId, action) {
            this.$emit('tv-control', deviceId, action);
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
        },
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
        }
    },
    mounted() {
        this.fetchDevices();
        setInterval(this.fetchDevices, 5000); // Fetch every 5 seconds
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
});

