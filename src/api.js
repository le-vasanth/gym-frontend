const API_URL = 'https://gym-backend-tvk3.onrender.com/api';

// Map DB snake_case to Frontend camelCase
const mapMemberToFront = (m) => ({
  id: m.id,
  name: m.name,
  phone: m.phone,
  email: m.email,
  pin: m.pin,
  plan: m.plan,
  planType: m.plan_type,
  planCycle: m.plan_cycle,
  planPrice: m.plan_price,
  paymentStatus: m.payment_status,
  lastPaidDate: m.last_paid_date,
  nextDueDate: m.next_due_date,
  paymentMethod: m.payment_method,
  status: m.status,
  expiresAt: m.expires_at,
  lastCheckIn: m.last_check_in,
  totalCheckInsThisMonth: m.total_check_ins_this_month,
  trainer: m.trainer,
  trainerPhone: m.trainer_phone,
  avatar: m.avatar,
  bodyStats: { weight: m.weight, height: m.height, bodyFat: m.body_fat },
  workoutGoal: m.workout_goal
});

// Map Frontend camelCase to DB snake_case
const mapMemberToDB = (m) => ({
  id: m.id,
  name: m.name,
  phone: m.phone,
  email: m.email,
  pin: m.pin,
  plan: m.plan,
  plan_type: m.planType,
  plan_cycle: m.planCycle,
  plan_price: m.planPrice,
  payment_status: m.paymentStatus,
  last_paid_date: m.lastPaidDate,
  next_due_date: m.nextDueDate,
  payment_method: m.paymentMethod,
  status: m.status,
  expires_at: m.expiresAt,
  last_check_in: m.lastCheckIn,
  total_check_ins_this_month: m.totalCheckInsThisMonth,
  trainer: m.trainer,
  trainer_phone: m.trainerPhone,
  avatar: m.avatar,
  weight: m.bodyStats?.weight,
  height: m.bodyStats?.height,
  body_fat: m.bodyStats?.bodyFat,
  workout_goal: m.workoutGoal
});

const mapTransactionToFront = (t) => ({
  id: t.id,
  memberId: t.member_id,
  memberName: t.member_name,
  amount: t.amount,
  priceNum: t.price_num,
  planCycle: t.plan_cycle,
  planType: t.plan_type,
  date: t.date,
  method: t.method,
  status: t.status,
  receiptNo: t.id // fallback since receiptNo wasn't in db
});

const mapTransactionToDB = (t) => ({
  id: t.id,
  member_id: t.memberId,
  member_name: t.memberName,
  amount: t.amount,
  price_num: t.priceNum || 0,
  plan_cycle: t.planCycle,
  plan_type: t.planType || 'Plan',
  date: t.date,
  method: t.method,
  status: t.status
});

const mapLogToFront = (l) => ({
  id: l.id,
  memberId: l.member_id,
  memberName: l.member_name,
  time: l.time,
  date: l.date,
  status: l.status,
  paymentStatusAtScan: l.payment_status_at_scan,
  planCycle: l.plan_cycle
});

const mapLogToDB = (l) => ({
  id: l.id,
  member_id: l.memberId,
  member_name: l.memberName,
  time: l.time,
  date: l.date,
  status: l.status,
  payment_status_at_scan: l.paymentStatusAtScan,
  plan_cycle: l.planCycle
});

export const api = {
  getMembers: async () => {
    const res = await fetch(`${API_URL}/members`);
    if (!res.ok) throw new Error('Failed to fetch members');
    const data = await res.json();
    return data.map(mapMemberToFront);
  },
  createMember: async (member) => {
    const res = await fetch(`${API_URL}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mapMemberToDB(member))
    });
    if (!res.ok) throw new Error('Failed to create member');
    return mapMemberToFront(await res.json());
  },
  updateMember: async (id, member) => {
    const res = await fetch(`${API_URL}/members/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mapMemberToDB(member))
    });
    if (!res.ok) throw new Error('Failed to update member');
    return mapMemberToFront(await res.json());
  },
  deleteMember: async (id) => {
    const res = await fetch(`${API_URL}/members/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete member');
    return;
  },

  getTransactions: async () => {
    const res = await fetch(`${API_URL}/transactions`);
    if (!res.ok) throw new Error('Failed to fetch transactions');
    const data = await res.json();
    return data.map(mapTransactionToFront);
  },
  createTransaction: async (transaction) => {
    const res = await fetch(`${API_URL}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mapTransactionToDB(transaction))
    });
    if (!res.ok) throw new Error('Failed to create transaction');
    return mapTransactionToFront(await res.json());
  },

  getAttendanceLogs: async () => {
    const res = await fetch(`${API_URL}/attendance`);
    if (!res.ok) throw new Error('Failed to fetch attendance');
    const data = await res.json();
    return data.map(mapLogToFront);
  },
  createAttendanceLog: async (log) => {
    const res = await fetch(`${API_URL}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mapLogToDB(log))
    });
    if (!res.ok) throw new Error('Failed to create attendance log');
    return mapLogToFront(await res.json());
  },

  getPlans: async () => {
    const res = await fetch(`${API_URL}/plans`);
    if (!res.ok) throw new Error('Failed to fetch plans');
    return await res.json();
  },
  createPlan: async (plan) => {
    const res = await fetch(`${API_URL}/plans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan)
    });
    if (!res.ok) throw new Error('Failed to create plan');
    return await res.json();
  },
  updatePlan: async (id, plan) => {
    const res = await fetch(`${API_URL}/plans/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan)
    });
    if (!res.ok) throw new Error('Failed to update plan');
    return await res.json();
  },
  deletePlan: async (id) => {
    const res = await fetch(`${API_URL}/plans/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete plan');
    return;
  }
};
