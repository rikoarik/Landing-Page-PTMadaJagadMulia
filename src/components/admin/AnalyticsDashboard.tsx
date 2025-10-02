import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GlassCard } from "@/components/GlassCard";
import {
  Users,
  Briefcase,
  MessageSquare,
  LayoutGrid,
  Eye,
  EyeOff,
  Activity,
  Clock,
  MousePointer,
  Globe,
  Smartphone,
  Tablet,
  FileText,
  History,
  BarChart2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

interface Stats {
  services: ContentStats;
  projects: ContentStats;
  team: ContentStats;
  testimonials: ContentStats;
  about: ContentStats & { revisions: number };
}

interface VisitorStats {
  totalVisits: number;
  uniqueVisitors: number;
  avgDuration: string;
  bounceRate: number;
  pageViews: { path: string; count: number }[];
  devices: { type: string; count: number }[];
  dailyVisits: { date: string; visits: number }[];
}

type TableName = "services" | "projects" | "team_members" | "testimonials";
type ContentStats = { total: number; published: number };

const COLORS = ['#3b82f6', '#22c55e', '#a855f7', '#eab308'];

export function AnalyticsDashboard() {
  const [stats, setStats] = useState<Stats>({
    services: { total: 0, published: 0 },
    projects: { total: 0, published: 0 },
    team: { total: 0, published: 0 },
    testimonials: { total: 0, published: 0 },
    about: { total: 0, published: 0, revisions: 0 },
  });
  const [visitorStats, setVisitorStats] = useState<VisitorStats>({
    totalVisits: 0,
    uniqueVisitors: 0,
    avgDuration: "0:00",
    bounceRate: 0,
    pageViews: [],
    devices: [],
    dailyVisits: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchStats(), fetchVisitorStats()]).then(() => setLoading(false));
  }, []);

  const fetchStats = async () => {
    const tables: TableName[] = ['services', 'projects', 'team_members', 'testimonials'];
    const newStats = { ...stats };

    // Fetch regular content stats
    for (const table of tables) {
      const { count: totalCount } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      const { count: publishedCount } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true);

      const key = table === 'team_members' ? 'team' : table;
      const contentStats: ContentStats = {
        total: totalCount || 0,
        published: publishedCount || 0,
      };
      (newStats[key as keyof Omit<Stats, 'about'>] as ContentStats) = contentStats;
    }

    // Fetch About section stats
    const { count: aboutTotal } = await supabase
      .from('about_content')
      .select('*', { count: 'exact', head: true });

    const { count: aboutPublished } = await supabase
      .from('about_content')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true);

    const { count: revisionCount } = await supabase
      .from('about_content_history')
      .select('*', { count: 'exact', head: true });

    newStats.about = {
      total: aboutTotal || 0,
      published: aboutPublished || 0,
      revisions: revisionCount || 0,
    };

    setStats(newStats);
  };

  const fetchVisitorStats = async () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: visits } = await supabase
      .from('page_visits')
      .select('*')
      .gte('created_at', thirtyDaysAgo.toISOString());

    if (!visits) return;

    // Calculate statistics
    const uniqueVisitors = new Set(visits.map(v => v.visitor_id)).size;
    const avgDuration = visits.reduce((acc, v) => acc + (v.duration || 0), 0) / visits.length;
    const bounceRate = (visits.filter(v => v.duration < 10).length / visits.length) * 100;

    // Page views
    const pageViews = Object.entries(
      visits.reduce((acc, v) => {
        acc[v.path] = (acc[v.path] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    )
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Device types
    const devices = Object.entries(
      visits.reduce((acc, v) => {
        acc[v.device_type] = (acc[v.device_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    )
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);

    // Daily visits
    const dailyVisits = Object.entries(
      visits.reduce((acc, v) => {
        const date = new Date(v.created_at).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    )
      .map(([date, visits]) => ({ date, visits }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setVisitorStats({
      totalVisits: visits.length,
      uniqueVisitors,
      avgDuration: `${Math.floor(avgDuration / 60)}:${(avgDuration % 60).toFixed(0).padStart(2, '0')}`,
      bounceRate,
      pageViews,
      devices,
      dailyVisits,
    });
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-pulse text-lg">Loading analytics...</div>
      </div>
    );
  }

  const contentCards = [
    {
      title: "Services",
      icon: LayoutGrid,
      stats: stats.services,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Projects",
      icon: Briefcase,
      stats: stats.projects,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Team Members",
      icon: Users,
      stats: stats.team,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Testimonials",
      icon: MessageSquare,
      stats: stats.testimonials,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "About Content",
      icon: FileText,
      stats: { ...stats.about, total: 1 },
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
      extraStats: [
        { label: "Revisions", value: stats.about.revisions, icon: History },
      ],
    },
  ];

  const visitorMetrics = [
    {
      title: "Total Visits",
      value: visitorStats.totalVisits.toLocaleString(),
      icon: MousePointer,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Unique Visitors",
      value: visitorStats.uniqueVisitors.toLocaleString(),
      icon: Users,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Avg. Time on Site",
      value: visitorStats.avgDuration,
      icon: Clock,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Bounce Rate",
      value: `${visitorStats.bounceRate.toFixed(1)}%`,
      icon: Activity,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-6">Content Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {contentCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <GlassCard key={index} className="p-6">
                <div className={`p-3 ${card.bgColor} rounded-xl w-fit mb-4`}>
                  <Icon className={`h-6 w-6 ${card.color}`} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{card.title}</h3>
                <div className="flex items-center gap-4">
                  <div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      <span>Published</span>
                    </div>
                    <p className="text-2xl font-bold">{card.stats.published}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Activity className="h-4 w-4" />
                      <span>Total</span>
                    </div>
                    <p className="text-2xl font-bold">{card.stats.total}</p>
                  </div>
                  {'extraStats' in card && card.extraStats?.map((stat, i) => (
                    <div key={i}>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        {stat.icon && <stat.icon className="h-4 w-4" />}
                        <span>{stat.label}</span>
                      </div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-6">Visitor Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {visitorMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <GlassCard key={index} className="p-6">
                <div className={`p-3 ${metric.bgColor} rounded-xl w-fit mb-4`}>
                  <Icon className={`h-6 w-6 ${metric.color}`} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{metric.title}</h3>
                <p className="text-2xl font-bold">{metric.value}</p>
              </GlassCard>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
          {/* Traffic Over Time */}
          <GlassCard className="p-6">
            <h3 className="font-semibold text-lg mb-4">Traffic Over Time</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={visitorStats.dailyVisits}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="visits"
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Device Breakdown */}
          <GlassCard className="p-6">
            <h3 className="font-semibold text-lg mb-4">Device Breakdown</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={visitorStats.devices}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#3b82f6"
                  >
                    {visitorStats.devices.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {visitorStats.devices.map((device, index) => (
                <div key={device.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm">{device.type}</span>
                  </div>
                  <span className="text-sm font-medium">
                    {((device.count / visitorStats.totalVisits) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Popular Pages */}
        <GlassCard className="p-6 mt-4">
          <h3 className="font-semibold text-lg mb-4">Popular Pages</h3>
          <div className="space-y-4">
            {visitorStats.pageViews.map((page, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium w-6">{index + 1}.</span>
                  <span className="text-sm truncate max-w-md">{page.path}</span>
                </div>
                <span className="text-sm font-medium">
                  {page.count.toLocaleString()} views
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
