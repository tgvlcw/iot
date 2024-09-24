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
        toggleDevice(deviceId) {
            const device = this.devices.find(d => d.id === deviceId);
            if (device) {
                axios.post('/api/toggle-device', { deviceId: deviceId })
                    .then(response => {
                        if (response.data.success) {
                            device.status = device.status === 'ON' ? 'OFF' : 'ON';
                        }
                    })
                    .catch(error => {
                        console.error('Error toggling device:', error);
                    });
            }
        },
        getButtonText(status) {
            return status === 'ON' ? 'Turn OFF' : 'Turn ON';
        }
    }
});

