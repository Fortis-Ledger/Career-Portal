import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Test database connection
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("*")
      .limit(5)
    
    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        code: error.code 
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      profiles,
      count: profiles?.length || 0
    })
    
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId, email, fullName } = await request.json()
    const supabase = await createClient()
    
    // Test profile creation/update
    const { data, error } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        email: email,
        full_name: fullName,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      })
    
    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        code: error.code 
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      data,
      message: "Profile test successful"
    })
    
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}
