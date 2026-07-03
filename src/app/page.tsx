export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Restaurant Management System
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12">
            Complete Front Office & Back Office Solution for Modern Restaurants
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <a
              href="/admin"
              className="group bg-white rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <div className="text-6xl mb-4">🏢</div>
              <h2 className="text-2xl font-bold mb-2 text-gray-900">Back Office</h2>
              <p className="text-gray-600">
                Manage menus, orders, tables, staff, and analytics
              </p>
              <div className="mt-4 text-black font-semibold group-hover:underline">
                Access Admin Panel →
              </div>
            </a>

            <div className="group bg-white rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="text-6xl mb-4">📱</div>
              <h2 className="text-2xl font-bold mb-2 text-gray-900">Front Office</h2>
              <p className="text-gray-600">
                Scan QR code at your table to start ordering
              </p>
              <div className="mt-4 text-gray-500">
                Available via QR code scan
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-left">
            <h3 className="text-2xl font-bold text-white mb-4">Key Features</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <h4 className="font-semibold text-white">QR Code Access</h4>
                  <p className="text-gray-300 text-sm">No app download required</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <h4 className="font-semibold text-white">Multi-Language</h4>
                  <p className="text-gray-300 text-sm">6+ languages supported</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <h4 className="font-semibold text-white">Geolocation</h4>
                  <p className="text-gray-300 text-sm">Track orders in large venues</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <h4 className="font-semibold text-white">Split Bills</h4>
                  <p className="text-gray-300 text-sm">Multiple payment options</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <h4 className="font-semibold text-white">Menu Schedules</h4>
                  <p className="text-gray-300 text-sm">Time-based menu availability</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <h4 className="font-semibold text-white">Online Payments</h4>
                  <p className="text-gray-300 text-sm">Secure payment processing</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <h4 className="font-semibold text-white">Customer Ratings</h4>
                  <p className="text-gray-300 text-sm">Collect feedback & reviews</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <h4 className="font-semibold text-white">Real-time Updates</h4>
                  <p className="text-gray-300 text-sm">Live order status tracking</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-gray-400">
            <p>Built with Next.js, PostgreSQL, Drizzle ORM, and Tailwind CSS</p>
          </div>
        </div>
      </div>
    </div>
  );
}
