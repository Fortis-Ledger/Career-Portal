import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Test basic database connection
    const { data: testData, error: testError } = await supabase
      .from("profiles")
      .select("id")
      .limit(1)
    
    if (testError) {
      return NextResponse.json({ 
        success: false, 
        error: testError.message,
        code: testError.code,
        details: testError.details,
        hint: testError.hint
      }, { status: 500 })
    }
    
    // Test table structure
    let columns = null
    try {
      const { data: columnsData, error: columnsError } = await supabase
        .rpc('get_table_columns', { table_name: 'profiles' })
      columns = columnsData
    } catch (rpcError) {
      columns = "RPC function not available"
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Database connection successful",
      profilesTable: {
        accessible: true,
        testQuery: "OK",
        columns: columns || "RPC not available"
      }
    })
    
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
