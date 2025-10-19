

const validateEmail = (email) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(String(email).toLowerCase());
};

const validateRegister = (data) => {
  const { email, password, companyName } = data;

  if (!email || !password || !companyName) {
    return 'Please provide email, password, and company name';
  }

  if (!validateEmail(email)) {
    return 'Please provide a valid email address';
  }

  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }

  if (companyName.trim().length < 2) {
    return 'Company name must be at least 2 characters long';
  }

  return null;
};

const validateLogin = (data) => {
  const { email, password } = data;

  if (!email || !password) {
    return 'Please provide email and password';
  }

  if (!validateEmail(email)) {
    return 'Please provide a valid email address';
  }

  return null;
};

const validateJob = (data) => {
  const { jobTitle, location, jobType, department, description, requirements } = data;

  if (!jobTitle || !location || !jobType || !department || !description || !requirements) {
    return 'Please provide all required fields: jobTitle, location, jobType, department, description, requirements';
  }

  if (jobTitle.trim().length < 3) {
    return 'Job title must be at least 3 characters long';
  }

  if (description.trim().length < 50) {
    return 'Job description must be at least 50 characters long';
  }

  if (requirements.trim().length < 20) {
    return 'Job requirements must be at least 20 characters long';
  }

  return null;
};

const validateSection = (data) => {
  const { type, title, content } = data;

  if (!type || !title || !content) {
    return 'Please provide type, title, and content';
  }

  if (title.trim().length < 2) {
    return 'Section title must be at least 2 characters long';
  }

  if (content.trim().length < 10) {
    return 'Section content must be at least 10 characters long';
  }

  const validTypes = ['about', 'life', 'values', 'benefits', 'custom'];
  if (!validTypes.includes(type)) {
    return 'Invalid section type';
  }

  return null;
};

module.exports = {
  validateEmail,
  validateRegister,
  validateLogin,
  validateJob,
  validateSection
};