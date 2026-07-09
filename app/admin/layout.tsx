import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'

// export default async function AdminLayout({ children }: { children: React.ReactNode }) {
//   const supabase = createServerSupabaseClient()
//   const { data: { session } } = await supabase.auth.getSession()

//   if (!session) {
//     redirect('/login')
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <AdminSidebar />
//       <main className="flex-1 overflow-auto">
//         {children}
//       </main>
//     </div>
//   )
// }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}