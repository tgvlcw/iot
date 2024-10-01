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

                                <!-- Light Control Component -->
                                <light-control
                                    v-if="device.name === 'Light'"
                                    :deviceName="device.name"
                                    :brightness="device.value"
                                    :disabled="device.status === 'OFF'"
                                ></light-control>

                                <!-- Fan Control Component -->
                                <fan-control
                                    v-if="device.name === 'Fan'"
                                    :deviceName="device.name"
                                    :current-speed="device.value"
                                    :disabled="device.status === 'OFF'"
                                ></fan-control>

                            	<!-- TV Control Component -->
                            	<tv-control 
                                	v-if="device.name === 'TV'"
                                	:deviceName="device.name"
                                	:disabled="device.status === 'OFF'"
                                	class="mb-3"
                            	></tv-control> 

                                <!-- Sound Control Component -->
                                <sound-control
                                    v-if="device.name === 'Sound'"
                                    :deviceName="device.name"
                                    :volume="device.value"
                                    :disabled="device.status === 'OFF'"
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
        toggleDevice(deviceId, targetStatus) {
            const device = this.devices.find(d => d.id === deviceId);
			const payload = {
				deviceName: device.name,
				opt: 'set',
				key: 'switch',
				value: targetStatus
			};
            if (device && device.status !== targetStatus) {
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

