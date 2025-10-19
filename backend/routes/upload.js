const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');
const { protect } = require('../middleware/auth');
const fs = require('fs');


router.post('/logo', protect, upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please upload a file' 
      });
    }

    
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: `careers-builder/${req.user.companySlug}/logos`,
      resource_type: 'image',
      transformation: [
        { width: 400, height: 400, crop: 'limit' },
        { quality: 'auto' }
      ]
    });

   
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: 'Logo uploaded successfully',
      data: {
        url: result.secure_url,
        publicId: result.public_id
      }
    });
  } catch (error) {
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Upload logo error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error uploading logo' 
    });
  }
});


router.post('/banner', protect, upload.single('banner'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please upload a file' 
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: `careers-builder/${req.user.companySlug}/banners`,
      resource_type: 'image',
      transformation: [
        { width: 1920, height: 600, crop: 'limit' },
        { quality: 'auto' }
      ]
    });

    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: 'Banner uploaded successfully',
      data: {
        url: result.secure_url,
        publicId: result.public_id
      }
    });
  } catch (error) {
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Upload banner error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error uploading banner' 
    });
  }
});

router.post('/video', protect, async (req, res) => {
  try {
    const { videoUrl } = req.body;

    if (videoUrl) {
      return res.json({
        success: true,
        message: 'Video URL saved',
        data: { url: videoUrl }
      });
    }

    
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: `careers-builder/${req.user.companySlug}/videos`,
        resource_type: 'video'
      });

      fs.unlinkSync(req.file.path);

      return res.json({
        success: true,
        message: 'Video uploaded successfully',
        data: {
          url: result.secure_url,
          publicId: result.public_id
        }
      });
    }

    res.status(400).json({ 
      success: false, 
      message: 'Please provide a video URL or upload a video file' 
    });
  } catch (error) {
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Upload video error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error uploading video' 
    });
  }
});


router.delete('/:publicId', protect, async (req, res) => {
  try {
    const publicId = req.params.publicId.replace(/-/g, '/');
    await cloudinary.uploader.destroy(publicId);

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting file' 
    });
  }
});

module.exports = router;