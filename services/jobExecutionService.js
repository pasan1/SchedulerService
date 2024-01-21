const axios = require('axios');
const Job = require('../models/Job');

const jobExecutionService = {
    execute: async (job) => {
        try {
            console.log(`Executing ${job.name} job ${job._id} at ${new Date().toISOString()}`);
            const apiResponse = await axios.get(job.apiUrl);
            await axios.post(job.webhookUrl, {data: apiResponse.data});

            job.status = 'completed';
            await job.save();
        } catch (error) {
            job.status = 'failed';
            await job.save();
        }
    }
};

module.exports = jobExecutionService;
