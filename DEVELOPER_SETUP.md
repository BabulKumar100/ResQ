## ResQMap Team Development Guide

### Project Setup

**Prerequisites:**
- Node.js 18+ or higher
- pnpm (recommended) or npm
- Git installed
- Supabase account (free tier works)

**Initial Setup:**
```bash
# Clone and install
git clone https://github.com/pawan00207/Disaster-Resque.git
cd Disaster-Resque
pnpm install

# Setup environment variables
cp .env.example .env.local

# Add to .env.local:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

# Start development
pnpm dev
# Visit http://localhost:3000
```

### Code Organization

**Directory Structure:**
```
/app                 - Next.js pages & routes
  /api              - API endpoints
  /map              - Map page
  /sos              - SOS emergency page
  /resources        - Resources directory page
  /admin            - Admin dashboard
  /contact          - Contact page
  
/components         - Reusable React components
  Navigation.tsx    - Main navigation
  ResQMap.tsx       - Map component
  FloatingSOS.tsx   - SOS button
  
/lib                - Utility functions
  supabase.ts       - Database client
  auth-utils.ts     - Authentication helpers
  i18n.ts           - Translations
  
/public             - Static assets
  manifest.json     - PWA configuration
  service-worker.js - Service worker
  
/i18n               - Language translations
  en.json          - English
  hi.json          - Hindi
```

### Development Workflow

**1. Pick an Issue**
```bash
# Assign yourself to an issue in GitHub
# Examples:
# - Issue #1: Build Real-Time Dashboard
# - Issue #2: Advanced Search System
# - Issue #3: Emergency Training Module
```

**2. Create Feature Branch**
```bash
git checkout -b feature/issue-#-short-description
# Example:
git checkout -b feature/issue-1-realtime-dashboard
```

**3. Development Checklist**
```
Before pushing:
☐ Feature is complete and tested
☐ No console.log("[v0]") statements remain
☐ Mobile responsive (test with DevTools)
☐ Dark mode works (toggle in Navigation)
☐ Accessibility tested (Tab navigation, screen reader)
☐ Code follows existing patterns
☐ No TypeScript errors: pnpm run type-check
☐ Builds successfully: pnpm run build
```

**4. Create Pull Request**
```bash
git push origin feature/issue-#-description
# Create PR with:
- Issue reference: "Fixes #1"
- Description of changes
- Screenshots/GIF if UI change
- Testing notes
```

### Component Development Patterns

**Pattern 1: Interactive Component with State**
```typescript
'use client'
import { useState } from 'react'

export function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        Toggle
      </button>
      {isOpen && <Content />}
    </div>
  )
}
```

**Pattern 2: Component with API Data**
```typescript
'use client'
import { useEffect, useState } from 'react'

export function DataComponent() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetch('/api/endpoint')
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
  }, [])
  
  if (loading) return <div>Loading...</div>
  return <div>{/* render data */}</div>
}
```

**Pattern 3: Form with Validation**
```typescript
'use client'
import { useState } from 'react'

export function FormComponent() {
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate
    if (!formData.email) {
      setErrors({ email: 'Required' })
      return
    }
    
    // Submit
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(formData)
    })
    
    if (response.ok) {
      // Success feedback
    }
  }
  
  return <form onSubmit={handleSubmit}>{/* fields */}</form>
}
```

### Styling Guidelines

**Use Tailwind Classes (No Custom CSS unless necessary):**
```tsx
// GOOD - Use existing Tailwind classes
<div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition">

// AVOID - Custom styles
<div style={{ background: 'white', borderRadius: '8px', ... }}>
```

**Color System:**
```
Primary: red-500, red-600 (Emergency/Alert)
Success: green-500 (Safe/Available)
Warning: orange-500 (Caution/Busy)
Info: blue-500 (Information)
Background: gray-50, gray-100
Text: gray-900, gray-600
```

**Responsive Design (Mobile First):**
```tsx
// Base = mobile, md: = 768px+, lg: = 1024px+
<div className="p-4 md:p-6 lg:p-8">
  <h1 className="text-2xl md:text-3xl lg:text-4xl">
    Title
  </h1>
</div>
```

### API Development

**Creating New API Endpoint:**
```typescript
// /app/api/myfeature/route.ts
import { getSupabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = getSupabase()
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    )
  }
  
  try {
    const { data, error } = await supabase
      .from('table_name')
      .select('*')
      .limit(10)
    
    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const supabase = getSupabase()
  if (!supabase) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }
  
  try {
    const body = await request.json()
    
    // Validate input
    if (!body.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }
    
    // Create record
    const { data, error } = await supabase
      .from('table_name')
      .insert([body])
      .select()
    
    if (error) throw error
    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create' },
      { status: 500 }
    )
  }
}
```

### Database (Supabase) 

**Creating New Table:**
```sql
-- In Supabase SQL Editor
CREATE TABLE my_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add Row Level Security
ALTER TABLE my_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see their own data"
ON my_table
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own data"
ON my_table
FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

### Testing Locally

**Browser DevTools:**
```
1. Open Chrome/Firefox DevTools (F12)
2. Device toggle (Ctrl+Shift+M) for mobile testing
3. Dark mode toggle in Navigation component
4. Console for debugging (check for errors)
5. Network tab to see API calls
```

**Manual Testing Checklist:**
```
Mobile (375px width):
☐ Navigation menu works
☐ Text readable without zoom
☐ Buttons tappable (min 44px)
☐ Forms functional

Desktop (1920px width):
☐ Layout looks balanced
☐ No horizontal scroll
☐ Grid aligns properly

Accessibility:
☐ Tab through all elements
☐ Focus visible
☐ Screen reader compatible (use NVDA/JAWS)
☐ Color contrast OK (WCAG AA)

Dark Mode:
☐ All text readable
☐ Images visible
☐ No pure black backgrounds
```

### Debugging Tips

**Enable Debug Logging:**
```typescript
// During development, use:
console.log("[v0] Debug info:", variable)

// REMOVE before committing:
// - Use Cmd+Shift+F in VS Code to find all "[v0]"
// - Delete debug lines
```

**Check TypeScript Errors:**
```bash
pnpm run type-check
```

**View Build Output:**
```bash
pnpm run build
# Check terminal for any warnings/errors
```

### Common Issues & Solutions

**Issue: "Map container is already initialized"**
- Solution: Component is re-rendering. Check for duplicate MapContainer usage.
- File: `/components/ResQMap.tsx` - already has fix with memo()

**Issue: "Supabase client not initialized"**
- Solution: Check .env.local has correct URL and KEY
- Verify: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` exist

**Issue: Dark mode not working**
- Solution: Wrap in `<Providers>` component
- File: `/app/layout.tsx` already configured

**Issue: Slow page load**
- Solution: Check network tab for slow API calls
- Optimize: Use SWR for data fetching, implement pagination

### Performance Guidelines

**Do:**
- Use `memo()` for components that don't need re-renders
- Lazy load images with `next/image`
- Use pagination for large datasets
- Debounce search inputs

**Don't:**
- Fetch data inside render (use useEffect)
- Create arrays/objects inside render (move outside)
- Inline functions in JSX (move outside component)
- Call console.log in production code

### Security Notes

**Never:**
- Hardcode API keys (use .env.local)
- Expose user personal data
- Trust client-side validation alone
- Store sensitive data in localStorage

**Always:**
- Use parameterized queries (Supabase does this)
- Validate inputs server-side
- Use HTTPS (Vercel enforces this)
- Check user permissions in API routes

### Resources

**Documentation:**
- Next.js: https://nextjs.org/docs
- React: https://react.dev
- Tailwind: https://tailwindcss.com/docs
- Supabase: https://supabase.com/docs
- Lucide Icons: https://lucide.dev/icons

**Existing Examples in Project:**
- Component patterns: `/components/ResQMap.tsx`
- API patterns: `/app/api/emergency-services/route.ts`
- Form patterns: `/components/ReportForm.tsx`
- Page patterns: `/app/map/page.tsx`

### Questions?

1. Check `/GITHUB_ISSUES.md` for issue details
2. Review existing components for patterns
3. Check `/app/api` for API endpoint examples
4. Ask in pull request comments
5. Contact Pawan Singh (founder)
