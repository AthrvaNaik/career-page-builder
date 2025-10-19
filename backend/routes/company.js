const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const { protect, checkCompanyOwnership } = require('../middleware/auth');


router.get('/:slug', async (req, res) => {
  try {
    const company = await Company.findOne({ 
      companySlug: req.params.slug
    });

    if (!company) {
      return res.status(404).json({ 
        success: false, 
        message: 'Company not found' 
      });
    }

  
    if (!company.isPublished) {
      return res.status(404).json({ 
        success: false, 
        message: 'This careers page is not yet published' 
      });
    }

    
    company.sections.sort((a, b) => a.order - b.order);

    res.json({
      success: true,
      data: company
    });
  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});


router.get('/:slug/preview', protect, checkCompanyOwnership, async (req, res) => {
  try {
    const company = await Company.findOne({ 
      companySlug: req.params.slug 
    });

    if (!company) {
      return res.status(404).json({ 
        success: false, 
        message: 'Company not found' 
      });
    }

    
    company.sections.sort((a, b) => a.order - b.order);

    res.json({
      success: true,
      data: company
    });
  } catch (error) {
    console.error('Get company preview error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});


router.put('/:slug', protect, checkCompanyOwnership, async (req, res) => {
  try {
    const { companyName, branding, seo } = req.body;

    const company = await Company.findOne({ 
      companySlug: req.params.slug 
    });

    if (!company) {
      return res.status(404).json({ 
        success: false, 
        message: 'Company not found' 
      });
    }

  
    if (companyName) company.companyName = companyName;
    if (branding) company.branding = { ...company.branding, ...branding };
    if (seo) company.seo = { ...company.seo, ...seo };

    await company.save();

    res.json({
      success: true,
      message: 'Company updated successfully',
      data: company
    });
  } catch (error) {
    console.error('Update company error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

router.put('/:slug/sections', protect, checkCompanyOwnership, async (req, res) => {
  try {
    const { sections } = req.body;

    if (!Array.isArray(sections)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Sections must be an array' 
      });
    }

    const company = await Company.findOne({ 
      companySlug: req.params.slug 
    });

    if (!company) {
      return res.status(404).json({ 
        success: false, 
        message: 'Company not found' 
      });
    }

    company.sections = sections;
    await company.save();

    res.json({
      success: true,
      message: 'Sections updated successfully',
      data: company
    });
  } catch (error) {
    console.error('Update sections error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});


router.post('/:slug/sections', protect, checkCompanyOwnership, async (req, res) => {
  try {
    const { type, title, content } = req.body;

    if (!type || !title || !content) {
      console.log(req.body);
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide type, title, and content' 
      });
    }

    const company = await Company.findOne({ 
      companySlug: req.params.slug 
    });

    if (!company) {
      return res.status(404).json({ 
        success: false, 
        message: 'Company not found' 
      });
    }

    const newSection = {
      id: `section-${Date.now()}`,
      type,
      title,
      content,
      order: company.sections.length + 1,
      isVisible: true
    };
    

    company.sections.push(newSection);
    await company.save();

    


    res.status(201).json({
      success: true,
      message: 'Section added successfully',
      data: newSection
    });
  } catch (error) {
    console.error('Add section error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});


router.delete('/:slug/sections/:sectionId', protect, checkCompanyOwnership, async (req, res) => {
  try {
    const company = await Company.findOne({ 
      companySlug: req.params.slug 
    });

    if (!company) {
      return res.status(404).json({ 
        success: false, 
        message: 'Company not found' 
      });
    }

    const sectionIndex = company.sections.findIndex(
      section => section.id === req.params.sectionId
    );

    if (sectionIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Section not found' 
      });
    }

    company.sections.splice(sectionIndex, 1);
    
  
    company.sections.forEach((section, index) => {
      section.order = index + 1;
    });

    await company.save();

    res.json({
      success: true,
      message: 'Section deleted successfully'
    });
  } catch (error) {
    console.error('Delete section error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});


router.put('/:slug/publish', protect, checkCompanyOwnership, async (req, res) => {
  try {
    const { isPublished } = req.body;

    if (typeof isPublished !== 'boolean') {
      return res.status(400).json({ 
        success: false, 
        message: 'isPublished must be a boolean' 
      });
    }

    const company = await Company.findOneAndUpdate(
      { companySlug: req.params.slug },
      { isPublished },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ 
        success: false, 
        message: 'Company not found' 
      });
    }

    res.json({
      success: true,
      message: `Company page ${isPublished ? 'published' : 'unpublished'} successfully`,
      data: company
    });
  } catch (error) {
    console.error('Publish company error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;