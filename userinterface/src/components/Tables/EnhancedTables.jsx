import React, { useState, useEffect, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  Search,
  RefreshCw,
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import SimpleModal from "../Modal/SimpleModal";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";



// Confirmation Dialog component
const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative z-50 bg-white dark:bg-boxdark rounded-lg shadow-lg w-full max-w-sm p-4">
        <h2 className="text-lg font-semibold mb-2 dark:text-white">{title}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-strokedark rounded-md hover:bg-gray-100 dark:hover:bg-meta-4 dark:text-white"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const EnhancedTable = ({
  tableName,
  fetchData,
  createData,
  updateData,
  deleteData,
  columns,
  FormComponent,
  formFields,
  defaultSort = { field: "id", direction: "asc" },
  itemsPerPageOptions = [10, 25, 50, 100],
  defaultItemsPerPage = 10,
  searchFields = [],
  onRowClick,
  refreshInterval = 0,
  formLayout,
  disablePop,
  initialData,
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState(defaultSort);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const { user, afterLogout } = useAuth();
  const navigate = useNavigate();

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const location = useLocation();

  // Fetch data with automatic refresh
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await fetchData();
        setData(result);
        setError(null);
      } catch (err) {
        if (err.message === "Unauthorized") {
          afterLogout();
          navigate(`/login?next=${location.pathname}`);
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();

    if (refreshInterval > 0) {
      const interval = setInterval(loadData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, refreshInterval]);

  // CRUD Operations
  const handleCreate = async (formData) => {
    try {
      console.log("HandleCreate", formData);
      setLoading(true);
      await createData(formData);
      await fetchData();

      // const result = await fetchData();
      // setData((prevData) => {
      //   return [...prevData, result];
      // });

      setIsCreateModalOpen(false);
    } catch (err) {
      if (err.message === "Unauthorized") {
        afterLogout();
        navigate(`/login?next=${location.pathname}`);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (formData) => {
    try {
      setLoading(true);
      await updateData(currentItem.id, formData);
      await fetchData();
      setIsEditModalOpen(false);
      setCurrentItem(null);
    } catch (err) {
      if (err.message === "Unauthorized") {
        afterLogout();
        navigate(`/login?next=${location.pathname}`);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteData(currentItem.id);
      await fetchData();
      setIsDeleteDialogOpen(false);
      setCurrentItem(null);
    } catch (err) {
      if (err.message === "Unauthorized") {
        afterLogout();
        navigate(`/login?next=${location.pathname}`);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => { };

  // Existing table logic...
  const filteredAndSortedData = useMemo(() => {
    let processed = [...data];

    if (searchTerm && searchFields.length > 0) {
      const lowercasedSearch = searchTerm.toLowerCase();
      processed = processed.filter((item) =>
        searchFields.some((field) =>
          String(item[field])?.toLowerCase().includes(lowercasedSearch)
        )
      );
    }

    if (sortConfig.field) {
      processed.sort((a, b) => {
        const aValue = a[sortConfig.field];
        const bValue = b[sortConfig.field];
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return processed;
  }, [data, searchTerm, sortConfig, searchFields]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/10 text-red-500 dark:text-red-400 rounded-sm border border-stroke dark:border-strokedark">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      {/* Table Controls */}
      <div className="mb-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            Create New
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-stroke rounded bg-transparent dark:border-strokedark dark:bg-boxdark dark:text-white focus:border-primary dark:focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="border border-stroke rounded px-3 py-2 bg-transparent dark:border-strokedark dark:bg-boxdark dark:text-white focus:border-primary dark:focus:border-primary"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                Show {option}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => fetchData()}
          className="p-2 hover:bg-gray-100 dark:hover:bg-meta-4 rounded-full"
        >
          <RefreshCw className="w-5 h-5 dark:text-white" />
        </button>
      </div>

      {/* Table */}
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 dark:bg-meta-4">
              <th className="min-w-[40px] py-4 px-4 font-medium text-black dark:text-white text-left">
                <input
                  type="checkbox"
                  className="rounded border-stroke dark:border-strokedark"
                  onChange={handleSelectAll}
                  checked={selectedRows.size === paginatedData.length}
                />
              </th>
              {columns.map(({ key, header }) => (
                <th
                  key={key}
                  className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white text-left cursor-pointer"
                  onClick={() => handleSort(key)}
                >
                  <div className="flex items-center gap-1">
                    <span>{header}</span>
                    {sortConfig.field === key &&
                      (sortConfig.direction === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </div>
                </th>
              ))}
              <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-2 dark:hover:bg-meta-4">
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <input
                    type="checkbox"
                    className="rounded border-stroke dark:border-strokedark"
                    checked={selectedRows.has(row.id)}
                    onChange={() => handleSelectRow(row.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
                {columns.map(({ key, render }) => (
                  <td
                    key={key}
                    className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"
                    onClick={() => onRowClick?.(row)}
                  >
                    {render ? render(row[key], row) : row[key]}
                  </td>
                ))}
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentItem(row);
                        setIsEditModalOpen(true);
                      }}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-meta-4 rounded-full"
                    >
                      <Pencil className="w-4 h-4 dark:text-white" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentItem(row);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-meta-4 rounded-full"
                    >
                      <Trash2 className="w-4 h-4 dark:text-white" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 mb-6 flex flex-wrap gap-3 items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)}{" "}
          of {filteredAndSortedData.length} entries
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            className="px-3 py-1 border border-stroke dark:border-strokedark rounded disabled:opacity-50 dark:text-white hover:bg-gray-100 dark:hover:bg-meta-4"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (page) =>
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
            )
            .map((page, i, array) => (
              <React.Fragment key={page}>
                {i > 0 && array[i - 1] !== page - 1 && (
                  <span className="px-2 dark:text-white">...</span>
                )}
                <button
                  className={`px-3 py-1 rounded border border-stroke dark:border-strokedark ${currentPage === page
                    ? "bg-primary text-white"
                    : "dark:text-white hover:bg-gray-100 dark:hover:bg-meta-4"
                    }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              </React.Fragment>
            ))}
          <button
            className="px-3 py-1 border border-stroke dark:border-strokedark rounded disabled:opacity-50 dark:text-white hover:bg-gray-100 dark:hover:bg-meta-4"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Create Modal */}
      <SimpleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Entry"
      >
        <FormComponent
          fields={formFields}
          initialData={initialData}
          onSubmit={handleCreate}
          onCancel={() => setIsCreateModalOpen(false)}
          matrixLayout={formLayout}
        />
      </SimpleModal>

      {/* Edit Modal */}
      {
        disablePop && currentItem ? navigate(`/admin/tables/chatbots/${currentItem.id}/edit`) : <SimpleModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Entry"
        >
          <FormComponent
            fields={formFields}
            initialData={currentItem}
            onSubmit={handleEdit}
            onCancel={() => setIsEditModalOpen(false)}
            matrixLayout={formLayout}
          />
        </SimpleModal>
      }


      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Are you sure?"
        message="This action cannot be undone. This will permanently delete this entry."
      />
    </div>
  );
};

export default EnhancedTable;
