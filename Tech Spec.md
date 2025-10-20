## My Assumptions

So when I started this project, I made some assumptions about what was needed:

- Each company gets their own page with a unique URL (like /company-name/careers)
- Only logged in recruiters can edit their company page, but anyone can view the public careers page
- Files like logos and banners need to be uploaded somewhere, so I used Cloudinary (free tier is enough)
- Jobs can be filtered by location and type, and searched by title
- Mobile users should be able to use it properly (responsive design)
- Companies want to customize colors and branding to match their company
- One recruiter = one company (didn't implement multi-user per company, that would be phase 2)

## Architecture & Design Decisions

### Why MERN Stack?

I picked MERN because:
- I'm comfortable with JavaScript on both frontend and backend
- MongoDB is good for this kind of data (companies and jobs can have flexible fields)
- React makes it easy to build reusable components

### Frontend Structure

I used **Zustand** for state management because it's lighter than Redux and easier to understand. Made separate stores for:
- Auth stuff (login, logout, user data)
- Company data (branding, sections)
- Jobs data (list of jobs, filters)

For routing I used React Router. Pages are split into:
- Public pages: Login, Register, Careers Page (anyone can see)
- Private pages: Dashboard (need to be logged in)

### Backend Structure

Express server with these main parts:
- Routes: auth, company, jobs, upload
- Models: User, Company, Job
- Middleware: JWT authentication, file upload handling, error handling

Used JWT for authentication - token stored in localStorage on frontend, sent in headers for protected routes.

### File Upload Strategy

For images/videos:
1. Frontend uploads file to backend
2. Backend uses Multer to save temporarily in /uploads folder
3. Then uploads to Cloudinary 
4. Deletes local file
5. Returns Cloudinary URL to frontend
6. Frontend saves that URL in the company branding

This way we don't store files on the server permanently.

### Database Design Philosophy

Went with MongoDB because:
- Company sections can vary (some companies want 3 sections, others want 10)
- Job fields might expand later
- No complex relationships needed
- Easy to add new fields without migrations

## Database Schema

### User Collection
```
{
  email: string (unique, required),
  password: string (hashed with bcrypt),
  companySlug: string (links to company),
  role: string (recruiter or admin),
  isActive: boolean,
  timestamps: createdAt, updatedAt
}
```

### Company Collection
```
{
  companySlug: string (unique, like "tech-corp"),
  companyName: string,
  branding: {
    primaryColor: string (hex color),
    secondaryColor: string,
    logo: string (cloudinary URL),
    bannerImage: string (cloudinary URL),
    cultureVideo: string (youtube/vimeo URL)
  },
  sections: [
    {
      id: string,
      type: string (about/life/values/benefits/custom),
      title: string,
      content: string (long text),
      order: number,
      isVisible: boolean
    }
  ],
  seo: {
    metaTitle: string,
    metaDescription: string,
    keywords: [strings]
  },
  isPublished: boolean (if false, public can't see it),
  createdBy: userId,
  timestamps
}
```

### Job Collection
```
{
  companySlug: string,
  jobTitle: string,
  location: string,
  jobType: string (Full-time/Part-time/Contract/etc),
  department: string,
  description: string (long text),
  requirements: string (long text),
  salary: {
    min: number,
    max: number,
    currency: string
  },
  experienceLevel: string,
  isActive: boolean,
  postedDate: date,
  expiryDate: date (optional),
  timestamps
}
```

### Indexes Added
- Company: companySlug (for fast lookup)
- Job: companySlug + isActive (for filtering jobs)
- Job: text index on jobTitle and description (for search)

## API Design

### Authentication Endpoints
```
POST /api/auth/register
  - Creates user + company in one go
  - Returns JWT token
  
POST /api/auth/login
  - Checks email/password
  - Returns JWT token
  
GET /api/auth/me
  - Gets current user (needs JWT)
```

### Company Endpoints
```
GET /api/companies/:slug
  - Public endpoint, anyone can view
  - Only returns if isPublished = true
  
GET /api/companies/:slug/preview
  - Private, shows even if unpublished
  - For recruiter to preview
  
PUT /api/companies/:slug
  - Updates company branding/info
  - Need to be logged in + own the company
  
PUT /api/companies/:slug/sections
  - Updates all sections at once
  - Need auth
  
PUT /api/companies/:slug/publish
  - Toggles published status
  - Need auth
```

### Jobs Endpoints
```
GET /api/jobs/:companySlug
  - Public, gets active jobs
  - Supports query params: ?location=NYC&jobType=Full-time&search=engineer
  
GET /api/jobs/:companySlug/filters/options
  - Returns available locations and job types for filters
  
POST /api/jobs/:companySlug
  - Creates new job
  - Need auth
  
PUT /api/jobs/:companySlug/:jobId
  - Updates job
  - Need auth
  
DELETE /api/jobs/:companySlug/:jobId
  - Deletes job
  - Need auth
  
```

### Upload Endpoints
```
POST /api/upload/logo
  - Uploads logo file
  - Returns Cloudinary URL
  
 
POST /api/upload/video
  - Just saves video URL (no file upload)
```

## Security 

1. Passwords are hashed with bcrypt (salt rounds = 10)
2. JWT tokens expire after 30 days
3. Protected routes check if token is valid
4. Users can only edit their own company (checked via companySlug)
5. File uploads limited to 10MB
6. CORS configured to allow frontend domain
7. Input validation on all forms (frontend + backend)


## Scalability Thoughts

If this goes bigger, I would:

1. Add Redis for caching frequently accessed careers pages
2. Implement pagination for jobs (currently loading all at once)
3. Add CDN for static assets
4. Use environment-specific configs better
5. Implement rate limiting on API endpoints
6. Add analytics tracking
7. Multi-user support per company with roles
8. Email notifications for new applicants
9. Admin dashboard to see all companies

## Known Limitations

1. No email verification (just username/password)
2. No forgot password feature
3. Can't actually apply to jobs (just shows jobs, no application form)
4. One recruiter per company only
5. Video must be YouTube/Vimeo URL (can't upload video files directly)
6. No rich text editor for job descriptions (just plain textarea)


## What I Learned

1. Zustand is really nice compared to Redux, way less boilerplate
2. Cloudinary is great for handling images without setting up storage
3. MongoDB's flexible schema is helpful for this use case
4. React Router v6 has some changes from v5 that took time to adjust
5. Tailwind is fast once you know the classes
6. Railway deployment is pretty smooth
7. JWT token management needs careful handling on frontend
8. File uploads are tricky (had to debug multer + cloudinary integration)

## Future Improvements I'd Make

1. Add rich text editor (like TinyMCE or Quill)
2. Drag and drop for sections reordering
3. Email notifications system
4. Application tracking system
5. Analytics dashboard
6. Team member invites
7. Custom domain support
8. A/B testing for careers pages
9. Candidate database
10. Interview scheduling

---

