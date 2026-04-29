import { createClient } from '@supabase/supabase-js';

// URL ini harus bersih, cuma sampai '.co' saja!
const supabaseUrl = 'https://ioeeaabjofvhfdacjoku.supabase.co'; 

// Pastiin Key-nya diawali 'eyJ...' dan jangan ada spasi di ujungnya
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZWVhYWJqb2Z2aGZkYWNqb2t1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4MjIyNzEsImV4cCI6MjA5MjM5ODI3MX0.xSBakyF_8v09MRAfC1TjwL_BYipzHPAHgdALhb5_dwo'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);