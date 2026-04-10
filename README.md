# Resume Dragger Boilerplate

Welcome to the **Resume Dragger** Boilerplate! This is a generic, customizable React-based (Next.js) drag-and-drop resume builder that automatically compiles and stitches together modular LaTeX files on the fly into beautiful PDFs.

## How to Use This Boilerplate

You can easily adapt this project to build your own LaTeX resume. Here is how:

### 1. Use as a GitHub Template (Recommended)
You can clone this entire setup directly to your own GitHub account to keep your resume history safely version-controlled:
1. Click the **Use this template** button at the top right of this repository on GitHub.
2. Clone your new repository locally.
3. Edit your personal details in `src/lib/latex-parser.ts` (replace "John Doe").
4. Add your personal `.tex` blocks inside the `src/lib/data/library/` directories.
5. Run locally to drag, drop, and export your PDF:
   ```bash
   npm install
   npm run dev
   ```

### 2. One-Click Free Deployment (Vercel)
Want to edit your resume from anywhere? Deploy your own private instance of this builder to Vercel for free in under two minutes:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fniteeshkcl-create%2Fresume_dragger_public)

## Features
- **Modular Component Library**: Manage your experiences, projects, and education as separate `.tex` files.
- **Drag & Drop Reordering**: Visually reorganize the structure of your resume dynamically.
- **In-Browser Editing**: Native text-area editor allows modifying LaTeX blocks directly on the web.
- **Instant Preview**: Live native PDF preview powered by `latex-on-http`.
- **Export to `.TEX` and `.PDF`**: Instantly download your perfectly formatted code or the finalized document!
