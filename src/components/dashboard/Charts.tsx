'use client';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface RevenueChartProps {
  data: Array<{ month: string; revenue: number }>;
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip 
          formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
          labelFormatter={(label) => `Month: ${label}`}
        />
        <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface StaffDistributionChartProps {
  data: Array<{ role: string; count: number; color: string }>;
}

export function StaffDistributionChart({ data }: StaffDistributionChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ role, count, percent }) => {
            if (percent && percent > 0.05) {
              return `${role} ${(percent * 100).toFixed(0)}%`;
            }
            return '';
          }}
          outerRadius={80}
          fill="#8884d8"
          dataKey="count"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => [`${value} staff`, 'Count']}
          labelFormatter={(label) => `${label}`}
        />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          formatter={(value, entry, index) => {
            const item = data[index];
            const percentage = ((item.count / total) * 100).toFixed(1);
            return `${value} (${percentage}%)`;
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
} 