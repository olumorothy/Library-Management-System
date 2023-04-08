const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: books } = data;
  const currentPage = page ? +page : 1;
  const totalPages = Math.ceil(totalItems / limit);
  return {
    totalItems,
    books,
    currentPage,
    totalPages,
  };
};
const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? (page - 1) * limit : 0;
  return {
    limit,
    offset,
  };
};

const getDueDate = () => {
  const now = new Date();
  return new Date(now.setDate(now.getDate() + 30));
};

module.exports = { getPagination, getPagingData, getDueDate };
