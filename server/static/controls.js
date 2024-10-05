const LightControl = {
    template: `
        <div class="ms-4 slide-btn">
            <input type="range" class="form-range" min="0" max="100"
                   v-model="brightness"
                   @change="updateBrightness"
                   :disabled="disabled">
        </div>
    `,
    props: {
        deviceName: {
            type: String,
            required: true
        },
        brightness: {
            type: Number,
            required: true
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    inject: ['fetchDevices'],
    methods: {
        updateBrightness() {
			const payload = {
				deviceName: this.deviceName,
				opt: 'set',
				key: 'brightness',
				value: this.brightness
			};
			axios.post('/api/control-device', payload)
                .then(response => {
                    if (response.data.success) {
                        this.fetchDevices();
                    }
                })
                .catch(error => {
                    console.error('Error updating brightness:', error);
                });
        }
    }
};

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
        deviceName: {
            type: String,
            required: true
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    inject: ['fetchDevices'],
    methods: {
        control(action) {
			const payload = {
				deviceName: this.deviceName,
				opt: 'set',
				key: 'event',
				value: action
			};
			axios.post('/api/control-device', payload)
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

const FanControl = {
    template: `
        <div class="ms-4 fan-control">
            <div class="btn-group1" role="group">
                <button v-for="speed in [1, 2, 3]" :key="speed"
                        @click="setFanSpeed(speed)"
                        class="btn btn-outline-primary rounded-circle spd-btn"
                        :class="{ active: currentSpeed === speed }"
                        :disabled="disabled">
                    {{ speed }}
                </button>
            </div>
        </div>
    `,
    props: {
        deviceName: {
            type: String,
            required: true
        },
        currentSpeed: {
            type: Number,
            required: true
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    inject: ['fetchDevices'],
    methods: {
        setFanSpeed(speed) {
			const payload = {
				deviceName: this.deviceName,
				opt: 'set',
				key: 'speed',
				value: speed
			};
			axios.post('/api/control-device', payload)
                .then(response => {
                    if (response.data.success) {
                        this.fetchDevices();
                    }
                })
                .catch(error => {
                    console.error('Error setting fan speed:', error);
                });
        }
    }
};

const SoundControl = {
    template: `
        <div class="ms-4 slide-btn">
            <input type="range" class="form-range" min="0" max="100"
                   v-model="volume"
                   @change="updateVolume"
                   :disabled="disabled">
        </div>
    `,
    props: {
        deviceName: {
            type: String,
            required: true
        },
        volume: {
            type: Number,
            required: true
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    inject: ['fetchDevices'],
	methods: {
		updateVolume() {
			const payload = {
				deviceName: this.deviceName,
				opt: 'set',
				key: 'volume',
				value: this.volume
			};
			axios.post('/api/control-device', payload)
                .then(response => {
                    if (response.data.success) {
                        this.fetchDevices();
                    }
                })
                .catch(error => {
                    console.error('Error updating volume:', error);
                });
        }
    }
};
