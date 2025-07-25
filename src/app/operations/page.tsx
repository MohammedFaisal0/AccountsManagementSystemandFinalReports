"use client";
import { useState } from "react";
import { getFinancialData } from "./localDb/index";
import Sidebar from '@/components/Sidebar';
import { chapterNames, sectionNames, itemNames, typeNames } from './dictionaries';

const FILTERS = [
  { label: "كل العمليات", value: "all" },
  { label: "الإيرادات والاستخدامات", value: "revenues" },
  { label: "الحسابات المالية", value: "accounts" },
];

export default function OperationsPage() {
  const { operations, accounts } = getFinancialData();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // تصفية العمليات حسب الفلتر
  const filteredOps = operations.filter((op: any) => {
    if (filter === "revenues") return op.operation_type === "إيرادات واستخدامات";
    return true;
  }).filter((op: any) => {
    const q = search.trim();
    if (!q) return true;
    return (
      op.chapter_name?.includes(q) ||
      op.section_name?.includes(q) ||
      op.item_name?.includes(q) ||
      op.type_name?.includes(q) ||
      op.username?.includes(q) ||
      String(op.amount).includes(q)
    );
  });

  const filteredAccounts = accounts.filter((acc: any) => {
    // اعرض فقط إذا كان الدائن أو المدين أكبر من صفر
    return (acc.debit || 0) > 0 || (acc.credit || 0) > 0;
  }).filter((acc: any) => {
    const q = search.trim();
    if (!q) return true;
    return (
      acc.account_name?.includes(q) ||
      acc.username?.includes(q) ||
      String(acc.debit).includes(q) ||
      String(acc.credit).includes(q)
    );
  });

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50 font-cairo">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-8">
            <div className="bg-gradient-to-b from-blue-700 via-blue-800 to-blue-900 px-6 py-5 border-b border-blue-900/10">
              <h1 className="text-2xl font-bold text-white text-center">إدارة عمليات الترحيل</h1>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="flex gap-2">
                  {FILTERS.map((f) => (
                    <button
                      key={f.value}
                      className={`px-4 py-2 rounded-lg font-semibold border transition-all duration-200 text-base ${
                        filter === f.value
                          ? "bg-blue-700 text-white border-blue-700 shadow"
                          : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"
                      }`}
                      onClick={() => setFilter(f.value)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="ابحث بين العمليات أو الحسابات..."
                  className="p-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 w-full md:w-80 text-right font-cairo"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              {/* جدول العمليات */}
              {(filter === 'all' || filter === 'revenues') && (
                <div className="w-full mb-10">
                  <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm pb-2">
                    <h2 className="text-lg font-bold text-blue-900 mb-3">عمليات الإيرادات والاستخدامات</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-[1800px] w-full text-sm text-right font-cairo text-gray-900">
                      <thead className="bg-gradient-to-b from-blue-700 via-blue-800 to-blue-900 text-white font-cairo">
                        <tr>
                          <th className="py-3 px-6 min-w-[80px]">#</th>
                          <th className="py-3 px-6 min-w-[300px]"> الباب</th>
                          <th className="py-3 px-6 min-w-[180px]"> الفصل</th>
                          <th className="py-3 px-6 min-w-[180px]"> النوع</th>
                          <th className="py-3 px-6 min-w-[120px]">المبلغ</th>
                          <th className="py-3 px-6 min-w-[150px]"> المكتب</th>
                          <th className="py-3 px-6 min-w-[150px]"> المديرية</th>
                          <th className="py-3 px-6 min-w-[250px]">التاريخ</th>
                          <th className="py-3 px-6 min-w-[150px]"> المستخدم</th>
                          <th className="py-3 px-6 min-w-[120px]">نوع العملية</th>
                        </tr>
                      </thead>
                      <tbody className="font-cairo text-gray-900">
                        {filteredOps.length === 0 ? (
                          <tr>
                            <td colSpan={11} className="py-8 text-center text-gray-400">لا توجد عمليات مطابقة</td>
                          </tr>
                        ) : (
                          filteredOps.map((op: any, idx: number) => (
                            <tr key={op.id} className="hover:bg-blue-50 transition-all">
                              <td className="py-2 px-4">{idx + 1}</td>
                              <td className="py-2 px-4">{chapterNames[op.chapter_id] || op.chapter_id}</td>
                              <td className="py-2 px-4">{sectionNames[op.section_id] || op.section_id}</td>
                              <td className="py-2 px-4">{typeNames[op.type_id] || op.type_id}</td>
                              <td className="py-2 px-4">{op.amount}</td>
                              <td className="py-2 px-4">{op.office_name}</td>
                              <td className="py-2 px-4">{op.directorate_name}</td>
                              <td className="py-2 px-4">{op.date}</td>
                              <td className="py-2 px-4">{op.username}</td>
                              <td className="py-2 px-4">{op.operation_type}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {/* جدول الحسابات */}
              {(filter === 'all' || filter === 'accounts') && (
                <div className="w-full mb-10">
                  <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm pb-2">
                    <h2 className="text-lg font-bold text-blue-900 mb-3">عمليات الحسابات المالية</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-[1200px] w-full text-sm text-right font-cairo text-gray-900">
                      <thead className="bg-gradient-to-b from-blue-700 via-blue-800 to-blue-900 text-white font-cairo">
                        <tr>
                          <th className="py-3 px-4">#</th>
                          <th className="py-3 px-4"> الحساب</th>
                          <th className="py-3 px-4">مدين</th>
                          <th className="py-3 px-4">دائن</th>
                          <th className="py-3 px-4"> المكتب</th>
                          <th className="py-3 px-4"> المديرية</th>
                          <th className="py-3 px-4">التاريخ</th>
                          <th className="py-3 px-4"> المستخدم</th>
                          <th className="py-3 px-4">نوع العملية</th>
                        </tr>
                      </thead>
                      <tbody className="font-cairo text-gray-900">
                        {filteredAccounts.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="py-8 text-center text-gray-400">لا توجد حسابات مطابقة</td>
                          </tr>
                        ) : (
                          filteredAccounts.map((acc: any, idx: number) => (
                            <tr key={acc.id} className="hover:bg-blue-50 transition-all">
                              <td className="py-2 px-4">{idx + 1}</td>
                              <td className="py-2 px-4">{acc.account_name}</td>
                              <td className="py-2 px-4">{acc.debit}</td>
                              <td className="py-2 px-4">{acc.credit}</td>
                              <td className="py-2 px-4">{acc.office_name}</td>
                              <td className="py-2 px-4">{acc.directorate_name}</td>
                              <td className="py-2 px-4">{acc.date}</td>
                              <td className="py-2 px-4">{acc.username}</td>
                              <td className="py-2 px-4">{acc.operation_type}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 