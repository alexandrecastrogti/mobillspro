import React from 'react';

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-7 animate-pulse" aria-busy="true" aria-label="Carregando console executivo MobillsPro">
      
      {/* ZONE 1 SKELETON: Executive Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-white dark:bg-[#11141B] border border-slate-200 dark:border-[#1F232D] shadow-sm">
        <div className="grid grid-cols-4 sm:flex items-center gap-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-11 w-full sm:w-24 rounded-lg bg-slate-100 dark:bg-[#181C26]" />
          ))}
        </div>
        <div className="flex items-center gap-2 justify-between sm:justify-end">
          <div className="h-11 w-28 rounded-lg bg-slate-100 dark:bg-[#181C26] hidden md:block" />
          <div className="h-11 w-32 rounded-lg bg-slate-100 dark:bg-[#181C26] flex-1 sm:flex-none" />
          <div className="h-11 w-36 rounded-lg bg-emerald-50 dark:bg-[#1C2524] border border-emerald-200 dark:border-emerald-950/40 flex-1 sm:flex-none" />
        </div>
      </div>

      {/* ZONE 2 SKELETON: Master Solvency Unit (Hero + 3 Pillars) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Hero Card Skeleton (7 Columns) */}
        <div className="lg:col-span-7 p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#111318] border border-slate-200 dark:border-[#1F232D] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-[#1F232D]">
              <div className="h-4 w-52 rounded bg-slate-200 dark:bg-[#181C26]" />
              <div className="h-5 w-24 rounded bg-emerald-100 dark:bg-[#152320]" />
            </div>

            <div className="my-3.5 sm:my-4 space-y-2">
              <div className="h-12 w-56 sm:w-72 rounded-lg bg-slate-200 dark:bg-[#1A1F2B]" />
              <div className="h-3.5 w-full max-w-md rounded bg-slate-100 dark:bg-[#181C26]" />
              <div className="h-3.5 w-3/4 max-w-sm rounded bg-slate-100 dark:bg-[#181C26]" />
            </div>
          </div>

          <div className="space-y-3.5">
            {/* Waterfall strip skeleton */}
            <div className="pt-3.5 border-t border-slate-100 dark:border-[#1F232D] grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-1.5 sm:border-r border-slate-100 dark:border-[#1F232D] last:border-0 sm:pr-2">
                  <div className="h-2.5 w-16 rounded bg-slate-200 dark:bg-[#181C26]" />
                  <div className="h-5 w-24 rounded bg-slate-100 dark:bg-[#1A1F2B]" />
                </div>
              ))}
            </div>

            {/* Scenario Levers skeleton */}
            <div className="h-14 rounded-lg bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-[#1A1D26] p-2.5" />
          </div>
        </div>

        {/* 3 Pillars Skeleton (5 Columns) */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3.5 sm:p-4 min-h-[44px] rounded-xl bg-white dark:bg-[#15181F] border border-slate-200 dark:border-[#1F232D] shadow-sm flex items-center justify-between">
              <div className="space-y-1.5 w-3/4">
                <div className="h-2.5 w-28 rounded bg-slate-200 dark:bg-[#181C26]" />
                <div className="h-6 w-36 rounded bg-slate-100 dark:bg-[#1A1F2B]" />
                <div className="h-2.5 w-44 rounded bg-slate-200 dark:bg-[#181C26]" />
              </div>
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-[#141720]" />
            </div>
          ))}
        </div>

      </div>

      {/* ZONE 3 SKELETON: Bilateral Settlement & 3 Credit Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 p-4 sm:p-5 rounded-xl bg-white dark:bg-[#15181F] border border-slate-200 dark:border-[#1F232D] shadow-sm space-y-3">
          <div className="h-4 w-40 rounded bg-slate-200 dark:bg-[#181C26]" />
          <div className="h-8 w-44 rounded bg-emerald-50 dark:bg-[#162521]" />
          <div className="h-3 w-full rounded bg-slate-100 dark:bg-[#181C26]" />
          <div className="pt-3 border-t border-slate-100 dark:border-[#1F232D] flex justify-between">
            <div className="h-9 w-28 rounded bg-slate-100 dark:bg-[#181C26]" />
            <div className="h-9 w-28 rounded bg-slate-100 dark:bg-[#181C26]" />
          </div>
        </div>

        <div className="lg:col-span-7 p-4 sm:p-5 rounded-xl bg-white dark:bg-[#15181F] border border-slate-200 dark:border-[#1F232D] shadow-sm space-y-3">
          <div className="h-4 w-48 rounded bg-slate-200 dark:bg-[#181C26]" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 rounded-lg bg-slate-50 dark:bg-[#10131B] border border-slate-200 dark:border-[#1F232D] space-y-2 h-24">
                <div className="h-3 w-20 rounded bg-slate-200 dark:bg-[#181C26]" />
                <div className="h-5 w-24 rounded bg-slate-100 dark:bg-[#1A1F2B]" />
                <div className="h-2.5 w-16 rounded bg-slate-200 dark:bg-[#181C26]" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ZONE 4 SKELETON: Charts & Benchmark */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="p-5 rounded-xl bg-white dark:bg-[#111318] border border-slate-200 dark:border-[#1F232D] shadow-sm h-64" />
        <div className="p-5 rounded-xl bg-white dark:bg-[#111318] border border-slate-200 dark:border-[#1F232D] shadow-sm h-64" />
      </div>

    </div>
  );
}

