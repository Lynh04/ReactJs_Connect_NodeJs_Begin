import React from "react";

export default function UserListHeader({ children }) {
  return (

    <div className="flex flex-row items-center justify-between mb-8">
      {/* Cụm Tiêu đề và Mô tả */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-[#1a2b3b]">
          Danh Sách Người Dùng
        </h2>
        <p className="text-sm text-muted-foreground">
          Quản lý thông tin thành viên hệ thống
        </p>
      </div>

      {/* Actions */}
      {children}
    </div>
  );
}
