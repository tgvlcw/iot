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
        navItems: [
            { name: 'Devices', page: 'devices' },
            { name: 'Video', page: 'video' },
            { name: 'Info', page: 'info' },
            { name: 'About', page: 'about' }
        ],
        currentPage: 'devices' 
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

