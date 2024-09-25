const DevicesPage = {
    template: `
        <div>
            <div class="row">
                <div class="col-md-6" v-for="device in devices" :key="device.id">
                    <div class="card mb-4">
                        <div class="card-body">
                            <h5 class="card-title">{{ device.name }}</h5>
                            <p class="card-text">Status: {{ device.status }}</p>
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
    }
});

