import React from "react";
import { abbreviateNumber } from "js-abbreviation-number";

interface StatCardProps {
  icon: React.ReactElement;
  label: string;
  value: number;
}
export default function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="group relative flex flex-col justify-between px-4 pt-5 pb-3 bg-white dark:bg-dark_bg dark:border rounded-md shadow-lg hover:shadow-xl">
      <span className="text-4xl size-16 grid place-items-center rotate-12 transition-transform group-hover:-rotate-12 p-3 bg-violet-200 rounded-full">
        {icon}
      </span>
      <div className="flex flex-col">
        <span className="text-lg font-roboto font-semibold text-zinc-600 dark:text-slate-400">
          {label}
        </span>
        <span className="font-bold md:text-5xl text-3xl font-poppins text-black dark:text-white">
          {abbreviateNumber(value, 1)}
        </span>
      </div>
    </div>
  );
}