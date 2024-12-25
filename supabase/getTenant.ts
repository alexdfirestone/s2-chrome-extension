import { SupabaseClient } from "@supabase/supabase-js";

export async function getTenantID(supabase: SupabaseClient) {
    try {
        const { data, error } = await supabase
            .from('tenants')
            .select('id') // Assuming 'id' is the column for tenant ID
            .single(); // Fetch a single record
        
        if (error) {
            console.error('Error fetching tenant ID:', error);
            throw new Error(`Error fetching tenant ID: ${error.message}`);
        }
        
        return data.id;
    } catch (err) {
        console.error('Unexpected error:', err);
        throw new Error('An unexpected error occurred while fetching the tenant ID.');
    }
}