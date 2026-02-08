Ribbon

Create a link. Send it. Watch them say yes.

![image1.jpg]

The Design Philosophy: "Digital Scrapbook" (Opinionated Maximalism)

User Journey & Feature Map:

A. Generator Page
• Custom Inputs: * Recipient Name (Max 15 chars)
• Vibe Check (Select from 3 color themes: Classic Red, Soft Pink, or Cyber Lavender)
• The Icon: Instead of a raw photo upload (which breaks layouts), let them upload an image that gets automatically masked into a circle with a thick borde
• The Link Engine: On "Generate," the site creates a unique ID and copies a URL to the clipboard.

B. Landing Page (The Ask)   


Backend System Design (Robust & Lean): 
• Database: Supabase (PostgreSQL) or Firebase.
• Schema: * id: UUID
• recipient_name: String
• image_url: String (Store images in Supabase Storage/S3)
• theme_id: Integer
• slug: ShortID (for the URL: site.com/be-mine/xyz123)
• Storage: Use a simple signed URL for the uploaded icon. To keep it light, resize images on the client side before upload to 400 \times 400px to save bandwidth.

![image2.jpg]
 
Technical Stack
• Frontend: Next.js (for SEO and fast routing).
• Animations: GSAP (for the "No" button logic and entrance staggers).
• 3D Elements: Three.js (used strictly for the background—a "floating world" of 3D objects that react to scroll).
• Styling: Tailwind CSS (with a custom configuration for those hard-shadows and specific Sanrio hex codes). 