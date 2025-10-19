const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('../models/Job');
const Company = require('../models/Company');

dotenv.config();

// Sample jobs data (based on the Google Sheet)
const sampleJobs = [
  {
    jobTitle: 'Senior Full Stack Developer',
    location: 'San Francisco, CA',
    jobType: 'Full-time',
    department: 'Engineering',
    experienceLevel: 'Senior Level',
    description: `We are looking for an experienced Full Stack Developer to join our engineering team. You will be responsible for developing and maintaining both front-end and back-end components of our web applications.

Key Responsibilities:
- Design and develop scalable web applications
- Write clean, maintainable code
- Collaborate with cross-functional teams
- Participate in code reviews and technical discussions
- Mentor junior developers`,
    requirements: `Required Skills:
- 5+ years of experience in full stack development
- Strong proficiency in JavaScript, React, Node.js
- Experience with SQL and NoSQL databases
- Knowledge of RESTful APIs and microservices
- Excellent problem-solving skills
- Strong communication and teamwork abilities`,
    salary: { min: 120000, max: 180000, currency: 'USD' }
  },
  {
    jobTitle: 'Product Manager',
    location: 'New York, NY',
    jobType: 'Full-time',
    department: 'Product',
    experienceLevel: 'Mid Level',
    description: `Join our product team to help shape the future of our platform. As a Product Manager, you will work closely with engineering, design, and business teams to deliver exceptional products.

Key Responsibilities:
- Define product vision and strategy
- Gather and prioritize product requirements
- Work with engineering teams to deliver features
- Analyze user feedback and metrics
- Create product roadmaps`,
    requirements: `Required Skills:
- 3+ years of product management experience
- Strong analytical and problem-solving skills
- Excellent communication abilities
- Experience with agile methodologies
- Understanding of user experience design
- Technical background is a plus`,
    salary: { min: 100000, max: 150000, currency: 'USD' }
  },
  {
    jobTitle: 'UX/UI Designer',
    location: 'Remote',
    jobType: 'Remote',
    department: 'Design',
    experienceLevel: 'Mid Level',
    description: `We're seeking a talented UX/UI Designer to create beautiful and intuitive user experiences. You'll work on designing interfaces for web and mobile applications.

Key Responsibilities:
- Design user interfaces for web and mobile
- Create wireframes, prototypes, and mockups
- Conduct user research and usability testing
- Collaborate with product and engineering teams
- Maintain design systems and guidelines`,
    requirements: `Required Skills:
- 3+ years of UX/UI design experience
- Proficiency in Figma, Sketch, or Adobe XD
- Strong portfolio showcasing your work
- Understanding of user-centered design principles
- Knowledge of responsive design
- Excellent visual design skills`,
    salary: { min: 80000, max: 120000, currency: 'USD' }
  },
  {
    jobTitle: 'DevOps Engineer',
    location: 'Austin, TX',
    jobType: 'Full-time',
    department: 'Engineering',
    experienceLevel: 'Senior Level',
    description: `We need a skilled DevOps Engineer to help us build and maintain our infrastructure. You'll work on automation, monitoring, and scaling our systems.

Key Responsibilities:
- Manage cloud infrastructure (AWS/GCP/Azure)
- Implement CI/CD pipelines
- Monitor system performance and reliability
- Automate deployment processes
- Ensure security best practices`,
    requirements: `Required Skills:
- 4+ years of DevOps experience
- Strong knowledge of AWS/GCP/Azure
- Experience with Docker and Kubernetes
- Proficiency in scripting (Python, Bash)
- Knowledge of infrastructure as code (Terraform)
- Understanding of security and compliance`,
    salary: { min: 130000, max: 170000, currency: 'USD' }
  },
  {
    jobTitle: 'Marketing Manager',
    location: 'Los Angeles, CA',
    jobType: 'Full-time',
    department: 'Marketing',
    experienceLevel: 'Mid Level',
    description: `Join our marketing team to drive growth and brand awareness. You'll be responsible for developing and executing marketing strategies.

Key Responsibilities:
- Develop marketing strategies and campaigns
- Manage social media presence
- Analyze marketing metrics and ROI
- Collaborate with sales and product teams
- Create compelling content`,
    requirements: `Required Skills:
- 3+ years of marketing experience
- Strong understanding of digital marketing
- Experience with marketing automation tools
- Excellent writing and communication skills
- Data-driven mindset
- Creative thinking`,
    salary: { min: 70000, max: 100000, currency: 'USD' }
  },
  {
    jobTitle: 'Data Scientist',
    location: 'Seattle, WA',
    jobType: 'Full-time',
    department: 'Data',
    experienceLevel: 'Senior Level',
    description: `We're looking for a Data Scientist to help us extract insights from data and build predictive models.

Key Responsibilities:
- Analyze large datasets to identify trends
- Build and deploy machine learning models
- Create data visualizations and reports
- Collaborate with engineering and product teams
- Present findings to stakeholders`,
    requirements: `Required Skills:
- 4+ years of data science experience
- Strong programming skills (Python, R)
- Experience with ML frameworks (TensorFlow, PyTorch)
- Knowledge of statistical analysis
- Proficiency in SQL
- Excellent problem-solving abilities`,
    salary: { min: 140000, max: 190000, currency: 'USD' }
  },
  {
    jobTitle: 'Customer Success Manager',
    location: 'Boston, MA',
    jobType: 'Full-time',
    department: 'Customer Success',
    experienceLevel: 'Entry Level',
    description: `Help our customers succeed! As a Customer Success Manager, you'll be the primary point of contact for our clients.

Key Responsibilities:
- Onboard new customers
- Provide ongoing support and training
- Identify upsell opportunities
- Track customer health metrics
- Gather and relay customer feedback`,
    requirements: `Required Skills:
- 1-2 years of customer-facing experience
- Excellent communication skills
- Problem-solving abilities
- Empathy and patience
- Basic technical understanding
- Ability to manage multiple accounts`,
    salary: { min: 50000, max: 70000, currency: 'USD' }
  },
  {
    jobTitle: 'Backend Engineer',
    location: 'Chicago, IL',
    jobType: 'Full-time',
    department: 'Engineering',
    experienceLevel: 'Mid Level',
    description: `Join our backend team to build scalable and reliable APIs and services.

Key Responsibilities:
- Design and implement RESTful APIs
- Build microservices architecture
- Optimize database queries
- Ensure system reliability and performance
- Write comprehensive tests`,
    requirements: `Required Skills:
- 3+ years of backend development experience
- Strong knowledge of Node.js or Python
- Experience with PostgreSQL/MongoDB
- Understanding of microservices
- Knowledge of API design best practices
- Experience with cloud platforms`,
    salary: { min: 110000, max: 150000, currency: 'USD' }
  }
];

const seedJobs = async (companySlug) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Check if company exists
    const company = await Company.findOne({ companySlug });
    if (!company) {
      console.log('❌ Company not found with slug:', companySlug);
      process.exit(1);
    }

    // Delete existing jobs for this company
    await Job.deleteMany({ companySlug });
    console.log('🗑️  Deleted existing jobs');

    // Add companySlug to each job
    const jobsWithCompany = sampleJobs.map(job => ({
      ...job,
      companySlug,
      isActive: true,
      postedDate: new Date()
    }));

    // Insert jobs
    const insertedJobs = await Job.insertMany(jobsWithCompany);
    console.log(`✅ Successfully seeded ${insertedJobs.length} jobs for ${company.companyName}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding jobs:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  const companySlug = process.argv[2];
  if (!companySlug) {
    console.log('❌ Please provide a company slug');
    console.log('Usage: node utils/seedJobs.js <company-slug>');
    process.exit(1);
  }
  seedJobs(companySlug);
}

module.exports = seedJobs;