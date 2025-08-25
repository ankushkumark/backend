export const getWeeklyStats = (req, res) => {
  const data = [
    { date: "Mon", value: 120 },
    { date: "Tue", value: 200 },
    { date: "Wed", value: 150 },
    { date: "Thu", value: 180 },
    { date: "Fri", value: 250 },
    { date: "Sat", value: 300 },
    { date: "Sun", value: 220 },
  ];
  res.json(data);
};

export const getMonthlyStats = (req, res) => {
  const data = [
    { date: "May 01", thisMonth: 4000, lastMonth: 2400 },
    { date: "May 05", thisMonth: 3200, lastMonth: 2800 },
    { date: "May 10", thisMonth: 2800, lastMonth: 3000 },
    { date: "May 15", thisMonth: 3600, lastMonth: 2600 },
    { date: "May 20", thisMonth: 3900, lastMonth: 2700 },
    { date: "May 25", thisMonth: 3700, lastMonth: 2500 },
    { date: "May 30", thisMonth: 4200, lastMonth: 2600 },
  ];
  res.json(data);
};
