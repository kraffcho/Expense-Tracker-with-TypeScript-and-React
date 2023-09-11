import React from "react";

enum SortKey {
  NAME = "name",
  PRICE = "price",
  DATE = "date",
}

enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

interface SortOptionsProps {
  sortKey: SortKey;
  sortOrder: SortOrder;
  setSortKey: React.Dispatch<React.SetStateAction<SortKey>>;
  setSortOrder: React.Dispatch<React.SetStateAction<SortOrder>>;
}

const SortOptions: React.FC<SortOptionsProps> = ({
  sortKey,
  sortOrder,
  setSortKey,
  setSortOrder,
}) => {
  return (
    <div className="sort-order">
      <select
        title="Sort"
        className="minimal"
        onChange={(e) => setSortKey(e.target.value as SortKey)}
        value={sortKey}
      >
        <option value={SortKey.NAME}>Sort by Name</option>
        <option value={SortKey.PRICE}>Sort by Price</option>
        <option value={SortKey.DATE}>Sort by Date</option>
      </select>
      <select
        title="Order"
        className="minimal"
        onChange={(e) => setSortOrder(e.target.value as SortOrder)}
        value={sortOrder}
      >
        <option value={SortOrder.ASC}>Ascending</option>
        <option value={SortOrder.DESC}>Descending</option>
      </select>
    </div>
  );
};

export default SortOptions;