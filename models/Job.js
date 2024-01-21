const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    name: String,
    scheduleTime: String, // Cron format
    apiUrl: String,
    webhookUrl: String,
    status: String // 'scheduled', 'completed', 'failed'
});

module.exports = mongoose.model('Job', jobSchema);
