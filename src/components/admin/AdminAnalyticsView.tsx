import React from 'react';
import { BarChart3 } from 'lucide-react';

export const AdminAnalyticsView: React.FC = () => (
  <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
    <div className="border-b border-neutral-200/80 pb-4">
      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
        Municipal Performance Metrics
      </span>
      <h1 className="text-2xl font-bold text-neutral-900 tracking-tight mt-0.5">
        Operations Analytics
      </h1>
      <p className="text-xs text-neutral-500 mt-1">
        Analytics will be available when operational records have been collected.
      </p>
    </div>
    <div className="bg-white border border-neutral-200/90 rounded-2xl p-8 text-center">
      <BarChart3 className="w-8 h-8 mx-auto text-neutral-400" />
      <p className="text-sm font-semibold text-neutral-700 mt-3">No analytics data available</p>
      <p className="text-xs text-neutral-500 mt-1">There are no records for the selected reporting period.</p>
    </div>
  </div>
);
