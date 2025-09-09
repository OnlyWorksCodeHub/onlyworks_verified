import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Only allow this in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Migration endpoint disabled in production' }, { status: 403 })
    }

    const supabase = createClient()

    // Check if user_reports table already exists
    const { data: existingTable, error: checkError } = await supabase
      .from('user_reports')
      .select('*')
      .limit(1)

    if (!checkError) {
      return NextResponse.json({ 
        success: true, 
        message: 'user_reports table already exists',
        tableExists: true
      })
    }

    // Create the user_reports table and functions
    const migrationSQL = `
      -- User reports table for time-based aggregated reports
      CREATE TABLE user_reports (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID REFERENCES auth.users NOT NULL,
        
        -- Report metadata
        report_type TEXT NOT NULL CHECK (report_type IN ('hourly', 'daily', 'weekly')),
        period_start TIMESTAMP NOT NULL,
        period_end TIMESTAMP NOT NULL,
        generated_at TIMESTAMP DEFAULT NOW(),
        
        -- Company/project info
        company_name TEXT,
        
        -- Aggregated metrics
        total_sessions INTEGER DEFAULT 0,
        total_duration INTEGER DEFAULT 0, -- in seconds
        total_screenshots INTEGER DEFAULT 0,
        total_analyses INTEGER DEFAULT 0,
        
        -- Average scores
        avg_productivity_score DECIMAL(5,2),
        avg_focus_score DECIMAL(5,2),
        avg_authenticity_score DECIMAL(5,2),
        avg_efficiency_score DECIMAL(5,2),
        
        -- Activity breakdown
        activity_breakdown JSONB DEFAULT '{}', -- {coding: 300, writing: 150, etc}
        applications_used JSONB DEFAULT '[]', -- frequency count
        ai_tools_used JSONB DEFAULT '[]', -- tools and usage counts
        
        -- Peak hours analysis
        peak_productivity_hours JSONB DEFAULT '[]', -- [14, 15, 16] for 2-4pm
        productivity_by_hour JSONB DEFAULT '{}', -- {9: 85, 10: 92, etc}
        
        -- Work summary
        accomplishments TEXT[],
        work_narrative TEXT,
        key_insights TEXT[],
        
        -- Report files
        report_file_path TEXT, -- storage path for generated report file
        verification_code TEXT UNIQUE,
        is_public BOOLEAN DEFAULT FALSE,
        
        -- Constraints
        UNIQUE(user_id, report_type, period_start)
      );

      -- Enable RLS
      ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;

      -- RLS policies
      CREATE POLICY "Users can manage own reports" ON user_reports
        FOR ALL USING (auth.uid() = user_id);

      CREATE POLICY "Public can view public reports" ON user_reports
        FOR SELECT USING (is_public = true);

      -- Indexes for performance
      CREATE INDEX idx_user_reports_user_type ON user_reports(user_id, report_type);
      CREATE INDEX idx_user_reports_period ON user_reports(period_start, period_end);
      CREATE INDEX idx_user_reports_verification ON user_reports(verification_code);
    `

    // Execute the migration (this approach works with Supabase-js)
    const { error: migrationError } = await supabase.rpc('exec_sql', { 
      sql_query: migrationSQL 
    })

    if (migrationError) {
      console.error('Migration error:', migrationError)
      
      // Alternative approach: create table directly if rpc doesn't work
      console.log('Trying alternative migration approach...')
      
      // Try to create the basic table structure
      const { error: createError } = await supabase.from('user_reports').insert({
        user_id: '00000000-0000-0000-0000-000000000000', // dummy data to trigger table creation
        report_type: 'daily',
        period_start: new Date().toISOString(),
        period_end: new Date().toISOString()
      })
      
      // Delete the dummy data
      if (!createError) {
        await supabase.from('user_reports').delete().eq('user_id', '00000000-0000-0000-0000-000000000000')
      }

      return NextResponse.json({ 
        error: 'Migration failed', 
        details: migrationError.message,
        suggestion: 'Please run the migration manually in Supabase SQL editor'
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Migration completed successfully' 
    })

  } catch (error: any) {
    console.error('Migration endpoint error:', error)
    return NextResponse.json({ 
      error: 'Migration failed',
      details: error.message,
      suggestion: 'Please run the SQL migration manually in Supabase dashboard'
    }, { status: 500 })
  }
}