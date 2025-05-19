import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  messages: number;
}

const DashboardHome: React.FC = () => {
  const [stats, setStats] = useState({
    totalMessages: 0,
    activeUsers: 0,
    deliveryRate: 0,
    messageVolume: [] as ChartData[],
  });

  useEffect(() => {
    const mockData = {
      totalMessages: 1432,
      activeUsers: 87,
      deliveryRate: 98.6,
      messageVolume: [
        { name: 'Mon', messages: 240 },
        { name: 'Tue', messages: 300 },
        { name: 'Wed', messages: 320 },
        { name: 'Thu', messages: 280 },
        { name: 'Fri', messages: 250 },
        { name: 'Sat', messages: 40 },
        { name: 'Sun', messages: 30 },
      ],
    };
    
    setStats(mockData);
    
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Messages</CardTitle>
            <CardDescription>Past 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalMessages.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Active Users</CardTitle>
            <CardDescription>Current online</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeUsers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Delivery Rate</CardTitle>
            <CardDescription>Average</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.deliveryRate}%</div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Message Volume</CardTitle>
          <CardDescription>Past 7 days</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.messageVolume}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="messages" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;
