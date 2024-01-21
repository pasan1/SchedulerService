const cron = require('node-cron');
const Job = require('../models/Job');
const jobExecutionService = require('./jobExecutionService');

let scheduledTasks = {};

const schedulerService = {
    start: () => {
        // Run a task every minute (or another suitable interval) to update the scheduled jobs
        cron.schedule('* * * * *', async () => {
            console.log('Updating scheduled tasks...');
            const jobs = await Job.find({status: 'scheduled'});

            jobs.forEach(job => {
                // Schedule a new task if it's not already scheduled
                if (!scheduledTasks[job.id]) {
                    scheduledTasks[job.id] = cron.schedule(job.scheduleTime, () => {
                        jobExecutionService.execute(job);

                        // Once executed, stop the task and remove it from scheduledTasks
                        scheduledTasks[job.id].stop();
                        delete scheduledTasks[job.id];
                    });
                    console.log(`Scheduled a new job: ${job.name}`);
                }
            });

            // Remove any tasks that are no longer in the database
            for (let jobId in scheduledTasks) {
                if (!jobs.some(job => job.id === jobId)) {
                    scheduledTasks[jobId].destroy();
                    delete scheduledTasks[jobId];
                    console.log(`Removed a scheduled job: ${jobId}`);
                }
            }
        });
    }
};

module.exports = schedulerService;
