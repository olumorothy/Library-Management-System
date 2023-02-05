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
  const limit = size ? +size : 3;
  const offset = page ? (page - 1) * limit : 0;
  return {
    limit,
    offset,
  };
};

module.exports = { getPagination, getPagingData };
