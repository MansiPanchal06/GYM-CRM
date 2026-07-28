/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
// Remove unused import from mockData

export interface Client {
  id: number
  name: string
  age: number
  phone: string
  email: string
  avatar: string
  avatarColor: string
  avatarUrl?: string
  plan: string
  startDate: string
  endDate: string
  remainingDays: number
  currentWeight: number
  goalWeight: number
  height: number
  status: string
  goal: string
  attendance: number
  // Extended fields
  address?: string
  notes?: string
  membershipAmount?: number
}

export interface AttendanceLog {
  id: number
  clientId: number
  date: string        // ISO date string "YYYY-MM-DD"
  checkInTime: string // e.g. "08:30 AM"
  checkOutTime?: string
  present: boolean
}

export interface SavedWorkout {
  id: number
  name: string
  focus: string
  exercises: string[]
  duration: string
  intensity: string
}

export interface DailyUpdate {
  clientId: number
  name: string
  avatar: string
  avatarColor: string
  date: string
  workout: boolean
  workoutName: string
  water: number
  calories: number
  sleep: number
  steps: number
  mood: string
  notes: string
  heartRate: number
}

export interface WeightEntry {
  date: string
  weight: number
}

export interface WeightTableEntry {
  date: string
  weight: string
  change: string
  bmi: string
}

interface Notification {
  id: number
  message: string
  time: string
  read: boolean
  type: 'info' | 'success' | 'warning'
}

export interface ChatMessage {
  id: number
  text: string
  sender: 'admin' | 'user'
  senderName: string
  timestamp: string
  time: string
}

interface DataContextType {
  clients: Client[]
  addClient: (client: Omit<Client, 'id' | 'avatar' | 'avatarColor'>) => void
  updateClient: (id: number, data: Partial<Client>) => void
  deleteClient: (id: number) => void
  dailyUpdates: DailyUpdate[]
  addDailyUpdate: (update: DailyUpdate) => void
  weightHistory: WeightEntry[]
  addWeightEntry: (entry: WeightEntry) => void
  weightTableData: WeightTableEntry[]
  addWeightTableEntry: (entry: WeightTableEntry) => void
  notifications: Notification[]
  addNotification: (msg: string, type?: 'info' | 'success' | 'warning') => void
  markNotificationRead: (id: number) => void
  clearNotifications: () => void
  chatMessages: ChatMessage[]
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp' | 'time'>) => void
  attendanceLogs: AttendanceLog[]
  addAttendanceLog: (log: Omit<AttendanceLog, 'id'>) => void
  savedWorkouts: SavedWorkout[]
  addSavedWorkout: (workout: Omit<SavedWorkout, 'id'>) => void
  deleteSavedWorkout: (id: number) => void
}

const DataContext = createContext<DataContextType | null>(null)

const avatarColors = [
  'from-violet-500 to-purple-600',
  'from-pink-500 to-rose-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-yellow-600',
  'from-blue-500 to-cyan-600',
  'from-fuchsia-500 to-pink-600',
  'from-indigo-500 to-blue-600',
  'from-lime-500 to-green-600',
  'from-red-500 to-orange-600',
  'from-cyan-500 to-sky-600',
]

// Generate mock attendance logs for all clients
function generateMockAttendanceLogs(): AttendanceLog[] {
  const clientIds = [1,2,3,4,5,6,7,8]
  const logs: AttendanceLog[] = []
  let id = 1
  const checkInTimes = ['06:15 AM','06:45 AM','07:00 AM','07:30 AM','08:00 AM','08:15 AM','08:45 AM','09:00 AM','09:30 AM','10:00 AM']
  const checkOutTimes = ['07:15 AM','07:45 AM','08:15 AM','08:30 AM','09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM']
  for (const clientId of clientIds) {
    for (let d = 0; d < 30; d++) {
      const date = new Date()
      date.setDate(date.getDate() - d)
      const dow = date.getDay()
      const isWeekend = dow === 0 || dow === 6
      const present = !isWeekend && Math.random() > 0.25
      const ciIdx = Math.floor(Math.random() * checkInTimes.length)
      logs.push({
        id: id++,
        clientId,
        date: date.toISOString().split('T')[0],
        checkInTime: present ? checkInTimes[ciIdx] : '',
        checkOutTime: present ? checkOutTimes[ciIdx] : undefined,
        present,
      })
    }
  }
  return logs
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>([])
  const [dailyUpdates, setDailyUpdates] = useState<DailyUpdate[]>([])
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([])
  const [weightTableData, setWeightTableData] = useState<WeightTableEntry[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [attendanceLogs] = useState<AttendanceLog[]>(generateMockAttendanceLogs)
  const [savedWorkouts, setSavedWorkouts] = useState<SavedWorkout[]>([
    { id: 1, name: 'Full Body Blast', focus: 'Full Body', exercises: ['Push-ups 3×15','Squats 3×20','Pull-ups 3×10','Plank 3×1min'], duration: '45 min', intensity: 'High' },
    { id: 2, name: 'Core Crusher', focus: 'Core', exercises: ['Crunches 4×20','Russian Twists 3×20','Leg Raises 4×15','Plank 4×1min'], duration: '30 min', intensity: 'Medium' },
    { id: 3, name: 'HIIT Cardio', focus: 'Cardio', exercises: ['Jump Rope 5min','Burpees 3×15','Mountain Climbers 3×1min','Box Jumps 3×10'], duration: '35 min', intensity: 'Very High' },
  ])
  const nextWorkoutIdRef = { current: 4 }
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  useEffect(() => {
    // Fetch initial data
    const fetchData = async () => {
      try {
        const [clientsRes, updatesRes, weightHistRes, weightTableRes, notifRes, chatRes] = await Promise.all([
          fetch(`${API_URL}/clients`),
          fetch(`${API_URL}/daily-updates`),
          fetch(`${API_URL}/weight-history`),
          fetch(`${API_URL}/weight-table-data`),
          fetch(`${API_URL}/notifications`),
          fetch(`${API_URL}/chat-messages`)
        ])
        
        if (clientsRes.ok) setClients(await clientsRes.json())
        if (updatesRes.ok) setDailyUpdates(await updatesRes.json())
        if (weightHistRes.ok) setWeightHistory(await weightHistRes.json())
        if (weightTableRes.ok) setWeightTableData(await weightTableRes.json())
        if (notifRes.ok) setNotifications(await notifRes.json())
        if (chatRes.ok) {
          const msgs = await chatRes.json()
          if (msgs.length === 0) {
            setChatMessages([{ id: 1, text: 'Welcome to GymCRM! Feel free to ask any questions about your training plan.', sender: 'admin', senderName: 'Admin', timestamp: new Date().toISOString(), time: '10:00 AM' }])
          } else {
            setChatMessages(msgs)
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
      }
    }
    fetchData()
  }, [])
  
  const addClient = async (data: Omit<Client, 'id' | 'avatar' | 'avatarColor'>) => {
    const nameParts = data.name.split(' ')
    const avatar = (nameParts[0]?.[0] || '') + (nameParts[1]?.[0] || '')
    const avatarColor = avatarColors[Math.floor(Math.random() * avatarColors.length)]
    
    try {
      const res = await fetch(`${API_URL}/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, avatar: avatar.toUpperCase(), avatarColor })
      })
      if (res.ok) {
        const newClient = await res.json()
        setClients(prev => [...prev, newClient])
        addNotification(`New client "${data.name}" has been added`, 'success')
      }
    } catch (error) {
      console.error("Error adding client", error)
    }
  }

  const updateClient = async (id: number, data: Partial<Client>) => {
    try {
      const res = await fetch(`${API_URL}/clients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (res.ok) {
        const updated = await res.json()
        setClients(prev => prev.map(c => c.id === id ? updated : c))
      }
    } catch (error) {
      console.error("Error updating client", error)
    }
  }

  const deleteClient = async (id: number) => {
    const client = clients.find(c => c.id === id)
    try {
      const res = await fetch(`${API_URL}/clients/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setClients(prev => prev.filter(c => c.id !== id))
        if (client) addNotification(`Client "${client.name}" has been removed`, 'warning')
      }
    } catch (error) {
      console.error("Error deleting client", error)
    }
  }

  const addDailyUpdate = async (update: DailyUpdate) => {
    try {
      const res = await fetch(`${API_URL}/daily-updates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update)
      })
      if (res.ok) {
        const newUpdate = await res.json()
        setDailyUpdates(prev => [newUpdate, ...prev])
      }
    } catch (error) {
      console.error("Error adding daily update", error)
    }
  }

  const addWeightEntry = async (entry: WeightEntry) => {
    try {
      const res = await fetch(`${API_URL}/weight-history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      })
      if (res.ok) {
        const newEntry = await res.json()
        setWeightHistory(prev => [...prev, newEntry])
      }
    } catch (error) {
      console.error("Error adding weight entry", error)
    }
  }

  const addWeightTableEntry = async (entry: WeightTableEntry) => {
    try {
      const res = await fetch(`${API_URL}/weight-table-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      })
      if (res.ok) {
        const newEntry = await res.json()
        setWeightTableData(prev => [...prev, newEntry])
      }
    } catch (error) {
      console.error("Error adding weight table entry", error)
    }
  }

  const addNotification = async (message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    try {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      const res = await fetch(`${API_URL}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, time, type })
      })
      if (res.ok) {
        const newNotif = await res.json()
        setNotifications(prev => [newNotif, ...prev])
      }
    } catch (error) {
      console.error("Error adding notification", error)
    }
  }

  const markNotificationRead = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/notifications/${id}/read`, { method: 'PUT' })
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
      }
    } catch (error) {
      console.error("Error marking notification read", error)
    }
  }

  const clearNotifications = async () => {
    try {
      const res = await fetch(`${API_URL}/notifications/read-all`, { method: 'PUT' })
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      }
    } catch (error) {
      console.error("Error clearing notifications", error)
    }
  }

  const addChatMessage = async (msg: Omit<ChatMessage, 'id' | 'timestamp' | 'time'>) => {
    try {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      const timestamp = new Date().toISOString()
      const res = await fetch(`${API_URL}/chat-messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...msg, time, timestamp })
      })
      if (res.ok) {
        const newMsg = await res.json()
        setChatMessages(prev => [...prev, newMsg])
      }
    } catch (error) {
      console.error("Error adding chat message", error)
    }
  }

  // Attendance logs (client-side only)
  const addAttendanceLog = (log: Omit<AttendanceLog, 'id'>) => {
    console.log('Attendance log added (mock):', log)
  }

  // Saved workouts (client-side only)
  const addSavedWorkout = (workout: Omit<SavedWorkout, 'id'>) => {
    const id = nextWorkoutIdRef.current++
    setSavedWorkouts(prev => [...prev, { ...workout, id }])
  }

  const deleteSavedWorkout = (id: number) => {
    setSavedWorkouts(prev => prev.filter(w => w.id !== id))
  }

  return (
    <DataContext.Provider value={{
      clients, addClient, updateClient, deleteClient,
      dailyUpdates, addDailyUpdate,
      weightHistory, addWeightEntry,
      weightTableData, addWeightTableEntry,
      notifications, addNotification, markNotificationRead, clearNotifications,
      chatMessages, addChatMessage,
      attendanceLogs, addAttendanceLog,
      savedWorkouts, addSavedWorkout, deleteSavedWorkout,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
