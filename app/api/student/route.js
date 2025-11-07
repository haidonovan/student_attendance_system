import { prisma } from '../../../lib/prisma'

// GET all students
export async function GET() {
  try {
    const students = await prisma.student.findMany({
      include: {
        user: true,
        class: true
      }
    })
    return new Response(JSON.stringify(students), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}

// POST create single or multiple students
export async function POST(req) {
  try {
    const body = await req.json()
    const studentsArray = Array.isArray(body) ? body : [body]

    const createdStudents = []

    for (const s of studentsArray) {
      const { userId, fullName, birthDate, studentId, gender, address, classId } = s

      if (!userId || !fullName || !birthDate || !studentId || !gender) {
        return new Response(JSON.stringify({ error: 'Missing required fields for each student' }), { status: 400 })
      }

      const student = await prisma.student.create({
        data: {
          userId,
          fullName,
          birthDate: new Date(birthDate),
          studentId,
          gender,
          address,
          classId
        },
        include: {
          user: true,
          class: true
        }
      })

      createdStudents.push(student)
    }

    return new Response(JSON.stringify(createdStudents), { status: 201 })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}

// PUT update a student by ID
export async function PUT(req) {
  try {
    const body = await req.json()
    const { id, ...updateFields } = body

    if (!id) {
      return new Response(JSON.stringify({ error: 'Student ID is required' }), { status: 400 })
    }

    const student = await prisma.student.update({
      where: { id },
      data: {
        ...updateFields,
        birthDate: updateFields.birthDate ? new Date(updateFields.birthDate) : undefined
      },
      include: {
        user: true,
        class: true
      }
    })

    return new Response(JSON.stringify(student), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}

// DELETE a student by ID
export async function DELETE(req) {
  try {
    const body = await req.json()
    const { id } = body

    if (!id) {
      return new Response(JSON.stringify({ error: 'Student ID is required' }), { status: 400 })
    }

    await prisma.student.delete({
      where: { id }
    })

    return new Response(JSON.stringify({ message: 'Student deleted successfully' }), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}

































































// import { connectToDatabase } from '@/lib/mongodb';

// export async function GET() {
//   try {
//     const { db } = await connectToDatabase();
//     const students = await db.collection('students').find({}).toArray();

//     return new Response(JSON.stringify(students), { status: 200 });
//   } catch (error) {
//     return new Response('Failed to fetch students', { status: 500 });
//   }
// }

// export async function POST(request) {
//   try {
//     const { db } = await connectToDatabase();
//     const newStudent = await request.json();

//     const result = await db.collection('students').insertOne(newStudent);

//     return new Response(JSON.stringify({ _id: result.insertedId, ...newStudent }), {
//       status: 201,
//     });
//   } catch (error) {
//     return new Response('Failed to add student', { status: 500 });
//   }
// }

// export async function PUT(request) {
//   try {
//     const { db } = await connectToDatabase();
//     const { id, ...updateFields } = await request.json();

//     const { ObjectId } = await import('mongodb');
//     const _id = new ObjectId(id);

//     const result = await db.collection('students').updateOne({ _id }, { $set: updateFields });

//     if (result.modifiedCount === 1) {
//       return new Response('Student updated', { status: 200 });
//     } else {
//       return new Response('No student updated', { status: 404 });
//     }
//   } catch (error) {
//     return new Response('Failed to update student', { status: 500 });
//   }
// }

// export async function DELETE(request) {
//   try {
//     const { db } = await connectToDatabase();
//     const { id } = await request.json();

//     const { ObjectId } = await import('mongodb');
//     const _id = new ObjectId(id);

//     const result = await db.collection('students').deleteOne({ _id });

//     if (result.deletedCount === 1) {
//       return new Response('Student deleted', { status: 200 });
//     } else {
//       return new Response('No student deleted', { status: 404 });
//     }
//   } catch (error) {
//     return new Response('Failed to delete student', { status: 500 });
//   }
// }



