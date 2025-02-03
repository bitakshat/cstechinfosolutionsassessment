// // const mongoose = require('mongoose');
// import mongoose from 'mongoose';

// const taskSchema = new mongoose.Schema({
//     title: String,
//     description: String,
//     // Add other fields as required
//     agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
// });

// export const Task = mongoose.model('Task', taskSchema);


import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    FirstName: {
        type: String,
        required: true
    },
    Phone: {
        type: String,
        required: true
    },
    Notes: {
        type: String
    },
    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent',
        required: true
    },
    status: {
        type: String,
        enum: ['assigned', 'in_progress', 'completed'],
        default: 'assigned'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Task = mongoose.model('Task', taskSchema);