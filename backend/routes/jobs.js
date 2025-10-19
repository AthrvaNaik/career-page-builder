const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { protect, checkCompanyOwnership } = require('../middleware/auth');


router.get('/:companySlug', async (req, res) => {
  try {
    const { location, jobType, department, search } = req.query;

    
    let query = { 
      companySlug: req.params.companySlug,
      isActive: true 
    };

   
    if (location && location !== 'all') {
      query.location = location;
    }

    if (jobType && jobType !== 'all') {
      query.jobType = jobType;
    }

    if (department && department !== 'all') {
      query.department = department;
    }

    // Add text search
    if (search && search.trim() !== '') {
      query.$text = { $search: search };
    }

    const jobs = await Job.find(query).sort({ postedDate: -1 });

    res.json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

router.get('/:companySlug/:jobId', async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.jobId,
      companySlug: req.params.companySlug,
      isActive: true
    });

    if (!job) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job not found' 
      });
    }

    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});


router.get('/:companySlug/all/admin', protect, checkCompanyOwnership, async (req, res) => {
  try {
    const jobs = await Job.find({ 
      companySlug: req.params.companySlug 
    }).sort({ postedDate: -1 });

    res.json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    console.error('Get all jobs error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});


router.get('/:companySlug/filters/options', async (req, res) => {
  try {
    const jobs = await Job.find({ 
      companySlug: req.params.companySlug,
      isActive: true 
    });

   
    const locations = [...new Set(jobs.map(job => job.location))].sort();
    const jobTypes = [...new Set(jobs.map(job => job.jobType))].sort();
    const departments = [...new Set(jobs.map(job => job.department))].sort();

    res.json({
      success: true,
      data: {
        locations,
        jobTypes,
        departments
      }
    });
  } catch (error) {
    console.error('Get filters error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});


router.post('/:companySlug', protect, checkCompanyOwnership, async (req, res) => {
  try {
    const { 
      jobTitle, 
      location, 
      jobType, 
      department, 
      description, 
      requirements,
      experienceLevel,
      salary
    } = req.body;

    // Validation
    if (!jobTitle || !location || !jobType || !department || !description || !requirements) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields: jobTitle, location, jobType, department, description, requirements' 
      });
    }

    const job = await Job.create({
      companySlug: req.params.companySlug,
      jobTitle,
      location,
      jobType,
      department,
      description,
      requirements,
      experienceLevel: experienceLevel || 'Mid Level',
      salary: salary || {}
    });

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: job
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});


router.put('/:companySlug/:jobId', protect, checkCompanyOwnership, async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { 
        _id: req.params.jobId,
        companySlug: req.params.companySlug 
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job not found' 
      });
    }

    res.json({
      success: true,
      message: 'Job updated successfully',
      data: job
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});


router.delete('/:companySlug/:jobId', protect, checkCompanyOwnership, async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.jobId,
      companySlug: req.params.companySlug
    });

    if (!job) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job not found' 
      });
    }

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});


router.put('/:companySlug/:jobId/toggle', protect, checkCompanyOwnership, async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.jobId,
      companySlug: req.params.companySlug
    });

    if (!job) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job not found' 
      });
    }

    job.isActive = !job.isActive;
    await job.save();

    res.json({
      success: true,
      message: `Job ${job.isActive ? 'activated' : 'deactivated'} successfully`,
      data: job
    });
  } catch (error) {
    console.error('Toggle job error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});


router.post('/:companySlug/bulk', protect, checkCompanyOwnership, async (req, res) => {
  try {
    const { jobs } = req.body;

    if (!Array.isArray(jobs) || jobs.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide an array of jobs' 
      });
    }

    
    const jobsWithSlug = jobs.map(job => ({
      ...job,
      companySlug: req.params.companySlug,
      isActive: job.isActive !== undefined ? job.isActive : true,
      postedDate: job.postedDate || new Date()
    }));

    const createdJobs = await Job.insertMany(jobsWithSlug);

    res.status(201).json({
      success: true,
      message: `${createdJobs.length} jobs imported successfully`,
      count: createdJobs.length,
      data: createdJobs
    });
  } catch (error) {
    console.error('Bulk import jobs error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during bulk import',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;