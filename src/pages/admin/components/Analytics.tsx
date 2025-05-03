"use client";

import React, { useEffect, useState, ReactElement } from "react";
import Cookies from "js-cookie";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import { getAnalyticsData } from "@/endpoints/admin";
import { AnalyticsDataResponse } from "@/endpoints/admin";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Section = ({ title, children }: { title: string; children: ReactElement }) => (
  <div className="mb-12">
    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md">{children}</div>
  </div>
);

const ChartWrapper = ({ children }: { children: ReactElement }) => (
  <div className="h-[300px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      {children}
    </ResponsiveContainer>
  </div>
);

type TimeSeries = { date: string; count: number };
type GroupedCount = { [key: string]: string | number; date: string };

const Analytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsDataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30days");
  const [metric, setMetric] = useState("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = Cookies.get("linkup_auth_token") ?? "";
        const response = await getAnalyticsData(token, period, metric);
        if (!response || !response.data) {
          throw new Error("No data received from server");
        }
        setData(response);
      } catch (err) {
        console.error("Failed to fetch analytics data", err);
        setError(err instanceof Error ? err.message : "Failed to fetch analytics data");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [period, metric]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-[300px] w-full rounded-2xl" />
          ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-500 mb-2">Error loading analytics</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (!data || !data.data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No data available</h2>
          <p className="text-gray-600 dark:text-gray-400">Try selecting a different time period or metric</p>
        </div>
      </div>
    );
  }

  const { userGrowth, contentCreation, engagementMetrics, moderationMetrics, jobMetrics } = data.data;

  // Safe access to potentially undefined metrics
  const reportsCreated = moderationMetrics?.reportsCreated || [];
  const reportsResolved = moderationMetrics?.reportsResolved || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Platform Analytics</h1>
        <div className="flex gap-4">
          <div className="w-40">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-40">
            <Select value={metric} onValueChange={setMetric}>
              <SelectTrigger>
                <SelectValue placeholder="Metrics" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Metrics</SelectItem>
                <SelectItem value="users">Users</SelectItem>
                <SelectItem value="content">Content</SelectItem>
                <SelectItem value="engagement">Engagement</SelectItem>
                <SelectItem value="moderation">Moderation</SelectItem>
                <SelectItem value="jobs">Jobs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {(metric === "all" || metric === "users") && (
          <Section title="User Growth">
            <ChartWrapper>
              <AreaChart data={userGrowth || []}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ChartWrapper>
          </Section>
        )}

        {(metric === "all" || metric === "content") && (
          <Section title="Content Creation (Posts)">
            <ChartWrapper>
              <BarChart data={contentCreation?.posts || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" />
              </BarChart>
            </ChartWrapper>
          </Section>
        )}

        {(metric === "all" || metric === "engagement") && (
          <Section title="Engagement Metrics - Reactions by Type">
            <ChartWrapper>
              <BarChart data={aggregateByType(engagementMetrics?.reactions || [], "type")}>
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ChartWrapper>
          </Section>
        )}

        {(metric === "all" || metric === "engagement") && (
          <Section title="Engagement Metrics - Connections & Comments">
            <ChartWrapper>
              <LineChart
                data={mergeSeries(
                  engagementMetrics?.connections || [],
                  engagementMetrics?.comments || [],
                  "Connections",
                  "Comments"
                )}
              >
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Connections" stroke="#3b82f6" />
                <Line type="monotone" dataKey="Comments" stroke="#ef4444" />
              </LineChart>
            </ChartWrapper>
          </Section>
        )}

        {(metric === "all" || metric === "moderation") && (
          <Section title="Moderation Metrics - Reports Created vs Resolved">
            <ChartWrapper>
              <LineChart
                data={mergeSeries(
                  reportsCreated,
                  reportsResolved,
                  "Created",
                  "Resolved"
                )}
              >
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Created" stroke="#f59e0b" />
                <Line type="monotone" dataKey="Resolved" stroke="#10b981" />
              </LineChart>
            </ChartWrapper>
          </Section>
        )}

        {(metric === "all" || metric === "moderation") && (
          <Section title="Avg. Report Resolution Time (Hours)">
            <ChartWrapper>
              <BarChart data={reportsResolved}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avgResolutionHours" fill="#3b82f6" />
              </BarChart>
            </ChartWrapper>
          </Section>
        )}

        {(metric === "all" || metric === "jobs") && (
          <Section title="Jobs Posted Over Time">
            <ChartWrapper>
              <AreaChart data={jobMetrics?.jobsPosted || []}>
                <defs>
                  <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#ec4899" fillOpacity={1} fill="url(#colorJobs)" />
              </AreaChart>
            </ChartWrapper>
          </Section>
        )}

        {(metric === "all" || metric === "jobs") && (
          <Section title="Application Outcomes by Status">
            <ChartWrapper>
              <BarChart data={aggregateByType(jobMetrics?.applicationOutcomes || [], "status")}>
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" />
              </BarChart>
            </ChartWrapper>
          </Section>
        )}
      </div>
    </div>
  );
};

function mergeSeries(
  seriesA: TimeSeries[],
  seriesB: TimeSeries[],
  keyA: string,
  keyB: string
): { date: string; [key: string]: number | string }[] {
  const map = new Map<string, { date: string; [key: string]: number | string }>();

  seriesA.forEach(({ date, count }) => {
    if (!map.has(date)) {
      map.set(date, { date });
    }
    map.get(date)![keyA] = count;
  });

  seriesB.forEach(({ date, count }) => {
    if (!map.has(date)) {
      map.set(date, { date });
    }
    map.get(date)![keyB] = count;
  });

  return Array.from(map.values()).map((entry) => ({
    date: entry.date,
    [keyA]: (entry[keyA] as number) ?? 0,
    [keyB]: (entry[keyB] as number) ?? 0,
  }));
}

function aggregateByType(
  data: { [key: string]: string | number }[],
  key: "type" | "status"
): GroupedCount[] {
  const map = new Map<string, number>();

  data.forEach((item) => {
    const k = item[key] as string;
    map.set(k, (map.get(k) ?? 0) + (item.count as number));
  });

  return Array.from(map.entries()).map(([k, count]) => ({
    [key]: k,
    count,
    date: "N/A",
  }));
}

export default Analytics;