import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const students = await db.collection('students').find({}).toArray();

    return new Response(JSON.stringify(students), { status: 200 });
  } catch (error) {
    return new Response('Failed to fetch students', { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { db } = await connectToDatabase();
    const newStudent = await request.json();

    const result = await db.collection('students').insertOne(newStudent);

    return new Response(JSON.stringify({ _id: result.insertedId, ...newStudent }), {
      status: 201,
    });
  } catch (error) {
    return new Response('Failed to add student', { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { db } = await connectToDatabase();
    const { id, ...updateFields } = await request.json();

    const { ObjectId } = await import('mongodb');
    const _id = new ObjectId(id);

    const result = await db.collection('students').updateOne({ _id }, { $set: updateFields });

    if (result.modifiedCount === 1) {
      return new Response('Student updated', { status: 200 });
    } else {
      return new Response('No student updated', { status: 404 });
    }
  } catch (error) {
    return new Response('Failed to update student', { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { db } = await connectToDatabase();
    const { id } = await request.json();

    const { ObjectId } = await import('mongodb');
    const _id = new ObjectId(id);

    const result = await db.collection('students').deleteOne({ _id });

    if (result.deletedCount === 1) {
      return new Response('Student deleted', { status: 200 });
    } else {
      return new Response('No student deleted', { status: 404 });
    }
  } catch (error) {
    return new Response('Failed to delete student', { status: 500 });
  }
}
