import AdminGuard from "@/components/AdminGuard";



export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-100">
        <div className="p-4 border-b bg-white">Admin Panel</div>
        <main className="p-6">{children}</main>
      </div>
    </AdminGuard>
  );
}
