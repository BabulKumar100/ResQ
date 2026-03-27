import { neon } from '@neondatabase/serverless'

let sqlInstance: any = null

export const getSql = () => {
  if (!sqlInstance) {
    const databaseUrl = process.env.DATABASE_URL
    
    if (!databaseUrl) {
      console.warn('DATABASE_URL environment variable not configured')
      return null
    }
    
    sqlInstance = neon(databaseUrl)
  }
  return sqlInstance
}

export const sql = async (strings: TemplateStringsArray, ...values: any[]) => {
  const sqlClient = getSql()
  if (!sqlClient) {
    throw new Error('Database client not initialized')
  }
  
  return sqlClient(strings, ...values)
}
