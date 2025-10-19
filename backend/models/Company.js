const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  companySlug: {
    type: String,
    required: [true, 'Company slug is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens']
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  branding: {
    primaryColor: {
      type: String,
      default: '#3B82F6'
    },
    secondaryColor: {
      type: String,
      default: '#1E40AF'
    },
    logo: {
      type: String,
      default: ''
    },
    bannerImage: {
      type: String,
      default: ''
    },
    cultureVideo: {
      type: String,
      default: ''
    }
  },
  sections: [{
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['about', 'life', 'values', 'benefits', 'custom'],
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    order: {
      type: Number,
      required: true
    },
    isVisible: {
      type: Boolean,
      default: true
    }
  }],
  seo: {
    metaTitle: {
      type: String,
      default: ''
    },
    metaDescription: {
      type: String,
      default: ''
    },
    keywords: [{
      type: String
    }]
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});


CompanySchema.pre('save', function(next) {
  if (this.isModified('companyName') && !this.companySlug) {
    this.companySlug = this.companyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
  

  if (!this.seo.metaTitle) {
    this.seo.metaTitle = `Careers at ${this.companyName}`;
  }
  

  if (!this.seo.metaDescription) {
    this.seo.metaDescription = `Join ${this.companyName} and explore exciting career opportunities. View our open positions and apply today.`;
  }
  
  next();
});


CompanySchema.index({ companySlug: 1 });
CompanySchema.index({ isPublished: 1 });

module.exports = mongoose.model('Company', CompanySchema);