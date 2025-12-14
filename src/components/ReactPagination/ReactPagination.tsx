import ReactPaginate from "react-paginate";
import css from "../App/App.module.css";

interface PaginationProps {
  pageCount: number;          
  forcePage: number;   
  onPageChange: (page: number) => void; 
}



export default function ReactPagination({ pageCount, forcePage, onPageChange }: PaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <ReactPaginate
      pageCount={pageCount}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      onPageChange={({ selected }) => onPageChange(selected + 1)}
      forcePage={forcePage - 1}
      containerClassName={css.pagination}
      activeClassName={css.active}
      nextLabel="→"
      previousLabel="←"
    />
  );
}

