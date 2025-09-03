import { createClient } from "./client"

export async function testSupabaseConnection() {
  try {
    console.log("Testing Supabase connection...")
    
    // Check environment variables
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    console.log("Supabase URL:", url ? "✓ Set" : "✗ Missing")
    console.log("Supabase Key:", key ? "✓ Set" : "✗ Missing")
    
    if (!url || !key) {
      throw new Error("Missing Supabase environment variables")
    }
    
    // Test client creation
    const supabase = createClient()
    console.log("Supabase client:", supabase ? "✓ Created" : "✗ Failed")
    
    // Test basic connection
    const { data, error } = await supabase.from("profiles").select("count").limit(1)
    
    if (error) {
      console.error("Connection test failed:", error)
      return { success: false, error: error.message }
    }
    
    console.log("Connection test: ✓ Success")
    return { success: true, data }
    
  } catch (error) {
    console.error("Supabase test error:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }
  }
}
