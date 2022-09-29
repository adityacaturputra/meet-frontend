/* eslint-disable react/jsx-boolean-value */
import { Icon } from "@iconify/react";
import { Button } from "@mantine/core";
import { useCallback } from "react";

function Pagination({ page, totalPage, setPage, inSharing }) {
  const pageIndication = `${page + 1}/${totalPage}`;
  const toPreviousPage = useCallback(() => {
    if (page > 0) {
      setPage(page - 1);
    }
  }, [page, setPage]);
  const toNextPage = useCallback(() => {
    if (page < totalPage - 1) {
      setPage(page + 1);
    }
  }, [page, totalPage, setPage]);
  return (
    <div className="">
      <Button
        key="left"
        className="previous-page-button"
        icon={<Icon icon="ant-design:caret-left-filled" />}
        onClick={toPreviousPage}
      >
        {pageIndication}
      </Button>
      <Button
        key="right"
        className="next-page-button"
        icon={<Icon icon="ant-design:caret-right-filled" />}
        onClick={toNextPage}
      >
        {pageIndication}
      </Button>
    </div>
  );
}

export default Pagination;
