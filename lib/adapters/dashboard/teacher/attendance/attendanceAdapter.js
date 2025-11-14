export function attendanceAdapter(apiData) {
  // apiData = { attendances: [...] }
  return (apiData.attendances || []).map(item => ({
    id: item.id,
    studentName: item.student.fullName,
    status: item.status,
    date: item.date,
  }));
}
