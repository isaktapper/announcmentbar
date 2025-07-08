# SaaS App

A modern SaaS application built with Next.js 15, TypeScript, Tailwind CSS, and Supabase authentication.

## Features

- ⚡ **Next.js 15** with App Router
- 🔷 **TypeScript** for type safety
- 🎨 **Tailwind CSS** for styling
- 🔐 **Supabase Authentication** with email/password
- 📱 **Responsive Design** ready
- 🏗️ **SaaS Architecture** with proper folder structure

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm
- A Supabase account

### Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Supabase:**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL, anon key, and service role key
   - Update `.env.local` with your Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
     ```
   - **Create the announcements table** in your Supabase project:
     ```sql
     CREATE TABLE announcements (
       id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
       user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
       title TEXT NOT NULL,
       message TEXT NOT NULL,
       icon TEXT DEFAULT 'info',
       background TEXT NOT NULL DEFAULT '#3B82F6',
       background_gradient TEXT,
       text_color TEXT NOT NULL DEFAULT '#FFFFFF',
       visibility BOOLEAN NOT NULL DEFAULT true,
       is_sticky BOOLEAN NOT NULL DEFAULT true,
       title_font_size INTEGER NOT NULL DEFAULT 16,
       message_font_size INTEGER NOT NULL DEFAULT 14,
       title_url TEXT,
       message_url TEXT,
       text_alignment TEXT NOT NULL DEFAULT 'center',
       icon_alignment TEXT NOT NULL DEFAULT 'left',
       is_closable BOOLEAN NOT NULL DEFAULT false,
       slug TEXT NOT NULL UNIQUE,
       created_at TIMESTAMPTZ DEFAULT now()
     );
     
     -- Enable Row Level Security
     ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
     
     -- Policy to allow users to see only their own announcements
     CREATE POLICY "Users can view their own announcements" ON announcements
       FOR SELECT USING (auth.uid() = user_id);
     
     -- Policy to allow users to insert their own announcements
     CREATE POLICY "Users can insert their own announcements" ON announcements
       FOR INSERT WITH CHECK (auth.uid() = user_id);
     
     -- Policy to allow users to update their own announcements
     CREATE POLICY "Users can update their own announcements" ON announcements
       FOR UPDATE USING (auth.uid() = user_id);
     
     -- Policy to allow users to delete their own announcements
     CREATE POLICY "Users can delete their own announcements" ON announcements
       FOR DELETE USING (auth.uid() = user_id);
     ```
   - **Note**: The service role key is required for email duplicate checking
   - **Important**: Replace placeholder values with real Supabase credentials before testing

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)** to see your app.

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable components
│   ├── auth/           # Authentication components
│   └── ui/             # UI components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
│   ├── supabase.ts     # Supabase client (legacy)
│   ├── supabase-client.ts  # Browser client
│   ├── supabase-server.ts  # Server client
│   └── auth.ts         # Authentication utilities
└── types/              # TypeScript type definitions
```

## Troubleshooting

### Signup Issues

If you encounter problems during user signup, here are common issues and solutions:

#### 1. **500 Server Error During Signup**

**Symptoms:**
- Users see "Database error saving new user" message
- Supabase returns 500 status on signup requests
- Console shows trigger-related errors

**Solutions:**
1. **Check Profiles Table Setup:** Ensure the profiles table and trigger are properly created:
   ```bash
   # Run this in your Supabase SQL editor:
   ```
   ```sql
   -- Copy and paste the contents of create_profiles_table.sql
   ```

2. **Check RLS Policies:** Verify Row Level Security policies allow profile insertion:
   ```sql
   -- In Supabase SQL editor, verify this policy exists:
   SELECT * FROM pg_policies WHERE tablename = 'profiles';
   ```

3. **Test Trigger Function:** Manually test the trigger function:
   ```sql
   -- In Supabase SQL editor:
   SELECT handle_new_user();
   ```

#### 2. **Email Check API Failures**

**Symptoms:**
- "Failed to verify email" errors
- API route returns 500 errors
- Missing environment variables warnings

**Solutions:**
1. **Add Service Role Key:** In your environment variables, add:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

2. **Fallback Method:** The app includes a fallback email check method that works without service role key

#### 3. **Users Not Redirected to /verify**

**Symptoms:**
- Signup succeeds but user stays on signup page
- No redirect to verification page
- User created but session exists immediately

**Solutions:**
1. **Check Email Confirmation Settings:** In Supabase Dashboard → Authentication → Settings:
   - Ensure "Enable email confirmations" is enabled for verification flow
   - Or disable it if you want immediate login

2. **Check Browser Console:** Look for redirect logs:
   ```js
   // Should see: "User created, redirecting to verify page"
   ```

#### 4. **Environment Variables**

**Required Variables:**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (optional, for email checking)
```

**Check Variables:** The app will log environment variable issues in the browser console.

#### 5. **Database Trigger Debugging**

If the profiles trigger is causing issues:

1. **Check Trigger Status:**
   ```sql
   SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';
   ```

2. **View Trigger Logs:**
   ```sql
   -- Check for warnings in your Supabase logs
   ```

3. **Manual Profile Creation:**
   ```sql
   -- Create a profile manually to test:
   INSERT INTO profiles (id, plan) VALUES ('user-uuid-here', 'free');
   ```

#### 6. **Network Issues**

**Symptoms:**
- Multiple "Failed to fetch" errors in console
- Datadog/analytics errors
- Service worker errors

**Solutions:**
- These are typically browser extension or analytics issues and don't affect signup
- Check Network tab in DevTools for actual API failures
- Focus on Supabase-related errors (auth/signup endpoints)

## Authentication

The app comes with a complete authentication setup:

- **Email/password authentication** via Supabase
- **Session management** with automatic refresh
- **Auth context** for state sharing
- **Custom hooks** for easy auth integration
- **Middleware** for session handling

### Usage Examples

```typescript
// In a client component
import { useAuthContext } from '@/components/auth/AuthProvider'

function MyComponent() {
  const { user, loading } = useAuthContext()
  
  if (loading) return <div>Loading...</div>
  if (!user) return <div>Please log in</div>
  
  return <div>Welcome, {user.email}!</div>
}
```

```typescript
// Authentication functions
import { auth } from '@/lib/auth'

// Sign up
const { data, error } = await auth.signUp({
  email: 'user@example.com',
  password: 'password'
})

// Sign in
const { data, error } = await auth.signIn({
  email: 'user@example.com', 
  password: 'password'
})

// Sign out
const { error } = await auth.signOut()
```

## Authentication Pages

The app includes a complete authentication system with the following pages:

### 📝 `/auth/signup` - User Registration
- **Fields**: First name, last name, company, email, password, confirm password
- **Features**: 
  - Password visibility toggle
  - Remember me checkbox
  - Form validation (all fields required, passwords match, password ≥ 8 chars)
  - **Server-side email duplicate checking** with immediate feedback
  - User metadata storage (first_name, last_name, company)
- **Flow**: 
  - Pre-check email existence → If exists, show "Email already registered" error
  - If email available → Proceed with signup
  - If session created → Redirect to `/dashboard`
  - If verification needed → Redirect to `/auth/verify`

### 🔑 `/auth/login` - User Sign In
- **Fields**: Email, password
- **Features**: 
  - Password visibility toggle
  - Remember me checkbox
  - Friendly error messages
- **Flow**: 
  - Success → Redirect to `/dashboard`
  - Failure → Show error message

### 📧 `/auth/verify` - Email Verification
- **Purpose**: Static page shown after signup
- **Content**: Instructions to check email for verification link
- **Links**: Back to login for verified users

### 🏠 `/dashboard` - Announcement Management
- **Protection**: Server-side authentication check using `createServerSupabaseClient()`
- **Features**: 
  - **📊 Dashboard Overview**: Stats showing total, active, and hidden announcements
  - **➕ Create Announcements**: Link to dedicated `/dashboard/create` page with modern form
  - **✏️ Inline Editing**: Edit announcements directly in cards with real-time preview
  - **👁️ Visibility Toggle**: One-click show/hide announcements
  - **📋 Copy Embed Code**: Get embed script for each announcement: `<script src="https://announcement.bar/embed/{slug}.js" defer></script>`
  - **🗑️ Delete Announcements**: With confirmation dialog
  - **🔔 Toast Notifications**: Success/error feedback for all actions
  - **🎨 Color Picker**: Custom background and text colors
  - **🔒 User Isolation**: Users only see their own announcements (RLS policies)
- **Flow**: No session → Redirect to `/auth/login`

### 🎨 `/dashboard/create` - Modern Announcement Builder
- **Protection**: Client-side authentication check with redirect
- **Design**: Beautiful, minimal SaaS-style UI inspired by Vercel/Notion/Linear
- **Features**:
  - **📝 Enhanced Form Fields**: Title, message, icon selector, background/gradient, text color
  - **🎯 Template System**: Pre-built templates (Alert, Maintenance, Promo) with one-click setup
  - **🎨 Icon Library**: 5 Lucide React icons (warning, alert, info, success, schedule)
  - **🌈 Gradient Support**: Toggle between solid colors and beautiful gradients
  - **👀 Live Preview**: Real-time mock website showing exactly how announcement will appear
  - **📱 Responsive Design**: Perfect on mobile and desktop
  - **⚡ Smart UX**: Auto-generated slugs, template prefill, real-time updates
- **Templates**:
  - **Alert**: Red background, alert icon, system issue messaging
  - **Planned Maintenance**: Orange background, schedule icon, maintenance messaging  
  - **Promo**: Green gradient, success icon, promotional messaging
- **Flow**: Create → Auto-redirect to dashboard with success toast

## Middleware Authentication

The app uses Supabase middleware following the official guide:

- **Session Management**: Automatic session refresh
- **Route Protection**: 
  - `/dashboard/*` → Requires authentication
  - `/auth/login`, `/auth/signup` → Redirects if already authenticated
- **Cookie Handling**: Proper cookie management for SSR

## Announcement Dashboard

The app includes a comprehensive announcement management system:

### 📋 Features

- **Create Announcements**: Modern, dedicated page with SaaS-style UI and live preview
- **Template System**: Pre-built templates (Alert, Maintenance, Promo) for quick setup
- **Icon Library**: Professional icons from Lucide React (warning, alert, info, success, schedule)
- **Gradient Backgrounds**: Beautiful gradients or solid colors with visual color pickers
- **Edit Inline**: Click edit to modify announcements directly in cards
- **Visibility Control**: Toggle announcements on/off with visual indicators
- **Copy Embed Code**: Get ready-to-use JavaScript embed snippets
- **Delete with Confirmation**: Safe deletion with "Are you sure?" prompts
- **Toast Notifications**: Real-time feedback for all operations
- **Live Preview**: See exactly how announcements will appear on websites
- **Responsive Design**: Works perfectly on mobile and desktop
- **Real-time Updates**: See changes instantly as you type

### 🗃️ Data Model

```typescript
interface Announcement {
  id: string              // UUID primary key
  user_id: string         // User who owns this announcement
  title: string          // Display title
  message: string        // Announcement text
  icon: string           // Icon type (warning, alert, info, success, schedule)
  background: string     // Hex color (e.g., "#3B82F6")
  background_gradient?: string // Optional gradient end color for gradients
  text_color: string     // Hex color (e.g., "#FFFFFF")
  visibility: boolean    // Whether announcement is active
  slug: string          // Unique identifier for embed (e.g., "abc123")
  created_at: string    // ISO timestamp
}
```

### 🔗 Embed System

Each announcement gets a unique embed code:
```html
<script src="https://announcement.bar/embed/{slug}.js" defer></script>
```

Users can copy this code and paste it into any website to display their announcements.

### 🔒 Security

- **Row Level Security**: Users can only access their own announcements
- **Server-side Auth**: All operations protected by Supabase authentication
- **Input Validation**: Client and server-side validation for all forms
- **Sanitized Data**: All user inputs properly escaped and validated

## Next Steps

Your complete announcement system is ready! You can:

1. ✅ Sign up new users with metadata
2. ✅ Sign in existing users  
3. ✅ Protect routes with authentication
4. ✅ Handle email verification
5. ✅ Create and manage announcements
6. ✅ Toggle visibility and copy embed codes
7. ✅ Edit and delete announcements safely
8. Build the embed script delivery system
9. Add analytics and tracking
10. Customize themes and branding

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

# Announcement Bar System

A modern, embeddable announcement bar system built with Next.js and Supabase.

## 🔧 Handling Sticky Headers

If your website has a sticky header, you may need to adjust its positioning to work with the announcement bar:

### Option 1: Use CSS Custom Property (Automatic)

The embed script automatically sets a CSS custom property `--announcement-bar-height` that you can use:

```css
/* Your sticky header */
.sticky-header {
  position: sticky;
  top: var(--announcement-bar-height, 0px); /* Falls back to 0px if no announcement */
  z-index: 50; /* Make sure it's below the announcement bar (z-index: 999999) */
}
```

### Option 2: Manual CSS Adjustment

If you know your announcement bar height, you can manually adjust:

```css
/* If announcement bar is ~50px high */
.sticky-header {
  position: sticky;
  top: 50px;
  z-index: 50;
}
```

### Option 3: JavaScript Detection

For dynamic adjustment:

```javascript
// Wait for announcement bar to load
setTimeout(() => {
  const announcementHeight = getComputedStyle(document.documentElement).getPropertyValue('--announcement-bar-height');
  if (announcementHeight) {
    document.querySelector('.your-header').style.top = announcementHeight;
  }
}, 1000);
```

### Option 4: Tailwind CSS Classes

For Tailwind users:

```html
<!-- Use top-[var(--announcement-bar-height)] when supported, or top-12 as fallback -->
<header class="sticky top-12 lg:top-[var(--announcement-bar-height)] z-50">
  Your header content
</header>
```

## 🚨 Common Issues

**Issue**: Announcement bar overlaps sticky header
**Solution**: Use one of the methods above to push your header down

**Issue**: Content appears behind announcement bar
**Solution**: The embed script automatically adds margin-top to body. If this doesn't work, manually add margin or padding to your main content area.
