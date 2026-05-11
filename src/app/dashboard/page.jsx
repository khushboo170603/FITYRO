"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./dashboard.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";


export default function Dashboard() {

  const [dailyData, setDailyData] = useState([]);
  
  const [summary, setSummary] = useState({});
  const [showTooltip, setShowTooltip] = useState(false);
  const router = useRouter();
  const [health, setHealth] = useState({
  ai_server: false,
  mongodb: false,
  api: false,
});

useEffect(() => {
  fetch("http://localhost:8000/health")
    .then((res) => res.json())
    .then((data) => setHealth(data));
}, []);
  
useEffect(() => {
  fetchAnalytics();
}, []);

const API = "http://127.0.0.1:8000";

const success =
  (summary.total_tryons || 0) - (summary.failed_tryons || 0);

const pieData = [
  { name: "Success", value: success },
  { name: "Failed", value: summary.failed_tryons || 0 },
];
const active = summary.active_users || 0;
const total = summary.total_users || 0;
const successRate =
  summary.total_tryons > 0
    ? Math.round(
        ((summary.total_tryons - summary.failed_tryons) /
          summary.total_tryons) *
          100
      )
    : 0;

const failedToday = summary.failed_tryons || 0;

const topCategory =
  summary.top_category || "Topwear";

const avgGeneration =
  summary.avg_generation_time || "7.2";

const fetchAnalytics = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

   const [summaryRes, dailyRes, outfitsRes] = await Promise.all([
    axios.get(`${API}/analytics/summary`, config),
    axios.get(`${API}/analytics/daily-usage`, config),
    
  ]);

  console.log("SUMMARY:", summaryRes.data);
  console.log("DAILY:", dailyRes.data);
  
  setSummary(summaryRes.data);
  setDailyData(dailyRes.data);
  
  } catch (err) {
    console.error("Analytics fetch error:", err);
  }
};

return (
      <div className={styles.dashboardContainer}>

      {/* Sidebar */}
      <div className={styles.sidebar}>
        <img 
          src="/logo1.png" 
          alt="Fityro Logo" 
          className={styles.logo}
        />
        <div className={styles.menu}>
        <Link href="/dashboard" className={styles.active}>
          🏠 Dashboard
        </Link>

        <Link href="/dashboard/users" className={styles.menuItem}>
          👥 Users
        </Link>

       

        <Link href="/dashboard/catalogue" className={styles.menuItem}>
          🛍️ Catalogue
        </Link>
        </div>

        
        <button
          className={styles.logout}
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/login");
          }}
        >
          🚪 Logout
        </button>
      </div>

      {/* Main */}
      <div className={styles.main}>
        <div className={styles.mainInner}>
           <div className={styles.cards}>
              <div className={styles.card}>
                <p className={styles.cardTitle}>Total Users</p>
                  <h2 className={styles.cardValue}>{summary.total_users || 0}</h2>
                </div>

                <div className={styles.card}>
                  <p className={styles.cardTitle}>Try-ons</p>
                  <h2 className={styles.cardValue}>{summary.total_tryons || 0}</h2>
                </div>

                <div className={styles.card}>
                    <p className={styles.cardTitle}>Active Users</p>
                    <h2 className={styles.cardValue}>
                      {summary.active_users || 0}
                    </h2>
                </div>

                <div className={styles.card}>
                    <p className={styles.cardTitle}>Failed</p>
                    <h2 className={styles.cardValue}>{summary.failed_tryons || 0}</h2>
                </div>
                </div>
                
               <div className={styles.chartsGrid}>

  {/* Daily Usage */}
  <div
  className={styles.chartCard}
  style={{ gridColumn: "1 / 2" }}
>
    <h3>Daily Usage</h3>

    <div className={styles.chartWrapper}>
      <ResponsiveContainer width="99%" height={250}>
        <LineChart data={dailyData}>
          <XAxis
  dataKey="date"
  label={{
    value: "Date",
    position: "insideBottom",
    offset: -5,
    style: {
      fill: "#2F241D",
      fontSize: 14,
      fontWeight: 700,
    },
  }}
/>

<YAxis
  label={{
    value: "Try-ons",
    angle: -90,
    position: "insideLeft",
    style: {
      fill: "#2F241D",
      fontSize: 14,
      fontWeight: 700,
    },
  }}
/>
          <Tooltip />

          <Line
            type="monotone"
            dataKey="count"
            stroke="#7B5E57"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>

  {/* Success Rate */}
  <div
  className={styles.chartCard}
  style={{ gridColumn: "2 / 3" }}
>
    <h3>Try-on Success Rate</h3>

    <div className={styles.chartWrapper}>
      <ResponsiveContainer width="99%" height={250}>
        <PieChart>
  <Pie
    data={pieData}
    dataKey="value"
    nameKey="name"
    outerRadius={80}
    innerRadius={50}
    labelLine={false}
  >
    <Cell fill="#7B5E57" />
    <Cell fill="#D6C3B3" />
  </Pie>

  <Tooltip />

  <Legend
    verticalAlign="bottom"
    height={36}
    wrapperStyle={{
      color: "#2F241D",
      fontWeight: 600,
      fontSize: "14px",
    }}
  />
</PieChart>
      </ResponsiveContainer>
    </div>
  </div>

  {/* User Engagement */}
  <div className={`${styles.chartCard} ${styles.fullWidthCard}`}>
    <h3>User Engagement</h3>

    <div className={styles.engagementWrapper}>

      <div className={styles.engagementTop}>
        <span>Active Users</span>

        <span className={styles.percent}>
          {total > 0
            ? `${Math.round((active / total) * 100)}%`
            : "0%"}
        </span>
      </div>

      <div
        style={{
          width: "100%",
          marginTop: "18px",
          position: "relative",
        }}
      >
        {showTooltip && (
          <span
            style={{
              position: "absolute",
              top: "-28px",
              left:
                total > 0
                  ? `${(active / total) * 100}%`
                  : "0%",
              transform: "translateX(-50%)",
              background: "#7B5E57",
              color: "#fff",
              padding: "4px 10px",
              borderRadius: "8px",
              fontSize: "12px",
              whiteSpace: "nowrap",
              zIndex: 10,
            }}
          >
            {active}/{total} users
          </span>
        )}

        <div
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          style={{
            width: "100%",
            height: "20px",
            background: "#E7DDD4",
            borderRadius: "999px",
            overflow: "hidden",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width:
  total > 0 && active > 0
    ? `${(active / total) * 100}%`
    : "6px",
              height: "100%",
              background:
                "linear-gradient(90deg, #7B5E57, #A78A7F)",
              borderRadius: "999px",
              transition: "width 0.5s ease",
            }}
          />
        </div>
      </div>

      <div className={styles.engagementStats}>
        <div className={styles.statBox}>
          <h4>{active}</h4>
          <p>Active</p>
        </div>

        <div className={styles.statBox}>
          <h4>{total - active}</h4>
          <p>Inactive</p>
        </div>
      </div>

    </div>
  </div>



        </div>
      </div>
    </div>

    {/* Right Panel */}
<div className={styles.rightPanel}>

  <h2 className={styles.rightTitle}>
    AI Insights
  </h2>

  <div className={styles.insightsContainer}>

    <div className={styles.insightBox}>
      <div className={styles.icon}>⚡</div>

      <div className={styles.insightText}>
        <p>Avg Generation</p>
        <h4>7.2 sec</h4>
      </div>
    </div>

    <div className={styles.insightBox}>
      <div className={styles.icon}>👗</div>

      <div className={styles.insightText}>
        <p>Top Category</p>
        <h4>Topwear</h4>
      </div>
    </div>

    

  </div>

  {/* Platform Status */}

  <div className={styles.statusSection}>

    <h2 className={styles.rightTitle}>
      Platform Status
    </h2>

    <div className={styles.statusCard}>
      <span>🟢 AI Server</span>
      <strong>Online</strong>
    </div>

    <div className={styles.statusCard}>
      <span>🟢 MongoDB</span>
      <strong>Connected</strong>
    </div>

    <div className={styles.statusCard}>
      <span>🟢 API</span>
      <strong>Healthy</strong>
    </div>

  </div>

</div>
  </div>
);
}