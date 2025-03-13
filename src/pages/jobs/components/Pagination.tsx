import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  // Create an array of page numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // Always include page 1
    pageNumbers.push(1);
    
    // Add pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pageNumbers.push(i);
    }
    
    // Always include last page if there are more than 1 pages
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center items-center p-4 border-t">
      <nav className="flex items-center space-x-1">
        {/* Previous button */}
        <button 
          className={`px-2 py-1 rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        
        {/* Page numbers */}
        {pageNumbers.map((number, index) => {
          // If there's a gap, insert ellipsis
          if (index > 0 && number - pageNumbers[index - 1] > 1) {
            return (
              <React.Fragment key={`ellipsis-${index}`}>
                <span className="px-2 py-1 text-gray-500">...</span>
                <button
                  onClick={() => onPageChange(number)}
                  className={`px-3 py-1 rounded ${currentPage === number ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  {number}
                </button>
              </React.Fragment>
            );
          }
          
          return (
            <button
              key={number}
              onClick={() => onPageChange(number)}
              className={`px-3 py-1 rounded ${currentPage === number ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              {number}
            </button>
          );
        })}
        
        {/* Next button */}
        <button 
          className={`px-2 py-1 rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </nav>
    </div>
  );
};

export default Pagination;