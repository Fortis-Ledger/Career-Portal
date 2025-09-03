import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Use service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id

    // Verify job exists
    const { data: existingJob, error: checkError } = await supabaseAdmin
      .from('jobs')
      .select('id, title')
      .eq('id', jobId)
      .single()

    if (checkError || !existingJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    // Delete the job using service role (bypasses RLS)
    const { error: deleteError } = await supabaseAdmin
      .from('jobs')
      .delete()
      .eq('id', jobId)

    if (deleteError) {
      console.error('Delete error:', deleteError)
      return NextResponse.json(
        { error: `Failed to delete job: ${deleteError.message}` },
        { status: 500 }
      )
    }

    // Verify deletion
    const { data: verifyDelete } = await supabaseAdmin
      .from('jobs')
      .select('id')
      .eq('id', jobId)

    if (verifyDelete && verifyDelete.length > 0) {
      return NextResponse.json(
        { error: 'Job still exists after deletion attempt' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Job deleted successfully' 
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
