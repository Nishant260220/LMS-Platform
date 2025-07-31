# LMS Platform

This is a Learning Management System (LMS) built using Next.js. The project aims to provide a complete platform for online learning.

## Description

The LMS allows instructors to upload and manage video-based courses. Students (users) can browse these courses, enroll in them, and track their progress. The platform supports role-based access, authentication, and will later include payment integration.

## Current Progress

- Setup with Next.js (App Router)
- Guest layout with sidebar navigation
- Mobile responsive navbar with toggle sidebar
- Authentication using NextAuth.js
- UI components built using Shadcn UI
- Lucide icons for sidebar menu
- Create Course page with title input
- Form validation using React Hook Form, Shadcn and Zod
- Toast notifications using React Hot Toast
- Prisma ORM configured with PostgreSQL and models: Course, Category, Attachment

## Technologies Used

### Common:
- TypeScript
- zod

### Frontend:
- Next.js (App Router)
- React
- Tailwind CSS
- Shadcn UI
- Lucide Icons
- React Hook Form (for form state handling)
- Zod (for form validation)
- React Hot Toast (for user notifications)

### Backend:
- NextAuth.js (Authentication)
- Prisma ORM
- PostgreSQL
- Stripe (Payment integration)
- UploadThing or Cloudinary (Video upload)

## Planned Features

- Instructor dashboard for course creation
- Upload videos and create chapters
- Admin dashboard for managing users and content
- Stripe integration for purchasing courses
- Student dashboard with course progress tracking
