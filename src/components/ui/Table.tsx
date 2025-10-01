import React, { useState, useMemo } from 'react';
import { ComponentData, TableProps } from '../../types';
import { ChevronUp, ChevronDown, Search, Filter, Download, RefreshCw } from 'lucide-react';

interface TableComponentProps {
  component: ComponentData;
  isPreview?: boolean;
}

export const Table: React.FC<TableComponentProps> = ({ component, isPreview = false }) => {
  const props = component.props as TableProps;
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string | null>(props.sorting.defaultSort || null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(props.sorting.defaultOrder || 'asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const baseStyle = {
    width: '100%',
    height: '100%',
    ...component.style,
  };

  // Sample data if no data provided
  const sampleData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', salary: 75000, joinDate: '2023-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active', salary: 65000, joinDate: '2023-02-20' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor', status: 'Inactive', salary: 70000, joinDate: '2023-03-10' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Manager', status: 'Active', salary: 85000, joinDate: '2023-01-05' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Developer', status: 'Active', salary: 80000, joinDate: '2023-04-12' },
  ];

  const data = props.data && props.data.length > 0 ? props.data : sampleData;

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!props.pagination.enabled) return sortedData;
    
    const startIndex = (currentPage - 1) * props.pagination.pageSize;
    return sortedData.slice(startIndex, startIndex + props.pagination.pageSize);
  }, [sortedData, currentPage, props.pagination]);

  const totalPages = Math.ceil(sortedData.length / props.pagination.pageSize);

  const handleSort = (columnKey: string) => {
    if (!props.sorting.enabled) return;
    
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const handleRowSelect = (index: number) => {
    if (props.selection.mode === 'none') return;
    
    const newSelected = new Set(selectedRows);
    
    if (props.selection.mode === 'single') {
      newSelected.clear();
      newSelected.add(index);
    } else {
      if (newSelected.has(index)) {
        newSelected.delete(index);
      } else {
        newSelected.add(index);
      }
    }
    
    setSelectedRows(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(paginatedData.map((_, i) => i)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const exportData = () => {
    const csv = [
      visibleColumns.map(col => col.name).join(','),
      ...sortedData.map(row => 
        visibleColumns.map(col => String(row[col.key] || '')).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'table-data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const visibleColumns = props.columns.filter(col => col.visible);

  if (!props.visible) return null;

  return (
    <div style={baseStyle} className={`flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden ${props.compact ? 'text-sm' : ''}`}>
      {/* Table Header with Search and Controls */}
      {(props.filtering.enabled || props.pagination.enabled) && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {props.filtering.enabled && (
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={props.filtering.searchPlaceholder || "Search..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}
              
              {selectedRows.size > 0 && (
                <div className="text-sm text-blue-600">
                  {selectedRows.size} row{selectedRows.size > 1 ? 's' : ''} selected
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={exportData}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                title="Export data"
              >
                <Download className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                title="Refresh data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              
              {props.pagination.enabled && (
                <div className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * props.pagination.pageSize) + 1} to{' '}
                  {Math.min(currentPage * props.pagination.pageSize, sortedData.length)} of{' '}
                  {sortedData.length} entries
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Table Content */}
      <div className="flex-1 overflow-auto">
        <table className={`w-full ${props.striped ? 'table-striped' : ''}`}>
          <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
            <tr>
              {props.selection.mode !== 'none' && (
                <th className="w-12 px-4 py-3 text-left">
                  {props.selection.mode === 'multiple' && props.selection.showSelectAll && (
                    <input
                      type="checkbox"
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  )}
                </th>
              )}
              
              {visibleColumns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable && props.sorting.enabled ? 'cursor-pointer hover:bg-gray-100' : ''
                  } ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'}`}
                  onClick={() => column.sortable && handleSort(column.key)}
                  style={{ 
                    width: column.width ? `${column.width}px` : 'auto',
                    minWidth: column.minWidth ? `${column.minWidth}px` : 'auto',
                    maxWidth: column.maxWidth ? `${column.maxWidth}px` : 'auto'
                  }}
                >
                  <div className="flex items-center gap-1">
                    {column.name}
                    {column.sortable && props.sorting.enabled && sortColumn === column.key && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="w-3 h-3" /> : 
                        <ChevronDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
              ))}
              
              {props.rowActions.length > 0 && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          
          <tbody className={`bg-white divide-y divide-gray-200 ${props.hoverable ? 'hover:bg-gray-50' : ''}`}>
            {paginatedData.map((row, index) => (
              <tr
                key={index}
                className={`
                  ${props.striped && index % 2 === 1 ? 'bg-gray-50' : ''}
                  ${props.hoverable ? 'hover:bg-gray-100' : ''}
                  ${selectedRows.has(index) ? 'bg-blue-50' : ''}
                  ${props.bordered ? 'border' : ''}
                  transition-colors duration-150
                `}
              >
                {props.selection.mode !== 'none' && (
                  <td className="px-4 py-3">
                    <input
                      type={props.selection.mode === 'single' ? 'radio' : 'checkbox'}
                      name={props.selection.mode === 'single' ? 'table-selection' : undefined}
                      checked={selectedRows.has(index)}
                      onChange={() => handleRowSelect(index)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                )}
                
                {visibleColumns.map((column) => (
                  <td 
                    key={column.key} 
                    className={`px-4 py-3 text-sm ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'}`}
                    style={{ color: column.color }}
                  >
                    {column.type === 'boolean' ? (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        row[column.key] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {row[column.key] ? 'Yes' : 'No'}
                      </span>
                    ) : column.type === 'badge' ? (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        row[column.key] === 'Active' ? 'bg-green-100 text-green-800' :
                        row[column.key] === 'Inactive' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {row[column.key]}
                      </span>
                    ) : column.type === 'progress' ? (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, Math.max(0, row[column.key] || 0))}%` }}
                        ></div>
                      </div>
                    ) : column.type === 'image' ? (
                      <img src={row[column.key]} alt="" className="w-8 h-8 rounded object-cover" />
                    ) : column.type === 'link' ? (
                      <a href={row[column.key]} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                        {row[column.key]}
                      </a>
                    ) : column.type === 'date' ? (
                      new Date(row[column.key]).toLocaleDateString()
                    ) : column.type === 'number' ? (
                      typeof row[column.key] === 'number' ? row[column.key].toLocaleString() : row[column.key]
                    ) : (
                      String(row[column.key] || '-')
                    )}
                  </td>
                ))}
                
                {props.rowActions.length > 0 && (
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {props.rowActions.map((action, actionIndex) => (
                        <button
                          key={actionIndex}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                          onClick={() => {
                            // Handle row action
                            console.log('Row action:', action, row);
                          }}
                        >
                          {action.type}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        
        {paginatedData.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-lg mb-2">No data available</div>
            <div className="text-sm">
              {searchTerm ? 'No results match your search criteria' : 'No data to display'}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {props.pagination.enabled && totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                  let page;
                  if (totalPages <= 7) {
                    page = i + 1;
                  } else if (currentPage <= 4) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 3) {
                    page = totalPages - 6 + i;
                  } else {
                    page = currentPage - 3 + i;
                  }
                  
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                Next
              </button>
            </div>
            
            {props.pagination.showPageSizeOptions && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show:</span>
                <select
                  value={props.pagination.pageSize}
                  onChange={(e) => {
                    // Update page size - would need to be handled by parent component
                    console.log('Page size changed:', e.target.value);
                  }}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  {props.pagination.pageSizeOptions.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};