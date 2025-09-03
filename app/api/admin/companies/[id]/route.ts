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
    const companyId = params.id

    // Verify company exists
    const { data: existingCompany, error: checkError } = await supabaseAdmin
      .from('companies')
      .select('id, name')
      .eq('id', companyId)
      .single()

    if (checkError || !existingCompany) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    // Check if company has active jobs
    const { data: activeJobs, error: jobsError } = await supabaseAdmin
      .from('jobs')
      .select('id')
      .eq('company_id', companyId)
      .eq('is_active', true)

    if (jobsError) {
      console.error('Error checking jobs:', jobsError)
      return NextResponse.json(
        { error: 'Failed to check company jobs' },
        { status: 500 }
      )
    }

    if (activeJobs && activeJobs.length > 0) {
      return NextResponse.json(
        { error: `Cannot delete company with ${activeJobs.length} active jobs. Please deactivate or delete all jobs first.` },
        { status: 400 }
      )
    }

    // Delete the company using service role (bypasses RLS)
    const { error: deleteError } = await supabaseAdmin
      .from('companies')
      .delete()
      .eq('id', companyId)

    if (deleteError) {
      console.error('Delete error:', deleteError)
      return NextResponse.json(
        { error: `Failed to delete company: ${deleteError.message}` },
        { status: 500 }
      )
    }

    // Verify deletion
    const { data: verifyDelete } = await supabaseAdmin
      .from('companies')
      .select('id')
      .eq('id', companyId)

    if (verifyDelete && verifyDelete.length > 0) {
      return NextResponse.json(
        { error: 'Company still exists after deletion attempt' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Company deleted successfully' 
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
