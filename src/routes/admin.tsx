import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MoreVertical,
  Download,
  Eye,
  Search,
  Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getAdminOrdersFn } from '@/services/orders.server'

export const Route = createFileRoute('/admin')({
  beforeLoad: async () => {
    // Auth check would go here
    // const { data: { session } } = await supabase.auth.getSession()
    // if (!session) throw redirect({ to: '/login' })
  },
  component: AdminDashboard,
})

function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    delivered: 0
  })

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const data = await getAdminOrdersFn()
      if (data) {
        setOrders(data)
        setStats({
          total: data.length,
          pending: data.filter((o: any) => o.status === 'pending').length,
          processing: data.filter((o: any) => o.status === 'processing').length,
          delivered: data.filter((o: any) => o.status === 'delivered').length
        })
      }
    } catch (err) {
      console.error('Failed to fetch admin orders:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered': return <Badge className="bg-success/10 text-success border-success/20">Delivered</Badge>
      case 'processing': return <Badge className="bg-gold-500/10 text-gold-600 border-gold-500/20">Processing</Badge>
      case 'pending': return <Badge className="bg-slate-100 text-slate-600 border-slate-200">Pending</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-[72px]">
      <div className="max-w-[1600px] mx-auto px-6 py-10">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="font-display text-3xl text-navy-900">Admin Dashboard</h1>
            <p className="text-slate-500 mt-1">Manage orders and document fulfillment.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={fetchOrders}>Refresh Data</Button>
            <Button className="bg-navy-900 text-white">Export CSV</Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Orders', value: stats.total, icon: FileText, color: 'text-navy-900' },
            { label: 'Pending Payment', value: stats.pending, icon: AlertCircle, color: 'text-slate-500' },
            { label: 'In Progress', value: stats.processing, icon: Clock, color: 'text-gold-500' },
            { label: 'Completed', value: stats.delivered, icon: CheckCircle2, color: 'text-success' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-3xl font-display text-navy-900">{stat.value}</p>
                </div>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Orders Table */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-4 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input placeholder="Search by Order ID or Email..." className="pl-10 bg-white" />
              </div>
              <Button variant="outline" size="icon"><Filter className="w-4 h-4" /></Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="w-[120px] font-bold text-navy-900">Order ID</TableHead>
                <TableHead className="font-bold text-navy-900">Client</TableHead>
                <TableHead className="font-bold text-navy-900">Document Type</TableHead>
                <TableHead className="font-bold text-navy-900">Amount</TableHead>
                <TableHead className="font-bold text-navy-900">Status</TableHead>
                <TableHead className="font-bold text-navy-900">Date</TableHead>
                <TableHead className="text-right font-bold text-navy-900">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-slate-400">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id} className="group hover:bg-slate-50/50">
                    <TableCell className="font-medium text-navy-900">#{order.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">{order.full_name}</span>
                        <span className="text-xs text-slate-500">{order.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-slate-900">{order.document_type}</span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-tight">{order.category}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-navy-900">₹{order.amount}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" title="View Details"><Eye className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" title="Download Draft"><Download className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
