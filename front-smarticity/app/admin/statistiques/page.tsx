'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { stats } from "@/lib/mock/stats";
import { categories, statusData } from "@/lib/mock/graph-data";
import { signalementTrends } from "@/lib/mock/line-data";

import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend,
  BarChart,
  Bar
} from "recharts";

export default function StatsPage() {
  return (
    <div style={{ marginLeft: 250 }} className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Statistiques SmartCity
        </h1>
        <p className="text-sm text-slate-500">
          Aperçu des signalements et performances du système
        </p>
      </div>

      {/* Linear chart en haut */}
      <Card className="border">
        <CardHeader>
          <CardTitle>Évolution des signalements (7 derniers jours)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={signalementTrends}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="aTraiter" stroke="#f97316" strokeWidth={2} />
                <Line type="monotone" dataKey="enCours" stroke="#facc15" strokeWidth={2} />
                <Line type="monotone" dataKey="resolus" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item) => (
          <Card key={item.label} className="border">
            <CardHeader>
              <CardTitle className="text-sm text-slate-500">{item.label}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className={`text-2xl font-bold text-${item.color}-600`}>
                {item.value}
              </span>
              <span className="text-sm text-slate-400">{item.delta}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Graphiques barres */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Signalements par catégorie */}
        <Card className="border">
          <CardHeader>
            <CardTitle>Signalements par catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-58">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categories}>
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* État des signalements */}
        <Card className="border">
          <CardHeader>
            <CardTitle>État des signalements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-58">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
