import React, { useEffect } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { SquarePen, Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";
import UserDialog from "@/components/UserDialog";
import Header from "@/components/Header";
import { getAllUsers, getUsers, createUser as apiCreateUser, updateUser as apiUpdateUser, deleteUser as apiDeleteUser } from "../../services/api/apiUsers.js";
import { Toaster, toast } from "react-hot-toast";

const UserTable = () => {
  const [users, setUsers] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState(null);
  const [isAddOpen, setIsAddOpen] = React.useState(false);

  // Fetch all users from API
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError("Không thể tải danh sách người dùng.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle add user (creation only)
  const handleAddUser = async (user) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiCreateUser(user);
      await fetchUsers();
      setIsAddOpen(false);
      toast.success("Đã thêm mới người dùng thành công");
    } catch (err) {
      setError("Thêm người dùng thất bại.");
      toast.error("Thêm người dùng thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit user
  const handleEditClick = (user) => {
    setEditingUser(user);
    setIsEditOpen(true);
  };

  const handleUpdateUser = async (updated) => {
    if (!editingUser) return;
    setIsLoading(true);
    setError(null);
    try {
      await apiUpdateUser(editingUser._id, updated);
      await fetchUsers();
      setIsEditOpen(false);
      toast.success("Cập nhật người dùng thành công");
    } catch (err) {
      setError("Cập nhật người dùng thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete user
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    setIsLoading(true);
    setError(null);
    try {
      await apiDeleteUser(selectedUser._id);
      await fetchUsers();
      setIsConfirmOpen(false);
      setSelectedUser(null);
      toast.success("Xóa người dùng thành công");
    } catch (err) {
      setError("Xóa người dùng thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseEdit = (open) => {
    setIsEditOpen(open);
    if (!open) {
      setTimeout(() => setEditingUser(null), 200); // clear after animation
    }
  };

  return (
    <>
      <Toaster
        position="bottom-center"
        reverseOrder={false}
      />
      <Header>
        {/* Add User Dialog Triggered inside Header */}
        <UserDialog
          open={isAddOpen}
          onOpenChange={setIsAddOpen}
          handleOnSubmit={handleAddUser}
          title="Thêm người dùng mới"
          submitText="Thêm mới"
          cancelText="Hủy bỏ"
        />
      </Header>

      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa"
        description="Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác."
      />

      {/* Loading and error states */}
      {isLoading && (
        <div className="p-4 text-center text-gray-500">Đang tải dữ liệu...</div>
      )}
      {error && (
        <div className="p-4 text-center text-red-500">{error}</div>
      )}

      {/* Edit User Dialog */}
      <UserDialog
        open={isEditOpen}
        onOpenChange={handleCloseEdit}
        initialData={editingUser ?? { name: "", email: "", age: "" }}
        handleOnSubmit={handleUpdateUser}
        title="Cập nhật thông tin"
        submitText="Cập nhật"
        cancelText="Hủy bỏ"
        trigger={<div className="hidden"></div>}
      />

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                Thông tin
              </TableHead>
              <TableHead className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                Tuổi
              </TableHead>
              <TableHead className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                Ngày tạo
              </TableHead>
              <TableHead className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">
                Hành động
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow
                key={u._id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <TableCell className="py-4 px-6">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">
                      {u.name}
                    </span>
                    <span className="text-gray-500 text-xs">{u.email}</span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-gray-600">
                  {u.age}
                </TableCell>
                <TableCell className="px-6 py-4 text-gray-400 text-xs font-mono">
                  {new Date(u.createdAt).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell className="text-right">
                  <button
                    className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-all mr-1"
                    onClick={() => handleEditClick(u)}
                  >
                    <SquarePen size={20} />
                  </button>
                  <button
                    className="text-red-600 hover:opacity-70 transition-opacity p-2"
                    onClick={() => handleDeleteClick(u)}
                  >
                    <Trash2 size={20} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
export default UserTable;
