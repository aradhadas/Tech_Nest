# Supabase Implementation Steps

After you complete the Supabase setup (Phases 1-3 from SUPABASE_SETUP_GUIDE.md), follow these steps to integrate it into your app:

## Step 1: Install Dependencies

```bash
npm install @supabase/supabase-js
npm install -D tsx  # For running migration script
```

## Step 2: Create Environment File

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. Make sure `.env.local` is in `.gitignore` (it should be already)

## Step 3: Update .gitignore

Add these lines to `.gitignore` if not already present:
```
.env.local
.env*.local
```

## Step 4: Run Migration Script

This will upload all product images and seed the database:

```bash
npx tsx scripts/migrate-to-supabase.ts
```

Expected output:
```
📤 Uploading product images to Supabase Storage...
  ✅ led-1.jpg
  ✅ led-2.jpg
  ... (14 images total)

🌱 Seeding products to Supabase Database...
  ✅ LED Flasher Circuit Kit
  ✅ Automatic Night Light (LDR)
  ... (40 products total)

✅ Migration completed successfully!
```

## Step 5: Replace AuthContext

Rename the old auth context and activate the new one:

```bash
# Backup old auth
mv src/contexts/AuthContext.tsx src/contexts/AuthContext.old.tsx

# Activate Supabase auth
mv src/contexts/AuthContext.supabase.tsx src/contexts/AuthContext.tsx
```

## Step 6: Update Customer Home Page

Replace the hardcoded data imports with hooks. I'll update this file for you.

## Step 7: Update Product Card

Update image references to use `image_url` instead of `image`.

## Step 8: Test the Application

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Test these features:
   - [ ] Products load from Supabase
   - [ ] Product images display correctly
   - [ ] Categories filter works
   - [ ] User registration works
   - [ ] User login works
   - [ ] Cart functionality works

## Step 9: Update Other Pages (Optional)

After confirming the home page works, update:
- Admin pages to use Supabase hooks
- Vendor pages to use Supabase hooks
- Order management to save to Supabase

## Rollback Plan

If something goes wrong, you can rollback:

```bash
# Restore old auth
mv src/contexts/AuthContext.old.tsx src/contexts/AuthContext.tsx

# Remove Supabase client
rm src/lib/supabase.ts

# Uninstall package
npm uninstall @supabase/supabase-js
```

## Troubleshooting

### Images not loading?
- Check Storage bucket is public
- Verify images uploaded successfully
- Check browser console for CORS errors

### Authentication not working?
- Verify environment variables are set correctly
- Check Supabase Auth settings (email confirmation might be required)
- Look at browser console for errors

### Products not loading?
- Check RLS policies are set correctly
- Verify products were seeded successfully
- Check browser network tab for API errors

---

**Ready to proceed?** Let me know when you've:
1. Created your Supabase project
2. Run the SQL scripts from SUPABASE_SETUP_GUIDE.md
3. Created the storage bucket
4. Created `.env.local` with your credentials

Then I'll help you run the migration and update the remaining files!
