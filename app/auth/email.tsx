export function isValidUBEmail(email: string): boolean {
    return email.toLowerCase().endsWith('@buffalo.edu');
  }
  
  export function validateEmailDomain(email: string): { valid: boolean; error?: string } {
    if (!email) {
      return { valid: false, error: 'Email is required' };
    }
    
    if (!isValidUBEmail(email)) {
      return { valid: false, error: 'Only buffalo emails are allowed' };
    }
    
    return { valid: true };
  }