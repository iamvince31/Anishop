# AniVerse Collectibles - System Documentation

## Overview
AniVerse Collectibles is a modern e-commerce web application for selling anime-themed merchandise including figurines, custom shoes, and cosplay costumes. Built with React and powered by Supabase (PostgreSQL) backend.

## Tech Stack

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.3.1
- **Routing**: React Router DOM 7.13.0
- **Styling**: Tailwind CSS 4.1.18
- **Language**: JavaScript (ES6+)

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **API**: Supabase Client (@supabase/supabase-js 2.95.3)

### Development Tools
- ESLint for code linting
- Autoprefixer for CSS compatibility
- PostCSS for CSS processing

## Project Structure

```
aniverse.github.io/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx           # Navigation bar with auth state
│   │   ├── Footer.jsx           # Site footer
│   │   └── ProtectedRoute.jsx   # Route guard for admin pages
│   ├── pages/
│   │   ├── Home.jsx             # Landing page
│   │   ├── Products.jsx         # Category listing page
│   │   ├── CategoryPage.jsx     # Products by category
│   │   ├── Contact.jsx          # Contact form
│   │   ├── Login.jsx            # User login
│   │   ├── Register.jsx         # User registration
│   │   ├── AdminPanel.jsx       # Admin dashboard
│   │   ├── AddCategory.jsx      # Create/edit categories
│   │   └── AddProduct.jsx       # Create/edit products
│   ├── lib/
│   │   └── supabase.js          # Supabase client configuration
│   ├── styles/
│   │   └── App.css              # Global styles
│   ├── App.jsx                  # Main app component with routing
│   ├── main.jsx                 # React entry point
│   └── index.css                # Tailwind imports
├── public/                      # Static assets
├── .legacy/                     # Legacy HTML files and images
│   ├── image/                   # Product images
│   └── supabase_schema.sql      # Initial database schema
├── package.json                 # Dependencies and scripts
├── vite.config.js              # Vite configuration
└── eslint.config.js            # ESLint configuration
```

## Database Schema

### Tables

#### 1. `products`
Stores product information for all merchandise.

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,        -- References categories.slug
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. `categories`
Stores product categories (figurines, shoes, cosplay, etc.).

```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,     -- URL-friendly identifier
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. `profiles`
User profile information linked to Supabase Auth.

```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    role TEXT DEFAULT 'user',      -- 'user' or 'admin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 4. `contact_submissions`
Stores contact form submissions.

```sql
CREATE TABLE contact_submissions (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Security - Row Level Security (RLS) Policies

### Products Table
- **Public Read**: Anyone can view products
- **Admin Write**: Only admin users can insert, update, delete products

### Categories Table
- **Public Read**: Anyone can view categories
- **Admin Write**: Only admin users can manage categories

### Profiles Table
- **User Read/Update**: Users can view and update their own profile
- **Service Role**: Service role can manage all profiles

### Contact Submissions Table
- **Public Insert**: Anyone can submit contact forms (with validation)
- **Admin Read**: Only authenticated users can read submissions

## Authentication & Authorization

### User Roles
1. **Anonymous (anon)**: Can browse products and categories, submit contact forms
2. **Authenticated User**: Can access their profile
3. **Admin**: Full access to admin panel, can manage products and categories

### Protected Routes
The `ProtectedRoute` component guards admin-only pages:
- `/admin` - Admin dashboard
- `/add-category` - Create/edit categories
- `/add-product` - Create/edit products
- `/edit-category/:id` - Edit specific category
- `/edit-product/:id` - Edit specific product

## Key Features

### Public Features
1. **Home Page**: Hero section with call-to-action
2. **Products Page**: Browse categories with visual cards
3. **Category Page**: View products filtered by category
4. **Contact Form**: Submit inquiries with validation
5. **Authentication**: Login and registration

### Admin Features
1. **Dashboard**: View all products and categories in organized tables
2. **Product Management**: Create, edit, delete products
3. **Category Management**: Create, edit, delete categories
4. **Orphaned Products**: Identify products with invalid category references

## API Integration

### Supabase Client Configuration
```javascript
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Common Operations
- **Fetch data**: `supabase.from('table').select('*')`
- **Insert**: `supabase.from('table').insert(data)`
- **Update**: `supabase.from('table').update(data).eq('id', id)`
- **Delete**: `supabase.from('table').delete().eq('id', id)`
- **Auth**: `supabase.auth.getSession()`, `supabase.auth.signIn()`, etc.

## Routing Structure

```
/ (Home)
├── /products (Category listing)
│   └── /category/:categoryName (Products by category)
├── /contact (Contact form)
├── /login (User login)
├── /register (User registration)
└── /admin (Protected - Admin only)
    ├── /add-category (Protected)
    ├── /add-product (Protected)
    ├── /edit-category/:id (Protected)
    └── /edit-product/:id (Protected)
```

## Environment Variables

Required environment variables in `.env`:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Development Scripts

```bash
npm run dev      # Start development server (Vite)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Design System

### Colors (Tailwind)
- **Primary**: Main brand color for headers and CTAs
- **Primary Dark**: Darker variant for hover states
- **Primary Light**: Lighter variant for backgrounds
- **Accent**: Highlight color for buttons and links
- **Gray Scale**: Various shades for text and backgrounds

### Typography
- **Font Display**: Bold, italic styling for headings
- **Font Sizes**: Responsive sizing (text-4xl to text-8xl for headings)

### Components
- **Cards**: Rounded corners (rounded-2xl, rounded-3xl)
- **Shadows**: Layered shadows for depth (shadow-md, shadow-2xl)
- **Transitions**: Smooth animations (duration-300, duration-700)
- **Hover Effects**: Scale, translate, and opacity changes

## Security Best Practices Implemented

1. **RLS Policies**: All tables have row-level security enabled
2. **Role-Based Access**: Admin operations restricted by user role
3. **Input Validation**: Contact form validates email format and field lengths
4. **Password Protection**: Supabase Auth with leaked password checking
5. **Search Path Security**: Functions use fixed search_path to prevent hijacking
6. **Optimized Policies**: Auth functions wrapped in subqueries for performance

## Performance Optimizations

1. **Lazy Loading**: React Router handles code splitting
2. **Optimized Queries**: Supabase queries use specific selects
3. **RLS Performance**: Auth functions use `(SELECT auth.uid())` pattern
4. **Image Optimization**: Images served from legacy folder
5. **Vite Build**: Fast HMR and optimized production builds

## Future Enhancements

Potential areas for expansion:
- Shopping cart functionality
- Payment integration (Stripe, PayPal)
- Order management system
- Product reviews and ratings
- Wishlist feature
- Advanced search and filtering
- Email notifications
- Inventory management
- Multi-language support
- Mobile app version

## Maintenance Notes

### Database Migrations
When updating the database schema:
1. Test changes in development environment
2. Update RLS policies accordingly
3. Run migrations through Supabase dashboard
4. Update documentation

### Adding New Features
1. Create new components in `src/components/`
2. Add pages in `src/pages/`
3. Update routing in `App.jsx`
4. Add database tables/policies as needed
5. Update this documentation

## Support & Contact

For issues or questions about the system:
- Email: support@animefigshaven.com
- Facebook: [AniVerse Collectibles](https://www.facebook.com/profile.php?id=61563752905603)

---

**Last Updated**: March 4, 2026
**Version**: 0.0.0
**Maintained By**: AniVerse Collectibles Team
