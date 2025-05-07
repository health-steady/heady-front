import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // 한 번에 표시할 최대 페이지 버튼 수
  const maxPageButtons = 5;

  if (totalPages <= 1) return null;

  // 페이지 번호 범위 계산
  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  // 시작 페이지가 조정된 경우, 종료 페이지도 다시 계산
  if (endPage - startPage + 1 < maxPageButtons && endPage < totalPages) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }

  // 페이지 번호 배열 생성
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center items-center p-2 bg-gray-50 border-t border-gray-200">
      <div className="flex items-center">
        {/* 첫 페이지 버튼 */}
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={`px-1.5 py-1 text-xs rounded ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          aria-label="처음 페이지"
          title="처음 페이지"
        >
          {"<<"}
        </button>

        {/* 이전 페이지 버튼 */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-1.5 py-1 mx-1 text-xs rounded ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          aria-label="이전 페이지"
          title="이전 페이지"
        >
          {"<"}
        </button>

        {/* 페이지 번호 버튼 */}
        <div className="flex mx-1 space-x-1">
          {pageNumbers.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`w-7 h-7 flex items-center justify-center text-xs rounded font-medium ${
                currentPage === page
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* 다음 페이지 버튼 */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-1.5 py-1 mx-1 text-xs rounded ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          aria-label="다음 페이지"
          title="다음 페이지"
        >
          {">"}
        </button>

        {/* 마지막 페이지 버튼 */}
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`px-1.5 py-1 text-xs rounded ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          aria-label="마지막 페이지"
          title="마지막 페이지"
        >
          {">>"}
        </button>
      </div>
    </div>
  );
};

export default Pagination;
