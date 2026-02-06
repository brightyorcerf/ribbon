export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-6xl font-display text-sanrio-red mb-4 shadow-hard-chocolate bg-white px-8 py-4 rounded-chunky border-4 border-chocolate">
        Ribbon 🎀
      </h1>
      <p className="text-xl font-mono text-chocolate/80">
        Where digital crushes become real confessions
      </p>
      
      {/* Test our theme colors */}
      <div className="flex gap-4 mt-8">
        <div className="w-20 h-20 bg-sanrio-red rounded-chunky shadow-hard" />
        <div className="w-20 h-20 bg-sanrio-pink rounded-chunky shadow-hard" />
        <div className="w-20 h-20 bg-sanrio-lavender rounded-chunky shadow-hard" />
      </div>
    </div>
  );
}