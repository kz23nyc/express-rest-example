export const filterMiddleware = (data) => (req, res, next) => {
    const queryKeys = Object.keys(req.query);
    let filteredData = data;
  
    queryKeys.forEach((key) => {
      filteredData = filteredData.filter(
        (item) => item[key] === parseInt(req.query[key]) || item[key] === req.query[key]
      );
    });
  
    res.json(filteredData);
  };
  