new Vue({
    el: '#app',
    data: {
        devices: initialDevices
    },
    methods: {
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
                axios.post('/api/toggle-device', { deviceId: deviceId, status: targetStatus })
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
        // Fetch devices when the component is mounted
        this.fetchDevices();
        // Set up an interval to periodically fetch device status
        setInterval(this.fetchDevices, 5000); // Fetch every 5 seconds
    }
});
