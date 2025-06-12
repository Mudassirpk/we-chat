import mongoose from 'mongoose'

export async function connect_database(): Promise<void> {
  const mongo_uri = process.env.MONGO_URI
  if (!mongo_uri) {
    throw new Error('Mongo Uri not provided')
  }
  try {
    await mongoose.connect(mongo_uri, {
      dbName: 'notes'
    })
    console.log('Database connected')
  } catch (error) {
    console.log('Failed to connect database: ', error)
  }
}
