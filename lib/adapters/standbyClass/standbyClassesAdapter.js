export const standbyClassesAdapter = ( apiData ) => {
    return apiData.map((cls) => ({
        id: cls.id,
        name: cls.name,
        section: cls.section,
        year: cls.year,
        createdAt: cls.createdAt,
        updatedAt: cls.updatedAt,
        students: cls.students.map((student) => ({
            id: student.id,
            userId: student.userId,
            fullName: student.fullName,
            studentId: student.studentId,
            gender: student.gender,
            standbyClassId: student.standbyClassId,
            createdAt: student.createdAt,
            updatedAt: student.updatedAt,
        }))
    }))
}