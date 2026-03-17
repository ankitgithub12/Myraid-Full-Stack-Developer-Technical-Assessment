const mongoose = require('mongoose');
const { encrypt, decrypt } = require('../utils/encryption');

const taskSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending',
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium',
    },
    createdDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt description before saving
taskSchema.pre('save', async function () {
  if (this.isModified('description')) {
    this.description = encrypt(this.description);
  }
});

// Decrypt description after finding
taskSchema.post('init', function (doc) {
  if (doc.description) {
    doc.description = decrypt(doc.description);
  }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
