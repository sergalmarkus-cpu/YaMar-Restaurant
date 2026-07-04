'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Lun', ventas: 2400 },
  { day: 'Mar', ventas: 1398 },
  { day: 'Mié', ventas: 9800 },
  { day: 'Jue', ventas: 3908 },
  { day: 'Vie', ventas: 4800 },
  { day: 'Sáb', ventas: 3800 },
  { day: 'Dom', ventas: 4300 },
];

export default function SalesChart() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Ventas de la semana
      </h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="day" 
            stroke="#888888"
            fontSize={12}
          />
          <YAxis 
            stroke="#888888"
            fontSize={12}
            tickFormatter={(value) => `€${value}`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
            formatter={(value: number) => [`€${value}`, 'Ventas']}
          />
          <Line 
            type="monotone" 
            dataKey="ventas" 
            stroke="#4f46e5" 
            strokeWidth={2}
            dot={{ fill: '#4f46e5', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}