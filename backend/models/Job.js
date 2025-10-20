const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  companySlug: {
    type: String,
    required: [true, 'Company slug is required'],
    ref: 'Company'
  },
  jobTitle: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  jobType: {
    type: String,
    required: [true, 'Job type is required'],
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote', 'Hybrid']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Job description is required']
  },
  requirements: {
    type: String,
    required: [true, 'Job requirements are required']
  },
  // salary: {
  //   min: {
  //     type: Number,
  //     default: null
  //   },
  //   max: {
  //     type: Number,
  //     default: null
  //   },
  //   currency: {
  //     type: String,
  //     default: 'USD'
  //   }
  // },
  experienceLevel: {
    type: String,
    enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Lead', 'Executive'],
    default: 'Mid Level'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  postedDate: {
    type: Date,
    default: Date.now
  },
  // expiryDate: {
  //   type: Date,
  //   default: null
  // }
}, {
  timestamps: true
});


JobSchema.index({ companySlug: 1, isActive: 1 });
JobSchema.index({ jobTitle: 'text', description: 'text', department: 'text' });
JobSchema.index({ location: 1 });
JobSchema.index({ jobType: 1 });
JobSchema.index({ department: 1 });
JobSchema.index({ postedDate: -1 });


JobSchema.virtual('isExpired').get(function() {
  if (!this.expiryDate) return false;
  return new Date() > this.expiryDate;
});


JobSchema.methods.getSalaryRange = function() {
  if (!this.salary.min && !this.salary.max) return 'Not specified';
  if (this.salary.min && !this.salary.max) return `From ${this.salary.currency} ${this.salary.min.toLocaleString()}`;
  if (!this.salary.min && this.salary.max) return `Up to ${this.salary.currency} ${this.salary.max.toLocaleString()}`;
  return `${this.salary.currency} ${this.salary.min.toLocaleString()} - ${this.salary.max.toLocaleString()}`;
};

module.exports = mongoose.model('Job', JobSchema);