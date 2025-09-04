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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id
    const body = await request.json()

    // Verify job exists
    const { data: existingJob, error: checkError } = await supabaseAdmin
      .from('jobs')
      .select('id')
      .eq('id', jobId)
      .single()

    if (checkError || !existingJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    // Update the job using service role (bypasses RLS)
    const { data, error: updateError } = await supabaseAdmin
      .from('jobs')
      .update({
        title: body.title,
        description: body.description,
        company_id: body.company_id,
        employment_type: body.employment_type,
        experience_level: body.experience_level,
        location: body.location,
        salary_min: body.salary_min,
        salary_max: body.salary_max,
        is_remote: body.is_remote,
        is_active: body.is_active,
        is_featured: body.is_featured,
        updated_at: new Date().toISOString(),
      })
      .eq('id', jobId)
      .select()

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json(
        { error: `Failed to update job: ${updateError.message}` },
        { status: 500 }
      )
    }

    // Handle skills separately through job_skills junction table
    if (body.skill_ids && Array.isArray(body.skill_ids)) {
      // First, delete existing job skills
      const { error: deleteSkillsError } = await supabaseAdmin
        .from('job_skills')
        .delete()
        .eq('job_id', jobId)

      if (deleteSkillsError) {
        console.error('Error deleting existing skills:', deleteSkillsError)
      }

      // Then, insert new job skills
      if (body.skill_ids.length > 0) {
        const jobSkillsData = body.skill_ids.map((skillId: string) => ({
          job_id: jobId,
          skill_id: skillId,
          is_required: true
        }))

        const { error: insertSkillsError } = await supabaseAdmin
          .from('job_skills')
          .insert(jobSkillsData)

        if (insertSkillsError) {
          console.error('Error inserting new skills:', insertSkillsError)
          return NextResponse.json(
            { error: `Failed to update job skills: ${insertSkillsError.message}` },
            { status: 500 }
          )
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Job updated successfully',
      data: data?.[0]
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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
