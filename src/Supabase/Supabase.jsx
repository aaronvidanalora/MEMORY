import { createClient } from '@supabase/supabase-js';


const supabaseUrl = 'https://osgnoorkeviayghmuhwl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zZ25vb3JrZXZpYXlnaG11aHdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMyODI1NTksImV4cCI6MjAyODg1ODU1OX0.UIhKvZcf1eCYB4gMn6zmOSW6Hd_xIgHpjDvHt07N8Pg'
export const supabase = createClient(supabaseUrl, supabaseKey)