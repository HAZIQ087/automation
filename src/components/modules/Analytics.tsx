import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  Trophy, 
  Clock, 
  Users, 
  Youtube,
  Download,
  Eye,
  Star
} from "lucide-react";

const dailyStats = [
  { day: "Mon", replays: 12, uploads: 8, views: 15420 },
  { day: "Tue", replays: 15, uploads: 11, views: 18750 },
  { day: "Wed", replays: 8, uploads: 6, views: 12300 },
  { day: "Thu", replays: 18, uploads: 14, views: 22180 },
  { day: "Fri", replays: 22, uploads: 16, views: 28900 },
  { day: "Sat", replays: 25, uploads: 19, views: 35200 },
  { day: "Sun", replays: 20, uploads: 15, views: 31500 }
];

const championStats = [
  { name: "Azir", count: 24, color: "#463714" },
  { name: "Yasuo", count: 18, color: "#0F2027" },
  { name: "Lee Sin", count: 16, color: "#1E2328" },
  { name: "Zed", count: 14, color: "#3C3C41" },
  { name: "Orianna", count: 12, color: "#5BC0DE" },
  { name: "Others", count: 35, color: "#463714" }
];

const performanceMetrics = [
  { month: "Oct", successRate: 94, avgViews: 18500 },
  { month: "Nov", successRate: 96, avgViews: 22300 },
  { month: "Dec", successRate: 91, avgViews: 19800 },
  { month: "Jan", successRate: 98, avgViews: 25700 }
];

export const Analytics = () => {
  const totalReplays = dailyStats.reduce((sum, day) => sum + day.replays, 0);
  const totalUploads = dailyStats.reduce((sum, day) => sum + day.uploads, 0);
  const totalViews = dailyStats.reduce((sum, day) => sum + day.views, 0);
  const successRate = Math.round((totalUploads / totalReplays) * 100);

  const metrics = [
    {
      title: "Weekly Replays",
      value: totalReplays.toString(),
      change: "+12%",
      icon: Download,
      color: "text-blue-rift",
      gradient: "gradient-gaming"
    },
    {
      title: "Successful Uploads",
      value: totalUploads.toString(),
      change: "+8%",
      icon: Youtube,
      color: "text-red-baron",
      gradient: "gradient-primary"
    },
    {
      title: "Total Views",
      value: (totalViews / 1000).toFixed(1) + "K",
      change: "+15%",
      icon: Eye,
      color: "text-success",
      gradient: "gradient-success"
    },
    {
      title: "Success Rate",
      value: successRate + "%",
      change: "+2%",
      icon: Trophy,
      color: "text-gold",
      gradient: "gradient-primary"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className={`gaming-card ${metric.gradient} border-gold/20`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground/80">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-5 w-5 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {metric.value}
              </div>
              <p className="text-xs text-success flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                {metric.change} from last week
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Activity Chart */}
        <Card className="gaming-card border-gold/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <BarChart className="w-5 h-5 text-blue-rift" />
              Daily Activity
            </CardTitle>
            <CardDescription>
              Replays found and videos uploaded this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="day" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }}
                />
                <Bar dataKey="replays" fill="#3B82F6" name="Replays Found" radius={[4, 4, 0, 0]} />
                <Bar dataKey="uploads" fill="#C89B3C" name="Videos Uploaded" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Champion Distribution */}
        <Card className="gaming-card border-gold/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Star className="w-5 h-5 text-gold" />
              Champion Distribution
            </CardTitle>
            <CardDescription>
              Most uploaded champions this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={championStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="count"
                >
                  {championStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontWeight: '500'
                  }}
                  labelStyle={{
                    color: '#FFFFFF'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {championStats.map((champion, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: champion.color }}
                  />
                  <span className="text-card-foreground">{champion.name}</span>
                  <span className="text-muted-foreground ml-auto">{champion.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trends */}
        <Card className="gaming-card border-gold/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <TrendingUp className="w-5 h-5 text-success" />
              Performance Trends
            </CardTitle>
            <CardDescription>
              Success rate and average views over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="month" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right"
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }}
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="successRate" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  name="Success Rate (%)"
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="avgViews" 
                  stroke="#C89B3C" 
                  strokeWidth={3}
                  name="Avg Views"
                  dot={{ fill: '#C89B3C', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="gaming-card border-gold/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Users className="w-5 h-5 text-teal-nexus" />
              System Health
            </CardTitle>
            <CardDescription>
              Real-time system performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-card-foreground">CPU Usage</span>
                  <span className="text-sm text-muted-foreground">23%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-success h-2 rounded-full" style={{ width: '23%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-card-foreground">Memory Usage</span>
                  <span className="text-sm text-muted-foreground">67%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-warning h-2 rounded-full" style={{ width: '67%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-card-foreground">Disk Space</span>
                  <span className="text-sm text-muted-foreground">45%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-blue-rift h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-card-foreground">Network I/O</span>
                  <span className="text-sm text-muted-foreground">12%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-teal-nexus h-2 rounded-full" style={{ width: '12%' }}></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-success">99.8%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-rift">2.3s</div>
                <div className="text-sm text-muted-foreground">Avg Response</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
